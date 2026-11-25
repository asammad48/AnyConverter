/**
 * AnyConverter Creative Studio — ReferenceShot Module
 * Encapsulates a purposeful cinematic shot with composition rules,
 * typography hierarchy, visual propositions, camera choreography, and diagnostic toggles.
 */

(function () {
  'use strict';

  class ReferenceShot {
    constructor(config = {}) {
      this.id = config.id || `shot-${Date.now()}`;
      this.purpose = config.purpose || 'hook'; // hook, problem, solution, benefit, payoff
      this.title = config.title || 'Shot Title';
      this.startFrame = config.startFrame || 0;
      this.durationFrames = config.durationFrames || 90; // default 3s @ 30fps
      this.headline = config.headline || 'Impact Headline';
      this.subhead = config.subhead || 'Supporting visual and contextual narrative.';
      this.badge = config.badge || 'PROMO';
      this.accentColor = config.accentColor || '#38bdf8';
      this.secondaryColor = config.secondaryColor || '#6366f1';
      this.backgroundColor = config.backgroundColor || '#090d16';
      this.artDirection = config.artDirection || 'cinematic-saas';
      this.cameraMove = config.cameraMove || 'none'; // push-in, pull-out, pan-right, none
      this.customData = config.customData || {};
    }

    /**
     * Easing helper: cubic bezier easeInOut and easeOut
     */
    static easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    static easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    static clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    /**
     * Render the shot onto a 2D canvas context
     */
    render(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height, options = {}) {
      const mode = options.mode || 'production';
      const progress = ReferenceShot.clamp(localFrame / (shotDuration || 1), 0, 1);
      const easedProgress = ReferenceShot.easeOutCubic(progress);

      ctx.save();

      // 1. Apply Camera Move
      this._applyCamera(ctx, progress, width, height);

      // 2. Render Art-Direction Specific Scene
      if (this.artDirection === 'character-comedy') {
        this._renderCharacterComedy(ctx, progress, width, height);
      } else if (this.artDirection === 'minimal-suspense') {
        this._renderMinimalSuspense(ctx, progress, width, height);
      } else {
        // Default: Cinematic SaaS
        this._renderCinematicSaaS(ctx, progress, width, height);
      }

      ctx.restore();

      // 3. Diagnostics Overlay (STRICTLY editor-only, never in production)
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
        zoom = 1.0 + progress * 0.08; // subtle 8% push-in
      } else if (this.cameraMove === 'pull-out') {
        zoom = 1.08 - progress * 0.08;
      } else if (this.cameraMove === 'pan-right') {
        panX = (progress - 0.5) * 30;
      } else if (this.cameraMove === 'whip-in') {
        const ease = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.5));
        zoom = 0.92 + ease * 0.08;
        panY = (1 - ease) * 20;
      }

      ctx.scale(zoom, zoom);
      ctx.translate(-cx + panX, -cy + panY);
    }

    // =========================================================================
    // 1. CINEMATIC SAAS ART DIRECTION
    // =========================================================================
    _renderCinematicSaaS(ctx, progress, width, height) {
      // Background: Deep obsidian to rich slate radial gradient
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.6, '#090d16');
      bgGrad.addColorStop(1, '#030712');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 48;
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

      // Ambient accent glow behind central content
      const glowGrad = ctx.createRadialGradient(width * 0.65, height * 0.45, 10, width * 0.65, height * 0.45, 360);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Left Column: Editorial Typography
      this._renderSaaSTypography(ctx, progress, width, height);

      // Right Column: Visual Proposition / Dynamic Graphic Motif
      this._renderSaaSGraphicMotif(ctx, progress, width, height);
    }

    _renderSaaSTypography(ctx, progress, width, height) {
      const leftMargin = 96;
      const contentY = height * 0.32;
      const enterEase = ReferenceShot.easeOutCubic(Math.min(1, progress * 3));

      ctx.save();
      ctx.translate(leftMargin, contentY + (1 - enterEase) * 24);
      ctx.globalAlpha = ReferenceShot.clamp(enterEase, 0, 1);

      // Topic Badge
      const badgeText = (this.badge || 'ANYCONVERTER').toUpperCase();
      ctx.font = '600 13px Inter, -apple-system, sans-serif';
      const badgeW = ctx.measureText(badgeText).width + 24;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0, 0, badgeW, 26, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.accentColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, 12, 13);

      // Main Headline
      ctx.font = '700 52px "Bricolage Grotesque", Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'top';

      const headlineLines = this._wrapText(ctx, this.headline, 560);
      let textY = 44;
      for (const line of headlineLines) {
        ctx.fillText(line, 0, textY);
        textY += 62;
      }

      // Supporting Subhead
      ctx.font = '400 20px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      const subheadLines = this._wrapText(ctx, this.subhead, 520);
      textY += 12;
      for (const line of subheadLines) {
        ctx.fillText(line, 0, textY);
        textY += 30;
      }

      // Accent flourish bar
      ctx.fillStyle = this.accentColor;
      ctx.fillRect(0, textY + 16, 64 * enterEase, 3);

      ctx.restore();
    }

    _renderSaaSGraphicMotif(ctx, progress, width, height) {
      const cardX = width * 0.54;
      const cardY = height * 0.22;
      const cardW = width * 0.38;
      const cardH = height * 0.56;

      const enterEase = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.5));

      ctx.save();
      ctx.translate(cardX, cardY + (1 - enterEase) * 36);
      ctx.globalAlpha = enterEase;

      // Glassmorphic Device Card Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Card Header Window Controls
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(24, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(40, 24, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(56, 24, 5, 0, Math.PI * 2); ctx.fill();

      ctx.font = '500 12px Inter, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('anyconverter-pipeline.worker.js', 76, 28);

      // Card Content Based on Shot Purpose
      const innerY = 56;
      const innerW = cardW - 32;
      const innerH = cardH - 72;

      if (this.purpose === 'hook') {
        // Raw Data Deluge: Chaos visual with floating JSON/CSV chunks
        this._renderChaosDataStream(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'problem') {
        // Analysis Paralysis / Bottleneck visual
        this._renderBottleneckVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'solution') {
        // Pipeline Architecture Transformation
        this._renderPipelineVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else if (this.purpose === 'benefit') {
        // Speed & Precision KPI Card
        this._renderMetricsBenefitVisual(ctx, progress, 16, innerY, innerW, innerH);
      } else {
        // Payoff & CTA Card
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
        { label: 'CSV [48.2 MB]', status: 'UNPARSED', color: '#f59e0b', y: 20 },
        { label: 'JSON { "corrupt_utf8": true }', status: 'MALFORMED', color: '#ef4444', y: 70 },
        { label: 'PDF Table (256 pages)', status: 'LOCKED', color: '#ec4899', y: 120 },
        { label: 'YAML config drift', status: 'INCONSISTENT', color: '#f59e0b', y: 170 },
        { label: 'SQL Dump [812,000 rows]', status: 'OVERFLOW', color: '#ef4444', y: 220 }
      ];

      items.forEach((item, idx) => {
        const drift = Math.sin(progress * Math.PI * 3 + idx) * 8;
        const rowY = y + item.y + drift;

        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(x + 10, rowY, w - 20, 38, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '500 13px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(item.label, x + 24, rowY + 24);

        // Status badge
        ctx.fillStyle = item.color;
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
      // Hourglass / Slow server latency graphic
      const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 20, y + 20, w - 40, h - 40, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillStyle = '#f87171';
      ctx.fillText('CRITICAL LATENCY DETECTED', x + 40, y + 60);

      ctx.font = '400 14px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Cloud Queue: 4,821 requests waiting', x + 40, y + 95);
      ctx.fillText('Third-Party Server: 504 Gateway Timeout', x + 40, y + 125);
      ctx.fillText('API Token Cost: $0.12 / conversion', x + 40, y + 155);

      // Warning pulse strip
      ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.4})`;
      ctx.fillRect(x + 40, y + 190, (w - 80) * (0.4 + pulse * 0.2), 8);

      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('CONVERSION STALLED', x + 40, y + 225);

      ctx.restore();
    }

    _renderPipelineVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      // Flow diagram from Raw Input -> Browser Worker -> Structured Output
      const steps = [
        { label: 'Raw Stream', icon: '📥', color: '#94a3b8' },
        { label: 'WebCodecs / WASM', icon: '⚡', color: '#38bdf8' },
        { label: 'Verified Output', icon: '✅', color: '#10b981' }
      ];

      const stepH = (h - 60) / 3;
      steps.forEach((st, idx) => {
        const sy = y + 15 + idx * (stepH + 8);
        const active = progress >= idx * 0.3;

        ctx.fillStyle = active ? 'rgba(56, 189, 248, 0.12)' : 'rgba(30, 41, 59, 0.4)';
        ctx.strokeStyle = active ? this.accentColor : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = active ? 1.5 : 1;
        ctx.beginPath();
        ctx.roundRect(x + 20, sy, w - 40, stepH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '20px Inter';
        ctx.fillText(st.icon, x + 35, sy + stepH / 2 + 7);

        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillStyle = active ? '#ffffff' : '#64748b';
        ctx.fillText(st.label, x + 70, sy + stepH / 2 + 6);

        if (active) {
          ctx.fillStyle = '#10b981';
          ctx.font = '500 12px monospace';
          ctx.fillText('PROCESSED (0ms)', x + w - 160, sy + stepH / 2 + 5);
        }
      });
      ctx.restore();
    }

    _renderMetricsBenefitVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      // Metrics Dashboard Card
      const metricEase = ReferenceShot.easeOutCubic(progress);

      // Metric 1: Speedup
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.beginPath();
      ctx.roundRect(x + 20, y + 20, (w - 50) / 2, 90, 8);
      ctx.fill();

      ctx.font = '700 28px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      const speedVal = Math.round(metricEase * 42);
      ctx.fillText(`${speedVal}ms`, x + 36, y + 62);
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Latency in Browser', x + 36, y + 85);

      // Metric 2: Dropped Frames / Drift
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.beginPath();
      ctx.roundRect(x + (w - 50) / 2 + 30, y + 20, (w - 50) / 2, 90, 8);
      ctx.fill();

      ctx.font = '700 28px Inter, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('0 Drop', x + (w - 50) / 2 + 46, y + 62);
      ctx.font = '500 12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Deterministic Drift', x + (w - 50) / 2 + 46, y + 85);

      // Line Chart: Rising Throughput
      const chartY = y + 130;
      const chartH = h - 150;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(x + 20, chartY, w - 40, chartH);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const points = [0.1, 0.25, 0.35, 0.6, 0.72, 0.95];
      points.forEach((pt, i) => {
        const px = x + 30 + (i / (points.length - 1)) * (w - 60);
        const py = chartY + chartH - 15 - pt * (chartH - 30) * metricEase;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    }

    _renderPayoffVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      // CTA & Brand Emblem
      const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);

      const logoGrad = ctx.createLinearGradient(x + w / 2 - 40, y + 40, x + w / 2 + 40, y + 120);
      logoGrad.addColorStop(0, '#38bdf8');
      logoGrad.addColorStop(1, '#6366f1');
      ctx.fillStyle = logoGrad;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 70, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AC', x + w / 2, y + 78);

      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText('AnyConverter Studio', x + w / 2, y + 135);

      ctx.font = '400 13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('100% Client-Side Production Suite', x + w / 2, y + 158);

      // Primary CTA Button
      const btnW = 180;
      const btnH = 40;
      const btnX = x + w / 2 - btnW / 2;
      const btnY = y + 185;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 20);
      ctx.fill();

      ctx.fillStyle = '#090d16';
      ctx.font = '700 14px Inter, sans-serif';
      ctx.fillText('START CREATING FREE', x + w / 2, btnY + 25);

      ctx.textAlign = 'left';
      ctx.restore();
    }

    // =========================================================================
    // 2. CHARACTER COMEDY ART DIRECTION (The Manager Parrot)
    // =========================================================================
    _renderCharacterComedy(ctx, progress, width, height) {
      // Warm office canvas background
      ctx.fillStyle = '#1e1b2e';
      ctx.fillRect(0, 0, width, height);

      // Warm ambient radial glow
      const glow = ctx.createRadialGradient(width * 0.45, height * 0.5, 40, width * 0.45, height * 0.5, width * 0.7);
      glow.addColorStop(0, '#2e1065');
      glow.addColorStop(0.7, '#1e1b2e');
      glow.addColorStop(1, '#0f0e17');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Clean desk horizon line
      ctx.fillStyle = '#2d2a45';
      ctx.fillRect(0, height * 0.75, width, height * 0.25);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, height * 0.75, width, 4);

      // Render Comic Character: The Manager Parrot
      const pose = this.customData.characterPose || (progress < 0.3 ? 'neutral' : (progress < 0.7 ? 'wing-point' : 'smug'));
      this._drawParrotCharacter(ctx, progress, width * 0.35, height * 0.48, pose);

      // Props (Microphone or Big To-Do Calendar)
      this._drawParrotProps(ctx, progress, width, height);

      // Bold Punchy Captions / Dialogue Bubble
      this._renderComicSpeechBubble(ctx, progress, width, height);
    }

    _drawParrotCharacter(ctx, progress, cx, cy, pose) {
      ctx.save();
      ctx.translate(cx, cy);

      const bob = Math.sin(progress * Math.PI * 6) * 6;
      ctx.translate(0, bob);

      // Tail feathers (Navy / Teal)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-50, 60);
      ctx.lineTo(-90, 110);
      ctx.lineTo(-40, 90);
      ctx.fill();

      // Body (Emerald Green)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(0, 30, 55, 75, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Belly patch (Bright Lime / Yellow)
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(15, 40, 30, 48, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      if (pose === 'wing-point') {
        // Pointing wing forward towards the to-do list
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(80, 0, 100, -10);
        ctx.quadraticCurveTo(80, 40, 20, 50);
      } else if (pose === 'shocked') {
        // Wings raised in surprise
        ctx.moveTo(-20, 10);
        ctx.quadraticCurveTo(-60, -30, -50, -50);
        ctx.quadraticCurveTo(0, -30, 0, 30);
      } else {
        // Resting folded wing
        ctx.ellipse(-15, 35, 30, 50, -0.3, 0, Math.PI * 2);
      }
      ctx.fill();

      // Head (Teal)
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(15, -45, 42, 0, Math.PI * 2);
      ctx.fill();

      // Crest Feathers (Red / Orange)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(10, -85);
      ctx.quadraticCurveTo(30, -115, 45, -100);
      ctx.quadraticCurveTo(30, -80, 25, -75);
      ctx.fill();

      // Eye White & Pupil
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(32, -50, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      const pupilX = pose === 'shocked' ? 32 : 36;
      const pupilSize = pose === 'shocked' ? 4 : 6;
      ctx.arc(pupilX, -50, pupilSize, 0, Math.PI * 2);
      ctx.fill();

      // Beak (Curved Golden-Orange)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(48, -55);
      ctx.quadraticCurveTo(85, -50, 75, -25);
      ctx.quadraticCurveTo(55, -35, 45, -35);
      ctx.fill();

      // Manager Tie (Humorous prop: little red necktie!)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(18, -10);
      ctx.lineTo(26, -10);
      ctx.lineTo(32, 25);
      ctx.lineTo(22, 35);
      ctx.lineTo(12, 25);
      ctx.fill();

      ctx.restore();
    }

    _drawParrotProps(ctx, progress, width, height) {
      // Giant Desk Microphone or Calendar prop
      ctx.save();
      const micX = width * 0.20;
      const micY = height * 0.70;

      // Chrome vintage studio mic
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(micX - 4, micY, 8, 45); // stand
      ctx.beginPath(); ctx.ellipse(micX, micY + 45, 24, 6, 0, 0, Math.PI * 2); ctx.fill(); // base

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.roundRect(micX - 16, micY - 45, 32, 45, 12);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Office To-Do Checklist Card on desk
      const cardX = width * 0.58;
      const cardY = height * 0.38;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, 260, 200, 8);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '700 16px Inter, sans-serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText('OFFICE AGENDA', cardX + 24, cardY + 36);

      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('❌ 9:00 AM — Status Meeting', cardX + 24, cardY + 70);
      ctx.fillText('❌ 10:30 AM — Sync about Sync', cardX + 24, cardY + 105);
      ctx.fillText('❌ 2:00 PM — Pre-Meeting Prep', cardX + 24, cardY + 140);
      ctx.fillStyle = '#16a34a';
      ctx.fillText('✅ NO MORE MEETINGS', cardX + 24, cardY + 175);

      ctx.restore();
    }

    _renderComicSpeechBubble(ctx, progress, width, height) {
      const bubbleX = width * 0.44;
      const bubbleY = height * 0.15;
      const enter = ReferenceShot.easeOutCubic(Math.min(1, progress * 2.5));

      ctx.save();
      ctx.translate(bubbleX, bubbleY + (1 - enter) * 20);
      ctx.globalAlpha = enter;

      const text = this.headline || 'I am the new manager.';
      ctx.font = '700 32px "Bricolage Grotesque", Inter, sans-serif';
      const textMetrics = ctx.measureText(text);
      const bw = Math.max(340, textMetrics.width + 48);
      const bh = 80;

      // Comic Speech Bubble
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(0, 0, bw, bh, 20);
      // Tail pointing to parrot
      ctx.moveTo(30, bh);
      ctx.lineTo(-15, bh + 25);
      ctx.lineTo(50, bh);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 24, bh / 2 - 2);

      // Sub-caption tag
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
      // Obsidian black background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Perspective Corridor lines
      const vanishingX = width * 0.5;
      const vanishingY = height * 0.42;

      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 2;

      // 4 Perspective diagonals
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(0, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.stroke();

      // Dynamic light flicker simulation
      const flickerSeed = Math.sin(progress * 45) + Math.cos(progress * 82);
      const isFlickerOff = progress > 0.4 && progress < 0.48 && flickerSeed > 0.3;
      const lightAlpha = isFlickerOff ? 0.05 : (0.25 + 0.15 * Math.sin(progress * Math.PI * 6));

      // Wall light source cone
      const lightGrad = ctx.createRadialGradient(vanishingX, vanishingY - 30, 5, vanishingX, vanishingY, 260);
      lightGrad.addColorStop(0, `rgba(255, 255, 255, ${lightAlpha * 1.5})`);
      lightGrad.addColorStop(0.5, `rgba(239, 68, 68, ${lightAlpha * 0.6})`);
      lightGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(vanishingX, vanishingY, 260, 0, Math.PI * 2);
      ctx.fill();

      // Distant mysterious silhouette figure
      const figDist = 1 - Math.min(1, progress * 0.8);
      const figH = 90 + (1 - figDist) * 110;
      const figW = figH * 0.35;
      const figX = vanishingX - figW / 2 + (Math.sin(progress * Math.PI * 2) * 20);
      const figY = vanishingY + 30 + (1 - figDist) * 80;

      ctx.fillStyle = '#0a0a0a';
      ctx.strokeStyle = '#171717';
      ctx.lineWidth = 1;
      // Shadow cast
      ctx.beginPath();
      ctx.ellipse(figX + figW / 2, figY + figH, figW * 1.2, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fill();

      // Figure body & head
      ctx.fillStyle = '#0f0f0f';
      ctx.beginPath();
      ctx.arc(figX + figW / 2, figY + 16, 12, 0, Math.PI * 2); // Head
      ctx.rect(figX + 2, figY + 28, figW - 4, figH - 28); // Coat
      ctx.fill();

      // Cinematic Letterbox Bars
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, 54);
      ctx.fillRect(0, height - 54, width, 54);

      // Tense, crisp minimal typography
      ctx.save();
      ctx.font = '300 28px Inter, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillStyle = '#e5e5e5';
      ctx.textAlign = 'center';

      const textAlpha = ReferenceShot.easeOutCubic(Math.min(1, progress * 2));
      ctx.globalAlpha = textAlpha;
      ctx.fillText((this.headline || 'THE LAST LIGHT').toUpperCase(), width / 2, height - 80);

      ctx.font = '400 13px Inter, monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText((this.subhead || 'Zero external signals. Room tone: 42dB.').toUpperCase(), width / 2, height - 24);

      ctx.restore();
    }

    // =========================================================================
    // 4. DIAGNOSTICS OVERLAY (EDITOR-ONLY)
    // =========================================================================
    _renderDiagnosticsOverlay(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
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
