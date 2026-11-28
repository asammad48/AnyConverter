const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const results = {};
  try {
    for (const [locale, propertyLabel] of [['en', 'Camera shake'], ['es', 'Vibración de cámara'], ['da', 'Kamerarystelse']]) {
      const context = await browser.newContext({ viewport: { width: 1540, height: 1120 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto('http://localhost:3000' + (locale === 'en' ? '' : '/' + locale) + '/creative-studio/');
      await page.locator('#cs-direction-select').selectOption('motion-showreel');
      await page.locator('#cs-motion-editor > summary').click();
      const field = name => page.locator('#cs-motion-' + name);
      assert.ok(await field('reduced').isChecked());
      assert.equal(await field('property').locator('option[value="shake"]').textContent(), propertyLabel);
      await field('reduced').uncheck();
      const seek = frame => page.locator('#cs-timeline-scrubber').evaluate((slider, frame) => {
        slider.value = frame;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      }, frame);
      const canvas = () => page.locator('#cs-canvas').evaluate(canvas => canvas.toDataURL());
      await seek(7);
      const original = await canvas();
      await field('out-y').fill('0.02');
      await field('out-y').press('Tab');
      assert.notEqual(await canvas(), original);
      await seek(95);
      await field('layer').selectOption('entry-csv');
      await field('parent').selectOption('group');
      await field('layer').selectOption('group');
      await field('property').selectOption('x');
      await field('add-track').click();
      const beforeGroup = await canvas();
      await field('value').fill('0.1');
      await field('value').press('Tab');
      assert.notEqual(await canvas(), beforeGroup);
      results[locale] = { systemReducedMotion: true, propertyLabel, editableBezier: true, groupTransform: true };
      await context.close();
    }
  } finally {
    await fs.writeFile(path.join(__dirname, '../evidence/controls-regression.json'), JSON.stringify(results, null, 2) + '\n');
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
