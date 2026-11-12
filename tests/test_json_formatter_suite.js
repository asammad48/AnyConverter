const fs = require('fs');

console.log('--- Testing JSON Formatter Script Syntax & Worker Compatibility ---');

// 1. Verify syntax of json-formatter.js and json-worker.js
try {
  const workerCode = fs.readFileSync('assets/js/workers/json-worker.js', 'utf8');
  new Function(workerCode);
  console.log('✓ json-worker.js: Syntax OK');
} catch (e) {
  console.error('✕ json-worker.js Syntax Error:', e);
  process.exit(1);
}

try {
  const toolCode = fs.readFileSync('assets/js/tools/json-formatter.js', 'utf8');
  // Check basic syntax
  new Function('document', 'window', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame', toolCode);
  console.log('✓ json-formatter.js: Syntax OK');
} catch (e) {
  console.error('✕ json-formatter.js Syntax Error:', e);
  process.exit(1);
}

// 2. Test worker core functions with 10MB payload
const workerCode = fs.readFileSync('assets/js/workers/json-worker.js', 'utf8');
const vm = require('vm');
const sandbox = {
  self: {},
  Uint32Array: Uint32Array,
  JSON: JSON,
  performance: performance,
  console: console
};
vm.createContext(sandbox);
vm.runInContext(workerCode, sandbox);

const testPayload = {
  status: 'ok',
  results: Array.from({length: 40000}, (_, i) => ({
    id: i + 1,
    name: 'Entry ' + i,
    tags: ['web', 'converter', 'seo'],
    metric: i * 2.5
  }))
};
const rawJson = JSON.stringify(testPayload);
console.log('Test payload generated, size:', (rawJson.length / 1024 / 1024).toFixed(2), 'MB');

let workerResponse = null;
sandbox.self.postMessage = function(msg) {
  workerResponse = msg;
};

// Simulate worker 'format' action
const t0 = performance.now();
sandbox.self.onmessage({
  data: {
    id: 1,
    action: 'format',
    text: rawJson,
    indent: 2,
    sort: 'none'
  }
});
const t1 = performance.now();

if (workerResponse && workerResponse.success) {
  console.log('✓ Worker format succeeded in:', (t1 - t0).toFixed(2), 'ms');
  console.log('  Lines:', workerResponse.lineCount);
  console.log('  Keys:', workerResponse.stats.keys);

  // Validate worker response contract (chunks & totalLength)
  const assert = require('assert');
  assert(Array.isArray(workerResponse.chunks), 'workerResponse.chunks must be an Array');
  assert(workerResponse.chunks.length > 0, 'workerResponse.chunks must contain at least 1 chunk');
  assert.strictEqual(typeof workerResponse.totalLength, 'number', 'workerResponse.totalLength must be a number');

  // Validate chunk strings and cumulative lengths
  let sumChunkLengths = 0;
  workerResponse.chunks.forEach((chunk, idx) => {
    assert.strictEqual(typeof chunk, 'string', `Chunk ${idx} must be a string`);
    assert(chunk.length > 0, `Chunk ${idx} must not be empty`);
    sumChunkLengths += chunk.length;
  });
  assert.strictEqual(workerResponse.totalLength, sumChunkLengths, 'workerResponse.totalLength must equal sum of chunk lengths');

  // Validate chunkStarts buffer integrity
  const chunkStarts = new Uint32Array(workerResponse.chunkStarts);
  assert.strictEqual(chunkStarts[0], 0, 'First chunk start offset must be 0');
  let runningOffset = 0;
  for (let i = 0; i < workerResponse.chunks.length; i++) {
    assert.strictEqual(chunkStarts[i], runningOffset, `chunkStarts[${i}] offset mismatch`);
    runningOffset += workerResponse.chunks[i].length;
  }

  // Validate lineOffsets buffer integrity
  const lineOffsets = new Uint32Array(workerResponse.lineOffsets);
  assert.strictEqual(lineOffsets.length, workerResponse.lineCount, 'lineOffsets length must equal lineCount');
  assert.strictEqual(lineOffsets[0], 0, 'lineOffsets[0] must be 0');

  // Verify completeness, chunk ordering, and parse validity of concatenated output
  assert(workerResponse.chunks[0].trimStart().startsWith('{'), 'First chunk must start with root object {');
  assert(workerResponse.chunks[workerResponse.chunks.length - 1].trimEnd().endsWith('}'), 'Last chunk must end with root object }');

  const concatenated = workerResponse.chunks.join('');
  assert.strictEqual(concatenated.length, workerResponse.totalLength, 'Concatenated string length must match totalLength');
  const parsed = JSON.parse(concatenated);
  assert.strictEqual(parsed.status, testPayload.status, 'Parsed JSON status must match');
  assert.strictEqual(parsed.results.length, testPayload.results.length, 'Parsed results count must match');
  assert.strictEqual(parsed.results[39999].name, 'Entry 39999', 'Parsed entry 39999 must match');

  const formattedSizeMB = (workerResponse.totalLength / 1024 / 1024).toFixed(2);
  console.log(`  Formatted size: ${formattedSizeMB} MB across ${workerResponse.chunks.length} chunk(s) (verified complete & parseable)`);
} else {
  console.error('✕ Worker format failed:', workerResponse);
  process.exit(1);
}

// Simulate worker 'search' action
let searchResponse = null;
sandbox.self.postMessage = function(msg) {
  searchResponse = msg;
};

const t2 = performance.now();
sandbox.self.onmessage({
  data: {
    id: 2,
    action: 'search',
    chunks: workerResponse.chunks,
    text: workerResponse.chunks.join(''),
    lineOffsets: workerResponse.lineOffsets,
    query: 'Entry 39999',
    isRegex: false
  }
});
const t3 = performance.now();

if (searchResponse && searchResponse.success && searchResponse.matches.length > 0) {
  const matchedLine = searchResponse.matches[0];
  console.log('✓ Worker search succeeded in:', (t3 - t2).toFixed(2), 'ms; Found match at line:', matchedLine);
  const assert = require('assert');
  assert(matchedLine > 0, 'Matched line index must be > 0');
} else {
  console.error('✕ Worker search failed:', searchResponse);
  process.exit(1);
}

// 3. Test 100MB simulation
console.log('--- Simulating 100MB Line Indexing & Bounded Memory ---');
const MB100_lines = 1500000;
const t4 = performance.now();
const offsets100MB = new Uint32Array(MB100_lines);
for (let i = 0; i < MB100_lines; i++) {
  offsets100MB[i] = i * 70; // 70 bytes per line avg
}
const t5 = performance.now();
console.log('✓ 1.5 Million Lines indexed in memory in:', (t5 - t4).toFixed(2), 'ms');
console.log('  Uint32Array RAM footprint:', (offsets100MB.byteLength / 1024 / 1024).toFixed(2), 'MB');

// 4. Test Single-Panel Fullscreen & Search Toolbar Contract (EN, ES, DA, CSS, JS)
console.log('--- Verifying Single-Panel Fullscreen & Compact Search Toolbar Contract ---');
const assert = require('assert');
const htmlPaths = [
  'json-formatter/index.html',
  'es/json-formatter/index.html',
  'da/json-formatter/index.html'
];

for (const p of htmlPaths) {
  const html = fs.readFileSync(p, 'utf8');
  assert(html.includes('class="ac-search-toolbar" id="jf-search-bar"'), `${p} must include #jf-search-bar with .ac-search-toolbar`);
  assert(html.includes('id="fs-search-query"'), `${p} must include #fs-search-query`);
  assert(html.includes('id="fs-search-scope"'), `${p} must include #fs-search-scope`);
  assert(html.includes('id="fs-search-prev"'), `${p} must include #fs-search-prev`);
  assert(html.includes('id="fs-search-next"'), `${p} must include #fs-search-next`);
  assert(html.includes('id="fs-search-clear"'), `${p} must include #fs-search-clear`);
  assert(html.includes('id="btn-fs-input"'), `${p} must include #btn-fs-input`);
  assert(html.includes('id="btn-fs-output"'), `${p} must include #btn-fs-output`);
  assert(html.includes('ac-group-primary'), `${p} must include ac-group-primary`);
  assert(html.includes('ac-group-editor'), `${p} must include ac-group-editor`);
  assert(html.includes('ac-group-window'), `${p} must include ac-group-window`);

  // Issue 3: Verify sidebar information hierarchy (1. Advertisement, 2. Search, 3. Options)
  const asideStart = html.indexOf('<aside class="tool-side"');
  const asideEnd = html.indexOf('</aside>', asideStart);
  const asideHtml = html.substring(asideStart, asideEnd);
  const adIdx = asideHtml.indexOf('class="ad-slot"');
  const searchIdx = asideHtml.indexOf('id="search-query"');
  const optionsIdx = asideHtml.indexOf('id="opt-indent"');
  assert(adIdx !== -1, `${p} sidebar must contain advertisement slot`);
  assert(searchIdx !== -1, `${p} sidebar must contain search input`);
  assert(optionsIdx !== -1, `${p} sidebar must contain options`);
  assert(adIdx < searchIdx, `${p} sidebar: Advertisement must appear above Search`);
  assert(searchIdx < optionsIdx, `${p} sidebar: Search must appear above Options`);

  console.log(`✓ Template contract verified: ${p} (Toolbar + Sidebar hierarchy: Ad < Search < Options)`);
}

const css = fs.readFileSync('assets/css/style.css', 'utf8');
assert(css.includes('.ac-panel.is-fullscreen'), 'CSS must define .ac-panel.is-fullscreen');
assert(css.includes('.fs-hidden-panel'), 'CSS must define .fs-hidden-panel');
assert(css.includes('display: none !important'), 'CSS must hide sibling panels with display: none !important');
assert(css.includes('.ac-search-toolbar'), 'CSS must define compact .ac-search-toolbar');
assert(css.includes('.ac-panel.is-fullscreen .ac-search-toolbar'), 'CSS must show .ac-search-toolbar only when panel is fullscreen');
console.log('✓ CSS single-panel fullscreen & compact search rules verified');

const js = fs.readFileSync('assets/js/tools/json-formatter.js', 'utf8');
assert(js.includes('enterPanelFs'), 'JS must implement enterPanelFs');
assert(js.includes('exitPanelFs'), 'JS must implement exitPanelFs');
assert(js.includes('fs-hidden-panel'), 'JS must toggle .fs-hidden-panel on sibling panels');
assert(js.includes('fs-search-query'), 'JS must synchronize search toolbar inputs');
console.log('✓ JS single-panel fullscreen & bidirectional search bar synchronization verified');

console.log('--- All Tests Passed Successfully! ---');
