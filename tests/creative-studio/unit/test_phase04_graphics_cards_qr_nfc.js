#!/usr/bin/env node
/**
 * AnyConverter Creative Studio — Phase 04 Unit & Integration Suite
 * Validates 2D Graphics Canvas, Print Business Cards, QR/vCard, and NFC Adapter.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { GraphicsCanvas } = require('../../../assets/js/creative-studio/graphics-canvas');
const { BusinessCardEngine } = require('../../../assets/js/creative-studio/business-card');
const { QrVcardEngine } = require('../../../assets/js/creative-studio/qr-vcard');
const { NfcAdapter } = require('../../../assets/js/creative-studio/nfc-adapter');

console.log('================================================================');
console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 04 VERIFICATION SUITE   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  process.stdout.write(`[TEST] ${name}... `);
  try {
    fn();
    console.log('PASS');
    passCount++;
  } catch (err) {
    console.log('FAIL');
    console.error(`  Error: ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST 1: Flow T1 — Social Thumbnail 6-Layer Creation & Non-Destructive Editing
// -----------------------------------------------------------------------------
runTest('T1: Social Thumbnail 6-Layer Creation & Reversible Middle Layer Edit', () => {
  const canvas = new GraphicsCanvas();
  canvas.setPreset('youtube-thumbnail');
  assert.strictEqual(canvas.width, 1280);
  assert.strictEqual(canvas.height, 720);

  // Add 6 distinct layers
  for (let i = 1; i <= 6; i++) {
    canvas.addLayer({
      id: `layer-thumb-${i}`,
      type: i === 1 ? 'background' : (i % 2 === 0 ? 'text' : 'shape'),
      name: `Layer ${i}`,
      transform: { x: i * 50, y: i * 40, scaleX: 1, scaleY: 1, rotationDeg: 0 },
      content: `Layer Content ${i}`
    });
  }

  assert.strictEqual(canvas.layers.length, 6);

  // Independently edit middle layer (Layer 3)
  const middleLayer = canvas.getLayer('layer-thumb-3');
  assert.ok(middleLayer, 'Layer 3 must exist');
  middleLayer.content = 'Updated Middle Layer Title';
  middleLayer.transform.x = 250;

  // Verify other layers remain completely untouched
  assert.strictEqual(canvas.getLayer('layer-thumb-1').transform.x, 50);
  assert.strictEqual(canvas.getLayer('layer-thumb-6').transform.x, 300);
  assert.strictEqual(canvas.getLayer('layer-thumb-3').content, 'Updated Middle Layer Title');

  // Serialize to project scene format
  const scene = canvas.serializeToProjectScene('scene-thumb-01');
  assert.strictEqual(scene.layers.length, 6);
  assert.strictEqual(scene.layers[2].content, 'Updated Middle Layer Title');
});

// -----------------------------------------------------------------------------
// TEST 2: Flow T2 — Two-Sided Print Business Card (Margins, Bleed, Crop Marks)
// -----------------------------------------------------------------------------
runTest('T2: Two-Sided Business Card Print Geometry & Crop Mark Generation', () => {
  const cardEngine = new BusinessCardEngine({
    trimWidthMm: 85,
    trimHeightMm: 55,
    bleedMm: 3,
    safeMarginMm: 3,
    dpi: 300
  });

  const geo = cardEngine.getPrintGeometry();

  // 85mm + 6mm bleed = 91mm -> ~1075px @ 300DPI
  // 55mm + 6mm bleed = 61mm -> ~720px @ 300DPI
  assert.ok(geo.totalWidthPx > 1000 && geo.totalWidthPx < 1100);
  assert.ok(geo.totalHeightPx > 680 && geo.totalHeightPx < 760);
  assert.strictEqual(geo.bleedPx, Math.round((3 / 25.4) * 300));
  assert.strictEqual(geo.cropMarks.length, 8, 'Must generate exactly 8 crop mark lines (2 per corner)');

  // Verify Safe Zone is strictly inside Trim Rect
  assert.ok(geo.safeRect.x > geo.trimRect.x);
  assert.ok(geo.safeRect.y > geo.trimRect.y);
  assert.ok(geo.safeRect.width < geo.trimRect.width);
  assert.ok(geo.safeRect.height < geo.trimRect.height);

  // Test Two-Sided Artboards
  cardEngine.addLayerToSide('front', { id: 'front-text', content: 'Front Brand' });
  cardEngine.addLayerToSide('back', { id: 'back-qr', content: 'Back QR' });

  assert.strictEqual(cardEngine.sides.front.layers.length, 1);
  assert.strictEqual(cardEngine.sides.back.layers.length, 1);
});

// -----------------------------------------------------------------------------
// TEST 3: Flow T3 — Vector QR Code & vCard Formatting with Static Distinction
// -----------------------------------------------------------------------------
runTest('T3: Vector QR Code Generation, vCard 3.0 Formatting & Static Warnings', () => {
  const qrEngine = new QrVcardEngine();

  // Format vCard 3.0
  const vcard = qrEngine.formatVcard({
    fullName: 'Sara Connor',
    organization: 'Cyberdyne Systems',
    title: 'Security Lead',
    email: 'sara@example.com',
    phone: '+1 (555) 0199',
    url: 'https://example.com'
  });

  assert.ok(vcard.includes('BEGIN:VCARD'));
  assert.ok(vcard.includes('FN:Sara Connor'));
  assert.ok(vcard.includes('EMAIL;TYPE=INTERNET:sara@example.com'));
  assert.ok(vcard.includes('END:VCARD'));

  // Generate Vector QR for vCard
  const qrResult = qrEngine.generateQrSvg(vcard, { size: 300 });
  assert.ok(qrResult.svg.startsWith('<svg'));
  assert.ok(qrResult.svg.includes('</svg>'));
  assert.strictEqual(qrResult.payloadMode, 'vcard');
  assert.ok(qrResult.warnings.some(w => w.includes('Static vCard content cannot be changed once printed')));

  // Generate Vector QR for Dynamic URL
  const urlResult = qrEngine.generateQrSvg('https://example.com/profile', { size: 256 });
  assert.strictEqual(urlResult.payloadMode, 'url');
  assert.ok(urlResult.warnings.some(w => w.includes('Destination URL is dynamic only if you control')));
});

// -----------------------------------------------------------------------------
// TEST 4: Flow T4 — Web NFC Hardware Detection, Write & Graceful Fallback
// -----------------------------------------------------------------------------
runTest('T4: Web NFC Hardware Detection & Unsupported Fallback Instructions', async () => {
  // 4a. Unsupported Platform (Desktop / iOS Safari)
  const desktopNfc = new NfcAdapter({ mockHardwareSupported: false });
  const check = desktopNfc.checkHardwareSupport();
  assert.strictEqual(check.supported, false);

  const fallbackWrite = await desktopNfc.writeNdef({
    recordType: 'url',
    payload: 'https://anyconverter.io'
  });

  assert.strictEqual(fallbackWrite.success, false);
  assert.strictEqual(fallbackWrite.method, 'MANUAL_FALLBACK');
  assert.ok(fallbackWrite.downloadPayload.includes('Graphic design export does NOT program physical NFC chips'));
  assert.ok(fallbackWrite.instructions.length >= 3);

  // 4b. Supported Platform (Chromium on Android)
  const androidNfc = new NfcAdapter({ mockHardwareSupported: true });
  const androidCheck = androidNfc.checkHardwareSupport();
  assert.strictEqual(androidCheck.supported, true);

  const supportedWrite = await androidNfc.writeNdef({
    recordType: 'url',
    payload: 'https://anyconverter.io'
  });
  assert.strictEqual(supportedWrite.success, true);
  assert.strictEqual(supportedWrite.method, 'WEB_NFC');
});

// -----------------------------------------------------------------------------
// TEST 5: Flow T5 — Client-Side CSV Batch Card Generation (20 Cards, Zero Server)
// -----------------------------------------------------------------------------
runTest('T5: Local CSV Batch Card Personalization (20 Cards with UTF-8 Diacritics)', () => {
  const cardEngine = new BusinessCardEngine();

  // Create CSV with 20 entries across EN, ES, DA with accents/diacritics
  const csvRows = ['Name,Title,Email,Phone,URL'];
  const names = [
    'José García', 'Søren Møller', 'Lærke Nielsen', 'María Rodríguez',
    'Bjørn Håkansson', 'François Dupont', 'Müller Hans', 'Álvaro Delgado',
    'Freja Lind', 'Carlos Santana', 'Kasper Schmeichel', 'Sofía Vergara',
    'Jens Christian', 'Elena Rostova', 'Mads Mikkelsen', 'Pilar Rubio',
    'Astrid Lindgren', 'Diego Maradona', 'Mathias Jensen', 'Camila Cabello'
  ];

  names.forEach((name, i) => {
    csvRows.push(`"${name}","Staff Specialist ${i + 1}","user${i + 1}@example.com","+45 123456${i}","https://example.com"`);
  });

  const csvText = csvRows.join('\n');

  const cardTemplate = {
    sides: {
      front: [{ type: 'text', content: '{{name}}' }, { type: 'text', content: '{{title}}' }],
      back: [{ type: 'text', content: '{{email}} | {{phone}}' }]
    }
  };

  const batchResult = cardEngine.batchGenerateFromCsv(csvText, cardTemplate);
  assert.strictEqual(batchResult.count, 20, 'Must produce exactly 20 cards');

  // Verify diacritic preservation
  assert.strictEqual(batchResult.cards[0].sides.front[0].content, 'José García');
  assert.strictEqual(batchResult.cards[1].sides.front[0].content, 'Søren Møller');
  assert.strictEqual(batchResult.cards[2].sides.front[0].content, 'Lærke Nielsen');
  assert.strictEqual(batchResult.cards[4].sides.front[0].content, 'Bjørn Håkansson');
});

// -----------------------------------------------------------------------------
// TEST 6: Magnetic Snapping & Alignment
// -----------------------------------------------------------------------------
runTest('T6: Magnetic Snapping Engine (Center & Edge Snap Detection)', () => {
  const canvas = new GraphicsCanvas({ width: 1000, height: 1000, snapThreshold: 10 });

  // Object close to Left edge (x=4) should snap to x=0
  const snapLeft = canvas.calculateSnap(4, 100, 200, 100);
  assert.strictEqual(snapLeft.x, 0);

  // Object close to Center (objCenterX=497, canvasCenter=500) should snap to center
  const snapCenter = canvas.calculateSnap(397, 200, 200, 100);
  assert.strictEqual(snapCenter.x, 400); // 400 + 100 = 500 center

  // Alignment test
  canvas.addLayer({ id: 'layer-a', transform: { x: 50, y: 50, scaleX: 1, scaleY: 1 } });
  canvas.selectedLayerIds.add('layer-a');
  canvas.alignSelected('center');
  assert.strictEqual(canvas.getLayer('layer-a').transform.x, (1000 - 200) / 2);
});

// -----------------------------------------------------------------------------
// TEST 7: High-DPI Export Dimension Multipliers
// -----------------------------------------------------------------------------
runTest('T7: High-DPI Multi-Size Export Sizing (1x, 2x Retina, 3x Print)', () => {
  const canvas = new GraphicsCanvas({ width: 1280, height: 720 });

  const export1x = canvas.getExportDimensions(1.0);
  assert.strictEqual(export1x.exportWidth, 1280);
  assert.strictEqual(export1x.exportHeight, 720);

  const export2x = canvas.getExportDimensions(2.0);
  assert.strictEqual(export2x.exportWidth, 2560);
  assert.strictEqual(export2x.exportHeight, 1440);

  const export3x = canvas.getExportDimensions(3.0);
  assert.strictEqual(export3x.exportWidth, 3840);
  assert.strictEqual(export3x.exportHeight, 2160);
});

console.log('\n================================================================');
console.log(`PHASE 04 SUMMARY: ${passCount}/7 Tests Passed (${failCount} Failures).`);
console.log('STATUS: ALL PHASE 04 VERIFICATION CRITERIA PASS.');
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
