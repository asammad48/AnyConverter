/* PDF Split */
document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('split-drop-zone');
  const fileInput = document.getElementById('split-input');
  const splitSettings = document.getElementById('split-settings');
  const fileInfoBar = document.getElementById('split-file-info');
  const splitResult = document.getElementById('split-result');
  const splitDownloads = document.getElementById('split-downloads');
  const pageRangeSection = document.getElementById('page-range-section');
  const splitNSection = document.getElementById('split-n-section');
  const zipToggle = document.getElementById('tog-zip-dl');
  const prefixInput = document.getElementById('split-prefix');
  const selectedStat = document.getElementById('stat-sel-p');
  const partsStat = document.getElementById('stat-parts');

  let splitMode = 'pages';
  let pdfBytes = null;
  let totalPages = 0;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function isToggleOn(el) {
    return !!el && !el.classList.contains('off');
  }

  function setToggle(el, on) {
    if (!el) return;
    el.classList.toggle('off', !on);
    el.setAttribute('aria-checked', on ? 'true' : 'false');
  }

  function bindToggle(el) {
    if (!el) return;
    function toggle() {
      setToggle(el, el.classList.contains('off'));
    }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    const labelId = el.getAttribute('aria-labelledby');
    const label = labelId ? document.getElementById(labelId) : null;
    if (label) label.addEventListener('click', toggle);
  }

  function filenamePrefix() {
    const raw = prefixInput && prefixInput.value.trim() ? prefixInput.value.trim() : 'part';
    return raw.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').slice(0, 30) || 'part';
  }

  function loadFile(file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      pdfBytes = new Uint8Array(e.target.result);
      if (!window.PDFLib) { window.showToast('PDF library loading, please wait', 'info'); return; }
      try {
        const doc = await window.PDFLib.PDFDocument.load(pdfBytes);
        totalPages = doc.getPageCount();
        fileInfoBar.textContent = file.name + ' — ' + totalPages + ' pages — ' + formatBytes(file.size);
        splitSettings.style.display = 'block';
        splitResult.style.display = 'none';
        const sp = document.getElementById('stat-total-p');
        const ss = document.getElementById('stat-split-size');
        if (sp) sp.textContent = totalPages;
        if (ss) ss.textContent = formatBytes(file.size);
      } catch(e) {
        window.showToast('Could not read PDF: ' + e.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function parsePageRanges(str, maxPage) {
    const pages = new Set();
    str.split(',').forEach(function(part) {
      part = part.trim();
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        for (let i = a; i <= Math.min(b, maxPage); i++) pages.add(i);
      } else {
        const n = parseInt(part);
        if (n >= 1 && n <= maxPage) pages.add(n);
      }
    });
    return Array.from(pages).sort(function(a,b){return a-b;});
  }

  document.querySelectorAll('#split-mode-tabs [data-mode]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#split-mode-tabs [data-mode]').forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      splitMode = tab.dataset.mode;
      pageRangeSection.style.display = splitMode === 'pages' ? 'block' : 'none';
      splitNSection.style.display = splitMode === 'every' ? 'block' : 'none';
    });
  });

  async function downloadPdf(bytes, name) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  }

  const crcTable = makeCrcTable();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function u16(n) {
    return [n & 255, (n >>> 8) & 255];
  }

  function u32(n) {
    return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  }

  function concatParts(parts) {
    const total = parts.reduce(function (sum, part) { return sum + part.length; }, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach(function (part) {
      out.set(part, offset);
      offset += part.length;
    });
    return out;
  }

  function bytesFromNumbers(nums) {
    return new Uint8Array(nums);
  }

  function createZip(entries) {
    const encoder = new TextEncoder();
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const fileParts = [];
    const centralParts = [];
    let offset = 0;

    entries.forEach(function (entry) {
      const nameBytes = encoder.encode(entry.name);
      const data = entry.bytes instanceof Uint8Array ? entry.bytes : new Uint8Array(entry.bytes);
      const crc = crc32(data);
      const localHeader = bytesFromNumbers([].concat(
        u32(0x04034b50),
        u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0)
      ));
      fileParts.push(localHeader, nameBytes, data);

      const centralHeader = bytesFromNumbers([].concat(
        u32(0x02014b50),
        u16(20), u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(offset)
      ));
      centralParts.push(centralHeader, nameBytes);
      offset += localHeader.length + nameBytes.length + data.length;
    });

    const centralSize = centralParts.reduce(function (sum, part) { return sum + part.length; }, 0);
    const endRecord = bytesFromNumbers([].concat(
      u32(0x06054b50),
      u16(0), u16(0), u16(entries.length), u16(entries.length),
      u32(centralSize), u32(offset), u16(0)
    ));

    return new Blob([concatParts(fileParts), concatParts(centralParts), endRecord], { type: 'application/zip' });
  }

  function downloadZip(entries, name) {
    const url = URL.createObjectURL(createZip(entries));
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  async function extractPages(pageNums) {
    const doc = await window.PDFLib.PDFDocument.load(pdfBytes);
    const newDoc = await window.PDFLib.PDFDocument.create();
    const indices = pageNums.map(function(p){ return p - 1; });
    const copied = await newDoc.copyPages(doc, indices);
    copied.forEach(function(p){ newDoc.addPage(p); });
    return await newDoc.save();
  }

  document.getElementById('btn-split').addEventListener('click', async function () {
    if (!pdfBytes || !totalPages) return;
    if (!window.PDFLib) { window.showToast('PDF library still loading', 'info'); return; }

    const mode = splitMode;
    const btn = document.getElementById('btn-split');
    const originalBtnText = btn.textContent;
    btn.disabled = true; btn.textContent = 'Processing...';
    splitDownloads.innerHTML = '';

    try {
      const outputs = [];
      const prefix = filenamePrefix();
      let selectedCount = 0;

      if (mode === 'pages') {
        const rangeStr = document.getElementById('page-range').value.trim();
        if (!rangeStr) { window.showToast('Please enter page ranges', 'error'); return; }
        const pages = parsePageRanges(rangeStr, totalPages);
        if (pages.length === 0) { window.showToast('No valid pages in range', 'error'); return; }
        const bytes = await extractPages(pages);
        selectedCount = pages.length;
        outputs.push({ bytes: bytes, name: prefix + '_pages_' + pages.join('_') + '.pdf' });
      } else if (mode === 'every') {
        const n = parseInt(document.getElementById('split-n').value) || 2;
        for (let start = 1; start <= totalPages; start += n) {
          const end = Math.min(start + n - 1, totalPages);
          const pages = [];
          for (let p = start; p <= end; p++) pages.push(p);
          const bytes = await extractPages(pages);
          const label = prefix + '_pages_' + start + '-' + end + '.pdf';
          selectedCount += pages.length;
          outputs.push({ bytes: bytes, name: label });
          await new Promise(function(r){ setTimeout(r, 0); });
        }
      } else {
        for (let p = 1; p <= totalPages; p++) {
          const bytes = await extractPages([p]);
          const label = prefix + '_page_' + p + '.pdf';
          selectedCount += 1;
          outputs.push({ bytes: bytes, name: label });
          await new Promise(function(r){ setTimeout(r, 0); });
        }
      }

      if (selectedStat) selectedStat.textContent = selectedCount;
      if (partsStat) partsStat.textContent = outputs.length;

      if (isToggleOn(zipToggle)) {
        const zipBtn = document.createElement('button');
        zipBtn.className = 'btn btn-primary btn-full';
        zipBtn.textContent = 'Download ' + prefix + '.zip ↓';
        zipBtn.addEventListener('click', function () {
          downloadZip(outputs, prefix + '.zip');
        });
        splitDownloads.appendChild(zipBtn);
      } else {
        outputs.forEach(function (output, index) {
          const btn2 = document.createElement('button');
          btn2.className = (index === 0 ? 'btn btn-primary' : 'btn btn-secondary') + ' btn-full mb-2';
          btn2.textContent = 'Download ' + output.name + ' ↓';
          btn2.addEventListener('click', function () {
            downloadPdf(output.bytes, output.name);
          });
          splitDownloads.appendChild(btn2);
        });
      }

      splitResult.style.display = 'block';
    } catch(e) {
      window.showToast('Error splitting PDF: ' + e.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = originalBtnText;
    }
  });

  bindToggle(zipToggle);
  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  });
  fileInput.addEventListener('click', function (e) { e.stopPropagation(); });
  fileInput.addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
});
