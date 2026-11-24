#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S27: Theme Persistence Hardening + Global Keyboard Shortcuts & Discovery Modal
 *
 * Automated Verification Suite:
 * 1. Physical presence and semantic injection of #shortcuts-modal and header button #btn-shortcuts-help in assets/js/shared.js.
 * 2. Keyboard shortcut bindings (?, /, Esc, Alt+F, Alt+T) and input shielding guard logic.
 * 3. Focus management, focus trap (WCAG 2.2 AA), backdrop dismiss, and high-contrast :focus-visible outlines.
 * 4. Theme persistence (localStorage 'ac_theme'), matchMedia prefers-color-scheme fallback, real-time listener, and cross-tab 'storage' synchronization.
 * 5. Multilingual parity and native diacritics preservation (á, é, í, ó, ú, ñ, æ, ø, å) across EN, ES, DA.
 * 6. Telemetry & Analytics integration (shortcut_used, shortcuts_modal_viewed).
 * 7. Track B Loop 10 embed partner queue (6 partners) and T-INT-01 pitch drafts.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S27: THEME PERSISTENCE & SHORTCUTS SUITE   ');
console.log('====================================================\n');

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

const sharedJsPath = path.join(ROOT, 'assets', 'js', 'shared.js');
const styleCssPath = path.join(ROOT, 'assets', 'css', 'style.css');
const analyticsJsPath = path.join(ROOT, 'assets', 'js', 'shared', 'analytics.js');
const loop10Path = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_10_EMBED_PARTNERS.md');

assert.ok(fs.existsSync(sharedJsPath), 'shared.js exists');
assert.ok(fs.existsSync(styleCssPath), 'style.css exists');
assert.ok(fs.existsSync(analyticsJsPath), 'analytics.js exists');
assert.ok(fs.existsSync(loop10Path), 'LOOP_10_EMBED_PARTNERS.md exists');

const sharedJs = fs.readFileSync(sharedJsPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const analyticsJs = fs.readFileSync(analyticsJsPath, 'utf8');
const loop10 = fs.readFileSync(loop10Path, 'utf8');

// -------------------------------------------------------------
// CHECK 1: Presence & Structure of Shortcuts Modal & Header Button
// -------------------------------------------------------------
it('Modal Structure: #shortcuts-modal with role="dialog", aria-modal="true", and #btn-shortcuts-help exist', () => {
  assert.ok(sharedJs.includes('id="shortcuts-modal"'), 'Missing #shortcuts-modal in shared.js');
  assert.ok(sharedJs.includes('role="dialog"'), 'Missing role="dialog" on shortcuts-modal');
  assert.ok(sharedJs.includes('aria-modal="true"'), 'Missing aria-modal="true" on shortcuts-modal');
  assert.ok(sharedJs.includes('aria-labelledby="shortcuts-modal-title"'), 'Missing aria-labelledby="shortcuts-modal-title"');
  assert.ok(sharedJs.includes('id="btn-shortcuts-help"'), 'Missing header trigger #btn-shortcuts-help');
  assert.ok(sharedJs.includes('id="btn-shortcuts-close"'), 'Missing close button #btn-shortcuts-close');
  assert.ok(sharedJs.includes('id="shortcuts-backdrop"'), 'Missing backdrop #shortcuts-backdrop');
});

// -------------------------------------------------------------
// CHECK 2: Global Shortcuts Keydown Dispatcher Bindings
// -------------------------------------------------------------
it('Shortcuts Dispatcher: Handles "?", "/", "Escape", "Alt+F", and "Alt+T"', () => {
  assert.ok(sharedJs.includes("e.key === '?'"), 'Missing "?" key handler');
  assert.ok(sharedJs.includes("e.key === '/'"), 'Missing "/" key handler');
  assert.ok(sharedJs.includes("e.key === 'Escape'"), 'Missing "Escape" key handler');
  assert.ok(sharedJs.includes("e.key === 'f' || e.key === 'F'"), 'Missing "Alt+F" key handler');
  assert.ok(sharedJs.includes("e.key === 't' || e.key === 'T'"), 'Missing "Alt+T" key handler');
});

// -------------------------------------------------------------
// CHECK 3: Input Shielding Guard Logic
// -------------------------------------------------------------
it('Input Shielding Guard: Prevents hotkey execution while typing inside inputs/textareas/selects/contenteditable', () => {
  assert.ok(sharedJs.includes('isInputActive'), 'Missing isInputActive helper');
  assert.ok(sharedJs.includes("'input'") && sharedJs.includes("'textarea'") && sharedJs.includes("'select'"), 'isInputActive must check input, textarea, and select');
  assert.ok(sharedJs.includes('isContentEditable') || sharedJs.includes('contenteditable'), 'isInputActive must check contenteditable');
  assert.ok(sharedJs.includes('document.activeElement.blur()'), 'Escape must safely blur active input');
});

// -------------------------------------------------------------
// CHECK 4: Focus Management, Trap, Backdrop Dismiss & CSS Focus
// -------------------------------------------------------------
it('Focus Management & A11y: Manages active focus, tab trapping, backdrop dismissal, and high-contrast outlines', () => {
  assert.ok(sharedJs.includes('lastFocusedTrigger'), 'Must save previous active trigger element');
  assert.ok(sharedJs.includes('closeBtn.focus()'), 'Must shift focus to close button upon modal opening');
  assert.ok(sharedJs.includes("e.key === 'Tab'"), 'Must trap tab focus within modal');
  assert.ok(sharedJs.includes('backdrop.onclick = closeShortcutsModal'), 'Clicking backdrop must dismiss modal');
  assert.ok(styleCss.includes('.shortcuts-help-btn:focus-visible'), 'Missing :focus-visible for shortcuts-help-btn');
  assert.ok(styleCss.includes('.shortcuts-close-btn:focus-visible'), 'Missing :focus-visible for shortcuts-close-btn');
  assert.ok(styleCss.includes('#shortcuts-modal'), 'Missing #shortcuts-modal CSS styles');
  assert.ok(styleCss.includes('#shortcuts-modal.open'), 'Missing .open CSS display flex state');
});

// -------------------------------------------------------------
// CHECK 5: Theme Persistence Hardening & OS Synchronization
// -------------------------------------------------------------
it('Theme Hardening: Honors localStorage ac_theme, matchMedia prefers-color-scheme, and storage event cross-tab sync', () => {
  assert.ok(sharedJs.includes("localStorage.getItem('ac_theme')"), 'Must read ac_theme from localStorage');
  assert.ok(sharedJs.includes("window.matchMedia('(prefers-color-scheme: dark)')"), 'Must query prefers-color-scheme');
  assert.ok(sharedJs.includes("mediaQuery.addEventListener('change'") || sharedJs.includes("mediaQuery.addListener"), 'Must listen for live OS preference changes');
  assert.ok(sharedJs.includes("window.addEventListener('storage'"), 'Must listen for window storage events for cross-tab sync');
  assert.ok(sharedJs.includes("e.key === 'ac_theme'"), 'Must check e.key === ac_theme on storage event');
  assert.ok(sharedJs.includes('applyStoredTheme();'), 'applyStoredTheme must execute early on script load');
});

// -------------------------------------------------------------
// CHECK 6: Multilingual Parity & Diacritics Preservation
// -------------------------------------------------------------
it('Localization Parity: Preserves exact diacritics across EN, ES, DA in SHORTCUTS_I18N', () => {
  // English strings
  assert.ok(sharedJs.includes('Keyboard Shortcuts'), 'Missing EN "Keyboard Shortcuts"');
  assert.ok(sharedJs.includes('Open shortcuts help'), 'Missing EN "Open shortcuts help"');
  assert.ok(sharedJs.includes('Focus search'), 'Missing EN "Focus search"');
  assert.ok(sharedJs.includes('Close modal / unfocus'), 'Missing EN "Close modal / unfocus"');
  assert.ok(sharedJs.includes('Favorite current tool'), 'Missing EN "Favorite current tool"');
  assert.ok(sharedJs.includes('Toggle dark / light mode'), 'Missing EN "Toggle dark / light mode"');

  // Spanish strings with native diacritics (á, é, í, ó, ú, ñ)
  assert.ok(sharedJs.includes('Atajos de teclado'), 'Missing ES "Atajos de teclado"');
  assert.ok(sharedJs.includes('Abrir ayuda de atajos'), 'Missing ES "Abrir ayuda de atajos"');
  assert.ok(sharedJs.includes('Enfocar búsqueda'), 'Missing ES "Enfocar búsqueda"');
  assert.ok(sharedJs.includes('Cerrar modal / desenfocar'), 'Missing ES "Cerrar modal / desenfocar"');
  assert.ok(sharedJs.includes('Añadir a favoritos'), 'Missing ES "Añadir a favoritos"');
  assert.ok(sharedJs.includes('Alternar modo oscuro / claro'), 'Missing ES "Alternar modo oscuro / claro"');

  // Danish strings with native diacritics (æ, ø, å, é)
  assert.ok(sharedJs.includes('Tastaturgenveje'), 'Missing DA "Tastaturgenveje"');
  assert.ok(sharedJs.includes('Åbn genvejshjælp'), 'Missing DA "Åbn genvejshjælp"');
  assert.ok(sharedJs.includes('Fokusér søgning'), 'Missing DA "Fokusér søgning"');
  assert.ok(sharedJs.includes('Luk modal / fjern fokus'), 'Missing DA "Luk modal / fjern fokus"');
  assert.ok(sharedJs.includes('Føj til favoritter'), 'Missing DA "Føj til favoritter"');
  assert.ok(sharedJs.includes('Skift mørk / lys tilstand'), 'Missing DA "Skift mørk / lys tilstand"');
});

// -------------------------------------------------------------
// CHECK 7: Telemetry & Analytics Event Registration
// -------------------------------------------------------------
it('Telemetry Integration: Dispatches shortcut_used and shortcuts_modal_viewed events with allowed keys', () => {
  assert.ok(analyticsJs.includes('shortcut_used'), 'analytics.js must allow shortcut_used event');
  assert.ok(analyticsJs.includes('shortcuts_modal_viewed'), 'analytics.js must allow shortcuts_modal_viewed event');
  assert.ok(sharedJs.includes("'shortcut_used'"), 'shared.js must dispatch shortcut_used');
  assert.ok(sharedJs.includes("'shortcuts_modal_viewed'"), 'shared.js must dispatch shortcuts_modal_viewed');
  assert.ok(sharedJs.includes("'question_mark'"), 'Must track key: question_mark');
  assert.ok(sharedJs.includes("'slash'"), 'Must track key: slash');
  assert.ok(sharedJs.includes("'escape'"), 'Must track key: escape');
  assert.ok(sharedJs.includes("'alt_f'"), 'Must track key: alt_f');
});

// -------------------------------------------------------------
// CHECK 8: Track B Loop 10 Embed Partner Pilots Queue
// -------------------------------------------------------------
it('Track B Loop 10: Documents 6 publisher/education partners and custom T-INT-01 pitch drafts', () => {
  assert.ok(loop10.includes('Loop 10 — Embed Partner Pilots'), 'Missing Loop 10 title');
  assert.ok(loop10.includes('T-INT-01'), 'Missing T-INT-01 template in Loop 10');
  assert.ok(loop10.includes('/embed/percentage-calculator/'), 'Missing percentage-calculator embed route');
  assert.ok(loop10.includes('/embed/loan-calculator/'), 'Missing loan-calculator embed route');
  assert.ok(loop10.includes('/embed/json-formatter/'), 'Missing json-formatter embed route');
  assert.ok(loop10.includes('/embed/date-difference-calculator/'), 'Missing date-difference-calculator embed route');
  assert.ok(loop10.includes('Math Is Fun'), 'Missing Math Is Fun partner');
  assert.ok(loop10.includes('FinTech Weekly'), 'Missing FinTech Weekly partner');
  assert.ok(loop10.includes('freeCodeCamp'), 'Missing freeCodeCamp partner');
  assert.ok(loop10.includes('TimeAndDate'), 'Missing TimeAndDate partner');
  assert.ok(loop10.includes('SitePoint'), 'Missing SitePoint partner');
  assert.ok(loop10.includes('Baeldung'), 'Missing Baeldung partner');
  assert.ok(loop10.includes('STRICTLY MANUAL SEND VIA OWNER MAILBOX'), 'Missing manual send compliance mandate');
});

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
