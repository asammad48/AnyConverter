/* Regex Tester & Log Extractor */
document.addEventListener('DOMContentLoaded', function () {

  const patternInput  = document.getElementById('regex-pattern');
  const logTextarea   = document.getElementById('log-textarea');
  const logView       = document.getElementById('log-view');
  const matchView     = document.getElementById('match-view');
  const flagsDisplay  = document.getElementById('flags-display');
  const validBadge    = document.getElementById('regex-valid-badge');
  const logLinesInfo  = document.getElementById('log-lines-info');
  const logMatchInfo  = document.getElementById('log-matches-info');
  const matchCountOk  = document.getElementById('match-count-ok');
  const matchCountErr = document.getElementById('match-count-err');
  const matchGroupsInfo = document.getElementById('match-groups-info');

  const statMatches = document.getElementById('stat-matches');
  const statGroups  = document.getElementById('stat-groups');
  const statLines   = document.getElementById('stat-lines');
  const statBytes   = document.getElementById('stat-bytes');

  let debounceTimer;
  let lastMatches = [];
  let lastPattern = '';
  let lastFlags   = 'gm';

  /* ===== ESCAPE HTML ===== */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ===== FLAGS ===== */
  const flagBtns = document.querySelectorAll('.flag-btn[data-flag]');
  flagBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('active');
      updateFlagsDisplay();
      runTest();
    });
  });

  function getFlags() {
    let f = '';
    flagBtns.forEach(function(b){ if (b.classList.contains('active')) f += b.dataset.flag; });
    return f;
  }

  function updateFlagsDisplay() {
    const f = getFlags();
    lastFlags = f;
    if (flagsDisplay) flagsDisplay.textContent = '/' + (f || '—');
  }

  /* ===== TOGGLES ===== */
  function initToggle(id, initialOn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('off', !initialOn);
    el.setAttribute('aria-checked', initialOn);
    function activate() {
      const on = !el.classList.contains('off');
      el.classList.toggle('off', on);
      el.setAttribute('aria-checked', !on);
    }
    el.addEventListener('click', activate);
    el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();} });
  }
  initToggle('tog-linenums', true);
  initToggle('tog-groups', false);

  /* ===== QUICK PATTERNS ===== */
  document.querySelectorAll('.quick-pat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      patternInput.value = btn.dataset.pattern;
      patternInput.focus();
      runTest();
    });
  });

  /* ===== FILE UPLOAD ===== */
  const logFileInput = document.getElementById('log-file-input');
  if (logFileInput) {
    logFileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        window.showToast('Large file detected (' + (file.size/1024/1024).toFixed(1) + ' MB) — processing…', 'info');
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        logTextarea.value = e.target.result;
        runTest();
        window.showToast('Loaded ' + file.name, 'success');
      };
      reader.readAsText(file);
      logFileInput.value = '';
    });
  }

  document.getElementById('btn-clear-log').addEventListener('click', function() {
    logTextarea.value = '';
    runTest();
  });

  /* ===== CORE: RUN TEST ===== */
  function runTest() {
    const pattern = patternInput.value;
    const text    = logTextarea.value;
    const lines   = text ? text.split('\n') : [];

    // Update line stats
    if (statLines) statLines.textContent = lines.length;
    if (statBytes) statBytes.textContent = text ? text.length : 0;
    if (logLinesInfo) logLinesInfo.textContent = lines.length + ' line' + (lines.length !== 1 ? 's' : '');

    // Reset outputs
    lastMatches = [];
    lastPattern = pattern;

    if (!pattern) {
      validBadge.style.display = 'none';
      renderLogView(text, null);
      matchView.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Matches will appear here…</span>';
      setMatchStatus(null, '', '');
      updateMatchStats(0, 0);
      return;
    }

    let regex;
    try {
      const flags = getFlags() || 'g';
      regex = new RegExp(pattern, flags);
      validBadge.className = 'regex-valid-badge ok';
      validBadge.textContent = 'Valid';
      validBadge.style.display = '';
    } catch(e) {
      validBadge.className = 'regex-valid-badge err';
      validBadge.textContent = 'Error';
      validBadge.style.display = '';
      matchView.innerHTML = '<div style="padding:12px;color:#FCA5A5;font-size:12px">✕ ' + escHtml(e.message) + '</div>';
      setMatchStatus('err', '✕ ' + e.message, '');
      renderLogView(text, null);
      return;
    }

    if (!text) {
      renderLogView('', regex);
      matchView.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Paste log text to see matches…</span>';
      setMatchStatus(null, '', '');
      return;
    }

    // Collect all matches
    const allMatches = [];
    let m;
    const re2 = new RegExp(pattern, getFlags().includes('g') ? getFlags() : getFlags() + 'g');
    re2.lastIndex = 0;
    let safeCount = 0;
    while ((m = re2.exec(text)) !== null && safeCount < 5000) {
      allMatches.push({
        index:  m.index,
        end:    m.index + m[0].length,
        full:   m[0],
        groups: m.slice(1),
        named:  m.groups || {}
      });
      safeCount++;
      if (!re2.global) break;
      if (m[0].length === 0) { re2.lastIndex++; }
    }

    lastMatches = allMatches;
    const groupCount = allMatches.length > 0 ? allMatches[0].groups.length : 0;

    renderLogView(text, allMatches);
    renderMatchView(allMatches);
    updateMatchStats(allMatches.length, groupCount);

    if (allMatches.length === 0) {
      setMatchStatus('err', 'No matches found', '');
    } else {
      setMatchStatus('ok',
        '✓ ' + allMatches.length + ' match' + (allMatches.length !== 1 ? 'es' : ''),
        groupCount > 0 ? groupCount + ' group' + (groupCount !== 1 ? 's' : '') + ' captured' : ''
      );
    }

    if (logMatchInfo) {
      logMatchInfo.textContent = allMatches.length > 0
        ? ' · ' + allMatches.length + ' match' + (allMatches.length !== 1 ? 'es' : '')
        : '';
    }
  }

  /* ===== RENDER LOG VIEW (highlighted) ===== */
  function renderLogView(text, matches) {
    if (!logView) return;
    if (!text) {
      logView.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Paste log text to test your pattern…</span>';
      return;
    }

    const lines = text.split('\n');
    const showLineNums = !document.getElementById('tog-linenums').classList.contains('off');

    if (!matches || matches.length === 0) {
      // No matches — just render with line numbers
      let html = '';
      lines.forEach(function(line, i) {
        const ln = showLineNums ? '<span class="log-ln">' + (i+1) + '</span>' : '';
        html += ln + escHtml(line) + '\n';
      });
      logView.innerHTML = html;
      return;
    }

    // Build per-position highlight map: position → group index (0 = full match, 1+ = group n)
    // We'll highlight the full match and track which group index each char belongs to
    let html = '';
    let pos  = 0;
    let matchIdx = 0;

    // Sort matches by index
    const sorted = matches.slice().sort(function(a,b){ return a.index - b.index; });

    // For line-number rendering, we need to work line by line but matches may span lines
    // Simpler approach: build full text HTML with spans, then split by newline markers

    // Build a segment list: [{start, end, cls}]
    const spans = [];
    sorted.forEach(function(m, mi) {
      // Full match highlight (group 0)
      spans.push({ start: m.index, end: m.end, cls: 'log-m-0' });
    });

    // Render character by character with span wrapping
    let textHtml = '';
    let spanStack = [];
    let charPos = 0;

    // Flatten overlapping spans (take first match)
    const charClass = new Uint8Array(text.length);
    spans.forEach(function(sp) {
      for (let i = sp.start; i < sp.end; i++) {
        if (i < charClass.length) charClass[i] = 1;
      }
    });

    // For groups: mark group chars separately
    // Build group char arrays
    const groupChars = [];
    for (let g = 0; g < 3; g++) groupChars.push(new Uint8Array(text.length));
    sorted.forEach(function(m) {
      m.groups.forEach(function(gval, gi) {
        if (gi >= 3 || gval === undefined || gval === null) return;
        // Find group in the original text by searching near the full match
        // Simple: re-exec with group tracking
        const gStart = text.indexOf(gval, m.index);
        if (gStart >= m.index && gStart < m.end) {
          for (let i = gStart; i < gStart + gval.length && i < text.length; i++) {
            groupChars[gi][i] = 1;
          }
        }
      });
    });

    // Build the rendered text
    let i = 0;
    let inSpan = false;
    while (i < text.length) {
      const ch = text[i];
      const isMatch = charClass[i];
      const gIdx = groupChars[0][i] ? 0 : groupChars[1][i] ? 1 : groupChars[2][i] ? 2 : -1;

      if (ch === '\n') {
        if (inSpan) { textHtml += '</span>'; inSpan = false; }
        textHtml += '\n';
        i++;
        continue;
      }

      if (isMatch) {
        if (!inSpan) {
          const cls = gIdx >= 0 ? 'log-m-' + (gIdx+1) : 'log-m-0';
          textHtml += '<span class="' + cls + '">';
          inSpan = true;
        }
      } else {
        if (inSpan) { textHtml += '</span>'; inSpan = false; }
      }

      textHtml += escHtml(ch);
      i++;
    }
    if (inSpan) textHtml += '</span>';

    // Now add line numbers
    if (showLineNums) {
      const htmlLines = textHtml.split('\n');
      const numbered  = htmlLines.map(function(line, idx) {
        return '<span class="log-ln">' + (idx+1) + '</span>' + line;
      });
      logView.innerHTML = numbered.join('\n');
    } else {
      logView.innerHTML = textHtml;
    }
  }

  /* ===== RENDER MATCH VIEW ===== */
  function renderMatchView(matches) {
    if (matches.length === 0) {
      matchView.innerHTML = '<div style="padding:16px;color:#64748B;font-size:12px">No matches found</div>';
      return;
    }

    const groupColors = ['#86EFAC', '#7DD3FC', '#C084FC', '#FB923C'];
    let html = '';

    const shown = matches.slice(0, 200);
    shown.forEach(function(m, mi) {
      html += '<div style="margin-bottom:8px">';
      html += '<span class="match-badge">Match ' + (mi+1) + '</span>';
      html += '<div style="padding-left:4px;margin-top:3px">';
      html += '<div style="color:var(--color-text);font-size:12px;margin-bottom:3px">' + escHtml(m.full) + '</div>';
      m.groups.forEach(function(g, gi) {
        if (g === undefined) return;
        const col = groupColors[gi % groupColors.length];
        html += '<div style="display:flex;gap:6px;font-size:11px;margin-bottom:2px">';
        html += '<span style="color:' + col + ';min-width:54px">Group ' + (gi+1) + ':</span>';
        html += '<span style="color:var(--color-text)">' + escHtml(String(g)) + '</span>';
        html += '</div>';
      });
      // Named groups
      const named = Object.keys(m.named);
      named.forEach(function(name) {
        html += '<div style="display:flex;gap:6px;font-size:11px;margin-bottom:2px">';
        html += '<span style="color:#86EFAC;min-width:54px">?' + escHtml(name) + ':</span>';
        html += '<span style="color:var(--color-text)">' + escHtml(String(m.named[name])) + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    if (matches.length > 200) {
      html += '<div style="color:#64748B;font-size:11px;padding:8px 0">…and ' + (matches.length - 200).toLocaleString() + ' more matches</div>';
    }

    matchView.innerHTML = html;
  }

  /* ===== STATUS HELPERS ===== */
  function setMatchStatus(state, msg, info) {
    matchCountOk.style.display  = state === 'ok'  ? '' : 'none';
    matchCountErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok')  matchCountOk.textContent  = msg;
    if (state === 'err') matchCountErr.textContent = msg;
    matchGroupsInfo.style.display = info ? '' : 'none';
    if (info) matchGroupsInfo.textContent = info;
  }

  function updateMatchStats(matchCount, groupCount) {
    if (statMatches) statMatches.textContent = matchCount;
    if (statGroups)  statGroups.textContent  = groupCount;
  }

  /* ===== EXPORT ===== */
  document.getElementById('btn-copy-matches').addEventListener('click', function() {
    if (lastMatches.length === 0) { window.showToast('No matches to copy', 'info'); return; }
    const lines = lastMatches.map(function(m, i) {
      const groups = m.groups.map(function(g){ return g !== undefined ? String(g) : ''; }).join('\t');
      return 'Match ' + (i+1) + '\t' + m.full + (groups ? '\t' + groups : '');
    });
    window.copyToClipboard(lines.join('\n'));
  });

  document.getElementById('btn-export-csv').addEventListener('click', function() {
    if (lastMatches.length === 0) { window.showToast('No matches to export', 'info'); return; }
    const inclLineNums = !document.getElementById('tog-linenums').classList.contains('off');
    const maxGroups = lastMatches.reduce(function(max, m){ return Math.max(max, m.groups.length); }, 0);

    let csv = '';
    const headers = (inclLineNums ? ['line_number'] : []).concat(['match']).concat(
      Array.from({length: maxGroups}, function(_, i){ return 'group_' + (i+1); })
    );
    csv += headers.map(function(h){ return '"' + h + '"'; }).join(',') + '\n';

    const text = logTextarea.value;
    const lines = text.split('\n');

    lastMatches.forEach(function(m, mi) {
      // Find which line this match is on
      let lineNum = 1;
      if (inclLineNums && text) {
        let chars = 0;
        for (let li = 0; li < lines.length; li++) {
          chars += lines[li].length + 1;
          if (chars > m.index) { lineNum = li + 1; break; }
        }
      }
      const row = [];
      if (inclLineNums) row.push(lineNum);
      row.push(m.full);
      for (let gi = 0; gi < maxGroups; gi++) {
        row.push(m.groups[gi] !== undefined ? m.groups[gi] : '');
      }
      csv += row.map(function(v){ return '"' + String(v).replace(/"/g,'""') + '"'; }).join(',') + '\n';
    });

    downloadText(csv, 'matches.csv', 'text/csv');
    window.showToast('Downloaded matches.csv — ' + lastMatches.length + ' rows', 'success');
  });

  document.getElementById('btn-export-json').addEventListener('click', function() {
    if (lastMatches.length === 0) { window.showToast('No matches to export', 'info'); return; }
    const data = lastMatches.map(function(m, i) {
      const obj = { match_index: i + 1, full: m.full };
      m.groups.forEach(function(g, gi){ obj['group_' + (gi+1)] = g !== undefined ? g : null; });
      Object.keys(m.named).forEach(function(name){ obj[name] = m.named[name]; });
      return obj;
    });
    downloadText(JSON.stringify(data, null, 2), 'matches.json', 'application/json');
    window.showToast('Downloaded matches.json — ' + lastMatches.length + ' entries', 'success');
  });

  function downloadText(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  /* ===== INPUT LISTENERS ===== */
  patternInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runTest, 200);
  });

  logTextarea.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runTest, 200);
  });

  /* ===== INITIAL FLAGS DISPLAY ===== */
  updateFlagsDisplay();
});
