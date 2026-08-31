/* Image Converter */
document.addEventListener('DOMContentLoaded', function () {
  function byId() {
    for (let i = 0; i < arguments.length; i++) {
      const el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  const dropZone = byId('drop-zone', 'img-drop-zone');
  const fileInput = byId('image-input', 'img-input');
  const settingsPanel = byId('settings-panel', 'img-settings');
  const previewSection = byId('preview-section', 'img-result');
  const formatToggles = document.querySelectorAll('#format-toggles [data-format], #format-toggle [data-format]');
  const qualityRow = document.getElementById('quality-row');
  const qualitySlider = byId('quality-slider', 'img-quality');
  const qualityValue = byId('quality-value', 'quality-val');
  const widthInput = byId('width-input', 'img-width');
  const heightInput = byId('height-input', 'img-height');
  const aspectRatio = byId('aspect-ratio', 'img-lock-aspect');
  const previewOriginal = byId('preview-original', 'img-original-preview');
  const previewConverted = byId('preview-converted', 'img-converted-preview');
  const metaOriginal = byId('meta-original', 'img-original-size');
  const metaConverted = byId('meta-converted', 'img-converted-size');

  let originalImage = null;
  let originalWidth = 0;
  let originalHeight = 0;
  let selectedFormat = 'image/png';
  let lastConvertedBlob = null;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function normalizeFormat(format) {
    if (!format) return 'image/png';
    if (format.indexOf('/') !== -1) return format;
    if (format === 'jpg') return 'image/jpeg';
    return 'image/' + format;
  }

  function getQuality() {
    return qualitySlider ? parseInt(qualitySlider.value, 10) / 100 : 0.85;
  }

  function shouldAutoDownload() {
    const el = document.getElementById('tog-auto-dl');
    return el ? !el.classList.contains('off') : true;
  }

  function downloadBlob(blob, ext) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.' + ext;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast('Downloaded!', 'success');
  }

  function loadImage(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      originalImage = img;
      originalWidth = img.naturalWidth;
      originalHeight = img.naturalHeight;
      if (previewOriginal) previewOriginal.src = url;
      if (metaOriginal) metaOriginal.textContent = file.name + ' — ' + originalWidth + '×' + originalHeight + ' — ' + formatBytes(file.size);
      if (widthInput) widthInput.value = originalWidth;
      if (heightInput) heightInput.value = originalHeight;
      if (settingsPanel) settingsPanel.style.display = 'block';
      if (previewSection) previewSection.style.display = 'block';
      if (dropZone) dropZone.classList.add('has-file');
      const info = document.getElementById('img-info');
      if (info) info.textContent = file.name + ' — ' + originalWidth + '×' + originalHeight + ' — ' + formatBytes(file.size);
      const statOrig = document.getElementById('stat-orig-size');
      const statDimensions = document.getElementById('stat-dimensions');
      if (statOrig) statOrig.textContent = formatBytes(file.size);
      if (statDimensions) statDimensions.textContent = originalWidth + '×' + originalHeight;
      updatePreview();
    };
    img.src = url;
  }

  function updatePreview() {
    if (!originalImage) return;
    const canvas = document.createElement('canvas');
    const w = parseInt(widthInput && widthInput.value, 10) || originalWidth;
    const h = parseInt(heightInput && heightInput.value, 10) || originalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, w, h);
    const quality = getQuality();
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      lastConvertedBlob = blob;
      if (previewConverted) previewConverted.src = url;
      const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
      if (metaConverted) metaConverted.textContent = 'Converted — ' + w + '×' + h + ' — ~' + formatBytes(blob.size) + ' (' + ext.toUpperCase() + ')';
      const statOut = document.getElementById('stat-out-size');
      const statFormat = document.getElementById('stat-format');
      if (statOut) statOut.textContent = formatBytes(blob.size);
      if (statFormat) statFormat.textContent = ext.toUpperCase();
    }, selectedFormat, quality);
  }

  // Drop zone
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
    dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) loadImage(file);
    });
    fileInput.addEventListener('click', function(e) { e.stopPropagation(); });
    fileInput.addEventListener('change', function () {
      if (this.files[0]) loadImage(this.files[0]);
    });
  }

  // Format toggles
  formatToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      formatToggles.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      selectedFormat = normalizeFormat(btn.dataset.format);
      const needsQuality = selectedFormat === 'image/jpeg' || selectedFormat === 'image/webp';
      if (qualityRow) qualityRow.style.display = needsQuality ? 'flex' : 'none';
      updatePreview();
    });
  });

  // Quality slider
  if (qualitySlider) {
    qualitySlider.addEventListener('input', function () {
      if (qualityValue) qualityValue.textContent = this.value;
      updatePreview();
    });
  }

  // Resize with aspect ratio
  if (widthInput) widthInput.addEventListener('input', function () {
    if (aspectRatio && aspectRatio.checked && originalWidth && originalHeight) {
      const w = parseInt(this.value);
      if (w && heightInput) heightInput.value = Math.round(w * originalHeight / originalWidth);
    }
    updatePreview();
  });
  if (heightInput) heightInput.addEventListener('input', function () {
    if (aspectRatio && aspectRatio.checked && originalWidth && originalHeight) {
      const h = parseInt(this.value);
      if (h && widthInput) widthInput.value = Math.round(h * originalWidth / originalHeight);
    }
    updatePreview();
  });

  // Convert & Download
  function convertImage() {
    if (!originalImage) return;
    const canvas = document.createElement('canvas');
    const w = parseInt(widthInput && widthInput.value, 10) || originalWidth;
    const h = parseInt(heightInput && heightInput.value, 10) || originalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, w, h);
    const quality = getQuality();
    const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
    canvas.toBlob(function (blob) {
      if (!blob) { window.showToast('This format is not supported by your browser.', 'error'); return; }
      lastConvertedBlob = blob;
      if (previewSection) previewSection.style.display = 'block';
      if (previewConverted) previewConverted.src = URL.createObjectURL(blob);
      if (metaConverted) metaConverted.textContent = 'Converted — ' + w + '×' + h + ' — ' + formatBytes(blob.size) + ' (' + ext.toUpperCase() + ')';
      if (shouldAutoDownload()) downloadBlob(blob, ext);
    }, selectedFormat, quality);
  }
  const convertBtn = byId('btn-convert', 'btn-convert-img');
  if (convertBtn) convertBtn.addEventListener('click', convertImage);
  const downloadBtn = document.getElementById('btn-download-img');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      if (!lastConvertedBlob) { convertImage(); return; }
      const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
      downloadBlob(lastConvertedBlob, ext);
    });
  }

  function initToggle(id, initialOn) {
    const el = document.getElementById(id);
    if (!el) return;
    function update(on) {
      el.classList.toggle('off', !on);
      el.setAttribute('aria-checked', on);
    }
    update(initialOn);
    function activate() {
      const on = !el.classList.contains('off');
      update(!on);
    }
    el.addEventListener('click', activate);
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  }
  initToggle('tog-strip-meta', true);
  initToggle('tog-auto-dl', true);
});
