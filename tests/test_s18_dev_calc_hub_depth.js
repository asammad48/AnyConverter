#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S18 Category Hub Depth Upgrade: Developer Tools + Calculators Verification Suite
 *
 * Verifies:
 * 1. Physical existence and clean structure across all 6 hub pages (EN, ES, DA for Dev Tools & Calculators).
 * 2. Self-referential canonical URLs and reciprocal 4-way hreflang alternates (en, es, da, x-default).
 * 3. Title tag lengths <= 60 characters with AnyConverter branding.
 * 4. Meta description lengths strictly bounded between 140 and 160 characters.
 * 5. 5 Thematic subsections per hub per locale (30 subsections total) with >= 150 words of practical guidance.
 * 6. Exactly 26 tools on Dev Tools and 32 tools on Calculators matching class="tool-card".
 * 7. Schema.org JSON-LD graph integrity (CollectionPage, ItemList, BreadcrumbList, FAQPage).
 * 8. 100% verbatim parity between visible FAQ HTML and FAQPage schema markup (30 FAQs total).
 * 9. Multilingual diacritic integrity (ES and DA characters preserved, no stripped accents).
 * 10. Privacy statements compliance (zero absolute privacy overclaims).
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S18: DEV TOOLS & CALCULATORS HUB DEPTH     ');
console.log('====================================================\n');

const HUBS = [
  {
    hub: 'developer-tools',
    lang: 'en',
    filePath: 'developer-tools/index.html',
    canonical: 'https://anyconverter.io/developer-tools/',
    breadcrumbHome: 'Home',
    breadcrumbHub: 'Developer Tools',
    expectedToolsCount: 26,
    subsections: [
      'data-formatting-validation',
      'encoding-cryptography-security',
      'data-conversion-querying',
      'css-web-design-display',
      'system-auth-parsing'
    ]
  },
  {
    hub: 'developer-tools',
    lang: 'es',
    filePath: 'es/developer-tools/index.html',
    canonical: 'https://anyconverter.io/es/developer-tools/',
    breadcrumbHome: 'Inicio',
    breadcrumbHub: 'Herramientas para Desarrolladores',
    expectedToolsCount: 26,
    subsections: [
      'data-formatting-validation',
      'encoding-cryptography-security',
      'data-conversion-querying',
      'css-web-design-display',
      'system-auth-parsing'
    ]
  },
  {
    hub: 'developer-tools',
    lang: 'da',
    filePath: 'da/developer-tools/index.html',
    canonical: 'https://anyconverter.io/da/developer-tools/',
    breadcrumbHome: 'Hjem',
    breadcrumbHub: 'Udviklerværktøjer',
    expectedToolsCount: 26,
    subsections: [
      'data-formatting-validation',
      'encoding-cryptography-security',
      'data-conversion-querying',
      'css-web-design-display',
      'system-auth-parsing'
    ]
  },
  {
    hub: 'calculators',
    lang: 'en',
    filePath: 'calculators/index.html',
    canonical: 'https://anyconverter.io/calculators/',
    breadcrumbHome: 'Home',
    breadcrumbHub: 'Calculators',
    expectedToolsCount: 32,
    subsections: [
      'percentages-discounts-pricing',
      'loans-pay-financial-planning',
      'slope-geometry-ratios',
      'health-fitness-daily-planning',
      'compatibility-numerology-astrology'
    ]
  },
  {
    hub: 'calculators',
    lang: 'es',
    filePath: 'es/calculators/index.html',
    canonical: 'https://anyconverter.io/es/calculators/',
    breadcrumbHome: 'Inicio',
    breadcrumbHub: 'Calculadoras',
    expectedToolsCount: 32,
    subsections: [
      'percentages-discounts-pricing',
      'loans-pay-financial-planning',
      'slope-geometry-ratios',
      'health-fitness-daily-planning',
      'compatibility-numerology-astrology'
    ]
  },
  {
    hub: 'calculators',
    lang: 'da',
    filePath: 'da/calculators/index.html',
    canonical: 'https://anyconverter.io/da/calculators/',
    breadcrumbHome: 'Hjem',
    breadcrumbHub: 'Beregnere',
    expectedToolsCount: 32,
    subsections: [
      'percentages-discounts-pricing',
      'loans-pay-financial-planning',
      'slope-geometry-ratios',
      'health-fitness-daily-planning',
      'compatibility-numerology-astrology'
    ]
  }
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
check('All 6 category hub pages exist and render valid HTML5 doctype', () => {
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
    const expectedHreflangs = {
      'en': `https://anyconverter.io/${hub.hub}/`,
      'es': `https://anyconverter.io/es/${hub.hub}/`,
      'da': `https://anyconverter.io/da/${hub.hub}/`,
      'x-default': `https://anyconverter.io/${hub.hub}/`
    };

    for (const [hlLang, hlUrl] of Object.entries(expectedHreflangs)) {
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
check('All 5 thematic subsections per hub per locale contain >= 150 words of practical guidance', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');

    for (const subId of hub.subsections) {
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

// 6. Tool count parity (26 for Dev Tools, 32 for Calculators)
check('Tool card counts match exactly (26 for Dev Tools, 32 for Calculators) with class="tool-card"', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const toolCards = [...html.matchAll(/<a\s+href=["'](\/(?:(?:es|da)\/)?[^"']+\/)["']\s+class=["']tool-card["']/g)].map(m => m[1]);
    assert.strictEqual(toolCards.length, hub.expectedToolsCount, `${hub.filePath} tool cards count mismatch: expected ${hub.expectedToolsCount}, got ${toolCards.length}`);

    // Verify all distinct tool slugs
    const uniqueSlugs = new Set(toolCards.map(c => c.replace(/^\/(?:(?:es|da)\/)?|\/$/g, '')));
    assert.strictEqual(uniqueSlugs.size, hub.expectedToolsCount, `${hub.filePath} contains duplicate or missing tool slugs: found ${uniqueSlugs.size}`);
  }
});

// 7. Structured Data (Schema.org JSON-LD) Integrity
check('Schema.org JSON-LD contains valid CollectionPage, ItemList, BreadcrumbList, and FAQPage', () => {
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
    assert.strictEqual(itemList.numberOfItems, hub.expectedToolsCount, `${hub.filePath} ItemList numberOfItems mismatch`);
    assert.strictEqual(itemList.itemListElement.length, hub.expectedToolsCount, `${hub.filePath} ItemList items length mismatch`);

    // Verify sequential positions 1..N
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
check('100% verbatim text parity between rendered HTML <details> and FAQPage JSON-LD schema (30 FAQs)', () => {
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    const json = JSON.parse(scriptMatch[1]);
    const faqPage = json['@graph'].find(item => item['@type'] === 'FAQPage');
    const schemaFaqs = faqPage.mainEntity;

    const faqItems = [...html.matchAll(/<details class="faq-item"><summary class="faq-question">([\s\S]*?)<\/summary><div class="faq-answer">([\s\S]*?)<\/div><\/details>/g)];
    assert.strictEqual(faqItems.length, 5, `${hub.filePath} expected 5 rendered FAQ items, found ${faqItems.length}`);

    faqItems.forEach((m, idx) => {
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
check('Spanish and Danish diacritics are strictly preserved across both category hubs', () => {
  const esDevHtml = fs.readFileSync(path.join(ROOT, 'es/developer-tools/index.html'), 'utf8');
  assert.ok(esDevHtml.includes('Desarrolladores'), 'es/dev missing "Desarrolladores"');
  assert.ok(esDevHtml.includes('Validación'), 'es/dev missing "Validación"');
  assert.ok(esDevHtml.includes('Codificación'), 'es/dev missing "Codificación"');
  assert.ok(esDevHtml.includes('Criptografía'), 'es/dev missing "Criptografía"');
  assert.ok(esDevHtml.includes('¿Estas herramientas para desarrolladores son completamente gratuitas y sin límites?'), 'es/dev missing FAQ diacritics');

  const daDevHtml = fs.readFileSync(path.join(ROOT, 'da/developer-tools/index.html'), 'utf8');
  assert.ok(daDevHtml.includes('Udviklerværktøjer'), 'da/dev missing "Udviklerværktøjer"');
  assert.ok(daDevHtml.includes('Indkodning'), 'da/dev missing "Indkodning"');
  assert.ok(daDevHtml.includes('Skærmegenskaber'), 'da/dev missing "Skærmegenskaber"');
  assert.ok(daDevHtml.includes('Er disse udviklerværktøjer helt gratis at bruge uden begrænsninger?'), 'da/dev missing FAQ diacritics');

  const esCalcHtml = fs.readFileSync(path.join(ROOT, 'es/calculators/index.html'), 'utf8');
  assert.ok(esCalcHtml.includes('Calculadoras'), 'es/calc missing "Calculadoras"');
  assert.ok(esCalcHtml.includes('Préstamos'), 'es/calc missing "Préstamos"');
  assert.ok(esCalcHtml.includes('Proporciones'), 'es/calc missing "Proporciones"');
  assert.ok(esCalcHtml.includes('¿Estas calculadoras online son gratuitas y muestran sus fórmulas?'), 'es/calc missing FAQ diacritics');

  const daCalcHtml = fs.readFileSync(path.join(ROOT, 'da/calculators/index.html'), 'utf8');
  assert.ok(daCalcHtml.includes('Beregnere'), 'da/calc missing "Beregnere"');
  assert.ok(daCalcHtml.includes('Lån'), 'da/calc missing "Lån"');
  assert.ok(daCalcHtml.includes('Hældning'), 'da/calc missing "Hældning"');
  assert.ok(daCalcHtml.includes('Er disse online beregnere helt gratis at bruge og viser de formlerne?'), 'da/calc missing FAQ diacritics');
});

// 10. Privacy Statements Compliance (Zero absolute privacy overclaims)
check('Zero absolute privacy overclaims across all 6 category hub pages', () => {
  const privRegex = /(never leave|never leaves|forlader[^.\n]{0,80}aldrig|nunca sale[n]?\b|sendes aldrig)/i;
  for (const hub of HUBS) {
    const html = fs.readFileSync(path.join(ROOT, hub.filePath), 'utf8');
    const m = html.match(privRegex);
    assert.strictEqual(m, null, `Absolute privacy claim violation in ${hub.filePath}: "${m ? m[0] : ''}"`);
  }
});

console.log(`\n====================================================`);
console.log(`Results: All ${passedChecks}/${totalChecks} verification checks passed successfully!`);
console.log(`====================================================\n`);
