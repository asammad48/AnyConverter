#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  TEST: SPRINT S07 STRIKING-DISTANCE METADATA (EN)   ');
console.log('====================================================\n');

const strikingTools = [
  {
    slug: 'ip-address-lookup',
    expectedKeyword: 'IP Address Lookup',
    expectedTitle: 'IP Address Lookup Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'discount-calculator',
    expectedKeyword: 'Discount Calculator',
    expectedTitle: 'Discount Calculator Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'daily-planner',
    expectedKeyword: 'Daily Planner',
    expectedTitle: 'Daily Planner Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'internet-speed-test',
    expectedKeyword: 'Internet Speed Test',
    expectedTitle: 'Internet Speed Test Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'pdf-merge',
    expectedKeyword: 'Merge PDF',
    expectedTitle: 'Merge PDF Files Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'pdf-forms',
    expectedKeyword: 'Fill PDF Forms',
    expectedTitle: 'Fill PDF Forms Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'extract-pdf-pages',
    expectedKeyword: 'Extract PDF Pages',
    expectedTitle: 'Extract PDF Pages Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'keyboard-tester',
    expectedKeyword: 'Keyboard Tester',
    expectedTitle: 'Keyboard Tester Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'sticky-notes',
    expectedKeyword: 'Sticky Notes',
    expectedTitle: 'Sticky Notes Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  },
  {
    slug: 'gst-vat-calculator',
    expectedKeyword: 'GST',
    expectedTitle: 'GST &amp; VAT Calculator Online Free | AnyConverter',
    minDesc: 140,
    maxDesc: 160
  }
];

let totalChecks = 0;

strikingTools.forEach((tool, index) => {
  const filePath = path.join(process.cwd(), tool.slug, 'index.html');
  assert(fs.existsSync(filePath), `[FAIL] Page missing: ${filePath}`);

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Title verification
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch, `[FAIL] ${tool.slug} missing <title> tag`);
  const title = titleMatch[1].trim();

  // Strip &amp; to & for visible length calculation
  const visibleTitle = title.replace(/&amp;/g, '&');
  assert(
    visibleTitle.length <= 60,
    `[FAIL] ${tool.slug} title length (${visibleTitle.length}) exceeds 60 characters: "${visibleTitle}"`
  );
  assert(
    title.endsWith('Online Free | AnyConverter'),
    `[FAIL] ${tool.slug} title does not end with 'Online Free | AnyConverter': "${title}"`
  );
  assert(
    visibleTitle.toLowerCase().includes(tool.expectedKeyword.toLowerCase()),
    `[FAIL] ${tool.slug} title missing primary keyword '${tool.expectedKeyword}'`
  );
  totalChecks++;

  // 2. Meta description verification
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  assert(descMatch, `[FAIL] ${tool.slug} missing meta description`);
  const desc = descMatch[1].trim();

  // Strip &quot; and &amp; for visible length
  const visibleDesc = desc.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  assert(
    visibleDesc.length >= tool.minDesc && visibleDesc.length <= tool.maxDesc,
    `[FAIL] ${tool.slug} meta description length (${visibleDesc.length}) outside ${tool.minDesc}-${tool.maxDesc} chars: "${visibleDesc}"`
  );
  totalChecks++;

  // 3. Open Graph mirroring
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  assert(ogTitleMatch, `[FAIL] ${tool.slug} missing og:title`);
  assert.strictEqual(
    ogTitleMatch[1],
    title,
    `[FAIL] ${tool.slug} og:title ("${ogTitleMatch[1]}") does not match <title> ("${title}")`
  );

  const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  assert(ogDescMatch, `[FAIL] ${tool.slug} missing og:description`);
  assert.strictEqual(
    ogDescMatch[1],
    desc,
    `[FAIL] ${tool.slug} og:description does not match meta description`
  );
  totalChecks++;

  // 4. Twitter tags mirroring
  const twTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
  assert(twTitleMatch, `[FAIL] ${tool.slug} missing twitter:title`);
  assert.strictEqual(
    twTitleMatch[1],
    title,
    `[FAIL] ${tool.slug} twitter:title does not match <title>`
  );

  const twDescMatch = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
  assert(twDescMatch, `[FAIL] ${tool.slug} missing twitter:description`);
  assert.strictEqual(
    twDescMatch[1],
    desc,
    `[FAIL] ${tool.slug} twitter:description does not match meta description`
  );
  totalChecks++;

  // 5. Canonical integrity
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  assert(canonicalMatch, `[FAIL] ${tool.slug} missing canonical link`);
  assert.strictEqual(
    canonicalMatch[1],
    `https://anyconverter.io/${tool.slug}/`,
    `[FAIL] ${tool.slug} canonical URL incorrect`
  );
  totalChecks++;

  // 6. 4-way Reciprocal Hreflang integrity
  ['en', 'es', 'da', 'x-default'].forEach(locale => {
    const hreflangRegex = new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${locale}["']\\s+href=["']([^"']+)["']`, 'i');
    const match = html.match(hreflangRegex);
    assert(match, `[FAIL] ${tool.slug} missing hreflang=${locale}`);
  });
  totalChecks++;

  console.log(`[PASS] ${index + 1}. [${tool.slug}] Title (${visibleTitle.length}c), Meta Desc (${visibleDesc.length}c), OG/Twitter mirrored, Canonical & Hreflang intact.`);
});

console.log(`\n====================================================`);
console.log(`STATUS: ALL ${strikingTools.length} STRIKING-DISTANCE PAGES PASSED (${totalChecks} assertions).`);
console.log('====================================================');
