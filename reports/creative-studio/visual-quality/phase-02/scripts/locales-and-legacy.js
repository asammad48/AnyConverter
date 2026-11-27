const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const root = path.resolve(__dirname, '../../../../..');
const output = path.resolve(__dirname, '../evidence');
const url = 'http://localhost:3000';
const baseline = '2812c0ae72487901c7f5f2d83515c005214a9353';
const strings = {
  en: ['Keep the conversation moving', 'Make sure that everyone leaves the meeting knowing their next step and who will do it.'],
  es: ['Haz avanzar la conversación sin perder el hilo', 'Asegúrate de que todos salgan de la reunión sabiendo cuál es el siguiente paso y quién se encargará de darlo.'],
  da: ['Hold samtalen i gang, og bevar overblikket', 'Sørg for, at alle går fra mødet med en fælles forståelse af næste skridt og hvem der har ansvaret for det.']
};

async function canvasPng(page) {
  const data = await page.locator('#cs-canvas').evaluate(node => node.toDataURL().split(',')[1]);
  return Buffer.from(data, 'base64');
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const results = {};
  try {
    const legacyFiles = new Set(['creative-studio/', 'assets/js/creative-studio/studio-app.js',
      'assets/js/creative-studio/visual/creative-director.js', 'assets/css/creative-studio.css']);
    for (const [name, old] of [['legacy-baseline', true], ['legacy-current', false]]) {
      const page = await browser.newPage({ viewport: { width: 1500, height: 1050 } });
      if (old) {
        await page.route(url + '/**', async route => {
          const pathname = new URL(route.request().url()).pathname.slice(1);
          if (!legacyFiles.has(pathname)) return route.continue();
          const filepath = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
          const body = execFileSync('git', ['show', baseline + ':' + filepath], { cwd: root });
          const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
          await route.fulfill({ body, contentType: types[path.extname(filepath)] });
        });
      }
      await page.goto(url + '/creative-studio/', { waitUntil: 'domcontentloaded' });
      const scrubber = page.locator('#cs-timeline-scrubber');
      await scrubber.press('ArrowRight');
      await scrubber.press('PageUp');
      results[name] = await scrubber.inputValue();
      await fs.writeFile(path.join(output, name + '.png'), await canvasPng(page));
      await page.close();
    }
    assert.equal(results['legacy-baseline'], results['legacy-current']);
    assert.deepEqual(await fs.readFile(path.join(output, 'legacy-baseline.png')), await fs.readFile(path.join(output, 'legacy-current.png')));

    const errors = [];
    for (const [locale, [headline, caption]] of Object.entries(strings)) {
      const page = await browser.newPage({ viewport: { width: 375, height: 900 }, acceptDownloads: true });
      page.on('pageerror', error => errors.push(error.message));
      const prefix = locale === 'en' ? '' : '/' + locale;
      await page.goto(url + prefix + '/creative-studio/', { waitUntil: 'domcontentloaded' });
      await page.locator('#cs-direction-select').selectOption('character-comedy');
      await page.locator('#cs-btn-mobile-inspector').click();
      await page.locator('#cs-layout-editor summary').click();
      await page.locator('#cs-layout-preset').selectOption('dialogue');
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      await page.locator('#cs-shot-headline').fill(headline);
      await page.locator('#cs-shot-subhead').fill(caption);
      await page.locator('#cs-layout-pose').selectOption('large');
      assert.equal(await page.locator('#cs-layout-warnings').textContent(), '', locale);
      const portrait = await canvasPng(page);
      await page.locator('#cs-layout-format').selectOption('1080x1080');
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      assert.deepEqual(await canvasPng(page), portrait);
      await page.screenshot({ path: path.join(output, 'mobile-' + locale + '.png') });
      await page.locator('#cs-btn-close-inspector').click();
      const [file] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-export-png').click()]);
      await file.saveAs(path.join(output, 'expanded-' + locale + '.png'));
      assert.deepEqual(await fs.readFile(path.join(output, 'expanded-' + locale + '.png')), portrait);
      results[locale] = { headline, caption, viewport: '375 × 900', format: '1080 × 1920', warningCount: 0 };
      await page.close();
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'locale-and-legacy-results.json'), JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
