const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const evidence = path.resolve(__dirname, '../after');
const base = 'http://127.0.0.1:4173';
const errors = [];
const externalWrites = [];
const consoleErrors = [];
const failedRequests = [];
const localeText = {
  en: 'Keep the conversation moving. Give everyone a clear next step.',
  es: 'Mantén la conversación en marcha y asegúrate de que todo el equipo entienda con claridad cuál es el siguiente paso.',
  da: 'Hold samtalen i gang, og sørg for, at alle deltagere har en tydelig forståelse af det næste skridt og deres ansvar.'
};

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1500, height: 1050 }, acceptDownloads: true });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await attach(context);
    await load(page);
    await page.locator('#cs-timeline-scrubber').focus();
    await page.locator('#cs-timeline-scrubber').press('ArrowRight');
    await page.locator('#cs-timeline-scrubber').press('PageUp');
    await download(page, '#cs-btn-export-png', 'baseline.png');
    await page.locator('#cs-shot-select').selectOption('0');
    const preset = page.locator('#cs-layout-preset');
    const format = page.locator('#cs-layout-format');
    const guides = page.locator('#cs-layout-guides');
    const canvas = page.locator('#cs-canvas');
    for (const name of ['hero', 'comparison', 'statistic']) {
      await preset.selectOption(name);
      if (name === 'comparison') {
        await page.locator('#cs-shot-headline').fill('From scattered records to one clear view');
        await page.locator('#cs-shot-subhead').fill('Compare the same entries before and after organizing them.');
      }
      if (name === 'statistic') {
        await page.locator('#cs-shot-headline').fill('5 files. One clean report.');
        await page.locator('#cs-shot-subhead').fill('Combine the five source files into one report you can share.');
      }
      await download(page, '#cs-btn-export-png', name + '.png');
    }
    const storyLayouts = [
      ['character-comedy', 'dialogue', [
        ['dialogue', 'I am the new manager.', 'First rule: no more meetings.'],
        ['character-right', 'Leave the calendar alone.', 'Give everyone ten minutes back.'],
        ['reaction', 'A meeting about meetings?', 'That was already on the calendar.'],
        ['punchline', 'Meeting canceled.', 'The calendar is finally quiet.']
      ]],
      ['minimal-suspense', 'silhouette', [
        ['silhouette', 'The last light', 'The corridor should be empty.'],
        ['reveal', 'The switch clicks', 'Nobody is near it.'],
        ['silhouette', 'Something moved', 'The shadow crossed before the figure.'],
        ['punchline', 'Leave the light on.', 'Something is still there.']
      ]],
      ['cinematic-saas', 'product', [
        ['hero', 'The raw files arrive.', 'Start with five separate reports.'],
        ['comparison', 'Find the common fields.', 'Spot the columns that describe the same thing.'],
        ['product', 'Organize the records.', 'Put the most important fields first.'],
        ['statistic', '5 files. One clean report.', 'Bring five sources together in one place.'],
        ['punchline', 'A report ready to share.', 'Review the result before sending it.']
      ]]
    ];
    for (const [direction, name, shots] of storyLayouts) {
      if (await page.locator('#cs-direction-select').inputValue() !== direction) {
        await page.locator('#cs-direction-select').selectOption(direction);
      }
      for (const [index, [layout, headline, caption]] of shots.entries()) {
        await page.locator('#cs-shot-select').selectOption(String(index));
        await preset.selectOption(layout);
        await page.locator('#cs-shot-headline').fill(headline);
        await page.locator('#cs-shot-subhead').fill(caption);
        const durations = direction === 'cinematic-saas' ? [90, 105, 105, 95, 105] : [84, 84, 92, 90];
        await page.locator('#cs-shot-duration').fill(String(durations[index]));
      }
      await page.locator('#cs-shot-select').selectOption(name === 'product' ? '2' : '0');
      await format.selectOption('1280x720');
      await download(page, '#cs-btn-export-png', name + '-wide.png');
      await download(page, '#cs-btn-save-project', name + '-wide.acstudio');
      await download(page, '#cs-btn-export-video', name + '-wide.webm');
      await format.selectOption('1080x1920');
      await download(page, '#cs-btn-export-png', name + '-portrait.png');
    }

    await page.locator('#cs-direction-select').selectOption('character-comedy');
    await page.locator('#cs-shot-select').selectOption('0');
    await preset.selectOption('dialogue');
    await format.selectOption('1080x1920');
    await page.locator('#cs-shot-headline').fill('Let the room talk');
    await page.locator('#cs-shot-subhead').fill(localeText.en);
    await page.locator('#cs-layout-pose').selectOption('large');
    await page.locator('#cs-shot-duration').fill('125');
    await guides.check();
    await page.locator('#cs-layout-anchor').selectOption('bottom');
    assert.notEqual(await page.locator('#cs-layout-warnings').textContent(), '');
    await page.screenshot({ path: path.join(evidence, 'collision.png') });
    await page.locator('#cs-layout-anchor').selectOption('');
    const box = await canvas.boundingBox();
    assert.ok(box.width > 50 && box.height > 80, JSON.stringify(box));
    const before = await canvas.evaluate(node => node.toDataURL());
    for (const [role, x, y, dx, dy] of [['title', .32, .19, .02, .02], ['subject', .40, .48, -.03, .015], ['caption', .39, .74, .02, .024]]) {
      await page.mouse.move(box.x + box.width * x, box.y + box.height * y);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * (x + dx), box.y + box.height * (y + dy), { steps: 5 });
      await page.mouse.up();
      assert.equal(await page.locator('#cs-layout-block').inputValue(), role);
    }
    assert.notEqual(await canvas.evaluate(node => node.toDataURL()), before);
    await page.locator('#cs-layout-block').selectOption('subject');
    await page.locator('#cs-layout-depth').selectOption('foreground');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, 'portrait-guides.png') });
    await canvas.screenshot({ path: path.join(evidence, 'canvas-guides.png') });
    await download(page, '#cs-btn-export-png', 'guides-enabled-export.png');
    await guides.uncheck();
    await download(page, '#cs-btn-export-png', 'portrait-final.png');
    const previewData = await canvas.evaluate(node => node.toDataURL('image/png').split(',')[1]);
    await fs.writeFile(path.join(evidence, 'portrait-preview-full.png'), Buffer.from(previewData, 'base64'));
    assert.deepEqual(await fs.readFile(path.join(evidence, 'portrait-final.png')), Buffer.from(previewData, 'base64'));
    assert.deepEqual(await fs.readFile(path.join(evidence, 'guides-enabled-export.png')), await fs.readFile(path.join(evidence, 'portrait-final.png')));
    await canvas.screenshot({ path: path.join(evidence, 'portrait-preview.png') });
    await format.selectOption('1080x1080');
    await download(page, '#cs-btn-export-png', 'dialogue-square.png');
    await download(page, '#cs-btn-export-video', 'dialogue-square.webm');
    await format.selectOption('1920x1080');
    await download(page, '#cs-btn-export-png', 'dialogue-full-hd.png');
    await download(page, '#cs-btn-export-video', 'dialogue-full-hd.webm');
    await format.selectOption('1080x1920');
    await download(page, '#cs-btn-save-project', 'phase-02.acstudio');
    const archive = require('node:child_process').execFileSync('unzip', ['-p', path.join(evidence, 'phase-02.acstudio'), 'project.json'], { encoding: 'utf8' });
    const saved = JSON.parse(archive);
    assert.deepEqual(Object.keys(saved.shots[0].customData.layout.blocks).sort(), ['caption', 'subject', 'title']);
    await download(page, '#cs-btn-export-video', 'portrait-export.webm');
    await context.tracing.stop({ path: path.join(evidence, 'browser-trace.zip') });
    await context.close();

    const reopened = await browser.newContext({ viewport: { width: 1500, height: 1050 } });
    const recovered = await attach(reopened);
    await load(recovered);
    await recovered.locator('#cs-file-input').setInputFiles(path.join(evidence, 'phase-02.acstudio'));
    await recovered.locator('#cs-layout-preset').locator('option:checked').filter({ hasText: 'Dialogue' }).waitFor({ state: 'attached' });
    assert.equal(await recovered.locator('#cs-layout-format').inputValue(), '1080x1920');
    assert.equal(await recovered.locator('#cs-shot-subhead').inputValue(), localeText.en);
    await download(recovered, '#cs-btn-export-png', 'reopened.png');
    assert.deepEqual(await fs.readFile(path.join(evidence, 'reopened.png')), await fs.readFile(path.join(evidence, 'portrait-final.png')));
    await recovered.locator('#cs-shot-subhead').fill('First question: what should we change?');
    await download(recovered, '#cs-btn-export-video', 'edited-reexport.webm');
    await reopened.close();

    const legacy = await browser.newContext({ viewport: { width: 1500, height: 1050 } });
    const original = await attach(legacy);
    await load(original);
    await original.locator('#cs-file-input').setInputFiles(path.resolve(__dirname, '../../../phase-01/evidence/reordered_five_shot_project.acstudio'));
    await original.locator('#cs-shot-select option').filter({ hasText: /Shot 3.*(Benefit|Clarity)/ }).waitFor({ state: 'attached' });
    assert.equal(await original.locator('#cs-layout-preset').inputValue(), '');
    await download(original, '#cs-btn-export-png', 'phase-01-reopened.png');
    await legacy.close();

    for (const locale of ['en', 'es', 'da']) {
      const ctx = await browser.newContext({ viewport: { width: 1500, height: 1050 } });
      const localized = await attach(ctx);
      await load(localized, locale);
      await localized.locator('#cs-direction-select').selectOption('character-comedy');
      await localized.locator('#cs-layout-preset').selectOption('dialogue');
      await localized.locator('#cs-layout-format').selectOption('1080x1920');
      await localized.locator('#cs-layout-pose').selectOption('large');
      await localized.locator('#cs-shot-subhead').fill(localeText[locale]);
      assert.notEqual(await localized.locator('#cs-layout-warnings').textContent(), '');
      await localized.locator('#cs-shot-duration').fill('250');
      assert.equal(await localized.locator('#cs-layout-warnings').textContent(), '');
      const first = await localized.locator('#cs-canvas').evaluate(node => node.toDataURL());
      await localized.locator('#cs-layout-format').selectOption('1080x1080');
      await localized.locator('#cs-layout-format').selectOption('1080x1920');
      assert.equal(await localized.locator('#cs-canvas').evaluate(node => node.toDataURL()), first);
      await download(localized, '#cs-btn-export-png', 'text-' + locale + '.png');
      await ctx.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(externalWrites, []);
  } finally {
    await fs.writeFile(path.join(evidence, 'browser-results.json'), JSON.stringify({ errors, consoleErrors, externalWrites, failedRequests }, null, 2));
    await browser.close();
  }
}

async function attach(context) {
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('dialog', async dialog => {
    errors.push(dialog.message());
    await dialog.dismiss();
  });
  page.on('requestfailed', request => {
    const url = new URL(request.url());
    failedRequests.push({ host: url.host, path: url.pathname, error: request.failure()?.errorText });
  });
  page.on('request', request => {
    if (!request.url().startsWith(base) && !['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
      externalWrites.push({ method: request.method(), url: request.url() });
    }
  });
  return page;
}

async function load(page, locale = 'en') {
  await page.goto(base + (locale === 'en' ? '' : '/' + locale) + '/creative-studio/', { waitUntil: 'domcontentloaded' });
  await page.locator('#cs-layout-editor summary').click();
}

async function download(page, button, name) {
  console.log(name);
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 150000 }), page.locator(button).click()]);
  await file.saveAs(path.join(evidence, name));
  if (name.endsWith('.webm')) assert.match(file.suggestedFilename(), /\.webm$/);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
