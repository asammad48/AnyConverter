const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const base = 'http://127.0.0.1:4173';
const out = path.resolve(__dirname, '../after');
const phase = path.resolve(__dirname, '../..');
const headlines = {
  en: ['Ready to share', 'Give everyone a clear next step without losing the thread of the conversation'],
  es: ['Listo para compartir', 'Haz avanzar la conversación sin perder el hilo y prepara el siguiente paso'],
  da: ['Klar til deling', 'Hold samtalen i gang, bevar overblikket, og aftal det næste skridt']
};
const captions = {
  en: ['Your report is ready.', 'Make sure that everyone leaves the meeting knowing their next step and who will do it.'],
  es: ['El informe está listo.', 'Asegúrate de que todos salgan de la reunión sabiendo cuál es el siguiente paso y quién se encargará de darlo.'],
  da: ['Rapporten er klar.', 'Sørg for, at alle går fra mødet med en fælles forståelse af næste skridt og hvem der har ansvaret for det.']
};
const sizes = [[1440, 1000], [900, 920], [375, 850]];
const formats = ['1280x720', '1920x1080', '1080x1920', '1080x1080'];

function intersect(a, b) {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const result = [];
  try {
    for (const lang of ['en', 'es', 'da']) for (const [width, height] of sizes) {
      const context = await browser.newContext({ viewport: { width, height }, acceptDownloads: true });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + (lang === 'en' ? '' : '/' + lang) + '/creative-studio/');
      if (width <= 1024) await page.locator('#cs-btn-mobile-inspector').click();
      await page.locator('#cs-layout-editor summary').click();
      await page.locator('#cs-layout-preset').selectOption('dialogue');
      const warnings = page.locator('#cs-layout-warnings');
      const caption = page.locator('#cs-shot-subhead');
      const duration = page.locator('#cs-shot-duration');
      let checks = 0;
      for (const format of formats) {
        await page.locator('#cs-layout-format').selectOption(format);
        for (let index = 0; index < 2; index++) {
          await page.locator('#cs-shot-headline').fill(headlines[lang][index]);
          await caption.fill(captions[lang][index]);
          await duration.fill('30');
          if (index) assert.match(await warnings.innerText(), /17|least|menos|mindst/i);
          await duration.fill(index ? '255' : '135');
          assert.equal(await warnings.innerText(), '', [lang, width, format, index]);
          const actual = await page.locator('#cs-canvas').evaluate(node => node.width + 'x' + node.height);
          assert.equal(actual, format);
          if (width === 375 && format === '1080x1920' && index === 1) {
            await page.locator('#cs-btn-close-inspector').click();
            const [proof] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-export-png').click()]);
            await proof.saveAs(path.join(out, `long-portrait-${lang}.png`));
            await page.locator('#cs-btn-mobile-inspector').click();
          }
          checks++;
        }
      }
      await page.locator('#cs-layout-format').selectOption('1080x1920');
      await caption.fill(captions[lang][0]);
      await page.locator('#cs-shot-headline').fill(headlines[lang][0]);
      if (lang === 'en') {
        const state = () => page.evaluate(() => window.studioApp.layoutEditor.resolved);
        await page.locator('#cs-layout-anchor').selectOption('bottom');
        let { blocks, warnings: found } = await state();
        assert.ok(found.some(warning => warning.type === 'overlap'));
        assert.ok(!intersect(blocks.title, blocks.subject) && !intersect(blocks.title, blocks.caption));
        await page.locator('#cs-layout-overlap').check();
        ({ blocks, warnings: found } = await state());
        assert.ok(!intersect(blocks.title, blocks.caption));
        await page.locator('#cs-layout-anchor').selectOption('');
        await page.locator('#cs-layout-overlap').uncheck();
        await page.locator('#cs-layout-align').selectOption('right');
        assert.equal((await state()).blocks.title.align, 'right');
        await page.locator('#cs-layout-distribute').click();
        ({ blocks } = await state());
        const gap1 = blocks.subject.y - blocks.title.y - blocks.title.height;
        const gap2 = blocks.caption.y - blocks.subject.y - blocks.subject.height;
        assert.ok(gap1 >= 0 && Math.abs(gap1 - gap2) <= 1, JSON.stringify({ gap1, gap2 }));
        await page.locator('#cs-shot-headline').fill('Å👩‍💻'.repeat(350));
        assert.match(await warnings.innerText(), /minimum size/);
        await page.locator('#cs-shot-headline').fill(headlines[lang][0]);
      }
      await page.screenshot({ path: path.join(out, `viewport-${lang}-${width}.png`) });
      if (width <= 1024) await page.locator('#cs-btn-close-inspector').click();
      const [png] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-export-png').click()]);
      await png.saveAs(path.join(out, `viewport-${lang}-${width}-export.png`));
      const [archive] = await Promise.all([page.waitForEvent('download'), page.locator('#cs-btn-save-project').click()]);
      assert.match(archive.suggestedFilename(), /\.acstudio$/);
      assert.deepEqual(errors, []);
      result.push({ lang, viewport: [width, height], textAndFormatChecks: checks, archiveDownload: true });
      await context.close();
    }

    const tool = await browser.newPage({ acceptDownloads: true });
    await tool.goto(base + '/image-compressor/');
    await tool.locator('#img-file-input').setInputFiles(path.join(phase, 'evidence/image-compressor-reel/sample-alpine-lake.png'));
    await tool.locator('#output-format').selectOption('image/webp');
    await tool.locator('#btn-compress').click();
    const savings = tool.locator('#savings-pct');
    await savings.waitFor();
    assert.equal(await savings.innerText(), '-90.0%');
    await tool.locator('#img-result').screenshot({ path: path.join(out, 'compressor-existing-signed-number.png') });
    await fs.writeFile(path.join(out, 'viewport-locale-results.json'), JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
