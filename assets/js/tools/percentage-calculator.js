(function() {
  'use strict';

  var mode = 1;
  var p4Dir = 'increase';
  var feedbackTimer = null;

  function setMode(m) {
    var parsedM = parseInt(m, 10);
    if (isNaN(parsedM) || parsedM < 1 || parsedM > 4) {
      parsedM = 1;
    }
    mode = parsedM;
    [1, 2, 3, 4].forEach(function(i) {
      var modeBtn = document.getElementById('pct-mode-' + i);
      if (modeBtn) {
        modeBtn.className = i === mode ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
      }
      var formEl = document.getElementById('pct-form-' + i);
      if (formEl) {
        formEl.style.display = i === mode ? '' : 'none';
      }
    });
    var resEl = document.getElementById('pct-result');
    if (resEl) {
      resEl.style.display = 'none';
    }
  }

  function setP4Dir(dir) {
    p4Dir = (dir === 'dec' || dir === 'decrease') ? 'decrease' : 'increase';
    var incBtn = document.getElementById('p4-inc-btn');
    var decBtn = document.getElementById('p4-dec-btn');
    if (incBtn) {
      incBtn.className = p4Dir === 'increase' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    }
    if (decBtn) {
      decBtn.className = p4Dir === 'decrease' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    }
  }

  function calc() {
    var ans, label;
    if (mode === 1) {
      var p1xEl = document.getElementById('p1-x');
      var p1yEl = document.getElementById('p1-y');
      if (!p1xEl || !p1yEl) return false;
      var x = parseFloat(p1xEl.value);
      var y = parseFloat(p1yEl.value);
      if (isNaN(x) || isNaN(y)) return false;
      ans = (x / 100) * y;
      label = x + '% of ' + y + ' =';
    } else if (mode === 2) {
      var p2xEl = document.getElementById('p2-x');
      var p2yEl = document.getElementById('p2-y');
      if (!p2xEl || !p2yEl) return false;
      var x2 = parseFloat(p2xEl.value);
      var y2 = parseFloat(p2yEl.value);
      if (isNaN(x2) || isNaN(y2) || y2 === 0) return false;
      var ansEl = document.getElementById('pct-answer');
      var lblEl = document.getElementById('pct-label');
      if (ansEl) ansEl.textContent = (x2 / y2 * 100).toFixed(4) + '%';
      if (lblEl) lblEl.textContent = x2 + ' is what % of ' + y2;
      var resEl2 = document.getElementById('pct-result');
      if (resEl2) resEl2.style.display = 'block';
      return true;
    } else if (mode === 3) {
      var p3oldEl = document.getElementById('p3-old');
      var p3newEl = document.getElementById('p3-new');
      if (!p3oldEl || !p3newEl) return false;
      var oldV = parseFloat(p3oldEl.value);
      var newV = parseFloat(p3newEl.value);
      if (isNaN(oldV) || isNaN(newV) || oldV === 0) return false;
      var change = ((newV - oldV) / Math.abs(oldV) * 100);
      var ansEl3 = document.getElementById('pct-answer');
      var lblEl3 = document.getElementById('pct-label');
      if (ansEl3) ansEl3.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
      if (lblEl3) lblEl3.textContent = 'Percentage change from ' + oldV + ' to ' + newV;
      var resEl3 = document.getElementById('pct-result');
      if (resEl3) resEl3.style.display = 'block';
      return true;
    } else {
      var p4valEl = document.getElementById('p4-val');
      var p4pctEl = document.getElementById('p4-pct');
      if (!p4valEl || !p4pctEl) return false;
      var val = parseFloat(p4valEl.value);
      var pct = parseFloat(p4pctEl.value);
      if (isNaN(val) || isNaN(pct)) return false;
      ans = p4Dir === 'increase' ? val * (1 + pct / 100) : val * (1 - pct / 100);
      label = (p4Dir === 'increase' ? 'Increase' : 'Decrease') + ' ' + val + ' by ' + pct + '%';
    }

    var answerEl = document.getElementById('pct-answer');
    var labelEl = document.getElementById('pct-label');
    var resultEl = document.getElementById('pct-result');
    if (answerEl) answerEl.textContent = typeof ans === 'number' ? ans.toFixed(4).replace(/\.?0+$/, '') : ans;
    if (labelEl) labelEl.textContent = label;
    if (resultEl) resultEl.style.display = 'block';
    return true;
  }

  function formatNum(num) {
    if (!isFinite(num)) return '0';
    return String(+parseFloat(num).toFixed(6).replace(/\.?0+$/, ''));
  }

  function generateShareUrl() {
    var qs = 'v=1&m=' + mode;
    if (mode === 1) {
      var p1x = document.getElementById('p1-x');
      var p1y = document.getElementById('p1-y');
      var x = p1x && p1x.value.trim() !== '' ? parseFloat(p1x.value) : (p1x && p1x.placeholder ? parseFloat(p1x.placeholder) : 25);
      var y = p1y && p1y.value.trim() !== '' ? parseFloat(p1y.value) : (p1y && p1y.placeholder ? parseFloat(p1y.placeholder) : 200);
      if (isNaN(x)) x = 25;
      if (isNaN(y)) y = 200;
      qs += '&x=' + encodeURIComponent(formatNum(x)) + '&y=' + encodeURIComponent(formatNum(y));
    } else if (mode === 2) {
      var p2x = document.getElementById('p2-x');
      var p2y = document.getElementById('p2-y');
      var x2 = p2x && p2x.value.trim() !== '' ? parseFloat(p2x.value) : (p2x && p2x.placeholder ? parseFloat(p2x.placeholder) : 50);
      var y2 = p2y && p2y.value.trim() !== '' ? parseFloat(p2y.value) : (p2y && p2y.placeholder ? parseFloat(p2y.placeholder) : 200);
      if (isNaN(x2)) x2 = 50;
      if (isNaN(y2) || y2 === 0) y2 = 200;
      qs += '&x=' + encodeURIComponent(formatNum(x2)) + '&y=' + encodeURIComponent(formatNum(y2));
    } else if (mode === 3) {
      var p3old = document.getElementById('p3-old');
      var p3new = document.getElementById('p3-new');
      var o = p3old && p3old.value.trim() !== '' ? parseFloat(p3old.value) : (p3old && p3old.placeholder ? parseFloat(p3old.placeholder) : 100);
      var n = p3new && p3new.value.trim() !== '' ? parseFloat(p3new.value) : (p3new && p3new.placeholder ? parseFloat(p3new.placeholder) : 150);
      if (isNaN(o) || o === 0) o = 100;
      if (isNaN(n)) n = 150;
      qs += '&o=' + encodeURIComponent(formatNum(o)) + '&n=' + encodeURIComponent(formatNum(n));
    } else {
      var p4val = document.getElementById('p4-val');
      var p4pct = document.getElementById('p4-pct');
      var val = p4val && p4val.value.trim() !== '' ? parseFloat(p4val.value) : (p4val && p4val.placeholder ? parseFloat(p4val.placeholder) : 100);
      var pct = p4pct && p4pct.value.trim() !== '' ? parseFloat(p4pct.value) : (p4pct && p4pct.placeholder ? parseFloat(p4pct.placeholder) : 20);
      if (isNaN(val)) val = 100;
      if (isNaN(pct)) pct = 20;
      var d = (p4Dir === 'decrease') ? 'dec' : 'inc';
      qs += '&v=' + encodeURIComponent(formatNum(val)) + '&p=' + encodeURIComponent(formatNum(pct)) + '&d=' + d;
    }

    var basePath = '/percentage-calculator/';
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.pathname) {
        basePath = window.location.pathname.replace(/index\.html$/, '');
        if (!basePath.endsWith('/')) basePath += '/';
      }
    }
    var origin = 'https://anyconverter.io';
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      if (!window.location.origin.startsWith('file:') && window.location.origin !== 'null') {
        origin = window.location.origin;
      }
    }
    return origin + basePath + '?' + qs;
  }

  function copyToClipboard(text) {
    if (typeof window !== 'undefined') {
      window._lastCopiedShareUrl = text;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function(resolve) {
      try {
        if (typeof document === 'undefined') return resolve();
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  function showShareFeedback(msg) {
    var feedbackEl = document.getElementById('pct-share-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = msg || 'Link copied to clipboard!';
      feedbackEl.style.display = 'inline-flex';
      if (feedbackTimer) clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(function() {
        feedbackEl.style.display = 'none';
      }, 2500);
    }
    var shareBtn = document.getElementById('btn-share-pct');
    if (shareBtn) {
      var labelSpan = shareBtn.querySelector('span');
      if (labelSpan) {
        var prevText = labelSpan.textContent;
        labelSpan.textContent = 'Link copied!';
        setTimeout(function() {
          labelSpan.textContent = prevText;
        }, 2000);
      }
    }
  }

  function triggerShare() {
    calc();
    var shareUrl = generateShareUrl();
    showShareFeedback('Link copied to clipboard!');
    copyToClipboard(shareUrl);

    if (typeof window !== 'undefined' && window.ACAnalytics) {
      if (typeof window.ACAnalytics.trackShareLinkGenerated === 'function') {
        window.ACAnalytics.trackShareLinkGenerated('percentage-calculator', mode, 'success');
      } else if (typeof window.ACAnalytics.track === 'function') {
        window.ACAnalytics.track('share_link_generated', {
          tool: 'percentage-calculator',
          tool_slug: 'percentage-calculator',
          mode: String(mode),
          status: 'success'
        });
      }
    }
  }

  function applyNoindex() {
    if (typeof document === 'undefined') return;
    var metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, follow');
    } else if (document.head) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      metaRobots.content = 'noindex, follow';
      document.head.appendChild(metaRobots);
    }
  }

  function hydrateFromUrl() {
    if (typeof window === 'undefined' || !window.location) return;
    var search = window.location.search;
    if (!search || search.length <= 1) return;

    // Apply noindex dynamically to prevent duplicate content indexing
    applyNoindex();

    var params = new URLSearchParams(search);
    var vList = params.getAll('v');
    // Check version: must be v=1
    var hasValidVersion = vList.length > 0 && vList[0] === '1';
    if (!hasValidVersion) {
      // Malformed or missing version -> graceful reset to default mode 1
      setMode(1);
      return;
    }

    var rawM = params.get('m');
    var m = parseInt(rawM, 10);
    if (isNaN(m) || m < 1 || m > 4) {
      // Malformed mode -> graceful reset to default mode 1
      setMode(1);
      return;
    }

    if (m === 1) {
      var rawX1 = params.get('x');
      var rawY1 = params.get('y');
      var x1 = parseFloat(rawX1);
      var y1 = parseFloat(rawY1);
      if (!isFinite(x1) || !isFinite(y1)) {
        setMode(1);
        return;
      }
      setMode(1);
      var el1X = document.getElementById('p1-x');
      var el1Y = document.getElementById('p1-y');
      if (el1X) el1X.value = x1;
      if (el1Y) el1Y.value = y1;
      calc();
    } else if (m === 2) {
      var rawX2 = params.get('x');
      var rawY2 = params.get('y');
      var x2 = parseFloat(rawX2);
      var y2 = parseFloat(rawY2);
      if (!isFinite(x2) || !isFinite(y2) || y2 === 0) {
        setMode(1);
        return;
      }
      setMode(2);
      var el2X = document.getElementById('p2-x');
      var el2Y = document.getElementById('p2-y');
      if (el2X) el2X.value = x2;
      if (el2Y) el2Y.value = y2;
      calc();
    } else if (m === 3) {
      var rawO = params.get('o');
      var rawN = params.get('n');
      var o = parseFloat(rawO);
      var n = parseFloat(rawN);
      if (!isFinite(o) || !isFinite(n) || o === 0) {
        setMode(1);
        return;
      }
      setMode(3);
      var el3O = document.getElementById('p3-old');
      var el3N = document.getElementById('p3-new');
      if (el3O) el3O.value = o;
      if (el3N) el3N.value = n;
      calc();
    } else if (m === 4) {
      var rawV4 = params.get('val');
      if (rawV4 == null) {
        if (vList.length > 1) {
          rawV4 = vList[1];
        } else if (vList.length === 1 && vList[0] !== '1') {
          rawV4 = vList[0];
        }
      }
      var rawP4 = params.get('p');
      var rawD4 = params.get('d');
      var v4 = parseFloat(rawV4);
      var p4 = parseFloat(rawP4);
      if (!isFinite(v4) || !isFinite(p4)) {
        setMode(1);
        return;
      }
      setMode(4);
      var el4V = document.getElementById('p4-val');
      var el4P = document.getElementById('p4-pct');
      if (el4V) el4V.value = v4;
      if (el4P) el4P.value = p4;
      setP4Dir(rawD4 === 'dec' || rawD4 === 'decrease' ? 'decrease' : 'increase');
      calc();
    }
  }

  function initListeners() {
    [1, 2, 3, 4].forEach(function(i) {
      var mBtn = document.getElementById('pct-mode-' + i);
      if (mBtn) {
        mBtn.addEventListener('click', function() { setMode(i); });
      }
    });

    var incBtn = document.getElementById('p4-inc-btn');
    if (incBtn) {
      incBtn.addEventListener('click', function() { setP4Dir('increase'); });
    }

    var decBtn = document.getElementById('p4-dec-btn');
    if (decBtn) {
      decBtn.addEventListener('click', function() { setP4Dir('decrease'); });
    }

    var calcBtn = document.getElementById('btn-calc-pct');
    if (calcBtn) {
      calcBtn.addEventListener('click', calc);
    }

    var resetBtn = document.getElementById('btn-reset-pct');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        var resEl = document.getElementById('pct-result');
        if (resEl) resEl.style.display = 'none';
        document.querySelectorAll('#pct-form-1 input, #pct-form-2 input, #pct-form-3 input, #pct-form-4 input').forEach(function(i) {
          i.value = '';
        });
        var feedbackEl = document.getElementById('pct-share-feedback');
        if (feedbackEl) feedbackEl.style.display = 'none';
      });
    }

    var shareBtn = document.getElementById('btn-share-pct');
    if (shareBtn) {
      shareBtn.addEventListener('click', triggerShare);
    }

    var shareResBtn = document.getElementById('btn-share-result');
    if (shareResBtn) {
      shareResBtn.addEventListener('click', triggerShare);
    }

    hydrateFromUrl();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initListeners);
    } else {
      initListeners();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      setMode: setMode,
      setP4Dir: setP4Dir,
      calc: calc,
      formatNum: formatNum,
      generateShareUrl: generateShareUrl,
      hydrateFromUrl: hydrateFromUrl,
      applyNoindex: applyNoindex,
      triggerShare: triggerShare
    };
  }
})();
