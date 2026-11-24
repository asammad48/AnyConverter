const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const PORT = 3000;
const ROOT = process.cwd();
const REPORT_DIR = path.resolve(ROOT, 'reports/creative-studio/live-localhost-qa/2026-11-25-audit');
const SCREENSHOT_DIR = path.join(REPORT_DIR, 'screenshots');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.acstudio': 'application/zip'
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) {
      reqUrl += 'index.html';
    }
    const relativePath = reqUrl.startsWith('/') ? reqUrl.slice(1) : reqUrl;
    const filePath = path.join(ROOT, relativePath);

    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested URL ${reqUrl} was not found on this server.</p></body></html>`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Listening on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function runAudit() {
  const server = await createStaticServer();

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(10000);

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('requestfailed', req => networkErrors.push(`FAIL: ${req.method()} ${req.url()} - ${req.failure()?.errorText}`));

  const auditResults = {
    homepage: {},
    creativeStudioRoutes: {},
    existingTools: {}
  };

  try {
    // 1. Audit Homepage
    console.log('[Audit] Navigating to http://127.0.0.1:3000/');
    const homeRes = await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
    auditResults.homepage.status = homeRes.status();
    auditResults.homepage.title = await page.title();
    console.log(`[Audit] Homepage title: "${auditResults.homepage.title}", status: ${auditResults.homepage.status}`);
    
    // Screenshot homepage
    const homeScreenshot = path.join(SCREENSHOT_DIR, '01_homepage.png');
    await page.screenshot({ path: homeScreenshot, fullPage: false });
    auditResults.homepage.screenshot = homeScreenshot;

    // Check all visible tool links on homepage
    const toolCards = await page.$$eval('a[href]', links => links.map(l => ({ text: l.innerText.trim(), href: l.getAttribute('href') })));
    auditResults.homepage.totalNavLinks = toolCards.length;
    auditResults.homepage.creativeLinksFound = toolCards.filter(l => /creative|studio/i.test(l.text) || /creative|studio/i.test(l.href));
    console.log(`[Audit] Total nav links: ${toolCards.length}, Creative Studio links: ${auditResults.homepage.creativeLinksFound.length}`);

    // Check if "creative studio" text appears anywhere on homepage
    auditResults.homepage.pageTextMentionsCreative = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return {
        creativeStudio: text.includes('creative studio'),
        creative: text.includes('creative'),
        studio: text.includes('studio')
      };
    });
    console.log('[Audit] Page text mentions:', JSON.stringify(auditResults.homepage.pageTextMentionsCreative));

    // 2. Audit Creative Studio routes
    const routesToTest = [
      '/creative-studio/',
      '/creative-studio/index.html',
      '/es/creative-studio/',
      '/da/creative-studio/',
      '/thumbnail-maker/',
      '/business-card-maker/',
      '/qr-business-card/',
      '/animated-text-video-maker/',
      '/video-editor/',
      '/2d-animation-maker/',
      '/3d-animation-maker/',
      '/ai-video-creator/',
      '/editable-video-project/'
    ];

    for (const route of routesToTest) {
      console.log(`[Audit] Navigating to http://127.0.0.1:3000${route}`);
      const res = await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'domcontentloaded' });
      const status = res.status();
      const content = await page.content();
      const is404 = status === 404 || content.includes('404 Not Found');
      auditResults.creativeStudioRoutes[route] = {
        status,
        is404,
        contentLength: content.length
      };

      if (route === '/creative-studio/' || route === '/creative-studio/index.html') {
        const screenPath = path.join(SCREENSHOT_DIR, `03_route_${route.replace(/[\/\.]/g, '_')}.png`);
        await page.screenshot({ path: screenPath });
        auditResults.creativeStudioRoutes[route].screenshot = screenPath;
      }
    }

    // 3. Test an existing tool: json-formatter
    console.log('[Audit] Testing existing tool: /json-formatter/');
    const jsonRes = await page.goto('http://127.0.0.1:3000/json-formatter/', { waitUntil: 'domcontentloaded' });
    auditResults.existingTools.jsonFormatter = {
      status: jsonRes.status(),
      title: await page.title()
    };
    const jsonScreen = path.join(SCREENSHOT_DIR, '04_existing_tool_json_formatter.png');
    await page.screenshot({ path: jsonScreen });
    auditResults.existingTools.jsonFormatter.screenshot = jsonScreen;

    // 4. Test loading Creative Studio JavaScript in browser context
    console.log('[Audit] Testing assets/js/creative-studio/ modules in browser context...');
    const browserEvalResults = await page.evaluate(async () => {
      const results = {};
      
      // Browser capabilities
      results.requireDefinedInBrowser = typeof require !== 'undefined';
      results.cryptoSubtleAvailable = typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
      results.videoEncoderAvailable = typeof VideoEncoder !== 'undefined';
      results.audioEncoderAvailable = typeof AudioEncoder !== 'undefined';
      results.offscreenCanvasAvailable = typeof OffscreenCanvas !== 'undefined';
      results.ndefReaderAvailable = typeof NDEFReader !== 'undefined';

      // Test dynamically fetching and evaluating archive.js
      try {
        const res = await fetch('/assets/js/creative-studio/archive.js');
        const code = await res.text();
        results.archiveFetchStatus = res.status;
        try {
          const fn = new Function(code);
          fn();
          results.archiveExecution = 'SUCCESS';
        } catch (evalErr) {
          results.archiveExecution = `ERROR: ${evalErr.name} - ${evalErr.message}`;
        }
      } catch (e) {
        results.archiveFetchError = e.message;
      }

      // Test dynamically fetching and evaluating graphics-canvas.js
      try {
        const res = await fetch('/assets/js/creative-studio/graphics-canvas.js');
        const code = await res.text();
        results.graphicsCanvasFetchStatus = res.status;
        try {
          const fn = new Function(code);
          fn();
          results.graphicsCanvasExecution = 'SUCCESS';
        } catch (evalErr) {
          results.graphicsCanvasExecution = `ERROR: ${evalErr.name} - ${evalErr.message}`;
        }
      } catch (e) {
        results.graphicsCanvasFetchError = e.message;
      }

      // Test dynamically fetching and evaluating render-adapter.js
      try {
        const res = await fetch('/assets/js/creative-studio/render-adapter.js');
        const code = await res.text();
        results.renderAdapterFetchStatus = res.status;
        try {
          const fn = new Function(code);
          fn();
          results.renderAdapterExecution = 'SUCCESS';
        } catch (evalErr) {
          results.renderAdapterExecution = `ERROR: ${evalErr.name} - ${evalErr.message}`;
        }
      } catch (e) {
        results.renderAdapterFetchError = e.message;
      }

      // Test dynamically fetching and evaluating business-card.js
      try {
        const res = await fetch('/assets/js/creative-studio/business-card.js');
        const code = await res.text();
        results.businessCardFetchStatus = res.status;
        try {
          const fn = new Function(code);
          fn();
          results.businessCardExecution = 'SUCCESS';
        } catch (evalErr) {
          results.businessCardExecution = `ERROR: ${evalErr.name} - ${evalErr.message}`;
        }
      } catch (e) {
        results.businessCardFetchError = e.message;
      }

      // Test dynamically fetching and evaluating qr-vcard.js
      try {
        const res = await fetch('/assets/js/creative-studio/qr-vcard.js');
        const code = await res.text();
        results.qrVcardFetchStatus = res.status;
        try {
          const fn = new Function(code);
          fn();
          results.qrVcardExecution = 'SUCCESS';
        } catch (evalErr) {
          results.qrVcardExecution = `ERROR: ${evalErr.name} - ${evalErr.message}`;
        }
      } catch (e) {
        results.qrVcardFetchError = e.message;
      }

      return results;
    });

    auditResults.browserModuleEvaluation = browserEvalResults;

  } finally {
    await browser.close();
    server.close();
  }

  auditResults.consoleLogs = consoleLogs;
  auditResults.networkErrors = networkErrors;

  fs.writeFileSync(
    path.join(REPORT_DIR, 'initial_live_probe_results.json'),
    JSON.stringify(auditResults, null, 2)
  );

  console.log('[Audit] Live probe complete! Results saved to initial_live_probe_results.json');
}

runAudit().catch(err => {
  console.error('[Audit Error]', err);
  process.exit(1);
});
