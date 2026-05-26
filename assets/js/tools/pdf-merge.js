/* PDF Merge */
document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('pdf-drop-zone');
  const fileInput = document.getElementById('pdf-input');
  const fileAddInput = document.getElementById('pdf-add');
  const fileList = document.getElementById('file-list');
  const mergeOptions = document.getElementById('merge-options');
  const totalSize = document.getElementById('total-size');
  const mergeProgress = document.getElementById('merge-progress');
  const mergeProgressFill = document.getElementById('merge-progress-fill');
  const mergeProgressText = document.getElementById('merge-progress-text');
  const mergeResult = document.getElementById('merge-result');

  let files = [];
  let mergedBytes = null;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function renderFileList() {
    fileList.innerHTML = '';
    if (files.length === 0) { mergeOptions.style.display = 'none'; return; }
    mergeOptions.style.display = 'block';
    let total = 0;
    files.forEach(function (f, i) {
      total += f.size;
      const li = document.createElement('li');
      li.className = 'file-item';
      li.draggable = true;
      li.dataset.index = i;
      li.innerHTML = '<span class="file-item-drag" aria-hidden="true">⠿</span>' +
        '<span class="file-item-name">📄 ' + f.name + '</span>' +
        '<span class="file-item-size">' + formatBytes(f.size) + '</span>' +
        '<button class="file-item-remove" aria-label="Remove ' + f.name + '">✕</button>';
      li.querySelector('.file-item-remove').addEventListener('click', function () {
        files.splice(i, 1);
        renderFileList();
      });

      let dragSrc = null;
      li.addEventListener('dragstart', function () { dragSrc = i; li.style.opacity = '0.5'; });
      li.addEventListener('dragend', function () { li.style.opacity = '1'; });
      li.addEventListener('dragover', function (e) { e.preventDefault(); });
      li.addEventListener('drop', function (e) {
        e.preventDefault();
        if (dragSrc !== null && dragSrc !== i) {
          const moved = files.splice(dragSrc, 1)[0];
          files.splice(i, 0, moved);
          renderFileList();
        }
      });

      fileList.appendChild(li);
    });
    totalSize.textContent = 'Total: ' + files.length + ' file(s) — ' + formatBytes(total);
    mergeResult.style.display = 'none';

    const fc = document.getElementById('stat-file-count');
    const ts = document.getElementById('stat-total-size');
    if (fc) fc.textContent = files.length;
    if (ts) ts.textContent = formatBytes(total);
  }

  function addFiles(newFiles) {
    Array.from(newFiles).forEach(function (f) {
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) files.push(f);
    });
    renderFileList();
  }

  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', function () { addFiles(this.files); this.value = ''; });
  fileAddInput.addEventListener('change', function () { addFiles(this.files); this.value = ''; });

  document.getElementById('btn-merge').addEventListener('click', async function () {
    if (files.length < 2) { window.showToast('Please add at least 2 PDF files', 'error'); return; }
    if (!window.PDFLib) { window.showToast('PDF library is still loading, please wait', 'info'); return; }

    const btn = document.getElementById('btn-merge');
    btn.disabled = true;
    mergeProgress.style.display = 'block';
    mergeProgressText.style.display = 'block';
    mergeResult.style.display = 'none';

    try {
      const merged = await window.PDFLib.PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        mergeProgressFill.style.width = Math.round((i / files.length) * 90) + '%';
        mergeProgressText.textContent = 'Processing ' + (i + 1) + ' of ' + files.length + '...';
        await new Promise(function(r){ setTimeout(r, 0); });
        const bytes = await files[i].arrayBuffer();
        const doc = await window.PDFLib.PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(function(p){ merged.addPage(p); });
      }
      mergeProgressFill.style.width = '100%';
      mergeProgressText.textContent = 'Finalizing...';
      await new Promise(function(r){ setTimeout(r, 0); });
      mergedBytes = await merged.save();
      mergeResult.style.display = 'block';
    } catch (e) {
      window.showToast('Error merging PDFs: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      setTimeout(function () {
        mergeProgress.style.display = 'none';
        mergeProgressText.style.display = 'none';
        mergeProgressFill.style.width = '0%';
      }, 1000);
    }
  });

  document.getElementById('btn-download-merged').addEventListener('click', function () {
    if (!mergedBytes) return;
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const filename = document.getElementById('output-filename').value || 'merged.pdf';
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  });
});
