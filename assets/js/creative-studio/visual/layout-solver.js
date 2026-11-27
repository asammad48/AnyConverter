(function (root) {
  'use strict';

  const { tokens } = root.StudioDesignTokens || require('./design-tokens');
  const roles = ['title', 'subject', 'caption'];
  const presets = {
    hero: [[0, .12, .50, .60], [.55, 0, .45, .79], [0, .83, .75, .17]],
    comparison: [[0, 0, 1, .24], [0, .28, 1, .49], [0, .82, 1, .18]],
    statistic: [[.55, .19, .45, .60], [0, .10, .50, .69], [0, .84, 1, .16]],
    dialogue: [[.52, .10, .48, .60], [0, 0, .48, .75], [0, .78, 1, .22]],
    'character-right': [[0, .10, .48, .60], [.52, 0, .48, .75], [0, .78, 1, .22]],
    'character-center': [[0, 0, 1, .22], [.18, .25, .64, .50], [0, .78, 1, .22]],
    reaction: [[0, 0, 1, .22], [0, .25, 1, .50], [0, .78, 1, .22]],
    reveal: [[0, .12, .41, .58], [.46, 0, .54, .75], [0, .79, 1, .21]],
    product: [[0, .16, .42, .53], [.46, 0, .54, .77], [0, .82, 1, .18]],
    silhouette: [[0, .13, .44, .55], [.53, 0, .47, .75], [0, .81, 1, .19]],
    punchline: [[.10, .22, .80, .48], [.37, 0, .26, .19], [.10, .76, .80, .24]]
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
  const finite = (v, fallback) => Number.isFinite(v) ? v : fallback;

  function geometry(width, height) {
    const format = width / height > 1.2 ? 'wide' : height / width > 1.2 ? 'portrait' : 'square';
    const inset = tokens.safeInsets[format];
    const x = Math.round(inset.left * width);
    const y = Math.round(inset.top * height);
    return {
      format, scale: Math.min(width, height) / 720,
      columns: format === 'wide' ? 12 : format === 'square' ? 8 : 6,
      safe: { x, y, width: Math.round((1 - inset.left - inset.right) * width), height: Math.round((1 - inset.top - inset.bottom) * height) }
    };
  }

  function resolve(layout, width, height, intrinsic = {}) {
    const grid = geometry(width, height);
    const { safe, scale, format } = grid;
    const blocks = {};
    const pending = new Set();
    const warnings = [];
    const preset = Object.hasOwn(presets, layout.preset) ? layout.preset : 'hero';
    const slots = format === 'wide' ? presets[preset] : preset === 'punchline' ? [
      [.02, .26, .96, .45], [.30, 0, .40, .23], [.02, .76, .96, tokens.captionArea]
    ] : [
      [.02, 0, .96, format === 'portrait' ? .25 : .27],
      [.02, .30, .96, .43],
      [.02, .76, .96, tokens.captionArea]
    ];
    const constraints = layout.blocks || {};
    const intersects = (a, b) => a.x + a.width > b.x && b.x + b.width > a.x &&
      a.y + a.height > b.y && b.y + b.height > a.y;
    function evaluate(role) {
      if (blocks[role]) return blocks[role];
      if (pending.has(role)) {
        warnings.push({ type: 'cycle', roles: [role] });
        return null;
      }
      pending.add(role);
      const [sx, sy, sw, sh] = slots[roles.indexOf(role)];
      const c = constraints[role] || {};
      const target = roles.includes(c.relativeTo) ? evaluate(c.relativeTo) : null;
      const size = intrinsic[role] || {};
      const maxWidth = clamp(finite(c.maxWidth, 1), .05, 1) * safe.width;
      const w = clamp(c.intrinsic ? finite(size.width, sw * safe.width) : finite(c.width, sw) * safe.width,
        Math.min(maxWidth, Math.max(1, finite(c.minSize, 0) * scale)), maxWidth);
      const maxHeight = clamp(finite(c.maxHeight, 1), .05, 1) * safe.height;
      const h = clamp(c.intrinsic ? finite(size.height, sh * safe.height) : finite(c.height, sh) * safe.height,
        Math.min(maxHeight, Math.max(1, finite(c.minSize, 0) * scale)), maxHeight);
      let x = safe.x + finite(c.x, Number.isFinite(c.pixelX) ? c.pixelX / safe.width : sx) * safe.width;
      let y = safe.y + finite(c.y, Number.isFinite(c.pixelY) ? c.pixelY / safe.height : sy) * safe.height;
      if (c.anchor === 'left') x = safe.x;
      if (c.anchor === 'center') x = safe.x + (safe.width - w) / 2;
      if (c.anchor === 'right') x = safe.x + safe.width - w;
      if (c.anchor === 'top') y = safe.y;
      if (c.anchor === 'bottom') y = safe.y + safe.height - h;
      if (target) y = target.y + target.height + Math.max(0, finite(c.gap, tokens.space.gap)) * scale;
      if (c.baseline) y = safe.y + Math.round((y - safe.y) / (tokens.space.unit * scale)) * tokens.space.unit * scale;
      if (x < safe.x - 1 || y < safe.y - 1 || x + w > safe.x + safe.width + 1 || y + h > safe.y + safe.height + 1) {
        warnings.push({ type: 'outside', roles: [role] });
      }
      blocks[role] = {
        x: Math.round(clamp(x, safe.x, safe.x + safe.width - w)),
        y: Math.round(clamp(y, safe.y, safe.y + safe.height - h)),
        width: Math.round(w), height: Math.round(h),
        align: ['left', 'center', 'right'].includes(c.align) ? c.align : 'left',
        depth: Object.hasOwn(tokens.z, c.depth) ? tokens.z[c.depth] : role === 'subject' ? 1 : 2
      };
      pending.delete(role);
      return blocks[role];
    }
    roles.forEach(evaluate);
    for (const [index, role] of roles.entries()) {
      for (const other of roles.slice(index + 1)) {
        const a = blocks[role], b = blocks[other];
        if (intersects(a, b)) {
          warnings.push({ type: 'overlap', roles: [role, other], intentional: role !== 'caption' && other !== 'caption' && layout.allowOverlap === true });
        }
      }
    }
    // The caption occupies a separate band even when a drag crosses a subject.
    if (['title', 'subject'].some(role => intersects(blocks[role], blocks.caption))) {
      const caption = blocks.caption;
      caption.y = safe.y + safe.height - caption.height;
      for (const role of ['title', 'subject']) {
        const box = blocks[role];
        if (!intersects(box, caption)) continue;
        const limit = Math.max(safe.y + 1, caption.y - Math.round(tokens.space.unit * scale));
        box.height = Math.min(box.height, limit - safe.y);
        box.y = Math.min(box.y, limit - box.height);
      }
    }
    return { ...grid, blocks, warnings };
  }

  function snap(box, resolved, role, x, y) {
    const { safe, columns, scale, blocks } = resolved;
    const step = safe.width / columns;
    const columnLines = Array.from({ length: columns + 1 }, (_, i) => safe.x + i * step);
    const xEdges = [...columnLines, ...columnLines.map(line => line - box.width), safe.x + (safe.width - box.width) / 2];
    const yEdges = [safe.y, safe.y + (safe.height - box.height) / 2, safe.y + safe.height - box.height];
    for (const key of roles) {
      if (key === role) continue;
      const b = blocks[key];
      xEdges.push(b.x, b.x + b.width, b.x - box.width, b.x + b.width - box.width, b.x + (b.width - box.width) / 2);
      yEdges.push(b.y, b.y + b.height, b.y - box.height, b.y + b.height - box.height, b.y + (b.height - box.height) / 2);
    }
    function nearest(edges, value) {
      return edges.reduce((best, point) => Math.abs(point - value) < Math.abs(best - value) ? point : best);
    }
    const nearX = nearest(xEdges, x);
    const nearY = nearest(yEdges, y);
    const unit = tokens.space.unit * scale;
    return {
      x: (clamp(Math.abs(nearX - x) <= unit * 2 ? nearX : x, safe.x, safe.x + safe.width - box.width) - safe.x) / safe.width,
      y: (clamp(Math.abs(nearY - y) <= unit ? nearY : safe.y + Math.round((y - safe.y) / unit) * unit, safe.y, safe.y + safe.height - box.height) - safe.y) / safe.height
    };
  }

  root.StudioLayoutSolver = { geometry, resolve, snap, roles, presets };
  if (typeof module !== 'undefined') module.exports = root.StudioLayoutSolver;
})(typeof window === 'undefined' ? globalThis : window);
