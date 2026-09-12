#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const origin = 'https://anyconverter.io';
const historicalGscDir = path.join(root, 'reports', 'gsc-2026-08-20', 'anyconverter.io-Performance-on-Search-2026-08-20');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function walk(dir, predicate, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, files);
    else if (!predicate || predicate(full)) files.push(full);
  }
  return files;
}

function normalizeSlash(value) {
  return value.replace(/\\/g, '/');
}

function parseAttrs(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*["']([^"']*)["']/g)) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

function pagePathFromFile(file) {
  const rel = normalizeSlash(path.relative(root, file));
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\/index\.html$/, '/');
}

function expectedCanonical(urlPath) {
  return origin + urlPath;
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted && char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || '';
    });
    return row;
  });
}

function num(value) {
  if (value === undefined || value === null || value === '') return 0;
  if (/%$/.test(String(value))) return Number(String(value).replace('%', '')) / 100;
  return Number(String(value).replace(/,/g, '')) || 0;
}

function avgPositionBucket(position) {
  const value = num(position);
  if (!value) return 'unknown';
  if (value <= 10) return '1-10';
  if (value <= 20) return '11-20';
  return '21+';
}

function isBranded(query) {
  return /\b(any\s*converter|anyconverter|any convertor|anyconvert)\b/i.test(query || '');
}

function parseSitemap() {
  if (!exists('sitemap.xml')) return { urls: [], alternates: [], parseable: false };
  const xml = read('sitemap.xml');
  const urls = [];
  const alternates = [];
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const body = block[1];
    const loc = (body.match(/<loc>([^<]+)<\/loc>/) || [])[1] || '';
    const urlAlternates = [];
    for (const alt of body.matchAll(/<xhtml:link\b[^>]*\/?>/g)) {
      const attrs = parseAttrs(alt[0]);
      urlAlternates.push({ hreflang: attrs.hreflang || '', href: attrs.href || '' });
      alternates.push({ loc, hreflang: attrs.hreflang || '', href: attrs.href || '' });
    }
    urls.push({ loc, alternates: urlAlternates });
  }
  return {
    urls,
    alternates,
    parseable: /<urlset[\s\S]*<\/urlset>/.test(xml),
    hasXhtmlNamespace: /xmlns:xhtml=/.test(xml),
  };
}

function auditHtmlPages(sitemapUrlSet) {
  const htmlFiles = walk(root, (file) => /index\.html$/i.test(file))
    .filter((file) => !normalizeSlash(path.relative(root, file)).startsWith('output/'));
  const pages = htmlFiles.map((file) => {
    const rel = normalizeSlash(path.relative(root, file));
    const urlPath = pagePathFromFile(file);
    const html = fs.readFileSync(file, 'utf8');
    const canonical = ((html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [])[0] || '').match(/href=["']([^"']+)["']/i)?.[1] || '';
    const robots = ((html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i) || [])[0] || '').match(/content=["']([^"']+)["']/i)?.[1] || '';
    const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
    return {
      file: rel,
      path: urlPath,
      canonical,
      expectedCanonical: expectedCanonical(urlPath),
      selfCanonical: canonical === expectedCanonical(urlPath),
      inSitemap: sitemapUrlSet.has(expectedCanonical(urlPath)),
      noindex: /noindex/i.test(robots),
      title,
    };
  });
  return {
    count: pages.length,
    intendedCanonicalPages: pages.filter((page) => page.selfCanonical && !page.noindex).length,
    noindexPages: pages.filter((page) => page.noindex).map((page) => page.path),
    canonicalMismatches: pages.filter((page) => !page.selfCanonical).map((page) => ({
      path: page.path,
      canonical: page.canonical,
      expected: page.expectedCanonical,
    })),
    missingFromSitemap: pages.filter((page) => page.selfCanonical && !page.inSitemap).map((page) => page.path),
  };
}

function summarizeHistoricalGsc() {
  const queriesPath = path.join(historicalGscDir, 'Queries.csv');
  const pagesPath = path.join(historicalGscDir, 'Pages.csv');
  const devicesPath = path.join(historicalGscDir, 'Devices.csv');
  const countriesPath = path.join(historicalGscDir, 'Countries.csv');
  const filtersPath = path.join(historicalGscDir, 'Filters.csv');
  const queries = readCsv(queriesPath);
  const pages = readCsv(pagesPath);
  const devices = readCsv(devicesPath);
  const countries = readCsv(countriesPath);
  const filters = readCsv(filtersPath);

  const querySummary = queries.reduce((acc, row) => {
    const query = row['Top queries'] || '';
    const clicks = num(row.Clicks);
    const impressions = num(row.Impressions);
    const bucket = avgPositionBucket(row.Position);
    acc.clicks += clicks;
    acc.impressions += impressions;
    acc.uniqueQueries += 1;
    if (!isBranded(query)) {
      acc.nonBrandedClicks += clicks;
      acc.nonBrandedImpressions += impressions;
    } else {
      acc.brandedClicks += clicks;
      acc.brandedImpressions += impressions;
    }
    if (bucket === '1-10') acc.queriesPosition1To10 += 1;
    if (bucket === '11-20') acc.queriesPosition11To20 += 1;
    return acc;
  }, {
    clicks: 0,
    impressions: 0,
    uniqueQueries: 0,
    brandedClicks: 0,
    brandedImpressions: 0,
    nonBrandedClicks: 0,
    nonBrandedImpressions: 0,
    queriesPosition1To10: 0,
    queriesPosition11To20: 0,
  });

  return {
    status: queries.length || pages.length ? 'observed-historical-export' : 'missing',
    exportDate: '2026-08-20',
    sourceDirectory: normalizeSlash(path.relative(root, historicalGscDir)),
    filters: filters,
    querySummary,
    topPagesSample: pages.slice(0, 10),
    devices,
    countries,
  };
}

function main() {
  const sitemap = parseSitemap();
  const sitemapUrlSet = new Set(sitemap.urls.map((row) => row.loc));
  const htmlAudit = auditHtmlPages(sitemapUrlSet);
  const historicalGsc = summarizeHistoricalGsc();
  const report = {
    generatedAt: new Date().toISOString(),
    origin,
    localRepositoryState: {
      sitemapUrlCount: sitemap.urls.length,
      sitemapParseable: sitemap.parseable,
      sitemapHasXhtmlNamespace: sitemap.hasXhtmlNamespace,
      sitemapAlternateCount: sitemap.alternates.length,
      htmlPageCount: htmlAudit.count,
      intendedCanonicalPages: htmlAudit.intendedCanonicalPages,
      noindexPages: htmlAudit.noindexPages,
      canonicalMismatches: htmlAudit.canonicalMismatches,
      missingFromSitemap: htmlAudit.missingFromSitemap,
    },
    historicalGsc,
    currentExternalEvidence: {
      googleSearchConsole: 'pending-access-unavailable',
      analytics: 'pending-access-unavailable',
      cruxOrFieldCwv: 'pending-access-unavailable',
      referringDomains: 'pending-access-unavailable',
      outreachOutcomes: 'pending-access-unavailable',
    },
  };

  const jsonFlagIndex = process.argv.indexOf('--json');
  if (jsonFlagIndex !== -1 && process.argv[jsonFlagIndex + 1]) {
    const outPath = path.resolve(root, process.argv[jsonFlagIndex + 1]);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
}

main();
