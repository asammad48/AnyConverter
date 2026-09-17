(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';
  var LOCALE = { en: 'en-US', da: 'da-DK', es: 'es-ES' }[LANG];

  var STR = {
    en: {
      check: 'Check: {a} {op} {b} = {c}',
      common_mistake: 'Common mistake',
      mistake_increase: '{final} − {pct} = {wrong} (wrong — the percentage applies to the original, not the final value)',
      mistake_decrease: '{final} + {pct} = {wrong} (wrong — the percentage applies to the original, not the final value)',
      sentence_increase: '{final} is the result after a {pct} increase. The original value was {original}.',
      sentence_decrease: '{final} is the result after a {pct} decrease. The original value was {original}.',
      sentence_part: '{part} is {pct} of {whole}.',
      step1_increase: 'After a {pct} increase, the value is {kept} of the original.',
      step1_decrease: 'After a {pct} decrease, the value is {kept} of the original.',
      step2: '{kept} as a multiplier = {mult}',
      step3: '{final} ÷ {mult} = {original}',
      vat_share: 'VAT is {share} of the price including VAT.',
      sentence_vat: '{gross} including VAT becomes {net} net plus {vat} VAT.',
      margin_eq: '{x} margin ≈ {y} markup',
      markup_eq: '{x} markup ≈ {y} margin',
      sentence_whatpct_up: '{orig} became {final} — an increase of {pct}.',
      sentence_whatpct_down: '{orig} became {final} — a decrease of {pct}.',
      recover_pct: 'To get back to {orig}, you now need an increase of {pct}.',
      recover_pct_down: 'To get back to {orig}, you now need a decrease of {pct}.',
      err_100: 'After a 100% decrease the value is always 0, so the original value can’t be found.',
      err_over_100: 'A decrease can’t be more than 100%.',
      err_zero: 'Enter a percentage greater than 0.',
      err_number: 'Enter a valid number in every field.',
      rest_label: 'The rest ({pct}) is {value}.'
    },
    da: {
      check: 'Kontrol: {a} {op} {b} = {c}',
      common_mistake: 'Typisk fejl',
      mistake_increase: '{final} − {pct} = {wrong} (forkert — procenten beregnes af den oprindelige værdi, ikke af slutværdien)',
      mistake_decrease: '{final} + {pct} = {wrong} (forkert — procenten beregnes af den oprindelige værdi, ikke af slutværdien)',
      sentence_increase: '{final} er resultatet efter en stigning på {pct}. Den oprindelige værdi var {original}.',
      sentence_decrease: '{final} er resultatet efter et fald på {pct}. Den oprindelige værdi var {original}.',
      sentence_part: '{part} er {pct} af {whole}.',
      step1_increase: 'Efter en stigning på {pct} er værdien {kept} af den oprindelige.',
      step1_decrease: 'Efter et fald på {pct} er værdien {kept} af den oprindelige.',
      step2: '{kept} som faktor = {mult}',
      step3: '{final} ÷ {mult} = {original}',
      vat_share: 'Momsen udgør {share} af prisen inklusive moms.',
      sentence_vat: '{gross} inkl. moms bliver til {net} eks. moms plus {vat} i moms.',
      margin_eq: '{x} dækningsgrad ≈ {y} avance',
      markup_eq: '{x} avance ≈ {y} dækningsgrad',
      sentence_whatpct_up: '{orig} blev til {final} — en stigning på {pct}.',
      sentence_whatpct_down: '{orig} blev til {final} — et fald på {pct}.',
      recover_pct: 'For at komme tilbage til {orig} skal der nu en stigning på {pct} til.',
      recover_pct_down: 'For at komme tilbage til {orig} skal der nu et fald på {pct} til.',
      err_100: 'Efter et fald på 100% er værdien altid 0, så den oprindelige værdi kan ikke findes.',
      err_over_100: 'Et fald kan ikke være over 100%.',
      err_zero: 'Indtast en procent større end 0.',
      err_number: 'Indtast et gyldigt tal i alle felter.',
      rest_label: 'Resten ({pct}) er {value}.'
    },
    es: {
      check: 'Comprobación: {a} {op} {b} = {c}',
      common_mistake: 'Error habitual',
      mistake_increase: '{final} − {pct} = {wrong} (incorrecto — el porcentaje se calcula sobre el valor original, no sobre el final)',
      mistake_decrease: '{final} + {pct} = {wrong} (incorrecto — el porcentaje se calcula sobre el valor original, no sobre el final)',
      sentence_increase: '{final} es el resultado tras un aumento del {pct}. El valor original era {original}.',
      sentence_decrease: '{final} es el resultado tras una bajada del {pct}. El valor original era {original}.',
      sentence_part: '{part} es el {pct} de {whole}.',
      step1_increase: 'Tras un aumento del {pct}, el valor es el {kept} del original.',
      step1_decrease: 'Tras una bajada del {pct}, el valor es el {kept} del original.',
      step2: '{kept} como multiplicador = {mult}',
      step3: '{final} ÷ {mult} = {original}',
      vat_share: 'El IVA es el {share} del precio con IVA.',
      sentence_vat: '{gross} con IVA se convierte en {net} sin IVA más {vat} de IVA.',
      margin_eq: '{x} de margen ≈ {y} de markup',
      markup_eq: '{x} de markup ≈ {y} de margen',
      sentence_whatpct_up: '{orig} pasó a ser {final} — un aumento del {pct}.',
      sentence_whatpct_down: '{orig} pasó a ser {final} — una bajada del {pct}.',
      recover_pct: 'Para volver a {orig} ahora hace falta un aumento del {pct}.',
      recover_pct_down: 'Para volver a {orig} ahora hace falta una bajada del {pct}.',
      err_100: 'Tras una bajada del 100% el valor siempre es 0, así que no se puede hallar el original.',
      err_over_100: 'Una bajada no puede superar el 100%.',
      err_zero: 'Introduce un porcentaje mayor que 0.',
      err_number: 'Introduce un número válido en cada campo.',
      rest_label: 'El resto ({pct}) es {value}.'
    }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(vars[k]);
      });
    }
    return s;
  }

  function round(n, dp) {
    var f = Math.pow(10, dp);
    return Math.round((n + (n >= 0 ? 1 : -1) * 1e-9) * f) / f;
  }

  function decimals() {
    var el = document.getElementById('rp-opt-decimals');
    return el ? parseInt(el.value, 10) : 2;
  }

  function fmt(n) {
    var dp = decimals();
    return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: dp, maximumFractionDigits: dp, useGrouping: true }).format(round(n, dp));
  }

  function fmtPct(n, dp) {
    return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: dp == null ? 2 : dp, maximumFractionDigits: dp == null ? 2 : dp, useGrouping: true }).format(round(n, dp == null ? 2 : dp)) + '%';
  }

  function fmtMult(n) {
    return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 0, maximumFractionDigits: 4, useGrouping: true }).format(round(n, 4));
  }

  function parseLocaleNumber(str) {
    if (str == null) return NaN;
    str = String(str).trim().replace(/[^0-9.,\-]/g, '');
    if (!str) return NaN;
    if (LANG === 'en') {
      str = str.replace(/,/g, '');
    } else {
      str = str.replace(/\./g, '').replace(',', '.');
    }
    return parseFloat(str);
  }

  function val(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    return parseLocaleNumber(el.value);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function show(id, on) {
    var el = document.getElementById(id);
    if (el) el.style.display = on ? '' : 'none';
  }

  function showError(msg) {
    var el = document.getElementById('rp-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; }
    else { el.style.display = 'none'; }
  }

  var MODES = ['inc', 'dec', 'part', 'vat', 'margin', 'whatpct'];
  var mode = 'inc';

  function setMode(m) {
    mode = m;
    MODES.forEach(function (x) {
      var btn = document.getElementById('rp-mode-' + x);
      if (btn) { btn.className = x === m ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'; btn.setAttribute('aria-pressed', x === m ? 'true' : 'false'); }
      show('rp-form-' + x, x === m);
      show('rp-result-' + x, false);
    });
    showError(null);
  }

  function calcInc() {
    var F = val('rp1-final'), p = val('rp1-pct');
    if (isNaN(F) || isNaN(p)) { showError(t('err_number')); return; }
    var mult = 1 + p / 100;
    var O = F / mult;
    var change = F - O;
    var wrong = F - F * p / 100;
    setText('rp1-original', fmt(O));
    setText('rp1-change', fmt(change));
    setText('rp1-check', fmt(O) + ' × ' + fmtMult(mult) + ' = ' + fmt(F));
    setText('rp1-mistake', t('mistake_increase', { final: fmt(F), pct: fmtPct(p, 0), wrong: fmt(wrong) }));
    setText('rp1-sentence', t('sentence_increase', { final: fmt(F), pct: fmtPct(p, 0), original: fmt(O) }));
    setText('rp1-step1', t('step1_increase', { pct: fmtPct(p, 0), kept: fmtPct(mult * 100, 0) }));
    setText('rp1-step2', t('step2', { kept: fmtPct(mult * 100, 0), mult: fmtMult(mult) }));
    setText('rp1-step3', t('step3', { final: fmt(F), mult: fmtMult(mult), original: fmt(O) }));
    show('rp-result-inc', true);
    showError(null);
  }

  function calcDec() {
    var F = val('rp2-final'), p = val('rp2-pct');
    if (isNaN(F) || isNaN(p)) { showError(t('err_number')); return; }
    if (p === 100) { showError(t('err_100')); return; }
    if (p > 100) { showError(t('err_over_100')); return; }
    var mult = 1 - p / 100;
    var O = F / mult;
    var saved = O - F;
    var wrong = F + F * p / 100;
    setText('rp2-original', fmt(O));
    setText('rp2-change', fmt(saved));
    setText('rp2-check', fmt(O) + ' × ' + fmtMult(mult) + ' = ' + fmt(F));
    setText('rp2-mistake', t('mistake_decrease', { final: fmt(F), pct: fmtPct(p, 0), wrong: fmt(wrong) }));
    setText('rp2-sentence', t('sentence_decrease', { final: fmt(F), pct: fmtPct(p, 0), original: fmt(O) }));
    setText('rp2-step1', t('step1_decrease', { pct: fmtPct(p, 0), kept: fmtPct(mult * 100, 0) }));
    setText('rp2-step2', t('step2', { kept: fmtPct(mult * 100, 0), mult: fmtMult(mult) }));
    setText('rp2-step3', t('step3', { final: fmt(F), mult: fmtMult(mult), original: fmt(O) }));
    show('rp-result-dec', true);
    showError(null);
  }

  function calcPart() {
    var A = val('rp3-part'), p = val('rp3-pct');
    if (isNaN(A) || isNaN(p)) { showError(t('err_number')); return; }
    if (p <= 0) { showError(t('err_zero')); return; }
    var W = A / (p / 100);
    var rest = W - A;
    setText('rp3-whole', fmt(W));
    setText('rp3-rest', t('rest_label', { pct: fmtPct(100 - p, 0), value: fmt(rest) }));
    setText('rp3-check', fmtPct(p, 0) + ' × ' + fmt(W) + ' = ' + fmt(A));
    setText('rp3-sentence', t('sentence_part', { part: fmt(A), pct: fmtPct(p, 0), whole: fmt(W) }));
    show('rp-result-part', true);
    showError(null);
  }

  function calcVat() {
    var G = val('rp4-amount');
    var rateSel = document.getElementById('rp4-rate');
    var r = rateSel && rateSel.value === 'custom' ? val('rp4-custom') : parseFloat(rateSel ? rateSel.value : NaN);
    if (isNaN(G) || isNaN(r)) { showError(t('err_number')); return; }
    var reverse = document.getElementById('rp4-reverse') && document.getElementById('rp4-reverse').checked;
    var dp = decimals();
    var net, vatAmt, gross;
    if (reverse) {
      net = G;
      vatAmt = round(net * r / 100, dp);
      gross = net + vatAmt;
    } else {
      gross = G;
      net = round(gross / (1 + r / 100), dp);
      vatAmt = gross - net;
    }
    var share = r / (100 + r) * 100;
    setText('rp4-net', fmt(net));
    setText('rp4-vat', fmt(vatAmt));
    setText('rp4-gross', fmt(gross));
    setText('rp4-share', t('vat_share', { share: fmtPct(share, 2) }));
    setText('rp4-sentence', t('sentence_vat', { gross: fmt(gross), net: fmt(net), vat: fmt(vatAmt) }));
    show('rp-result-vat', true);
    showError(null);
  }

  function calcMargin() {
    var P = val('rp5-price'), x = val('rp5-pct');
    if (isNaN(P) || isNaN(x)) { showError(t('err_number')); return; }
    var costMargin = P * (1 - x / 100);
    var costMarkup = P / (1 + x / 100);
    var profitMargin = P - costMargin;
    var profitMarkup = P - costMarkup;
    var markupEquiv = x / (100 - x) * 100;
    var marginEquiv = x / (100 + x) * 100;
    setText('rp5-cost-margin', fmt(costMargin));
    setText('rp5-profit-margin', fmt(profitMargin));
    setText('rp5-cost-markup', fmt(costMarkup));
    setText('rp5-profit-markup', fmt(profitMarkup));
    setText('rp5-eq1', t('margin_eq', { x: fmtPct(x, 0), y: fmtPct(markupEquiv, 2) }));
    setText('rp5-eq2', t('markup_eq', { x: fmtPct(x, 0), y: fmtPct(marginEquiv, 2) }));
    var type = document.querySelector('input[name="rp5-type"]:checked');
    var emphMargin = !type || type.value === 'margin';
    var cardMargin = document.getElementById('rp5-card-margin');
    var cardMarkup = document.getElementById('rp5-card-markup');
    if (cardMargin) cardMargin.style.opacity = emphMargin ? '1' : '0.55';
    if (cardMarkup) cardMarkup.style.opacity = emphMargin ? '0.55' : '1';
    show('rp-result-margin', true);
    showError(null);
  }

  function calcWhatPct() {
    var O = val('rp6-orig'), F = val('rp6-final');
    if (isNaN(O) || isNaN(F) || O === 0) { showError(t('err_number')); return; }
    var change = (F / O - 1) * 100;
    var recover = (O / F - 1) * 100;
    var up = change >= 0;
    setText('rp6-pct', (up ? '+' : '') + fmtPct(change, 2));
    setText('rp6-sentence', t(up ? 'sentence_whatpct_up' : 'sentence_whatpct_down', { orig: fmt(O), final: fmt(F), pct: fmtPct(Math.abs(change), 2) }));
    setText('rp6-recover', t(recover >= 0 ? 'recover_pct' : 'recover_pct_down', { orig: fmt(O), pct: fmtPct(Math.abs(recover), 2) }));
    show('rp-result-whatpct', true);
    showError(null);
  }

  var CALC = { inc: calcInc, dec: calcDec, part: calcPart, vat: calcVat, margin: calcMargin, whatpct: calcWhatPct };

  function calculate() {
    (CALC[mode] || calcInc)();
  }

  function resetAll() {
    document.querySelectorAll('.tool-zone input[type="text"]').forEach(function (i) { i.value = ''; });
    MODES.forEach(function (m) { show('rp-result-' + m, false); });
    showError(null);
  }

  document.addEventListener('DOMContentLoaded', function () {
    MODES.forEach(function (m) {
      var btn = document.getElementById('rp-mode-' + m);
      if (btn) btn.addEventListener('click', function () { setMode(m); });
    });
    var rateSel = document.getElementById('rp4-rate');
    if (rateSel) {
      show('rp4-custom-wrap', rateSel.value === 'custom');
      rateSel.addEventListener('change', function () {
        show('rp4-custom-wrap', rateSel.value === 'custom');
      });
    }
    var calcBtn = document.getElementById('btn-calc-rp');
    if (calcBtn) calcBtn.addEventListener('click', calculate);
    var resetBtn = document.getElementById('btn-reset-rp');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    document.querySelectorAll('.tool-zone input[type="text"]').forEach(function (i) {
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter') calculate(); });
    });
    var decSel = document.getElementById('rp-opt-decimals');
    if (decSel) decSel.addEventListener('change', function () { if (document.getElementById('rp-result-' + mode).style.display !== 'none') calculate(); });
    setMode('inc');
  });
})();
