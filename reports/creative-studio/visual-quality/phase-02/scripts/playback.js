const { chromium } = require('playwright-core');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
const path = require('node:path');
const folder = 'reports/creative-studio/visual-quality/phase-02/evidence';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const names = ['dialogue-wide', 'silhouette-wide', 'product-wide', 'portrait-export', 'edited-reexport'];
    const proof = [];
    for (const name of names) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      try {
        await page.goto('http://localhost:3000/' + folder + '/' + name + '.webm', { waitUntil: 'domcontentloaded' });
        const result = await page.locator('video').evaluate(async element => {
          element.pause();
          element.currentTime = 0;
          element.muted = true;
          element.playbackRate = 1;
          const before = element.getVideoPlaybackQuality();
          await element.play();
          await new Promise((resolve, reject) => {
            element.addEventListener('ended', resolve, { once: true });
            element.addEventListener('error', () => reject(new Error('Video playback error')), { once: true });
          });
          const after = element.getVideoPlaybackQuality();
          return {
            duration: element.duration, currentTime: element.currentTime,
            decodedFrames: after.totalVideoFrames - before.totalVideoFrames,
            droppedFrames: after.droppedVideoFrames - before.droppedVideoFrames
          };
        });
        assert.equal(result.currentTime, result.duration);
        assert.ok(result.decodedFrames > 100);
        proof.push({ name, ...result });
        await fs.writeFile(path.resolve(__dirname, '../evidence/playback-results.json'), JSON.stringify(proof, null, 2));
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
