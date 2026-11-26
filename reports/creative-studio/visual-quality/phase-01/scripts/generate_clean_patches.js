const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const files = [
  'creative-studio/index.html',
  'assets/js/creative-studio/render-adapter.js',
  'assets/js/creative-studio/studio-app.js',
  'assets/js/creative-studio/visual/reference-shot.js'
].join(' ');

// 1. Diff against 39ee4e9 (Base prior to visual quality phase)
const diffBase = execSync(`git diff 39ee4e9 -- ${files}`, { encoding: 'utf8' });
const outPatch1 = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01/OWNER_REVIEW_SOURCE_PATCH.diff');
fs.writeFileSync(outPatch1, diffBase, { encoding: 'utf8' });

// 2. Diff against 00455d2 (First review rejection baseline)
const diffCycle = execSync(`git diff 00455d2 -- ${files}`, { encoding: 'utf8' });
const outPatch2 = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01/PHASE01_CORRECTION_CYCLE.diff');
fs.writeFileSync(outPatch2, diffCycle, { encoding: 'utf8' });

console.log('Patches written in UTF-8 without BOM:');
console.log(`- ${outPatch1} (${Buffer.byteLength(diffBase, 'utf8')} bytes)`);
console.log(`- ${outPatch2} (${Buffer.byteLength(diffCycle, 'utf8')} bytes)`);

// Test git apply --check against the commits
try {
  execSync(`git apply --check --reverse reports/creative-studio/visual-quality/phase-01/PHASE01_CORRECTION_CYCLE.diff`, { stdio: 'pipe' });
  console.log('✓ git apply --check --reverse on PHASE01_CORRECTION_CYCLE.diff verified cleanly against current tree.');
} catch (e) {
  console.log('Note on git apply test:', e.message);
}
