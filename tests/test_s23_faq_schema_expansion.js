#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S23: FAQ Schema Expansion to Top 30 Pages (Days 45–46) Verification Suite
 *
 * Verifies:
 * 1. Physical existence of all 90 target HTML pages (Top 30 Tools × 3 locales: EN, ES, DA).
 * 2. FAQ Count Range (4–7 FAQs per page):
 *    - Every page must contain between 4 and 7 high-intent FAQs in both visible HTML and schema.
 * 3. 100% Verbatim Parity:
 *    - Character-for-character match between visible HTML questions and FAQPage JSON-LD question names.
 *    - Character-for-character match between visible HTML answers and FAQPage JSON-LD answer texts.
 * 4. FAQ Schema Structure & Validity:
 *    - Valid JSON-LD parsing for all 90 URLs.
 *    - Structured with @context: "https://schema.org", @type: "FAQPage", and mainEntity array.
 *    - Every entity contains @type: "Question" and acceptedAnswer with @type: "Answer".
 * 5. Multi-Locale Canonical & Reciprocal 4-Way Hreflang Integrity:
 *    - Self-referential canonical URL on all 90 pages.
 *    - 4-way reciprocal alternates: en, es, da, x-default.
 * 6. Track B Loop 8 Outreach Execution Monitoring:
 *    - Verified status in docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md with strict manual sending policy.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  SPRINT S23: FAQ SCHEMA EXPANSION (TOP 30 PAGES)   ');
console.log('====================================================\n');

const TOP_30_TOOLS = [
  'json-formatter', 'percentage-calculator', 'age-calculator', 'loan-calculator',
  'ip-address-lookup', 'base64-encoder', 'url-encoder', 'bmi-calculator',
  'discount-calculator', 'pdf-merge', 'pdf-split', 'edit-pdf', 'pdf-compress',
  'csv-to-sql', 'jwt-decoder', 'hash-generator', 'timestamp-converter',
  'sleep-calculator', 'aspect-ratio-calculator', 'regex-tester', 'mortgage-calculator',
  'compound-interest-calculator', 'json-compare', 'xml-formatter', 'pay-rise-calculator',
  'percentage-difference-calculator', 'cron-expression-parser', 'uuid-generator',
  'word-counter', 'text-case-converter'
];

const LOCALES = [
  { prefix: '', lang: 'en', code: 'en' },
  { prefix: 'es/', lang: 'es', code: 'es' },
  { prefix: 'da/', lang: 'da', code: 'da' }
];

function cleanText(txt) {
  return (txt || '')
    .replace(/<span\s+class="faq-icon"[\s\S]*?<\/span>/gi, '')
    .replace(/<\/?(div|p|span|strong|em|code|b|i|a|br)\b[^>]*>/gi, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaqSchema(html) {
  const scriptRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@type'] === 'FAQPage') {
        return parsed;
      }
      if (parsed['@graph']) {
        const found = parsed['@graph'].find(x => x['@type'] === 'FAQPage');
        if (found) return found;
      }
    } catch (e) {}
  }
  return null;
}

function extractVisibleFaqs(html) {
  let searchHtml = html;
  if (html.includes('<script type="text/x-dc-template"')) {
    searchHtml = html.split('<script type="text/x-dc-template"')[0];
  }

  const visibleFaqs = [];
  const detailsRegex = /<details[\s\S]*?>([\s\S]*?)<\/details>/gi;
  let dMatch;
  while ((dMatch = detailsRegex.exec(searchHtml)) !== null) {
    const dContent = dMatch[1];
    const qMatch = dContent.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    if (qMatch) {
      const q = cleanText(qMatch[1]);
      // Filter out non-FAQ toggles like "Show the working"
      if (q.toLowerCase().includes('show the working') ||
          q.toLowerCase().includes('ver el procedimiento') ||
          q.toLowerCase().includes('ver el cálculo') ||
          q.toLowerCase().includes('vis udregning')) {
        continue;
      }
      const aHtml = dContent.replace(/<summary[\s\S]*?<\/summary>/i, '');
      const a = cleanText(aHtml);
      if (q.length > 5) {
        visibleFaqs.push({ q, a });
      }
    }
  }
  return visibleFaqs;
}

// -------------------------------------------------------------
// CHECK 1: Physical Existence of all 90 HTML Pages
// -------------------------------------------------------------
console.log('[CHECK 1] Auditing physical existence of 90 pages (30 tools × 3 locales)...');
let totalPagesChecked = 0;
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    assert.ok(fs.existsSync(pagePath), `Missing file: ${pagePath}`);
    totalPagesChecked++;
  }
}
console.log(`  ✓ All ${totalPagesChecked} HTML pages physically exist.\n`);

// -------------------------------------------------------------
// CHECK 2 & 3: FAQ Count Range (4–7) & FAQPage Schema Validity
// -------------------------------------------------------------
console.log('[CHECK 2] Validating FAQ count range (4–7 FAQs) and schema structure...');
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    const html = fs.readFileSync(pagePath, 'utf8');
    const schema = extractFaqSchema(html);

    assert.ok(schema, `Missing FAQPage JSON-LD schema in ${loc.prefix}${tool}/index.html`);
    assert.strictEqual(schema['@type'], 'FAQPage', `Expected @type FAQPage in ${loc.prefix}${tool}/index.html`);
    assert.ok(Array.isArray(schema.mainEntity), `mainEntity is not an array in ${loc.prefix}${tool}/index.html`);

    const count = schema.mainEntity.length;
    assert.ok(
      count >= 4 && count <= 7,
      `FAQ count out of range (4–7) in ${loc.prefix}${tool}/index.html: found ${count}`
    );

    for (let i = 0; i < schema.mainEntity.length; i++) {
      const item = schema.mainEntity[i];
      assert.strictEqual(item['@type'], 'Question', `Item ${i} not Question in ${loc.prefix}${tool}/index.html`);
      assert.ok(item.name && item.name.length > 5, `Empty Question name at ${i} in ${loc.prefix}${tool}/index.html`);
      assert.ok(item.acceptedAnswer, `Missing acceptedAnswer at ${i} in ${loc.prefix}${tool}/index.html`);
      assert.strictEqual(item.acceptedAnswer['@type'], 'Answer', `Answer type invalid at ${i} in ${loc.prefix}${tool}/index.html`);
      assert.ok(item.acceptedAnswer.text && item.acceptedAnswer.text.length > 10, `Empty Answer text at ${i} in ${loc.prefix}${tool}/index.html`);
    }
  }
}
console.log('  ✓ All 90 pages contain valid FAQPage schema with 4–7 questions and answers.\n');

// -------------------------------------------------------------
// CHECK 3: 100% Verbatim Parity (Visible HTML vs JSON-LD Schema)
// -------------------------------------------------------------
console.log('[CHECK 3] Enforcing 100% verbatim parity between visible FAQs and FAQPage schema...');
let totalFaqsVerified = 0;
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    const html = fs.readFileSync(pagePath, 'utf8');

    const schema = extractFaqSchema(html);
    const visibleFaqs = extractVisibleFaqs(html);
    const schemaFaqs = schema.mainEntity;

    assert.strictEqual(
      visibleFaqs.length,
      schemaFaqs.length,
      `Count mismatch in ${loc.prefix}${tool}/index.html: visible has ${visibleFaqs.length}, schema has ${schemaFaqs.length}`
    );

    for (let i = 0; i < schemaFaqs.length; i++) {
      const sItem = schemaFaqs[i];
      const sQ = cleanText(sItem.name);
      const sA = cleanText(sItem.acceptedAnswer.text);

      const vItem = visibleFaqs[i];
      assert.strictEqual(
        vItem.q,
        sQ,
        `Question mismatch at index ${i} in ${loc.prefix}${tool}/index.html:\n  Visible: "${vItem.q}"\n  Schema:  "${sQ}"`
      );

      assert.strictEqual(
        vItem.a,
        sA,
        `Answer mismatch at index ${i} in ${loc.prefix}${tool}/index.html:\n  Visible: "${vItem.a}"\n  Schema:  "${sA}"`
      );

      totalFaqsVerified++;
    }
  }
}
console.log(`  ✓ 100% verbatim parity verified across all ${totalFaqsVerified} FAQs on all 90 URLs.\n`);

// -------------------------------------------------------------
// CHECK 4: Multi-Locale Canonical & Reciprocal 4-Way Hreflang Integrity
// -------------------------------------------------------------
console.log('[CHECK 4] Auditing canonical URLs and 4-way reciprocal hreflang alternates...');
for (const tool of TOP_30_TOOLS) {
  for (const loc of LOCALES) {
    const pagePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    const html = fs.readFileSync(pagePath, 'utf8');

    const expectedCanonical = `https://anyconverter.io/${loc.prefix}${tool}/`;
    assert.ok(
      html.includes(`<link rel="canonical" href="${expectedCanonical}">`),
      `Invalid canonical in ${loc.prefix}${tool}/index.html: expected ${expectedCanonical}`
    );

    assert.ok(
      html.includes(`hreflang="en" href="https://anyconverter.io/${tool}/"`),
      `Missing hreflang en in ${loc.prefix}${tool}/index.html`
    );
    assert.ok(
      html.includes(`hreflang="es" href="https://anyconverter.io/es/${tool}/"`),
      `Missing hreflang es in ${loc.prefix}${tool}/index.html`
    );
    assert.ok(
      html.includes(`hreflang="da" href="https://anyconverter.io/da/${tool}/"`),
      `Missing hreflang da in ${loc.prefix}${tool}/index.html`
    );
    assert.ok(
      html.includes(`hreflang="x-default" href="https://anyconverter.io/${tool}/"`),
      `Missing hreflang x-default in ${loc.prefix}${tool}/index.html`
    );
  }
}
console.log('  ✓ 100% reciprocal 4-way hreflang alternates and self-canonical URLs verified across all 90 pages.\n');

// -------------------------------------------------------------
// CHECK 5: Track B Loop 8 Outreach Execution Monitoring
// -------------------------------------------------------------
console.log('[CHECK 5] Auditing Track B Loop 8 outreach execution monitoring and compliance...');
const outreachPath = path.join(ROOT, 'docs', 'growth', 'outreach', 'LOOP_8_BATCH_2_PROSPECTS.md');
assert.ok(fs.existsSync(outreachPath), 'Missing LOOP_8_BATCH_2_PROSPECTS.md');
const outreach = fs.readFileSync(outreachPath, 'utf8');
assert.ok(outreach.includes('Sprint S23'), 'Missing Sprint S23 tracking in LOOP_8_BATCH_2_PROSPECTS.md');
assert.ok(outreach.includes('STRICTLY MANUAL SEND VIA OWNER MAILBOX'), 'Missing manual send compliance notice');
console.log('  ✓ Track B Loop 8 outreach execution monitoring verified.\n');

console.log('====================================================');
console.log('  ALL SPRINT S23 VERIFICATION CHECKS PASSED (5/5)     ');
console.log('====================================================');
process.exit(0);
