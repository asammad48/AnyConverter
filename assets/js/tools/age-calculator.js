(function() {
  'use strict';

  var feedbackTimer = null;

  function getLocale() {
    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
      if (/^\/es(\/|$)/i.test(window.location.pathname)) return 'es';
      if (/^\/da(\/|$)/i.test(window.location.pathname)) return 'da';
    }
    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
      var l = document.documentElement.lang.toLowerCase();
      if (l.indexOf('es') === 0) return 'es';
      if (l.indexOf('da') === 0) return 'da';
    }
    return 'en';
  }

  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  function isValidDateString(str) {
    if (!str || typeof str !== 'string') return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
    var parts = str.split('-');
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (y < 1000 || y > 3000 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    var dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && (dt.getMonth() + 1) === m && dt.getDate() === d;
  }

  function calcAge() {
    var birthEl = document.getElementById('birth-date');
    var targetEl = document.getElementById('target-date');
    if (!birthEl) return false;

    var birthVal = birthEl.value;
    var targetVal = targetEl ? targetEl.value : '';
    if (!birthVal || !isValidDateString(birthVal)) return false;

    var birthParts = birthVal.split('-');
    var birth = new Date(parseInt(birthParts[0], 10), parseInt(birthParts[1], 10) - 1, parseInt(birthParts[2], 10));

    var target;
    if (targetVal && isValidDateString(targetVal)) {
      var targetParts = targetVal.split('-');
      target = new Date(parseInt(targetParts[0], 10), parseInt(targetParts[1], 10) - 1, parseInt(targetParts[2], 10));
    } else {
      var now = new Date();
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    if (birth > target) return false;

    var y = target.getFullYear() - birth.getFullYear();
    var m = target.getMonth() - birth.getMonth();
    var d = target.getDate() - birth.getDate();

    if (d < 0) {
      m--;
      var lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      d += lastMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    var totalDays = Math.round((target.getTime() - birth.getTime()) / 86400000);
    var nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target) {
      nextBday.setFullYear(nextBday.getFullYear() + 1);
    }
    var daysToNext = Math.ceil((nextBday.getTime() - target.getTime()) / 86400000);

    var locale = getLocale();
    var intlLocale = locale === 'es' ? 'es-ES' : (locale === 'da' ? 'da-DK' : 'en-US');

    var yearsEl = document.getElementById('age-years');
    var monthsEl = document.getElementById('age-months');
    var daysEl = document.getElementById('age-days');
    var totalDaysEl = document.getElementById('age-total-days');
    var nextBdayEl = document.getElementById('age-next-bday');
    var resultEl = document.getElementById('age-result');

    if (yearsEl) yearsEl.textContent = y;
    if (monthsEl) monthsEl.textContent = m;
    if (daysEl) daysEl.textContent = d;
    if (totalDaysEl) totalDaysEl.textContent = totalDays.toLocaleString(intlLocale);

    if (nextBdayEl) {
      if (daysToNext === 0) {
        nextBdayEl.textContent = locale === 'es' ? '¡Hoy!' : (locale === 'da' ? 'I dag!' : 'Today!');
      } else {
        var dayWord = locale === 'es' ? (daysToNext === 1 ? ' día' : ' días') : (locale === 'da' ? (daysToNext === 1 ? ' dag' : ' dage') : (daysToNext === 1 ? ' day' : ' days'));
        nextBdayEl.textContent = daysToNext + dayWord;
      }
    }

    if (resultEl) resultEl.style.display = 'block';
    if (typeof window !== 'undefined' && window.ACAnalytics && typeof window.ACAnalytics.trackToolCompleted === 'function') {
      window.ACAnalytics.trackToolCompleted('age-calculator', 'manual_input', 'age_calculated');
    }
    return true;
  }

  function generateShareUrl() {
    var birthEl = document.getElementById('birth-date');
    var targetEl = document.getElementById('target-date');
    var fromDate = birthEl && birthEl.value ? birthEl.value : '2000-01-01';
    var toDate = targetEl && targetEl.value ? targetEl.value : getTodayString();

    var qs = 'v=1&from=' + encodeURIComponent(fromDate) + '&to=' + encodeURIComponent(toDate);

    var basePath = '/age-calculator/';
    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
      basePath = window.location.pathname.replace(/index\.html$/, '');
      if (!basePath.endsWith('/')) basePath += '/';
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

  function showShareFeedback() {
    var locale = getLocale();
    var feedbackMsg = locale === 'es'
      ? '¡Enlace copiado al portapapeles!'
      : (locale === 'da' ? 'Link kopieret til udklipsholder!' : 'Link copied to clipboard!');
    var buttonMsg = locale === 'es'
      ? '¡Copiado!'
      : (locale === 'da' ? 'Kopieret!' : 'Link copied!');

    var feedbackEl = document.getElementById('age-share-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = feedbackMsg;
      feedbackEl.style.display = 'inline-flex';
      if (feedbackTimer) clearTimeout(feedbackTimer);
      feedbackTimer = setTimeout(function() {
        feedbackEl.style.display = 'none';
      }, 2500);
    }

    var shareBtn = document.getElementById('btn-share-age');
    if (shareBtn) {
      var labelSpan = shareBtn.querySelector('span');
      if (labelSpan) {
        var prevText = labelSpan.textContent;
        labelSpan.textContent = buttonMsg;
        setTimeout(function() {
          labelSpan.textContent = prevText;
        }, 2000);
      }
    }
  }

  function triggerShare() {
    calcAge();
    var shareUrl = generateShareUrl();
    showShareFeedback();
    copyToClipboard(shareUrl);

    if (typeof window !== 'undefined' && window.ACAnalytics) {
      var locale = getLocale();
      if (typeof window.ACAnalytics.trackShareLinkGenerated === 'function') {
        window.ACAnalytics.trackShareLinkGenerated('age-calculator', locale, 'success');
      } else if (typeof window.ACAnalytics.track === 'function') {
        window.ACAnalytics.track('share_link_generated', {
          tool: 'age-calculator',
          tool_slug: 'age-calculator',
          mode: locale,
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

    // Parameterized URL: apply noindex to protect crawl equity
    applyNoindex();

    var params = new URLSearchParams(search);
    var v = params.get('v');
    if (v !== '1') {
      // Malformed or unsupported version -> graceful reset
      resetForm();
      return;
    }

    var fromVal = params.get('from') || params.get('start') || params.get('b');
    var toVal = params.get('to') || params.get('end') || params.get('t') || getTodayString();

    if (!isValidDateString(fromVal) || !isValidDateString(toVal)) {
      resetForm();
      return;
    }

    var fromParts = fromVal.split('-');
    var toParts = toVal.split('-');
    var fromDt = new Date(parseInt(fromParts[0], 10), parseInt(fromParts[1], 10) - 1, parseInt(fromParts[2], 10));
    var toDt = new Date(parseInt(toParts[0], 10), parseInt(toParts[1], 10) - 1, parseInt(toParts[2], 10));

    if (fromDt > toDt) {
      resetForm();
      return;
    }

    var birthEl = document.getElementById('birth-date');
    var targetEl = document.getElementById('target-date');
    if (birthEl) birthEl.value = fromVal;
    if (targetEl) targetEl.value = toVal;

    calcAge();
  }

  function resetForm() {
    var today = getTodayString();
    var birthEl = document.getElementById('birth-date');
    var targetEl = document.getElementById('target-date');
    var resultEl = document.getElementById('age-result');
    var feedbackEl = document.getElementById('age-share-feedback');

    if (birthEl) birthEl.value = '';
    if (targetEl) targetEl.value = today;
    if (resultEl) resultEl.style.display = 'none';
    if (feedbackEl) feedbackEl.style.display = 'none';
  }

  function initListeners() {
    var today = getTodayString();
    var targetEl = document.getElementById('target-date');
    if (targetEl && !targetEl.value) {
      targetEl.value = today;
    }

    var calcBtn = document.getElementById('btn-calc-age');
    if (calcBtn) {
      calcBtn.addEventListener('click', calcAge);
    }

    var resetBtn = document.getElementById('btn-reset-age');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetForm);
    }

    var shareBtn = document.getElementById('btn-share-age');
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
      calcAge: calcAge,
      generateShareUrl: generateShareUrl,
      hydrateFromUrl: hydrateFromUrl,
      applyNoindex: applyNoindex,
      triggerShare: triggerShare,
      isValidDateString: isValidDateString,
      resetForm: resetForm
    };
  }
})();
