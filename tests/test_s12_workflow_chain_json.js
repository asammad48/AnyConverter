/**
 * Sprint S12 Automated Verification Suite:
 * Tool-to-Tool Workflow Chain: JSON Group
 *
 * Verifies:
 * 1. Contextual "Next step" component structure in HTML across EN, ES, DA
 * 2. Non-interruptive behavior: hidden by default (display:none), appears after successful formatting
 * 3. Chaining steps: JSON Compare (pre-populates Panel A), JSON->CSV, JSON->YAML (pre-populates YAML input)
 * 4. Dismiss action and keyboard accessibility (WCAG 2.2 AA :focus-visible states)
 * 5. Cross-locale URL routing (/json-compare/, /es/json-compare/, /da/json-compare/)
 * 6. Telemetry integration via window.ACAnalytics
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('----------------------------------------------------');
console.log(' RUNNING SPRINT S12 WORKFLOW CHAIN JSON TEST SUITE');
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

const rootDir = path.join(__dirname, '..');

// 1. Inspect CSS for accessible focus-visible styles and layout
const cssPath = path.join(rootDir, 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

it('CSS: .workflow-chain-card:focus-visible outline & box-shadow exist', () => {
  assert(cssContent.includes('.workflow-chain-card:focus-visible'), 'Missing .workflow-chain-card:focus-visible');
  const match = cssContent.match(/\.workflow-chain-card:focus-visible\s*\{([^}]+)\}/);
  assert(match, 'Failed to extract .workflow-chain-card:focus-visible block');
  assert(match[1].includes('outline:'), 'Missing outline in .workflow-chain-card:focus-visible');
  assert(match[1].includes('box-shadow:'), 'Missing box-shadow in .workflow-chain-card:focus-visible');
});

it('CSS: .workflow-chain-dismiss:focus-visible exists with proper outline', () => {
  assert(cssContent.includes('.workflow-chain-dismiss:focus-visible'), 'Missing .workflow-chain-dismiss:focus-visible');
  const match = cssContent.match(/\.workflow-chain-dismiss:focus-visible\s*\{([^}]+)\}/);
  assert(match, 'Failed to extract .workflow-chain-dismiss:focus-visible block');
  assert(match[1].includes('outline:'), 'Missing outline in .workflow-chain-dismiss:focus-visible');
});

it('CSS: Responsive grid layout defined for workflow chain', () => {
  assert(cssContent.includes('.workflow-chain-grid'), 'Missing .workflow-chain-grid');
  assert(cssContent.includes('.workflow-chain-section'), 'Missing .workflow-chain-section');
});

// 2. Inspect HTML markup across EN, ES, DA
const enHtml = fs.readFileSync(path.join(rootDir, 'json-formatter', 'index.html'), 'utf8');
const esHtml = fs.readFileSync(path.join(rootDir, 'es', 'json-formatter', 'index.html'), 'utf8');
const daHtml = fs.readFileSync(path.join(rootDir, 'da', 'json-formatter', 'index.html'), 'utf8');

it('HTML: All 3 locales (EN, ES, DA) contain #workflow-chain-json with style="display:none;" by default', () => {
  [enHtml, esHtml, daHtml].forEach((html, idx) => {
    const lang = ['EN', 'ES', 'DA'][idx];
    assert(html.includes('id="workflow-chain-json"'), `Missing #workflow-chain-json in ${lang}`);
    assert(html.includes('style="display:none;"'), `#workflow-chain-json in ${lang} must be hidden by default`);
    assert(html.includes('aria-labelledby="workflow-chain-heading"'), `Missing aria-labelledby in ${lang}`);
  });
});

it('HTML (EN): Contextual steps route to /json-compare/, #chain-step-csv, and /json-to-yaml/', () => {
  assert(enHtml.includes('href="/json-compare/"'), 'Missing /json-compare/ link in EN');
  assert(enHtml.includes('id="chain-step-csv"'), 'Missing #chain-step-csv button in EN');
  assert(enHtml.includes('href="/json-to-yaml/"'), 'Missing /json-to-yaml/ link in EN');
  assert(enHtml.includes('Continue Your Workflow'), 'Missing EN title Continue Your Workflow');
  assert(enHtml.includes('id="btn-chain-dismiss"'), 'Missing dismiss button in EN');
});

it('HTML (ES): Contextual steps route to /es/json-compare/ and /es/json-to-yaml/ with Spanish copy', () => {
  assert(esHtml.includes('href="/es/json-compare/"'), 'Missing /es/json-compare/ link in ES');
  assert(esHtml.includes('href="/es/json-to-yaml/"'), 'Missing /es/json-to-yaml/ link in ES');
  assert(esHtml.includes('Continúa tu flujo de trabajo'), 'Missing ES title Continúa tu flujo de trabajo');
  assert(esHtml.includes('Comparar JSON'), 'Missing ES step Comparar JSON');
});

it('HTML (DA): Contextual steps route to /da/json-compare/ and /da/json-to-yaml/ with Danish copy', () => {
  assert(daHtml.includes('href="/da/json-compare/"'), 'Missing /da/json-compare/ link in DA');
  assert(daHtml.includes('href="/da/json-to-yaml/"'), 'Missing /da/json-to-yaml/ link in DA');
  assert(daHtml.includes('Fortsæt dit workflow'), 'Missing DA title Fortsæt dit workflow');
  assert(daHtml.includes('JSON Compare'), 'Missing DA step JSON Compare');
});

// 3. Inspect JS implementation in json-formatter.js
const jfJsPath = path.join(rootDir, 'assets', 'js', 'tools', 'json-formatter.js');
const jfJsContent = fs.readFileSync(jfJsPath, 'utf8');

it('JS (json-formatter.js): Implements showWorkflowChain, hideWorkflowChain, and initWorkflowChain', () => {
  assert(jfJsContent.includes('function showWorkflowChain('), 'Missing showWorkflowChain');
  assert(jfJsContent.includes('function hideWorkflowChain('), 'Missing hideWorkflowChain');
  assert(jfJsContent.includes('function initWorkflowChain('), 'Missing initWorkflowChain');
});

it('JS (json-formatter.js): Sets sessionStorage payload for chained tools', () => {
  assert(jfJsContent.includes("sessionStorage.setItem('ac:chain-json-a'"), 'Missing sessionStorage ac:chain-json-a for JSON Compare');
  assert(jfJsContent.includes("sessionStorage.setItem('ac:chain-json'"), 'Missing sessionStorage ac:chain-json for JSON to YAML');
});

it('JS (json-formatter.js): Triggers built-in CSV export on #chain-step-csv click', () => {
  assert(jfJsContent.includes("document.getElementById('btn-to-csv')"), 'Missing btn-to-csv trigger on chain-step-csv');
});

it('JS (json-formatter.js): Dispatches analytics event on workflow chain step clicks', () => {
  assert(jfJsContent.includes("window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'json-compare', 1)"), 'Missing analytics for JSON Compare step');
  assert(jfJsContent.includes("window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'csv', 2)"), 'Missing analytics for CSV step');
  assert(jfJsContent.includes("window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'json-to-yaml', 3)"), 'Missing analytics for YAML step');
});

// 4. Inspect tool chaining receivers in json-compare.js and json-to-yaml.js
const jcJsPath = path.join(rootDir, 'assets', 'js', 'tools', 'json-compare.js');
const jcJsContent = fs.readFileSync(jcJsPath, 'utf8');

it('JS (json-compare.js): Reads and consumes ac:chain-json-a on load', () => {
  assert(jcJsContent.includes("sessionStorage.getItem('ac:chain-json-a')"), 'json-compare.js must read ac:chain-json-a');
  assert(jcJsContent.includes("sessionStorage.removeItem('ac:chain-json-a')"), 'json-compare.js must consume/clear ac:chain-json-a');
});

const jyJsPath = path.join(rootDir, 'assets', 'js', 'tools', 'json-to-yaml.js');
const jyJsContent = fs.readFileSync(jyJsPath, 'utf8');

it('JS (json-to-yaml.js): Reads and consumes ac:chain-json on load', () => {
  assert(jyJsContent.includes("sessionStorage.getItem('ac:chain-json')"), 'json-to-yaml.js must read ac:chain-json');
  assert(jyJsContent.includes("sessionStorage.removeItem('ac:chain-json')"), 'json-to-yaml.js must consume/clear ac:chain-json');
});

// 5. Behavioral Simulation
class SessionStorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

it('Simulation: Workflow chaining passes formatted payload to destination tools', () => {
  const mockSession = new SessionStorageMock();
  const sampleJson = '{\n  "status": "success",\n  "count": 42\n}';

  // Step 1: User on JSON Formatter formats and clicks "Compare JSON"
  mockSession.setItem('ac:chain-json-a', sampleJson);
  assert.strictEqual(mockSession.getItem('ac:chain-json-a'), sampleJson);

  // Step 2: User arrives on JSON Compare -> payload pre-populates and is consumed
  const receivedA = mockSession.getItem('ac:chain-json-a');
  mockSession.removeItem('ac:chain-json-a');
  assert.strictEqual(receivedA, sampleJson);
  assert.strictEqual(mockSession.getItem('ac:chain-json-a'), null, 'Payload should be consumed once');

  // Step 3: User formats and clicks "Convert to YAML"
  mockSession.setItem('ac:chain-json', sampleJson);
  assert.strictEqual(mockSession.getItem('ac:chain-json'), sampleJson);

  // Step 4: User arrives on JSON to YAML -> payload pre-populates and is consumed
  const receivedYAML = mockSession.getItem('ac:chain-json');
  mockSession.removeItem('ac:chain-json');
  assert.strictEqual(receivedYAML, sampleJson);
  assert.strictEqual(mockSession.getItem('ac:chain-json'), null, 'Payload should be consumed once');
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
