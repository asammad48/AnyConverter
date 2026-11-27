const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const out = path.resolve(__dirname, '../evidence');
const base = 'http://localhost:3000';
const results = { pageErrors: [], consoleErrors: [], externalWrites: [], failedRequests: [], frames: {}, formats: {}, layoutWarnings: {}, externalHosts: [] };
const copy = {
  en: ['Turn scattered spreadsheets into clear reports your entire team can share today', 'Bring five sources together.\nReview the same records in one place.', 'Review your report'],
  es: ['Convierte hojas de cálculo dispersas en informes claros para todo tu equipo', 'Reúne cinco fuentes de información.\nRevisa los mismos registros con todo tu equipo.', 'Revisa tu informe'],
  da: ['Saml spredte regneark til overskuelige rapporter som hele holdet kan dele trygt', 'Saml oplysninger fra fem forskellige kilder.\nGennemgå de samme poster på ét sted sammen med dit hold.', 'Gennemgå rapporten']
};
const fun = [
  ['dialogue', 'The new manager', '“First rule: no more meetings.”', 'hero', 'tracking', 'caption', 'word'],
  ['character-right', 'An empty calendar', 'Monday looked clear.\n\nThen the invites arrived.', 'hook', 'line', 'subtitle', 'type'],
  ['reaction', 'A meeting about meetings?', '“That makes no sense.”', 'quote', 'rise', 'caption', 'highlight'],
  ['punchline', 'Meeting canceled.', 'The bird hits “decline all.”', 'punchline', 'emphasis', 'caption', 'underline']
];
const suspense = [
  ['silhouette', 'The last light', '“There’s nobody in the corridor.”', 'hero', 'suspense', 'whisper', 'line'],
  ['reveal', 'A switch clicks', 'The light stays on.\n\nNobody is near the switch.', 'hook', 'echo', 'body', 'rise'],
  ['silhouette', 'The shadow moved first', 'A note slips under the door.', 'note', 'type', 'subtitle', 'tracking'],
  ['punchline', 'Don’t turn around.', '“It’s already behind you.”', 'note', 'rise', 'whisper', 'suspense']
];
const product = [
  ['hero', null, null, 'hook', 'rise', 'body', 'line'],
  ['comparison', 'Find the common fields', 'Compare the same entries across the five source files.', 'hook', 'word', 'body', 'none'],
  ['product', 'One place to review', 'Put the important fields first.', 'quote', 'tracking', 'body', 'none'],
  ['statistic', '5', 'Source files in one report.', 'number', 'counter', 'subtitle', 'none'],
  ['punchline', 'Ready to share', 'Check your report before you send it.', 'hero', 'rise', 'caption', 'none']
];

async function open(browser, locale = 'en', url = base, trace = false) {
  const context = await browser.newContext({ viewport: { width: 1540, height: 1120 }, acceptDownloads: true });
  if (trace) await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();
  page.on('pageerror', error => results.pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') results.consoleErrors.push(message.text());
  });
  page.on('requestfailed', request => results.failedRequests.push([request.url(), request.failure()?.errorText]));
  page.on('request', request => {
    if (!request.url().startsWith(url) && request.url().startsWith('https:')) {
      const host = new URL(request.url()).hostname;
      if (!results.externalHosts.includes(host)) results.externalHosts.push(host);
    }
    if (!request.url().startsWith(url) && !['GET', 'HEAD'].includes(request.method())) {
      results.externalWrites.push([request.method(), new URL(request.url()).hostname, new URL(request.url()).pathname]);
    }
  });
  page.on('dialog', async dialog => {
    results.pageErrors.push(dialog.message());
    await dialog.dismiss();
  });
  await page.goto(url + (locale === 'en' ? '' : '/' + locale) + '/creative-studio/', { waitUntil: 'domcontentloaded' });
  await page.locator('#cs-layout-editor summary').click();
  if (url === base) {
    await page.locator('#cs-typography-editor summary').click();
    await page.waitForFunction(() => ['sans', 'serif', 'display'].every(font => window.StudioFonts.loaded(font)));
  }
  return page;
}

async function download(page, action, filename) {
  console.log(filename);
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 160000 }), page.locator('#cs-btn-' + action).click()]);
  await file.saveAs(path.join(out, filename));
}

async function video(page, name) {
  await download(page, 'export-video', name + '.webm');
}

async function seek(page, frame) {
  const scrubber = page.locator('#cs-timeline-scrubber');
  await scrubber.press('Home');
  for (let index = 0; index < frame; index++) await scrubber.press('ArrowRight');
}

async function frame(page, name, index) {
  const png = await page.locator('#cs-canvas').evaluate(canvas => canvas.toDataURL('image/png').split(',')[1]);
  await fs.writeFile(path.join(out, 'preview-' + name + '.png'), Buffer.from(png, 'base64'));
  results.frames[name] = index;
}

async function select(page, key, value) {
  await page.locator('#cs-type-' + key).selectOption(value);
}

async function input(page, key, value) {
  const field = page.locator('#cs-type-' + key);
  await field.fill(String(value));
  await field.press('Tab');
}

async function author(page, scenes, duration, first = copy.en, locale = 'en') {
  for (const [index, [preset, title, caption, role, effect, captionRole, captionEffect]] of scenes.entries()) {
    await page.locator('#cs-shot-select').selectOption(String(index));
    await page.locator('#cs-layout-preset').selectOption(preset);
    await page.locator('#cs-shot-duration').fill(String(Array.isArray(duration) ? duration[index] : duration));
    await page.locator('#cs-shot-headline').fill(title ?? first[0]);
    await page.locator('#cs-shot-subhead').fill(caption ?? first[1]);
    await select(page, 'track', 'title');
    await select(page, 'role', role);
    if (scenes === fun && index === 0) await select(page, 'family', 'display');
    await select(page, 'effect', effect);
    await input(page, 'length', effect === 'suspense' ? 72 : 30);
    await select(page, 'track', 'caption');
    await select(page, 'role', captionRole);
    await select(page, 'effect', captionEffect);
    if (scenes === fun && index === 0) await select(page, 'family', 'display');
    if (effect === 'suspense') await select(page, 'contrast', 'outline');
    if (effect === 'emphasis') {
      await select(page, 'track', 'title');
      await input(page, 'phrase', 'canceled');
      await select(page, 'spanStyle', 'bold');
    }
    if (captionEffect === 'highlight') {
      await input(page, 'phrase', 'no sense');
      await select(page, 'spanStyle', 'highlight');
    }
    if (index === 0 && title === null && first[2]) {
      await select(page, 'track', 'title');
      await select(page, 'family', 'serif');
      await input(page, 'lineHeight', 1.22);
      await input(page, 'tracking', .2);
      await select(page, 'track', 'caption');
      await input(page, 'lineHeight', locale === 'en' ? 1.18 : 1.08);
      if (locale !== 'en') await input(page, 'size', 34);
      await select(page, 'track', 'cta');
      await input(page, 'cta', first[2]);
      await select(page, 'effect', 'underline');
      await input(page, 'startFrame', 12);
      await input(page, 'length', 18);
    }
  }
  await page.locator('#cs-shot-select').selectOption('0');
}

async function recover(browser, file, caption, name) {
  const page = await open(browser);
  await page.locator('#cs-file-input').setInputFiles(path.join(out, file));
  await page.locator('#cs-shot-subhead').waitFor();
  await page.waitForFunction(() => window.studioApp.project.shots[0].customData.typography?.version === 1);
  await select(page, 'track', 'caption');
  const effect = await page.locator('#cs-type-effect').inputValue();
  await page.locator('#cs-shot-subhead').fill(caption);
  assert.equal(await page.locator('#cs-type-effect').inputValue(), effect);
  await video(page, name);
  await page.context().close();
  return effect;
}

async function main() {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const before = await open(browser, 'en', 'http://127.0.0.1:4173');
    await before.locator('#cs-layout-preset').selectOption('hero');
    await before.locator('#cs-shot-headline').fill(copy.en[0]);
    await before.locator('#cs-shot-subhead').fill(copy.en[1]);
    await seek(before, 30);
    await download(before, 'export-png', 'before-product.png');
    await before.context().close();

    const page = await open(browser, 'en', base, true);
    await page.locator('#cs-project-title').fill('Five files, one report');
    await author(page, product, [144, 76, 76, 77, 77]);
    assert.equal(copy.en[0].split(' ').length, 12);
    for (const [format, label] of [['1920x1080', 'wide'], ['1080x1920', 'portrait'], ['1080x1080', 'square']]) {
      await page.locator('#cs-layout-format').selectOption(format);
      for (const index of [0, 15, 30]) {
        await seek(page, index);
        await frame(page, 'product-' + label + '-' + index, index);
      }
      results.layoutWarnings[label] = await page.locator('#cs-layout-warnings').textContent();
      results.formats[label] = await page.locator('#cs-canvas').evaluate(canvas => [canvas.width, canvas.height]);
      await video(page, 'product-' + label);
    }
    await page.locator('#cs-layout-format').selectOption('1920x1080');
    await download(page, 'export-png', 'after-product.png');
    await page.screenshot({ path: path.join(out, 'editor.png') });
    await download(page, 'save-project', 'product.acstudio');

    for (const [direction, name, scenes] of [['character-comedy', 'fun', fun], ['minimal-suspense', 'suspense', suspense]]) {
      await page.locator('#cs-direction-select').selectOption(direction);
      await page.locator('#cs-project-title').fill(name === 'fun' ? 'The new manager' : 'The last light');
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      await author(page, scenes, 120);
      await select(page, 'track', 'caption');
      await input(page, 'startFrame', 8);
      await input(page, 'stagger', 5);
      if (name === 'fun') {
        for (const index of [8, 23, 38]) {
          await seek(page, index);
          await frame(page, 'fun-caption-' + index, index);
        }
      }
      await video(page, name);
      await download(page, 'save-project', name + '.acstudio');
    }
    await page.context().tracing.stop({ path: path.join(out, 'browser-trace.zip') });
    await page.context().close();
    results.recoveredEffect = await recover(browser, 'fun.acstudio', '“Règle un: ingen møder i caféen.”', 'fun-edited');

    for (const locale of ['es', 'da']) {
      const localized = await open(browser, locale);
      const first = [...copy[locale]];
      first[1] += '\n品質 👩🏽‍💻';
      const rows = {
        es: [['Campos en común', 'Compara los mismos registros.'], ['Todo en un lugar', 'Ordena los campos por prioridad.'],
          ['5', 'Cinco fuentes, un informe.'], ['Listo para compartir', 'Revisa antes de enviar.']],
        da: [['Find fælles felter', 'Sammenlign de samme poster.'], ['Alt ét sted', 'Sortér de vigtigste felter først.'],
          ['5', 'Fem kilder, én rapport.'], ['Klar til deling', 'Tjek rapporten før afsendelse.']]
      }[locale];
      const translated = product.map(([preset, title, caption, ...styles], index) =>
        index ? [preset, ...rows[index - 1], ...styles] : [preset, title, caption, ...styles]);
      await author(localized, translated, [225, 56, 56, 56, 57], first, locale);
      await localized.locator('#cs-layout-format').selectOption('1080x1920');
      await seek(localized, 30);
      await download(localized, 'export-png', 'product-' + locale + '.png');
      await video(localized, 'product-' + locale);
      await download(localized, 'save-project', 'product-' + locale + '.acstudio');
      await localized.context().close();
    }
    results.recoveredDanishEffect = await recover(browser, 'product-da.acstudio',
      'Vælg fem kilder.\nGennemgå rapporten på ét sted.', 'product-da-edited');

    for (const [phase, filename] of [['01', 'evidence/reordered_five_shot_project.acstudio'], ['02', 'repairs/after/phase-02.acstudio']]) {
      const legacy = await open(browser);
      await legacy.locator('#cs-file-input').setInputFiles(path.resolve(out, '../../phase-' + phase, filename));
      await legacy.waitForFunction(() => window.studioApp.lastOpenedUnpack?.project);
      await download(legacy, 'export-png', 'legacy-' + phase + '.png');
      await legacy.context().close();
    }
    const fallback = await browser.newPage();
    await fallback.route('**/assets/fonts/studio/*.ttf', route => route.abort());
    await fallback.goto(base + '/creative-studio/', { waitUntil: 'domcontentloaded' });
    await fallback.locator('#cs-typography-editor summary').click();
    const fallbackStatus = await fallback.locator('#cs-typography-editor [role="status"]').textContent();
    assert.match(fallbackStatus, /session fallback/);
    await select(fallback, 'effect', 'tracking');
    await seek(fallback, 15);
    await frame(fallback, 'font-fallback', 15);
    results.fontFallback = fallbackStatus;
    await fallback.context().close();
    assert.deepEqual(results.pageErrors, []);
    assert.ok(results.externalWrites.every(([, host, pathname]) => host.endsWith('google-analytics.com') && pathname === '/g/collect'));
  } finally {
    await fs.writeFile(path.join(out, 'browser-results.json'), JSON.stringify(results, null, 2) + '\n');
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
