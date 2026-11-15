const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'reports', '.agents', 'coverage', '.ai-memory', 'scratch'].includes(file)) {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} HTML files across the project.`);

const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
console.log(`Found ${sitemapUrls.length} URLs declared in sitemap.xml.`);

const redirectsRaw = fs.readFileSync('_redirects', 'utf8');
const redirectRules = redirectsRaw.split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('#'))
  .map(l => {
    const parts = l.split(/\s+/);
    return { from: parts[0], to: parts[1], code: parts[2] || '301' };
  });
console.log(`Found ${redirectRules.length} redirect rules in _redirects.`);

// Audit 1: Hreflang reciprocity and canonical correctness
const pageAudit = [];
let passCount = 0;
let failCount = 0;

htmlFiles.forEach(f => {
  const relPath = f.replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');

  // Canonical tag
  const canMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const canonical = canMatch ? canMatch[1] : null;

  // Hreflang alternates
  const alternates = {};
  const altRegex = /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi;
  let match;
  while ((match = altRegex.exec(html)) !== null) {
    alternates[match[1]] = match[2];
  }

  // Self hreflang check
  const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1] : 'en';

  const hasSelfHreflang = !!alternates[lang];
  const hasXDefault = !!alternates['x-default'];
  const hasEn = !!alternates['en'];
  const hasEs = !!alternates['es'];
  const hasDa = !!alternates['da'];

  const isCompleteCluster = hasEn && hasEs && hasDa && hasXDefault;

  if (canonical && isCompleteCluster) {
    passCount++;
  } else {
    failCount++;
  }

  pageAudit.push({
    file: relPath,
    lang,
    canonical,
    en: alternates['en'] || '',
    es: alternates['es'] || '',
    da: alternates['da'] || '',
    xDefault: alternates['x-default'] || '',
    status: (canonical && isCompleteCluster) ? 'PASS' : 'WARN_INCOMPLETE'
  });
});

console.log(`Hreflang / Canonical Audit: ${passCount} passed, ${failCount} warnings.`);

// Audit 2: Redirect verification
const redirectAudit = [];
redirectRules.forEach(r => {
  // Check if destination exists
  let destFile = r.to;
  if (destFile === '/') destFile = '/index.html';
  if (destFile.endsWith('/')) destFile += 'index.html';
  if (!destFile.endsWith('.html')) destFile += '/index.html';
  if (destFile.startsWith('/')) destFile = destFile.slice(1);

  const destExists = fs.existsSync(destFile);
  redirectAudit.push({
    from: r.from,
    to: r.to,
    code: r.code,
    destinationExists: destExists,
    status: destExists ? 'PASS' : 'FAIL_DESTINATION_NOT_FOUND'
  });
});

const outDir = path.resolve('reports/seo-remediation-2026-11');
fs.mkdirSync(outDir, { recursive: true });

function toCsv(headers, rows) {
  const headerLine = headers.join(',');
  const rowLines = rows.map(r => headers.map(h => {
    let val = r[h] !== undefined ? r[h] : '';
    if (typeof val === 'string') val = '"' + val.replace(/"/g, '""') + '"';
    return val;
  }).join(','));
  return [headerLine, ...rowLines].join('\n');
}

fs.writeFileSync(
  path.join(outDir, 'REDIRECT_VERIFICATION.csv'),
  toCsv(['from', 'to', 'code', 'destinationExists', 'status'], redirectAudit),
  'utf8'
);

fs.writeFileSync(
  path.join(outDir, 'HREFLANG_CANONICAL_AUDIT.csv'),
  toCsv(['file', 'lang', 'canonical', 'en', 'es', 'da', 'xDefault', 'status'], pageAudit),
  'utf8'
);

console.log('✓ Generated REDIRECT_VERIFICATION.csv and HREFLANG_CANONICAL_AUDIT.csv');
