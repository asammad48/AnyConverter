const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log('--- Testing Production JWT Decoder Input & Claims (INP-01 / DES-03) ---');

// 1. HTML Verification across EN, ES, DA
['jwt-decoder/index.html', 'es/jwt-decoder/index.html', 'da/jwt-decoder/index.html'].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  assert.ok(html.includes('class="split-panels"'), `Missing split-panels in ${filePath}`);
  assert.ok(html.includes('id="jwt-input"'), `Missing #jwt-input in ${filePath}`);
  assert.ok(html.includes('id="btn-copy-header"'), `Missing #btn-copy-header in ${filePath}`);
  assert.ok(html.includes('id="btn-copy-payload"'), `Missing #btn-copy-payload in ${filePath}`);
  assert.ok(html.includes('id="btn-copy-all"'), `Missing #btn-copy-all in ${filePath}`);
  assert.ok(html.includes('jwt-security-notice'), `Missing .jwt-security-notice in ${filePath}`);
  console.log(`✓ HTML split layout and actions verified in ${filePath}`);
});

// 2. Production Script in VM Sandbox
const jwtJs = fs.readFileSync('assets/js/tools/jwt-decoder.js', 'utf8');

const elements = {};
function makeEl(id) {
  if (elements[id]) return elements[id];
  const el = {
    id: id,
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
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
    focus: function() {}
  };
  elements[id] = el;
  return el;
}

[
  'jwt-input', 'btn-decode-jwt', 'btn-clear-jwt', 'btn-jwt-example',
  'btn-copy-jwt', 'btn-copy-header', 'btn-copy-payload', 'btn-copy-all',
  'jwt-result', 'jwt-error', 'jwt-placeholder', 'jwt-token-display',
  'jwt-part-header', 'jwt-part-payload', 'jwt-part-sig',
  'jwt-header', 'jwt-payload', 'jwt-sig', 'jwt-exp-info'
].forEach(makeEl);

let domLoadedCallback = null;
const sandbox = {
  document: {
    getElementById: function(id) { return elements[id] || makeEl(id); },
    querySelectorAll: function() { return []; },
    addEventListener: function(evt, fn) {
      if (evt === 'DOMContentLoaded') domLoadedCallback = fn;
    }
  },
  window: {
    location: { pathname: '/jwt-decoder/' },
    copyToClipboard: function() { return true; }
  },
  atob: function(str) { return Buffer.from(str, 'base64').toString('binary'); },
  btoa: function(str) { return Buffer.from(str, 'binary').toString('base64'); },
  TextDecoder: TextDecoder,
  TextEncoder: TextEncoder,
  Uint8Array: Uint8Array,
  console: console,
  setTimeout: function(fn) { fn(); return 1; },
  clearTimeout: function() {}
};

vm.createContext(sandbox);
vm.runInContext(jwtJs, sandbox);
domLoadedCallback();

const inputEl = elements['jwt-input'];
const decodeBtn = elements['btn-decode-jwt'];
const resultEl = elements['jwt-result'];
const errorEl = elements['jwt-error'];
const headerEl = elements['jwt-header'];
const payloadEl = elements['jwt-payload'];

const baseToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvcsOnbyBTw6Fua28iLCJyb2xlIjoiYWRtaW4ifQ.dGVzdHNpZw';

function testJwt(val) {
  inputEl.value = val;
  decodeBtn.dispatchEvent('click');
  return {
    isSuccess: resultEl.style.display === 'flex',
    error: errorEl.textContent,
    header: headerEl.textContent ? JSON.parse(headerEl.textContent) : null,
    payload: payloadEl.textContent ? JSON.parse(payloadEl.textContent) : null
  };
}

// 1. Raw JWT
const t1 = testJwt(baseToken);
assert.ok(t1.isSuccess, 'Raw JWT must decode');
assert.strictEqual(t1.payload.name, 'Jorço Sánko');
console.log('✓ Raw JWT decoded with multi-byte Unicode UTF-8 claims');

// 2. Double-quoted Bearer token: "Bearer <token>"
const t2 = testJwt('"Bearer ' + baseToken + '"');
assert.ok(t2.isSuccess, 'Double-quoted "Bearer <token>" must decode cleanly');
assert.strictEqual(t2.payload.sub, '1234567890');
console.log('✓ Double-quoted "Bearer <token>" parsed without decode failure');

// 3. Single-quoted Bearer token: 'Bearer <token>'
const t3 = testJwt("'Bearer " + baseToken + "'");
assert.ok(t3.isSuccess, "'Bearer <token>' must decode cleanly");
assert.strictEqual(t3.payload.sub, '1234567890');
console.log('✓ Single-quoted \'Bearer <token>\' parsed successfully');

// 4. Authorization: bearer <token>
const t4 = testJwt('Authorization: bearer ' + baseToken);
assert.ok(t4.isSuccess, 'Authorization header prefix must decode cleanly');
assert.strictEqual(t4.payload.role, 'admin');
console.log('✓ Authorization header wrapper safely stripped and decoded');

// 5. Invalid parts count (e.g. 2 parts)
const t5 = testJwt('only.two');
assert.strictEqual(t5.isSuccess, false);
assert.ok(t5.error.includes('must have exactly 3 parts'), 'Must reject invalid parts count');
console.log('✓ Malformed part count properly rejected with actionable error');

console.log('All Production JWT Decoder tests passed cleanly!');
