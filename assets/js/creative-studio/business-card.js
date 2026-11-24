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
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BusinessCardEngine };
}
