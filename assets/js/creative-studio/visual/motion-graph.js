(function (root) {
  'use strict';

  const easing = root.StudioEasings || require('./easings');
  const { clamp } = easing;
  const limits = Object.assign(Object.create(null), {
    x: [-.5, .5, 0], y: [-.5, .5, 0], rotation: [-360, 360, 0],
    scaleX: [.05, 2, 1], scaleY: [.05, 2, 1], opacity: [0, 1, 1],
    clip: [0, 1, 1], maskOffset: [-1, 1, 0], underline: [0, 1, 0],
    number: [-1000000, 1000000, 0], squash: [-.4, .4, 0], headTilt: [-30, 30, 0],
    eyeDirection: [-1, 1, 0], shake: [0, .025, 0], orbit: [-1, 1, 0], path: [0, 1, 1]
  });
  const held = ['poseId', 'armPose'];
  const properties = [...Object.keys(limits), 'color', ...held];
  const defaults = Object.fromEntries(Object.entries(limits).map(([key, range]) => [key, range[2]]));
  const colors = /^#[\da-f]{6}$/i;
  const token = /^[\w-]{1,64}$/;
  const presets = {
    'fade-rise': { opacity: [0, 1], y: [.07, 0] },
    reveal: { clip: [0, 1], maskOffset: [.12, 0] },
    slide: { x: [-.16, 0], opacity: [0, 1] },
    'scale-pop': { scaleX: [.73, 1], scaleY: [.73, 1] },
    rotation: { rotation: [-16, 0], opacity: [0, 1] },
    orbit: { orbit: [-1, 0] },
    'focus-zoom': { scaleX: [1.16, 1], scaleY: [1.16, 1] },
    'underline-draw': { underline: [0, 1] },
    'staggered-cards': { opacity: [0, 1], y: [.1, 0] },
    'path-follow': { path: [0, 1] }
  };
  const patterns = ['enter', 'settle', 'hold', 'emphasize', 'exit'];
  const defaultPath = [[-.14, .08], [-.16, -.16], [.13, -.10], [0, 0]];

  function value(property, input) {
    if (held.includes(property)) return typeof input === 'string' && token.test(input) ? input : undefined;
    if (property === 'color') return typeof input === 'string' && colors.test(input) ? input : undefined;
    return limits[property] && Number.isFinite(input) ? clamp(input, ...limits[property].slice(0, 2)) : undefined;
  }

  function ordered(keys, property) {
    const unique = new Map();
    for (const key of Array.isArray(keys) ? keys.slice(0, 256) : []) {
      if (Number.isInteger(key?.frame) && key.frame >= 0 && value(property, key.value) !== undefined) unique.set(key.frame, key);
    }
    return [...unique.values()].sort((a, b) => a.frame - b.frame);
  }

  function mixColor(from, to, t) {
    let result = '#';
    for (let i = 1; i < 6; i += 2) {
      const a = parseInt(from.slice(i, i + 2), 16);
      const b = parseInt(to.slice(i, i + 2), 16);
      result += clamp(Math.round(a + (b - a) * t), 0, 255).toString(16).padStart(2, '0');
    }
    return result;
  }

  function sample(keys, property, frame) {
    return sampleOrdered(ordered(keys, property), property, frame);
  }

  function sampleOrdered(points, property, frame) {
    if (!points.length) return undefined;
    const index = points.findIndex(key => key.frame > frame);
    if (index === 0) return value(property, points[0].value);
    if (index === -1) return value(property, points.at(-1).value);
    const left = points[index - 1];
    const right = points[index];
    const from = value(property, left.value);
    if (held.includes(property)) return from;
    const to = value(property, right.value);
    const t = easing.evaluate(left.ease, (frame - left.frame) / (right.frame - left.frame), left.outTangent, right.inTangent);
    return property === 'color' ? mixColor(from, to, t) : value(property, from + (to - from) * t);
  }

  function presetTracks(name, start, duration, pattern = 'enter') {
    if (!Object.hasOwn(presets, name)) return [];
    const begin = Math.max(0, Math.round(start) || 0);
    const length = clamp(Math.round(duration) || 1, 1, 3600);
    return Object.entries(presets[name]).map(([property, [from, to]]) => {
      const ease = name === 'scale-pop' ? 'spring' : 'bezier';
      const end = begin + length;
      const pivot = begin + Math.max(1, Math.floor(length * .4));
      const pairs = {
        enter: [[begin, from, ease], [end, to]],
        settle: [[begin, from, 'spring'], [end, to]],
        hold: [[begin, to, 'hold'], [end, to]],
        emphasize: [[begin, to, ease], [pivot, from, 'spring'], [end, to]],
        exit: [[begin, to, 'hold'], [pivot, to, 'bezier'], [end, from]]
      };
      return { property, keys: (pairs[pattern] || pairs.enter).map(([frame, v, curve]) => ({ frame, value: v, ease: curve || 'linear' })) };
    });
  }

  function noise(seed, frame, axis) {
    let bits = (seed | 0) ^ Math.imul(frame + 1, 0x9e3779b1) ^ Math.imul(axis + 1, 0x85ebca6b);
    bits = Math.imul(bits ^ (bits >>> 16), 0x7feb352d);
    bits = Math.imul(bits ^ (bits >>> 15), 0x846ca68b);
    return ((bits ^ (bits >>> 16)) >>> 0) / 0xffffffff * 2 - 1;
  }

  function offset(data, max) {
    return Number.isFinite(data) ? clamp(Math.trunc(data), 0, max) : 0;
  }

  function evaluate(graph, shotFrame, duration, { reduced = false, absoluteFrame = shotFrame } = {}) {
    const states = new Map();
    if (graph?.version !== 1 || !Array.isArray(graph.layers)) return states;
    const last = Number.isFinite(duration) ? Math.max(0, Math.floor(duration) - 1) : 0;
    for (const layer of graph.layers.slice(0, 64)) {
      if (typeof layer?.id !== 'string' || !token.test(layer.id) || states.has(layer.id)) continue;
      const delay = offset(layer.offset, last) + offset(layer.staggerIndex, 63) * offset(layer.stagger, 120);
      const localFrame = clamp(Math.trunc(shotFrame) - delay, 0, last);
      const state = { ...defaults, id: layer.id, parentId: layer.parentId, localFrame };
      const animated = new Set();
      for (const track of Array.isArray(layer.tracks) ? layer.tracks.slice(0, 128) : []) {
        if (!properties.includes(track?.property)) continue;
        const points = ordered(track.keys, track.property);
        if (!points.length || (animated.has(track.property) && localFrame < points[0].frame)) continue;
        state[track.property] = sampleOrdered(points, track.property, localFrame);
        animated.add(track.property);
      }
      state.animated = animated;
      if (layer.path || state.path !== 1) {
        const points = Array.isArray(layer.path) && layer.path.length === 4 &&
          layer.path.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite))
          ? layer.path.map(p => p.map(n => clamp(n, -.35, .35))) : defaultPath;
        const t = state.path;
        const u = 1 - t;
        for (const [axis, prop] of ['x', 'y'].entries()) {
          state[prop] += u ** 3 * points[0][axis] + 3 * u * u * t * points[1][axis] +
            3 * u * t * t * points[2][axis] + t ** 3 * points[3][axis];
        }
      }
      const angle = Math.PI * state.orbit * 2 / 3;
      state.x = clamp(state.x + .08 * Math.sin(angle) + state.shake * noise(graph.seed, absoluteFrame, 0), -.5, .5);
      state.y = clamp(state.y + .06 * (1 - Math.cos(angle)) + state.shake * noise(graph.seed, absoluteFrame, 1), -.5, .5);
      if (reduced) Object.assign(state, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, squash: 0,
        headTilt: 0, eyeDirection: 0, maskOffset: 0, clip: 1, underline: state.underline > 0 ? 1 : 0 });
      states.set(layer.id, state);
    }
    return states;
  }

  function chain(states, id) {
    const result = [];
    const visited = new Set();
    for (let state = states.get(id); state && !visited.has(state.id); state = states.get(state.parentId)) {
      visited.add(state.id);
      result.unshift(state);
    }
    return result;
  }

  const api = { limits, properties, held, value, ordered, sample, presets, patterns, presetTracks, defaultPath, evaluate, chain };
  root.StudioMotionGraph = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
