/**
 * AnyConverter Creative Studio — 8-Step Creation Wizard Engine
 * Context-aware setup flow asking strictly relevant questions in canonical sequence.
 */

class CreationWizard {
  constructor(options = {}) {
    this.currentStep = 1;
    this.hasConnectedProvider = options.hasConnectedProvider || false;
    this.state = {
      action: 'new', // 'new' | 'resume-local' | 'resume-drive'
      kind: 'video', // 'graphic' | 'video' | 'business-card' | 'series'
      subType: '2d-explainer',
      productionMode: 'native', // 'native' | 'ai' | 'hybrid'
      style: '2d-animation',
      inputs: {
        title: '',
        topic: '',
        durationSeconds: 180,
        aspectRatio: '16:9',
        locale: 'en',
        scriptText: ''
      },
      planner: null,
      approved: false
    };
  }

  // Step 1: Create or Resume
  step1ChooseAction(action) {
    if (!['new', 'resume-local', 'resume-drive'].includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }
    this.state.action = action;
    this.currentStep = 2;
    return this.getState();
  }

  // Step 2: What are we creating?
  step2ChooseKind(kind, subType = '2d-explainer') {
    const validKinds = ['graphic', 'video', 'business-card', 'series'];
    if (!validKinds.includes(kind)) {
      throw new Error(`Invalid kind: ${kind}`);
    }
    this.state.kind = kind;
    this.state.subType = subType;
    this.currentStep = 3;
    return this.getState();
  }

  // Step 3: How are we producing it? (Native vs AI vs Hybrid)
  step3ChooseProductionMode(mode) {
    const validModes = ['native', 'ai', 'hybrid'];
    if (!validModes.includes(mode)) {
      throw new Error(`Invalid production mode: ${mode}`);
    }

    if ((mode === 'ai' || mode === 'hybrid') && !this.hasConnectedProvider) {
      return {
        allowed: false,
        reason: 'NO_PROVIDER_CONNECTED: An AI provider key must be connected or choose Native (No AI) mode.',
        recommendedAction: 'SWITCH_TO_NATIVE_OR_CONNECT_KEY'
      };
    }

    this.state.productionMode = mode;
    this.currentStep = 4;
    return { allowed: true, state: this.getState() };
  }

  // Step 4: Contextual Style
  step4ChooseStyle(style) {
    // Prevent inappropriate styling questions (e.g. 3D animation for business cards)
    if (this.state.kind === 'business-card' && (style === '3d-animation' || style === 'cinematic')) {
      throw new Error('Inappropriate style for business card: 3D animation is not applicable');
    }
    this.state.style = style;
    this.currentStep = 5;
    return this.getState();
  }

  // Step 5: Collect Project Inputs
  step5SetInputs(inputs = {}) {
    this.state.inputs = {
      title: inputs.title || 'Untitled Project',
      topic: inputs.topic || '',
      durationSeconds: inputs.durationSeconds || 180,
      aspectRatio: inputs.aspectRatio || '16:9',
      locale: inputs.locale || 'en',
      scriptText: inputs.scriptText || ''
    };
    this.currentStep = 6;
    return this.getState();
  }

  // Step 6: Generate Planner
  step6GeneratePlan() {
    const duration = this.state.inputs.durationSeconds;
    const isNative = this.state.productionMode === 'native';

    // 1 scene per 15-30 seconds
    const sceneCount = Math.max(1, Math.ceil(duration / 25));
    const scenes = [];

    for (let i = 1; i <= sceneCount; i++) {
      scenes.push({
        id: `scene-${String(i).padStart(2, '0')}`,
        durationSeconds: Math.floor(duration / sceneCount),
        type: isNative ? 'native-template' : (this.state.productionMode === 'hybrid' && i % 2 === 0 ? 'ai-shot' : 'native-template'),
        costEstimated: isNative ? 0 : 1 // 1 provider request per AI shot
      });
    }

    const aiCallCount = scenes.filter(s => s.type === 'ai-shot').length;

    this.state.planner = {
      durationSeconds: duration,
      sceneCount,
      scenes,
      aiRequestsPlanned: aiCallCount,
      estimatedCostUnits: isNative ? 0 : `${aiCallCount} provider API calls`,
      isCostZero: isNative
    };

    this.currentStep = 7;
    return this.state.planner;
  }

  // Step 7: Approval Gate
  step7ApprovePlan(approved = true) {
    this.state.approved = approved;
    if (approved) {
      this.currentStep = 8;
    }
    return {
      approved: this.state.approved,
      readyToCreate: this.currentStep === 8
    };
  }

  // Step 8: Assemble Project
  step8CreateProject() {
    if (!this.state.approved) {
      throw new Error('Cannot create project: planner approval required');
    }

    const fps = 30;
    const totalFrames = this.state.inputs.durationSeconds * fps;
    const canvasDimensions = this._resolveDimensions(this.state.inputs.aspectRatio);

    return {
      schemaVersion: '1.0.0',
      projectId: `proj-${Date.now()}`,
      revisionId: `rev-init-${Date.now()}`,
      title: this.state.inputs.title,
      kind: this.state.kind,
      locale: this.state.inputs.locale,
      canvas: {
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        fpsNumerator: 30,
        fpsDenominator: 1,
        background: '#09090b'
      },
      assets: [],
      scenes: this.state.planner.scenes.map((s, idx) => ({
        id: s.id,
        name: `Scene ${idx + 1}`,
        startFrame: idx * Math.round(totalFrames / this.state.planner.scenes.length),
        durationFrames: Math.round(totalFrames / this.state.planner.scenes.length),
        layers: [
          {
            id: `layer-${s.id}-bg`,
            type: 'background',
            name: 'Background',
            visible: true,
            locked: true,
            opacity: 1.0,
            transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
            content: '#18181b'
          },
          {
            id: `layer-${s.id}-title`,
            type: 'text',
            name: 'Scene Title',
            visible: true,
            locked: false,
            opacity: 1.0,
            transform: { x: 100, y: 150, scaleX: 1, scaleY: 1, rotationDeg: 0 },
            content: `Scene ${idx + 1}: ${this.state.inputs.topic || 'Concept'}`
          }
        ]
      })),
      tracks: [
        {
          id: 'track-v1',
          kind: 'video',
          name: 'Video Track',
          muted: false,
          solo: false,
          locked: false,
          clips: []
        }
      ]
    };
  }

  _resolveDimensions(aspectRatio) {
    switch (aspectRatio) {
      case '9:16': return { width: 1080, height: 1920 };
      case '1:1': return { width: 1080, height: 1080 };
      case '16:9':
      default:
        return { width: 1920, height: 1080 };
    }
  }

  getState() {
    return {
      currentStep: this.currentStep,
      ...this.state
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CreationWizard };
}
