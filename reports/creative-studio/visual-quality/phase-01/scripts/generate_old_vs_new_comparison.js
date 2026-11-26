/**
 * Deterministic Old-vs-New Comparison Generator & Verification Script
 *
 * Re-extracts verified video frames from the real baseline video and real Phase 01 master:
 * - Left: live_1minute_project.webm @ 30.0s (50%)
 * - Right: From_Raw_Data_to_Clear_Answers_Master.webm @ 12.0s (50%)
 *
 * Renders prominent, high-contrast, platform-independent text labels onto the banner:
 * - Left: "OLD • live_1minute_project.webm • 30s"
 * - Right: "NEW • SaaS Master • 12s"
 *
 * Verifies with automated pixel-level inspection that text labels are genuinely rendered
 * and not solid blank color bars. Generates an enlarged zoom proof of the upper bar.
 *
 * Outputs:
 * - reports/creative-studio/visual-quality/phase-01/OLD_VS_NEW_COMPARISON.png
 * - reports/creative-studio/visual-quality/phase-01/evidence/OLD_VS_NEW_COMPARISON.png
 * - reports/creative-studio/visual-quality/phase-01/UPPER_BAR_ZOOM_PROOF.png
 * - reports/creative-studio/visual-quality/phase-01/evidence/UPPER_BAR_ZOOM_PROOF.png
 * - reports/creative-studio/visual-quality/phase-01/evidence/old_vs_new_manifest.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const assert = require('assert');
const { chromium } = require('playwright-core');
const { PNG } = require('pngjs');

const ROOT = process.cwd();
const gates = require('./verification_gates');

const PHASE_DIR = path.resolve(ROOT, 'reports/creative-studio/visual-quality/phase-01');
const EVIDENCE_DIR = path.join(PHASE_DIR, 'evidence');
const BASELINE_DIR = path.join(PHASE_DIR, 'baseline_inspection');
const FRAMES_DIR = path.join(PHASE_DIR, 'extracted_frames');

// Source paths (supports both repository layout and self-contained bundle layout)
const OLD_VIDEO = [
  path.join(BASELINE_DIR, 'live_1minute_project.webm'),
  path.resolve(ROOT, 'reports/creative-studio/blocker-repair/REAL_OUTPUTS/live_1minute_project.webm')
].find(p => fs.existsSync(p)) || path.join(BASELINE_DIR, 'live_1minute_project.webm');
const NEW_VIDEO = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.webm');

function sha256File(filePath) {
  assert(fs.existsSync(filePath), `File does not exist: ${filePath}`);
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Generates high-contrast, anti-aliased 1280x34 banner overlay via headless Chromium
 */
async function generateBannerOverlay(outputPath) {
  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  }
  const browser = await chromium.launch(launchOptions);
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 34 } });

    await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1280px;
      height: 34px;
      display: flex;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      overflow: hidden;
      background: #000000;
    }
    .left {
      width: 640px;
      height: 34px;
      background: #dc2626;
      padding-left: 16px;
      display: flex;
      align-items: center;
      letter-spacing: 0.3px;
      border-right: 2px solid #0f172a;
    }
    .right {
      width: 640px;
      height: 34px;
      background: #0284c7;
      padding-left: 16px;
      display: flex;
      align-items: center;
      letter-spacing: 0.3px;
    }
  </style>
</head>
<body>
  <div class="left">OLD &bull; live_1minute_project.webm &bull; 30s</div>
  <div class="right">NEW &bull; SaaS Master &bull; 12s</div>
</body>
</html>`);

    await page.screenshot({ path: outputPath, omitBackground: false });
    console.log(`  ✓ High-contrast banner overlay rendered: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

/**
 * Performs automated pixel-level inspection on the upper banner (rows y: 6..28)
 * Asserts that white/near-white text pixels exist on both left and right banners.
 */
function verifyBannerPixelContent(imagePath) {
  assert(fs.existsSync(imagePath), `Image file missing: ${imagePath}`);
  const buf = fs.readFileSync(imagePath);
  const png = PNG.sync.read(buf);

  let leftWhitePixels = 0;
  let rightWhitePixels = 0;

  for (let y = 6; y < 28; y++) {
    // Left banner inspection (x: 16..600)
    for (let x = 16; x < 600; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      // Text pixels are crisp white / near-white
      if (r > 200 && g > 200 && b > 200) {
        leftWhitePixels++;
      }
    }
    // Right banner inspection (x: 656..1240)
    for (let x = 656; x < 1240; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      if (r > 200 && g > 200 && b > 200) {
        rightWhitePixels++;
      }
    }
  }

  console.log(`  [Automated Banner Audit] Left banner text pixels: ${leftWhitePixels}, Right banner text pixels: ${rightWhitePixels}`);
  assert(leftWhitePixels >= 100, `Automated Banner Audit FAILED: Left banner appears blank! Only ${leftWhitePixels} text pixels found (expected >= 100)`);
  assert(rightWhitePixels >= 100, `Automated Banner Audit FAILED: Right banner appears blank! Only ${rightWhitePixels} text pixels found (expected >= 100)`);
  console.log('  ✓ Automated Banner Audit PASSED: Both banners contain readable, non-blank label pixels.');

  return { leftWhitePixels, rightWhitePixels };
}

async function generateOldVsNew() {
  console.log('--- Generating Deterministic Old vs New Comparison (With Verified Visible Labels) ---');

  // Verify source videos
  assert(fs.existsSync(OLD_VIDEO), `Old baseline video not found: ${OLD_VIDEO}\nExpected at: reports/creative-studio/blocker-repair/REAL_OUTPUTS/live_1minute_project.webm`);
  assert(fs.existsSync(NEW_VIDEO), `New SaaS master video not found: ${NEW_VIDEO}\nExpected at: reports/creative-studio/visual-quality/phase-01/evidence/From_Raw_Data_to_Clear_Answers_Master.webm`);

  const oldVideoHash = sha256File(OLD_VIDEO);
  const newVideoHash = sha256File(NEW_VIDEO);
  console.log(`  Source Old Video: ${OLD_VIDEO} (SHA256: ${oldVideoHash})`);
  console.log(`  Source New Video: ${NEW_VIDEO} (SHA256: ${newVideoHash})`);

  // Extract old baseline frame at 30.0s (50% of 60s)
  const oldFramePath = path.join(BASELINE_DIR, 'live_1minute_project_pct_50.png');
  const resOld = spawnSync(gates.FFMPEG_BIN, [
    '-y',
    '-ss', '30.0',
    '-i', OLD_VIDEO,
    '-vf', 'scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709',
    '-vframes', '1',
    '-q:v', '2',
    oldFramePath
  ], { encoding: 'utf8' });
  assert(resOld.status === 0 && fs.existsSync(oldFramePath), `Failed to extract old baseline frame: ${resOld.stderr}`);

  // Extract new SaaS master frame at 12.0s (50% of 24s, Frame 360)
  const newFramePath = path.join(FRAMES_DIR, 'saas_master_pct_50.png');
  const resNew = spawnSync(gates.FFMPEG_BIN, [
    '-y',
    '-ss', '12.0',
    '-i', NEW_VIDEO,
    '-vf', 'scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709',
    '-vframes', '1',
    newFramePath
  ], { encoding: 'utf8' });
  assert(resNew.status === 0 && fs.existsSync(newFramePath), `Failed to extract new SaaS master frame: ${resNew.stderr}`);

  const oldFrameHash = sha256File(oldFramePath);
  const newFrameHash = sha256File(newFramePath);
  console.log(`  Extracted Old Frame: ${oldFramePath} (SHA256: ${oldFrameHash})`);
  console.log(`  Extracted New Frame: ${newFramePath} (SHA256: ${newFrameHash})`);

  // Generate 1280x34 banner overlay with visible text
  const bannerOverlayPath = path.join(PHASE_DIR, 'banner_overlay_1280x34.png');
  await generateBannerOverlay(bannerOverlayPath);

  // Composite side-by-side: scale each frame to 640x360, hstack, overlay 1280x34 banner at 0:0
  const outputPath = path.join(PHASE_DIR, 'OLD_VS_NEW_COMPARISON.png');
  const evidenceOutputPath = path.join(EVIDENCE_DIR, 'OLD_VS_NEW_COMPARISON.png');

  const filterComplex = [
    '[0:v]scale=640:360[left]',
    '[1:v]scale=640:360[right]',
    '[left][right]hstack=inputs=2[combined]',
    '[combined][2:v]overlay=0:0[out]'
  ].join(';');

  const resComposite = spawnSync(gates.FFMPEG_BIN, [
    '-y',
    '-i', oldFramePath,
    '-i', newFramePath,
    '-i', bannerOverlayPath,
    '-filter_complex', filterComplex,
    '-map', '[out]',
    '-vframes', '1',
    outputPath
  ], { encoding: 'utf8' });

  assert(resComposite.status === 0 && fs.existsSync(outputPath), `FFmpeg composite failed: ${resComposite.stderr}`);
  fs.copyFileSync(outputPath, evidenceOutputPath);

  // Clean up banner overlay cache
  if (fs.existsSync(bannerOverlayPath)) fs.unlinkSync(bannerOverlayPath);

  // Perform automated pixel content audit on the generated composite
  const pixelAudit = verifyBannerPixelContent(outputPath);

  // Generate enlarged upper-bar zoom screenshot (crop y: 0..34, scale 2x)
  const zoomProofPath = path.join(PHASE_DIR, 'UPPER_BAR_ZOOM_PROOF.png');
  const evidenceZoomPath = path.join(EVIDENCE_DIR, 'UPPER_BAR_ZOOM_PROOF.png');
  const resZoom = spawnSync(gates.FFMPEG_BIN, [
    '-y',
    '-i', outputPath,
    '-vf', 'crop=1280:34:0:0,scale=2560:68:flags=neighbor',
    '-vframes', '1',
    zoomProofPath
  ], { encoding: 'utf8' });
  assert(resZoom.status === 0 && fs.existsSync(zoomProofPath), `Failed to generate zoom proof: ${resZoom.stderr}`);
  fs.copyFileSync(zoomProofPath, evidenceZoomPath);
  console.log(`  ✓ Upper-bar zoom proof generated: ${zoomProofPath}`);

  const compositeHash = sha256File(outputPath);
  const zoomHash = sha256File(zoomProofPath);
  console.log(`  ✓ Successfully generated: ${outputPath} (SHA256: ${compositeHash})`);

  // Create manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    description: 'Deterministic Old Baseline vs Phase 01 New Production Master Visual Comparison with Visible Labels',
    leftPanel: {
      label: 'OLD • live_1minute_project.webm • 30s',
      sourceVideo: path.relative(ROOT, OLD_VIDEO).replace(/\\/g, '/'),
      sourceVideoSha256: oldVideoHash,
      timestampSec: 30.0,
      percentage: '50%',
      extractedFrame: path.relative(ROOT, oldFramePath).replace(/\\/g, '/'),
      extractedFrameSha256: oldFrameHash,
      bannerColor: '#dc2626',
      visibleTextPixels: pixelAudit.leftWhitePixels
    },
    rightPanel: {
      label: 'NEW • SaaS Master • 12s',
      sourceVideo: path.relative(ROOT, NEW_VIDEO).replace(/\\/g, '/'),
      sourceVideoSha256: newVideoHash,
      timestampSec: 12.0,
      percentage: '50%',
      extractedFrame: path.relative(ROOT, newFramePath).replace(/\\/g, '/'),
      extractedFrameSha256: newFrameHash,
      bannerColor: '#0284c7',
      visibleTextPixels: pixelAudit.rightWhitePixels
    },
    compositeOutput: {
      filePath: path.relative(ROOT, outputPath).replace(/\\/g, '/'),
      evidencePath: path.relative(ROOT, evidenceOutputPath).replace(/\\/g, '/'),
      zoomProofPath: path.relative(ROOT, zoomProofPath).replace(/\\/g, '/'),
      dimensions: '1280x360',
      sha256: compositeHash,
      zoomSha256: zoomHash
    }
  };

  const manifestPath = path.join(EVIDENCE_DIR, 'old_vs_new_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`  ✓ Manifest saved: ${manifestPath}`);

  return manifest;
}

if (require.main === module) {
  generateOldVsNew().catch(err => {
    console.error('Fatal generator error:', err);
    process.exit(1);
  });
}

module.exports = { generateOldVsNew, verifyBannerPixelContent };
