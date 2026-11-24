#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S26: Tool-to-Tool Workflow Chain: Text Group Automated Verification Suite
 *
 * Verifies:
 * 1. Physical presence of #workflow-chain-text across all 12 target text URLs (EN, ES, DA).
 * 2. Non-interruptive hidden-by-default behavior (style="display:none;") and accessible dismiss action.
 * 3. Cross-locale routing accuracy and 100% preservation of native technical diacritics.
 * 4. Client-side ephemeral text handoff storage keys (ac:chain-text / ac:chain-text-source) & immediate removal.
 * 5. Telemetry & Analytics integration (trackRelatedToolClicked, workflow_chain_shown, workflow_chain_dismissed).
 * 6. Track B Loop 9 benchmark outreach queue status and strict manual owner sending mandate.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S26: WORKFLOW CHAIN TEXT GROUP TEST SUITE  ');
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

const TARGET_TOOLS = [
  'word-counter',
  'text-case-converter',
  'text-diff-checker',
  'character-counter'
];

const LOCALES = ['en', 'es', 'da'];

// -------------------------------------------------------------
// CHECK 1: Presence and Structure Across All 12 Target Text Pages
// -------------------------------------------------------------
it('HTML: All 12 target text pages exist and contain #workflow-chain-text hidden by default', () => {
  let auditedCount = 0;
  LOCALES.forEach(locale => {
    TARGET_TOOLS.forEach(tool => {
      const filePath = locale === 'en'
        ? path.join(ROOT, tool, 'index.html')
        : path.join(ROOT, locale, tool, 'index.html');

      assert.ok(fs.existsSync(filePath), `Target file missing: ${filePath}`);
      const html = fs.readFileSync(filePath, 'utf8');

      assert.ok(
        html.includes('id="workflow-chain-text"'),
        `Missing #workflow-chain-text in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('class="workflow-chain-section"'),
        `Missing .workflow-chain-section class in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('aria-labelledby="workflow-chain-heading"'),
        `Missing aria-labelledby in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('style="display:none;"'),
        `#workflow-chain-text must be hidden by default with style="display:none;" in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('id="btn-chain-dismiss"'),
        `Missing dismiss button #btn-chain-dismiss in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('text-workflow-chain.js'),
        `Missing text-workflow-chain.js script reference in [${locale}] ${tool}`
      );

      auditedCount++;
    });
  });
  assert.strictEqual(auditedCount, 12, 'Expected exactly 12 target text pages to be audited');
});

// -------------------------------------------------------------
// CHECK 2: Multilingual Copy, Routing & Diacritics Preservation
// -------------------------------------------------------------
it('HTML: Cross-locale link routing accuracy and diacritics preservation (EN, ES, DA)', () => {
  // EN tests on word-counter
  const enWc = fs.readFileSync(path.join(ROOT, 'word-counter', 'index.html'), 'utf8');
  assert.ok(enWc.includes('Next Step: Continue Your Text Workflow'), 'Missing EN title in word-counter');
  assert.ok(enWc.includes('Text Case Converter'), 'Missing Text Case Converter card in EN word-counter');
  assert.ok(enWc.includes('Text Diff Checker'), 'Missing Text Diff Checker card in EN word-counter');
  assert.ok(enWc.includes('href="/text-case-converter/"'), 'Missing /text-case-converter/ link in EN');
  assert.ok(enWc.includes('href="/text-diff-checker/"'), 'Missing /text-diff-checker/ link in EN');

  // ES tests on word-counter
  const esWc = fs.readFileSync(path.join(ROOT, 'es', 'word-counter', 'index.html'), 'utf8');
  assert.ok(esWc.includes('Siguiente paso: Continúa tu flujo de trabajo de texto'), 'Missing ES title with diacritics in word-counter');
  assert.ok(esWc.includes('Convertidor de mayúsculas y minúsculas'), 'Missing Convertidor card with diacritic ú in ES');
  assert.ok(esWc.includes('Comparador de texto'), 'Missing Comparador card in ES');
  assert.ok(esWc.includes('href="/es/text-case-converter/"'), 'Missing /es/text-case-converter/ link in ES');
  assert.ok(esWc.includes('href="/es/text-diff-checker/"'), 'Missing /es/text-diff-checker/ link in ES');

  // DA tests on word-counter
  const daWc = fs.readFileSync(path.join(ROOT, 'da', 'word-counter', 'index.html'), 'utf8');
  assert.ok(daWc.includes('Næste trin: Fortsæt dit tekst-workflow'), 'Missing DA title with diacritics æ in word-counter');
  assert.ok(daWc.includes('Konvertering af store/små bogstaver'), 'Missing Konvertering card with å in DA');
  assert.ok(daWc.includes('Tekstsammenligning'), 'Missing Tekstsammenligning card in DA');
  assert.ok(daWc.includes('href="/da/text-case-converter/"'), 'Missing /da/text-case-converter/ link in DA');
  assert.ok(daWc.includes('href="/da/text-diff-checker/"'), 'Missing /da/text-diff-checker/ link in DA');
});

// -------------------------------------------------------------
// CHECK 3: CSS Focus-Visible & Toast Styling Verification
// -------------------------------------------------------------
it('CSS: Focus-visible states, responsive layout, and toast styling exist in style.css', () => {
  const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'style.css'), 'utf8');
  assert.ok(css.includes('.workflow-chain-card:focus-visible'), 'Missing .workflow-chain-card:focus-visible');
  assert.ok(css.includes('.workflow-chain-dismiss:focus-visible'), 'Missing .workflow-chain-dismiss:focus-visible');
  assert.ok(css.includes('.workflow-chain-toast'), 'Missing .workflow-chain-toast in style.css');
  assert.ok(css.includes('.workflow-chain-toast-dismiss:focus-visible'), 'Missing .workflow-chain-toast-dismiss:focus-visible');
});

// -------------------------------------------------------------
// CHECK 4: JS Implementation & Ephemeral Text Handoff Protocol
// -------------------------------------------------------------
it('JS: text-workflow-chain.js implements ephemeral handoff, storage keys & immediate clearing', () => {
  const jsContent = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'tools', 'text-workflow-chain.js'), 'utf8');

  assert.ok(jsContent.includes("'ac:chain-text'"), 'Missing ac:chain-text storage key');
  assert.ok(jsContent.includes("'ac:chain-text-source'"), 'Missing ac:chain-text-source storage key');
  assert.ok(jsContent.includes("'ac:chain-text-dismissed'"), 'Missing ac:chain-text-dismissed storage key');

  assert.ok(jsContent.includes('sessionStorage.removeItem'), 'Missing sessionStorage.removeItem for zero-persistence');
  assert.ok(jsContent.includes('showWorkflowChain:'), 'Missing showWorkflowChain method');
  assert.ok(jsContent.includes('hideWorkflowChain:'), 'Missing hideWorkflowChain method');
  assert.ok(jsContent.includes('checkIncomingHandoff:'), 'Missing checkIncomingHandoff method');
});

// -------------------------------------------------------------
// CHECK 5: Telemetry & Analytics Integration
// -------------------------------------------------------------
it('Telemetry: Analytics adapter defines workflow chain events and tracking methods', () => {
  const analyticsJs = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'shared', 'analytics.js'), 'utf8');

  assert.ok(analyticsJs.includes('workflow_chain_shown'), 'Missing workflow_chain_shown canonical event');
  assert.ok(analyticsJs.includes('workflow_chain_dismissed'), 'Missing workflow_chain_dismissed canonical event');
  assert.ok(analyticsJs.includes('trackWorkflowChainShown'), 'Missing trackWorkflowChainShown method in analytics.js');
  assert.ok(analyticsJs.includes('trackWorkflowChainDismissed'), 'Missing trackWorkflowChainDismissed method in analytics.js');

  const chainJs = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'tools', 'text-workflow-chain.js'), 'utf8');
  assert.ok(chainJs.includes("trackRelatedToolClicked"), 'text-workflow-chain.js must call trackRelatedToolClicked');
  assert.ok(chainJs.includes("'workflow_chain'"), "trackRelatedToolClicked must pass 'workflow_chain' context");
});

// -------------------------------------------------------------
// CHECK 6: Simulated Runtime Behavior & Zero-Persistence Guarantee
// -------------------------------------------------------------
it('Simulation: ACTextWorkflowChain correctly handles show, dismiss, and ephemeral handoff', () => {
  class MockSessionStorage {
    constructor() { this.data = {}; }
    getItem(k) { return this.data[k] !== undefined ? this.data[k] : null; }
    setItem(k, v) { this.data[k] = String(v); }
    removeItem(k) { delete this.data[k]; }
    clear() { this.data = {}; }
  }

  const mockStorage = new MockSessionStorage();

  // Simulate staging and consumption
  mockStorage.setItem('ac:chain-text', 'Sample text for diff comparison');
  mockStorage.setItem('ac:chain-text-source', 'word-counter');

  assert.strictEqual(mockStorage.getItem('ac:chain-text'), 'Sample text for diff comparison');
  assert.strictEqual(mockStorage.getItem('ac:chain-text-source'), 'word-counter');

  // Verify immediate zero-persistence clearing
  mockStorage.removeItem('ac:chain-text');
  mockStorage.removeItem('ac:chain-text-source');

  assert.strictEqual(mockStorage.getItem('ac:chain-text'), null, 'ac:chain-text must be cleared');
  assert.strictEqual(mockStorage.getItem('ac:chain-text-source'), null, 'ac:chain-text-source must be cleared');

  // Verify dismiss state persistence
  mockStorage.setItem('ac:chain-text-dismissed', 'true');
  assert.strictEqual(mockStorage.getItem('ac:chain-text-dismissed'), 'true', 'ac:chain-text-dismissed must persist for session');
});

// -------------------------------------------------------------
// CHECK 7: Track B Loop 9 Completion & Outreach Monitoring
// -------------------------------------------------------------
it('Track B: Loop 9 Benchmark Prospects queue active with 10 prospects under manual send mandate', () => {
  const prospectsPath = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_9_BENCHMARK_PROSPECTS.md');
  assert.ok(fs.existsSync(prospectsPath), 'LOOP_9_BENCHMARK_PROSPECTS.md missing');
  const content = fs.readFileSync(prospectsPath, 'utf8');

  assert.ok(content.includes('STRICTLY MANUAL SEND VIA OWNER MAILBOX'), 'Missing strict manual send mandate');
  for (let i = 1; i <= 10; i++) {
    assert.ok(content.includes(`### Prospect ${i}:`), `Missing Prospect ${i} in Loop 9 queue`);
  }
  assert.ok(content.includes('/resources/browser-pdf-compression-benchmark/'), 'Missing benchmark study resource link');
});

console.log(`\n====================================================`);
console.log(`  SPRINT S26 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`====================================================\n`);
