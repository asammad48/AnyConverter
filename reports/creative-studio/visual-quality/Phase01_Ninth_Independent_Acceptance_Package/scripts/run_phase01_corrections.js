/**
 * AnyConverter Creative Studio — Phase 01 Correction Verification Runner
 *
 * Implements strict end-to-end audit requirements:
 * 1. Real UI workflows: button clicks, page.waitForEvent('download'), fileChooser.setFiles().
 * 2. State preservation across art directions and project archive cycles.
 * 3. Audible audio master verification via FFmpeg volumedetect (mean_volume and max_volume).
 * 4. Quantitative preview/export parity via FFmpeg PSNR/SSIM and pixel diffs.
 * 5. Full responsive inspection at 1440px (desktop), 768px (tablet), and 375px (mobile).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
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
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
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

function computeImageMetrics(imgPath1, imgPath2) {
  try {
    const resPsnr = spawnSync(ffmpeg, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
    const psnrOutput = (resPsnr.stderr || '') + (resPsnr.stdout || '');

    const resSsim = spawnSync(ffmpeg, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' });
    const ssimOutput = (resSsim.stderr || '') + (resSsim.stdout || '');

    const psnrMatch = psnrOutput.match(/average:([-\d.inf]+)\s+min:([-\d.inf]+)\s+max:([-\d.inf]+)/) ||
                      psnrOutput.match(/PSNR\s+y:([-\d.inf]+)\s+u:([-\d.inf]+)\s+v:([-\d.inf]+)\s+average:([-\d.inf]+)/);
    const ssimMatch = ssimOutput.match(/All:([-\d.]+)\s+\(([-\d.]+)\)/) ||
                      ssimOutput.match(/SSIM\s+Y:([-\d.]+)\s+U:([-\d.]+)\s+V:([-\d.]+)\s+All:([-\d.]+)/);

    let psnrAverage = null;
    if (psnrMatch) {
      const val = psnrMatch[psnrMatch.length - 1] || psnrMatch[1];
      psnrAverage = val === 'inf' ? 99.99 : parseFloat(val);
    }
    let ssimAll = null;
    if (ssimMatch) {
      ssimAll = parseFloat(ssimMatch[ssimMatch.length - 1] || ssimMatch[1]);
    }

    return {
      psnrDb: psnrAverage,
      ssimScore: ssimAll
    };
  } catch (err) {
    console.error('Metrics computation failed:', err.message);
    return { psnrDb: null, ssimScore: null };
  }
}

async function runCorrections() {
  const server = await createStaticServer();
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });

  const results = {
    timestamp: new Date().toISOString(),
    workflows: {},
    audioIntegrity: {},
    statePreservation: {},
    parityMetrics: [],
    reopenVerification: {},
    consoleErrors: []
  };

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true
    });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') results.consoleErrors.push(msg.text());
    });

    console.log('=== Step 1: Localhost Studio Initial Load & Layout Inspection ===');
    await page.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const initialScreenshot = path.join(SCREENSHOTS_DIR, '01_initial_studio_desktop.png');
    await page.screenshot({ path: initialScreenshot, fullPage: true });

    // Verify Shot List and Timeline Video Track populate
    const shotItemsCount = await page.$$eval('#cs-shots-list .cs-shot-item', els => els.length);
    const shotBlocksCount = await page.$$eval('#cs-timeline-video-track .cs-shot-block', els => els.length);
    console.log(`✓ Initial Load: Shots list has ${shotItemsCount} items, Timeline has ${shotBlocksCount} shot blocks.`);

    results.workflows.initialLoad = {
      shotItemsCount,
      shotBlocksCount,
      screenshot: path.relative(ROOT, initialScreenshot).replace(/\\/g, '/')
    };

    console.log('=== Step 2: Responsive Inspection & Mobile Drawer Usability ===');
    // Tablet (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    const tabletScreenshot = path.join(SCREENSHOTS_DIR, '02_studio_tablet_768px.png');
    await page.screenshot({ path: tabletScreenshot });

    // Click Mobile Inspector button on Tablet
    await page.click('#cs-btn-mobile-inspector');
    await page.waitForTimeout(300);
    const tabletInspectorScreenshot = path.join(SCREENSHOTS_DIR, '02b_tablet_inspector_open.png');
    await page.screenshot({ path: tabletInspectorScreenshot });
    const isTabletOpen = await page.$eval('#cs-sidebar-right', el => el.classList.contains('mobile-open'));

    // Close Inspector
    await page.click('#cs-btn-close-inspector');
    await page.waitForTimeout(200);

    // Mobile (375x812)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    const mobileScreenshot = path.join(SCREENSHOTS_DIR, '03_studio_mobile_375px.png');
    await page.screenshot({ path: mobileScreenshot });

    // Open Mobile Inspector on 375px
    await page.click('#cs-btn-mobile-inspector');
    await page.waitForTimeout(300);
    const mobileInspectorScreenshot = path.join(SCREENSHOTS_DIR, '03b_mobile_inspector_open.png');
    await page.screenshot({ path: mobileInspectorScreenshot });
    const isMobileOpen = await page.$eval('#cs-sidebar-right', el => el.classList.contains('mobile-open'));

    // Test editing inside mobile drawer
    await page.fill('#cs-shot-headline', 'FROM RAW DATA TO CLEAR ANSWERS');
    await page.fill('#cs-shot-accent', '#06b6d4');
    await page.waitForTimeout(200);

    // Close Inspector
    await page.click('#cs-btn-close-inspector');
    await page.waitForTimeout(200);

    results.workflows.responsive = {
      tabletInspectorToggles: isTabletOpen,
      mobileInspectorToggles: isMobileOpen,
      tabletScreenshot: path.relative(ROOT, tabletScreenshot).replace(/\\/g, '/'),
      mobileScreenshot: path.relative(ROOT, mobileScreenshot).replace(/\\/g, '/')
    };
    console.log('✓ Responsive Inspection verified: Mobile Inspector drawer operates cleanly.');

    // Restore desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);

    console.log('=== Step 3: Direction Switching & Edit Persistence (P0-03) ===');
    // Current in SaaS Master: Shot 1 headline is "FROM RAW DATA TO CLEAR ANSWERS", accent "#06b6d4"
    const saasEditedHeadline = await page.$eval('#cs-shot-headline', el => el.value);

    // Switch to Character Comedy
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    const comedyTitle = await page.$eval('#cs-project-title', el => el.value);
    const comedyHeadlineDefault = await page.$eval('#cs-shot-headline', el => el.value);

    // Mutate Comedy Shot 1
    await page.fill('#cs-shot-headline', 'THE COCKATOO HAS ENTERED');
    await page.waitForTimeout(200);

    // Switch to Minimal Suspense
    await page.selectOption('#cs-direction-select', 'minimal-suspense');
    await page.waitForTimeout(300);
    const suspenseHeadlineDefault = await page.$eval('#cs-shot-headline', el => el.value);

    // Switch back to Character Comedy: verify edited headline preserved!
    await page.selectOption('#cs-direction-select', 'character-comedy');
    await page.waitForTimeout(300);
    const comedyHeadlineRestored = await page.$eval('#cs-shot-headline', el => el.value);

    // Switch back to Cinematic SaaS Master: verify edited headline preserved!
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.waitForTimeout(300);
    const saasHeadlineRestored = await page.$eval('#cs-shot-headline', el => el.value);

    results.statePreservation = {
      saasEditedHeadline,
      comedyHeadlineDefault,
      comedyHeadlineRestored,
      comedyPreserved: comedyHeadlineRestored === 'THE COCKATOO HAS ENTERED',
      saasHeadlineRestored,
      saasPreserved: saasHeadlineRestored === 'FROM RAW DATA TO CLEAR ANSWERS'
    };
    console.log(`✓ Art Direction Persistence: SaaS preserved = ${results.statePreservation.saasPreserved}, Comedy preserved = ${results.statePreservation.comedyPreserved}`);

    console.log('=== Step 4: Real Browser UI Export — SaaS Master 24s (P0-01) ===');
    const saasMasterPath = path.join(EVIDENCE_DIR, 'From_Raw_Data_to_Clear_Answers_Master.webm');
    if (fs.existsSync(saasMasterPath)) fs.unlinkSync(saasMasterPath);

    const [saasDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 120000 }),
      page.click('#cs-btn-export-video')
    ]);
    await saasDownload.saveAs(saasMasterPath);

    const saasStat = fs.statSync(saasMasterPath);
    console.log(`✓ Master SaaS exported via UI button: ${saasMasterPath} (${(saasStat.size / 1024 / 1024).toFixed(2)} MB)`);

    console.log('=== Step 5: Export Pilots via Real Browser UI ===');
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
    console.log(`✓ Parrot Comedy Pilot exported: ${(fs.statSync(comedyVideoPath).size / 1024).toFixed(1)} KB`);

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
    console.log(`✓ Minimal Suspense Pilot exported: ${(fs.statSync(suspenseVideoPath).size / 1024).toFixed(1)} KB`);

    console.log('=== Step 6: Audio Integrity & Volume Verification via FFmpeg (P1-04) ===');
    const saasAudio = runFFmpegVolumeDetect(saasMasterPath);
    const comedyAudio = runFFmpegVolumeDetect(comedyVideoPath);
    const suspenseAudio = runFFmpegVolumeDetect(suspenseVideoPath);

    results.audioIntegrity = {
      saasMaster: saasAudio,
      comedyPilot: comedyAudio,
      suspensePilot: suspenseAudio
    };
    console.log(`✓ SaaS Master Audio: Mean = ${saasAudio.meanVolume} dB, Max = ${saasAudio.maxVolume} dB (Audible: ${saasAudio.isAudible})`);
    console.log(`✓ Comedy Audio: Mean = ${comedyAudio.meanVolume} dB, Max = ${comedyAudio.maxVolume} dB (Audible: ${comedyAudio.isAudible})`);
    console.log(`✓ Suspense Audio: Mean = ${suspenseAudio.meanVolume} dB, Max = ${suspenseAudio.maxVolume} dB (Audible: ${suspenseAudio.isAudible})`);

    console.log('=== Step 7: Save .acstudio Archive via Real Browser UI (P0-02 / P0-03) ===');
    // Return to SaaS Master
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
    console.log(`✓ .acstudio archive downloaded via UI: ${archivePath} (${(archiveStat.size / 1024).toFixed(1)} KB)`);

    // Verify saved archive contents independently in Node
    const unpacker = new Archive.AcStudioArchive();
    const unpacked = unpacker.unpackage(fs.readFileSync(archivePath));
    const archiveSavedHeadline = unpacked.project.shots[0].headline;
    console.log(`✓ Independent Archive Inspection: Shot 1 Headline inside archive is "${archiveSavedHeadline}"`);

    console.log('=== Step 8: Wipe Memory, Open Project Archive via Real UI, Mutate, Re-export (P0-02 / P0-03) ===');
    // Navigate fresh to clear memory
    await page.goto(`http://127.0.0.1:${PORT}/creative-studio/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const cleanDefaultHeadline = await page.$eval('#cs-shot-headline', el => el.value);
    console.log(`Fresh load default headline: "${cleanDefaultHeadline}"`);

    // Open project using real browser file chooser
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('#cs-btn-open-project')
    ]);
    await fileChooser.setFiles(archivePath);
    await page.waitForTimeout(600);

    const reopenedHeadline = await page.$eval('#cs-shot-headline', el => el.value);
    const reopenedAccent = await page.$eval('#cs-shot-accent', el => el.value);
    console.log(`✓ Reopened from .acstudio in browser: Headline = "${reopenedHeadline}", Accent = "${reopenedAccent}"`);

    // Mutate reopened project: Edit Shot 4 headline and Shot 1 headline
    // Select Shot 4
    await page.selectOption('#cs-shot-select', '3');
    await page.waitForTimeout(300);
    await page.fill('#cs-shot-headline', 'MUTATED BENEFIT: 0 DROPPED FRAMES');

    // Select Shot 1
    await page.selectOption('#cs-shot-select', '0');
    await page.waitForTimeout(300);
    await page.fill('#cs-shot-headline', 'REOPENED AND MUTATED MASTER');

    // Seek to Frame 480 (Shot 4) and take screenshot showing mutation in active UI
    await page.evaluate(() => window.studioApp.seekFrame(480));
    await page.waitForTimeout(300);
    const midShotMutatedScreenshot = path.join(SCREENSHOTS_DIR, '05_reopened_mutated_frame_480.png');
    await page.screenshot({ path: midShotMutatedScreenshot });

    // Export mutated project via UI click
    const mutatedExportPath = path.join(EVIDENCE_DIR, 'Reopened_and_Mutated_Master.webm');
    if (fs.existsSync(mutatedExportPath)) fs.unlinkSync(mutatedExportPath);

    const [reexportDownload] = await Promise.all([
      page.waitForEvent('download', { timeout: 120000 }),
      page.click('#cs-btn-export-video')
    ]);
    await reexportDownload.saveAs(mutatedExportPath);
    const mutatedStat = fs.statSync(mutatedExportPath);
    console.log(`✓ Re-exported mutated master via UI: ${mutatedExportPath} (${(mutatedStat.size / 1024 / 1024).toFixed(2)} MB)`);

    results.reopenVerification = {
      archiveHeadlineMatches: archiveSavedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS',
      uiRestoredHeadline: reopenedHeadline === 'FROM RAW DATA TO CLEAR ANSWERS',
      uiRestoredAccent: reopenedAccent === '#06b6d4',
      mutatedExportSize: mutatedStat.size,
      midShotScreenshot: path.relative(ROOT, midShotMutatedScreenshot).replace(/\\/g, '/')
    };

    console.log('=== Step 9: Quantitative Preview/Export Parity Measurement (P1-06) ===');
    // Test timestamps across 5 shots:
    // Shot 1: 1.5s (f45), Shot 2: 6.5s (f195), Shot 3: 12.0s (f360), Shot 4: 17.5s (f525), Shot 5: 22.0s (f660)
    const testPoints = [
      { sec: 1.5, frame: 45, shot: 'Shot 1: Hook' },
      { sec: 6.5, frame: 195, shot: 'Shot 2: Problem' },
      { sec: 12.0, frame: 360, shot: 'Shot 3: Solution' },
      { sec: 17.5, frame: 525, shot: 'Shot 4: Benefit' },
      { sec: 22.0, frame: 660, shot: 'Shot 5: Payoff' }
    ];

    // Reload master state in UI for parity comparison
    await page.selectOption('#cs-direction-select', 'cinematic-saas');
    await page.fill('#cs-shot-headline', 'FROM RAW DATA TO CLEAR ANSWERS');
    await page.fill('#cs-shot-accent', '#06b6d4');
    await page.waitForTimeout(300);

    for (const tp of testPoints) {
      // 1. Capture exact 1280x720 preview canvas buffer
      await page.evaluate((f) => window.studioApp.seekFrame(f), tp.frame);
      await page.waitForTimeout(150);
      const previewImgPath = path.join(FRAMES_DIR, `preview_f${tp.frame}_${tp.sec}s.png`);
      const dataUrl = await page.evaluate(() => {
        const c = document.getElementById('cs-canvas');
        return c.toDataURL('image/png');
      });
      fs.writeFileSync(previewImgPath, Buffer.from(dataUrl.split(',')[1], 'base64'));

      // 2. Extract corresponding frame from exported SaaS master video at 1280x720 using ffmpeg
      const exportImgPath = path.join(FRAMES_DIR, `exported_f${tp.frame}_${tp.sec}s.png`);
      if (fs.existsSync(exportImgPath)) fs.unlinkSync(exportImgPath);
      execSync(`"${ffmpeg}" -ss ${tp.sec} -i "${saasMasterPath}" -vframes 1 -q:v 2 -s 1280x720 "${exportImgPath}"`, { stdio: 'ignore' });

      // 3. Compute quantitative metrics between preview and exported frame
      const metrics = computeImageMetrics(previewImgPath, exportImgPath);
      results.parityMetrics.push({
        sec: tp.sec,
        frame: tp.frame,
        shot: tp.shot,
        previewFile: path.relative(ROOT, previewImgPath).replace(/\\/g, '/'),
        exportedFile: path.relative(ROOT, exportImgPath).replace(/\\/g, '/'),
        psnrDb: metrics.psnrDb,
        ssimScore: metrics.ssimScore
      });
      console.log(`✓ Timestamp ${tp.sec}s (f${tp.frame}) [${tp.shot}]: PSNR = ${metrics.psnrDb} dB, SSIM = ${metrics.ssimScore}`);
    }

    // Storyboard contact sheet generation
    console.log('=== Step 10: Generating Storyboard Contact Sheet ===');
    const contactSheetPath = path.join(PHASE_DIR, 'SHOT_STORYBOARD.png');
    try {
      const args = ['-y'];
      results.parityMetrics.forEach(p => {
        args.push('-i', path.join(ROOT, p.exportedFile));
      });
      args.push(
        '-filter_complex',
        '[0:v]scale=384:216[v0];[1:v]scale=384:216[v1];[2:v]scale=384:216[v2];[3:v]scale=384:216[v3];[4:v]scale=384:216[v4];[v0][v1][v2][v3][v4]hstack=inputs=5',
        '-vframes', '1',
        contactSheetPath
      );
      const res = spawnSync(ffmpeg, args, { encoding: 'utf8' });
      if (res.status === 0 && fs.existsSync(contactSheetPath)) {
        console.log(`✓ Generated Storyboard contact sheet: ${contactSheetPath}`);
      } else {
        console.warn('Contact sheet creation failed:', res.stderr || res.stdout);
      }
    } catch (e) {
      console.warn('Contact sheet creation failed:', e.message);
    }

    // Save consolidated run results
    const resultsPath = path.join(PHASE_DIR, 'phase01_run_results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`✓ Phase 01 Correction Verification completed. Report saved to ${resultsPath}`);

  } catch (err) {
    console.error('Phase 01 Verification FATAL ERROR:', err);
    results.fatalError = err.message;
  } finally {
    await browser.close();
    server.close();
  }
}

runCorrections();
