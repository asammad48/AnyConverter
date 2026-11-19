#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   TEST: SPRINT S09 STRIKING-DISTANCE (ES + DA)     ');
console.log('====================================================\n');

const targetPages = [
  // Spanish Cohort
  { slug: 'sticky-notes', lang: 'es', file: 'es/sticky-notes/index.html', isDc: false },
  { slug: 'monitor-color-test', lang: 'es', file: 'es/monitor-color-test/index.html', isDc: false },
  { slug: 'base64-encoder', lang: 'es', file: 'es/base64-encoder/index.html', isDc: false },
  { slug: 'ocr-pdf', lang: 'es', file: 'es/ocr-pdf/index.html', isDc: false },
  { slug: 'pdf-merge', lang: 'es', file: 'es/pdf-merge/index.html', isDc: true },
  { slug: 'rotate-pdf', lang: 'es', file: 'es/rotate-pdf/index.html', isDc: true },
  { slug: 'text-diff-checker', lang: 'es', file: 'es/text-diff-checker/index.html', isDc: false },
  { slug: 'compare-pdf', lang: 'es', file: 'es/compare-pdf/index.html', isDc: false },
  { slug: 'edit-pdf', lang: 'es', file: 'es/edit-pdf/index.html', isDc: false },
  { slug: 'json-formatter', lang: 'es', file: 'es/json-formatter/index.html', isDc: false },

  // Danish Cohort
  { slug: 'mortgage-calculator', lang: 'da', file: 'da/mortgage-calculator/index.html', isDc: false },
  { slug: 'loan-calculator', lang: 'da', file: 'da/loan-calculator/index.html', isDc: false },
  { slug: 'todo-list', lang: 'da', file: 'da/todo-list/index.html', isDc: false },
  { slug: 'bmi-calculator', lang: 'da', file: 'da/bmi-calculator/index.html', isDc: false },
  { slug: 'invoice-generator', lang: 'da', file: 'da/invoice-generator/index.html', isDc: false },
  { slug: 'pdf-compress', lang: 'da', file: 'da/pdf-compress/index.html', isDc: true },
  { slug: 'pdf-to-jpg', lang: 'da', file: 'da/pdf-to-jpg/index.html', isDc: true },
  { slug: 'jpg-to-pdf', lang: 'da', file: 'da/jpg-to-pdf/index.html', isDc: true },
  { slug: 'ocr-pdf', lang: 'da', file: 'da/ocr-pdf/index.html', isDc: false },
  { slug: 'word-counter', lang: 'da', file: 'da/word-counter/index.html', isDc: false }
];

let totalAssertions = 0;

targetPages.forEach(({ slug, lang, file, isDc }, idx) => {
  const filePath = path.join(process.cwd(), file);
  assert(fs.existsSync(filePath), `[FAIL] Missing file: ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');

  console.log(`[CHECK ${idx + 1}/20] Verifying ${file}...`);

  // 1. Title verification
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  assert(titleMatch, `[FAIL] ${file}: Missing <title> tag`);
  const title = titleMatch[1].trim();
  assert(
    title.endsWith('| AnyConverter'),
    `[FAIL] ${file}: Title does not end with '| AnyConverter' (found: "${title}")`
  );
  assert(
    title.length <= 60,
    `[FAIL] ${file}: Title exceeds 60 characters (${title.length} chars: "${title}")`
  );
  totalAssertions += 2;

  // 2. Meta description verification
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  assert(descMatch, `[FAIL] ${file}: Missing <meta name="description"> tag`);
  const desc = descMatch[1].trim();
  assert(
    desc.length >= 140 && desc.length <= 160,
    `[FAIL] ${file}: Meta description length outside 140–160 bounds (${desc.length} chars: "${desc}")`
  );
  totalAssertions += 2;

  // 3. Open Graph and Twitter mirroring
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([\s\S]*?)["']/i);
  assert(ogTitleMatch, `[FAIL] ${file}: Missing <meta property="og:title">`);
  assert.strictEqual(
    ogTitleMatch[1].trim(),
    title,
    `[FAIL] ${file}: og:title does not match <title>`
  );

  const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([\s\S]*?)["']/i);
  assert(ogDescMatch, `[FAIL] ${file}: Missing <meta property="og:description">`);
  assert.strictEqual(
    ogDescMatch[1].trim(),
    desc,
    `[FAIL] ${file}: og:description does not match meta description`
  );

  const twTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([\s\S]*?)["']/i);
  assert(twTitleMatch, `[FAIL] ${file}: Missing <meta name="twitter:title">`);
  assert.strictEqual(
    twTitleMatch[1].trim(),
    title,
    `[FAIL] ${file}: twitter:title does not match <title>`
  );

  const twDescMatch = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([\s\S]*?)["']/i);
  assert(twDescMatch, `[FAIL] ${file}: Missing <meta name="twitter:description">`);
  assert.strictEqual(
    twDescMatch[1].trim(),
    desc,
    `[FAIL] ${file}: twitter:description does not match meta description`
  );
  totalAssertions += 8;

  // 4. Canonical and Hreflang integrity
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i);
  assert(canonicalMatch, `[FAIL] ${file}: Missing canonical link`);
  const expectedCanonical = `https://anyconverter.io/${lang}/${slug}/`;
  assert.strictEqual(
    canonicalMatch[1].trim(),
    expectedCanonical,
    `[FAIL] ${file}: Canonical mismatch. Expected "${expectedCanonical}", found "${canonicalMatch[1].trim()}"`
  );

  const hreflangEn = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']([\s\S]*?)["']/i);
  const hreflangEs = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']es["']\s+href=["']([\s\S]*?)["']/i);
  const hreflangDa = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']da["']\s+href=["']([\s\S]*?)["']/i);
  const hreflangX = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']\s+href=["']([\s\S]*?)["']/i);

  assert(hreflangEn, `[FAIL] ${file}: Missing hreflang="en"`);
  assert(hreflangEs, `[FAIL] ${file}: Missing hreflang="es"`);
  assert(hreflangDa, `[FAIL] ${file}: Missing hreflang="da"`);
  assert(hreflangX, `[FAIL] ${file}: Missing hreflang="x-default"`);

  assert.strictEqual(hreflangEn[1].trim(), `https://anyconverter.io/${slug}/`);
  assert.strictEqual(hreflangEs[1].trim(), `https://anyconverter.io/es/${slug}/`);
  assert.strictEqual(hreflangDa[1].trim(), `https://anyconverter.io/da/${slug}/`);
  assert.strictEqual(hreflangX[1].trim(), `https://anyconverter.io/${slug}/`);
  totalAssertions += 10;

  // 5. FAQPage JSON-LD schema verification
  let faqSchema = null;
  const scriptRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@type'] === 'FAQPage') {
        faqSchema = parsed;
        break;
      } else if (parsed['@graph']) {
        const found = parsed['@graph'].find(x => x['@type'] === 'FAQPage');
        if (found) {
          faqSchema = found;
          break;
        }
      }
    } catch (e) {
      assert.fail(`[FAIL] ${file}: JSON-LD parse error: ${e.message}`);
    }
  }

  assert(faqSchema, `[FAIL] ${file}: No FAQPage schema found in HTML`);
  assert(Array.isArray(faqSchema.mainEntity), `[FAIL] ${file}: FAQPage.mainEntity is not an array`);
  const schemaFaqs = faqSchema.mainEntity;
  assert(
    schemaFaqs.length >= 4 && schemaFaqs.length <= 6,
    `[FAIL] ${file}: FAQ count (${schemaFaqs.length}) outside required range of 4–6`
  );
  totalAssertions += 3;

  // 6. Verbatim Parity check between Schema and Visible HTML
  schemaFaqs.forEach((item, qIdx) => {
    assert.strictEqual(item['@type'], 'Question', `[FAIL] ${file} FAQ #${qIdx + 1} type is not 'Question'`);
    assert(item.name && item.name.trim().length > 10, `[FAIL] ${file} FAQ #${qIdx + 1} question title is missing or too short`);
    assert(item.acceptedAnswer && item.acceptedAnswer['@type'] === 'Answer', `[FAIL] ${file} FAQ #${qIdx + 1} missing acceptedAnswer`);
    assert(item.acceptedAnswer.text && item.acceptedAnswer.text.trim().length > 15, `[FAIL] ${file} FAQ #${qIdx + 1} answer text is missing or too short`);

    const qText = item.name.trim();
    const aText = item.acceptedAnswer.text.trim();

    assert(
      html.includes(qText),
      `[FAIL] ${file}: Verbatim parity error: Question "${qText}" not found in visible HTML`
    );
    assert(
      html.includes(aText),
      `[FAIL] ${file}: Verbatim parity error: Answer for "${qText}" not found in visible HTML`
    );
    totalAssertions += 4;
  });

  // 7. SSR vs Template synchronization for dc-template tools
  if (isDc) {
    const mainHtml = html.split('<script type="text/x-dc-template"')[0];
    const templateHtml = html.split('<script type="text/x-dc-template"')[1];
    assert(templateHtml, `[FAIL] ${file}: Expected <script type="text/x-dc-template">`);

    schemaFaqs.forEach(item => {
      assert(
        mainHtml.includes(item.name.trim()),
        `[FAIL] ${file}: SSR section missing question: "${item.name.trim()}"`
      );
      assert(
        templateHtml.includes(item.name.trim()),
        `[FAIL] ${file}: Template section missing question: "${item.name.trim()}"`
      );
      totalAssertions += 2;
    });
  }

  // 8. Privacy claims check: no absolute claims allowed
  const absolutePrivacyRegex = /(never leave|never leaves|forlader[^.\n]{0,80}aldrig|nunca sale[n]?\b|sendes aldrig)/i;
  assert(
    !absolutePrivacyRegex.test(html),
    `[FAIL] ${file}: Contains forbidden absolute privacy claim matching ${absolutePrivacyRegex}`
  );
  totalAssertions += 1;
});

console.log('\n====================================================');
console.log(`[PASS] All 20 S09 pages verified successfully! (${totalAssertions} assertions passed)`);
console.log('====================================================');
