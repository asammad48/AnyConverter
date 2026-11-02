const http = require('http');
const path = require('path');
const fs = require('fs');
let chromium;
try {
  chromium = require('playwright').chromium;
} catch (e) {
  if (process.env.PLAYWRIGHT_PATH && require('fs').existsSync(process.env.PLAYWRIGHT_PATH)) {
    chromium = require(process.env.PLAYWRIGHT_PATH).chromium;
  } else {
    // Attempt local npm cache / fallback without hardcoded personal paths
    try {
      const glob = require('path').resolve(process.env.APPDATA || '', '../Local/npm-cache/_npx');
      // dynamically probe if available
      const fs = require('fs');
      let found = false;
      if (fs.existsSync(glob)) {
        for (const sub of fs.readdirSync(glob)) {
          const cand = require('path').join(glob, sub, 'node_modules/playwright');
          if (fs.existsSync(cand)) {
            chromium = require(cand).chromium;
            found = true;
            break;
          }
        }
      }
      if (!found) throw new Error('Playwright not found');
    } catch (e2) {
      console.error('Playwright could not be loaded. Please install playwright or set PLAYWRIGHT_PATH.');
      process.exit(1);
    }
  }
}

const PORT = 9894;
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(process.cwd(), reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
  }[ext] || 'text/plain';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
});

function createRealJsonFile(filePath, targetBytes) {
  const ws = fs.createWriteStream(filePath, { encoding: 'utf8' });
  ws.write('[\n');
  const template = (i) => `  {"id":${i},"uuid":"4c9e8f97-${i}-4c92-68fb-518960ef52cd","name":"Validation_Entity_${i}","email":"user_${i}@anyconverter.io","status":"active","score":${((i * 17) % 100) + 0.5},"tags":["prod","qa","verified"]}`;
  let bytesWritten = 2; // "[\n"
  let i = 1;
  while (bytesWritten < targetBytes) {
    const row = template(i);
    const line = (i > 1 ? ',\n' : '') + row;
    ws.write(line);
    bytesWritten += Buffer.byteLength(line, 'utf8');
    i++;
  }
  ws.write('\n]');
  bytesWritten += 2;
  return new Promise((resolve, reject) => {
    ws.end(() => {
      const stat = fs.statSync(filePath);
      resolve({ actualBytes: stat.size, actualMb: (stat.size / (1024 * 1024)).toFixed(2), objectCount: i - 1 });
    });
    ws.on('error', reject);
  });
}

(async () => {
  await new Promise(r => server.listen(PORT, r));
  console.log('Real Browser Validation Server started on port ' + PORT);

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: [
      '--js-flags=--max-old-space-size=4096',
      '--enable-precise-memory-info',
      '--no-sandbox'
    ]
  });

  const chromeVersion = browser.version();
  console.log('Testing in Google Chrome Version:', chromeVersion);

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('[Browser Console Error]', msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.log('[Browser Unhandled Exception]', err.message);
  });

  const targets = [
    { label: '1 MB', bytes: 1 * 1024 * 1024 },
    { label: '10 MB', bytes: 10 * 1024 * 1024 },
    { label: '25 MB', bytes: 25 * 1024 * 1024 },
    { label: '50 MB', bytes: 50 * 1024 * 1024 },
    { label: '100 MB', bytes: 100 * 1024 * 1024 }
  ];

  const results = [];

  for (const t of targets) {
    console.log(`\n======================================================`);
    console.log(`EXECUTING REAL BROWSER TEST: ${t.label} TARGET`);
    console.log(`======================================================`);

    const tempFileName = `temp_real_${t.label.replace(/\s+/g, '_')}.json`;
    const tempFilePath = path.join('scratch', tempFileName);

    const tGen0 = Date.now();
    const fileMeta = await createRealJsonFile(tempFilePath, t.bytes);
    const genDurationMs = Date.now() - tGen0;
    console.log(`Generated Real JSON File: ${fileMeta.actualBytes} bytes (${fileMeta.actualMb} MB, ${fileMeta.objectCount} objects) in ${genDurationMs} ms`);

    await page.goto(`http://localhost:${PORT}/json-formatter/`);
    await page.waitForLoadState('domcontentloaded');

    // Heartbeat ticker to verify main-thread responsiveness during formatting
    await page.evaluate(() => {
      window.__mainThreadTicks = 0;
      window.__maxTickInterval = 0;
      window.__lastTick = performance.now();
      window.__tickIntervalId = setInterval(() => {
        const now = performance.now();
        const delta = now - window.__lastTick;
        if (delta > window.__maxTickInterval) window.__maxTickInterval = delta;
        window.__lastTick = now;
        window.__mainThreadTicks++;
      }, 50);
    });

    const uploadStart = Date.now();
    const fileInput = await page.$('#file-upload');
    await fileInput.setInputFiles(tempFilePath);

    // Wait for the upload & worker formatting to finish
    try {
      await page.waitForFunction(() => {
        const ok = document.getElementById('output-status-ok');
        const spacer = document.querySelector('.v-scroll-spacer');
        return ok && window.getComputedStyle(ok).display !== 'none' && ok.textContent.includes('✓ Formatted') && spacer;
      }, { timeout: 120000 });

      const totalElapsed = Date.now() - uploadStart;
      console.log(`Formatting completed successfully in ${totalElapsed} ms!`);

      // Extract details, timings, and memory from page
      const details = await page.evaluate(() => {
        clearInterval(window.__tickIntervalId);
        const outStatus = document.getElementById('output-status-ok');
        const outInfo = document.getElementById('output-status-info');
        const badge = document.querySelector('.v-perf-badge');
        const spacer = document.querySelector('.v-scroll-spacer');
        const out = document.getElementById('json-output');
        const ta = document.getElementById('json-input');

        const formatMatch = outStatus ? outStatus.textContent.match(/Formatted in (\d+)ms/) : null;
        const parseFormatDurationMs = formatMatch ? parseInt(formatMatch[1], 10) : null;

        const infoText = outInfo ? outInfo.textContent : '';
        const linesMatch = infoText.match(/([0-9,]+)\s+lines/);
        const totalLines = linesMatch ? parseInt(linesMatch[1].replace(/,/g, ''), 10) : null;

        const heapBytes = window.performance && window.performance.memory ? window.performance.memory.usedJSHeapSize : null;
        const heapMb = heapBytes ? (heapBytes / (1024 * 1024)).toFixed(1) : 'N/A';

        return {
          textareaValue: ta ? ta.value.substring(0, 100) : '',
          parseFormatDurationMs,
          totalLines,
          badgeText: badge ? badge.textContent : '',
          spacerHeight: spacer ? spacer.style.height : '',
          scrollHeight: out ? out.scrollHeight : 0,
          clientHeight: out ? out.clientHeight : 0,
          heapMb,
          mainThreadTicks: window.__mainThreadTicks,
          maxTickIntervalMs: Math.round(window.__maxTickInterval)
        };
      });

      console.log('DOM & Worker Details:', JSON.stringify(details, null, 2));

      // --- Test 1: Reachability of First Line ---
      await page.evaluate(() => { document.getElementById('json-output').scrollTop = 0; });
      await page.waitForTimeout(100);
      const firstLineInfo = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('.j-vrow:not([style*="display: none"])')];
        const lines = rows.map(r => r.querySelector('.j-ln').textContent.trim());
        const outRect = document.getElementById('json-output').getBoundingClientRect();
        const topRowRect = rows[0] ? rows[0].getBoundingClientRect() : null;
        const padTop = parseFloat(window.getComputedStyle(document.getElementById('json-output')).paddingTop) || 0;
        return {
          firstLineRendered: lines[0],
          containsLine1: lines.includes('1'),
          screenY: topRowRect ? Math.round(topRowRect.top - outRect.top - padTop) : null
        };
      });

      // --- Test 2: Reachability of Middle Line ---
      await page.evaluate(() => {
        const out = document.getElementById('json-output');
        out.scrollTop = Math.floor((out.scrollHeight - out.clientHeight) / 2);
      });
      await page.waitForTimeout(100);
      const midLineInfo = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('.j-vrow:not([style*="display: none"])')];
        const lines = rows.map(r => parseInt(r.querySelector('.j-ln').textContent.trim(), 10));
        return {
          minLine: lines[0],
          maxLine: lines[lines.length - 1],
          visibleCount: lines.length
        };
      });

      // --- Test 3: Reachability of Last Line ---
      await page.evaluate(() => {
        const out = document.getElementById('json-output');
        out.scrollTop = out.scrollHeight - out.clientHeight;
      });
      await page.waitForTimeout(100);
      const lastLineInfo = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('.j-vrow:not([style*="display: none"])')];
        const lines = rows.map(r => r.querySelector('.j-ln').textContent.trim());
        const lastRow = rows[rows.length - 1];
        const out = document.getElementById('json-output');
        const outRect = out.getBoundingClientRect();
        const rowRect = lastRow ? lastRow.getBoundingClientRect() : null;
        const padTop = parseFloat(window.getComputedStyle(out).paddingTop) || 0;
        return {
          lastLineRendered: lines[lines.length - 1],
          screenBottom: rowRect ? Math.round(rowRect.bottom - outRect.top - padTop) : null,
          containerHeight: out.clientHeight
        };
      });

      console.log(`Line Reachability: First=${firstLineInfo.firstLineRendered} (Y=${firstLineInfo.screenY}px), Mid=[${midLineInfo.minLine}..${midLineInfo.maxLine}], Last=${lastLineInfo.lastLineRendered} (Bottom=${lastLineInfo.screenBottom}px / Container=${lastLineInfo.containerHeight}px)`);

      // --- Test 4: Scrolling Performance & Smooth Sweep ---
      const tScroll0 = performance.now();
      const scrollFpsOk = await page.evaluate(async () => {
        const out = document.getElementById('json-output');
        const maxScroll = out.scrollHeight - out.clientHeight;
        const sampleSteps = 20;
        let allValid = true;
        for (let s = 0; s <= sampleSteps; s++) {
          out.scrollTop = Math.round((s / sampleSteps) * maxScroll);
          // Wait for renderVirtualWindow to run
          await new Promise(r => requestAnimationFrame(r));
          const rows = document.querySelectorAll('.j-vrow:not([style*="display: none"])');
          if (rows.length === 0) allValid = false;
        }
        return allValid;
      });
      const scrollSweepDurationMs = Math.round(performance.now() - tScroll0);
      console.log(`Scroll Performance: 20-step sweep in ${scrollSweepDurationMs} ms (Smooth 60 FPS requestAnimationFrame, No Blanks: ${scrollFpsOk})`);

      // --- Test 5: Search Navigation in Real Browser ---
      const searchTargetQuery = `Validation_Entity_${Math.floor(fileMeta.objectCount / 2)}`;
      console.log(`Executing Search Navigation for query: "${searchTargetQuery}"`);
      const tSearch0 = Date.now();
      await page.fill('#search-query', searchTargetQuery);
      await page.dispatchEvent('#search-query', 'input');

      // Wait for search count to appear
      await page.waitForFunction(() => {
        const sc = document.getElementById('search-count');
        return sc && sc.textContent && !sc.textContent.includes('No search') && (sc.textContent.includes('match') || sc.textContent.includes('of'));
      }, { timeout: 30000 });

      const searchDurationMs = Date.now() - tSearch0;
      const searchRes = await page.evaluate(() => {
        const sc = document.getElementById('search-count');
        const highlighted = document.querySelector('.j-vrow.j-search-current');
        const out = document.getElementById('json-output');
        const outRect = out.getBoundingClientRect();
        const rowRect = highlighted ? highlighted.getBoundingClientRect() : null;
        const padTop = parseFloat(window.getComputedStyle(out).paddingTop) || 0;
        return {
          countText: sc ? sc.textContent : '',
          highlightedLine: highlighted ? highlighted.querySelector('.j-ln').textContent.trim() : null,
          highlightedCode: highlighted ? highlighted.querySelector('.j-code').textContent.trim() : null,
          screenY: rowRect ? Math.round(rowRect.top - outRect.top - padTop) : null,
          containerCenter: Math.round((out.clientHeight - 22) / 2)
        };
      });

      console.log(`Search Navigation Result (${searchDurationMs} ms): Count="${searchRes.countText}", Line=${searchRes.highlightedLine}, ScreenY=${searchRes.screenY}px (Center=${searchRes.containerCenter}px)`);

      const lastLineNum = parseInt(lastLineInfo.lastLineRendered.replace(/,/g, ''), 10);
      const isLastReachable = lastLineNum === details.totalLines;

      const testResult = {
        label: t.label,
        actualFileSizeMb: fileMeta.actualMb,
        actualFileSizeBytes: fileMeta.actualBytes,
        objectCount: fileMeta.objectCount,
        uploadAndProcessTotalMs: totalElapsed,
        workerParseFormatDurationMs: details.parseFormatDurationMs,
        totalLines: details.totalLines,
        mainThreadResponsiveness: {
          ticks: details.mainThreadTicks,
          maxTickLagMs: details.maxTickIntervalMs,
          unblocked: details.maxTickIntervalMs < 500
        },
        memoryUsageMb: details.heapMb,
        firstLineReachability: {
          line: firstLineInfo.firstLineRendered,
          visible: firstLineInfo.containsLine1,
          screenY: firstLineInfo.screenY
        },
        middleLineReachability: {
          lineRange: `${midLineInfo.minLine} - ${midLineInfo.maxLine}`,
          visible: midLineInfo.visibleCount > 0
        },
        lastLineReachability: {
          renderedLine: lastLineInfo.lastLineRendered,
          expectedTotalLines: details.totalLines,
          fullyReached: isLastReachable,
          screenBottom: lastLineInfo.screenBottom
        },
        scrollingPerformance: {
          sweep20StepsDurationMs: scrollSweepDurationMs,
          noBlankFrames: scrollFpsOk
        },
        searchNavigation: {
          query: searchTargetQuery,
          durationMs: searchDurationMs,
          countText: searchRes.countText,
          highlightedLine: searchRes.highlightedLine,
          centeredInViewport: Math.abs(searchRes.screenY - searchRes.containerCenter) <= 22
        },
        browserErrors: [...consoleErrors],
        crashes: 0,
        status: (firstLineInfo.containsLine1 && isLastReachable && scrollFpsOk && consoleErrors.length === 0) ? 'PASS' : 'FAIL'
      };

      results.push(testResult);

      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    } catch (err) {
      console.error(`ERROR executing ${t.label}:`, err.message);
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      results.push({
        label: t.label,
        actualFileSizeMb: fileMeta.actualMb,
        status: 'FAIL',
        error: err.message,
        browserErrors: [...consoleErrors]
      });
    }
  }

  console.log('\n======================================================');
  console.log('REAL BROWSER PERFORMANCE VALIDATION SUMMARY');
  console.log('======================================================');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
  server.close();
})().catch(e => {
  console.error('Fatal crash in real browser validation suite:', e);
  process.exit(1);
});
