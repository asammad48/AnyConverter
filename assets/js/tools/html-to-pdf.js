(function () {
  'use strict';

  function setStatus(msg, type) {
    var el = document.getElementById('h2p-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  function updatePreview() {
    var html = document.getElementById('h2p-input').value;
    var frame = document.getElementById('h2p-frame');
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
  }

  async function processConvert() {
    var html = document.getElementById('h2p-input').value.trim();
    if (!html) { setStatus('Enter some HTML first.', 'error'); return; }
    setStatus('Converting to PDF…', '');
    try {
      var frame = document.getElementById('h2p-frame');
      var canvas = await html2canvas(frame.contentDocument.body, {
        scale: 2, useCORS: true, logging: false,
        backgroundColor: '#ffffff'
      });
      var imgData = canvas.toDataURL('image/jpeg', 0.95);
      var orient = document.getElementById('h2p-orient').value;
      var { jsPDF } = window.jspdf;
      var pdf = new jsPDF({ orientation: orient, unit: 'pt', format: 'a4' });
      var pdfW = pdf.internal.pageSize.getWidth();
      var pdfH = pdf.internal.pageSize.getHeight();
      var ratio = canvas.height / canvas.width;
      var imgH = pdfW * ratio;
      var y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -y, pdfW, imgH);
        y += pdfH;
      }
      pdf.save('html-to-pdf.pdf');
      setStatus('Done! PDF downloaded.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('h2p-input').addEventListener('input', updatePreview);
    document.getElementById('h2p-btn').addEventListener('click', processConvert);
    // set example HTML
    var example = '<!DOCTYPE html>\n<html>\n<head><style>\nbody { font-family: Arial, sans-serif; padding: 40px; }\nh1 { color: #4F46E5; }\np { line-height: 1.6; color: #333; }\n</style></head>\n<body>\n<h1>Hello from AnyConverter!</h1>\n<p>This is a sample HTML page converted to PDF. You can replace this with any HTML you want to convert.</p>\n<p>Supports: headings, paragraphs, tables, images (base64), and CSS styling.</p>\n</body>\n</html>';
    document.getElementById('h2p-input').value = example;
    updatePreview();
  });
})();
