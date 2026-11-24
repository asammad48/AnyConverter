#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S29 Dedicated Verification Suite:
 * Sitewide Internal Link Audit + Sitemap Refresh & Loop 11 Open-Source NPM Micro-Library
 *
 * Verifies:
 * 1. Exactly 0 broken internal links across all 441 HTML files in EN, ES, DA.
 * 2. 0 language-mismatch link leaks in header nav, footer, breadcrumbs, hub links, and related-tools grids.
 * 3. 0 orphaned URLs sitewide (every URL has incoming internal links).
 * 4. 100% adherence to RELATED_TOOLS_COMPLETE_MAPPING.json (degree 4-5, 0 asymmetric edges, 0 orphans).
 * 5. Canonical sitemap.xml invariants (441 URLs, 100% reciprocal 4-way hreflang, 0 drift).
 * 6. @anyconverter/math micro-library integrity (package.json, index.js, index.d.ts, README.md, unit tests).
 * 7. Loop 11 documentation & owner publish governance checklist (LOOP_11_NPM_PUBLISH.md).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'TOOL_INVENTORY_AND_COUNTS.json');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const MAPPING_PATH = path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json');
const REDIRECTS_PATH = path.join(ROOT, '_redirects');
const PKG_DIR = path.join(ROOT, 'packages', 'anyconverter-math');
const PUBLISH_DOC_PATH = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_11_NPM_PUBLISH.md');

console.log('====================================================');
console.log('   SPRINT S29: INTERNAL LINKS & SITEMAP TEST SUITE   ');
console.log('====================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✓ [CHECK ${totalChecks}] ${desc}`);
    passedChecks++;
  } catch (err) {
    console.error(`  ✗ [CHECK ${totalChecks} FAILED] ${desc}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// 1. Manifest & 441 URL Inventory Assembly
// -------------------------------------------------------------
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const allPages = [];

allPages.push({ relPath: 'index.html', url: '/', lang: 'en', type: 'home' });
allPages.push({ relPath: path.join('es', 'index.html'), url: '/es/', lang: 'es', type: 'home' });
allPages.push({ relPath: path.join('da', 'index.html'), url: '/da/', lang: 'da', type: 'home' });

for (const hub of manifest.categoryHubs) {
  allPages.push({ relPath: path.join(hub.slug, 'index.html'), url: hub.en, lang: 'en', type: 'hub' });
  allPages.push({ relPath: path.join('es', hub.slug, 'index.html'), url: hub.es, lang: 'es', type: 'hub' });
  allPages.push({ relPath: path.join('da', hub.slug, 'index.html'), url: hub.da, lang: 'da', type: 'hub' });
}

allPages.push({ relPath: path.join('blog', 'index.html'), url: '/blog/', lang: 'en', type: 'blog' });
allPages.push({ relPath: path.join('es', 'blog', 'index.html'), url: '/es/blog/', lang: 'es', type: 'blog' });
allPages.push({ relPath: path.join('da', 'blog', 'index.html'), url: '/da/blog/', lang: 'da', type: 'blog' });

for (const info of manifest.informationalPages) {
  allPages.push({ relPath: path.join(info.slug, 'index.html'), url: info.en, lang: 'en', type: 'info' });
  allPages.push({ relPath: path.join('es', info.slug, 'index.html'), url: info.es, lang: 'es', type: 'info' });
  allPages.push({ relPath: path.join('da', info.slug, 'index.html'), url: info.da, lang: 'da', type: 'info' });
}

for (const tool of manifest.tools) {
  allPages.push({ relPath: path.join(tool.slug, 'index.html'), url: tool.paths.en, lang: 'en', type: 'tool' });
  allPages.push({ relPath: path.join('es', tool.slug, 'index.html'), url: tool.paths.es, lang: 'es', type: 'tool' });
  allPages.push({ relPath: path.join('da', tool.slug, 'index.html'), url: tool.paths.da, lang: 'da', type: 'tool' });
}

const pageUrlSet = new Set(allPages.map(p => p.url));
const redirects = new Map();
if (fs.existsSync(REDIRECTS_PATH)) {
  fs.readFileSync(REDIRECTS_PATH, 'utf8').split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const parts = line.split(/\s+/);
    if (parts.length >= 2) redirects.set(parts[0], parts[1]);
  });
}

// Crawl link graph
const linkGraph = {};
const inLinks = {};
allPages.forEach(p => {
  linkGraph[p.url] = [];
  inLinks[p.url] = new Set();
});

const brokenLinks = [];
const langLeaks = [];
const redirectLinks = [];
let totalLinksCount = 0;

for (const pg of allPages) {
  const filePath = path.join(ROOT, pg.relPath);
  assert.ok(fs.existsSync(filePath), `Physical file must exist: ${pg.relPath}`);
  const html = fs.readFileSync(filePath, 'utf8');

  const bodyIdx = html.indexOf('<body');
  const bodyContent = bodyIdx !== -1 ? html.slice(bodyIdx) : html;

  const aTagRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = aTagRegex.exec(bodyContent)) !== null) {
    totalLinksCount++;
    const rawTag = match[0];
    const href = match[1].trim();

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (href.startsWith('https://anyconverter.io/') || href.startsWith('http://anyconverter.io/')) {
        const u = new URL(href);
        evaluateLink(u.pathname + u.search + u.hash, pg, rawTag);
      }
      continue;
    }

    if (href.startsWith('/assets/') || href.startsWith('/manifest.webmanifest') || href.startsWith('/sitemap.xml') || href.startsWith('/robots.txt')) {
      continue;
    }

    evaluateLink(href, pg, rawTag);
  }
}

function evaluateLink(href, pg, rawTag) {
  const clean = href.replace(/[?#].*$/, '');
  if (!clean.startsWith('/')) {
    brokenLinks.push({ page: pg.url, target: href, reason: 'Relative link without leading slash' });
    return;
  }

  // Exemptions: explicit language switcher
  const isLangBadge = rawTag.includes('footer-lang-badge') || rawTag.includes('lang-switcher') || rawTag.includes('lang-option');
  if (isLangBadge) return;

  // FAQ language availability explanation exemption
  const isFaqLangReference = pg.url.includes('/faq/') && (clean === '/es/' || clean === '/da/' || clean === '/');
  if (isFaqLangReference) {
    recordEdge(pg.url, clean);
    return;
  }

  // Check redirects
  if (redirects.has(clean)) {
    redirectLinks.push({ page: pg.url, target: clean, redirect: redirects.get(clean) });
  }

  // Check language isolation
  if (pg.lang === 'en') {
    if (clean.startsWith('/es/') || clean.startsWith('/da/')) {
      langLeaks.push({ page: pg.url, target: clean, type: 'EN->ES/DA' });
    }
  } else if (pg.lang === 'es') {
    if (!clean.startsWith('/es/') && clean !== '/es/') {
      langLeaks.push({ page: pg.url, target: clean, type: 'ES->EN/DA' });
    }
  } else if (pg.lang === 'da') {
    if (!clean.startsWith('/da/') && clean !== '/da/') {
      langLeaks.push({ page: pg.url, target: clean, type: 'DA->EN/ES' });
    }
  }

  // Destination file on disk
  let targetFile;
  if (clean === '/') {
    targetFile = path.join(ROOT, 'index.html');
  } else if (clean.endsWith('/')) {
    targetFile = path.join(ROOT, clean.slice(1), 'index.html');
  } else {
    targetFile = path.join(ROOT, clean.slice(1));
    if (!fs.existsSync(targetFile)) {
      targetFile = path.join(ROOT, clean.slice(1), 'index.html');
    }
  }

  if (!fs.existsSync(targetFile)) {
    brokenLinks.push({ page: pg.url, target: clean, resolvedPath: targetFile });
  } else {
    const targetUrl = clean.endsWith('/') ? clean : (path.extname(clean) ? clean : clean + '/');
    recordEdge(pg.url, targetUrl);
  }
}

function recordEdge(from, to) {
  if (pageUrlSet.has(to)) {
    linkGraph[from].push(to);
    inLinks[to].add(from);
  }
}

// -------------------------------------------------------------
// Checks
// -------------------------------------------------------------

console.log('--- 1. Sitewide Internal Link Crawl & Invariants ---');

check('Total canonical page inventory is exactly 441 URLs (147 clusters x 3 locales)', () => {
  assert.strictEqual(allPages.length, 441, `Expected 441 pages, found ${allPages.length}`);
});

check('Exactly 0 broken internal links sitewide across all 441 HTML pages', () => {
  if (brokenLinks.length > 0) {
    console.error('Broken links found:', brokenLinks);
  }
  assert.strictEqual(brokenLinks.length, 0, `Expected 0 broken links, found ${brokenLinks.length}`);
});

check('0 language-mismatch link leaks in header nav, footer, breadcrumbs, hub links, and related-tools grids', () => {
  if (langLeaks.length > 0) {
    console.error('Language leaks found:', langLeaks);
  }
  assert.strictEqual(langLeaks.length, 0, `Expected 0 language leaks, found ${langLeaks.length}`);
});

check('0 unnecessary 301 redirects in internal link targets', () => {
  if (redirectLinks.length > 0) {
    console.error('Redirect links found:', redirectLinks);
  }
  assert.strictEqual(redirectLinks.length, 0, `Expected 0 redirect links, found ${redirectLinks.length}`);
});

check('0 orphaned URLs sitewide (every URL has incoming internal navigation links)', () => {
  const orphans = allPages.filter(p => inLinks[p.url].size === 0);
  if (orphans.length > 0) {
    console.error('Orphan pages found:', orphans.map(o => o.url));
  }
  assert.strictEqual(orphans.length, 0, `Expected 0 orphan pages, found ${orphans.length}`);
});

console.log('\n--- 2. Related Tools Reciprocal Graph Bounds ---');

check('RELATED_TOOLS_COMPLETE_MAPPING.json covers all 128 tools with 100% reciprocity and degree bounded to 4-5', () => {
  const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
  const tools = Object.keys(mapping);
  assert.strictEqual(tools.length, 128, 'Must cover 128 tools');

  let nonReciprocal = 0;
  tools.forEach(u => {
    const degree = mapping[u].length;
    assert.ok(degree >= 4 && degree <= 5, `Tool ${u} degree ${degree} must be bounded to 4-5`);
    mapping[u].forEach(v => {
      if (!mapping[v] || !mapping[v].includes(u)) {
        nonReciprocal++;
      }
    });
  });

  assert.strictEqual(nonReciprocal, 0, 'Graph must be 100% reciprocal with 0 asymmetric edges');
});

console.log('\n--- 3. Canonical Sitemap Synchronization ---');

check('sitemap.xml has 444 URLs with 100% reciprocal 4-way hreflang and passes drift check', () => {
  assert.ok(fs.existsSync(SITEMAP_PATH), 'sitemap.xml must exist');
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const urlMatches = xml.match(/<loc>/g) || [];
  assert.strictEqual(urlMatches.length, 444, `Expected 444 <loc> tags in sitemap.xml, found ${urlMatches.length}`);

  // Run sitemap verification check
  const checkOutput = execSync('node scripts/generate_sitemap.js --check', { cwd: ROOT, encoding: 'utf8' });
  assert.ok(checkOutput.includes('100% synchronized'), 'sitemap.xml must pass zero-drift check');
});

console.log('\n--- 4. Loop 11 Open-Source Micro-Library Package ---');

check('packages/anyconverter-math contains valid package.json, index.js, index.d.ts, README.md', () => {
  const pkgJsonPath = path.join(PKG_DIR, 'package.json');
  assert.ok(fs.existsSync(pkgJsonPath), 'package.json must exist');
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  assert.strictEqual(pkg.name, '@anyconverter/math');
  assert.strictEqual(pkg.version, '1.0.0');
  assert.strictEqual(pkg.license, 'MIT');
  assert.strictEqual(pkg.dependencies, undefined, 'Zero runtime dependencies required');

  assert.ok(fs.existsSync(path.join(PKG_DIR, 'index.js')), 'index.js must exist');
  assert.ok(fs.existsSync(path.join(PKG_DIR, 'index.d.ts')), 'index.d.ts must exist');
  assert.ok(fs.existsSync(path.join(PKG_DIR, 'README.md')), 'README.md must exist');
  assert.ok(fs.existsSync(path.join(PKG_DIR, 'test', 'index.test.js')), 'test/index.test.js must exist');
});

check('packages/anyconverter-math unit test suite passes 100%', () => {
  const testOutput = execSync('node test/index.test.js', { cwd: PKG_DIR, encoding: 'utf8' });
  assert.ok(testOutput.includes('17/17 unit tests passed'), 'All 17 package unit tests must pass');
});

check('docs/growth/outreach/LOOP_11_NPM_PUBLISH.md exists with owner publish checklist', () => {
  assert.ok(fs.existsSync(PUBLISH_DOC_PATH), 'LOOP_11_NPM_PUBLISH.md must exist');
  const doc = fs.readFileSync(PUBLISH_DOC_PATH, 'utf8');
  assert.ok(doc.includes('@anyconverter/math'), 'Must reference package name');
  assert.ok(doc.includes('npm publish'), 'Must contain publish instructions');
  assert.ok(doc.includes('owner'), 'Must state manual owner publish requirement');
});

console.log('\n====================================================');
console.log(`Results: ${passedChecks}/${totalChecks} assertions passed.`);
if (passedChecks === totalChecks) {
  console.log('STATUS: SPRINT S29 INTERNAL LINKS & SITEMAP SUITE PASSED (100%).');
  process.exit(0);
} else {
  console.error('STATUS: FAILURES DETECTED IN SPRINT S29 SUITE.');
  process.exit(1);
}
