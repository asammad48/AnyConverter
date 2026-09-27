(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  var pdfBytes = null;
  var currentFileName = 'form.pdf';

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
    currentFileName = file.name || currentFileName;
    pdfBytes = await file.arrayBuffer();
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      var form = doc.getForm();
      var fields = form.getFields();
      var container = document.getElementById('pf-fields');
      container.innerHTML = '';

      if (!fields.length) {
        container.innerHTML = '<p style="color:var(--color-text-2,#3F3A36);font-size:13px">No fillable form fields found in this PDF.</p>';
        document.getElementById('pf-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' — no form fields found.';
        document.getElementById('pf-controls').style.display = 'block';
        return;
      }

      document.getElementById('pf-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' (' + fields.length + ' form field(s) found)';

      fields.forEach(function (field) {
        var name = field.getName();
        var type = field.constructor.name;
        var row = document.createElement('div');
        row.style.cssText = 'margin-bottom:12px';

        var label = document.createElement('label');
        label.style.cssText = 'display:block;font-size:12px;font-weight:500;margin-bottom:4px;color:var(--color-text-2,#3F3A36)';
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
          input.style.cssText = 'width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px';
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
          input.style.cssText = 'width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px';
          try { input.value = field.getText() || ''; } catch(e) {}
          input.placeholder = 'Enter value…';
        }
        input.dataset.fieldName = name;
        input.dataset.fieldType = type;
        row.appendChild(label); row.appendChild(input);
        container.appendChild(row);
      });

      document.getElementById('pf-controls').style.display = 'block';
      ensureFieldActions();
      updateFieldSummary();
    } catch (e) {
      setStatus(t({ en: 'Error loading PDF: ', es: 'Error al cargar el PDF: ', da: 'Fejl ved indlæsning af PDF: ' }) + e.message, 'error');
    }
  }

  async function loadSample() {
    try {
      var doc = await PDFLib.PDFDocument.create();
      var page = doc.addPage([612, 792]);
      var form = doc.getForm();
      page.drawText('AnyConverter Sample PDF Form', { x: 48, y: 730, size: 18 });
      page.drawText('Full name', { x: 48, y: 674, size: 11 });
      page.drawText('Email', { x: 48, y: 614, size: 11 });
      page.drawText('Subscribe to updates', { x: 84, y: 552, size: 11 });
      var name = form.createTextField('full_name');
      name.setText('');
      name.addToPage(page, { x: 48, y: 646, width: 260, height: 28 });
      var email = form.createTextField('email');
      email.setText('');
      email.addToPage(page, { x: 48, y: 586, width: 260, height: 28 });
      var cb = form.createCheckBox('subscribe');
      cb.addToPage(page, { x: 48, y: 546, width: 18, height: 18 });
      var bytes = await doc.save();
      await loadFile(new File([bytes], 'sample-fillable-form.pdf', { type: 'application/pdf' }));
      setStatus(t({ en: 'Sample fillable form loaded. Try editing the fields below.', es: 'Formulario de ejemplo cargado. Prueba a editar los campos de abajo.', da: 'Eksempelformular indlæst. Prøv at redigere felterne nedenfor.' }), 'success');
    } catch (e) {
      setStatus(t({ en: 'Could not create sample form: ', es: 'No se pudo crear el formulario de ejemplo: ', da: 'Kunne ikke oprette eksempelformularen: ' }) + e.message, 'error');
    }
  }

  function ensureFieldActions() {
    if (document.getElementById('pf-field-summary')) return;
    var controls = document.getElementById('pf-controls');
    var summary = document.createElement('div');
    summary.id = 'pf-field-summary';
    summary.className = 'ac-mini-panel';
    summary.style.marginBottom = '12px';
    controls.insertBefore(summary, document.getElementById('pf-fields'));
    var actions = document.createElement('div');
    actions.className = 'ac-chip-row';
    actions.style.margin = '0 0 14px';
    actions.innerHTML = '<button class="ac-chip" type="button" id="pf-fill-sample">Fill sample values</button><button class="ac-chip" type="button" id="pf-export-json">Export field JSON</button>';
    controls.insertBefore(actions, document.querySelector('label[for="pf-flatten"]') || document.getElementById('pf-btn'));
    document.getElementById('pf-fill-sample').addEventListener('click', function() {
      document.querySelectorAll('[data-field-name]').forEach(function(input) {
        var name = input.dataset.fieldName.toLowerCase();
        if (input.type === 'checkbox') input.checked = true;
        else if (/email/.test(name)) input.value = 'name@example.com';
        else if (/name/.test(name)) input.value = 'Alex Morgan';
        else if (!input.value) input.value = 'Sample value';
      });
      updateFieldSummary();
    });
    document.getElementById('pf-export-json').addEventListener('click', exportJson);
  }

  function updateFieldSummary() {
    var summary = document.getElementById('pf-field-summary');
    if (!summary) return;
    var fields = Array.from(document.querySelectorAll('[data-field-name]'));
    var filled = fields.filter(function(input) { return input.type === 'checkbox' ? input.checked : input.value.trim(); }).length;
    var types = fields.reduce(function(acc, input) {
      var t = input.dataset.fieldType.replace('PDF', '');
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    summary.innerHTML = '<strong>' + filled + ' of ' + fields.length + ' fields filled</strong><div class="prototype-muted-note">' + Object.keys(types).map(function(k) { return k + ': ' + types[k]; }).join(' · ') + '</div>';
  }

  function exportJson() {
    var data = {};
    document.querySelectorAll('[data-field-name]').forEach(function(input) {
      data[input.dataset.fieldName] = input.type === 'checkbox' ? input.checked : input.value;
    });
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.replace(/\.pdf$/i, '') + '-fields.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function processFill() {
    if (!pdfBytes) { setStatus(t({ en: 'Please upload a PDF first.', es: 'Primero sube un PDF.', da: 'Upload først en PDF.' }), 'error'); return; }
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
      dl(saved, currentFileName.replace(/\.pdf$/i, '') + '-filled.pdf');
      setStatus(t({ en: 'Done! Form filled and saved.', es: '¡Listo! Formulario rellenado y guardado.', da: 'Færdig! Formularen er udfyldt og gemt.' }), 'success');
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var upload = document.querySelector('[data-file-target="pf-file"]');
    if (upload && !document.getElementById('pf-sample')) {
      // Keep the choose and sample buttons on one row inside the dropzone.
      var actions = upload.querySelector('.ac-upload-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'ac-upload-actions';
        var choose = upload.querySelector('.btn');
        if (choose) { upload.insertBefore(actions, choose); actions.appendChild(choose); }
        else upload.appendChild(actions);
      }
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.type = 'button';
      btn.id = 'pf-sample';
      btn.textContent = t({ en: 'Load sample form', es: 'Cargar formulario de ejemplo', da: 'Indlæs eksempelformular' });
      actions.appendChild(btn);
      btn.addEventListener('click', function(e) { e.stopPropagation(); loadSample(); });
    }
    document.getElementById('pf-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.addEventListener('input', function(e) {
      if (e.target && e.target.matches('[data-field-name]')) updateFieldSummary();
    });
    document.addEventListener('change', function(e) {
      if (e.target && e.target.matches('[data-field-name]')) updateFieldSummary();
    });
    document.getElementById('pf-btn').addEventListener('click', processFill);
  });
})();
