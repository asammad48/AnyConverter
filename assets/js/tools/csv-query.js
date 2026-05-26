/* CSV Query Tool */
document.addEventListener('DOMContentLoaded', function () {
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

  let db = null;
  let currentResults = [];
  let currentColumns = [];
  let currentPage = 1;
  let PAGE_SIZE = 50;
  let sortCol = -1;
  let sortAsc = true;
  let queryHistory = [];

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

  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); dropZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });

  function loadFile(file) {
    if (!window.Papa) { window.showToast('CSV parser loading, please wait', 'info'); return; }
    const reader = new FileReader();
    reader.onload = async function (e) {
      const result = window.Papa.parse(e.target.result.trim(), { header: true, skipEmptyLines: true });
      if (result.data.length === 0) { window.showToast('No data found in CSV', 'error'); return; }

      const headers = result.meta.fields || [];
      const rows = result.data;

      try {
        const SQL = await getSql();
        if (db) { db.close(); db = null; }
        db = new SQL.Database();

        const safeCols = headers.map(function (h) { return '"' + h.replace(/"/g, '""') + '"'; });
        db.run('CREATE TABLE data (' + safeCols.map(function (c) { return c + ' TEXT'; }).join(', ') + ')');

        const stmt = db.prepare('INSERT INTO data VALUES (' + headers.map(function () { return '?'; }).join(', ') + ')');
        rows.forEach(function (row) {
          stmt.run(headers.map(function (h) { return row[h] !== undefined ? String(row[h]) : null; }));
        });
        stmt.free();

        fileInfoBar.textContent = 'Loaded: ' + file.name + ' — ' + rows.length.toLocaleString() + ' rows, ' + headers.length + ' columns';
        querySection.style.display = 'block';
        resultsSection.style.display = 'none';
        queryInput.value = 'SELECT * FROM data LIMIT 10';
        const sr = document.getElementById('stat-csv-rows');
        const sc = document.getElementById('stat-csv-cols');
        if (sr) sr.textContent = rows.length.toLocaleString();
        if (sc) sc.textContent = headers.length;
      } catch (err) {
        window.showToast('Error loading CSV: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  }

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

  document.getElementById('btn-format-sql').addEventListener('click', function () {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AND', 'OR', 'UNION'];
    let sql = queryInput.value;
    keywords.forEach(function (kw) {
      sql = sql.replace(new RegExp('\\b' + kw + '\\b', 'gi'), '\n' + kw);
    });
    queryInput.value = sql.replace(/^\n+/, '').trim();
  });

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
      resultsTable.innerHTML = '<p style="padding:16px;color:#5C5C7A">No results.</p>';
      resultStats.textContent = '0 rows';
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

    resultStats.textContent = total.toLocaleString() + ' row' + (total !== 1 ? 's' : '') +
      (total > PAGE_SIZE ? ' — page ' + currentPage + ' of ' + totalPages : '');
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
    if (btnFsResults) { btnFsResults.textContent = '✕ Exit'; btnFsResults.title = 'Exit fullscreen'; }
    if (csvFsOverlay) csvFsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function exitCsvFs() {
    if (!resultsFsWrap) return;
    csvFsActive = false;
    resultsFsWrap.classList.remove('is-fullscreen');
    if (btnFsResults) { btnFsResults.textContent = '⛶ Fullscreen'; btnFsResults.title = 'Fullscreen table'; }
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
