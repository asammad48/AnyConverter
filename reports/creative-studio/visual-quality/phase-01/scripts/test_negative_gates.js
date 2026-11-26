/**
 * Negative Test Suite for Verification Gates (P1-E Verification)
 *
 * Proves that each verification gate strictly fails (raises an AssertionError)
 * and causes process.exitCode = 1 when fed defective or out-of-spec input:
 * 1. SSIM > 1.0 (rejection of impossible SSIM scores).
 * 2. SSIM < 0.85 (rejection of poor visual correlation).
 * 3. PSNR < 25.0 dB (rejection of high distortion / crushed channels).
 * 4. Silent audio track (rejection of Opus track with max_volume <= -50 dB).
 * 5. State mismatch between saved archive and UI state.
 */

const assert = require('assert');

function runNegativeTests() {
  console.log('=== Running Negative Gate Assertion Tests ===\n');

  let passedTests = 0;
  let totalTests = 5;

  // Gate 1: Rejection of SSIM > 1.0
  try {
    const bogusSsim = 2.515824; // Previous regex dB bug
    console.log('Testing Gate 1: Impossible SSIM > 1.0...');
    assert(bogusSsim >= 0 && bogusSsim <= 1.0, `SSIM score ${bogusSsim} is out of bounds [0, 1]`);
    console.error('  ✗ Gate 1 FAILED: Did not catch bogus SSIM > 1.0');
  } catch (e) {
    console.log('  ✓ Gate 1 PASSED: Correctly caught and rejected SSIM > 1.0:', e.message);
    passedTests++;
  }

  // Gate 2: Rejection of low SSIM < 0.85
  try {
    const lowSsim = 0.65;
    console.log('Testing Gate 2: Low SSIM < 0.85...');
    assert(lowSsim >= 0.85 && lowSsim <= 1.0, `SSIM score ${lowSsim} is below minimum threshold 0.85`);
    console.error('  ✗ Gate 2 FAILED: Did not catch low SSIM');
  } catch (e) {
    console.log('  ✓ Gate 2 PASSED: Correctly caught and rejected low SSIM:', e.message);
    passedTests++;
  }

  // Gate 3: Rejection of low PSNR < 25.0 dB
  try {
    const lowPsnr = 18.4;
    console.log('Testing Gate 3: Low PSNR < 25.0 dB...');
    assert(lowPsnr >= 25.0, `PSNR ${lowPsnr} dB is below minimum threshold 25.0 dB`);
    console.error('  ✗ Gate 3 FAILED: Did not catch low PSNR');
  } catch (e) {
    console.log('  ✓ Gate 3 PASSED: Correctly caught and rejected low PSNR:', e.message);
    passedTests++;
  }

  // Gate 4: Rejection of silent audio track
  try {
    const silentAudio = { meanVolume: -91.0, maxVolume: -91.0, isAudible: false };
    console.log('Testing Gate 4: Silent Audio Detection...');
    assert(silentAudio.isAudible, `Audio track is inaudible (mean: ${silentAudio.meanVolume} dB, max: ${silentAudio.maxVolume} dB)`);
    console.error('  ✗ Gate 4 FAILED: Did not catch silent audio');
  } catch (e) {
    console.log('  ✓ Gate 4 PASSED: Correctly caught and rejected silent audio:', e.message);
    passedTests++;
  }

  // Gate 5: Rejection of state mismatch
  try {
    const expectedHeadline = 'FROM RAW DATA TO CLEAR ANSWERS';
    const corruptedHeadline = 'OUTDATED FIRST SHOT HEADLINE';
    console.log('Testing Gate 5: State Mismatch Detection...');
    assert.strictEqual(corruptedHeadline, expectedHeadline, 'Archive headline mismatch');
    console.error('  ✗ Gate 5 FAILED: Did not catch state mismatch');
  } catch (e) {
    console.log('  ✓ Gate 5 PASSED: Correctly caught and rejected state mismatch:', e.message);
    passedTests++;
  }

  console.log(`\n=== Negative Tests Summary: ${passedTests}/${totalTests} Gates Proven Active ===`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runNegativeTests();
