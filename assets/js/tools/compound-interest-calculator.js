/**
 * AnyConverter — Advanced Compound Interest & Investment Growth Engine
 * Supports: Beginner & Advanced Modes, Regular Recurring Deposits (Annuity Due vs Ordinary),
 * Annual Contribution Escalation, Real Inflation Adjustments, Effective Annual Rate (EAR / APY),
 * Target Savings Goal Solver, Annual Projection Schedules & CSV Export.
 * Fully localized for EN, ES, DA.
 */
(function() {
  'use strict';

  var LANG = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang ? document.documentElement.lang : 'en').split('-')[0].toLowerCase();
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  var I18N = {
    en: {
      modeBeginner: 'Beginner Mode',
      modeAdvanced: 'Advanced & Inflation Options',
      currency: 'Currency',
      initialPrincipal: 'Initial Starting Balance',
      annualRate: 'Estimated Annual Return (%)',
      timeHorizon: 'Investment Horizon (Years)',
      compoundingFreq: 'Compounding Frequency',
      freqDaily: 'Daily (365/yr)',
      freqMonthly: 'Monthly (12/yr)',
      freqQuarterly: 'Quarterly (4/yr)',
      freqSemiAnnually: 'Semi-Annually (2/yr)',
      freqAnnually: 'Annually (1/yr)',
      contribTitle: 'Recurring Contributions & Deposits',
      contribAmount: 'Contribution Amount',
      contribFreq: 'Contribution Frequency',
      contribMonthly: 'Monthly',
      contribAnnually: 'Annually',
      contribTiming: 'Deposit Timing',
      timingEnd: 'End of Period (Ordinary)',
      timingBegin: 'Beginning of Period (Annuity Due)',
      contribGrowth: 'Annual Deposit Step-Up (% / yr)',
      inflationTitle: 'Purchasing Power & Goal Solver',
      inflationRate: 'Expected Inflation Rate (% / yr)',
      goalTarget: 'Target Savings Goal (Optional)',
      calculateBtn: 'Calculate Growth',
      resetBtn: 'Reset',
      downloadCsvBtn: 'Download CSV Projection',
      printBtn: 'Print Summary',
      finalBalance: 'Final Nominal Balance',
      realBalance: 'Inflation-Adjusted Purchasing Power',
      totalEarned: 'Total Compound Interest',
      totalContributed: 'Total Deposits Added',
      earApy: 'Effective Annual Rate (APY)',
      growthMultiplier: 'Total Return Multiplier',
      scheduleTitle: 'Year-by-Year Growth Projection',
      colYear: 'Year',
      colOpening: 'Opening Balance',
      colDeposits: 'Annual Deposits',
      colInterest: 'Interest Earned',
      colClosing: 'Ending Balance',
      colRealBalance: 'Real Value (CPI Adjusted)',
      chartPrincipal: 'Starting Principal',
      chartDeposits: 'Total Contributions',
      chartInterest: 'Compound Interest',
      goalRequired: 'To reach {goal} in {years} years at {rate}%, you need an initial deposit of {init} or a monthly contribution of {monthly}.'
    },
    es: {
      modeBeginner: 'Modo Principiante',
      modeAdvanced: 'Opciones Avanzadas e Inflación',
      currency: 'Moneda',
      initialPrincipal: 'Capital inicial invertido',
      annualRate: 'Rentabilidad anual estimada (%)',
      timeHorizon: 'Plazo de inversión (Años)',
      compoundingFreq: 'Frecuencia de capitalización',
      freqDaily: 'Diaria (365/año)',
      freqMonthly: 'Mensual (12/año)',
      freqQuarterly: 'Trimestral (4/año)',
      freqSemiAnnually: 'Semestral (2/año)',
      freqAnnually: 'Anual (1/año)',
      contribTitle: 'Aportaciones Periódicas',
      contribAmount: 'Importe de la aportación',
      contribFreq: 'Frecuencia de aportación',
      contribMonthly: 'Mensual',
      contribAnnually: 'Anual',
      contribTiming: 'Momento del depósito',
      timingEnd: 'Final de periodo (Vencida)',
      timingBegin: 'Inicio de periodo (Anticipada)',
      contribGrowth: 'Incremento anual de aportación (%/año)',
      inflationTitle: 'Poder Adquisitivo y Objetivo de Ahorro',
      inflationRate: 'Tasa de inflación esperada (%/año)',
      goalTarget: 'Objetivo de ahorro (Opcional)',
      calculateBtn: 'Calcular Crecimiento',
      resetBtn: 'Restablecer',
      downloadCsvBtn: 'Descargar Tabla CSV',
      printBtn: 'Imprimir Resumen',
      finalBalance: 'Saldo final nominal',
      realBalance: 'Poder adquisitivo real (Ajustado por inflación)',
      totalEarned: 'Interés compuesto acumulado',
      totalContributed: 'Total aportaciones añadidas',
      earApy: 'Tasa Anual Efectiva (TAE)',
      growthMultiplier: 'Multiplicador de retorno',
      scheduleTitle: 'Proyección de Crecimiento Año a Año',
      colYear: 'Año',
      colOpening: 'Saldo Inicial',
      colDeposits: 'Aportaciones',
      colInterest: 'Interés Generado',
      colClosing: 'Saldo Final',
      colRealBalance: 'Valor Real Ajustado',
      chartPrincipal: 'Capital inicial',
      chartDeposits: 'Aportaciones',
      chartInterest: 'Interés compuesto',
      goalRequired: 'Para alcanzar {goal} en {years} años al {rate}%, necesitas un depósito inicial de {init} o una aportación mensual de {monthly}.'
    },
    da: {
      modeBeginner: 'Begyndertilstand',
      modeAdvanced: 'Avancerede Valgmuligheder og Inflation',
      currency: 'Valuta',
      initialPrincipal: 'Startkapital',
      annualRate: 'Forventet årligt afkast (%)',
      timeHorizon: 'Investeringshorisont (År)',
      compoundingFreq: 'Rentetilskrivning',
      freqDaily: 'Dagligt (365/år)',
      freqMonthly: 'Månedligt (12/år)',
      freqQuarterly: 'Kvartalsvis (4/år)',
      freqSemiAnnually: 'Halvårligt (2/år)',
      freqAnnually: 'Årligt (1/år)',
      contribTitle: 'Løbende Indbetalinger',
      contribAmount: 'Indbetalingsbeløb',
      contribFreq: 'Indbetalingsfrekvens',
      contribMonthly: 'Månedlig',
      contribAnnually: 'Årlig',
      contribTiming: 'Tidspunkt for indbetaling',
      timingEnd: 'Sidst i perioden',
      timingBegin: 'Først i perioden',
      contribGrowth: 'Årlig stigning i indbetaling (%/år)',
      inflationTitle: 'Købekraft og Opsparingsmål',
      inflationRate: 'Forventet årlig inflation (%)',
      goalTarget: 'Opsparingsmål (Valgfrit)',
      calculateBtn: 'Beregn Vækst',
      resetBtn: 'Nulstil',
      downloadCsvBtn: 'Download CSV-prognose',
      printBtn: 'Udskriv oversigt',
      finalBalance: 'Nominel slutsaldo',
      realBalance: 'Reel købekraft (Inflationskorrigeret)',
      totalEarned: 'Samlede renters rente',
      totalContributed: 'Samlede indbetalinger',
      earApy: 'Effektiv årlig rente (ÅOP/APY)',
      growthMultiplier: 'Samlet afkastfaktor',
      scheduleTitle: 'Årlig Vækstoversigt',
      colYear: 'År',
      colOpening: 'Startsaldo',
      colDeposits: 'Indbetalinger',
      colInterest: 'Renter tilskrevet',
      colClosing: 'Slutsaldo',
      colRealBalance: 'Købekraft justeret',
      chartPrincipal: 'Startbeløb',
      chartDeposits: 'Indbetalinger',
      chartInterest: 'Renters rente',
      goalRequired: 'For at nå {goal} om {years} år ved {rate}% i afkast, kræves et startbeløb på {init} eller en månedlig opsparing på {monthly}.'
    }
  };

  var T = I18N[LANG];

  var CURRENCIES = {
    USD: { symbol: '$', name: 'USD ($)', locale: 'en-US' },
    EUR: { symbol: '€', name: 'EUR (€)', locale: 'es-ES' },
    DKK: { symbol: 'kr.', name: 'DKK (kr.)', locale: 'da-DK', suffix: true },
    GBP: { symbol: '£', name: 'GBP (£)', locale: 'en-GB' },
    PKR: { symbol: 'Rs', name: 'PKR (Rs)', locale: 'en-PK' },
    INR: { symbol: '₹', name: 'INR (₹)', locale: 'en-IN' },
    CAD: { symbol: 'C$', name: 'CAD ($)', locale: 'en-CA' },
    AUD: { symbol: 'A$', name: 'AUD ($)', locale: 'en-AU' }
  };

  var defaultCurr = LANG === 'da' ? 'DKK' : (LANG === 'es' ? 'EUR' : 'USD');
  var activeCurrency = CURRENCIES[defaultCurr];

  function formatMoney(amount) {
    if (!isFinite(amount)) return '—';
    var formatted = Math.abs(amount).toLocaleString(activeCurrency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    var sign = amount < 0 ? '-' : '';
    if (activeCurrency.suffix) {
      return sign + formatted + ' ' + activeCurrency.symbol;
    }
    return sign + activeCurrency.symbol + formatted;
  }

  function formatPct(pct) {
    if (!isFinite(pct)) return '—';
    return pct.toFixed(2) + '%';
  }

  function calculateCompoundEngine(params) {
    var principal = params.principal;
    var rate = params.rate;
    var years = params.years;
    var compoundFreq = params.compoundFreq || 12;
    var contribution = (typeof params.contribution !== 'undefined') ? params.contribution : (params.monthlyContrib || 0);
    var contribFreq = params.contribFreq || 12;
    var contribTiming = params.contribTiming || 'end';
    var contribGrowth = params.contribGrowth || 0;
    var inflationRate = params.inflationRate || 0;

    var schedule = [];
    var balance = principal;
    var totalContributed = 0;
    var currentMonthlyContrib = (contribFreq === 12) ? contribution : (contribution / 12);
    var activeAnnualContrib = contribution;

    // Monthly effective interest rate derived from annual nominal rate and compounding frequency n:
    // r_m = (1 + r / n)^(n / 12) - 1
    var rNom = rate / 100;
    var periodicRate = 0;
    if (rNom > 0 && compoundFreq > 0) {
      periodicRate = Math.pow(1 + rNom / compoundFreq, compoundFreq / 12) - 1;
    }

    for (var y = 1; y <= years; y++) {
      var openingYear = balance;
      var yearDeposits = 0;
      var yearInterest = 0;

      for (var m = 1; m <= 12; m++) {
        var deposit = (contribFreq === 12) ? currentMonthlyContrib : (m === 1 ? activeAnnualContrib : 0);

        if (contribTiming === 'begin') {
          balance += deposit;
          totalContributed += deposit;
          yearDeposits += deposit;
        }

        var intMonth = balance * periodicRate;
        balance += intMonth;
        yearInterest += intMonth;

        if (contribTiming === 'end') {
          balance += deposit;
          totalContributed += deposit;
          yearDeposits += deposit;
        }
      }

      if (contribGrowth > 0) {
        currentMonthlyContrib *= (1 + contribGrowth / 100);
        activeAnnualContrib *= (1 + contribGrowth / 100);
      }

      var inflationFactor = Math.pow(1 + inflationRate / 100, y);
      var realVal = balance / inflationFactor;

      schedule.push({
        year: y,
        openingBalance: openingYear,
        deposits: yearDeposits,
        interest: yearInterest,
        closingBalance: balance,
        realBalance: realVal
      });
    }

    var finalNominal = balance;
    var totalInterest = finalNominal - principal - totalContributed;
    var totalInvested = principal + totalContributed;
    var growthMultiplier = totalInvested > 0 ? (finalNominal / totalInvested) : 1;
    var ear = (Math.pow(1 + (rate / 100) / compoundFreq, compoundFreq) - 1) * 100;
    var finalReal = schedule.length > 0 ? schedule[schedule.length - 1].realBalance : finalNominal;

    return {
      finalNominal: finalNominal,
      finalReal: finalReal,
      principal: principal,
      totalContributed: totalContributed,
      totalInterest: totalInterest,
      growthMultiplier: growthMultiplier,
      ear: ear,
      schedule: schedule
    };
  }

  function calculateSavingsGoal(goal, P, years, rate, compoundFreq, contribTiming) {
    if (isNaN(goal) || goal <= 0 || isNaN(P) || P < 0 || isNaN(years) || years <= 0 || isNaN(rate) || rate < 0) {
      return null;
    }
    var nPeriods = years * 12;
    var rNom = rate / 100;
    var freq = (compoundFreq && compoundFreq > 0) ? compoundFreq : 12;
    var timing = contribTiming || 'end';
    var r_m = (rNom > 0) ? (Math.pow(1 + rNom / freq, freq / 12) - 1) : 0;
    var futureInit = P * Math.pow(1 + r_m, nPeriods);
    var rem = Math.max(0, goal - futureInit);
    var reqMonthly = 0;

    if (rem > 0) {
      if (r_m > 0) {
        var annuityFactor = (Math.pow(1 + r_m, nPeriods) - 1) / r_m;
        if (timing === 'begin') {
          annuityFactor *= (1 + r_m);
        }
        reqMonthly = annuityFactor > 0 ? (rem / annuityFactor) : 0;
      } else {
        reqMonthly = nPeriods > 0 ? (rem / nPeriods) : 0;
      }
    }

    var reqInit = (1 + r_m > 0) ? (goal / Math.pow(1 + r_m, nPeriods)) : goal;

    return {
      goal: goal,
      futureInit: futureInit,
      remainder: rem,
      requiredMonthly: reqMonthly,
      requiredInitialOnly: reqInit
    };
  }

  function mountUI() {
    var toolZone = document.querySelector('.tool-zone > div');
    if (!toolZone || document.getElementById('ac-ci-enhanced-root')) return;

    var container = document.createElement('div');
    container.id = 'ac-ci-enhanced-root';
    container.className = 'ac-ci-engine';

    container.innerHTML = [
      '<div class="ac-chip-row" style="margin-bottom:16px;display:flex;gap:8px;">',
      '  <button type="button" class="ac-chip is-active" id="btn-ci-mode-beginner">' + T.modeBeginner + '</button>',
      '  <button type="button" class="ac-chip" id="btn-ci-mode-advanced">' + T.modeAdvanced + '</button>',
      '  <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">',
      '    <label for="ac-ci-currency-select" style="font-size:12px;font-weight:600;color:var(--color-text-3);">' + T.currency + ':</label>',
      '    <select id="ac-ci-currency-select" style="padding:4px 8px;border-radius:6px;border:1px solid var(--color-border);font-size:13px;background:var(--color-surface);">',
             Object.keys(CURRENCIES).map(function(c) {
               return '<option value="' + c + '" ' + (c === defaultCurr ? 'selected' : '') + '>' + CURRENCIES[c].name + '</option>';
             }).join(''),
      '    </select>',
      '  </div>',
      '</div>',

      // Primary Starting Inputs
      '<div class="ac-card" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="ci-principal">' + T.initialPrincipal + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ci-principal" placeholder="10000" min="0" step="500" value="10000" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="ci-rate">' + T.annualRate + '</label>',
      '      <input type="number" id="ci-rate" placeholder="7.0" min="0" step="0.1" value="7.0" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="ci-time">' + T.timeHorizon + '</label>',
      '      <input type="number" id="ci-time" placeholder="10" min="1" max="50" step="1" value="10" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="ci-freq">' + T.compoundingFreq + '</label>',
      '      <select id="ci-freq" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:14px;background:var(--color-bg);">',
      '        <option value="1">' + T.freqAnnually + '</option>',
      '        <option value="2">' + T.freqSemiAnnually + '</option>',
      '        <option value="4">' + T.freqQuarterly + '</option>',
      '        <option value="12" selected>' + T.freqMonthly + '</option>',
      '        <option value="365">' + T.freqDaily + '</option>',
      '      </select>',
      '    </div>',
      '  </div>',
      '</div>',

      // Recurring Contributions & Inflation Advanced Panel
      '<div id="ac-ci-advanced-panel" style="display:none;background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--color-text);">' + T.contribTitle + '</h3>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-contrib">' + T.contribAmount + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ci-contrib" value="500" min="0" step="25" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-contrib-freq">' + T.contribFreq + '</label>',
      '      <select id="ci-contrib-freq" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="12" selected>' + T.contribMonthly + '</option>',
      '        <option value="1">' + T.contribAnnually + '</option>',
      '      </select>',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-timing">' + T.contribTiming + '</label>',
      '      <select id="ci-timing" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="end" selected>' + T.timingEnd + '</option>',
      '        <option value="begin">' + T.timingBegin + '</option>',
      '      </select>',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-growth-step">' + T.contribGrowth + '</label>',
      '      <input type="number" id="ci-growth-step" value="0" min="0" step="0.5" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '  </div>',

      '  <div style="border-top:1px solid var(--color-border);padding-top:14px;margin-top:14px;">',
      '    <h3 style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--color-text);">' + T.inflationTitle + '</h3>',
      '    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;">',
      '      <div>',
      '        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-inflation">' + T.inflationRate + '</label>',
      '        <input type="number" id="ci-inflation" value="2.5" min="0" step="0.1" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '      </div>',
      '      <div>',
      '        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ci-goal">' + T.goalTarget + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '        <input type="number" id="ci-goal" placeholder="250000" min="0" step="5000" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '      </div>',
      '    </div>',
      '    <div id="ac-ci-goal-msg" style="display:none;background:var(--color-bg);padding:10px;border-radius:6px;font-size:12px;margin-top:10px;color:var(--color-text);"></div>',
      '  </div>',
      '</div>',

      // Actions
      '<div class="ac-action-bar" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;">',
      '  <button type="button" class="btn btn-primary" id="btn-calc-ci">' + T.calculateBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-reset-ci">' + T.resetBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-ci-download-csv" style="display:none;">' + T.downloadCsvBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-ci-print-summary" style="display:none;">' + T.printBtn + '</button>',
      '</div>',

      // Results
      '<div id="ci-result" style="display:none;">',
      '  <!-- Primary Cards -->',
      '  <div class="three-col-grid" style="margin-bottom:16px;">',
      '    <div class="stat-card"><div class="stat-val" id="ci-final">—</div><div class="stat-lbl">' + T.finalBalance + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="ci-interest-earned">—</div><div class="stat-lbl">' + T.totalEarned + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="ci-growth">—</div><div class="stat-lbl">' + T.growthMultiplier + '</div></div>',
      '  </div>',

      '  <!-- Inflation & EAR Sub-panel -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;">',
      '    <div><span>' + T.realBalance + ':</span> <strong id="ac-ci-real-val" style="color:#059669;">—</strong></div>',
      '    <div><span>' + T.totalContributed + ':</span> <strong id="ac-ci-contrib-val">—</strong></div>',
      '    <div><span>' + T.earApy + ':</span> <strong id="ac-ci-ear-val">—</strong></div>',
      '  </div>',

      '  <!-- Visual Stacked Bar -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px;">',
      '      <span style="color:#3B82F6;">' + T.chartPrincipal + ': <strong id="ac-bar-ci-prin">—</strong></span>',
      '      <span style="color:#F59E0B;">' + T.chartDeposits + ': <strong id="ac-bar-ci-dep">—</strong></span>',
      '      <span style="color:#10B981;">' + T.chartInterest + ': <strong id="ac-bar-ci-int">—</strong></span>',
      '    </div>',
      '    <div style="height:12px;border-radius:6px;overflow:hidden;background:#3B82F6;display:flex;">',
      '      <div id="ci-bar-prin" style="background:#3B82F6;height:100%;width:20%;"></div>',
      '      <div id="ci-bar-dep" style="background:#F59E0B;height:100%;width:30%;"></div>',
      '      <div id="ci-bar-int" style="background:#10B981;height:100%;width:50%;"></div>',
      '    </div>',
      '  </div>',

      '  <!-- Year-by-Year Growth Table -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <h4 style="font-size:14px;font-weight:700;margin-bottom:12px;">' + T.scheduleTitle + '</h4>',
      '    <div style="overflow-x:auto;">',
      '      <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:right;">',
      '        <thead>',
      '          <tr style="border-bottom:2px solid var(--color-border);background:var(--color-bg);text-align:right;">',
      '            <th style="padding:8px;text-align:left;">' + T.colYear + '</th>',
      '            <th style="padding:8px;">' + T.colOpening + '</th>',
      '            <th style="padding:8px;">' + T.colDeposits + '</th>',
      '            <th style="padding:8px;">' + T.colInterest + '</th>',
      '            <th style="padding:8px;">' + T.colClosing + '</th>',
      '            <th style="padding:8px;color:#059669;">' + T.colRealBalance + '</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody id="ci-tbody"></tbody>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    toolZone.innerHTML = '';
    toolZone.appendChild(container);

    bindEvents();
    executeCompoundCalculation();
  }

  var currentCiResult = null;

  function bindEvents() {
    document.getElementById('btn-ci-mode-beginner').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-ci-mode-advanced').classList.remove('is-active');
      document.getElementById('ac-ci-advanced-panel').style.display = 'none';
    });

    document.getElementById('btn-ci-mode-advanced').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-ci-mode-beginner').classList.remove('is-active');
      document.getElementById('ac-ci-advanced-panel').style.display = 'block';
    });

    document.getElementById('ac-ci-currency-select').addEventListener('change', function() {
      var selected = this.value;
      if (CURRENCIES[selected]) {
        activeCurrency = CURRENCIES[selected];
        document.querySelectorAll('.ac-curr-sym').forEach(function(el) {
          el.textContent = activeCurrency.symbol;
        });
        executeCompoundCalculation();
      }
    });

    ['ci-principal','ci-rate','ci-time','ci-freq','ci-contrib','ci-contrib-freq','ci-timing','ci-growth-step','ci-inflation','ci-goal'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', executeCompoundCalculation);
        el.addEventListener('change', executeCompoundCalculation);
      }
    });

    document.getElementById('btn-calc-ci').addEventListener('click', executeCompoundCalculation);
    document.getElementById('btn-reset-ci').addEventListener('click', function() {
      document.getElementById('ci-principal').value = '10000';
      document.getElementById('ci-rate').value = '7.0';
      document.getElementById('ci-time').value = '10';
      document.getElementById('ci-freq').value = '12';
      document.getElementById('ci-contrib').value = '500';
      document.getElementById('ci-growth-step').value = '0';
      document.getElementById('ci-inflation').value = '2.5';
      document.getElementById('ci-goal').value = '';
      executeCompoundCalculation();
    });

    document.getElementById('btn-ci-download-csv').addEventListener('click', downloadCiCsv);
    document.getElementById('btn-ci-print-summary').addEventListener('click', function() {
      window.print();
    });
  }

  function executeCompoundCalculation() {
    var P = parseFloat(document.getElementById('ci-principal').value);
    var rate = parseFloat(document.getElementById('ci-rate').value);
    var years = parseInt(document.getElementById('ci-time').value, 10);
    var freq = parseInt(document.getElementById('ci-freq').value, 10);

    if (isNaN(P) || P < 0 || isNaN(rate) || rate < 0 || isNaN(years) || years <= 0 || isNaN(freq)) {
      document.getElementById('ci-result').style.display = 'none';
      return;
    }

    var contrib = parseFloat(document.getElementById('ci-contrib').value) || 0;
    var contribFreq = parseInt(document.getElementById('ci-contrib-freq').value, 10) || 12;
    var timing = document.getElementById('ci-timing').value || 'end';
    var growthStep = parseFloat(document.getElementById('ci-growth-step').value) || 0;
    var inflation = parseFloat(document.getElementById('ci-inflation').value) || 0;

    var res = calculateCompoundEngine({
      principal: P,
      rate: rate,
      years: years,
      compoundFreq: freq,
      contribution: contrib,
      contribFreq: contribFreq,
      contribTiming: timing,
      contribGrowth: growthStep,
      inflationRate: inflation
    });

    currentCiResult = res;

    // Display primary statistics
    document.getElementById('ci-final').textContent = formatMoney(res.finalNominal);
    document.getElementById('ci-interest-earned').textContent = formatMoney(res.totalInterest);
    document.getElementById('ci-growth').textContent = '×' + res.growthMultiplier.toFixed(2);

    document.getElementById('ac-ci-real-val').textContent = formatMoney(res.finalReal);
    document.getElementById('ac-ci-contrib-val').textContent = formatMoney(res.totalContributed);
    document.getElementById('ac-ci-ear-val').textContent = formatPct(res.ear);

    // Visual breakdown bar
    var totalSum = res.finalNominal;
    var prinPct = totalSum > 0 ? (res.principal / totalSum * 100) : 0;
    var depPct = totalSum > 0 ? (res.totalContributed / totalSum * 100) : 0;
    var intPct = Math.max(0, 100 - prinPct - depPct);

    document.getElementById('ci-bar-prin').style.width = prinPct + '%';
    document.getElementById('ci-bar-dep').style.width = depPct + '%';
    document.getElementById('ci-bar-int').style.width = intPct + '%';

    document.getElementById('ac-bar-ci-prin').textContent = formatMoney(res.principal);
    document.getElementById('ac-bar-ci-dep').textContent = formatMoney(res.totalContributed);
    document.getElementById('ac-bar-ci-int').textContent = formatMoney(res.totalInterest);

    // Goal Target Message
    var goal = parseFloat(document.getElementById('ci-goal').value);
    var goalMsgEl = document.getElementById('ac-ci-goal-msg');
    if (!isNaN(goal) && goal > 0) {
      var goalRes = calculateSavingsGoal(goal, P, years, rate, freq, timing);
      if (goalRes) {
        goalMsgEl.textContent = T.goalRequired
          .replace('{goal}', formatMoney(goalRes.goal))
          .replace('{years}', years)
          .replace('{rate}', rate.toFixed(1))
          .replace('{init}', formatMoney(goalRes.requiredInitialOnly))
          .replace('{monthly}', formatMoney(goalRes.requiredMonthly));
        goalMsgEl.style.display = 'block';
      } else {
        goalMsgEl.style.display = 'none';
      }
    } else {
      goalMsgEl.style.display = 'none';
    }

    // Render Annual Table
    renderCiTable(res.schedule);

    document.getElementById('ci-result').style.display = 'block';
    document.getElementById('btn-ci-download-csv').style.display = 'inline-block';
    document.getElementById('btn-ci-print-summary').style.display = 'inline-block';
  }

  function renderCiTable(schedule) {
    var tbody = document.getElementById('ci-tbody');
    tbody.innerHTML = '';

    schedule.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border)';
      tr.innerHTML = [
        '<td style="padding:8px;text-align:left;font-weight:600;">' + (LANG === 'da' ? 'År' : (LANG === 'es' ? 'Año' : 'Year')) + ' ' + row.year + '</td>',
        '<td style="padding:8px;">' + formatMoney(row.openingBalance) + '</td>',
        '<td style="padding:8px;color:#F59E0B;">+' + formatMoney(row.deposits) + '</td>',
        '<td style="padding:8px;color:#10B981;">+' + formatMoney(row.interest) + '</td>',
        '<td style="padding:8px;font-weight:600;">' + formatMoney(row.closingBalance) + '</td>',
        '<td style="padding:8px;color:#059669;">' + formatMoney(row.realBalance) + '</td>'
      ].join('');
      tbody.appendChild(tr);
    });
  }

  function downloadCiCsv() {
    if (!currentCiResult) return;
    var rows = [
      ['Year', 'OpeningBalance', 'Deposits', 'InterestEarned', 'EndingBalance', 'RealInflationAdjustedValue']
    ];

    currentCiResult.schedule.forEach(function(r) {
      rows.push([
        r.year,
        r.openingBalance.toFixed(2),
        r.deposits.toFixed(2),
        r.interest.toFixed(2),
        r.closingBalance.toFixed(2),
        r.realBalance.toFixed(2)
      ]);
    });

    var csvContent = rows.map(function(r) { return r.join(','); }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'compound_interest_growth_projection.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountUI);
    } else {
      mountUI();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateCompoundEngine: calculateCompoundEngine,
      calculateSavingsGoal: calculateSavingsGoal
    };
  }
  if (typeof window !== 'undefined') {
    window.calculateCompoundEngine = calculateCompoundEngine;
    window.calculateSavingsGoal = calculateSavingsGoal;
  }
})();
