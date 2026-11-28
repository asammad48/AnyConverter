const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const out = path.resolve(__dirname, '../evidence');
const base = 'http://localhost:3000';
const result = { errors: [], console: [], failedRequests: [], externalWrites: [], formats: {}, locales: {}, samples: {} };
const frames = [0, 7, 15, 30, 45, 90, 134, 135, 173, 258, 300, 374, 375, 479, 480, 599];

async function open(browser, locale = 'en', trace = false) {
  const context = await browser.newContext({ viewport: { width: 1540, height: 1120 }, acceptDownloads: true });
  if (trace) await context.tracing.start({ screenshots: false, snapshots: false });
  const page = await context.newPage();
  page.on('pageerror', error => result.errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') result.console.push(msg.text()); });
  page.on('dialog', async dialog => { result.errors.push(dialog.message()); await dialog.dismiss(); });
  page.on('requestfailed', request => result.failedRequests.push([request.url(), request.failure()?.errorText]));
  page.on('request', request => {
    if (!request.url().startsWith(base) && !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
      result.externalWrites.push(request.url());
    }
  });
  await page.goto(base + (locale === 'en' ? '' : '/' + locale) + '/creative-studio/');
  await page.locator('#cs-motion-editor > summary').click();
  await page.waitForFunction(() => window.StudioFonts.loaded('display'));
  return [page, context];
}

async function seek(page, frame) {
  const range = page.locator('#cs-timeline-scrubber');
  await range.evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, frame);
  assert.match(await page.locator('#cs-frame-display').textContent(), new RegExp('^Frame ' + frame + ' /'));
}

async function capture(page, name) {
  const png = await page.locator('#cs-canvas').evaluate(canvas => canvas.toDataURL().split(',')[1]);
  await fs.writeFile(path.join(out, name + '.png'), Buffer.from(png, 'base64'));
  return png;
}

async function download(page, id, filename) {
  console.log(filename);
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 170000 }), page.locator('#cs-btn-' + id).click()]);
  await file.saveAs(path.join(out, filename));
}

async function selectReel(page) {
  await page.locator('#cs-direction-select').selectOption('motion-showreel');
  await page.evaluate(() => StudioPuppet.prepare());
  assert.equal(await page.locator('#cs-timeline-scrubber').getAttribute('max'), '599');
}

async function recover(browser, authored, exportVideo = true) {
  const [fresh, freshContext] = await open(browser);
  await fresh.locator('#cs-file-input').setInputFiles(path.join(out, 'showreel.acstudio'));
  await fresh.waitForFunction(() => document.querySelector('#cs-timeline-scrubber').max === '599');
  await seek(fresh, 35);
  assert.equal(await capture(fresh, 'reopened-frame35'), authored);
  await fresh.locator('#cs-motion-layer').selectOption('entry-csv');
  const options = await fresh.locator('#cs-motion-track option').allTextContents();
  await fresh.locator('#cs-motion-track').selectOption(String(options.length - 1));
  await fresh.locator('#cs-motion-ease').selectOption('hold');
  assert.notEqual(await capture(fresh, 'edited-frame35'), authored);
  if (exportVideo) await download(fresh, 'export-video', 'reopened-edited.webm');
  await download(fresh, 'save-project', 'reopened-edited.acstudio');
  await freshContext.close();
}

async function main() {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PHASE04_CHROME || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-breakpad']
  });
  result.browser = browser.version();
  if (process.argv.includes('--edited-archive')) {
    try {
      const authored = (await fs.readFile(path.join(out, 'after-phase04.png'))).toString('base64');
      await recover(browser, authored, false);
    } finally {
      await browser.close();
    }
    return;
  }
  try {
    const [page, context] = await open(browser, 'en', true);
    await seek(page, 15);
    await capture(page, 'before-phase01');
    await selectReel(page);
    await page.locator('#cs-timeline-scrubber').press('End');
    assert.match(await page.locator('#cs-frame-display').textContent(), /^Frame 599 \/ 600/);
    await capture(page, 'last-before-playback');
    await seek(page, 0);
    const motion = id => page.locator('#cs-motion-' + id);
    await motion('preset').selectOption('staggered-cards');
    await motion('duration').fill('19');
    await motion('duration').press('Tab');
    for (const id of ['csv', 'json', 'pdf', 'yaml', 'sql']) {
      await motion('layer').selectOption('entry-' + id);
      await motion('apply').click();
    }
    await motion('layer').selectOption('entry-csv');
    await motion('preset').selectOption('underline-draw');
    await motion('start').fill('21');
    await motion('start').press('Tab');
    await motion('apply').click();
    await motion('key').selectOption('1');
    const range = motion('time');
    await range.scrollIntoViewIfNeeded();
    const rect = await range.boundingBox();
    await page.mouse.move(rect.x + rect.width * .31, rect.y + rect.height / 2);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width * .38, rect.y + rect.height / 2, { steps: 8 });
    await page.mouse.up();
    result.draggedFrame = Number(await range.inputValue());
    assert.notEqual(result.draggedFrame, 40);
    await motion('key').selectOption('0');
    await motion('ease').selectOption('linear');
    await seek(page, 35);
    const prior = await capture(page, 'linear-frame35');
    await motion('ease').selectOption('easeOutExpo');
    assert.notEqual(await capture(page, 'expo-frame35'), prior);
    await motion('debug').check();
    await page.screenshot({ path: path.join(out, 'motion-editor.png') });
    await page.locator('#cs-canvas').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, 'editor-stage.png') });
    const authored = await capture(page, 'after-phase04');
    await motion('reduced').check();
    const reduced = await capture(page, 'reduced-preview');
    assert.notEqual(reduced, authored);
    await motion('reduced').uncheck();
    await page.locator('#cs-shot-select').selectOption('1');
    await page.locator('#cs-shot-subhead').fill('A courier left one envelope with no return address.');
    await page.locator('#cs-shot-select').selectOption('2');
    await motion('start').fill('27');
    await motion('start').press('Tab');
    await motion('duration').fill('41');
    await motion('duration').press('Tab');
    await motion('action').selectOption('shocked');
    await motion('apply-action').click();
    await seek(page, 300);
    assert.match(await page.locator('#cs-motion-editor output').textContent(), /shock/);
    assert.equal(await page.locator('#cs-motion-caption-track button').count(), 5);
    assert.equal(await page.locator('#cs-motion-audio-track button').count(), 4);
    for (const frame of [90, 7, 45, 0, 30, 15, ...frames.slice(6)]) {
      await motion('reduced').uncheck();
      await seek(page, frame);
      await capture(page, 'preview-' + frame);
      result.samples[frame] = frame / 30;
    }
    for (const frame of [169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
      292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309]) {
      await seek(page, frame);
      await capture(page, 'pose-' + frame);
    }
    await download(page, 'export-video', 'showreel.webm');
    await motion('reduced').check();
    await download(page, 'export-video', 'showreel-repeat-reduced-preview.webm');
    await download(page, 'save-project', 'showreel.acstudio');
    await context.tracing.stop({ path: path.join(out, 'browser-trace.zip') });
    await context.close();

    await recover(browser, authored);

    for (const locale of ['en', 'es', 'da']) {
      const [localized, localizedContext] = await open(browser, locale);
      await selectReel(localized);
      await localized.locator('#cs-layout-editor summary').click();
      result.formats[locale] = {};
      result.locales[locale] = await localized.locator('#cs-motion-editor > summary').textContent();
      for (const format of ['1280x720', '1080x1920', '1080x1080']) {
        await localized.locator('#cs-layout-format').selectOption(format);
        await seek(localized, 300);
        result.formats[locale][format] = await localized.locator('#cs-canvas').evaluate(canvas => [canvas.width, canvas.height]);
        await capture(localized, 'format-' + locale + '-' + format);
      }
      await localizedContext.close();
    }
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.externalWrites, []);
  } finally {
    await fs.writeFile(path.join(out, 'browser-results.json'), JSON.stringify(result, null, 2));
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
