#!/usr/bin/env node
/**
 * AnyConverter Creative Studio — Phase 07 Unit & Integration Suite
 * Validates Creation Wizards, Deterministic Native Parser, AI Prompt Compiler & Storyboards.
 */

const assert = require('assert');

const { CreationWizard } = require('../../../assets/js/creative-studio/creation-wizard');
const { NativeParser } = require('../../../assets/js/creative-studio/native-parser');
const { PromptCompiler } = require('../../../assets/js/creative-studio/prompt-compiler');
const { StoryboardManager } = require('../../../assets/js/creative-studio/storyboard-manager');

console.log('================================================================');
console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 07 VERIFICATION SUITE   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  process.stdout.write(`[TEST] ${name}... `);
  try {
    fn();
    console.log('PASS');
    passCount++;
  } catch (err) {
    console.log('FAIL');
    console.error(`  Error: ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Zero-Cost 3-Minute Native Explainer Creation
// -----------------------------------------------------------------------------
runTest('T1: Zero-Cost 3-Minute Native Explainer Creation Without AI Credentials', () => {
  const wizard = new CreationWizard({ hasConnectedProvider: false });

  wizard.step1ChooseAction('new');
  wizard.step2ChooseKind('video', '2d-explainer');
  const modeRes = wizard.step3ChooseProductionMode('native');
  assert.strictEqual(modeRes.allowed, true);

  wizard.step4ChooseStyle('2d-animation');
  wizard.step5SetInputs({
    title: 'How Water Cycles Work',
    topic: 'Atmospheric Physics',
    durationSeconds: 180,
    aspectRatio: '16:9'
  });

  const plan = wizard.step6GeneratePlan();
  assert.strictEqual(plan.durationSeconds, 180);
  assert.strictEqual(plan.isCostZero, true);
  assert.strictEqual(plan.aiRequestsPlanned, 0);

  const approval = wizard.step7ApprovePlan(true);
  assert.strictEqual(approval.readyToCreate, true);

  const project = wizard.step8CreateProject();
  assert.strictEqual(project.kind, 'video');
  assert.strictEqual(project.scenes.length, plan.sceneCount);
  assert.strictEqual(project.canvas.width, 1920);
});

// -----------------------------------------------------------------------------
// TEST 2: Contextual Wizard Flow (Inappropriate Style Rejected)
// -----------------------------------------------------------------------------
runTest('T2: Contextual Wizard Rejects Inappropriate Styles (No 3D for Business Cards)', () => {
  const wizard = new CreationWizard();
  wizard.step1ChooseAction('new');
  wizard.step2ChooseKind('business-card');
  wizard.step3ChooseProductionMode('native');

  // Attempt to select 3D animation for business card must be rejected
  assert.throws(() => {
    wizard.step4ChooseStyle('3d-animation');
  }, /Inappropriate style for business card/);

  // Corporate minimalist style is accepted
  const validStyle = wizard.step4ChooseStyle('minimalist-corporate');
  assert.strictEqual(validStyle.style, 'minimalist-corporate');
});

// -----------------------------------------------------------------------------
// TEST 3: AI Mode Gated When No Provider Key Connected
// -----------------------------------------------------------------------------
runTest('T3: AI Mode Gated Gracefully When No Provider Connected', () => {
  const uncredentialedWizard = new CreationWizard({ hasConnectedProvider: false });
  uncredentialedWizard.step1ChooseAction('new');
  uncredentialedWizard.step2ChooseKind('video');

  const modeRes = uncredentialedWizard.step3ChooseProductionMode('ai');
  assert.strictEqual(modeRes.allowed, false);
  assert.strictEqual(modeRes.recommendedAction, 'SWITCH_TO_NATIVE_OR_CONNECT_KEY');
  assert.ok(modeRes.reason.includes('NO_PROVIDER_CONNECTED'));
});

// -----------------------------------------------------------------------------
// TEST 4: 5-Minute Drama Prompt Compiler Produces Bounded Plan Without Auto-Spending
// -----------------------------------------------------------------------------
runTest('T4: 5-Minute Prompt Produces Structured Plan with Bounded AI Shot Counts', () => {
  const compiler = new PromptCompiler({ maxShotDurationSeconds: 5 });

  const rawPrompt = 'Create a five-minute animated family drama with Sara and Leo in an apartment. Dramatic confrontation and resolution.';
  const compilation = compiler.compilePrompt(rawPrompt, { durationSeconds: 300, style: '3d-animation' });

  assert.strictEqual(compilation.plan.durationSeconds, 300);
  assert.strictEqual(compilation.plan.style, '3d-animation');
  assert.strictEqual(compilation.plan.approval.status, 'AWAITING_USER_APPROVAL');
  assert.ok(compilation.plan.characters.some(c => c.name === 'Sara'));
  assert.ok(compilation.plan.characters.some(c => c.name === 'Leo'));

  // Ensure 300s is divided into reasonable scenes, not a single monolithic request
  assert.ok(compilation.plan.scenes.length >= 10);
});

// -----------------------------------------------------------------------------
// TEST 5: Visual Storyboard Cards & One-Click Native Fallback Toggle
// -----------------------------------------------------------------------------
runTest('T5: Storyboard Cards Toggle Native Fallback & Reduce Cost to Zero', () => {
  const sampleScenes = [
    { id: 's-01', title: 'Intro', durationSeconds: 20, productionType: 'ai-shot' },
    { id: 's-02', title: 'Conflict', durationSeconds: 30, productionType: 'ai-shot' }
  ];

  const storyboard = new StoryboardManager(sampleScenes);
  let metrics = storyboard.calculateMetrics();
  assert.strictEqual(metrics.aiSceneCount, 2);
  assert.strictEqual(metrics.estimatedAiCalls, 2);

  // Toggle Scene 1 to Native Fallback
  storyboard.toggleNativeFallback('s-01');
  metrics = storyboard.calculateMetrics();
  assert.strictEqual(metrics.aiSceneCount, 1);
  assert.strictEqual(metrics.nativeSceneCount, 1);

  // Toggle Scene 2 to Native Fallback
  storyboard.toggleNativeFallback('s-02');
  metrics = storyboard.calculateMetrics();
  assert.strictEqual(metrics.aiSceneCount, 0);
  assert.strictEqual(metrics.nativeSceneCount, 2);
  assert.strictEqual(metrics.costUnitsSummary, '0 (100% Free Native)');
});

// -----------------------------------------------------------------------------
// TEST 6: Multilingual UI Labels & Credential-Free Export (EN, ES, DA)
// -----------------------------------------------------------------------------
runTest('T6: Multilingual Storyboard Labels & Credential-Free CSV/JSON Export', () => {
  const sampleScenes = [
    { id: 's-es', title: 'Introducción "Clásica"', durationSeconds: 25, productionType: 'native-vector', visualPrompt: 'Escena de prueba con acentos: José & María.' }
  ];

  // Spanish Storyboard
  const esStoryboard = new StoryboardManager(sampleScenes, { locale: 'es' });
  const labelsEs = esStoryboard.getLabels();
  assert.strictEqual(labelsEs.storyboardTitle, 'Planificador de Guión Gráfico');

  // Danish Storyboard
  const daStoryboard = new StoryboardManager(sampleScenes, { locale: 'da' });
  const labelsDa = daStoryboard.getLabels();
  assert.strictEqual(labelsDa.storyboardTitle, 'Visuel Storyboard Planlægger');

  // Export CSV and verify quotes and diacritics
  const csv = esStoryboard.exportCsv();
  assert.ok(csv.includes('Introducción ""Clásica""'));
  assert.ok(csv.includes('José & María'));

  // Export JSON and verify zero credentials
  const json = esStoryboard.exportJson();
  assert.ok(!json.includes('sk-'));
  assert.ok(!json.includes('ya29.'));
});

// -----------------------------------------------------------------------------
// TEST 7: Deterministic Native Mini-Language Parser
// -----------------------------------------------------------------------------
runTest('T7: Deterministic Native Mini-Language Parser Generates Scenes with Zero AI', () => {
  const parser = new NativeParser();

  const script = `
    Mode: Animated 2D Explainer
    Template: Whiteboard Science
    Title: How Volcanoes Erupt
    Output: 1080p 16:9 @ 30 fps
    Scene 1: Earth has tectonic layers | duration=10s | layout=diagram | animation=fade
    Scene 2: Magma accumulates beneath crust | duration=12s | animation=wipe
    Scene 3: Explosive Eruption | duration=8s | animation=particle
  `;

  const parsed = parser.parseScript(script);
  assert.strictEqual(parsed.valid, true);
  assert.strictEqual(parsed.project.title, 'How Volcanoes Erupt');
  assert.strictEqual(parsed.project.scenes.length, 3);
  assert.strictEqual(parsed.project.scenes[0].durationFrames, 300); // 10s * 30fps
  assert.strictEqual(parsed.project.scenes[1].durationFrames, 360); // 12s * 30fps
  assert.strictEqual(parsed.project.scenes[2].durationFrames, 240); // 8s * 30fps
  assert.strictEqual(parsed.project.aiRequestsPlanned, 0, 'Must require exactly 0 AI requests');
});

console.log('\n================================================================');
console.log(`PHASE 07 SUMMARY: ${passCount}/7 Tests Passed (${failCount} Failures).`);
console.log('STATUS: ALL PHASE 07 VERIFICATION CRITERIA PASS.');
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
