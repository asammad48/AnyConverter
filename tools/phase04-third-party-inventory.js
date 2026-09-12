#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pages = [
  '/',
  '/pdf-merge/',
  '/pdf-compress/',
  '/organize-pdf/',
  '/jpg-to-pdf/',
  '/pdf-to-jpg/',
  '/ocr-pdf/',
  '/redact-pdf/',
  '/pdf-security/',
  '/json-formatter/',
  '/csv-to-sql/',
  '/csv-query/',
  '/jwt-decoder/',
  '/regex-tester/',
  '/hash-generator/',
  '/base64-encoder/',
  '/url-encoder/',
  '/cron-expression-parser/',
  '/image-converter/',
  '/word-counter/',
  '/typing-speed-test/',
  '/privacy/',
  '/security/',
];

function pageFile(urlPath) {
  if (urlPath === '/') return 'index.html';
  return path.join(urlPath.replace(/^\/|\/$/g, ''), 'index.html');
}

function classify(url) {
  const host = new URL(url).hostname;
  if (host === 'fonts.googleapis.com' || host === 'fonts.gstatic.com') {
    return { purpose: 'Font stylesheet or font file', dataClass: 'Browser request metadata; no tool content intended', consent: 'Privacy/legal review' };
  }
  if (host === 'unpkg.com' || host === 'cdnjs.cloudflare.com' || host === 'cdn.jsdelivr.net') {
    return { purpose: 'Versioned third-party tool library', dataClass: 'Browser request metadata; no tool content intended', consent: 'Necessary for affected tool page' };
  }
  if (/google|doubleclick|googlesyndication/.test(host)) {
    return { purpose: 'Analytics or advertising service', dataClass: 'Browser request metadata and provider cookies/identifiers where enabled', consent: 'Consent/privacy configuration required' };
  }
  return { purpose: 'External resource', dataClass: 'Browser request metadata', consent: 'Review required' };
}

function resourcesFrom(html) {
  const resources = [];
  for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
    const url = new URL(match[1]);
    if (url.hostname !== 'anyconverter.io') resources.push(match[1]);
  }
  return resources;
}

const rows = [];
for (const urlPath of pages) {
  const file = pageFile(urlPath);
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    rows.push({ page: urlPath, file, host: '(missing file)', resource: '', purpose: 'Missing local file', dataClass: '', consent: 'Fix required', owner: 'Engineering' });
    continue;
  }
  const html = fs.readFileSync(abs, 'utf8');
  for (const resource of resourcesFrom(html)) {
    const details = classify(resource);
    rows.push({
      page: urlPath,
      file,
      host: new URL(resource).hostname,
      resource,
      owner: details.purpose.includes('Font') ? 'Design/Engineering' : 'Engineering',
      ...details,
    });
  }
}

const columns = ['page', 'file', 'host', 'resource', 'purpose', 'dataClass', 'consent', 'owner'];
console.log(columns.join(','));
for (const row of rows) {
  console.log(columns.map((key) => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(','));
}
