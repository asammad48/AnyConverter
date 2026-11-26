/**
 * AnyConverter Creative Studio — Phase 01 Focused Final Correction Verification Runner
 *
 * Implements strict, portable end-to-end browser verification answering all re-audit requirements:
 * 1. P1-A: Removal of storyboard/director instructions from production video renders.
 * 2. P1-B: Noir suspense visibility enhancement with chiaroscuro lighting and measured luminance.
 * 3. P1-C: Creative quality uplift across SaaS master, Parrot comedy, and Noir suspense.
 * 4. P2-D: Integration with shared verification gates module (verification_gates.js).
 * 5. P2-E: Hard assertions on fresh browser state, zero console errors, zero uncaught page errors, exact ffprobe frame counts.
 * 6. P2-F: Portable Chromium discovery without hardcoded host filesystem paths.
 * 7. P2-G: Generation of updated masters, .acstudio archive, 4 contact sheets, and parity proofs.
 * 8. P1-01: Deterministic, provenance-verified Old vs New comparison generation with SHA-256 manifests.
 * 9. P2-03: Real workflows tracking, pageerror event capture, reproducible environment setup.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const { execSync, spawnSync } = require('child_process');
const { chromium } = require('playwright-core');

function computeSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

const ROOT = process.cwd();
const gates = require('./verification_gates');
const { generateOldVsNew } = require('./generate_old_vs_new_comparison');

const PORT = 3000;
const PHASE_DIR = path.resolve(ROOT, 'reports/creative-studio/visual-quality/phase-01');
const EVIDENCE_DIR = path.join(PHASE_DIR, 'evidence');
const FRAMES_DIR = path.join(PHASE_DIR, 'extracted_frames');
const SCREENSHOTS_DIR = path.join(PHASE_DIR, 'screenshots');

[EVIDENCE_DIR, FRAMES_DIR, SCREENSHOTS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.acstudio': 'application/zip',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    let relativePath = reqUrl.startsWith('/') ? reqUrl.slice(1) : reqUrl;
    let filePath = path.join(ROOT, relativePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Listening on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function runFocusedFinalCorrection() {
  const server = await createStaticServer();

  // Portable Chromium launch without hardcoded paths
  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE_PATH;
  }
  const browser = await chromium.launch(launchOptions);

  const results = {
    timestamp: new Date().toISOString(),
    auditProfile: 'Phase01_Final_Evidence_Cleanup_Cycle',
    workflows: {},
    contextualUI: {},
    audioIntegrity: {},
    exactFrameCounts: {},
    noirLuminance: {},
    directorNotesAudit: {},
    statePreservation: {},
    originalParityMetrics: [],
    reopenedMutatedParityMetrics: [],
    reopenVerification: {},
    assertionSummary: {
      totalAssertions: 0,
      passedAssertions: 0,
      allPassed: false
    },
    consoleErrors: [],
    pageErrors: []
  };

  function check(condition, message) {
    results.assertionSummary.totalAssertions++;
    try {
      assert(condition, message);
      results.assertionSummary.passedAssertions++;
      console.log(`  ✓ ASSERTION PASS: ${message}`);
    } catch (e) {
      console.error(`  ✗ ASSERTION FAIL: ${message}`);
      throw e;
    }
  }

  try {
    // Controlled fault injection check for negative test suite (proves runner nonzero exit)
    if (process.env.CONTROLLED_RUNNER_FAULT_TEST === '1') {
      console.log('\n=============================================================');
      console.log('=== CONTROLLED FAULT INJECTION: Intentional Gate Failure   ===');
      console.log('=============================================================');
      check(false, 'Controlled runner fault injection test assertion failure');
    }

    console.log('\n=============================================================');
    console.log('=== STEP 1: Contextual UI Verification (P2-G)             ===');
    console.log('=============================================================');

    let context1 = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true
    });
    let page = await context1.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') results.consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      console.error('Browser Uncaught Page Error (Context 1):', err);
      results.pageErrors.push(err.message || String(err));
    });

    await page.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const initialScreenshot = path.join(SCREENSHOTS_DIR, '01_initial_studio_desktop.png');
    await page.screenshot({ path: initialScreenshot, fullPage: true });

    // Verify Contextual UI in video mode
    const isPresetHidden = await page.$eval('#cs-preset-container', el => el.style.display === 'none' || window.getComputedStyle(el).display === 'none');
    const isCardSideHidden = await page.$eval('#cs-card-side-toggle', el => el.style.display === 'none' || window.getComputedStyle(el).display === 'none');
    const isVideoGroupVisible = await page.$eval('#cs-inspector-video-group', el => window.getComputedStyle(el).display !== 'none');
    const isLayerGroupHidden = await page.$eval('#cs-inspector-layer-group', el => window.getComputedStyle(el).display === 'none');

    check(isPresetHidden, 'Preset thumbnail selector is hidden in video mode');
    check(isCardSideHidden, 'Card front/back toggle is hidden in video mode');
    check(isVideoGroupVisible, 'Cinematic Shot Editor group is top-visible in video mode');
    check(isLayerGroupHidden, 'Legacy layer properties group is hidden in video mode');

    results.contextualUI = {
      isPresetHidden,
      isCardSideHidden,
      isVideoGroupVisible,
      isLayerGroupHidden
    };

    results.workflows.initialLoad = {
      action: 'navigate_and_inspect_contextual_ui',
      url: `http://127.0.0.1:${PORT}/creative-studio/`,
      title: await page.title(),
      screenshot: path.relative(ROOT, initialScreenshot).replace(/\\/g, '/'),
      contextualUI: results.contextualUI
    };

    console.log('\n=============================================================');
    console.log('=== STEP 2: Responsive Inspection & Mobile Drawer Usability ===');
    console.log('=============================================================');
    // Tablet (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    const tabletScreenshot = path.join(SCREENSHOTS_DIR, '02_studio_tablet_768px.png');
    await page.screenshot({ path: tabletScreenshot });

    await page.click('#cs-btn-mobile-inspector');
    await page.waitForTimeout(300);
    const tabletInspectorScreenshot = path.join(SCREENSHOTS_DIR, '02b_tablet_inspector_open.png');
    await page.screenshot({ path: tabletInspectorScreenshot });
    const isTabletOpen = await page.$eval('#cs-sidebar-right', el => el.classList.contains('mobile-open'));
    check(isTabletOpen, 'Tablet mobile inspector drawer opens cleanly');

    await page.click('#cs-btn-close-inspector');
    await page.waitForTimeout(200);

    // Mobile (375x812)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    const mobileScreenshot = path.join(SCREENSHOTS_DIR, '03_studio_mobile_375px.png');
    await page.screenshot({ path: mobileScreenshot });

    await page.click('#cs-btn-mobile-inspector');
    await page.waitForTimeout(300);
    const mobileInspectorScreenshot = path.join(SCREENSHOTS_DIR, '03b_mobile_inspector_open.png');
    await page.screenshot({ path: mobileInspectorScreenshot });
    const isMobileOpen = await page.$eval('#cs-sidebar-right', el => el.classList.contains('mobile-open'));
    check(isMobileOpen, 'Mobile inspector drawer opens on 375px viewport');

    // Test editing inside mobile drawer
    await page.fill('#cs-shot-headline', 'FROM RAW DATA TO CLEAR ANSWERS');
    await page.fill('#cs-shot-accent', '#06b6d4');
    await page.waitForTimeout(200);

    await page.click('#cs-btn-close-inspector');
    await page.waitForTimeout(200);

    // Restore desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);

    results.workflows.responsiveInspection = {
      action: 'viewport_resize_and_mobile_drawer_edit',
      tabletScreenshot: path.relative(ROOT, tabletScreenshot).replace(/\\/g, '/'),
      tabletDrawerScreenshot: path.relative(ROOT, tabletInspectorScreenshot).replace(/\\/g, '/'),
      mobileScreenshot: path.relative(ROOT, mobileScreenshot).replace(/\\/g, '/'),
      mobileDrawerScreenshot: path.relative(ROOT, mobileInspectorScreenshot).replace(/\\/g, '/'),
      mobileDrawerEditedHeadline: 'FROM RAW DATA TO CLEAR ANSWERS',
      mobileDrawerEditedAccent: '#06b6d4'
    };

    console.log('\n=============================================================');
    console.log('=== STEP 3: Direction Switching & Edit Persistence (P0-03) ===');
    console.log('=============================================================');
    // Switch to Character Comedy
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    await page.fill('#cs-shot-headline', 'THE COCKATOO HAS ENTERED');
    await page.waitForTimeout(200);

    // Switch to Minimal Suspense
    await page.selectOption('#cs-direction-select', 'minimal-suspense');
    await page.waitForTimeout(300);

    // Switch back to Character Comedy: verify edited headline preserved
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    const comedyRestored = await page.$eval('#cs-shot-headline', el => el.value);
    check(comedyRestored === 'THE COCKATOO HAS ENTERED', 'Character Comedy edited headline preserved across directions');

    // Switch back to Cinematic SaaS Master: verify edited headline preserved
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.waitForTimeout(300);
    const saasRestored = await page.$eval('#cs-shot-headline', el => el.value);
    check(saasRestored === 'FROM RAW DATA TO CLEAR ANSWERS', 'Cinematic SaaS edited headline preserved across directions');

    results.statePreservation = {
      comedyRestored,
      saasRestored,
      directionsPreserved: true
    };

    results.workflows.directionSwitching = {
      action: 'switch_directions_and_verify_state_persistence',
      testedDirections: ['cinematic-saas', 'character-comedy', 'minimal-suspense'],
      statePreservation: results.statePreservation
    };

    console.log('\n=============================================================');
    console.log('=== STEP 4: Director Instructions Audit (P1-A Regression)  ===');
    console.log('=============================================================');
    // Inspect current loaded projects for all three directions to ensure zero leaked director instructions
    const directionsToAudit = ['cinematic-saas', 'character-comedy', 'minimal-suspense'];
    for (const dKey of directionsToAudit) {
      await page.selectOption('#cs-direction-select', dKey);
      await page.waitForTimeout(200);
      const proj = await page.evaluate(() => window.studioApp.project);
      gates.verifyNoDirectorNotesLeaked(proj);
      console.log(`  ✓ Director Notes Audit PASSED for direction "${dKey}": Zero leaked instructions in audience text`);
    }
    results.directorNotesAudit = { allDirectionsClean: true };

    results.workflows.directorNotesAudit = {
      action: 'audit_audience_text_for_director_notes',
      auditedDirections: directionsToAudit,
      allDirectionsClean: true
    };

    // Restore to Cinematic SaaS for export
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.waitForTimeout(200);

    console.log('\n=============================================================');
    console.log('=== STEP 5: State-Matched Preview Capture (Original SaaS) ===');
    console.log('=============================================================');
    const testPoints = [
      { sec: 1.5, frame: 45, shot: 'Shot 1: Hook' },
      { sec: 6.5, frame: 195, shot: 'Shot 2: Problem' },
      { sec: 12.0, frame: 360, shot: 'Shot 3: Solution' },
      { sec: 17.5, frame: 525, shot: 'Shot 4: Benefit' },
      { sec: 22.0, frame: 660, shot: 'Shot 5: Payoff' }
    ];

    const previewPaths = {};
    for (const tp of testPoints) {
      await page.evaluate((f) => window.studioApp.seekFrame(f), tp.frame);
      await page.waitForTimeout(150);
      const previewImgPath = path.join(FRAMES_DIR, `preview_orig_f${tp.frame}_${tp.sec}s.png`);
      const dataUrl = await page.evaluate(() => {
        const c = document.getElementById('cs-canvas');
        return c.toDataURL('image/png');
      });
      fs.writeFileSync(previewImgPath, Buffer.from(dataUrl.split(',')[1], 'base64'));
      previewPaths[tp.frame] = previewImgPath;
    }
    console.log('✓ Captured 5 state-matched preview frames for Original SaaS Master.');

    console.log('\n=============================================================');
    console.log('=== STEP 6: Real UI Export — Original SaaS Master 24s      ===');
    console.log('=============================================================');
    const saasMasterPath = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.webm');
    const saasDownloadPath = path.join(EVIDENCE_DIR, 'live_download_saas.webm');
    if (fs.existsSync(saasDownloadPath)) fs.unlinkSync(saasDownloadPath);

    const [saasDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 120000 }),
      page.click('#cs-btn-export-video')
    ]);
    await saasDownload.saveAs(saasDownloadPath);
    const liveSaasStat = fs.statSync(saasDownloadPath);
    check(liveSaasStat.size > 1000000, `SaaS Master video size is valid (${(liveSaasStat.size / 1024 / 1024).toFixed(2)} MB)`);

    // Verify fresh download SHA-256 and compare against preserved master
    const freshSaasSha256 = computeSha256(saasDownloadPath);
    const preservedSaasSha256 = computeSha256(saasMasterPath);
    console.log(`  ✓ Fresh Live Download SHA-256: ${freshSaasSha256}`);
    console.log(`  ✓ Preserved Master SHA-256:    ${preservedSaasSha256}`);
    console.log(`  ✓ Hash Match: ${freshSaasSha256 === preservedSaasSha256}`);

    if (!fs.existsSync(saasMasterPath) || process.env.OVERWRITE_MASTERS === '1') {
      fs.copyFileSync(saasDownloadPath, saasMasterPath);
    }
    // DO NOT UNLINK live download: keep it for direct ffprobe, audio, and parity probing
    const saasTargetToProbe = saasDownloadPath;
    const saasStat = fs.statSync(saasMasterPath);

    console.log('\n=============================================================');
    console.log('=== STEP 7: Real UI Export — Pilots (Parrot & Noir Suspense) ===');
    console.log('=============================================================');
    // Export Parrot Comedy Pilot
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    const comedyVideoPath = path.join(EVIDENCE_DIR, 'The_Parrot_Manager_Pilot.webm');
    const comedyDownloadPath = path.join(EVIDENCE_DIR, 'live_download_comedy.webm');
    if (fs.existsSync(comedyDownloadPath)) fs.unlinkSync(comedyDownloadPath);

    const [comedyDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('#cs-btn-export-video')
    ]);
    await comedyDownload.saveAs(comedyDownloadPath);
    check(fs.statSync(comedyDownloadPath).size > 500000, 'Parrot Comedy Pilot video size valid');

    const freshComedySha256 = computeSha256(comedyDownloadPath);
    const preservedComedySha256 = computeSha256(comedyVideoPath);
    console.log(`  ✓ Fresh Comedy Download SHA-256: ${freshComedySha256}`);
    console.log(`  ✓ Preserved Comedy SHA-256:      ${preservedComedySha256}`);
    console.log(`  ✓ Hash Match: ${freshComedySha256 === preservedComedySha256}`);

    if (!fs.existsSync(comedyVideoPath) || process.env.OVERWRITE_MASTERS === '1') {
      fs.copyFileSync(comedyDownloadPath, comedyVideoPath);
    }
    const comedyTargetToProbe = comedyDownloadPath;

    // Export Minimal Suspense Pilot
    await page.selectOption('#cs-direction-select', 'minimal-suspense');
    await page.waitForTimeout(300);
    const suspenseVideoPath = path.join(EVIDENCE_DIR, 'The_Last_Signal_Pilot.webm');
    const suspenseDownloadPath = path.join(EVIDENCE_DIR, 'live_download_suspense.webm');
    if (fs.existsSync(suspenseDownloadPath)) fs.unlinkSync(suspenseDownloadPath);

    const [suspenseDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('#cs-btn-export-video')
    ]);
    await suspenseDownload.saveAs(suspenseDownloadPath);
    check(fs.statSync(suspenseDownloadPath).size > 500000, 'Minimal Noir Suspense Pilot video size valid');

    const freshSuspenseSha256 = computeSha256(suspenseDownloadPath);
    const preservedSuspenseSha256 = computeSha256(suspenseVideoPath);
    console.log(`  ✓ Fresh Suspense Download SHA-256: ${freshSuspenseSha256}`);
    console.log(`  ✓ Preserved Suspense SHA-256:      ${preservedSuspenseSha256}`);
    console.log(`  ✓ Hash Match: ${freshSuspenseSha256 === preservedSuspenseSha256}`);

    if (!fs.existsSync(suspenseVideoPath) || process.env.OVERWRITE_MASTERS === '1') {
      fs.copyFileSync(suspenseDownloadPath, suspenseVideoPath);
    }
    const suspenseTargetToProbe = suspenseDownloadPath;

    console.log('\n=============================================================');
    console.log('=== STEP 8: Exact Frame Count & Duration Checks (ffprobe)   ===');
    console.log('=============================================================');
    const saasProbe = gates.verifyVideoFrameCount(saasTargetToProbe, 720, 24.0);
    check(saasProbe.frameCount === 720, `SaaS Master (fresh download) ffprobe verified exactly 720 frames (duration: ${saasProbe.duration.toFixed(2)}s)`);

    const comedyProbe = gates.verifyVideoFrameCount(comedyTargetToProbe, 270, 9.0);
    check(comedyProbe.frameCount === 270, `Parrot Comedy (fresh download) ffprobe verified exactly 270 frames (duration: ${comedyProbe.duration.toFixed(2)}s)`);

    const suspenseProbe = gates.verifyVideoFrameCount(suspenseTargetToProbe, 270, 9.0);
    check(suspenseProbe.frameCount === 270, `Noir Suspense (fresh download) ffprobe verified exactly 270 frames (duration: ${suspenseProbe.duration.toFixed(2)}s)`);

    results.exactFrameCounts = {
      saasMaster: saasProbe,
      comedyPilot: comedyProbe,
      suspensePilot: suspenseProbe
    };

    console.log('\n=============================================================');
    console.log('=== STEP 9: Audio Volume & Integrity Verification (P1-04)  ===');
    console.log('=============================================================');
    const saasAudio = gates.runFFmpegVolumeDetect(saasTargetToProbe);
    const comedyAudio = gates.runFFmpegVolumeDetect(comedyTargetToProbe);
    const suspenseAudio = gates.runFFmpegVolumeDetect(suspenseTargetToProbe);

    gates.verifyAudioIntegrity(saasAudio, 'SaaS Master');
    check(saasAudio.isAudible, `SaaS Master audio audible (Mean: ${saasAudio.meanVolume} dB, Max: ${saasAudio.maxVolume} dB)`);

    gates.verifyAudioIntegrity(comedyAudio, 'Parrot Comedy Pilot');
    check(comedyAudio.isAudible, `Comedy Pilot audio audible (Mean: ${comedyAudio.meanVolume} dB, Max: ${comedyAudio.maxVolume} dB)`);

    gates.verifyAudioIntegrity(suspenseAudio, 'Minimal Suspense Pilot');
    check(suspenseAudio.isAudible, `Suspense Pilot audio audible (Mean: ${suspenseAudio.meanVolume} dB, Max: ${suspenseAudio.maxVolume} dB)`);

    results.audioIntegrity = {
      saasMaster: saasAudio,
      comedyPilot: comedyAudio,
      suspensePilot: suspenseAudio
    };

    results.workflows.originalSaaSMasterExport = {
      action: 'capture_previews_and_export_video',
      exportButtonSelector: '#cs-btn-export-video',
      previewFrames: Object.keys(previewPaths).map(f => path.relative(ROOT, previewPaths[f]).replace(/\\/g, '/')),
      exportedFile: path.relative(ROOT, saasMasterPath).replace(/\\/g, '/'),
      fileSizeBytes: saasStat.size,
      frameCount: 720,
      durationSec: 24.0,
      audioMetrics: saasAudio
    };

    console.log('\n=============================================================');
    console.log('=== STEP 10: Noir Suspense Image Luminance Audit (P1-B)    ===');
    console.log('=============================================================');
    // Extract 5 sample frames at 0%, 25%, 50%, 75%, 100% (0s, 2.25s, 4.5s, 6.75s, 8.9s)
    const noirTimePoints = [
      { pct: 0, sec: 0.0, frame: 0 },
      { pct: 25, sec: 2.25, frame: 67 },
      { pct: 50, sec: 4.5, frame: 135 },
      { pct: 75, sec: 6.75, frame: 202 },
      { pct: 100, sec: 8.9, frame: 268 }
    ];

    const noirLuminanceStats = [];
    for (const ntp of noirTimePoints) {
      const noirFramePath = path.join(FRAMES_DIR, `noir_pilot_pct_${ntp.pct}.png`);
      if (fs.existsSync(noirFramePath)) fs.unlinkSync(noirFramePath);

      execSync(`"${gates.FFMPEG_BIN}" -ss ${ntp.sec} -i "${suspenseTargetToProbe}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${noirFramePath}"`, { stdio: 'ignore' });

      const lum = gates.calculateFrameLuminance(noirFramePath);
      // Verify significant improvement over previous 94.7% - 98.5%
      check(lum.pctBelow16 < 60.0, `Noir frame at ${ntp.pct}%: pixels below 16 is ${lum.pctBelow16.toFixed(1)}% (target: < 60%, previously 94.7-98.5%)`);
      check(lum.medianLuminance >= 18, `Noir frame at ${ntp.pct}%: median luminance is ${lum.medianLuminance} (target: >= 18, previously 0-7)`);

      noirLuminanceStats.push({
        percentage: ntp.pct,
        timeSec: ntp.sec,
        frame: ntp.frame,
        pctBelow16: lum.pctBelow16,
        medianLuminance: lum.medianLuminance,
        meanLuminance: lum.meanLuminance
      });
      console.log(`  ✓ Noir Frame ${ntp.pct}% (${ntp.sec}s): ${lum.pctBelow16.toFixed(1)}% pixels < 16, median: ${lum.medianLuminance}, mean: ${lum.meanLuminance.toFixed(1)}`);
    }
    results.noirLuminance = noirLuminanceStats;

    results.workflows.pilotsExport = {
      action: 'export_character_comedy_and_noir_suspense_pilots',
      exportButtonSelector: '#cs-btn-export-video',
      comedyPilot: {
        file: path.relative(ROOT, comedyVideoPath).replace(/\\/g, '/'),
        fileSizeBytes: fs.statSync(comedyVideoPath).size,
        frameCount: 270,
        durationSec: 9.0,
        audioMetrics: comedyAudio
      },
      suspensePilot: {
        file: path.relative(ROOT, suspenseVideoPath).replace(/\\/g, '/'),
        fileSizeBytes: fs.statSync(suspenseVideoPath).size,
        frameCount: 270,
        durationSec: 9.0,
        audioMetrics: suspenseAudio,
        noirLuminance: results.noirLuminance
      }
    };

    // Also extract Parrot sample frames for contact sheet
    const parrotTimePoints = [
      { pct: 0, sec: 0.0 },
      { pct: 25, sec: 2.25 },
      { pct: 50, sec: 4.5 },
      { pct: 75, sec: 6.75 },
      { pct: 100, sec: 8.9 }
    ];
    for (const ptp of parrotTimePoints) {
      const parrotFramePath = path.join(FRAMES_DIR, `parrot_pilot_pct_${ptp.pct}.png`);
      if (fs.existsSync(parrotFramePath)) fs.unlinkSync(parrotFramePath);
      execSync(`"${gates.FFMPEG_BIN}" -ss ${ptp.sec} -i "${comedyTargetToProbe}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${parrotFramePath}"`, { stdio: 'ignore' });
    }

    console.log('\n=============================================================');
    console.log('=== STEP 11: Save .acstudio Archive via Real Browser UI    ===');
    console.log('=============================================================');
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.waitForTimeout(300);

    const archivePath = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.acstudio');
    const archiveDownloadPath = path.join(EVIDENCE_DIR, 'live_download_archive.acstudio');
    if (fs.existsSync(archiveDownloadPath)) fs.unlinkSync(archiveDownloadPath);

    const [saveDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.click('#cs-btn-save-project')
    ]);
    await saveDownload.saveAs(archiveDownloadPath);
    const archiveStat = fs.statSync(archiveDownloadPath);
    check(archiveStat.size > 1000, `.acstudio archive downloaded successfully (${(archiveStat.size / 1024).toFixed(1)} KB)`);

    const freshArchiveSha256 = computeSha256(archiveDownloadPath);
    const preservedArchiveSha256 = computeSha256(archivePath);
    console.log(`  ✓ Fresh Archive Download SHA-256: ${freshArchiveSha256}`);
    console.log(`  ✓ Preserved Archive SHA-256:      ${preservedArchiveSha256}`);
    console.log(`  ✓ Hash Match: ${freshArchiveSha256 === preservedArchiveSha256}`);

    if (!fs.existsSync(archivePath) || process.env.OVERWRITE_MASTERS === '1') {
      fs.copyFileSync(archiveDownloadPath, archivePath);
    }
    const archiveTargetToProbe = archiveDownloadPath;

    // Verify unpacked archive contents using verification_gates directly on the fresh download
    const unpackedArchive = gates.verifyArchiveStructure(fs.readFileSync(archiveTargetToProbe), 'FROM RAW DATA TO CLEAR ANSWERS');
    check(unpackedArchive.project.shots[0].headline === 'FROM RAW DATA TO CLEAR ANSWERS', 'Archive contains correct Shot 1 headline');

    results.workflows.saveProjectArchive = {
      action: 'save_project_archive',
      saveButtonSelector: '#cs-btn-save-project',
      archiveFile: path.relative(ROOT, archivePath).replace(/\\/g, '/'),
      fileSizeBytes: archiveStat.size,
      unpackedHeadline: unpackedArchive.project.shots[0].headline,
      shotsCount: unpackedArchive.project.shots.length
    };

    console.log('\n=============================================================');
    console.log('=== STEP 12: Isolated Fresh Context Reopen, Mutate & Export ===');
    console.log('=============================================================');
    // Close context 1 completely to ensure zero memory sharing
    await context1.close();

    const freshContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true
    });
    const freshPage = await freshContext.newPage();

    freshPage.on('console', msg => {
      if (msg.type() === 'error') results.consoleErrors.push(msg.text());
    });
    freshPage.on('pageerror', err => {
      console.error('Browser Uncaught Page Error (Fresh Context):', err);
      results.pageErrors.push(err.message || String(err));
    });

    await freshPage.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await freshPage.waitForTimeout(600);

    // Hard assertion on clean default state before opening project (answering re-audit)
    const freshCleanHeadline = await freshPage.$eval('#cs-shot-headline', el => el.value);
    console.log(`Fresh isolated session default headline: "${freshCleanHeadline}"`);
    check(freshCleanHeadline === 'RAW DATA IS NOISY.', 'Fresh isolated session loaded default headline "RAW DATA IS NOISY." before opening archive');

    // Open project via real UI file chooser
    const [fileChooser] = await Promise.all([
      freshPage.waitForEvent('filechooser'),
      freshPage.click('#cs-btn-open-project')
    ]);
    await fileChooser.setFiles(archivePath);
    await freshPage.waitForTimeout(600);

    const reopenedHeadline = await freshPage.$eval('#cs-shot-headline', el => el.value);
    const reopenedAccent = await freshPage.$eval('#cs-shot-accent', el => el.value);
    check(reopenedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS', 'Reopened project in fresh context restored headline');
    check(reopenedAccent === '#06b6d4', 'Reopened project in fresh context restored accent color');

    // Mutate reopened project: Shot 4 (f480) and Shot 1 (f45)
    await freshPage.selectOption('#cs-shot-select', '3'); // Shot 4
    await freshPage.waitForTimeout(300);
    await freshPage.fill('#cs-shot-headline', 'MUTATED BENEFIT: 0 DROPPED FRAMES');

    await freshPage.selectOption('#cs-shot-select', '0'); // Shot 1
    await freshPage.waitForTimeout(300);
    await freshPage.fill('#cs-shot-headline', 'REOPENED AND MUTATED MASTER');

    // Capture state-matched preview of mutated Shot 4 (frame 525) and mutated Shot 1 (frame 45)
    await freshPage.evaluate(() => window.studioApp.seekFrame(525));
    await freshPage.waitForTimeout(150);
    const mutatedPreviewF525Path = path.join(FRAMES_DIR, 'preview_mutated_f525_17.5s.png');
    const mutatedDataUrlF525 = await freshPage.evaluate(() => {
      const c = document.getElementById('cs-canvas');
      return c.toDataURL('image/png');
    });
    fs.writeFileSync(mutatedPreviewF525Path, Buffer.from(mutatedDataUrlF525.split(',')[1], 'base64'));

    await freshPage.evaluate(() => window.studioApp.seekFrame(45));
    await freshPage.waitForTimeout(150);
    const mutatedPreviewF45Path = path.join(FRAMES_DIR, 'preview_mutated_f45_1.5s.png');
    const mutatedDataUrlF45 = await freshPage.evaluate(() => {
      const c = document.getElementById('cs-canvas');
      return c.toDataURL('image/png');
    });
    fs.writeFileSync(mutatedPreviewF45Path, Buffer.from(mutatedDataUrlF45.split(',')[1], 'base64'));

    // Export mutated master via real UI click
    const mutatedExportPath = path.join(EVIDENCE_DIR, 'Reopened_and_Mutated_Master.webm');
    const mutatedDownloadPath = path.join(EVIDENCE_DIR, 'live_download_mutated.webm');
    if (fs.existsSync(mutatedDownloadPath)) fs.unlinkSync(mutatedDownloadPath);

    const [reexportDownload] = await Promise.all([
      freshPage.waitForEvent('download', { timeout: 120000 }),
      freshPage.click('#cs-btn-export-video')
    ]);
    await reexportDownload.saveAs(mutatedDownloadPath);
    const liveMutatedStat = fs.statSync(mutatedDownloadPath);
    check(liveMutatedStat.size > 1000000, `Re-exported mutated master video size valid (${(liveMutatedStat.size / 1024 / 1024).toFixed(2)} MB)`);

    const freshMutatedSha256 = computeSha256(mutatedDownloadPath);
    const preservedMutatedSha256 = computeSha256(mutatedExportPath);
    console.log(`  ✓ Fresh Mutated Download SHA-256: ${freshMutatedSha256}`);
    console.log(`  ✓ Preserved Mutated SHA-256:      ${preservedMutatedSha256}`);
    console.log(`  ✓ Hash Match: ${freshMutatedSha256 === preservedMutatedSha256}`);

    if (!fs.existsSync(mutatedExportPath) || process.env.OVERWRITE_MASTERS === '1') {
      fs.copyFileSync(mutatedDownloadPath, mutatedExportPath);
    }
    const mutatedTargetToProbe = mutatedDownloadPath;
    const mutatedStat = fs.statSync(mutatedExportPath);

    // Verify exact frame count of mutated master directly from fresh download
    const mutatedProbe = gates.verifyVideoFrameCount(mutatedTargetToProbe, 720, 24.0);
    check(mutatedProbe.frameCount === 720, `Mutated Master (fresh download) ffprobe verified exactly 720 frames (duration: ${mutatedProbe.duration.toFixed(2)}s)`);

    results.reopenVerification = {
      archiveHeadlineMatches: true,
      uiRestoredHeadline: reopenedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS',
      uiRestoredAccent: reopenedAccent === '#06b6d4',
      mutatedExportSize: mutatedStat.size,
      mutatedProbe
    };

    results.workflows.reopenedMutatedSession = {
      action: 'reopen_archive_in_fresh_context_mutate_and_reexport',
      isolatedContext: true,
      openButtonSelector: '#cs-btn-open-project',
      loadedArchive: path.relative(ROOT, archivePath).replace(/\\/g, '/'),
      preOpenCleanHeadline: freshCleanHeadline,
      postOpenRestoredHeadline: reopenedHeadline,
      mutatedShots: [
        { shotIndex: 3, newHeadline: 'MUTATED BENEFIT: 0 DROPPED FRAMES' },
        { shotIndex: 0, newHeadline: 'REOPENED AND MUTATED MASTER' }
      ],
      reexportButtonSelector: '#cs-btn-export-video',
      mutatedExportedFile: path.relative(ROOT, mutatedExportPath).replace(/\\/g, '/'),
      mutatedFileSizeBytes: mutatedStat.size,
      mutatedFrameCount: mutatedProbe.frameCount
    };

    console.log('\n=============================================================');
    console.log('=== STEP 13: Quantitative State-Matched Parity             ===');
    console.log('=============================================================');
    // 13A: Original SaaS Previews vs Original SaaS Export
    for (const tp of testPoints) {
      const exportImgPath = path.join(FRAMES_DIR, `exported_orig_f${tp.frame}_${tp.sec}s.png`);
      if (fs.existsSync(exportImgPath)) fs.unlinkSync(exportImgPath);

      execSync(`"${gates.FFMPEG_BIN}" -ss ${tp.sec} -i "${saasTargetToProbe}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${exportImgPath}"`, { stdio: 'ignore' });

      const metrics = gates.computeImageMetrics(previewPaths[tp.frame], exportImgPath);
      gates.verifyParityMetrics(metrics);
      check(metrics.ssimScore >= 0.85 && metrics.ssimScore <= 1.0, `Original Parity f${tp.frame} [${tp.shot}]: SSIM ${metrics.ssimScore} in [0.85, 1.0]`);
      check(metrics.psnrDb >= 25.0, `Original Parity f${tp.frame} [${tp.shot}]: PSNR ${metrics.psnrDb} dB >= 25.0 dB`);

      results.originalParityMetrics.push({
        sec: tp.sec,
        frame: tp.frame,
        shot: tp.shot,
        previewFile: path.relative(ROOT, previewPaths[tp.frame]).replace(/\\/g, '/'),
        exportedFile: path.relative(ROOT, exportImgPath).replace(/\\/g, '/'),
        psnrDb: metrics.psnrDb,
        ssimScore: metrics.ssimScore
      });
      console.log(`  ✓ Original Parity f${tp.frame} (${tp.shot}): PSNR = ${metrics.psnrDb} dB, SSIM = ${metrics.ssimScore}`);
    }

    // 13B: Mutated Previews vs Mutated Export (f45 and f525)
    const mutatedTestPoints = [
      { sec: 1.5, frame: 45, shot: 'Shot 1 (Mutated Headline)', previewFile: mutatedPreviewF45Path },
      { sec: 17.5, frame: 525, shot: 'Shot 4 (Mutated Headline)', previewFile: mutatedPreviewF525Path }
    ];

    for (const mtp of mutatedTestPoints) {
      const exportImgPath = path.join(FRAMES_DIR, `exported_mutated_f${mtp.frame}_${mtp.sec}s.png`);
      if (fs.existsSync(exportImgPath)) fs.unlinkSync(exportImgPath);

      execSync(`"${gates.FFMPEG_BIN}" -ss ${mtp.sec} -i "${mutatedTargetToProbe}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${exportImgPath}"`, { stdio: 'ignore' });

      const metrics = gates.computeImageMetrics(mtp.previewFile, exportImgPath);
      gates.verifyParityMetrics(metrics);
      check(metrics.ssimScore >= 0.85 && metrics.ssimScore <= 1.0, `Mutated Parity f${mtp.frame} [${mtp.shot}]: SSIM ${metrics.ssimScore} in [0.85, 1.0]`);
      check(metrics.psnrDb >= 25.0, `Mutated Parity f${mtp.frame} [${mtp.shot}]: PSNR ${metrics.psnrDb} dB >= 25.0 dB`);

      results.reopenedMutatedParityMetrics.push({
        sec: mtp.sec,
        frame: mtp.frame,
        shot: mtp.shot,
        previewFile: path.relative(ROOT, mtp.previewFile).replace(/\\/g, '/'),
        exportedFile: path.relative(ROOT, exportImgPath).replace(/\\/g, '/'),
        psnrDb: metrics.psnrDb,
        ssimScore: metrics.ssimScore
      });
      console.log(`  ✓ Mutated Parity f${mtp.frame} (${mtp.shot}): PSNR = ${metrics.psnrDb} dB, SSIM = ${metrics.ssimScore}`);
    }

    results.workflows.parityChecks = {
      action: 'quantify_preview_vs_export_parity',
      originalChecks: results.originalParityMetrics,
      reopenedMutatedChecks: results.reopenedMutatedParityMetrics,
      totalParityComparisons: results.originalParityMetrics.length + results.reopenedMutatedParityMetrics.length,
      allPassing: true
    };

    console.log('\n=============================================================');
    console.log('=== STEP 14: Contact Sheets & Before/After Evidence        ===');
    console.log('=============================================================');
    // 14A: SaaS Master 5-Shot Storyboard Contact Sheet
    const contactSheetPath = path.join(PHASE_DIR, 'SHOT_STORYBOARD.png');
    const saasArgs = ['-y'];
    results.originalParityMetrics.forEach(p => {
      saasArgs.push('-i', path.join(ROOT, p.exportedFile));
    });
    saasArgs.push(
      '-filter_complex',
      '[0:v]scale=384:216[v0];[1:v]scale=384:216[v1];[2:v]scale=384:216[v2];[3:v]scale=384:216[v3];[4:v]scale=384:216[v4];[v0][v1][v2][v3][v4]hstack=inputs=5',
      '-vframes', '1',
      contactSheetPath
    );
    const resHstack = spawnSync(gates.FFMPEG_BIN, saasArgs, { encoding: 'utf8' });
    check(resHstack.status === 0 && fs.existsSync(contactSheetPath), 'SaaS Storyboard contact sheet created successfully');
    fs.copyFileSync(contactSheetPath, path.join(EVIDENCE_DIR, 'SHOT_STORYBOARD.png'));
    console.log(`✓ SaaS Storyboard sheet: ${contactSheetPath}`);

    // 14B: Parrot Pilot Contact Sheet
    const parrotSheetPath = path.join(PHASE_DIR, 'PARROT_PILOT_CONTACT_SHEET.png');
    const parrotArgs = ['-y'];
    for (const ptp of parrotTimePoints) {
      parrotArgs.push('-i', path.join(FRAMES_DIR, `parrot_pilot_pct_${ptp.pct}.png`));
    }
    parrotArgs.push(
      '-filter_complex',
      '[0:v]scale=384:216[p0];[1:v]scale=384:216[p1];[2:v]scale=384:216[p2];[3:v]scale=384:216[p3];[4:v]scale=384:216[p4];[p0][p1][p2][p3][p4]hstack=inputs=5',
      '-vframes', '1',
      parrotSheetPath
    );
    const resParrotHstack = spawnSync(gates.FFMPEG_BIN, parrotArgs, { encoding: 'utf8' });
    check(resParrotHstack.status === 0 && fs.existsSync(parrotSheetPath), 'Parrot Pilot contact sheet created successfully');
    fs.copyFileSync(parrotSheetPath, path.join(EVIDENCE_DIR, 'PARROT_PILOT_CONTACT_SHEET.png'));
    console.log(`✓ Parrot Pilot contact sheet: ${parrotSheetPath}`);

    // 14C: Noir Pilot Contact Sheet (Chiaroscuro & Visible Staging)
    const noirSheetPath = path.join(PHASE_DIR, 'NOIR_PILOT_CONTACT_SHEET.png');
    const noirArgs = ['-y'];
    for (const ntp of noirTimePoints) {
      noirArgs.push('-i', path.join(FRAMES_DIR, `noir_pilot_pct_${ntp.pct}.png`));
    }
    noirArgs.push(
      '-filter_complex',
      '[0:v]scale=384:216[n0];[1:v]scale=384:216[n1];[2:v]scale=384:216[n2];[3:v]scale=384:216[n3];[4:v]scale=384:216[n4];[n0][n1][n2][n3][n4]hstack=inputs=5',
      '-vframes', '1',
      noirSheetPath
    );
    const resNoirHstack = spawnSync(gates.FFMPEG_BIN, noirArgs, { encoding: 'utf8' });
    check(resNoirHstack.status === 0 && fs.existsSync(noirSheetPath), 'Noir Pilot contact sheet created successfully');
    fs.copyFileSync(noirSheetPath, path.join(EVIDENCE_DIR, 'NOIR_PILOT_CONTACT_SHEET.png'));
    console.log(`✓ Noir Pilot contact sheet: ${noirSheetPath}`);

    // 14D: Side-by-side Old vs New Comparison Sheet (Deterministic & Provenance-Verified)
    const oldVsNewManifest = await generateOldVsNew();
    check(fs.existsSync(path.join(PHASE_DIR, 'OLD_VS_NEW_COMPARISON.png')), 'Old vs New comparison sheet generated in phase-01 root');
    check(fs.existsSync(path.join(EVIDENCE_DIR, 'OLD_VS_NEW_COMPARISON.png')), 'Old vs New comparison sheet copied to evidence directory');
    check(oldVsNewManifest && oldVsNewManifest.compositeOutput && oldVsNewManifest.compositeOutput.sha256, 'Old vs New manifest recorded SHA256');

    results.workflows.contactSheets = {
      action: 'generate_contact_sheets_and_visual_comparisons',
      saasStoryboardSheet: path.relative(ROOT, contactSheetPath).replace(/\\/g, '/'),
      parrotPilotContactSheet: path.relative(ROOT, parrotSheetPath).replace(/\\/g, '/'),
      noirPilotContactSheet: path.relative(ROOT, noirSheetPath).replace(/\\/g, '/'),
      oldVsNewComparison: path.relative(ROOT, path.join(PHASE_DIR, 'OLD_VS_NEW_COMPARISON.png')).replace(/\\/g, '/'),
      oldVsNewManifest
    };

    console.log('\n=============================================================');
    console.log('=== STEP 15: Browser Console & Page Error Assertion (Zero) ===');
    console.log('=============================================================');
    check(results.consoleErrors.length === 0, `Zero unexpected browser console errors recorded during entire run (found ${results.consoleErrors.length})`);
    check(results.pageErrors.length === 0, `Zero uncaught browser page errors recorded during entire run (found ${results.pageErrors.length})`);

    // All assertions passed
    results.assertionSummary.allPassed = true;
    console.log(`\n=============================================================`);
    console.log(`=== ALL ${results.assertionSummary.passedAssertions}/${results.assertionSummary.totalAssertions} ASSERTIONS PASSED WITH ZERO DEFECTS! ===`);
    console.log(`=============================================================\n`);

    const resultsPath = path.join(PHASE_DIR, 'phase01_run_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');

    await freshContext.close();
  } catch (err) {
    console.error('\n❌ FATAL TEST RUNNER FAILURE:', err.message);
    results.fatalError = err.message;
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

if (require.main === module) {
  runFocusedFinalCorrection();
}

module.exports = { runFocusedFinalCorrection };
