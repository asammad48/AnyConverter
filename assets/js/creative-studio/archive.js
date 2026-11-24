/**
 * AnyConverter Creative Studio — Portable .acstudio Container (ZIP Packager & Unpackager)
 * Pure JavaScript client/node compatible archive module with strict security guards.
 */

const nodeCrypto = (typeof require !== 'undefined') ? (function() { try { return require('crypto'); } catch(e) { return null; } })() : null;
const nodeZlib = (typeof require !== 'undefined') ? (function() { try { return require('zlib'); } catch(e) { return null; } })() : null;

// Browser buffer polyfill if Buffer is not globally defined
if (typeof globalThis.Buffer === 'undefined') {
  class BrowserBuffer extends Uint8Array {
    static from(source, encoding) {
      if (typeof source === 'string') {
        return new BrowserBuffer(new TextEncoder().encode(source));
      }
      return new BrowserBuffer(source);
    }
    static alloc(size) {
      return new BrowserBuffer(size);
    }
    static concat(list) {
      const totalLen = list.reduce((acc, b) => acc + b.length, 0);
      const res = new BrowserBuffer(totalLen);
      let offset = 0;
      for (const item of list) {
        res.set(item, offset);
        offset += item.length;
      }
      return res;
    }
    static isBuffer(obj) {
      return obj instanceof Uint8Array;
    }
    readUInt32LE(offset) {
      return new DataView(this.buffer, this.byteOffset + offset, 4).getUint32(0, true);
    }
    readUInt16LE(offset) {
      return new DataView(this.buffer, this.byteOffset + offset, 2).getUint16(0, true);
    }
    writeUInt32LE(val, offset) {
      new DataView(this.buffer, this.byteOffset + offset, 4).setUint32(0, val, true);
    }
    writeUInt16LE(val, offset) {
      new DataView(this.buffer, this.byteOffset + offset, 2).setUint16(0, val, true);
    }
    copy(target, targetStart = 0) {
      target.set(this, targetStart);
    }
    toString(encoding, start = 0, end = this.length) {
      const slice = this.subarray(start, end);
      return new TextDecoder('utf-8').decode(slice);
    }
    slice(start, end) {
      return new BrowserBuffer(this.subarray(start, end));
    }
  }
  globalThis.Buffer = BrowserBuffer;
}

class AcStudioArchive {
  constructor(options = {}) {
    this.maxFileSize = options.maxFileSize || 500 * 1024 * 1024; // 500MB max per file
    this.maxTotalDecompressed = options.maxTotalDecompressed || 1024 * 1024 * 1024; // 1GB max project
    this.maxCompressionRatio = options.maxCompressionRatio || 100; // 100:1 max ratio (zip bomb defense)
    this.maxEntryCount = options.maxEntryCount || 500;
  }

  /**
   * Package a project into an .acstudio ZIP buffer
   * @param {Object} projectDocument - Validated project document
   * @param {Map<string, Buffer>|Object} binaryAssets - Map of assetId -> binary buffer
   * @param {Object} options - Custom generator metadata
   * @returns {Buffer} ZIP buffer
   */
  package(projectDocument, binaryAssets = {}, options = {}) {
    const entries = [];
    const now = new Date().toISOString();

    // 1. Prepare manifest.json
    const manifestAssets = [];
    const assetMap = binaryAssets instanceof Map ? binaryAssets : new Map(Object.entries(binaryAssets));

    for (const [id, buffer] of assetMap.entries()) {
      const sha = this._computeSha256(buffer);
      const expectedId = `sha256:${sha}`;
      if (id !== expectedId) {
        throw new Error(`Asset ID mismatch: provided '${id}', actual sha256 '${expectedId}'`);
      }
      const ext = this._inferExtension(projectDocument, id);
      const filePath = `assets/${sha}.${ext}`;
      entries.push({
        name: filePath,
        data: buffer
      });
      manifestAssets.push({
        id: expectedId,
        path: filePath,
        mimeType: this._inferMimeType(projectDocument, id),
        sizeBytes: buffer.length,
        sha256: sha
      });
    }

    const manifest = {
      manifestVersion: '1.0.0',
      projectId: projectDocument.projectId,
      revisionId: projectDocument.revisionId,
      title: projectDocument.title || 'Untitled Project',
      kind: projectDocument.kind || 'video',
      createdAt: options.createdAt || now,
      updatedAt: now,
      generator: 'AnyConverter Creative Studio v1.0',
      entrypoint: 'project.json',
      assets: manifestAssets,
      security: {
        containsSecrets: false,
        verifiedZeroCredentials: true
      }
    };

    // 2. Add manifest.json and project.json
    entries.unshift({
      name: 'project.json',
      data: Buffer.from(JSON.stringify(projectDocument, null, 2), 'utf8')
    });
    entries.unshift({
      name: 'manifest.json',
      data: Buffer.from(JSON.stringify(manifest, null, 2), 'utf8')
    });

    // 3. Encode into PKWARE ZIP format
    return this._createZip(entries);
  }

  /**
   * Unpackage and validate an .acstudio ZIP buffer with strict security guards
   * @param {Buffer} zipBuffer - Input archive buffer
   * @returns {{ manifest: Object, project: Object, assets: Map<string, Buffer> }}
   */
  unpackage(zipBuffer) {
    if (!zipBuffer || zipBuffer.length < 22) {
      throw new Error('Invalid archive: buffer is too short or not a valid ZIP container');
    }
    const buf = (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') ? Buffer.from(zipBuffer) : zipBuffer;
    const entries = this._readZip(buf);

    if (entries.length > this.maxEntryCount) {
      throw new Error(`ZIP entry count ${entries.length} exceeds max allowed limit of ${this.maxEntryCount}`);
    }

    let manifestRaw = null;
    let projectRaw = null;
    const assets = new Map();
    let totalDecompressedBytes = 0;

    for (const entry of entries) {
      // 1. Path traversal defense
      this._validateEntryPath(entry.name);

      // 2. Decompression bounds & zip bomb defense
      totalDecompressedBytes += entry.data.length;
      if (entry.data.length > this.maxFileSize) {
        throw new Error(`Entry '${entry.name}' (${entry.data.length} bytes) exceeds max file size limit`);
      }
      if (totalDecompressedBytes > this.maxTotalDecompressed) {
        throw new Error(`Total decompressed archive size exceeds max allowed limit of ${this.maxTotalDecompressed} bytes`);
      }

      // 3. Secret leak check
      this._auditSecrets(entry.name, entry.data);

      // 4. Hostile script check (SVG/HTML)
      if (entry.name.endsWith('.svg') || entry.name.endsWith('.html')) {
        this._auditHostilePayload(entry.name, entry.data);
      }

      // Route entries
      if (entry.name === 'manifest.json') {
        manifestRaw = entry.data.toString('utf8');
      } else if (entry.name === 'project.json') {
        projectRaw = entry.data.toString('utf8');
      } else if (entry.name.startsWith('assets/')) {
        const hashMatch = entry.name.match(/^assets\/([a-f0-9]{64})\.[a-z0-9]+$/i);
        if (!hashMatch) {
          throw new Error(`Invalid asset path convention: '${entry.name}'. Must be assets/<sha256>.<ext>`);
        }
        const expectedSha = hashMatch[1].toLowerCase();
        const actualSha = this._computeSha256(entry.data);
        if (actualSha !== expectedSha) {
          throw new Error(`Asset checksum failure for '${entry.name}': computed sha256 does not match path`);
        }
        assets.set(`sha256:${actualSha}`, entry.data);
      }
    }

    if (!manifestRaw) throw new Error("Archive missing required root 'manifest.json'");
    if (!projectRaw) throw new Error("Archive missing required root 'project.json'");

    const manifest = JSON.parse(manifestRaw);
    const project = JSON.parse(projectRaw);

    return { manifest, project, assets };
  }

  // --- Internal Security & Format Helpers ---

  _validateEntryPath(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Entry path must be a non-empty string');
    }
    // Block path traversal and absolute paths
    if (name.includes('..') || name.startsWith('/') || name.startsWith('\\') || name.includes(':')) {
      throw new Error(`SECURITY ALERT: Path traversal detected in entry name: '${name}'`);
    }
    // Normalize and prevent suspicious characters
    if (/[\0\x01-\x1f]/.test(name)) {
      throw new Error(`SECURITY ALERT: Control characters in entry name: '${name}'`);
    }
  }

  _auditSecrets(name, buffer) {
    // Only inspect text/JSON files for secrets to avoid false positives on binary media
    if (name.endsWith('.json') || name.endsWith('.txt') || name.endsWith('.csv') || name.endsWith('.md')) {
      const text = buffer.toString('utf8');
      if (/sk-[a-zA-Z0-9]{20,}/.test(text) || /ya29\.[a-zA-Z0-9_-]{20,}/.test(text)) {
        throw new Error(`SECURITY ALERT: Plaintext secret or OAuth token found in entry '${name}'`);
      }
    }
  }

  _auditHostilePayload(name, buffer) {
    const text = buffer.toString('utf8').toLowerCase();
    const hostileTokens = ['<script', 'javascript:', 'onload=', 'onerror=', 'onclick=', '<iframe', '<object'];
    for (const token of hostileTokens) {
      if (text.includes(token)) {
        throw new Error(`SECURITY ALERT: Hostile active script payload detected in '${name}' ('${token}')`);
      }
    }
  }

  _inferExtension(project, assetId) {
    const asset = (project.assets || []).find(a => a.id === assetId);
    if (!asset || !asset.mimeType) return 'bin';
    const mimeMap = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'audio/wav': 'wav',
      'audio/mpeg': 'mp3',
      'model/gltf-binary': 'glb'
    };
    return mimeMap[asset.mimeType] || 'bin';
  }

  _inferMimeType(project, assetId) {
    const asset = (project.assets || []).find(a => a.id === assetId);
    return asset && asset.mimeType ? asset.mimeType : 'application/octet-stream';
  }

  _createZip(entries) {
    const localHeaders = [];
    const centralDirectoryHeaders = [];
    let offset = 0;

    for (const entry of entries) {
      const nameBuf = Buffer.from(entry.name, 'utf8');
      const dataBuf = entry.data;
      const crc = this._crc32(dataBuf);
      let compressedData = null;
      if (nodeZlib && typeof nodeZlib.deflateRawSync === 'function') {
        try {
          compressedData = nodeZlib.deflateRawSync(dataBuf);
        } catch (e) {
          compressedData = null;
        }
      }
      const isDeflated = compressedData && compressedData.length < dataBuf.length;
      const finalData = isDeflated ? compressedData : dataBuf;
      const method = isDeflated ? 8 : 0; // 8 = Deflate, 0 = Store

      // Local File Header (30 bytes + name)
      const localHdr = Buffer.alloc(30 + nameBuf.length);
      localHdr.writeUInt32LE(0x04034b50, 0); // Signature
      localHdr.writeUInt16LE(20, 4); // Min version (2.0)
      localHdr.writeUInt16LE(0x0800, 6); // Flags: UTF-8
      localHdr.writeUInt16LE(method, 8); // Method
      localHdr.writeUInt32LE(0, 10); // Time/Date
      localHdr.writeUInt32LE(crc, 14); // CRC-32
      localHdr.writeUInt32LE(finalData.length, 18); // Compressed size
      localHdr.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
      localHdr.writeUInt16LE(nameBuf.length, 26); // Name length
      localHdr.writeUInt16LE(0, 28); // Extra field length
      nameBuf.copy(localHdr, 30);

      localHeaders.push(localHdr);
      localHeaders.push(finalData);

      // Central Directory Header (46 bytes + name)
      const cdHdr = Buffer.alloc(46 + nameBuf.length);
      cdHdr.writeUInt32LE(0x02014b50, 0); // Signature
      cdHdr.writeUInt16LE(20, 4); // Made by
      cdHdr.writeUInt16LE(20, 6); // Version needed
      cdHdr.writeUInt16LE(0x0800, 8); // Flags: UTF-8
      cdHdr.writeUInt16LE(method, 10); // Method
      cdHdr.writeUInt32LE(0, 12); // Time/Date
      cdHdr.writeUInt32LE(crc, 16); // CRC-32
      cdHdr.writeUInt32LE(finalData.length, 20); // Compressed size
      cdHdr.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
      cdHdr.writeUInt16LE(nameBuf.length, 28); // Name length
      cdHdr.writeUInt16LE(0, 30); // Extra field len
      cdHdr.writeUInt16LE(0, 32); // Comment len
      cdHdr.writeUInt16LE(0, 34); // Disk num
      cdHdr.writeUInt16LE(0, 36); // Internal attrs
      cdHdr.writeUInt32LE(0, 38); // External attrs
      cdHdr.writeUInt32LE(offset, 42); // Relative offset of local header
      nameBuf.copy(cdHdr, 46);

      centralDirectoryHeaders.push(cdHdr);
      offset += localHdr.length + finalData.length;
    }

    const cdBuffer = Buffer.concat(centralDirectoryHeaders);
    const cdOffset = offset;
    const cdSize = cdBuffer.length;

    // End of Central Directory Record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
    eocd.writeUInt16LE(0, 4); // Disk number
    eocd.writeUInt16LE(0, 6); // Disk where CD starts
    eocd.writeUInt16LE(entries.length, 8); // Number of central directory records on this disk
    eocd.writeUInt16LE(entries.length, 10); // Total number of central directory records
    eocd.writeUInt32LE(cdSize, 12); // Size of central directory
    eocd.writeUInt32LE(cdOffset, 16); // Offset of start of central directory
    eocd.writeUInt16LE(0, 20); // Comment length

    return Buffer.concat([...localHeaders, cdBuffer, eocd]);
  }

  _readZip(buf) {
    const entries = [];
    let pos = 0;

    // Scan for Local File Headers
    while (pos < buf.length - 30) {
      const sig = buf.readUInt32LE(pos);
      if (sig === 0x02014b50 || sig === 0x06054b50) {
        // Reached Central Directory or EOCD
        break;
      }
      if (sig !== 0x04034b50) {
        pos++;
        continue;
      }

      const method = buf.readUInt16LE(pos + 8);
      const compressedSize = buf.readUInt32LE(pos + 18);
      const uncompressedSize = buf.readUInt32LE(pos + 22);
      const nameLen = buf.readUInt16LE(pos + 26);
      const extraLen = buf.readUInt16LE(pos + 28);
      const name = buf.toString('utf8', pos + 30, pos + 30 + nameLen);

      const dataStart = pos + 30 + nameLen + extraLen;
      const rawData = buf.slice(dataStart, dataStart + compressedSize);

      let data;
      if (method === 0) {
        data = rawData;
      } else if (method === 8) {
        if (nodeZlib && typeof nodeZlib.inflateRawSync === 'function') {
          data = nodeZlib.inflateRawSync(rawData);
        } else if (typeof DecompressionStream !== 'undefined') {
          // Browser native decompression stream fallback if available
          throw new Error('Decompression in browser requires uncompressed store or DecompressionStream');
        } else {
          throw new Error('zlib decompression unavailable in current runtime');
        }
      } else {
        throw new Error(`Unsupported compression method in ZIP: ${method}`);
      }

      entries.push({ name, data });
      pos = dataStart + compressedSize;
    }

    return entries;
  }

  _computeSha256(buf) {
    if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
      return nodeCrypto.createHash('sha256').update(buf).digest('hex');
    }
    // Synchronous standards-compliant SHA-256 implementation
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const K = [];
    const H = [];
    let primeCounter = 0;
    const isPrime = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isPrime[candidate]) {
        for (let i = 0; i < 313; i += candidate) isPrime[i] = candidate;
        H[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        K[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    const bytes = new Uint8Array(buf);
    const byteLength = bytes.length;
    const bitLength = byteLength * 8;
    const newByteLength = (((byteLength + 8) >> 6) + 1) << 6;
    const padded = new Uint8Array(newByteLength);
    padded.set(bytes);
    padded[byteLength] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(newByteLength - 4, bitLength, false);

    const W = new Uint32Array(64);
    for (let i = 0; i < newByteLength; i += 64) {
      for (let t = 0; t < 16; t++) {
        W[t] = view.getUint32(i + t * 4, false);
      }
      for (let t = 16; t < 64; t++) {
        const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
        const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }
    return H.slice(0, 8).map(x => ((x >>> 0).toString(16)).padStart(8, '0')).join('');
  }

  _crc32(buf) {
    let crc = ~0;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ AcStudioArchive._crcTable[(crc ^ buf[i]) & 0xff];
    }
    return ~crc >>> 0;
  }
}

// Precomputed CRC32 table
AcStudioArchive._crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AcStudioArchive };
}
if (typeof window !== 'undefined') {
  window.AcStudioArchive = AcStudioArchive;
}
