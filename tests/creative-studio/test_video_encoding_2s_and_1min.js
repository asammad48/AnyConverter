const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const assert = require('assert');

const FFPROBE_BIN = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const FFMPEG_BIN = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');

(async () => {
  console.log('================================================================');
  console.log(' DETERMINISTIC VIDEO ENCODING VERIFICATION: 2s & 60s EXPORTS   ');
  console.log('================================================================');

  // Serve static files on localhost:3000 to enable secure context & WebCodecs
  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
    if (req.url === '/' || req.url === '/creative-studio/') {
      filePath = path.join(process.cwd(), 'creative-studio/index.html');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeMap = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.webm': 'video/webm',
        '.mp4': 'video/mp4'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }).listen(3000);

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/creative-studio/');

  // Ensure WebMMuxer and NativeCanvasRenderAdapter are active
  const webmMuxerJs = fs.readFileSync('assets/js/vendor/webm-muxer.js', 'utf8');
  const renderAdapterJs = fs.readFileSync('assets/js/creative-studio/render-adapter.js', 'utf8');
  await page.addScriptTag({ content: webmMuxerJs });
  await page.addScriptTag({ content: renderAdapterJs });

  // ---------------------------------------------------------------------------
  // STEP 1: 2-Second Deterministic Live Native Video (60 frames @ 30fps)
  // ---------------------------------------------------------------------------
  console.log('\n=== STEP 1: TEST 2-SECOND LIVE NATIVE ANIMATION ENCODING ===');
  const start2s = process.hrtime.bigint();
  const res2s = await page.evaluate(async () => {
    const adapter = new window.NativeCanvasRenderAdapter();
    const project = {
      title: 'AnyConverter 2s Deterministic Animation',
      canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#0f172a' },
      scenes: [
        {
          id: 'scene-01',
          name: 'Title Scene',
          durationFrames: 60,
          background: '#0f172a',
          layers: [
            { type: 'text', content: 'Deterministic 60-Frame Render', fontSize: 36, color: '#38bdf8', transform: { x: 80, y: 160 } },
            { type: 'shape', color: '#0284c7', transform: { x: 80, y: 200, width: 320, height: 6 } }
          ]
        }
      ]
    };
    const res = await adapter.render(project, { durationSeconds: 2, fps: 30, audioFreq: 440 });
    let base64 = null;
    if (res.blob) {
      const reader = new FileReader();
      base64 = await new Promise(r => {
        reader.onloadend = () => r(reader.result);
        reader.readAsDataURL(res.blob);
      });
    }
    return {
      success: res.success,
      size: res.blob ? res.blob.size : 0,
      mimeType: res.mimeType,
      totalFrames: res.totalFrames,
      durationSeconds: res.durationSeconds,
      engine: res.engine,
      frameAccurate: res.frameAccurate,
      base64
    };
  });
  const elapsed2s = (Number(process.hrtime.bigint() - start2s) / 1e9).toFixed(2);
  console.log(`2-Second Render Complete in ${elapsed2s}s:`, {
    success: res2s.success,
    size: res2s.size,
    engine: res2s.engine,
    frameAccurate: res2s.frameAccurate
  });

  assert.ok(res2s.success, '2s render failed');
  assert.strictEqual(res2s.frameAccurate, true, 'Render was not frame-accurate');

  const videoBuffer2s = Buffer.from(res2s.base64.split(',')[1], 'base64');
  const videoPath2s = path.join(process.cwd(), 'reports/creative-studio/live-localhost-qa/recovery-evidence/J03_live_native_animation.webm');
  fs.writeFileSync(videoPath2s, videoBuffer2s);
  console.log(`Saved J03_live_native_animation.webm (${videoBuffer2s.length} bytes)`);

  // Independent ffprobe verification
  const probeFramesOut2s = execSync(`"${FFPROBE_BIN}" -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=noprint_wrappers=1:nokey=1 "${videoPath2s}"`).toString().trim();
  console.log(`Decoded 2s Video Frames: ${probeFramesOut2s} (Expected: exactly 60 frames)`);
  assert.strictEqual(parseInt(probeFramesOut2s, 10), 60, `2-second video MUST have exactly 60 decoded frames! Got: ${probeFramesOut2s}`);

  const probeStream2s = JSON.parse(execSync(`"${FFPROBE_BIN}" -v error -show_entries format=duration:stream=codec_name,width,height,avg_frame_rate,duration -of json "${videoPath2s}"`).toString());
  console.log('2s Stream Details:', probeStream2s);

  // Extract frames
  const framesDir2s = path.join(process.cwd(), 'reports/creative-studio/live-localhost-qa/recovery-evidence/frames_2s');
  if (!fs.existsSync(framesDir2s)) fs.mkdirSync(framesDir2s, { recursive: true });
  execSync(`"${FFMPEG_BIN}" -v error -y -i "${videoPath2s}" -vf "fps=2" "${path.join(framesDir2s, 'frame_%02d.png')}"`);

  // Verify in-browser Chromium playback
  const playback2s = await page.evaluate(async (b64) => {
    const video = document.createElement('video');
    video.src = b64;
    video.muted = true;
    document.body.appendChild(video);
    return new Promise((resolve) => {
      let ticks = 0;
      video.ontimeupdate = () => {
        ticks++;
        if (video.currentTime >= 0.5 || ticks >= 5) {
          video.pause();
          resolve({ ok: true, currentTime: video.currentTime, duration: video.duration, ticks });
        }
      };
      video.play().catch(e => resolve({ ok: false, error: e.message }));
      setTimeout(() => resolve({ ok: ticks > 0, currentTime: video.currentTime, ticks }), 3000);
    });
  }, res2s.base64);
  console.log('Chromium 2s Playback Check:', playback2s);
  assert.ok(playback2s.ok, 'Chromium playback failed');

  // ---------------------------------------------------------------------------
  // STEP 2: 60-Second Deterministic Timeline Video (1,800 frames @ 30fps)
  // ---------------------------------------------------------------------------
  console.log('\n=== STEP 2: TEST 60-SECOND PROJECT VIDEO ENCODING ===');
  console.log('Rendering 60-second video with deterministic WebCodecs pipeline...');
  const start60s = process.hrtime.bigint();
  const res1min = await page.evaluate(async () => {
    const adapter = new window.NativeCanvasRenderAdapter();
    const project = {
      title: 'AnyConverter 1-Minute Timeline Project',
      canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#0a0f1d' },
      scenes: [
        {
          id: 'scene-01',
          name: 'Section A: Introduction',
          durationFrames: 900, // 30s
          background: '#0a0f1d',
          layers: [{ type: 'text', content: 'Act 1: Deterministic 60-Second Engine', fontSize: 40, color: '#38bdf8', transform: { x: 80, y: 160 } }]
        },
        {
          id: 'scene-02',
          name: 'Section B: Conclusion',
          durationFrames: 900, // 30s
          background: '#064e3b',
          layers: [{ type: 'text', content: 'Act 2: Full 1,800 Decoded Frame Check', fontSize: 40, color: '#34d399', transform: { x: 80, y: 160 } }]
        }
      ]
    };
    const res = await adapter.render(project, { durationSeconds: 60, fps: 30, audioFreq: 520 });
    let base64 = null;
    if (res.blob) {
      const reader = new FileReader();
      base64 = await new Promise(r => {
        reader.onloadend = () => r(reader.result);
        reader.readAsDataURL(res.blob);
      });
    }
    return {
      success: res.success,
      size: res.blob ? res.blob.size : 0,
      mimeType: res.mimeType,
      totalFrames: res.totalFrames,
      durationSeconds: res.durationSeconds,
      engine: res.engine,
      frameAccurate: res.frameAccurate,
      base64
    };
  });
  const elapsed60s = (Number(process.hrtime.bigint() - start60s) / 1e9).toFixed(2);
  console.log(`60-Second Render Complete in ${elapsed60s}s:`, {
    success: res1min.success,
    size: res1min.size,
    totalFrames: res1min.totalFrames,
    engine: res1min.engine
  });

  assert.ok(res1min.success, '60s render failed');
  const videoBuffer1min = Buffer.from(res1min.base64.split(',')[1], 'base64');
  const videoPath1min = path.join(process.cwd(), 'reports/creative-studio/live-localhost-qa/recovery-evidence/live_1minute_project.webm');
  fs.writeFileSync(videoPath1min, videoBuffer1min);
  console.log(`Saved live_1minute_project.webm (${videoBuffer1min.length} bytes)`);

  // Independent ffprobe frame count for 60s
  const probeFramesOut60s = execSync(`"${FFPROBE_BIN}" -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=noprint_wrappers=1:nokey=1 "${videoPath1min}"`).toString().trim();
  console.log(`Decoded 60s Video Frames: ${probeFramesOut60s} (Expected: exactly 1800 frames)`);
  assert.strictEqual(parseInt(probeFramesOut60s, 10), 1800, `60-second video MUST have exactly 1800 decoded frames! Got: ${probeFramesOut60s}`);

  // Extract sample frames across 60s (0s, 30s, 58s)
  const frameDir1min = path.join(process.cwd(), 'reports/creative-studio/live-localhost-qa/recovery-evidence/frames_1min');
  if (!fs.existsSync(frameDir1min)) fs.mkdirSync(frameDir1min, { recursive: true });
  execSync(`"${FFMPEG_BIN}" -v error -y -i "${videoPath1min}" -vf "fps=1/20" "${path.join(frameDir1min, 'frame_%02d.png')}"`);

  await browser.close();
  server.close();

  console.log('\n================================================================');
  console.log('✓ DETERMINISTIC VIDEO VERIFICATION PASSED:');
  console.log(`  - 2.0s @ 30fps : Exactly 60 decoded frames (0 dropped) [PASS]`);
  console.log(`  - 60.0s @ 30fps: Exactly 1,800 decoded frames (0 dropped) [PASS]`);
  console.log('================================================================');
})();
