const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log('--- Testing Production Global Search & Synonyms Execution (SEO-02) ---');

const sharedJs = fs.readFileSync('assets/js/shared.js', 'utf8');

const elements = {};
function makeEl(id) {
  return elements[id] || (elements[id] = {
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
      contains: function(c) { return this.classes.has(c); }
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
    focus: function() {},
    appendChild: function() {},
    querySelectorAll: function() { return []; },
    querySelector: function(sel) { return makeEl('qs-' + sel); }
  });
}

[
  'search-btn', 'search-modal', 'search-backdrop', 'search-input',
  'search-results', 'search-empty', 'site-header', 'site-footer'
].forEach(makeEl);

const listeners = [];
let currentPath = '/';

const sandbox = {
  document: {
    getElementById: function(id) { return elements[id] || makeEl(id); },
    querySelectorAll: function() { return []; },
    querySelector: function(sel) { return makeEl('doc-qs-' + sel); },
    createElement: function(tag) { return makeEl('tag-' + tag); },
    head: makeEl('head'),
    body: makeEl('body'),
    documentElement: makeEl('html'),
    addEventListener: function(evt, fn) { listeners.push({ evt, fn }); }
  },
  window: {
    location: {
      get pathname() { return currentPath; },
      set href(val) {}
    },
    addEventListener: function() {},
    removeEventListener: function() {}
  },
  localStorage: {
    getItem: function() { return null; },
    setItem: function() {}
  },
  console: console,
  setTimeout: function(fn) { fn(); return 1; },
  clearTimeout: function() {},
  requestAnimationFrame: function(fn) { fn(); }
};

vm.createContext(sandbox);
vm.runInContext(sharedJs, sandbox);

// Fire DOMContentLoaded listeners registered by shared.js
listeners.forEach(l => {
  if (l.evt === 'DOMContentLoaded') l.fn();
});

const searchInput = elements['search-input'];
const searchResults = elements['search-results'];
const searchEmpty = elements['search-empty'];

function executeSearch(query, langPath = '/') {
  currentPath = langPath;
  searchInput.value = query;
  searchInput.dispatchEvent('input');

  const links = [];
  const regex = /href="([^"]+)"/g;
  let match;
  while ((match = regex.exec(searchResults.innerHTML)) !== null) {
    links.push(match[1]);
  }
  return {
    links: links,
    topResult: links[0] || null,
    emptyText: searchEmpty.textContent,
    count: links.length
  };
}

// 1. Bearer maps to JWT Decoder as top result
const s1 = executeSearch('bearer');
assert.ok(s1.topResult && s1.topResult.includes('/jwt-decoder/'), `Expected /jwt-decoder/ as top result for 'bearer', got: ${s1.topResult}`);
console.log('✓ Query "bearer" executed via production shared.js -> Top result: ' + s1.topResult);

// 2. Epoch maps to Timestamp Converter as top result
const s2 = executeSearch('epoch');
assert.ok(s2.topResult && s2.topResult.includes('/timestamp-converter/'), `Expected /timestamp-converter/ as top result for 'epoch', got: ${s2.topResult}`);
console.log('✓ Query "epoch" executed via production shared.js -> Top result: ' + s2.topResult);

// 3. SHA256 maps to Hash Generator as top result
const s3 = executeSearch('sha256');
assert.ok(s3.topResult && s3.topResult.includes('/hash-generator/'), `Expected /hash-generator/ as top result for 'sha256', got: ${s3.topResult}`);
console.log('✓ Query "sha256" executed via production shared.js -> Top result: ' + s3.topResult);

// 4. Spanish intent: "mi ip" in /es/ context maps to IP Address Lookup
const s4 = executeSearch('mi ip', '/es/');
assert.ok(s4.topResult && s4.topResult.includes('/ip-address-lookup/'), `Expected /ip-address-lookup/ for Spanish 'mi ip', got: ${s4.topResult}`);
console.log('✓ Spanish query "mi ip" -> Top result: ' + s4.topResult);

// 5. Danish intent: "tidsstempel" in /da/ context maps to Timestamp Converter
const s5 = executeSearch('tidsstempel', '/da/');
assert.ok(s5.topResult && s5.topResult.includes('/timestamp-converter/'), `Expected /timestamp-converter/ for Danish 'tidsstempel', got: ${s5.topResult}`);
console.log('✓ Danish query "tidsstempel" -> Top result: ' + s5.topResult);

// 6. Assert zero duplicates in search results
const allLinks = s1.links;
const uniqueLinks = new Set(allLinks);
assert.strictEqual(allLinks.length, uniqueLinks.size, 'Search results must not contain duplicates');
console.log('✓ Search results verified strictly deduplicated across all results');

console.log('All Production Global Search & Synonym tests passed cleanly!');
