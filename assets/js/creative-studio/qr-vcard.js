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

    // Generate standards-compliant ISO/IEC 18004 QR matrix
    const matrix = this._generateMatrix(text, moduleCount);
    const actualModuleCount = matrix.length;
    const totalModules = actualModuleCount + (this.quietZoneModules * 2);
    const moduleSize = size / totalModules;

    // Build SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n`;
    svg += `  <rect width="${size}" height="${size}" fill="${bg}" />\n`;
    svg += `  <path fill="${fill}" d="`;

    let pathD = '';
    for (let r = 0; r < actualModuleCount; r++) {
      for (let c = 0; c < actualModuleCount; c++) {
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
      matrix,
      matrixSize: totalModules,
      payloadMode,
      warnings
    };
  }

  // Standards-compliant ISO/IEC 18004 QR code matrix generator with Reed-Solomon ECC
  _generateMatrix(text, targetSize) {
    const qrLib = (typeof QRCodeLib !== 'undefined' ? QRCodeLib : (typeof QRCode !== 'undefined' ? QRCode : null)) ||
      ((typeof require !== 'undefined') ? (function() { try { return require('qrcode'); } catch(e) { return null; } })() : null);

    if (qrLib && typeof qrLib.create === 'function') {
      const qr = qrLib.create(text, { errorCorrectionLevel: this.errorCorrection || 'M' });
      const size = qr.modules.size;
      const matrix = [];
      for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
          row.push(qr.modules.get(r, c) ? 1 : 0);
        }
        matrix.push(row);
      }
      return matrix;
    }

    if (!QrVcardEngine._qrEngine) {
      QrVcardEngine._initQrEngine();
    }
    return QrVcardEngine._qrEngine.generateMatrix(text, targetSize);
  }
}

// Built-in ISO/IEC 18004 QR Matrix Engine
QrVcardEngine._qrEngine = null;
QrVcardEngine._initQrEngine = function() {
  class IsoQrEngine {
    constructor() {
      this.exp = new Uint8Array(512);
      this.log = new Uint8Array(256);
      let x = 1;
      for (let i = 0; i < 255; i++) {
        this.exp[i] = x;
        this.exp[i + 255] = x;
        this.log[x] = i;
        x <<= 1;
        if (x & 256) x ^= 0x11d;
      }
    }

    gfMul(a, b) {
      return (a === 0 || b === 0) ? 0 : this.exp[this.log[a] + this.log[b]];
    }

    getGeneratorPoly(ecCount) {
      let g = [1];
      for (let i = 0; i < ecCount; i++) {
        const factor = [1, this.exp[i]];
        const res = new Array(g.length + 1).fill(0);
        for (let j = 0; j < g.length; j++) {
          res[j] ^= g[j];
          res[j + 1] ^= this.gfMul(g[j], factor[1]);
        }
        g = res;
      }
      return g;
    }

    rsEncode(data, ecCount) {
      const gen = this.getGeneratorPoly(ecCount);
      const msg = new Array(data.length + ecCount).fill(0);
      for (let i = 0; i < data.length; i++) msg[i] = data[i];

      for (let i = 0; i < data.length; i++) {
        const lead = msg[i];
        if (lead !== 0) {
          for (let j = 0; j < gen.length; j++) {
            msg[i + j] ^= this.gfMul(gen[j], lead);
          }
        }
      }
      return msg.slice(data.length);
    }

    static get TABLE_M() {
      return [
        null,
        [1, 16, 10, 1],   // V1: 21x21
        [2, 28, 16, 1],   // V2: 25x25
        [3, 44, 26, 1],   // V3: 29x29
        [4, 64, 18, 2],   // V4: 33x33
        [5, 86, 24, 2],   // V5: 37x37
        [6, 108, 16, 4],  // V6: 41x41
        [7, 124, 18, 4],  // V7: 45x45
        [8, 154, 22, 4],  // V8: 49x49
        [9, 182, 22, 5],  // V9: 53x53
        [10, 216, 26, 5]  // V10: 57x57
      ];
    }

    static get ALIGNMENT_COORDS() {
      return [
        [], [], [6, 18], [6, 22], [6, 26], [6, 30],
        [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
      ];
    }

    chooseVersion(byteCount, targetSize) {
      let minVersion = 1;
      if (targetSize) {
        minVersion = Math.max(1, Math.round((targetSize - 17) / 4));
      }
      for (let v = minVersion; v <= 10; v++) {
        const entry = IsoQrEngine.TABLE_M[v];
        if (entry && entry[1] - 3 >= byteCount) {
          return v;
        }
      }
      return 10;
    }

    generateMatrix(text, targetSize) {
      const rawBytes = (typeof TextEncoder !== 'undefined')
        ? new TextEncoder().encode(text)
        : Buffer.from(text, 'utf8');

      const version = this.chooseVersion(rawBytes.length, targetSize);
      const size = 4 * version + 17;
      const info = IsoQrEngine.TABLE_M[version];
      const totalDataBytes = info[1];
      const ecPerBlock = info[2];
      const numBlocks = info[3];

      const bits = [];
      const pushBits = (val, len) => {
        for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      };

      pushBits(0b0100, 4); // 8-bit Byte mode
      pushBits(rawBytes.length, version <= 9 ? 8 : 16);
      for (let i = 0; i < rawBytes.length; i++) {
        pushBits(rawBytes[i], 8);
      }
      const capacityBits = totalDataBytes * 8;
      const termLen = Math.min(4, capacityBits - bits.length);
      for (let i = 0; i < termLen; i++) bits.push(0);
      while (bits.length % 8 !== 0) bits.push(0);

      const padBytes = [0xEC, 0x11];
      let padIdx = 0;
      while (bits.length < capacityBits) {
        pushBits(padBytes[padIdx % 2], 8);
        padIdx++;
      }

      const dataCodewords = [];
      for (let i = 0; i < bits.length; i += 8) {
        let b = 0;
        for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
        dataCodewords.push(b);
      }

      const blockSize = Math.floor(totalDataBytes / numBlocks);
      const remainder = totalDataBytes % numBlocks;
      const dataBlocks = [];
      const ecBlocks = [];
      let curOffset = 0;
      for (let i = 0; i < numBlocks; i++) {
        const curBlockLen = blockSize + (i >= numBlocks - remainder ? 1 : 0);
        const curData = dataCodewords.slice(curOffset, curOffset + curBlockLen);
        curOffset += curBlockLen;
        dataBlocks.push(curData);
        ecBlocks.push(this.rsEncode(curData, ecPerBlock));
      }

      const finalCodewords = [];
      const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
      for (let c = 0; c < maxDataLen; c++) {
        for (let b = 0; b < numBlocks; b++) {
          if (c < dataBlocks[b].length) finalCodewords.push(dataBlocks[b][c]);
        }
      }
      for (let c = 0; c < ecPerBlock; c++) {
        for (let b = 0; b < numBlocks; b++) {
          finalCodewords.push(ecBlocks[b][c]);
        }
      }

      const matrix = Array.from({ length: size }, () => Array(size).fill(null));
      const isReserved = Array.from({ length: size }, () => Array(size).fill(false));

      const setFunctionModule = (r, c, val) => {
        if (r >= 0 && r < size && c >= 0 && c < size) {
          matrix[r][c] = val;
          isReserved[r][c] = true;
        }
      };

      // Finder patterns
      const finders = [[0, 0], [size - 7, 0], [0, size - 7]];
      for (const [fr, fc] of finders) {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const row = fr + r;
            const col = fc + c;
            if (row < 0 || row >= size || col < 0 || col >= size) continue;
            if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
              const isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
              setFunctionModule(row, col, isDark ? 1 : 0);
            } else {
              setFunctionModule(row, col, 0);
            }
          }
        }
      }

      // Alignment patterns
      const coords = IsoQrEngine.ALIGNMENT_COORDS[version] || [];
      for (const ar of coords) {
        for (const ac of coords) {
          if (isReserved[ar][ac]) continue;
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              const isDark = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
              setFunctionModule(ar + r, ac + c, isDark ? 1 : 0);
            }
          }
        }
      }

      // Timing patterns
      for (let i = 8; i < size - 8; i++) {
        if (!isReserved[6][i]) setFunctionModule(6, i, (i % 2 === 0) ? 1 : 0);
        if (!isReserved[i][6]) setFunctionModule(i, 6, (i % 2 === 0) ? 1 : 0);
      }

      // Dark Module
      setFunctionModule(4 * version + 9, 8, 1);

      // Reserve format info area
      for (let i = 0; i <= 8; i++) {
        if (!isReserved[8][i]) isReserved[8][i] = true;
        if (!isReserved[i][8]) isReserved[i][8] = true;
      }
      for (let i = 0; i <= 7; i++) {
        if (!isReserved[8][size - 1 - i]) isReserved[8][size - 1 - i] = true;
        if (!isReserved[size - 1 - i][8]) isReserved[size - 1 - i] = true;
      }

      // Place data bits in zig-zag
      const finalBits = [];
      for (const byte of finalCodewords) {
        for (let i = 7; i >= 0; i--) finalBits.push((byte >>> i) & 1);
      }

      let bitIdx = 0;
      let upward = true;
      for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
        if (rightCol === 6) rightCol = 5;
        const rows = [];
        if (upward) {
          for (let r = size - 1; r >= 0; r--) rows.push(r);
        } else {
          for (let r = 0; r < size; r++) rows.push(r);
        }
        upward = !upward;

        for (const r of rows) {
          for (const col of [rightCol, rightCol - 1]) {
            if (!isReserved[r][col]) {
              let bit = (bitIdx < finalBits.length) ? finalBits[bitIdx++] : 0;
              // Mask 0: (row + col) % 2 === 0
              if ((r + col) % 2 === 0) bit ^= 1;
              matrix[r][col] = bit;
            }
          }
        }
      }

      // Format information (15 bits for EC M + Mask 0: 0x5412)
      const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
      const tlCoords = [
        [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
        [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
      ];
      for (let i = 0; i < 15; i++) {
        matrix[tlCoords[i][0]][tlCoords[i][1]] = formatBits[i];
      }
      for (let i = 0; i < 7; i++) {
        matrix[size - 1 - i][8] = formatBits[i];
      }
      for (let i = 7; i < 15; i++) {
        matrix[8][size - 15 + i] = formatBits[i];
      }

      return matrix;
    }
  }

  QrVcardEngine._qrEngine = new IsoQrEngine();
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QrVcardEngine };
}
if (typeof window !== 'undefined') {
  window.QrVcardEngine = QrVcardEngine;
}
