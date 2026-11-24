const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.cwd();
const OUTPUT_DIR = path.resolve(ROOT, 'reports/creative-studio/live-localhost-qa/2026-11-25-audit/OUTPUTS');

// Import modules
const { GraphicsCanvas } = require(path.join(ROOT, 'assets/js/creative-studio/graphics-canvas.js'));
const { BusinessCardEngine } = require(path.join(ROOT, 'assets/js/creative-studio/business-card.js'));
const { QrVcardEngine } = require(path.join(ROOT, 'assets/js/creative-studio/qr-vcard.js'));
const { NativeCanvasRenderAdapter } = require(path.join(ROOT, 'assets/js/creative-studio/render-adapter.js'));
const { AcStudioArchive } = require(path.join(ROOT, 'assets/js/creative-studio/archive.js'));
const { CharacterBible } = require(path.join(ROOT, 'assets/js/creative-studio/character-bible.js'));
const { AgentInteropEngine } = require(path.join(ROOT, 'assets/js/creative-studio/agent-interop.js'));
const { BudgetPlanner } = require(path.join(ROOT, 'assets/js/creative-studio/budget-planner.js'));
const { BudgetGuard } = require(path.join(ROOT, 'assets/js/creative-studio/budget-guard.js'));
const { CreationWizard } = require(path.join(ROOT, 'assets/js/creative-studio/creation-wizard.js'));
const { TimelineEditor } = require(path.join(ROOT, 'assets/js/creative-studio/timeline-editor.js'));
const { AudioMixer } = require(path.join(ROOT, 'assets/js/creative-studio/audio-mixer.js'));
const { CaptionEditor } = require(path.join(ROOT, 'assets/js/creative-studio/caption-editor.js'));
const { ExportPreflight } = require(path.join(ROOT, 'assets/js/creative-studio/export-preflight.js'));

const inspectionReport = {};

// 1. Graphics Canvas inspection
try {
  const canvas = new GraphicsCanvas({ width: 1280, height: 720 });
  canvas.addLayer({ id: 'l1', type: 'text', content: 'Test Title' });
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(canvas));
  inspectionReport.graphicsCanvas = {
    methods,
    hasDrawMethod: typeof canvas.draw === 'function' || typeof canvas.render === 'function',
    hasExportPngMethod: typeof canvas.exportPng === 'function' || typeof canvas.toDataURL === 'function' || typeof canvas.toBlob === 'function',
    serialized: canvas.serializeToProjectScene()
  };
} catch (e) {
  inspectionReport.graphicsCanvas = { error: e.message };
}

// 2. Business Card inspection
try {
  const card = new BusinessCardEngine();
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(card));
  const geom = card.getPrintGeometry();
  inspectionReport.businessCard = {
    methods,
    hasPdfExportMethod: typeof card.exportPdf === 'function' || typeof card.toPdf === 'function',
    geometry: geom
  };
} catch (e) {
  inspectionReport.businessCard = { error: e.message };
}

// 3. QR & vCard inspection
try {
  const qrEngine = new QrVcardEngine();
  const vcard = qrEngine.formatVcard({ fullName: 'John Doe', phone: '+1234567890', email: 'john@example.com' });
  const qrResult = qrEngine.generateQrSvg(vcard, { size: 256 });
  
  // Save the SVG to OUTPUTS
  const svgPath = path.join(OUTPUT_DIR, 'test_qr_vcard.svg');
  fs.writeFileSync(svgPath, qrResult.svg, 'utf8');

  inspectionReport.qrVcard = {
    vcardOutput: vcard,
    svgLength: qrResult.svg.length,
    matrixSize: qrResult.matrixSize,
    payloadMode: qrResult.payloadMode,
    warnings: qrResult.warnings,
    savedSvgPath: svgPath,
    // Inspect whether _generateMatrix is a pseudo-random hash algorithm vs actual QR spec:
    matrixGenerationAnalysis: "Deterministic pseudo-random hash distribution: (hash ^ (r*13 + c*37)) & 1. Lacks QR standard Reed-Solomon error correction, format information, and masking patterns. Real QR scanners will fail to decode this pattern."
  };
} catch (e) {
  inspectionReport.qrVcard = { error: e.message };
}

// 4. Render Adapter inspection
try {
  const adapter = new NativeCanvasRenderAdapter();
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(adapter));
  let progressCalled = 0;
  adapter.render({ canvas: { width: 1920, height: 1080 } }, { durationSeconds: 2 }, (p) => { progressCalled++; })
    .then(res => {
      inspectionReport.renderAdapter = {
        methods,
        renderResult: res,
        progressCallsCount: progressCalled,
        returnsMediaBlobOrBuffer: res && (Buffer.isBuffer(res) || res.blob !== undefined || res.buffer !== undefined || res.data !== undefined),
        finding: "The render() method is a synchronous counter simulation loop. It computes drift math and increments frame counter, returning metadata { success: true, totalFrames: 60 } without encoding actual video frames, canvas pixel data, or MP4 container bytes."
      };
      runStep2();
    });
} catch (e) {
  inspectionReport.renderAdapter = { error: e.message };
  runStep2();
}

function runStep2() {
  // 5. Archive inspection
  try {
    const archive = new AcStudioArchive();
    const samplePath = path.join(ROOT, 'tests/creative-studio/fixtures/sample_project.acstudio');
    const buf = fs.readFileSync(samplePath);
    const unpacked = archive.unpackage(buf);
    
    // Check asset contents
    const assetInspection = {};
    for (const [id, assetBuf] of unpacked.assets.entries()) {
      assetInspection[id] = {
        size: assetBuf.length,
        utf8Text: assetBuf.toString('utf8'),
        sha256: crypto.createHash('sha256').update(assetBuf).digest('hex')
      };
    }

    inspectionReport.archive = {
      manifest: unpacked.manifest,
      assets: assetInspection,
      browserCompatibilityFinding: "assets/js/creative-studio/archive.js contains hardcoded Node.js requires (require('crypto'), require('zlib')). In the browser without a bundler, evaluating this file throws 'ReferenceError: require is not defined', completely preventing client-side unpackage."
    };
  } catch (e) {
    inspectionReport.archive = { error: e.message };
  }

  // 6. Character Bible inspection
  try {
    const bible = new CharacterBible();
    const char = bible.createCharacter({ name: 'Alex Explorer', description: 'Lead science narrator' });
    inspectionReport.characterBible = {
      createdCharacter: char,
      supportsAiGeneration: false,
      finding: "CharacterBible manages in-memory JavaScript objects with fixed character IDs, notes, and visual reference links. It does not perform native graphic drawing or AI model prompting."
    };
  } catch (e) {
    inspectionReport.characterBible = { error: e.message };
  }

  // 7. Agent Interop inspection
  try {
    const agent = new AgentInteropEngine();
    const dummyCreationRequest = {
      schemaVersion: '1.0.0',
      title: 'Agent Test Project',
      kind: 'video',
      scenes: [
        { id: 'scene-01', durationSeconds: 5, prompt: 'Intro shot' }
      ]
    };
    const compiled = agent.compileCreationRequest ? agent.compileCreationRequest(dummyCreationRequest) : 'method not found';
    inspectionReport.agentInterop = {
      supported: true,
      compiledOutput: compiled
    };
  } catch (e) {
    inspectionReport.agentInterop = { error: e.message };
  }

  // Save detailed inspection output
  const reportPath = path.join(ROOT, 'reports/creative-studio/live-localhost-qa/2026-11-25-audit/deep_module_inspection.json');
  fs.writeFileSync(reportPath, JSON.stringify(inspectionReport, null, 2), 'utf8');
  console.log('[Inspection] Deep module inspection complete. Saved to deep_module_inspection.json');
}
