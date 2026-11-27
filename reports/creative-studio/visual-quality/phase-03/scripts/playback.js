const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright-core');

const browserPath = 'reports/creative-studio/visual-quality/phase-03/evidence/';
const base = 'http://localhost:3000/' + browserPath;
const output = path.resolve(__dirname, '../evidence');

async function play(browser, filename) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(base + filename);
    const video = page.locator('video');
    await video.waitFor();
    const stats = await video.evaluate(async node => {
      node.pause();
      node.currentTime = 0;
      const frames = [];
      const collect = (_, info) => {
        frames.push(info.mediaTime);
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
        firstCallbackPTS: frames[0], lastCallbackPTS: frames.at(-1), callbacks: frames.length,
        width: node.videoWidth, height: node.videoHeight, muted: node.muted
      };
    });
    assert.ok(stats.ended && stats.duration === stats.currentTime);
    assert.ok(stats.duration - stats.lastCallbackPTS < .12, filename + ' playback missed the video tail');
    return [filename, stats];
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const results = await Promise.all(['fun.webm', 'suspense.webm', 'product-wide.webm'].map(name => play(browser, name)));
    await fs.writeFile(path.join(output, 'browser-playback.json'), JSON.stringify(Object.fromEntries(results), null, 2) + '\n');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
