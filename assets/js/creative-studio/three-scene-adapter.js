/**
 * AnyConverter Creative Studio — Three.js 3D Scene Graph Adapter
 * Manages glTF character models, WebGL camera/lighting, and context loss recovery with 2D fallback.
 */

class ThreeSceneAdapter {
  constructor(options = {}) {
    this.models = new Map();
    this.camera = options.camera || { fov: 45, position: [0, 1.5, 3], target: [0, 0, 0] };
    this.lights = options.lights || [
      { type: 'ambient', color: '#ffffff', intensity: 0.6 },
      { type: 'directional', color: '#ffffff', intensity: 1.2, position: [5, 10, 7.5] }
    ];
    this.contextState = 'active'; // 'active' | 'lost' | 'restored' | 'unsupported'
    this.fallbackPoster = options.fallbackPoster || null;
    this.isRendering = false;
  }

  /**
   * Load and register a glTF/GLB model into the 3D scene
   * @param {string} id - Model instance ID
   * @param {Object} modelSpec - { assetId, position, rotation, scale }
   */
  loadGltfModel(id, modelSpec) {
    if (!id || !modelSpec) throw new Error('Model ID and specification are required');
    const record = {
      id,
      assetId: modelSpec.assetId,
      position: modelSpec.position || [0, 0, 0],
      rotation: modelSpec.rotation || [0, 0, 0],
      scale: modelSpec.scale || [1, 1, 1],
      animationClip: modelSpec.animationClip || null,
      loaded: true
    };
    this.models.set(id, record);
    return record;
  }

  updateModelTransform(id, transform = {}) {
    const model = this.models.get(id);
    if (!model) throw new Error(`Model not found: ${id}`);
    if (transform.position) model.position = [...transform.position];
    if (transform.rotation) model.rotation = [...transform.rotation];
    if (transform.scale) model.scale = [...transform.scale];
    return model;
  }

  // --- WebGL Context Loss Recovery Cycle ---

  handleContextLost() {
    this.contextState = 'lost';
    this.isRendering = false;
    // Snapshot scene transforms for restoration
    const snapshot = {};
    for (const [id, m] of this.models.entries()) {
      snapshot[id] = { position: [...m.position], rotation: [...m.rotation], scale: [...m.scale] };
    }
    this._savedSnapshot = snapshot;
    return {
      status: 'CONTEXT_LOST_HANDLED',
      modelsPreserved: this.models.size,
      activeAction: 'PAUSED_AWAITING_RESTORE'
    };
  }

  handleContextRestored() {
    this.contextState = 'restored';
    this.isRendering = true;
    // Restore model states from snapshot
    if (this._savedSnapshot) {
      for (const [id, saved] of Object.entries(this._savedSnapshot)) {
        if (this.models.has(id)) {
          const m = this.models.get(id);
          m.position = [...saved.position];
          m.rotation = [...saved.rotation];
          m.scale = [...saved.scale];
        }
      }
    }
    return {
      status: 'CONTEXT_RESTORED',
      modelsRebuilt: this.models.size
    };
  }

  /**
   * Safe frame render query
   * Gracefully returns 2D poster fallback if WebGL is unsupported or lost
   */
  evaluateFrame(frameNumber) {
    if (this.contextState === 'lost' || this.contextState === 'unsupported') {
      return {
        renderedMode: '2D_POSTER_FALLBACK',
        poster: this.fallbackPoster,
        message: 'WebGL context unavailable. Fallback 2D placeholder displayed.'
      };
    }

    return {
      renderedMode: '3D_WEBGL',
      frame: frameNumber,
      camera: this.camera,
      modelCount: this.models.size,
      models: Array.from(this.models.values())
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThreeSceneAdapter };
}
