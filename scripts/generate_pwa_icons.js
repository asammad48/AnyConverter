const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function generate() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const svgPath = path.resolve('assets/img/favicon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Generate 192x192
  await page.setViewportSize({ width: 192, height: 192 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;overflow:hidden;width:192px;height:192px;">${svgContent}</body></html>`);
  await page.evaluate(() => {
    const s = document.querySelector('svg');
    if (s) {
      s.setAttribute('width', '192');
      s.setAttribute('height', '192');
    }
  });
  await page.screenshot({ path: path.resolve('assets/img/icon-192.png'), omitBackground: true });

  // Generate 512x512
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;overflow:hidden;width:512px;height:512px;">${svgContent}</body></html>`);
  await page.evaluate(() => {
    const s = document.querySelector('svg');
    if (s) {
      s.setAttribute('width', '512');
      s.setAttribute('height', '512');
    }
  });
  await page.screenshot({ path: path.resolve('assets/img/icon-512.png'), omitBackground: true });

  await browser.close();
  console.log('[SUCCESS] Generated assets/img/icon-192.png and assets/img/icon-512.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
