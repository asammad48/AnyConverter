const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PHASE_DIR = path.join(ROOT, 'reports/creative-studio/visual-quality/phase-01');
const EVIDENCE_DIR = path.join(PHASE_DIR, 'evidence');
const FRAMES_DIR = path.join(PHASE_DIR, 'extracted_frames');

[PHASE_DIR, EVIDENCE_DIR, FRAMES_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function generateNineFrameBoard() {
  console.log('Generating Original Three Art Directions Nine-Frame Storyboard...');

  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  }
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="board" width="1920" height="1080"></canvas>
  <script>
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');

    // Grid layout: 3 rows x 3 columns
    // Header bar: 72px
    // Grid: cols = 616px each (gap 16px, margins 28px) -> 28 + 616 + 16 + 616 + 16 + 616 + 28 = 1920
    // rows = 312px each (gap 14px, top 72px, bottom 18px) -> 72 + 312 + 14 + 312 + 14 + 312 + 18 = 1054
    const COL_W = 616;
    const ROW_H = 312;
    const MARGIN_X = 28;
    const GAP_X = 16;
    const START_Y = 74;
    const GAP_Y = 14;

    // Background master
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, 1920, 1080);

    // Master Title Banner
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 1920, 62);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('ANYCONVERTER CREATIVE STUDIO — PHASE 01 ORIGINAL THREE ART DIRECTIONS', 32, 38);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Specification WP 2 & WP 3: Editorial Kinetic (Monochrome) | Cinematic SaaS (Deep Indigo) | Modern Educational (Paper-White)', 850, 38);

    function getCellRect(row, col) {
      const x = MARGIN_X + col * (COL_W + GAP_X);
      const y = START_Y + row * (ROW_H + GAP_Y);
      return { x, y, w: COL_W, h: ROW_H };
    }

    // =========================================================================
    // ROW 0: DIRECTION 1 — EDITORIAL KINETIC (Monochrome, Stark Grid, Bold Sans)
    // =========================================================================
    function renderEditorialKinetic(col, shotTitle, headline, subhead, motifType) {
      const { x, y, w, h } = getCellRect(0, col);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      // Clean stark editorial background (White / Pale Cream)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, w, h);

      // Fine architectural grid lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let gx = x; gx < x + w; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke();
      }
      for (let gy = y; gy < y + h; gy += 40) {
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke();
      }

      // Editorial masthead label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('01 // EDITORIAL KINETIC — ' + shotTitle.toUpperCase(), x + 24, y + 32);

      // Stark black accent block
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 24, y + 42, 36, 4);

      // Big bold typography
      ctx.fillStyle = '#09090b';
      ctx.font = '900 26px sans-serif';
      ctx.fillText(headline, x + 24, y + 90);

      // Body narrative
      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText(subhead, x + 24, y + 120);

      // Visual motif per frame
      if (motifType === 'hook') {
        // High contrast typographic scale block
        ctx.fillStyle = '#18181b';
        ctx.fillRect(x + 24, y + 150, w - 48, 120);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('RAW DATA', x + 44, y + 210);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '14px monospace';
        ctx.fillText('INPUT BUFFER // 01011001 01101111 01110101', x + 44, y + 240);
      } else if (motifType === 'split') {
        // Two-column asymmetric data comparison
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x + 24, y + 145, (w - 60) / 2, 130);
        ctx.strokeRect(x + 24, y + 145, (w - 60) / 2, 130);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 36 + (w - 60) / 2, y + 145, (w - 60) / 2, 130);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('BEFORE (SERVER)', x + 36, y + 175);
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('+420ms LAG', x + 36, y + 215);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('AFTER (LOCAL)', x + 48 + (w - 60) / 2, y + 175);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('0ms TRANSIT', x + 48 + (w - 60) / 2, y + 215);
      } else if (motifType === 'payoff') {
        // Minimal stark brand resolution
        ctx.fillStyle = '#09090b';
        ctx.fillRect(x + 24, y + 145, w - 48, 130);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('ANYCONVERTER', x + 48, y + 205);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px monospace';
        ctx.fillText('DETERMINISTIC // BROWSER-NATIVE // AUDITED', x + 48, y + 235);
      }

      // Border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    // =========================================================================
    // ROW 1: DIRECTION 2 — CINEMATIC SAAS (Deep Indigo, Disciplined Lighting, Cards)
    // =========================================================================
    function renderCinematicSaaS(col, shotTitle, headline, subhead, motifType) {
      const { x, y, w, h } = getCellRect(1, col);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      // Deep obsidian slate background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(x, y, w, h);

      // Radial backlight glow
      const rad = ctx.createRadialGradient(x + w * 0.7, y + h * 0.45, 10, x + w * 0.7, y + h * 0.45, 260);
      rad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      rad.addColorStop(0.6, 'rgba(99, 102, 241, 0.08)');
      rad.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(x, y, w, h);

      // Category badge
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.fillRect(x + 24, y + 20, 190, 22);
      ctx.strokeRect(x + 24, y + 20, 190, 22);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('02 // CINEMATIC SAAS — ' + shotTitle.toUpperCase(), x + 30, y + 35);

      // Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(headline, x + 24, y + 72);

      // Subhead
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText(subhead, x + 24, y + 96);

      // Glassmorphic Device Card Container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      ctx.fillRect(x + 24, y + 115, w - 48, 170);
      ctx.strokeRect(x + 24, y + 115, w - 48, 170);

      if (motifType === 'chaos') {
        // Floating chaotic packet cards
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('UNPARSED STREAM INPUT', x + 44, y + 148);
        ['csv_chunk_94.raw', 'blob_0x7ffe.bin', 'unparsed_payload.tar'].forEach((pkt, i) => {
          ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fillRect(x + 44 + i * 165, y + 170, 150, 70);
          ctx.strokeRect(x + 44 + i * 165, y + 170, 150, 70);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(pkt, x + 54 + i * 165, y + 195);
          ctx.fillStyle = '#64748b';
          ctx.font = '10px sans-serif';
          ctx.fillText('Pending Parser', x + 54 + i * 165, y + 218);
        });
      } else if (motifType === 'pipeline') {
        // WASM deterministic pipeline stages
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('WASM DETERMINISTIC COMPOSITOR', x + 44, y + 148);
        const stages = ['IN-MEMORY BUFFER', 'WASM ENGINE', 'RGBA CANVAS'];
        stages.forEach((stg, i) => {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
          ctx.strokeStyle = '#38bdf8';
          ctx.fillRect(x + 44 + i * 170, y + 170, 150, 70);
          ctx.strokeRect(x + 44 + i * 170, y + 170, 150, 70);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(stg, x + 54 + i * 170, y + 200);
          ctx.fillStyle = '#10b981';
          ctx.font = '10px monospace';
          ctx.fillText('✓ 0ms EXPOSURE', x + 54 + i * 170, y + 222);
        });
      } else if (motifType === 'payoff') {
        // Branded conclusion
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('PRODUCTION LAUNCH MASTER', x + 44, y + 148);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('From Raw Data to Clear Answers', x + 44, y + 195);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('AnyConverter.io Creative Studio', x + 44, y + 228);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('● 100% Client-Side Engine Verified', x + 44, y + 252);
      }

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    // =========================================================================
    // ROW 2: DIRECTION 3 — MODERN EDUCATIONAL (Paper-White, Diagram-Led Teaching)
    // =========================================================================
    function renderModernEducational(col, shotTitle, headline, subhead, motifType) {
      const { x, y, w, h } = getCellRect(2, col);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      // Clean paper-white notebook background
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(x, y, w, h);

      // Subtle notebook dot-grid
      ctx.fillStyle = '#cbd5e1';
      for (let dx = x + 16; dx < x + w; dx += 24) {
        for (let dy = y + 16; dy < y + h; dy += 24) {
          ctx.fillRect(dx, dy, 1.5, 1.5);
        }
      }

      // Educational step badge
      ctx.fillStyle = '#e0e7ff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.fillRect(x + 24, y + 20, 210, 22);
      ctx.strokeRect(x + 24, y + 20, 210, 22);
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('03 // MODERN EDUCATIONAL — ' + shotTitle.toUpperCase(), x + 30, y + 35);

      // Headline
      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(headline, x + 24, y + 72);

      // Subhead
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px sans-serif';
      ctx.fillText(subhead, x + 24, y + 96);

      // Diagram container
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x + 24, y + 115, w - 48, 170);
      ctx.strokeRect(x + 24, y + 115, w - 48, 170);

      if (motifType === 'concept') {
        // Step 1: Diagrammatic concept breakdown
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('STEP 1: HOW CLIENT-SIDE COMPILATION WORKS', x + 44, y + 145);

        // 3 modular steps with arrows
        const steps = ['1. User Input', '2. Memory Heap', '3. Visual Output'];
        steps.forEach((step, i) => {
          ctx.fillStyle = '#f5f3ff';
          ctx.strokeStyle = '#6366f1';
          ctx.fillRect(x + 44 + i * 170, y + 165, 135, 80);
          ctx.strokeRect(x + 44 + i * 170, y + 165, 135, 80);
          ctx.fillStyle = '#312e81';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(step, x + 54 + i * 170, y + 195);
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px sans-serif';
          ctx.fillText('Zero server calls', x + 54 + i * 170, y + 220);
        });
      } else if (motifType === 'flow') {
        // Step 2: Flowchart explainer
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('STEP 2: PIPELINE FLOW ARCHITECTURE', x + 44, y + 145);

        ctx.fillStyle = '#eff6ff';
        ctx.strokeStyle = '#3b82f6';
        ctx.fillRect(x + 44, y + 165, 230, 80);
        ctx.strokeRect(x + 44, y + 165, 230, 80);
        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('PARSER & COMPOSITOR', x + 56, y + 195);
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText('30 FPS Frame-Accurate Loop', x + 56, y + 218);

        ctx.fillStyle = '#ecfdf5';
        ctx.strokeStyle = '#10b981';
        ctx.fillRect(x + 300, y + 165, 230, 80);
        ctx.strokeRect(x + 300, y + 165, 230, 80);
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('WEBM VIDEO WRITER', x + 312, y + 195);
        ctx.fillStyle = '#047857';
        ctx.font = '11px sans-serif';
        ctx.fillText('Hardware WebCodecs Stream', x + 312, y + 218);
      } else if (motifType === 'summary') {
        // Step 3: Key Takeaway Summary Card
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('SUMMARY // CORE ARCHITECTURAL PRINCIPLE', x + 44, y + 145);

        ctx.fillStyle = '#1e1b4b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Your Data Stays on Your Device.', x + 44, y + 185);
        ctx.fillStyle = '#4b5563';
        ctx.font = '13px sans-serif';
        ctx.fillText('Educational transparency: No telemetry cookies, no cloud GPU queues, no hidden fees.', x + 44, y + 215);

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('VERIFIED 100% CLIENT-SIDE AUDIT PASS', x + 44, y + 248);
      }

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    // Render 9 Cells
    // Row 0: Editorial Kinetic
    renderEditorialKinetic(0, 'Frame 1: Hook', 'THE SILENT BOTTLENECK', '99.4% of web files are stalled in transmission queues.', 'hook');
    renderEditorialKinetic(1, 'Frame 2: Problem', 'DATA DENSITY COLLISION', 'Legacy cloud converters require heavy server roundtrips.', 'split');
    renderEditorialKinetic(2, 'Frame 3: Payoff', 'EDITORIAL RESOLUTION', 'Deterministic in-browser execution delivers instantaneous results.', 'payoff');

    // Row 1: Cinematic SaaS
    renderCinematicSaaS(0, 'Frame 1: Hook', 'RAW DATA IN CHAOS', 'Fragmented files trapped across disconnected cloud storage.', 'chaos');
    renderCinematicSaaS(1, 'Frame 2: Solution', 'DETERMINISTIC PIPELINE', 'WebAssembly transforms assets directly inside device memory.', 'pipeline');
    renderCinematicSaaS(2, 'Frame 3: Payoff', 'FROM RAW DATA TO CLEAR ANSWERS', 'The final polished 24s production master for AnyConverter.', 'payoff');

    // Row 2: Modern Educational
    renderModernEducational(0, 'Frame 1: Hook', 'HOW MEMORY COMPILATION WORKS', 'Deconstructing the zero-server transformation process.', 'concept');
    renderModernEducational(1, 'Frame 2: Diagram', 'FRAME-ACCURATE COMPOSITION', 'Step-by-step architectural breakdown of the rendering pipeline.', 'flow');
    renderModernEducational(2, 'Frame 3: Summary', 'EDUCATIONAL TAKEAWAYS', 'Empowering users with deterministic, private computing.', 'summary');
  </script>
</body>
</html>
  `;

  await page.setContent(htmlContent);
  await page.waitForTimeout(500);

  const outBoardPath = path.join(PHASE_DIR, 'ORIGINAL_THREE_DIRECTIONS_NINE_FRAME_BOARD.png');
  const outEvidencePath = path.join(EVIDENCE_DIR, 'ORIGINAL_THREE_DIRECTIONS_NINE_FRAME_BOARD.png');

  await page.screenshot({ path: outBoardPath, fullPage: true });
  fs.copyFileSync(outBoardPath, outEvidencePath);
  console.log(`✓ 9-Frame Storyboard Sheet saved to:\n  - ${outBoardPath}\n  - ${outEvidencePath}`);

  await browser.close();
}

generateNineFrameBoard().then(() => {
  console.log('✓ Done!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
