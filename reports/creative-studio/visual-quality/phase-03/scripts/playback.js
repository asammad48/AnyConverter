const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright-core');

const browserPath = 'reports/creative-studio/visual-quality/phase-03/evidence/';
const base = 'http://localhost:3000/' + browserPath;
const output = path.resolve(__dirname, '../audit');
const filenames = ['fun.webm', 'suspense.webm', 'product-wide.webm'];

async function play(browser, filename, directory) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    const url = base.replace('/evidence/', '/' + directory + '/') + filename;
    await page.route('**/phase-03/playback-check', route => route.fulfill({
      contentType: 'text/html', body: '<video preload="auto" src="' + url + '"></video>'
    }));
    await page.goto(base.replace('/evidence/', '/playback-check'));
    const video = page.locator('video');
    await video.waitFor();
    const stats = await video.evaluate(async node => {
      node.pause();
      if (node.readyState < 2) {
        await new Promise(resolve => node.addEventListener('loadeddata', resolve, { once: true }));
      }
      const quality = () => {
        const { totalVideoFrames, droppedVideoFrames, corruptedVideoFrames } = node.getVideoPlaybackQuality();
        return { totalVideoFrames, droppedVideoFrames, corruptedVideoFrames };
      };
      const before = quality();
      const frames = [];
      const collect = (_, info) => {
        frames.push({ pts: info.mediaTime, presented: info.presentedFrames });
        if (!node.ended) node.requestVideoFrameCallback(collect);
      };
      node.requestVideoFrameCallback(collect);
      const ended = new Promise((resolve, reject) => {
        node.addEventListener('ended', resolve, { once: true });
        node.addEventListener('error', reject, { once: true });
      });
      await node.play();
      await ended;
      return {
        duration: node.duration, ended: node.ended, currentTime: node.currentTime,
        firstCallbackPTS: frames[0]?.pts, lastCallbackPTS: frames.at(-1)?.pts, callbacks: frames.length,
        firstPresented: frames[0]?.presented, lastPresented: frames.at(-1)?.presented,
        skippedCallbackPresentations: frames.slice(1).reduce((sum, frame, index) =>
          sum + Math.max(0, frame.presented - frames[index].presented - 1), 0),
        qualityBefore: before, qualityAfter: quality(),
        width: node.videoWidth, height: node.videoHeight, muted: node.muted
      };
    });
    assert.ok(stats.ended && stats.duration === stats.currentTime);
    assert.ok(stats.duration - stats.lastCallbackPTS < .12, filename + ' playback missed the video tail');
    const file = path.resolve(__dirname, '..', directory, filename);
    const timestamps = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_frames', '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'json', file])).frames;
    const maxClockErrorMs = Math.max(...timestamps.map((frame, index) =>
      Math.abs(Number(frame.best_effort_timestamp_time) - index / 30) * 1000));
    assert.ok(maxClockErrorMs <= 1.1);
    return [filename, { ...stats, decodedFrames: timestamps.length, maxClockErrorMs }];
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const baselineConcurrent = await Promise.all(filenames.map(name => play(browser, name, 'evidence')));
    const revisedSerial = [];
    for (const name of filenames) revisedSerial.push(await play(browser, name, 'audit'));
    await fs.writeFile(path.join(output, 'browser-playback.json'), JSON.stringify({
      baselineConcurrent: Object.fromEntries(baselineConcurrent), revisedSerial: Object.fromEntries(revisedSerial)
    }, null, 2) + '\n');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
