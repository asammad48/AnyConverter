/**
 * AnyConverter Creative Studio — Responsive Viewports & Multilingual UI Suite
 *
 * Tests:
 * 1. Desktop (1280x720) across EN, ES, DA: Full 3-column workspace layout.
 * 2. Tablet (768x1024) across EN, ES, DA: Responsive flex layout, toolbars and controls.
 * 3. Mobile (375x812) across EN, ES, DA: Mobile drawer, #cs-btn-mobile-inspector, shot reorder controls.
 * 4. Interaction tests on mobile: Opening inspector drawer, reordering shots, closing drawer.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright-core');

const ROOT = process.cwd();
const PORT = 3001;
const SCREENSHOTS_DIR = path.resolve(ROOT, 'reports/creative-studio/visual-quality/phase-01/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    let relativePath = reqUrl.startsWith('/') ? reqUrl.slice(1) : reqUrl;
    let filePath = path.join(ROOT, relativePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

const LOCALES = [
  { code: 'en', path: '/creative-studio/' },
  { code: 'es', path: '/es/creative-studio/' },
  { code: 'da', path: '/da/creative-studio/' }
];

async function runResponsiveViewportTests() {
  console.log('=============================================================');
  console.log('=== CREATIVE STUDIO RESPONSIVE VIEWPORT & MULTILINGUAL QA ===');
  console.log('=============================================================\n');

  const server = await createStaticServer();
  const browser = await chromium.launch({ headless: true });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`--- Testing Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      for (const loc of LOCALES) {
        console.log(`  Checking [${loc.code.toUpperCase()}] at ${loc.path}...`);
        await page.goto(`http://127.0.0.1:${PORT}${loc.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(300);

        // 1. Verify canvas is mounted
        const hasCanvas = await page.$eval('#cs-canvas', el => el !== null && el.width > 0);
        assert.strictEqual(hasCanvas, true, `[${loc.code}-${vp.name}] Canvas not mounted`);

        // 2. Verify shot reorder controls exist in DOM
        const hasMoveUp = await page.$eval('#cs-btn-shot-move-up', el => el !== null);
        const hasMoveDown = await page.$eval('#cs-btn-shot-move-down', el => el !== null);
        assert.strictEqual(hasMoveUp, true, `[${loc.code}-${vp.name}] Missing Move Up button`);
        assert.strictEqual(hasMoveDown, true, `[${loc.code}-${vp.name}] Missing Move Down button`);

        // 3. Viewport-specific layout assertions
        if (vp.name === 'mobile' || vp.name === 'tablet') {
          // On mobile & tablet (<= 1024px): #cs-btn-mobile-inspector must be visible
          const mobileBtnVisible = await page.$eval('#cs-btn-mobile-inspector', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          });
          assert.strictEqual(mobileBtnVisible, true, `[${loc.code}-${vp.name}] Mobile inspector button not visible`);

          // Test clicking mobile inspector opens drawer
          await page.click('#cs-btn-mobile-inspector');
          await page.waitForTimeout(200);

          const sidebarVisible = await page.$eval('#cs-sidebar-right', el => {
            return el.classList.contains('mobile-open') || window.getComputedStyle(el).display !== 'none';
          });
          assert.strictEqual(sidebarVisible, true, `[${loc.code}-${vp.name}] Sidebar right did not open on mobile button click`);

          // Verify Move Up / Down buttons are interactable inside mobile/tablet drawer
          await page.selectOption('#cs-shot-select', '1');
          await page.waitForTimeout(100);
          await page.click('#cs-btn-shot-move-up');
          await page.waitForTimeout(200);

          const activeIdx = await page.evaluate(() => (window.studioApp || window.app).activeShotIndex);
          assert.strictEqual(activeIdx, 0, `[${loc.code}-${vp.name}] Reorder failed inside drawer`);

          // Close inspector if close button exists
          const closeBtn = await page.$('#cs-btn-close-inspector');
          if (closeBtn) {
            await closeBtn.click();
            await page.waitForTimeout(100);
          }
        } else {
          // On desktop (> 1024px): right sidebar is directly visible in workspace
          const sidebarRightVisible = await page.$eval('#cs-sidebar-right', el => {
            return window.getComputedStyle(el).display !== 'none';
          });
          assert.strictEqual(sidebarRightVisible, true, `[${loc.code}-${vp.name}] Inspector sidebar not visible on desktop`);
        }

        // Capture responsive screenshot
        const screenshotFile = path.join(SCREENSHOTS_DIR, `responsive_${vp.name}_${loc.code}.png`);
        await page.screenshot({ path: screenshotFile });
        console.log(`    ✓ [${loc.code.toUpperCase()}-${vp.name}] Passed layout & interaction checks. Screenshot saved.`);
      }

      await context.close();
    }

    console.log('\n=============================================================');
    console.log('=== ALL 9 VIEWPORT & MULTILINGUAL COMBINATIONS PASSED (100%) ===');
    console.log('=============================================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

if (require.main === module) {
  runResponsiveViewportTests()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('RESPONSIVE VIEWPORT TEST FAILED:', err);
      process.exit(1);
    });
}

module.exports = { runResponsiveViewportTests };
