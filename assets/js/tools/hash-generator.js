/* Hash Generator — MD5, SHA-1, SHA-256, SHA-512 */
document.addEventListener('DOMContentLoaded', function () {
  function isUppercase() {
    const el = document.getElementById('tog-uppercase');
    return el ? !el.classList.contains('off') : false;
  }

  function formatHashVal(h) { return isUppercase() ? h.toUpperCase() : h; }

  function updateStats(bytes) {
    const el = document.getElementById('stat-input-size');
    const m = document.getElementById('stat-md5-len');
    const s = document.getElementById('stat-sha256-len');
    if (el) el.textContent = bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';
    if (m) m.textContent = '128';
    if (s) s.textContent = '256';
  }

  function refreshHashDisplay() {
    ['hash-md5','hash-sha1','hash-sha256','hash-sha512'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el && el.textContent !== '—') el.textContent = formatHashVal(el.textContent);
    });
  }
  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  let debounceTimer;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // MD5 pure-JS implementation (~2KB)
  function md5(input) {
    function safeAdd(x, y) { const lsw = (x & 0xFFFF) + (y & 0xFFFF); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF); }
    function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

    const bytes = new TextEncoder().encode(input);
    const msg = new Uint8Array(bytes.length + 1);
    msg.set(bytes);
    msg[bytes.length] = 0x80;

    const bitLen = bytes.length * 8;
    const padLen = (bytes.length + 9) % 64 === 0 ? 0 : 64 - ((bytes.length + 9) % 64);
    const data = new Uint8Array(bytes.length + 1 + padLen + 8);
    data.set(msg);
    const view = new DataView(data.buffer);
    view.setUint32(data.length - 8, bitLen & 0xFFFFFFFF, true);
    view.setUint32(data.length - 4, Math.floor(bitLen / 0x100000000), true);

    let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
    for (let i = 0; i < data.length; i += 64) {
      const M = new Int32Array(16);
      for (let j = 0; j < 16; j++) M[j] = view.getInt32(i + j * 4, true);
      let aa = a, bb = b, cc = c, dd = d;
      a = md5ff(a,b,c,d,M[0],7,-680876936); d = md5ff(d,a,b,c,M[1],12,-389564586); c = md5ff(c,d,a,b,M[2],17,606105819); b = md5ff(b,c,d,a,M[3],22,-1044525330);
      a = md5ff(a,b,c,d,M[4],7,-176418897); d = md5ff(d,a,b,c,M[5],12,1200080426); c = md5ff(c,d,a,b,M[6],17,-1473231341); b = md5ff(b,c,d,a,M[7],22,-45705983);
      a = md5ff(a,b,c,d,M[8],7,1770035416); d = md5ff(d,a,b,c,M[9],12,-1958414417); c = md5ff(c,d,a,b,M[10],17,-42063); b = md5ff(b,c,d,a,M[11],22,-1990404162);
      a = md5ff(a,b,c,d,M[12],7,1804603682); d = md5ff(d,a,b,c,M[13],12,-40341101); c = md5ff(c,d,a,b,M[14],17,-1502002290); b = md5ff(b,c,d,a,M[15],22,1236535329);
      a = md5gg(a,b,c,d,M[1],5,-165796510); d = md5gg(d,a,b,c,M[6],9,-1069501632); c = md5gg(c,d,a,b,M[11],14,643717713); b = md5gg(b,c,d,a,M[0],20,-373897302);
      a = md5gg(a,b,c,d,M[5],5,-701558691); d = md5gg(d,a,b,c,M[10],9,38016083); c = md5gg(c,d,a,b,M[15],14,-660478335); b = md5gg(b,c,d,a,M[4],20,-405537848);
      a = md5gg(a,b,c,d,M[9],5,568446438); d = md5gg(d,a,b,c,M[14],9,-1019803690); c = md5gg(c,d,a,b,M[3],14,-187363961); b = md5gg(b,c,d,a,M[8],20,1163531501);
      a = md5gg(a,b,c,d,M[13],5,-1444681467); d = md5gg(d,a,b,c,M[2],9,-51403784); c = md5gg(c,d,a,b,M[7],14,1735328473); b = md5gg(b,c,d,a,M[12],20,-1926607734);
      a = md5hh(a,b,c,d,M[5],4,-378558); d = md5hh(d,a,b,c,M[8],11,-2022574463); c = md5hh(c,d,a,b,M[11],16,1839030562); b = md5hh(b,c,d,a,M[14],23,-35309556);
      a = md5hh(a,b,c,d,M[1],4,-1530992060); d = md5hh(d,a,b,c,M[4],11,1272893353); c = md5hh(c,d,a,b,M[7],16,-155497632); b = md5hh(b,c,d,a,M[10],23,-1094730640);
      a = md5hh(a,b,c,d,M[13],4,681279174); d = md5hh(d,a,b,c,M[0],11,-358537222); c = md5hh(c,d,a,b,M[3],16,-722521979); b = md5hh(b,c,d,a,M[6],23,76029189);
      a = md5hh(a,b,c,d,M[9],4,-640364487); d = md5hh(d,a,b,c,M[12],11,-421815835); c = md5hh(c,d,a,b,M[15],16,530742520); b = md5hh(b,c,d,a,M[2],23,-995338651);
      a = md5ii(a,b,c,d,M[0],6,-198630844); d = md5ii(d,a,b,c,M[7],10,1126891415); c = md5ii(c,d,a,b,M[14],15,-1416354905); b = md5ii(b,c,d,a,M[5],21,-57434055);
      a = md5ii(a,b,c,d,M[12],6,1700485571); d = md5ii(d,a,b,c,M[3],10,-1894986606); c = md5ii(c,d,a,b,M[10],15,-1051523); b = md5ii(b,c,d,a,M[1],21,-2054922799);
      a = md5ii(a,b,c,d,M[8],6,1873313359); d = md5ii(d,a,b,c,M[15],10,-30611744); c = md5ii(c,d,a,b,M[6],15,-1560198380); b = md5ii(b,c,d,a,M[13],21,1309151649);
      a = md5ii(a,b,c,d,M[4],6,-145523070); d = md5ii(d,a,b,c,M[11],10,-1120210379); c = md5ii(c,d,a,b,M[2],15,718787259); b = md5ii(b,c,d,a,M[9],21,-343485551);
      a = safeAdd(a,aa); b = safeAdd(b,bb); c = safeAdd(c,cc); d = safeAdd(d,dd);
    }

    const out = new Uint8Array(16);
    const ov = new DataView(out.buffer);
    ov.setInt32(0,a,true); ov.setInt32(4,b,true); ov.setInt32(8,c,true); ov.setInt32(12,d,true);
    return Array.from(out).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  }

  async function hashBuffer(buf, algo) {
    const hashBuf = await crypto.subtle.digest(algo, buf);
    return Array.from(new Uint8Array(hashBuf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  }

  async function hashText(text) {
    if (!text) { resetHashes(); return; }
    const buf = new TextEncoder().encode(text).buffer;
    const bytes = new TextEncoder().encode(text).length;
    document.getElementById('hash-md5').textContent = formatHashVal(md5(text));
    document.getElementById('hash-sha1').textContent = formatHashVal(await hashBuffer(buf, 'SHA-1'));
    document.getElementById('hash-sha256').textContent = formatHashVal(await hashBuffer(buf, 'SHA-256'));
    document.getElementById('hash-sha512').textContent = formatHashVal(await hashBuffer(buf, 'SHA-512'));
    updateStats(bytes);
  }

  function resetHashes() {
    ['hash-md5','hash-sha1','hash-sha256','hash-sha512'].forEach(function(id){
      document.getElementById(id).textContent = '—';
    });
  }

  const textInput = document.getElementById('hash-text-input');
  textInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { hashText(textInput.value); }, 400);
  });

  // File hashing
  const dropZone = document.getElementById('hash-drop-zone');
  const fileInput = document.getElementById('hash-file-input');
  const fileProgress = document.getElementById('hash-file-progress');
  const progressFill = document.getElementById('hash-progress-fill');
  const progressText = document.getElementById('hash-progress-text');
  const fileInfo = document.getElementById('hash-file-info');

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  async function hashFile(file) {
    fileProgress.style.display = 'block';
    fileInfo.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = 'Reading file...';

    await new Promise(function(r){ setTimeout(r, 0); });

    const buf = await file.arrayBuffer();
    progressFill.style.width = '50%';
    progressText.textContent = 'Hashing...';

    await new Promise(function(r){ setTimeout(r, 0); });

    const md5Hash = md5Text(buf);
    const [sha1, sha256, sha512] = await Promise.all([
      hashBuffer(buf, 'SHA-1'),
      hashBuffer(buf, 'SHA-256'),
      hashBuffer(buf, 'SHA-512')
    ]);

    document.getElementById('hash-md5').textContent = formatHashVal(md5Hash);
    document.getElementById('hash-sha1').textContent = formatHashVal(sha1);
    document.getElementById('hash-sha256').textContent = formatHashVal(sha256);
    document.getElementById('hash-sha512').textContent = formatHashVal(sha512);
    updateStats(file.size);

    progressFill.style.width = '100%';
    setTimeout(function () { fileProgress.style.display = 'none'; }, 500);
    fileInfo.textContent = file.name + ' — ' + formatBytes(file.size);
    fileInfo.style.display = 'flex';
  }

  function md5Text(buf) {
    const bytes = new Uint8Array(buf);
    const str = Array.from(bytes).map(function(b){return String.fromCharCode(b);}).join('');
    return md5(new TextDecoder().decode(buf));
  }

  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) hashFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (this.files[0]) hashFile(this.files[0]);
  });

  // Sidebar toggles
  const togUppercase = document.getElementById('tog-uppercase');
  if (togUppercase) {
    togUppercase.addEventListener('click', function() {
      togUppercase.classList.toggle('off');
      togUppercase.setAttribute('aria-checked', !togUppercase.classList.contains('off'));
      refreshHashDisplay();
    });
  }

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const val = document.getElementById(btn.dataset.copy).textContent;
      if (val !== '—') window.copyToClipboard(val);
    });
  });
});
