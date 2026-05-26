(function() {
  var rates = null;
  var base = 'USD';
  var POPULAR = ['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','INR','MXN','BRL','SGD','HKD','NOK','SEK','DKK','PLN','CZK','HUF','KRW'];
  var NAMES = {USD:'US Dollar',EUR:'Euro',GBP:'British Pound',JPY:'Japanese Yen',AUD:'Australian Dollar',CAD:'Canadian Dollar',CHF:'Swiss Franc',CNY:'Chinese Yuan',INR:'Indian Rupee',MXN:'Mexican Peso',BRL:'Brazilian Real',SGD:'Singapore Dollar',HKD:'Hong Kong Dollar',NOK:'Norwegian Krone',SEK:'Swedish Krona',DKK:'Danish Krone',PLN:'Polish Zloty',CZK:'Czech Koruna',HUF:'Hungarian Forint',KRW:'South Korean Won'};

  function populateSelects(allRates) {
    var codes = Object.keys(allRates).sort();
    ['cc-from','cc-to'].forEach(function(id) {
      var sel = document.getElementById(id);
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
    document.getElementById('cc-from').value = 'USD';
    document.getElementById('cc-to').value = 'EUR';
  }

  function fetchRates() {
    var from = document.getElementById('cc-from').value || 'USD';
    document.getElementById('cc-rate-info').style.display = 'block';
    document.getElementById('cc-rate-info').textContent = 'Loading rates...';
    fetch('https://open.er-api.com/v6/latest/' + from)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.result === 'success') {
          rates = data.rates;
          base = from;
          if (!document.getElementById('cc-from').options.length) populateSelects(rates);
          document.getElementById('cc-rate-info').textContent = 'Rates updated: ' + (data.time_last_update_utc || 'recently') + ' (source: open.er-api.com)';
          convert();
          showPopular();
        }
      })
      .catch(function() {
        document.getElementById('cc-rate-info').textContent = 'Could not load rates. Please try again.';
      });
  }

  function convert() {
    if (!rates) return;
    var amount = parseFloat(document.getElementById('cc-amount').value) || 0;
    var from = document.getElementById('cc-from').value;
    var to = document.getElementById('cc-to').value;
    if (!rates[to]) return;
    var result;
    if (from === base) {
      result = amount * rates[to];
    } else {
      var inBase = amount / (rates[from] || 1);
      result = inBase * (rates[to] || 1);
    }
    document.getElementById('cc-result-input').value = result.toFixed(4);
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
      div.style.cssText = 'padding:8px 10px;background:#fff;border:1px solid #E4E4EF;border-radius:8px;font-size:13px';
      div.innerHTML = '<div style="font-weight:600">' + code + '</div><div style="color:#5C5C7A">' + rate.toFixed(4) + '</div>';
      grid.appendChild(div);
    });
    document.getElementById('cc-popular').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var INIT_CODES = POPULAR;
    INIT_CODES.forEach(function(code) {
      ['cc-from','cc-to'].forEach(function(id) {
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = code + (NAMES[code] ? ' – ' + NAMES[code] : '');
        document.getElementById(id).appendChild(opt);
      });
    });
    document.getElementById('cc-to').value = 'EUR';
    document.getElementById('btn-convert-cc').addEventListener('click', function() {
      if (document.getElementById('cc-from').value !== base) { fetchRates(); } else { convert(); }
    });
    document.getElementById('btn-refresh-cc').addEventListener('click', fetchRates);
    document.getElementById('cc-amount').addEventListener('input', convert);
    document.getElementById('cc-from').addEventListener('change', function() { rates = null; fetchRates(); });
    document.getElementById('cc-to').addEventListener('change', convert);
    document.getElementById('cc-swap').addEventListener('click', function() {
      var f = document.getElementById('cc-from').value;
      var t = document.getElementById('cc-to').value;
      document.getElementById('cc-from').value = t;
      document.getElementById('cc-to').value = f;
      rates = null; fetchRates();
    });
    fetchRates();
  });
})();
