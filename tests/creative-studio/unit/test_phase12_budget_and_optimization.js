/**
 * AnyConverter Creative Studio — Phase 12 Verification Suite
 * Tests for AI Token, GPU Credit, Duration, Budget & Retry Optimization
 */

const assert = require('assert');
const {
  BILLING_UNIT,
  BillingUnitRegistry
} = require('../../../assets/js/creative-studio/billing-unit-registry.js');
const {
  BUDGET_STATUS,
  PreflightBudgetPlanner
} = require('../../../assets/js/creative-studio/budget-planner.js');
const {
  BudgetGuard,
  BudgetTelemetry
} = require('../../../assets/js/creative-studio/budget-guard.js');

async function runPhase12Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 12 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: Call-count and duration arithmetic (5-min project, 5s clip cap)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: Call-count & duration arithmetic (100% vs 30% AI share)... ');

    const planner = new PreflightBudgetPlanner();

    // 1. 5-minute project (300 seconds) with 100% AI footage
    // 5-second max clip cap -> Math.ceil(300 / 5) = 60 calls
    const plan100 = planner.evaluatePlan({
      totalDurationSeconds: 300,
      aiSharePercentage: 100,
      defaultModelId: 'generic-commercial-video-model'
    });

    assert.strictEqual(plan100.plannedDurationSeconds, 300);
    assert.strictEqual(plan100.aiGeneratedSeconds, 300);
    assert.strictEqual(plan100.nativeOrImportedSeconds, 0);
    assert.strictEqual(plan100.requiredGenerationCalls, 60);

    // 2. 5-minute project with 30% AI share (90s AI, 210s native scenes)
    // 90s AI -> Math.ceil(90 / 5) = 18 calls
    const plan30 = planner.evaluatePlan({
      totalDurationSeconds: 300,
      aiSharePercentage: 30,
      defaultModelId: 'generic-commercial-video-model'
    });

    assert.strictEqual(plan30.aiGeneratedSeconds, 90);
    assert.strictEqual(plan30.nativeOrImportedSeconds, 210);
    assert.strictEqual(plan30.requiredGenerationCalls, 18);

    // 3. Verify shots with uneven duration (e.g. 7s, 4s, 11s) calculate ceil accurately
    // 7s -> 2 calls, 4s -> 1 call, 11s -> 3 calls = 6 calls total
    const planShots = planner.evaluatePlan({
      shots: [
        { durationSeconds: 7, type: 'ai' },
        { durationSeconds: 4, type: 'ai' },
        { durationSeconds: 11, type: 'ai' },
        { durationSeconds: 30, type: 'native' } // Native zero cost
      ],
      defaultModelId: 'generic-commercial-video-model'
    });

    assert.strictEqual(planShots.aiGeneratedSeconds, 22);
    assert.strictEqual(planShots.nativeOrImportedSeconds, 30);
    assert.strictEqual(planShots.requiredGenerationCalls, 6);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Multi-unit billing registry & source-dated pricing manifest
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: Multi-unit billing registry & source-dated pricing manifest... ');

    const registry = new BillingUnitRegistry();

    // Verify text tokens
    const gemini = registry.getModelPricing('google-gemini-1.5-flash');
    assert.strictEqual(gemini.billingUnit, BILLING_UNIT.TEXT_TOKENS);
    assert.strictEqual(gemini.asOfDate, '2026-11-20');

    // Verify image count
    const imagen = registry.getModelPricing('google-imagen-3');
    assert.strictEqual(imagen.billingUnit, BILLING_UNIT.IMAGE_COUNT);
    assert.strictEqual(imagen.unitPriceUsd, 0.03);

    // Verify voice characters
    const tts = registry.getModelPricing('elevenlabs-voice-tts');
    assert.strictEqual(tts.billingUnit, BILLING_UNIT.VOICE_CHARACTERS);

    // Verify unknown model pricing: must NEVER fake $0!
    const unknown = registry.calculateCost('openai-sora-preview', 10);
    assert.strictEqual(unknown.known, false);
    assert.strictEqual(unknown.estimatedCostUsd, null);
    assert.ok(unknown.label.includes('Cost estimate not available'));

    // Verify unregistered model
    const unregistered = registry.calculateCost('unregistered-custom-model-99', 5);
    assert.strictEqual(unregistered.known, false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Preflight budget evaluation & shortfall mitigation
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Preflight budget evaluation & shortfall mitigation... ');

    const planner = new PreflightBudgetPlanner();

    // Model charges $0.20 per video second
    // 100 seconds AI -> Base cost = $20.00
    // 25% retry contingency -> $5.00
    // Total planned spend = $25.00
    // User budget = $20.00 -> Shortfall!
    const plan = planner.evaluatePlan({
      shots: [{ durationSeconds: 100, type: 'ai' }],
      defaultModelId: 'generic-commercial-video-model',
      userBudgetUsd: 20.00,
      retryContingency: 0.25
    });

    assert.strictEqual(plan.status, BUDGET_STATUS.BUDGET_SHORTFALL);
    assert.strictEqual(plan.baseEstimateUsd, 20.00);
    assert.strictEqual(plan.retryReserveUsd, 5.00);
    assert.strictEqual(plan.totalPlannedSpendUsd, 25.00);
    assert.strictEqual(plan.userBudgetUsd, 20.00);

    // Verify actionable mitigations are generated
    assert.ok(plan.mitigations.length >= 2);
    const reduceAiOption = plan.mitigations.find(m => m.action === 'REDUCE_AI_FOOTAGE');
    assert.ok(reduceAiOption);
    assert.ok(reduceAiOption.description.includes('native text cards'));

    const lowerRetryOption = plan.mitigations.find(m => m.action === 'LOWER_RETRY_CONTINGENCY');
    assert.ok(lowerRetryOption);

    // Now test a plan that fits budget ($15 spend <= $20 budget)
    const fittingPlan = planner.evaluatePlan({
      shots: [{ durationSeconds: 60, type: 'ai' }], // 60s * $0.20 = $12.00 + 20% ($2.40) = $14.40
      defaultModelId: 'generic-commercial-video-model',
      userBudgetUsd: 20.00,
      retryContingency: 0.20
    });

    assert.strictEqual(fittingPlan.status, BUDGET_STATUS.FITS_ESTIMATED_BUDGET);
    assert.strictEqual(fittingPlan.totalPlannedSpendUsd, 14.40);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Request deduplication & double-submit protection
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Request deduplication & double-submit protection... ');

    const guard = new BudgetGuard();

    const jobParams = {
      modelId: 'google-imagen-3',
      prompt: 'Cinematic portrait of cybernetic detective in rain',
      parameters: { width: 1024, height: 1024 },
      estimatedCostUsd: 0.03
    };

    let actualExecutionCount = 0;

    // 1. Initial submission
    const res1 = await guard.submitGuardedJob(jobParams, async () => {
      actualExecutionCount++;
      return { assetId: 'sha256:generated_portrait_01' };
    });

    assert.strictEqual(res1.cached, false);
    assert.strictEqual(res1.assetId, 'sha256:generated_portrait_01');
    assert.strictEqual(actualExecutionCount, 1);

    // 2. Immediate identical resubmission -> returns cached without re-executing
    const res2 = await guard.submitGuardedJob(jobParams, async () => {
      actualExecutionCount++;
      return { assetId: 'sha256:unexpected_duplicate_asset' };
    });

    assert.strictEqual(res2.cached, true);
    assert.strictEqual(res2.assetId, 'sha256:generated_portrait_01');
    assert.strictEqual(actualExecutionCount, 1); // Not incremented!

    // 3. In-flight simultaneous duplicate submission test
    const slowJobParams = {
      modelId: 'google-imagen-3',
      prompt: 'A second distinct prompt that takes time',
      estimatedCostUsd: 0.03
    };

    let slowJobFinished = false;
    let duplicateRejected = false;

    // Launch slow job
    const slowPromise = guard.submitGuardedJob(slowJobParams, () => {
      return new Promise(resolve => {
        setTimeout(() => {
          slowJobFinished = true;
          resolve({ assetId: 'sha256:slow_asset' });
        }, 80);
      });
    });

    // Attempt rapid identical submit while first is still in-flight
    try {
      await guard.submitGuardedJob(slowJobParams, async () => ({ assetId: 'duplicate' }));
    } catch (err) {
      if (err.code === 'DUPLICATE_IN_FLIGHT_JOB') {
        duplicateRejected = true;
      }
    }

    assert.strictEqual(duplicateRejected, true);
    await slowPromise;
    assert.strictEqual(slowJobFinished, true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Partial failure & retry contingency reservation
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: Partial failure & 429 rate limit pausing without work loss... ');

    const guard = new BudgetGuard();

    const batchJobs = [
      { id: 'shot-1', prompt: 'Shot 1 intro', estimatedCostUsd: 0.10 },
      { id: 'shot-2', prompt: 'Shot 2 action', estimatedCostUsd: 0.10 },
      { id: 'shot-3', prompt: 'Shot 3 dialogue', estimatedCostUsd: 0.10 },
      { id: 'shot-4', prompt: 'Shot 4 climax', estimatedCostUsd: 0.10 },
      { id: 'shot-5', prompt: 'Shot 5 outro', estimatedCostUsd: 0.10 }
    ];

    let callsCount = 0;

    // Simulate provider throwing 429 Too Many Requests on shot 4
    const batchResult = await guard.processBatchWithRateLimitGuard(batchJobs, async (job) => {
      callsCount++;
      if (job.id === 'shot-4') {
        const err = new Error('HTTP 429: Too Many Requests - Provider quota rate limit reached');
        err.status = 429;
        err.code = 'RATE_LIMIT_EXCEEDED';
        throw err;
      }
      return { assetId: `sha256:asset_${job.id}` };
    });

    assert.strictEqual(batchResult.rateLimited, true);
    assert.strictEqual(batchResult.completedCount, 3); // Shots 1, 2, 3 completed!
    assert.strictEqual(batchResult.pendingCount, 2);   // Shots 4, 5 preserved!

    // Verify first 3 shots have their outputs intact
    assert.strictEqual(batchResult.completed[0].result.assetId, 'sha256:asset_shot-1');
    assert.strictEqual(batchResult.completed[1].result.assetId, 'sha256:asset_shot-2');
    assert.strictEqual(batchResult.completed[2].result.assetId, 'sha256:asset_shot-3');

    // Verify pending starts with shot 4
    assert.strictEqual(batchResult.pending[0].id, 'shot-4');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Unknown quota / balance honesty
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: Unknown quota / balance honesty (zero fake balance claims)... ');

    const planner = new PreflightBudgetPlanner();

    // Plan with no verified provider balance API
    const plan = planner.evaluatePlan({
      shots: [{ durationSeconds: 20, type: 'ai' }],
      defaultModelId: 'openai-sora-preview', // Unverified model
      userBudgetUsd: null
    });

    assert.strictEqual(plan.status, BUDGET_STATUS.PROVIDER_QUOTA_UNKNOWN);
    assert.strictEqual(plan.priceKnown, false);
    assert.ok(plan.costLabel.includes('Cost estimate not available'));

    // Verify disclaimer is present
    assert.ok(plan.disclaimer.includes('AnyConverter collects zero payments'));

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Local-only auditable budget telemetry & credit savings report
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: Local-only auditable telemetry & credit savings report... ');

    const telemetry = new BudgetTelemetry();

    // Record various events
    telemetry.recordJobSubmission({ modelId: 'google-imagen-3', costUsd: 0.03 });
    telemetry.recordJobSuccess({ durationSeconds: 5, costUsd: 0.03 });

    telemetry.recordJobSubmission({ modelId: 'google-imagen-3', costUsd: 0.03 });
    telemetry.recordJobSuccess({ durationSeconds: 5, costUsd: 0.03 });

    telemetry.recordJobSubmission({ modelId: 'google-imagen-3', costUsd: 0.03 });
    telemetry.recordJobFailure({ code: 'NETWORK_TIMEOUT', reason: 'Socket closed' });

    // Record 2 asset reuses (prevented duplicate generations)
    telemetry.recordAssetReused({ durationSeconds: 5, estimatedSavedUsd: 0.03 });
    telemetry.recordAssetReused({ durationSeconds: 10, estimatedSavedUsd: 0.06 });

    telemetry.recordUserCancellation();

    const summary = telemetry.getSummary();

    assert.strictEqual(summary.submissions, 3);
    assert.strictEqual(summary.successes, 2);
    assert.strictEqual(summary.failures, 1);
    assert.strictEqual(summary.reusedCount, 2);
    assert.strictEqual(summary.totalGeneratedSeconds, 10);
    assert.strictEqual(summary.totalSavedSeconds, 15);
    assert.strictEqual(summary.estimatedTotalSpentUsd, 0.06);
    assert.strictEqual(summary.estimatedTotalSavedUsd, 0.09);
    assert.strictEqual(summary.userCancellations, 1);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`Results: ${passed}/${total} Phase 12 verification tests passed.`);
  if (passed === total) {
    console.log('STATUS: PASS FOR PHASE 12 BUDGET, CAPACITY & RETRY OPTIMIZATION RELEASE');
    process.exit(0);
  } else {
    console.error('STATUS: FAILURES DETECTED IN PHASE 12');
    process.exit(1);
  }
}

runPhase12Tests();
