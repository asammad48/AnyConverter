#!/usr/bin/env node
/*
 * Language + SEO link check for the generated tool pages and hubs.
 *
 *   node tools/tool-pages/check-links.js
 *
 * Fails (exit 1) when a generated or registry page has:
 *   - an internal link to a page that does not exist,
 *   - a link into another language (e.g. /es/ page → English tool),
 *   - a canonical that is not its own absolute URL,
 *   - hreflang alternates that are missing, broken or not reciprocal,
 *   - invalid JSON-LD, or a URL missing from sitemap.xml.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { SITE, LANGS, HUBS, TOOLS, LEGACY } = require('./registry');

const ROOT = path.resolve(__dirname, '..', '..');
const errors = [];
const pfx = (l) => (l === 'en' ? '/' : '/' + l + '/');
const exists = (p) => fs.existsSync(path.join(ROOT, p.replace(/[?#].*$/, ''), p.endsWith('/') ? 'index.html' : ''));
const langOf = (p) => (p.startsWith('/es/') ? 'es' : p.startsWith('/da/') ? 'da' : 'en');
/* English-only pages that localized pages may link to on purpose. */
const EN_ONLY = new Set(Object.keys(LEGACY).filter((k) => LEGACY[k].enOnly).map((k) => '/' + k + '/'));

const pages = [];
TOOLS.forEach((t) => LANGS.forEach((l) => pages.push({ url: pfx(l) + t.slugs[l] + '/', lang: l, group: t.slugs })));
Object.values(HUBS).forEach((h) => LANGS.forEach((l) => pages.push({ url: pfx(l) + h.slugs[l] + '/', lang: l, group: h.slugs })));

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');

pages.forEach((pg) => {
  const file = path.join(ROOT, pg.url, 'index.html');
  if (!fs.existsSync(file)) { errors.push(pg.url + ': page missing'); return; }
  const html = fs.readFileSync(file, 'utf8');
  const err = (m) => errors.push(pg.url + ': ' + m);

  const lang = (html.match(/<html lang="([a-z]+)"/) || [])[1];
  if (lang !== pg.lang) err('html lang is ' + lang);

  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canon !== SITE + pg.url) err('canonical ' + canon);
  if (sitemap.indexOf('<loc>' + SITE + pg.url + '</loc>') < 0) err('not in sitemap.xml');

  /* hreflang: all three languages + x-default, each resolving to a page that links back. */
  const alts = {};
  html.replace(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)">/g, (m, hl, href) => { alts[hl] = href; });
  LANGS.concat('x-default').forEach((hl) => {
    const expect = SITE + pfx(hl === 'x-default' ? 'en' : hl) + pg.group[hl === 'x-default' ? 'en' : hl] + '/';
    if (alts[hl] !== expect) err('hreflang ' + hl + ' = ' + alts[hl] + ' (expected ' + expect + ')');
    else if (!exists(expect.replace(SITE, ''))) err('hreflang ' + hl + ' target missing');
    else {
      const back = fs.readFileSync(path.join(ROOT, expect.replace(SITE, ''), 'index.html'), 'utf8');
      if (back.indexOf('hreflang="' + pg.lang + '" href="' + SITE + pg.url + '"') < 0) err('hreflang ' + hl + ' is not reciprocal');
    }
  });

  /* JSON-LD must parse. */
  html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (m, j) => {
    try { JSON.parse(j); } catch (e) { err('invalid JSON-LD: ' + e.message); }
  });
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) err('expected exactly one <h1>');

  /* Body links: must exist and stay in the page language. */
  const body = html.slice(html.indexOf('<body'));
  body.replace(/href="(\/[^"]*)"/g, (m, href) => {
    if (href.startsWith('/assets/')) return;
    if (!exists(href)) { err('broken link ' + href); return; }
    const target = langOf(href);
    if (target !== pg.lang && !(target === 'en' && EN_ONLY.has(href))) err('cross-language link ' + href);
  });
});

if (errors.length) {
  errors.forEach((e) => process.stderr.write('FAIL ' + e + '\n'));
  process.stderr.write(errors.length + ' problem(s) in ' + pages.length + ' pages\n');
  process.exit(1);
}
process.stdout.write('OK: ' + pages.length + ' pages — links, language, canonical, hreflang, JSON-LD and sitemap\n');
