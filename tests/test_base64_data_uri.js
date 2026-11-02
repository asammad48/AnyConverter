const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log('--- Testing Production Base64 Data URI & Binary Suite (FNC-02) ---');

const base64Js = fs.readFileSync('assets/js/tools/base64.js', 'utf8');

const elements = {};
function makeEl(id) {
  if (elements[id]) return elements[id];
  const el = {
    id: id,
    value: '',
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); },
      toggle: function(c, force) {
        if (force !== undefined) {
          if (force) this.classes.add(c);
          else this.classes.delete(c);
        } else {
          if (this.classes.has(c)) this.classes.delete(c);
          else this.classes.add(c);
        }
      }
    },
    listeners: {},
    addEventListener: function(evt, fn) {
      this.listeners[evt] = this.listeners[evt] || [];
      this.listeners[evt].push(fn);
    },
    dispatchEvent: function(evt, data) {
      if (this.listeners[evt]) {
        this.listeners[evt].forEach(fn => fn(data || {}));
      }
    },
    setAttribute: function() {},
    getAttribute: function() { return null; },
    click: function() {}
  };
  elements[id] = el;
  return el;
}

[
  'text-input', 'b64-input', 'text-output', 'b64-output-code',
  'text-status', 'b64-output-section', 'btn-encode', 'btn-b64-encode',
  'btn-decode', 'btn-b64-decode', 'btn-swap', 'btn-b64-swap',
  'btn-clear-text', 'btn-b64-clear', 'btn-copy-text', 'btn-b64-copy',
  'file-drop-zone', 'b64-file-drop', 'file-input', 'b64-file-input',
  'file-result', 'b64-file-result', 'file-info', 'b64-file-info',
  'file-output', 'b64-file-output', 'data-url-output', 'image-preview-b64',
  'b64-img-preview', 'b64-preview-img', 'btn-copy-b64', 'btn-b64-file-copy',
  'btn-copy-dataurl', 'btn-download-b64', 'tog-urlsafe', 'tog-linewrap',
  'stat-input-chars', 'stat-output-chars', 'stat-input-kb', 'stat-ratio'
].forEach(makeEl);

let domLoadedCallback = null;
const sandbox = {
  document: {
    getElementById: function(id) { return elements[id] || makeEl(id); },
    querySelectorAll: function() { return []; },
    querySelector: function() { return null; },
    addEventListener: function(evt, fn) {
      if (evt === 'DOMContentLoaded') domLoadedCallback = fn;
    }
  },
  window: {
    location: { pathname: '/base64-encoder/' },
    copyToClipboard: function() { return true; }
  },
  atob: function(str) { return Buffer.from(str, 'base64').toString('binary'); },
  btoa: function(str) { return Buffer.from(str, 'binary').toString('base64'); },
  escape: escape,
  unescape: unescape,
  decodeURIComponent: decodeURIComponent,
  encodeURIComponent: encodeURIComponent,
  TextDecoder: TextDecoder,
  TextEncoder: TextEncoder,
  Uint8Array: Uint8Array,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};

vm.createContext(sandbox);
vm.runInContext(base64Js, sandbox);
assert.ok(typeof domLoadedCallback === 'function', 'DOMContentLoaded listener must be registered in base64.js');
domLoadedCallback();

const textInput = elements['text-input'];
const textOutput = elements['text-output'];
const decodeBtn = elements['btn-decode'];
const statusEl = elements['text-status'];

function testDecode(input) {
  textInput.value = input;
  decodeBtn.dispatchEvent('click');
  return {
    output: textOutput.value,
    status: statusEl.textContent
  };
}

// 1. Plain text Base64
const r1 = testDecode('SGVsbG8gV29ybGQ=');
assert.strictEqual(r1.output, 'Hello World');
console.log('✓ Plain text Base64 decoded successfully from production script');

// 2. Data URI with parameters containing dots (filename.txt) and charset
const r2 = testDecode('data:text/plain;name=test.txt;charset=utf-8;base64,VGVzdGluZw==');
assert.strictEqual(r2.output, 'Testing');
assert.ok(r2.status.includes('Data URI decoded successfully'), 'Status must confirm Data URI success');
console.log('✓ Data URI with dots in parameters (name=test.txt) decoded cleanly without regex failure');

// 3. SVG XML Data URI (image/svg+xml must NOT be treated as binary blob)
const svgB64 = 'data:image/svg+xml;base64,PHN2Zz48Y2lyY2xlIHI9IjUiLz48L3N2Zz4=';
const r3 = testDecode(svgB64);
assert.strictEqual(r3.output, '<svg><circle r="5"/></svg>');
console.log('✓ SVG Data URI correctly decoded as readable text markup instead of binary placeholder');

// 4. Binary Data URI (1x1 PNG) must be safely classified as binary
const pngB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const r4 = testDecode(pngB64);
assert.ok(r4.output.includes('[Binary data: image/png (70 bytes)]'), 'Output must display structured binary metadata');
console.log('✓ Binary PNG safely categorized without UTF-8 corruption');

// 5. Multi-byte Unicode UTF-8
const r5 = testDecode('QW55Q29udmVydGVyIPCfmI4=');
assert.strictEqual(r5.output, 'AnyConverter 😎');
console.log('✓ Unicode multi-byte UTF-8 emoji decoded properly');

// 6. Invalid base64 rejection
const r6 = testDecode('###invalid@@@');
assert.ok(r6.status.includes('Invalid Base64'), 'Invalid input rejected with error');
console.log('✓ Invalid input rejected with descriptive error');

console.log('All Production Base64 Data URI tests passed cleanly!');
