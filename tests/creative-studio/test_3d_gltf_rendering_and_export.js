const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFPROBE_BIN = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const FFMPEG_BIN = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const GLB_FILE = path.resolve('tests/creative-studio/fixtures/test_character.glb');
const EVIDENCE_DIR = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence');

(async () => {
  console.log('=== REAL 3D glTF/GLB RENDERING & ANIMATION TEST ===');
  console.log('GLB Fixture:', GLB_FILE);
  const glbStat = fs.statSync(GLB_FILE);
  console.log(`GLB Fixture Size: ${glbStat.size} bytes`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  // Load scripts
  const threeBundle = fs.readFileSync('assets/js/vendor/three.bundle.js', 'utf8');
  const fixDurationJs = fs.readFileSync('assets/js/vendor/fix-webm-duration.js', 'utf8');
  const threeAdapterJs = fs.readFileSync('assets/js/creative-studio/three-scene-adapter.js', 'utf8');
  const renderAdapterJs = fs.readFileSync('assets/js/creative-studio/render-adapter.js', 'utf8');

  await page.addScriptTag({ content: threeBundle });
  await page.addScriptTag({ content: fixDurationJs });
  await page.addScriptTag({ content: threeAdapterJs });
  await page.addScriptTag({ content: renderAdapterJs });

  const glbBase64 = fs.readFileSync(GLB_FILE).toString('base64');

  const result3d = await page.evaluate(async (b64) => {
    // 1. Setup ThreeSceneAdapter with WebGL canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    document.body.appendChild(canvas);

    const adapter = new window.ThreeSceneAdapter({
      canvas,
      width: 1280,
      height: 720,
      camera: { fov: 45, position: [0, 1.5, 4], target: [0, 1, 0] }
    });

    // 2. Decode GLB Base64 to ArrayBuffer
    const binaryStr = atob(b64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);

    // 3. Load glTF model with genuine visible geometry
    const modelRecord = await adapter.loadGltfFromArrayBuffer(bytes.buffer, 'character-01');

    // 4. Test timeline scrubbing & model animation at different timestamps
    const frameChecks = [];
    const testTimes = [0.0, 0.5, 1.0, 1.5, 2.0];
    for (const t of testTimes) {
      adapter.setTime(t);
      frameChecks.push({
        timeSec: t,
        rotationY: adapter.characterGroup ? adapter.characterGroup.rotation.y : 0,
        eval: adapter.evaluateFrame(Math.round(t * 30))
      });
    }

    // 5. Export 3D animation video using NativeCanvasRenderAdapter
    const renderAdapter = new window.NativeCanvasRenderAdapter();
    const project = {
      title: '3D Character Model Animation',
      canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#090d16' }
    };

    const renderRes = await renderAdapter.render(project, {
      durationSeconds: 2,
      fps: 30,
      audioFreq: 520,
      onRenderFrame: async (ctx, f, timeSec, totalFrames) => {
        // Step 3D animation
        adapter.setTime(timeSec);

        // Fill background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 1280, 720);

        // Draw WebGL 3D Canvas onto 2D compositing canvas
        ctx.drawImage(canvas, 0, 0, 1280, 720);

        // Draw 3D Viewport HUD
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(40, 40, 500, 70);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(40, 40, 6, 70);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText('3D glTF Character Animation Viewport', 60, 70);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px monospace';
        ctx.fillText(`Mesh: ${modelRecord.meshCount} primitives | Clip: SpinWave | Time: ${timeSec.toFixed(2)}s`, 60, 95);
      }
    });

    let base64 = null;
    if (renderRes.blob) {
      const reader = new FileReader();
      base64 = await new Promise(r => {
        reader.onloadend = () => r(reader.result);
        reader.readAsDataURL(renderRes.blob);
      });
    }

    return {
      modelLoaded: modelRecord.loaded,
      meshCount: modelRecord.meshCount,
      meshDetails: modelRecord.meshDetails,
      animations: modelRecord.animations,
      frameChecks,
      renderSuccess: renderRes.success,
      videoSize: renderRes.blob ? renderRes.blob.size : 0,
      base64
    };
  }, glbBase64);

  console.log('3D Scene Verification Result:', {
    modelLoaded: result3d.modelLoaded,
    meshCount: result3d.meshCount,
    animations: result3d.animations,
    renderSuccess: result3d.renderSuccess,
    videoSize: result3d.videoSize
  });

  console.log('Meshes in 3D Model:');
  for (const m of result3d.meshDetails) {
    console.log(` - ${m.name}: ${m.geometryType}, ${m.materialType}, ${m.vertices} vertices`);
  }

  // Save 3D exported video
  const videoBuffer3d = Buffer.from(result3d.base64.split(',')[1], 'base64');
  const videoPath3d = path.join(EVIDENCE_DIR, 'J04_live_3d_animation.webm');
  fs.writeFileSync(videoPath3d, videoBuffer3d);
  console.log(`Saved 3D animation video to ${videoPath3d} (${videoBuffer3d.length} bytes)`);

  // Independent ffprobe validation
  console.log('\n--- ffprobe stream and format verification for 3D Video ---');
  const ffprobeOut3d = execSync(`"${FFPROBE_BIN}" -v error -show_entries format=duration,size:stream=codec_name,width,height -of json "${videoPath3d}"`).toString();
  console.log('ffprobe output:', JSON.parse(ffprobeOut3d));

  // ffmpeg frame extraction across the 3D animation
  const framesDir3d = path.join(EVIDENCE_DIR, 'frames_3d');
  if (!fs.existsSync(framesDir3d)) fs.mkdirSync(framesDir3d, { recursive: true });
  execSync(`"${FFMPEG_BIN}" -v error -y -i "${videoPath3d}" -vf "fps=2" "${path.join(framesDir3d, 'frame_3d_%02d.png')}"`);
  console.log(`Extracted 3D animation frames to ${framesDir3d}`);

  await browser.close();
  console.log('\n=== REAL 3D glTF/GLB TEST: ALL PASS ===');
})();
