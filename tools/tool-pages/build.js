#!/usr/bin/env node
/*
 * AnyConverter tool-page generator (dev-time only, output is static HTML).
 *
 *   node tools/tool-pages/build.js          # write pages, hubs, sitemap + slug map
 *   node tools/tool-pages/build.js --check  # only report SEO length warnings
 *
 * Layout + tool component + localized content/config: every page shares the
 * same template from this file, while H1, intro, how-to, explanations, FAQ,
 * metadata and schema come from each tool's own localized content module.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { SITE, LANGS, HUBS, TOOLS, LEGACY } = require('./registry');
const UI = require('./lib/ui');
const HUB_CONTENT = require('./content/hubs');

const ROOT = path.resolve(__dirname, '..', '..');
const ASSET_V = '20261008';
const CSS_HREF = '/assets/css/style.css?v=' + ASSET_V;
const SHARED_JS = '/assets/js/shared.js?v=20261008-slugs';
const CHECK_ONLY = process.argv.includes('--check');

const warnings = [];
const written = [];

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

function pathFor(slug, lang) { return (lang === 'en' ? '/' : '/' + lang + '/') + slug + '/'; }
function toolById(id) { return TOOLS.find((t) => t.id === id); }

const contentCache = {};
function content(id) {
  if (!contentCache[id]) {
    let mod;
    try { mod = require('./content/' + id); } catch (e) {
      if (!process.env.ONLY) throw e; // partial builds: fall back to a placeholder card
      mod = { seo: { en: { name: id, card: id }, es: { name: id, card: id }, da: { name: id, card: id } } };
    }
    if (mod.seo) {
      LANGS.forEach((l) => {
        const s = mod.seo[l];
        if (s && s.explainH && !s.sections) {
          s.sections = [{ h: s.explainH, p: s.explain.map(esc) }];
          s.faq = s.faq.map(([q, a]) => [q, esc(a)]);
        }
      });
    }
    contentCache[id] = mod;
  }
  return contentCache[id];
}

/* Names/blurbs of hand-built pages, read from the pages themselves. */
const legacyCache = {};
function readPage(rel) {
  const f = path.join(ROOT, rel, 'index.html');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
}
function legacyInfo(slug, lang) {
  const key = slug + ':' + lang;
  if (legacyCache[key]) return legacyCache[key];
  const prefix = lang === 'en' ? '' : lang + '/';
  const page = readPage(prefix + slug);
  if (!page) throw new Error('Missing legacy page ' + prefix + slug);
  let name = (page.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
  let blurb = null;
  const home = readPage(lang === 'en' ? '.' : lang);
  const cardRe = new RegExp('href="' + pathFor(slug, lang).replace(/\//g, '\\/') + '" class="tool-card">[\\s\\S]*?<h3>([^<]+)</h3>\\s*<p>([^<]+)</p>');
  const m = home && home.match(cardRe);
  if (m) { name = name || m[1]; blurb = m[2]; }
  if (!blurb) {
    const d = (page.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
    blurb = d.split(/(?<=[.!?])\s/)[0];
  }
  legacyCache[key] = { name: stripTags(name || slug), card: stripTags(blurb), url: pathFor(slug, lang) };
  return legacyCache[key];
}

/* Unified card info: generated tool, existing tool or legacy page. */
function cardInfo(ref, lang) {
  const id = ref.replace(/^~/, '');
  const t = toolById(id);
  if (t && !t.existing) {
    const s = content(id).seo[lang];
    return { id, name: s.name, card: s.card, url: pathFor(t.slugs[lang], lang) };
  }
  if (t && t.existing) {
    const c = (HUB_CONTENT.existingCards[id] || {})[lang];
    const info = legacyInfo(t.slugs[lang], lang);
    return Object.assign({ id }, info, c || {});
  }
  if (LEGACY[id]) {
    if (LEGACY[id].enOnly && lang !== 'en') return null;
    return Object.assign({ id }, legacyInfo(id, lang));
  }
  throw new Error('Unknown tool reference ' + ref);
}

/* [[tool-id|anchor]] and [[hub:calc|anchor]] → localized links */
function links(html, lang) {
  return String(html).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (m, ref, anchor) => {
    let url;
    if (ref.indexOf('hub:') === 0) url = pathFor(HUBS[ref.slice(4)].slugs[lang], lang);
    else { const c = cardInfo(ref, lang); if (!c) return anchor; url = c.url; }
    return '<a href="' + url + '">' + anchor + '</a>';
  });
}

/* ---------- shared fragments ---------- */
function headCommon(o) {
  const alt = LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${SITE}${o.urls[l]}">`).join('\n');
  return `<!DOCTYPE html>
<html lang="${o.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.desc)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}${o.urls[o.lang]}">
${alt}
  <link rel="alternate" hreflang="x-default" href="${SITE}${o.urls.en}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.desc)}">
  <meta property="og:url" content="${SITE}${o.urls[o.lang]}">
  <meta property="og:site_name" content="AnyConverter">
  <meta property="og:locale" content="${UI[o.lang].locale}">
  <meta property="og:image" content="${SITE}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="AnyConverter free online tools">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(o.title)}">
  <meta name="twitter:description" content="${esc(o.desc)}">
  <meta name="twitter:image" content="${SITE}/assets/img/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(o.schema).replace(/</g, '\\u003c')}</script>
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{font-family:'Inter',system-ui,sans-serif;background:var(--color-bg,#F7F6F3);color:var(--color-text,#151515)}
    body{min-height:100vh;display:flex;flex-direction:column}
    .site-header{position:sticky;top:0;z-index:100;height:56px;background:var(--color-surface,#fff);border-bottom:1px solid var(--color-border,#DDD8D0)}
    .header-inner{max-width:1280px;width:100%;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:32px}
    .hero{padding:40px 24px 32px;max-width:1280px;margin:0 auto}
    .hero h1{font-size:clamp(1.75rem,4vw,2.25rem);font-weight:700;line-height:1.2;margin-bottom:12px}
    .hero-desc{font-size:1.0625rem;color:var(--color-text-2,#6B7280);max-width:680px;line-height:1.6}
    @font-face{font-family:'Inter';font-display:swap}
  </style>
  <link rel="stylesheet" href="${CSS_HREF}">
</head>
<body>
  <header id="site-header" class="site-header"></header>
  <main id="main-content">`;
}

function breadcrumbHtml(lang, trail) {
  const items = trail.map((c, i) => (i === trail.length - 1
    ? `<li aria-current="page">${esc(c.name)}</li>`
    : `<li><a href="${c.url}">${esc(c.name)}</a></li>`)).join('');
  return `    <nav class="breadcrumb" aria-label="${UI[lang].breadcrumb}">
      <ol>${items}</ol>
    </nav>`;
}
function breadcrumbSchema(trail) {
  return { '@type': 'BreadcrumbList', itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.url })) };
}
function faqSchema(faq) {
  return { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: stripTags(q), acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } })) };
}

function cardHtml(c, lang) {
  return `        <a href="${c.url}" class="tool-card">
          <img src="/assets/img/icon-calculator.svg" alt="" class="tool-card-icon" width="40" height="40" loading="lazy">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.card)}</p>
          <span class="tool-card-link">${UI[lang].useTool}</span>
        </a>`;
}

function adSlot(kind, lang) {
  // AdSense: replace ca-pub-XXXXXXXXXX and data-ad-slot values when the account is approved.
  if (kind === 'side') {
    return `      <aside class="tool-side" aria-label="${UI[lang].ad}">
        <div style="margin-top:0">
          <p class="ad-label">${UI[lang].ad}</p>
          <div class="ad-slot" style="min-height:250px">
            <!-- AdSense slot 1 (300x600 sticky): add data-ad-client="ca-pub-XXXXXXXXXX" + data-ad-slot when approved -->
            <div class="adsbygoogle" style="display:block" aria-hidden="true"></div>
          </div>
        </div>
      </aside>`;
  }
  if (kind === 'leader') {
    return `    <div class="ad-slot ad-slot--leaderboard">
      <!-- AdSense slot 2 (728x90 responsive): add data-ad-client="ca-pub-XXXXXXXXXX" + data-ad-slot when approved -->
      <div class="adsbygoogle" style="display:block" aria-hidden="true"></div>
    </div>`;
  }
  return `    <div class="ad-slot ad-slot--rectangle" style="margin:0 auto 32px">
      <!-- AdSense slot 3 (336x280): add data-ad-client="ca-pub-XXXXXXXXXX" + data-ad-slot when approved -->
      <div class="adsbygoogle" style="display:block" aria-hidden="true"></div>
    </div>`;
}

function sectionsHtml(sections, lang) {
  return sections.map((s) => {
    let out = `      <h2>${esc(s.h)}</h2>\n`;
    (s.p || []).forEach((p) => { out += `      <p>${links(p, lang)}</p>\n`; });
    if (s.ul) out += '      <ul>\n' + s.ul.map((li) => `        <li>${links(li, lang)}</li>`).join('\n') + '\n      </ul>\n';
    if (s.table) {
      out += '      <div class="calc-table-wrap"><table class="calc-table">\n        <thead><tr>' + s.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('') + '</tr></thead>\n        <tbody>\n'
        + s.table.rows.map((r) => '          <tr>' + r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('') + '</tr>').join('\n')
        + '\n        </tbody>\n      </table></div>\n';
    }
    (s.after || []).forEach((p) => { out += `      <p>${links(p, lang)}</p>\n`; });
    return out;
  }).join('');
}

function faqHtml(faq, lang) {
  return `    <section class="faq">
      <h2>${UI[lang].faq}</h2>
      <div class="faq-list">
${faq.map(([q, a]) => `        <details class="faq-item">
          <summary class="faq-question">${esc(stripTags(q))} <span class="faq-icon">+</span></summary>
          <div class="faq-answer">${links(a, lang)}</div>
        </details>`).join('\n')}
      </div>
    </section>`;
}

function pageEnd(scripts, i18n, lang) {
  const json = i18n ? `\n  <script type="application/json" id="tool-i18n">${JSON.stringify(i18n).replace(/</g, '\\u003c')}</script>` : '';
  return `  </main>
  <footer id="site-footer" class="site-footer"></footer>${json}
  <script src="${SHARED_JS}" defer></script>
${scripts.map((s) => `  <script src="${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

function checkLengths(kind, id, lang, title, desc) {
  if (desc.length < 140 || desc.length > 160) warnings.push(`${kind} ${id} [${lang}] description ${desc.length} chars`);
  if (title.length > 70) warnings.push(`${kind} ${id} [${lang}] title ${title.length} chars`);
}

/* ---------- tool page ---------- */
function toolPage(t, lang) {
  const mod = content(t.id);
  const s = mod.seo[lang];
  const ui = UI[lang];
  const hub = HUBS[t.hub];
  const hubC = HUB_CONTENT.hubs[t.hub][lang];
  const urls = {}; LANGS.forEach((l) => { urls[l] = pathFor(t.slugs[l], l); });
  const title = s.title || `${s.name} ${ui.titleSuffix}`;
  checkLengths('tool', t.id, lang, title, s.desc);

  const trail = [
    { name: ui.home, url: lang === 'en' ? '/' : '/' + lang + '/' },
    { name: hubC.crumb, url: pathFor(hub.slugs[lang], lang) },
    { name: s.name, url: urls[lang] }
  ];
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebApplication', name: s.name, url: SITE + urls[lang], description: s.desc,
      applicationCategory: t.appCat || 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
      inLanguage: lang, isAccessibleForFree: true, featureList: s.feats.map((f) => stripTags(f[0])),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: 'AnyConverter', url: SITE } },
    breadcrumbSchema(trail),
    faqSchema(s.faq)
  ] };

  const related = t.related.map((r) => cardInfo(r, lang)).filter(Boolean);
  const scripts = ['/assets/js/tools/calc-kit.js?v=' + ASSET_V]
    .concat((t.deps || []).map((d) => '/assets/js/tools/' + d.replace(/^\.\.\/vendor\//, '../vendor/') + (d.indexOf('vendor') > -1 ? '' : '?v=' + ASSET_V)))
    .concat(['/assets/js/tools/' + t.script + '?v=' + ASSET_V])
    .map((p) => p.replace('/assets/js/tools/../vendor/', '/assets/js/vendor/'));

  const note = t.fun ? `\n      <p class="hero-note" role="note">${esc(s.note || ui.funNote)}</p>` : '';
  const i18n = Object.assign({ lang, tool: t.id }, mod.i18n ? mod.i18n[lang] : {});

  return headCommon({ lang, title, desc: s.desc, urls, schema }) + '\n'
    + breadcrumbHtml(lang, trail) + `
    <section class="hero">
      <h1>${esc(s.h1)}</h1>
      <p class="hero-desc">${esc(s.lede)}</p>${note}
    </section>

    <div class="tool-wrapper">
      <div class="tool-zone">
        <div class="calc" id="calc-root" data-tool="${t.id}">
${mod.tool(mod.i18n ? mod.i18n[lang] : {}, lang, { pathFor, cardInfo, esc }).trim().split('\n').map((l) => '          ' + l).join('\n')}
        </div>
      </div>
${adSlot('side', lang)}
    </div>

${adSlot('leader', lang)}

    <section class="how-to-use">
      <h2>${esc(s.howH)}</h2>
      <ol class="steps">
${s.how.map(([h, d]) => `        <li><span><strong>${esc(h)}.</strong> ${esc(d)}</span></li>`).join('\n')}
      </ol>
    </section>

    <section class="features">
      <h2>${esc(s.featH || ui.features)}</h2>
      <ul class="features-list">
${s.feats.map(([h, d]) => `        <li><span><strong>${esc(h)}</strong> — ${esc(d)}</span></li>`).join('\n')}
      </ul>
    </section>

    <section class="seo-content">
${sectionsHtml(s.sections, lang)}      <p>${ui.moreIn.replace('{hub}', `<a href="${pathFor(hub.slugs[lang], lang)}">${esc(hubC.name)}</a>`)}.</p>
    </section>

${adSlot('rect', lang)}

${faqHtml(s.faq, lang)}

    <section class="related-tools">
      <h2>${ui.related}</h2>
      <div class="tool-grid">
${related.map((c) => cardHtml(c, lang)).join('\n')}
      </div>
    </section>
` + pageEnd(scripts, i18n, lang);
}

/* ---------- hub page ---------- */
function hubPage(key, lang) {
  const hub = HUBS[key];
  const h = HUB_CONTENT.hubs[key][lang];
  const ui = UI[lang];
  const urls = {}; LANGS.forEach((l) => { urls[l] = pathFor(hub.slugs[l], l); });
  const title = h.title;
  checkLengths('hub', key, lang, title, h.desc);
  const trail = [{ name: ui.home, url: lang === 'en' ? '/' : '/' + lang + '/' }, { name: h.crumb, url: urls[lang] }];
  const allCards = [];
  const groups = h.groups.map((g) => {
    const cards = g.items.map((r) => cardInfo(r, lang)).filter(Boolean);
    cards.forEach((c) => allCards.push(c));
    return `    <section class="related-tools">
      <h2>${esc(g.h)}</h2>${g.p ? `\n      <p class="hub-group-intro">${links(g.p, lang)}</p>` : ''}
      <div class="tool-grid">
${cards.map((c) => cardHtml(c, lang)).join('\n')}
      </div>
    </section>`;
  }).join('\n\n');
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: h.h1, url: SITE + urls[lang], description: h.desc, inLanguage: lang,
      publisher: { '@type': 'Organization', name: 'AnyConverter', url: SITE },
      mainEntity: { '@type': 'ItemList', itemListElement: allCards.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: SITE + c.url })) } },
    breadcrumbSchema(trail)
  ].concat(h.faq ? [faqSchema(h.faq)] : []) };

  return headCommon({ lang, title, desc: h.desc, urls, schema }) + '\n'
    + breadcrumbHtml(lang, trail) + `
    <section class="hero">
      <h1>${esc(h.h1)}</h1>
      <p class="hero-desc">${links(h.intro, lang)}</p>${h.note ? `\n      <p class="hero-note" role="note">${esc(h.note)}</p>` : ''}
    </section>

${groups}

    <section class="seo-content">
${sectionsHtml(h.sections, lang)}    </section>
${h.faq ? '\n' + faqHtml(h.faq, lang) + '\n' : ''}` + pageEnd([], null, lang);
}

/* ---------- sitemap + slug map ---------- */
function sitemapBlock() {
  const today = new Date().toISOString().slice(0, 10);
  const entry = (urls, prio) => LANGS.map((l) => `  <url>
    <loc>${SITE}${urls[l]}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${prio}</priority>
${LANGS.map((x) => `    <xhtml:link rel="alternate" hreflang="${x}" href="${SITE}${urls[x]}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${urls.en}"/>
  </url>`).join('\n\n');
  const blocks = [];
  Object.keys(HUBS).forEach((k) => { const u = {}; LANGS.forEach((l) => { u[l] = pathFor(HUBS[k].slugs[l], l); }); blocks.push(entry(u, '0.9')); });
  TOOLS.filter((t) => !t.existing).forEach((t) => { const u = {}; LANGS.forEach((l) => { u[l] = pathFor(t.slugs[l], l); }); blocks.push(entry(u, '0.8')); });
  return blocks.join('\n\n');
}

function slugMap() {
  const map = {};
  Object.keys(HUBS).forEach((k) => { const s = HUBS[k].slugs; map['/' + s.en + '/'] = { es: '/es/' + s.es + '/', da: '/da/' + s.da + '/' }; });
  TOOLS.filter((t) => t.slugs.es !== t.slugs.en || t.slugs.da !== t.slugs.en).forEach((t) => {
    map['/' + t.slugs.en + '/'] = { es: '/es/' + t.slugs.es + '/', da: '/da/' + t.slugs.da + '/' };
  });
  return map;
}

function replaceBlock(file, begin, end, body) {
  const src = fs.readFileSync(file, 'utf8');
  const a = src.indexOf(begin), b = src.indexOf(end);
  if (a < 0 || b < 0) throw new Error('Markers not found in ' + file + ': ' + begin);
  const next = src.slice(0, a + begin.length) + '\n' + body + '\n' + src.slice(b);
  if (next !== src) fs.writeFileSync(file, next);
}

function write(rel, html) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  written.push(rel);
}

/* ---------- run ---------- */
function main() {
  const pages = [];
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
  TOOLS.filter((t) => !t.existing && (!only || only.includes(t.id))).forEach((t) => {
    LANGS.forEach((l) => pages.push([path.join(l === 'en' ? '' : l, t.slugs[l], 'index.html'), toolPage(t, l)]));
  });
  Object.keys(HUBS).filter(() => !only).forEach((k) => {
    LANGS.forEach((l) => pages.push([path.join(l === 'en' ? '' : l, HUBS[k].slugs[l], 'index.html'), hubPage(k, l)]));
  });

  if (!CHECK_ONLY) {
    pages.forEach(([rel, html]) => write(rel, html));
    if (only) return;
    replaceBlock(path.join(ROOT, 'sitemap.xml'), '<!-- BEGIN generated: tool-pages -->', '  <!-- END generated: tool-pages -->', sitemapBlock());
    const map = JSON.stringify(slugMap(), null, 2).split('\n').map((l, i) => (i ? '  ' + l : l)).join('\n');
    replaceBlock(path.join(ROOT, 'assets/js/shared.js'), '  /* BEGIN generated: localized slugs (tools/tool-pages/build.js) */',
      '  /* END generated: localized slugs */', '  var LOCALIZED_SLUGS = ' + map + ';');
  }
  warnings.forEach((w) => process.stderr.write('WARN ' + w + '\n'));
  process.stdout.write((CHECK_ONLY ? 'Checked ' : 'Wrote ') + pages.length + ' pages' + (warnings.length ? ', ' + warnings.length + ' warnings' : '') + '\n');
}

main();
