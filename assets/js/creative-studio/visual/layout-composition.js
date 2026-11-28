(function (root) {
  'use strict';

  const { tokens, contrast } = root.StudioDesignTokens || require('./design-tokens');
  const solver = root.StudioLayoutSolver || require('./layout-solver');

  const graphemeSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = value => graphemeSegmenter ? Array.from(graphemeSegmenter.segment(value), item => item.segment) : Array.from(value);

  const wordSegmenters = new Map();

  function captionTiming(value, frames, fps, locale) {
    const copy = value.trim();
    locale = ['en', 'es', 'da'].includes(locale) ? locale : 'en';
    if (!copy) return { available: frames / fps, recommended: 0 };
    if (typeof Intl.Segmenter === 'function' && !wordSegmenters.has(locale)) {
      wordSegmenters.set(locale, new Intl.Segmenter(locale, { granularity: 'word' }));
    }
    const words = wordSegmenters.has(locale)
      ? Array.from(wordSegmenters.get(locale).segment(copy)).filter(item => item.isWordLike).length
      : copy.split(/\s+/u).length;
    return { available: frames / fps, recommended: Math.max(1, words / 3, graphemes(copy).length / 17) };
  }

  function text(ctx, value, box, ideal, weight, color, scale, align) {
    if (!value.trim()) return false;
    const floor = Math.min(ideal, tokens.type.minimum) * scale;
    if (box.height < floor * tokens.type.lineHeight || box.width <= 0) return true;
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
        for (const character of graphemes(word)) {
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
    const fitsWidth = line => ctx.measureText(line).width <= box.width;
    const truncated = lines.length > count || lines.some(line => !fitsWidth(line));
    const visible = lines.slice(0, count);
    const firstTooWide = visible.findIndex(line => !fitsWidth(line));
    if (firstTooWide >= 0) visible.length = firstTooWide + 1;
    if (visible.length && truncated) {
      const lastIndex = visible.length - 1;
      const last = graphemes(visible[lastIndex]);
      while (last.length && !fitsWidth(last.join('') + '…')) last.pop();
      if (fitsWidth('…')) visible[lastIndex] = last.join('') + '…';
      else visible.pop();
    }
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    const x = box.x + (align === 'center' ? box.width / 2 : align === 'right' ? box.width : 0);
    const y = box.y + (box.height - visible.length * step) / 2;
    visible.forEach((line, i) => ctx.fillText(line, x, y + (i + .5) * step));
    return truncated;
  }

  function panel(ctx, x, y, w, h, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.max(0, Math.min(radius, w / 2, h / 2)));
    ctx.fill();
  }

  function drawCaptionPattern(ctx, box, colors, scale) {
    const { x, y, width, height } = box;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 18 * scale);
    ctx.clip();
    ctx.fillStyle = colors[0];
    ctx.fillRect(x, y, width, height);
    const unit = 15 * scale;
    for (let row = 0; row < Math.ceil(height / unit); row++) {
      for (let col = -1; col < Math.ceil(width / unit); col++) {
        ctx.fillStyle = colors[1 + (row * 2 + col + 1) % (colors.length - 1)];
        ctx.fillRect(x + (col + (row % 2) * .5) * unit, y + row * unit, unit * .70, unit * .48);
      }
    }
    ctx.restore();
  }

  function drawMotionLayer(ctx, states, id, box, draw, cameraBox = null, groupBox = box) {
    const chain = root.StudioMotionGraph?.chain(states, id) || [];
    if (cameraBox && states.has('camera') && !chain.some(state => state.id === 'camera')) chain.unshift(states.get('camera'));
    if (!chain.length) return draw();
    ctx.save();
    try {
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.clip();
      for (const state of chain) {
        const bounds = state.id === 'camera' && cameraBox ? cameraBox : state.id === id ? box : groupBox;
        const cx = bounds.x + bounds.width / 2;
        const cy = bounds.y + bounds.height / 2;
        ctx.globalAlpha *= state.opacity;
        ctx.translate(cx + state.x * bounds.width, cy + (state.y + state.maskOffset) * bounds.height);
        ctx.rotate(state.rotation * Math.PI / 180);
        ctx.scale(state.scaleX, state.scaleY);
        ctx.translate(-cx, -cy);
        if (state.clip < 1) {
          ctx.beginPath();
          ctx.rect(bounds.x, bounds.y, bounds.width * state.clip, bounds.height);
          ctx.clip();
        }
      }
      const state = states.get(id);
      draw(state);
      if (state?.underline > 0) {
        ctx.fillStyle = state.color || '#eeb875';
        ctx.fillRect(box.x + box.width * .07, box.y + box.height * .90, box.width * .86 * state.underline, Math.max(2, box.height * .025));
      }
    } finally {
      ctx.restore();
    }
  }

  function drawSubject(ctx, shot, layout, box, palette, phase, locale, states, puppet) {
    const { x, y, width: w, height: h } = box;
    if (w < 4 || h < 4) return;
    const preset = layout.preset;
    const typography = shot.customData?.typography;
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
    if (isCharacter && puppet) {
      const backdrop = ctx.createLinearGradient(x, y, x + w, y + h);
      backdrop.addColorStop(0, '#202b43');
      backdrop.addColorStop(1, '#465b66');
      panel(ctx, x, y, w, h - offset, tokens.radius, backdrop);
      const floor = y + h * .86;
      panel(ctx, x + w * .14, floor, w * .66, h * .04, h * .02, '#b68765');
      drawMotionLayer(ctx, states, 'puppet', box, state => root.StudioPuppet.draw(ctx, box, state, 'calm'), box);
      const prop = { x: x + w * .66, y: y + h * .24, width: w * .31, height: h * .55 };
      if (states.has('prop')) drawMotionLayer(ctx, states, 'prop', prop, state => {
        const size = Math.min(prop.width * .53, prop.height * .35);
        const px = prop.x + prop.width * .48 - size * .5;
        const py = prop.y + prop.height * .70 - size * .5;
        const open = states.get('puppet')?.poseId === 'shock';
        if (open) {
          ctx.fillStyle = '#dd9b6e';
          ctx.beginPath();
          ctx.moveTo(px, py + size * .18);
          ctx.lineTo(px + size * .5, py - size * .35);
          ctx.lineTo(px + size, py + size * .18);
          ctx.fill();
          panel(ctx, px + size * .15, py - size * .14, size * .70, size * .71, size * .08, '#fff1cf');
        }
        panel(ctx, px, py + (open ? size * .26 : 0), size, size * (open ? .74 : 1), size * .13, state?.color || '#f1c383');
        ctx.strokeStyle = '#5b4051';
        ctx.lineWidth = Math.max(1, size * .045);
        ctx.beginPath();
        const fold = open ? .37 : .15;
        ctx.moveTo(px, py + size * fold);
        ctx.lineTo(px + size * .5, py + size * (fold + .34));
        ctx.lineTo(px + size, py + size * fold);
        ctx.stroke();
      }, box, box);
    } else if (isCharacter) {
      const backdrop = ctx.createLinearGradient(x, y, x + w, y + h);
      backdrop.addColorStop(0, '#222138');
      backdrop.addColorStop(1, '#465071');
      panel(ctx, x, y, w, h - offset, tokens.radius, backdrop);
      ctx.fillStyle = '#171d2f';
      ctx.fillRect(x, y + h * .86, w, h * .14);
      const scale = Math.min(w / (preset === 'reaction' ? 650 : 320), h / 340) * tokens.characterScale[layout.pose === 'large' ? 'large' : 'standard'];
      const originalPose = layout.pose === 'large' ? 'shocked' : (shot.customData.characterPose || (preset === 'character-right' ? 'wing-point' : 'neutral'));
      const people = preset === 'reaction' ? [[.28, 'wing-point', 1, .84], [.73, progress > .3 ? 'shocked' : 'neutral', -1, 1.12]]
        : [[preset === 'dialogue' ? .40 : .51, originalPose, 1, 1]];
      panel(ctx, x + w * .08, y + h * .80, w * .84, h * .12, h * .05, '#283247');
      people.forEach(([position, pose, facing, size]) => {
        ctx.save();
        ctx.translate(x + w * position, y + h * .44);
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
    } else if (shot.customData?.motion?.subjectVisual === 'doorway') {
      const opening = x + w * .61;
      const floor = y + h * .86;
      const light = ctx.createRadialGradient(opening, y + h * .52, 0, opening, y + h * .52, w * .65);
      light.addColorStop(0, '#80585a');
      light.addColorStop(.55, '#312a3b');
      light.addColorStop(1, '#171928');
      panel(ctx, x, y, w, h - offset, tokens.radius, light);
      const left = x + w * .27;
      const right = x + w * .74;
      const top = y + h * .12;
      panel(ctx, left, top, right - left, floor - top, 0, '#e6b483');
      panel(ctx, left + w * .024, top + h * .035, right - left - w * .045, floor - top - h * .035, 0, '#593d4c');
      ctx.fillStyle = '#bc846b';
      ctx.beginPath();
      ctx.moveTo(left + w * .025, top + h * .035);
      ctx.lineTo(x + w * .44, top + h * .11);
      ctx.lineTo(x + w * .44, floor + h * .035);
      ctx.lineTo(left + w * .025, floor);
      ctx.fill();
      ctx.fillStyle = '#1c1a2a';
      ctx.beginPath();
      ctx.ellipse(opening, y + h * .40, w * .067, h * .13, -.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(opening - w * .10, y + h * .54);
      ctx.quadraticCurveTo(opening, y + h * .46, opening + w * .10, y + h * .55);
      ctx.lineTo(opening + w * .14, floor);
      ctx.lineTo(opening - w * .14, floor);
      ctx.fill();
      panel(ctx, x + w * .408, y + h * .57, w * .014, h * .023, 3, '#fff0bb');
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
      } else if (typography?.version === 1 && shot.artDirection === 'minimal-suspense') {
        const edge = cx + size * .14;
        const threshold = cy + size * .33;
        const beam = ctx.createLinearGradient(edge, threshold, cx - size * .36, cy + size * .41);
        beam.addColorStop(0, '#dfb080');
        beam.addColorStop(1, '#dfb08000');
        ctx.fillStyle = beam;
        ctx.moveTo(edge - size * .04, threshold);
        ctx.lineTo(edge, threshold);
        ctx.lineTo(cx - size * .36, cy + size * .46);
        ctx.lineTo(cx - size * .55, cy + size * .46);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = '#dfb080';
        ctx.lineWidth = Math.max(1, size * .025);
        ctx.moveTo(cx - size * .25, threshold);
        ctx.lineTo(cx - size * .25, cy - size * .37);
        ctx.lineTo(edge, cy - size * .37);
        ctx.lineTo(edge, threshold);
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
      light.addColorStop(0, '#d89a67');
      light.addColorStop(.48, '#4b3244');
      light.addColorStop(1, '#121421');
      panel(ctx, x, y, w, h - offset, tokens.radius, light);
      ctx.fillStyle = '#eab680';
      ctx.fillRect(cx - w * .10, y + h * .18, w * .20, h * .63);
      ctx.fillStyle = '#392944';
      ctx.fillRect(cx - w * .07, y + h * .22, w * .14, h * .59);
      const floor = cy + h * .17;
      ctx.fillStyle = '#e0ac6640';
      ctx.beginPath();
      ctx.moveTo(cx - w * .09, floor);
      ctx.lineTo(cx + w * .10, floor);
      ctx.lineTo(cx + w * .21, y + h * .98);
      ctx.lineTo(cx - w * .20, y + h * .98);
      ctx.fill();
      const actorX = cx - w * (.20 - Math.max(0, progress - .54) * (shot.startFrame ? .16 : .07));
      const shadowTravel = shot.startFrame > 0 ? progress * w * .15 : 0;
      ctx.fillStyle = '#131320b0';
      ctx.beginPath();
      ctx.moveTo(actorX - w * .06, floor);
      ctx.lineTo(actorX + w * .07, floor);
      ctx.lineTo(actorX - w * .08 - shadowTravel, y + h * .95);
      ctx.lineTo(actorX - w * .20 - shadowTravel, y + h * .95);
      ctx.fill();
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
        if (typography?.version === 1 && typography.title?.effect === 'counter' && /^[1-9]\d?$/u.test(shot.headline) && Number(shot.headline) <= 8) {
          const sourceCount = Number(shot.headline);
          const fileWidth = Math.min(gw / (sourceCount * 1.5), gh * .48);
          const gap = fileWidth * .40;
          const left = gx + (gw - (sourceCount * fileWidth + (sourceCount - 1) * gap)) / 2;
          const fileHeight = Math.min(gh * .50, fileWidth * 1.32);
          const top = gy + (gh - fileHeight) / 2;
          const cue = root.StudioKineticType.cue(typography.title, 'title', shot.durationFrames);
          const cueProgress = root.StudioKineticType.progress(phase * (shot.durationFrames - 1), cue);
          const active = Math.round(sourceCount * (1 - (1 - cueProgress) ** 3));
          for (let index = 0; index < sourceCount; index++) {
            const x = left + index * (fileWidth + gap);
            panel(ctx, x, top, fileWidth, fileHeight, fileWidth * .11, index < active ? palette.accent : palette.overlay);
            panel(ctx, x + fileWidth * .18, top + fileHeight * .34, fileWidth * .64, fileHeight * .07, 2, palette.background);
            panel(ctx, x + fileWidth * .18, top + fileHeight * .56, fileWidth * .47, fileHeight * .07, 2, palette.background);
          }
        } else if (figure) {
          text(ctx, figure, { x: gx, y: gy, width: gw, height: gh }, 120, 800, palette.accent, Math.min(w, h) / 260, 'center');
        } else {
          ctx.strokeStyle = palette.accent;
          ctx.lineWidth = tokens.outline * 2;
          ctx.beginPath();
          ctx.moveTo(gx, gy + gh * .75);
          ctx.lineTo(gx + gw * .34, gy + gh * .62);
          ctx.lineTo(gx + gw * .60, gy + gh * .68);
          ctx.lineTo(gx + gw, gy + gh * (.66 - progress * .42));
          ctx.stroke();
        }
      } else if (preset === 'hero' && typography?.version === 1 && shot.artDirection === 'cinematic-saas') {
        const labels = ['CSV', 'JSON', 'PDF', 'YAML', 'SQL'];
        const row = Math.min(gh / 5, gw / 3);
        const top = gy + (gh - row * 5) / 2;
        const left = gx + gw * .07;
        const labelWidth = gw * .29;
        labels.forEach((label, index) => {
          const y = top + index * row;
          const entry = { x: gx, y, width: gw, height: row };
          drawMotionLayer(ctx, states, 'entry-' + label.toLowerCase(), entry, state => {
            panel(ctx, left, y + row * .09, labelWidth, row * .78, row * .12, palette.overlay);
            text(ctx, state?.animated.has('number') ? String(Math.round(state.number)) : label,
              { x: left, y, width: labelWidth, height: row }, 46, 700,
              palette.foreground, row / 67, 'center');
            panel(ctx, gx + gw * .41, y + row * .29, gw * (.27 + (index % 3) * .12) * (.86 + progress * .14),
              row * .38, row * .18, state?.color || (index % 2 ? palette.muted : palette.accent));
          }, null, box);
        });
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
        const tableX = bodyX + bodyW * .10, tableW = bodyW * .80;
        text(ctx, strings[3], { x: tableX, y: gy + gh * .34, width: tableW, height: gh * .15 }, 21, 700, palette.foreground, gh / 230, 'left');
        for (let row = 0; row < 3; row++) {
          const rowY = gy + gh * (.52 + row * .10);
          const active = row <= progress * 3;
          panel(ctx, tableX, rowY, tableW * .48, gh * .041, tokens.radius / 6, active ? palette.accent : palette.muted);
          panel(ctx, tableX + tableW * .57, rowY, tableW * .33, gh * .041, tokens.radius / 6, palette.muted);
        }
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

  function render(ctx, shot, layout, frame, width, height, locale = 'en', fps = 30, options = {}) {
    const { scale: measureScale } = solver.geometry(width, height);
    const typography = shot.customData?.typography?.version === 1 ? shot.customData.typography : null;
    const makeNode = (role, content) => ({
      ...root.StudioKineticType.cue(typography[role], role, shot.durationFrames),
      content: String(content || '')
    });
    const captionNode = typography ? makeNode('caption', shot.subhead) : null;
    const intrinsic = {};
    ctx.save();
    for (const [role, value, ideal, weight] of [['title', shot.headline, tokens.type.title, 790], ['caption', shot.subhead, tokens.type.body, 550]]) {
      if (!layout.blocks?.[role]?.intrinsic) continue;
      const fontSize = ideal * measureScale;
      if (typography) {
        const node = makeNode(role, value);
        const typeScale = measureScale * 720 / 1080;
        ctx.font = `${node.weight} ${node.size * typeScale}px ${root.StudioFonts.family(node.family, node.size)}`;
        const lines = node.content.split(/\r?\n/);
        intrinsic[role] = {
          width: Math.max(...lines.map(line => ctx.measureText(line).width)) + tokens.space.padding * measureScale,
          height: node.size * node.lineHeight * Math.max(2, lines.length) * typeScale
        };
        continue;
      }
      ctx.font = `${weight} ${fontSize}px ${tokens.type.family}`;
      intrinsic[role] = { width: ctx.measureText(String(value || '')).width + tokens.space.padding * measureScale, height: fontSize * 2 * tokens.type.lineHeight };
    }
    ctx.restore();
    const resolved = solver.resolve(layout, width, height, intrinsic, Boolean(typography));
    const { blocks, scale, warnings } = resolved;
    const available = captionNode ? captionNode.endFrame - captionNode.startFrame : shot.durationFrames;
    const timing = captionTiming(String(shot.subhead || ''), available, fps, locale.slice(0, 2));
    if (timing.available + .001 < timing.recommended) warnings.push({ type: 'timing', roles: ['caption'], ...timing });
    const theme = tokens.color[layout.palette === 'light' ? 'light' : 'dark'];
    const accent = /^#[0-9a-f]{6}$/i.test(shot.accentColor) && contrast(shot.accentColor, theme.surface) >= 3
      ? shot.accentColor : theme.accent;
    const palette = { ...theme, accent };
    const graph = shot.customData?.motion;
    const states = root.StudioMotionGraph?.evaluate(graph, frame, shot.durationFrames, options) || new Map();
    resolved.motion = states;
    const phase = options.reduced && graph?.version === 1 ? 1 : Math.max(0, Math.min(1, frame / Math.max(1, shot.durationFrames - 1)));
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
        drawMotionLayer(ctx, states, role, box, state => drawSubject(ctx, shot, layout, box,
          state?.color ? { ...palette, accent: state.color } : palette, phase, String(locale || 'en').slice(0, 2),
          states, graph?.puppet === 'parrot'), graph?.puppet === 'parrot' ? null : box);
        continue;
      }
      drawMotionLayer(ctx, states, role, box, () => {
        const caption = role === 'caption';
        const color = caption && !typography ? palette.muted : palette.foreground;
        const pattern = caption && captionNode?.backdrop === 'pattern'
          ? (layout.palette === 'light' ? ['#fff9ef', '#dacdc3', '#e3d6c2'] : ['#20283b', '#414b62', '#343d56'])
          : null;
        let inner = box;
        if (caption) {
          if (captionNode && (frame < captionNode.startFrame || frame >= captionNode.endFrame)) return;
          const card = !captionNode || captionNode.contrast === 'panel';
          if (pattern) drawCaptionPattern(ctx, box, pattern, scale);
          if (card && pattern) {
            const inset = Math.min(9 * scale, box.height * .08, box.width * .08);
            panel(ctx, box.x + inset, box.y + inset, box.width - 2 * inset, box.height - 2 * inset, tokens.radius * scale, palette.surface);
          } else if (card && shot.artDirection === 'minimal-suspense' && !typography) {
            panel(ctx, box.x, box.y + box.height * .18, Math.max(2, tokens.outline * scale), box.height * .64, 1, palette.accent);
          } else if (card) {
            const radius = shot.artDirection === 'character-comedy' ? tokens.radius * 1.45 : tokens.radius;
            panel(ctx, box.x, box.y, box.width, box.height, radius * scale, palette.surface);
          }
          const padding = Math.min(tokens.space.padding * scale, box.height * .18, box.width * .12);
          inner = { x: box.x + padding, y: box.y + padding, width: box.width - padding * 2, height: box.height - padding * 2 };
        }
        const background = caption && (!captionNode || captionNode.contrast === 'panel') && (typography || shot.artDirection !== 'minimal-suspense') ? palette.surface : palette.background;
        const backgrounds = pattern ? (captionNode.contrast === 'panel' ? [palette.surface] : pattern) : [background];
        const inkContrast = Math.min(...backgrounds.map(value => contrast(color, value)));
        if (caption && typography) resolved.captionContrast = inkContrast;
        if (inkContrast < 4.5) warnings.push({ type: 'contrast', roles: [role] });
        if (typography) {
          const node = caption ? captionNode : makeNode('title', shot.headline);
          const typeScale = scale * 720 / 1080;
          const ctaCopy = typeof typography.ctaCopy === 'string' ? typography.ctaCopy.slice(0, 180) : '';
          if (caption && resolved.format === 'portrait') {
            node.minSize = 40;
            if (!typography.caption?.size) node.size = Math.max(50, node.size);
          }
          const ink = { ...palette, ink: color,
            accent: backgrounds.every(value => contrast(palette.accent, value) >= 4.5) ? palette.accent : color };
          if (!caption && ctaCopy.trim() && inner.height > 0) {
            const ctaHeight = Math.min(inner.height * .34, 88 * scale);
            const ctaBox = { ...inner, y: inner.y + inner.height - ctaHeight, height: ctaHeight };
            inner = { ...inner, height: inner.height - ctaHeight - Math.min(ctaHeight * .18, 10 * scale) };
            if (root.StudioTextLayout.draw(ctx, makeNode('cta', ctaCopy), ctaBox, typeScale, box.align, frame,
              { ...ink, ink: ink.accent }, locale)) warnings.push({ type: 'text', roles: [role] });
          }
          if (node.content.trim() && root.StudioTextLayout.draw(ctx, node, inner, typeScale, box.align, frame, ink, locale)) {
            warnings.push({ type: 'text', roles: [role] });
          }
        } else if (text(ctx, String((caption ? shot.subhead : shot.headline) || ''), inner, caption ? (resolved.format === 'portrait' ? 34 : tokens.type.body) : tokens.type.title, caption ? 550 : 790, color, scale, box.align)) {
          warnings.push({ type: 'text', roles: [role] });
        }
      });
    }
    ctx.restore();
    return resolved;
  }

  root.StudioLayoutComposition = { render, captionTiming };
  if (typeof module !== 'undefined') module.exports = root.StudioLayoutComposition;
})(typeof window === 'undefined' ? globalThis : window);
