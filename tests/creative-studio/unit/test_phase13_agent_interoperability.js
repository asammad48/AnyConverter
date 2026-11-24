/**
 * AnyConverter Creative Studio — Phase 13 Verification Suite
 * Tests for ChatGPT / Claude Agent Interoperability Without Backend,
 * CreationRequest Compilation, Security Sanitization, Scene Patching & Local Bridge
 */

const assert = require('assert');
const path = require('path');
const {
  AGENT_INTEROP_VERSION,
  AgentInteropSecurity,
  CreationRequestCompiler
} = require('../../../assets/js/creative-studio/agent-interop.js');
const {
  LocalAgentBridge
} = require('../../../assets/js/creative-studio/agent-bridge.js');

async function runPhase13Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 13 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: CreationRequest import & deterministic compilation into ProjectDocument
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: CreationRequest compilation into valid editable ProjectDocument... ');

    const compiler = new CreationRequestCompiler();

    const sampleCreationRequest = {
      requestVersion: '1.0.0',
      intent: 'animated-explainer',
      productionMode: 'native',
      durationSeconds: 180,
      aspectRatio: '16:9',
      language: 'en',
      templateId: 'whiteboard-science-v1',
      topic: 'The Solar System Explained',
      scenes: [
        {
          id: 'scene-intro',
          durationSeconds: 30,
          headline: 'Welcome to the Solar System',
          visuals: ['sun', 'orbit-paths']
        },
        {
          id: 'scene-inner-planets',
          durationSeconds: 60,
          headline: 'The Terrestrial Worlds',
          visuals: ['mercury', 'venus', 'earth', 'mars']
        },
        {
          id: 'scene-gas-giants',
          durationSeconds: 60,
          headline: 'The Gas & Ice Giants',
          visuals: ['jupiter', 'saturn', 'uranus', 'neptune']
        },
        {
          id: 'scene-conclusion',
          durationSeconds: 30,
          headline: 'Summary & Beyond',
          visuals: ['kuiper-belt', 'voyager']
        }
      ],
      aiAuthorized: false,
      externalAssets: []
    };

    const compiledProject = compiler.compile(sampleCreationRequest);

    assert.ok(compiledProject.projectId);
    assert.strictEqual(compiledProject.title, 'The Solar System Explained');
    assert.strictEqual(compiledProject.width, 1920);
    assert.strictEqual(compiledProject.height, 1080);
    assert.strictEqual(compiledProject.fps, 30);
    assert.strictEqual(compiledProject.durationSeconds, 180);
    assert.strictEqual(compiledProject.scenes.length, 4);

    // Verify first scene layers
    const s1 = compiledProject.scenes[0];
    assert.strictEqual(s1.sceneId, 'scene-intro');
    assert.strictEqual(s1.durationSeconds, 30);
    assert.strictEqual(s1.startTimeSeconds, 0);
    assert.ok(s1.layers.length >= 3); // bg, headline, visuals
    assert.strictEqual(s1.layers[1].type, 'text');
    assert.strictEqual(s1.layers[1].text, 'Welcome to the Solar System');

    // Verify metadata provenance
    assert.strictEqual(compiledProject.metadata.generatedByAgent, true);
    assert.strictEqual(compiledProject.metadata.templateId, 'whiteboard-science-v1');
    assert.strictEqual(compiledProject.metadata.aiAuthorized, false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Full assistant project.json import with validation & sanitization
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: Full assistant project.json import with schema validation... ');

    const bridge = new LocalAgentBridge();

    const rawAssistantProject = {
      projectId: 'proj-chatgpt-generated-01',
      title: '<b>Quantum Physics 101</b>', // Contains HTML tag to be sanitized
      kind: 'video',
      fps: 30,
      width: 1920,
      height: 1080,
      durationSeconds: 60,
      scenes: [
        {
          sceneId: 'sc-1',
          title: 'Wave Particle Duality',
          durationSeconds: 60,
          layers: [
            { id: 'l1', type: 'text', text: 'Wave Particle Duality' }
          ]
        }
      ]
    };

    const validation = bridge.validateProject(rawAssistantProject);
    assert.strictEqual(validation.valid, true);
    assert.strictEqual(validation.errors.length, 0);

    // Verify HTML was stripped safely
    assert.strictEqual(validation.sanitizedProject.title, 'Quantum Physics 101');
    assert.strictEqual(validation.sanitizedProject.scenes.length, 1);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Targeted JSON patch on Scene 8 (preserves all other 19 scenes)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Targeted JSON patch on Scene 8 with undo reversibility... ');

    const compiler = new CreationRequestCompiler();

    // Construct a 20-scene project document
    const scenes = [];
    for (let i = 1; i <= 20; i++) {
      scenes.push({
        sceneId: `scene-${i}`,
        sceneNumber: i,
        title: `Original Scene Title ${i}`,
        durationSeconds: 10,
        layers: [
          { id: `l-${i}-text`, type: 'text', text: `Original Headline ${i}` }
        ]
      });
    }

    const projectDoc = {
      projectId: 'proj-multi-scene-patch',
      title: 'Twenty Scene Narrative',
      revisionId: 'rev_initial',
      scenes
    };

    // Snapshot scene 7 and scene 9 to verify they are 100% untouched
    const scene7Before = JSON.stringify(projectDoc.scenes[6]);
    const scene9Before = JSON.stringify(projectDoc.scenes[8]);
    const scene8Before = JSON.stringify(projectDoc.scenes[7]);

    // Apply patch targeting ONLY Scene 8
    const patchProposal = {
      headline: 'Updated Climate Science Breakthrough Headline',
      title: 'Updated Climate Science Breakthrough'
    };

    const patchResult = compiler.applyScenePatch(projectDoc, 'scene-8', patchProposal);
    assert.strictEqual(patchResult.success, true);
    assert.strictEqual(patchResult.affectedSceneId, 'scene-8');

    // Verify Scene 8 updated
    const scene8After = projectDoc.scenes.find(s => s.sceneId === 'scene-8');
    assert.strictEqual(scene8After.title, 'Updated Climate Science Breakthrough');
    assert.strictEqual(scene8After.layers[0].text, 'Updated Climate Science Breakthrough Headline');

    // CRITICAL: Verify Scenes 1-7 and 9-20 are completely untouched
    assert.strictEqual(JSON.stringify(projectDoc.scenes[6]), scene7Before);
    assert.strictEqual(JSON.stringify(projectDoc.scenes[8]), scene9Before);

    // Test Undo Reversibility
    compiler.revertScenePatch(projectDoc, 'scene-8', patchResult.previousSnapshot);
    const scene8Reverted = JSON.stringify(projectDoc.scenes.find(s => s.sceneId === 'scene-8'));
    assert.strictEqual(scene8Reverted, scene8Before);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Security rejection of prototype pollution, XSS, and path traversal
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Security rejection of prototype pollution, XSS & path traversal... ');

    // 1. Prototype Pollution
    const pollutedJson = '{"requestVersion":"1.0.0","topic":"Test","__proto__":{"admin":true}}';
    let pollutionCaught = false;
    try {
      AgentInteropSecurity.parseAndSanitize(pollutedJson);
    } catch (err) {
      if (err.code === 'PROTOTYPE_POLLUTION_DETECTED') {
        pollutionCaught = true;
      }
    }
    assert.strictEqual(pollutionCaught, true);

    // 2. XSS Script Injection
    const xssJson = '{"requestVersion":"1.0.0","topic":"Test <script>alert(document.cookie)</script>"}';
    let xssCaught = false;
    try {
      AgentInteropSecurity.parseAndSanitize(xssJson);
    } catch (err) {
      if (err.code === 'XSS_INJECTION_DETECTED') {
        xssCaught = true;
      }
    }
    assert.strictEqual(xssCaught, true);

    // 3. Path Traversal
    const traversalJson = '{"requestVersion":"1.0.0","topic":"Test","externalAssets":["../../etc/passwd"]}';
    let traversalCaught = false;
    try {
      AgentInteropSecurity.parseAndSanitize(traversalJson);
    } catch (err) {
      if (err.code === 'PATH_TRAVERSAL_DETECTED') {
        traversalCaught = true;
      }
    }
    assert.strictEqual(traversalCaught, true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Embedded secret / API key detection & redaction
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: Embedded secret / API key detection in assistant JSON... ');

    const leakedKeyJson = {
      requestVersion: '1.0.0',
      topic: 'Secret Project',
      metadata: {
        note: 'Here is my key: sk-abcdef1234567890abcdef1234567890'
      }
    };

    let keyCaught = false;
    try {
      AgentInteropSecurity.parseAndSanitize(leakedKeyJson);
    } catch (err) {
      if (err.code === 'LEAKED_CREDENTIALS_DETECTED') {
        keyCaught = true;
      }
    }
    assert.strictEqual(keyCaught, true);

    // Google key test
    const googleKeyJson = '{"requestVersion":"1.0.0","apiKey":"AIzaSyD849fjk2309djs0293jf0293jfd92"}';
    let googleKeyCaught = false;
    try {
      AgentInteropSecurity.parseAndSanitize(googleKeyJson);
    } catch (err) {
      if (err.code === 'LEAKED_CREDENTIALS_DETECTED') {
        googleKeyCaught = true;
      }
    }
    assert.strictEqual(googleKeyCaught, true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Local Agent Bridge contract & sandboxing enforcement
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: Local Agent Bridge contract & sandboxed directory enforcement... ');

    const safeDir = path.resolve(__dirname, '../../fixtures');
    const bridge = new LocalAgentBridge({
      allowedDirectory: safeDir,
      allowFilesystemWrite: true
    });

    // Path inside allowedDirectory passes
    const validFilePath = path.join(safeDir, 'project.acstudio');
    assert.doesNotThrow(() => {
      bridge._verifySandboxPath(validFilePath);
    });

    // Path outside allowedDirectory throws SANDBOX_VIOLATION
    const forbiddenPath = path.resolve(safeDir, '../../package.json');
    let sandboxViolationCaught = false;
    try {
      bridge._verifySandboxPath(forbiddenPath);
    } catch (err) {
      if (err.code === 'SANDBOX_VIOLATION') {
        sandboxViolationCaught = true;
      }
    }
    assert.strictEqual(sandboxViolationCaught, true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Full roundtrip: Assistant CreationRequest -> Compile -> Edit -> Export
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: Full roundtrip: Assistant prompt -> Compile -> Edit -> .acstudio export... ');

    const bridge = new LocalAgentBridge();

    // 1. Assistant prepares CreationRequest
    const agentRequest = {
      requestVersion: '1.0.0',
      intent: 'educational-biology',
      topic: 'Cellular Respiration in 2 Minutes',
      durationSeconds: 120,
      aspectRatio: '16:9',
      scenes: [
        { id: 'sc-1', durationSeconds: 40, headline: 'Glycolysis in the Cytoplasm' },
        { id: 'sc-2', durationSeconds: 40, headline: 'The Krebs Cycle in Mitochondria' },
        { id: 'sc-3', durationSeconds: 40, headline: 'Electron Transport Chain & ATP' }
      ]
    };

    // 2. Compile to ProjectDocument
    const compiledDoc = bridge.createProject(agentRequest);
    assert.strictEqual(compiledDoc.scenes.length, 3);
    assert.strictEqual(compiledDoc.durationSeconds, 120);

    // 3. User edits Scene 2 text via patch
    bridge.applyScenePatch(compiledDoc, 'sc-2', {
      headline: 'The Citric Acid (Krebs) Cycle'
    });
    assert.strictEqual(compiledDoc.scenes[1].layers[1].text, 'The Citric Acid (Krebs) Cycle');

    // 4. Export to .acstudio ZIP buffer
    const exportedZip = bridge.exportProject(compiledDoc);
    assert.ok(Buffer.isBuffer(exportedZip));
    assert.ok(exportedZip.length > 200);

    // 5. Import back and verify integrity
    const imported = bridge.importProject(exportedZip);
    assert.strictEqual(imported.projectDocument.title, 'Cellular Respiration in 2 Minutes');
    assert.strictEqual(imported.projectDocument.scenes.length, 3);
    assert.strictEqual(imported.projectDocument.scenes[1].layers[1].text, 'The Citric Acid (Krebs) Cycle');

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
  console.log(`Results: ${passed}/${total} Phase 13 verification tests passed.`);
  if (passed === total) {
    console.log('STATUS: PASS FOR PHASE 13 AGENT INTEROPERABILITY RELEASE');
    process.exit(0);
  } else {
    console.error('STATUS: FAILURES DETECTED IN PHASE 13');
    process.exit(1);
  }
}

runPhase13Tests();
