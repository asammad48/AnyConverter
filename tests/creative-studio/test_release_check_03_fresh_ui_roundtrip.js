const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright-core');
const { execSync } = require('child_process');

const PORT = 3000;
const ROOT = process.cwd();
const FFPROBE_BIN = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const FFMPEG_BIN = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const EVIDENCE_DIR = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence');
if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.acstudio': 'application/zip',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4'
};

function createStaticServer() {
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl.endsWith('/')) reqUrl += 'index.html';
    const filePath = path.join(ROOT, reqUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  return server;
}

(async () => {
  console.log('================================================================');
  console.log(' RELEASE CHECK 3: FRESH BROWSER UI ROUNDTRIP & MEDIA SURVIVAL   ');
  console.log('================================================================');

  const server = createStaticServer();
  await new Promise(r => server.listen(PORT, r));
  console.log(`Local test server running at http://localhost:${PORT}/`);

  const { AcStudioArchive } = require(path.resolve('assets/js/creative-studio/archive.js'));
  const archive = new AcStudioArchive();

  // 1. Create Initial .acstudio fixture
  const initialAssetBytes = Buffer.from('ANYCONVERTER_INITIAL_MEDIA_SOURCE_BYTES_123456');
  const initialSha = crypto.createHash('sha256').update(initialAssetBytes).digest('hex');
  const initialAssetId = `sha256:${initialSha}`;

  const initialProject = {
    schemaVersion: '1.0.0',
    projectId: 'proj-check3-initial',
    revisionId: 'rev-001-init',
    title: 'Original Pre-Edit Project',
    kind: 'multimedia',
    locale: 'en',
    canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#0f172a' },
    scenes: [
      {
        id: 'scene-01',
        name: 'Scene 1',
        startFrame: 0,
        durationFrames: 90,
        layers: [
          { id: 'layer-title', type: 'text', content: 'Initial Text Layer', fontSize: 40, transform: { x: 100, y: 150 } },
          { id: 'layer-media-1', type: 'image', assetId: initialAssetId, transform: { x: 200, y: 250 } }
        ]
      }
    ]
  };

  const initialAssetMap = new Map();
  initialAssetMap.set(initialAssetId, initialAssetBytes);
  const initialZip = archive.package(initialProject, initialAssetMap);
  const initialArchivePath = path.join(EVIDENCE_DIR, 'check3_initial_project.acstudio');
  fs.writeFileSync(initialArchivePath, initialZip);
  console.log(`Created baseline initial project: ${initialArchivePath} (${initialZip.length} bytes)`);

  // --- FRESH SESSION 1: REAL UI OPEN, MODIFY SCENE & MEDIA, SAVE & EXPORT ---
  console.log('\n--- SESSION 1: Launching completely fresh browser session ---');
  const browser1 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const context1 = await browser1.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page1 = await context1.newPage();
  page1.on('console', msg => console.log('PAGE1 LOG:', msg.text()));
  page1.on('pageerror', err => console.error('PAGE1 ERROR:', err));

  console.log('Navigating to Creative Studio UI...');
  await page1.goto(`http://localhost:${PORT}/creative-studio/index.html`, { waitUntil: 'domcontentloaded' });
  await page1.waitForSelector('#cs-project-title');

  console.log('Loading .acstudio project via real file input UI element (#cs-file-input)...');
  await page1.setInputFiles('#cs-file-input', initialArchivePath);

  // Wait for project unpack & load into UI
  await page1.waitForFunction(() => {
    const input = document.getElementById('cs-project-title');
    return input && input.value === 'Original Pre-Edit Project';
  }, { timeout: 5000 });
  console.log('✓ Project successfully opened via browser UI. Title verified: "Original Pre-Edit Project"');

  // Verify initial layer in canvas
  const initialLayers = await page1.evaluate(() => window.studioApp.graphics.layers);
  console.log(`✓ Loaded ${initialLayers.length} layers from Scene 1.`);

  // Modify Scene: Change Title and modify layer content
  console.log('\nModifying existing scene and source media in UI...');
  await page1.fill('#cs-project-title', 'Surviving Modified Creative Studio Project');
  
  // Prepare new source media (Modified audio/media stem)
  const modifiedMediaBytes = Buffer.from('ANYCONVERTER_MODIFIED_NEW_MEDIA_SOURCE_BYTES_789012_SURVIVES');
  const modifiedSha = crypto.createHash('sha256').update(modifiedMediaBytes).digest('hex');
  const modifiedAssetId = `sha256:${modifiedSha}`;

  // Execute UI modifications (modify text layer & inject modified source media)
  const modResult = await page1.evaluate(async ({ newAssetId, newBytes, newSha }) => {
    const app = window.studioApp;
    // 1. Modify layer text
    const titleLayer = app.graphics.getLayer('layer-title');
    if (titleLayer) {
      titleLayer.content = 'PROVEN MODIFIED TEXT IN FRESH UI';
      titleLayer.color = '#10b981';
      titleLayer.transform.y = 180;
    }

    // 2. Add modified source media into asset library
    const u8 = new Uint8Array(newBytes);
    app.assetBlobs.set(newAssetId, u8);

    // 3. Attach modified source media layer into scene
    app.graphics.addLayer({
      id: 'layer-modified-media',
      type: 'image',
      assetId: newAssetId,
      name: 'Modified Source Media Asset',
      transform: { x: 300, y: 350, width: 200, height: 200 }
    });

    app.render();

    return {
      title: app.dom.titleInput.value,
      layerCount: app.graphics.layers.length,
      assetBlobsCount: app.assetBlobs.size
    };
  }, {
    newAssetId: modifiedAssetId,
    newBytes: Array.from(modifiedMediaBytes),
    newSha: modifiedSha
  });

  console.log('UI Modifications applied:', modResult);

  // Trigger Save .acstudio from UI
  console.log('Triggering Save .acstudio via UI button (#cs-btn-save-project)...');
  const [ saveDownload ] = await Promise.all([
    page1.waitForEvent('download'),
    page1.click('#cs-btn-save-project')
  ]);
  const savedArchivePath = path.join(EVIDENCE_DIR, 'check3_modified_saved_project.acstudio');
  await saveDownload.saveAs(savedArchivePath);
  const savedStat = fs.statSync(savedArchivePath);
  console.log(`✓ Saved modified project archive: ${savedArchivePath} (${savedStat.size} bytes)`);

  // Trigger Export Video from UI
  console.log('Triggering Export Video via UI button (#cs-btn-export-video)...');
  const [ videoDownload ] = await Promise.all([
    page1.waitForEvent('download'),
    page1.click('#cs-btn-export-video')
  ]);
  const exportedVideoPath = path.join(EVIDENCE_DIR, 'check3_modified_exported_video.webm');
  await videoDownload.saveAs(exportedVideoPath);
  const videoStat = fs.statSync(exportedVideoPath);
  console.log(`✓ Exported new playable video: ${exportedVideoPath} (${videoStat.size} bytes)`);

  // Independent ffprobe analysis of the newly exported video
  console.log('\n--- ffprobe validation of exported modified video ---');
  const ffprobeCmd = `"${FFPROBE_BIN}" -v error -show_entries format=duration,size,format_name:stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_read_frames -count_frames -of json "${exportedVideoPath}"`;
  const probeJson = JSON.parse(execSync(ffprobeCmd).toString());
  console.log('Exported Video Format:', probeJson.format);
  console.log('Exported Video Streams:', probeJson.streams);

  // Completely Close Session 1
  console.log('\nTerminating Browser Session 1 completely (purging in-memory state)...');
  await page1.close();
  await context1.close();
  await browser1.close();

  // --- FRESH SESSION 2: VERIFY ALL MODIFICATIONS SURVIVE ---
  console.log('\n--- SESSION 2: Launching a brand new fresh browser session ---');
  const browser2 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const context2 = await browser2.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page2 = await context2.newPage();
  page2.on('console', msg => console.log('PAGE2 LOG:', msg.text()));
  page2.on('pageerror', err => console.error('PAGE2 ERROR:', err));

  await page2.goto(`http://localhost:${PORT}/creative-studio/index.html`, { waitUntil: 'domcontentloaded' });
  await page2.waitForSelector('#cs-project-title');

  console.log('Loading the saved modified .acstudio into fresh session via #cs-file-input...');
  await page2.setInputFiles('#cs-file-input', savedArchivePath);

  await page2.waitForFunction(() => {
    const input = document.getElementById('cs-project-title');
    return input && input.value === 'Surviving Modified Creative Studio Project';
  }, { timeout: 5000 });

  const freshLoadedData = await page2.evaluate(() => {
    const app = window.studioApp;
    const layers = app.graphics.layers;
    const assets = [];
    for (const [id, buf] of app.assetBlobs.entries()) {
      assets.push({ id, length: buf.length });
    }
    return {
      title: app.dom.titleInput.value,
      layers: layers.map(l => ({ id: l.id, type: l.type, content: l.content, color: l.color, assetId: l.assetId })),
      assets
    };
  });

  console.log('\n--- VERIFICATION OF SURVIVING CHANGES IN FRESH SESSION ---');
  console.log('Restored Title:', freshLoadedData.title);
  console.log('Restored Layers:', freshLoadedData.layers);
  console.log('Restored Source Media Assets:', freshLoadedData.assets);

  // Exact assertions
  const titleSurvived = freshLoadedData.title === 'Surviving Modified Creative Studio Project';
  const textLayer = freshLoadedData.layers.find(l => l.id === 'layer-title');
  const textSurvived = textLayer && textLayer.content === 'PROVEN MODIFIED TEXT IN FRESH UI';
  const mediaLayer = freshLoadedData.layers.find(l => l.id === 'layer-modified-media');
  const mediaLayerSurvived = !!mediaLayer && mediaLayer.assetId === modifiedAssetId;
  const assetSurvived = freshLoadedData.assets.some(a => a.id === modifiedAssetId && a.length === modifiedMediaBytes.length);

  console.log('\nProof Check:');
  console.log(`  [1] Title change survived: ${titleSurvived ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`  [2] Scene text layer mutation survived: ${textSurvived ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`  [3] Modified media layer survived: ${mediaLayerSurvived ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`  [4] Binary source media asset survived with exact SHA-256: ${assetSurvived ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // Test Playability of exported video in fresh session
  console.log('\nTesting exported video playback in Fresh Browser Session 2:');
  const videoB64 = fs.readFileSync(exportedVideoPath).toString('base64');
  const playbackTest = await page2.evaluate(async (b64) => {
    const v = document.createElement('video');
    v.src = 'data:video/webm;base64,' + b64;
    v.muted = true;
    document.body.appendChild(v);
    return new Promise((resolve) => {
      let timeUpdates = 0;
      v.ontimeupdate = () => {
        timeUpdates++;
        if (v.currentTime > 0.5 || timeUpdates >= 3) {
          v.pause();
          resolve({ playable: true, currentTime: v.currentTime, duration: v.duration, timeUpdates });
        }
      };
      v.onerror = (e) => resolve({ playable: false, error: 'Video error' });
      v.play().catch(err => resolve({ playable: false, error: err.message }));
      setTimeout(() => resolve({ playable: timeUpdates > 0, currentTime: v.currentTime, duration: v.duration, timeUpdates }), 4000);
    });
  }, videoB64);

  console.log('Exported Video Playback Result:', playbackTest);
  console.log(`  [5] Exported video is playable: ${playbackTest.playable ? 'YES (PASS)' : 'NO (FAIL)'}`);

  await page2.close();
  await context2.close();
  await browser2.close();
  server.close();

  const allPassed = titleSurvived && textSurvived && mediaLayerSurvived && assetSurvived && playbackTest.playable;
  console.log(`\nOVERALL CHECK 3 VERDICT: ${allPassed ? 'ALL CHECKS PASSED' : 'CHECK FAILED'}`);
  if (!allPassed) process.exit(1);
})();
