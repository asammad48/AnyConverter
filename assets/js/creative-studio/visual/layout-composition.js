(function (root) {
  'use strict';

  const { tokens, contrast } = root.StudioDesignTokens || require('./design-tokens');
  const solver = root.StudioLayoutSolver || require('./layout-solver');

  function text(ctx, value, box, ideal, weight, color, scale, align) {
    const floor = tokens.type.minimum * scale;
    let size = Math.min(ideal * scale, box.height / tokens.type.lineHeight);
    let lines;
    function wrap() {
      const result = [];
      let line = '';
      for (const word of value.trim().split(/\s+/u)) {
        const next = line ? line + ' ' + word : word;
        if (ctx.measureText(next).width <= box.width) {
          line = next;
          continue;
        }
        if (line) result.push(line);
        line = '';
        for (const character of word) {
          if (line && ctx.measureText(line + character).width > box.width) {
            result.push(line);
            line = '';
          }
          line += character;
        }
      }
      if (line) result.push(line);
      return result;
    }
    do {
      ctx.font = `${weight} ${size}px ${tokens.type.family}`;
      lines = wrap();
      if (lines.length * size * tokens.type.lineHeight <= box.height || size <= floor) break;
      size = Math.max(floor, size * .92);
    } while (true);
    const step = size * tokens.type.lineHeight;
    const count = Math.max(0, Math.floor((box.height + .01) / step));
    const visible = lines.slice(0, count);
    if (count && lines.length > count) {
      let last = visible[count - 1];
      while (last && ctx.measureText(last + '…').width > box.width) last = Array.from(last).slice(0, -1).join('');
      visible[count - 1] = last + '…';
    }
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    const x = box.x + (align === 'center' ? box.width / 2 : align === 'right' ? box.width : 0);
    const y = box.y + (box.height - visible.length * step) / 2;
    visible.forEach((line, i) => ctx.fillText(line, x, y + (i + .5) * step, box.width));
    return lines.length > count;
  }

  function panel(ctx, x, y, w, h, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.max(0, Math.min(radius, w / 2, h / 2)));
    ctx.fill();
  }

  function drawSubject(ctx, shot, layout, box, palette, phase, locale) {
    const { x, y, width: w, height: h } = box;
    if (w < 4 || h < 4) return;
    const preset = layout.preset;
    const strings = ({ es: ['Antes', 'Después', 'Informe', 'Registros', 'Revisar'], da: ['Før', 'Efter', 'Rapport', 'Poster', 'Gennemse'] })[locale] ||
      ['Before', 'After', 'Report', 'Records', 'Review'];
    const isCharacter = ['dialogue', 'character-right', 'character-center', 'reaction'].includes(preset);
    const settle = 1 - (1 - Math.min(1, phase * 2.5)) ** 3;
    const hold = Math.max(0, Math.min(1, (phase - .22) / .64));
    const progress = hold * hold * (3 - 2 * hold);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    const elevation = Math.min(h * .08, tokens.propElevation * Math.min(w, h) / 240);
    const offset = (1 - settle) * elevation * (box.depth + 1) / 3;
    ctx.translate(0, offset);
    if (isCharacter) {
      const backdrop = ctx.createLinearGradient(x, y, x + w, y + h);
      backdrop.addColorStop(0, '#222138');
      backdrop.addColorStop(1, '#465071');
      panel(ctx, x, y, w, h - offset, tokens.radius, backdrop);
      ctx.fillStyle = '#171d2f';
      ctx.fillRect(x, y + h * .86, w, h * .14);
      const scale = Math.min(w / (preset === 'reaction' ? 650 : 320), h / 340) * tokens.characterScale[layout.pose === 'large' ? 'large' : 'standard'];
      const originalPose = layout.pose === 'large' ? 'shocked' : (shot.customData.characterPose || 'neutral');
      const people = preset === 'reaction' ? [[.28, 'neutral', 1, .91], [.73, progress > .3 ? 'shocked' : 'neutral', -1, 1.12]] : [[.50, originalPose, 1, 1]];
      people.forEach(([position, pose, facing, size]) => {
        ctx.save();
        ctx.translate(x + w * position, y + h * .47);
        ctx.scale(scale * facing * size, scale * size);
        shot._drawParrotCharacter(ctx, phase, 0, 0, pose);
        ctx.restore();
      });
      if (preset === 'dialogue') {
        const mx = x + w * .76, my = y + h * .62;
        const size = Math.min(w, h);
        panel(ctx, mx - size * .05, my - size * .13, size * .10, size * .20, tokens.radius, '#d2dae9');
        panel(ctx, mx - size * .015, my + size * .04, size * .03, size * .20, tokens.radius / 3, '#d2dae9');
        panel(ctx, mx - size * .085, my + size * .22, size * .17, size * .025, tokens.radius / 3, '#d2dae9');
      }
    } else if (preset === 'punchline') {
      ctx.fillStyle = palette.accent;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const size = Math.min(w, h) * (.60 + .26 * settle);
      ctx.lineWidth = Math.max(2, size * .09);
      ctx.strokeStyle = palette.accent;
      ctx.lineCap = 'round';
      const cx = x + w / 2, cy = y + h / 2;
      ctx.beginPath();
      if (shot.artDirection === 'character-comedy') {
        ctx.roundRect(cx - size * .40, cy - size * .34, size * .80, size * .70, size * .10);
        ctx.moveTo(cx - size * .40, cy - size * .14);
        ctx.lineTo(cx + size * .40, cy - size * .14);
        ctx.moveTo(cx - size * .18, cy + size * .03);
        ctx.lineTo(cx + size * .18, cy + size * .23);
        ctx.moveTo(cx + size * .18, cy + size * .03);
        ctx.lineTo(cx - size * .18, cy + size * .23);
      } else if (shot.artDirection === 'cinematic-saas') {
        ctx.roundRect(cx - size * .37, cy - size * .42, size * .74, size * .85, size * .10);
        ctx.moveTo(cx - size * .17, cy + size * .01);
        ctx.lineTo(cx - size * .04, cy + size * .14);
        ctx.lineTo(cx + size * .20, cy - size * .12);
      } else {
        ctx.arc(cx, cy, size * .29, 0, Math.PI * 2);
        ctx.moveTo(cx, cy - size * .43);
        ctx.lineTo(cx, cy - size * .26);
      }
      ctx.stroke();
    } else if (preset === 'silhouette') {
      const cx = x + w * .67;
      const cy = y + h * .64;
      const light = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, w * .62));
      light.addColorStop(0, progress > .78 && shot.purpose === 'benefit' ? '#6c4b52' : '#d18358');
      light.addColorStop(.48, '#4b3244');
      light.addColorStop(1, '#121421');
      panel(ctx, x, y, w, h - offset, tokens.radius, light);
      ctx.fillStyle = '#eab680';
      ctx.fillRect(cx - w * .10, y + h * .18, w * .20, h * .63);
      ctx.fillStyle = '#392944';
      ctx.fillRect(cx - w * .07, y + h * .22, w * .14, h * .59);
      const actorX = cx - w * (.22 - Math.max(0, progress - .54) * (shot.startFrame ? .16 : .07));
      if (shot.startFrame > 0) {
        ctx.save();
        ctx.globalAlpha = .62;
        ctx.fillStyle = '#160f20';
        ctx.beginPath();
        ctx.ellipse(cx - w * .32 + w * .36 * progress, cy + h * .18, w * .095, h * .048, -.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#171421';
      ctx.beginPath();
      ctx.ellipse(actorX, cy - h * .26, w * .047, h * .09, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(actorX - w * .06, cy - h * .17);
      ctx.lineTo(actorX + w * .06, cy - h * .17);
      ctx.lineTo(actorX + w * .09, cy + h * .17);
      ctx.lineTo(actorX - w * .09, cy + h * .17);
      ctx.fill();
    } else if (preset === 'reveal' && shot.artDirection === 'minimal-suspense') {
      const size = Math.min(w * .42, h * .70);
      const switchX = x + (w - size) * .62;
      const switchY = y + (h - size) / 2;
      panel(ctx, x, y, w, h - offset, tokens.radius, '#282333');
      panel(ctx, switchX, switchY, size * .67, size, tokens.radius / 2, '#bba28c');
      panel(ctx, switchX + size * .20, switchY + size * .19, size * .27, size * .62, tokens.radius / 3, '#594956');
      panel(ctx, switchX + size * .22, switchY + size * (progress < .62 ? .24 : .46), size * .23, size * .31, tokens.radius / 4, '#efe0c3');
    } else {
      const pad = Math.min(w, h) * tokens.space.padding / 360;
      ctx.shadowColor = tokens.shadow.color;
      ctx.shadowBlur = tokens.shadow.blur;
      ctx.shadowOffsetY = tokens.shadow.offset;
      panel(ctx, x + pad, y + pad, w - 2 * pad, h - 2 * pad - offset, tokens.radius, palette.surface);
      ctx.shadowColor = '#00000000';
      const gx = x + pad * 2, gy = y + pad * 2;
      const gw = w - pad * 4, gh = Math.max(1, h - pad * 4 - offset);
      if (preset === 'statistic') {
        const figure = shot.headline.match(/\d+(?:[.,]\d+)?(?:\s?%|×|x)?/u)?.[0];
        if (figure) text(ctx, figure, { x: gx, y: gy, width: gw, height: gh }, 120, 800, palette.accent, Math.min(w, h) / 260, 'center');
        else {
          ctx.strokeStyle = palette.accent;
          ctx.lineWidth = tokens.outline * 2;
          ctx.beginPath();
          ctx.moveTo(gx, gy + gh * .75);
          ctx.lineTo(gx + gw * .34, gy + gh * .62);
          ctx.lineTo(gx + gw * .60, gy + gh * .68);
          ctx.lineTo(gx + gw, gy + gh * (.66 - progress * .42));
          ctx.stroke();
        }
      } else if (preset === 'hero') {
        const unit = Math.min(gw / 450, gh / 250);
        if (unit > 0) {
          ctx.save();
          ctx.translate(gx + (gw - 450 * unit) / 2, gy + (gh - 250 * unit) / 2);
          ctx.scale(unit, unit);
          shot._renderChaosDataStream(ctx, .25 + progress * .75, 0, 0, 450, 250);
          ctx.restore();
        }
      } else if (preset === 'comparison') {
        const card = gw * .46;
        panel(ctx, gx, gy, card, gh, tokens.radius / 2, palette.overlay);
        panel(ctx, gx + gw - card, gy, card, gh, tokens.radius / 2, palette.overlay);
        text(ctx, strings[0], { x: gx + card * .09, y: gy, width: card * .78, height: gh * .20 }, 22, 700, palette.muted, gh / 190, 'left');
        text(ctx, strings[1], { x: gx + gw - card * .86, y: gy, width: card * .78, height: gh * .20 }, 24, 750, palette.foreground, gh / 190, 'left');
        for (let i = 0; i < 4; i++) {
          const row = gh * .12;
          panel(ctx, gx + card * (.09 + .11 * i), gy + row * (1.6 + i * 1.3), card * (.62 - .09 * i), row * .50, tokens.radius / 3, palette.muted);
          panel(ctx, gx + gw - card * .86, gy + row * (1.6 + i * 1.3), card * .72, row * .50, tokens.radius / 3, palette.accent);
        }
      } else if (preset === 'product' || preset === 'reveal') {
        panel(ctx, gx, gy, gw, gh, tokens.radius / 2, palette.overlay);
        const rail = gw * .24;
        panel(ctx, gx, gy, rail, gh, tokens.radius / 2, palette.surface);
        for (let i = 0; i < 3; i++) {
          panel(ctx, gx + rail * .16, gy + gh * (.16 + i * .18), rail * .68, gh * .065, tokens.radius / 3,
            i === 1 ? palette.accent : palette.muted);
        }
        const bodyX = gx + rail + gw * .07;
        const bodyW = gw * .61;
        text(ctx, strings[2], { x: bodyX, y: gy + gh * .05, width: bodyW, height: gh * .23 }, 30, 740, palette.foreground, gh / 230, 'left');
        panel(ctx, bodyX, gy + gh * .34, bodyW, gh * .50, tokens.radius / 2, palette.surface);
        text(ctx, strings[3], { x: bodyX + bodyW * .10, y: gy + gh * .34, width: bodyW * .80, height: gh * .15 }, 18, 700, palette.muted, gh / 230, 'left');
        text(ctx, strings[4], { x: bodyX + bodyW * .10, y: gy + gh * .68, width: bodyW * .80, height: gh * .14 }, 18, 700, palette.accent, gh / 230, 'left');
        const reveal = preset === 'reveal' ? progress : .40 + progress * .60;
        panel(ctx, bodyX + bodyW * .10, gy + gh * .51, bodyW * .80 * reveal, gh * .14, tokens.radius / 2, palette.accent);
      } else {
        panel(ctx, gx, gy, gw, gh, tokens.radius / 2, palette.overlay);
        for (let i = 0; i < 4; i++) {
          const line = gh / 8;
          panel(ctx, gx + gw * .10, gy + (2 + i * 1.3) * line, gw * [0.80, 0.52, 0.64, 0.38][i] * (.62 + .38 * progress), line * .55, tokens.radius / 2, i === 0 ? palette.accent : palette.muted);
        }
      }
    }
    ctx.restore();
  }

  function render(ctx, shot, layout, frame, width, height, locale = 'en') {
    const { scale: measureScale } = solver.geometry(width, height);
    const intrinsic = {};
    ctx.save();
    for (const [role, value, ideal, weight] of [['title', shot.headline, tokens.type.title, 790], ['caption', shot.subhead, tokens.type.body, 550]]) {
      if (!layout.blocks?.[role]?.intrinsic) continue;
      const fontSize = ideal * measureScale;
      ctx.font = `${weight} ${fontSize}px ${tokens.type.family}`;
      intrinsic[role] = { width: ctx.measureText(String(value || '')).width + tokens.space.padding * measureScale, height: fontSize * 2 * tokens.type.lineHeight };
    }
    ctx.restore();
    const resolved = solver.resolve(layout, width, height, intrinsic);
    const { blocks, scale, warnings } = resolved;
    const theme = tokens.color[layout.palette === 'light' ? 'light' : 'dark'];
    const accent = /^#[0-9a-f]{6}$/i.test(shot.accentColor) && contrast(shot.accentColor, theme.surface) >= 3
      ? shot.accentColor : theme.accent;
    const palette = { ...theme, accent };
    const phase = Math.max(0, Math.min(1, frame / Math.max(1, shot.durationFrames - 1)));
    ctx.save();
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, width, height);
    if (layout.letterbox) {
      const inset = height * tokens.letterbox;
      ctx.fillStyle = palette.overlay;
      ctx.fillRect(0, 0, width, inset);
      ctx.fillRect(0, height - inset, width, inset);
    }
    for (const role of [...solver.roles].sort((a, b) => blocks[a].depth - blocks[b].depth)) {
      const box = blocks[role];
      if (role === 'subject') {
        drawSubject(ctx, shot, layout, box, palette, phase, String(locale || 'en').slice(0, 2));
        continue;
      }
      const caption = role === 'caption';
      const color = caption ? palette.muted : palette.foreground;
      let inner = box;
      if (caption) {
        if (shot.artDirection === 'minimal-suspense') {
          panel(ctx, box.x, box.y + box.height * .18, Math.max(2, tokens.outline * scale), box.height * .64, 1, palette.accent);
        } else {
          const radius = shot.artDirection === 'character-comedy' ? tokens.radius * 1.45 : tokens.radius;
          panel(ctx, box.x, box.y, box.width, box.height, radius * scale, palette.surface);
        }
        const padding = Math.min(tokens.space.padding * scale, box.height * .18, box.width * .12);
        inner = { x: box.x + padding, y: box.y + padding, width: box.width - padding * 2, height: box.height - padding * 2 };
      }
      const background = caption && shot.artDirection !== 'minimal-suspense' ? palette.surface : palette.background;
      if (contrast(color, background) < 4.5) warnings.push({ type: 'contrast', roles: [role] });
      if (text(ctx, String((caption ? shot.subhead : shot.headline) || ''), inner, caption ? tokens.type.body : tokens.type.title, caption ? 550 : 790, color, scale, box.align)) {
        warnings.push({ type: 'text', roles: [role] });
      }
    }
    ctx.restore();
    return resolved;
  }

  root.StudioLayoutComposition = { render };
  if (typeof module !== 'undefined') module.exports = root.StudioLayoutComposition;
})(typeof window === 'undefined' ? globalThis : window);
