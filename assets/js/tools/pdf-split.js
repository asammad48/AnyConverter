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

  let splitMode = 'pages';
  let pdfBytes = null;
  let totalPages = 0;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
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
    btn.disabled = true; btn.textContent = 'Processing...';
    splitDownloads.innerHTML = '';

    try {
      if (mode === 'pages') {
        const rangeStr = document.getElementById('page-range').value.trim();
        if (!rangeStr) { window.showToast('Please enter page ranges', 'error'); return; }
        const pages = parsePageRanges(rangeStr, totalPages);
        if (pages.length === 0) { window.showToast('No valid pages in range', 'error'); return; }
        const bytes = await extractPages(pages);
        const btn2 = document.createElement('button');
        btn2.className = 'btn btn-primary btn-full';
        btn2.textContent = 'Download pages_' + pages.join('_') + '.pdf ↓';
        btn2.addEventListener('click', function() { downloadPdf(bytes, 'pages.pdf'); });
        splitDownloads.appendChild(btn2);
      } else if (mode === 'every') {
        const n = parseInt(document.getElementById('split-n').value) || 2;
        for (let start = 1; start <= totalPages; start += n) {
          const end = Math.min(start + n - 1, totalPages);
          const pages = [];
          for (let p = start; p <= end; p++) pages.push(p);
          const bytes = await extractPages(pages);
          const label = 'pages_' + start + '-' + end + '.pdf';
          const btn2 = document.createElement('button');
          btn2.className = 'btn btn-secondary btn-full mb-2';
          btn2.textContent = 'Download ' + label + ' ↓';
          btn2.addEventListener('click', (function(b, l){ return function(){ downloadPdf(b,l); }; })(bytes, label));
          splitDownloads.appendChild(btn2);
          await new Promise(function(r){ setTimeout(r, 0); });
        }
      } else {
        for (let p = 1; p <= totalPages; p++) {
          const bytes = await extractPages([p]);
          const label = 'page_' + p + '.pdf';
          const btn2 = document.createElement('button');
          btn2.className = 'btn btn-secondary btn-full mb-2';
          btn2.textContent = 'Download page ' + p + ' ↓';
          btn2.addEventListener('click', (function(b, l){ return function(){ downloadPdf(b,l); }; })(bytes, label));
          splitDownloads.appendChild(btn2);
          await new Promise(function(r){ setTimeout(r, 0); });
        }
      }
      splitResult.style.display = 'block';
    } catch(e) {
      window.showToast('Error splitting PDF: ' + e.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Split PDF';
    }
  });

  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  });
  fileInput.addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
});
