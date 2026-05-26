(function() {
  var originalFile = null;
  var compressedBlob = null;

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    originalFile = file;
    document.getElementById('img-options').style.display = 'block';
    document.getElementById('img-result').style.display = 'none';
  }

  function compress() {
    if (!originalFile) return;
    var quality = parseInt(document.getElementById('quality-slider').value, 10) / 100;
    var format = document.getElementById('output-format').value;
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
          compressedBlob = blob;
          var savings = (1 - blob.size / originalFile.size) * 100;
          document.getElementById('orig-size').textContent = formatSize(originalFile.size);
          document.getElementById('comp-size').textContent = formatSize(blob.size);
          document.getElementById('savings-pct').textContent = (savings > 0 ? '-' : '+') + Math.abs(savings).toFixed(1) + '%';
          var url = URL.createObjectURL(blob);
          document.getElementById('preview-img').src = url;
          document.getElementById('img-result').style.display = 'block';
        }, format, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(originalFile);
  }

  function downloadImg() {
    if (!compressedBlob) return;
    var ext = document.getElementById('output-format').value.split('/')[1];
    var a = document.createElement('a');
    a.href = URL.createObjectURL(compressedBlob);
    a.download = 'compressed.' + ext;
    a.click();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var zone = document.getElementById('img-drop-zone');
    var fileInput = document.getElementById('img-file-input');
    var qualitySlider = document.getElementById('quality-slider');
    zone.addEventListener('click', function() { fileInput.click(); });
    zone.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', function(e) { e.preventDefault(); zone.classList.remove('drag-over'); loadFile(e.dataTransfer.files[0]); });
    fileInput.addEventListener('change', function() { loadFile(fileInput.files[0]); });
    qualitySlider.addEventListener('input', function() { document.getElementById('quality-display').textContent = qualitySlider.value; });
    document.getElementById('btn-compress').addEventListener('click', compress);
    document.getElementById('btn-download-img').addEventListener('click', downloadImg);
    document.getElementById('btn-img-reset').addEventListener('click', function() {
      originalFile = null; compressedBlob = null;
      fileInput.value = '';
      document.getElementById('img-options').style.display = 'none';
      document.getElementById('img-result').style.display = 'none';
    });
  });
})();
