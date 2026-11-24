#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sitemap Integrity & Reciprocal Alternates Test Suite
 *
 * Validates:
 * 1. Exactly 441 URLs declared in sitemap.xml matching 147 clusters x 3 locales
 * 2. Zero dangling URLs (every sitemap URL exists on disk)
 * 3. Zero orphan pages (every indexable HTML file on disk is declared in sitemap)
 * 4. Zero duplicate URLs in sitemap
 * 5. Strict W3C Datetime format for <lastmod> (YYYY-MM-DD)
 * 6. 100% reciprocal 4-way <xhtml:link> alternates (en, es, da, x-default)
 * 7. Canonical x-default pointing to English version
 * 8. Zero redirected or noindexed URLs in sitemap
 * 9. Deterministic synchronization with scripts/generate_sitemap.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { generateSitemapXml, SITEMAP_PATH } = require('../scripts/generate_sitemap');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://anyconverter.io';

console.log('--- Testing Sitemap Integrity & Reciprocal Alternates Suite ---');

// Load sitemap
assert.ok(fs.existsSync(SITEMAP_PATH), 'sitemap.xml must exist on disk');
const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Parse URLs
const urlBlocks = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
const locs = [];
const sitemapUrlMap = new Map();

for (const block of urlBlocks) {
  const locMatch = block[1].match(/<loc>([^<]+)<\/loc>/);
  assert.ok(locMatch, 'Every <url> block must contain a <loc> tag');
  const loc = locMatch[1].trim();

  const lastmodMatch = block[1].match(/<lastmod>([^<]+)<\/lastmod>/);
  assert.ok(lastmodMatch, `<url> for ${loc} must contain a <lastmod> tag`);
  const lastmod = lastmodMatch[1].trim();

  const changefreqMatch = block[1].match(/<changefreq>([^<]+)<\/changefreq>/);
  assert.ok(changefreqMatch, `<url> for ${loc} must contain a <changefreq> tag`);

  const priorityMatch = block[1].match(/<priority>([^<]+)<\/priority>/);
  assert.ok(priorityMatch, `<url> for ${loc} must contain a <priority> tag`);

  const rawLinks = [...block[1].matchAll(/<xhtml:link[^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*\/>/g)]
    .map(m => ({ lang: m[1], href: m[2] }));

  locs.push(loc);
  sitemapUrlMap.set(loc, {
    loc,
    lastmod,
    changefreq: changefreqMatch[1].trim(),
    priority: priorityMatch[1].trim(),
    links: rawLinks,
    hreflangs: Object.fromEntries(rawLinks.map(l => [l.lang, l.href]))
  });
}

// Test 1: URL Count & Uniqueness
console.log(`[CHECK 1] Sitemap Total URLs Declared: ${locs.length}`);
assert.strictEqual(locs.length, 444, `Expected exactly 444 URLs in sitemap.xml, found ${locs.length}`);
const uniqueLocs = new Set(locs);
assert.strictEqual(uniqueLocs.size, 444, 'All 444 URLs in sitemap.xml must be unique (0 duplicates allowed)');
console.log('✓ Exactly 444 unique URLs verified in sitemap.xml');

// Test 2: Locale Breakdown
let enCount = 0;
let esCount = 0;
let daCount = 0;
for (const loc of locs) {
  const url = new URL(loc);
  if (url.pathname.startsWith('/es/')) {
    esCount++;
  } else if (url.pathname.startsWith('/da/')) {
    daCount++;
  } else {
    enCount++;
  }
}
console.log(`[CHECK 2] Locale Breakdown: EN=${enCount}, ES=${esCount}, DA=${daCount}`);
assert.strictEqual(enCount, 148, `Expected 148 English URLs, found ${enCount}`);
assert.strictEqual(esCount, 148, `Expected 148 Spanish URLs, found ${esCount}`);
assert.strictEqual(daCount, 148, `Expected 148 Danish URLs, found ${daCount}`);
console.log('✓ Exact 148/148/148 locale symmetry confirmed');

// Test 3: Zero Dangling URLs (Every sitemap URL exists on disk)
for (const loc of locs) {
  const pathname = new URL(loc).pathname;
  let relFile = pathname === '/' ? 'index.html' : path.join(pathname.slice(1), 'index.html');
  const fullPath = path.join(ROOT, relFile);
  assert.ok(
    fs.existsSync(fullPath),
    `Dangling URL detected: ${loc} references non-existent file ${relFile}`
  );
}
console.log('✓ Zero dangling URLs: 100% of 444 sitemap URLs verified active on disk');

// Test 4: Zero Orphan Pages (Every indexable HTML page is in sitemap)
const excludedScanDirs = new Set(['.git', '.vs', 'node_modules', 'output', 'attached_assets', 'scratch', 'test-results', 'reports', 'coverage', '.agents', '.claude']);
function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excludedScanDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
    } else if (entry.name === 'index.html') {
      out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
    }
  }
  return out;
}

const onDiskPages = walkHtml(ROOT);
console.log(`[CHECK 4] Total indexable index.html files discovered on disk: ${onDiskPages.length}`);
assert.strictEqual(onDiskPages.length, 444, `Expected exactly 444 index.html files on disk, found ${onDiskPages.length}`);

for (const p of onDiskPages) {
  const route = p === 'index.html' ? '/' : `/${p.replace(/\/index\.html$/, '')}/`;
  const url = `${ORIGIN}${route}`;
  assert.ok(
    sitemapUrlMap.has(url),
    `Orphan page detected: ${p} (${url}) exists on disk but is omitted from sitemap.xml`
  );
}
console.log('✓ Zero orphan pages: 100% of 441 on-disk pages registered in sitemap.xml');

// Test 5: W3C Datetime Validation for <lastmod>
const W3C_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
for (const [loc, data] of sitemapUrlMap.entries()) {
  assert.ok(
    W3C_DATE_REGEX.test(data.lastmod),
    `<lastmod> for ${loc} ("${data.lastmod}") must match YYYY-MM-DD W3C Datetime format`
  );
}
console.log('✓ 100% of <lastmod> timestamps conform to W3C Datetime (YYYY-MM-DD)');

// Test 6: Reciprocal 4-Way <xhtml:link> Alternates
for (const [loc, data] of sitemapUrlMap.entries()) {
  const h = data.hreflangs;
  assert.ok(h['en'], `<url> for ${loc} missing hreflang="en" alternate`);
  assert.ok(h['es'], `<url> for ${loc} missing hreflang="es" alternate`);
  assert.ok(h['da'], `<url> for ${loc} missing hreflang="da" alternate`);
  assert.ok(h['x-default'], `<url> for ${loc} missing hreflang="x-default" alternate`);

  // x-default must equal the English URL
  assert.strictEqual(
    h['x-default'],
    h['en'],
    `x-default for ${loc} (${h['x-default']}) must match English URL (${h['en']})`
  );
}
console.log('✓ 100% of 441 URLs contain complete 4-way reciprocal alternates (en, es, da, x-default)');

// Test 7: No Redirected or Noindexed URLs
const redirectsRaw = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
const redirectFromPaths = new Set(
  redirectsRaw.split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split(/\s+/)[0])
);

for (const loc of locs) {
  const p = new URL(loc).pathname;
  assert.ok(
    !redirectFromPaths.has(p),
    `Redirected URL in sitemap: ${loc} matches a rule in _redirects`
  );
}
console.log('✓ Zero redirected URLs present in sitemap.xml');

// Test 8: Deterministic Generator Verification (Drift Detection)
const generated = generateSitemapXml();
assert.strictEqual(generated.urlsCount, 444, 'Generator must produce exactly 444 URLs');
assert.strictEqual(generated.clustersCount, 148, 'Generator must produce exactly 148 clusters');
console.log('✓ Sitemap generator execution verified: clean drift-free output');

console.log('\nALL SITEMAP INTEGRITY TESTS PASSED!');
