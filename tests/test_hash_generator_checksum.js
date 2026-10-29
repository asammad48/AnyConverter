const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log('--- Testing Production Hash Generator & Checksum Comparison (LOG-01) ---');

// 1. Verify HTML integration across EN, ES, DA
['hash-generator/index.html', 'es/hash-generator/index.html', 'da/hash-generator/index.html'].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  assert.ok(html.includes('id="hash-compare-input"'), `Missing #hash-compare-input in ${filePath}`);
  assert.ok(html.includes('id="btn-hash-compare-clear"'), `Missing #btn-hash-compare-clear in ${filePath}`);
  assert.ok(html.includes('id="hash-compare-status"'), `Missing #hash-compare-status in ${filePath}`);
  assert.ok(html.includes('id="btn-hash-text"'), `Missing #btn-hash-text in ${filePath}`);
  assert.ok(html.includes('id="btn-hash-clear"'), `Missing #btn-hash-clear in ${filePath}`);
  console.log(`✓ HTML elements verified in ${filePath}`);
});

// 2. Test production assets/js/tools/hash-generator.js in VM sandbox
const jsCode = fs.readFileSync('assets/js/tools/hash-generator.js', 'utf8');

const elements = {};
function makeEl(id) {
  const el = {
    id: id,
    textContent: '',
    innerHTML: '',
    value: '',
    style: {},
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); },
      toggle: function(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
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
    querySelector: function() { return null; }
  };
  elements[id] = el;
  return el;
}

[
  'hash-text-input', 'hash-input', 'btn-hash-text', 'btn-hash-clear',
  'hash-compare-input', 'btn-hash-compare-clear', 'hash-compare-status',
  'hash-md5', 'hash-sha1', 'hash-sha256', 'hash-sha512',
  'hash-results', 'hash-drop-zone', 'hash-file-input', 'hash-file-progress',
  'hash-progress-fill', 'hash-progress-text', 'hash-file-info',
  'tog-uppercase', 'tog-livehash', 'hash-stat-chars', 'hash-stat-bytes', 'hash-stat-words'
].forEach(makeEl);

let domLoadedCallback = null;
const sandbox = {
  document: {
    getElementById: function(id) { return elements[id] || null; },
    querySelectorAll: function() { return []; },
    addEventListener: function(evt, fn) {
      if (evt === 'DOMContentLoaded') domLoadedCallback = fn;
    }
  },
  window: {
    location: { pathname: '/hash-generator/' }
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  TextEncoder: TextEncoder,
  crypto: {
    subtle: {
      digest: async function(algo, buf) {
        const cryptoMod = require('crypto');
        const nodeAlgo = algo.toLowerCase().replace('-', '');
        const hash = cryptoMod.createHash(nodeAlgo).update(Buffer.from(buf)).digest();
        return hash.buffer;
      }
    }
  },
  console: console
};

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

// Trigger DOMContentLoaded to register all bindings
assert.ok(typeof domLoadedCallback === 'function', 'DOMContentLoaded listener must be registered');
domLoadedCallback();

// 3. Assert event listeners are bound
const compareInput = elements['hash-compare-input'];
const clearCompareBtn = elements['btn-hash-compare-clear'];
const statusEl = elements['hash-compare-status'];

assert.ok(compareInput.listeners['input'] && compareInput.listeners['input'].length > 0, '#hash-compare-input must have input event listener bound');
assert.ok(clearCompareBtn.listeners['click'] && clearCompareBtn.listeners['click'].length > 0, '#btn-hash-compare-clear must have click listener bound');
console.log('✓ Verified DOM event listeners are actively attached to compare input and clear button');

// 4. Test pre-generation status
compareInput.value = 'abc';
compareInput.dispatchEvent('input');
assert.strictEqual(statusEl.style.display, 'block');
assert.ok(statusEl.textContent.includes('Enter text or choose a file') || statusEl.textContent.includes('calculate hashes first'));
console.log('✓ Pre-generation state handled correctly via real input dispatch');

// 5. Populate hashes simulating hashText
elements['hash-md5'].textContent = '900150983cd24fb0d6963f7d28e17f72';
elements['hash-sha1'].textContent = '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed';
elements['hash-sha256'].textContent = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
elements['hash-sha512'].textContent = 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7e7919add426918293361c2e73';

// 6. Test match with SHA-256 (uppercase and 0x prefix)
compareInput.value = '0xBA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD';
compareInput.dispatchEvent('input');
assert.strictEqual(statusEl.style.display, 'block');
assert.ok(statusEl.innerHTML.includes('Match confirmed'), 'Status must show Match confirmed');
assert.ok(statusEl.innerHTML.includes('SHA-256'), 'Status must identify SHA-256');
assert.strictEqual(statusEl.style.color, '#065F46');
console.log('✓ SHA-256 match with 0x prefix and uppercase hex verified via real dispatch');

// 7. Test mismatch
compareInput.value = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
compareInput.dispatchEvent('input');
assert.strictEqual(statusEl.style.display, 'block');
assert.ok(statusEl.innerHTML.includes('Checksum mismatch'), 'Status must show Checksum mismatch');
assert.strictEqual(statusEl.style.color, '#991B1B');
console.log('✓ Checksum mismatch verified via real dispatch');

// 8. Test Clear button
clearCompareBtn.dispatchEvent('click');
assert.strictEqual(compareInput.value, '');
assert.strictEqual(statusEl.style.display, 'none');
console.log('✓ Clear button successfully resets input and hides status');

console.log('All Hash Generator Checksum tests passed cleanly!');
