/**
 * AnyConverter Creative Studio — Selective Scene Invalidation & Dependency Tracker
 * Ensures editing Scene 8 invalidates ONLY Scene 8, keeping all other scene asset hashes unchanged.
 */

const crypto = require('crypto');

class SceneInvalidationTracker {
  constructor(projectDocument) {
    this.project = JSON.parse(JSON.stringify(projectDocument));
    this.sceneStates = new Map();
    this.candidateReplacements = new Map();
    this._initializeBaseline();
  }

  _initializeBaseline() {
    for (const scene of (this.project.scenes || [])) {
      const contentHash = this._computeSceneHash(scene);
      this.sceneStates.set(scene.id, {
        status: 'CLEAN',
        baselineHash: contentHash,
        currentHash: contentHash,
        version: 1,
        requiresRegeneration: false
      });
    }
  }

  _computeSceneHash(scene) {
    const raw = JSON.stringify({
      id: scene.id,
      layers: scene.layers,
      durationFrames: scene.durationFrames,
      script: scene.script || ''
    });
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Mutate a scene's text/script or layers and evaluate invalidation
   * @param {string} sceneId
   * @param {Object} mutations - { script?, layers? }
   */
  updateSceneContent(sceneId, mutations = {}) {
    const scene = this.project.scenes.find(s => s.id === sceneId);
    if (!scene) throw new Error(`Scene not found: ${sceneId}`);

    if (mutations.script !== undefined) scene.script = mutations.script;
    if (mutations.layers !== undefined) scene.layers = mutations.layers;

    const newHash = this._computeSceneHash(scene);
    const state = this.sceneStates.get(sceneId);

    if (newHash !== state.baselineHash) {
      state.status = 'DIRTY';
      state.currentHash = newHash;
      state.requiresRegeneration = true;
    } else {
      state.status = 'CLEAN';
      state.currentHash = newHash;
      state.requiresRegeneration = false;
    }

    return state;
  }

  /**
   * Plan regeneration requirements and estimate provider costs
   * Only DIRTY scenes with AI generation requirements incur cost
   */
  planRegeneration() {
    const dirtyScenes = [];
    const cleanScenes = [];

    for (const [sceneId, state] of this.sceneStates.entries()) {
      if (state.status === 'DIRTY') {
        const scene = this.project.scenes.find(s => s.id === sceneId);
        dirtyScenes.push({
          sceneId,
          version: state.version + 1,
          durationFrames: scene.durationFrames,
          durationSeconds: scene.durationFrames / 30
        });
      } else {
        cleanScenes.push(sceneId);
      }
    }

    return {
      totalScenes: this.sceneStates.size,
      dirtySceneCount: dirtyScenes.length,
      cleanSceneCount: cleanScenes.length,
      dirtyScenes,
      cleanScenes,
      regenerationNeeded: dirtyScenes.length > 0,
      costImpact: {
        unaffectedScenesCharged: 0, // Invariant: 0 cost on unaffected scenes
        affectedScenesCount: dirtyScenes.length
      }
    };
  }

  /**
   * Stage candidate replacement version (version 2)
   */
  stageCandidate(sceneId, candidateAssetId) {
    const state = this.sceneStates.get(sceneId);
    if (!state) throw new Error(`Scene not found: ${sceneId}`);

    const candidate = {
      sceneId,
      candidateAssetId,
      stagedAt: new Date().toISOString(),
      status: 'AWAITING_USER_APPROVAL'
    };
    this.candidateReplacements.set(sceneId, candidate);
    return candidate;
  }

  /**
   * User decision: Accept candidate replacement
   */
  acceptCandidate(sceneId) {
    const candidate = this.candidateReplacements.get(sceneId);
    if (!candidate) throw new Error(`No staged candidate for scene: ${sceneId}`);

    const state = this.sceneStates.get(sceneId);
    state.version += 1;
    state.status = 'CLEAN';
    state.baselineHash = state.currentHash;
    state.requiresRegeneration = false;
    this.candidateReplacements.delete(sceneId);

    return {
      sceneId,
      acceptedAssetId: candidate.candidateAssetId,
      newVersion: state.version
    };
  }

  /**
   * User decision: Reject candidate replacement
   */
  rejectCandidate(sceneId) {
    this.candidateReplacements.delete(sceneId);
    return { sceneId, rejected: true };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SceneInvalidationTracker };
}
