(function (root) {
  'use strict';

  const roles = {
    hero: [112, 700, 'serif'], hook: [80, 700, 'sans'], kicker: [28, 700, 'sans'],
    body: [42, 400, 'sans'], caption: [51, 700, 'sans'], quote: [62, 400, 'serif'],
    number: [100, 700, 'sans'], statistic: [78, 700, 'sans'], cta: [32, 700, 'sans'],
    punchline: [90, 700, 'sans'], whisper: [48, 400, 'serif'], note: [58, 400, 'serif'],
    subtitle: [49, 700, 'sans']
  };
  const effects = ['none', 'line', 'word', 'character', 'rise', 'type', 'tracking', 'underline',
    'highlight', 'echo', 'suspense', 'counter', 'emphasis'];
  const clamp = (value, min, max, fallback) => typeof value === 'number' && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value)) : fallback;

  function cue(input, track, duration) {
    input = input && typeof input === 'object' ? input : {};
    const fallback = { title: 'hook', caption: 'caption', cta: 'cta' }[track];
    const role = Object.hasOwn(roles, input.role) ? input.role : fallback;
    const [size, weight, family] = roles[role];
    const start = Math.round(clamp(input.startFrame, 0, duration - 1, 0));
    const end = Math.round(clamp(input.endFrame, start + 1, duration, duration));
    return {
      role, family: ['sans', 'serif', 'display'].includes(input.family) ? input.family : family,
      size: clamp(input.size, 20, 150, size), weight: input.weight === 400 || input.weight === 700 ? input.weight : weight,
      lineHeight: clamp(input.lineHeight, 1, 1.8, 1.18), tracking: clamp(input.tracking, -1, 6, 0),
      maxLines: Math.round(clamp(input.maxLines, 1, 12, track === 'cta' ? 2 : 6)),
      baseline: ['top', 'middle', 'bottom'].includes(input.baseline) ? input.baseline : 'middle',
      overflow: input.overflow === 'ellipsis' ? 'ellipsis' : 'shrink',
      backdrop: input.backdrop === 'pattern' ? 'pattern' : 'plain',
      contrast: ['outline', 'shadow', 'panel'].includes(input.contrast) ? input.contrast : 'panel',
      phrase: typeof input.phrase === 'string' ? input.phrase.slice(0, 160) : '',
      spanStyle: ['bold', 'underline', 'highlight'].includes(input.spanStyle) ? input.spanStyle : 'bold',
      effect: effects.includes(input.effect) ? input.effect : 'none',
      startFrame: start, endFrame: end,
      length: Math.round(clamp(input.length, 1, 3600, 30)),
      stagger: Math.round(clamp(input.stagger, 0, 120, 3))
    };
  }

  function progress(frame, cue, index = 0, count = 1) {
    if (cue.endFrame === cue.startFrame + 1) return Number(frame >= cue.startFrame);
    const length = Math.min(cue.length, Math.max(1, cue.endFrame - cue.startFrame - 1));
    const stagger = count > 1 ? Math.min(cue.stagger, length / (2 * (count - 1))) : 0;
    const elapsed = frame - cue.startFrame - stagger * index;
    return clamp(elapsed / Math.max(1, length - stagger * (count - 1)), 0, 1, 0);
  }

  root.StudioKineticType = { roles, effects, cue, progress };
})(typeof window === 'undefined' ? globalThis : window);
