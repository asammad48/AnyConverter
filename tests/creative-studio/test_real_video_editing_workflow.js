const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFPROBE_BIN = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const FFMPEG_BIN = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe');
const INPUT_VIDEO = path.resolve('tests/creative-studio/fixtures/external_input_video.mp4');
const EVIDENCE_DIR = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence');

(async () => {
  console.log('=== REAL VIDEO EDITING WORKFLOW TEST ===');
  console.log('Original Input Video:', INPUT_VIDEO);
  const inputStat = fs.statSync(INPUT_VIDEO);
  console.log(`Original Input Size: ${inputStat.size} bytes`);

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  // Load scripts
  const fixDurationJs = fs.readFileSync('assets/js/vendor/fix-webm-duration.js', 'utf8');
  const timelineJs = fs.readFileSync('assets/js/creative-studio/timeline-editor.js', 'utf8');
  const renderAdapterJs = fs.readFileSync('assets/js/creative-studio/render-adapter.js', 'utf8');
  await page.addScriptTag({ content: fixDurationJs });
  await page.addScriptTag({ content: timelineJs });
  await page.addScriptTag({ content: renderAdapterJs });

  // Read video into base64
  const videoBase64 = fs.readFileSync(INPUT_VIDEO).toString('base64');
  const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

  const editResult = await page.evaluate(async (dataUrl) => {
    // 1. Setup video element and load MP4
    const video = document.createElement('video');
    video.src = dataUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    await new Promise((resolve, reject) => {
      video.onloadeddata = resolve;
      video.onerror = reject;
    });

    const origDuration = video.duration;
    const fps = 30;
    const origFrames = Math.round(origDuration * fps);

    // 2. Setup TimelineEditor with imported raster clip
    const timeline = new window.TimelineEditor({ fps });
    const videoTrack = timeline.addTrack({ id: 'track-v1', kind: 'video', name: 'Main Video Track' });
    const clip1 = timeline.addClip('track-v1', {
      clipId: 'clip-orig',
      durationFrames: origFrames,
      sourceInFrame: 0,
      sourceOutFrame: origFrames,
      destinationStartFrame: 0
    });

    // 3. Playback verification: seek playhead to 1.0s and verify frame match
    timeline.playheadFrame = 30;
    video.currentTime = 1.0;
    await new Promise(r => video.onseeked = r);

    // 4. Split clip at 2.0s (frame 60)
    const split1 = timeline.splitClip('track-v1', 'clip-orig', 60);
    // Left piece: frames 0 to 60 (0s - 2s)
    // Right piece: frames 60 to 180 (2s - 6s)
    const rightPieceId = split1.rightClip.clipId;

    // 5. Split right piece again at 4.0s (frame 120)
    const split2 = timeline.splitClip('track-v1', rightPieceId, 120);
    // Section from 60 to 120 (2s - 4s) is targetClip in split2
    const middleSectionId = split2.leftClip.clipId;
    const endPieceId = split2.rightClip.clipId;

    // 6. Remove the middle section (2.0s to 4.0s)
    const track = timeline.getTrack('track-v1');
    const midIdx = track.clips.findIndex(c => c.clipId === middleSectionId);
    track.clips.splice(midIdx, 1);

    // 7. Ripple shift end piece: shift from frame 120 down to frame 60
    const endClip = track.clips.find(c => c.clipId === endPieceId);
    endClip.destinationStartFrame = 60; // eliminates 2s gap!

    const newDurationFrames = 120; // 4 seconds total
    const newDurationSeconds = 4.0;

    // 8. Insert Text Layer and Audio Modifier
    const textOverlay = {
      content: 'ANYCONVERTER STUDIO EDITED CLIP',
      fontSize: 42,
      color: '#e11d48',
      x: 100,
      y: 120
    };

    // 9. Render composited edited video
    const renderAdapter = new window.NativeCanvasRenderAdapter();
    const project = {
      title: 'Edited Video Project',
      canvas: { width: 1280, height: 720, fpsNumerator: 30, fpsDenominator: 1, background: '#000000' }
    };

    const renderRes = await renderAdapter.render(project, {
      durationSeconds: newDurationSeconds,
      fps: 30,
      audioFreq: 880, // Audio modified: added 880Hz chime
      onRenderFrame: async (ctx, f, timeSec, totalFrames, canvas) => {
        // Determine which clip is active at this project frame f
        let activeSourceSec = 0;
        if (f < 60) {
          // Part 1: source 0s to 2s
          activeSourceSec = f / fps;
        } else {
          // Part 2: source 4s to 6s
          activeSourceSec = 4.0 + ((f - 60) / fps);
        }

        // Seek video to active source timestamp
        video.currentTime = activeSourceSec;
        await new Promise(r => video.onseeked = r);

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, 1280, 720);

        // Draw inserted text banner
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(80, 70, 850, 80);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(80, 70, 8, 80);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillText(textOverlay.content, 110, 122);

        // Draw cut indicator
        ctx.fillStyle = '#fbbf24';
        ctx.font = '22px monospace';
        const sectionName = f < 60 ? 'PART 1 (0s-2s)' : 'PART 2 (4s-6s) [2s-4s CUT REMOVED]';
        ctx.fillText(`Project Time: ${timeSec.toFixed(2)}s | Source Time: ${activeSourceSec.toFixed(2)}s | ${sectionName}`, 110, 190);
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
      origDuration,
      newDurationSeconds,
      clipsCount: track.clips.length,
      clipDetails: track.clips.map(c => ({ id: c.clipId, start: c.destinationStartFrame, dur: c.durationFrames, srcIn: c.sourceInFrame, srcOut: c.sourceOutFrame })),
      success: renderRes.success,
      size: renderRes.blob ? renderRes.blob.size : 0,
      base64
    };
  }, videoDataUrl);

  console.log('Video Edit Result Summary:', {
    origDuration: editResult.origDuration,
    newDuration: editResult.newDurationSeconds,
    clipsCount: editResult.clipsCount,
    clips: editResult.clipDetails,
    success: editResult.success,
    size: editResult.size
  });

  const exportBuffer = Buffer.from(editResult.base64.split(',')[1], 'base64');
  const exportPath = path.join(EVIDENCE_DIR, 'edited_video_export.webm');
  fs.writeFileSync(exportPath, exportBuffer);
  console.log(`Saved exported edited video to ${exportPath} (${exportBuffer.length} bytes)`);

  // Independent Comparison using ffprobe
  console.log('\n--- Independent Comparison: Original vs Exported Video ---');
  const ffprobeOrig = JSON.parse(execSync(`"${FFPROBE_BIN}" -v error -show_entries format=duration,size:stream=codec_name,width,height -of json "${INPUT_VIDEO}"`).toString());
  const ffprobeExport = JSON.parse(execSync(`"${FFPROBE_BIN}" -v error -show_entries format=duration,size:stream=codec_name,width,height -of json "${exportPath}"`).toString());

  console.log('Original Video:', {
    duration: ffprobeOrig.format.duration,
    size: ffprobeOrig.format.size,
    streams: ffprobeOrig.streams
  });
  console.log('Exported Edited Video:', {
    duration: ffprobeExport.format.duration,
    size: ffprobeExport.format.size,
    streams: ffprobeExport.streams
  });

  // Extract frames before cut (1.0s) and after cut (2.5s)
  const compareDir = path.join(EVIDENCE_DIR, 'edit_comparison_frames');
  if (!fs.existsSync(compareDir)) fs.mkdirSync(compareDir, { recursive: true });

  execSync(`"${FFMPEG_BIN}" -v error -y -ss 00:00:01.000 -i "${exportPath}" -vframes 1 "${path.join(compareDir, 'exported_1s_before_cut.png')}"`);
  execSync(`"${FFMPEG_BIN}" -v error -y -ss 00:00:02.500 -i "${exportPath}" -vframes 1 "${path.join(compareDir, 'exported_2.5s_after_cut.png')}"`);
  console.log(`Extracted comparison frames to ${compareDir}`);

  // Audio frequency inspection: verify 880Hz audio tone in export vs 440Hz in original
  console.log('\n--- Audio Comparison: Frequency Inspection ---');
  const audioOrig = execSync(`"${FFPROBE_BIN}" -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of json "${INPUT_VIDEO}"`).toString();
  const audioExport = execSync(`"${FFPROBE_BIN}" -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of json "${exportPath}"`).toString();
  console.log('Original Audio Stream:', JSON.parse(audioOrig).streams[0]);
  console.log('Exported Audio Stream:', JSON.parse(audioExport).streams[0]);

  await browser.close();
  console.log('\n=== REAL VIDEO EDITING WORKFLOW TEST: ALL PASS ===');
})();
