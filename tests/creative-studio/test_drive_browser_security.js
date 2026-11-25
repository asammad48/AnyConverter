const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('================================================================');
  console.log(' DRIVE SECURITY & BROWSER-COMPATIBILITY VERIFICATION IN CHROMIUM');
  console.log('================================================================');

  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
    if (req.url === '/' || req.url === '/creative-studio/') {
      filePath = path.join(process.cwd(), 'creative-studio/index.html');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeMap = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }).listen(3000);

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });

  try {
    const page = await browser.newPage();
    page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err));
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    await page.goto('http://localhost:3000/creative-studio/');

    // Inject drive-sync-adapter.js
    const driveJs = fs.readFileSync('assets/js/creative-studio/drive-sync-adapter.js', 'utf8');
    await page.addScriptTag({ content: driveJs });

    const results = await page.evaluate(async () => {
      const tests = [];

      // Test 1: Instantiation & native browser types check
      try {
        const adapter = new window.DriveSyncAdapter();
        tests.push({
          name: 'T1_Instantiation',
          pass: adapter instanceof window.DriveSyncAdapter && !adapter.isAuthenticated()
        });
      } catch (e) {
        tests.push({ name: 'T1_Instantiation', pass: false, error: e.message });
      }

      // Test 2: OWNER_CONFIG_REQUIRED when connecting without client ID
      try {
        const adapter = new window.DriveSyncAdapter();
        let threw = false;
        let errCode = null;
        try {
          await adapter.connectDrive();
        } catch (e) {
          threw = true;
          errCode = e.code || e.message;
        }
        tests.push({
          name: 'T2_OwnerConfigRequired',
          pass: threw && errCode.includes('OWNER_CONFIG_REQUIRED')
        });
      } catch (e) {
        tests.push({ name: 'T2_OwnerConfigRequired', pass: false, error: e.message });
      }

      // Test 3: Security: Rejection of untrusted origins (B06)
      try {
        const adapter = new window.DriveSyncAdapter();
        adapter.setAuthToken('mock_secret_token_abc');
        let threw = false;
        let errMsg = '';
        try {
          await adapter.authorizedFetch('https://attacker.evil.com/drive/v3/files');
        } catch (e) {
          threw = true;
          errMsg = e.message;
        }
        tests.push({
          name: 'T3_RejectUntrustedOrigin',
          pass: threw && errMsg.includes('SECURITY_VIOLATION')
        });
      } catch (e) {
        tests.push({ name: 'T3_RejectUntrustedOrigin', pass: false, error: e.message });
      }

      // Test 4: Security: Rejection of non-HTTPS endpoints
      try {
        const adapter = new window.DriveSyncAdapter();
        adapter.setAuthToken('mock_secret_token_abc');
        let threw = false;
        let errMsg = '';
        try {
          await adapter.authorizedFetch('http://www.googleapis.com/drive/v3/files');
        } catch (e) {
          threw = true;
          errMsg = e.message;
        }
        tests.push({
          name: 'T4_RejectHttpNonHttps',
          pass: threw && errMsg.includes('SECURITY_VIOLATION')
        });
      } catch (e) {
        tests.push({ name: 'T4_RejectHttpNonHttps', pass: false, error: e.message });
      }

      // Test 5: Security: Rejection of unauthorized API path prefix
      try {
        const adapter = new window.DriveSyncAdapter();
        adapter.setAuthToken('mock_secret_token_abc');
        let threw = false;
        let errMsg = '';
        try {
          await adapter.authorizedFetch('https://www.googleapis.com/oauth2/v1/userinfo');
        } catch (e) {
          threw = true;
          errMsg = e.message;
        }
        tests.push({
          name: 'T5_RejectUnauthorizedPath',
          pass: threw && errMsg.includes('SECURITY_VIOLATION')
        });
      } catch (e) {
        tests.push({ name: 'T5_RejectUnauthorizedPath', pass: false, error: e.message });
      }

      // Test 6: Browser-safe Multipart Creation (Zero Node Buffer in browser)
      try {
        let interceptedBody = null;
        let interceptedHeaders = null;
        const mockFetcher = async (url, opts) => {
          interceptedBody = opts.body;
          interceptedHeaders = opts.headers;
          return {
            ok: true,
            status: 200,
            json: async () => ({ id: 'file-12345', name: 'browser_test.txt' })
          };
        };

        const adapter = new window.DriveSyncAdapter({ fetcher: mockFetcher });
        adapter.setAuthToken('mock_valid_token');

        const testContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
        const res = await adapter.createFile({
          name: 'browser_test.txt',
          mimeType: 'text/plain',
          content: testContent
        });

        const isUint8OrBlob = (interceptedBody instanceof Uint8Array) || (interceptedBody instanceof Blob);
        const hasAuthHeader = interceptedHeaders['Authorization'] === 'Bearer mock_valid_token';

        tests.push({
          name: 'T6_BrowserSafeMultipartUpload',
          pass: res.id === 'file-12345' && isUint8OrBlob && hasAuthHeader
        });
      } catch (e) {
        tests.push({ name: 'T6_BrowserSafeMultipartUpload', pass: false, error: e.message });
      }

      // Test 7: Disconnect purges token from memory
      try {
        const adapter = new window.DriveSyncAdapter();
        adapter.setAuthToken('test_token');
        const beforeAuth = adapter.isAuthenticated();
        adapter.disconnectDrive();
        const afterAuth = adapter.isAuthenticated();

        tests.push({
          name: 'T7_DisconnectPurgesToken',
          pass: beforeAuth === true && afterAuth === false
        });
      } catch (e) {
        tests.push({ name: 'T7_DisconnectPurgesToken', pass: false, error: e.message });
      }

      return tests;
    });

    console.log('Chromium Test Results:');
    let allPass = true;
    for (const t of results) {
      console.log(`  [${t.pass ? 'PASS' : 'FAIL'}] ${t.name}${t.error ? ' - ' + t.error : ''}`);
      if (!t.pass) allPass = false;
    }

    if (!allPass) {
      process.exitCode = 1;
    } else {
      console.log('\nAll 7 Drive browser security tests PASSED in genuine Chromium page.');
    }
  } finally {
    await browser.close();
    server.close();
  }
})();
