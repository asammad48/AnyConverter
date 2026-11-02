(function() {
  'use strict';

  var rates = null;
  var base = 'USD';
  var POPULAR = ['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','INR','MXN','BRL','SGD','HKD','NOK','SEK','DKK','PLN','CZK','HUF','KRW'];
  var NAMES = {USD:'US Dollar',EUR:'Euro',GBP:'British Pound',JPY:'Japanese Yen',AUD:'Australian Dollar',CAD:'Canadian Dollar',CHF:'Swiss Franc',CNY:'Chinese Yuan',INR:'Indian Rupee',MXN:'Mexican Peso',BRL:'Brazilian Real',SGD:'Singapore Dollar',HKD:'Hong Kong Dollar',NOK:'Norwegian Krone',SEK:'Swedish Krona',DKK:'Danish Krone',PLN:'Polish Zloty',CZK:'Czech Koruna',HUF:'Hungarian Forint',KRW:'South Korean Won'};

  function calculateFxConversion(amount, from, to, currentBase, currentRates) {
    if (!currentRates || typeof currentRates !== 'object' || isNaN(amount) || amount < 0) return null;
    if (!currentRates[to] || (from !== currentBase && !currentRates[from])) return null;
    var rawRate = (from === currentBase) ? currentRates[to] : currentRates[to] / (currentRates[from] || 1);
    return {
      rate: rawRate,
      result: amount * rawRate
    };
  }

  function populateSelects(allRates) {
    var codes = Object.keys(allRates).sort();
    ['cc-from','cc-to'].forEach(function(id) {
      var sel = document.getElementById(id);
      if (!sel) return;
      var current = sel.value;
      sel.innerHTML = '';
      codes.forEach(function(code) {
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = code + (NAMES[code] ? ' – ' + NAMES[code] : '');
        sel.appendChild(opt);
      });
      if (current && codes.includes(current)) sel.value = current;
    });
    if (!document.getElementById('cc-from').value) document.getElementById('cc-from').value = 'USD';
    if (!document.getElementById('cc-to').value) document.getElementById('cc-to').value = 'EUR';
  }

  function handleFetchFailure(err) {
    // Attempt to load genuine previously fetched and timestamped rates from safe cache
    var loadedFromCache = false;
    try {
      if (typeof localStorage !== 'undefined') {
        var cachedRaw = localStorage.getItem('ac_fx_rates_cache_v2');
        if (cachedRaw) {
          var cached = JSON.parse(cachedRaw);
          if (cached && cached.rates && typeof cached.rates === 'object' && Object.keys(cached.rates).length > 0) {
            rates = cached.rates;
            base = cached.base || 'USD';
            if (document.getElementById('cc-from') && !document.getElementById('cc-from').options.length) {
              populateSelects(rates);
            }
            var infoEl = document.getElementById('cc-rate-info');
            if (infoEl) {
              infoEl.style.display = 'block';
              infoEl.innerHTML = '<span style="color:#B45309;font-weight:600;">⚠ Offline:</span> Using previously cached rates from ' + (cached.timeLastUpdate || cached.time_last_update_utc || cached.savedAt) + ' (source: ' + (cached.source || 'open.er-api.com') + '). Live rates unavailable; rates may be outdated.';
            }
            loadedFromCache = true;
            convert();
            showPopular();
          }
        }
      }
    } catch (e) {
      loadedFromCache = false;
    }

    if (!loadedFromCache) {
      rates = null;
      var resInput = document.getElementById('cc-result-input');
      if (resInput) resInput.value = '';
      var infoEl = document.getElementById('cc-rate-info');
      if (infoEl) {
        infoEl.style.display = 'block';
        infoEl.innerHTML = '<span style="color:#DC2626;font-weight:600;">✕ Current exchange rate unavailable.</span> Live market rates could not be retrieved and no verified cached rates are available. Please check your internet connection and retry.';
      }
      var pop = document.getElementById('cc-popular');
      if (pop) pop.style.display = 'none';
      ['cc-eff-received', 'cc-eff-rate', 'cc-eff-cost'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
    }
  }

  function fetchRates() {
    var fromEl = document.getElementById('cc-from');
    var from = (fromEl && fromEl.value) || 'USD';
    var infoEl = document.getElementById('cc-rate-info');
    if (infoEl) {
      infoEl.style.display = 'block';
      infoEl.textContent = 'Loading mid-market rates...';
    }

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function() { controller.abort(); }, 7000) : null;

    fetch('https://open.er-api.com/v6/latest/' + encodeURIComponent(from), {
      signal: controller ? controller.signal : undefined
    })
      .then(function(r) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!r.ok) throw new Error('HTTP error ' + r.status);
        return r.json();
      })
      .then(function(data) {
        if (data && data.result === 'success' && data.rates && typeof data.rates === 'object') {
          rates = data.rates;
          base = from;
          if (document.getElementById('cc-from') && !document.getElementById('cc-from').options.length) {
            populateSelects(rates);
          }
          if (infoEl) {
            infoEl.style.display = 'block';
            infoEl.textContent = 'Indicative mid-market rates updated: ' + (data.time_last_update_utc || 'recently') + ' (source: open.er-api.com). Rates do not include bank spreads or transfer fees.';
          }
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('ac_fx_rates_cache_v2', JSON.stringify({
                rates: data.rates,
                base: from,
                timeLastUpdate: data.time_last_update_utc,
                savedAt: new Date().toISOString(),
                source: 'open.er-api.com'
              }));
            }
          } catch (e) {}
          convert();
          showPopular();
        } else {
          var errType = (data && data['error-type']) || 'Unsuccessful API response';
          throw new Error('Exchange rate API error: ' + errType);
        }
      })
      .catch(function(err) {
        if (timeoutId) clearTimeout(timeoutId);
        handleFetchFailure(err);
      });
  }

  function convert() {
    var fromEl = document.getElementById('cc-from');
    var toEl = document.getElementById('cc-to');
    var amtEl = document.getElementById('cc-amount');
    var resInput = document.getElementById('cc-result-input');
    if (!fromEl || !toEl || !amtEl || !resInput) return;

    if (!rates) {
      resInput.value = '';
      ['cc-eff-received', 'cc-eff-rate', 'cc-eff-cost'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '—';
      });
      return;
    }

    var amount = parseFloat(amtEl.value) || 0;
    var from = fromEl.value;
    var to = toEl.value;

    var conv = calculateFxConversion(amount, from, to, base, rates);
    if (!conv) {
      resInput.value = '';
      var infoEl = document.getElementById('cc-rate-info');
      if (infoEl && !rates[to]) {
        infoEl.style.display = 'block';
        infoEl.innerHTML = '<span style="color:#DC2626;font-weight:600;">✕ Rate unavailable for currency: ' + to + '</span>';
      }
      return;
    }

    resInput.value = conv.result.toFixed(4);
    updateFeeBreakdown(amount, conv.rate, to);
  }

  function updateFeeBreakdown(amount, rawRate, toCode) {
    var feePanel = document.getElementById('cc-bank-fees-panel');
    if (!feePanel) return;

    var spreadPct = parseFloat(document.getElementById('cc-bank-spread').value) || 0;
    var flatFee = parseFloat(document.getElementById('cc-flat-fee').value) || 0;

    var effectiveRate = rawRate * (1 - spreadPct / 100);
    var netSendAmount = Math.max(0, amount - flatFee);
    var effectiveReceived = netSendAmount * effectiveRate;
    var totalCost = (amount * rawRate) - effectiveReceived;

    document.getElementById('cc-eff-received').textContent = effectiveReceived.toFixed(2) + ' ' + toCode;
    document.getElementById('cc-eff-rate').textContent = '1 ' + document.getElementById('cc-from').value + ' = ' + effectiveRate.toFixed(4) + ' ' + toCode;
    document.getElementById('cc-eff-cost').textContent = totalCost.toFixed(2) + ' ' + toCode;
  }

  function addBankFeeSection() {
    var resultWrap = document.getElementById('cc-result-input');
    if (!resultWrap || document.getElementById('cc-bank-fees-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'cc-bank-fees-panel';
    panel.style.cssText = 'background:var(--color-surface,#fff);border:1px solid var(--color-border,#DDD8D0);border-radius:8px;padding:14px;margin-top:16px;';
    panel.innerHTML = [
      '<h4 style="font-size:13px;font-weight:700;margin-bottom:8px;">Real-World Bank & Transfer Fee Estimator</h4>',
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">',
      '  <div>',
      '    <label style="font-size:11px;font-weight:600;display:block;margin-bottom:4px;" for="cc-bank-spread">Bank FX Spread / Markup (%)</label>',
      '    <input type="number" id="cc-bank-spread" value="1.5" min="0" step="0.25" style="width:100%;padding:6px 8px;border:1px solid var(--color-border,#DDD8D0);border-radius:4px;font-size:13px;">',
      '  </div>',
      '  <div>',
      '    <label style="font-size:11px;font-weight:600;display:block;margin-bottom:4px;" for="cc-flat-fee">Fixed Outgoing Wire Fee (Send Currency)</label>',
      '    <input type="number" id="cc-flat-fee" value="0" min="0" step="1" style="width:100%;padding:6px 8px;border:1px solid var(--color-border,#DDD8D0);border-radius:4px;font-size:13px;">',
      '  </div>',
      '</div>',
      '<div style="background:var(--color-bg,#F7F6F3);padding:10px;border-radius:6px;font-size:12px;">',
      '  <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Effective Amount Received:</span><strong id="cc-eff-received">—</strong></div>',
      '  <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Effective Execution Rate:</span><strong id="cc-eff-rate">—</strong></div>',
      '  <div style="display:flex;justify-content:space-between;color:#B45309;"><span>Total Cost (Spread Markup + Wire Fee):</span><strong id="cc-eff-cost">—</strong></div>',
      '</div>',
      '<p style="font-size:11px;color:var(--color-text-3,#7C7169);margin-top:8px;margin-bottom:0;">Mid-market rates shown are indicative benchmark rates. Banks typically charge a 1% to 3.5% FX markup plus outgoing wire fees.</p>'
    ].join('\n');

    var parent = resultWrap.closest('.tool-zone > div') || resultWrap.parentElement.parentElement;
    parent.appendChild(panel);

    ['cc-bank-spread','cc-flat-fee'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', convert);
    });
  }

  function showPopular() {
    if (!rates) return;
    var from = document.getElementById('cc-from').value;
    document.getElementById('cc-from-code').textContent = from;
    var grid = document.getElementById('cc-popular-grid');
    grid.innerHTML = '';
    POPULAR.filter(function(c) { return c !== from; }).slice(0, 8).forEach(function(code) {
      if (!rates[code]) return;
      var rate = from === base ? rates[code] : rates[code] / (rates[from] || 1);
      var div = document.createElement('div');
      div.style.cssText = 'padding:8px 10px;background:var(--color-surface,#fff);border:1px solid var(--color-border,#DDD8D0);border-radius:8px;font-size:13px';
      div.innerHTML = '<div style="font-weight:600">' + code + '</div><div style="color:var(--color-text-2,#3F3A36)">' + rate.toFixed(4) + '</div>';
      grid.appendChild(div);
    });
    document.getElementById('cc-popular').style.display = 'block';
  }

  function init() {
    addBankFeeSection();
    var INIT_CODES = POPULAR;
    INIT_CODES.forEach(function(code) {
      ['cc-from','cc-to'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = code + (NAMES[code] ? ' – ' + NAMES[code] : '');
        el.appendChild(opt);
      });
    });
    var toEl = document.getElementById('cc-to');
    if (toEl) toEl.value = 'EUR';
    var convBtn = document.getElementById('btn-convert-cc');
    if (convBtn) {
      convBtn.addEventListener('click', function() {
        var fromEl = document.getElementById('cc-from');
        if (fromEl && fromEl.value !== base) { fetchRates(); } else { convert(); }
      });
    }
    var refreshBtn = document.getElementById('btn-refresh-cc');
    if (refreshBtn) refreshBtn.addEventListener('click', fetchRates);
    var amtEl = document.getElementById('cc-amount');
    if (amtEl) amtEl.addEventListener('input', convert);
    var fromSelect = document.getElementById('cc-from');
    if (fromSelect) fromSelect.addEventListener('change', function() { rates = null; fetchRates(); });
    var toSelect = document.getElementById('cc-to');
    if (toSelect) toSelect.addEventListener('change', convert);
    var swapBtn = document.getElementById('cc-swap');
    if (swapBtn) {
      swapBtn.addEventListener('click', function() {
        var f = document.getElementById('cc-from').value;
        var t = document.getElementById('cc-to').value;
        document.getElementById('cc-from').value = t;
        document.getElementById('cc-to').value = f;
        rates = null; fetchRates();
      });
    }
    fetchRates();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', function() {
      fetchRates();
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateFxConversion: calculateFxConversion,
      handleFetchFailure: handleFetchFailure,
      fetchRates: fetchRates,
      convert: convert
    };
  }
  if (typeof window !== 'undefined') {
    window.calculateFxConversion = calculateFxConversion;
  }
})();
