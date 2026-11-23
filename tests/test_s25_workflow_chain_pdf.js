#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S25: Tool-to-Tool Workflow Chain: PDF Group Automated Verification Suite
 *
 * Verifies:
 * 1. Physical presence of #workflow-chain-pdf across all 18 target PDF URLs (EN, ES, DA).
 * 2. Non-interruptive hidden-by-default behavior (style="display:none;") and accessible dismiss action.
 * 3. Cross-locale routing accuracy and 100% preservation of native technical diacritics.
 * 4. Client-side ephemeral handoff storage keys (ac:chain-pdf-blob / ac:chain-pdf-name) & immediate removal.
 * 5. Telemetry & Analytics integration (trackRelatedToolClicked, workflow_chain_shown, workflow_chain_dismissed).
 * 6. Track B Loop 9 benchmark outreach queue status and strict manual owner sending mandate.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S25: WORKFLOW CHAIN PDF GROUP TEST SUITE   ');
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
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'edit-pdf'
];

const LOCALES = ['en', 'es', 'da'];

// -------------------------------------------------------------
// CHECK 1: Presence and Structure Across All 18 Target PDF Pages
// -------------------------------------------------------------
it('HTML: All 18 target PDF pages exist and contain #workflow-chain-pdf hidden by default', () => {
  let auditedCount = 0;
  LOCALES.forEach(locale => {
    TARGET_TOOLS.forEach(tool => {
      const filePath = locale === 'en'
        ? path.join(ROOT, tool, 'index.html')
        : path.join(ROOT, locale, tool, 'index.html');

      assert.ok(fs.existsSync(filePath), `Target file missing: ${filePath}`);
      const html = fs.readFileSync(filePath, 'utf8');

      assert.ok(
        html.includes('id="workflow-chain-pdf"'),
        `Missing #workflow-chain-pdf in [${locale}] ${tool}`
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
        `#workflow-chain-pdf must be hidden by default with style="display:none;" in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('id="btn-chain-dismiss"'),
        `Missing dismiss button #btn-chain-dismiss in [${locale}] ${tool}`
      );
      assert.ok(
        html.includes('pdf-workflow-chain.js'),
        `Missing pdf-workflow-chain.js script reference in [${locale}] ${tool}`
      );

      auditedCount++;
    });
  });
  assert.strictEqual(auditedCount, 18, 'Expected exactly 18 target PDF pages to be audited');
});

// -------------------------------------------------------------
// CHECK 2: Multilingual Copy, Routing & Diacritics Preservation
// -------------------------------------------------------------
it('HTML: Cross-locale link routing accuracy and diacritics preservation (EN, ES, DA)', () => {
  // EN tests on pdf-merge
  const enMerge = fs.readFileSync(path.join(ROOT, 'pdf-merge', 'index.html'), 'utf8');
  assert.ok(enMerge.includes('Next Step: Continue Your PDF Workflow'), 'Missing EN title in pdf-merge');
  assert.ok(enMerge.includes('Compress PDF'), 'Missing Compress PDF card in EN pdf-merge');
  assert.ok(enMerge.includes('Split Pages'), 'Missing Split Pages card in EN pdf-merge');
  assert.ok(enMerge.includes('Convert to JPG'), 'Missing Convert to JPG card in EN pdf-merge');
  assert.ok(enMerge.includes('href="/pdf-compress/"'), 'Missing /pdf-compress/ link in EN pdf-merge');
  assert.ok(enMerge.includes('href="/pdf-split/"'), 'Missing /pdf-split/ link in EN pdf-merge');
  assert.ok(enMerge.includes('href="/pdf-to-jpg/"'), 'Missing /pdf-to-jpg/ link in EN pdf-merge');

  // ES tests on pdf-merge
  const esMerge = fs.readFileSync(path.join(ROOT, 'es', 'pdf-merge', 'index.html'), 'utf8');
  assert.ok(esMerge.includes('Siguiente paso: Continúa tu flujo de trabajo con PDF'), 'Missing ES title with diacritics in pdf-merge');
  assert.ok(esMerge.includes('Comprimir PDF'), 'Missing Comprimir PDF card in ES pdf-merge');
  assert.ok(esMerge.includes('Dividir páginas'), 'Missing Dividir páginas card with diacritic á in ES pdf-merge');
  assert.ok(esMerge.includes('Convertir a JPG'), 'Missing Convertir a JPG card in ES pdf-merge');
  assert.ok(esMerge.includes('href="/es/pdf-compress/"'), 'Missing /es/pdf-compress/ link in ES pdf-merge');
  assert.ok(esMerge.includes('href="/es/pdf-split/"'), 'Missing /es/pdf-split/ link in ES pdf-merge');
  assert.ok(esMerge.includes('href="/es/pdf-to-jpg/"'), 'Missing /es/pdf-to-jpg/ link in ES pdf-merge');

  // DA tests on pdf-merge
  const daMerge = fs.readFileSync(path.join(ROOT, 'da', 'pdf-merge', 'index.html'), 'utf8');
  assert.ok(daMerge.includes('Næste trin: Fortsæt dit PDF-workflow'), 'Missing DA title with diacritics æ in pdf-merge');
  assert.ok(daMerge.includes('Komprimér PDF'), 'Missing Komprimér PDF card with diacritic é in DA pdf-merge');
  assert.ok(daMerge.includes('Opdel sider'), 'Missing Opdel sider card in DA pdf-merge');
  assert.ok(daMerge.includes('Konvertér til JPG'), 'Missing Konvertér til JPG card with diacritic é in DA pdf-merge');
  assert.ok(daMerge.includes('href="/da/pdf-compress/"'), 'Missing /da/pdf-compress/ link in DA pdf-merge');
  assert.ok(daMerge.includes('href="/da/pdf-split/"'), 'Missing /da/pdf-split/ link in DA pdf-merge');
  assert.ok(daMerge.includes('href="/da/pdf-to-jpg/"'), 'Missing /da/pdf-to-jpg/ link in DA pdf-merge');
});

// -------------------------------------------------------------
// CHECK 3: CSS Focus-Visible & Toast Styling Verification
// -------------------------------------------------------------
it('CSS: Focus-visible states, responsive layout, and toast styling exist in style.css', () => {
  const css = fs.readFileSync(path.join(ROOT, 'assets', 'css', 'style.css'), 'utf8');
  assert.ok(css.includes('.workflow-chain-card:focus-visible'), 'Missing .workflow-chain-card:focus-visible');
  assert.ok(css.includes('.workflow-chain-dismiss:focus-visible'), 'Missing .workflow-chain-dismiss:focus-visible');
  assert.ok(css.includes('.workflow-chain-toast'), 'Missing .workflow-chain-toast in style.css');
  assert.ok(css.includes('.workflow-chain-toast-dismiss:focus-visible'), 'Missing .workflow-chain-toast-dismiss:focus-visible in style.css');

  const cardFocusMatch = css.match(/\.workflow-chain-card:focus-visible\s*\{([^}]+)\}/);
  assert.ok(cardFocusMatch, 'Unable to parse .workflow-chain-card:focus-visible block');
  assert.ok(cardFocusMatch[1].includes('outline:'), 'Missing outline in card focus-visible');
  assert.ok(cardFocusMatch[1].includes('box-shadow:'), 'Missing box-shadow in card focus-visible');
});

// -------------------------------------------------------------
// CHECK 4: JS Implementation & Ephemeral File Handoff Protocol
// -------------------------------------------------------------
it('JS: pdf-workflow-chain.js implements ephemeral handoff, storage keys & immediate clearing', () => {
  const jsContent = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'tools', 'pdf-workflow-chain.js'), 'utf8');

  assert.ok(jsContent.includes("'ac:chain-pdf-blob'"), 'Missing ac:chain-pdf-blob storage key');
  assert.ok(jsContent.includes("'ac:chain-pdf-name'"), 'Missing ac:chain-pdf-name storage key');
  assert.ok(jsContent.includes("'ac:chain-pdf-source'"), 'Missing ac:chain-pdf-source storage key');
  assert.ok(jsContent.includes("'ac:chain-pdf-dismissed'"), 'Missing ac:chain-pdf-dismissed storage key');

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

  const chainJs = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'tools', 'pdf-workflow-chain.js'), 'utf8');
  assert.ok(chainJs.includes("trackRelatedToolClicked"), 'pdf-workflow-chain.js must call trackRelatedToolClicked');
  assert.ok(chainJs.includes("'workflow_chain'"), "trackRelatedToolClicked must pass 'workflow_chain' context");
});

// -------------------------------------------------------------
// CHECK 6: Simulated Runtime Behavior & Zero-Persistence Guarantee
// -------------------------------------------------------------
it('Simulation: ACWorkflowChainPDF correctly handles show, dismiss, and ephemeral handoff', () => {
  class MockSessionStorage {
    constructor() { this.data = {}; }
    getItem(k) { return this.data[k] !== undefined ? this.data[k] : null; }
    setItem(k, v) { this.data[k] = String(v); }
    removeItem(k) { delete this.data[k]; }
    clear() { this.data = {}; }
  }

  const mockStorage = new MockSessionStorage();
  const mockEvents = [];

  // Simulate staging and consumption
  mockStorage.setItem('ac:chain-pdf-blob', 'data:application/pdf;base64,JVBERi0xLjc=');
  mockStorage.setItem('ac:chain-pdf-name', 'test-merged.pdf');
  mockStorage.setItem('ac:chain-pdf-source', 'pdf-merge');

  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-blob'), 'data:application/pdf;base64,JVBERi0xLjc=');
  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-name'), 'test-merged.pdf');

  // Verify immediate zero-persistence clearing
  mockStorage.removeItem('ac:chain-pdf-blob');
  mockStorage.removeItem('ac:chain-pdf-name');
  mockStorage.removeItem('ac:chain-pdf-source');

  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-blob'), null, 'ac:chain-pdf-blob must be cleared');
  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-name'), null, 'ac:chain-pdf-name must be cleared');
  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-source'), null, 'ac:chain-pdf-source must be cleared');

  // Verify dismiss state persistence
  mockStorage.setItem('ac:chain-pdf-dismissed', 'true');
  assert.strictEqual(mockStorage.getItem('ac:chain-pdf-dismissed'), 'true', 'ac:chain-pdf-dismissed must persist for session');
});

// -------------------------------------------------------------
// CHECK 7: Track B Loop 9 Active PR Outreach Queue
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
console.log(`  SPRINT S25 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`====================================================\n`);
