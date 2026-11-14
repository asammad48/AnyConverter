const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: /.*visual_regression\.spec\.js/,
  timeout: 45000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  snapshotPathTemplate: '{testDir}/visual-snapshots/{arg}-{projectName}{ext}',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'output/playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:5000',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node server.js',
    port: 5000,
    reuseExistingServer: true,
    timeout: 15000,
  },
  projects: [
    {
      name: 'laptop-1366',
      use: {
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'desktop-1920',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'mobile-390',
      use: {
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
