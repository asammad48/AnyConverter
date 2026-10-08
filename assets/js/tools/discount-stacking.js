(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';
  var LOCALE = { en: 'en-US', da: 'da-DK', es: 'es-ES' }[LANG];

  var STR = {
    en: {
      you_pay: 'You pay', you_save: 'You save', effective_pct: 'Total discount',
      advertised_sum: 'Discounts added up', stacking_gap: 'Stacking gap',
      stacking_sentence: '{sum} sounds like the deal, but you really get {real} off.',
      vat_inside: 'VAT in the price', price_excl_vat: 'Price excluding VAT',
      sales_tax: 'Sales tax', cashback: 'Cashback', net_after_cashback: 'Net cost after cashback',
      per_unit: 'Per unit',
      step_skipped_min: 'Not applied: needs {min}, price is {price}',
      step_skipped_qty: 'Not applied: needs at least {qty} items',
      price_set_worse: 'Earlier discounts already beat this price',
      discount_exceeds: 'Discount is larger than the price — price set to 0',
      order_yours_best: 'Your order is already the best.',
      order_could_save: 'A different order would save {amount}.',
      order_too_many: 'Too many discounts to check every order.',
      order_disclaimer: 'Stores decide the order and whether coupons can be combined. Check the terms.',
      extra_needed_result: 'You need another {pct} off to reach {target}.',
      extra_needed_reached: 'You are already at or below this price.',
      single_equivalent: 'This stack equals one {pct} discount.',
      err_number: 'Enter a valid price and quantity.',
      till_diff: 'Rounding each step changes the total by {amount}.',
      copied: 'Summary copied',
      summary_text: '{price} with {steps} = {paid} ({real} off, not {sum}).',
      field_off: 'Off', field_amount: 'Amount',
      move_up: 'Move up', move_down: 'Move down', remove: 'Remove'
    },
    da: {
      you_pay: 'Du betaler', you_save: 'Du sparer', effective_pct: 'Samlet rabat',
      advertised_sum: 'Rabatterne lagt sammen', stacking_gap: 'Forskel ift. lagt sammen',
      stacking_sentence: '{sum} lyder som rabatten, men du får reelt {real} i rabat.',
      vat_inside: 'Moms i prisen', price_excl_vat: 'Pris ekskl. moms',
      sales_tax: 'Salgsskat', cashback: 'Cashback', net_after_cashback: 'Pris efter cashback',
      per_unit: 'Pr. stk.',
      step_skipped_min: 'Ikke brugt: kræver {min}, prisen er {price}',
      step_skipped_qty: 'Ikke brugt: kræver mindst {qty} stk.',
      price_set_worse: 'Tidligere rabatter giver allerede en lavere pris',
      discount_exceeds: 'Rabatten er større end prisen – prisen sat til 0',
      order_yours_best: 'Din rækkefølge er allerede den bedste.',
      order_could_save: 'En anden rækkefølge ville spare {amount}.',
      order_too_many: 'For mange rabatter til at tjekke alle rækkefølger.',
      order_disclaimer: 'Butikken bestemmer rækkefølgen, og om rabatter kan kombineres. Tjek betingelserne.',
      extra_needed_result: 'Du skal have yderligere {pct} rabat for at nå {target}.',
      extra_needed_reached: 'Du er allerede på eller under denne pris.',
      single_equivalent: 'Det svarer til én rabat på {pct}.',
      err_number: 'Indtast en gyldig pris og antal.',
      till_diff: 'Afrunding af hvert trin ændrer totalen med {amount}.',
      copied: 'Opsummering kopieret',
      summary_text: '{price} med {steps} = {paid} ({real} rabat, ikke {sum}).',
      field_off: 'Rabat', field_amount: 'Beløb',
      move_up: 'Flyt op', move_down: 'Flyt ned', remove: 'Fjern'
    },
    es: {
      you_pay: 'Pagas', you_save: 'Ahorras', effective_pct: 'Descuento total',
      advertised_sum: 'Suma de descuentos', stacking_gap: 'Diferencia por acumulación',
      stacking_sentence: '{sum} parece el descuento, pero en realidad tienes un {real}.',
      vat_inside: 'IVA incluido', price_excl_vat: 'Precio sin IVA',
      sales_tax: 'Impuesto sobre ventas', cashback: 'Cashback', net_after_cashback: 'Coste tras cashback',
      per_unit: 'Por unidad',
      step_skipped_min: 'No aplicado: requiere {min}, el precio es {price}',
      step_skipped_qty: 'No aplicado: requiere al menos {qty} unidades',
      price_set_worse: 'Los descuentos anteriores ya mejoran este precio',
      discount_exceeds: 'El descuento supera el precio: precio a 0',
      order_yours_best: 'Tu orden ya es el mejor.',
      order_could_save: 'Otro orden te ahorraría {amount}.',
      order_too_many: 'Demasiados descuentos para comprobar cada orden.',
      order_disclaimer: 'La tienda decide el orden y si los cupones se pueden combinar. Revisa las condiciones.',
      extra_needed_result: 'Necesitas un {pct} más de descuento para llegar a {target}.',
      extra_needed_reached: 'Ya estás en o por debajo de este precio.',
      single_equivalent: 'Equivale a un único descuento del {pct}.',
      err_number: 'Introduce un precio y una cantidad válidos.',
      till_diff: 'Redondear cada paso cambia el total en {amount}.',
      copied: 'Resumen copiado',
      summary_text: '{price} con {steps} = {paid} ({real} de descuento, no {sum}).',
      field_off: 'Descuento', field_amount: 'Importe',
      move_up: 'Subir', move_down: 'Bajar', remove: 'Eliminar'
    }
  }[LANG];

  var STEP_LABEL = {
    en: { pct: '% off', fixed: 'Amount off', pct_cap: '% off, up to a max', pct_min: '% off above a minimum spend', fixed_min: 'Amount off above a minimum spend', price_set: 'New price', multibuy_free: 'Buy X get Y free', multibuy_nth: 'Nth item % off', qty_pct: '% off when buying at least', cashback_pct: 'Cashback %', cashback_fixed: 'Cashback amount' },
    da: { pct: '% rabat', fixed: 'Beløb i rabat', pct_cap: '% rabat, maks. beløb', pct_min: '% rabat ved køb over', fixed_min: 'Beløb i rabat ved køb over', price_set: 'Ny pris', multibuy_free: 'Køb X, få Y gratis', multibuy_nth: 'Hver N. vare % rabat', qty_pct: '% rabat ved køb af mindst', cashback_pct: 'Cashback %', cashback_fixed: 'Cashback-beløb' },
    es: { pct: '% de descuento', fixed: 'Importe de descuento', pct_cap: '% de descuento con tope', pct_min: '% de descuento a partir de', fixed_min: 'Descuento fijo a partir de', price_set: 'Precio nuevo', multibuy_free: 'Compra X y llévate Y gratis', multibuy_nth: 'N.ª unidad con % de descuento', qty_pct: '% de descuento comprando al menos', cashback_pct: 'Cashback %', cashback_fixed: 'Importe de cashback' }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function round(n, dp) { var f = Math.pow(10, dp == null ? 2 : dp); return Math.round((n + (n >= 0 ? 1 : -1) * 1e-9) * f) / f; }
  function fmt(n) { return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).format(round(n, 2)); }
  function fmtPct(n) { return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: true }).format(round(n, 2)) + '%'; }

  function parseLocaleNumber(str) {
    if (str == null) return NaN;
    str = String(str).trim().replace(/[^0-9.,\-]/g, '');
    if (!str) return NaN;
    if (LANG === 'en') str = str.replace(/,/g, '');
    else str = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(str);
  }

  function val(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    return parseLocaleNumber(el.value);
  }

  var steps = [
    { type: 'pct', pct: 20 },
    { type: 'pct', pct: 10 }
  ];

  function fieldsFor(step) {
    switch (step.type) {
      case 'pct': return [{ k: 'pct', label: STEP_LABEL.pct, v: step.pct }];
      case 'fixed': return [{ k: 'amount', label: STEP_LABEL.fixed, v: step.amount }];
      case 'pct_cap': return [{ k: 'pct', label: '%', v: step.pct }, { k: 'cap', label: STEP_LABEL.pct_cap, v: step.cap }];
      case 'pct_min': return [{ k: 'pct', label: '%', v: step.pct }, { k: 'min', label: STEP_LABEL.pct_min, v: step.min }];
      case 'fixed_min': return [{ k: 'amount', label: t('field_off'), v: step.amount }, { k: 'min', label: STEP_LABEL.fixed_min, v: step.min }];
      case 'price_set': return [{ k: 'price', label: STEP_LABEL.price_set, v: step.price }];
      case 'multibuy_free': return [{ k: 'x', label: 'X', v: step.x }, { k: 'y', label: 'Y', v: step.y }];
      case 'multibuy_nth': return [{ k: 'n', label: 'N', v: step.n }, { k: 'pct', label: '%', v: step.pct }];
      case 'qty_pct': return [{ k: 'qty', label: STEP_LABEL.qty_pct, v: step.qty }, { k: 'pct', label: '%', v: step.pct }];
      case 'cashback_pct': return [{ k: 'pct', label: '%', v: step.pct }];
      case 'cashback_fixed': return [{ k: 'amount', label: t('field_amount'), v: step.amount }];
    }
    return [];
  }

  function defaultsFor(type) {
    switch (type) {
      case 'pct': return { type: type, pct: 10 };
      case 'fixed': return { type: type, amount: 10 };
      case 'pct_cap': return { type: type, pct: 20, cap: 30 };
      case 'pct_min': return { type: type, pct: 10, min: 50 };
      case 'fixed_min': return { type: type, amount: 10, min: 50 };
      case 'price_set': return { type: type, price: 100 };
      case 'multibuy_free': return { type: type, x: 2, y: 1 };
      case 'multibuy_nth': return { type: type, n: 2, pct: 50 };
      case 'qty_pct': return { type: type, qty: 3, pct: 10 };
      case 'cashback_pct': return { type: type, pct: 5 };
      case 'cashback_fixed': return { type: type, amount: 5 };
    }
    return { type: 'pct', pct: 10 };
  }

  function renderSteps() {
    var wrap = document.getElementById('ds-steps');
    if (!wrap) return;
    wrap.innerHTML = '';
    steps.forEach(function (step, idx) {
      var row = document.createElement('div');
      row.className = 'ds-step-row';
      row.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid var(--color-border,#DDD8D0)';

      var typeSel = document.createElement('select');
      typeSel.className = 'ss-opt-select';
      typeSel.style.cssText = 'min-width:170px;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:8px;font-size:13px';
      Object.keys(STEP_LABEL).forEach(function (k) {
        var o = document.createElement('option');
        o.value = k; o.textContent = STEP_LABEL[k];
        if (k === step.type) o.selected = true;
        typeSel.appendChild(o);
      });
      typeSel.addEventListener('change', function () {
        steps[idx] = defaultsFor(typeSel.value);
        renderSteps();
        compute();
      });
      row.appendChild(typeSel);

      fieldsFor(step).forEach(function (f) {
        var inp = document.createElement('input');
        inp.type = 'text'; inp.inputMode = 'decimal'; inp.autocomplete = 'off';
        inp.placeholder = f.label;
        inp.setAttribute('aria-label', f.label);
        inp.value = f.v != null ? f.v : '';
        inp.style.cssText = 'width:90px;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:8px;font-size:13px';
        inp.addEventListener('input', function () {
          steps[idx][f.k] = parseLocaleNumber(inp.value);
          compute();
        });
        row.appendChild(inp);
      });

      var upBtn = document.createElement('button');
      upBtn.className = 'ac-btn'; upBtn.type = 'button'; upBtn.textContent = '↑'; upBtn.title = t('move_up');
      upBtn.disabled = idx === 0;
      upBtn.addEventListener('click', function () {
        if (idx > 0) { var tmp = steps[idx - 1]; steps[idx - 1] = steps[idx]; steps[idx] = tmp; renderSteps(); compute(); }
      });
      row.appendChild(upBtn);

      var downBtn = document.createElement('button');
      downBtn.className = 'ac-btn'; downBtn.type = 'button'; downBtn.textContent = '↓'; downBtn.title = t('move_down');
      downBtn.disabled = idx === steps.length - 1;
      downBtn.addEventListener('click', function () {
        if (idx < steps.length - 1) { var tmp = steps[idx + 1]; steps[idx + 1] = steps[idx]; steps[idx] = tmp; renderSteps(); compute(); }
      });
      row.appendChild(downBtn);

      var rmBtn = document.createElement('button');
      rmBtn.className = 'ac-btn'; rmBtn.type = 'button'; rmBtn.textContent = '✕'; rmBtn.title = t('remove');
      rmBtn.addEventListener('click', function () { steps.splice(idx, 1); renderSteps(); compute(); });
      row.appendChild(rmBtn);

      wrap.appendChild(row);
    });
  }

  function runSteps(list, price, qty) {
    var v = price * qty;
    var rows = [];
    var cashbackSpecs = [];
    list.forEach(function (step) {
      var before = v, amount = 0, note = '', skipped = false;
      switch (step.type) {
        case 'pct':
          amount = v * (step.pct || 0) / 100; v -= amount; break;
        case 'fixed':
          amount = Math.min(step.amount || 0, v);
          if ((step.amount || 0) > before) note = t('discount_exceeds');
          v -= amount; break;
        case 'pct_cap':
          amount = Math.min(v * (step.pct || 0) / 100, step.cap != null ? step.cap : Infinity); v -= amount; break;
        case 'pct_min':
          if (v >= (step.min || 0)) { amount = v * (step.pct || 0) / 100; v -= amount; }
          else { note = t('step_skipped_min', { min: fmt(step.min || 0), price: fmt(v) }); skipped = true; }
          break;
        case 'fixed_min':
          if (v >= (step.min || 0)) { amount = Math.min(step.amount || 0, v); v -= amount; }
          else { note = t('step_skipped_min', { min: fmt(step.min || 0), price: fmt(v) }); skipped = true; }
          break;
        case 'price_set':
          if (step.price != null && step.price < v) { amount = v - step.price; v = step.price; }
          else { note = t('price_set_worse'); skipped = true; }
          break;
        case 'multibuy_free': {
          var xy = (step.x || 0) + (step.y || 0);
          if (xy <= 0 || qty < xy) { note = t('step_skipped_qty', { qty: xy }); skipped = true; break; }
          var free = Math.floor(qty / xy) * (step.y || 0);
          var unit = v / qty;
          amount = free * unit; v -= amount; break;
        }
        case 'multibuy_nth': {
          if (!step.n || qty < step.n) { note = t('step_skipped_qty', { qty: step.n || 0 }); skipped = true; break; }
          var units = Math.floor(qty / step.n);
          var unitP = v / qty;
          amount = units * unitP * (step.pct || 0) / 100; v -= amount; break;
        }
        case 'qty_pct':
          if (qty >= (step.qty || 0)) { amount = v * (step.pct || 0) / 100; v -= amount; }
          else { note = t('step_skipped_qty', { qty: step.qty || 0 }); skipped = true; }
          break;
        case 'cashback_pct':
        case 'cashback_fixed':
          cashbackSpecs.push(step); break;
      }
      if (v < 0) v = 0;
      rows.push({ step: step, before: before, amount: amount, after: v, note: note, skipped: skipped });
    });
    return { v: v, rows: rows, cashbackSpecs: cashbackSpecs };
  }

  function computeTax(v, shipping, taxMode, rate) {
    var paid, vatInside = 0, priceExclVat = 0, salesTax = 0;
    if (taxMode === 'vi') {
      paid = v + shipping;
      vatInside = paid * rate / (100 + rate);
      priceExclVat = paid - vatInside;
    } else if (taxMode === 'st') {
      salesTax = v * rate / 100;
      paid = v + shipping + salesTax;
    } else {
      paid = v + shipping;
    }
    return { paid: paid, vatInside: vatInside, priceExclVat: priceExclVat, salesTax: salesTax };
  }

  function permute(arr) {
    if (arr.length <= 1) return [arr];
    var result = [];
    arr.forEach(function (item, i) {
      var rest = arr.slice(0, i).concat(arr.slice(i + 1));
      permute(rest).forEach(function (p) { result.push([item].concat(p)); });
    });
    return result;
  }

  function orderAnalysis(list, price, qty) {
    var pctSteps = list.filter(function (s) { return s.type === 'pct'; });
    var otherSteps = list.filter(function (s) { return s.type !== 'pct' && s.type !== 'cashback_pct' && s.type !== 'cashback_fixed'; });
    if (otherSteps.length === 0) return null;
    var block = pctSteps.length ? [{ type: 'pctBlock', steps: pctSteps }] : [];
    var items = block.concat(otherSteps);
    if (items.length > 6) return { tooMany: true };
    function expand(seq) {
      var out = [];
      seq.forEach(function (it) { if (it.type === 'pctBlock') out = out.concat(it.steps); else out.push(it); });
      return out;
    }
    var perms = permute(items);
    var yourResult = runSteps(list, price, qty).v;
    var best = null, worst = null;
    perms.forEach(function (p) {
      var seq = expand(p);
      var r = runSteps(seq, price, qty).v;
      if (best === null || r < best.v) best = { v: r, seq: seq };
      if (worst === null || r > worst.v) worst = { v: r, seq: seq };
    });
    return { best: best, worst: worst, yours: yourResult, tooMany: false };
  }

  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function show(id, on) { var el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }

  function compute() {
    var price = val('ds-price'), qty = val('ds-qty'), shipping = val('ds-shipping');
    if (isNaN(shipping)) shipping = 0;
    if (isNaN(qty) || qty <= 0) qty = 1;
    if (isNaN(price) || price < 0) { showError(t('err_number')); return; }
    showError(null);

    var taxModeEl = document.querySelector('input[name="ds-tax"]:checked');
    var taxMode = taxModeEl ? taxModeEl.value : 'none';
    var rate = val('ds-tax-rate');
    if (isNaN(rate)) rate = 0;

    var run = runSteps(steps, price, qty);
    var tax = computeTax(run.v, shipping, taxMode, rate);

    var cashback = 0;
    run.cashbackSpecs.forEach(function (c) {
      if (c.type === 'cashback_pct') cashback += tax.paid * (c.pct || 0) / 100;
      else cashback += (c.amount || 0);
    });
    var netAfterCashback = tax.paid - cashback;

    var originalTotal = price * qty;
    var savedBeforeTax = originalTotal - run.v;
    var effectivePct = originalTotal > 0 ? (savedBeforeTax / originalTotal) * 100 : 0;

    var pctSteps = steps.filter(function (s) { return s.type === 'pct'; });
    var advertisedSum = pctSteps.reduce(function (a, s) { return a + (s.pct || 0); }, 0);
    var gap = 0;
    if (pctSteps.length >= 2) {
      gap = (originalTotal * advertisedSum / 100) - savedBeforeTax;
    }

    setText('ds-pay', fmt(tax.paid));
    setText('ds-save', fmt(originalTotal - tax.paid + (tax.salesTax || 0)));
    setText('ds-save-pct', fmtPct(effectivePct));
    setText('ds-per-unit', fmt(tax.paid / qty));

    show('ds-advertised-row', pctSteps.length >= 2);
    if (pctSteps.length >= 2) {
      setText('ds-advertised', fmtPct(advertisedSum));
      show('ds-gap-row', gap > 0.005);
      if (gap > 0.005) {
        setText('ds-gap', fmt(gap));
        setText('ds-gap-sentence', t('stacking_sentence', { sum: fmtPct(advertisedSum), real: fmtPct(effectivePct) }));
      }
    }

    show('ds-vat-row', taxMode === 'vi');
    if (taxMode === 'vi') { setText('ds-vat-inside', fmt(tax.vatInside)); setText('ds-price-excl-vat', fmt(tax.priceExclVat)); }
    show('ds-tax-row', taxMode === 'st');
    if (taxMode === 'st') setText('ds-sales-tax', fmt(tax.salesTax));

    show('ds-cashback-row', cashback > 0);
    if (cashback > 0) { setText('ds-cashback', fmt(cashback)); setText('ds-net-after-cashback', fmt(netAfterCashback)); }

    var tbody = document.getElementById('ds-table-body');
    if (tbody) {
      tbody.innerHTML = '';
      run.rows.forEach(function (r, i) {
        var tr = document.createElement('tr');
        var label = STEP_LABEL[r.step.type] || r.step.type;
        tr.innerHTML = '<td>' + (i + 1) + '. ' + label + '</td><td>' + fmt(r.before) + '</td><td>' + (r.amount ? '-' + fmt(r.amount) : '—') + '</td><td>' + fmt(r.after) + '</td><td>' + (r.note || '') + '</td>';
        tbody.appendChild(tr);
      });
    }

    var oa = orderAnalysis(steps, price, qty);
    var oaEl = document.getElementById('ds-order-result');
    if (oaEl) {
      if (!oa) { oaEl.textContent = ''; }
      else if (oa.tooMany) { oaEl.textContent = t('order_too_many'); }
      else {
        var diff = oa.yours - oa.best.v;
        oaEl.textContent = diff <= 0.005 ? t('order_yours_best') : t('order_could_save', { amount: fmt(diff) });
      }
    }

    var target = val('ds-target-price');
    var extraEl = document.getElementById('ds-extra-result');
    if (extraEl) {
      if (!isNaN(target) && target > 0) {
        if (target >= run.v) extraEl.textContent = t('extra_needed_reached');
        else {
          var extraPct = (1 - target / run.v) * 100;
          extraEl.textContent = t('extra_needed_result', { pct: fmtPct(extraPct), target: fmt(target) });
        }
      } else extraEl.textContent = '';
    }

    setText('ds-single-equivalent', t('single_equivalent', { pct: fmtPct(effectivePct) }));

    show('ds-result', true);
  }

  function showError(msg) {
    var el = document.getElementById('ds-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; } else el.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderSteps();
    ['ds-price', 'ds-qty', 'ds-shipping', 'ds-tax-rate', 'ds-target-price'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', compute);
    });
    document.querySelectorAll('input[name="ds-tax"]').forEach(function (r) { r.addEventListener('change', compute); });

    var addBtn = document.getElementById('ds-add-step');
    if (addBtn) addBtn.addEventListener('click', function () {
      if (steps.length >= 20) return;
      steps.push(defaultsFor('pct'));
      renderSteps(); compute();
    });

    var resetBtn = document.getElementById('btn-reset-ds');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      steps = [{ type: 'pct', pct: 20 }, { type: 'pct', pct: 10 }];
      document.getElementById('ds-price').value = '';
      document.getElementById('ds-qty').value = '1';
      document.getElementById('ds-shipping').value = '';
      renderSteps(); compute();
    });

    var copyBtn = document.getElementById('ds-btn-copy-summary');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var price = val('ds-price'), qty = val('ds-qty');
      if (isNaN(price)) return;
      var run = runSteps(steps, price, qty || 1);
      var pctSteps = steps.filter(function (s) { return s.type === 'pct'; });
      var advertisedSum = pctSteps.reduce(function (a, s) { return a + (s.pct || 0); }, 0);
      var originalTotal = price * (qty || 1);
      var effectivePct = originalTotal > 0 ? ((originalTotal - run.v) / originalTotal) * 100 : 0;
      var stepsText = steps.map(function (s) { return (STEP_LABEL[s.type] || s.type) + (s.pct != null ? ' ' + s.pct + '%' : ''); }).join(', ');
      var text = t('summary_text', { price: fmt(price), steps: stepsText, paid: fmt(run.v), real: fmtPct(effectivePct), sum: fmtPct(advertisedSum) });
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
        var status = document.getElementById('ds-copy-status');
        if (status) { status.textContent = t('copied'); setTimeout(function () { status.textContent = ''; }, 2000); }
      });
    });

    var useBestBtn = document.getElementById('ds-use-best-order');
    if (useBestBtn) useBestBtn.addEventListener('click', function () {
      var price = val('ds-price'), qty = val('ds-qty');
      var oa = orderAnalysis(steps, price || 0, qty || 1);
      if (oa && !oa.tooMany && oa.best) {
        var cashbackOnly = steps.filter(function (s) { return s.type === 'cashback_pct' || s.type === 'cashback_fixed'; });
        steps = oa.best.seq.concat(cashbackOnly);
        renderSteps(); compute();
      }
    });

    compute();
  });
})();

/* Successive discounts quick mode: 1 − (1 − d₁)(1 − d₂)…(1 − dₙ). */
(function () {
  var out = document.getElementById('sd-out');
  if (!out) return;
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  var LOCALE = { en: 'en-US', da: 'da-DK', es: 'es-ES' }[LANG] || 'en-US';
  var PCT = LANG === 'en' ? '%' : ' %';
  function fmt(n, d) { return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n); }
  function money(n) { return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
  function parse(s) {
    s = String(s || '').trim().replace(/\s/g, '');
    if (LANG !== 'en') s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/,/g, '');
    var n = Number(s);
    return s !== '' && isFinite(n) ? n : NaN;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function tile(k, v) { return '<div class="calc-tile"><span class="calc-tile-lbl">' + esc(k) + '</span><span class="calc-tile-val">' + esc(v) + '</span></div>'; }
  function run() {
    /* Discounts are separated by ';', '+', '/' or whitespace, and by ',' in English (comma is the decimal mark in es/da). */
    var raw = document.getElementById('sd-list').value, sep = LANG === 'en' ? /[\s,;+\/]+/ : /[\s;+\/]+|,\s+/;
    var ds = raw.split(sep).map(function (x) { return parse(x.replace('%', '')); }).filter(function (n) { return isFinite(n) && n >= 0 && n <= 100; });
    if (!ds.length) { out.innerHTML = ''; return; }
    var price = parse(document.getElementById('sd-price').value), keep = 1, steps = [];
    ds.forEach(function (d) { keep *= 1 - d / 100; if (price > 0) steps.push(tile(out.getAttribute('data-step').replace('{d}', fmt(d, 2)), money(price * keep))); });
    var html = tile(out.getAttribute('data-eq'), fmt((1 - keep) * 100, 3) + PCT) + tile(out.getAttribute('data-sum'), fmt(ds.reduce(function (a, b) { return a + b; }, 0), 2) + PCT);
    if (price > 0) html += tile(out.getAttribute('data-pay'), money(price * keep)) + steps.join('');
    out.innerHTML = html;
  }
  ['sd-list', 'sd-price'].forEach(function (id) { document.getElementById(id).addEventListener('input', run); });
  run();
})();
