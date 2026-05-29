/* PDF Compress */
document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('compress-drop-zone');
  const fileInput = document.getElementById('compress-input');
  const compressSettings = document.getElementById('compress-settings');
  const originalSizeBar = document.getElementById('original-size-bar');
  const compressResult = document.getElementById('compress-result');

  let originalBytes = null;
  let compressedBytes = null;
  let originalFile = null;
  let compressLevel = 'medium';

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function loadFile(file) {
    originalFile = file;
    const reader = new FileReader();
    reader.onload = function (e) {
      originalBytes = new Uint8Array(e.target.result);
      compressSettings.style.display = 'block';
      originalSizeBar.textContent = file.name + ' — ' + formatBytes(file.size);
      compressResult.style.display = 'none';
      dropZone.classList.add('has-file');
    };
    reader.readAsArrayBuffer(file);
  }

  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) loadFile(file);
  });
  fileInput.addEventListener('change', function () {
    if (this.files[0]) loadFile(this.files[0]);
  });

  document.querySelectorAll('#compress-level-tabs [data-level]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('#compress-level-tabs [data-level]').forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      compressLevel = tab.dataset.level;
    });
  });

  document.getElementById('btn-compress').addEventListener('click', async function () {
    if (!originalBytes) return;
    if (!window.PDFLib) { window.showToast('PDF library still loading, please wait', 'info'); return; }

    const btn = document.getElementById('btn-compress');
    btn.disabled = true;
    btn.textContent = 'Compressing...';

    await new Promise(function(r){ setTimeout(r, 0); });

    try {
      const level = compressLevel;
      const doc = await window.PDFLib.PDFDocument.load(originalBytes, { ignoreEncryption: true });

      const saveOptions = { useObjectStreams: true };
      if (level === 'medium' || level === 'high') saveOptions.addDefaultPage = false;

      const saved = await doc.save(saveOptions);
      compressedBytes = saved;

      const origSize = originalBytes.length;
      const compSize = saved.length;
      const pct = Math.round((1 - compSize / origSize) * 100);

      document.getElementById('result-original').textContent = formatBytes(origSize);
      document.getElementById('result-compressed').textContent = formatBytes(compSize);

      if (compSize >= origSize) {
        document.getElementById('result-saved').textContent = 'No reduction';
        document.getElementById('result-saved').style.color = 'var(--color-warning)';
        document.getElementById('compress-bar-fill').style.width = '0%';
        window.showToast('This PDF is already optimized. File size unchanged.', 'info');
      } else {
        document.getElementById('result-saved').textContent = pct + '%';
        document.getElementById('result-saved').style.color = 'var(--color-success)';
        document.getElementById('compress-bar-fill').style.width = pct + '%';
      }

      const so = document.getElementById('stat-orig-pdf');
      const sc = document.getElementById('stat-comp-pdf');
      const sp = document.getElementById('stat-saved-pct');
      if (so) so.textContent = formatBytes(origSize);
      if (sc) sc.textContent = formatBytes(compSize);
      if (sp) sp.textContent = compSize < origSize ? pct + '%' : '0%';

      const pageCount = doc.getPageCount();
      const spg = document.getElementById('stat-pdf-pages');
      if (spg) spg.textContent = pageCount;

      compressResult.style.display = 'block';
    } catch (e) {
      window.showToast('Error compressing PDF: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Compress PDF';
    }
  });

  document.getElementById('btn-download-compressed').addEventListener('click', function () {
    const bytes = compressedBytes || originalBytes;
    if (!bytes) return;
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compressed.pdf'; a.click();
    URL.revokeObjectURL(url);
  });
});
