(function (root) {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const handles = [[.22, .75], [.32, 1]];
  const cubic = (t, a, b) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t ** 3;
  };

  function tangent(value, fallback) {
    return Array.isArray(value) && Number.isFinite(value[0]) && Number.isFinite(value[1])
      ? [clamp(value[0], 0, 1), clamp(value[1], -.2, 1.2)] : fallback;
  }

  function evaluate(ease, progress, outgoing, incoming) {
    const t = clamp(progress, 0, 1);
    if (t === 0 || t === 1) return t;
    switch (ease) {
      case 'hold': return 0;
      case 'easeOutExpo': return (1 - 2 ** (-10 * t)) / (1 - 2 ** -10);
      case 'spring': {
        // Underdamped spring response, normalized at the right endpoint.
        const response = x => 1 - Math.exp(-7 * x) * (Math.cos(11 * x) + 7 / 11 * Math.sin(11 * x));
        return clamp(response(t) / response(1), 0, 1.14);
      }
      case 'bezier': {
        const [x1, y1] = tangent(outgoing, handles[0]);
        const [x2, y2] = tangent(incoming, handles[1]);
        let lo = 0;
        let hi = 1;
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          if (cubic(mid, x1, x2) < t) lo = mid;
          else hi = mid;
        }
        return cubic((lo + hi) / 2, y1, y2);
      }
      default: return t;
    }
  }

  const api = { clamp, handles, cubic, evaluate, names: ['linear', 'hold', 'bezier', 'easeOutExpo', 'spring'] };
  root.StudioEasings = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
