(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('pf-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }
  function dl(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      var form = doc.getForm();
      var fields = form.getFields();
      var container = document.getElementById('pf-fields');
      container.innerHTML = '';

      if (!fields.length) {
        container.innerHTML = '<p style="color:#6B7280;font-size:13px">No fillable form fields found in this PDF.</p>';
        document.getElementById('pf-info').textContent = 'Loaded: ' + file.name + ' — no form fields found.';
        document.getElementById('pf-controls').style.display = 'block';
        return;
      }

      document.getElementById('pf-info').textContent = 'Loaded: ' + file.name + ' (' + fields.length + ' form field(s) found)';

      fields.forEach(function (field) {
        var name = field.getName();
        var type = field.constructor.name;
        var row = document.createElement('div');
        row.style.cssText = 'margin-bottom:12px';

        var label = document.createElement('label');
        label.style.cssText = 'display:block;font-size:12px;font-weight:500;margin-bottom:4px;color:#5C5C7A';
        label.textContent = name + ' (' + type.replace('PDF','') + ')';

        var input;
        if (type === 'PDFCheckBox') {
          input = document.createElement('input');
          input.type = 'checkbox';
          input.id = 'pf-' + name;
          try { input.checked = field.isChecked(); } catch(e) {}
        } else if (type === 'PDFDropdown' || type === 'PDFOptionList') {
          input = document.createElement('select');
          input.id = 'pf-' + name;
          input.style.cssText = 'width:100%;padding:8px 10px;border:1px solid #E4E4EF;border-radius:6px;font-size:13px';
          try {
            field.getOptions().forEach(function (opt) {
              var o = document.createElement('option');
              o.value = opt; o.textContent = opt;
              input.appendChild(o);
            });
          } catch(e) {}
        } else {
          input = document.createElement('input');
          input.type = 'text';
          input.id = 'pf-' + name;
          input.style.cssText = 'width:100%;padding:8px 10px;border:1px solid #E4E4EF;border-radius:6px;font-size:13px';
          try { input.value = field.getText() || ''; } catch(e) {}
          input.placeholder = 'Enter value…';
        }
        input.dataset.fieldName = name;
        input.dataset.fieldType = type;
        row.appendChild(label); row.appendChild(input);
        container.appendChild(row);
      });

      document.getElementById('pf-controls').style.display = 'block';
    } catch (e) {
      setStatus('Error loading PDF: ' + e.message, 'error');
    }
  }

  async function processFill() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    setStatus('Filling form…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      var form = doc.getForm();
      document.querySelectorAll('[data-field-name]').forEach(function (input) {
        var name = input.dataset.fieldName;
        var type = input.dataset.fieldType;
        try {
          if (type === 'PDFCheckBox') {
            var cb = form.getCheckBox(name);
            input.checked ? cb.check() : cb.uncheck();
          } else if (type === 'PDFDropdown') {
            form.getDropdown(name).select(input.value);
          } else if (type === 'PDFTextField') {
            form.getTextField(name).setText(input.value);
          }
        } catch(e) {}
      });
      if (document.getElementById('pf-flatten').checked) form.flatten();
      var saved = await doc.save();
      dl(saved, 'filled-form.pdf');
      setStatus('Done! Form filled and saved.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pf-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('pf-btn').addEventListener('click', processFill);
  });
})();
