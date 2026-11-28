const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright-core');

const output = path.resolve(__dirname, '../evidence');
const parent = path.resolve(__dirname, '../..');
const fixtures = {
  'phase-01': 'evidence/reordered_five_shot_project.acstudio',
  'phase-02': 'repairs/after/phase-02.acstudio',
  'phase-03': 'audit/product.acstudio'
};

async function main() {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const result = {};
  try {
    for (const [phase, file] of Object.entries(fixtures)) {
      const revisions = [];
      for (const base of ['http://127.0.0.1:4173', 'http://localhost:3000']) {
        const page = await browser.newPage({ viewport: { width: 1540, height: 1120 } });
        await page.goto(base + '/creative-studio/', { waitUntil: 'domcontentloaded' });
        await page.locator('#cs-file-input').setInputFiles(path.join(parent, phase, file));
        await page.waitForFunction(() => window.studioApp?.lastOpenedUnpack?.project);
        const frames = {};
        for (const frame of [0, 30, 60]) {
          const data = await page.locator('#cs-timeline-scrubber').evaluate((input, frameValue) => {
            input.value = frameValue;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            return document.querySelector('#cs-canvas').toDataURL();
          }, frame);
          frames[frame] = createHash('sha256').update(data).digest('hex');
        }
        revisions.push(frames);
        await page.context().close();
      }
      assert.deepEqual(revisions[0], revisions[1], phase);
      result[phase] = { fixture: file, pinned: revisions[0], phase04: revisions[1] };
    }
  } finally {
    await fs.writeFile(path.join(output, 'legacy-archive-regression.json'), JSON.stringify(result, null, 2) + '\n');
    await browser.close();
  }
  console.log('Phase 01–03 archives reopened and every sampled canvas matched the pinned baseline.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
