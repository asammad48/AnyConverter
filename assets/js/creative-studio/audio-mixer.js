/**
 * AnyConverter Creative Studio — Multitrack Audio Mixer & Ducking Engine
 * Audio gain automation, waveform visualization, deterministic ducking, and local mic capture guards.
 */

class AudioMixer {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 48000;
    this.fps = options.fps || 30;
    this.tracks = new Map();
  }

  registerAudioTrack(trackId, options = {}) {
    this.tracks.set(trackId, {
      id: trackId,
      type: options.type || 'music', // 'music' | 'voice' | 'sfx'
      baseGain: options.baseGain !== undefined ? options.baseGain : 1.0,
      muted: options.muted || false,
      clips: []
    });
  }

  addAudioClip(trackId, clipSpec) {
    const track = this.tracks.get(trackId);
    if (!track) throw new Error(`Audio track not found: ${trackId}`);
    const clip = {
      clipId: clipSpec.clipId,
      startFrame: clipSpec.startFrame || 0,
      durationFrames: clipSpec.durationFrames,
      volume: clipSpec.volume !== undefined ? clipSpec.volume : 1.0,
      fadeInFrames: clipSpec.fadeInFrames || 0,
      fadeOutFrames: clipSpec.fadeOutFrames || 0
    };
    track.clips.push(clip);
    return clip;
  }

  /**
   * Calculate effective volume gain at a given frame, applying ducking if voice is active
   * @param {string} trackId - Target track (e.g. background music)
   * @param {number} frame - Current timeline frame
   * @param {number} duckRatio - Attenuation ratio when ducking (e.g. 0.25 = -12dB)
   * @returns {number} Effective linear volume (0.0 to 1.0)
   */
  evaluateGain(trackId, frame, duckRatio = 0.25) {
    const track = this.tracks.get(trackId);
    if (!track || track.muted) return 0.0;

    // Find active clip on this track
    const activeClip = track.clips.find(c => frame >= c.startFrame && frame < c.startFrame + c.durationFrames);
    if (!activeClip) return 0.0;

    let gain = track.baseGain * activeClip.volume;

    // Apply fade in / fade out
    const clipLocalFrame = frame - activeClip.startFrame;
    if (activeClip.fadeInFrames > 0 && clipLocalFrame < activeClip.fadeInFrames) {
      gain *= (clipLocalFrame / activeClip.fadeInFrames);
    } else if (activeClip.fadeOutFrames > 0 && clipLocalFrame > (activeClip.durationFrames - activeClip.fadeOutFrames)) {
      const remaining = activeClip.durationFrames - clipLocalFrame;
      gain *= (remaining / activeClip.fadeOutFrames);
    }

    // Apply deterministic ducking if this is music and any voice track is active
    if (track.type === 'music') {
      const voiceActive = this._isVoiceActiveAtFrame(frame);
      if (voiceActive) {
        gain *= duckRatio;
      }
    }

    return Math.max(0.0, Math.min(gain, 2.0));
  }

  _isVoiceActiveAtFrame(frame) {
    for (const track of this.tracks.values()) {
      if (track.type === 'voice' && !track.muted) {
        const hasActiveVoice = track.clips.some(c => frame >= c.startFrame && frame < c.startFrame + c.durationFrames);
        if (hasActiveVoice) return true;
      }
    }
    return false;
  }

  /**
   * Generate lightweight waveform peaks from PCM audio buffer for UI timeline visualization
   * @param {Float32Array|Array<number>} pcmData - Raw audio samples
   * @param {number} totalPeaks - Desired number of peaks (e.g. 100 for timeline track)
   * @returns {Array<number>} Array of normalized peak heights (0.0 to 1.0)
   */
  generateWaveformPeaks(pcmData, totalPeaks = 100) {
    if (!pcmData || pcmData.length === 0) return Array(totalPeaks).fill(0);

    const step = Math.floor(pcmData.length / totalPeaks);
    const peaks = [];

    for (let i = 0; i < totalPeaks; i++) {
      let max = 0;
      const start = i * step;
      const end = Math.min(start + step, pcmData.length);
      for (let j = start; j < end; j++) {
        const abs = Math.abs(pcmData[j]);
        if (abs > max) max = abs;
      }
      peaks.push(Math.min(1.0, max));
    }

    return peaks;
  }

  /**
   * Local microphone capture guard check
   */
  checkMicrophonePermission() {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return { supported: true, message: 'Local microphone capture available' };
    }
    return { supported: false, message: 'Microphone API unavailable in current environment' };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioMixer };
}
