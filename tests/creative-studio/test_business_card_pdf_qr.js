const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');
const pdfParse = require('pdf-parse');
const { BusinessCardEngine } = require('../../assets/js/creative-studio/business-card.js');
const { QrVcardEngine } = require('../../assets/js/creative-studio/qr-vcard.js');

(async () => {
  const qrEngine = new QrVcardEngine();
  const vcard = qrEngine.formatVcard({
    fullName: 'Alex Morgan',
    organization: 'AnyConverter Studio',
    title: 'Lead Architect',
    email: 'alex.morgan@anyconverter.example.com',
    phone: '+1-555-4321',
    url: 'https://anyconverter.io/creative-studio/'
  });

  const cardEngine = new BusinessCardEngine({ trimWidthMm: 85, trimHeightMm: 55, bleedMm: 3 });

  // Front Side
  cardEngine.addLayerToSide('front', {
    id: 'front-name',
    type: 'text',
    content: 'Alex Morgan',
    fontSize: 24,
    x: 40,
    y: 50
  });
  cardEngine.addLayerToSide('front', {
    id: 'front-title',
    type: 'text',
    content: 'Lead Architect | AnyConverter Studio',
    fontSize: 14,
    x: 40,
    y: 85
  });

  // Back Side with QR
  cardEngine.addLayerToSide('back', {
    id: 'back-qr',
    type: 'qr',
    payload: vcard,
    size: 140
  });
  cardEngine.addLayerToSide('back', {
    id: 'back-label',
    type: 'text',
    content: 'Scan to save contact',
    fontSize: 12,
    x: 40,
    y: 80
  });

  // Export PDF
  const pdfRes = await cardEngine.exportPdf();
  const pdfBuffer = Buffer.from(pdfRes.pdfBytes);
  const pdfPath = path.join(process.cwd(), 'temp_test_card.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`Saved temp_test_card.pdf (${pdfBuffer.length} bytes)`);

  // Verify PDF page count and text with pdf-parse
  const parsedPdf = await pdfParse(pdfBuffer);
  console.log('PDF Page Count:', parsedPdf.numpages);
  console.log('PDF Text Extract:', parsedPdf.text.trim().replace(/\n+/g, ' '));

  // Render both pages with Chromium
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('file:///' + pdfPath.replace(/\\/g, '/'));
  await page.waitForTimeout(1000);

  // Take screenshot of rendered PDF in Chromium
  const pageScreenshot = await page.screenshot({ fullPage: true });
  fs.writeFileSync('temp_test_card_render.png', pageScreenshot);
  console.log('Saved temp_test_card_render.png');

  // Also render canvas directly to verify canvas drawing of card
  const canvasBuffer = await page.evaluate(async (vcardPayload) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1075; // 91mm at 300 DPI
    canvas.height = 720; // 61mm at 300 DPI
    const ctx = canvas.getContext('2d');

    // We can evaluate BusinessCardEngine inside browser or pass pixels
    return null;
  }, vcard);

  await browser.close();

  // Test decoding QR from the SVG generated for the card
  const qrSvgRes = qrEngine.generateQrSvg(vcard, { size: 300 });
  const browser2 = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page2 = await browser2.newPage();
  await page2.setContent(`<!DOCTYPE html><html><body style="margin:0;background:white;">${qrSvgRes.svg}</body></html>`);
  const svgEl = await page2.$('svg');
  const qrPng = await svgEl.screenshot();
  await browser2.close();

  const decodedQr = jsQR(new Uint8ClampedArray(PNG.sync.read(qrPng).data), 300, 300);
  console.log('Card QR Decoded:', !!decodedQr);
  if (decodedQr) {
    console.log('Exact vCard Match:', decodedQr.data === vcard);
    console.log('Decoded vCard Name:', decodedQr.data.includes('Alex Morgan'));
  }
})();
