(function () {
  'use strict';
  var pdfBytes = null;

  /* ── RC4 stream cipher ───────────────────────────────── */
  function rc4(key, data) {
    var S = new Uint8Array(256);
    for (var i = 0; i < 256; i++) S[i] = i;
    var j = 0, tmp;
    for (var i = 0; i < 256; i++) {
      j = (j + S[i] + key[i % key.length]) & 0xFF;
      tmp = S[i]; S[i] = S[j]; S[j] = tmp;
    }
    var out = new Uint8Array(data.length);
    var x = 0, y = 0;
    for (var i = 0; i < data.length; i++) {
      x = (x + 1) & 0xFF;
      y = (y + S[x]) & 0xFF;
      tmp = S[x]; S[x] = S[y]; S[y] = tmp;
      out[i] = data[i] ^ S[(S[x] + S[y]) & 0xFF];
    }
    return out;
  }

  /* ── MD5 (RFC 1321) ──────────────────────────────────── */
  function md5(bytes) {
    function safe_add(x, y) { var lsw=(x&0xFFFF)+(y&0xFFFF); return (((x>>16)+(y>>16)+(lsw>>16))<<16)|(lsw&0xFFFF); }
    function bit_rol(num, cnt) { return (num<<cnt)|(num>>>(32-cnt)); }
    function md5_cmn(q,a,b,x,s,t){ return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b); }
    function md5_ff(a,b,c,d,x,s,t){ return md5_cmn((b&c)|((~b)&d),a,b,x,s,t); }
    function md5_gg(a,b,c,d,x,s,t){ return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t); }
    function md5_hh(a,b,c,d,x,s,t){ return md5_cmn(b^c^d,a,b,x,s,t); }
    function md5_ii(a,b,c,d,x,s,t){ return md5_cmn(c^(b|(~d)),a,b,x,s,t); }
    var length = bytes.length;
    var words = [];
    for (var i=0;i<length;i++) words[i>>2]|=bytes[i]<<((i%4)*8);
    words[length>>2]|=0x80<<((length%4)*8);
    words[(((length+8)>>6)<<4)+14]=length*8;
    var a=1732584193,b=-271733879,c=-1732584194,d=271733878;
    for (var i=0;i<words.length;i+=16){
      var olda=a,oldb=b,oldc=c,oldd=d;
      a=md5_ff(a,b,c,d,words[i+0],7,-680876936); d=md5_ff(d,a,b,c,words[i+1],12,-389564586); c=md5_ff(c,d,a,b,words[i+2],17,606105819); b=md5_ff(b,c,d,a,words[i+3],22,-1044525330);
      a=md5_ff(a,b,c,d,words[i+4],7,-176418897); d=md5_ff(d,a,b,c,words[i+5],12,1200080426); c=md5_ff(c,d,a,b,words[i+6],17,-1473231341); b=md5_ff(b,c,d,a,words[i+7],22,-45705983);
      a=md5_ff(a,b,c,d,words[i+8],7,1770035416); d=md5_ff(d,a,b,c,words[i+9],12,-1958414417); c=md5_ff(c,d,a,b,words[i+10],17,-42063); b=md5_ff(b,c,d,a,words[i+11],22,-1990404162);
      a=md5_ff(a,b,c,d,words[i+12],7,1804603682); d=md5_ff(d,a,b,c,words[i+13],12,-40341101); c=md5_ff(c,d,a,b,words[i+14],17,-1502002290); b=md5_ff(b,c,d,a,words[i+15],22,1236535329);
      a=md5_gg(a,b,c,d,words[i+1],5,-165796510); d=md5_gg(d,a,b,c,words[i+6],9,-1069501632); c=md5_gg(c,d,a,b,words[i+11],14,643717713); b=md5_gg(b,c,d,a,words[i+0],20,-373897302);
      a=md5_gg(a,b,c,d,words[i+5],5,-701558691); d=md5_gg(d,a,b,c,words[i+10],9,38016083); c=md5_gg(c,d,a,b,words[i+15],14,-660478335); b=md5_gg(b,c,d,a,words[i+4],20,-405537848);
      a=md5_gg(a,b,c,d,words[i+9],5,568446438); d=md5_gg(d,a,b,c,words[i+14],9,-1019803690); c=md5_gg(c,d,a,b,words[i+3],14,-187363961); b=md5_gg(b,c,d,a,words[i+8],20,1163531501);
      a=md5_gg(a,b,c,d,words[i+13],5,-1444681467); d=md5_gg(d,a,b,c,words[i+2],9,-51403784); c=md5_gg(c,d,a,b,words[i+7],14,1735328473); b=md5_gg(b,c,d,a,words[i+12],20,-1926607734);
      a=md5_hh(a,b,c,d,words[i+5],4,-378558); d=md5_hh(d,a,b,c,words[i+8],11,-2022574463); c=md5_hh(c,d,a,b,words[i+11],16,1839030562); b=md5_hh(b,c,d,a,words[i+14],23,-35309556);
      a=md5_hh(a,b,c,d,words[i+1],4,-1530992060); d=md5_hh(d,a,b,c,words[i+4],11,1272893353); c=md5_hh(c,d,a,b,words[i+7],16,-155497632); b=md5_hh(b,c,d,a,words[i+10],23,-1094730640);
      a=md5_hh(a,b,c,d,words[i+13],4,681279174); d=md5_hh(d,a,b,c,words[i+0],11,-358537222); c=md5_hh(c,d,a,b,words[i+3],16,-722521979); b=md5_hh(b,c,d,a,words[i+6],23,76029189);
      a=md5_hh(a,b,c,d,words[i+9],4,-640364487); d=md5_hh(d,a,b,c,words[i+12],11,-421815835); c=md5_hh(c,d,a,b,words[i+15],16,530742520); b=md5_hh(b,c,d,a,words[i+2],23,-995338651);
      a=md5_ii(a,b,c,d,words[i+0],6,-198630844); d=md5_ii(d,a,b,c,words[i+7],10,1126891415); c=md5_ii(c,d,a,b,words[i+14],15,-1416354905); b=md5_ii(b,c,d,a,words[i+5],21,-57434055);
      a=md5_ii(a,b,c,d,words[i+12],6,1700485571); d=md5_ii(d,a,b,c,words[i+3],10,-1894986606); c=md5_ii(c,d,a,b,words[i+10],15,-1051523); b=md5_ii(b,c,d,a,words[i+1],21,-2054922799);
      a=md5_ii(a,b,c,d,words[i+8],6,1873313359); d=md5_ii(d,a,b,c,words[i+15],10,-30611744); c=md5_ii(c,d,a,b,words[i+6],15,-1560198380); b=md5_ii(b,c,d,a,words[i+13],21,1309151649);
      a=md5_ii(a,b,c,d,words[i+4],6,-145523070); d=md5_ii(d,a,b,c,words[i+11],10,-1120210379); c=md5_ii(c,d,a,b,words[i+2],15,718787259); b=md5_ii(b,c,d,a,words[i+9],21,-343485551);
      a=safe_add(a,olda); b=safe_add(b,oldb); c=safe_add(c,oldc); d=safe_add(d,oldd);
    }
    var out = new Uint8Array(16);
    [a,b,c,d].forEach(function(v,i){ out[i*4]=(v&0xFF); out[i*4+1]=((v>>8)&0xFF); out[i*4+2]=((v>>16)&0xFF); out[i*4+3]=((v>>24)&0xFF); });
    return out;
  }

  /* ── PDF Standard Security Handler Rev 2 (RC4-40) ────── */
  var PAD = new Uint8Array([0x28,0xBF,0x4E,0x5E,0x4E,0x75,0x8A,0x41,0x64,0x00,0x4E,0x56,0xFF,0xFA,0x01,0x08,
                            0x2E,0x2E,0x00,0xB6,0xD0,0x68,0x3E,0x80,0x2F,0x0C,0xA9,0xFE,0x64,0x53,0x69,0x7A]);

  function padPassword(pass) {
    var bytes = [];
    for (var i = 0; i < pass.length && i < 32; i++) bytes.push(pass.charCodeAt(i) & 0xFF);
    while (bytes.length < 32) bytes.push(PAD[bytes.length - pass.length] || PAD[bytes.length % 32]);
    return new Uint8Array(bytes.slice(0, 32));
  }

  function computeEncryptionKey(userPass, ownerEntry, permissions, fileId) {
    var padded = padPassword(userPass);
    var buf = new Uint8Array(padded.length + ownerEntry.length + 4 + fileId.length);
    buf.set(padded, 0);
    buf.set(ownerEntry, padded.length);
    // permissions as little-endian 32-bit
    var p = permissions >>> 0;
    buf[padded.length + ownerEntry.length + 0] = p & 0xFF;
    buf[padded.length + ownerEntry.length + 1] = (p >> 8) & 0xFF;
    buf[padded.length + ownerEntry.length + 2] = (p >> 16) & 0xFF;
    buf[padded.length + ownerEntry.length + 3] = (p >> 24) & 0xFF;
    buf.set(fileId, padded.length + ownerEntry.length + 4);
    var key = md5(buf).slice(0, 5); // 40-bit key
    return key;
  }

  function computeOwnerEntry(ownerPass, userPass) {
    var opadded = padPassword(ownerPass);
    var rc4Key = md5(opadded).slice(0, 5);
    var upadded = padPassword(userPass);
    return rc4(rc4Key, upadded);
  }

  function computeUserEntry(encKey) {
    return rc4(encKey, PAD);
  }

  function hexStr(bytes) {
    return Array.from(bytes).map(function(b){ return ('0' + b.toString(16)).slice(-2); }).join('');
  }

  /* ── Encrypt all streams in the PDF bytes ────────────── */
  function encryptPdfStreams(rawBytes, encKey) {
    var text = '';
    for (var i = 0; i < rawBytes.length; i++) text += String.fromCharCode(rawBytes[i]);

    var result = new Uint8Array(rawBytes.length * 2); // over-alloc
    var outIdx = 0;

    function writeStr(s) {
      for (var i = 0; i < s.length; i++) result[outIdx++] = s.charCodeAt(i) & 0xFF;
    }

    // Find each object number and encrypt its streams
    // We need to track obj numbers to derive per-object keys
    var objPattern = /(\d+)\s+(\d+)\s+obj/g;
    var streamPattern = /stream\r?\n/g;
    var endstreamPattern = /endstream/g;

    var objMap = {}; // offset -> [objNum, genNum]
    var m;
    while ((m = objPattern.exec(text)) !== null) {
      objMap[m.index] = [parseInt(m[1]), parseInt(m[2])];
    }

    var pos = 0;
    var currentObj = [0, 0];

    while (pos < rawBytes.length) {
      // Check for 'X Y obj'
      var objMatch = null;
      for (var offset in objMap) {
        if (parseInt(offset) === pos) { currentObj = objMap[offset]; break; }
      }

      // Find next 'stream\n'
      var streamStart = text.indexOf('stream', pos);
      if (streamStart === -1) {
        // Write rest
        for (var i = pos; i < rawBytes.length; i++) result[outIdx++] = rawBytes[i];
        break;
      }

      // Copy up to and including 'stream\n'
      var streamKeyword = text.indexOf('stream', pos);
      var afterKeyword = streamKeyword + 6;
      if (text[afterKeyword] === '\r') afterKeyword++;
      if (text[afterKeyword] === '\n') afterKeyword++;

      for (var i = pos; i < afterKeyword; i++) result[outIdx++] = rawBytes[i];
      pos = afterKeyword;

      // Find endstream
      var endStream = text.indexOf('endstream', pos);
      if (endStream === -1) {
        for (var i = pos; i < rawBytes.length; i++) result[outIdx++] = rawBytes[i];
        break;
      }

      // Derive object-specific key (PDF spec section 3.5.1)
      var objKey = new Uint8Array(encKey.length + 5);
      objKey.set(encKey);
      objKey[encKey.length + 0] = currentObj[0] & 0xFF;
      objKey[encKey.length + 1] = (currentObj[0] >> 8) & 0xFF;
      objKey[encKey.length + 2] = (currentObj[0] >> 16) & 0xFF;
      objKey[encKey.length + 3] = currentObj[1] & 0xFF;
      objKey[encKey.length + 4] = (currentObj[1] >> 8) & 0xFF;
      var finalKey = md5(objKey).slice(0, Math.min(encKey.length + 5, 16));

      // Encrypt stream content
      var streamData = rawBytes.slice(pos, endStream);
      var encrypted = rc4(finalKey, streamData);
      for (var i = 0; i < encrypted.length; i++) result[outIdx++] = encrypted[i];

      pos = endStream;
    }

    return result.slice(0, outIdx);
  }

  /* ── Inject /Encrypt dict and update xref ────────────── */
  function buildProtectedPdf(rawBytes, userPass, ownerPass, permissions) {
    var fileId = new Uint8Array(16);
    crypto.getRandomValues(fileId);
    var fileIdHex = hexStr(fileId);

    var oEntry = computeOwnerEntry(ownerPass, userPass);
    var encKey = computeEncryptionKey(userPass, oEntry, permissions, fileId);
    var uEntry = computeUserEntry(encKey);

    // Encrypt streams
    var encryptedBody = encryptPdfStreams(rawBytes, encKey);

    // Build /Encrypt dictionary string
    var encryptDict =
      '<<\n/Filter /Standard\n/V 1\n/R 2\n/KeyLength 40\n' +
      '/P ' + (permissions | 0) + '\n' +
      '/O <' + hexStr(oEntry) + '>\n' +
      '/U <' + hexStr(uEntry) + '>\n' +
      '>>';

    // Convert encrypted body to string for manipulation
    var bodyText = '';
    for (var i = 0; i < encryptedBody.length; i++) bodyText += String.fromCharCode(encryptedBody[i]);

    // Find the trailer and inject /Encrypt and /ID
    var trailerIdx = bodyText.lastIndexOf('trailer');
    if (trailerIdx === -1) {
      throw new Error('Could not find PDF trailer. The PDF may be malformed.');
    }

    var trailerEnd = bodyText.indexOf('>>',trailerIdx);
    if (trailerEnd === -1) throw new Error('Malformed PDF trailer.');

    // Get the xref offset (startxref)
    var startxrefIdx = bodyText.lastIndexOf('startxref');
    var xrefOffsetStr = bodyText.slice(startxrefIdx + 9).trim().split(/\s+/)[0];
    var xrefOffset = parseInt(xrefOffsetStr);

    // Build new /Encrypt object at end
    var encObjNum = 1000; // Use a high object number unlikely to conflict
    var newContent = bodyText;

    // Inject /Encrypt ref into trailer
    var trailerSection = bodyText.slice(trailerIdx, trailerEnd + 2);
    var newTrailer = trailerSection.replace('>>', '\n/Encrypt ' + encObjNum + ' 0 R\n/ID [<' + fileIdHex + '><' + fileIdHex + '>]\n>>');
    newContent = bodyText.slice(0, trailerIdx) + newTrailer + bodyText.slice(trailerEnd + 2);

    // Append encrypt object before %%EOF
    var eofIdx = newContent.lastIndexOf('%%EOF');
    var encObjStr = '\n' + encObjNum + ' 0 obj\n' + encryptDict + '\nendobj\n';
    newContent = newContent.slice(0, eofIdx) + encObjStr + '%%EOF\n';

    // Convert back to Uint8Array
    var out = new Uint8Array(newContent.length);
    for (var i = 0; i < newContent.length; i++) out[i] = newContent.charCodeAt(i) & 0xFF;
    return out;
  }

  /* ── UI helpers ───────────────────────────────────────── */
  function setStatus(msg, type) {
    var el = document.getElementById('pp2-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }
  function dl(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  async function loadFile(file) {
    pdfBytes = new Uint8Array(await file.arrayBuffer());
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    document.getElementById('pp2-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages)';
    document.getElementById('pp2-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processProtect() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var pass = document.getElementById('pp2-password').value;
    var confirm = document.getElementById('pp2-confirm').value;
    if (!pass) { setStatus('Enter a password.', 'error'); return; }
    if (pass !== confirm) { setStatus('Passwords do not match.', 'error'); return; }
    if (pass.length < 4) { setStatus('Password must be at least 4 characters.', 'error'); return; }
    setStatus('Encrypting PDF…', '');
    try {
      // Re-save via pdf-lib first to normalize to traditional xref table format
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      // useObjectStreams: false forces traditional xref table + trailer (required for RC4 encryption)
      var normalizedBytes = new Uint8Array(await doc.save({ useObjectStreams: false }));

      var permissions = -3904; // Allow printing, deny editing/copying
      var protectedBytes = buildProtectedPdf(normalizedBytes, pass, pass + '_owner', permissions);
      dl(protectedBytes, 'protected.pdf');
      setStatus('Done! PDF encrypted with RC4-40. Open in any PDF viewer and it will ask for your password.', 'success');
    } catch (e) {
      setStatus('Encryption error: ' + e.message, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pp2-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('pp2-btn').addEventListener('click', processProtect);
    document.getElementById('pp2-toggle').addEventListener('click', function () {
      var inp = document.getElementById('pp2-password');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
})();
