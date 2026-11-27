const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const browsers = require('playwright-core');

const base = 'http://localhost:3000/creative-studio/';
const output = path.resolve('reports/creative-studio/visual-quality/phase-03/audit');
const expected = ['line', 'word', 'character', 'rise', 'type', 'tracking', 'underline', 'highlight',
  'echo', 'suspense', 'counter', 'emphasis'];

async function inspect(page, browserName) {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.studioApp?.initialized);
  await page.evaluate(() => window.StudioFonts.prepare());
  const result = await page.evaluate(effects => {
    const check = (condition, message) => { if (!condition) throw new Error(message); return message; };
    const { cue, progress } = window.StudioKineticType;
    const text = window.StudioTextLayout;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 430;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const box = { x: 70, y: 30, width: 730, height: 365 };
    const ink = { background: '#111522', ink: '#fff8ee', accent: '#a7f0d4' };
    const tracking = 'letterSpacing' in ctx;
    const create = (content, properties = {}) => ({ ...cue(properties, 'title', 100), minSize: properties.minSize, content });
    const measure = (content, properties, bounds = box, scale = 1) =>
      text.layout(ctx, create(content, properties), bounds, scale, 'left');
    const raster = (node, frame) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      text.draw(ctx, node, box, 1, 'left', frame, ink, 'en');
      let hash = 2166136261;
      let pixels = 0;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3]) pixels++;
        hash = Math.imul(hash ^ (data[i] | (data[i + 1] << 8) | (data[i + 2] << 16) | (data[i + 3] << 24)), 16777619);
      }
      return { hash, pixels };
    };
    const cases = [];
    const motion = {};
    for (const effect of effects) {
      const node = create(effect === 'counter' ? '48' : 'Open the report\nFive sources',
        { effect, startFrame: 7, endFrame: 49, length: 32, stagger: 4, phrase: 'report' });
      const frames = [6, 7, 14, 25, 39, 48, 49];
      const first = frames.map(frame => raster(node, frame));
      const reversed = frames.slice().reverse().map(frame => raster(node, frame)).reverse();
      check(JSON.stringify(first) === JSON.stringify(reversed), effect + ' out-of-order determinism');
      check(first[0].pixels === 0 && first.at(-1).pixels === 0, effect + ' visibility boundaries');
      check(first[4].pixels > 0 && first[4].hash === first[5].hash, effect + ' settled hold');
      check(new Set(first.slice(1, -1).map(sample => sample.hash)).size >= 3, effect + ' animated raster');
      motion[effect] = first;
    }
    const one = create('Cut', { effect: 'rise', startFrame: 7, endFrame: 8 });
    cases.push(check(progress(6, one) === 0 && progress(7, one) === 1 && raster(one, 7).pixels > 0,
      'single-frame cue settles on its only frame'));
    cases.push(check(measure('First paragraph.\n\nSecond paragraph.', { size: 48 }).rows.map(r => r.text).join('|')
      === 'First paragraph.||Second paragraph.', 'explicit paragraphs'));
    const punctuation = measure('“¿Qué?”\n(Informationssikkerhed!)', { size: 37 }, { ...box, width: 146 });
    cases.push(check(!punctuation.rows.some(r => /^[!?.,:;)”]/u.test(r.text) || /[“(]$/u.test(r.text)),
      'punctuation stays attached during long-word wrapping'));
    const overflow = measure('¡Información! ÆØÅ 品質 👩🏽‍💻 '.repeat(36), { size: 96, minSize: 40, maxLines: 2 },
      { ...box, width: 330 }, 2);
    cases.push(check(overflow.truncated && overflow.size === 80 && overflow.rows.at(-1).text.endsWith('…'),
      '2× layout shrinks to 40 px normalized floor then ellipsizes'));
    const fixed = measure('Very long words '.repeat(12), { size: 72, overflow: 'ellipsis', maxLines: 1 }, { ...box, width: 380 });
    cases.push(check(fixed.size === 72 && fixed.truncated && fixed.rows.length === 1, 'fixed-size ellipsis'));
    const spans = measure('Read the report, then share the report.', { phrase: 'report', size: 42 });
    cases.push(check(spans.rows.flatMap(r => r.parts).filter(r => r.styled).length === 2, 'repeated styled phrase'));
    for (const copy of ['Café, acción, ¿qué?', 'Ærø, blåbær, åbent', '品質', '👩🏽‍💻']) {
      const row = measure(copy, { size: 44, effect: 'type' }).rows[0];
      cases.push(check(row.text === copy && row.width > 0 && raster(create(copy), 35).pixels > 0, 'glyph raster ' + copy));
      if (copy.startsWith('👩')) cases.push(check(row.units.length === 1, 'joined emoji is one reveal unit'));
    }
    const tight = measure('TRACKING', { size: 50, tracking: 0 }).rows[0].width;
    const wide = measure('TRACKING', { size: 50, tracking: 5 }).rows[0].width;
    cases.push(check(tracking ? wide > tight : wide === tight, 'tracking metric or graceful fallback'));

    const safe = {};
    for (const [width, height] of [[1920, 1080], [1080, 1920], [1080, 1080], [3840, 2160]]) {
      const screen = {};
      for (const treatment of ['outline', 'shadow', 'panel']) {
        const shot = window.studioApp.project.shots[0];
        const customData = { ...shot.customData, typography: { version: 1, caption: { contrast: treatment, backdrop: 'pattern' } } };
        const layer = Object.assign(Object.create(Object.getPrototypeOf(shot)), shot, { customData });
        const image = document.createElement('canvas');
        image.width = width;
        image.height = height;
        const result = window.StudioLayoutComposition.render(image.getContext('2d'), layer, { preset: 'hero' }, 30, width, height);
        const area = result.safe;
        for (const block of Object.values(result.blocks)) {
          check(block.x >= area.x && block.y >= area.y && block.x + block.width <= area.x + area.width &&
            block.y + block.height <= area.y + area.height, 'block stays inside safe area');
        }
        check(result.captionContrast >= 4.5, 'caption contrast is at least 4.5:1');
        screen[treatment] = { contrast: result.captionContrast, safe: area, caption: result.blocks.caption };
      }
      safe[width + 'x' + height] = screen;
    }
    return { cases, motion, tracking, measuredWidths: { tight, wide }, safe,
      fonts: ['sans', 'serif', 'display'].map(key => [key, window.StudioFonts.loaded(key)]) };
  }, expected);
  assert.ok(result.fonts.every(([, loaded]) => loaded));
  await page.locator('#cs-typography-editor summary').click();
  await page.locator('#cs-type-track').selectOption('caption');
  await page.locator('#cs-type-effect').selectOption('word');
  await page.locator('#cs-type-backdrop').selectOption('pattern');
  await page.locator('#cs-type-contrast').selectOption('outline');
  const [archive] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-save-project').click()]);
  const recovery = await page.context().browser().newContext({ acceptDownloads: true, viewport: { width: 1540, height: 1080 } });
  const restored = await recovery.newPage();
  await restored.goto(base, { waitUntil: 'domcontentloaded' });
  await restored.locator('#cs-file-input').setInputFiles(await archive.path());
  await restored.waitForFunction(() => window.studioApp.lastOpenedUnpack?.project);
  await restored.locator('#cs-typography-editor summary').click();
  await restored.locator('#cs-type-track').selectOption('caption');
  for (const [key, value] of [['effect', 'word'], ['backdrop', 'pattern'], ['contrast', 'outline']]) {
    assert.equal(await restored.locator('#cs-type-' + key).inputValue(), value);
  }
  result.archive = 'word-pop, pattern, outline persisted';
  result.capabilities = await restored.evaluate(() => window.studioApp.renderAdapter.checkCapabilities());
  const [png] = await Promise.all([restored.waitForEvent('download'), restored.locator('#cs-btn-export-png').click()]);
  result.stillExport = png.suggestedFilename();

  // A two-second browser-native export verifies the selected runtime path.
  const exportResult = await restored.evaluate(async () => {
      const app = window.studioApp;
      const result = await app.renderAdapter.render(app.project, { width: 640, height: 360, fps: 30, durationSeconds: 2 });
      return { engine: result.engine, bytes: result.blob?.size || 0, mimeType: result.mimeType,
        data: Array.from(new Uint8Array(await result.blob.arrayBuffer())) };
  });
  const { data, ...metadata } = exportResult;
  assert.ok(metadata.bytes > 0);
  const filename = 'compatibility-' + browserName + '.webm';
  const clip = path.join(output, filename);
  await fs.writeFile(clip, Buffer.from(data));
  const streams = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_entries',
    'stream=codec_name,nb_read_frames', '-of', 'json', clip])).streams;
  assert.equal(streams[0].codec_name, 'vp8');
  assert.equal(Number(streams[0].nb_read_frames), 60);
  assert.equal(streams[1].codec_name, 'opus');
  result.videoExport = { ...metadata, filename, streams };

  const fontFailure = await page.context().newPage();
  await fontFailure.route('**/assets/fonts/studio/*.ttf', route => route.abort());
  await fontFailure.goto(base, { waitUntil: 'domcontentloaded' });
  await fontFailure.locator('#cs-typography-editor summary').click();
  result.fontFallback = await fontFailure.locator('#cs-typography-editor [role="status"]').textContent();
  assert.match(result.fontFallback, /session fallback/);
  return result;
}

async function main() {
  await fs.mkdir(output, { recursive: true });
  const results = {};
  for (const name of ['chromium', 'firefox', 'webkit']) {
    let browser;
    try {
      browser = await browsers[name].launch(name === 'chromium' ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } : {});
    } catch (error) {
      results[name] = { launchError: String(error) };
      continue;
    }
    try {
      const context = await browser.newContext({ viewport: { width: 1540, height: 1080 }, acceptDownloads: true });
      const page = await context.newPage();
      results[name] = { version: browser.version(), ...await inspect(page, name) };
    } catch (error) {
      results[name] = { version: browser.version(), failure: String(error) };
    } finally {
      await browser.close();
    }
  }
  await fs.writeFile(path.join(output, 'typography-regression.json'), JSON.stringify(results, null, 2) + '\n');
  assert.ok(results.chromium?.motion, JSON.stringify(results));
  for (const [name, result] of Object.entries(results)) assert.ok(!result.failure, name + ': ' + result.failure);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
