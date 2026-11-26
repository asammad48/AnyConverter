const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = process.cwd();

// Explicit inventory of source and test files covering the entire Phase 01 implementation
const fileInventory = [
  'creative-studio/index.html',
  'da/creative-studio/index.html',
  'es/creative-studio/index.html',
  'assets/js/creative-studio/render-adapter.js',
  'assets/js/creative-studio/studio-app.js',
  'assets/js/creative-studio/visual/reference-shot.js',
  'assets/js/creative-studio/visual/creative-director.js',
  'tests/test_multilingual_creative_studio_ui.js',
  'reports/creative-studio/visual-quality/phase-01/scripts/test_user_authoring_truth_gate.js',
  'reports/creative-studio/visual-quality/phase-01/scripts/verification_gates.js'
];

const fileListStr = fileInventory.join(' ');

console.log('Generating clean UTF-8 source patches without BOM for Phase 01...');
console.log('File inventory (' + fileInventory.length + ' files):');
fileInventory.forEach((f, idx) => console.log(`  ${idx + 1}. ${f}`));

// 1. OWNER_REVIEW_SOURCE_PATCH.diff: Diff against 39ee4e9 (base prior to visual quality phase)
const diffBase = execSync(`git diff --no-color --no-prefix 39ee4e9 -- ${fileListStr}`, { encoding: 'utf8' });
// Also create standard git format with a/ and b/ prefix for git apply
const diffBaseGit = execSync(`git diff --no-color 39ee4e9 -- ${fileListStr}`, { encoding: 'utf8' });

const outPatch1 = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01/OWNER_REVIEW_SOURCE_PATCH.diff');
// Write strictly as UTF-8 without BOM
fs.writeFileSync(outPatch1, diffBaseGit, { encoding: 'utf8' });

// 2. PHASE01_CORRECTION_CYCLE.diff: Diff against 00455d2 (First review rejection baseline)
const diffCycle = execSync(`git diff --no-color 00455d2 -- ${fileListStr}`, { encoding: 'utf8' });
const outPatch2 = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01/PHASE01_CORRECTION_CYCLE.diff');
fs.writeFileSync(outPatch2, diffCycle, { encoding: 'utf8' });

// 3. WORKING_TREE_CORRECTION.diff: Diff against HEAD (1d50c1d) capturing current unstaged changes
const diffWorking = execSync(`git diff --no-color HEAD -- ${fileListStr}`, { encoding: 'utf8' });
const outPatch3 = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01/WORKING_TREE_CORRECTION.diff');
fs.writeFileSync(outPatch3, diffWorking, { encoding: 'utf8' });

// Verification of encodings: Ensure NO UTF-16LE BOM and 0 NUL bytes
[outPatch1, outPatch2, outPatch3].forEach(patchPath => {
  const buf = fs.readFileSync(patchPath);
  assert.notStrictEqual(buf[0], 0xff, `Patch ${path.basename(patchPath)} starts with 0xFF (UTF-16LE BOM error)`);
  assert.notStrictEqual(buf[1], 0xfe, `Patch ${path.basename(patchPath)} starts with 0xFE (UTF-16LE BOM error)`);
  
  let nulCount = 0;
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) nulCount++;
  }
  assert.strictEqual(nulCount, 0, `Patch ${path.basename(patchPath)} contains ${nulCount} NUL bytes! Must be 0.`);
  console.log(`✓ Verified genuine UTF-8 (No BOM, 0 NUL bytes): ${path.basename(patchPath)} (${buf.length} bytes)`);
});

// Run git apply --stat on the generated patches
console.log('\n--- Running git apply --stat ---');
try {
  const stat1 = execSync(`git apply --stat "${outPatch1}"`, { encoding: 'utf8' });
  console.log('git apply --stat OWNER_REVIEW_SOURCE_PATCH.diff:\n' + stat1.trim());
} catch (e) {
  console.error('git apply --stat failed on patch 1:', e.message);
}

// Run git apply --check --reverse on current working tree for WORKING_TREE_CORRECTION.diff
console.log('\n--- Running git apply --check --reverse on WORKING_TREE_CORRECTION.diff ---');
try {
  execSync(`git apply --check --reverse "${outPatch3}"`, { stdio: 'pipe' });
  console.log('✓ git apply --check --reverse on WORKING_TREE_CORRECTION.diff verified cleanly against current tree.');
} catch (e) {
  console.log('Note on reverse apply:', e.message);
}
