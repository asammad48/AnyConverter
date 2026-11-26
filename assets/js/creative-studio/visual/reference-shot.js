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
      this.motif = config.motif || 'default'; // default, data-chaos, latency-bottleneck, wasm-pipeline, metric-counter, branded-payoff, security-lock, encrypted-vault, shield-protection, unbranded-conclusion, placeholder
      this.motifTitle = config.motifTitle || '';
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
      this.directorNotes = config.directorNotes || '';
    }

    static getDefaultMotifForPurpose(purpose) {
      switch (purpose) {
        case 'hook': return 'data-chaos';
        case 'problem': return 'latency-bottleneck';
        case 'solution': return 'wasm-pipeline';
        case 'benefit': return 'metric-counter';
        case 'payoff': return 'branded-payoff';
        default: return 'data-chaos';
      }
    }

    static evaluateSuitability(shotOrHeadline = '', subhead = '', motif = 'default', purpose = 'hook') {
      let hl = '';
      let sh = '';
      let mot = motif;
      let purp = purpose;

      if (typeof shotOrHeadline === 'object' && shotOrHeadline !== null) {
        // Character comedy and minimal suspense have distinct art directions and are exempt from SaaS motif binding
        if (shotOrHeadline.artDirection && shotOrHeadline.artDirection !== 'cinematic-saas') {
          return {
            isSuitable: true,
            suitable: true,
            isPublishable: true,
            publishable: true,
            status: 'SUITABLE',
            warning: null,
            reason: null
          };
        }
        hl = shotOrHeadline.headline || '';
        sh = shotOrHeadline.subhead || '';
        mot = shotOrHeadline.motif || 'default';
        purp = shotOrHeadline.purpose || 'hook';
      } else {
        hl = shotOrHeadline || '';
        sh = subhead || '';
      }

      const text = `${hl} ${sh}`.toLowerCase();
      const effectiveMotif = (mot && mot !== 'default') ? mot : ReferenceShot.getDefaultMotifForPurpose(purp);

      const isSecurityTopic = /\b(password|passwords|vault|pbkdf2|ciphertext|encryption|credentials|breach|auth|decrypted|zero-knowledge|biometric|key\s*derivation)\b/i.test(text);
      const isSaaSTopic = /\b(data|file|files|convert|converter|stream|format|csv|json|wasm|latency|pipeline|metric|drop|throughput|roundtrip)\b/i.test(text);

      const isSecurityMotif = ['security-lock', 'encrypted-vault', 'shield-protection', 'unbranded-conclusion'].includes(effectiveMotif);
      const isSaaSMotif = ['data-chaos', 'latency-bottleneck', 'wasm-pipeline', 'metric-counter', 'branded-payoff'].includes(effectiveMotif);

      if (effectiveMotif === 'placeholder') {
        return {
          isSuitable: true,
          suitable: true,
          isPublishable: false,
          publishable: false,
          status: 'PLACEHOLDER_DRAFT',
          warning: 'Placeholder active: Video contains unillustrated storyboard placeholders and cannot be published as finished.',
          reason: 'Placeholder active: Video contains unillustrated storyboard placeholders and cannot be published as finished.'
        };
      }

      if (isSecurityTopic && isSaaSMotif) {
        const msg = `Concept Mismatch: Security narrative ("${(hl || '').slice(0, 28)}...") paired with SaaS data-processing visual (${effectiveMotif}). Select a security motif or placeholder.`;
        return {
          isSuitable: false,
          suitable: false,
          isPublishable: false,
          publishable: false,
          status: 'TEMPLATE_CONCEPT_MISMATCH',
          warning: msg,
          reason: msg
        };
      }

      if (isSaaSTopic && isSecurityMotif) {
        const msg = `Concept Mismatch: Data conversion narrative paired with security motif (${effectiveMotif}).`;
        return {
          isSuitable: false,
          suitable: false,
          isPublishable: false,
          publishable: false,
          status: 'TEMPLATE_CONCEPT_MISMATCH',
          warning: msg,
          reason: msg
        };
      }

      return {
        isSuitable: true,
        suitable: true,
        isPublishable: true,
        publishable: true,
        status: 'SUITABLE',
        warning: null,
        reason: null
      };
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

      // Determine effective visual motif
      const effectiveMotif = (this.motif && this.motif !== 'default')
        ? this.motif
        : ReferenceShot.getDefaultMotifForPurpose(this.purpose);

      let cardTitle = this.motifTitle;
      if (!cardTitle) {
        if (effectiveMotif === 'security-lock' || effectiveMotif === 'encrypted-vault') {
          cardTitle = 'cryptographic-vault.key.ts';
        } else if (effectiveMotif === 'shield-protection') {
          cardTitle = 'zero-knowledge-enclave.ts';
        } else if (effectiveMotif === 'unbranded-conclusion') {
          cardTitle = 'security-audit-report.md';
        } else if (effectiveMotif === 'placeholder') {
          cardTitle = 'unsupported-topic-placeholder.canvas';
        } else {
          cardTitle = 'anyconverter-pipeline.engine.js';
        }
      }

      ctx.font = '500 12px Inter, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(cardTitle, 76, 28);

      const innerY = 56;
      const innerW = cardW - 32;
      const innerH = cardH - 72;

      // Dispatch rendering based on effectiveMotif
      switch (effectiveMotif) {
        case 'data-chaos':
          this._renderChaosDataStream(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'latency-bottleneck':
          this._renderBottleneckVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'wasm-pipeline':
          this._renderPipelineVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'metric-counter':
          this._renderMetricsBenefitVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'branded-payoff':
          this._renderPayoffVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'security-lock':
          this._renderSecurityLockVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'encrypted-vault':
          this._renderEncryptedVaultVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'shield-protection':
          this._renderShieldProtectionVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'unbranded-conclusion':
          this._renderUnbrandedConclusionVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        case 'placeholder':
          this._renderPlaceholderVisual(ctx, progress, 16, innerY, innerW, innerH);
          break;
        default:
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
          break;
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

    _renderSecurityLockVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const centerX = x + w / 2;
      const centerY = y + h * 0.46;
      const lockEase = ReferenceShot.easeOutCubic(Math.min(1, progress * 1.5));

      // Animated Shackle
      const shackleDrop = (1 - lockEase) * 18;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 48 - shackleDrop, 38, Math.PI, 0, false);
      ctx.lineTo(centerX + 38, centerY - 14 - shackleDrop);
      ctx.moveTo(centerX - 38, centerY - 48 - shackleDrop);
      ctx.lineTo(centerX - 38, centerY - 14 - shackleDrop);
      ctx.stroke();

      // Padlock Body with subtle gradient
      const bodyW = 120;
      const bodyH = 96;
      const bodyX = centerX - bodyW / 2;
      const bodyY = centerY - 14;
      const lockGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
      lockGrad.addColorStop(0, '#1e293b');
      lockGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = lockGrad;
      ctx.strokeStyle = this.accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(bodyX, bodyY, bodyW, bodyH, 12);
      ctx.fill();
      ctx.stroke();

      // Keyhole
      ctx.fillStyle = this.accentColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 24, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX - 5, centerY + 28);
      ctx.lineTo(centerX + 5, centerY + 28);
      ctx.lineTo(centerX + 7, centerY + 52);
      ctx.lineTo(centerX - 7, centerY + 52);
      ctx.closePath();
      ctx.fill();

      // Hex tumbler rings
      const angle = progress * Math.PI * 2;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(centerX, centerY + 30, 68, angle, angle + Math.PI * 1.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cryptographic derivation status badge
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 20, y + h - 56, w - 40, 42, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 12px Inter, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('PBKDF2-HMAC-SHA256', x + 34, y + h - 34);
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('600,000 Key Iterations', x + 34, y + h - 18);

      ctx.restore();
    }

    _renderEncryptedVaultVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const ease = ReferenceShot.easeOutCubic(progress);

      // Top row: Plaintext input box (transient/sandboxed)
      const topY = y + 16;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 16, topY, w - 32, 44, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 11px Inter, monospace';
      ctx.fillStyle = '#f87171';
      ctx.fillText('PLAINTEXT MEMORY (EPHEMERAL RAM)', x + 28, topY + 18);
      ctx.font = '400 12px monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('"mypassword99!" -> [ZEROED IMMEDIATELY]', x + 28, topY + 34);

      // Middle: Encryption Funnel & AES-GCM Cipher Transform
      const midY = y + 74;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.strokeStyle = this.accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 36, midY, w - 72, 38, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ AES-256-GCM + RANDOM 96-BIT NONCE ⚡', x + w / 2, midY + 24);
      ctx.textAlign = 'left';

      // Bottom: Hardened Ciphertext Vault Safe
      const vaultY = y + 126;
      const vaultH = h - 142;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 16, vaultY, w - 32, vaultH, 10);
      ctx.fill();
      ctx.stroke();

      // Safe Door Dial & Spokes
      const dialX = x + 62;
      const dialY = vaultY + vaultH / 2;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(dialX, dialY, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(dialX, dialY, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Safe Hex Cipher Stream
      ctx.font = '500 11px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('CIPHERTEXT AT REST:', x + 104, dialY - 18);
      const hexSample = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const visibleChars = Math.floor(ease * 32);
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText(hexSample.substring(0, visibleChars), x + 104, dialY + 2);
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Decryption mathematically unfeasible without master key', x + 104, dialY + 22);

      ctx.restore();
    }

    _renderShieldProtectionVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const centerX = x + w / 2;
      const centerY = y + h * 0.42;
      const shieldEase = ReferenceShot.easeOutCubic(progress);

      // Heraldic Cyber Shield
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(shieldEase, shieldEase);

      const shieldGrad = ctx.createLinearGradient(0, -60, 0, 70);
      shieldGrad.addColorStop(0, '#0284c7');
      shieldGrad.addColorStop(0.6, '#0f172a');
      shieldGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = shieldGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.lineTo(60, -35);
      ctx.lineTo(52, 28);
      ctx.quadraticCurveTo(38, 68, 0, 85);
      ctx.quadraticCurveTo(-38, 68, -52, 28);
      ctx.lineTo(-60, -35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Biometric / Scan Grid inside Shield
      const scanY = -40 + Math.sin(progress * Math.PI * 4) * 50;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-40, scanY);
      ctx.lineTo(40, scanY);
      ctx.stroke();

      // Checkmark inside shield
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-18, 10);
      ctx.lineTo(-4, 24);
      ctx.lineTo(22, -6);
      ctx.stroke();

      ctx.restore();

      // Security Verification Metrics below shield
      const statY = y + h - 68;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x + 16, statY, w - 32, 54, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ ZERO-KNOWLEDGE ENCLAVE', x + 30, statY + 22);
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('All encryption occurs strictly within client RAM.', x + 30, statY + 40);

      ctx.restore();
    }

    _renderUnbrandedConclusionVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      const centerX = x + w / 2;

      // Neutral Trust Shield Emblem
      const emblemGrad = ctx.createLinearGradient(centerX - 40, y + 25, centerX + 40, y + 105);
      emblemGrad.addColorStop(0, '#10b981');
      emblemGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = emblemGrad;
      ctx.beginPath();
      ctx.arc(centerX, y + 65, 36, 0, Math.PI * 2);
      ctx.fill();

      // Shield / Lock Icon inside
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🛡️', centerX, y + 74);

      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Zero-Knowledge Security', centerX, y + 130);

      ctx.font = '400 13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Verify open cryptography before trusting passwords.', centerX, y + 154);

      // Neutral Non-Commercial CTA Button
      const btnW = 230;
      const btnH = 42;
      const btnX = centerX - btnW / 2;
      const btnY = y + 185;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 21);
      ctx.fill();

      ctx.fillStyle = '#062817';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('SECURE YOUR ACCOUNTS TODAY', centerX, btnY + 26);

      ctx.textAlign = 'left';
      ctx.restore();
    }

    _renderPlaceholderVisual(ctx, progress, x, y, w, h) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      // Dark slate background with diagonal blueprint hatching
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.lineWidth = 2;
      for (let offset = -h; offset < w + h; offset += 24) {
        ctx.beginPath();
        ctx.moveTo(x + offset, y);
        ctx.lineTo(x + offset + h, y + h);
        ctx.stroke();
      }

      // Warning Frame
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.roundRect(x + 14, y + 14, w - 28, h - 28, 8);
      ctx.stroke();
      ctx.setLineDash([]);

      const centerX = x + w / 2;
      ctx.textAlign = 'center';

      // Warning Triangle Icon
      ctx.font = '44px Inter, sans-serif';
      ctx.fillText('⚠️', centerX, y + 78);

      // Warning Header
      ctx.font = '700 15px Inter, monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('[UNSUPPORTED TOPIC PLACEHOLDER]', centerX, y + 122);

      // Explanatory Message
      ctx.font = '400 12px Inter, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('No native visual recipe available for this domain in Phase 01.', centerX, y + 150);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Custom motion graphics for this subject are deferred to Phase 04.', centerX, y + 172);

      // Gate Rejection Notice
      ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(centerX - 130, y + 200, 260, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 12px Inter, monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('READY TO PUBLISH: FALSE (GATE REJECTED)', centerX, y + 223);

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
    // 3. MINIMAL SUSPENSE ART DIRECTION (Vector Noir — Enhanced Chiaroscuro)
    // =========================================================================
    _renderMinimalSuspense(ctx, progress, width, height) {
      // Atmospheric deep background with visible architectural slate & navy tones
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#151d2f');
      bgGrad.addColorStop(0.35, '#0f1726');
      bgGrad.addColorStop(0.70, '#0a101b');
      bgGrad.addColorStop(1, '#0e1728');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const vanishingX = width * 0.5;
      const vanishingY = height * 0.38;

      // Perspective Corridor Walls (Physical Architectural Space)
      // Left Wall
      const leftWallGrad = ctx.createLinearGradient(0, height * 0.5, vanishingX * 0.8, vanishingY);
      leftWallGrad.addColorStop(0, '#1e293b');
      leftWallGrad.addColorStop(0.6, '#131c2d');
      leftWallGrad.addColorStop(1, '#0b101a');
      ctx.fillStyle = leftWallGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(vanishingX, vanishingY);
      ctx.lineTo(vanishingX, height * 0.72);
      ctx.lineTo(0, height);
      ctx.fill();

      // Right Wall
      const rightWallGrad = ctx.createLinearGradient(width, height * 0.5, width - vanishingX * 0.8, vanishingY);
      rightWallGrad.addColorStop(0, '#1e293b');
      rightWallGrad.addColorStop(0.6, '#131c2d');
      rightWallGrad.addColorStop(1, '#0b101a');
      ctx.fillStyle = rightWallGrad;
      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(vanishingX, vanishingY);
      ctx.lineTo(vanishingX, height * 0.72);
      ctx.lineTo(width, height);
      ctx.fill();

      // Industrial Wall Conduits & Bulkhead Struts
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.5;
      for (let s = 1; s <= 4; s++) {
        const wxL = vanishingX * (1 - s / 4.5);
        const wyT = vanishingY * (1 - s / 4.5);
        const wyB = vanishingY + (height - vanishingY) * (s / 4.5);
        ctx.beginPath();
        ctx.moveTo(wxL, wyT);
        ctx.lineTo(wxL, wyB);
        ctx.stroke();

        const wxR = vanishingX + (width - vanishingX) * (s / 4.5);
        ctx.beginPath();
        ctx.moveTo(wxR, wyT);
        ctx.lineTo(wxR, wyB);
        ctx.stroke();

        // Wall status LED indicators (amber/cyan)
        ctx.fillStyle = (s % 2 === 0) ? '#38bdf8' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(wxL + 4, wyT + (wyB - wyT) * 0.45, 2.5, 0, Math.PI * 2);
        ctx.arc(wxR - 4, wyT + (wyB - wyT) * 0.45, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ceiling Cable Conduits
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.12); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, height * 0.12); ctx.lineTo(vanishingX, vanishingY);
      ctx.stroke();

      // Polished Wet Floor with Specular Reflection Grid
      const floorGrad = ctx.createLinearGradient(0, vanishingY, 0, height);
      floorGrad.addColorStop(0, '#0d131f');
      floorGrad.addColorStop(0.4, '#131b2e');
      floorGrad.addColorStop(1, '#1b2438');
      ctx.fillStyle = floorGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(vanishingX, vanishingY);
      ctx.lineTo(width, height);
      ctx.fill();

      // Wet Floor Tiles Reflections
      for (let f = 1; f <= 6; f++) {
        const fy = vanishingY + (height - vanishingY) * (f / 6.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + f * 0.05})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(vanishingX - (vanishingX * f) / 6.2, fy);
        ctx.lineTo(vanishingX + ((width - vanishingX) * f) / 6.2, fy);
        ctx.stroke();
      }

      // Perspective Corridor Architectural Orthogonals
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, 0); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(0, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.moveTo(width, height); ctx.lineTo(vanishingX, vanishingY);
      ctx.stroke();

      // Volumetric Overhead Industrial Lamp Spotlight
      const lampGrad = ctx.createRadialGradient(vanishingX, vanishingY - 40, 20, vanishingX, vanishingY + 140, 480);
      lampGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
      lampGrad.addColorStop(0.3, 'rgba(251, 191, 36, 0.35)');
      lampGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.18)');
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.moveTo(vanishingX - 90, vanishingY - 60);
      ctx.lineTo(vanishingX + 90, vanishingY - 60);
      ctx.lineTo(width * 0.85, height);
      ctx.lineTo(width * 0.15, height);
      ctx.fill();

      // Electrical Flicker Dynamics
      const flicker = Math.sin(progress * 45) + Math.cos(progress * 85);
      const isFlickerDip = progress > 0.40 && progress < 0.48 && flicker > 0.15;
      const bulbAlpha = isFlickerDip ? 0.20 : (0.65 + 0.25 * Math.sin(progress * Math.PI * 4));

      // Light fixture at ceiling
      ctx.fillStyle = '#64748b';
      ctx.fillRect(vanishingX - 28, vanishingY - 80, 56, 20);
      ctx.fillStyle = `rgba(254, 240, 138, ${bulbAlpha * 1.2})`;
      ctx.beginPath();
      ctx.arc(vanishingX, vanishingY - 60, 16, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Suspended Dust Motes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      for (let m = 0; m < 20; m++) {
        const mx = (vanishingX - 140) + ((m * 37 + progress * 70) % 280);
        const my = (vanishingY - 40) + ((m * 29 + progress * 50) % 240);
        ctx.fillRect(mx, my, 2.5, 2.5);
      }

      // Climax Payoff Flash in Shot 4
      if (this.purpose === 'payoff') {
        const payoffPulse = Math.sin(progress * Math.PI * 4);
        ctx.fillStyle = `rgba(16, 185, 129, ${0.16 + Math.max(0, payoffPulse * 0.14)})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Mystery Trenchcoat Figure Silhouette (Approaches the camera)
      const figDist = 1 - Math.min(1, progress * 0.90);
      const figH = 120 + (1 - figDist) * 150;
      const figW = figH * 0.38;
      const figX = vanishingX - figW / 2;
      const figY = vanishingY + 15 + (1 - figDist) * 110;

      // Forward cast shadow on wet floor
      ctx.beginPath();
      ctx.ellipse(figX + figW / 2, figY + figH, figW * 1.6, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.fill();

      // Trenchcoat & Fedora Silhouette with High-Contrast Rim Lighting
      ctx.save();
      // Sharp Luminous Rim Highlight (White/Cyan)
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3.0;

      // Hat
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(figX + figW / 2, figY + 12, figW * 0.68, 9, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(figX + figW / 2, figY + 24, 17, 0, Math.PI * 2);
      ctx.fill();

      // Coat Body
      ctx.beginPath();
      ctx.moveTo(figX + 4, figY + 40);
      ctx.lineTo(figX + figW - 4, figY + 40);
      ctx.lineTo(figX + figW + 14, figY + figH);
      ctx.lineTo(figX - 14, figY + figH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Secondary Rim Glow (Cyan Cyber Edge)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Decryption Terminal / Datapad in Hand
      const padX = figX + figW * 0.58;
      const padY = figY + figH * 0.42;
      const padGlow = ctx.createRadialGradient(padX, padY, 2, padX, padY, 48);
      padGlow.addColorStop(0, this.purpose === 'payoff' ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.85)');
      padGlow.addColorStop(0.5, this.purpose === 'payoff' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)');
      padGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = padGlow;
      ctx.beginPath();
      ctx.arc(padX, padY, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = this.purpose === 'payoff' ? '#10b981' : '#38bdf8';
      ctx.fillRect(padX - 8, padY - 12, 16, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padX - 5, padY - 8, 10, 16);
      ctx.restore();

      // Cinematic Frosted Lower-Third Card (100% Legible on Mobile & Desktop)
      ctx.save();
      const cardW = Math.min(840, width * 0.76);
      const cardH = 74;
      const cardX = (width - cardW) / 2;
      const cardY = height - cardH - 24;

      const textAlpha = ReferenceShot.easeOutCubic(Math.min(1, progress * 2));
      ctx.globalAlpha = textAlpha;

      // Frosted container plate
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      // Topic badge pill
      ctx.font = '700 11px Inter, monospace';
      const badgeTxt = (this.badge || 'ACT').toUpperCase();
      const bW = ctx.measureText(badgeTxt).width + 16;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX + 20, cardY + 14, bW, 20, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(badgeTxt, cardX + 28, cardY + 28);

      // Main Narrative Headline
      ctx.font = '700 22px "Bricolage Grotesque", Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      const headlineText = (this.headline || 'SUB-LEVEL 04 // VAULT CORRIDOR').toUpperCase();
      ctx.fillText(headlineText, cardX + 28 + bW + 12, cardY + 30);

      // Secondary In-World Narrative Cue
      if (this.subhead) {
        ctx.font = '500 12px Inter, monospace';
        ctx.fillStyle = this.accentColor || '#f59e0b';
        ctx.fillText(this.subhead.toUpperCase(), cardX + 24, cardY + 56);
      }

      ctx.restore();
    }

    _renderDiagnosticsOverlay(ctx, localFrame, shotDuration, globalFrame, totalFrames, width, height) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(20, height - 90, 560, 70);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, height - 90, 560, 70);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`DIAGNOSTICS [MODE: DEBUG] | Shot: ${this.id} (${this.purpose})`, 30, height - 68);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Local Frame: ${localFrame}/${shotDuration} | Global: ${globalFrame}/${totalFrames} | ArtDirection: ${this.artDirection}`, 30, height - 48);
      if (this.directorNotes) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`Director Note: ${this.directorNotes}`, 30, height - 28);
      }
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
