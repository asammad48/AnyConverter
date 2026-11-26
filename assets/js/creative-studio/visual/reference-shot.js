/**
 * AnyConverter Creative Studio — ReferenceShot Module (V2 Enhanced)
 * Encapsulates purposeful cinematic shots with composition rules,
 * typography hierarchy, camera choreography, and mode-gated diagnostics.
 */

(function () {
  'use strict';

  class ReferenceShot {
    constructor(config = {}) {
      this.id = config.id || `shot-${Date.now()}`;
      this.purpose = config.purpose || 'hook'; // hook, problem, solution, benefit, payoff
      this.title = config.title || 'Shot Title';
      this.startFrame = config.startFrame || 0;
      this.durationFrames = config.durationFrames || 120;
      this.headline = config.headline || 'Impact Headline';
      this.subhead = config.subhead || 'Supporting visual and contextual narrative.';
      this.badge = config.badge || 'PROMO';
      this.accentColor = config.accentColor || '#38bdf8';
      this.secondaryColor = config.secondaryColor || '#6366f1';
      this.backgroundColor = config.backgroundColor || '#090d16';
      this.artDirection = config.artDirection || 'cinematic-saas';
      this.cameraMove = config.cameraMove || 'none'; // push-in, pull-out, pan-right, whip-in, none
      this.customData = config.customData || {};
    }

    static easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    static easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    static clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    render(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height, options = {}) {
      const mode = options.mode || 'production';
      const progress = ReferenceShot.clamp(localFrame / (shotDuration || 1), 0, 1);

      ctx.save();

      // 1. Camera Move
      this._applyCamera(ctx, progress, width, height);

      // 2. Render Art Direction Specific Content
      if (this.artDirection === 'character-comedy') {
        this._renderCharacterComedy(ctx, progress, width, height);
      } else if (this.artDirection === 'minimal-suspense') {
        this._renderMinimalSuspense(ctx, progress, width, height);
      } else {
        this._renderCinematicSaaS(ctx, progress, width, height);
      }

      ctx.restore();

      // 3. Diagnostics Overlay (strictly editor-only)
      if (mode === 'diagnostics') {
        this._renderDiagnosticsOverlay(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height);
      }
    }

    _applyCamera(ctx, progress, width, height) {
      const cx = width / 2;
      const cy = height / 2;
      ctx.translate(cx, cy);

      let zoom = 1.0;
      let panX = 0;
      let panY = 0;

      if (this.cameraMove === 'push-in') {
        zoom = 1.0 + progress * 0.06;
      } else if (this.cameraMove === 'pull-out') {
        zoom = 1.06 - progress * 0.06;
      } else if (this.cameraMove === 'pan-right') {
        panX = (progress - 0.5) * 24;
      } else if (this.cameraMove === 'whip-in') {
        const ease = ReferenceShot.easeOutCubic(Math.min(1, progress * 3));
        zoom = 0.94 + ease * 0.06;
        panY = (1 - ease) * 16;
      }

      ctx.scale(zoom, zoom);
      ctx.translate(-cx + panX, -cy + panY);
    }

    // =========================================================================
    // 1. CINEMATIC SAAS ART DIRECTION
    // =========================================================================
    _renderCinematicSaaS(ctx, progress, width, height) {
      // Background gradient
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 80, width * 0.5, height * 0.5, width * 0.85);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.55, '#090d16');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Dynamic ambient accent glow
      const glowGrad = ctx.createRadialGradient(width * 0.68, height * 0.45, 10, width * 0.68, height * 0.45, 380);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.07)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Left Column: Editorial Typography
      this._renderSaaSTypography(ctx, progress, width, height);

      // Right Column: Dynamic Graphic Motif
      this._renderSaaSGraphicMotif(ctx, progress, width, height);
    }

    _renderSaaSTypography(ctx, progress, width, height) {
      const leftMargin = 88;
      const contentY = height * 0.30;
      const enterEase = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.5));

      ctx.save();
      ctx.translate(leftMargin, contentY + (1 - enterEase) * 20);
      ctx.globalAlpha = ReferenceShot.clamp(enterEase, 0, 1);

      // Topic Badge
      const badgeText = (this.badge || 'ANYCONVERTER').toUpperCase();
      ctx.font = '600 13px Inter, -apple-system, sans-serif';
      const badgeW = ctx.measureText(badgeText).width + 24;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0, 0, badgeW, 26, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.accentColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 12, 13);

      // Main Headline
      ctx.font = '700 50px "Bricolage Grotesque", Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'top';

      const headlineLines = this._wrapText(ctx, this.headline, 540);
      let textY = 42;
      for (const line of headlineLines) {
        ctx.fillText(line, 0, textY);
        textY += 60;
      }

      // Supporting Subhead
      ctx.font = '400 19px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      const subheadLines = this._wrapText(ctx, this.subhead, 520);
      textY += 10;
      for (const line of subheadLines) {
        ctx.fillText(line, 0, textY);
        textY += 28;
      }

      // Accent flourish line
      ctx.fillStyle = this.accentColor;
      ctx.fillRect(0, textY + 16, 72 * enterEase, 3);

      ctx.restore();
    }

    _renderSaaSGraphicMotif(ctx, progress, width, height) {
      const cardX = width * 0.53;
      const cardY = height * 0.20;
      const cardW = width * 0.40;
      const cardH = height * 0.60;

      const enterEase = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.2));

      ctx.save();
      ctx.translate(cardX, cardY + (1 - enterEase) * 28);
      ctx.globalAlpha = enterEase;

      // Glassmorphic Device Card Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Card Header Controls
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(24, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(40, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(56, 24, 5, 0, Math.PI * 2); ctx.fill();

      ctx.font = '500 12px Inter, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('anyconverter-pipeline.engine.js', 76, 28);

      const innerY = 56;
      const innerW = cardW - 32;
      const innerH = cardH - 72;

      if (this.purpose === 'hook') {
        this._renderChaosDataStream(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'problem') {
        this._renderBottleneckVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'solution') {
        this._renderPipelineVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'benefit') {
        this._renderMetricsBenefitVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else {
        this._renderPayoffVisual(ctx, progress, 16, innerY, innerW, innerH);
      }

      ctx.restore();
    }

    _renderChaosDataStream(ctx, progress, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const items = [
        { label: 'CSV [48.2 MB raw table]', status: 'UNPARSED', color: '#f59e0b', y: 16 },
        { label: 'JSON { "corrupt_utf8": true }', status: 'MALFORMED', color: '#ef4444', y: 64 },
        { label: 'PDF Document (256 pages)', status: 'UNINDEXED', color: '#ec4899', y: 112 },
        { label: 'YAML Configuration drift', status: 'DRIFTING', color: '#f59e0b', y: 160 },
        { label: 'SQL Dump [812,000 records]', status: 'RAW STREAM', color: '#38bdf8', y: 208 }
      ];

      items.forEach((item, idx) => {
        const drift = Math.sin(progress * Math.PI * 3 + idx) * 6;
        const rowY = y + item.y + drift;

        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(x + 10, rowY, w - 20, 38, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '500 13px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(item.label, x + 24, rowY + 24);

        // Status badge
        ctx.font = '700 11px Inter, sans-serif';
        const stW = ctx.measureText(item.status).width + 12;
        ctx.fillStyle = item.color;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x + w - stW - 24, rowY + 9, stW, 20);
        ctx.globalAlpha = 1.0;
        ctx.fillText(item.status, x + w - stW - 18, rowY + 23);
      });

      ctx.restore();
    }

    _renderBottleneckVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.09)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 16, y + 16, w - 32, h - 32, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 17px Inter, sans-serif';
      ctx.fillStyle = '#f87171';
      ctx.fillText('CRITICAL LATENCY BOTTLENECK', x + 36, y + 54);

      ctx.font = '400 13px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Cloud Remote Queue: 4,821 pending tasks', x + 36, y + 88);
      ctx.fillText('Third-Party Endpoint: 504 Gateway Timeout', x + 36, y + 118);
      ctx.fillText('Data Privacy Exposure: High (Cloud upload)', x + 36, y + 148);

      // Warning pulse strip
      ctx.fillStyle = `rgba(239, 68, 68, ${0.35 + pulse * 0.45})`;
      ctx.fillRect(x + 36, y + 185, (w - 72) * (0.5 + pulse * 0.2), 8);

      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('PROCESSING HALTED BY SERVER LIMITS', x + 36, y + 220);

      ctx.restore();
    }

    _renderPipelineVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      const steps = [
        { label: 'Client In-Memory Stream', icon: '📥', desc: 'Zero network payload' },
        { label: 'WebCodecs & WASM Pipeline', icon: '⚡', desc: 'Hardware-accelerated' },
        { label: 'Verified Output File', icon: '✅', desc: 'Deterministic 0-drop clock' }
      ];

      const stepH = (h - 52) / 3;
      steps.forEach((st, idx) => {
        const sy = y + 12 + idx * (stepH + 8);
        const active = progress >= idx * 0.28;

        ctx.fillStyle = active ? 'rgba(56, 189, 248, 0.14)' : 'rgba(30, 41, 59, 0.4)';
        ctx.strokeStyle = active ? this.accentColor : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = active ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(x + 16, sy, w - 32, stepH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '22px Inter';
        ctx.fillText(st.icon, x + 30, sy + stepH / 2 + 8);

        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillStyle = active ? '#ffffff' : '#64748b';
        ctx.fillText(st.label, x + 66, sy + 26);

        ctx.font = '400 12px monospace';
        ctx.fillStyle = active ? '#38bdf8' : '#475569';
        ctx.fillText(st.desc, x + 66, sy + 48);
      });
      ctx.restore();
    }

    _renderMetricsBenefitVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      const metricEase = ReferenceShot.easeOutCubic(progress);

      // Metric 1: Deterministic Engine
      ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.beginPath();
      ctx.roundRect(x + 16, y + 16, (w - 44) / 2, 85, 8);
      ctx.fill();

      ctx.font = '700 26px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('100% Local', x + 30, y + 54);
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Zero Cloud Upload', x + 30, y + 78);

      // Metric 2: Dropped Frames
      ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.beginPath();
      ctx.roundRect(x + (w - 44) / 2 + 28, y + 16, (w - 44) / 2, 85, 8);
      ctx.fill();

      ctx.font = '700 26px Inter, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('0 Drop', x + (w - 44) / 2 + 42, y + 54);
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Exact Frame Clock', x + (w - 44) / 2 + 42, y + 78);

      // Line Chart: Rising Throughput
      const chartY = y + 120;
      const chartH = h - 140;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(x + 16, chartY, w - 32, chartH, 8);
      ctx.fill();

      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('IN-BROWSER THROUGHPUT CURVE', x + 30, chartY + 24);

      ctx.strokeStyle = this.accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      const points = [0.12, 0.28, 0.38, 0.65, 0.78, 0.96];
      points.forEach((pt, i) => {
        const px = x + 30 + (i / (points.length - 1)) * (w - 60);
        const py = chartY + chartH - 18 - pt * (chartH - 46) * metricEase;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    }

    _renderPayoffVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      const logoGrad = ctx.createLinearGradient(x + w / 2 - 45, y + 35, x + w / 2 + 45, y + 125);
      logoGrad.addColorStop(0, '#38bdf8');
      logoGrad.addColorStop(1, '#6366f1');
      ctx.fillStyle = logoGrad;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 68, 38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AC', x + w / 2, y + 76);

      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText('AnyConverter Studio', x + w / 2, y + 135);

      ctx.font = '400 13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('100% In-Browser Video, Graphic & PDF Suite', x + w / 2, y + 158);

      // Primary CTA Button
      const btnW = 190;
      const btnH = 42;
      const btnX = x + w / 2 - btnW / 2;
      const btnY = y + 185;

      ctx.fillStyle = this.accentColor;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 21);
      ctx.fill();

      ctx.fillStyle = '#090d16';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('START CREATING FREE', x + w / 2, btnY + 26);

      ctx.textAlign = 'left';
      ctx.restore();
    }

    // =========================================================================
    // 2. CHARACTER COMEDY ART DIRECTION (The Manager Parrot)
    // =========================================================================
    _renderCharacterComedy(ctx, progress, width, height) {
      // Warm modern office studio backdrop
      const bgGrad = ctx.createRadialGradient(width * 0.45, height * 0.48, 60, width * 0.45, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#2e1065');
      bgGrad.addColorStop(0.55, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f0e1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Studio key light beam
      const spotGrad = ctx.createLinearGradient(width * 0.15, 0, width * 0.45, height * 0.72);
      spotGrad.addColorStop(0, 'rgba(250, 204, 21, 0.12)');
      spotGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.10, 0);
      ctx.lineTo(width * 0.35, 0);
      ctx.lineTo(width * 0.65, height * 0.72);
      ctx.lineTo(width * 0.10, height * 0.72);
      ctx.fill();

      // Polished Executive Desk
      const deskY = height * 0.70;
      ctx.fillStyle = '#1e1b38';
      ctx.fillRect(0, deskY, width, height - deskY);

      // Mahogany desk surface trim
      const trimGrad = ctx.createLinearGradient(0, deskY, width, deskY);
      trimGrad.addColorStop(0, '#f59e0b');
      trimGrad.addColorStop(0.5, '#fbbf24');
      trimGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = trimGrad;
      ctx.fillRect(0, deskY, width, 5);

      // Desk drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, deskY + 5, width, 14);

      // Staging: Render Character prominent (scale 1.45x)
      const pose = this.customData.characterPose || (progress < 0.28 ? 'neutral' : (progress < 0.68 ? 'wing-point' : 'smug'));
      this._drawParrotCharacter(ctx, progress, width * 0.35, height * 0.45, pose);

      // Office Props (Mic, Agenda, CEO Nameplate, Coffee Mug)
      this._drawParrotProps(ctx, progress, width, height);

      // Dialogue Speech Bubble
      this._renderComicSpeechBubble(ctx, progress, width, height);
    }

    _drawParrotCharacter(ctx, progress, cx, cy, pose) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1.45, 1.45); // Enlarge for commanding screen presence

      // Character breathing & comedic bobbing
      const bob = Math.sin(progress * Math.PI * 8) * 4.5;
      ctx.translate(0, bob);

      // Tail feathers
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-52, 62);
      ctx.lineTo(-100, 120);
      ctx.lineTo(-42, 92);
      ctx.fill();

      // Body (Vibrant Emerald Green)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(0, 30, 60, 80, 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Belly (Warm Golden Yellow)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(16, 38, 34, 52, 0.04, 0, Math.PI * 2);
      ctx.fill();

      // Wing Gestures
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      if (pose === 'wing-point') {
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(88, -8, 115, -20);
        ctx.quadraticCurveTo(88, 40, 20, 52);
      } else if (pose === 'shocked') {
        ctx.moveTo(-22, 10);
        ctx.quadraticCurveTo(-70, -38, -60, -60);
        ctx.quadraticCurveTo(0, -32, 0, 32);
      } else {
        ctx.ellipse(-14, 34, 34, 54, -0.28, 0, Math.PI * 2);
      }
      ctx.fill();

      // Head
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(16, -46, 45, 0, Math.PI * 2);
      ctx.fill();

      // Animated Crest Feathers
      const crestBounce = Math.sin(progress * Math.PI * 12) * 3;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(12, -88 + crestBounce);
      ctx.quadraticCurveTo(36, -125 + crestBounce, 50, -108 + crestBounce);
      ctx.quadraticCurveTo(34, -84 + crestBounce, 28, -80 + crestBounce);
      ctx.fill();

      // White Sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(34, -52, 14, 0, Math.PI * 2);
      ctx.fill();

      // Natural Eye Blinking cycle (~every 2 seconds)
      const blinkCycle = (progress * 9) % 2.2;
      const isBlinking = blinkCycle > 2.08;

      if (!isBlinking) {
        // Expressive Iris & Pupil
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        const pupilX = pose === 'shocked' ? 32 : 36;
        const pupilSize = pose === 'shocked' ? 4 : 7;
        ctx.arc(pupilX, -52, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        // Eye catchlight reflection
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pupilX + 2, -55, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Closed eyelid
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(22, -52);
        ctx.quadraticCurveTo(34, -46, 46, -52);
        ctx.stroke();
      }

      // Curved Beak with animated speech opening
      const speechOpen = (Math.sin(progress * Math.PI * 18) > 0.3) ? 5 : 0;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(50, -56);
      ctx.quadraticCurveTo(94, -50, 84, -22 + speechOpen);
      ctx.quadraticCurveTo(60, -32 + speechOpen, 48, -32 + speechOpen);
      ctx.fill();

      // Lower Beak
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(50, -32);
      ctx.lineTo(76, -22 + speechOpen);
      ctx.lineTo(52, -18 + speechOpen);
      ctx.fill();

      // Red Executive Necktie
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(18, -12);
      ctx.lineTo(28, -12);
      ctx.lineTo(34, 28);
      ctx.lineTo(23, 40);
      ctx.lineTo(12, 28);
      ctx.fill();

      ctx.restore();
    }

    _drawParrotProps(ctx, progress, width, height) {
      ctx.save();
      const micX = width * 0.16;
      const micY = height * 0.66;

      // Chrome vintage desk mic with stand
      ctx.fillStyle = '#64748b';
      ctx.fillRect(micX - 5, micY, 10, 55);
      ctx.beginPath(); ctx.ellipse(micX, micY + 55, 30, 8, 0, 0, Math.PI * 2); ctx.fill();

      // Metallic Mic Capsule
      const micGrad = ctx.createLinearGradient(micX - 20, micY - 55, micX + 20, micY);
      micGrad.addColorStop(0, '#f8fafc');
      micGrad.addColorStop(0.5, '#94a3b8');
      micGrad.addColorStop(1, '#475569');
      ctx.fillStyle = micGrad;
      ctx.beginPath();
      ctx.roundRect(micX - 20, micY - 55, 40, 55, 16);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mic audio live indicator LED
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(micX, micY - 44, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Executive Acrylic Desk Nameplate
      const npX = width * 0.26;
      const npY = height * 0.72;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.beginPath();
      ctx.roundRect(npX, npY, 210, 36, 6);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('MR. CRACKERS', npX + 14, npY + 18);
      ctx.font = '500 10px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('INTERIM CHIEF EXECUTIVE', npX + 14, npY + 30);

      // Steaming Coffee Mug
      const mugX = width * 0.50;
      const mugY = height * 0.69;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(mugX, mugY, 32, 40, 4);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(mugX + 32, mugY + 20, 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Meeting Agenda Whiteboard Card
      const cardX = width * 0.58;
      const cardY = height * 0.28;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, 330, 260, 12);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '700 16px Inter, sans-serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText('OFFICE ALL-HANDS AGENDA', cardX + 24, cardY + 36);

      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('❌ 9:00 AM — Status Meeting', cardX + 24, cardY + 74);
      ctx.fillText('❌ 10:30 AM — Sync about Sync', cardX + 24, cardY + 112);
      ctx.fillText('❌ 2:00 PM — Pre-Meeting Prep', cardX + 24, cardY + 150);
      ctx.fillStyle = '#16a34a';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText('✅ NO MORE MEETINGS', cardX + 24, cardY + 195);

      ctx.restore();
    }

    _renderComicSpeechBubble(ctx, progress, width, height) {
      const bubbleX = width * 0.44;
      const bubbleY = height * 0.12;
      const enter = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.2));

      ctx.save();
      ctx.translate(bubbleX, bubbleY + (1 - enter) * 16);
      ctx.globalAlpha = enter;

      const text = this.headline || 'I am the new manager.';
      ctx.font = '700 32px "Bricolage Grotesque", Inter, sans-serif';
      const textMetrics = ctx.measureText(text);
      const bw = Math.max(360, textMetrics.width + 48);
      const bh = 82;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, bw, bh, 20);
      ctx.moveTo(32, bh);
      ctx.lineTo(-14, bh + 26);
      ctx.lineTo(54, bh);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 24, bh / 2 - 2);

      if (this.subhead) {
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(this.subhead, 24, bh + 32);
      }

      ctx.restore();
    }

    // =========================================================================
    // 3. MINIMAL SUSPENSE ART DIRECTION (Vector Noir)
    // =========================================================================
    _renderMinimalSuspense(ctx, progress, width, height) {
      // Enhanced atmospheric deep background with subtle blue-gray rim
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0d14');
      bgGrad.addColorStop(0.5, '#07090f');
      bgGrad.addColorStop(1, '#030407');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const vanishingX = width * 0.5;
      const vanishingY = height * 0.40;

      // Volumetric Overhead Industrial Lamp Spotlight
      const lampGrad = ctx.createRadialGradient(vanishingX, vanishingY - 60, 20, vanishingX, vanishingY + 120, 420);
      lampGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      lampGrad.addColorStop(0.4, 'rgba(239, 68, 68, 0.14)');
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 80, vanishingY - 80);
      ctx.lineTo(vanishingX + 80, vanishingY - 80);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Perspective Corridor Architectural Orthogonals
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(0, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.stroke();

      // Wet Floor Tiles Reflections
      for (let f = 1; f <= 5; f++) {
        const fy = vanishingY + (height - vanishingY) * (f / 5.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + f * 0.03})`;
        ctx.beginPath();
        ctx.moveTo(vanishingX - (vanishingX * f) / 5.5, fy);
        ctx.lineTo(vanishingX + ((width - vanishingX) * f) / 5.5, fy);
        ctx.stroke();
      }

      // Electrical Flicker Dynamics
      const flicker = Math.sin(progress * 45) + Math.cos(progress * 85);
      const isFlickerDip = progress > 0.40 && progress < 0.48 && flicker > 0.15;
      const bulbAlpha = isFlickerDip ? 0.08 : (0.45 + 0.25 * Math.sin(progress * Math.PI * 4));

      // Light fixture at ceiling
      ctx.fillStyle = '#475569';
      ctx.fillRect(vanishingX - 22, vanishingY - 95, 44, 18);
      ctx.fillStyle = `rgba(254, 240, 138, ${bulbAlpha * 1.5})`;
      ctx.beginPath();
      ctx.arc(vanishingX, vanishingY - 76, 12, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Suspended Dust Motes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let m = 0; m < 16; m++) {
        const mx = (vanishingX - 120) + ((m * 37 + progress * 60) % 240);
        const my = (vanishingY - 50) + ((m * 29 + progress * 40) % 220);
        ctx.fillRect(mx, my, 2, 2);
      }

      // Mystery Trenchcoat Figure Silhouette (Approaches the camera)
      const figDist = 1 - Math.min(1, progress * 0.90);
      const figH = 110 + (1 - figDist) * 140;
      const figW = figH * 0.38;
      const figX = vanishingX - figW / 2;
      const figY = vanishingY + 15 + (1 - figDist) * 110;

      // Forward cast shadow on wet floor
      ctx.beginPath();
      ctx.ellipse(figX + figW / 2, figY + figH, figW * 1.6, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fill();

      // Trenchcoat & Fedora Silhouette with Rim Lighting
      ctx.save();
      // Red Rim Highlight
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
      ctx.lineWidth = 2.5;

      // Hat
      ctx.fillStyle = '#06080d';
      ctx.beginPath();
      ctx.ellipse(figX + figW / 2, figY + 12, figW * 0.65, 8, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(figX + figW / 2, figY + 22, 16, 0, Math.PI * 2);
      ctx.fill();

      // Coat Body
      ctx.beginPath();
      ctx.moveTo(figX + 4, figY + 38);
      ctx.lineTo(figX + figW - 4, figY + 38);
      ctx.lineTo(figX + figW + 12, figY + figH);
      ctx.lineTo(figX - 12, figY + figH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Cyan Cigarette / Terminal Ember
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(figX + figW * 0.58, figY + 32, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Cinematic Letterbox Bars
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, 56);
      ctx.fillRect(0, height - 56, width, 56);

      // High-Contrast Legible Subtitles
      ctx.save();
      ctx.font = '700 32px "Bricolage Grotesque", Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';

      const textAlpha = ReferenceShot.easeOutCubic(Math.min(1, progress * 2));
      ctx.globalAlpha = textAlpha;

      // Text stroke for absolute readability
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      const headlineText = (this.headline || 'THE LAST LIGHT').toUpperCase();
      ctx.strokeText(headlineText, width / 2, height - 80);
      ctx.fillText(headlineText, width / 2, height - 80);

      // Secondary narrative cue
      ctx.font = '600 14px Inter, monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText((this.subhead || 'Zero external signals. Ambient tone: 42dB.').toUpperCase(), width / 2, height - 24);

      ctx.restore();
    }

    _renderDiagnosticsOverlay(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(20, height - 70, 480, 50);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, height - 70, 480, 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`DIAGNOSTICS [MODE: DEBUG] | Shot: ${this.id} (${this.purpose})`, 30, height - 48);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Local Frame: ${localFrame}/${shotDuration} | Global: ${globalFrame}/${totalFrames} | ArtDirection: ${this.artDirection}`, 30, height - 30);
      ctx.restore();
    }

    _wrapText(ctx, text, maxWidth) {
      if (!text) return [];
      const words = String(text).split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReferenceShot };
  }
  if (typeof window !== 'undefined') {
    window.ReferenceShot = ReferenceShot;
  }
})();
