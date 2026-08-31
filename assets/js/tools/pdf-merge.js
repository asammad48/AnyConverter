/* PDF Merge */
document.addEventListener('DOMContentLoaded', function () {
  function byId() {
    for (let i = 0; i < arguments.length; i++) {
      const el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  const dropZone = byId('pdf-drop-zone', 'merge-drop-zone');
  const fileInput = byId('pdf-input', 'merge-input');
  const fileAddInput = byId('pdf-add', 'merge-add');
  const fileList = byId('file-list', 'merge-files');
  const mergeOptions = byId('merge-options', 'merge-file-list');
  const totalSize = document.getElementById('total-size');
  const statTotalSize = document.getElementById('stat-total-size');
  const mergeProgress = document.getElementById('merge-progress');
  const mergeProgressFill = document.getElementById('merge-progress-fill');
  const mergeProgressText = byId('merge-progress-text', 'merge-progress-label');
  const mergeResult = document.getElementById('merge-result');
  const clearButton = document.getElementById('btn-clear-merge');
  const downloadButton = byId('btn-download-merged', 'btn-download-merge');
  const outputFilename = byId('output-filename', 'merge-output-name');
  const mergeCount = document.getElementById('merge-count');
  const blankSepToggle = document.getElementById('tog-blank-sep');
  const sortAlphaToggle = document.getElementById('tog-sort-alpha');

  if (!dropZone || !fileInput || !fileList || !mergeOptions || !mergeProgress || !mergeProgressFill || !mergeProgressText || !mergeResult) return;

  let files = [];
  let mergedBytes = null;

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

  function bindToggle(el, onChange) {
    if (!el) return;
    function toggle() {
      const on = el.classList.contains('off');
      setToggle(el, on);
      if (onChange) onChange(on);
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

  function sortFilesIfNeeded() {
    if (isToggleOn(sortAlphaToggle)) {
      files.sort(function (a, b) {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
    }
  }

  function renderFileList() {
    sortFilesIfNeeded();
    fileList.innerHTML = '';
    if (files.length === 0) {
      mergeOptions.style.display = 'none';
      mergeResult.style.display = 'none';
      if (totalSize) totalSize.textContent = '';
      if (mergeCount) mergeCount.textContent = '';
      const fc = document.getElementById('stat-file-count');
      if (fc) fc.textContent = '0';
      if (statTotalSize) statTotalSize.textContent = '0 B';
      return;
    }
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
    if (totalSize) totalSize.textContent = 'Total: ' + files.length + ' file(s) — ' + formatBytes(total);
    if (mergeCount) mergeCount.textContent = '(' + files.length + ')';
    mergeResult.style.display = 'none';

    const fc = document.getElementById('stat-file-count');
    if (fc) fc.textContent = files.length;
    if (statTotalSize) statTotalSize.textContent = formatBytes(total);
  }

  function addFiles(newFiles) {
    Array.from(newFiles).forEach(function (f) {
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) files.push(f);
    });
    renderFileList();
  }

  bindToggle(blankSepToggle);
  bindToggle(sortAlphaToggle, function () {
    renderFileList();
  });

  dropZone.addEventListener('click', function (e) {
    if (e.target === fileInput) return;
    fileInput.click();
  });
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
    addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('click', function (e) { e.stopPropagation(); });
  fileInput.addEventListener('change', function () { addFiles(this.files); this.value = ''; });
  if (fileAddInput) fileAddInput.addEventListener('change', function () { addFiles(this.files); this.value = ''; });
  if (clearButton) clearButton.addEventListener('click', function () {
    files = [];
    mergedBytes = null;
    renderFileList();
    fileList.innerHTML = '';
    mergeOptions.style.display = 'none';
    if (mergeCount) mergeCount.textContent = '';
    if (statTotalSize) statTotalSize.textContent = '0 B';
  });

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
        if (isToggleOn(blankSepToggle) && i < files.length - 1) {
          merged.addPage();
        }
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

  if (downloadButton) downloadButton.addEventListener('click', function () {
    if (!mergedBytes) return;
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const filename = (outputFilename && outputFilename.value) || 'merged.pdf';
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  });
});
