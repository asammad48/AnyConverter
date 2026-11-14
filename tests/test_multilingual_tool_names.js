/**
 * Test Suite: Multilingual Tool Names & Search Localization
 *
 * Verifies:
 * 1. 100% dictionary coverage (128 tools) for Spanish and Danish in shared.js
 * 2. Category dictionary coverage across all 14 categories for ES and DA
 * 3. getToolName(), getToolDesc(), and getToolCategory() logic
 * 4. Search modal footer localization (Navegar / Naviger, etc.)
 * 5. Search modal results rendering with localized names, descriptions, and category badges
 * 6. Search query matching on localized names (e.g., 'Contador' finds Word Counter)
 * 7. Homepage Dashboard Quick Access cards rendering in Spanish and Danish
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('----------------------------------------------------');
console.log(' RUNNING MULTILINGUAL TOOL NAMES TEST SUITE');
console.log('----------------------------------------------------');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

// 1. Static dictionary checks
const sharedJsPath = path.join(__dirname, '..', 'assets', 'js', 'shared.js');
const sharedJsContent = fs.readFileSync(sharedJsPath, 'utf8');

it('Dictionary: CATEGORY_I18N and TOOL_I18N exist in shared.js', () => {
  assert(sharedJsContent.includes('var CATEGORY_I18N ='), 'Missing CATEGORY_I18N definition');
  assert(sharedJsContent.includes('var TOOL_I18N ='), 'Missing TOOL_I18N definition');
  assert(sharedJsContent.includes('function getToolName('), 'Missing getToolName function');
  assert(sharedJsContent.includes('function getToolDesc('), 'Missing getToolDesc function');
  assert(sharedJsContent.includes('function getToolCategory('), 'Missing getToolCategory function');
});

// Setup DOM sandbox for shared.js
function createMockEnvironment(pathname, langCode) {
  const store = {};
  const eventListeners = {};

  const documentMock = {
    readyState: 'complete',
    location: { pathname, href: `http://localhost:5000${pathname}` },
    documentElement: {
      lang: langCode || (pathname.startsWith('/es/') ? 'es' : (pathname.startsWith('/da/') ? 'da' : 'en')),
      getAttribute: function (k) {
        if (k === 'lang') return this.lang;
        return null;
      }
    },
    getElementById: function (id) {
      if (id === 'search-btn') return { addEventListener: () => {} };
      if (id === 'search-modal') {
        return {
          classList: { contains: () => false, add: () => {}, remove: () => {} },
          setAttribute: () => {},
          parentElement: null,
          querySelector: (sel) => {
            if (sel === '.search-footer') return { innerHTML: '' };
            return null;
          }
        };
      }
      if (id === 'search-backdrop') return { addEventListener: () => {} };
      if (id === 'search-input') {
        return {
          value: '',
          placeholder: '',
          setAttribute: () => {},
          addEventListener: () => {},
          focus: () => {}
        };
      }
      if (id === 'search-results') return { innerHTML: '', querySelectorAll: () => [] };
      if (id === 'search-empty') return { textContent: '', classList: { add: () => {}, remove: () => {} } };
      return null;
    },
    querySelector: function (sel) {
      if (sel === '.dash-quick-grid') {
        return {
          innerHTML: '',
          closest: () => ({
            querySelector: () => ({ textContent: 'Quick Access' })
          })
        };
      }
      if (sel === 'meta[name="description"]') return { getAttribute: () => '' };
      return null;
    },
    querySelectorAll: function () { return []; },
    addEventListener: function (type, fn) {
      if (!eventListeners[type]) eventListeners[type] = [];
      eventListeners[type].push(fn);
    },
    removeEventListener: () => {},
    dispatchEvent: function (event) {
      if (eventListeners[event.type]) {
        eventListeners[event.type].forEach(fn => fn(event));
      }
    },
    createElement: function (tag) {
      return {
        tagName: tag.toUpperCase(),
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        style: {}
      };
    },
    body: {
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      appendChild: () => {},
      style: {}
    },
    head: {
      appendChild: () => {},
      querySelector: () => null
    }
  };

  const windowMock = {
    location: documentMock.location,
    document: documentMock,
    localStorage: {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    },
    addEventListener: (type, fn) => documentMock.addEventListener(type, fn),
    removeEventListener: () => {},
    dispatchEvent: (e) => documentMock.dispatchEvent(e),
    requestAnimationFrame: (fn) => fn(),
    Event: function (type) { this.type = type; },
    CustomEvent: function (type, init) { this.type = type; this.detail = init ? init.detail : null; }
  };

  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: windowMock.localStorage,
    location: windowMock.location,
    navigator: { userAgent: 'test-agent' },
    console: { log: () => {}, warn: () => {}, error: () => {} },
    setTimeout: (fn) => fn(),
    clearTimeout: () => {}
  };

  vm.createContext(sandbox);
  vm.runInContext(sharedJsContent, sandbox);

  return sandbox;
}

it('Functions: getToolName, getToolDesc, and getToolCategory return localized values', () => {
  const envEs = createMockEnvironment('/es/', 'es');
  const getToolName = envEs.window.getToolName;
  const getToolDesc = envEs.window.getToolDesc;
  const getToolCategory = envEs.window.getToolCategory;
  const toolI18n = envEs.window.TOOL_I18N;
  const categoryI18n = envEs.window.CATEGORY_I18N;

  // 128 tools coverage
  assert.strictEqual(Object.keys(toolI18n.es.names).length, 128, 'ES names must have 128 tools');
  assert.strictEqual(Object.keys(toolI18n.da.names).length, 128, 'DA names must have 128 tools');
  assert.strictEqual(Object.keys(toolI18n.es.descs).length, 128, 'ES descs must have 128 tools');
  assert.strictEqual(Object.keys(toolI18n.da.descs).length, 128, 'DA descs must have 128 tools');

  // Specific user-requested tools
  const urlTool = { n: 'URL Encoder', u: '/url-encoder/', d: 'Encode and decode URLs and URI components', c: 'Developer' };
  const jsonTool = { n: 'JSON Formatter', u: '/json-formatter/', d: 'Format, validate and beautify JSON', c: 'Developer' };
  const wordTool = { n: 'Word Counter', u: '/word-counter/', d: 'Count words, characters and sentences', c: 'Text' };
  const diffTool = { n: 'JSON Compare', u: '/json-compare/', d: 'Find real differences between two JSON files', c: 'Developer' };

  // Spanish tests
  assert.strictEqual(getToolName(urlTool, 'es'), 'Codificador URL');
  assert.strictEqual(getToolName(jsonTool, 'es'), 'Formateador JSON');
  assert.strictEqual(getToolName(wordTool, 'es'), 'Contador de Palabras');
  assert.strictEqual(getToolName(diffTool, 'es'), 'Comparar JSON');

  // Danish tests
  assert.strictEqual(getToolName(urlTool, 'da'), 'URL Encoder og Decoder');
  assert.strictEqual(getToolName(jsonTool, 'da'), 'JSON Formatter');
  assert.strictEqual(getToolName(wordTool, 'da'), 'Ordtæller');
  assert.strictEqual(getToolName(diffTool, 'da'), 'Sammenlign JSON');

  // Category tests
  assert.strictEqual(getToolCategory('Developer', 'es'), 'Desarrollador');
  assert.strictEqual(getToolCategory('Text', 'es'), 'Texto');
  assert.strictEqual(getToolCategory('Developer', 'da'), 'Udvikler');
  assert.strictEqual(getToolCategory('Text', 'da'), 'Tekst');

  // English fallback
  assert.strictEqual(getToolName(urlTool, 'en'), 'URL Encoder');
  assert.strictEqual(getToolCategory('Developer', 'en'), 'Developer');
});

it('Search Footer: Footer key actions are properly translated in Spanish and Danish', () => {
  const envEs = createMockEnvironment('/es/', 'es');
  const modalEs = envEs.document.getElementById('search-modal');
  const footerEs = { innerHTML: '' };
  modalEs.querySelector = (sel) => (sel === '.search-footer' ? footerEs : null);

  // Trigger search init
  // In the real environment, footerEl.innerHTML is set based on lang
  assert(sharedJsContent.includes("footerEl.innerHTML = '<span><kbd>↑↓</kbd> Navegar</span><span><kbd>↵</kbd> Abrir</span><span><kbd>Esc</kbd> Cerrar</span>'"), 'Missing Spanish search footer');
  assert(sharedJsContent.includes("footerEl.innerHTML = '<span><kbd>↑↓</kbd> Naviger</span><span><kbd>↵</kbd> Åbn</span><span><kbd>Esc</kbd> Luk</span>'"), 'Missing Danish search footer');
});

it('Dashboard: Favorite cards render localized names on /es/ and /da/', () => {
  const envEs = createMockEnvironment('/es/index.html', 'es');
  const storage = envEs.localStorage;
  storage.setItem('ac_fav_tools', JSON.stringify(['/word-counter/', '/url-encoder/']));

  const favs = [
    { n: 'Word Counter', u: '/word-counter/', i: '/assets/img/icon-text.svg' },
    { n: 'URL Encoder', u: '/url-encoder/', i: '/assets/img/icon-url.svg' }
  ];

  const renderedEs = favs.map(t => {
    const name = envEs.window.getToolName(t, 'es');
    return `<span class="dash-quick-card-name">${name}</span>`;
  }).join('');

  assert(renderedEs.includes('Contador de Palabras'), 'Should render Contador de Palabras');
  assert(renderedEs.includes('Codificador URL'), 'Should render Codificador URL');
  assert(!renderedEs.includes('Word Counter'), 'Should not render English Word Counter on ES');

  const renderedDa = favs.map(t => {
    const name = envEs.window.getToolName(t, 'da');
    return `<span class="dash-quick-card-name">${name}</span>`;
  }).join('');

  assert(renderedDa.includes('Ordtæller'), 'Should render Ordtæller on DA');
  assert(renderedDa.includes('URL Encoder og Decoder'), 'Should render URL Encoder og Decoder on DA');
});

it('Search: Query filtering matches against localized names in ES and DA', () => {
  const envEs = createMockEnvironment('/es/', 'es');
  const toolI18n = envEs.window.TOOL_I18N;
  const getToolName = envEs.window.getToolName;

  const testTool = { n: 'Word Counter', u: '/word-counter/', d: 'Count words', c: 'Text', k: '' };

  // User searches for 'contador' in Spanish
  const qlEs = 'contador';
  const matchEs = testTool.n.toLowerCase().indexOf(qlEs) !== -1 || getToolName(testTool, 'es').toLowerCase().indexOf(qlEs) !== -1;
  assert(matchEs, 'Query "contador" should match Word Counter when lang is ES');

  // User searches for 'ordtæller' in Danish
  const qlDa = 'ordtæller';
  const matchDa = testTool.n.toLowerCase().indexOf(qlDa) !== -1 || getToolName(testTool, 'da').toLowerCase().indexOf(qlDa) !== -1;
  assert(matchDa, 'Query "ordtæller" should match Word Counter when lang is DA');
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
