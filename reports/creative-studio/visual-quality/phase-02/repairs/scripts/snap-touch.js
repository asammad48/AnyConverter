const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const width of [900, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4173/creative-studio/');
      await page.locator('#cs-btn-mobile-inspector').click();
      await page.locator('#cs-layout-editor summary').click();
      await page.locator('#cs-layout-preset').selectOption('dialogue');
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      await page.locator('#cs-btn-close-inspector').click();
      const canvas = page.locator('#cs-canvas');
      await canvas.scrollIntoViewIfNeeded();
      const rect = await canvas.boundingBox();
      const read = () => page.evaluate(() => studioApp.layoutEditor.resolved);
      const before = await read();
      const block = before.blocks.subject;
      const x = rect.x + (block.x + block.width / 2) * rect.width / 1080;
      const y = rect.y + (block.y + block.height / 2) * rect.height / 1920;
      const xEnd = x + (before.safe.x + 4 - block.x) * rect.width / 1080;
      const client = await context.newCDPSession(page);
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: xEnd, y }] });
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      const after = await read();
      assert.ok(block.x > before.safe.x + 4);
      assert.equal(after.blocks.subject.x, before.safe.x);
      results.push({ width, xBefore: block.x, proposed: before.safe.x + 4, snappedX: after.blocks.subject.x });
      await context.close();
    }
    await fs.writeFile(path.resolve(__dirname, '../after/touch-snap-results.json'), JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
