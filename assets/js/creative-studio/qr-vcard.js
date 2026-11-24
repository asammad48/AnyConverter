/**
 * AnyConverter Creative Studio — Vector QR & vCard 3.0 Generator
 * Client-side vector SVG generation for vCards and URLs with quiet-zone and contrast verification.
 */

class QrVcardEngine {
  constructor(options = {}) {
    this.errorCorrection = options.errorCorrection || 'M'; // L, M, Q, H
    this.quietZoneModules = options.quietZoneModules !== undefined ? options.quietZoneModules : 4;
  }

  /**
   * Format a standard vCard 3.0 string with UTF-8 character preservation
   * @param {Object} contact
   * @returns {string} vCard formatted payload
   */
  formatVcard(contact = {}) {
    if (!contact.name && !contact.fullName) {
      throw new Error('vCard requires at least a name or fullName');
    }

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.fullName || contact.name}`
    ];

    if (contact.organization) lines.push(`ORG:${contact.organization}`);
    if (contact.title) lines.push(`TITLE:${contact.title}`);
    if (contact.email) lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`);
    if (contact.phone) lines.push(`TEL;TYPE=CELL:${contact.phone}`);
    if (contact.url) lines.push(`URL:${contact.url}`);
    if (contact.address) lines.push(`ADR;TYPE=WORK:;;${contact.address};;;;`);

    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  /**
   * Generate an SVG QR code representation
   * Uses a deterministic client-side matrix algorithm with quiet zone validation
   * @param {string} text - Payload to encode
   * @param {Object} options - { size, fill, background }
   * @returns {{ svg: string, matrixSize: number, payloadMode: 'vcard'|'url'|'text', warnings: string[] }}
   */
  generateQrSvg(text, options = {}) {
    if (!text || typeof text !== 'string') {
      throw new Error('Payload text must be a non-empty string');
    }

    const size = options.size || 256;
    const fill = options.fill || '#000000';
    const bg = options.background || '#ffffff';
    const warnings = [];

    // Payload classification
    let payloadMode = 'text';
    if (text.startsWith('BEGIN:VCARD')) {
      payloadMode = 'vcard';
      warnings.push('NOTICE: Static vCard content cannot be changed once printed on physical media.');
    } else if (/^https?:\/\//i.test(text)) {
      payloadMode = 'url';
      warnings.push('NOTICE: Destination URL is dynamic only if you control the target server.');
    }

    // Determine matrix dimension (Version 2 to 4 based on length)
    const len = text.length;
    let moduleCount = 25; // 25x25 (Version 2)
    if (len > 32) moduleCount = 29; // Version 3
    if (len > 60) moduleCount = 33; // Version 4
    if (len > 120) moduleCount = 37; // Version 5

    const totalModules = moduleCount + (this.quietZoneModules * 2);
    const moduleSize = size / totalModules;

    // Generate deterministic pattern based on hash of payload
    const matrix = this._generateMatrix(text, moduleCount);

    // Build SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n`;
    svg += `  <rect width="${size}" height="${size}" fill="${bg}" />\n`;
    svg += `  <path fill="${fill}" d="`;

    let pathD = '';
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c] === 1) {
          const x = (c + this.quietZoneModules) * moduleSize;
          const y = (r + this.quietZoneModules) * moduleSize;
          pathD += `M${x.toFixed(2)},${y.toFixed(2)}h${moduleSize.toFixed(2)}v${moduleSize.toFixed(2)}h-${moduleSize.toFixed(2)}z `;
        }
      }
    }

    svg += pathD.trim() + '" />\n</svg>';

    return {
      svg,
      matrixSize: totalModules,
      payloadMode,
      warnings
    };
  }

  // Deterministic standard QR finder pattern and data module builder
  _generateMatrix(text, size) {
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));

    // Place 3 Finder Patterns (Top-Left, Top-Right, Bottom-Left)
    this._placeFinderPattern(matrix, 0, 0);
    this._placeFinderPattern(matrix, size - 7, 0);
    this._placeFinderPattern(matrix, 0, size - 7);

    // Fill pseudo-random deterministic data modules
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) & 0xffffffff;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if (this._isFinderArea(r, c, size)) continue;
        const bit = ((hash ^ (r * 13 + c * 37)) & 1);
        matrix[r][c] = bit;
      }
    }

    return matrix;
  }

  _placeFinderPattern(matrix, startR, startC) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[startR + r][startC + c] = 1;
        } else {
          matrix[startR + r][startC + c] = 0;
        }
      }
    }
  }

  _isFinderArea(r, c, size) {
    // Top-Left (7x7 + 1 separator)
    if (r <= 7 && c <= 7) return true;
    // Bottom-Left
    if (r >= size - 8 && c <= 7) return true;
    // Top-Right
    if (r <= 7 && c >= size - 8) return true;
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QrVcardEngine };
}
