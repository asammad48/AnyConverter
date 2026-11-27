const { chromium } = require('playwright-core');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const result = [];
  try {
    for (const pass of ['before', 'after']) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto('http://127.0.0.1:4173/reports/creative-studio/visual-quality/phase-02/repairs/' + pass + '/silhouette-wide.webm',
        { waitUntil: 'domcontentloaded' });
      result.push(await page.locator('video').evaluate(async (video, label) => {
        video.pause();
        video.muted = true;
        if (video.currentTime !== 0) {
          const seeked = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
          video.currentTime = 0;
          await seeked;
        }
        const before = video.getVideoPlaybackQuality();
        let callbacks = 0;
        let last;
        const watch = (_, frame) => {
          callbacks++;
          last = frame.mediaTime;
          if (!video.ended) video.requestVideoFrameCallback(watch);
        };
        video.requestVideoFrameCallback(watch);
        const ended = new Promise(resolve => video.addEventListener('ended', resolve, { once: true }));
        await video.play();
        await ended;
        const after = video.getVideoPlaybackQuality();
        return { pass: label, duration: video.duration, endedAt: video.currentTime, callbacks, lastPresentation: last,
          rawQualityFrames: after.totalVideoFrames, framesMeasured: after.totalVideoFrames - before.totalVideoFrames,
          prePlayQualityFrames: before.totalVideoFrames, droppedFrames: after.droppedVideoFrames - before.droppedVideoFrames };
      }, pass));
      await page.close();
    }
    assert.ok(result.every(x => x.duration === x.endedAt));
    await fs.writeFile(path.resolve(__dirname, '../after/suspense-playback.json'), JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
