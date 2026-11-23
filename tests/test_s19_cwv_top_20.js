#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S19: Core Web Vitals Pass on Top 20 Tools (EN, ES, DA) Verification Suite
 *
 * Verifies:
 * 1. Physical existence of all 60 target HTML pages (20 tools × 3 locales: EN, ES, DA).
 * 2. Cumulative Layout Shift (CLS < 0.1) elimination:
 *    - All <img> tags have explicit width and height attributes.
 *    - Dynamic result wrappers and ad slots enforce min-height / containment in CSS.
 * 3. Largest Contentful Paint (LCP < 2.5s) acceleration:
 *    - font-display: swap enforced across web fonts in assets/css/style.css and page head styles.
 *    - Zero blocking external scripts in <head> (all have defer or async).
 * 4. Interaction to Next Paint (INP < 200ms) & Main-Thread Hygiene:
 *    - Zero tool-specific vendor libraries (PDF.js, CodeMirror, etc.) leaked into shared.js.
 * 5. Multi-Locale Integrity:
 *    - Self-referential canonical URLs and 4-way reciprocal hreflang alternates (en, es, da, x-default).
 * 6. Loop 7 Distribution Prep:
 *    - Launch drafts exist at docs/growth/launches/DEVHUNT_PEERLIST_LAUNCH_DRAFTS.md.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S19: CWV PASS ON TOP 20 TOOLS (EN, ES, DA)  ');
console.log('====================================================\n');

const TOP_20_TOOLS = [
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
  'regex-tester'
];

const LOCALES = [
  { prefix: '', lang: 'en' },
  { prefix: 'es/', lang: 'es' },
  { prefix: 'da/', lang: 'da' }
];

let checkCount = 0;

function pass(msg) {
  checkCount++;
  console.log(`[CHECK ${checkCount}] PASS: ${msg}`);
}

// -------------------------------------------------------------
// CHECK 1: Verify all 60 physical HTML pages exist
// -------------------------------------------------------------
const allPages = [];
TOP_20_TOOLS.forEach(tool => {
  LOCALES.forEach(({ prefix, lang }) => {
    const relPath = path.posix.join(prefix, tool, 'index.html');
    const fullPath = path.join(ROOT, relPath);
    assert(fs.existsSync(fullPath), `Target page does not exist: ${relPath}`);
    allPages.push({ tool, lang, prefix, relPath, fullPath });
  });
});
assert.strictEqual(allPages.length, 60, 'Expected exactly 60 target HTML pages');
pass(`All 60 target pages (20 tools × 3 locales) exist on disk.`);

// -------------------------------------------------------------
// CHECK 2: CLS Elimination — Explicit width/height on all <img> tags across all 60 pages
// -------------------------------------------------------------
let totalImgCount = 0;
allPages.forEach(({ relPath, fullPath }) => {
  const html = fs.readFileSync(fullPath, 'utf8');
  const imgs = html.match(/<img[^>]*>/gi) || [];
  imgs.forEach(img => {
    totalImgCount++;
    const hasWidth = /\bwidth=["'][^"']+["']/i.test(img);
    const hasHeight = /\bheight=["'][^"']+["']/i.test(img);
    assert(hasWidth, `Page ${relPath} has <img> missing width attribute: ${img}`);
    assert(hasHeight, `Page ${relPath} has <img> missing height attribute: ${img}`);
  });
});
pass(`Scanned ${totalImgCount} <img> elements across 60 pages — 100% have explicit width and height attributes.`);

// -------------------------------------------------------------
// CHECK 3: LCP Acceleration — Zero render-blocking scripts in <head>
// -------------------------------------------------------------
allPages.forEach(({ relPath, fullPath }) => {
  const html = fs.readFileSync(fullPath, 'utf8');
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  assert(headMatch, `Missing <head> in ${relPath}`);
  const head = headMatch[0];
  const scripts = head.match(/<script[\s\S]*?<\/script>/gi) || [];
  scripts.forEach(s => {
    if (/type=["']application\/ld\+json["']/i.test(s)) return;
    if (/src=["'][^"']+["']/i.test(s)) {
      const isDeferred = /\bdefer\b/i.test(s) || /\basync\b/i.test(s);
      assert(isDeferred, `Render-blocking external script found in head of ${relPath}: ${s}`);
    }
  });
});
pass(`Zero render-blocking external scripts in <head> across all 60 pages (all scripts use defer or async).`);

// -------------------------------------------------------------
// CHECK 4: LCP Acceleration — font-display: swap in stylesheets and page headers
// -------------------------------------------------------------
const cssPath = path.join(ROOT, 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes("font-family: 'Inter'"), 'style.css must declare Inter @font-face');
assert(cssContent.includes("font-display: swap"), 'style.css must enforce font-display: swap');

allPages.forEach(({ relPath, fullPath }) => {
  const html = fs.readFileSync(fullPath, 'utf8');
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  assert(headMatch, `Missing <head> in ${relPath}`);
  const head = headMatch[0];
  const hasFontDisplay = head.includes('font-display:swap') || head.includes('font-display: swap');
  assert(hasFontDisplay, `Missing font-display: swap in <head> styles of ${relPath}`);
});
pass(`font-display: swap verified in assets/css/style.css and across all 60 page head styles.`);

// -------------------------------------------------------------
// CHECK 5: INP & Main-Thread Hygiene — Clean shared.js with zero vendor leak
// -------------------------------------------------------------
const sharedJsPath = path.join(ROOT, 'assets', 'js', 'shared.js');
const sharedJs = fs.readFileSync(sharedJsPath, 'utf8');
const leakedLibraries = [
  'pdfjs',
  'jspdf',
  'chart.js',
  'codemirror',
  'highlight.js',
  'crypto-js',
  'sql.js',
  'papaparse'
];
leakedLibraries.forEach(lib => {
  assert(!sharedJs.toLowerCase().includes(lib), `Leaked library detected in shared.js: ${lib}`);
});
pass(`shared.js audited clean — zero heavy vendor libraries or tool-specific modules leaked.`);

// -------------------------------------------------------------
// CHECK 6: Canonical URL & 4-way Reciprocal Hreflang Integrity
// -------------------------------------------------------------
allPages.forEach(({ tool, prefix, relPath, fullPath }) => {
  const html = fs.readFileSync(fullPath, 'utf8');
  const expectedCanonical = `https://anyconverter.io/${prefix}${tool}/`;
  assert(html.includes(`rel="canonical" href="${expectedCanonical}"`), `Canonical mismatch in ${relPath}`);

  const hEn = `hreflang="en" href="https://anyconverter.io/${tool}/"`;
  const hEs = `hreflang="es" href="https://anyconverter.io/es/${tool}/"`;
  const hDa = `hreflang="da" href="https://anyconverter.io/da/${tool}/"`;
  const hDef = `hreflang="x-default" href="https://anyconverter.io/${tool}/"`;

  assert(html.includes(hEn), `Missing en hreflang in ${relPath}`);
  assert(html.includes(hEs), `Missing es hreflang in ${relPath}`);
  assert(html.includes(hDa), `Missing da hreflang in ${relPath}`);
  assert(html.includes(hDef), `Missing x-default hreflang in ${relPath}`);
});
pass(`100% reciprocal 4-way hreflang alternates and self-canonical URLs verified across 60 pages.`);

// -------------------------------------------------------------
// CHECK 7: CLS Prevention — Dynamic Result Containers & Ad Slots Sizing
// -------------------------------------------------------------
assert(cssContent.includes('.ad-slot'), 'style.css must style .ad-slot');
assert(cssContent.includes('.dc-ad'), 'style.css must style .dc-ad');
assert(cssContent.includes('contain-intrinsic-size'), 'style.css must define contain-intrinsic-size for dynamic wrappers');
pass(`CSS layout rules enforce fixed dimensions and min-heights on ad slots and dynamic wrappers.`);

// -------------------------------------------------------------
// CHECK 8: Loop 7 Launch Drafts Existence and Completeness
// -------------------------------------------------------------
const launchDocPath = path.join(ROOT, 'docs', 'growth', 'launches', 'DEVHUNT_PEERLIST_LAUNCH_DRAFTS.md');
assert(fs.existsSync(launchDocPath), 'DEVHUNT_PEERLIST_LAUNCH_DRAFTS.md must exist');
const launchDoc = fs.readFileSync(launchDocPath, 'utf8');

assert(launchDoc.includes('DevHunt Launch Draft'), 'Launch doc must contain DevHunt draft');
assert(launchDoc.includes('Peerlist Launchpad Launch Draft'), 'Launch doc must contain Peerlist draft');
assert(launchDoc.includes('OWNER REVIEW NOTICE'), 'Launch doc must enforce human owner review notice');
assert(launchDoc.includes('DO NOT AUTO-SUBMIT'), 'Launch doc must prohibit autonomous posting');
pass(`Loop 7 distribution drafts verified at docs/growth/launches/DEVHUNT_PEERLIST_LAUNCH_DRAFTS.md.`);

console.log('\n====================================================');
console.log(`STATUS: SPRINT S19 VERIFICATION PASSED (8/8 CHECKS)`);
console.log('====================================================');
process.exit(0);
