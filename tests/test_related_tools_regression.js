#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Related Tools Semantic Integrity & Workflow Suite ---');

const mapping = JSON.parse(fs.readFileSync('RELATED_TOOLS_COMPLETE_MAPPING.json', 'utf8'));
const slugs = Object.keys(mapping);
assert.strictEqual(slugs.length, 128, 'Must map all 128 tools canonically');

// 1. Audit canonical mapping for integrity
for (const slug of slugs) {
  const targets = mapping[slug];
  assert(Array.isArray(targets) && targets.length >= 2, `Tool ${slug} must have at least 2 recommendations`);
  assert(!targets.includes(slug), `Tool ${slug} must not self-link`);
  const uniqueTargets = new Set(targets);
  assert.strictEqual(uniqueTargets.size, targets.length, `Tool ${slug} must have 0 duplicate recommendations`);
  
  for (const t of targets) {
    assert(mapping[t], `Target ${t} of ${slug} must exist in 128-tool inventory`);
  }
}
console.log('✓ Canonical mapping verified: 128 tools, 0 self-links, 0 broken targets, 0 duplicates');

// 2. Audit all 384 physical HTML files
let totalCardsChecked = 0;
for (const slug of slugs) {
  for (const lang of ['en', 'es', 'da']) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const filePath = path.join(prefix, slug, 'index.html');
    assert(fs.existsSync(filePath), `HTML file must exist: ${filePath}`);
    
    const html = fs.readFileSync(filePath, 'utf8');
    const secMatch = html.match(/<section class=["']related-tools["'][\s\S]*?<\/section>/i);
    assert(secMatch, `Related tools section must exist in ${filePath}`);
    
    const sectionHtml = secMatch[0];
    const linkMatches = [...sectionHtml.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*class=["']tool-card["']/gi)];
    assert(linkMatches.length >= 2, `Must render at least 2 tool cards in ${filePath}`);
    
    const renderedSlugs = [];
    for (const match of linkMatches) {
      const href = match[1];
      // Assert proper locale prefix
      if (lang === 'en') {
        assert(!href.startsWith('/es/') && !href.startsWith('/da/'), `EN page ${filePath} has non-EN link ${href}`);
        assert(href.startsWith('/') && href.endsWith('/'), `Malformed href ${href}`);
        const destSlug = href.replace(/^\/|\/$/g, '');
        assert(mapping[destSlug], `Destination slug ${destSlug} must exist in inventory`);
        renderedSlugs.push(destSlug);
      } else {
        const expectedPrefix = `/${lang}/`;
        assert(href.startsWith(expectedPrefix), `${lang.toUpperCase()} page ${filePath} has non-localized link ${href}`);
        const destSlug = href.slice(expectedPrefix.length).replace(/\/$/, '');
        assert(mapping[destSlug], `Destination slug ${destSlug} must exist in inventory`);
        renderedSlugs.push(destSlug);
      }
      totalCardsChecked++;
    }
    
    // Check no duplicates in rendered cards
    assert.strictEqual(new Set(renderedSlugs).size, renderedSlugs.length, `Duplicates found in ${filePath}`);
    // Check no self-links in rendered cards
    assert(!renderedSlugs.includes(slug), `Self-link found in ${filePath}`);
  }
}
console.log(`✓ Audited all 384 HTML pages: ${totalCardsChecked} total cards verified 100% valid, localized, and reachable`);

// 3. Negative assertions on previously reported slot-filling defects
const antiPatterns = [
  { source: 'color-converter', forbidden: ['json-formatter', 'base64-encoder', 'hash-generator'] },
  { source: 'calorie-calculator', forbidden: ['loan-calculator'] },
  { source: 'mortgage-calculator', forbidden: ['bmi-calculator'] },
  { source: 'compound-interest-calculator', forbidden: ['bmi-calculator'] },
  { source: 'loan-calculator', forbidden: ['bmi-calculator'] },
  { source: 'ip-address-lookup', forbidden: ['random-number-generator', 'uuid-generator'] }
];

for (const { source, forbidden } of antiPatterns) {
  const currentTargets = mapping[source];
  for (const bad of forbidden) {
    assert(!currentTargets.includes(bad), `Anti-pattern detected: ${source} must not recommend ${bad}`);
  }
}
console.log('✓ Anti-pattern regression tests passed: 0 slot-filling or irrelevant recommendations detected');

console.log('\nALL RELATED TOOLS REGRESSION TESTS PASSED!');
