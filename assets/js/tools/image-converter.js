/* Image Converter */
document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('image-input');
  const settingsPanel = document.getElementById('settings-panel');
  const previewSection = document.getElementById('preview-section');
  const formatToggles = document.querySelectorAll('#format-toggles [data-format]');
  const qualityRow = document.getElementById('quality-row');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityValue = document.getElementById('quality-value');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('height-input');
  const aspectRatio = document.getElementById('aspect-ratio');
  const previewOriginal = document.getElementById('preview-original');
  const previewConverted = document.getElementById('preview-converted');
  const metaOriginal = document.getElementById('meta-original');
  const metaConverted = document.getElementById('meta-converted');

  let originalImage = null;
  let originalWidth = 0;
  let originalHeight = 0;
  let selectedFormat = 'image/png';

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function loadImage(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      originalImage = img;
      originalWidth = img.naturalWidth;
      originalHeight = img.naturalHeight;
      previewOriginal.src = url;
      metaOriginal.textContent = file.name + ' — ' + originalWidth + '×' + originalHeight + ' — ' + formatBytes(file.size);
      widthInput.value = originalWidth;
      heightInput.value = originalHeight;
      settingsPanel.style.display = 'block';
      previewSection.style.display = 'block';
      dropZone.classList.add('has-file');
      updatePreview();
    };
    img.src = url;
  }

  function updatePreview() {
    if (!originalImage) return;
    const canvas = document.createElement('canvas');
    const w = parseInt(widthInput.value) || originalWidth;
    const h = parseInt(heightInput.value) || originalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, w, h);
    const quality = parseInt(qualitySlider.value) / 100;
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      previewConverted.src = url;
      const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
      metaConverted.textContent = 'Converted — ' + w + '×' + h + ' — ~' + formatBytes(blob.size) + ' (' + ext.toUpperCase() + ')';
    }, selectedFormat, quality);
  }

  // Drop zone
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
  fileInput.addEventListener('change', function () {
    if (this.files[0]) loadImage(this.files[0]);
  });

  // Format toggles
  formatToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      formatToggles.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      selectedFormat = btn.dataset.format;
      const needsQuality = selectedFormat === 'image/jpeg' || selectedFormat === 'image/webp';
      qualityRow.style.display = needsQuality ? 'flex' : 'none';
      updatePreview();
    });
  });

  // Quality slider
  qualitySlider.addEventListener('input', function () {
    qualityValue.textContent = this.value;
    updatePreview();
  });

  // Resize with aspect ratio
  widthInput.addEventListener('input', function () {
    if (aspectRatio.checked && originalWidth && originalHeight) {
      const w = parseInt(this.value);
      if (w) heightInput.value = Math.round(w * originalHeight / originalWidth);
    }
    updatePreview();
  });
  heightInput.addEventListener('input', function () {
    if (aspectRatio.checked && originalWidth && originalHeight) {
      const h = parseInt(this.value);
      if (h) widthInput.value = Math.round(h * originalWidth / originalHeight);
    }
    updatePreview();
  });

  // Convert & Download
  document.getElementById('btn-convert').addEventListener('click', function () {
    if (!originalImage) return;
    const canvas = document.createElement('canvas');
    const w = parseInt(widthInput.value) || originalWidth;
    const h = parseInt(heightInput.value) || originalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0, w, h);
    const quality = parseInt(qualitySlider.value) / 100;
    const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
    canvas.toBlob(function (blob) {
      if (!blob) { window.showToast('This format is not supported by your browser.', 'error'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.' + ext;
      a.click();
      URL.revokeObjectURL(url);
      window.showToast('Downloaded!', 'success');
    }, selectedFormat, quality);
  });
});
