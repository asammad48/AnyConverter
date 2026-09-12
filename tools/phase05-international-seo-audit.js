#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const origin = 'https://anyconverter.io';
const locales = ['en', 'es', 'da'];
const expectedHreflang = ['en', 'es', 'da', 'x-default'];
const excludedDirs = new Set(['.git', '.vs', 'node_modules', 'output', 'attached_assets']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excludedDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
    } else if (entry.name === 'index.html') {
      out.push(path.relative(root, fullPath).replace(/\\/g, '/'));
    }
  }
  return out;
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function routeFromFile(file) {
  if (file === 'index.html') return '/';
  return `/${file.replace(/\/index\.html$/, '')}/`;
}

function localeForRoute(route) {
  if (route === '/es/' || route.startsWith('/es/')) return 'es';
  if (route === '/da/' || route.startsWith('/da/')) return 'da';
  return 'en';
}

function baseRoute(route) {
  if (route === '/es/' || route === '/da/') return '/';
  return route.replace(/^\/(es|da)\//, '/');
}

function localizedRoute(base, locale) {
  if (locale === 'en') return base;
  return base === '/' ? `/${locale}/` : `/${locale}${base}`;
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function text(html, regex) {
  const match = html.match(regex);
  return match ? match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function issue(list, type, data) {
  list.push(Object.assign({ type }, data));
}

function countByType(rows) {
  return rows.reduce((acc, row) => {
    acc[row.type] = (acc[row.type] || 0) + 1;
    return acc;
  }, {});
}

function parsePage(file) {
  const html = read(file);
  const route = routeFromFile(file);
  const linkTags = tags(html, 'link');
  const metaTags = tags(html, 'meta');
  const canonicalTag = linkTags.find((tag) => /\brel=["']canonical["']/i.test(tag));
  const alternateTags = linkTags.filter((tag) => /\brel=["']alternate["']/i.test(tag) && /\bhreflang=/i.test(tag));
  const robotsTag = metaTags.find((tag) => /\bname=["']robots["']/i.test(tag));
  const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];

  return {
    file,
    route,
    url: `${origin}${route}`,
    locale: localeForRoute(route),
    base: baseRoute(route),
    htmlLang: attr(htmlTag, 'lang'),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : '',
    robots: robotsTag ? attr(robotsTag, 'content') : '',
    title: text(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(metaTags.find((tag) => /\bname=["']description["']/i.test(tag)) || '', 'content'),
    h1: text(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
    hreflang: Object.fromEntries(alternateTags.map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')])),
    text: visibleText(html),
  };
}

function parseSitemap() {
  const xml = read('sitemap.xml');
  return [...xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].trim(),
    route: new URL(match[1].trim()).pathname,
    hreflang: Object.fromEntries(
      [...match[2].matchAll(/<xhtml:link[^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*\/>/g)]
        .map((linkMatch) => [linkMatch[1], linkMatch[2]])
    ),
  }));
}

function scanContent(page) {
  if (page.locale === 'en') return [];
  const findings = [];
  const copyPatterns = [
    { type: 'absolute-privacy-claim', re: /\b100%\s+(private|privado|privat|seguro|sikkert|sikker)\b/i },
    { type: 'absolute-privacy-claim', re: /\bnever\s+(leaves|sent|upload)/i },
    { type: 'absolute-privacy-claim', re: /\bnunca\s+(salen|sale|se env|abandonan|abandona)/i },
    { type: 'absolute-privacy-claim', re: /\b(forlader aldrig|sendes aldrig)\b/i },
    { type: 'unsupported-visibility-claim', re: /\b(no podemos ver|kan ikke se|cannot see)\b/i },
    { type: 'unreviewed-sensitive-copy', re: /\b(completely secure|completamente seguros?|fuldstændig sikre?|sensitive|confidencial|fortroligt)\b/i },
  ];
  const englishUiLabels = [
    'Options',
    'Related Tools',
    'Advertisement',
    'Stats',
    'Auto-format on paste',
    'Collapse all on load',
    'Show line numbers',
    'Wrap long lines',
    'Sort keys',
  ];

  for (const pattern of copyPatterns) {
    if (pattern.re.test(page.text)) issue(findings, pattern.type, { route: page.route, file: page.file });
  }

  for (const label of englishUiLabels) {
    if (page.text.includes(label)) issue(findings, 'english-shared-ui-label', { route: page.route, file: page.file, label });
  }

  return findings;
}

function main() {
  const files = walk(root).sort();
  const pages = files.map(parsePage);
  const byRoute = new Map(pages.map((page) => [page.route, page]));
  const clusters = new Map();
  const technicalIssues = [];
  const sitemapIssues = [];
  const contentFindings = [];

  for (const page of pages) {
    if (!clusters.has(page.base)) clusters.set(page.base, {});
    clusters.get(page.base)[page.locale] = page;
  }

  for (const page of pages) {
    const expectedCanonical = `${origin}${page.route}`;
    if (page.canonical !== expectedCanonical) {
      issue(technicalIssues, 'canonical-mismatch', {
        route: page.route,
        file: page.file,
        found: page.canonical || '(missing)',
        expected: expectedCanonical,
      });
    }

    if (page.htmlLang !== page.locale) {
      issue(technicalIssues, 'html-lang-mismatch', {
        route: page.route,
        file: page.file,
        found: page.htmlLang || '(missing)',
        expected: page.locale,
      });
    }

    if (/noindex/i.test(page.robots)) {
      issue(technicalIssues, 'noindex-present', { route: page.route, file: page.file, robots: page.robots });
    }

    const cluster = clusters.get(page.base);
    for (const lang of expectedHreflang) {
      const targetLocale = lang === 'x-default' ? 'en' : lang;
      if (!cluster[targetLocale]) continue;
      const expectedHref = `${origin}${localizedRoute(page.base, targetLocale)}`;
      if (page.hreflang[lang] !== expectedHref) {
        issue(technicalIssues, 'html-hreflang-mismatch', {
          route: page.route,
          file: page.file,
          lang,
          found: page.hreflang[lang] || '(missing)',
          expected: expectedHref,
        });
      }
    }

    for (const [lang, href] of Object.entries(page.hreflang)) {
      let targetRoute = '';
      try {
        targetRoute = new URL(href).pathname;
      } catch (error) {
        issue(technicalIssues, 'html-hreflang-invalid-url', { route: page.route, file: page.file, lang, href });
        continue;
      }
      if (!byRoute.has(targetRoute)) {
        issue(technicalIssues, 'html-hreflang-target-missing', { route: page.route, file: page.file, lang, href });
      }
    }

    contentFindings.push(...scanContent(page));
  }

  const sitemapEntries = parseSitemap();
  const sitemapByRoute = new Map(sitemapEntries.map((entry) => [entry.route, entry]));
  for (const page of pages) {
    if (!sitemapByRoute.has(page.route)) {
      issue(sitemapIssues, 'page-missing-from-sitemap', { route: page.route, file: page.file });
    }
  }

  for (const entry of sitemapEntries) {
    if (!byRoute.has(entry.route)) {
      issue(sitemapIssues, 'sitemap-loc-no-local-page', { route: entry.route, loc: entry.loc });
    }

    const base = baseRoute(entry.route);
    const cluster = clusters.get(base) || {};
    for (const lang of expectedHreflang) {
      const targetLocale = lang === 'x-default' ? 'en' : lang;
      if (!cluster[targetLocale]) continue;
      const expectedHref = `${origin}${localizedRoute(base, targetLocale)}`;
      if (entry.hreflang[lang] !== expectedHref) {
        issue(sitemapIssues, 'sitemap-hreflang-mismatch', {
          route: entry.route,
          lang,
          found: entry.hreflang[lang] || '(missing)',
          expected: expectedHref,
        });
      }
    }

    for (const [lang, href] of Object.entries(entry.hreflang)) {
      let targetRoute = '';
      try {
        targetRoute = new URL(href).pathname;
      } catch (error) {
        issue(sitemapIssues, 'sitemap-hreflang-invalid-url', { route: entry.route, lang, href });
        continue;
      }
      if (!byRoute.has(targetRoute)) {
        issue(sitemapIssues, 'sitemap-hreflang-target-missing', { route: entry.route, lang, href });
      }
    }
  }

  const coverage = [...clusters.entries()].map(([base, cluster]) => ({
    base,
    en: Boolean(cluster.en),
    es: Boolean(cluster.es),
    da: Boolean(cluster.da),
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    origin,
    counts: {
      pages: pages.length,
      clusters: clusters.size,
      sitemapUrls: sitemapEntries.length,
      byLocale: locales.reduce((acc, locale) => {
        acc[locale] = pages.filter((page) => page.locale === locale).length;
        return acc;
      }, {}),
      completeEnEsDaClusters: coverage.filter((row) => row.en && row.es && row.da).length,
      enOnlyClusters: coverage.filter((row) => row.en && !row.es && !row.da).length,
    },
    missingLocaleClusters: coverage.filter((row) => row.en && (!row.es || !row.da)),
    technicalIssues,
    technicalIssueCounts: countByType(technicalIssues),
    sitemapIssues,
    sitemapIssueCounts: countByType(sitemapIssues),
    contentFindings,
    contentFindingCounts: countByType(contentFindings),
    status: technicalIssues.length || sitemapIssues.length ? 'fail' : 'pass',
  };

  const outputFlagIndex = process.argv.indexOf('--json');
  if (outputFlagIndex !== -1 && process.argv[outputFlagIndex + 1]) {
    fs.writeFileSync(path.join(root, process.argv[outputFlagIndex + 1]), `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.status === 'pass' ? 0 : 1;
}

main();
