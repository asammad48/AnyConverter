/**
 * AnyConverter Creative Studio — 2D Keyframe Animation & Interpolation Engine
 * Deterministic property curves, easing mathematics, and visual motion presets.
 */

class AnimationEngine {
  constructor() {}

  // --- Standard Easing Functions ---
  static get EASING() {
    return {
      linear: (t) => t,
      easeInQuad: (t) => t * t,
      easeOutQuad: (t) => t * (2 - t),
      easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
      step: (t) => (t >= 1 ? 1 : 0)
    };
  }

  /**
   * Interpolate a numeric property across keyframes at an exact frame number
   * @param {Array<[number, number, string?]>} points - Array of [frame, value, easingName?]
   * @param {number} currentFrame - Integer frame to evaluate
   * @returns {number} Interpolated value
   */
  interpolateKeyframes(points, currentFrame) {
    if (!points || points.length === 0) return 0;
    if (points.length === 1) return points[0][1];

    // Sorted by frame
    const sorted = [...points].sort((a, b) => a[0] - b[0]);

    // Before first keyframe
    if (currentFrame <= sorted[0][0]) return sorted[0][1];

    // After last keyframe
    if (currentFrame >= sorted[sorted.length - 1][0]) {
      return sorted[sorted.length - 1][1];
    }

    // Find bounding keyframe interval
    for (let i = 0; i < sorted.length - 1; i++) {
      const start = sorted[i];
      const end = sorted[i + 1];

      if (currentFrame >= start[0] && currentFrame <= end[0]) {
        const frameSpan = end[0] - start[0];
        if (frameSpan === 0) return start[1];

        const progress = (currentFrame - start[0]) / frameSpan;
        const easingFn = AnimationEngine.EASING[start[2] || 'linear'] || AnimationEngine.EASING.linear;
        const easedT = easingFn(progress);

        return start[1] + (end[1] - start[1]) * easedT;
      }
    }

    return sorted[sorted.length - 1][1];
  }

  // --- Visual Animation Presets ---

  /**
   * Typewriter text reveal preset
   * Returns substring of visible characters at current frame
   */
  evaluateTypewriter(fullText, startFrame, durationFrames, currentFrame) {
    if (!fullText) return '';
    if (currentFrame < startFrame) return '';
    if (currentFrame >= startFrame + durationFrames) return fullText;

    const progress = (currentFrame - startFrame) / durationFrames;
    const charCount = Math.floor(progress * fullText.length);
    return fullText.slice(0, charCount);
  }

  /**
   * Ken Burns smooth photo zoom/pan motion preset
   */
  evaluateKenBurns(startScale, endScale, startX, endX, startY, endY, startFrame, durationFrames, currentFrame) {
    const pointsScale = [[startFrame, startScale, 'easeInOutQuad'], [startFrame + durationFrames, endScale, 'linear']];
    const pointsX = [[startFrame, startX, 'easeInOutQuad'], [startFrame + durationFrames, endX, 'linear']];
    const pointsY = [[startFrame, startY, 'easeInOutQuad'], [startFrame + durationFrames, endY, 'linear']];

    return {
      scale: this.interpolateKeyframes(pointsScale, currentFrame),
      x: this.interpolateKeyframes(pointsX, currentFrame),
      y: this.interpolateKeyframes(pointsY, currentFrame)
    };
  }

  /**
   * Standard Fade In / Fade Out preset
   */
  evaluateFade(startFrame, durationFrames, fadeInFrames, fadeOutFrames, currentFrame) {
    const endFrame = startFrame + durationFrames;
    if (currentFrame < startFrame || currentFrame > endFrame) return 0;

    // Fade in segment
    if (currentFrame < startFrame + fadeInFrames) {
      return (currentFrame - startFrame) / fadeInFrames;
    }

    // Fade out segment
    if (currentFrame > endFrame - fadeOutFrames) {
      return (endFrame - currentFrame) / fadeOutFrames;
    }

    // Fully opaque middle
    return 1.0;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationEngine };
}
if (typeof window !== 'undefined') {
  window.AnimationEngine = AnimationEngine;
}
