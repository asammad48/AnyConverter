/* CSV to SQL Converter — with chunked processing and progress log */
document.addEventListener('DOMContentLoaded', function () {

  /* ===== SUB-TABS ===== */
  document.querySelectorAll('.sub-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.sub-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('tab-paste').style.display = target === 'paste' ? '' : 'none';
      document.getElementById('tab-upload').style.display = target === 'upload' ? '' : 'none';
    });
  });

  /* ===== STATE ===== */
  let parsedData   = null;
  let headers      = [];
  let columnTypes  = [];
  let totalRows    = 0;
  let fileSize     = 0;

  /* ===== ELEMENT REFS ===== */
  const dropZone    = document.getElementById('csv-drop-zone');
  const fileInput   = document.getElementById('csv-file-input');
  const progress    = document.getElementById('csv-progress');
  const progFill    = document.getElementById('prog-fill');
  const progPct     = document.getElementById('prog-pct');
  const progTitle   = document.getElementById('prog-title');
  const progMsg     = document.getElementById('prog-msg');
  const logSection  = document.getElementById('csv-log-section');
  const logEl       = document.getElementById('csv-log');
  const genBtn      = document.getElementById('btn-generate-sql');
  const statRows    = document.getElementById('stat-rows');
  const statCols    = document.getElementById('stat-cols');
  const statSize    = document.getElementById('stat-size');
  const statStmts   = document.getElementById('stat-stmts');

  /* ===== LOG ===== */
  function logMsg(text, type) {
    logSection.style.display = '';
    const now = new Date();
    const ts  = now.toTimeString().slice(0,8);
    const line = document.createElement('div');
    line.className = 'ac-log-line';
    const cls = type === 'ok' ? 'ac-log-ok' : type === 'warn' ? 'ac-log-warn' : type === 'err' ? 'ac-log-err' : '';
    line.innerHTML = '<span class="ac-log-ts">' + ts + '</span><span class="' + cls + '">' + escHtml(text) + '</span>';
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  /* ===== PROGRESS ===== */
  function setProgress(pct, msg, title) {
    progress.classList.add('visible');
    if (title) progTitle.textContent = title;
    progPct.textContent = Math.round(pct) + '%';
    progFill.style.width = pct + '%';
    if (msg) progMsg.textContent = msg;
  }

  function hideProgress() {
    progress.classList.remove('visible');
  }

  /* ===== FORMAT HELPERS ===== */
  function fmtBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/1024/1024).toFixed(1) + ' MB';
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escSql(val) {
    if (val === '' || val === null || val === undefined) return 'NULL';
    return "'" + String(val).replace(/'/g,"''") + "'";
  }

  function quote(name, dialect) {
    if (dialect === 'mysql') return '`' + name + '`';
    return '"' + name + '"';
  }

  /* ===== TYPE DETECTION ===== */
  function detectType(values) {
    const nonEmpty = values.filter(function(v){ return v !== '' && v !== null && v !== undefined; });
    if (nonEmpty.length === 0) return 'VARCHAR(255)';
    if (nonEmpty.every(function(v){ return /^-?\d+$/.test(v); })) return 'INT';
    if (nonEmpty.every(function(v){ return /^-?\d+\.?\d*$/.test(v); })) return 'DECIMAL(10,2)';
    if (nonEmpty.every(function(v){ return /^(true|false|0|1)$/i.test(v); })) return 'BOOLEAN';
    if (nonEmpty.every(function(v){ return /^\d{4}-\d{2}-\d{2}$/.test(v); })) return 'DATE';
    if (nonEmpty.every(function(v){ return /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(v); })) return 'DATETIME';
    if (nonEmpty.some(function(v){ return v.length > 255; })) return 'TEXT';
    return 'VARCHAR(255)';
  }

  /* ===== DROP ZONE ===== */
  if (dropZone) {
    dropZone.addEventListener('click', function(){ fileInput.click(); });
    dropZone.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ') fileInput.click(); });
    dropZone.addEventListener('dragover', function(e){ e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', function(){ dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', function(e){
      e.preventDefault(); dropZone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
  }
  fileInput.addEventListener('change', function(){ if (this.files[0]) loadFile(this.files[0]); });

  /* ===== LOAD FILE WITH CHUNK PROCESSING ===== */
  function loadFile(file) {
    fileSize = file.size;
    dropZone.style.display = 'none';
    logEl.innerHTML = '';
    logMsg('File loaded: ' + file.name + ' (' + fmtBytes(file.size) + ')', 'ok');
    logMsg('Detecting delimiter…', '');
    setProgress(0, 'Initialising…', file.name);
    if (statSize) statSize.textContent = fmtBytes(file.size).split(' ')[0];
    parsedData  = [];
    headers     = [];
    columnTypes = [];
    totalRows   = 0;

    if (!window.Papa) {
      window.showToast('CSV parser loading — please wait a moment', 'info');
      setTimeout(function(){ loadFile(file); }, 800);
      return;
    }

    const hasHeader = document.getElementById('csv-header').checked;
    const delimVal  = document.getElementById('csv-delimiter').value;
    let   chunkNum  = 0;
    let   detectedDelim = '';

    window.Papa.parse(file, {
      header:        hasHeader,
      skipEmptyLines: true,
      dynamicTyping: false,
      delimiter:     delimVal !== 'auto' ? delimVal : undefined,
      chunkSize:     5 * 1024 * 1024, // 5 MB

      chunk: function(results, parser) {
        chunkNum++;
        const rows = results.data;

        if (chunkNum === 1 && results.meta) {
          const delim = results.meta.delimiter || ',';
          detectedDelim = delim;
          const delimName = delim === ',' ? 'comma' : delim === ';' ? 'semicolon' : delim === '\t' ? 'tab' : delim;
          logMsg('Delimiter detected: ' + delimName, 'ok');
          if (hasHeader) {
            headers = results.meta.fields || [];
          } else {
            headers = rows[0] ? rows[0].map(function(_, i){ return 'col' + i; }) : [];
          }
          logMsg('Headers: ' + headers.length + ' columns found', 'ok');
          if (statCols) statCols.textContent = headers.length;
          renderColumnTypes();
          document.getElementById('csv-preview-section').style.display = '';
          genBtn.disabled = false;
        }

        const dataRows = hasHeader ? rows : (chunkNum === 1 ? rows.slice(1) : rows);
        dataRows.forEach(function(r){ parsedData.push(r); });
        totalRows = parsedData.length;

        if (headers.length === 0 && rows.length > 0) {
          headers = hasHeader ? (results.meta.fields || []) : rows[0].map(function(_,i){ return 'col'+i; });
        }

        // Update type detection from first chunk sample
        if (chunkNum === 1 && parsedData.length > 0) {
          columnTypes = headers.map(function(h, i) {
            const vals = parsedData.slice(0, 50).map(function(row){
              return typeof row === 'object' && !Array.isArray(row) ? row[h] : row[i];
            });
            return detectType(vals);
          });
          renderColumnTypes();
          renderPreview();
        }

        const bytesLoaded = results.meta.cursor || 0;
        const pct = fileSize > 0 ? Math.min(99, (bytesLoaded / fileSize) * 100) : (chunkNum * 20);
        setProgress(pct,
          'Chunk ' + chunkNum + ' done — ' + totalRows.toLocaleString() + ' rows loaded',
          file.name
        );
        logMsg('Chunk ' + chunkNum + ' done — ' + totalRows.toLocaleString() + ' rows total', 'warn');

        if (statRows) statRows.textContent = totalRows.toLocaleString();
      },

      complete: function() {
        setProgress(100, 'Done! ' + totalRows.toLocaleString() + ' rows ready', file.name);
        logMsg('All chunks processed — ' + totalRows.toLocaleString() + ' rows ready', 'ok');
        logMsg('Column types auto-detected — click to override', 'ok');
        document.getElementById('csv-preview-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(hideProgress, 1500);
        if (statRows) statRows.textContent = totalRows.toLocaleString();
      },

      error: function(err) {
        logMsg('Error: ' + err.message, 'err');
        window.showToast('Parse error: ' + err.message, 'error');
        hideProgress();
      }
    });
  }

  /* ===== AUTO-PARSE ON PASTE ===== */
  var autoParseDeferTimer;
  document.getElementById('csv-input').addEventListener('input', function() {
    clearTimeout(autoParseDeferTimer);
    const raw = this.value.trim();
    // Only auto-parse if there's meaningful content (>50 chars) and at least one newline
    if (raw.length > 50 && raw.indexOf('\n') !== -1) {
      autoParseDeferTimer = setTimeout(function() {
        document.getElementById('btn-parse-csv').click();
      }, 600);
    }
  });

  /* ===== PARSE PASTED CSV ===== */
  document.getElementById('btn-parse-csv').addEventListener('click', function() {
    const raw = document.getElementById('csv-input').value.trim();
    if (!raw) { window.showToast('Paste some CSV data first', 'info'); return; }
    if (!window.Papa) { window.showToast('CSV parser loading — please wait', 'info'); return; }

    logEl.innerHTML = '';
    logMsg('Parsing pasted CSV…', '');
    logSection.style.display = '';

    const hasHeader = document.getElementById('csv-header').checked;
    const delimVal  = document.getElementById('csv-delimiter').value;
    const opts = { header: hasHeader, skipEmptyLines: true };
    if (delimVal !== 'auto') opts.delimiter = delimVal;

    const result = window.Papa.parse(raw, opts);
    parsedData = result.data;
    totalRows  = parsedData.length;

    if (parsedData.length === 0) { window.showToast('No data found', 'error'); return; }

    if (hasHeader) {
      headers = result.meta.fields || [];
    } else {
      headers = parsedData[0] ? parsedData[0].map(function(_,i){ return 'col'+i; }) : [];
    }

    const delimName = (result.meta.delimiter || ',') === ',' ? 'comma' : result.meta.delimiter;
    logMsg('Delimiter: ' + delimName, 'ok');
    logMsg('Columns: ' + headers.length + ', Rows: ' + totalRows.toLocaleString(), 'ok');

    columnTypes = headers.map(function(h, i) {
      const vals = parsedData.slice(0, 50).map(function(row){
        return typeof row === 'object' && !Array.isArray(row) ? row[h] : row[i];
      });
      return detectType(vals);
    });

    renderPreview();
    renderColumnTypes();
    document.getElementById('csv-preview-section').style.display = '';
    genBtn.disabled = false;

    if (statRows) statRows.textContent = totalRows.toLocaleString();
    if (statCols) statCols.textContent = headers.length;
    if (statSize) statSize.textContent = fmtBytes(new TextEncoder().encode(raw).length).split(' ')[0];

    document.getElementById('csv-stats').textContent = headers.length + ' columns · ' + totalRows.toLocaleString() + ' rows';
    logMsg('Ready — configure column types and click Generate SQL', 'ok');

    document.getElementById('csv-preview-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ===== CLEAR CSV ===== */
  document.getElementById('btn-clear-csv').addEventListener('click', function() {
    document.getElementById('csv-input').value = '';
    parsedData = null; headers = []; columnTypes = []; totalRows = 0;
    document.getElementById('csv-preview-section').style.display = 'none';
    document.getElementById('sql-output-section').style.display  = 'none';
    logSection.style.display = 'none';
    genBtn.disabled = true;
    if (statRows)  statRows.textContent  = '0';
    if (statCols)  statCols.textContent  = '0';
    if (statStmts) statStmts.textContent = '0';
  });

  /* ===== PREVIEW TABLE ===== */
  function renderPreview() {
    const container = document.getElementById('csv-preview-table');
    const rows = parsedData.slice(0, 5);
    let html = '<table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:11px"><thead><tr style="background:var(--color-surface-2)">';
    headers.forEach(function(h){ html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--color-border);color:var(--color-text-2);font-weight:600;white-space:nowrap">' + escHtml(h) + '</th>'; });
    html += '</tr></thead><tbody>';
    rows.forEach(function(row){
      html += '<tr>';
      headers.forEach(function(h, i){
        const val = typeof row === 'object' && !Array.isArray(row) ? row[h] : row[i];
        html += '<td style="padding:5px 10px;border-bottom:1px solid var(--color-border)">' + escHtml(String(val || '')) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    document.getElementById('csv-stats').textContent = headers.length + ' columns · ' + totalRows.toLocaleString() + ' rows';
  }

  /* ===== COLUMN TYPE GRID ===== */
  function renderColumnTypes() {
    const container = document.getElementById('column-types');
    const sqlTypes = ['VARCHAR(255)','INT','BIGINT','DECIMAL(10,2)','BOOLEAN','DATE','DATETIME','TEXT','FLOAT','AUTO_INCREMENT'];
    container.innerHTML = '';
    headers.forEach(function(h, i) {
      const div = document.createElement('div');
      div.className = 'column-type-item';
      const label = document.createElement('span');
      label.className = 'column-type-label';
      label.title = h;
      label.textContent = h;
      const sel = document.createElement('select');
      sel.style.cssText = 'width:100%;font-size:11px;border:1px solid var(--color-border);border-radius:4px;padding:3px 5px;background:var(--color-surface);color:var(--color-text);outline:none';
      sqlTypes.forEach(function(t){
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        if (t === (columnTypes[i] || 'VARCHAR(255)')) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', function(){ columnTypes[i] = this.value; });
      div.appendChild(label);
      div.appendChild(sel);
      container.appendChild(div);
    });
  }

  document.getElementById('btn-auto-detect').addEventListener('click', function(){
    const selects = document.getElementById('column-types').querySelectorAll('select');
    selects.forEach(function(sel, i){ sel.value = columnTypes[i] || 'VARCHAR(255)'; });
  });
  document.getElementById('btn-reset-types').addEventListener('click', function(){
    columnTypes = headers.map(function(){ return 'VARCHAR(255)'; });
    renderColumnTypes();
  });

  /* ===== TOGGLE HELPER ===== */
  function togVal(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    return !el.classList.contains('off');
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
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
    });
  }
  initToggle('tog-create', true);
  initToggle('tog-insert', true);
  initToggle('tog-drop', false);
  initToggle('tog-batch', false);

  /* ===== BUILD SQL ===== */
  function buildSQL() {
    const tableName = document.getElementById('table-name').value || 'my_table';
    const dialect   = document.getElementById('sql-dialect').value;
    const genCreate = togVal('tog-create');
    const genInsert = togVal('tog-insert');
    const genDrop   = togVal('tog-drop');
    const genBatch  = togVal('tog-batch');
    const batchSize = 500;
    let sql = '';

    if (genDrop) sql += 'DROP TABLE IF EXISTS ' + quote(tableName, dialect) + ';\n\n';
    if (genCreate) {
      sql += 'CREATE TABLE ' + quote(tableName, dialect) + ' (\n';
      const colDefs = headers.map(function(h, i) {
        let type = columnTypes[i] || 'VARCHAR(255)';
        if (type === 'AUTO_INCREMENT') {
          if (dialect === 'mysql')      return '  ' + quote(h, dialect) + ' INT AUTO_INCREMENT PRIMARY KEY';
          if (dialect === 'postgresql') return '  ' + quote(h, dialect) + ' SERIAL PRIMARY KEY';
          return '  ' + quote(h, dialect) + ' INTEGER PRIMARY KEY AUTOINCREMENT';
        }
        return '  ' + quote(h, dialect) + ' ' + type;
      });
      sql += colDefs.join(',\n') + '\n);\n\n';
    }
    if (genInsert && parsedData && parsedData.length > 0) {
      const colNames = headers.map(function(h){ return quote(h, dialect); }).join(', ');
      if (genBatch) {
        for (let s = 0; s < parsedData.length; s += batchSize) {
          const chunk = parsedData.slice(s, s + batchSize);
          sql += 'INSERT INTO ' + quote(tableName, dialect) + ' (' + colNames + ') VALUES\n';
          const valRows = chunk.map(function(row){
            const vals = headers.map(function(h, i){ return escSql(typeof row === 'object' && !Array.isArray(row) ? row[h] : row[i]); });
            return '  (' + vals.join(', ') + ')';
          });
          sql += valRows.join(',\n') + ';\n';
        }
      } else {
        parsedData.forEach(function(row){
          const vals = headers.map(function(h, i){ return escSql(typeof row === 'object' && !Array.isArray(row) ? row[h] : row[i]); });
          sql += 'INSERT INTO ' + quote(tableName, dialect) + ' (' + colNames + ') VALUES (' + vals.join(', ') + ');\n';
        });
      }
    }
    return sql;
  }

  /* ===== GENERATE SQL ===== */
  genBtn.addEventListener('click', async function() {
    if (!parsedData) return;
    genBtn.disabled = true;
    genBtn.innerHTML = '<span class="spinner"></span> Generating…';
    await new Promise(function(r){ setTimeout(r, 0); });
    const sql = buildSQL();
    const code = document.getElementById('sql-output-code');
    code.textContent = sql;
    if (window.hljs) { code.className = 'language-sql'; window.hljs.highlightElement(code); }
    document.getElementById('sql-output-section').style.display = '';
    const stmtCount = (sql.match(/INSERT INTO/g) || []).length;
    document.getElementById('sql-stats').textContent = parsedData.length.toLocaleString() + ' rows · ' + stmtCount.toLocaleString() + ' INSERT statements · ' + fmtBytes(new TextEncoder().encode(sql).length);
    if (statStmts) statStmts.textContent = stmtCount.toLocaleString();
    genBtn.disabled = false;
    genBtn.textContent = 'Generate SQL';
    window.showToast('SQL generated — ' + stmtCount.toLocaleString() + ' INSERT statements', 'success');
    document.getElementById('sql-output-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('btn-copy-sql').addEventListener('click', function(){
    window.copyToClipboard(document.getElementById('sql-output-code').textContent);
  });
  document.getElementById('btn-download-sql').addEventListener('click', function(){
    const content = document.getElementById('sql-output-code').textContent;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'data.sql'; a.click();
    URL.revokeObjectURL(url);
    window.showToast('Downloaded data.sql', 'success');
  });
});
