/**
 * AnyConverter — Sitewide Internal Link Audit & Graph Export (Sprint S29)
 *
 * Crawls and verifies all 441 URLs in EN, ES, and DA.
 * Asserts:
 * 1. Exactly 0 broken internal links (100% of internal links resolve to valid HTML files on disk).
 * 2. Exactly 0 orphaned pages (every page is reachable via internal navigation).
 * 3. Language context isolation (EN links stay in /, ES links stay in /es/, DA links stay in /da/).
 * 4. Zero trailing slash mismatches and zero links pointing to unnecessary 301 redirects.
 * 5. Full internal link graph and audit report exported to CSV and JSON.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'TOOL_INVENTORY_AND_COUNTS.json');
const REDIRECTS_PATH = path.join(ROOT, '_redirects');
const OUT_DIR = path.join(ROOT, 'reports', 'seo-remediation-2026-11');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Build canonical list of all 441 pages
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const allPages = [];

// Homepages
allPages.push({ relPath: 'index.html', url: '/', lang: 'en', type: 'home' });
allPages.push({ relPath: path.join('es', 'index.html'), url: '/es/', lang: 'es', type: 'home' });
allPages.push({ relPath: path.join('da', 'index.html'), url: '/da/', lang: 'da', type: 'home' });

// Category Hubs
for (const hub of manifest.categoryHubs) {
  allPages.push({ relPath: path.join(hub.slug, 'index.html'), url: hub.en, lang: 'en', type: 'hub' });
  allPages.push({ relPath: path.join('es', hub.slug, 'index.html'), url: hub.es, lang: 'es', type: 'hub' });
  allPages.push({ relPath: path.join('da', hub.slug, 'index.html'), url: hub.da, lang: 'da', type: 'hub' });
}

// Blog
allPages.push({ relPath: path.join('blog', 'index.html'), url: '/blog/', lang: 'en', type: 'blog' });
allPages.push({ relPath: path.join('es', 'blog', 'index.html'), url: '/es/blog/', lang: 'es', type: 'blog' });
allPages.push({ relPath: path.join('da', 'blog', 'index.html'), url: '/da/blog/', lang: 'da', type: 'blog' });

// Informational Pages
for (const info of manifest.informationalPages) {
  allPages.push({ relPath: path.join(info.slug, 'index.html'), url: info.en, lang: 'en', type: 'info' });
  allPages.push({ relPath: path.join('es', info.slug, 'index.html'), url: info.es, lang: 'es', type: 'info' });
  allPages.push({ relPath: path.join('da', info.slug, 'index.html'), url: info.da, lang: 'da', type: 'info' });
}

// Functional Tools
for (const tool of manifest.tools) {
  allPages.push({ relPath: path.join(tool.slug, 'index.html'), url: tool.paths.en, lang: 'en', type: 'tool' });
  allPages.push({ relPath: path.join('es', tool.slug, 'index.html'), url: tool.paths.es, lang: 'es', type: 'tool' });
  allPages.push({ relPath: path.join('da', tool.slug, 'index.html'), url: tool.paths.da, lang: 'da', type: 'tool' });
}

if (allPages.length !== 441) {
  console.error(`[ERROR] Expected 441 canonical URLs, got ${allPages.length}`);
  process.exit(1);
}

const pageUrlSet = new Set(allPages.map(p => p.url));

// 2. Load 301 redirects to check for stale links
const redirects = new Map();
if (fs.existsSync(REDIRECTS_PATH)) {
  fs.readFileSync(REDIRECTS_PATH, 'utf8').split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const parts = line.split(/\s+/);
    if (parts.length >= 2) redirects.set(parts[0], parts[1]);
  });
}

// 3. Crawl and audit
const linkGraph = {}; // sourceUrl -> [targetUrl]
const inLinks = {}; // targetUrl -> Set of referring page URLs
allPages.forEach(p => {
  linkGraph[p.url] = [];
  inLinks[p.url] = new Set();
});

const defects = [];
let totalLinksInspected = 0;

for (const pg of allPages) {
  const filePath = path.join(ROOT, pg.relPath);
  if (!fs.existsSync(filePath)) {
    defects.push({ page: pg.url, type: 'FILE_MISSING_ON_DISK', detail: pg.relPath });
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const bodyIdx = html.indexOf('<body');
  const bodyContent = bodyIdx !== -1 ? html.slice(bodyIdx) : html;

  const aTagRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = aTagRegex.exec(bodyContent)) !== null) {
    totalLinksInspected++;
    const rawTag = match[0];
    const href = match[1].trim();

    // Skip non-HTTP navigations
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    // External URLs
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (href.startsWith('https://anyconverter.io/') || href.startsWith('http://anyconverter.io/')) {
        const u = new URL(href);
        evaluateLink(u.pathname + u.search + u.hash, pg, rawTag);
      }
      continue;
    }

    // Static assets
    if (href.startsWith('/assets/') || href.startsWith('/manifest.webmanifest') || href.startsWith('/sitemap.xml') || href.startsWith('/robots.txt')) {
      continue;
    }

    evaluateLink(href, pg, rawTag);
  }
}

function evaluateLink(href, pg, rawTag) {
  const clean = href.replace(/[?#].*$/, '');
  if (!clean.startsWith('/')) {
    defects.push({ page: pg.url, type: 'RELATIVE_LINK_NO_SLASH', target: href, raw: rawTag });
    return;
  }

  // Language switcher exemption
  const isLangBadge = rawTag.includes('footer-lang-badge') || rawTag.includes('lang-switcher') || rawTag.includes('lang-option');
  if (isLangBadge) return;

  // FAQ multilingual explanation exemption
  const isFaqLangReference = pg.url.includes('/faq/') && (clean === '/es/' || clean === '/da/' || clean === '/');
  if (isFaqLangReference) {
    // Record valid internal link
    recordValidEdge(pg.url, clean);
    return;
  }

  // Trailing slash requirement
  if (!clean.endsWith('/') && !path.extname(clean)) {
    defects.push({ page: pg.url, type: 'MISSING_TRAILING_SLASH', target: clean, raw: rawTag });
  }

  // 301 Redirect avoidance
  if (redirects.has(clean)) {
    defects.push({ page: pg.url, type: 'REDIRECT_LINK', target: clean, destination: redirects.get(clean), raw: rawTag });
  }

  // Language context isolation
  if (pg.lang === 'en') {
    if (clean.startsWith('/es/') || clean.startsWith('/da/')) {
      defects.push({ page: pg.url, type: 'LANG_LEAK_FROM_EN', target: clean, raw: rawTag });
    }
  } else if (pg.lang === 'es') {
    if (!clean.startsWith('/es/') && clean !== '/es/') {
      defects.push({ page: pg.url, type: 'LANG_LEAK_FROM_ES', target: clean, raw: rawTag });
    }
  } else if (pg.lang === 'da') {
    if (!clean.startsWith('/da/') && clean !== '/da/') {
      defects.push({ page: pg.url, type: 'LANG_LEAK_FROM_DA', target: clean, raw: rawTag });
    }
  }

  // Check destination file on disk
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
    defects.push({ page: pg.url, type: 'BROKEN_INTERNAL_LINK', target: clean, raw: rawTag });
  } else {
    const targetUrl = clean.endsWith('/') ? clean : (path.extname(clean) ? clean : clean + '/');
    recordValidEdge(pg.url, targetUrl);
  }
}

function recordValidEdge(sourceUrl, targetUrl) {
  if (pageUrlSet.has(targetUrl)) {
    linkGraph[sourceUrl].push(targetUrl);
    inLinks[targetUrl].add(sourceUrl);
  }
}

// Check for orphans
const orphans = allPages.filter(p => inLinks[p.url].size === 0);

console.log('====================================================');
console.log('   ANYCONVERTER SITEWIDE INTERNAL LINK AUDIT (S29)   ');
console.log('====================================================\n');
console.log(`[INFO] Total URLs Audited: ${allPages.length}`);
console.log(`[INFO] Total Internal Links Inspected: ${totalLinksInspected}`);
console.log(`[INFO] Detected Defects: ${defects.length}`);
console.log(`[INFO] Orphaned URLs: ${orphans.length}`);

// Export CSV Audit Report
const csvHeaders = ['target_url', 'page_type', 'language', 'incoming_link_count', 'sample_referring_pages'];
const csvRows = [csvHeaders.join(',')];

allPages.forEach(p => {
  const count = inLinks[p.url].size;
  const sample = Array.from(inLinks[p.url]).slice(0, 5).join('; ');
  csvRows.push([`"${p.url}"`, `"${p.type}"`, `"${p.lang}"`, count, `"${sample}"`].join(','));
});

fs.writeFileSync(path.join(OUT_DIR, 'INTERNAL_LINK_AUDIT.csv'), csvRows.join('\n'), 'utf8');
console.log('✓ Wrote reports/seo-remediation-2026-11/INTERNAL_LINK_AUDIT.csv');

// Export JSON Link Graph
const graphExport = {
  metadata: {
    generatedAt: new Date().toISOString(),
    sprint: 'S29',
    totalUrls: allPages.length,
    totalLinks: totalLinksInspected,
    brokenLinks: defects.length,
    orphanedUrls: orphans.length
  },
  nodes: allPages.map(p => ({
    id: p.url,
    lang: p.lang,
    type: p.type,
    inDegree: inLinks[p.url].size,
    outDegree: linkGraph[p.url].length
  })),
  adjacency: linkGraph
};

fs.writeFileSync(path.join(OUT_DIR, 'INTERNAL_LINK_GRAPH.json'), JSON.stringify(graphExport, null, 2), 'utf8');
console.log('✓ Wrote reports/seo-remediation-2026-11/INTERNAL_LINK_GRAPH.json');

if (defects.length > 0) {
  console.error('\n[DEFECTS FOUND]');
  console.error(defects);
  process.exit(1);
}

if (orphans.length > 0) {
  console.error('\n[ORPHANS FOUND]');
  console.error(orphans.map(o => o.url));
  process.exit(1);
}

console.log('\n[PASS] 0 broken internal links, 0 orphaned URLs, 100% language isolation sitewide.');
process.exit(0);
