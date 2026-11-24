/**
 * AnyConverter Creative Studio — Phase 09 Verification Suite
 * Tests for Provider Capability Registry, Pluggable Adapters, Notebooks & Job Lifecycle
 */

const assert = require('assert');
const {
  TASK_TYPE,
  PROVIDER_STATUS,
  ProviderCapabilityRegistry
} = require('../../../assets/js/creative-studio/provider-capability-registry.js');
const {
  GeminiProviderAdapter,
  HuggingFaceProviderAdapter
} = require('../../../assets/js/creative-studio/ai-provider-adapter.js');
const {
  NotebookWorkflowGenerator
} = require('../../../assets/js/creative-studio/notebook-workflow.js');
const {
  JOB_STATE,
  JobLifecycleManager
} = require('../../../assets/js/creative-studio/job-lifecycle-manager.js');

async function runPhase09Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 09 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: Provider Capability Registry & Task Discovery
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: Live Capability Registry & Policy Enforcement... ');

    const registry = new ProviderCapabilityRegistry();
    const providers = registry.getAllProviders();
    assert.ok(providers.length >= 4);

    // Verify Gemini is supported with CORS
    const gemini = registry.getProvider('google-gemini');
    assert.strictEqual(gemini.status, PROVIDER_STATUS.SUPPORTED);
    assert.strictEqual(gemini.browserCorsPermitted, true);

    // Verify SVD is manual notebook only
    const svd = registry.getProvider('stable-video-diffusion');
    assert.strictEqual(svd.status, PROVIDER_STATUS.MANUAL_ONLY);
    assert.strictEqual(svd.browserCorsPermitted, false);

    // Verify CORS proxies are strictly PROHIBITED
    const proxy = registry.getProvider('third-party-cors-proxy');
    assert.strictEqual(proxy.status, PROVIDER_STATUS.PROHIBITED);

    // Query text_to_image browser models
    const t2iModels = registry.findModelsForTask(TASK_TYPE.TEXT_TO_IMAGE, true);
    assert.ok(t2iModels.length >= 2);
    assert.ok(t2iModels.some(m => m.providerId === 'google-gemini'));
    assert.ok(t2iModels.some(m => m.providerId === 'huggingface-inference'));

    // Cost estimation
    const estimate = registry.estimateCost('google-gemini', 'imagen-3.0-generate-002', { count: 3 });
    assert.strictEqual(estimate.itemCount, 3);
    assert.strictEqual(estimate.totalEstimatedCostUsd, 0.09);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Pluggable Adapter User Approval Gate
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: Pluggable Adapter Rejection Without Explicit Approval... ');

    const adapter = new GeminiProviderAdapter({ apiKey: 'mock_key', _mockClient: true });
    const request = { prompt: 'Futuristic city skyline', count: 1 };

    // 1. Missing approval -> must throw APPROVAL_REQUIRED
    let caughtMissing = null;
    try {
      await adapter.submitApprovedJob(request, null);
    } catch (err) {
      caughtMissing = err;
    }
    assert.ok(caughtMissing !== null);
    assert.strictEqual(caughtMissing.code, 'APPROVAL_REQUIRED');

    // 2. Unapproved record -> must throw USER_APPROVAL_NOT_GRANTED
    let caughtUnapproved = null;
    try {
      await adapter.submitApprovedJob(request, { approvedByUser: false });
    } catch (err) {
      caughtUnapproved = err;
    }
    assert.ok(caughtUnapproved !== null);
    assert.strictEqual(caughtUnapproved.code, 'USER_APPROVAL_NOT_GRANTED');

    // 3. Valid explicit approval -> succeeds
    const job = await adapter.submitApprovedJob(request, {
      approvedByUser: true,
      maxApprovedRequests: 1,
      estimatedCostUsd: 0.03
    });
    assert.strictEqual(job.status, 'COMPLETED');
    assert.ok(job.id.startsWith('gemini-job-'));

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Gemini Adapter Execution & Mid-Flight AbortController Cancellation
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Gemini Adapter Job Execution & Mid-Flight Cancellation... ');

    const adapter = new GeminiProviderAdapter({ apiKey: 'test_key', _mockClient: true });
    const job = await adapter.submitApprovedJob(
      { prompt: 'Modern minimalist office logo', count: 1 },
      { approvedByUser: true, maxApprovedRequests: 1 }
    );

    const pollResult = await adapter.poll(job);
    assert.strictEqual(pollResult.status, 'COMPLETED');

    const results = await adapter.fetchResults(job);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].mimeType, 'image/png');
    assert.ok(results[0].base64.length > 50);

    // Test cancellation mechanism
    const cancelJob = {
      id: 'job-to-cancel-123',
      abortController: new AbortController()
    };
    const cancelRes = await adapter.cancel(cancelJob);
    assert.strictEqual(cancelRes.canceled, true);
    assert.strictEqual(cancelJob.status, 'CANCELED');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Hugging Face Serverless Adapter
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Hugging Face Adapter Free Quota & Execution... ');

    const hf = new HuggingFaceProviderAdapter({ apiKey: 'hf_mock_token_123', _mockClient: true });
    const est = await hf.estimate({ count: 1 });
    assert.strictEqual(est.estimatedCostUsd, 0.00);
    assert.strictEqual(est.unit, 'user_hf_quota');

    const job = await hf.submitApprovedJob(
      { prompt: 'Sunset over fjords, dynamic lighting' },
      { approvedByUser: true, maxApprovedRequests: 1 }
    );
    assert.strictEqual(job.status, 'COMPLETED');

    const blobs = await hf.fetchResults(job);
    assert.strictEqual(blobs.length, 1);
    assert.strictEqual(blobs[0].mimeType, 'image/png');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Reproducible .ipynb Notebook Generator for SVD Video
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: Reproducible .ipynb Generator with GPU Check & Zero Secrets... ');

    const nb = NotebookWorkflowGenerator.generateNotebook({
      title: 'SVD Video Generation Notebook',
      modelId: 'stabilityai/stable-video-diffusion-img2vid-xt',
      vramRequiredGb: 16,
      defaultPrompt: 'Drone shot over mountain pass'
    });

    assert.strictEqual(nb.nbformat, 4);
    assert.strictEqual(nb.nbformat_minor, 5);
    assert.ok(nb.cells.length >= 6);

    // Verify cell contents
    const nbStr = JSON.stringify(nb);
    // 1. GPU hardware check present
    assert.ok(nbStr.includes('torch.cuda.is_available()'));
    // 2. Output manifest creation present
    assert.ok(nbStr.includes('manifest.json'));
    // 3. Pinned dependency present
    assert.ok(nbStr.includes('diffusers==0.31.0'));
    // 4. Zero embedded API keys
    assert.strictEqual(nbStr.includes('AIzaSy'), false);
    assert.strictEqual(nbStr.includes('sk-'), false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Media Magic Bytes Verification & HTML/JSON Error Rejection
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: Binary Magic Bytes Verification & HTML Error Rejection... ');

    // 1. PNG Header (89 50 4E 47 ...)
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
    const pngRes = JobLifecycleManager.verifyMagicBytes(pngBytes);
    assert.strictEqual(pngRes.valid, true);
    assert.strictEqual(pngRes.detectedMime, 'image/png');

    // 2. JPEG Header (FF D8 FF ...)
    const jpegBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
    const jpegRes = JobLifecycleManager.verifyMagicBytes(jpegBytes);
    assert.strictEqual(jpegRes.valid, true);
    assert.strictEqual(jpegRes.detectedMime, 'image/jpeg');

    // 3. MP4 Header (....ftyp....)
    const mp4Bytes = new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D]);
    const mp4Res = JobLifecycleManager.verifyMagicBytes(mp4Bytes);
    assert.strictEqual(mp4Res.valid, true);
    assert.strictEqual(mp4Res.detectedMime, 'video/mp4');

    // 4. HTML Error page disguised as MP4 (Must FAIL)
    const htmlBytes = Buffer.from('<!DOCTYPE html><html><body>Error 404 Not Found</body></html>');
    const htmlRes = JobLifecycleManager.verifyMagicBytes(htmlBytes);
    assert.strictEqual(htmlRes.valid, false);
    assert.ok(htmlRes.error.includes('HTML error page'));

    // 5. JSON Error disguised as media (Must FAIL)
    const jsonBytes = Buffer.from('{"error":{"message":"Rate limit reached"}}');
    const jsonRes = JobLifecycleManager.verifyMagicBytes(jsonBytes);
    assert.strictEqual(jsonRes.valid, false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: 11-State Lifecycle Machine & No Automatic Costed Retries
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: 11-State Lifecycle Machine & Prohibition of Auto-Retries... ');

    const manager = new JobLifecycleManager();
    const job = manager.createJob({
      sceneId: 'scene_03',
      providerId: 'google-gemini',
      modelId: 'imagen-3.0',
      prompt: 'Character portrait in warm lighting'
    });

    assert.strictEqual(job.state, JOB_STATE.DRAFT);
    assert.ok(job.cacheKey && job.cacheKey.length > 10);

    // Step through lifecycle
    manager.transition(job.id, JOB_STATE.CAPABILITY_CHECKED);
    manager.transition(job.id, JOB_STATE.AUTHORIZED);
    manager.transition(job.id, JOB_STATE.USER_APPROVED);
    manager.transition(job.id, JOB_STATE.SUBMITTED);
    manager.transition(job.id, JOB_STATE.RUNNING);
    manager.transition(job.id, JOB_STATE.COMPLETED);
    manager.transition(job.id, JOB_STATE.OUTPUT_RETRIEVED);
    manager.transition(job.id, JOB_STATE.HASHED_AND_SAVED_LOCAL);
    manager.transition(job.id, JOB_STATE.ATTACHED_TO_SCENE);
    manager.transition(job.id, JOB_STATE.VERIFIED);

    assert.strictEqual(job.state, JOB_STATE.VERIFIED);
    assert.strictEqual(job.history.length, 11);

    // Test retry prohibition: failed job without fresh approval
    const failedJob = manager.createJob({ sceneId: 'scene_04' });
    manager.transition(failedJob.id, JOB_STATE.FAILED, { error: 'Network timeout' });

    assert.strictEqual(manager.canRetry(failedJob.id, null), false);
    assert.strictEqual(manager.canRetry(failedJob.id, { approvedByUser: false }), false);
    assert.strictEqual(manager.canRetry(failedJob.id, { approvedByUser: true }), true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`PHASE 09 SUMMARY: ${passed}/${total} Tests Passed (${total - passed} Failures).`);
  if (passed === total) {
    console.log('STATUS: ALL PHASE 09 VERIFICATION CRITERIA PASS.');
    console.log('================================================================\n');
    return true;
  } else {
    console.log('STATUS: FAILURES DETECTED IN PHASE 09.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

if (require.main === module) {
  runPhase09Tests().catch(err => {
    console.error('Fatal error running Phase 09 tests:', err);
    process.exit(1);
  });
}

module.exports = { runPhase09Tests };
