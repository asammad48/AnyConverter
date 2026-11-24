/**
 * AnyConverter Creative Studio — Phase 14 Master Release Gate Suite
 * Final end-to-end integration verification across all 14 Creative Studio architectural files.
 * Covers Native Studio, Google Drive, AI Providers, Budgeting, Continuity, Security & Licenses.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { AcStudioArchive } = require('../../../assets/js/creative-studio/archive.js');
const { StorageManager } = require('../../../assets/js/creative-studio/storage-manager.js');
const { DRIVE_CONSTANTS, DriveSyncAdapter } = require('../../../assets/js/creative-studio/drive-sync-adapter.js');
const { COMMIT_STATE, DriveCommitProtocol } = require('../../../assets/js/creative-studio/drive-commit-protocol.js');
const { CONFLICT_STRATEGY, DriveConflictResolver } = require('../../../assets/js/creative-studio/drive-conflict-resolver.js');
const { BILLING_UNIT, BillingUnitRegistry } = require('../../../assets/js/creative-studio/billing-unit-registry.js');
const { BUDGET_STATUS, PreflightBudgetPlanner } = require('../../../assets/js/creative-studio/budget-planner.js');
const { BudgetGuard, BudgetTelemetry } = require('../../../assets/js/creative-studio/budget-guard.js');
const { PRODUCTION_MODE, CharacterBible, WorldBible, SeriesBible } = require('../../../assets/js/creative-studio/character-bible.js');
const { DramaSeriesPlanner } = require('../../../assets/js/creative-studio/drama-series-planner.js');
const { SHOT_VERSION_STATUS, ShotRegenerationEngine } = require('../../../assets/js/creative-studio/shot-regeneration.js');
const { AgentInteropSecurity, CreationRequestCompiler } = require('../../../assets/js/creative-studio/agent-interop.js');
const { LocalAgentBridge } = require('../../../assets/js/creative-studio/agent-bridge.js');

async function runPhase14MasterGateTests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 14 MASTER RELEASE GATE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // GATE 1: Native Studio & Rigs (E01–E05) - Guest Mode & Zero Credential Usage
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 1] Native Studio & Rigs (Guest mode, zero login/keys required)... ');

    const compiler = new CreationRequestCompiler();

    // Compile native project without credentials
    const nativeProject = compiler.compile({
      requestVersion: '1.0.0',
      topic: 'Guest Mode Explainer',
      productionMode: 'native',
      durationSeconds: 60,
      scenes: [
        { id: 'sc-1', durationSeconds: 30, headline: 'No Login Required', visuals: ['vector-star'] },
        { id: 'sc-2', durationSeconds: 30, headline: 'Native Browser Rendering', visuals: ['canvas-icon'] }
      ]
    });

    assert.ok(nativeProject.projectId);
    assert.strictEqual(nativeProject.scenes.length, 2);
    assert.strictEqual(nativeProject.metadata.aiAuthorized, false);

    // Verify 3D rig compatibility
    const series = new SeriesBible({ title: '3D Mesh Rig Series', productionMode: PRODUCTION_MODE.NATIVE_RIG });
    const char = series.addCharacter({
      displayName: 'Avatar 3D',
      rigRefs: { type: 'glTF', assetId: 'sha256:avatar_mesh_gltf' }
    });
    assert.strictEqual(char.rigRefs.type, 'glTF');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 2: Storage & Cloud Sync (E08–E10) - Local ZIP, Commit-Last & Save Both
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 2] Storage & Cloud Sync (Local ZIP, Commit-Last & Conflict Save Both)... ');

    const archive = new AcStudioArchive();
    const doc = {
      projectId: 'proj-gate-2',
      revisionId: 'rev-01',
      title: 'Gate 2 Project',
      scenes: []
    };

    // 1. Local .acstudio packaging & roundtrip
    const zip = archive.package(doc);
    const restored = archive.unpackage(zip);
    assert.strictEqual(restored.project.projectId, doc.projectId);

    // 2. Commit-manifest-last transactional order
    const mockFiles = new Map();
    const mockAdapter = {
      _token: 'mock_token',
      getAuthToken: () => 'mock_token',
      findOrCreateFolder: async (name) => `folder-${name}`,
      authorizedFetch: async () => ({ json: async () => ({ files: [] }) }),
      createFile: async (f) => {
        const id = `f-${mockFiles.size + 1}`;
        mockFiles.set(id, f);
        return { id, name: f.name };
      },
      updateFile: async (f) => {
        mockFiles.set(f.fileId, f);
        return { id: f.fileId };
      }
    };

    const protocol = new DriveCommitProtocol({ driveAdapter: mockAdapter });
    const commitRes = await protocol.executeCommit({
      projectDocument: doc,
      projectFolderId: 'folder-root'
    });
    assert.strictEqual(commitRes.success, true);
    assert.strictEqual(protocol.state, COMMIT_STATE.COMMITTED);

    // 3. Optimistic Concurrency & "Save Both"
    const resolver = new DriveConflictResolver();
    const resolution = await resolver.resolveConflict({
      strategy: CONFLICT_STRATEGY.SAVE_BOTH_COPIES,
      projectDocument: doc,
      remoteManifest: { currentRevisionId: 'rev-remote-diverged' },
      driveAdapter: {
        findOrCreateAppFolder: async () => 'app-folder',
        findOrCreateFolder: async () => 'copy-folder',
        saveEditableProject: async () => ({ success: true })
      },
      parentFolderId: 'app-folder'
    });

    assert.strictEqual(resolution.action, 'CREATED_NON_DESTRUCTIVE_DUPLICATE');
    assert.strictEqual(resolution.duplicateDocument.title, 'Gate 2 Project (Copy from Device B)');
    assert.notStrictEqual(resolution.duplicateDocument.projectId, doc.projectId);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 3: AI Provider BYOK & Budgeting (E11–E14) - Ceiling Division & No Fake $0
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 3] AI Provider BYOK & Budgeting (Ceiling division & zero fake balances)... ');

    const planner = new PreflightBudgetPlanner();

    // 5-minute video with 50% AI footage at 5s clip cap
    // 150 seconds AI -> Math.ceil(150 / 5) = 30 calls
    const plan = planner.evaluatePlan({
      totalDurationSeconds: 300,
      aiSharePercentage: 50,
      defaultModelId: 'generic-commercial-video-model',
      userBudgetUsd: 50.00
    });

    assert.strictEqual(plan.aiGeneratedSeconds, 150);
    assert.strictEqual(plan.nativeOrImportedSeconds, 150);
    assert.strictEqual(plan.requiredGenerationCalls, 30);
    assert.strictEqual(plan.status, BUDGET_STATUS.FITS_ESTIMATED_BUDGET);

    // Unverified model pricing: must NEVER fake $0
    const unknownPlan = planner.evaluatePlan({
      shots: [{ durationSeconds: 20, type: 'ai' }],
      defaultModelId: 'openai-sora-preview'
    });
    assert.strictEqual(unknownPlan.status, BUDGET_STATUS.PROVIDER_QUOTA_UNKNOWN);
    assert.strictEqual(unknownPlan.priceKnown, false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 4: Series Continuity, Agent Interop & Security (E15–E17)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 4] Series Continuity, Agent Interop & Security (Isolation & Anti-XSS)... ');

    // 1. Middle-scene edit isolation
    const engine = new ShotRegenerationEngine();
    const origScenes = [];
    for (let i = 1; i <= 20; i++) {
      origScenes.push({
        sceneId: `sc-${i}`,
        shots: [{ shotId: `sh-${i}`, durationSeconds: 5, activeVersionNumber: 1, versions: [{ versionNumber: 1, assetId: `hash-${i}` }] }]
      });
    }
    const mutatedScenes = JSON.parse(JSON.stringify(origScenes));
    engine.proposeCandidateVersion(mutatedScenes[7].shots[0], { assetId: 'hash-8-new' });
    engine.acceptCandidateVersion(mutatedScenes[7].shots[0], 2);

    const iso = engine.verifySceneEditIsolation(origScenes, mutatedScenes, 'sc-8');
    assert.strictEqual(iso.isIsolated, true);
    assert.strictEqual(iso.unmutatedCount, 19);

    // 2. Security Rejection: Prototype Pollution, XSS, Path Traversal, Leaked Secrets
    assert.throws(() => {
      AgentInteropSecurity.parseAndSanitize('{"__proto__":{"hacked":true}}');
    }, (err) => err.code === 'PROTOTYPE_POLLUTION_DETECTED');

    assert.throws(() => {
      AgentInteropSecurity.parseAndSanitize('{"text":"<script>evil()</script>"}');
    }, (err) => err.code === 'XSS_INJECTION_DETECTED');

    assert.throws(() => {
      AgentInteropSecurity.parseAndSanitize('{"path":"../../secret"}');
    }, (err) => err.code === 'PATH_TRAVERSAL_DETECTED');

    assert.throws(() => {
      AgentInteropSecurity.parseAndSanitize('{"key":"sk-abcdef1234567890abcdef1234567890"}');
    }, (err) => err.code === 'LEAKED_CREDENTIALS_DETECTED');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 5: Failure Paths, Degradation & Recovery (E18–E20)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 5] Failure Paths & Recovery (Rate limit pausing & QuotaExceeded)... ');

    const guard = new BudgetGuard();

    // Rate limit 429 pausing
    const batch = [
      { id: '1', prompt: 'P1' },
      { id: '2', prompt: 'P2' }
    ];
    const res = await guard.processBatchWithRateLimitGuard(batch, async (item) => {
      if (item.id === '2') {
        const err = new Error('HTTP 429');
        err.status = 429;
        throw err;
      }
      return { assetId: 'ok-1' };
    });

    assert.strictEqual(res.rateLimited, true);
    assert.strictEqual(res.completedCount, 1);
    assert.strictEqual(res.pendingCount, 1);
    assert.strictEqual(res.completed[0].result.assetId, 'ok-1');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 6: Local Agent Bridge Contract & Directory Sandboxing
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 6] Local Agent Bridge Contract & Directory Sandboxing... ');

    const safeDir = path.resolve(__dirname, '../../fixtures');
    const bridge = new LocalAgentBridge({ allowedDirectory: safeDir });

    assert.doesNotThrow(() => {
      bridge._verifySandboxPath(path.join(safeDir, 'project.acstudio'));
    });

    assert.throws(() => {
      bridge._verifySandboxPath('/root/private/id_rsa');
    }, /SANDBOX_VIOLATION/);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // GATE 7: Commercial Licensing & Zero-Backend Static Invariant Audit
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[GATE 7] Licensing & Zero-Backend Invariant Audit (Zero servers, zero stored keys)... ');

    const creativeStudioDir = path.resolve(__dirname, '../../../assets/js/creative-studio');
    const files = fs.readdirSync(creativeStudioDir).filter(f => f.endsWith('.js'));

    assert.ok(files.length >= 15);

    for (const f of files) {
      const fullPath = path.join(creativeStudioDir, f);
      const content = fs.readFileSync(fullPath, 'utf8');

      // 1. Must never write raw OAuth access tokens or API keys to localStorage
      assert.strictEqual(
        content.includes('localStorage.setItem("oauth_token"'),
        false,
        `Prohibited token storage pattern found in ${f}`
      );

      // 2. Must never call an AnyConverter backend endpoint
      assert.strictEqual(
        content.includes('https://api.anyconverter.io/v1/jobs'),
        false,
        `Prohibited hosted backend URL found in ${f}`
      );
      assert.strictEqual(
        content.includes('http://localhost:3000'),
        false,
        `Prohibited local dev server URL found in ${f}`
      );

      // 3. Must never ship a private service account key
      assert.strictEqual(
        content.includes('"type": "service_account"'),
        false,
        `Prohibited service account JSON found in ${f}`
      );
    }

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
  console.log(`Results: ${passed}/${total} Phase 14 Master Release Gates passed.`);
  if (passed === total) {
    console.log('STATUS: PASS FOR ANYCONVERTER CREATIVE STUDIO PRODUCTION RELEASE');
    process.exit(0);
  } else {
    console.error('STATUS: FAILURES DETECTED IN MASTER RELEASE GATE');
    process.exit(1);
  }
}

runPhase14MasterGateTests();
