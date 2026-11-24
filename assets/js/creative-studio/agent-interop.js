/**
 * AnyConverter Creative Studio — Phase 13: Agent Interoperability Compiler & Schema
 * Enables AI assistants (ChatGPT, Claude, custom agents) to generate valid,
 * editable AnyConverter projects via portable JSON without a remote backend.
 * Enforces strict security bounds: anti-XSS, anti-pollution, path traversal bans,
 * secret detection, and deterministic scene patching.
 */

const crypto = typeof require !== 'undefined' ? require('crypto') : null;

const AGENT_INTEROP_VERSION = '1.0.0';

const ALLOWED_ASPECT_RATIOS = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 }
};

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/i,               // OpenAI key pattern
  /AIzaSy[a-zA-Z0-9_-]{25,}/i,          // Google API key pattern
  /hf_[a-zA-Z0-9]{20,}/i,               // Hugging Face token pattern
  /ghp_[a-zA-Z0-9]{20,}/i,              // GitHub token pattern
  /bearer\s+[a-zA-Z0-9_\-\.]{25,}/i     // Generic Bearer token
];

class AgentInteropSecurity {
  /**
   * Validate and sanitize untrusted assistant JSON
   * @param {string|Object} rawInput
   * @returns {Object} Sanitized object
   */
  static parseAndSanitize(rawInput) {
    let rawStr = '';
    if (typeof rawInput === 'string') {
      rawStr = rawInput;
    } else {
      rawStr = JSON.stringify(rawInput);
    }

    // 1. Prototype Pollution Defense (raw string scan)
    if (rawStr.includes('__proto__') || rawStr.includes('"constructor"') || rawStr.includes('"prototype"')) {
      const err = new Error('SECURITY_ERROR: Prototype pollution key detected in assistant JSON');
      err.code = 'PROTOTYPE_POLLUTION_DETECTED';
      throw err;
    }

    // 2. Secret & API Key Leakage Detection
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(rawStr)) {
        const err = new Error('SECURITY_ERROR: Leaked API key or auth token detected in assistant JSON. Credentials must never be embedded in project files.');
        err.code = 'LEAKED_CREDENTIALS_DETECTED';
        throw err;
      }
    }

    // 3. XSS and Script Injection Defense
    const scriptPatterns = [
      /<script[\s\S]*?>/i,
      /javascript:/i,
      /\bonload\s*=/i,
      /\bonerror\s*=/i,
      /\bonclick\s*=/i
    ];
    for (const sp of scriptPatterns) {
      if (sp.test(rawStr)) {
        const err = new Error('SECURITY_ERROR: Script injection / XSS pattern detected in assistant JSON');
        err.code = 'XSS_INJECTION_DETECTED';
        throw err;
      }
    }

    // 4. Path Traversal Defense
    if (rawStr.includes('../') || rawStr.includes('..\\')) {
      const err = new Error('SECURITY_ERROR: Path traversal sequence (../) detected in assistant JSON');
      err.code = 'PATH_TRAVERSAL_DETECTED';
      throw err;
    }

    const parsed = JSON.parse(rawStr);

    // Deep object sanitization
    this._deepSanitize(parsed);

    return parsed;
  }

  static _deepSanitize(obj) {
    if (!obj || typeof obj !== 'object') return;

    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete obj[key];
        continue;
      }

      const val = obj[key];
      if (typeof val === 'string') {
        // Strip any residual HTML tags
        obj[key] = val.replace(/<[^>]*>/g, '');
      } else if (typeof val === 'number') {
        // Guard against negative durations
        if (key.toLowerCase().includes('duration') && val < 0) {
          throw new Error(`VALIDATION_ERROR: Negative duration (${val}) is not permitted`);
        }
      } else if (typeof val === 'object') {
        this._deepSanitize(val);
      }
    }
  }
}

class CreationRequestCompiler {
  /**
   * Compile a portable CreationRequest into a full AnyConverter ProjectDocument
   * @param {Object|string} creationRequestRaw
   * @returns {Object} Fully fledged ProjectDocument
   */
  compile(creationRequestRaw) {
    const req = AgentInteropSecurity.parseAndSanitize(creationRequestRaw);

    if (!req.requestVersion) {
      throw new Error('MISSING_REQUEST_VERSION: CreationRequest must declare requestVersion (e.g. 1.0.0)');
    }

    const topic = req.topic || 'Untitled Explainer';
    const intent = req.intent || 'animated-explainer';
    const productionMode = req.productionMode || 'native';
    const totalDurationSeconds = req.durationSeconds || 180;
    const aspectRatioKey = req.aspectRatio || '16:9';
    const dimensions = ALLOWED_ASPECT_RATIOS[aspectRatioKey] || ALLOWED_ASPECT_RATIOS['16:9'];
    const language = req.language || 'en';
    const templateId = req.templateId || 'default-template';

    const projectId = (crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const revisionId = `rev_${Date.now()}_initial`;

    // Compile scenes
    const scenes = [];
    let accumulatedTime = 0;

    const requestScenes = Array.isArray(req.scenes) && req.scenes.length > 0
      ? req.scenes
      : [
          { id: 'scene-1', durationSeconds: Math.min(15, totalDurationSeconds), headline: topic, visuals: ['title-card'] }
        ];

    for (let i = 0; i < requestScenes.length; i++) {
      const s = requestScenes[i];
      const sceneId = s.id || `scene-${i + 1}`;
      const durationSeconds = s.durationSeconds || 10;
      const headline = s.headline || `Scene ${i + 1}`;
      const visuals = Array.isArray(s.visuals) ? s.visuals : [];

      const layers = [
        {
          id: `layer-${sceneId}-bg`,
          type: 'background',
          color: '#0F172A', // Slate 900
          visible: true
        },
        {
          id: `layer-${sceneId}-headline`,
          type: 'text',
          text: headline,
          fontSize: 64,
          fontFamily: 'Inter, sans-serif',
          color: '#F8FAFC',
          alignment: 'center',
          position: { x: dimensions.width / 2, y: dimensions.height / 3 },
          visible: true
        }
      ];

      for (let j = 0; j < visuals.length; j++) {
        layers.push({
          id: `layer-${sceneId}-visual-${j + 1}`,
          type: 'shape',
          shape: 'vector-badge',
          label: visuals[j],
          position: { x: dimensions.width / 2, y: (dimensions.height / 2) + (j * 80) },
          visible: true
        });
      }

      scenes.push({
        sceneId,
        sceneNumber: i + 1,
        title: headline,
        startTimeSeconds: accumulatedTime,
        durationSeconds,
        layers,
        shots: [
          {
            shotId: `shot-${sceneId}-main`,
            durationSeconds,
            cameraInstruction: 'static_center',
            versions: [
              {
                versionNumber: 1,
                assetId: null, // Native layer render
                status: 'APPROVED',
                createdAt: new Date().toISOString()
              }
            ],
            activeVersionNumber: 1
          }
        ]
      });

      accumulatedTime += durationSeconds;
    }

    return {
      projectId,
      revisionId,
      title: topic,
      kind: 'video',
      fps: 30,
      width: dimensions.width,
      height: dimensions.height,
      durationSeconds: accumulatedTime,
      scenes,
      metadata: {
        generator: 'AnyConverter Agent Interop Compiler v1.0',
        generatedByAgent: true,
        templateId,
        intent,
        productionMode,
        language,
        aiAuthorized: Boolean(req.aiAuthorized),
        compiledAt: new Date().toISOString()
      }
    };
  }

  /**
   * Apply a non-destructive scene patch proposed by an assistant
   * (e.g. updating subtitle or title in Scene 8 while preserving all other scenes)
   * @param {Object} projectDocument
   * @param {string} sceneId
   * @param {Object} patchProposal
   * @returns {{ success: boolean, updatedProject: Object, previousSnapshot: Object, affectedSceneId: string }}
   */
  applyScenePatch(projectDocument, sceneId, patchProposal) {
    if (!projectDocument || !Array.isArray(projectDocument.scenes)) {
      throw new Error('INVALID_PROJECT: Must provide valid ProjectDocument');
    }

    const sanitizedPatch = AgentInteropSecurity.parseAndSanitize(patchProposal);
    const targetScene = projectDocument.scenes.find(s => s.sceneId === sceneId);
    if (!targetScene) {
      throw new Error(`SCENE_NOT_FOUND: Scene '${sceneId}' does not exist in project`);
    }

    // Capture snapshot for instant undo
    const previousSnapshot = JSON.parse(JSON.stringify(targetScene));

    // Apply patch mutations to target scene only
    if (sanitizedPatch.headline) {
      targetScene.title = sanitizedPatch.headline;
      const textLayer = targetScene.layers.find(l => l.type === 'text');
      if (textLayer) {
        textLayer.text = sanitizedPatch.headline;
      }
    }

    if (sanitizedPatch.title) {
      targetScene.title = sanitizedPatch.title;
    }

    if (sanitizedPatch.textLayerPatch) {
      const textLayer = targetScene.layers.find(l => l.type === 'text');
      if (textLayer) {
        Object.assign(textLayer, sanitizedPatch.textLayerPatch);
      }
    }

    if (sanitizedPatch.durationSeconds && sanitizedPatch.durationSeconds > 0) {
      targetScene.durationSeconds = sanitizedPatch.durationSeconds;
    }

    projectDocument.revisionId = `rev_${Date.now()}_patch_${sceneId}`;

    return {
      success: true,
      updatedProject: projectDocument,
      previousSnapshot,
      affectedSceneId: sceneId
    };
  }

  /**
   * Revert a previously applied scene patch
   * @param {Object} projectDocument
   * @param {string} sceneId
   * @param {Object} previousSnapshot
   */
  revertScenePatch(projectDocument, sceneId, previousSnapshot) {
    const idx = projectDocument.scenes.findIndex(s => s.sceneId === sceneId);
    if (idx === -1) {
      throw new Error(`SCENE_NOT_FOUND: Scene '${sceneId}' not found for revert`);
    }
    projectDocument.scenes[idx] = JSON.parse(JSON.stringify(previousSnapshot));
    projectDocument.revisionId = `rev_${Date.now()}_revert_${sceneId}`;
    return projectDocument;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AGENT_INTEROP_VERSION,
    ALLOWED_ASPECT_RATIOS,
    AgentInteropSecurity,
    CreationRequestCompiler
  };
} else if (typeof window !== 'undefined') {
  window.CreationRequestCompiler = CreationRequestCompiler;
  window.AgentInteropSecurity = AgentInteropSecurity;
  window.AGENT_INTEROP_VERSION = AGENT_INTEROP_VERSION;
}
