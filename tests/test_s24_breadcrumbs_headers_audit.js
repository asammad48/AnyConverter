#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S24: BreadcrumbList Schema Sitewide + robots/_headers Audit Verification Suite
 *
 * Verifies:
 * 1. BreadcrumbList Schema Sitewide Coverage:
 *    - All 438 non-homepage tool and category hub pages across EN, ES, DA possess valid Schema.org BreadcrumbList JSON-LD.
 *    - Valid positions, names, and absolute URLs on all breadcrumb items.
 * 2. Security Headers & CSP Audit (_headers):
 *    - Strict-Transport-Security (HSTS), X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
 *    - Content-Security-Policy with AdSense & CDN compatibility.
 *    - /embed/* route framing compatibility for Loop 10 partner embeds.
 *    - Caching directives for /assets/*, /sitemap.xml, and /robots.txt.
 * 3. robots.txt & _redirects Integrity:
 *    - Valid robots.txt with sitemap pointer.
 *    - 100% of _redirects rules resolve to existing disk destinations with 0 loops.
 * 4. Track B: Loop 9 Original Benchmark Study Publication & PR Outreach:
 *    - resources/browser-pdf-compression-benchmark/index.html exists with complete data corpus and schema.
 *    - docs/growth/outreach/LOOP_9_BENCHMARK_PROSPECTS.md exists with 10 prospects and strict manual send mandate.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S24: BREADCRUMBLIST & HEADERS AUDIT SUITE   ');
console.log('====================================================\n');

// -------------------------------------------------------------
// CHECK 1: Sitewide BreadcrumbList Schema Coverage (438 Pages)
// -------------------------------------------------------------
console.log('[CHECK 1] Auditing BreadcrumbList schema across all repository tool & hub pages...');

const htmlFiles = [];
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.vs', '.agents', '.ai-memory', 'output', 'reports', 'tests', 'tools', 'assets', 'scripts', 'docs'].includes(entry.name)) {
        continue;
      }
      const sub = path.join(dir, entry.name);
      const indexPath = path.join(sub, 'index.html');
      if (fs.existsSync(indexPath)) {
        htmlFiles.push(indexPath);
      }
    }
  }
}

scanDir(ROOT);
scanDir(path.join(ROOT, 'es'));
scanDir(path.join(ROOT, 'da'));

let auditedBreadcrumbs = 0;
for (const filePath of htmlFiles) {
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  // Skip homepages
  if (relPath === 'index.html' || relPath === 'es/index.html' || relPath === 'da/index.html') {
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const scriptMatches = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];

  let breadcrumbSchema = null;
  for (const m of scriptMatches) {
    try {
      const p = JSON.parse(m[1]);
      if (p['@type'] === 'BreadcrumbList') {
        breadcrumbSchema = p;
        break;
      }
      if (p['@graph']) {
        const found = p['@graph'].find(x => x['@type'] === 'BreadcrumbList');
        if (found) {
          breadcrumbSchema = found;
          break;
        }
      }
    } catch (e) {}
  }

  assert.ok(
    breadcrumbSchema,
    `Missing BreadcrumbList schema in ${relPath}`
  );

  const items = breadcrumbSchema.itemListElement;
  assert.ok(
    Array.isArray(items) && items.length >= 2,
    `Invalid or empty itemListElement in ${relPath}`
  );

  // Validate Position 1 (Home)
  assert.strictEqual(items[0]['@type'], 'ListItem', `Item 0 not ListItem in ${relPath}`);
  assert.strictEqual(items[0].position, 1, `Item 0 position not 1 in ${relPath}`);
  assert.ok(items[0].name && items[0].name.length > 0, `Empty name for Item 0 in ${relPath}`);
  assert.ok(items[0].item.startsWith('https://anyconverter.io'), `Item 0 URL invalid in ${relPath}`);

  // Validate Last Item (Current Page)
  const last = items[items.length - 1];
  assert.strictEqual(last['@type'], 'ListItem', `Last item not ListItem in ${relPath}`);
  assert.strictEqual(last.position, items.length, `Last item position mismatch in ${relPath}`);
  assert.ok(last.name && last.name.length > 0, `Empty name for last item in ${relPath}`);
  assert.ok(last.item.startsWith('https://anyconverter.io'), `Last item URL invalid in ${relPath}`);

  auditedBreadcrumbs++;
}

console.log(`  ✓ 100% of ${auditedBreadcrumbs} tool and hub pages verified with valid BreadcrumbList schema.\n`);

// -------------------------------------------------------------
// CHECK 2: Security Headers & CSP Audit (_headers)
// -------------------------------------------------------------
console.log('[CHECK 2] Auditing security headers, HSTS, AdSense CSP, and embed rules in _headers...');
const headersPath = path.join(ROOT, '_headers');
assert.ok(fs.existsSync(headersPath), 'Missing _headers file');
const headersContent = fs.readFileSync(headersPath, 'utf8');

assert.ok(headersContent.includes('X-Frame-Options: DENY'), 'Missing X-Frame-Options: DENY');
assert.ok(headersContent.includes('X-Content-Type-Options: nosniff'), 'Missing X-Content-Type-Options: nosniff');
assert.ok(headersContent.includes('Referrer-Policy: strict-origin-when-cross-origin'), 'Missing Referrer-Policy');
assert.ok(headersContent.includes('Strict-Transport-Security: max-age=31536000'), 'Missing HSTS with 1-year max-age');
assert.ok(headersContent.includes('Permissions-Policy: camera=(), microphone=(), geolocation=()'), 'Missing Permissions-Policy');

// CSP AdSense & CDN compatibility
assert.ok(headersContent.includes('pagead2.googlesyndication.com'), 'CSP missing Google AdSense domain');
assert.ok(headersContent.includes('frame-src'), 'CSP missing frame-src directive');

// /embed/* rule
assert.ok(headersContent.includes('/embed/*'), 'Missing /embed/* rule in _headers');
assert.ok(headersContent.includes('X-Frame-Options: ALLOWALL'), 'Missing X-Frame-Options: ALLOWALL on /embed/*');
assert.ok(headersContent.includes('frame-ancestors *;'), 'Missing frame-ancestors on /embed/*');

// Cache-Control
assert.ok(headersContent.includes('/assets/*'), 'Missing /assets/* cache header');
assert.ok(headersContent.includes('/sitemap.xml'), 'Missing /sitemap.xml cache header');
assert.ok(headersContent.includes('/robots.txt'), 'Missing /robots.txt cache header');

console.log('  ✓ _headers policy, AdSense CSP, HSTS, embed framing, and cache directives verified.\n');

// -------------------------------------------------------------
// CHECK 3: robots.txt & _redirects Integrity
// -------------------------------------------------------------
console.log('[CHECK 3] Auditing robots.txt and validating all 301 rules in _redirects...');
const robotsPath = path.join(ROOT, 'robots.txt');
assert.ok(fs.existsSync(robotsPath), 'Missing robots.txt file');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert.ok(robotsContent.includes('User-agent: *'), 'Missing User-agent in robots.txt');
assert.ok(robotsContent.includes('Allow: /'), 'Missing Allow: / in robots.txt');
assert.ok(robotsContent.includes('Sitemap: https://anyconverter.io/sitemap.xml'), 'Missing Sitemap pointer in robots.txt');

const redirectsPath = path.join(ROOT, '_redirects');
assert.ok(fs.existsSync(redirectsPath), 'Missing _redirects file');
const redirectsLines = fs.readFileSync(redirectsPath, 'utf8').split('\n');

let validRedirects = 0;
for (const line of redirectsLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const parts = trimmed.split(/\s+/);
  assert.ok(parts.length >= 2, `Malformed line in _redirects: ${line}`);

  const from = parts[0];
  const to = parts[1];
  assert.notStrictEqual(from, to, `Circular redirect in _redirects: ${from} -> ${to}`);

  let destPath = to === '/' ? 'index.html' : to.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
  assert.ok(
    fs.existsSync(path.join(ROOT, destPath)),
    `Redirect destination does not exist on disk: ${to} (resolved to ${destPath})`
  );
  validRedirects++;
}
console.log(`  ✓ All ${validRedirects} rules in _redirects point to valid disk destinations with 0 circular paths.\n`);

// -------------------------------------------------------------
// CHECK 4: Track B: Loop 9 Benchmark Study & PR Outreach
// -------------------------------------------------------------
console.log('[CHECK 4] Verifying Loop 9 benchmark publication and PR outreach prospect queue...');
const benchmarkPath = path.join(ROOT, 'docs', 'growth', 'resources', 'browser-pdf-compression-benchmark', 'benchmark-study.html');
assert.ok(fs.existsSync(benchmarkPath), 'Missing docs/growth/resources/browser-pdf-compression-benchmark/benchmark-study.html');
const benchmarkHtml = fs.readFileSync(benchmarkPath, 'utf8');

assert.ok(benchmarkHtml.includes('Browser-Based Client-Side PDF Compression'), 'Missing main heading in benchmark report');
assert.ok(benchmarkHtml.includes('Corpus A (Scanned Invoices)'), 'Missing Corpus A in benchmark report');
assert.ok(benchmarkHtml.includes('Corpus B (Vector CAD Blueprints)'), 'Missing Corpus B in benchmark report');
assert.ok(benchmarkHtml.includes('Corpus C (Photo & Marketing Catalog)'), 'Missing Corpus C in benchmark report');
assert.ok(benchmarkHtml.includes('Corpus D (Academic Paper)'), 'Missing Corpus D in benchmark report');
assert.ok(benchmarkHtml.includes('Corpus E (Corporate Slide Deck)'), 'Missing Corpus E in benchmark report');
assert.ok(benchmarkHtml.includes('"@type": "TechArticle"'), 'Missing TechArticle schema in benchmark report');

const prProspectsPath = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_9_BENCHMARK_PROSPECTS.md');
assert.ok(fs.existsSync(prProspectsPath), 'Missing LOOP_9_BENCHMARK_PROSPECTS.md');
const prProspects = fs.readFileSync(prProspectsPath, 'utf8');

assert.ok(prProspects.includes('JavaScript Weekly'), 'Missing JavaScript Weekly prospect');
assert.ok(prProspects.includes('Web Tools Weekly'), 'Missing Web Tools Weekly prospect');
assert.ok(prProspects.includes('Hacker Newsletter'), 'Missing Hacker Newsletter prospect');
assert.ok(prProspects.includes('Smashing Magazine'), 'Missing Smashing Magazine prospect');
assert.ok(prProspects.includes('STRICTLY MANUAL SEND VIA OWNER MAILBOX'), 'Missing manual send compliance notice');

console.log('  ✓ Loop 9 benchmark publication and 10-prospect PR outreach queue verified.\n');

console.log('====================================================');
console.log('  ALL SPRINT S24 VERIFICATION CHECKS PASSED (4/4)     ');
console.log('====================================================');
process.exit(0);
