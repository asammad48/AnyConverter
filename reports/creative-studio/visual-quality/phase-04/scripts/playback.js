const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const root = 'http://localhost:3000/reports/creative-studio/visual-quality/phase-04/evidence/';
    await page.goto(root);
    const playback = await page.evaluate(async url => {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.muted = true;
      video.style.width = '720px';
      document.body.replaceChildren(video);
      const callbacks = [];
      function record(time, metadata) {
        callbacks.push({ callbackTimeMilliseconds: time, presentationSeconds: metadata.mediaTime,
          presentedFrames: metadata.presentedFrames });
        if (!video.ended) video.requestVideoFrameCallback(record);
      }
      video.requestVideoFrameCallback(record);
      const ended = new Promise((resolve, reject) => {
        video.addEventListener('ended', resolve, { once: true });
        video.addEventListener('error', () => reject(new Error(video.error.message)), { once: true });
      });
      await video.play();
      await ended;
      const quality = video.getVideoPlaybackQuality();
      return { duration: video.duration, currentTime: video.currentTime, ended: video.ended,
        resolution: [video.videoWidth, video.videoHeight], callbackCount: callbacks.length,
        totalVideoFrames: quality.totalVideoFrames, droppedVideoFrames: quality.droppedVideoFrames, callbacks };
    }, root + 'showreel.webm');
    assert.ok(playback.ended);
    assert.ok(Math.abs(playback.duration - 20) < .09);
    assert.ok(playback.callbackCount > 0 && playback.totalVideoFrames > 0);
    await fs.writeFile(path.join(__dirname, '../evidence/browser-playback.json'), JSON.stringify(playback, null, 2) + '\n');
    console.log(JSON.stringify({ duration: playback.duration, callbackCount: playback.callbackCount,
      totalVideoFrames: playback.totalVideoFrames, droppedVideoFrames: playback.droppedVideoFrames }));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
