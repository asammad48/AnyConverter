const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const out = path.resolve(__dirname, process.env.PHASE03_AUDIT === '1' ? '../audit' : '../evidence');
const candidate = 'http://localhost:3000';
const baseline = 'http://127.0.0.1:4173';

async function still(page) {
  const [file] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-export-png').click()]);
  return fs.readFile(await file.path());
}

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const results = { archives: {}, mobile: {} };
  try {
    const legacy = [
      ['01', 'evidence/reordered_five_shot_project.acstudio'],
      ['02', 'repairs/after/phase-02.acstudio']
    ];
    for (const [phase, file] of legacy) {
      const hashes = [];
      for (const base of [baseline, candidate]) {
        const page = await browser.newPage({ viewport: { width: 1540, height: 1120 }, acceptDownloads: true });
        await page.goto(base + '/creative-studio/', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready.then(() => true));
        await page.locator('#cs-file-input').setInputFiles(path.resolve(out, '../../phase-' + phase, file));
        await page.waitForFunction(() => window.studioApp.lastOpenedUnpack?.project);
        const scrubber = page.locator('#cs-timeline-scrubber');
        for (let frame = 0; frame < 30; frame++) await scrubber.press('ArrowRight');
        hashes.push(createHash('sha256').update(await still(page)).digest('hex'));
        await page.context().close();
      }
      assert.equal(hashes[0], hashes[1], 'Legacy Phase ' + phase);
      results.archives[phase] = { frame: 30, baselineSha256: hashes[0], candidateSha256: hashes[1] };
    }
    const locales = {
      en: ['Typography and motion', 'Let the next line come in slowly.\nGive it room to breathe.', /Allow at least/],
      es: ['Tipografía y movimiento', 'Deja que la próxima línea aparezca despacio.\nDale espacio para respirar.', /Deja al menos/],
      da: ['Typografi og bevægelse', 'Lad den næste linje komme langsomt frem.\nGiv den plads til at ånde.', /Giv mindst/]
    };
    for (const [locale, [heading, caption, warning]] of Object.entries(locales)) {
      const page = await browser.newPage({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true });
      await page.goto(candidate + (locale === 'en' ? '' : '/' + locale) + '/creative-studio/', { waitUntil: 'domcontentloaded' });
      await page.locator('#cs-btn-mobile-inspector').click();
      await page.locator('#cs-layout-editor summary').click();
      await page.locator('#cs-layout-preset').selectOption('hero');
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      const summary = page.locator('#cs-typography-editor summary');
      assert.equal(await summary.textContent(), heading);
      await summary.click();
      await page.locator('#cs-type-track').selectOption('caption');
      await page.locator('#cs-type-effect').selectOption('line');
      await page.locator('#cs-shot-subhead').fill(caption);
      await page.locator('#cs-shot-duration').fill('180');
      await page.locator('#cs-type-endFrame').fill('30');
      await page.locator('#cs-type-endFrame').press('Tab');
      const status = page.locator('#cs-layout-warnings');
      const missedBudget = await status.textContent();
      assert.match(missedBudget, warning);
      await page.locator('#cs-type-endFrame').fill('150');
      await page.locator('#cs-type-endFrame').press('Tab');
      assert.doesNotMatch(await status.textContent(), warning);
      await summary.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(out, 'mobile-' + locale + '.png') });
      results.mobile[locale] = { heading, caption, missedBudget, cleared: true };
      await page.context().close();
    }
  } finally {
    await fs.writeFile(path.join(out, 'browser-regression.json'), JSON.stringify(results, null, 2) + '\n');
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
