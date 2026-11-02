const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log('--- Testing Production Cron Expression Parser & Next Runs (INP-02) ---');

// 1. Verify HTML structure across EN, ES, DA
['cron-expression-parser/index.html', 'es/cron-expression-parser/index.html', 'da/cron-expression-parser/index.html'].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  assert.ok(html.includes('id="cron-input"'), `Missing #cron-input in ${filePath}`);
  assert.ok(html.includes('id="cron-dialect-badge"'), `Missing #cron-dialect-badge in ${filePath}`);
  assert.ok(html.includes('id="cron-fields-container"'), `Missing #cron-fields-container in ${filePath}`);
  assert.ok(html.includes('id="cron-next-runs"'), `Missing #cron-next-runs in ${filePath}`);
  assert.ok(html.includes('id="cron-next-list"'), `Missing #cron-next-list in ${filePath}`);
  console.log(`✓ HTML dialect badge and next runs container verified in ${filePath}`);
});

// 2. Load Production Script in VM Sandbox
const cronJs = fs.readFileSync('assets/js/tools/cron-expression-parser.js', 'utf8');

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
    }
  };
  elements[id] = el;
  return el;
}

[
  'cron-input', 'cron-description', 'cron-error', 'cron-dialect-badge',
  'cron-fields-container', 'cron-next-runs', 'cron-next-list'
].forEach(makeEl);

let domLoadedCallback = null;
const timers = [];
const sandbox = {
  document: {
    getElementById: function(id) { return elements[id] || makeEl(id); },
    querySelectorAll: function() { return []; },
    addEventListener: function(evt, fn) {
      if (evt === 'DOMContentLoaded') domLoadedCallback = fn;
    }
  },
  window: {
    location: { pathname: '/cron-expression-parser/' }
  },
  setTimeout: function(fn, delay) {
    // Run immediately for tests
    fn();
    return timers.length;
  },
  clearTimeout: function() {},
  Intl: Intl,
  Date: Date,
  console: console
};

vm.createContext(sandbox);
vm.runInContext(cronJs, sandbox);
domLoadedCallback();

const inputEl = elements['cron-input'];
const badgeEl = elements['cron-dialect-badge'];
const nextRunsEl = elements['cron-next-runs'];
const nextListEl = elements['cron-next-list'];
const errorEl = elements['cron-error'];
const fieldsEl = elements['cron-fields-container'];

function parseExpression(expr) {
  inputEl.value = expr;
  inputEl.dispatchEvent('input');
  const items = (nextListEl.innerHTML.match(/<li>/g) || []).length;
  return {
    badge: badgeEl.textContent,
    nextRunCount: items,
    nextListHtml: nextListEl.innerHTML,
    isNextVisible: nextRunsEl.style.display === 'block',
    isErrorVisible: errorEl.style.display === 'block',
    error: errorEl.textContent,
    cardCount: (fieldsEl.innerHTML.match(/<div style=/g) || []).length
  };
}

// 1. Standard 5-field cron
const r1 = parseExpression('*/5 * * * *');
assert.strictEqual(r1.isErrorVisible, false);
assert.ok(r1.badge.includes('Standard 5-field'), 'Must detect standard 5-field');
assert.strictEqual(r1.isNextVisible, true);
assert.strictEqual(r1.nextRunCount, 3);
console.log('✓ Standard 5-field cron detected with 3 next scheduled runs');

// 2. 6-field Daily cron: 0 0 12 * * * (Must find all 3 days, not capped to 1)
const r2 = parseExpression('0 0 12 * * *');
assert.strictEqual(r2.isErrorVisible, false);
assert.ok(r2.badge.includes('6-field'), 'Must detect 6-field with seconds');
assert.strictEqual(r2.isNextVisible, true);
assert.strictEqual(r2.nextRunCount, 3, 'Daily 6-field cron must find 3 next runs across multiple days');
console.log('✓ Daily 6-field cron (0 0 12 * * *) verified: finds 3 consecutive daily executions');

// 3. Quartz cron with day string alias: 0 0 12 ? * WED
const r3 = parseExpression('0 0 12 ? * WED');
assert.strictEqual(r3.isErrorVisible, false);
assert.ok(r3.badge.includes('Quartz'), 'Must detect Quartz dialect');
assert.strictEqual(r3.isNextVisible, true, 'Next scheduled executions must not disappear for string day names');
assert.strictEqual(r3.nextRunCount, 3, 'Quartz cron with WED must find 3 upcoming Wednesday runs');
console.log('✓ Quartz cron (0 0 12 ? * WED) verified: string day alias resolved, finds 3 upcoming Wednesdays');

// 4. Out of bounds field counts (< 5 or > 7)
const r4 = parseExpression('* * *');
assert.strictEqual(r4.isErrorVisible, true);
assert.ok(r4.error.includes('at least 5 fields'), 'Must flag fewer than 5 fields');
console.log('✓ Invalid field count (< 5) rejected with clear error message');

console.log('All Production Cron Dialect tests passed cleanly!');
