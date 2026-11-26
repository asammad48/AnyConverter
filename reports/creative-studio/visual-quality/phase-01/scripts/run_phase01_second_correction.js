/**
 * AnyConverter Creative Studio — Phase 01 Second Correction Verification Runner
 *
 * Implements strict end-to-end verification answering all re-audit requirements:
 * 1. P0-A: Strict SSIM parsing (All:[0-1].\d+) ensuring SSIM in [0, 1].
 * 2. P0-B: State-matched parity — comparing exact preview captures against corresponding exports for both original and mutated states.
 * 3. P1-C: Full-range color preservation in frame extraction via FFmpeg scale=in_range=full:out_range=full.
 * 4. P1-D: Truly isolated fresh browser context for reopening .acstudio archives.
 * 5. P1-E: Hard Node assertions on all gates with process.exitCode = 1 on any failure.
 * 6. P1-F: Character comedy and noir suspense pilot exports with verified audible audio tracks.
 * 7. P2-G: Verification of contextual editor UI (hidden 2D controls in video mode).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execSync, spawnSync } = require('child_process');
const { chromium } = require('playwright-core');
const ffmpeg = require('ffmpeg-static');

const PORT = 3000;
const ROOT = process.cwd();
const Archive = require(path.join(ROOT, 'assets/js/creative-studio/archive.js'));
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

function runFFmpegVolumeDetect(videoPath) {
  try {
    const res = spawnSync(ffmpeg, ['-i', videoPath, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
    const output = (res.stderr || '') + (res.stdout || '');
    return parseVolumeDetect(output);
  } catch (err) {
    return parseVolumeDetect(err.message || '');
  }
}

function parseVolumeDetect(output) {
  let meanVolume = null;
  let maxVolume = null;
  const meanMatch = output.match(/mean_volume:\s*([-\d.]+)\s*dB/);
  const maxMatch = output.match(/max_volume:\s*([-\d.]+)\s*dB/);
  if (meanMatch) meanVolume = parseFloat(meanMatch[1]);
  if (maxMatch) maxVolume = parseFloat(maxMatch[1]);
  return {
    meanVolume,
    maxVolume,
    isAudible: maxVolume !== null && maxVolume > -50 && meanVolume > -60,
    rawText: output.split('\n').filter(l => l.includes('volume')).join('\n')
  };
}

/**
 * Computes PSNR and SSIM between two PNG images using FFmpeg.
 * Strictly parses SSIM in [0, 1] without confusing it with logarithmic dB.
 */
function computeImageMetrics(imgPath1, imgPath2) {
  try {
    const resPsnr = spawnSync(ffmpeg, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
    const psnrOutput = (resPsnr.stderr || '') + (resPsnr.stdout || '');

    const resSsim = spawnSync(ffmpeg, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' });
    const ssimOutput = (resSsim.stderr || '') + (resSsim.stdout || '');

    // Parse PSNR average
    let psnrAverage = null;
    const psnrMatch = psnrOutput.match(/average:([-\d.inf]+)/);
    if (psnrMatch) {
      psnrAverage = psnrMatch[1] === 'inf' ? 99.99 : parseFloat(psnrMatch[1]);
    }

    // Parse SSIM strictly: All:0.XXXXXX ([dB]) -> capture group 1 (linear [0, 1])
    let ssimAll = null;
    const ssimMatch = ssimOutput.match(/All:([0-1]\.\d+)/);
    if (ssimMatch) {
      ssimAll = parseFloat(ssimMatch[1]);
    } else {
      // Fallback format: All:1.000000
      const ssimOneMatch = ssimOutput.match(/All:(1(?:\.0+)?)/);
      if (ssimOneMatch) ssimAll = 1.0;
    }

    assert(ssimAll !== null, `Failed to parse SSIM from FFmpeg output: ${ssimOutput}`);
    assert(ssimAll >= 0 && ssimAll <= 1.0, `SSIM score ${ssimAll} is out of bounds [0, 1]`);

    return {
      psnrDb: psnrAverage,
      ssimScore: ssimAll
    };
  } catch (err) {
    console.error('Metrics computation failed:', err.message);
    throw err;
  }
}

async function runSecondCorrection() {
  const server = await createStaticServer();
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });

  const results = {
    timestamp: new Date().toISOString(),
    auditProfile: 'Phase01_Second_Correction_Cycle',
    workflows: {},
    contextualUI: {},
    audioIntegrity: {},
    statePreservation: {},
    originalParityMetrics: [],
    reopenedMutatedParityMetrics: [],
    reopenVerification: {},
    assertionSummary: {
      totalAssertions: 0,
      passedAssertions: 0,
      allPassed: false
    },
    consoleErrors: []
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

    await page.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const initialScreenshot = path.join(SCREENSHOTS_DIR, '01_initial_studio_desktop.png');
    await page.screenshot({ path: initialScreenshot, fullPage: true });

    // Verify Contextual UI: in video mode, legacy layer inputs and presets must be hidden
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

    console.log('\n=============================================================');
    console.log('=== STEP 4: State-Matched Preview Capture (Original SaaS) ===');
    console.log('=============================================================');
    // Capture previews across all 5 shots before export so preview matches export state exactly
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
    console.log('=== STEP 5: Real UI Export — Original SaaS Master 24s      ===');
    console.log('=============================================================');
    const saasMasterPath = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.webm');
    if (fs.existsSync(saasMasterPath)) fs.unlinkSync(saasMasterPath);

    const [saasDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 120000 }),
      page.click('#cs-btn-export-video')
    ]);
    await saasDownload.saveAs(saasMasterPath);
    const saasStat = fs.statSync(saasMasterPath);
    check(saasStat.size > 1000000, `SaaS Master video size is valid (${(saasStat.size / 1024 / 1024).toFixed(2)} MB)`);

    console.log('\n=============================================================');
    console.log('=== STEP 6: Real UI Export — Pilots (Parrot & Noir Suspense) ===');
    console.log('=============================================================');
    // Export Parrot Comedy Pilot
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    const comedyVideoPath = path.join(EVIDENCE_DIR, 'The_Parrot_Manager_Pilot.webm');
    if (fs.existsSync(comedyVideoPath)) fs.unlinkSync(comedyVideoPath);
    const [comedyDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('#cs-btn-export-video')
    ]);
    await comedyDownload.saveAs(comedyVideoPath);
    check(fs.statSync(comedyVideoPath).size > 500000, 'Parrot Comedy Pilot video size valid');

    // Export Minimal Suspense Pilot
    await page.selectOption('#cs-direction-select', 'minimal-suspense');
    await page.waitForTimeout(300);
    const suspenseVideoPath = path.join(EVIDENCE_DIR, 'The_Last_Signal_Pilot.webm');
    if (fs.existsSync(suspenseVideoPath)) fs.unlinkSync(suspenseVideoPath);
    const [suspenseDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.click('#cs-btn-export-video')
    ]);
    await suspenseDownload.saveAs(suspenseVideoPath);
    check(fs.statSync(suspenseVideoPath).size > 500000, 'Minimal Noir Suspense Pilot video size valid');

    console.log('\n=============================================================');
    console.log('=== STEP 7: Audio Volume & Integrity Verification (P1-04)  ===');
    console.log('=============================================================');
    const saasAudio = runFFmpegVolumeDetect(saasMasterPath);
    const comedyAudio = runFFmpegVolumeDetect(comedyVideoPath);
    const suspenseAudio = runFFmpegVolumeDetect(suspenseVideoPath);

    check(saasAudio.isAudible, `SaaS Master audio is audible (Mean: ${saasAudio.meanVolume} dB, Max: ${saasAudio.maxVolume} dB)`);
    check(comedyAudio.isAudible, `Comedy Pilot audio is audible (Mean: ${comedyAudio.meanVolume} dB, Max: ${comedyAudio.maxVolume} dB)`);
    check(suspenseAudio.isAudible, `Suspense Pilot audio is audible (Mean: ${suspenseAudio.meanVolume} dB, Max: ${suspenseAudio.maxVolume} dB)`);

    results.audioIntegrity = {
      saasMaster: saasAudio,
      comedyPilot: comedyAudio,
      suspensePilot: suspenseAudio
    };

    console.log('\n=============================================================');
    console.log('=== STEP 8: Save .acstudio Archive via Real Browser UI     ===');
    console.log('=============================================================');
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.waitForTimeout(300);

    const archivePath = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.acstudio');
    if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);

    const [saveDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.click('#cs-btn-save-project')
    ]);
    await saveDownload.saveAs(archivePath);
    const archiveStat = fs.statSync(archivePath);
    check(archiveStat.size > 1000, `.acstudio archive downloaded successfully (${(archiveStat.size / 1024).toFixed(1)} KB)`);

    // Verify unpacked archive contents in Node
    const unpacker = new Archive.AcStudioArchive();
    const unpacked = unpacker.unpackage(fs.readFileSync(archivePath));
    const archiveSavedHeadline = unpacked.project.shots[0].headline;
    check(archiveSavedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS', 'Archive contains correct Shot 1 headline');

    console.log('\n=============================================================');
    console.log('=== STEP 9: Isolated Fresh Context Reopen, Mutate & Re-export ===');
    console.log('=============================================================');
    // Close context 1 completely to ensure zero memory sharing (P1-D)
    await context1.close();

    const freshContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true
    });
    const freshPage = await freshContext.newPage();

    freshPage.on('console', msg => {
      if (msg.type() === 'error') results.consoleErrors.push(msg.text());
    });

    await freshPage.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await freshPage.waitForTimeout(600);

    // Verify default clean load before opening archive
    const freshCleanHeadline = await freshPage.$eval('#cs-shot-headline', el => el.value);
    console.log(`Fresh isolated session default headline: "${freshCleanHeadline}"`);

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

    // Mutate reopened project: Mutate Shot 4 (f480) and Shot 1 (f45)
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
    if (fs.existsSync(mutatedExportPath)) fs.unlinkSync(mutatedExportPath);

    const [reexportDownload] = await Promise.all([
      freshPage.waitForEvent('download', { timeout: 120000 }),
      freshPage.click('#cs-btn-export-video')
    ]);
    await reexportDownload.saveAs(mutatedExportPath);
    const mutatedStat = fs.statSync(mutatedExportPath);
    check(mutatedStat.size > 1000000, `Re-exported mutated master video size valid (${(mutatedStat.size / 1024 / 1024).toFixed(2)} MB)`);

    results.reopenVerification = {
      archiveHeadlineMatches: archiveSavedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS',
      uiRestoredHeadline: reopenedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS',
      uiRestoredAccent: reopenedAccent === '#06b6d4',
      mutatedExportSize: mutatedStat.size
    };

    console.log('\n=============================================================');
    console.log('=== STEP 10: Quantitative State-Matched Parity (P0-A, P0-B, P1-C) ===');
    console.log('=============================================================');

    // 10A: Compare Original SaaS Previews against Original SaaS Export
    for (const tp of testPoints) {
      const exportImgPath = path.join(FRAMES_DIR, `exported_orig_f${tp.frame}_${tp.sec}s.png`);
      if (fs.existsSync(exportImgPath)) fs.unlinkSync(exportImgPath);

      // Extract frame with scale=in_range=full:out_range=full to preserve color matrix and dynamic range
      execSync(`"${ffmpeg}" -ss ${tp.sec} -i "${saasMasterPath}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${exportImgPath}"`, { stdio: 'ignore' });

      const metrics = computeImageMetrics(previewPaths[tp.frame], exportImgPath);
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
      console.log(`  ✓ Original State Parity f${tp.frame} (${tp.shot}): PSNR = ${metrics.psnrDb} dB, SSIM = ${metrics.ssimScore}`);
    }

    // 10B: Compare Mutated Previews against Mutated Export (Shot 1 f45 and Shot 4 f525)
    const mutatedTestPoints = [
      { sec: 1.5, frame: 45, shot: 'Shot 1 (Mutated Headline)', previewFile: mutatedPreviewF45Path },
      { sec: 17.5, frame: 525, shot: 'Shot 4 (Mutated Headline)', previewFile: mutatedPreviewF525Path }
    ];

    for (const mtp of mutatedTestPoints) {
      const exportImgPath = path.join(FRAMES_DIR, `exported_mutated_f${mtp.frame}_${mtp.sec}s.png`);
      if (fs.existsSync(exportImgPath)) fs.unlinkSync(exportImgPath);

      execSync(`"${ffmpeg}" -ss ${mtp.sec} -i "${mutatedExportPath}" -vf "scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709" -vframes 1 -q:v 2 "${exportImgPath}"`, { stdio: 'ignore' });

      const metrics = computeImageMetrics(mtp.previewFile, exportImgPath);
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
      console.log(`  ✓ Mutated State Parity f${mtp.frame} (${mtp.shot}): PSNR = ${metrics.psnrDb} dB, SSIM = ${metrics.ssimScore}`);
    }

    console.log('\n=============================================================');
    console.log('=== STEP 11: Storyboard Contact Sheet Generation          ===');
    console.log('=============================================================');
    const contactSheetPath = path.join(PHASE_DIR, 'SHOT_STORYBOARD.png');
    const args = ['-y'];
    results.originalParityMetrics.forEach(p => {
      args.push('-i', path.join(ROOT, p.exportedFile));
    });
    args.push(
      '-filter_complex',
      '[0:v]scale=384:216[v0];[1:v]scale=384:216[v1];[2:v]scale=384:216[v2];[3:v]scale=384:216[v3];[4:v]scale=384:216[v4];[v0][v1][v2][v3][v4]hstack=inputs=5',
      '-vframes', '1',
      contactSheetPath
    );
    const resHstack = spawnSync(ffmpeg, args, { encoding: 'utf8' });
    check(resHstack.status === 0 && fs.existsSync(contactSheetPath), 'Storyboard contact sheet created successfully');
    console.log(`✓ Storyboard contact sheet: ${contactSheetPath}`);

    // All assertions passed!
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

runSecondCorrection();
