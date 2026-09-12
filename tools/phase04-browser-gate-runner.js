#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const PDFLib = require('pdf-lib');

async function main() {
  const gatePath = path.join(process.cwd(), 'output', 'playwright', 'phase04-release-browser-gate.js');
  const source = fs.readFileSync(gatePath, 'utf8');
  const gate = Function(`"use strict"; return (${source});`)();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  try {
    const results = await gate(page, { fs, path, PDFLib });
    const failures = results.filter((row) => (
      row.workflowError ||
      row.validationErrors?.length ||
      row.invalidJsonLd ||
      row.horizontalOverflow ||
      row.missingSelectors?.length ||
      row.pageErrors?.length ||
      row.consoleMessages?.some((message) => message.type === 'error')
    ));
    if (failures.length) {
      console.error(`Phase 04 browser gate found ${failures.length} failing rows.`);
      console.error(JSON.stringify(failures.map((row) => ({
        url: row.url,
        viewport: row.viewport,
        validationErrors: row.validationErrors,
        workflowError: row.workflowError,
        missingSelectors: row.missingSelectors,
        invalidJsonLd: row.invalidJsonLd,
        horizontalOverflow: row.horizontalOverflow,
        pageErrors: row.pageErrors,
        consoleErrors: row.consoleMessages?.filter((message) => message.type === 'error') || [],
      })), null, 2));
      process.exitCode = 1;
    } else {
      console.log(`Phase 04 browser gate passed ${results.length} viewport/page checks.`);
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
