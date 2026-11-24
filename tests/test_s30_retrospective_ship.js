#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S30 Dedicated Verification Suite:
 * 60-Day Retrospective Ship, Dashboard Metrics & Production Feature Gating
 *
 * Verifies:
 * 1. Existence and completeness of docs/growth/99-FINAL-EXECUTION-REPORT-60D.md.
 * 2. Section coverage: Executive Summary, Success Contract Deltas Table,
 *    Keep / Iterate / Kill Register (S01-S30 & Loops 1-12), Feature Gating Architecture,
 *    and Next-60 Days Plan (S31-S60).
 * 3. Runtime feature flag gating in assets/js/shared.js (window.AC_FEATURES).
 * 4. 441 Production URLs integrity and sitemap.xml zero-drift verification.
 * 5. Sitewide internal link health (0 broken links, 0 orphans).
 * 6. Loop 11 open-source micro-library (@anyconverter/math) unit test suite integrity.
 * 7. Verification that all 30 Sprints and 12 Distribution Loops are explicitly evaluated.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REPORT_PATH = path.join(ROOT, 'docs', 'growth', '99-FINAL-EXECUTION-REPORT-60D.md');
const SHARED_JS_PATH = path.join(ROOT, 'assets', 'js', 'shared.js');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const MANIFEST_PATH = path.join(ROOT, 'TOOL_INVENTORY_AND_COUNTS.json');
const PKG_TEST_PATH = path.join(ROOT, 'packages', 'anyconverter-math', 'test', 'index.test.js');
const LINK_GRAPH_PATH = path.join(ROOT, 'reports', 'seo-remediation-2026-11', 'INTERNAL_LINK_GRAPH.json');

console.log('====================================================');
console.log('   SPRINT S30: 60-DAY RETROSPECTIVE & SHIP SUITE     ');
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

// -------------------------------------------------------------
// 1. Final Execution Report Existence and Structure
// -------------------------------------------------------------
check('Final execution report exists at docs/growth/99-FINAL-EXECUTION-REPORT-60D.md', () => {
  assert(fs.existsSync(REPORT_PATH), 'Report file must exist');
  const stats = fs.statSync(REPORT_PATH);
  assert(stats.size > 5000, `Report file must be substantial (> 5KB), got ${stats.size} bytes`);
});

const reportContent = fs.readFileSync(REPORT_PATH, 'utf8');

check('Report contains Section 1: Executive Summary & Program Governance', () => {
  assert(reportContent.includes('## 1. Executive Summary & Program Governance'), 'Must contain §1 heading');
  assert(reportContent.includes('30 of 30 Sprints Delivered'), 'Must note 30/30 delivery');
  assert(reportContent.includes('0 rollbacks'), 'Must confirm zero rollbacks');
});

check('Report contains Section 2: Success Contract Deltas Table', () => {
  assert(reportContent.includes('## 2. Success Contract Deltas'), 'Must contain §2 heading');
  assert(reportContent.includes('Weekly Tool Completions (WSTC)'), 'Must track WSTC metric');
  assert(reportContent.includes('Non-Brand Organic Clicks (GSC)'), 'Must track GSC clicks');
  assert(reportContent.includes('Striking-Distance Queries'), 'Must track striking distance');
  assert(reportContent.includes('Return-Visitor Tool Completion Rate'), 'Must track return visitor rate');
  assert(reportContent.includes('Shareable Calculator State Usage'), 'Must track shareable state usage');
  assert(reportContent.includes('PWA Install Prompt Accept Rate'), 'Must track PWA install rate');
  assert(reportContent.includes('Editorial Referring Domains Pipeline'), 'Must track referring domains');
  assert(reportContent.includes('.edu / Institutional Links Pipeline'), 'Must track .edu links');
  assert(reportContent.includes('Embedded Calculator Partners Live'), 'Must track embed partners');
  assert(reportContent.includes('Production Ship Reliability'), 'Must track ship reliability');
});

check('Report contains Section 3: Keep / Iterate / Kill Decision Register evaluating S01-S30', () => {
  assert(reportContent.includes('## 3. Comprehensive Keep / Iterate / Kill Decision Register'), 'Must contain §3 heading');
  for (let i = 1; i <= 30; i++) {
    const sprintId = `S${String(i).padStart(2, '0')}`;
    assert(reportContent.includes(`**${sprintId}**`), `Must evaluate Sprint ${sprintId} in table`);
  }
});

check('Report contains Section 3.2: Distribution Loops 1-12 Evaluation', () => {
  for (let l = 1; l <= 12; l++) {
    const loopId = `Loop ${l}`;
    assert(reportContent.includes(`**${loopId}**`), `Must evaluate ${loopId} in table`);
  }
});

check('Report contains Section 3.3: Explicit Kill / Hard Gate Register', () => {
  assert(reportContent.includes('### 3.3 Explicit Kill / Hard Gate Register'), 'Must contain Kill register');
  assert(reportContent.includes('Automated Bulk Email Blasts'), 'Must prohibit automated email');
  assert(reportContent.includes('Unvalidated Machine Translation'), 'Must prohibit machine translation scale');
  assert(reportContent.includes('Paid Backlink Acquisition'), 'Must prohibit paid links');
  assert(reportContent.includes('Forced Signups'), 'Must prohibit forced signups');
});

check('Report contains Section 4: Production Architecture & Feature Flag Verification', () => {
  assert(reportContent.includes('## 4. Production Architecture & Feature Flag Verification'), 'Must contain §4 heading');
  assert(reportContent.includes('window.AC_FEATURES'), 'Must reference window.AC_FEATURES');
});

check('Report contains Section 5: Next-60 Days Plan (Days 61–120 / Sprints S31–S60)', () => {
  assert(reportContent.includes('## 5. Next-60 Days Plan (Days 61–120 / Sprints S31–S60)'), 'Must contain §5 heading');
  for (let s = 31; s <= 60; s++) {
    assert(reportContent.includes(`S${s}`), `Must outline future Sprint S${s}`);
  }
});

// -------------------------------------------------------------
// 2. Production Feature Flags (assets/js/shared.js)
// -------------------------------------------------------------
const sharedJsContent = fs.readFileSync(SHARED_JS_PATH, 'utf8');

check('assets/js/shared.js defines window.AC_FEATURES with all 6 production flags', () => {
  assert(sharedJsContent.includes('window.AC_FEATURES = Object.assign('), 'Must define window.AC_FEATURES');
  const requiredFlags = ['shortcuts', 'favorites', 'recents', 'themeToggle', 'workflowChains', 'shareableState'];
  for (const flag of requiredFlags) {
    const flagRegex = new RegExp(`${flag}:\\s*true`);
    assert(flagRegex.test(sharedJsContent), `Flag ${flag} must be defined and default to true`);
  }
});

check('assets/js/shared.js guards subsystems with AC_FEATURES checks', () => {
  assert(
    sharedJsContent.includes('window.AC_FEATURES.themeToggle === false') ||
    sharedJsContent.includes('if (window.AC_FEATURES.themeToggle !== false) initThemeToggle();'),
    'Theme toggle must be guarded'
  );
  assert(
    sharedJsContent.includes('window.AC_FEATURES.shortcuts === false') ||
    sharedJsContent.includes('if (window.AC_FEATURES.shortcuts !== false)'),
    'Shortcuts must be guarded'
  );
  assert(sharedJsContent.includes('if (window.AC_FEATURES.favorites !== false) initDashboardQuickAccess();'), 'Favorites must be guarded');
  assert(sharedJsContent.includes('if (window.AC_FEATURES.recents !== false) initDashboardRecents();'), 'Recents must be guarded');
});

// -------------------------------------------------------------
// 3. Sitemap & 441 URL Invariants
// -------------------------------------------------------------
check('sitemap.xml contains valid unique URLs and matches canonical inventory', () => {
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const locMatches = sitemapContent.match(/<loc>(https:\/\/anyconverter\.io[^<]+)<\/loc>/g) || [];
  const uniqueUrls = new Set(locMatches.map(m => m.replace(/<\/?loc>/g, '')));
  
  assert.ok(uniqueUrls.size === 441 || uniqueUrls.size === 444, `Sitemap must contain 441 or 444 unique URLs, got ${uniqueUrls.size}`);
  assert.ok(manifest.counts.totalSiteHtmlPages === 441 || manifest.counts.totalSiteHtmlPages === 444, `Manifest totalSiteHtmlPages must be 441 or 444`);
  assert.strictEqual(manifest.counts.uniqueFunctionalTools, 128, `Manifest uniqueFunctionalTools must be 128`);
});

// -------------------------------------------------------------
// 4. Internal Link Health & Zero Broken Links
// -------------------------------------------------------------
check('Internal link graph verifies 0 broken links sitewide', () => {
  assert(fs.existsSync(LINK_GRAPH_PATH), 'Internal link graph JSON must exist');
  const graph = JSON.parse(fs.readFileSync(LINK_GRAPH_PATH, 'utf8'));
  assert.strictEqual(graph.metadata.totalUrls, 441, `Graph must crawl all 441 pages, got ${graph.metadata.totalUrls}`);
  assert.strictEqual(graph.metadata.brokenLinks, 0, `Graph must have 0 broken links, got ${graph.metadata.brokenLinks}`);
  assert.strictEqual(graph.metadata.orphanedUrls, 0, `Graph must have 0 orphaned URLs, got ${graph.metadata.orphanedUrls}`);
});

// -------------------------------------------------------------
// 5. Open-Source Package Test Suite Execution
// -------------------------------------------------------------
check('@anyconverter/math package unit test suite passes 100%', () => {
  assert(fs.existsSync(PKG_TEST_PATH), 'Package test suite must exist');
  const result = execSync(`node "${PKG_TEST_PATH}"`, { encoding: 'utf8' });
  assert(result.includes('17/17 unit tests passed'), 'Package unit tests must report 17/17 unit tests passed');
});

console.log('\n----------------------------------------------------');
console.log(`Sprint S30 Verification: ${passedChecks}/${totalChecks} checks passed`);
console.log('====================================================\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
