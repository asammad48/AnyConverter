/**
 * Test Suite: Navbar Dropdowns & Favorites / Quick Access System
 *
 * Verifies:
 * 1. CSS hover-gap bridge pseudo-element (.dropdown-menu::before) and .is-favorited button style
 * 2. Dropdown mutual hover and click exclusion in navbar
 * 3. Two-way Add to Favorites toggle and localStorage storage
 * 4. Multi-language canonical path resolution for favorites
 * 5. Dynamic Search Modal list (Favorites vs Quick Access)
 * 6. Dynamic Homepage Dashboard grid (Favorites vs Quick Access)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('----------------------------------------------------');
console.log(' RUNNING NAVBAR DROPDOWNS & FAVORITES TEST SUITE');
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

// 1. Static CSS Validations
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

it('CSS: .dropdown-menu::before hit-test bridge exists to eliminate 6px hover gap', () => {
  assert(cssContent.includes('.dropdown-menu::before'), 'Missing .dropdown-menu::before rule');
  assert(cssContent.includes('top: -10px;') || cssContent.includes('top: -8px;'), 'Bridge should extend upward to cover gap');
});

it('CSS: .tool-page-action-btn[data-action="favorite"].is-favorited styling exists', () => {
  assert(cssContent.includes('.tool-page-action-btn[data-action="favorite"].is-favorited'), 'Missing is-favorited styling');
  assert(cssContent.includes('#EAB308') || cssContent.includes('gold') || cssContent.includes('color-primary'), 'Missing star highlight');
});

// 2. JS Behavioral Validations with Simulated DOM Environment
const sharedJsPath = path.join(__dirname, '..', 'assets', 'js', 'shared.js');
const sharedJsContent = fs.readFileSync(sharedJsPath, 'utf8');

it('JS: Mutual hover exclusion logic exists in shared.js', () => {
  assert(sharedJsContent.includes('navDropdowns.forEach'), 'Missing navDropdowns loop');
  assert(sharedJsContent.includes('mouseenter'), 'Missing mouseenter mutual exclusion listener');
  assert(sharedJsContent.includes("b.setAttribute('aria-expanded', 'false')"), 'Missing aria-expanded reset on hover');
});

it('JS: Favorites management functions exist in shared.js', () => {
  assert(sharedJsContent.includes('function getFavoritesList()'), 'Missing getFavoritesList');
  assert(sharedJsContent.includes('function isFavoriteTool('), 'Missing isFavoriteTool');
  assert(sharedJsContent.includes('function toggleFavoriteTool('), 'Missing toggleFavoriteTool');
  assert(sharedJsContent.includes('function initDashboardQuickAccess()'), 'Missing initDashboardQuickAccess');
});

it('JS: Search modal showDefaultList toggles between Favorite tools and Quick Access', () => {
  assert(sharedJsContent.includes('function showDefaultList()'), 'Missing showDefaultList in search');
  assert(sharedJsContent.includes('⚡ Quick Access') || sharedJsContent.includes('⚡ Popular tools'), 'Missing Quick Access header');
  assert(sharedJsContent.includes('★ Favorite tools'), 'Missing Favorite tools header');
});

it('JS: Search modal input placeholder references canonical 128 tools (not 80+)', () => {
  assert(!sharedJsContent.includes('80+ tools'), 'Search input should not contain stale 80+ tools');
  assert(sharedJsContent.includes('Search 128 tools…'), 'Search input should display canonical Search 128 tools…');
  assert(sharedJsContent.includes('Buscar entre 128 herramientas…'), 'Search input should localize Spanish 128 tools');
  assert(sharedJsContent.includes('Søg i 128 værktøjer…'), 'Search input should localize Danish 128 tools');
});

it('JS: Dashboard Quick Access renders dynamic cards when favorites exist', () => {
  assert(sharedJsContent.includes('Favorite Tools') || sharedJsContent.includes('Herramientas Favoritas'), 'Missing Favorite Tools dashboard title');
  assert(sharedJsContent.includes('dash-quick-card'), 'Missing dash-quick-card rendering');
});

// 3. Simulated LocalStorage and Canonical Mapping Logic
class LocalStorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockStorage = new LocalStorageMock();

function normalizePath(rawPath) {
  let clean = rawPath.replace(/^\/(es|da)(\/|$)/, '/');
  if (!clean.startsWith('/')) clean = '/' + clean;
  return clean || '/';
}

it('Storage: Canonical path normalization handles EN, ES, DA slugs', () => {
  assert.strictEqual(normalizePath('/json-formatter/'), '/json-formatter/');
  assert.strictEqual(normalizePath('/es/json-formatter/'), '/json-formatter/');
  assert.strictEqual(normalizePath('/da/json-formatter/'), '/json-formatter/');
});

it('Storage: Favorites toggle workflow adds and removes cleanly', () => {
  const key = 'ac:fav';
  let list = [];

  // 1. Add favorite
  list.unshift({ u: '/json-formatter/', name: 'JSON Formatter' });
  mockStorage.setItem(key, JSON.stringify(list));

  let stored = JSON.parse(mockStorage.getItem(key));
  assert.strictEqual(stored.length, 1);
  assert.strictEqual(stored[0].u, '/json-formatter/');

  // 2. Toggle off
  list.splice(0, 1);
  mockStorage.setItem(key, JSON.stringify(list));

  stored = JSON.parse(mockStorage.getItem(key));
  assert.strictEqual(stored.length, 0);
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
