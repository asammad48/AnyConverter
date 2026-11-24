/**
 * AnyConverter Creative Studio — Multitrack Timeline & NLE Editing Engine
 * Non-destructive video/audio/text editing with ripple, split, slip, and clip provenance classification.
 */

class TimelineEditor {
  constructor(options = {}) {
    this.fps = options.fps || 30;
    this.tracks = [];
    this.playheadFrame = 0;
  }

  // --- Three Distinct Clip Editing Classes per File 06 §1 ---
  static get EDITING_CLASSES() {
    return {
      SOURCE_NATIVE: 'SOURCE_NATIVE',         // Full access to layers, texts, animations, vectors
      GENERATED_FOOTAGE: 'GENERATED_FOOTAGE', // Flattened video with prompt/seed/model metadata; shot regeneration only
      IMPORTED_RASTER: 'IMPORTED_RASTER'      // Standard external MP4/WebM; conventional NLE editing only
    };
  }

  addTrack(trackSpec) {
    if (!trackSpec.id) trackSpec.id = `track-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const track = {
      id: trackSpec.id,
      kind: trackSpec.kind || 'video', // 'video' | 'audio' | 'text' | 'caption' | 'camera'
      name: trackSpec.name || `Track ${this.tracks.length + 1}`,
      muted: trackSpec.muted || false,
      solo: trackSpec.solo || false,
      locked: trackSpec.locked || false,
      hidden: trackSpec.hidden || false,
      clips: []
    };
    this.tracks.push(track);
    return track;
  }

  getTrack(trackId) {
    return this.tracks.find(t => t.id === trackId) || null;
  }

  getClip(trackId, clipId) {
    const track = this.getTrack(trackId);
    if (!track) return null;
    return track.clips.find(c => c.clipId === clipId) || null;
  }

  /**
   * Add a clip to a track
   */
  addClip(trackId, clipSpec) {
    const track = this.getTrack(trackId);
    if (!track) throw new Error(`Track not found: ${trackId}`);
    if (track.locked) throw new Error(`Track is locked: ${trackId}`);

    const duration = clipSpec.durationFrames || (clipSpec.sourceOutFrame - clipSpec.sourceInFrame);
    if (duration <= 0) throw new Error('Clip duration must be positive');

    const clip = {
      clipId: clipSpec.clipId || `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      trackId,
      assetId: clipSpec.assetId,
      editingClass: clipSpec.editingClass || TimelineEditor.EDITING_CLASSES.IMPORTED_RASTER,
      sourceInFrame: clipSpec.sourceInFrame !== undefined ? clipSpec.sourceInFrame : 0,
      sourceOutFrame: clipSpec.sourceOutFrame !== undefined ? clipSpec.sourceOutFrame : duration,
      destinationStartFrame: clipSpec.destinationStartFrame !== undefined ? clipSpec.destinationStartFrame : 0,
      durationFrames: duration,
      speed: clipSpec.speed || 1.0,
      volume: clipSpec.volume !== undefined ? clipSpec.volume : 1.0,
      opacity: clipSpec.opacity !== undefined ? clipSpec.opacity : 1.0,
      provenance: clipSpec.provenance || null // For GENERATED_FOOTAGE: { prompt, seed, model, shotId }
    };

    track.clips.push(clip);
    this._sortClipsByDestination(track);
    return clip;
  }

  /**
   * Split a clip at a given project timeline frame
   */
  splitClip(trackId, clipId, splitAtProjectFrame) {
    const track = this.getTrack(trackId);
    if (!track) throw new Error(`Track not found: ${trackId}`);
    if (track.locked) throw new Error(`Track is locked: ${trackId}`);

    const clipIndex = track.clips.findIndex(c => c.clipId === clipId);
    if (clipIndex < 0) throw new Error(`Clip not found: ${clipId}`);

    const targetClip = track.clips[clipIndex];
    const clipStart = targetClip.destinationStartFrame;
    const clipEnd = clipStart + targetClip.durationFrames;

    if (splitAtProjectFrame <= clipStart || splitAtProjectFrame >= clipEnd) {
      throw new Error(`Split frame ${splitAtProjectFrame} is outside clip boundaries [${clipStart}, ${clipEnd}]`);
    }

    const leftDuration = splitAtProjectFrame - clipStart;
    const rightDuration = targetClip.durationFrames - leftDuration;

    // Clone right piece
    const rightClip = {
      ...targetClip,
      clipId: `${clipId}-right-${Date.now()}`,
      destinationStartFrame: splitAtProjectFrame,
      durationFrames: rightDuration,
      sourceInFrame: targetClip.sourceInFrame + Math.round(leftDuration * targetClip.speed),
      sourceOutFrame: targetClip.sourceOutFrame
    };

    // Update left piece
    targetClip.durationFrames = leftDuration;
    targetClip.sourceOutFrame = targetClip.sourceInFrame + Math.round(leftDuration * targetClip.speed);

    track.clips.splice(clipIndex + 1, 0, rightClip);
    return { leftClip: targetClip, rightClip };
  }

  /**
   * Non-destructive ripple trim
   * Trims clip head/tail and shifts all subsequent clips to eliminate gaps
   */
  rippleTrim(trackId, clipId, newDurationFrames) {
    const track = this.getTrack(trackId);
    if (!track) throw new Error(`Track not found: ${trackId}`);
    if (track.locked) throw new Error(`Track is locked: ${trackId}`);

    const clipIndex = track.clips.findIndex(c => c.clipId === clipId);
    if (clipIndex < 0) throw new Error(`Clip not found: ${clipId}`);

    const clip = track.clips[clipIndex];
    const delta = newDurationFrames - clip.durationFrames;
    if (newDurationFrames <= 0) throw new Error('Trimmed duration must be positive');

    clip.durationFrames = newDurationFrames;
    clip.sourceOutFrame = clip.sourceInFrame + newDurationFrames;

    // Shift all subsequent clips on this track by delta
    for (let i = clipIndex + 1; i < track.clips.length; i++) {
      track.clips[i].destinationStartFrame += delta;
    }

    return { clip, delta };
  }

  /**
   * Reorder clips in timeline
   */
  reorderClip(trackId, clipId, newStartFrame) {
    const clip = this.getClip(trackId, clipId);
    if (!clip) throw new Error(`Clip not found: ${clipId}`);
    clip.destinationStartFrame = Math.max(0, newStartFrame);
    const track = this.getTrack(trackId);
    this._sortClipsByDestination(track);
    return clip;
  }

  /**
   * Inspect editability of a clip and explain user choices
   */
  explainEditability(trackId, clipId) {
    const clip = this.getClip(trackId, clipId);
    if (!clip) throw new Error(`Clip not found: ${clipId}`);

    switch (clip.editingClass) {
      case TimelineEditor.EDITING_CLASSES.SOURCE_NATIVE:
        return {
          class: clip.editingClass,
          editableObjects: true,
          actionAvailable: 'FULL_VECTOR_LAYER_EDIT',
          message: 'All vector shapes, texts, and 3D rigs are fully editable.'
        };
      case TimelineEditor.EDITING_CLASSES.GENERATED_FOOTAGE:
        return {
          class: clip.editingClass,
          editableObjects: false,
          actionAvailable: 'SHOT_REGENERATION_OR_OVERLAY',
          message: 'Clip is flattened AI footage. You can add text/image overlays or selectively regenerate this specific shot with user approval.',
          provenance: clip.provenance
        };
      case TimelineEditor.EDITING_CLASSES.IMPORTED_RASTER:
      default:
        return {
          class: clip.editingClass,
          editableObjects: false,
          actionAvailable: 'CONVENTIONAL_NLE_EDIT',
          message: 'Clip is an imported video file. You can trim, split, adjust speed/volume, and add captions or overlays.'
        };
    }
  }

  getTotalDurationFrames() {
    let max = 0;
    for (const track of this.tracks) {
      for (const clip of track.clips) {
        const end = clip.destinationStartFrame + clip.durationFrames;
        if (end > max) max = end;
      }
    }
    return max;
  }

  _sortClipsByDestination(track) {
    track.clips.sort((a, b) => a.destinationStartFrame - b.destinationStartFrame);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TimelineEditor };
}
