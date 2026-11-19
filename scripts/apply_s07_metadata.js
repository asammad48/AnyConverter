#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const updates = [
  {
    slug: 'ip-address-lookup',
    title: 'IP Address Lookup Online Free | AnyConverter',
    desc: 'Look up any IP address online free. Find your public IPv4 or IPv6 address, geolocation, ISP, city, hostname, ASN, and timezone instantly with zero logs.'
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator Online Free | AnyConverter',
    desc: 'Calculate discounts, sale prices, and total savings online free. Enter original price and discount percentage to see final cost instantly without signup.'
  },
  {
    slug: 'daily-planner',
    title: 'Daily Planner Online Free | AnyConverter',
    desc: 'Plan your day with a free online daily planner. Organize tasks, track time blocks, schedule routines, and auto-save securely in your browser without signup.'
  },
  {
    slug: 'internet-speed-test',
    title: 'Internet Speed Test Online Free | AnyConverter',
    desc: 'Test your internet speed online free. Accurately measure download speed, upload bandwidth, latency, and ping directly in your browser with zero installs.'
  },
  {
    slug: 'pdf-merge',
    title: 'Merge PDF Files Online Free | AnyConverter',
    desc: 'Merge PDF files online free into one document. Combine multiple PDFs, reorder pages, and export your merged file directly in your browser without uploading.'
  },
  {
    slug: 'pdf-forms',
    title: 'Fill PDF Forms Online Free | AnyConverter',
    desc: 'Fill PDF forms online free in your browser. Type text, select checkboxes, complete fields, and download flattened PDF documents securely without file uploads.'
  },
  {
    slug: 'extract-pdf-pages',
    title: 'Extract PDF Pages Online Free | AnyConverter',
    desc: 'Extract PDF pages online free in your browser. Select specific page ranges, split individual pages, and download custom PDF files securely without uploads.'
  },
  {
    slug: 'keyboard-tester',
    title: 'Keyboard Tester Online Free | AnyConverter',
    desc: 'Test keyboard keys online free in your browser. Check key latency, detect ghosting, identify stuck keys, and inspect scan codes with zero software installs.'
  },
  {
    slug: 'sticky-notes',
    title: 'Sticky Notes Online Free | AnyConverter',
    desc: 'Create free online sticky notes with instant local auto-save. Organize ideas by color, pin key notes, search, and export to TXT or JSON without sign-up.'
  },
  {
    slug: 'gst-vat-calculator',
    title: 'GST &amp; VAT Calculator Online Free | AnyConverter',
    desc: 'Calculate GST and VAT online free. Add or remove sales tax from prices, compare tax rates, and compute subtotal, tax amount, and total without registration.'
  }
];

function escapeHtmlAttr(str) {
  return str.replace(/"/g, '&quot;');
}

for (const item of updates) {
  const filePath = path.join(process.cwd(), item.slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error(`File missing: ${filePath}`);
    process.exit(1);
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const eol = html.includes('\r\n') ? '\r\n' : '\n';

  // 1. Update <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${item.title}</title>`);

  // 2. Update <meta name="description">
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']/i,
    `<meta name="description" content="${escapeHtmlAttr(item.desc)}"`
  );

  // 3. Update <meta property="og:title">
  if (/<meta\s+property=["']og:title["']/i.test(html)) {
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i,
      `<meta property="og:title" content="${escapeHtmlAttr(item.title)}"`
    );
  }

  // 4. Update <meta property="og:description">
  if (/<meta\s+property=["']og:description["']/i.test(html)) {
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']/i,
      `<meta property="og:description" content="${escapeHtmlAttr(item.desc)}"`
    );
  }

  // 5. Update or insert Twitter tags
  if (/<meta\s+name=["']twitter:title["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i,
      `<meta name="twitter:title" content="${escapeHtmlAttr(item.title)}"`
    );
  } else {
    // Insert after twitter:card or og:image
    const anchor = /<meta\s+name=["']twitter:card["'][^>]*>/i;
    if (anchor.test(html)) {
      html = html.replace(anchor, `$&${eol}  <meta name="twitter:title" content="${escapeHtmlAttr(item.title)}">`);
    }
  }

  if (/<meta\s+name=["']twitter:description["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']/i,
      `<meta name="twitter:description" content="${escapeHtmlAttr(item.desc)}"`
    );
  } else {
    // Insert after twitter:title
    const anchor = /<meta\s+name=["']twitter:title["'][^>]*>/i;
    if (anchor.test(html)) {
      html = html.replace(anchor, `$&${eol}  <meta name="twitter:description" content="${escapeHtmlAttr(item.desc)}">`);
    }
  }

  if (!/<meta\s+name=["']twitter:image["']/i.test(html)) {
    const anchor = /<meta\s+name=["']twitter:description["'][^>]*>/i;
    if (anchor.test(html)) {
      html = html.replace(anchor, `$&${eol}  <meta name="twitter:image" content="https://anyconverter.io/assets/img/og-image.png">`);
    }
  }

  // Write back
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated ${item.slug}/index.html`);
}

console.log('All 10 striking-distance tool metadata rewrites applied successfully.');
