#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const origin = 'https://anyconverter.io';
const priorityPaths = [
  '/',
  '/pdf-merge/',
  '/pdf-compress/',
  '/image-converter/',
  '/json-formatter/',
  '/word-counter/',
  '/typing-speed-test/',
];

const failures = [];
const warnings = [];
const pages = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function pageFile(urlPath) {
  if (urlPath === '/') return 'index.html';
  return path.join(urlPath.replace(/^\/|\/$/g, ''), 'index.html');
}

function localFileForHref(href) {
  let clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return 'index.html';
  if (/^\/assets\//.test(clean)) return clean.replace(/^\//, '');
  if (/\.[a-z0-9]+$/i.test(clean)) return clean.replace(/^\//, '');
  return pageFile(clean.endsWith('/') ? clean : `${clean}/`);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? match[1] : '';
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
}

function canonicalFor(urlPath) {
  return `${origin}${urlPath}`;
}

const robots = exists('robots.txt') ? read('robots.txt') : '';
if (!robots) failures.push('robots.txt is missing.');
if (robots && !/Sitemap:\s*https:\/\/anyconverter\.io\/sitemap\.xml/i.test(robots)) {
  failures.push('robots.txt does not declare the production sitemap URL.');
}
if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) {
  failures.push('robots.txt contains a site-wide Disallow: / rule.');
}

const headers = exists('_headers') ? read('_headers') : '';
if (!/\/sitemap\.xml[\s\S]*?Cache-Control:/m.test(headers)) {
  warnings.push('_headers does not define a cache rule for /sitemap.xml.');
}

const sitemap = exists('sitemap.xml') ? read('sitemap.xml') : '';
if (!sitemap) failures.push('sitemap.xml is missing.');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));

for (const urlPath of priorityPaths) {
  const file = pageFile(urlPath);
  const pageResult = { path: urlPath, file, checks: [] };
  pages.push(pageResult);

  if (!exists(file)) {
    failures.push(`${urlPath}: missing local file ${file}.`);
    continue;
  }

  const html = read(file);
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
  const desc = (html.match(/<meta\s+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || [])[1] || '';
  const canonicalTag = tags(html, 'link').find((tag) => /\brel=["']canonical["']/i.test(tag));
  const canonical = canonicalTag ? attr(canonicalTag, 'href') : '';
  const expectedCanonical = canonicalFor(urlPath);
  const robotsMeta = tags(html, 'meta').find((tag) => /\bname=["']robots["']/i.test(tag));

  if (!title) failures.push(`${urlPath}: missing <title>.`);
  if (!desc) failures.push(`${urlPath}: missing meta description.`);
  if (canonical !== expectedCanonical) {
    failures.push(`${urlPath}: canonical is ${canonical || '(missing)'}, expected ${expectedCanonical}.`);
  }
  if (!sitemapUrls.has(expectedCanonical)) {
    failures.push(`${urlPath}: canonical URL missing from sitemap.xml.`);
  }
  if (robotsMeta && /noindex/i.test(attr(robotsMeta, 'content'))) {
    failures.push(`${urlPath}: robots meta contains noindex.`);
  }

  const alternates = tags(html, 'link').filter((tag) => /\brel=["']alternate["']/i.test(tag));
  const hreflangs = new Map(alternates.map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')]));
  for (const lang of ['en', 'es', 'da', 'x-default']) {
    if (!hreflangs.has(lang)) {
      failures.push(`${urlPath}: missing hreflang ${lang}.`);
      continue;
    }
    const href = hreflangs.get(lang);
    if (!sitemapUrls.has(href)) {
      warnings.push(`${urlPath}: hreflang ${lang} target is not in sitemap.xml (${href}).`);
    }
    if (href.startsWith(origin)) {
      const targetPath = new URL(href).pathname;
      const targetFile = pageFile(targetPath);
      if (!exists(targetFile)) warnings.push(`${urlPath}: hreflang ${lang} local target missing (${targetFile}).`);
    }
  }

  for (const [index, body] of extractJsonLd(html).entries()) {
    try {
      JSON.parse(body);
    } catch (error) {
      failures.push(`${urlPath}: JSON-LD block ${index + 1} is invalid JSON (${error.message}).`);
    }
  }

  for (const scriptTag of tags(html, 'script')) {
    const src = attr(scriptTag, 'src');
    if (src && !/\b(defer|async)\b/i.test(scriptTag)) {
      failures.push(`${urlPath}: script ${src} is missing defer or async.`);
    }
  }

  for (const imgTag of tags(html, 'img')) {
    const src = attr(imgTag, 'src');
    if (src && (!/\bwidth\s*=/.test(imgTag) || !/\bheight\s*=/.test(imgTag))) {
      warnings.push(`${urlPath}: image ${src} is missing explicit width or height.`);
    }
  }

  const localLinks = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((href) => href.startsWith('/'))
    .filter((href) => !href.startsWith('/assets/'))
    .filter((href) => !/\.(css|js|svg|png|jpg|jpeg|webp|ico|xml|txt)$/i.test(href));

  for (const href of localLinks) {
    const target = localFileForHref(href);
    if (!exists(target)) warnings.push(`${urlPath}: local link target missing for ${href} (${target}).`);
  }

  pageResult.checks.push('title', 'meta-description', 'canonical', 'sitemap', 'hreflang', 'json-ld', 'script-loading', 'local-links');
}

const report = {
  generatedAt: new Date().toISOString(),
  origin,
  priorityPaths,
  pages,
  failures,
  warnings,
  status: failures.length ? 'fail' : 'pass',
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = failures.length ? 1 : 0;
