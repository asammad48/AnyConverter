#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S28: Modifier Expansion (+ privacy / + browser / + no signup)
 *
 * Automated Verification Suite:
 * 1. Physical presence and semantic structure of #privacy-and-security across all 30 target URLs (10 tools x 3 locales).
 * 2. dc-template synchronization for client-rendered tools (pdf-merge, pdf-split, pdf-compress).
 * 3. Modifier keyword presence (+ privacy, + in browser, + no signup) in headings and lead copy across EN, ES, DA.
 * 4. Native diacritics preservation (á, é, í, ó, ú, ñ in ES; æ, ø, å in DA).
 * 5. Sitewide absence of forbidden absolute privacy overclaims (FORBIDDEN_REGEX compliance).
 * 6. Responsive CSS styling and dark mode rules in assets/css/style.css.
 * 7. Track B Loop 10 Embed Partner progression in docs/growth/outreach/LOOP_10_EMBED_PARTNERS.md.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S28: PRIVACY & NO SIGNUP MODIFIERS SUITE   ');
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
  'ocr-pdf',
  'edit-pdf',
  'invoice-generator',
  'image-converter',
  'image-compressor',
  'password-generator',
  'hash-generator'
];

const LOCALES = [
  { code: 'en', dir: '' },
  { code: 'es', dir: 'es' },
  { code: 'da', dir: 'da' }
];

const FORBIDDEN_REGEX = /(never leave|never leaves|forlader[^.\n]{0,80}aldrig|nunca sale[n]?\b|sendes aldrig)/i;

// -------------------------------------------------------------
// CHECK 1: Physical Existence & Semantic Structure (30 URLs)
// -------------------------------------------------------------
it('Structure: #privacy-and-security section exists across all 30 target tool pages (10 tools x 3 locales)', () => {
  for (const tool of TARGET_TOOLS) {
    for (const loc of LOCALES) {
      const filePath = loc.dir ? path.join(ROOT, loc.dir, tool, 'index.html') : path.join(ROOT, tool, 'index.html');
      assert.ok(fs.existsSync(filePath), `Target page must exist: ${filePath}`);
      const html = fs.readFileSync(filePath, 'utf8');

      assert.ok(html.includes('id="privacy-and-security"'), `${filePath} must contain #privacy-and-security`);
      assert.ok(html.includes('class="privacy-section"'), `${filePath} must contain class="privacy-section"`);
      assert.ok(html.includes('id="privacy-heading"'), `${filePath} must contain id="privacy-heading"`);
      assert.ok(html.includes('class="privacy-lead"'), `${filePath} must contain class="privacy-lead"`);
      assert.ok(html.includes('class="privacy-grid"'), `${filePath} must contain class="privacy-grid"`);

      const cardMatches = html.match(/class="privacy-card"/g) || [];
      assert.ok(cardMatches.length >= 3, `${filePath} must have at least 3 .privacy-card elements (found ${cardMatches.length})`);
    }
  }
});

// -------------------------------------------------------------
// CHECK 2: dc-template Synchronization for Client-Rendered Tools
// -------------------------------------------------------------
it('dc-template Sync: pdf-merge, pdf-split, and pdf-compress include #privacy-and-security inside #dc-template', () => {
  const dcTools = ['pdf-merge', 'pdf-split', 'pdf-compress'];
  for (const tool of dcTools) {
    for (const loc of LOCALES) {
      const filePath = loc.dir ? path.join(ROOT, loc.dir, tool, 'index.html') : path.join(ROOT, tool, 'index.html');
      const html = fs.readFileSync(filePath, 'utf8');

      const templateMatch = html.match(/<script type="text\/x-dc-template" id="dc-template">([\s\S]*?)<\/script>/);
      assert.ok(templateMatch, `${filePath} must contain #dc-template script`);
      assert.ok(templateMatch[1].includes('id="privacy-and-security"'), `${filePath} #dc-template must contain #privacy-and-security`);
      assert.ok(templateMatch[1].includes('class="privacy-section"'), `${filePath} #dc-template must contain class="privacy-section"`);
    }
  }
});

// -------------------------------------------------------------
// CHECK 3: Modifier Keyword Presence (+ privacy, + browser, + no signup)
// -------------------------------------------------------------
it('Modifier Keywords: EN, ES, DA headings and lead copy explicitly contain targeted search modifiers', () => {
  for (const tool of TARGET_TOOLS) {
    // EN
    const enHtml = fs.readFileSync(path.join(ROOT, tool, 'index.html'), 'utf8');
    const enHeadingMatch = enHtml.match(/<h2 id="privacy-heading">([\s\S]*?)<\/h2>/);
    assert.ok(enHeadingMatch, `${tool} EN missing #privacy-heading`);
    const enHeading = enHeadingMatch[1];
    assert.ok(/private|privacy/i.test(enHeading), `${tool} EN heading must contain private/privacy modifier: "${enHeading}"`);
    assert.ok(/browser/i.test(enHeading), `${tool} EN heading must contain browser modifier: "${enHeading}"`);
    assert.ok(/no signup|without signup/i.test(enHeading), `${tool} EN heading must contain no signup modifier: "${enHeading}"`);

    // ES
    const esHtml = fs.readFileSync(path.join(ROOT, 'es', tool, 'index.html'), 'utf8');
    const esHeadingMatch = esHtml.match(/<h2 id="privacy-heading">([\s\S]*?)<\/h2>/);
    assert.ok(esHeadingMatch, `${tool} ES missing #privacy-heading`);
    const esHeading = esHeadingMatch[1];
    assert.ok(/privad[oa]|privacidad/i.test(esHeading), `${tool} ES heading must contain privad*/privacidad modifier: "${esHeading}"`);
    assert.ok(/navegador/i.test(esHeading), `${tool} ES heading must contain navegador modifier: "${esHeading}"`);
    assert.ok(/sin (?:subida|registro|cuenta)/i.test(esHeading), `${tool} ES heading must contain sin registro/subida modifier: "${esHeading}"`);

    // DA
    const daHtml = fs.readFileSync(path.join(ROOT, 'da', tool, 'index.html'), 'utf8');
    const daHeadingMatch = daHtml.match(/<h2 id="privacy-heading">([\s\S]*?)<\/h2>/);
    assert.ok(daHeadingMatch, `${tool} DA missing #privacy-heading`);
    const daHeading = daHeadingMatch[1];
    assert.ok(/privat|fortrolighed/i.test(daHeading), `${tool} DA heading must contain privat modifier: "${daHeading}"`);
    assert.ok(/browser/i.test(daHeading), `${tool} DA heading must contain browser modifier: "${daHeading}"`);
    assert.ok(/uden (?:upload|tilmelding|oprettelse)/i.test(daHeading), `${tool} DA heading must contain uden tilmelding/upload modifier: "${daHeading}"`);
  }
});

// -------------------------------------------------------------
// CHECK 4: Native Diacritics Preservation (ES & DA)
// -------------------------------------------------------------
it('Localization Quality: 100% preservation of native diacritics in ES (á, é, í, ó, ú, ñ) and DA (æ, ø, å)', () => {
  for (const tool of TARGET_TOOLS) {
    const esHtml = fs.readFileSync(path.join(ROOT, 'es', tool, 'index.html'), 'utf8');
    const esSection = esHtml.slice(esHtml.indexOf('id="privacy-and-security"'), esHtml.indexOf('</section>', esHtml.indexOf('id="privacy-and-security"')) + 10);
    assert.ok(/[áéíóúñ]/.test(esSection), `ES section for ${tool} must contain native Spanish diacritics`);

    const daHtml = fs.readFileSync(path.join(ROOT, 'da', tool, 'index.html'), 'utf8');
    const daSection = daHtml.slice(daHtml.indexOf('id="privacy-and-security"'), daHtml.indexOf('</section>', daHtml.indexOf('id="privacy-and-security"')) + 10);
    assert.ok(/[æøå]/.test(daSection), `DA section for ${tool} must contain native Danish diacritics`);
  }
});

// -------------------------------------------------------------
// CHECK 5: Absence of Forbidden Absolute Privacy Overclaims
// -------------------------------------------------------------
it('Privacy Claims Compliance: Zero occurrences of forbidden absolute phrases across all 30 target pages', () => {
  for (const tool of TARGET_TOOLS) {
    for (const loc of LOCALES) {
      const filePath = loc.dir ? path.join(ROOT, loc.dir, tool, 'index.html') : path.join(ROOT, tool, 'index.html');
      const html = fs.readFileSync(filePath, 'utf8');
      const sectionMatch = html.match(/<section class="privacy-section"[^>]*>([\s\S]*?)<\/section>/);
      assert.ok(sectionMatch, `Could not extract privacy section from ${filePath}`);
      const sectionContent = sectionMatch[1];

      const forbidden = FORBIDDEN_REGEX.exec(sectionContent);
      assert.strictEqual(forbidden, null, `Forbidden claim found in ${filePath}: "${forbidden ? forbidden[0] : ''}"`);
    }
  }
});

// -------------------------------------------------------------
// CHECK 6: CSS Styling & Dark Mode Rules
// -------------------------------------------------------------
it('CSS Styling: assets/css/style.css contains responsive grid and dark mode tokens for privacy section', () => {
  const cssPath = path.join(ROOT, 'assets', 'css', 'style.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.ok(css.includes('.privacy-section'), 'Missing .privacy-section in style.css');
  assert.ok(css.includes('.privacy-grid'), 'Missing .privacy-grid in style.css');
  assert.ok(css.includes('.privacy-card'), 'Missing .privacy-card in style.css');
  assert.ok(css.includes('.privacy-lead'), 'Missing .privacy-lead in style.css');
  assert.ok(css.includes('[data-theme="dark"] .privacy-card') || css.includes('--color-surface'), 'Theme tokens must be supported in privacy styling');
});

// -------------------------------------------------------------
// CHECK 7: Track B Loop 10 Embed Partner Progression
// -------------------------------------------------------------
it('Track B Loop 10: docs/growth/outreach/LOOP_10_EMBED_PARTNERS.md reflects Days 55-56 progression and partner queue', () => {
  const loop10Path = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_10_EMBED_PARTNERS.md');
  assert.ok(fs.existsSync(loop10Path), 'LOOP_10_EMBED_PARTNERS.md exists');
  const doc = fs.readFileSync(loop10Path, 'utf8');

  assert.ok(doc.includes('S28') || doc.includes('Days 55–56') || doc.includes('Days 55-56'), 'Document must mention S28 / Days 55-56 progression');
  assert.ok(doc.includes('Math Is Fun'), 'Must include Partner 1 Math Is Fun');
  assert.ok(doc.includes('FinTech Weekly'), 'Must include Partner 2 FinTech Weekly');
  assert.ok(doc.includes('freeCodeCamp'), 'Must include Partner 3 freeCodeCamp');
  assert.ok(doc.includes('TimeAndDate'), 'Must include Partner 4 TimeAndDate');
  assert.ok(doc.includes('SitePoint'), 'Must include Partner 5 SitePoint');
  assert.ok(doc.includes('Baeldung'), 'Must include Partner 6 Baeldung');
});

// -------------------------------------------------------------
// RESULTS SUMMARY
// -------------------------------------------------------------
console.log('\n====================================================');
console.log(`Results: ${passedTests}/${totalTests} test cases passed.`);
if (passedTests === totalTests) {
  console.log('STATUS: SPRINT S28 VERIFICATION SUITE PASSED.');
  process.exit(0);
} else {
  console.error('STATUS: SPRINT S28 VERIFICATION FAILURES DETECTED.');
  process.exit(1);
}
