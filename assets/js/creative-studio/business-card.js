/**
 * AnyConverter Creative Studio — Business Card & Print Layout Engine
 * Two-sided artboards, print margins, 3mm bleed, crop marks, and local CSV batch generator.
 */

class BusinessCardEngine {
  constructor(options = {}) {
    this.trimWidthMm = options.trimWidthMm || 85;
    this.trimHeightMm = options.trimHeightMm || 55;
    this.bleedMm = options.bleedMm !== undefined ? options.bleedMm : 3;
    this.safeMarginMm = options.safeMarginMm !== undefined ? options.safeMarginMm : 3;
    this.dpi = options.dpi || 300;

    // Standard two-sided artboards
    this.sides = {
      front: { id: 'front', name: 'Front Side', layers: [] },
      back: { id: 'back', name: 'Back Side', layers: [] }
    };

    this.activeSide = 'front';
  }

  // --- Dimension & Print Calculations ---

  static get STANDARD_SIZES() {
    return {
      'eu-standard': { trimWidthMm: 85, trimHeightMm: 55, name: 'European Standard (85 x 55 mm)' },
      'us-standard': { trimWidthMm: 88.9, trimHeightMm: 50.8, name: 'US Standard (3.5 x 2.0 in)' },
      'jp-standard': { trimWidthMm: 91, trimHeightMm: 55, name: 'Japanese Meishi (91 x 55 mm)' }
    };
  }

  setSize(sizeKey) {
    const spec = BusinessCardEngine.STANDARD_SIZES[sizeKey];
    if (!spec) throw new Error(`Unknown size key: ${sizeKey}`);
    this.trimWidthMm = spec.trimWidthMm;
    this.trimHeightMm = spec.trimHeightMm;
  }

  mmToPixels(mm) {
    return Math.round((mm / 25.4) * this.dpi);
  }

  getPrintGeometry() {
    const totalWidthMm = this.trimWidthMm + (this.bleedMm * 2);
    const totalHeightMm = this.trimHeightMm + (this.bleedMm * 2);

    const totalWidthPx = this.mmToPixels(totalWidthMm);
    const totalHeightPx = this.mmToPixels(totalHeightMm);
    const bleedPx = this.mmToPixels(this.bleedMm);
    const safeMarginPx = this.mmToPixels(this.safeMarginMm);

    const trimRect = {
      x: bleedPx,
      y: bleedPx,
      width: totalWidthPx - (bleedPx * 2),
      height: totalHeightPx - (bleedPx * 2)
    };

    const safeRect = {
      x: bleedPx + safeMarginPx,
      y: bleedPx + safeMarginPx,
      width: trimRect.width - (safeMarginPx * 2),
      height: trimRect.height - (safeMarginPx * 2)
    };

    // Standard 4-corner crop marks (tick marks outside trim in bleed zone)
    const cropMarkLengthPx = Math.round(this.mmToPixels(2.0));
    const cropMarks = [
      // Top-Left corner
      { x1: trimRect.x, y1: 0, x2: trimRect.x, y2: trimRect.y - 2 },
      { x1: 0, y1: trimRect.y, x2: trimRect.x - 2, y2: trimRect.y },
      // Top-Right corner
      { x1: trimRect.x + trimRect.width, y1: 0, x2: trimRect.x + trimRect.width, y2: trimRect.y - 2 },
      { x1: totalWidthPx, y1: trimRect.y, x2: trimRect.x + trimRect.width + 2, y2: trimRect.y },
      // Bottom-Left corner
      { x1: trimRect.x, y1: totalHeightPx, x2: trimRect.x, y2: trimRect.y + trimRect.height + 2 },
      { x1: 0, y1: trimRect.y + trimRect.height, x2: trimRect.x - 2, y2: trimRect.y + trimRect.height },
      // Bottom-Right corner
      { x1: trimRect.x + trimRect.width, y1: totalHeightPx, x2: trimRect.x + trimRect.width, y2: trimRect.y + trimRect.height + 2 },
      { x1: totalWidthPx, y1: trimRect.y + trimRect.height, x2: trimRect.x + trimRect.width + 2, y2: trimRect.y + trimRect.height }
    ];

    return {
      totalWidthPx,
      totalHeightPx,
      bleedPx,
      safeMarginPx,
      trimRect,
      safeRect,
      cropMarks
    };
  }

  // --- Multi-Side Artboard Management ---

  setActiveSide(side) {
    if (!this.sides[side]) throw new Error(`Invalid side: ${side}. Must be 'front' or 'back'`);
    this.activeSide = side;
  }

  addLayerToSide(side, layer) {
    if (!this.sides[side]) throw new Error(`Invalid side: ${side}`);
    this.sides[side].layers.push(layer);
  }

  // --- Local CSV Batch Personalization Engine ---

  /**
   * Batch generates business cards from CSV text entirely client-side (Zero Server Upload)
   * @param {string} csvText - Raw CSV with headers e.g. Name,Title,Email,Phone,URL
   * @param {Object} cardTemplate - Base front/back template
   * @returns {{ count: number, cards: Array<Object>, warnings: string[] }}
   */
  batchGenerateFromCsv(csvText, cardTemplate) {
    if (!csvText || typeof csvText !== 'string') {
      throw new Error('CSV text must be a valid string');
    }

    const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dataRows = lines.slice(1);
    const generatedCards = [];
    const warnings = [];

    dataRows.forEach((row, rowIndex) => {
      // Basic CSV field parser handling quotes and UTF-8 diacritics
      const values = this._parseCsvRow(row);
      const rowData = {};
      headers.forEach((h, i) => {
        rowData[h] = values[i] !== undefined ? values[i] : '';
      });

      // Clone base template
      const personalizedCard = JSON.parse(JSON.stringify(cardTemplate));
      personalizedCard.batchIndex = rowIndex + 1;
      personalizedCard.metadata = {
        name: rowData.name || rowData.fullname || '',
        title: rowData.title || rowData.role || '',
        email: rowData.email || '',
        phone: rowData.phone || '',
        url: rowData.url || rowData.website || ''
      };

      // Substitute variables in front and back layers
      ['front', 'back'].forEach(side => {
        if (personalizedCard.sides && personalizedCard.sides[side]) {
          personalizedCard.sides[side].forEach(layer => {
            if (layer.type === 'text' && typeof layer.content === 'string') {
              layer.content = this._replacePlaceholders(layer.content, personalizedCard.metadata);
            }
          });
        }
      });

      generatedCards.push(personalizedCard);
    });

    return {
      count: generatedCards.length,
      cards: generatedCards,
      warnings
    };
  }

  _parseCsvRow(row) {
    const result = [];
    let insideQuotes = false;
    let currentField = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField.trim());
    return result;
  }

  _replacePlaceholders(text, metadata) {
    return text
      .replace(/{{name}}/gi, metadata.name)
      .replace(/{{title}}/gi, metadata.title)
      .replace(/{{email}}/gi, metadata.email)
      .replace(/{{phone}}/gi, metadata.phone)
      .replace(/{{url}}/gi, metadata.url);
  }

  /**
   * Render side artboard onto a 2D canvas context
   * @param {'front'|'back'} sideName
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} options
   */
  renderSideToCanvas(sideName, ctx, options = {}) {
    const side = this.sides[sideName];
    if (!side || !ctx) return;
    const geo = this.getPrintGeometry();

    // 1. Fill bleed background
    ctx.fillStyle = options.background || '#ffffff';
    ctx.fillRect(0, 0, geo.totalWidthPx, geo.totalHeightPx);

    // 2. Draw trim guideline (dashed)
    if (options.showGuides !== false) {
      ctx.save();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(geo.trimRect.x, geo.trimRect.y, geo.trimRect.width, geo.trimRect.height);
      ctx.restore();
    }

    // 3. Draw crop marks
    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    for (const mark of geo.cropMarks) {
      ctx.beginPath();
      ctx.moveTo(mark.x1, mark.y1);
      ctx.lineTo(mark.x2, mark.y2);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Draw side layers (positioned relative to trim box)
    ctx.save();
    ctx.translate(geo.trimRect.x, geo.trimRect.y);
    for (const layer of side.layers) {
      if (layer.visible === false) continue;
      ctx.save();
      const x = layer.transform ? layer.transform.x || 0 : (layer.x || 30);
      const y = layer.transform ? layer.transform.y || 0 : (layer.y || 30);
      ctx.translate(x, y);

      if (layer.type === 'text') {
        const fontSize = layer.fontSize || 28;
        const fontWeight = layer.fontWeight || 600;
        ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = layer.fill || '#111827';
        ctx.textBaseline = 'top';
        ctx.fillText(String(layer.content || ''), 0, 0);
      } else if (layer.type === 'qr') {
        const qrSize = layer.size || 140;
        let qrEngine = null;
        if (typeof QrVcardEngine !== 'undefined') qrEngine = new QrVcardEngine();
        else if (typeof window !== 'undefined' && window.QrVcardEngine) qrEngine = new window.QrVcardEngine();
        else if (typeof globalThis !== 'undefined' && globalThis.QrVcardEngine) qrEngine = new globalThis.QrVcardEngine();
        else if (typeof require !== 'undefined') {
          try { qrEngine = new (require('./qr-vcard.js').QrVcardEngine)(); } catch(e) {}
        }
        let matrix = layer.matrix;
        if (!matrix && qrEngine && (layer.payload || layer.content)) {
          try {
            const qrRes = qrEngine.generateQrSvg(layer.payload || layer.content, { size: qrSize });
            matrix = qrRes.matrix;
          } catch(e) {}
        }
        if (matrix && matrix.length > 0) {
          const modCount = matrix.length;
          const modSize = qrSize / modCount;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, qrSize, qrSize);
          ctx.fillStyle = layer.fill || '#000000';
          for (let r = 0; r < modCount; r++) {
            for (let c = 0; c < modCount; c++) {
              if (matrix[r][c] === 1) {
                ctx.fillRect(c * modSize, r * modSize, modSize + 0.1, modSize + 0.1);
              }
            }
          }
        } else {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, qrSize, qrSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Inter, sans-serif';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText('vCard QR', qrSize / 2, qrSize / 2);
        }
      } else if (layer.type === 'shape') {
        ctx.fillStyle = layer.fill || '#e2e8f0';
        ctx.fillRect(0, 0, layer.width || 100, layer.height || 40);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  /**
   * Export authentic two-sided print PDF (front and back) at exact dimensions
   * @param {Object} options
   * @returns {Promise<{ pdfBytes: Uint8Array, blob: Blob|null, dataUrl: string }>}
   */
  async exportPdf(options = {}) {
    const totalWidthMm = this.trimWidthMm + (this.bleedMm * 2);
    const totalHeightMm = this.trimHeightMm + (this.bleedMm * 2);
    // 1 mm = 72 / 25.4 points ≈ 2.83464567 pt
    const ptPerMm = 72 / 25.4;
    const widthPt = totalWidthMm * ptPerMm;
    const heightPt = totalHeightMm * ptPerMm;
    const bleedPt = this.bleedMm * ptPerMm;
    const trimWidthPt = this.trimWidthMm * ptPerMm;
    const trimHeightPt = this.trimHeightMm * ptPerMm;

    // Build standards-compliant PDF-1.4 two-page document
    const objects = [];
    let objCount = 0;
    const addObj = (content) => {
      objCount++;
      objects.push({ id: objCount, content });
      return objCount;
    };

    // Helper to format text stream
    const buildPageStream = (sideName) => {
      const side = this.sides[sideName];
      let stream = 'q\n';
      // Background white
      stream += `1 1 1 rg 0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)} re f\n`;

      // Crop marks in black (0.5pt line width)
      stream += '0 0 0 RG 0.5 w\n';
      const x1 = bleedPt;
      const x2 = bleedPt + trimWidthPt;
      const y1 = bleedPt;
      const y2 = bleedPt + trimHeightPt;
      const markLen = 2.0 * ptPerMm;

      // 8 crop mark lines
      stream += `${x1.toFixed(2)} 0 m ${x1.toFixed(2)} ${(y1 - 2).toFixed(2)} l S\n`;
      stream += `0 ${y1.toFixed(2)} m ${(x1 - 2).toFixed(2)} ${y1.toFixed(2)} l S\n`;
      stream += `${x2.toFixed(2)} 0 m ${x2.toFixed(2)} ${(y1 - 2).toFixed(2)} l S\n`;
      stream += `${widthPt.toFixed(2)} ${y1.toFixed(2)} m ${(x2 + 2).toFixed(2)} ${y1.toFixed(2)} l S\n`;
      stream += `${x1.toFixed(2)} ${heightPt.toFixed(2)} m ${x1.toFixed(2)} ${(y2 + 2).toFixed(2)} l S\n`;
      stream += `0 ${y2.toFixed(2)} m ${(x1 - 2).toFixed(2)} ${y2.toFixed(2)} l S\n`;
      stream += `${x2.toFixed(2)} ${heightPt.toFixed(2)} m ${x2.toFixed(2)} ${(y2 + 2).toFixed(2)} l S\n`;
      stream += `${widthPt.toFixed(2)} ${y2.toFixed(2)} m ${(x2 + 2).toFixed(2)} ${y2.toFixed(2)} l S\n`;

      // Layers
      if (side && side.layers) {
        for (const layer of side.layers) {
          if (layer.visible === false) continue;
          if (layer.type === 'text') {
            const text = String(layer.content || '').replace(/[\(\)\\]/g, '\\$&');
            const lx = x1 + (layer.x || 20) * 0.24;
            const ly = y2 - (layer.y || 20) * 0.24 - 10;
            stream += `BT /F1 10 Tf 0.1 0.1 0.15 rg 1 0 0 1 ${lx.toFixed(2)} ${ly.toFixed(2)} Tm (${text}) Tj ET\n`;
          } else if (layer.type === 'qr') {
            let qrEngine = null;
            if (typeof QrVcardEngine !== 'undefined') qrEngine = new QrVcardEngine();
            else if (typeof window !== 'undefined' && window.QrVcardEngine) qrEngine = new window.QrVcardEngine();
            else if (typeof globalThis !== 'undefined' && globalThis.QrVcardEngine) qrEngine = new globalThis.QrVcardEngine();
            else if (typeof require !== 'undefined') {
              try { qrEngine = new (require('./qr-vcard.js').QrVcardEngine)(); } catch(e) {}
            }
            let matrix = layer.matrix;
            if (!matrix && qrEngine && (layer.payload || layer.content)) {
              try {
                const qrRes = qrEngine.generateQrSvg(layer.payload || layer.content, { size: 100 });
                matrix = qrRes.matrix;
              } catch(e) {}
            }
            if (matrix && matrix.length > 0) {
              const qrx = x2 - 70; // Position on back card
              const qry = y1 + 15;
              const qrDimensionPt = 55; // 55 pt size
              const modCount = matrix.length;
              const modPt = qrDimensionPt / modCount;
              // White quiet zone background
              stream += `1 1 1 rg ${qrx.toFixed(2)} ${qry.toFixed(2)} ${qrDimensionPt.toFixed(2)} ${qrDimensionPt.toFixed(2)} re f\n`;
              // Black modules
              stream += `0 0 0 rg\n`;
              for (let r = 0; r < modCount; r++) {
                for (let c = 0; c < modCount; c++) {
                  if (matrix[r][c] === 1) {
                    const mx = qrx + c * modPt;
                    const my = qry + (modCount - 1 - r) * modPt;
                    stream += `${mx.toFixed(2)} ${my.toFixed(2)} ${modPt.toFixed(2)} ${modPt.toFixed(2)} re\n`;
                  }
                }
              }
              stream += `f\n`;
            } else {
              const qrx = x2 - 40;
              const qry = y1 + 10;
              stream += `0 0 0 rg ${qrx.toFixed(2)} ${qry.toFixed(2)} 30 30 re f\n`;
            }
          }
        }
      }

      stream += 'Q\n';
      return stream;
    };

    const frontStream = buildPageStream('front');
    const backStream = buildPageStream('back');

    // 1. Catalog
    const catalogId = addObj('<< /Type /Catalog /Pages 2 0 R >>');
    // 2. Pages
    const pagesId = addObj(''); // Placeholder
    // 3. Font
    const fontId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    // 4. Page 1 Content Stream
    const p1StreamId = addObj(`<< /Length ${frontStream.length} >>\nstream\n${frontStream}endstream`);
    // 5. Page 1 Object
    const p1Id = addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /TrimBox [${bleedPt.toFixed(2)} ${bleedPt.toFixed(2)} ${(widthPt - bleedPt).toFixed(2)} ${(heightPt - bleedPt).toFixed(2)}] /BleedBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${p1StreamId} 0 R >>`);
    // 6. Page 2 Content Stream
    const p2StreamId = addObj(`<< /Length ${backStream.length} >>\nstream\n${backStream}endstream`);
    // 7. Page 2 Object
    const p2Id = addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /TrimBox [${bleedPt.toFixed(2)} ${bleedPt.toFixed(2)} ${(widthPt - bleedPt).toFixed(2)} ${(heightPt - bleedPt).toFixed(2)}] /BleedBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${p2StreamId} 0 R >>`);

    // Update Pages Object
    objects[1].content = `<< /Type /Pages /Kids [${p1Id} 0 R ${p2Id} 0 R] /Count 2 >>`;

    // Serialize PDF
    let pdfStr = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = [0];
    for (const obj of objects) {
      offsets.push(pdfStr.length);
      pdfStr += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
    }

    const xrefOffset = pdfStr.length;
    pdfStr += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      pdfStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdfStr += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    const pdfBytes = (typeof TextEncoder !== 'undefined')
      ? new TextEncoder().encode(pdfStr)
      : Buffer.from(pdfStr, 'latin1');

    let blob = null;
    let url = null;
    if (typeof Blob !== 'undefined') {
      blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (typeof URL !== 'undefined' && URL.createObjectURL) {
        url = URL.createObjectURL(blob);
      }
    }

    return {
      pdfBytes,
      blob,
      url,
      pages: 2,
      trimWidthMm: this.trimWidthMm,
      trimHeightMm: this.trimHeightMm
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BusinessCardEngine };
}
if (typeof window !== 'undefined') {
  window.BusinessCardEngine = BusinessCardEngine;
}
