#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('====================================================');
console.log('   PLAYWRIGHT VISUAL REGRESSION TEST SUITE (21/21)  ');
console.log('====================================================\n');

try {
  const env = {
    ...process.env,
    NODE_PATH: 'C:/Users/abdul.sammad/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules'
  };
  execSync('npx --package=@playwright/test playwright test tests/visual_regression.spec.js', {
    stdio: 'inherit',
    env
  });
  console.log('\n[PASS] All 21 visual regression screenshot comparisons matched reference baselines!');
  process.exit(0);
} catch (err) {
  console.error('\n[FAIL] Visual regression comparisons failed:', err.message);
  process.exit(1);
}
