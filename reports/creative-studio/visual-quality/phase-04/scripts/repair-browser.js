const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const browsers = require('playwright-core');

const out = path.resolve(__dirname, '../revised');
const base = 'http://localhost:3000/creative-studio/';
const realtime = process.env.PHASE04_FIREFOX_REALTIME === '1';
const field = (page, name) => page.locator('#cs-motion-' + name);
const set = async (locator, value) => { await locator.fill(String(value)); await locator.press('Tab'); };
const geometry = (page, id) => page.evaluate(id => window.studioApp.layoutEditor.resolved.motionGeometry.get(id), id);
const hash = value => createHash('sha256').update(value).digest('hex');
const signature = (page, titleOnly = false) => page.locator('#cs-canvas').evaluate(async (el, titleOnly) => {
  const box = titleOnly ? studioApp.layoutEditor.resolved.blocks.title
    : { x: 0, y: 0, width: el.width, height: el.height };
  const rgba = el.getContext('2d').getImageData(box.x, box.y, box.width, box.height).data;
  const digest = await crypto.subtle.digest('SHA-256', rgba);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}, titleOnly);
const canvas = page => page.locator('#cs-canvas').evaluate(el => el.toDataURL().split(',')[1]);
async function capture(page, name) {
  const buffer = Buffer.from(await canvas(page), 'base64');
  await fs.writeFile(path.join(out, name + '.png'), buffer);
  return hash(buffer);
}
async function seek(page, frame) {
  await page.locator('#cs-timeline-scrubber').evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, frame);
}
async function session(browser) {
  const context = await browser.newContext({ viewport: { width: 1540, height: 1120 }, acceptDownloads: true });
  const page = await context.newPage();
  await page.goto(base);
  await page.locator('#cs-motion-editor > summary').click();
  await page.waitForFunction(() => StudioFonts.loaded('display'));
  return [context, page];
}
async function download(page, action, name) {
  const [file] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), page.locator('#cs-btn-' + action).click()]);
  const extension = action === 'export-video' ? path.extname(file.suggestedFilename()) : '.acstudio';
  await file.saveAs(path.join(out, name + extension));
  return name + extension;
}
async function addPreset(page, preset, pattern = 'enter') {
  await field(page, 'preset').selectOption(preset);
  await field(page, 'pattern').selectOption(pattern);
  await field(page, 'apply').click();
}
async function curve(page, property, from, to, end = 30) {
  await field(page, 'property').selectOption(property);
  await field(page, 'add-track').click();
  await set(field(page, 'value'), from);
  await seek(page, end);
  await field(page, 'add-key').click();
  await set(field(page, 'value'), to);
}

async function character(browser, name) {
  const [context, page] = await session(browser);
  const actions = ['idle', 'talk', 'recoil', 'shocked', 'point', 'exit'];
  try {
    await page.locator('#cs-direction-select').selectOption('character-comedy');
    await page.locator('#cs-project-title').fill('The lighthouse dispatch');
    await page.locator('#cs-shot-headline').fill('The lighthouse dispatch');
    await page.locator('#cs-shot-subhead').fill('Pico reads the signal. The lighthouse is still waiting.');
    await set(page.locator('#cs-shot-duration'), 216);
    await field(page, 'debug').check();
    const author = async (action, start, duration, mode = 'apply-action') => {
      await field(page, 'action').selectOption(action);
      await set(field(page, 'start'), start);
      await set(field(page, 'duration'), duration);
      await field(page, mode).click();
    };
    for (const [i, action] of actions.entries()) await author(action, i * 36, 36);
    await author('blink', 24, 12);
    assert.match(await page.locator('#cs-motion-editor [role=status]').textContent(), /cannot overlap/);
    assert.equal(await field(page, 'action-clip').locator('option').count(), 7);
    await field(page, 'action-clip').selectOption('0');
    await author('blink', 0, 36, 'replace-action');
    await seek(page, 13);
    assert.match(await page.locator('#cs-motion-editor output').textContent(), /blink/);
    await author('excited', 0, 36, 'replace-action');
    await seek(page, 15);
    assert.match(await page.locator('#cs-motion-editor output').textContent(), /excited/);
    await field(page, 'remove-action').click();
    assert.equal(await field(page, 'action-clip').locator('option').count(), 6);
    await author('idle', 0, 36);
    await page.evaluate(() => StudioPuppet.prepare());
    const samples = {};
    let anchor;
    for (const index of [5, 0, 2, 4, 1, 3, 0]) {
      const first = index * 36;
      for (const frame of [first, first + 18, first + 35]) {
        await seek(page, frame);
        assert.match(await page.locator('#cs-motion-editor output').textContent(), new RegExp(actions[index]));
        const frameSignature = await signature(page);
        if (samples[frame]) assert.equal(frameSignature, samples[frame]);
        samples[frame] = frameSignature;
        const metrics = await geometry(page, 'puppet');
        if (frame < 180) {
          // The native set settles in the first 40% of a shot. X stays attached to the perch.
          anchor ??= metrics.anchor[0];
          assert.ok(Math.abs(metrics.anchor[0] - anchor) < 1e-6);
          assert.equal(metrics.clipping, 'inside');
        }
        if (name === 'chromium') await capture(page, 'sequence-' + frame);
      }
    }
    if (name === 'chromium') {
      // Continue the dispatch story in the existing pilot's next shots.
      await page.locator('#cs-shot-select').selectOption('1');
      await page.locator('#cs-shot-headline').fill('The lighthouse answers');
      await page.locator('#cs-shot-subhead').fill('Two flashes. The message was received.');
      await author('blink', 0, 24);
      await author('excited', 24, 51);
      await page.locator('#cs-shot-select').selectOption('2');
      await page.locator('#cs-shot-headline').fill('A second signal');
      await page.locator('#cs-shot-subhead').fill('The second lamp means the channel is clear.');
      await page.locator('#cs-shot-select').selectOption('3');
      await page.locator('#cs-shot-headline').fill('Dispatch complete');
      await page.locator('#cs-shot-subhead').fill('The light stays on until morning.');
    }
    const basename = 'sequential-actions-' + name + (realtime ? '-realtime' : '');
    const archive = await download(page, 'save-project', basename);
    const media = await download(page, 'export-video', basename);
    const exportMode = await page.evaluate(() => {
      const result = studioApp.lastExportResult;
      return { engine: result.engine, mimeType: result.mimeType, frameAccurate: result.frameAccurate, totalFrames: result.totalFrames };
    });
    if (realtime) assert.equal(exportMode.engine, 'MediaRecorder-RealtimeFallback');
    const [fresh, opened] = await session(browser);
    try {
      await opened.locator('#cs-file-input').setInputFiles(path.join(out, archive));
      await opened.waitForFunction(() => window.studioApp.lastOpenedUnpack?.project);
      await opened.evaluate(async () => { await StudioPuppet.prepare(); await StudioFonts.prepare(); });
      for (const frame of [0, 53, 90, 126, 162, 198]) {
        await seek(opened, frame);
        if (samples[frame]) assert.equal(await signature(opened), samples[frame], name + " fresh frame " + frame);
      }
      assert.equal(await field(opened, 'action-clip').locator('option').count(), 7);
      if (name === 'chromium') {
        await opened.locator('#cs-shot-select').selectOption('1');
        const options = await field(opened, 'action-clip').locator('option').allTextContents();
        assert.match(options[1], /Blink/);
        assert.match(options[2], /Excited/);
      }
    } finally { await fresh.close(); }
    return { actions, ...(name === 'chromium' ? { additionalActions: ['blink', 'excited'] } : {}), samples, archive, media, exportMode };
  } finally { await context.close(); }
}

async function group(browser) {
  const [context, page] = await session(browser);
  try {
    await page.locator('#cs-project-title').fill('Field station file handoff');
    await page.locator('#cs-shot-headline').fill('Field station files');
    await page.locator('#cs-shot-subhead').fill('Collect the three survey records before sending the report.');
    await set(page.locator('#cs-shot-duration'), 90);
    for (const index of [1, 2, 3, 4]) {
      await page.locator('#cs-shot-select').selectOption(String(index));
      await set(page.locator('#cs-shot-duration'), 45);
    }
    await page.locator('#cs-shot-select').selectOption('0');
    await field(page, 'layer').selectOption('entry-csv');
    await set(field(page, 'duration'), 20);
    await addPreset(page, 'fade-rise');
    await addPreset(page, 'underline-draw');
    for (const id of ['entry-csv', 'entry-json', 'entry-pdf', 'entry-yaml', 'entry-sql']) {
      await field(page, 'layer').selectOption(id);
      await field(page, 'parent').selectOption('group-inner');
    }
    await field(page, 'layer').selectOption('group-inner');
    await field(page, 'parent').selectOption('group');
    await field(page, 'layer').selectOption('group');
    assert.equal(await field(page, 'parent').locator('option[value="group-inner"]').count(), 0);
    await seek(page, 0);
    await curve(page, 'rotation', 0, 12, 60);
    await seek(page, 0);
    await curve(page, 'scaleX', 1, .87, 60);
    await seek(page, 0);
    await curve(page, 'scaleY', 1, .87, 60);
    await seek(page, 0);
    await curve(page, 'x', 0, -.04, 60);
    const ids = ['entry-json', 'entry-pdf', 'entry-yaml'];
    const sample = async frame => {
      await seek(page, frame);
      return Promise.all(ids.map(id => geometry(page, id)));
    };
    const rest = await sample(0);
    const moved = await sample(60);
    const delta = (a, b) => a.pivot.map((v, i) => b.pivot[i] - v);
    const initial = delta(rest[1], rest[2]);
    const final = delta(moved[0], moved[1]);
    for (const pair of [delta(moved[1], moved[2]), final]) {
      assert.ok(Math.abs(pair[0] - final[0]) < 1e-6);
      assert.ok(Math.abs(pair[1] - final[1]) < 1e-6);
    }
    assert.ok(Math.abs(Math.hypot(...final) / Math.hypot(...initial) - .87) < 1e-6, JSON.stringify({ initial, final, rest, moved }));
    assert.ok(Math.abs(Math.atan2(-final[0], final[1]) * 180 / Math.PI - 12) < 1e-6);
    const safe = await page.evaluate(() => studioApp.layoutEditor.resolved.safe);
    const angle = 12 * Math.PI / 180;
    const center = [safe.x + safe.width / 2, safe.y + safe.height / 2];
    const expected = rest.map(({ pivot }) => {
      const x = (pivot[0] - center[0]) * .87;
      const y = (pivot[1] - center[1]) * .87;
      return [center[0] - .04 * safe.width + x * Math.cos(angle) - y * Math.sin(angle),
        center[1] + x * Math.sin(angle) + y * Math.cos(angle)];
    });
    for (const [index, geometry] of moved.entries()) {
      assert.ok(Math.hypot(...geometry.pivot.map((value, axis) => value - expected[index][axis])) < .001);
    }
    await capture(page, 'group-60');
    await sample(0);
    await capture(page, 'group-0');
    await field(page, 'layer').selectOption('entry-csv');
    await seek(page, 0);
    await curve(page, 'number', 21, 49, 60);
    await seek(page, 0);
    await curve(page, 'color', '#ff6633', '#33dd99', 60);
    const numericColor = {};
    for (const frame of [0, 30, 60]) {
      await seek(page, frame);
      const values = await page.evaluate(() => {
        const s = studioApp.layoutEditor.resolved.motion.get('entry-csv');
        return [s.number, s.color];
      });
      numericColor[frame] = { values, signature: await capture(page, 'group-final-' + frame) };
    }
    assert.deepEqual(numericColor[30].values, [35, '#99a266']);
    assert.equal(await field(page, 'property').locator('option[value="poseId"]').evaluate(option => option.disabled), true);
    await field(page, 'layer').selectOption('title');
    assert.equal(await field(page, 'property').locator('option[value="number"]').evaluate(option => option.disabled), true);
    const archive = await download(page, 'save-project', 'field-station-group');
    const media = await download(page, 'export-video', 'field-station-group');
    const bounds = {};
    await page.locator('#cs-layout-editor > summary').click();
    for (const format of ['1280x720', '1080x1920', '1080x1080']) {
      await page.locator('#cs-layout-format').selectOption(format);
      await seek(page, 0);
      await curve(page, 'x', 0, .5, 30);
      await seek(page, 30);
      assert.equal((await geometry(page, 'title')).clipping, 'overflow');
      await field(page, 'clip-intent').check();
      assert.equal((await geometry(page, 'title')).clipping, 'intentional');
      bounds[format] = await geometry(page, 'title');
      await field(page, 'clip-intent').uncheck();
      await seek(page, 0);
      await curve(page, 'x', 0, 0, 30);
      for (const [property, neutral, extreme] of [['rotation', 0, 38], ['scaleX', 1, 1.7], ['path', 1, 0]]) {
        await seek(page, 0);
        await curve(page, property, neutral, extreme, 30);
        if (property === 'scaleX') {
          await field(page, 'key').selectOption('0');
          await field(page, 'ease').selectOption('spring');
          await seek(page, 17);
          assert.equal((await geometry(page, 'title')).clipping, 'overflow');
          await seek(page, 30);
        }
        bounds[format + '-' + property] = await geometry(page, 'title');
        assert.equal(bounds[format + '-' + property].clipping, 'overflow');
        await seek(page, 0);
        await curve(page, property, neutral, neutral, 30);
      }
    }
    return { rest, moved, expected, numericColor, bounds, archive, media };
  } finally { await context.close(); }
}

async function properties(browser) {
  const [context, page] = await session(browser);
  const result = {};
  try {
    await set(page.locator('#cs-shot-duration'), 90);
    const canvasContains = (page, color) => page.evaluate(color => {
      const canvas = document.querySelector('#cs-canvas');
      const bytes = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      const target = color.match(/\w{2}/g).map(pair => parseInt(pair, 16));
      let count = 0;
      for (let i = 0; i < bytes.length; i += 4) {
        if (target.every((value, channel) => Math.abs(value - bytes[i + channel]) <= 2)) count++;
      }
      return count;
    }, color);
    for (const [target, first, last] of [['title', '#ff6633', '#33dd99'], ['caption', '#ffdf44', '#f286f0']]) {
      await field(page, 'layer').selectOption(target);
      await seek(page, 0);
      await curve(page, 'color', first, last, 60);
      const final = await canvasContains(page, last);
      await seek(page, 0);
      const initial = await canvasContains(page, first);
      assert.ok(initial > 15 && final > 15, target + ' ink color');
      result[target] = { first, last, initial, final };
    }
    await page.locator('#cs-layout-editor > summary').click();
    await page.locator('#cs-layout-preset').selectOption('statistic');
    await field(page, 'layer').selectOption('subject');
    await seek(page, 0);
    await curve(page, 'number', 4, 84, 60);
    await seek(page, 0);
    const first = await capture(page, 'statistic-4');
    await seek(page, 60);
    const last = await capture(page, 'statistic-84');
    assert.notEqual(first, last);
    result.statistic = { first, last };
    return result;
  } finally { await context.close(); }
}

async function presets(browser) {
  const combinations = [];
  const names = ['fade-rise', 'reveal', 'slide', 'scale-pop', 'rotation', 'orbit', 'focus-zoom',
    'underline-draw', 'staggered-cards', 'path-follow'];
  for (const pattern of ['enter', 'settle', 'hold', 'emphasize', 'exit']) {
    for (const name of names) {
      const [context, page] = await session(browser);
      try {
        await set(field(page, 'duration'), 30);
        await addPreset(page, name, pattern);
        const signatures = [];
        for (const frame of [0, 9, 23, 30, 9]) {
          await seek(page, frame);
          signatures.push(await signature(page, true));
        }
        assert.equal(signatures[1], signatures[4]);
        assert.equal(new Set(signatures).size > 1, pattern !== 'hold', name + ' ' + pattern);
        combinations.push({ name, pattern, signatures });
      } finally { await context.close(); }
    }
  }
  return combinations;
}

async function main() {
  await fs.mkdir(out, { recursive: true });
  const results = {};
  for (const name of (process.argv.slice(2).length ? process.argv.slice(2) : ['chromium', 'firefox', 'webkit'])) {
    let browser;
    try {
      browser = await browsers[name].launch(name === 'chromium' ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] }
        : name === 'firefox' && realtime ? { firefoxUserPrefs: { 'dom.media.webcodecs.enabled': false } } : {});
    } catch (error) {
      results[name] = { status: 'BLOCKED', cause: String(error) };
      continue;
    }
    try {
      const result = results[name] = { browser: browser.version(), status: 'RUNNING' };
      const presetsOnly = process.env.PHASE04_PRESETS_ONLY === '1';
      if (process.env.PHASE04_PROPERTIES_ONLY === '1') {
        result.properties = await properties(browser);
        result.status = 'PASS';
        continue;
      }
      if (!presetsOnly && process.env.PHASE04_GROUP_ONLY !== '1') result.character = await character(browser, name);
      if (name === 'chromium') {
        if (!presetsOnly && process.env.PHASE04_CHARACTER_ONLY !== '1') result.group = await group(browser);
        if (presetsOnly || process.env.PHASE04_PRESET_PIXELS === '1') result.presets = await presets(browser);
      }
      result.status = 'PASS';
    } catch (error) {
      results[name].status = 'FAIL';
      results[name].cause = error.stack || String(error);
      console.error(name, error);
    } finally { await browser.close(); }
  }
  const suffix = realtime ? '-realtime' : process.env.PHASE04_PROPERTIES_ONLY === '1' ? '-properties' : process.env.PHASE04_PRESETS_ONLY === '1' ? '-presets' : process.env.PHASE04_GROUP_ONLY === '1' ? '-group' : '';
  await fs.writeFile(path.join(out, 'repair-browser-' + Object.keys(results).join('-') + suffix + '.json'), JSON.stringify(results, null, 2));
  if (Object.values(results).some(result => result.status !== 'PASS')) process.exitCode = 1;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
