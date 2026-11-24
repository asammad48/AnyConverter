/**
 * AnyConverter Creative Studio — Deterministic Command History & Undo/Redo Engine
 * Command pattern implementation for reversible, transactional editing operations.
 */

var nodeCrypto = (typeof require !== 'undefined') ? (function() { try { return require('crypto'); } catch(e) { return null; } })() : null;

class CommandEngine {
  constructor(initialProject, options = {}) {
    this.maxHistory = options.maxHistory || 100;
    this.project = JSON.parse(JSON.stringify(initialProject));
    this.undoStack = [];
    this.redoStack = [];
    this.listeners = new Set();
  }

  /**
   * Subscribe to project mutation events
   * @param {Function} listener
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify(commandName) {
    const uuidFn = (nodeCrypto && nodeCrypto.randomUUID) || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID.bind(crypto) : null);
    this.project.revisionId = uuidFn ? uuidFn() : `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    for (const listener of this.listeners) {
      try {
        listener(this.project, commandName);
      } catch (err) {
        console.error('CommandEngine listener error:', err);
      }
    }
  }

  getProject() {
    return this.project;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Execute a deterministic command and record inverse for undo
   * @param {Object} command - { name, execute(project), undo(project) }
   */
  execute(command) {
    if (!command || typeof command.execute !== 'function' || typeof command.undo !== 'function') {
      throw new Error("Invalid command: must provide 'execute' and 'undo' functions");
    }

    // Execute forward
    command.execute(this.project);

    // Record on undo stack
    this.undoStack.push(command);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift(); // Evict oldest
    }

    // Clear redo stack on new action
    this.redoStack = [];

    this._notify(command.name);
  }

  undo() {
    if (!this.canUndo()) return false;
    const command = this.undoStack.pop();
    command.undo(this.project);
    this.redoStack.push(command);
    this._notify(`undo_${command.name}`);
    return true;
  }

  redo() {
    if (!this.canRedo()) return false;
    const command = this.redoStack.pop();
    command.execute(this.project);
    this.undoStack.push(command);
    this._notify(`redo_${command.name}`);
    return true;
  }

  // --- Standard Built-In Reversible Commands ---

  /**
   * Add a layer to a scene
   */
  addLayer(sceneId, layerData) {
    const layer = JSON.parse(JSON.stringify(layerData));
    const command = {
      name: 'addLayer',
      execute: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (!scene) throw new Error(`Scene not found: ${sceneId}`);
        scene.layers.push(layer);
      },
      undo: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (scene) {
          scene.layers = scene.layers.filter(l => l.id !== layer.id);
        }
      }
    };
    this.execute(command);
  }

  /**
   * Delete a layer from a scene
   */
  deleteLayer(sceneId, layerId) {
    let removedLayer = null;
    let removedIndex = -1;

    const command = {
      name: 'deleteLayer',
      execute: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (!scene) throw new Error(`Scene not found: ${sceneId}`);
        removedIndex = scene.layers.findIndex(l => l.id === layerId);
        if (removedIndex >= 0) {
          removedLayer = scene.layers[removedIndex];
          scene.layers.splice(removedIndex, 1);
        }
      },
      undo: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (scene && removedLayer && removedIndex >= 0) {
          scene.layers.splice(removedIndex, 0, removedLayer);
        }
      }
    };
    this.execute(command);
  }

  /**
   * Set a property on a layer
   */
  setLayerProperty(sceneId, layerId, propertyPath, newValue) {
    let oldValue = undefined;

    const command = {
      name: 'setLayerProperty',
      execute: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (!scene) throw new Error(`Scene not found: ${sceneId}`);
        const layer = scene.layers.find(l => l.id === layerId);
        if (!layer) throw new Error(`Layer not found: ${layerId}`);

        const parts = propertyPath.split('.');
        let curr = layer;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!curr[parts[i]]) curr[parts[i]] = {};
          curr = curr[parts[i]];
        }
        oldValue = curr[parts[parts.length - 1]];
        curr[parts[parts.length - 1]] = newValue;
      },
      undo: (proj) => {
        const scene = proj.scenes.find(s => s.id === sceneId);
        if (!scene) return;
        const layer = scene.layers.find(l => l.id === layerId);
        if (!layer) return;

        const parts = propertyPath.split('.');
        let curr = layer;
        for (let i = 0; i < parts.length - 1; i++) {
          curr = curr[parts[i]];
        }
        curr[parts[parts.length - 1]] = oldValue;
      }
    };
    this.execute(command);
  }

  /**
   * Split a timeline clip
   */
  splitClip(trackId, clipId, splitOffsetFrames) {
    let originalClip = null;
    let clipIndex = -1;
    let rightClip = null;

    const command = {
      name: 'splitClip',
      execute: (proj) => {
        const track = proj.tracks.find(t => t.id === trackId);
        if (!track) throw new Error(`Track not found: ${trackId}`);
        clipIndex = track.clips.findIndex(c => c.clipId === clipId);
        if (clipIndex < 0) throw new Error(`Clip not found: ${clipId}`);
        originalClip = JSON.parse(JSON.stringify(track.clips[clipIndex]));

        if (splitOffsetFrames <= 0 || splitOffsetFrames >= originalClip.durationFrames) {
          throw new Error('Split frame offset must be strictly within clip duration');
        }

        // Left clip keeps original ID, shortened
        track.clips[clipIndex].durationFrames = splitOffsetFrames;
        track.clips[clipIndex].sourceOutFrame = originalClip.sourceInFrame + splitOffsetFrames;

        // Right clip created
        rightClip = {
          ...originalClip,
          clipId: `${clipId}-split-${Date.now()}`,
          sourceInFrame: originalClip.sourceInFrame + splitOffsetFrames,
          destinationStartFrame: originalClip.destinationStartFrame + splitOffsetFrames,
          durationFrames: originalClip.durationFrames - splitOffsetFrames
        };

        track.clips.splice(clipIndex + 1, 0, rightClip);
      },
      undo: (proj) => {
        const track = proj.tracks.find(t => t.id === trackId);
        if (track && originalClip && clipIndex >= 0) {
          // Remove the two split pieces and restore the single original clip
          track.clips.splice(clipIndex, 2, originalClip);
        }
      }
    };
    this.execute(command);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CommandEngine };
}
if (typeof window !== 'undefined') {
  window.CommandEngine = CommandEngine;
}
