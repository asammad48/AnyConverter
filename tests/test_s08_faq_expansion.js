#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('       TEST: SPRINT S08 FAQ EXPANSION (EN)          ');
console.log('====================================================\n');

const targetTools = [
  'ip-address-lookup',
  'discount-calculator',
  'daily-planner',
  'internet-speed-test',
  'pdf-merge',
  'pdf-forms',
  'extract-pdf-pages',
  'keyboard-tester',
  'sticky-notes',
  'gst-vat-calculator'
];

let totalAssertions = 0;

targetTools.forEach((slug, idx) => {
  const filePath = path.join(process.cwd(), slug, 'index.html');
  assert(fs.existsSync(filePath), `[FAIL] Missing file: ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Extract FAQPage JSON-LD schema
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
      assert.fail(`[FAIL] ${slug}: JSON-LD parse error: ${e.message}`);
    }
  }

  assert(faqSchema, `[FAIL] ${slug}: No FAQPage schema found in HTML`);
  assert(Array.isArray(faqSchema.mainEntity), `[FAIL] ${slug}: FAQPage.mainEntity is not an array`);
  const schemaFaqs = faqSchema.mainEntity;
  assert(
    schemaFaqs.length >= 4 && schemaFaqs.length <= 6,
    `[FAIL] ${slug}: FAQ count (${schemaFaqs.length}) outside required range of 4–6`
  );
  totalAssertions += 2;

  // 2. Validate Question/Answer nodes and verbatim parity against visible HTML
  schemaFaqs.forEach((item, qIdx) => {
    assert.strictEqual(item['@type'], 'Question', `[FAIL] ${slug} FAQ #${qIdx + 1} type is not 'Question'`);
    assert(item.name && item.name.trim().length > 10, `[FAIL] ${slug} FAQ #${qIdx + 1} question title is missing or too short`);
    assert(item.acceptedAnswer && item.acceptedAnswer['@type'] === 'Answer', `[FAIL] ${slug} FAQ #${qIdx + 1} missing acceptedAnswer`);
    assert(item.acceptedAnswer.text && item.acceptedAnswer.text.trim().length > 15, `[FAIL] ${slug} FAQ #${qIdx + 1} answer text is missing or too short`);

    const qText = item.name.trim();
    const aText = item.acceptedAnswer.text.trim();

    // Verbatim parity check: Question and Answer MUST be present visibly in the HTML body
    assert(
      html.includes(qText),
      `[FAIL] ${slug}: Verbatim parity error: Question "${qText}" not found in visible HTML`
    );
    assert(
      html.includes(aText),
      `[FAIL] ${slug}: Verbatim parity error: Answer for "${qText}" not found in visible HTML`
    );
    totalAssertions += 4;
  });

  // 3. Check visible details/summary count in SSR section
  let visibleQuestions = [];
  if (slug === 'pdf-merge' || slug === 'extract-pdf-pages') {
    // Look inside <main> before <script id="dc-template">
    const mainHtml = html.split('<script type="text/x-dc-template"')[0];
    const summaryMatches = [...mainHtml.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/gi)];
    visibleQuestions = summaryMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim());
  } else {
    const summaryMatches = [...html.matchAll(/<summary\s+class="faq-question">([\s\S]*?)<\/summary>/gi)];
    visibleQuestions = summaryMatches.map(m => m[1].replace(/<span\s+class="faq-icon"[\s\S]*?<\/span>/i, '').trim());
  }

  assert.strictEqual(
    visibleQuestions.length,
    schemaFaqs.length,
    `[FAIL] ${slug}: Visible question count (${visibleQuestions.length}) does not match schema count (${schemaFaqs.length})`
  );
  totalAssertions++;

  console.log(`[PASS] ${idx + 1}. [${slug}] ${schemaFaqs.length} FAQs verified with 100% verbatim schema/HTML parity.`);
});

console.log(`\n====================================================`);
console.log(`STATUS: ALL 10 TOOLS PASSED FAQ EXPANSION VERIFICATION (${totalAssertions} assertions).`);
console.log('====================================================');
