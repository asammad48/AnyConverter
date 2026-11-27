(function (root) {
  'use strict';

  const tokens = Object.freeze({
    space: Object.freeze({ unit: 8, inset: 48, gap: 24, padding: 32 }),
    type: Object.freeze({ title: 76, body: 30, label: 20, minimum: 18, lineHeight: 1.12, family: 'system-ui, sans-serif' }),
    color: Object.freeze({
      dark: Object.freeze({ background: '#111522', surface: '#20283b', foreground: '#fff8ee', muted: '#b8c4d9', accent: '#a7f0d4', success: '#9ee5b0', warning: '#ffd18a', overlay: '#0c101b' }),
      light: Object.freeze({ background: '#f4ebdd', surface: '#fff9ef', foreground: '#20232f', muted: '#4e5261', accent: '#28594d', success: '#236345', warning: '#794712', overlay: '#ded5c7' })
    }),
    radius: 24,
    shadow: Object.freeze({ blur: 28, offset: 12, color: '#00000050' }),
    z: Object.freeze({ background: 0, midground: 1, foreground: 2 }),
    safeInsets: Object.freeze({
      wide: Object.freeze({ top: .07, right: .06, bottom: .08, left: .06 }),
      portrait: Object.freeze({ top: .12, right: .15, bottom: .19, left: .08 }),
      square: Object.freeze({ top: .08, right: .08, bottom: .09, left: .08 })
    }),
    characterScale: Object.freeze({ standard: .72, large: .9 }),
    propElevation: 12,
    outline: 3,
    captionArea: .24,
    letterbox: .045
  });

  function contrast(a, b) {
    function luminance(color) {
      const channels = color.slice(1).match(/../g).map(value => {
        const channel = parseInt(value, 16) / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
      });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    }
    const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b);
    return (high + .05) / (low + .05);
  }

  root.StudioDesignTokens = { tokens, contrast };
  if (typeof module !== 'undefined') module.exports = root.StudioDesignTokens;
})(typeof window === 'undefined' ? globalThis : window);
