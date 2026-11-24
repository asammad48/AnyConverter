#!/usr/bin/env node
const { execSync } = require('child_process');

const testSuites = [
  { name: 'Phase 05 International SEO Audit', cmd: 'node tools/phase05-international-seo-audit.js' },
  { name: 'Tool Pages & Check Links', cmd: 'node tools/tool-pages/check-links.js' },
  { name: 'Phase 04 SEO Release Gate', cmd: 'node tools/phase04-seo-release-gate.js' },
  { name: 'JSON Formatter Unit Suite', cmd: 'node tests/test_json_formatter_suite.js' },
  { name: 'IP Hero Regression Suite', cmd: 'node tests/test_ip_hero_regression.js' },
  { name: 'Phase 05 Negative Fixtures', cmd: 'node tests/test_phase05_negative_fixtures.js' },
  { name: 'URL Encoder Regression Suite', cmd: 'node tests/test_url_encoder_regression.js' },
  { name: 'CSV to SQL Server Regression Suite', cmd: 'node tests/test_csv_to_sql_regression.js' },
  { name: 'Base64 Data URI & Binary Suite', cmd: 'node tests/test_base64_data_uri.js' },
  { name: 'Hash Checksum Verification Suite', cmd: 'node tests/test_hash_generator_checksum.js' },
  { name: 'JWT Decoder Input & Claims Suite', cmd: 'node tests/test_jwt_decoder_input.js' },
  { name: 'Cron Expression Dialects Suite', cmd: 'node tests/test_cron_dialects.js' },
  { name: 'Search Synonyms & Discoverability', cmd: 'node tests/test_search_synonyms.js' },
  { name: 'Sitewide Parity & Inventory Counts Suite', cmd: 'node tests/test_sitewide_parity_and_counts.js' },
  { name: 'Privacy Statements & Disclosures Regression', cmd: 'node tests/test_privacy_claims_regression.js' },
  { name: 'Related Tools Semantic Integrity Suite', cmd: 'node tests/test_related_tools_regression.js' },
  { name: 'Multilingual Localization Quality Suite', cmd: 'node tests/test_localization_regression.js' },
  { name: 'Navbar Dropdowns & Favorites Suite', cmd: 'node tests/test_dropdown_and_favorites.js' },
  { name: 'Multilingual Tool Names & Search Suite', cmd: 'node tests/test_multilingual_tool_names.js' },
  { name: 'Financial Calculations & Amortization Suite', cmd: 'node tests/test_financial_calculations_suite.js' },
  { name: 'Analytics Adapter & 16-Event Dictionary Suite', cmd: 'node tests/test_analytics_adapter.js' },
  { name: 'Sitemap Integrity & Reciprocal Alternates Suite', cmd: 'node tests/test_sitemap_integrity.js' },
  { name: 'Sprint S09 Striking-Distance ES/DA Suite', cmd: 'node tests/test_s09_striking_distance_es_da.js' },
  { name: 'Sprint S10 Favorites UX & Persistence Suite', cmd: 'node tests/test_s10_favorites_ux.js' },
  { name: 'Sprint S11 Recents Carousel Suite', cmd: 'node tests/test_s11_recents_carousel.js' },
  { name: 'Sprint S12 Workflow Chain Suite', cmd: 'node tests/test_s12_workflow_chain_json.js' },
  { name: 'Sprint S13 Shareable Percentage Suite', cmd: 'node tests/test_s13_shareable_percentage.js' },
  { name: 'Sprint S14 Shareable Date Difference Suite', cmd: 'node tests/test_s14_shareable_date_difference.js' },
  { name: 'Sprint S15 PWA Manifest & Install Prompt Suite', cmd: 'node tests/test_s15_pwa_install.js' },
  { name: 'Sprint S16 Orphan Fix & Reciprocity Suite', cmd: 'node tests/test_s16_orphan_fix_reciprocity.js' },
  { name: 'Sprint S17 PDF Hub Depth Suite', cmd: 'node tests/test_s17_pdf_hub_depth.js' },
  { name: 'Sprint S18 Dev & Calc Hub Depth Suite', cmd: 'node tests/test_s18_dev_calc_hub_depth.js' },
  { name: 'Sprint S19 CWV Top 20 Suite', cmd: 'node tests/test_s19_cwv_top_20.js' },
  { name: 'Sprint S20 A11y Suite', cmd: 'node tests/test_s20_a11y_keyboard_aria.js' },
  { name: 'Sprint S21 Mobile Viewport Suite', cmd: 'node tests/test_s21_mobile_viewport.js' },
  { name: 'Sprint S22 AI Citeable Content Suite', cmd: 'node tests/test_s22_ai_citeable_dev_content.js' },
  { name: 'Sprint S23 FAQ Schema Expansion Suite', cmd: 'node tests/test_s23_faq_schema_expansion.js' },
  { name: 'Sprint S24 BreadcrumbList & Headers Audit Suite', cmd: 'node tests/test_s24_breadcrumbs_headers_audit.js' },
  { name: 'Sprint S25 Workflow Chain PDF Suite', cmd: 'node tests/test_s25_workflow_chain_pdf.js' },
  { name: 'Sprint S26 Workflow Chain Text Suite', cmd: 'node tests/test_s26_workflow_chain_text.js' },
  { name: 'Sprint S27 Theme Shortcuts Suite', cmd: 'node tests/test_s27_theme_shortcuts.js' },
  { name: 'Sprint S28 Privacy Modifiers Suite', cmd: 'node tests/test_s28_privacy_modifiers.js' },
  { name: 'Sprint S29 Internal Links & Sitemap Suite', cmd: 'node tests/test_s29_internal_links_sitemap.js' },
  { name: 'Playwright Visual Regression Suite (21/21 Baselines)', cmd: 'node tests/run_visual_regression.js' }
];

console.log('====================================================');
console.log('   ANYCONVERTER COMPREHENSIVE REPOSITORY TEST SUITE  ');
console.log('====================================================\n');

let allPassed = true;
let passedCount = 0;

for (const suite of testSuites) {
  process.stdout.write(`[RUNNING] ${suite.name}... `);
  try {
    const output = execSync(suite.cmd, { stdio: 'pipe' }).toString();
    console.log('PASS');
    passedCount++;
  } catch (err) {
    console.log('FAIL');
    console.error(err.stdout ? err.stdout.toString() : err.message);
    allPassed = false;
  }
}

console.log('\n====================================================');
console.log(`Results: ${passedCount}/${testSuites.length} test suites passed.`);
if (allPassed) {
  console.log('STATUS: ALL REPOSITORY GATES PASSED.');
  process.exit(0);
} else {
  console.error('STATUS: FAILURES DETECTED.');
  process.exit(1);
}
