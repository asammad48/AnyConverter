(function (root) {
  'use strict';

  const cache = new Map();
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const glyphs = text => segmenter ? Array.from(segmenter.segment(text), part => part.segment) : Array.from(text);
  const latin = /^[\p{Script=Latin}\p{Mark}\p{Number}\p{Punctuation}\p{Separator}\p{Emoji}\u200d]*$/u;

  function font(ctx, node, size, bold = false) {
    ctx.font = (bold ? 700 : node.weight) + ' ' + size + 'px ' + root.StudioFonts.family(node.family, node.size);
    if ('letterSpacing' in ctx) ctx.letterSpacing = (node.tracking * size / node.size) + 'px';
  }

  function runs(text, node) {
    const split = node.phrase && latin.test(text) ? text.split(node.phrase) : [text];
    return split.flatMap((part, index) => index ? [{ text: node.phrase, styled: true }, { text: part }] : [{ text: part }])
      .filter(part => part.text);
  }

  function measure(ctx, node, size, text) {
    let width = 0;
    let left = 0;
    let right = 0;
    let ascent = 0;
    let descent = 0;
    const parts = runs(text, node).map(part => {
      font(ctx, node, size, part.styled && node.spanStyle === 'bold');
      const metrics = ctx.measureText(part.text);
      left = Math.min(left, width - (metrics.actualBoundingBoxLeft || 0));
      right = Math.max(right, width + (metrics.actualBoundingBoxRight || 0));
      ascent = Math.max(ascent, metrics.actualBoundingBoxAscent || 0);
      descent = Math.max(descent, metrics.actualBoundingBoxDescent || 0);
      const result = { ...part, x: width, width: metrics.width };
      width += metrics.width;
      return result;
    });
    return { text, parts, left, width: Math.max(width, right) - left, ascent, descent };
  }

  function wrap(ctx, node, size, width) {
    const lines = [];
    const fits = text => measure(ctx, node, size, text).width <= width;
    for (const paragraph of node.content.replace(/\r\n?/g, '\n').split('\n')) {
      const words = paragraph.trim().split(/\s+/u);
      let line = '';
      for (const word of words) {
        const next = line ? line + ' ' + word : word;
        if (fits(next)) {
          line = next;
          continue;
        }
        if (line) lines.push(line);
        line = '';
        const characters = glyphs(word);
        for (let index = 0; index < characters.length; index++) {
          const character = characters[index];
          // Keep closing punctuation with its preceding grapheme and opening
          // punctuation with the following one when splitting an oversized word.
          const attached = /^[\p{Pe}\p{Pf},.!?;:%…]$/u.test(character) || /[\p{Ps}\p{Pi}]$/u.test(line);
          if (line && !attached && !fits(line + character)) {
            lines.push(line);
            line = '';
          }
          line += character;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  function layout(ctx, node, box, scale, align) {
    const key = JSON.stringify([node, box, scale, align, root.StudioFonts.family(node.family, node.size), 'letterSpacing' in ctx]);
    if (cache.has(key)) return cache.get(key);
    ctx.save();
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    const floor = Math.min(node.size, 24) * scale;
    let size = node.size * scale;
    let lines;
    let count;
    let step;
    let truncated;
    do {
      step = size * node.lineHeight;
      count = Math.min(node.maxLines, Math.floor(box.height / step));
      lines = wrap(ctx, node, size, box.width);
      truncated = lines.length > count || lines.some(line => measure(ctx, node, size, line).width > box.width);
      if (!truncated || size <= floor || node.overflow === 'ellipsis') break;
      size = Math.max(floor, size * .92);
    } while (true);
    lines = lines.slice(0, count);
    const oversize = lines.findIndex(line => measure(ctx, node, size, line).width > box.width);
    if (oversize >= 0) lines.length = oversize + 1;
    if (truncated && lines.length) {
      const last = glyphs(lines.pop());
      while (last.length && measure(ctx, node, size, last.join('').trimEnd() + '…').width > box.width) last.pop();
      if (measure(ctx, node, size, '…').width <= box.width) lines.push(last.join('').trimEnd() + '…');
    }
    const spare = box.height - step * lines.length;
    const top = box.y + (node.baseline === 'top' ? 0 : node.baseline === 'bottom' ? spare : spare / 2);
    font(ctx, node, size);
    const reference = ctx.measureText('Åg');
    const measured = lines.map(line => measure(ctx, node, size, line));
    const ascent = Math.max(reference.actualBoundingBoxAscent || size * .75, ...measured.map(row => row.ascent));
    const descent = Math.max(reference.actualBoundingBoxDescent || size * .2, ...measured.map(row => row.descent));
    const rows = measured.map((row, index) => {
      const gap = box.width - row.width;
      const baseline = top + index * step + (step + ascent - descent) / 2;
      const x = box.x - row.left + (align === 'right' ? gap : align === 'center' ? gap / 2 : 0);
      const units = [];
      if (['word', 'character', 'type'].includes(node.effect) && latin.test(row.text)) {
        for (const part of row.parts) {
          font(ctx, node, size, part.styled && node.spanStyle === 'bold');
          const chunks = node.effect === 'word' ? part.text.match(/\S+\s*|\s+/gu) || [] : glyphs(part.text);
          let prefix = '';
          let position = 0;
          for (const text of chunks) {
            prefix += text;
            const right = ctx.measureText(prefix).width;
            units.push({ text, styled: part.styled, x: x + part.x + position, width: right - position });
            position = right;
          }
        }
      }
      return { ...row, x, baseline, units };
    });
    const result = { rows, size, step, truncated };
    ctx.restore();
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  }

  function draw(ctx, node, box, scale, align, frame, palette, locale) {
    const geometry = layout(ctx, node, box, scale, align);
    if (frame < node.startFrame || frame >= node.endFrame) return geometry.truncated;
    const { size, step, rows } = geometry;
    const { progress } = root.StudioKineticType;
    const p = progress(frame, node);
    const ease = value => 1 - (1 - value) ** 3;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.direction = 'ltr';
    for (const [index, row] of rows.entries()) {
      ctx.save();
      const lineP = progress(frame, node, index, rows.length);
      const effect = node.effect;
      let baseline = row.baseline;
      if (effect === 'rise' || effect === 'line') baseline += (1 - ease(lineP)) * step * .55;
      if (effect === 'rise') {
        ctx.beginPath();
        ctx.rect(box.x, row.baseline - row.ascent - 1, box.width, row.ascent + row.descent + 3);
        ctx.clip();
      }
      if (['rise', 'line', 'echo'].includes(effect)) ctx.globalAlpha = ease(lineP);
      if (effect === 'suspense') ctx.globalAlpha = lineP ** 2;
      const paint = (text, x, styled, width) => {
        font(ctx, node, size, styled && node.spanStyle === 'bold');
        if (effect === 'tracking' && 'letterSpacing' in ctx) {
          const extra = Math.min(size * .14, Math.max(0, box.width - row.width) / Math.max(1, glyphs(text).length));
          ctx.letterSpacing = ((node.tracking * size / node.size) + extra * (1 - ease(p))) + 'px';
        }
        const highlighted = styled && node.spanStyle === 'highlight';
        if (highlighted || effect === 'highlight' && (!node.phrase || styled)) {
          ctx.save();
          ctx.globalAlpha *= .28;
          ctx.fillStyle = palette.accent;
          ctx.fillRect(x, baseline - size * .77, width * (effect === 'highlight' ? ease(p) : 1), size * .95);
          ctx.restore();
        }
        if (node.contrast === 'outline') {
          ctx.strokeStyle = palette.background;
          ctx.lineJoin = 'round';
          ctx.lineWidth = Math.max(2, size * .11);
          ctx.strokeText(text, x, baseline);
        }
        if (node.contrast === 'shadow' || effect === 'echo') {
          ctx.shadowColor = effect === 'echo' ? palette.accent : palette.background;
          ctx.shadowBlur = size * .12;
          ctx.shadowOffsetY = size * (effect === 'echo' ? (1 - p) * .34 : .09);
        }
        ctx.fillStyle = palette.ink;
        ctx.fillText(text, x, baseline);
        if (effect === 'emphasis' && styled && p > 0) {
          ctx.save();
          ctx.globalAlpha *= ease(p);
          ctx.fillStyle = palette.accent;
          ctx.fillText(text, x, baseline);
          ctx.restore();
        }
        ctx.shadowColor = 'transparent';
        if (effect === 'underline' || styled && node.spanStyle === 'underline') {
          ctx.fillStyle = palette.accent;
          ctx.fillRect(x, baseline + size * .13, width * (effect === 'underline' ? ease(p) : 1), Math.max(2, size * .055));
        }
      };

      if (effect === 'counter' && /^\d+$/u.test(row.text) && Number.isSafeInteger(Number(row.text)) && p < 1) {
        const formatter = new Intl.NumberFormat(locale, { useGrouping: false });
        paint(formatter.format(Math.round(Number(row.text) * ease(p))), row.x, false, row.width);
      } else if (row.units.length && p < 1) {
        row.units.forEach((unit, unitIndex) => {
          const target = progress(frame, node, unitIndex, row.units.length);
          if (target <= 0) return;
          ctx.save();
          ctx.globalAlpha *= effect === 'type' ? 1 : ease(target);
          if (effect === 'word') ctx.translate(0, (1 - ease(target)) * size * .22);
          paint(unit.text, unit.x, unit.styled, unit.width);
          ctx.restore();
        });
      } else {
        if (['word', 'character', 'type'].includes(effect) && p < 1) {
          ctx.beginPath();
          ctx.rect(box.x, box.y, box.width * p, box.height);
          ctx.clip();
        }
        row.parts.forEach(part => paint(part.text, row.x + part.x, part.styled, part.width));
      }
      ctx.restore();
    }
    ctx.restore();
    return geometry.truncated;
  }

  root.StudioTextLayout = { layout, draw };
})(typeof window === 'undefined' ? globalThis : window);
