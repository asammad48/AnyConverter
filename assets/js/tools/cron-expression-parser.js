(function() {
  function getLang() {
    var path = window.location.pathname || '';
    if (path.startsWith('/es/') || path === '/es') return 'es';
    if (path.startsWith('/da/') || path === '/da') return 'da';
    return 'en';
  }

  function detectDialect(parts) {
    var count = parts.length;
    var hasQuartzChars = parts.some(function(p) { return /[?LW#]/.test(p); });

    if (hasQuartzChars || count === 7) {
      return {
        type: 'quartz',
        isSeconds: true,
        hasYear: count === 7,
        label: {
          en: 'Quartz Cron Dialect',
          es: 'Dialecto Cron Quartz',
          da: 'Quartz Cron-dialekt'
        }
      };
    }
    if (count === 6) {
      return {
        type: 'six-field',
        isSeconds: true,
        hasYear: false,
        label: {
          en: '6-field Cron (with Seconds — Spring / Cloud / Node)',
          es: 'Cron de 6 campos (con Segundos — Spring / Cloud / Node)',
          da: '6-felters Cron (med Sekunder — Spring / Cloud / Node)'
        }
      };
    }
    if (count === 5) {
      return {
        type: 'standard',
        isSeconds: false,
        hasYear: false,
        label: {
          en: 'Standard 5-field Cron (Linux / Unix)',
          es: 'Cron estándar de 5 campos (Linux / Unix)',
          da: 'Standard 5-felters Cron (Linux / Unix)'
        }
      };
    }
    return null;
  }

  function getFieldLabels(dialect, lang) {
    if (dialect.isSeconds) {
      var labels = [
        { id: 'sec', en: 'Second', es: 'Segundo', da: 'Sekund' },
        { id: 'min', en: 'Minute', es: 'Minuto', da: 'Minut' },
        { id: 'hr',  en: 'Hour',   es: 'Hora',   da: 'Time' },
        { id: 'dom', en: 'Day',    es: 'Día',    da: 'Dag' },
        { id: 'mon', en: 'Month',  es: 'Mes',    da: 'Måned' },
        { id: 'dow', en: 'Weekday',es: 'Semana', da: 'Ugedag' }
      ];
      if (dialect.hasYear) {
        labels.push({ id: 'yr', en: 'Year', es: 'Año', da: 'År' });
      }
      return labels;
    }
    return [
      { id: 'min', en: 'Minute', es: 'Minuto', da: 'Minut' },
      { id: 'hr',  en: 'Hour',   es: 'Hora',   da: 'Time' },
      { id: 'dom', en: 'Day',    es: 'Día',    da: 'Dag' },
      { id: 'mon', en: 'Month',  es: 'Mes',    da: 'Måned' },
      { id: 'dow', en: 'Weekday',es: 'Semana', da: 'Ugedag' }
    ];
  }

  function renderFieldCards(container, parts, labels, lang) {
    container.innerHTML = parts.map(function(part, i) {
      var lblObj = labels[i] || { en: 'Field ' + (i+1) };
      var lbl = lblObj[lang] || lblObj.en;
      return '<div style="text-align:center;padding:12px 8px;background:var(--color-bg,#F7F6F3);border:1px solid var(--color-border,#DDD8D0);border-radius:8px">' +
        '<div style="font-size:18px;font-weight:700;font-family:\'JetBrains Mono\',monospace;word-break:break-all">' + escapeHtml(part) + '</div>' +
        '<div style="font-size:11px;color:var(--color-text-2,#6B7280);margin-top:4px">' + escapeHtml(lbl) + '</div>' +
      '</div>';
    }).join('');
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getNextRuns(parts, isSixField, count) {
    var runs = [];
    var d = new Date();
    d.setMilliseconds(0);

    var secPart = isSixField ? parts[0] : '0';
    var minPart = isSixField ? parts[1] : parts[0];
    var hrPart  = isSixField ? parts[2] : parts[1];
    var domPart = isSixField ? parts[3] : parts[2];
    var monPart = isSixField ? parts[4] : parts[3];
    var dowPart = isSixField ? parts[5] : parts[4];

    var DAYS = { SUN:0, MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
    var MONTHS = { JAN:1, FEB:2, MAR:3, APR:4, MAY:5, JUN:6, JUL:7, AUG:8, SEP:9, OCT:10, NOV:11, DEC:12 };

    function normalizePatternPart(p) {
      var up = String(p).trim().toUpperCase();
      if (DAYS[up] !== undefined) return String(DAYS[up]);
      if (MONTHS[up] !== undefined) return String(MONTHS[up]);
      return p;
    }

    function matches(val, pattern, minVal, maxVal) {
      if (pattern === '*' || pattern === '?') return true;
      if (pattern.indexOf(',') !== -1) {
        return pattern.split(',').some(function(p) { return matches(val, p, minVal, maxVal); });
      }
      if (pattern.indexOf('/') !== -1) {
        var sub = pattern.split('/');
        var sPart = normalizePatternPart(sub[0]);
        var start = sPart === '*' ? minVal : parseInt(sPart, 10);
        var step = parseInt(sub[1], 10);
        return !isNaN(start) && !isNaN(step) && step > 0 && val >= start && (val - start) % step === 0;
      }
      if (pattern.indexOf('-') !== -1) {
        var range = pattern.split('-').map(function(p) { return parseInt(normalizePatternPart(p), 10); });
        return val >= range[0] && val <= range[1];
      }
      var target = parseInt(normalizePatternPart(pattern), 10);
      if (isNaN(target)) return false;
      if (val === target) return true;
      if (minVal === 0 && maxVal === 7 && (val === 0 || val === 7) && (target === 0 || target === 7)) return true;
      return false;
    }

    var isFixedSecond = /^\d+$/.test(secPart.trim());
    var stepSeconds = isSixField && !isFixedSecond;

    if (isFixedSecond) {
      d.setSeconds(parseInt(secPart.trim(), 10));
      d.setMinutes(d.getMinutes() + 1);
    } else if (isSixField) {
      d.setSeconds(d.getSeconds() + 1);
    } else {
      d.setSeconds(0);
      d.setMinutes(d.getMinutes() + 1);
    }

    var maxIter = stepSeconds ? 86400 : 86400; // 86400 iterations (24h in seconds or 60 days in minutes)
    var iter = 0;
    while (runs.length < count && iter < maxIter) {
      iter++;
      var s = d.getSeconds();
      var m = d.getMinutes();
      var h = d.getHours();
      var dom = d.getDate();
      var mon = d.getMonth() + 1;
      var dow = d.getDay();

      if (matches(s, secPart, 0, 59) &&
          matches(m, minPart, 0, 59) &&
          matches(h, hrPart, 0, 23) &&
          matches(dom, domPart, 1, 31) &&
          matches(mon, monPart, 1, 12) &&
          matches(dow, dowPart, 0, 7)) {
        runs.push(new Date(d));
      }

      if (stepSeconds) {
        d.setSeconds(d.getSeconds() + 1);
      } else {
        d.setMinutes(d.getMinutes() + 1);
      }
    }

    return runs;
  }

  function update() {
    var expr = document.getElementById('cron-input').value.trim();
    var desc = document.getElementById('cron-description');
    var err = document.getElementById('cron-error');
    var badge = document.getElementById('cron-dialect-badge');
    var fieldsContainer = document.getElementById('cron-fields-container');
    var nextContainer = document.getElementById('cron-next-runs');
    var nextList = document.getElementById('cron-next-list');
    var lang = getLang();

    err.style.display = 'none';
    desc.style.display = 'none';
    if (!expr) {
      if (fieldsContainer) fieldsContainer.innerHTML = '';
      if (nextContainer) nextContainer.style.display = 'none';
      if (badge) badge.textContent = 'Cron';
      return;
    }

    var parts = expr.split(/\s+/);
    var dialect = detectDialect(parts);

    if (!dialect) {
      if (badge) badge.textContent = 'Invalid Dialect';
      if (fieldsContainer) fieldsContainer.innerHTML = '';
      if (nextContainer) nextContainer.style.display = 'none';

      err.textContent = parts.length < 5
        ? (lang === 'es'
          ? 'El cron debe tener al menos 5 campos (minuto hora día mes día-de-semana). Se encontraron ' + parts.length + '.'
          : (lang === 'da'
            ? 'Cron skal have mindst 5 felter (minut time dag måned ugedag). Fandt ' + parts.length + '.'
            : 'Cron expression must have at least 5 fields (minute hour day month weekday). Found ' + parts.length + '.'))
        : (lang === 'es'
          ? 'El cron tiene ' + parts.length + ' campos. La longitud máxima soportada es 7 (Quartz con año).'
          : (lang === 'da'
            ? 'Cron har ' + parts.length + ' felter. Maksimalt understøttet er 7 felter (Quartz med år).'
            : 'Cron expression has ' + parts.length + ' fields. Maximum supported is 7 fields (Quartz with year).'));
      err.style.display = 'block';
      return;
    }

    if (badge) badge.textContent = dialect.label[lang] || dialect.label.en;

    var labels = getFieldLabels(dialect, lang);
    if (fieldsContainer) renderFieldCards(fieldsContainer, parts, labels, lang);

    // Plain English description using cronstrue if present, or fallback text
    try {
      if (typeof cronstrue !== 'undefined') {
        var opts = { throwExceptionOnParseError: true, verbose: false };
        if (lang === 'es') opts.locale = 'es';
        if (lang === 'da') opts.locale = 'da';
        var text = cronstrue.toString(expr, opts);
        desc.textContent = text;
        desc.style.display = 'block';
      } else {
        desc.textContent = expr;
        desc.style.display = 'block';
      }
    } catch (e) {
      desc.textContent = expr;
      desc.style.display = 'block';
    }

    // Next scheduled runs
    try {
      var runs = getNextRuns(parts, dialect.isSeconds, 3);
      if (runs.length && nextList && nextContainer) {
        var tz = 'UTC';
        try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'; } catch (_) {}
        nextList.innerHTML = runs.map(function(r) {
          return '<li>' + r.toLocaleString() + ' <span style="font-size:11px;color:var(--color-text-2)">(' + tz + ')</span></li>';
        }).join('');
        nextContainer.style.display = 'block';
      } else if (nextContainer) {
        nextContainer.style.display = 'none';
      }
    } catch (_) {
      if (nextContainer) nextContainer.style.display = 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var inputEl = document.getElementById('cron-input');
    var debounceTimer;
    if (inputEl) {
      inputEl.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(update, 200);
      });
    }
    document.querySelectorAll('.cron-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        clearTimeout(debounceTimer);
        if (inputEl) {
          inputEl.value = this.dataset.val;
          update();
        }
      });
    });
    update();
  });
})();
