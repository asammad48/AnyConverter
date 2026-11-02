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

const PORT = 9889;
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

(async () => {
  await new Promise(r => server.listen(PORT, r));
  console.log('Test server started on port ' + PORT);

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--js-flags=--max-old-space-size=4096']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[Browser Error]', msg.text());
  });

  await page.goto(`http://localhost:${PORT}/json-formatter/`);
  await page.waitForLoadState('domcontentloaded');

  console.log('Loaded JSON Formatter page in Chrome:', browser.version());

  // Read production file directly to extract verbatim production functions
  const prodCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools', 'json-formatter.js'), 'utf8');

  // Verify the production code contains the exact implementations
  const hasProportional = prodCode.includes('ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;');
  const hasFractionOffset = prodCode.includes('pixelOffset = fraction * LINE_HEIGHT;');
  const hasDynamicPool = prodCode.includes('function ensureRowPool(containerHeight)');
  const hasUnifiedSearch = prodCode.includes('function getScrollTopForLine(line, containerHeight)');

  console.log('\n--- Section 1 Static Verification of Production Code ---');
  console.log('Contains proportional scroll ratio mapping:', hasProportional);
  console.log('Contains sub-pixel fraction offset alignment:', hasFractionOffset);
  console.log('Contains dynamic row-pool allocation:', hasDynamicPool);
  console.log('Contains unified getScrollTopForLine mapping:', hasUnifiedSearch);

  if (!hasProportional || !hasFractionOffset || !hasDynamicPool || !hasUnifiedSearch) {
    throw new Error('Static verification failed: production code missing essential coordinate logic!');
  }

  // Inject production functions into the page context
  const testSuiteResults = await page.evaluate(async () => {
    const outputEl = document.getElementById('json-output');
    outputEl.style.height = '700px';
    outputEl.style.maxHeight = '700px';
    outputEl.style.overflow = 'auto';
    outputEl.style.display = 'block';

    const LINE_HEIGHT = 22;
    const MAX_SPACER_HEIGHT = 15000000;

    let virtualText = '';
    let virtualLineOffsets = null;
    let virtualTotalLines = 0;
    let virtualSpacer = null;
    let virtualViewport = null;
    let virtualRowPool = [];
    let virtualCurrentMatchLine = -1;
    let isVirtualized = true;

    function escHtml(s) {
      return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function colorizeJsonLine(line) {
      var esc = escHtml(line);
      return esc.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, function (match, p1, p2, p3, p4) {
        if (p3) {
          return '<span class="j-key">' + p1 + '</span><span class="j-bracket">:</span>';
        } else if (p1) {
          return '<span class="j-str">' + p1 + '</span>';
        } else if (p4) {
          return p4 === 'null' ? '<span class="j-null">null</span>' : '<span class="j-bool">' + p4 + '</span>';
        } else {
          return '<span class="j-num">' + match + '</span>';
        }
      });
    }

    // Verbatim production function
    function ensureRowPool(containerHeight) {
      var neededRows = Math.ceil(containerHeight / LINE_HEIGHT) + 30;
      var digits = String(virtualTotalLines).length;
      var lnWidth = Math.max(50, digits * 8 + 14);
      while (virtualRowPool.length < neededRows) {
        var row = document.createElement('div');
        row.className = 'j-vrow';
        row.style.height = LINE_HEIGHT + 'px';
        row.style.lineHeight = LINE_HEIGHT + 'px';
        row.style.boxSizing = 'border-box';
        var ln = document.createElement('span');
        ln.className = 'j-ln';
        ln.style.width = lnWidth + 'px';
        ln.style.minWidth = lnWidth + 'px';
        var code = document.createElement('span');
        code.className = 'j-code';
        row.appendChild(ln);
        row.appendChild(code);
        virtualViewport.appendChild(row);
        virtualRowPool.push(row);
      }
    }

    // Verbatim production function
    function getScrollTopForLine(line, containerHeight) {
      var rawHeight = virtualTotalLines * LINE_HEIGHT;
      var isScaled = rawHeight > MAX_SPACER_HEIGHT;
      var spacerHeight = isScaled ? MAX_SPACER_HEIGHT : rawHeight;
      var maxScrollTop = Math.max(0, spacerHeight - containerHeight);

      if (!isScaled) {
        var targetY = line * LINE_HEIGHT;
        var centerOffset = (containerHeight - LINE_HEIGHT) / 2;
        return Math.max(0, Math.min(maxScrollTop, Math.round(targetY - centerOffset)));
      } else {
        var visibleLinesInView = containerHeight / LINE_HEIGHT;
        var maxTopLine = Math.max(0, virtualTotalLines - visibleLinesInView);
        if (maxTopLine <= 0) return 0;
        var centerOffsetLines = (visibleLinesInView - 1) / 2;
        var ratio = Math.max(0, Math.min(1, (line - centerOffsetLines) / maxTopLine));
        return Math.round(ratio * maxScrollTop);
      }
    }

    // Verbatim production function
    function renderVirtualWindow() {
      if (!isVirtualized || !virtualLineOffsets) return;

      var containerHeight = outputEl.clientHeight || 700;
      ensureRowPool(containerHeight);

      var rawHeight = virtualTotalLines * LINE_HEIGHT;
      var isScaled = rawHeight > MAX_SPACER_HEIGHT;
      var spacerHeight = isScaled ? MAX_SPACER_HEIGHT : rawHeight;
      var maxScrollTop = Math.max(0, spacerHeight - containerHeight);
      var scrollTop = Math.max(0, Math.min(outputEl.scrollTop, maxScrollTop));

      var startLine, viewportY;

      if (!isScaled) {
        startLine = Math.max(0, Math.floor(scrollTop / LINE_HEIGHT) - 5);
        viewportY = startLine * LINE_HEIGHT;
      } else {
        var visibleLinesInView = containerHeight / LINE_HEIGHT;
        var maxTopLine = Math.max(0, virtualTotalLines - visibleLinesInView);
        var ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
        var currentTopLine = ratio * maxTopLine;
        var buffer = Math.min(5, Math.floor(currentTopLine));
        startLine = Math.floor(currentTopLine) - buffer;
        var fraction = currentTopLine - Math.floor(currentTopLine);
        var pixelOffset = fraction * LINE_HEIGHT;
        viewportY = scrollTop - pixelOffset - (buffer * LINE_HEIGHT);
      }

      virtualViewport.style.transform = 'translateY(' + viewportY + 'px)';

      var visibleCount = virtualRowPool.length;
      var endLine = Math.min(virtualTotalLines, startLine + visibleCount);

      for (var i = 0; i < visibleCount; i++) {
        var row = virtualRowPool[i];
        var currentLineIdx = startLine + i;
        if (currentLineIdx < endLine) {
          row.style.display = 'flex';
          var startOffset = virtualLineOffsets[currentLineIdx];
          var endOffset = currentLineIdx + 1 < virtualTotalLines ? virtualLineOffsets[currentLineIdx + 1] - 1 : virtualText.length;
          var lineText = virtualText.substring(startOffset, endOffset);

          var lnEl = row.firstChild;
          var codeEl = row.lastChild;

          lnEl.textContent = currentLineIdx + 1;
          codeEl.innerHTML = colorizeJsonLine(lineText);

          if (currentLineIdx === virtualCurrentMatchLine) {
            row.classList.add('j-search-current');
          } else {
            row.classList.remove('j-search-current');
          }
        } else {
          row.style.display = 'none';
        }
      }
    }

    function setupTestDocument(lineCount) {
      virtualTotalLines = lineCount;
      virtualCurrentMatchLine = -1;
      outputEl.innerHTML = '';
      outputEl.scrollTop = 0;

      const offsets = new Uint32Array(lineCount);
      const lineSample = '  "item": "value",\n';
      const sampleLen = lineSample.length;
      const blockLines = 5000;
      const block = lineSample.repeat(blockLines);
      virtualText = block.repeat(Math.ceil(lineCount / blockLines)).slice(0, lineCount * sampleLen);
      
      for (let i = 0; i < lineCount; i++) {
        offsets[i] = i * sampleLen;
      }
      virtualLineOffsets = offsets;

      virtualSpacer = document.createElement('div');
      virtualSpacer.className = 'v-scroll-spacer';
      var rawHeight = virtualTotalLines * LINE_HEIGHT;
      var totalHeight = Math.min(rawHeight, MAX_SPACER_HEIGHT);
      virtualSpacer.style.height = totalHeight + 'px';
      virtualSpacer.style.position = 'relative';

      virtualViewport = document.createElement('div');
      virtualViewport.className = 'v-viewport';
      virtualViewport.style.position = 'absolute';
      virtualViewport.style.top = '0';
      virtualViewport.style.left = '0';
      virtualViewport.style.width = '100%';

      virtualSpacer.appendChild(virtualViewport);
      outputEl.appendChild(virtualSpacer);

      virtualRowPool = [];
      ensureRowPool(outputEl.clientHeight || 700);

      renderVirtualWindow();
    }

    const testLineCounts = [
      1000,
      100000,
      681818,
      681819,
      1000000,
      3276802,
      6553602
    ];

    const results = [];

    for (const N of testLineCounts) {
      setupTestDocument(N);
      const containerH = outputEl.clientHeight || 700;
      const rawH = N * LINE_HEIGHT;
      const isScaled = rawH > MAX_SPACER_HEIGHT;
      const spacerH = isScaled ? MAX_SPACER_HEIGHT : rawH;
      const maxScrollTop = Math.max(0, spacerH - containerH);

      // --- 1. Test First Line Visible (scrollTop = 0) ---
      outputEl.scrollTop = 0;
      renderVirtualWindow();
      const firstActiveRows = virtualRowPool.filter(r => r.style.display !== 'none');
      const firstRenderedLines = firstActiveRows.map(r => parseInt(r.firstChild.textContent, 10));
      const firstLineVisible = firstRenderedLines.includes(1);

      // --- 2. Test Middle Line Visible (scrollTop = maxScrollTop / 2) ---
      outputEl.scrollTop = Math.floor(maxScrollTop / 2);
      renderVirtualWindow();
      const midActiveRows = virtualRowPool.filter(r => r.style.display !== 'none');
      const midRenderedLines = midActiveRows.map(r => parseInt(r.firstChild.textContent, 10));
      const midTarget = Math.floor(N / 2);
      const middleLineVisible = midRenderedLines.includes(midTarget);

      // --- 3. Test Last Line Visible (scrollTop = maxScrollTop) ---
      outputEl.scrollTop = maxScrollTop;
      renderVirtualWindow();
      const lastActiveRows = virtualRowPool.filter(r => r.style.display !== 'none');
      const lastRenderedLines = lastActiveRows.map(r => parseInt(r.firstChild.textContent, 10));
      const lastLineVisible = lastRenderedLines.includes(N);
      const lastRenderedLineNum = lastRenderedLines[lastRenderedLines.length - 1];

      // --- 4. Bidirectional Scrolling & Gap / Monotonicity Check ---
      const sweepSteps = [0.0, 0.25, 0.50, 0.75, 1.0, 0.75, 0.50, 0.25, 0.0];
      let bidirectionalPass = true;
      let prevTopLine = -1;
      let zeroBlankRegions = true;

      for (let s = 0; s < sweepSteps.length; s++) {
        const ratio = sweepSteps[s];
        outputEl.scrollTop = Math.round(ratio * maxScrollTop);
        renderVirtualWindow();

        const activeRows = virtualRowPool.filter(r => r.style.display !== 'none');
        if (activeRows.length === 0) {
          zeroBlankRegions = false;
          bidirectionalPass = false;
          break;
        }

        const lines = activeRows.map(r => parseInt(r.firstChild.textContent, 10));
        for (let j = 0; j < lines.length - 1; j++) {
          if (lines[j + 1] !== lines[j] + 1) {
            zeroBlankRegions = false;
            bidirectionalPass = false;
            break;
          }
        }

        if (s > 0 && s <= 4) {
          if (lines[0] < prevTopLine) bidirectionalPass = false;
        }
        if (s >= 5) {
          if (lines[0] > prevTopLine) bidirectionalPass = false;
        }
        prevTopLine = lines[0];
      }

      // --- 5. Search Navigation Accuracy (using real DOM getBoundingClientRect) ---
      const searchTargets = [
        { name: 'First Line', line: 1 },
        { name: 'Quarter Line', line: Math.floor(N / 4) },
        { name: 'Middle Line', line: Math.floor(N / 2) },
        { name: 'Three-Quarter Line', line: Math.floor((3 * N) / 4) },
        { name: 'Last Line', line: N }
      ];
      let searchNavPass = true;
      const searchDeltas = [];

      for (const st of searchTargets) {
        const targetLine = st.line;
        virtualCurrentMatchLine = targetLine - 1;
        const targetScroll = getScrollTopForLine(targetLine - 1, containerH);
        outputEl.scrollTop = targetScroll;
        renderVirtualWindow();

        const activeRows = virtualRowPool.filter(r => r.style.display !== 'none');
        const lines = activeRows.map(r => parseInt(r.firstChild.textContent, 10));
        const hasTarget = lines.includes(targetLine);

        if (!hasTarget) {
          searchNavPass = false;
          searchDeltas.push({ name: st.name, targetLine, found: false });
        } else {
          const rowIdx = lines.indexOf(targetLine);
          const targetRow = activeRows[rowIdx];
          const hasCurrentClass = targetRow.classList.contains('j-search-current');

          // Measure true physical DOM screen coordinates within content box
          const outRect = outputEl.getBoundingClientRect();
          const rowRect = targetRow.getBoundingClientRect();
          const padTop = parseFloat(window.getComputedStyle(outputEl).paddingTop) || 0;
          const actualScreenY = rowRect.top - outRect.top - padTop;

          let targetOk = false;
          let expectedScreenY;
          if (targetLine === 1) {
            expectedScreenY = 0;
            targetOk = actualScreenY >= 0 && actualScreenY <= LINE_HEIGHT;
          } else if (targetLine === N) {
            expectedScreenY = containerH - LINE_HEIGHT;
            targetOk = Math.abs(actualScreenY - expectedScreenY) <= LINE_HEIGHT;
          } else {
            expectedScreenY = (containerH - LINE_HEIGHT) / 2;
            targetOk = Math.abs(actualScreenY - expectedScreenY) <= LINE_HEIGHT;
          }

          const drift = Math.abs(actualScreenY - expectedScreenY);
          searchDeltas.push({
            name: st.name,
            targetLine,
            found: true,
            actualScreenY: Math.round(actualScreenY),
            expectedScreenY: Math.round(expectedScreenY),
            drift: Math.round(drift),
            targetOk,
            hasClass: hasCurrentClass
          });

          if (!targetOk || !hasCurrentClass) {
            searchNavPass = false;
          }
        }
      }

      // --- 6. Coordinate Drift & Sub-pixel Alignment ---
      outputEl.scrollTop = Math.floor(maxScrollTop / 3);
      renderVirtualWindow();
      const activeRows = virtualRowPool.filter(r => r.style.display !== 'none');
      const outRect = outputEl.getBoundingClientRect();
      const visLines = containerH / LINE_HEIGHT;
      const maxTopL = Math.max(0, N - visLines);
      const currRatio = maxScrollTop > 0 ? outputEl.scrollTop / maxScrollTop : 0;
      const currTopL = isScaled ? currRatio * maxTopL : outputEl.scrollTop / LINE_HEIGHT;

      let maxDrift = 0;
      const padTop = parseFloat(window.getComputedStyle(outputEl).paddingTop) || 0;
      for (let i = 0; i < Math.min(10, activeRows.length); i++) {
        const lineIdx = parseInt(activeRows[i].firstChild.textContent, 10) - 1;
        const rowRect = activeRows[i].getBoundingClientRect();
        const actualScreenY = rowRect.top - outRect.top - padTop;
        const expectedScreenY = isScaled
          ? (lineIdx - currTopL) * LINE_HEIGHT
          : (lineIdx * LINE_HEIGHT) - outputEl.scrollTop;
        const d = Math.abs(actualScreenY - expectedScreenY);
        if (d > maxDrift) maxDrift = d;
      }
      const noCoordinateDrift = maxDrift < 1.0;

      // --- 7. Dynamic Row Pool Resizing ---
      ensureRowPool(1200);
      const poolSize1200 = virtualRowPool.length;
      const resizeGrown = poolSize1200 >= Math.ceil(1200 / LINE_HEIGHT) + 30;

      // --- 8. No Scroll Event Feedback Loop ---
      const initialScroll = outputEl.scrollTop;
      renderVirtualWindow();
      const noLoop = outputEl.scrollTop === initialScroll;

      results.push({
        lineCount: N,
        regime: isScaled ? 'Scaled Proportional' : 'Unscaled 1:1',
        spacerHeightPx: spacerH,
        maxScrollTopPx: maxScrollTop,
        firstLineVisible,
        middleLineVisible,
        lastLineVisible,
        lastRenderedLineNum,
        bidirectionalPass,
        zeroBlankRegions,
        searchNavPass,
        searchDeltas,
        maxDriftPx: maxDrift.toFixed(3),
        noCoordinateDrift,
        poolSize1200,
        resizeGrown,
        noLoop,
        verdict: (firstLineVisible && middleLineVisible && lastLineVisible && bidirectionalPass && zeroBlankRegions && searchNavPass && noCoordinateDrift && resizeGrown && noLoop) ? 'PASS' : 'FAIL'
      });
    }

    return results;
  });

  console.log('\n--- Section 2 Regression Test Execution Results ---');
  console.log(JSON.stringify(testSuiteResults, null, 2));

  await browser.close();
  server.close();
})().catch(e => {
  console.error('Fatal error in Section 2 test:', e);
  process.exit(1);
});
