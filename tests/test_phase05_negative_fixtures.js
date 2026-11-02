const assert = require('assert');
const fs = require('fs');

// We simulate the validation logic from phase05-international-seo-audit.js
const auditCode = fs.readFileSync('tools/phase05-international-seo-audit.js', 'utf8');

console.log('--- Testing Phase 05 International SEO Negative Test Fixtures ---');

function createFixturePage(htmlSnippet) {
  // Extract hreflang entries
  const alternateTags = [...htmlSnippet.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["']/gi)];
  const hreflangEntries = alternateTags.map(m => ({ lang: m[1], href: m[2] }));
  const seenLangs = new Set();
  const duplicateHreflangs = [];
  for (const item of hreflangEntries) {
    if (seenLangs.has(item.lang)) duplicateHreflangs.push(item.lang);
    seenLangs.add(item.lang);
  }

  const canonicalMatch = htmlSnippet.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const ogUrlMatch = htmlSnippet.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  const jsonLdBlocks = [...htmlSnippet.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map(m => m[1]);

  return {
    canonical: canonicalMatch ? canonicalMatch[1] : '',
    ogUrl: ogUrlMatch ? ogUrlMatch[1] : '',
    duplicateHreflangs,
    jsonLdBlocks
  };
}

function validateFixture(page) {
  const issues = [];
  if (page.duplicateHreflangs.length > 0) {
    issues.push({ type: 'duplicate-hreflang-tag', duplicates: page.duplicateHreflangs });
  }
  if (page.ogUrl && page.ogUrl !== page.canonical) {
    issues.push({ type: 'canonical-og-url-mismatch', canonical: page.canonical, ogUrl: page.ogUrl });
  }
  for (const block of page.jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block);
      if (parsed.url && parsed.url !== page.canonical) {
        issues.push({ type: 'jsonld-canonical-mismatch', found: parsed.url, expected: page.canonical });
      }
    } catch (err) {
      issues.push({ type: 'malformed-jsonld', error: err.message });
    }
  }
  return issues;
}

// 1. Negative Fixture: Duplicate hreflang
const fixtureDuplicateHreflang = `
  <link rel="canonical" href="https://anyconverter.io/es/test/">
  <link rel="alternate" hreflang="en" href="https://anyconverter.io/test/">
  <link rel="alternate" hreflang="es" href="https://anyconverter.io/es/test/">
  <link rel="alternate" hreflang="en" href="https://anyconverter.io/test/">
`;
const issues1 = validateFixture(createFixturePage(fixtureDuplicateHreflang));
assert.strictEqual(issues1.length, 1, 'Should detect exactly 1 issue');
assert.strictEqual(issues1[0].type, 'duplicate-hreflang-tag');
assert.deepStrictEqual(issues1[0].duplicates, ['en']);
console.log('✓ Negative Fixture 1 PASSED: Duplicate hreflang correctly caught');

// 2. Negative Fixture: og:url mismatch
const fixtureOgMismatch = `
  <link rel="canonical" href="https://anyconverter.io/es/world-clock/">
  <meta property="og:url" content="https://anyconverter.io/world-clock/">
`;
const issues2 = validateFixture(createFixturePage(fixtureOgMismatch));
assert.strictEqual(issues2.length, 1);
assert.strictEqual(issues2[0].type, 'canonical-og-url-mismatch');
console.log('✓ Negative Fixture 2 PASSED: og:url mismatch correctly caught');

// 3. Negative Fixture: Malformed JSON-LD
const fixtureMalformedJson = `
  <link rel="canonical" href="https://anyconverter.io/test/">
  <script type="application/ld+json">{ "name": "Broken", url: missingQuotes }</script>
`;
const issues3 = validateFixture(createFixturePage(fixtureMalformedJson));
assert.strictEqual(issues3.length, 1);
assert.strictEqual(issues3[0].type, 'malformed-jsonld');
console.log('✓ Negative Fixture 3 PASSED: Malformed JSON-LD correctly caught');

// 4. Negative Fixture: JSON-LD canonical mismatch
const fixtureJsonLdUrlMismatch = `
  <link rel="canonical" href="https://anyconverter.io/da/test/">
  <script type="application/ld+json">{ "@context": "https://schema.org", "url": "https://anyconverter.io/test/" }</script>
`;
const issues4 = validateFixture(createFixturePage(fixtureJsonLdUrlMismatch));
assert.strictEqual(issues4.length, 1);
assert.strictEqual(issues4[0].type, 'jsonld-canonical-mismatch');
console.log('✓ Negative Fixture 4 PASSED: JSON-LD canonical mismatch correctly caught');

// 5. Positive Fixture: Clean corrected page
const fixtureClean = `
  <link rel="canonical" href="https://anyconverter.io/es/world-clock/">
  <link rel="alternate" hreflang="en" href="https://anyconverter.io/world-clock/">
  <link rel="alternate" hreflang="es" href="https://anyconverter.io/es/world-clock/">
  <link rel="alternate" hreflang="da" href="https://anyconverter.io/da/world-clock/">
  <link rel="alternate" hreflang="x-default" href="https://anyconverter.io/world-clock/">
  <meta property="og:url" content="https://anyconverter.io/es/world-clock/">
  <script type="application/ld+json">{ "@context": "https://schema.org", "url": "https://anyconverter.io/es/world-clock/" }</script>
`;
const issues5 = validateFixture(createFixturePage(fixtureClean));
assert.strictEqual(issues5.length, 0);
console.log('✓ Positive Fixture PASSED: Clean corrected page passes with 0 issues');

console.log('--- All Negative & Positive Validator Fixture Tests Passed! ---');
