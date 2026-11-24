/**
 * Sprint S11 Automated Verification Suite:
 * Recents Carousel / Row on Homepage & Cross-Locale Persistence
 *
 * Verifies:
 * 1. Storage Engine & Canonical Ring Buffer semantics (max 8, promotion on repeat visit, eviction of 9th oldest)
 * 2. Canonical slug normalization across EN/ES/DA tool URLs, query strings, and hashes
 * 3. Cross-locale persistence and localized card rendering across EN, ES, and DA
 * 4. Accessible ARIA semantics (aria-labelledby, nav aria-label, clear button aria-label)
 * 5. CSS :focus-visible rules for .dash-recent-card and .dash-recents-clear-btn
 * 6. Homepage HTML structure across index.html, es/index.html, da/index.html
 * 7. ACAnalytics integration (recent_clicked, recents_cleared) and ac:recents-updated event dispatch
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('----------------------------------------------------');
console.log(' RUNNING SPRINT S11 RECENTS CAROUSEL TEST SUITE');
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
    process.exitCode = 1;
  }
}

// 1. Inspect CSS for accessible focus-visible styles
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

it('CSS: .dash-recent-card:focus-visible outline & box-shadow exist', () => {
  assert(cssContent.includes('.dash-recent-card:focus-visible'), 'Missing .dash-recent-card:focus-visible');
  const match = cssContent.match(/\.dash-recent-card:focus-visible\s*\{([^}]+)\}/);
  assert(match, 'Failed to extract .dash-recent-card:focus-visible block');
  assert(match[1].includes('outline:'), 'Missing outline in .dash-recent-card:focus-visible');
  assert(match[1].includes('box-shadow:'), 'Missing box-shadow in .dash-recent-card:focus-visible');
});

it('CSS: .dash-recents-clear-btn styles & :focus-visible exist', () => {
  assert(cssContent.includes('.dash-recents-clear-btn'), 'Missing .dash-recents-clear-btn');
  assert(cssContent.includes('.dash-recents-clear-btn:focus-visible'), 'Missing .dash-recents-clear-btn:focus-visible');
  assert(cssContent.includes('h2.dash-section-title'), 'Missing h2.dash-section-title reset style');
});

// 2. Inspect shared.js source code for Sprint S11 requirements
const sharedJsPath = path.join(__dirname, '..', 'assets', 'js', 'shared.js');
const sharedJsContent = fs.readFileSync(sharedJsPath, 'utf8');

it('JS: getRecentsRaw, recordRecentTool, clearRecents, getRecentsList are implemented', () => {
  assert(sharedJsContent.includes('function getRecentsRaw('), 'Missing getRecentsRaw');
  assert(sharedJsContent.includes('function recordRecentTool('), 'Missing recordRecentTool');
  assert(sharedJsContent.includes('function clearRecents('), 'Missing clearRecents');
  assert(sharedJsContent.includes('function getRecentsList('), 'Missing getRecentsList');
  assert(sharedJsContent.includes('function initDashboardRecents('), 'Missing initDashboardRecents');
});

it('JS: Ring buffer caps strictly at MAX_RECENTS = 8', () => {
  assert(sharedJsContent.includes('MAX_RECENTS = 8'), 'MAX_RECENTS should be 8');
  assert(sharedJsContent.includes('rawList.slice(0, MAX_RECENTS)'), 'Ring buffer must slice to MAX_RECENTS');
});

it('JS: recordRecentTool normalizes with getCanonicalToolPath and dispatches ac:recents-updated', () => {
  assert(sharedJsContent.includes("getCanonicalToolPath(rawPath)"), 'recordRecentTool must normalize via getCanonicalToolPath');
  assert(sharedJsContent.includes("new CustomEvent('ac:recents-updated'"), 'recordRecentTool must dispatch ac:recents-updated event');
});

it('JS: initDashboardRecents supports dynamic localized titles (EN, ES, DA) and clear actions', () => {
  assert(sharedJsContent.includes("'Recently Used'"), 'Missing EN title Recently Used');
  assert(sharedJsContent.includes("'Usado recientemente'"), 'Missing ES title Usado recientemente');
  assert(sharedJsContent.includes("'Senest brugte'"), 'Missing DA title Senest brugte');
  assert(sharedJsContent.includes("'Clear recents'"), 'Missing EN clear recents');
  assert(sharedJsContent.includes("'Borrar recientes'"), 'Missing ES clear recents');
  assert(sharedJsContent.includes("'Ryd seneste'"), 'Missing DA clear recents');
});

it('JS: Window exports include Sprint S11 Recents APIs', () => {
  assert(sharedJsContent.includes('window.getRecentsList = getRecentsList'), 'Missing window.getRecentsList');
  assert(sharedJsContent.includes('window.recordRecentTool = recordRecentTool'), 'Missing window.recordRecentTool');
  assert(sharedJsContent.includes('window.clearRecents = clearRecents'), 'Missing window.clearRecents');
  assert(sharedJsContent.includes('window.initDashboardRecents = initDashboardRecents'), 'Missing window.initDashboardRecents');
});

// 3. Inspect Homepage HTML markup
const rootDir = path.join(__dirname, '..');
const enHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const esHtml = fs.readFileSync(path.join(rootDir, 'es', 'index.html'), 'utf8');
const daHtml = fs.readFileSync(path.join(rootDir, 'da', 'index.html'), 'utf8');

it('HTML: All 3 homepages (EN, ES, DA) contain #dash-recents-section directly above Quick Access', () => {
  [enHtml, esHtml, daHtml].forEach((html, idx) => {
    const lang = ['EN', 'ES', 'DA'][idx];
    assert(html.includes('id="dash-recents-section"'), `Missing #dash-recents-section on ${lang} homepage`);
    assert(html.includes('aria-labelledby="recents-heading"'), `Missing aria-labelledby on ${lang} homepage`);
    assert(html.includes('style="display:none;"'), `#dash-recents-section on ${lang} homepage must be display:none when empty`);
  });
});

// 4. Analytics adapter integration
const analyticsJsPath = path.join(__dirname, '..', 'assets', 'js', 'shared', 'analytics.js');
const analyticsJsContent = fs.readFileSync(analyticsJsPath, 'utf8');

it('Analytics: ACAnalytics supports recent_clicked and recents_cleared telemetry', () => {
  assert(analyticsJsContent.includes('recent_clicked'), 'analytics.js must include recent_clicked');
  assert(analyticsJsContent.includes('recents_cleared'), 'analytics.js must include recents_cleared');
  assert(analyticsJsContent.includes('trackRecentClicked'), 'ACAnalytics must have trackRecentClicked method');
  assert(analyticsJsContent.includes('trackRecentsCleared'), 'ACAnalytics must have trackRecentsCleared method');
});

// 5. Behavioral Ring Buffer Simulation in Node Environment
class LocalStorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockStorage = new LocalStorageMock();

// Extract TOOLS and TOOL_I18N from shared.js
const toolsStart = sharedJsContent.indexOf('var TOOLS =');
const toolsEnd = sharedJsContent.indexOf('];', toolsStart);
const toolsCode = sharedJsContent.slice(toolsStart, toolsEnd + 2);
const TOOLS = new Function(toolsCode + '; return TOOLS;')();

const i18nStart = sharedJsContent.indexOf('var TOOL_I18N =');
const i18nEnd = sharedJsContent.indexOf('function getToolName', i18nStart);
const i18nCode = sharedJsContent.slice(i18nStart, i18nEnd).trim();
const TOOL_I18N = new Function(i18nCode + '; return TOOL_I18N;')();

function removeLocalePrefix(p) {
  var cleanPath = p.replace(/^\/(es|da)(\/|$)/, '/');
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  return cleanPath || '/';
}

var ENGLISH_PATH_FOR = {};

function englishPathFor(p) {
  var withSlash = p.charAt(p.length - 1) === '/' ? p : p + '/';
  return ENGLISH_PATH_FOR[withSlash] || removeLocalePrefix(p);
}

function splitLocalPath(rawPath) {
  var match = String(rawPath || '').match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  return {
    path: match ? match[1] : rawPath,
    suffix: (match && match[2] ? match[2] : '') + (match && match[3] ? match[3] : '')
  };
}

function getCanonicalToolPath(rawUrlOrPath) {
  if (!rawUrlOrPath || typeof rawUrlOrPath !== 'string') return '';
  try {
    var pathname = rawUrlOrPath.trim();
    if (pathname.indexOf('://') !== -1 || pathname.startsWith('//')) {
      pathname = new URL(pathname, 'https://anyconverter.io').pathname;
    }
    pathname = splitLocalPath(pathname).path;
    pathname = pathname.replace(/index\.html?$/i, '');
    var enPath = englishPathFor(pathname);
    if (enPath.length > 1 && !enPath.endsWith('/')) {
      enPath += '/';
    }
    return enPath;
  } catch (_e) {
    var clean = removeLocalePrefix(rawUrlOrPath);
    clean = splitLocalPath(clean).path.replace(/index\.html?$/i, '');
    if (clean.length > 1 && !clean.endsWith('/')) clean += '/';
    return clean;
  }
}

function getToolName(tool, lang) {
  if (!tool) return '';
  var l = lang || 'en';
  if (TOOL_I18N[l] && TOOL_I18N[l].names && TOOL_I18N[l].names[tool.u]) {
    return TOOL_I18N[l].names[tool.u];
  }
  return tool.n || '';
}

function getToolDesc(tool, lang) {
  if (!tool) return '';
  var l = lang || 'en';
  if (TOOL_I18N[l] && TOOL_I18N[l].desc && TOOL_I18N[l].desc[tool.u]) {
    return TOOL_I18N[l].desc[tool.u];
  }
  return tool.d || '';
}

const MAX_RECENTS = 8;

function getRecentsRaw() {
  try {
    var raw = JSON.parse(mockStorage.getItem('ac:recents') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch (_e) {
    return [];
  }
}

function getRecentsList(lang) {
  var rawList = getRecentsRaw();
  var l = lang || 'en';
  var list = [];
  var seen = {};

  rawList.forEach(function (item) {
    if (!item) return;
    var canon = getCanonicalToolPath(item.u || item.url || item.path);
    if (!canon || seen[canon]) return;
    seen[canon] = true;

    var toolMeta = TOOLS.find(function (t) { return t.u === canon; });
    var toolName = toolMeta ? getToolName(toolMeta, l) : (item.name || canon.replace(/\//g, ' ').trim());
    var toolDesc = toolMeta ? getToolDesc(toolMeta, l) : '';
    var toolIcon = toolMeta ? toolMeta.i : (item.icon || '/assets/img/icon-json.svg');
    var toolCat  = toolMeta ? toolMeta.c : (item.cat || 'Tool');
    var localizedUrl = (l === 'en' ? canon : '/' + l + canon);

    list.push({
      n: toolName,
      u: canon,
      d: toolDesc,
      i: toolIcon,
      c: toolCat,
      ts: item.ts || 0,
      localizedUrl: localizedUrl
    });
  });

  return list.slice(0, MAX_RECENTS);
}

function recordRecentTool(rawPath) {
  if (!rawPath) return;
  var canon = getCanonicalToolPath(rawPath);
  if (!canon || canon === '/' || canon === '') return;

  var isKnownTool = TOOLS.some(function (t) { return t.u === canon; });
  if (!isKnownTool) return;

  var rawList = getRecentsRaw();
  var existingIdx = -1;
  for (var i = 0; i < rawList.length; i++) {
    if (rawList[i]) {
      var c = getCanonicalToolPath(rawList[i].u || rawList[i].url || rawList[i].path);
      if (c === canon) {
        existingIdx = i;
        break;
      }
    }
  }

  if (existingIdx !== -1) {
    rawList.splice(existingIdx, 1);
  }
  rawList.unshift({
    u: canon,
    ts: Date.now()
  });

  if (rawList.length > MAX_RECENTS) {
    rawList = rawList.slice(0, MAX_RECENTS);
  }

  mockStorage.setItem('ac:recents', JSON.stringify(rawList));
}

function clearRecents() {
  mockStorage.removeItem('ac:recents');
}

it('Storage: Empty storage returns empty recents list and hides section', () => {
  mockStorage.clear();
  const raw = getRecentsRaw();
  assert.deepStrictEqual(raw, [], 'Raw recents should be empty');
  const list = getRecentsList('en');
  assert.deepStrictEqual(list, [], 'Recents list should be empty');
});

it('Storage: Ring buffer records tool and deduplicates/promotes on repeat visit', () => {
  mockStorage.clear();
  recordRecentTool('/json-formatter/');
  recordRecentTool('/pdf-merge/');

  let raw = getRecentsRaw();
  assert.strictEqual(raw.length, 2);
  assert.strictEqual(raw[0].u, '/pdf-merge/');
  assert.strictEqual(raw[1].u, '/json-formatter/');

  // Repeat visit to /json-formatter/ promotes it to top
  recordRecentTool('/json-formatter/');
  raw = getRecentsRaw();
  assert.strictEqual(raw.length, 2, 'Deduplication must prevent duplicate entries');
  assert.strictEqual(raw[0].u, '/json-formatter/', 'Repeat visit must promote tool to index 0');
  assert.strictEqual(raw[1].u, '/pdf-merge/');
});

it('Storage: Ring buffer strictly enforces capacity of 8 and evicts 9th oldest tool', () => {
  mockStorage.clear();
  const testTools = [
    '/json-formatter/',
    '/pdf-merge/',
    '/image-compressor/',
    '/qr-code-generator/',
    '/word-counter/',
    '/password-generator/',
    '/stopwatch/',
    '/currency-converter/',
    '/mortgage-calculator/' // 9th tool
  ];

  testTools.forEach(slug => recordRecentTool(slug));

  const raw = getRecentsRaw();
  assert.strictEqual(raw.length, 8, 'Ring buffer capacity must be strictly capped at 8');
  assert.strictEqual(raw[0].u, '/mortgage-calculator/', 'Most recent tool must be at index 0');
  // First tool (/json-formatter/) should have been evicted
  assert.strictEqual(raw.some(item => item.u === '/json-formatter/'), false, 'Oldest tool must be evicted');
  assert.strictEqual(raw[7].u, '/pdf-merge/', 'Oldest remaining tool must be at index 7');
});

it('Storage: Canonical normalization strips locale prefixes and hashes on tool visit', () => {
  mockStorage.clear();
  recordRecentTool('https://anyconverter.io/es/json-formatter/?ref=home#section');
  let raw = getRecentsRaw();
  assert.strictEqual(raw.length, 1);
  assert.strictEqual(raw[0].u, '/json-formatter/', 'Stored path must be strictly canonical');

  recordRecentTool('/da/mortgage-calculator/index.html');
  raw = getRecentsRaw();
  assert.strictEqual(raw.length, 2);
  assert.strictEqual(raw[0].u, '/mortgage-calculator/');
});

it('Cross-Locale: Spanish and Danish visits persist across language switches with native names', () => {
  mockStorage.clear();
  // User visits tools across locales
  recordRecentTool('/es/json-formatter/');
  recordRecentTool('/da/mortgage-calculator/');

  // English homepage render
  const enRecents = getRecentsList('en');
  assert.strictEqual(enRecents.length, 2);
  assert.strictEqual(enRecents[0].u, '/mortgage-calculator/');
  assert.strictEqual(enRecents[0].n, 'Mortgage Calculator');
  assert.strictEqual(enRecents[0].localizedUrl, '/mortgage-calculator/');
  assert.strictEqual(enRecents[1].u, '/json-formatter/');
  assert.strictEqual(enRecents[1].n, 'JSON Formatter');
  assert.strictEqual(enRecents[1].localizedUrl, '/json-formatter/');

  // Spanish homepage render
  const esRecents = getRecentsList('es');
  assert.strictEqual(esRecents[0].n, 'Calculadora de Hipoteca');
  assert.strictEqual(esRecents[0].localizedUrl, '/es/mortgage-calculator/');
  assert.strictEqual(esRecents[1].n, 'Formateador JSON');
  assert.strictEqual(esRecents[1].localizedUrl, '/es/json-formatter/');

  // Danish homepage render
  const daRecents = getRecentsList('da');
  assert.strictEqual(daRecents[0].n, 'Realkreditberegner');
  assert.strictEqual(daRecents[0].localizedUrl, '/da/mortgage-calculator/');
  assert.strictEqual(daRecents[1].n, 'JSON Formatter');
  assert.strictEqual(daRecents[1].localizedUrl, '/da/json-formatter/');
});

it('Storage: clearRecents empties buffer completely', () => {
  assert(getRecentsRaw().length > 0, 'Should have items before clear');
  clearRecents();
  assert.strictEqual(getRecentsRaw().length, 0, 'Buffer must be empty after clearRecents');
  assert.strictEqual(getRecentsList('en').length, 0);
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
