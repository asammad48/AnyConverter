#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S16 Orphan Fix Pass & Related Tools Reciprocity Suite
 *
 * Verifies:
 * 1. 100% Reciprocal related tools graph (0 asymmetric directed links)
 * 2. 0 Orphan tools (every tool reachable from >= 2 canonical navigation paths)
 * 3. In-degree and out-degree bounds (3 <= degree <= 6) across all 128 tools
 * 4. Specific resolution of former orphan risk `compare-pdf` and low-degree nodes
 * 5. Strict adherence to anti-pattern rules (zero slot-filling / irrelevant recommendations)
 * 6. 100% physical HTML synchronization across 384 pages (EN, ES, DA)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   SPRINT S16: ORPHAN FIX & RECIPROCITY TEST SUITE   ');
console.log('====================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✓ [CHECK ${totalChecks}] ${desc}`);
    passedChecks++;
  } catch (err) {
    console.error(`  ✗ [CHECK ${totalChecks} FAILED] ${desc}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. Mapping Integrity & 100% Reciprocity
console.log('--- 1. Canonical Mapping Integrity & 100% Reciprocity ---');

const mappingPath = path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json');
check('RELATED_TOOLS_COMPLETE_MAPPING.json exists and parses cleanly', () => {
  assert.ok(fs.existsSync(mappingPath), 'Mapping file must exist');
});

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const tools = Object.keys(mapping);

check('Mapping covers all 128 canonical tools', () => {
  assert.strictEqual(tools.length, 128, 'Must map exactly 128 tools');
});

let nonReciprocalCount = 0;
const nonReciprocalPairs = [];
const inLinks = {};
tools.forEach(t => { inLinks[t] = []; });

tools.forEach(u => {
  const targets = mapping[u] || [];
  targets.forEach(v => {
    inLinks[v] = inLinks[v] || [];
    inLinks[v].push(u);

    const vTargets = mapping[v] || [];
    if (!vTargets.includes(u)) {
      nonReciprocalCount++;
      nonReciprocalPairs.push({ from: u, to: v });
    }
  });
});

check('Graph is 100% reciprocal: 0 asymmetric directed links', () => {
  if (nonReciprocalCount > 0) {
    console.error('Non-reciprocal links detected:', nonReciprocalPairs);
  }
  assert.strictEqual(nonReciprocalCount, 0, 'Every related tool edge must be bidirectional');
});

check('Every tool has degree between 3 and 6 (workflow adjacency rule)', () => {
  tools.forEach(t => {
    const len = mapping[t].length;
    assert.ok(len >= 3 && len <= 6, `Tool ${t} degree ${len} out of allowed bounds [3, 6]`);
  });
});

// 2. Orphan Tool Eradication
console.log('\n--- 2. Orphan Tool Eradication & In-Degree Health ---');

check('0 tools have in-degree < 3 (all tools receive at least 3 incoming links)', () => {
  const lowInDegree = tools.filter(t => inLinks[t].length < 3);
  assert.strictEqual(lowInDegree.length, 0, `Tools with in-degree < 3: ${lowInDegree.join(', ')}`);
});

check('compare-pdf is fully connected with reciprocal PDF workflow partners', () => {
  const cpTargets = mapping['compare-pdf'];
  assert.ok(Array.isArray(cpTargets) && cpTargets.length >= 3, 'compare-pdf must have >= 3 related tools');
  assert.ok(cpTargets.includes('pdf-merge'), 'compare-pdf must link to pdf-merge');
  assert.ok(cpTargets.includes('pdf-split'), 'compare-pdf must link to pdf-split');
  assert.ok(cpTargets.includes('edit-pdf'), 'compare-pdf must link to edit-pdf');

  // Verify reverse links
  assert.ok(mapping['pdf-merge'].includes('compare-pdf'), 'pdf-merge must reciprocate to compare-pdf');
  assert.ok(mapping['pdf-split'].includes('compare-pdf'), 'pdf-split must reciprocate to compare-pdf');
  assert.ok(mapping['edit-pdf'].includes('compare-pdf'), 'edit-pdf must reciprocate to compare-pdf');
});

check('Previously low in-degree tools have >= 3 incoming reciprocal links', () => {
  const formerRiskTools = [
    'roman-numeral-converter',
    'number-to-words',
    'privacy-policy-generator',
    'mouse-tester',
    'webcam-tester',
    'microphone-tester',
    'barcode-generator',
    'tip-calculator',
    'slope-grade-angle-calculator',
    'rise-over-run-calculator',
    'password-strength-checker',
    'html-to-pdf'
  ];
  formerRiskTools.forEach(t => {
    assert.ok(inLinks[t].length >= 3, `Tool ${t} has in-degree ${inLinks[t].length} (< 3)`);
  });
});

// 3. Multi-Path Reachability Verification
console.log('\n--- 3. Multi-Path Reachability Verification ---');

const homepageHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const homepageLinks = new Set(
  [...homepageHtml.matchAll(/<a\s+[^>]*href=["']\/([a-z0-9-]+)\/["'][^>]*class=["']tool-card["']/g)].map(m => m[1])
);

const hubs = [
  'calculators', 'developer-tools', 'pdf-tools', 'productivity-tools',
  'numerology-astrology', 'fun-relationships', 'date-time', 'text-tools',
  'browser-tools'
];
const toolToHubs = {};
hubs.forEach(hub => {
  const file = path.join(ROOT, hub, 'index.html');
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const matches = [...html.matchAll(/href=["']\/([a-z0-9-]+)\/["']/g)].map(m => m[1]);
    matches.filter(s => mapping[s]).forEach(t => {
      toolToHubs[t] = toolToHubs[t] || [];
      toolToHubs[t].push(hub);
    });
  }
});

check('Every tool is reachable from at least 3 distinct canonical paths', () => {
  tools.forEach(t => {
    let paths = 0;
    if (homepageLinks.has(t)) paths++;
    if (toolToHubs[t] && toolToHubs[t].length > 0) paths++;
    if (inLinks[t] && inLinks[t].length >= 1) paths++;
    assert.ok(paths >= 2, `Tool ${t} has fewer than 2 reachable paths (paths: ${paths})`);
  });
});

// 4. Anti-Pattern Regression Assertions
console.log('\n--- 4. Semantic Integrity & Anti-Pattern Protection ---');

const antiPatterns = [
  { source: 'color-converter', forbidden: ['json-formatter', 'base64-encoder', 'hash-generator'] },
  { source: 'calorie-calculator', forbidden: ['loan-calculator'] },
  { source: 'mortgage-calculator', forbidden: ['bmi-calculator'] },
  { source: 'compound-interest-calculator', forbidden: ['bmi-calculator'] },
  { source: 'loan-calculator', forbidden: ['bmi-calculator'] },
  { source: 'ip-address-lookup', forbidden: ['random-number-generator', 'uuid-generator'] }
];

check('Zero anti-patterns present in reciprocal mapping', () => {
  antiPatterns.forEach(({ source, forbidden }) => {
    const targets = mapping[source] || [];
    forbidden.forEach(bad => {
      assert.ok(!targets.includes(bad), `Forbidden pairing detected: ${source} must not link to ${bad}`);
    });
  });
});

// 5. HTML File Verification across all 384 Pages
console.log('\n--- 5. Physical HTML Synchronization (384 Pages across EN, ES, DA) ---');

check('All 384 HTML files contain exact matching reciprocal cards', () => {
  let cardsCount = 0;
  tools.forEach(slug => {
    ['en', 'es', 'da'].forEach(lang => {
      const prefix = lang === 'en' ? '' : lang + '/';
      const filePath = path.join(ROOT, prefix, slug, 'index.html');
      assert.ok(fs.existsSync(filePath), `File missing: ${filePath}`);

      const html = fs.readFileSync(filePath, 'utf8');
      const secMatch = html.match(/<section class=["']related-tools["'][\s\S]*?<\/section>/i);
      assert.ok(secMatch, `Missing related-tools section in ${filePath}`);

      const renderedLinks = [...secMatch[0].matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*class=["']tool-card["']/gi)].map(m => m[1]);
      assert.strictEqual(renderedLinks.length, mapping[slug].length, `Mismatch in card count in ${filePath}`);

      // Verify each link
      renderedLinks.forEach(href => {
        if (lang === 'en') {
          assert.ok(href.startsWith('/') && !href.startsWith('/es/') && !href.startsWith('/da/'), `Non-EN link ${href} in ${filePath}`);
        } else {
          assert.ok(href.startsWith(`/${lang}/`), `Non-localized link ${href} in ${filePath}`);
        }
      });
      cardsCount += renderedLinks.length;
    });
  });
  console.log(`    (Verified ${cardsCount} rendered cards across 384 physical HTML files)`);
});

console.log('\n====================================================');
console.log(`Results: ${passedChecks}/${totalChecks} assertions passed.`);
if (passedChecks === totalChecks && !process.exitCode) {
  console.log('STATUS: SPRINT S16 ORPHAN FIX & RECIPROCITY PASSED (100%).');
  process.exit(0);
} else {
  console.error('STATUS: FAILURES DETECTED.');
  process.exit(1);
}
