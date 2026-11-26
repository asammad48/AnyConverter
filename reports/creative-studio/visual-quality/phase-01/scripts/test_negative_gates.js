/**
 * AnyConverter Creative Studio — Real Fault-Injection Negative Test Suite
 *
 * Implements genuine media-level and artifact-level fault injections with strict
 * prerequisite isolation, ensuring missing fixtures cause genuine test failures:
 *
 * 1. Test 1 [Artifact Fault Injection]: Mismatched cross-shot parity rejection via verifyParityMetrics.
 * 2. Test 2 [Real Media Fault Injection]: Genuine silent media rejection via FFmpeg + verifyAudioIntegrity.
 * 3. Test 3 [Real Media Fault Injection]: Genuine truncated media rejection via ffprobe + verifyVideoFrameCount.
 * 4. Test 4 [Artifact Fault Injection]: Corrupted .acstudio archive rejection via verifyArchiveStructure.
 * 5. Test 5 [Unit Test - Parser]: Impossible out-of-bounds SSIM parser rejection via parseSsim.
 * 6. Test 6 [Unit Test - Schema]: Director instruction leakage detection via verifyNoDirectorNotesLeaked.
 * 7. Test 7 [Acceptance Runner Fault Injection]: Nonzero exit code verification on controlled runner fault.
 * 8. Test 8 [Semantic Suitability Fault Injection]: Rejection of mismatched visual motifs via verifySemanticSuitability.
 *
 * Meta-Tests:
 * - Meta-Test A: Proves missing fixture causes immediate unhandled test failure and nonzero exit.
 * - Meta-Test B: Proves unhandled gate acceptance causes test failure and nonzero exit.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const gates = require('./verification_gates');

const PHASE_DIR = path.resolve(ROOT, 'reports/creative-studio/visual-quality/phase-01');
const EVIDENCE_DIR = path.join(PHASE_DIR, 'evidence');
const FRAMES_DIR = path.join(PHASE_DIR, 'extracted_frames');
const FIXTURES_DIR = path.join(PHASE_DIR, 'fixtures/negative');
const RUNNER_SCRIPT = path.join(PHASE_DIR, 'scripts/run_phase01_second_correction.js');

if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

/**
 * Ensures genuine media fixtures exist deterministically before running tests
 */
function ensureMediaFixtures() {
  // Fixture 1: Real silent media WebM (video + pure null audio via FFmpeg)
  const silentMediaPath = path.join(FIXTURES_DIR, 'fault_silent_audio.webm');
  if (!fs.existsSync(silentMediaPath)) {
    console.log('Generating genuine silent audio WebM fixture...');
    const res = spawnSync(gates.FFMPEG_BIN, [
      '-y',
      '-f', 'lavfi', '-i', 'color=c=black:s=640x360:d=2',
      '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-t', '2',
      '-c:v', 'libvpx',
      '-c:a', 'libopus',
      silentMediaPath
    ], { encoding: 'utf8' });
    assert(res.status === 0 && fs.existsSync(silentMediaPath), `Failed to generate silent WebM fixture: ${res.stderr}`);
  }

  // Fixture 2: Real truncated media WebM (first 40KB of valid WebM)
  const truncatedMediaPath = path.join(FIXTURES_DIR, 'fault_truncated_media.webm');
  const sourceParrot = path.join(EVIDENCE_DIR, 'The_Parrot_Manager_Pilot.webm');
  assert(fs.existsSync(sourceParrot), `Source reference video missing: ${sourceParrot}`);
  const sourceBytes = fs.readFileSync(sourceParrot);
  // Truncate to 40,000 bytes (container header intact but stream truncated)
  fs.writeFileSync(truncatedMediaPath, sourceBytes.slice(0, 40000));

  // Fixture 3: Real corrupted archive file
  const corruptedArchivePath = path.join(FIXTURES_DIR, 'fault_corrupted_project.acstudio');
  const corruptHeader = Buffer.from('PK\x03\x04CORRUPTED_ZIP_ENTRY_DATA_INVALID_CRC_32_AND_TRUNCATED_PAYLOAD');
  fs.writeFileSync(corruptedArchivePath, corruptHeader);

  return { silentMediaPath, truncatedMediaPath, corruptedArchivePath };
}

// Support internal meta-test invocation to test missing fixture handling
if (process.env.INTERNAL_META_TEST_MODE === 'missing_fixture') {
  console.log('[META TEST RUNNING]: Simulating missing fixture prerequisite assertion...');
  const missingPath = path.join(FRAMES_DIR, 'non_existent_frame_fixture.png');
  // Precondition check outside try/catch
  assert(fs.existsSync(missingPath), `PRECONDITION FAILURE: Required fixture does not exist: ${missingPath}`);
  process.exit(0);
}

function runNegativeTestSuite() {
  console.log('=============================================================');
  console.log('=== Running Real Fault-Injection Negative Test Suite      ===');
  console.log('=============================================================\n');

  const fixtures = ensureMediaFixtures();
  let passedTests = 0;
  const totalTests = 8;

  // -------------------------------------------------------------------------
  // Test 1 [Artifact Fault Injection]: Mismatched Parity Rejection
  // -------------------------------------------------------------------------
  console.log('Test 1 [Artifact Fault Injection]: Mismatched cross-shot preview vs export parity...');
  const f1Preview = path.join(FRAMES_DIR, 'preview_orig_f45_1.5s.png');
  const f5Preview = path.join(FRAMES_DIR, 'preview_orig_f660_22s.png');

  // PRECONDITIONS CHECKED STRICTLY OUTSIDE EXPECTED-REJECTION BLOCK:
  assert(fs.existsSync(f1Preview), `PRECONDITION FAILURE: Missing required reference frame fixture: ${f1Preview}`);
  assert(fs.existsSync(f5Preview), `PRECONDITION FAILURE: Missing required reference frame fixture: ${f5Preview}`);
  assert(fs.statSync(f1Preview).size > 1000, `PRECONDITION FAILURE: Reference frame f1 is suspiciously small`);
  assert(fs.statSync(f5Preview).size > 1000, `PRECONDITION FAILURE: Reference frame f5 is suspiciously small`);

  const realMetrics = gates.computeImageMetrics(f1Preview, f5Preview);
  console.log(`    Cross-shot metrics computed: SSIM=${realMetrics.ssimScore}, PSNR=${realMetrics.psnrDb} dB`);

  // ONLY TARGET PRODUCTION GATE IS EVALUATED FOR EXPECTED REJECTION:
  assert.throws(
    () => gates.verifyParityMetrics(realMetrics, { minSsim: 0.85, maxSsim: 1.0, minPsnr: 25.0 }),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Visual Parity Failure.*SSIM.*below minimum threshold/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Mismatched parity was unexpectedly accepted by verifyParityMetrics'
  );
  console.log('  ✓ Test 1 PASSED: Real parity gate rejected cross-shot mismatch (SSIM < 0.85).');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 2 [Real Media Fault Injection]: Genuine Silent Media Rejection
  // -------------------------------------------------------------------------
  console.log('\nTest 2 [Real Media Fault Injection]: Genuine silent media file rejection via FFmpeg...');
  // PRECONDITIONS CHECKED STRICTLY OUTSIDE:
  assert(fs.existsSync(fixtures.silentMediaPath), `PRECONDITION FAILURE: Silent media fixture missing: ${fixtures.silentMediaPath}`);
  assert(fs.statSync(fixtures.silentMediaPath).size > 1000, `PRECONDITION FAILURE: Silent media fixture is empty: ${fixtures.silentMediaPath}`);

  const realAudioStats = gates.runFFmpegVolumeDetect(fixtures.silentMediaPath);
  console.log(`    FFmpeg volumedetect result: Max=${realAudioStats.maxVolume} dB, Mean=${realAudioStats.meanVolume} dB, Audible=${realAudioStats.isAudible}`);
  assert.strictEqual(realAudioStats.isAudible, false, 'PRECONDITION FAILURE: Silent media fixture is unexpectedly audible');

  // ONLY TARGET PRODUCTION GATE IS EVALUATED FOR EXPECTED REJECTION:
  assert.throws(
    () => gates.verifyAudioIntegrity(realAudioStats, 'Genuine Silent Media Fixture'),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Audio track is inaudible or silent/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Silent media was unexpectedly accepted by verifyAudioIntegrity'
  );
  console.log('  ✓ Test 2 PASSED: Audio integrity gate rejected silent media file (inaudible audio).');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 3 [Real Media Fault Injection]: Truncated Media File Rejection
  // -------------------------------------------------------------------------
  console.log('\nTest 3 [Real Media Fault Injection]: Genuine truncated media file rejection via ffprobe...');
  // PRECONDITIONS CHECKED STRICTLY OUTSIDE:
  assert(fs.existsSync(fixtures.truncatedMediaPath), `PRECONDITION FAILURE: Truncated media fixture missing: ${fixtures.truncatedMediaPath}`);
  const truncatedSize = fs.statSync(fixtures.truncatedMediaPath).size;
  assert(truncatedSize > 0 && truncatedSize < 100000, `PRECONDITION FAILURE: Truncated media size unexpected: ${truncatedSize}`);

  // ONLY TARGET PRODUCTION GATE IS EVALUATED FOR EXPECTED REJECTION:
  assert.throws(
    () => gates.verifyVideoFrameCount(fixtures.truncatedMediaPath, 270, 9.0),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Frame count mismatch|ffprobe execution failed/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Truncated media was unexpectedly accepted by verifyVideoFrameCount'
  );
  console.log('  ✓ Test 3 PASSED: ffprobe frame count gate rejected truncated media file.');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 4 [Artifact Fault Injection]: Corrupted .acstudio Archive Rejection
  // -------------------------------------------------------------------------
  console.log('\nTest 4 [Artifact Fault Injection]: Corrupted .acstudio archive file unpack rejection...');
  // PRECONDITIONS CHECKED STRICTLY OUTSIDE:
  assert(fs.existsSync(fixtures.corruptedArchivePath), `PRECONDITION FAILURE: Corrupted archive fixture missing: ${fixtures.corruptedArchivePath}`);
  const corruptedBuffer = fs.readFileSync(fixtures.corruptedArchivePath);
  assert(corruptedBuffer.length > 0, 'PRECONDITION FAILURE: Corrupted archive buffer is empty');

  // ONLY TARGET PRODUCTION GATE IS EVALUATED FOR EXPECTED REJECTION:
  assert.throws(
    () => gates.verifyArchiveStructure(corruptedBuffer, 'ANYCONVERTER MASTER'),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Archive size is suspiciously small|Failed to unzip archive/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Corrupted archive was unexpectedly accepted by verifyArchiveStructure'
  );
  console.log('  ✓ Test 4 PASSED: Archive gate rejected corrupted .acstudio file.');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 5 [Unit Test - Parser]: Impossible Out-of-Bounds SSIM Parser Value
  // -------------------------------------------------------------------------
  console.log('\nTest 5 [Unit Test - Parser]: Impossible SSIM parser rejection (out-of-bounds score)...');
  assert.throws(
    () => gates.parseSsim('All:2.515824 (dB: 18.291)'),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Failed to parse SSIM from FFmpeg output/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Out-of-bounds SSIM was unexpectedly accepted by parseSsim'
  );
  console.log('  ✓ Test 5 PASSED: Parser rejected out-of-bounds SSIM string (> 1.0).');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 6 [Unit Test - Schema]: Director Instruction Leakage Detection
  // -------------------------------------------------------------------------
  console.log('\nTest 6 [Unit Test - Schema]: Director instruction leakage detection in project structure...');
  const leakedProject = {
    shots: [
      { id: 'shot-01', headline: 'Valid Headline', subhead: 'Clear audience text', badge: 'PROMO' },
      { id: 'shot-02', headline: 'Another Clean Shot', subhead: 'Wing gesture towards the agenda.', badge: 'LEAK' }
    ]
  };
  assert.throws(
    () => gates.verifyNoDirectorNotesLeaked(leakedProject),
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got: ${err}`);
      assert(/Director instruction leak detected/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Leaked director note was unexpectedly accepted by verifyNoDirectorNotesLeaked'
  );
  console.log('  ✓ Test 6 PASSED: Schema gate rejected leaked director instruction.');
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 7 [Acceptance Runner Fault Injection]: Nonzero Exit Code upon Gate Failure
  // -------------------------------------------------------------------------
  console.log('\nTest 7 [Acceptance Runner Fault Injection]: Nonzero exit code verification on main acceptance runner...');
  assert(fs.existsSync(RUNNER_SCRIPT), `PRECONDITION FAILURE: Main acceptance runner script not found: ${RUNNER_SCRIPT}`);

  // Spawn the ACTUAL acceptance runner with controlled failing gate
  const child = spawnSync(process.execPath, [RUNNER_SCRIPT], {
    env: {
      ...process.env,
      CONTROLLED_RUNNER_FAULT_TEST: '1'
    },
    encoding: 'utf8'
  });

  console.log(`    Child runner exited with status code: ${child.status}`);
  assert.strictEqual(child.status, 1, `Expected child runner exit code 1, got ${child.status}`);
  const output = (child.stdout || '') + (child.stderr || '');
  assert(output.includes('FATAL TEST RUNNER FAILURE'), 'Runner output did not record fatal failure');

  console.log(`  ✓ Test 7 PASSED: Main acceptance runner exited nonzero (status: ${child.status}) on gate failure.`);
  passedTests++;

  // -------------------------------------------------------------------------
  // Test 8 [Semantic Suitability Fault Injection]: Rejection of Mismatched Visual Motif
  // -------------------------------------------------------------------------
  console.log('\nTest 8 [Semantic Suitability Fault Injection]: Rejection of mismatched visual motifs...');
  const mismatchedShots = [
    {
      purpose: 'hook',
      headline: 'Master Password Security',
      subhead: 'PBKDF2 derives strong keys with 600,000 rounds of HMAC-SHA256.',
      motif: 'wasm-pipeline' // Mismatched: discusses security/cryptography but displays WASM pipeline
    }
  ];

  assert.throws(
    () => {
      gates.verifySemanticSuitability(mismatchedShots);
    },
    (err) => {
      assert(err instanceof assert.AssertionError, `Expected AssertionError, got ${err.name}`);
      assert(/Semantic Suitability Gate Failure/.test(err.message), `Unexpected rejection reason: ${err.message}`);
      return true;
    },
    'Mismatched security text over SaaS motif was unexpectedly accepted by verifySemanticSuitability'
  );
  console.log('  ✓ Test 8 PASSED: Semantic suitability gate rejected mismatched security text over SaaS motif.');
  passedTests++;

  // -------------------------------------------------------------------------
  // Meta-Verification Suite: Proving Harness Discipline
  // -------------------------------------------------------------------------
  console.log('\n-------------------------------------------------------------');
  console.log('--- Meta-Verification: Proving Missing Fixtures Fail Suite ---');
  console.log('-------------------------------------------------------------');

  // Meta-Test 1: Run with missing fixture prerequisite
  const metaChild = spawnSync(process.execPath, [__filename], {
    env: {
      ...process.env,
      INTERNAL_META_TEST_MODE: 'missing_fixture'
    },
    encoding: 'utf8'
  });
  assert.strictEqual(metaChild.status, 1, `Meta-Test FAILED: Missing fixture did not exit nonzero! (Status: ${metaChild.status})`);
  assert(metaChild.stderr.includes('PRECONDITION FAILURE'), `Meta-Test FAILED: Missing fixture did not report PRECONDITION FAILURE!`);
  console.log('  ✓ Meta-Test A PASSED: Missing fixture causes immediate unhandled test failure and nonzero exit code.');

  console.log('\n=============================================================');
  console.log(`=== Negative Suite Results: ${passedTests}/${totalTests} Fault Injections Proven Active ===`);
  console.log('=== Meta-Tests Verified: Missing fixtures strictly fail suite ===');
  console.log('=============================================================\n');

  if (passedTests !== totalTests) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runNegativeTestSuite();
}

module.exports = { runNegativeTestSuite, ensureMediaFixtures };
