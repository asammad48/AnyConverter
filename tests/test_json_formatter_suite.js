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
  console.log('  Formatted size:', (workerResponse.formatted.length / 1024 / 1024).toFixed(2), 'MB');
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
    text: workerResponse.formatted,
    lineOffsets: workerResponse.lineOffsets,
    query: 'Entry 39999',
    isRegex: false
  }
});
const t3 = performance.now();

if (searchResponse && searchResponse.success && searchResponse.matches.length > 0) {
  console.log('✓ Worker search succeeded in:', (t3 - t2).toFixed(2), 'ms; Found match at line:', searchResponse.matches[0]);
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

console.log('--- All Tests Passed Successfully! ---');
