#!/usr/bin/env node
/*
 * PDF tool pages from the "AnyConverter tool page system" designs.
 *
 *   node tools/pdf-pages/build.js import <dir-with-.dc.html-files>   # copy design sources into tools/pdf-pages/source
 *   node tools/pdf-pages/build.js                                    # generate pages + tool scripts
 *
 * Each page keeps the site header, footer and related-tools block, and replaces everything in between
 * with the design: hero (breadcrumb, H1, intro, badges), the working tool, how-to, features, comparison,
 * explanation and FAQ. Copy is pre-rendered to static HTML; assets/js/tools/dc-runtime.js then runs the
 * design's own tool logic (pdf-lib / pdf.js / JSZip) in the browser.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const RT = require('../../assets/js/tools/dc-runtime.js');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(__dirname, 'source');
const SITE = 'https://anyconverter.io';
const LANGS = ['en', 'es', 'da'];
const V = '20261012';

/* design number → site slug (same English slug in every language) */
const TOOLS = {
  10: { slug: 'pdf-to-word', file: 'PDF to Word', isNew: true },
  21: { slug: 'pdf-merge', file: 'Merge PDF' },
  22: { slug: 'pdf-split', file: 'Split PDF' },
  23: { slug: 'pdf-compress', file: 'Compress PDF' },
  24: { slug: 'pdf-to-jpg', file: 'PDF to JPG' },
  25: { slug: 'organize-pdf', file: 'Organize PDF' },
  26: { slug: 'remove-pdf-pages', file: 'Remove PDF Pages' },
  27: { slug: 'extract-pdf-pages', file: 'Extract PDF Pages' },
  28: { slug: 'rotate-pdf', file: 'Rotate PDF' },
  29: { slug: 'jpg-to-pdf', file: 'JPG to PDF' },
  30: { slug: 'add-page-numbers', file: 'Add Page Numbers' }
};
/* other designs that the copy links to, mapped to existing site pages */
const OTHER = { 1: 'image-converter', 2: 'image-converter', 3: 'image-converter', 5: 'csv-to-sql', 6: 'image-compressor', 8: 'image-converter' };
const pfx = (l) => (l === 'en' ? '/' : '/' + l + '/');
const url = (slug, l) => pfx(l) + slug + '/';

/* ---------------- import ---------------- */
function extractTemplate(s) {
  const a = s.indexOf('</header>'), b = s.indexOf('</main>');
  let body = s.slice(a + '</header>'.length, b);
  body = body.replace(/^\s*/, '');
  // hero <div …> … </div> then <main …>
  const mainOpen = body.indexOf('<main');
  const hero = body.slice(0, mainOpen).trim();
  let main = body.slice(body.indexOf('>', mainOpen) + 1);
  // drop the design's related-tools section and the "Updated …" line
  main = main.replace(/<section [^>]*><h2 [^>]*>[^<]*<\/h2><div [^>]*>(?:<a [^>]*onClick="\{\{ onRel \}\}"[\s\S]*?<\/a>)+<\/div><\/section>\s*/, '');
  main = main.replace(/<p style="margin:0;font-size:13px;color:#5f564f">[^<]*<\/p>(\s*<\/div>\s*)$/, '$1');
  const mainTag = body.slice(mainOpen, body.indexOf('>', mainOpen) + 1).replace('<main', '<div');
  const toast = (s.match(/<sc-if value="\{\{ toastOn \}\}"[\s\S]*?<\/sc-if>/) || [''])[0];
  return hero + '\n' + mainTag + main.trim() + '\n</div>\n' + toast;
}
function extractHead(s) {
  const h = s.slice(s.indexOf('<helmet>'), s.indexOf('</helmet>'));
  const get = (re) => (h.match(re) || [])[1];
  return {
    title: get(/<title>([\s\S]*?)<\/title>/),
    desc: get(/<meta name="description" content="([^"]*)"/),
    ld: JSON.parse(get(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/))
  };
}
function extractScript(s) {
  const t = s.slice(s.indexOf('data-dc-script>') + 'data-dc-script>'.length, s.lastIndexOf('</script>'));
  const ci = t.indexOf('class Component');
  const consts = t.slice(0, ci).trim();
  let cls = t.slice(ci).trim();
  const T = (cls.match(/\n {2}T = (\{.*\});\n/) || [])[1];
  const LOC = (cls.match(/\n {2}LOC = '([^']+)';\n/) || [])[1];
  cls = cls.replace(/\n {2}T = \{.*\};\n/, '\n  T = DCI.T;\n').replace(/\n {2}LOC = '[^']+';\n/, '\n  LOC = DCI.LOC;\n');
  return { consts, cls, T, LOC };
}
function doImport(dir) {
  Object.keys(TOOLS).forEach((n) => {
    const t = TOOLS[n], out = path.join(SRC, t.slug);
    fs.mkdirSync(out, { recursive: true });
    let cls0 = null;
    LANGS.forEach((l) => {
      const f = path.join(dir, n.padStart(2, '0') + ' ' + t.file + (l === 'en' ? '' : ' ' + l.toUpperCase()) + '.dc.html');
      const s = fs.readFileSync(f, 'utf8');
      fs.writeFileSync(path.join(out, l + '.template.html'), extractTemplate(s) + '\n');
      fs.writeFileSync(path.join(out, l + '.head.json'), JSON.stringify(extractHead(s), null, 1) + '\n');
      const sc = extractScript(s);
      if (cls0 && cls0 !== sc.cls) throw new Error('logic differs between languages for ' + t.slug);
      cls0 = sc.cls;
      fs.writeFileSync(path.join(out, l + '.consts.js'), sc.consts + '\nconst T = ' + sc.T + ';\nconst LOC = ' + JSON.stringify(sc.LOC) + ';\n');
    });
    fs.writeFileSync(path.join(out, 'logic.js'), cls0 + '\n');
  });
  process.stdout.write('imported ' + Object.keys(TOOLS).length + ' tools\n');
}

/* ---------------- build ---------------- */
const read = (f) => fs.readFileSync(f, 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

function toolScript(slug) {
  const dir = path.join(SRC, slug);
  const names = new Set();
  const langFns = LANGS.map((l) => {
    const c = read(path.join(dir, l + '.consts.js'));
    (c.match(/^const ([A-Za-z_$][\w$]*) =/gm) || []).forEach((m) => names.add(m.slice(6, -2)));
    return '    ' + l + ': function () {\n' + c.split('\n').map((x) => '      ' + x).join('\n') + '\n      return { ' + '__NAMES__' + ' };\n    }';
  });
  const list = Array.from(names);
  const ret = list.map((n) => n + ': ' + n).join(', ');
  const local = list.filter((n) => n !== 'T' && n !== 'LOC').map((n) => '  const ' + n + ' = DCI.' + n + ';').join('\n');
  const logic = read(path.join(dir, 'logic.js'));
  const extra = fs.existsSync(path.join(dir, 'extra.js')) ? read(path.join(dir, 'extra.js')) : '';
  return '/* AnyConverter — ' + slug + ' tool. Generated by tools/pdf-pages/build.js from the tool-page design; edit tools/pdf-pages/source/' + slug + '/. */\n' +
    'window.DCTool = function (lang, DCLogic) {\n  var FNS = {\n' + langFns.join(',\n').replace(/__NAMES__/g, ret) + '\n  };\n  var DCI = (FNS[lang] || FNS.en)();\n' +
    local + '\n' + logic.split('\n').map((x) => '  ' + x).join('\n') + '\n' + extra + '\n  return Component;\n};\n';
}

/* links in the design → real site URLs, in the page language */
/* small markup fixes for validators/accessibility; applied to the template so pre-render and runtime match */
function tidy(tpl) {
  return tpl.replace(/<th(?=[\s>])(?![^>]*\bscope=)/g, '<th scope="col"')
    .replace(/\s(open|multiple)="\1"/g, ' $1')
    .replace(/<button(?![^>]*\btype=)/g, '<button type="button"')
    .replace(/[ \t]+$/gm, '');
}
function crumbOf(slug, lang) { return (read(path.join(SRC, slug, lang + '.consts.js')).match(/"crumb":"([^"]*)"/) || [])[1]; }
function fixLinks(tpl, lang) {
  // PDF to Word converts for real here, so drop the design's "conversion is simulated" prototype note
  tpl = tpl.replace(/<span style="font-size:12px;color:#5f564f;line-height:1.4">Protot[^<]*<\/span>/, '');
  // PDF to Word: the design's "Continue with" chips point at JSON to CSV / Image Resizer; use the PDF follow-ups it names in its copy
  tpl = tpl.replace(/<a href="05%20JSON[^"]*"([^>]*)>[^<]*<\/a><a href="06%20Image[^"]*"([^>]*)>[^<]*<\/a>/, (m, a1, a2) =>
    '<a href="23%20Compress%20PDF.dc.html"' + a1 + '>' + crumbOf('pdf-compress', lang) + ' →</a><a href="21%20Merge%20PDF.dc.html"' + a2 + '>' + crumbOf('pdf-merge', lang) + ' →</a>');
  tpl = tpl.replace(/href="(\d\d)%20[^"]*?\.dc\.html"/g, (m, n) => {
    const num = String(+n), t = TOOLS[num];
    const slug = t ? t.slug : OTHER[num];
    return 'href="' + (slug ? url(slug, lang) : pfx(lang)) + '"';
  });
  // breadcrumb: Home, PDF Tools (English hub only exists in English), tool
  let i = 0;
  tpl = tpl.replace(/<a href="#" style="color:#5f564f">([^<]*)<\/a>/g, (m, label) => {
    i++;
    if (i === 1) return '<a href="' + pfx(lang) + '" style="color:#5f564f">' + label + '</a>';
    if (i === 2 && lang === 'en') return '<a href="/pdf-tools/" style="color:#5f564f">' + label + '</a>';
    return '<span>' + label + '</span>';
  });
  return tpl;
}

/* AdSense: the design's sidebar box becomes slot 1; slot 2 (leaderboard below the tool) and
   slot 3 (rectangle above the FAQ) use the same dashed placeholder look. */
const AD = { en: 'Advertisement', es: 'Publicidad', da: 'Annonce' };
function adBox(lang, w, h, cls) {
  return '<div class="dc-ad ' + cls + '" style="max-width:' + w + 'px;min-height:' + h + 'px"><span>' + AD[lang] + '</span><span style="letter-spacing:0">' + w + ' × ' + h + '</span>' +
    '<div class="adsbygoogle" style="display:block" aria-hidden="true"></div></div>';
}
function addAds(tpl, lang) {
  const side = /<div style="width:100%;max-width:300px;height:250px;[^"]*"><span>[^<]*<\/span><span style="letter-spacing:0">300 × 250<\/span><\/div>/;
  if (!side.test(tpl)) throw new Error('sidebar ad box not found');
  tpl = tpl.replace(side, adBox(lang, 300, 250, 'dc-ad--side'));
  const body = '<div style="display:flex;flex-direction:column;gap:44px;max-width:880px;padding-top:12px">';
  if (tpl.indexOf(body) < 0) throw new Error('content column not found');
  tpl = tpl.replace(body, adBox(lang, 728, 90, 'dc-ad--leader') + '\n' + body);
  const faq = tpl.lastIndexOf('<section style="display:flex;flex-direction:column;gap:16px"><h2', tpl.indexOf('<details'));
  tpl = tpl.slice(0, faq) + adBox(lang, 336, 280, 'dc-ad--rect') + '\n' + tpl.slice(faq);
  return tpl;
}

function cssVars(Comp) {
  const make = (narrow) => { const c = new Comp(); c.state = Object.assign({}, c.state, { narrow }); return c.renderVals(); };
  const d = make(false), m = make(true);
  const decl = (v) => RT.LAYOUT.filter((k) => k in v).map((k) => '--dc-' + k + ':' + v[k]).join(';');
  return '.dc-root{' + decl(d) + '}@media (max-width:759px){.dc-root{' + decl(m) + '}}';
}

function loadComp(slug, lang) {
  const sandbox = { window: { innerWidth: 1280 }, navigator: {}, console, URLSearchParams, Intl, setTimeout, clearTimeout, Promise };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(toolScript(slug), sandbox);
  return sandbox.window.DCTool(lang, RT.DCLogic);
}

function relatedFromExisting(slug, lang) {
  const f = path.join(ROOT, lang === 'en' ? '' : lang, slug, 'index.html');
  if (!fs.existsSync(f)) return null;
  const s = read(f);
  const m = s.match(/\n\s*<section class="related-tools">[\s\S]*?<\/section>/);
  return m ? m[0] : null;
}

const RELATED_NEW = {
  'pdf-to-word': {
    en: { h: 'Related Tools', use: 'Try it →', items: [['ocr-pdf', 'OCR PDF', 'Extract text from scanned PDF files.'], ['pdf-compress', 'Compress PDF', 'Shrink a PDF to a smaller file size.'], ['pdf-merge', 'Merge PDF', 'Combine several PDFs into one.'], ['pdf-to-jpg', 'PDF to JPG', 'Turn PDF pages into images.']] },
    es: { h: 'Herramientas Relacionadas', use: 'Usar →', items: [['ocr-pdf', 'OCR PDF', 'Extrae texto de PDF escaneados.'], ['pdf-compress', 'Comprimir PDF', 'Reduce el tamaño de un PDF.'], ['pdf-merge', 'Unir PDF', 'Combina varios PDF en uno.'], ['pdf-to-jpg', 'PDF a JPG', 'Convierte páginas PDF en imágenes.']] },
    da: { h: 'Relaterede Værktøjer', use: 'Brug →', items: [['ocr-pdf', 'OCR PDF', 'Udtræk tekst fra scannede PDF-filer.'], ['pdf-compress', 'Komprimér PDF', 'Gør en PDF-fil mindre.'], ['pdf-merge', 'Saml PDF', 'Saml flere PDF-filer i én.'], ['pdf-to-jpg', 'PDF til JPG', 'Lav PDF-sider om til billeder.']] }
  }
};
function relatedNew(slug, lang) {
  const r = RELATED_NEW[slug][lang];
  return '\n    <section class="related-tools">\n      <h2>' + r.h + '</h2>\n      <div class="tool-grid">\n' + r.items.map(([s, n, d]) =>
    '        <a href="' + url(s, lang) + '" class="tool-card">\n          <img src="/assets/img/icon-pdf.svg" alt="" class="tool-card-icon" width="40" height="40" loading="lazy">\n          <h3>' + esc(n) + '</h3>\n          <p>' + esc(d) + '</p>\n          <span class="tool-card-link">' + r.use + '</span>\n        </a>').join('\n') + '\n      </div>\n    </section>';
}

function page(n, lang) {
  const t = TOOLS[n], dir = path.join(SRC, t.slug);
  const head = JSON.parse(read(path.join(dir, lang + '.head.json')));
  const tplSrc = tidy(addAds(fixLinks(read(path.join(dir, lang + '.template.html')), lang), lang));
  const Comp = loadComp(t.slug, lang);
  const c = new Comp();
  const pre = RT.renderToString(RT.parse(tplSrc), RT.layoutVars(c.renderVals())).html;
  const urls = {}; LANGS.forEach((l) => { urls[l] = SITE + url(t.slug, l); });

  // structured data: real URLs and an existing breadcrumb parent
  const ld = head.ld;
  ld['@graph'].forEach((g) => {
    if (g['@type'] === 'WebApplication') g.url = urls[lang];
    if (g['@type'] === 'BreadcrumbList') {
      const items = g.itemListElement;
      const out = [{ '@type': 'ListItem', position: 1, name: items[0].name, item: SITE + pfx(lang) }];
      if (lang === 'en') out.push({ '@type': 'ListItem', position: 2, name: items[1].name, item: SITE + '/pdf-tools/' });
      out.push({ '@type': 'ListItem', position: out.length + 1, name: items[items.length - 1].name, item: urls[lang] });
      g.itemListElement = out;
    }
  });
  const related = RELATED_NEW[t.slug] ? relatedNew(t.slug, lang) : relatedFromExisting(t.slug, lang);
  const title = unesc(head.title), desc = unesc(head.desc);
  const locale = { en: 'en_US', es: 'es_ES', da: 'da_DK' }[lang];

  return (`<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${urls[lang]}">
${LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${urls[l]}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${urls.en}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="AnyConverter">
  <meta property="og:locale" content="${locale}">
  <meta property="og:url" content="${urls[lang]}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/assets/img/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{font-family:'Inter',system-ui,sans-serif;background:var(--color-bg,#F7F6F3);color:var(--color-text,#151515)}
    body{min-height:100vh;display:flex;flex-direction:column}
    .site-header{position:sticky;top:0;z-index:100;height:56px;background:var(--color-surface,#fff);border-bottom:1px solid var(--color-border,#DDD8D0)}
    .header-inner{max-width:1280px;width:100%;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:32px}
    .dc-root{max-width:1280px;width:100%;margin:0 auto;background:#f7f4ef;color:#1f1a17;font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif}
    ${cssVars(Comp)}
  </style>
  <link rel="stylesheet" href="/assets/css/style.css?v=${V}">
</head>
<body>
  <header id="site-header" class="site-header"></header>
  <main id="main-content">
    <div class="dc-root" id="dc-root" data-tool="${t.slug}" data-lang="${lang}">
${pre}
    </div>
${related}
  </main>
  <footer id="site-footer" class="site-footer"></footer>
  <script type="text/x-dc-template" id="dc-template">${tplSrc.replace(/<\/script/gi, '<\\/script')}</script>
  <script src="/assets/js/shared.js?v=20261012" defer></script>
  <script src="/assets/js/tools/dc-runtime.js?v=${V}" defer></script>
  <script src="/assets/js/tools/${t.slug}.js?v=${V}" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" defer></script>
</body>
</html>
`).replace(/[ \t]+$/gm, '');
}

function build() {
  let count = 0;
  Object.keys(TOOLS).forEach((n) => {
    const t = TOOLS[n];
    fs.writeFileSync(path.join(ROOT, 'assets/js/tools', t.slug + '.js'), toolScript(t.slug));
    const pages = LANGS.map((l) => [l, page(n, l)]);   // render all first (related blocks read the old pages)
    pages.forEach(([l, html]) => {
      const f = path.join(ROOT, l === 'en' ? '' : l, t.slug, 'index.html');
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, html);
      count++;
    });
  });
  process.stdout.write('wrote ' + count + ' PDF tool pages\n');
}

if (process.argv[2] === 'import') doImport(process.argv[3]);
else build();

module.exports = { TOOLS };
