#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');

const origin = 'http://127.0.0.1:5000';
const route = '/pdf-metadata-remover/';
const canonicalUrl = 'https://anyconverter.io/pdf-metadata-remover/';

async function makePdfBytes() {
  const doc = await PDFDocument.create();
  const pageOne = doc.addPage([240, 180]);
  pageOne.drawText('Phase 06 metadata fixture', { x: 24, y: 120, size: 14 });
  doc.setTitle('Confidential Draft');
  doc.setAuthor('Phase Six Author');
  doc.setSubject('Internal metadata test');
  doc.setKeywords(['metadata', 'phase-06']);
  doc.setCreator('Phase 06 Browser Check');
  doc.setProducer('AnyConverter Test Harness');
  doc.setCreationDate(new Date('2026-09-12T00:00:00Z'));
  doc.setModificationDate(new Date('2026-09-12T01:00:00Z'));
  return Buffer.from(await doc.save());
}

function emptyish(value) {
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || String(value).trim() === '';
}

function isEpochDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime()) && value.getTime() === 0;
}

async function inspectDownloadedPdf(bytes) {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  return {
    pageCount: doc.getPageCount(),
    titleCleared: emptyish(doc.getTitle()),
    authorCleared: emptyish(doc.getAuthor()),
    subjectCleared: emptyish(doc.getSubject()),
    keywordsCleared: emptyish(doc.getKeywords()),
    creatorCleared: emptyish(doc.getCreator()),
    producerCleared: emptyish(doc.getProducer()),
    creationDateReset: isEpochDate(doc.getCreationDate()),
    modificationDateReset: isEpochDate(doc.getModificationDate()),
  };
}

function validateHreflangs(hreflangs) {
  const expected = new Map([
    ['en', canonicalUrl],
    ['x-default', canonicalUrl],
  ]);
  const seen = new Set();
  for (const row of hreflangs) {
    if (seen.has(row.hreflang)) return `Duplicate hreflang: ${row.hreflang}`;
    seen.add(row.hreflang);
    if (!expected.has(row.hreflang)) return `Unexpected hreflang: ${row.hreflang}`;
    if (row.href !== expected.get(row.hreflang)) return `Unexpected ${row.hreflang} href: ${row.href}`;
  }
  for (const code of expected.keys()) {
    if (!seen.has(code)) return `Missing hreflang: ${code}`;
  }
  return '';
}

async function runViewport(browser, name, viewport) {
  const context = await browser.newContext({ acceptDownloads: true, viewport });
  const page = await context.newPage();
  const consoleMessages = [];
  const pageErrors = [];
  const unexpectedUploads = [];

  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
      unexpectedUploads.push({ method: request.method(), url: request.url() });
    }
  });

  await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#main-content');
  const seo = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    hreflangs: Array.from(document.querySelectorAll('link[rel="alternate"]')).map((node) => ({
      hreflang: node.getAttribute('hreflang'),
      href: node.href,
    })),
    invalidJsonLd: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).filter((node) => {
      try { JSON.parse(node.textContent); return false; } catch (_e) { return true; }
    }).length,
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));

  const fixture = await makePdfBytes();
  await page.setInputFiles('#pm-file', {
    name: 'phase-six-metadata.pdf',
    mimeType: 'application/pdf',
    buffer: fixture,
  });
  await page.waitForSelector('#pm-panel', { state: 'visible', timeout: 10000 });
  await page.check('#pm-dates');
  const tableText = await page.locator('#pm-metadata-rows').innerText();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.click('#pm-btn'),
  ]);
  const status = await page.locator('#pm-status').innerText();
  const suggestedFilename = download.suggestedFilename();
  const downloadPath = await download.path();
  const downloadedBytes = fs.readFileSync(downloadPath);
  const downloadedPdf = await inspectDownloadedPdf(downloadedBytes);
  const hreflangError = validateHreflangs(seo.hreflangs);

  await context.close();

  return {
    viewport: name,
    title: seo.title,
    h1: seo.h1,
    canonical: seo.canonical,
    hreflangs: seo.hreflangs,
    hreflangError,
    invalidJsonLd: seo.invalidJsonLd,
    horizontalOverflow: seo.horizontalOverflow,
    metadataDetected: tableText.includes('Confidential Draft') && tableText.includes('Phase Six Author'),
    status,
    suggestedFilename,
    downloadedBytes: downloadedBytes.length,
    downloadedPdf,
    unexpectedUploads,
    consoleMessages,
    pageErrors,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await runViewport(browser, 'desktop', { width: 1366, height: 900 }));
    results.push(await runViewport(browser, 'mobile', { width: 360, height: 740 }));
    console.log(JSON.stringify(results, null, 2));

    const failures = results.filter((row) => (
      row.canonical !== canonicalUrl ||
      row.hreflangError ||
      row.invalidJsonLd ||
      row.horizontalOverflow ||
      !row.metadataDetected ||
      !/Done\. Cleared:/.test(row.status) ||
      row.suggestedFilename !== 'phase-six-metadata-metadata-cleaned.pdf' ||
      row.downloadedPdf.pageCount !== 1 ||
      !row.downloadedPdf.titleCleared ||
      !row.downloadedPdf.authorCleared ||
      !row.downloadedPdf.subjectCleared ||
      !row.downloadedPdf.keywordsCleared ||
      !row.downloadedPdf.creatorCleared ||
      !row.downloadedPdf.producerCleared ||
      !row.downloadedPdf.creationDateReset ||
      !row.downloadedPdf.modificationDateReset ||
      row.unexpectedUploads.length ||
      row.consoleMessages.some((message) => message.type === 'error') ||
      row.pageErrors.length
    ));
    if (failures.length) {
      console.error(`Phase 06 PDF metadata remover check found ${failures.length} failing viewport(s).`);
      console.error(JSON.stringify(failures, null, 2));
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
