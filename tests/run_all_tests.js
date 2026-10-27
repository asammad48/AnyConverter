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
  { name: 'CSV to SQL Server Regression Suite', cmd: 'node tests/test_csv_to_sql_regression.js' }
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
