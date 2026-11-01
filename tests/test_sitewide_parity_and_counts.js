#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('Running Sitewide Parity & Inventory Counts Regression Suite...\n');

// 1. Unique Functional Tool Inventory Verification
const excludedDirs = new Set(['.git', '.vs', 'node_modules', 'output', 'attached_assets', 'scratch', 'test-results', 'reports', 'assets', 'tools', 'tests', 'docs', 'es', 'da']);
const knownNonTools = new Set(['about', 'blog', 'contact', 'cookies', 'faq', 'press', 'privacy', 'security', 'terms', 'calculators', 'developer-tools', 'pdf-tools', 'productivity-tools', 'numerology-astrology', 'fun-relationships', 'date-time', 'text-tools', 'browser-tools']);

const uniqueTools = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && !excludedDirs.has(d.name) && !knownNonTools.has(d.name))
  .map(d => d.name)
  .filter(slug => fs.existsSync(path.join(ROOT, slug, 'index.html')));

console.log(`[CHECK 1] Discovered Unique Functional Tools in Repository: ${uniqueTools.length}`);
assert.strictEqual(uniqueTools.length, 128, `Expected exactly 128 unique tools, found ${uniqueTools.length}`);

// Verify ES and DA counterparts
for (const slug of uniqueTools) {
  assert.ok(fs.existsSync(path.join(ROOT, 'es', slug, 'index.html')), `Missing Spanish localized tool page for ${slug}`);
  assert.ok(fs.existsSync(path.join(ROOT, 'da', slug, 'index.html')), `Missing Danish localized tool page for ${slug}`);
}
console.log('  ✓ 100% of 128 unique tools verified active across EN, ES, and DA (384 pages total).');

// 2. Homepage Structural Parity (EN, ES, DA)
const homepages = {
  en: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  es: fs.readFileSync(path.join(ROOT, 'es', 'index.html'), 'utf8'),
  da: fs.readFileSync(path.join(ROOT, 'da', 'index.html'), 'utf8')
};

const getToolCards = (html) => [...html.matchAll(/<a\s+href=["'](\/(?:(?:es|da)\/)?[^"']+\/)["']\s+class=["']tool-card["']/g)].map(m => m[1]);

for (const [lang, html] of Object.entries(homepages)) {
  const cards = getToolCards(html);
  console.log(`[CHECK 2] Homepage (${lang.toUpperCase()}) Tool Cards Rendered: ${cards.length}`);
  assert.strictEqual(cards.length, 128, `Expected 128 tool cards on ${lang} homepage, got ${cards.length}`);

  // Assert hero count
  assert.ok(html.includes('128'), `Homepage ${lang} does not display canonical 128 count in hero`);

  // Assert 13 category sections
  const catSections = [...html.matchAll(/<section class="category-section"/g)];
  assert.strictEqual(catSections.length, 13, `Expected 13 category sections on ${lang} homepage, got ${catSections.length}`);
}
console.log('  ✓ 100% homepage parity confirmed across EN, ES, DA (128 cards, 13 sections).');

// 3. Category Hub Card Count Parity
const expectedHubCounts = {
  'calculators': 32,
  'developer-tools': 26,
  'pdf-tools': 26,
  'productivity-tools': 22,
  'text-tools': 13,
  'browser-tools': 11,
  'numerology-astrology': 6,
  'fun-relationships': 7,
  'date-time': 8
};

for (const [hub, expectedCount] of Object.entries(expectedHubCounts)) {
  const enHub = fs.readFileSync(path.join(ROOT, hub, 'index.html'), 'utf8');
  const esHub = fs.readFileSync(path.join(ROOT, 'es', hub, 'index.html'), 'utf8');
  const daHub = fs.readFileSync(path.join(ROOT, 'da', hub, 'index.html'), 'utf8');

  const enCards = getToolCards(enHub);
  const esCards = getToolCards(esHub);
  const daCards = getToolCards(daHub);

  console.log(`[CHECK 3] Hub /${hub}/: EN=${enCards.length}, ES=${esCards.length}, DA=${daCards.length}`);
  assert.strictEqual(enCards.length, expectedCount, `EN hub ${hub} count mismatch: expected ${expectedCount}, got ${enCards.length}`);
  assert.strictEqual(esCards.length, expectedCount, `ES hub ${hub} count mismatch: expected ${expectedCount}, got ${esCards.length}`);
  assert.strictEqual(daCards.length, expectedCount, `DA hub ${hub} count mismatch: expected ${expectedCount}, got ${daCards.length}`);
}
console.log('  ✓ 100% category hub parity confirmed across all 9 hubs in EN, ES, DA.');
// 3b. Verify 100% Hub Coverage of All 128 Functional Tools
const allHubSlugs = Object.keys(expectedHubCounts);
const coveredToolSlugs = new Set();
for (const hub of allHubSlugs) {
  const enHubHtml = fs.readFileSync(path.join(ROOT, hub, 'index.html'), 'utf8');
  const cards = getToolCards(enHubHtml);
  for (const c of cards) {
    const slug = c.replace(/^\/|\/$/g, '');
    if (uniqueTools.includes(slug)) {
      coveredToolSlugs.add(slug);
    }
  }
}
console.log(`[CHECK 3b] Discovered ${coveredToolSlugs.size} / ${uniqueTools.length} functional tools discoverable in category hubs`);
assert.strictEqual(coveredToolSlugs.size, uniqueTools.length, 'Every functional tool must be discoverable through category hubs');
console.log('  ✓ 100% of 128 tools are discoverable via canonical category hubs (0 omitted tools).');


// 4. Stale Counter Regression Guard
const pagesToGuard = [
  'index.html', 'es/index.html', 'da/index.html',
  'about/index.html', 'es/about/index.html', 'da/about/index.html',
  'blog/index.html', 'es/blog/index.html', 'da/blog/index.html',
  'faq/index.html', 'es/faq/index.html', 'da/faq/index.html',
  'press/index.html', 'es/press/index.html', 'da/press/index.html'
];

for (const rel of pagesToGuard) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  assert.ok(!/\b78\+\s*(tools|herramientas|værktøjer|free online tools)/i.test(content), `Found stale "78+ tools" in ${rel}`);
  assert.ok(!/\b35\+?\s*(herramientas|værktøjer)/i.test(content), `Found stale "35 herramientas/værktøjer" in ${rel}`);
  assert.ok(!/\b95\+\s*tools/i.test(content), `Found stale "95+ tools" in ${rel}`);
}
console.log('  ✓ 0 stale counters detected across all key informational, blog, and home pages.');

// 5. Related Tools Section & Relevance Guard
for (const slug of uniqueTools) {
  ['en', 'es', 'da'].forEach(lang => {
    const p = lang === 'en' ? path.join(ROOT, slug, 'index.html') : path.join(ROOT, lang, slug, 'index.html');
    const content = fs.readFileSync(p, 'utf8');

    assert.ok(/<section class=["']related-tools["']>/i.test(content), `Missing related-tools section in ${p}`);

    // If PDF tool, ensure no irrelevant dev tools are linked
    if (slug === 'pdf-merge' || slug === 'pdf-compress' || slug === 'pdf-split') {
      assert.ok(!content.includes('/json-formatter/'), `Unrelated JSON Formatter link found in ${p}`);
      assert.ok(!content.includes('/hash-generator/'), `Unrelated Hash Generator link found in ${p}`);
      assert.ok(!content.includes('/base64-encoder/'), `Unrelated Base64 Encoder link found in ${p}`);
    }

    // Verify all hrefs in related-tools exist
    const match = content.match(/<section class=["']related-tools["']>([\s\S]*?)<\/section>/i);
    if (match) {
      const links = [...match[1].matchAll(/href=["'](\/(?:(?:es|da)\/)?[^"']+\/)["']/g)].map(m => m[1]);
      for (const link of links) {
        const localRel = link.replace(/^\/|\/$/g, '');
        const targetPath = path.join(ROOT, localRel, 'index.html');
        assert.ok(fs.existsSync(targetPath), `Broken related link target ${link} in ${p}`);

        // Verify correct locale prefix
        if (lang !== 'en') {
          assert.ok(link.startsWith(`/${lang}/`), `Locale mismatch in related link ${link} in ${p}`);
        }
      }
    }
  });
}
console.log('  ✓ Related tools verified across all 128 tools (0 broken links, 100% workflow alignment).');

// 6. Blog Non-Circular Links Guard
for (const lang of ['en', 'es', 'da']) {
  const p = lang === 'en' ? path.join(ROOT, 'blog', 'index.html') : path.join(ROOT, lang, 'blog', 'index.html');
  const content = fs.readFileSync(p, 'utf8');

  // Verify that blog cards do not circularly point to /blog/
  const cardHrefs = [...content.matchAll(/<a href=["']([^"']+)["'] class="tool-link"/g)].map(m => m[1]);
  assert.ok(cardHrefs.length >= 6, `Expected at least 6 actionable guide links on ${lang} blog`);
  for (const href of cardHrefs) {
    assert.ok(href !== '/blog/' && href !== `/${lang}/blog/`, `Circular link ${href} found in ${p}`);
  }
}
console.log('  ✓ Blog verified with actionable guides and zero circular links.');

console.log('\n====================================================');
console.log('RESULT: 100% REGRESSION CHECKS PASSED.');
console.log('====================================================');
process.exit(0);
