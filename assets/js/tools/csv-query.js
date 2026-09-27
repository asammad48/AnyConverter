/* CSV Query Tool */
document.addEventListener('DOMContentLoaded', function () {
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  const dropZone = document.getElementById('query-drop-zone');
  const fileInput = document.getElementById('query-file-input');
  const querySection = document.getElementById('query-section');
  const fileInfoBar = document.getElementById('query-file-info');
  const queryInput = document.getElementById('sql-query');
  const resultsSection = document.getElementById('results-section');
  const resultsTable = document.getElementById('results-table');
  const resultStats = document.getElementById('result-stats');
  const historyList = document.getElementById('query-history');
  const paginationBar = document.getElementById('pagination-bar');
  const pasteInput = document.getElementById('query-csv-input');
  const profileBox = document.getElementById('query-profile');
  const SALES_SAMPLE = 'order_id,region,product,qty,amount,order_date\n1001,North,Desk lamp,2,59.90,2026-08-01\n1002,South,Office chair,1,249.00,2026-08-01\n1003,East,Desk lamp,4,119.80,2026-08-02\n1004,North,Monitor arm,1,89.50,2026-08-03\n1005,West,Office chair,2,498.00,2026-08-03\n1006,South,Cable tray,6,71.40,2026-08-04\n1007,East,Monitor arm,2,179.00,2026-08-05\n1008,North,Office chair,1,249.00,2026-08-06\n1009,West,Desk lamp,3,89.85,2026-08-06\n1010,South,Monitor arm,1,89.50,2026-08-07\n1011,North,Cable tray,10,119.00,2026-08-08\n1012,East,Office chair,1,249.00,2026-08-09';
  const USERS_SAMPLE = 'id,name,email,signup,active\n1,Ana Silva,ana@example.com,2026-01-04,true\n2,Jonas Berg,jonas@example.com,2026-01-19,true\n3,Mei Chen,,2026-02-02,false\n4,Oskar Lund,oskar@example.com,n/a,true\n5,Priya Nair,priya@example.com,2026-03-11,true';

  let db = null;
  let currentResults = [];
  let currentColumns = [];
  let currentPage = 1;
  let PAGE_SIZE = 50;
  let sortCol = -1;
  let sortAsc = true;
  let queryHistory = [];
  let loadedCsvText = '';
  let loadedName = 'data.csv';
  let loadedHeaders = [];
  let loadedRows = [];

  let sqlPromise = null;
  function getSql() {
    if (!sqlPromise) {
      sqlPromise = new Promise(function (resolve, reject) {
        function tryInit() {
          if (window.initSqlJs) {
            resolve(window.initSqlJs({
              locateFile: function (f) {
                return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/' + f;
              }
            }));
          } else {
            setTimeout(tryInit, 100);
          }
        }
        tryInit();
        setTimeout(function () { reject(new Error('SQL.js failed to load')); }, 20000);
      });
    }
    return sqlPromise;
  }

  document.querySelectorAll('[data-query-tab]').forEach(function(tab) {
    tab.addEventListener('click', function() {
      const key = tab.dataset.queryTab;
      document.querySelectorAll('[data-query-tab]').forEach(function(t) { t.classList.toggle('active', t === tab); });
      ['paste', 'upload', 'sample'].forEach(function(name) {
        const panel = document.getElementById('query-tab-' + name);
        if (panel) panel.style.display = key === name ? '' : 'none';
      });
    });
  });

  if (dropZone) {
    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
    dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault(); dropZone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
  }
  if (fileInput) fileInput.addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });

  function loadText(text, name, afterSql) {
    if (!window.Papa) { window.showToast('CSV parser loading, please wait', 'info'); return; }
    const result = window.Papa.parse(String(text || '').trim(), { header: true, skipEmptyLines: true });
    if (result.data.length === 0) { window.showToast('No data found in CSV', 'error'); return; }
    loadedCsvText = String(text || '').trim();
    loadedName = name || 'data.csv';
    buildDatabase(result, loadedName, afterSql);
  }

  function loadFile(file) {
    if (!window.Papa) { window.showToast('CSV parser loading, please wait', 'info'); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
      const result = window.Papa.parse(e.target.result.trim(), { header: true, skipEmptyLines: true });
      if (result.data.length === 0) { window.showToast('No data found in CSV', 'error'); return; }
      loadedCsvText = e.target.result.trim();
      loadedName = file.name;
      buildDatabase(result, file.name);
    };
    reader.readAsText(file);
  }

  async function buildDatabase(result, name, afterSql) {
    const headers = result.meta.fields || [];
    const rows = result.data;
    loadedHeaders = headers;
    loadedRows = rows;

    try {
      const SQL = await getSql();
      if (db) { db.close(); db = null; }
      db = new SQL.Database();

      const safeCols = headers.map(function (h) { return '"' + h.replace(/"/g, '""') + '"'; });
      db.run('CREATE TABLE data (' + safeCols.map(function (c) { return c + ' TEXT'; }).join(', ') + ')');

      const stmt = db.prepare('INSERT INTO data VALUES (' + headers.map(function () { return '?'; }).join(', ') + ')');
      rows.forEach(function (row) {
        stmt.run(headers.map(function (h) { return row[h] !== undefined && row[h] !== '' ? String(row[h]) : null; }));
      });
      stmt.free();

      fileInfoBar.textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + name + ' — ' + rows.length.toLocaleString() + t({ en: ' rows, ', es: ' filas, ', da: ' rækker, ' }) + headers.length + t({ en: ' columns', es: ' columnas', da: ' kolonner' });
      querySection.style.display = 'block';
      resultsSection.style.display = 'none';
      queryInput.value = afterSql || 'SELECT * FROM data LIMIT 10';
      const sr = document.getElementById('stat-csv-rows');
      const sc = document.getElementById('stat-csv-cols');
      if (sr) sr.textContent = rows.length.toLocaleString();
      if (sc) sc.textContent = headers.length;
      renderProfile();
      if (afterSql) runQuery();
    } catch (err) {
      window.showToast('Error loading CSV: ' + err.message, 'error');
    }
  }

  function renderProfile() {
    if (!profileBox || !loadedHeaders.length) return;
    profileBox.innerHTML = loadedHeaders.map(function(h) {
      const values = loadedRows.map(function(r) { return r[h]; });
      const empty = values.filter(function(v) { return v === undefined || v === null || String(v).trim() === ''; }).length;
      const distinct = new Set(values.filter(function(v) { return v !== undefined && v !== null && String(v).trim() !== ''; }).map(String)).size;
      return '<button class="ac-profile-row" type="button" data-col="' + escHtml(h) + '"><span>' + escHtml(h) + '</span><strong>' + distinct + t({ en: ' distinct · ', es: ' distintos · ', da: ' unikke · ' }) + empty + t({ en: ' empty', es: ' vacíos', da: ' tomme' }) + '</strong></button>';
    }).join('');
    profileBox.querySelectorAll('[data-col]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const col = btn.dataset.col.replace(/"/g, '""');
        queryInput.value = 'SELECT "' + col + '", COUNT(*) AS row_count FROM data GROUP BY "' + col + '" ORDER BY row_count DESC LIMIT 20';
        runQuery();
      });
    });
  }

  const pastedBtn = document.getElementById('btn-load-pasted-csv');
  if (pastedBtn) pastedBtn.addEventListener('click', function() {
    loadText(pasteInput.value, 'pasted.csv');
  });
  const salesBtn = document.getElementById('btn-query-sample-sales');
  if (salesBtn) salesBtn.addEventListener('click', function() {
    if (pasteInput) pasteInput.value = SALES_SAMPLE;
    loadText(SALES_SAMPLE, 'sales.csv', 'SELECT region, SUM(CAST(amount AS REAL)) AS sum_amount FROM data GROUP BY region ORDER BY sum_amount DESC');
  });
  const usersBtn = document.getElementById('btn-query-sample-users');
  if (usersBtn) usersBtn.addEventListener('click', function() {
    if (pasteInput) pasteInput.value = USERS_SAMPLE;
    loadText(USERS_SAMPLE, 'users.csv', 'SELECT * FROM data WHERE email IS NULL OR signup = \'n/a\'');
  });

  let seededFromHandoff = false;
  try {
    if (/from=csv-to-sql/.test(window.location.search)) {
      const handoff = JSON.parse(localStorage.getItem('ac:csv-handoff') || 'null');
      if (handoff && handoff.text) {
        if (pasteInput) pasteInput.value = handoff.text;
        loadText(handoff.text, handoff.name || 'handoff.csv');
        seededFromHandoff = true;
      }
    }
  } catch (e) {}

  // Open on a working query instead of an empty card with zero-value tiles.
  if (!seededFromHandoff && salesBtn) salesBtn.click();

  document.getElementById('btn-run-query').addEventListener('click', runQuery);
  queryInput.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runQuery();
  });

  function runQuery() {
    if (!db) return;
    const sql = queryInput.value.trim();
    if (!sql) return;

    const t0 = performance.now();
    try {
      const results = db.exec(sql);
      const elapsed = Math.round(performance.now() - t0);
      if (!results.length) {
        window.showToast('Query executed. No rows returned.', 'info');
        currentResults = [];
        currentColumns = [];
        renderResults();
        resultsSection.style.display = 'block';
        updateQueryStats(0, elapsed);
        return;
      }
      currentColumns = results[0].columns;
      currentResults = results[0].values;
      currentPage = 1;
      sortCol = -1;
      sortAsc = true;
      addToHistory(sql);
      renderResults();
      resultsSection.style.display = 'block';
      updateQueryStats(currentResults.length, elapsed);
    } catch (err) {
      window.showToast('SQL Error: ' + err.message, 'error');
    }
  }

  function updateQueryStats(resultRows, ms) {
    const rr = document.getElementById('stat-result-rows');
    const qt = document.getElementById('stat-query-time');
    if (rr) rr.textContent = resultRows.toLocaleString();
    if (qt) qt.textContent = ms + ' ms';
  }

  function clearAll() {
    if (typeof exitCsvFs === 'function') exitCsvFs();
    if (db) { db.close(); db = null; }
    currentResults = [];
    currentColumns = [];
    currentPage = 1;
    sortCol = -1;
    sortAsc = true;
    queryHistory = [];
    loadedCsvText = '';
    loadedName = 'data.csv';
    loadedHeaders = [];
    loadedRows = [];

    if (pasteInput) pasteInput.value = '';
    if (fileInput) fileInput.value = '';
    if (queryInput) queryInput.value = '';
    if (fileInfoBar) fileInfoBar.textContent = '';
    if (resultsTable) resultsTable.innerHTML = '';
    if (resultStats) resultStats.textContent = '';
    if (paginationBar) paginationBar.innerHTML = '';
    if (historyList) historyList.innerHTML = '';
    if (profileBox) profileBox.textContent = t({
      en: 'Load CSV data to inspect columns.',
      es: 'Carga datos CSV para inspeccionar las columnas.',
      da: 'Indlæs CSV-data for at se kolonnerne.'
    });
    if (querySection) querySection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    const historySection = document.getElementById('query-history-section');
    if (historySection) historySection.style.display = 'none';

    const sr = document.getElementById('stat-csv-rows');
    const sc = document.getElementById('stat-csv-cols');
    const rr = document.getElementById('stat-result-rows');
    const qt = document.getElementById('stat-query-time');
    if (sr) sr.textContent = '0';
    if (sc) sc.textContent = '0';
    if (rr) rr.textContent = '0';
    if (qt) qt.textContent = '—';

    try { localStorage.removeItem('ac:csv-handoff'); } catch (e) {}
    window.showToast(t({
      en: 'CSV Query cleared',
      es: 'Consulta CSV borrada',
      da: 'CSV-forespørgsel ryddet'
    }), 'success');
  }

  document.getElementById('btn-format-sql').addEventListener('click', function () {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AND', 'OR', 'UNION'];
    let sql = queryInput.value;
    keywords.forEach(function (kw) {
      sql = sql.replace(new RegExp('\\b' + kw + '\\b', 'gi'), '\n' + kw);
    });
    queryInput.value = sql.replace(/^\n+/, '').trim();
  });

  const clearAllBtn = document.getElementById('btn-clear-query-all');
  if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);

  function addToHistory(sql) {
    queryHistory = queryHistory.filter(function (q) { return q !== sql; });
    queryHistory.unshift(sql);
    if (queryHistory.length > 5) queryHistory.pop();
    renderHistory();
  }

  function renderHistory() {
    historyList.innerHTML = '';
    queryHistory.forEach(function (q) {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.title = q;
      item.textContent = q.length > 70 ? q.slice(0, 67) + '...' : q;
      item.addEventListener('click', function () { queryInput.value = q; runQuery(); });
      historyList.appendChild(item);
    });
    document.getElementById('query-history-section').style.display = queryHistory.length ? 'block' : 'none';
  }

  function getSortedResults() {
    if (sortCol < 0) return currentResults;
    return currentResults.slice().sort(function (a, b) {
      const av = a[sortCol], bv = b[sortCol];
      const an = parseFloat(av), bn = parseFloat(bv);
      const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : String(av || '').localeCompare(String(bv || ''));
      return sortAsc ? cmp : -cmp;
    });
  }

  function renderResults() {
    const sorted = getSortedResults();
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);
    const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    if (!currentColumns.length) {
      resultsTable.innerHTML = '<div class="ac-empty">' + t({ en: 'No results.', es: 'Sin resultados.', da: 'Ingen resultater.' }) + '</div>';
      resultStats.textContent = '0 ' + t({ en: 'rows', es: 'filas', da: 'rækker' });
      paginationBar.innerHTML = '';
      return;
    }

    let html = '<table><thead><tr>';
    currentColumns.forEach(function (col, i) {
      const arrow = sortCol === i ? (sortAsc ? ' &#9650;' : ' &#9660;') : '';
      html += '<th data-col="' + i + '" style="cursor:pointer;user-select:none">' + escHtml(col) + arrow + '</th>';
    });
    html += '</tr></thead><tbody>';
    pageRows.forEach(function (row) {
      html += '<tr>';
      row.forEach(function (cell) {
        html += '<td>' + escHtml(cell === null ? 'NULL' : String(cell)) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    resultsTable.innerHTML = html;

    resultsTable.querySelectorAll('th[data-col]').forEach(function (th) {
      th.addEventListener('click', function () {
        const col = parseInt(this.dataset.col);
        if (sortCol === col) { sortAsc = !sortAsc; } else { sortCol = col; sortAsc = true; }
        renderResults();
      });
    });

    resultStats.textContent = total.toLocaleString() + ' ' +
      (total === 1 ? t({ en: 'row', es: 'fila', da: 'række' }) : t({ en: 'rows', es: 'filas', da: 'rækker' })) +
      (total > PAGE_SIZE
        ? t({ en: ' — page ', es: ' — página ', da: ' — side ' }) + currentPage + t({ en: ' of ', es: ' de ', da: ' af ' }) + totalPages
        : '');
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) { paginationBar.innerHTML = ''; return; }
    let html = '';
    if (currentPage > 1) html += '<button class="btn btn-sm" data-page="' + (currentPage - 1) + '">← Prev</button>';
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let p = start; p <= end; p++) {
      html += '<button class="btn btn-sm' + (p === currentPage ? ' btn-primary' : '') + '" data-page="' + p + '">' + p + '</button>';
    }
    if (currentPage < totalPages) html += '<button class="btn btn-sm" data-page="' + (currentPage + 1) + '">Next →</button>';
    paginationBar.innerHTML = html;
    paginationBar.querySelectorAll('button[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () { currentPage = parseInt(this.dataset.page); renderResults(); });
    });
  }

  document.getElementById('btn-export-csv').addEventListener('click', function () {
    if (!currentColumns.length) return;
    const sorted = getSortedResults();
    let csv = currentColumns.map(function (c) { return '"' + c.replace(/"/g, '""') + '"'; }).join(',') + '\n';
    sorted.forEach(function (row) {
      csv += row.map(function (c) { return '"' + String(c === null ? '' : c).replace(/"/g, '""') + '"'; }).join(',') + '\n';
    });
    download(csv, 'results.csv', 'text/csv');
  });

  document.getElementById('btn-export-json').addEventListener('click', function () {
    if (!currentColumns.length) return;
    const sorted = getSortedResults();
    const data = sorted.map(function (row) {
      const obj = {};
      currentColumns.forEach(function (col, i) { obj[col] = row[i]; });
      return obj;
    });
    download(JSON.stringify(data, null, 2), 'results.json', 'application/json');
  });

  const sendToSql = document.getElementById('btn-send-query-sql');
  if (sendToSql) sendToSql.addEventListener('click', function() {
    if (!loadedCsvText) { window.showToast('Load CSV data first', 'info'); return; }
    try {
      localStorage.setItem('ac:csv-handoff', JSON.stringify({ text: loadedCsvText, name: loadedName }));
    } catch (e) {}
    window.location.href = '/csv-to-sql/?from=csv-query';
  });

  function download(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Quick SQL buttons in sidebar
  document.querySelectorAll('.quick-pat-btn[data-sql]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      queryInput.value = btn.dataset.sql;
      if (db) runQuery();
    });
  });

  // Rows per page select
  const rowsSelect = document.getElementById('opt-rows-per-page');
  if (rowsSelect) {
    rowsSelect.addEventListener('change', function() {
      PAGE_SIZE = parseInt(this.value);
      currentPage = 1;
      renderResults();
    });
  }

  /* ===== TABLE FONT SIZE ===== */
  const tblFontSizes = [11, 13, 15, 17];
  let tblFontIdx = 1;
  function applyTableFontSize(px) {
    const preview = document.getElementById('results-table');
    if (preview) { preview.style.fontSize = px + 'px'; }
  }
  const btnTblFontDown = document.getElementById('btn-tbl-font-down');
  const btnTblFontUp   = document.getElementById('btn-tbl-font-up');
  if (btnTblFontDown) {
    btnTblFontDown.addEventListener('click', function() {
      if (tblFontIdx > 0) { tblFontIdx--; applyTableFontSize(tblFontSizes[tblFontIdx]); }
    });
  }
  if (btnTblFontUp) {
    btnTblFontUp.addEventListener('click', function() {
      if (tblFontIdx < tblFontSizes.length - 1) { tblFontIdx++; applyTableFontSize(tblFontSizes[tblFontIdx]); }
    });
  }

  /* ===== RESULTS FULLSCREEN ===== */
  const csvFsOverlay = document.getElementById('csv-fs-overlay');
  const resultsFsWrap = document.getElementById('results-fs-wrap');
  const btnFsResults  = document.getElementById('btn-fs-results');
  let csvFsActive = false;

  function enterCsvFs() {
    if (!resultsFsWrap) return;
    csvFsActive = true;
    resultsFsWrap.classList.add('is-fullscreen');
    if (btnFsResults) { btnFsResults.textContent = '✕ ' + t({ en: 'Exit', es: 'Salir', da: 'Afslut' }); btnFsResults.title = t({ en: 'Exit fullscreen', es: 'Salir de pantalla completa', da: 'Afslut fuld skærm' }); }
    if (csvFsOverlay) csvFsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function exitCsvFs() {
    if (!resultsFsWrap) return;
    csvFsActive = false;
    resultsFsWrap.classList.remove('is-fullscreen');
    if (btnFsResults) { btnFsResults.textContent = '⛶ ' + t({ en: 'Fullscreen', es: 'Pantalla completa', da: 'Fuld skærm' }); btnFsResults.title = t({ en: 'Fullscreen table', es: 'Tabla en pantalla completa', da: 'Tabel i fuld skærm' }); }
    if (csvFsOverlay) csvFsOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnFsResults) {
    btnFsResults.addEventListener('click', function() {
      if (csvFsActive) exitCsvFs(); else enterCsvFs();
    });
  }
  if (csvFsOverlay) csvFsOverlay.addEventListener('click', exitCsvFs);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && csvFsActive) exitCsvFs();
  });
});
