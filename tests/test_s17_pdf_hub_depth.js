#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S17 Category Hub Depth Upgrade: PDF Tools Verification Suite
 *
 * Verifies:
 * 1. Physical existence and clean structure across all 3 locales (EN, ES, DA).
 * 2. Self-referential canonical URLs and reciprocal 4-way hreflang alternates (en, es, da, x-default).
 * 3. Title tag lengths <= 60 characters with AnyConverter branding.
 * 4. Meta description lengths strictly bounded between 140 and 160 characters.
 * 5. 5 Thematic subsections per locale with >= 150 words of substantive, practical guidance.
 * 6. Exactly 26 PDF tools categorized and rendered with class="tool-card" in each locale.
 * 7. Schema.org JSON-LD graph integrity (CollectionPage, ItemList of 26 tools, BreadcrumbList, FAQPage).
 * 8. 100% verbatim parity between visible FAQ HTML and FAQPage schema markup (15 FAQs total).
 * 9. Multilingual diacritic integrity (ES and DA characters preserved, no stripped accents).
 * 10. WCAG 2.2 AA focus-visible outline definition in style.css.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   SPRINT S17: PDF CATEGORY HUB DEPTH VERIFICATION  ');
console.log('====================================================\n');

const HUBS = [
  {
    lang: 'en',
    filePath: 'pdf-tools/index.html',
    canonical: 'https://anyconverter.io/pdf-tools/',
    breadcrumbHome: 'Home',
    breadcrumbHub: 'PDF Tools',
    expectedToolsCount: 26
  },
  {
    lang: 'es',
    filePath: 'es/pdf-tools/index.html',
    canonical: 'https://anyconverter.io/es/pdf-tools/',
    breadcrumbHome: 'Inicio',
    breadcrumbHub: 'Herramientas PDF',
    expectedToolsCount: 26
  },
  {
    lang: 'da',
    filePath: 'da/pdf-tools/index.html',
    canonical: 'https://anyconverter.io/da/pdf-tools/',
    breadcrumbHome: 'Hjem',
    breadcrumbHub: 'PDF-værktøjer',
    expectedToolsCount: 26
  }
];

const EXPECTED_HREFLANGS = {
  'en': 'https://anyconverter.io/pdf-tools/',
  'es': 'https://anyconverter.io/es/pdf-tools/',
  'da': 'https://anyconverter.io/da/pdf-tools/',
  'x-default': 'https://anyconverter.io/pdf-tools/'
};

const EXPECTED_SUBSECTIONS = [
  'organize-manage-pages',
  'compression-optimization',
  'conversion-formatting',
  'security-privacy',
  'editing-signing-utilities'
];

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  process.stdout.write(`[CHECK ${totalChecks}] ${desc}... `);
  try {
    fn();
    console.log('PASS');
    passedChecks++;
  } catch (err) {
    console.log('FAIL');
    console.error(`  Error: ${err.message}`);
    throw err;
  }
}

// 1. Files existence & Clean HTML
check('All 3 PDF category hub pages exist and render valid HTML doctype', () => {
  for (const hub of HUBS) {
    const fullPath = path.join(ROOT, hub.filePath);
    assert.ok(fs.existsSync(fullPath), `File does not exist: ${hub.filePath}`);
    const html = fs.readFileSync(fullPath, 'utf8');
    assert.ok(html.startsWith('<!DOCTYPE html>'), `${hub.filePath} missing DOCTYPE declaration`);
    assert.ok(html.includes(`<html lang="${hub.lang}">`), `${hub.filePath} missing correct <html lang>`);
    assert.ok(html.includes('id="site-header"'), `${hub.filePath} missing site-header`);
    assert.ok(html.includes('id="site-footer"'), `${hub.filePath} missing site-footer`);
    assert.ok(html.includes('id="main-content"'), `${hub.filePath} missing main-content`);
  }
});

// 2. Canonical and Reciprocal 4-Way Hreflang
check('Canonical URLs and reciprocal 4-way hreflang alternates are strictly configured', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');

    // Canonical
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    assert.ok(canonicalMatch, `${hub.filePath} missing canonical tag`);
    assert.strictEqual(canonicalMatch[1], hub.canonical, `${hub.filePath} canonical mismatch: expected ${hub.canonical}, got ${canonicalMatch[1]}`);

    // Hreflang alternates
    for (const [hlLang, hlUrl] of Object.entries(EXPECTED_HREFLANGS)) {
      const hlRegex = new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${hlLang}["']\\s+href=["']${hlUrl.replace(/\//g, '\\/')}["']`, 'i');
      assert.ok(hlRegex.test(html), `${hub.filePath} missing or invalid hreflang alternate for ${hlLang}: ${hlUrl}`);
    }
  }
});

// 3. Title tag lengths <= 60 characters
check('Title tags are optimized, <= 60 characters, and contain AnyConverter branding', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    assert.ok(titleMatch, `${hub.filePath} missing <title> tag`);
    const title = titleMatch[1];
    assert.ok(title.length <= 60, `${hub.filePath} title exceeds 60 chars (${title.length} chars): "${title}"`);
    assert.ok(title.length >= 35, `${hub.filePath} title too short (${title.length} chars): "${title}"`);
    assert.ok(title.includes('AnyConverter'), `${hub.filePath} title missing "AnyConverter" branding`);
  }
});

// 4. Meta descriptions 140-160 characters
check('Meta descriptions are strictly bounded between 140 and 160 characters', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    assert.ok(descMatch, `${hub.filePath} missing meta description`);
    const desc = descMatch[1];
    assert.ok(desc.length >= 140 && desc.length <= 160, `${hub.filePath} meta description length (${desc.length}) outside 140-160 range: "${desc}"`);
  }
});

// 5. Thematic Subsections Word Count (>= 150 words per subsection)
check('All 5 thematic subsections per locale contain >= 150 words of practical guidance', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');

    for (const subId of EXPECTED_SUBSECTIONS) {
      const sectionRegex = new RegExp(`<section class="thematic-section" id="${subId}">([\\s\\S]*?)<\\/section>`, 'i');
      const match = html.match(sectionRegex);
      assert.ok(match, `${hub.filePath} missing subsection with id="${subId}"`);

      const descMatch = match[1].match(/<p class="thematic-desc">([\s\S]*?)<\/p>/i);
      assert.ok(descMatch, `${hub.filePath} subsection #${subId} missing <p class="thematic-desc">`);

      const words = descMatch[1].trim().split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 150, `${hub.filePath} subsection #${subId} word count is ${words} (expected >= 150 words)`);
      assert.ok(words <= 250, `${hub.filePath} subsection #${subId} word count is ${words} (expected <= 250 words)`);
    }
  }
});

// 6. Tool count parity (exactly 26 tools with class="tool-card")
check('Exactly 26 PDF tools are rendered per locale matching class="tool-card"', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const toolCards = [...html.matchAll(/<a\s+href=["'](\/(?:(?:es|da)\/)?[^"']+\/)["']\s+class=["']tool-card["']/g)].map(m => m[1]);
    assert.strictEqual(toolCards.length, hub.expectedToolsCount, `${hub.filePath} tool cards count mismatch: expected ${hub.expectedToolsCount}, got ${toolCards.length}`);

    // Verify all 26 distinct tool slugs
    const uniqueSlugs = new Set(toolCards.map(c => c.replace(/^\/(?:(?:es|da)\/)?|\/$/g, '')));
    assert.strictEqual(uniqueSlugs.size, 26, `${hub.filePath} contains duplicate or missing tool slugs: found ${uniqueSlugs.size}`);
  }
});

// 7. Structured Data (Schema.org JSON-LD) Integrity
check('Schema.org JSON-LD contains valid CollectionPage, ItemList (26 items), BreadcrumbList, and FAQPage', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    assert.ok(scriptMatch, `${hub.filePath} missing JSON-LD script block`);

    const json = JSON.parse(scriptMatch[1]);
    assert.strictEqual(json['@context'], 'https://schema.org', `${hub.filePath} invalid JSON-LD context`);
    assert.ok(Array.isArray(json['@graph']), `${hub.filePath} JSON-LD @graph must be an array`);

    // 7a. CollectionPage + ItemList
    const collectionPage = json['@graph'].find(item => item['@type'] === 'CollectionPage');
    assert.ok(collectionPage, `${hub.filePath} missing CollectionPage schema`);
    assert.strictEqual(collectionPage.url, hub.canonical);
    assert.strictEqual(collectionPage.inLanguage, hub.lang);
    assert.ok(collectionPage.publisher && collectionPage.publisher.name === 'AnyConverter');

    const itemList = collectionPage.mainEntity;
    assert.ok(itemList && itemList['@type'] === 'ItemList', `${hub.filePath} missing ItemList in CollectionPage`);
    assert.strictEqual(itemList.numberOfItems, 26, `${hub.filePath} ItemList numberOfItems mismatch`);
    assert.strictEqual(itemList.itemListElement.length, 26, `${hub.filePath} ItemList items length mismatch`);

    // Verify sequential positions 1..26
    itemList.itemListElement.forEach((item, idx) => {
      assert.strictEqual(item['@type'], 'ListItem');
      assert.strictEqual(item.position, idx + 1);
      assert.ok(item.name && item.name.length > 0);
      assert.ok(item.url && item.url.startsWith('https://anyconverter.io/'));
    });

    // 7b. BreadcrumbList
    const breadcrumbList = json['@graph'].find(item => item['@type'] === 'BreadcrumbList');
    assert.ok(breadcrumbList, `${hub.filePath} missing BreadcrumbList schema`);
    assert.strictEqual(breadcrumbList.itemListElement.length, 2);
    assert.strictEqual(breadcrumbList.itemListElement[0].name, hub.breadcrumbHome);
    assert.strictEqual(breadcrumbList.itemListElement[1].name, hub.breadcrumbHub);
    assert.strictEqual(breadcrumbList.itemListElement[1].item, hub.canonical);

    // 7c. FAQPage
    const faqPage = json['@graph'].find(item => item['@type'] === 'FAQPage');
    assert.ok(faqPage, `${hub.filePath} missing FAQPage schema`);
    assert.strictEqual(faqPage.mainEntity.length, 5, `${hub.filePath} FAQPage must contain exactly 5 questions`);
  }
});

// 8. 100% Verbatim Parity Between Visible FAQ HTML and FAQPage Schema
check('100% verbatim text parity between rendered HTML <details> and FAQPage JSON-LD schema', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    const json = JSON.parse(scriptMatch[1]);
    const faqPage = json['@graph'].find(item => item['@type'] === 'FAQPage');
    const schemaFaqs = faqPage.mainEntity;

    // Extract HTML FAQs
    const faqItems = [...html.matchAll(/<details class="faq-item"><summary class="faq-question">([\s\S]*?)<\/summary><div class="faq-answer">([\s\S]*?)<\/div><\/details>/g)];
    assert.strictEqual(faqItems.length, 5, `${hub.filePath} expected 5 rendered FAQ items, found ${faqItems.length}`);

    faqItems.forEach((m, idx) => {
      // Strip <span class="faq-icon">+</span> from question
      const renderedQ = m[1].replace(/<span\s+class="faq-icon">\+<\/span>/, '').trim();
      const renderedA = m[2].trim();

      const schemaQ = schemaFaqs[idx].name.trim();
      const schemaA = schemaFaqs[idx].acceptedAnswer.text.trim();

      assert.strictEqual(renderedQ, schemaQ, `${hub.filePath} FAQ #${idx + 1} Question mismatch:\nHTML:   ${renderedQ}\nSCHEMA: ${schemaQ}`);
      assert.strictEqual(renderedA, schemaA, `${hub.filePath} FAQ #${idx + 1} Answer mismatch:\nHTML:   ${renderedA}\nSCHEMA: ${schemaA}`);
    });
  }
});

// 9. Multilingual Diacritic Integrity (ES & DA)
check('Spanish and Danish diacritics are strictly preserved with zero stripped characters', () => {
  const esHtml = fs.readFileSync(path.join(ROOT, 'es/pdf-tools/index.html'), 'utf8');
  assert.ok(esHtml.includes('Páginas'), 'es/pdf-tools missing accented "Páginas"');
  assert.ok(esHtml.includes('Optimización'), 'es/pdf-tools missing accented "Optimización"');
  assert.ok(esHtml.includes('Conversión'), 'es/pdf-tools missing accented "Conversión"');
  assert.ok(esHtml.includes('Edición'), 'es/pdf-tools missing accented "Edición"');
  assert.ok(esHtml.includes('¿Estas herramientas de PDF son totalmente gratuitas y sin límites?'), 'es/pdf-tools missing Spanish inverted question mark and accents in FAQ');

  const daHtml = fs.readFileSync(path.join(ROOT, 'da/pdf-tools/index.html'), 'utf8');
  assert.ok(daHtml.includes('Håndter Sider'), 'da/pdf-tools missing Danish "Håndter"');
  assert.ok(daHtml.includes('PDF-værktøjer'), 'da/pdf-tools missing Danish "værktøjer"');
  assert.ok(daHtml.includes('Beskær PDF'), 'da/pdf-tools missing Danish "Beskær"');
  assert.ok(daHtml.includes('Tilføj'), 'da/pdf-tools missing Danish "Tilføj"');
  assert.ok(daHtml.includes('Er disse PDF-værktøjer helt gratis at bruge uden begrænsninger?'), 'da/pdf-tools missing Danish letters in FAQ');

  // Verify breadcrumb visible text
  assert.ok(esHtml.includes('>Inicio<'), 'es/pdf-tools missing visible breadcrumb "Inicio"');
  assert.ok(esHtml.includes('>Herramientas PDF<'), 'es/pdf-tools missing visible breadcrumb "Herramientas PDF"');
  assert.ok(daHtml.includes('>Hjem<'), 'da/pdf-tools missing visible breadcrumb "Hjem"');
  assert.ok(daHtml.includes('>PDF-værktøjer<'), 'da/pdf-tools missing visible breadcrumb "PDF-værktøjer"');
});

// 10. WCAG 2.2 AA Focus-Visible in style.css
check('WCAG 2.2 AA :focus-visible outlines are defined for tool-cards and interactive FAQ summaries', () => {
  const css = fs.readFileSync(path.join(ROOT, 'assets/css/style.css'), 'utf8');
  assert.ok(css.includes('.tool-card:focus-visible'), 'style.css missing .tool-card:focus-visible');
  assert.ok(css.includes('.faq-item summary:focus-visible'), 'style.css missing .faq-item summary:focus-visible');
  assert.ok(css.includes('#B04A45'), 'style.css missing contrast color #B04A45 in focus-visible rule');
});

console.log(`\n====================================================`);
console.log(`Results: All ${passedChecks}/${totalChecks} verification checks passed successfully!`);
console.log(`====================================================\n`);
