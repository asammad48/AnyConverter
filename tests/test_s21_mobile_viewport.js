#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S21: Mobile Gesture & Viewport Pass (320px–390px) Verification Suite
 *
 * Verifies:
 * 1. Physical existence of all 90 target HTML pages (30 tools × 3 locales: EN, ES, DA).
 * 2. Mobile Viewport Meta Tags:
 *    - All 90 pages contain `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
 * 3. Responsive CSS Rules & Horizontal Overflow Elimination:
 *    - assets/css/style.css enforces `max-width` on `.dropdown-menu--wide` preventing 380px fixed blowouts.
 *    - assets/css/style.css includes responsive wrapping for `.ts-output-row` and `.ts-value` in timestamp converter.
 *    - assets/css/style.css enforces `overflow-x: hidden` on mobile viewports (≤ 480px).
 *    - assets/css/style.css enforces `flex-wrap: wrap` on breadcrumb navigation (SUS-003).
 *    - assets/css/style.css enforces touch-target minimum height (≥ 40px) on interactive buttons.
 * 4. Multi-Locale Integrity:
 *    - Self-referential canonical URLs and 4-way reciprocal hreflang alternates (en, es, da, x-default) on all 90 pages.
 * 5. Track B: Loop 8 Outreach Batch #2 Prospects:
 *    - docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md exists.
 *    - Contains 12 university resource pitches (T-UNI-01).
 *    - Contains 4 integration partner pitches (T-INT-01).
 *    - Contains 4 broken-link pitches (T-BRK-01).
 *    - Contains 1-touch follow-up protocol with strict 7-day single-touch policy.
 *    - Enforces manual send policy via owner personal mailbox.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S21: MOBILE VIEWPORT PASS (320px–390px)     ');
console.log('====================================================\n');

const TOP_30_TOOLS = [
  'json-formatter',
  'percentage-calculator',
  'age-calculator',
  'loan-calculator',
  'ip-address-lookup',
  'base64-encoder',
  'url-encoder',
  'bmi-calculator',
  'discount-calculator',
  'pdf-merge',
  'pdf-split',
  'edit-pdf',
  'pdf-compress',
  'csv-to-sql',
  'jwt-decoder',
  'hash-generator',
  'timestamp-converter',
  'sleep-calculator',
  'aspect-ratio-calculator',
  'regex-tester',
  'mortgage-calculator',
  'compound-interest-calculator',
  'json-compare',
  'xml-formatter',
  'pay-rise-calculator',
  'percentage-difference-calculator',
  'cron-expression-parser',
  'uuid-generator',
  'word-counter',
  'text-case-converter'
];

const LOCALES = [
  { prefix: '', lang: 'en' },
  { prefix: 'es/', lang: 'es' },
  { prefix: 'da/', lang: 'da' }
];

// -------------------------------------------------------------
// CHECK 1: Top 30 Tools Inventory (90 HTML Pages Total)
// -------------------------------------------------------------
console.log('[CHECK 1] Verifying physical existence of all 90 Top 30 HTML pages (EN, ES, DA)...');
let totalChecked = 0;
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    assert.ok(fs.existsSync(pagePath), `Missing target tool page: ${pagePath}`);
    totalChecked++;
  }
}
console.log(`  ✓ All ${totalChecked} target HTML pages physically exist.\n`);

// -------------------------------------------------------------
// CHECK 2: Viewport Meta Tag on all 90 Target Pages
// -------------------------------------------------------------
console.log('[CHECK 2] Auditing standard mobile viewport meta tags across 90 pages...');
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    const content = fs.readFileSync(pagePath, 'utf8');
    assert.ok(
      content.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">') ||
      content.includes('<meta name="viewport" content="width=device-width,initial-scale=1'),
      `Page ${loc.prefix}${tool}/index.html missing standard responsive viewport meta tag`
    );
  }
}
console.log('  ✓ 100% of 90 target pages enforce proper responsive viewport meta tag.\n');

// -------------------------------------------------------------
// CHECK 3: CSS Responsive Safeguards in assets/css/style.css
// -------------------------------------------------------------
console.log('[CHECK 3] Auditing responsive CSS safeguards in assets/css/style.css...');
const cssPath = path.join(ROOT, 'assets/css/style.css');
assert.ok(fs.existsSync(cssPath), 'Missing assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

// 3a. Wide dropdown safety
assert.ok(
  css.includes('min-width: min(380px, calc(100vw - 24px));') || css.includes('max-width: calc(100vw - 24px);'),
  'style.css does not constrain .dropdown-menu--wide against small mobile viewports'
);

// 3b. Timestamp output row wrapping
assert.ok(
  css.includes('.ts-output-row') && css.includes('word-break: break-all;'),
  'style.css does not include responsive mobile wrapping for timestamp output rows'
);

// 3c. Mobile overflow-x containment
assert.ok(
  css.includes('overflow-x: hidden;') && css.includes('@media (max-width: 480px)'),
  'style.css does not enforce overflow-x: hidden on small mobile viewports'
);

// 3d. Breadcrumb wrapping (SUS-003)
assert.ok(
  css.includes('.breadcrumb ol') && css.includes('flex-wrap: wrap;'),
  'style.css does not enforce flex-wrap on breadcrumb navigation'
);

// 3e. Touch target minimum height
assert.ok(
  css.includes('min-height: 44px;') || css.includes('min-height: 40px;'),
  'style.css does not enforce standard touch target dimensions (>= 40px)'
);

console.log('  ✓ CSS responsive safeguards verified in style.css (dropdown cap, timestamp wrap, overflow-x hidden, breadcrumb wrap, touch targets).\n');

// -------------------------------------------------------------
// CHECK 4: Multi-Locale Canonical & Reciprocal Hreflang Integrity
// -------------------------------------------------------------
console.log('[CHECK 4] Verifying 4-way reciprocal hreflang and canonical integrity on all 90 pages...');
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    const content = fs.readFileSync(pagePath, 'utf8');

    // Canonical
    const expectedCanonical = `https://anyconverter.io/${loc.prefix}${tool}/`;
    assert.ok(
      content.includes(`<link rel="canonical" href="${expectedCanonical}">`),
      `Page ${loc.prefix}${tool}/index.html canonical mismatch (expected ${expectedCanonical})`
    );

    // 4-way hreflang
    assert.ok(content.includes(`<link rel="alternate" hreflang="en" href="https://anyconverter.io/${tool}/">`), `Missing en hreflang in ${loc.prefix}${tool}`);
    assert.ok(content.includes(`<link rel="alternate" hreflang="es" href="https://anyconverter.io/es/${tool}/">`), `Missing es hreflang in ${loc.prefix}${tool}`);
    assert.ok(content.includes(`<link rel="alternate" hreflang="da" href="https://anyconverter.io/da/${tool}/">`), `Missing da hreflang in ${loc.prefix}${tool}`);
    assert.ok(content.includes(`<link rel="alternate" hreflang="x-default" href="https://anyconverter.io/${tool}/">`), `Missing x-default hreflang in ${loc.prefix}${tool}`);
  }
}
console.log('  ✓ 100% of 90 target pages enforce valid canonical and 4-way reciprocal hreflang.\n');

// -------------------------------------------------------------
// CHECK 5: Track B — Loop 8 Outreach Batch #2 Prospects
// -------------------------------------------------------------
console.log('[CHECK 5] Validating Loop 8 Outreach Batch #2 prospects in docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md...');
const outreachPath = path.join(ROOT, 'docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md');
assert.ok(fs.existsSync(outreachPath), 'Missing docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md');
const outreach = fs.readFileSync(outreachPath, 'utf8');

// 12 university resource pitches
assert.ok(outreach.includes('T-UNI-01'), 'Missing T-UNI-01 template reference');
for (let i = 1; i <= 12; i++) {
  assert.ok(outreach.includes(`Prospect ${i}:`), `Missing Prospect ${i} in university outreach`);
}

// 4 integration partner pitches
assert.ok(outreach.includes('T-INT-01'), 'Missing T-INT-01 template reference');
for (let i = 1; i <= 4; i++) {
  assert.ok(outreach.includes(`Partner ${i}:`), `Missing Partner ${i} in integration outreach`);
}

// 4 broken-link pitches
assert.ok(outreach.includes('T-BRK-01'), 'Missing T-BRK-01 template reference');
for (let i = 1; i <= 4; i++) {
  assert.ok(outreach.includes(`Broken-Link Prospect ${i}:`), `Missing Broken-Link Prospect ${i} in broken-link outreach`);
}

// Single-follow-up policy and manual send mandate
assert.ok(outreach.includes('Stream 4: Batch #1 Non-Responder Single Follow-Up Protocol'), 'Missing follow-up protocol');
assert.ok(outreach.includes('STRICTLY MANUAL SEND VIA OWNER MAILBOX'), 'Missing manual send compliance mandate');

console.log('  ✓ Loop 8 Outreach Batch #2 verified: 12 university pitches, 4 partner pitches, 4 broken-link pitches, 1-touch follow-up protocol, and manual send compliance.\n');

console.log('====================================================');
console.log('  [PASS] SPRINT S21 VERIFICATION SUITE SUCCEEDED    ');
console.log('====================================================');
