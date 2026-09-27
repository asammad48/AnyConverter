(function() {
  var isDa = /^\/da\//.test(location.pathname);
  function fmt(n) {
    if (isDa) return n.toLocaleString('da-DK', { maximumFractionDigits: 0 }) + ' kr.';
    return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
  }

  function ensureEnhancements() {
    var result = document.getElementById('mort-result');
    if (!result || document.getElementById('mort-breakdown')) return;
    var panel = document.createElement('div');
    panel.id = 'mort-breakdown';
    panel.className = 'ac-result-panel';
    panel.innerHTML = '<div class="ac-result-kicker">' + (isDa ? 'Lånets fordeling' : 'Loan breakdown') + '</div><div class="mort-bar"><span id="mort-bar-principal"></span><span id="mort-bar-interest"></span></div><div class="mort-legend"><span><i style="background:#2f7a4b"></i>' + (isDa ? 'Hovedstol' : 'Principal') + '</span><span><i style="background:#b5412b"></i>' + (isDa ? 'Renter' : 'Interest') + '</span></div><div class="ac-card-grid"><div><strong id="mort-down-pct">—</strong><span>' + (isDa ? 'Udbetaling' : 'Down payment') + '</span></div><div><strong id="mort-payments">—</strong><span>' + (isDa ? 'Betalinger' : 'Payments') + '</span></div><div><strong id="mort-payoff">—</strong><span>' + (isDa ? 'Forventet slutår' : 'Payoff year') + '</span></div></div><details class="mort-schedule"><summary>' + (isDa ? 'Vis første års betalingsplan' : 'Show first-year schedule') + '</summary><div id="mort-schedule-table"></div></details>';
    result.appendChild(panel);
  }

  function buildSchedule(P, r, monthly, months) {
    var balance = P;
    var rows = [];
    for (var i = 1; i <= Math.min(12, months); i++) {
      var interest = balance * r;
      var principal = monthly - interest;
      balance = Math.max(0, balance - principal);
      rows.push({ month: i, principal: principal, interest: interest, balance: balance });
    }
    return rows;
  }

  function calcMortgage() {
    var price = parseFloat(document.getElementById('mort-price').value);
    var down = parseFloat(document.getElementById('mort-down').value) || 0;
    var rate = parseFloat(document.getElementById('mort-rate').value);
    var years = parseInt(document.getElementById('mort-term').value, 10);
    if (!price || !rate || !years || price <= 0 || rate <= 0) return;
    var P = price - down;
    if (P <= 0) return;
    var r = rate / 100 / 12;
    var n = years * 12;
    var monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var totalPayment = monthly * n;
    var totalInterest = totalPayment - P;
    document.getElementById('mort-monthly').textContent = fmt(monthly);
    document.getElementById('mort-principal').textContent = fmt(P);
    document.getElementById('mort-interest-total').textContent = fmt(totalInterest);
    document.getElementById('mort-total').textContent = fmt(totalPayment + down);
    document.getElementById('mort-result').style.display = 'block';
    ensureEnhancements();
    var principalPct = totalPayment > 0 ? (P / totalPayment) * 100 : 0;
    document.getElementById('mort-bar-principal').style.width = principalPct + '%';
    document.getElementById('mort-bar-interest').style.width = (100 - principalPct) + '%';
    document.getElementById('mort-down-pct').textContent = ((down / price) * 100).toFixed(1) + '%';
    document.getElementById('mort-payments').textContent = n.toLocaleString(isDa ? 'da-DK' : 'en-US');
    document.getElementById('mort-payoff').textContent = String(new Date().getFullYear() + years);
    var rows = buildSchedule(P, r, monthly, n);
    var html = '<table><thead><tr><th>' + (isDa ? 'Måned' : 'Month') + '</th><th>' + (isDa ? 'Hovedstol' : 'Principal') + '</th><th>' + (isDa ? 'Rente' : 'Interest') + '</th><th>' + (isDa ? 'Restgæld' : 'Balance') + '</th></tr></thead><tbody>';
    rows.forEach(function(row) {
      html += '<tr><td>' + row.month + '</td><td>' + fmt(row.principal) + '</td><td>' + fmt(row.interest) + '</td><td>' + fmt(row.balance) + '</td></tr>';
    });
    html += '</tbody></table>';
    document.getElementById('mort-schedule-table').innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function() {
    ensureEnhancements();
    ['mort-price','mort-down','mort-rate','mort-term'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcMortgage);
      if (el) el.addEventListener('change', calcMortgage);
    });
    document.getElementById('btn-calc-mort').addEventListener('click', calcMortgage);
    document.getElementById('btn-reset-mort').addEventListener('click', function() {
      ['mort-price','mort-down','mort-rate'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('mort-result').style.display = 'none';
    });
    if (isDa && !document.getElementById('mort-scenario-chips')) {
      var action = document.getElementById('btn-calc-mort').closest('.action-bar');
      var chips = document.createElement('div');
      chips.id = 'mort-scenario-chips';
      chips.className = 'ac-chip-row';
      chips.style.margin = '0 0 16px';
      chips.innerHTML = '<button class="ac-chip" type="button" data-rate="3.5">3,5%</button><button class="ac-chip" type="button" data-rate="4.5">4,5%</button><button class="ac-chip" type="button" data-rate="5.5">5,5%</button><button class="ac-chip" type="button" data-term="15">15 år</button><button class="ac-chip" type="button" data-term="30">30 år</button>';
      action.parentElement.insertBefore(chips, action);
      chips.querySelectorAll('[data-rate]').forEach(function(btn) {
        btn.addEventListener('click', function() { document.getElementById('mort-rate').value = btn.dataset.rate; calcMortgage(); });
      });
      chips.querySelectorAll('[data-term]').forEach(function(btn) {
        btn.addEventListener('click', function() { document.getElementById('mort-term').value = btn.dataset.term; calcMortgage(); });
      });
    }
  });
})();
