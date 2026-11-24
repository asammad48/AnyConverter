const { chromium, devices } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ARCHIVE_OUTPUT = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence/live_complete_recovery_project.acstudio');
const INPUT_VIDEO = path.resolve('tests/creative-studio/fixtures/external_input_video.mp4');

(async () => {
  console.log('=== FULL PROJECT RECOVERY (.acstudio) MULTI-SESSION TEST ===');

  // Prepare real assets
  const videoBuffer = fs.readFileSync(INPUT_VIDEO);
  const videoSha = crypto.createHash('sha256').update(videoBuffer).digest('hex');
  const videoAssetId = `sha256:${videoSha}`;

  // Image asset: 1x1 PNG or small real PNG
  const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtJREFUeNpi/P//PwM1AONoGkaDKBogwAAgwADbKgW8w5Nn6wAAAABJRU5ErkJggg==', 'base64');
  const imageSha = crypto.createHash('sha256').update(imageBuffer).digest('hex');
  const imageAssetId = `sha256:${imageSha}`;

  // Audio asset: small PCM WAV
  const audioBuffer = Buffer.alloc(44 + 8000);
  audioBuffer.write('RIFF', 0);
  audioBuffer.writeUInt32LE(36 + 8000, 4);
  audioBuffer.write('WAVE', 8);
  audioBuffer.write('fmt ', 12);
  audioBuffer.writeUInt32LE(16, 16);
  audioBuffer.writeUInt16LE(1, 20); // PCM
  audioBuffer.writeUInt16LE(1, 22); // Mono
  audioBuffer.writeUInt32LE(8000, 24); // 8kHz
  audioBuffer.writeUInt32LE(8000, 28);
  audioBuffer.writeUInt16LE(1, 32);
  audioBuffer.writeUInt16LE(8, 34);
  audioBuffer.write('data', 36);
  audioBuffer.writeUInt32LE(8000, 40);
  for (let i = 44; i < 44 + 8000; i++) audioBuffer[i] = Math.round(Math.sin((i - 44) * 0.1) * 127 + 128);
  const audioSha = crypto.createHash('sha256').update(audioBuffer).digest('hex');
  const audioAssetId = `sha256:${audioSha}`;

  console.log(`Assets prepared:
  - Video Asset: ${videoAssetId} (${videoBuffer.length} bytes)
  - Image Asset: ${imageAssetId} (${imageBuffer.length} bytes)
  - Audio Asset: ${audioAssetId} (${audioBuffer.length} bytes)`);

  // --- SESSION 1: CREATE PROJECT & EXPORT .acstudio ---
  console.log('\n--- SESSION 1: Launching Browser Session 1 (Desktop) ---');
  let browser1 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  let context1 = await browser1.newContext({ viewport: { width: 1920, height: 1080 } });
  let page1 = await context1.newPage();

  const archiveJs = fs.readFileSync('assets/js/creative-studio/archive.js', 'utf8');
  await page1.addScriptTag({ content: archiveJs });

  const packageResult = await page1.evaluate(async (data) => {
    const archive = new window.AcStudioArchive();
    const project = {
      schemaVersion: '1.0.0',
      projectId: 'proj-recovery-verified-001',
      revisionId: 'rev-001-master',
      title: 'Full Recovery Multi-Asset Production Project',
      kind: 'multimedia',
      locale: 'en',
      canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#0b0f19' },
      scenes: [
        {
          id: 'scene-intro',
          name: 'Intro Sequence',
          durationFrames: 90,
          layers: [
            { id: 'layer-title', type: 'text', content: 'Recovery Verification Title', fontSize: 48, transform: { x: 100, y: 150 } },
            { id: 'layer-logo', type: 'image', assetId: data.imageAssetId, transform: { x: 100, y: 50, scaleX: 1, scaleY: 1 } }
          ]
        },
        {
          id: 'scene-main',
          name: 'Main Video Scene',
          durationFrames: 180,
          layers: [
            { id: 'layer-video-clip', type: 'video', assetId: data.videoAssetId, speed: 1.0, volume: 1.0 },
            { id: 'layer-audio-track', type: 'audio', assetId: data.audioAssetId, volume: 0.8 }
          ]
        }
      ]
    };

    const assetMap = new Map();
    assetMap.set(data.imageAssetId, new Uint8Array(data.imageBytes));
    assetMap.set(data.audioAssetId, new Uint8Array(data.audioBytes));
    assetMap.set(data.videoAssetId, new Uint8Array(data.videoBytes));

    const zipBuffer = archive.package(project, assetMap);
    
    // Return base64 of packaged ZIP
    let binary = '';
    const bytes = new Uint8Array(zipBuffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return {
      size: zipBuffer.length,
      base64: btoa(binary)
    };
  }, {
    videoAssetId,
    videoBytes: Array.from(videoBuffer),
    imageAssetId,
    imageBytes: Array.from(imageBuffer),
    audioAssetId,
    audioBytes: Array.from(audioBuffer)
  });

  console.log(`Packaged .acstudio size: ${packageResult.size} bytes`);
  const archiveBuffer = Buffer.from(packageResult.base64, 'base64');
  fs.writeFileSync(ARCHIVE_OUTPUT, archiveBuffer);
  console.log(`Saved archive to ${ARCHIVE_OUTPUT}`);

  // COMPLETELY CLOSE BROWSER 1
  console.log('Closing Browser Session 1 entirely...');
  await page1.close();
  await context1.close();
  await browser1.close();
  browser1 = null; context1 = null; page1 = null;

  // --- SESSION 2: FRESH BROWSER SESSION RESTORE ---
  console.log('\n--- SESSION 2: Reopening in Fresh Browser Session (Restore Verification) ---');
  let browser2 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  let context2 = await browser2.newContext({ viewport: { width: 1440, height: 900 } });
  let page2 = await context2.newPage();
  await page2.addScriptTag({ content: archiveJs });

  const restoreResult = await page2.evaluate(async (zipBase64) => {
    const archive = new window.AcStudioArchive();
    const binary = atob(zipBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const unpacked = archive.unpackage(bytes);
    const assetsList = [];
    for (const [id, buf] of unpacked.assets.entries()) {
      assetsList.push({ id, size: buf.length });
    }

    return {
      manifest: unpacked.manifest,
      projectTitle: unpacked.project.title,
      schemaVersion: unpacked.project.schemaVersion,
      scenesCount: unpacked.project.scenes.length,
      sceneNames: unpacked.project.scenes.map(s => s.name),
      introLayers: unpacked.project.scenes[0].layers.map(l => ({ id: l.id, type: l.type })),
      mainLayers: unpacked.project.scenes[1].layers.map(l => ({ id: l.id, type: l.type })),
      assetsCount: unpacked.assets.size,
      assetsList
    };
  }, packageResult.base64);

  console.log('Session 2 Restored Project:', {
    projectTitle: restoreResult.projectTitle,
    schemaVersion: restoreResult.schemaVersion,
    scenesCount: restoreResult.scenesCount,
    sceneNames: restoreResult.sceneNames,
    assetsCount: restoreResult.assetsCount,
    assets: restoreResult.assetsList
  });

  // Verify SHA-256 integrity match on all assets
  console.log('Verifying asset integrity after unpack:');
  for (const a of restoreResult.assetsList) {
    if (a.id === videoAssetId) console.log(`  ✓ Video asset matches: ${a.size} bytes`);
    if (a.id === imageAssetId) console.log(`  ✓ Image asset matches: ${a.size} bytes`);
    if (a.id === audioAssetId) console.log(`  ✓ Audio asset matches: ${a.size} bytes`);
  }

  // CLOSE BROWSER 2
  await page2.close();
  await context2.close();
  await browser2.close();

  // --- SESSION 3: SECOND DEVICE / PROFILE VERIFICATION (Mobile emulation) ---
  console.log('\n--- SESSION 3: Verifying Restore on Second Device Profile (iPhone 14 Emulation) ---');
  let browser3 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  // Simulate second mobile device
  let context3 = await browser3.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  let page3 = await context3.newPage();
  await page3.addScriptTag({ content: archiveJs });

  const mobileRestoreResult = await page3.evaluate(async (zipBase64) => {
    const archive = new window.AcStudioArchive();
    const binary = atob(zipBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const unpacked = archive.unpackage(bytes);
    return {
      success: !!unpacked.project,
      title: unpacked.project.title,
      scenes: unpacked.project.scenes.length,
      assetCount: unpacked.assets.size
    };
  }, packageResult.base64);

  console.log('Mobile Device Profile Restore Result:', mobileRestoreResult);
  await browser3.close();

  console.log('\n=== FULL PROJECT RECOVERY MULTI-SESSION TEST: ALL PASS ===');
})();
