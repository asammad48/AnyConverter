const { chromium } = require('playwright-core');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');
const fs = require('fs');
const { QrVcardEngine } = require('../../assets/js/creative-studio/qr-vcard.js');

(async () => {
  const engine = new QrVcardEngine();
  const vcard = engine.formatVcard({
    fullName: 'Dr. Jane Doe',
    organization: 'Acme Research Corp',
    title: 'Lead Architect',
    email: 'jane.doe@acme.example.com',
    phone: '+1-555-0199',
    url: 'https://anyconverter.io'
  });

  const qrRes = engine.generateQrSvg(vcard, { size: 400 });
  fs.writeFileSync('temp_test_qr.svg', qrRes.svg);

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\abdul.sammad\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;background:white;">${qrRes.svg}</body></html>`);
  const svgEl = await page.$('svg');
  const pngBuffer = await svgEl.screenshot({ type: 'png' });
  fs.writeFileSync('temp_test_qr.png', pngBuffer);
  await browser.close();

  const png = PNG.sync.read(pngBuffer);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (code) {
    console.log('DECODED QR SUCCESS!');
    console.log('Payload match:', code.data === vcard);
    console.log('Decoded length:', code.data.length, 'Original length:', vcard.length);
    console.log('Decoded content:\n' + code.data);
  } else {
    console.log('DECODE FAILED: jsQR could not decode');
  }
})();
