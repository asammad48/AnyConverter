/**
 * AnyConverter — Advanced Mortgage & PITI Engine
 * Supports: Beginner & Advanced Modes, PITI Escrow Breakdown, LTV Monitoring,
 * Year 1 Milestone Metrics, Lifetime Amortization with Drilldown Months,
 * Side-by-Side Term Comparisons (10/15/20/30 Years), Affordability Guidance & CSV Export.
 * Fully localized for EN, ES, DA.
 */
(function() {
  'use strict';

  var LANG = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang ? document.documentElement.lang : 'en').split('-')[0].toLowerCase();
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  var I18N = {
    en: {
      modeBeginner: 'Beginner Mode',
      modeAdvanced: 'Advanced & Escrow Options',
      currency: 'Currency',
      homePrice: 'Home Purchase Price',
      downPayment: 'Down Payment',
      loanAmount: 'Loan Principal',
      interestRate: 'Annual Interest Rate (%)',
      loanTerm: 'Loan Term',
      term10: '10 Years',
      term15: '15 Years',
      term20: '20 Years',
      term30: '30 Years',
      startDate: 'First Payment Date',
      taxesSection: 'Taxes, Insurance & Escrow',
      propertyTax: 'Annual Property Tax',
      homeInsurance: 'Annual Home Insurance',
      hoaFee: 'Monthly HOA / Condo Fee',
      pmiRate: 'PMI Rate (if LTV > 80%)',
      extraMonthly: 'Extra Monthly Principal',
      affordabilityTitle: 'Home Affordability & Debt-to-Income (DTI)',
      grossIncome: 'Gross Household Monthly Income',
      monthlyDebts: 'Existing Monthly Debt Obligations',
      affordNotice: 'Affordability guidance is educational. Standard US debt guidelines target housing under 28% of gross income and total debt under 36%. For Denmark (gældsfaktor, typically ≤ 3.5–4.0×) and European lenders, debt-to-income benchmarks follow local banking regulations.',
      dtiFrontEnd: 'Housing Ratio (Front-End)',
      dtiBackEnd: 'Total Debt Ratio (Back-End)',
      dtiStatusGood: 'Within Standard US Guidelines (≤ 28% front / ≤ 36% back)',
      dtiStatusWarn: 'Higher Debt Ratio — May require strict underwriting',
      calculateBtn: 'Calculate Mortgage',
      resetBtn: 'Reset',
      downloadCsvBtn: 'Download CSV Schedule',
      printBtn: 'Print Summary',
      monthlyPayment: 'Monthly Principal & Interest',
      monthlyPiti: 'Total Monthly Payment (PITI)',
      totalInterest: 'Total Lifetime Interest',
      totalLoanCost: 'Total Loan Cost',
      ltvRatio: 'Loan-to-Value (LTV)',
      ltvPrime: 'Prime (No PMI Required)',
      ltvHigh: 'High LTV (PMI applies until 80% balance)',
      payoffDate: 'Estimated Payoff Date',
      pmiMilestoneLabel: 'Projected 80% LTV PMI Removal Date',
      pmiDisclaimer: 'Illustrative estimate based on original property value and amortization schedule. In many jurisdictions (such as Spain and Denmark), loan insurance, mortgage guarantee rules or ongoing bidragssats do not automatically cancel at 80% LTV; consult your lender.',
      inspectYears: 'Inspect individual years',
      baseline: 'Baseline',
      firstMonthTitle: 'First-Month Payment Breakdown',
      firstMonthPrin: 'Principal:',
      firstMonthInt: 'Interest:',
      firstMonthEscrow: 'Taxes & Insurance:',
      year1Title: 'First-Year (12-Month) Milestone Summary',
      year1Paid: 'Total Paid in Year 1',
      year1Prin: 'Principal Retired in Year 1',
      year1Int: 'Interest Paid in Year 1',
      year1Bal: 'Balance After Year 1',
      compareTitle: 'Mortgage Term Comparison Matrix',
      colTerm: 'Term',
      colMonthlyPI: 'Monthly P&I',
      colTotalInterest: 'Total Interest',
      colTotalCost: 'Total Cost',
      colPayoffYear: 'Payoff Year',
      colDifference: 'Monthly Difference',
      scheduleTitle: 'Annual Amortization Schedule',
      colYear: 'Year',
      colOpening: 'Opening Balance',
      colPayments: 'Total Payments',
      colPrincipal: 'Principal',
      colInterest: 'Interest',
      colEscrow: 'Taxes/Ins',
      colClosing: 'Closing Balance',
      colAction: 'Drilldown',
      expandMonths: 'Expand Months ▾',
      collapseMonths: 'Hide Months ▴',
      colMonth: 'Month',
      colDate: 'Date',
      chartPrincipal: 'Principal',
      chartInterest: 'Interest',
      chartTaxes: 'Taxes & Escrow'
    },
    es: {
      modeBeginner: 'Modo Principiante',
      modeAdvanced: 'Opciones Avanzadas y Gastos',
      currency: 'Moneda',
      homePrice: 'Precio de la vivienda',
      downPayment: 'Pago inicial / Entrada',
      loanAmount: 'Capital del préstamo',
      interestRate: 'Tasa de interés anual (%)',
      loanTerm: 'Plazo de la hipoteca',
      term10: '10 Años',
      term15: '15 Años',
      term20: '20 Años',
      term30: '30 Años',
      startDate: 'Fecha del primer pago',
      taxesSection: 'Impuestos, Seguro y Comunidad',
      propertyTax: 'IBI / Impuesto anual',
      homeInsurance: 'Seguro anual del hogar',
      hoaFee: 'Gastos de comunidad mensuales',
      pmiRate: 'Seguro hipotecario (si LTV > 80%)',
      extraMonthly: 'Amortización extra mensual',
      affordabilityTitle: 'Capacidad de Pago y Endeudamiento (DTI)',
      grossIncome: 'Ingresos brutos mensuales del hogar',
      monthlyDebts: 'Otras deudas mensuales existentes',
      affordNotice: 'Esta guía es de carácter educativo. Los ratios 28% / 36% corresponden a estándares habituales (norma estadounidense). En España y la Unión Europea, las entidades analizan el esfuerzo financiero máximo (habitualmente entre 30% y 40%) según criterios del Banco de España.',
      dtiFrontEnd: 'Ratio de vivienda (Front-End)',
      dtiBackEnd: 'Ratio de deuda total (Back-End)',
      dtiStatusGood: 'Dentro de límites estándar orientativos (≤ 28% vivienda / ≤ 36% total)',
      dtiStatusWarn: 'Ratio elevado — Puede requerir mayor solvencia',
      calculateBtn: 'Calcular Hipoteca',
      resetBtn: 'Restablecer',
      downloadCsvBtn: 'Descargar Tabla CSV',
      printBtn: 'Imprimir Resumen',
      monthlyPayment: 'Cuota mensual (Capital + Interés)',
      monthlyPiti: 'Pago mensual total estimado',
      totalInterest: 'Interés total acumulado',
      totalLoanCost: 'Coste total de la hipoteca',
      ltvRatio: 'Ratio Préstamo/Valor (LTV)',
      ltvPrime: 'Excelente (Sin seguro hipotecario)',
      ltvHigh: 'LTV elevado (> 80%)',
      payoffDate: 'Fecha estimada de finalización',
      pmiMilestoneLabel: 'Fecha estimada de fin de seguro hipotecario (LTV 80%)',
      pmiDisclaimer: 'Estimación ilustrativa según valor inicial y amortización. En España u otras jurisdicciones europeas, los seguros o comisiones no se cancelan automáticamente al 80% LTV; consulte a su entidad bancaria.',
      inspectYears: 'Consultar años individuales',
      baseline: 'Base',
      firstMonthTitle: 'Desglose del primer mes',
      firstMonthPrin: 'Capital:',
      firstMonthInt: 'Interés:',
      firstMonthEscrow: 'Impuestos y seguros:',
      year1Title: 'Resumen del primer año (12 meses)',
      year1Paid: 'Total pagado en Año 1',
      year1Prin: 'Capital amortizado en Año 1',
      year1Int: 'Interés pagado en Año 1',
      year1Bal: 'Saldo restante tras Año 1',
      compareTitle: 'Comparativa de Plazos de Hipoteca',
      colTerm: 'Plazo',
      colMonthlyPI: 'Cuota mensual',
      colTotalInterest: 'Interés total',
      colTotalCost: 'Coste total',
      colPayoffYear: 'Año final',
      colDifference: 'Diferencia en cuota',
      scheduleTitle: 'Cuadro de Amortización Anual',
      colYear: 'Año',
      colOpening: 'Saldo Inicial',
      colPayments: 'Pagos Totales',
      colPrincipal: 'Capital',
      colInterest: 'Intereses',
      colEscrow: 'Impuestos/Seg.',
      colClosing: 'Saldo Final',
      colAction: 'Detalle',
      expandMonths: 'Ver meses ▾',
      collapseMonths: 'Ocultar meses ▴',
      colMonth: 'Mes',
      colDate: 'Fecha',
      chartPrincipal: 'Capital',
      chartInterest: 'Intereses',
      chartTaxes: 'Impuestos y Seguro'
    },
    da: {
      modeBeginner: 'Begyndertilstand',
      modeAdvanced: 'Avancerede Valgmuligheder og Udgifter',
      currency: 'Valuta',
      homePrice: 'Boligpris / Ejendomsværdi',
      downPayment: 'Udbetaling',
      loanAmount: 'Lånebeløb / Hovedstol',
      interestRate: 'Årlig rentesats (%)',
      loanTerm: 'Løbetid',
      term10: '10 År',
      term15: '15 År',
      term20: '20 År',
      term30: '30 År',
      startDate: 'Første betalingsdato',
      taxesSection: 'Ejendomsskatter og forsikring',
      propertyTax: 'Årlig ejendomsskat',
      homeInsurance: 'Årlig bygningsforsikring',
      hoaFee: 'Månedlige fællesudgifter / Ejerforening',
      pmiRate: 'Låneforsikring (hvis LTV > 80%)',
      extraMonthly: 'Ekstra månedligt afdrag',
      affordabilityTitle: 'Rådighedsbeløb og Gældsfaktor',
      grossIncome: 'Husstandens bruttoindkomst pr. måned',
      monthlyDebts: 'Eksisterende månedlige gældsforpligtelser',
      affordNotice: 'Vejledningen er udelukkende pædagogisk. Ratios 28%/36% er en international reference; i Danmark anvendes primært gældsfaktor (maks 3,5–4,0× årsindkomst) og rådighedsbeløb efter Finanstilsynets retningslinjer.',
      dtiFrontEnd: 'Boligudgiftsandel',
      dtiBackEnd: 'Samlet gældsandel',
      dtiStatusGood: 'Inden for vejledende standardrammer (≤ 28% bolig / ≤ 36% samlet)',
      dtiStatusWarn: 'Høj gældsbelastning',
      calculateBtn: 'Beregn Boliglån',
      resetBtn: 'Nulstil',
      downloadCsvBtn: 'Download CSV-afdragsplan',
      printBtn: 'Udskriv oversigt',
      monthlyPayment: 'Månedlig ydelse (Afdrag + Rente)',
      monthlyPiti: 'Samlet månedlig boligudgift',
      totalInterest: 'Samlede renter over lånets løbetid',
      totalLoanCost: 'Lånets samlede omkostning',
      ltvRatio: 'Belåningsgrad (LTV)',
      ltvPrime: 'Under 80% (Ingen ekstra forsikring)',
      ltvHigh: 'Over 80% belåning',
      payoffDate: 'Forventet slutår',
      pmiMilestoneLabel: 'Estimeret dato for ophør af låneforsikring (LTV 80%)',
      pmiDisclaimer: 'Vejledende beregning. I Danmark og Europa gælder automatiske ophørsregler ikke for bidragssats eller garantier; vilkår afhænger af dit realkreditinstitut eller bank.',
      inspectYears: 'Undersøg enkelte år',
      baseline: 'Basis',
      firstMonthTitle: 'Første måneds opdeling',
      firstMonthPrin: 'Afdrag:',
      firstMonthInt: 'Renter:',
      firstMonthEscrow: 'Skatter & Forsikring:',
      year1Title: 'Status efter 1. år (12 måneder)',
      year1Paid: 'Samlet betalt i år 1',
      year1Prin: 'Afdraget i år 1',
      year1Int: 'Renter betalt i år 1',
      year1Bal: 'Restgæld efter år 1',
      compareTitle: 'Sammenligning af Løbetider',
      colTerm: 'Løbetid',
      colMonthlyPI: 'Månedlig ydelse',
      colTotalInterest: 'Samlede renter',
      colTotalCost: 'Samlet pris',
      colPayoffYear: 'Slutår',
      colDifference: 'Forskel i ydelse',
      scheduleTitle: 'Årlig Afdragsplan',
      colYear: 'År',
      colOpening: 'Startsaldo',
      colPayments: 'Ydelser i alt',
      colPrincipal: 'Afdrag',
      colInterest: 'Renter',
      colEscrow: 'Skatter/Fors.',
      colClosing: 'Slutsaldo',
      colAction: 'Detaljer',
      expandMonths: 'Vis måneder ▾',
      collapseMonths: 'Skjul måneder ▴',
      colMonth: 'Måned',
      colDate: 'Dato',
      chartPrincipal: 'Afdrag',
      chartInterest: 'Renter',
      chartTaxes: 'Skatter og drift'
    }
  };

  var T = I18N[LANG];

  var CURRENCIES = {
    USD: { symbol: '$', name: 'USD ($)', locale: 'en-US' },
    EUR: { symbol: '€', name: 'EUR (€)', locale: 'es-ES' },
    DKK: { symbol: 'kr.', name: 'DKK (kr.)', locale: 'da-DK', suffix: true },
    GBP: { symbol: '£', name: 'GBP (£)', locale: 'en-GB' },
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
    return pct.toFixed(1) + '%';
  }

  function getPaymentDate(startYear, startMonth, monthOffset) {
    var d = new Date(startYear, startMonth - 1 + monthOffset, 1);
    var monthNames = {
      en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      da: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
    }[LANG];
    return monthNames[d.getMonth()] + ' ' + d.getFullYear();
  }

  function calculateMortgageEngine(params) {
    var price = params.price;
    var down = params.down;
    var annualRate = params.rate;
    var termYears = params.years;
    var propertyTax = params.propertyTax || 0;
    var insurance = params.insurance || 0;
    var hoa = params.hoa || 0;
    var pmiRate = (params.pmiRate !== undefined && params.pmiRate !== null) ? params.pmiRate : 0.75;
    var extraMonthly = params.extraMonthly || 0;
    var startYear = params.startYear || new Date().getFullYear();
    var startMonth = params.startMonth || (new Date().getMonth() + 1);

    var principal = Math.max(0, price - down);
    var ltv = price > 0 ? (principal / price * 100) : 0;
    var termMonths = termYears * 12;
    var r = annualRate / 100 / 12;

    var standardPI = 0;
    if (annualRate <= 0) {
      standardPI = termMonths > 0 ? (principal / termMonths) : 0;
    } else {
      standardPI = principal * r * Math.pow(1 + r, termMonths) / (Math.pow(1 + r, termMonths) - 1);
    }

    var monthlyTax = propertyTax / 12;
    var monthlyIns = insurance / 12;

    var schedule = [];
    var balance = principal;
    var monthIndex = 0;
    var lastPmiMonth = 0;
    var maxCycles = termMonths * 2;

    while (balance > 0.005 && monthIndex < maxCycles) {
      monthIndex++;
      var opening = balance;
      var interest = annualRate <= 0 ? 0 : (opening * r);
      var prinPortion = standardPI - interest;

      var extra = extraMonthly;
      var totalPrin = prinPortion + extra;

      // Check PMI eligibility (cancels when balance drops to 80% of original price)
      var pmiApplies = (pmiRate > 0 && opening > 0.80 * price);
      var pmiMonthly = pmiApplies ? (opening * (pmiRate / 100) / 12) : 0;
      if (pmiApplies) {
        lastPmiMonth = monthIndex;
      }

      if (totalPrin >= balance) {
        totalPrin = balance;
        balance = 0;
      } else {
        balance -= totalPrin;
      }

      var totalMonthlyPayment = totalPrin + interest + monthlyTax + monthlyIns + hoa + pmiMonthly;

      schedule.push({
        month: monthIndex,
        date: getPaymentDate(startYear, startMonth, monthIndex - 1),
        openingBalance: opening,
        principal: totalPrin,
        interest: interest,
        escrow: monthlyTax + monthlyIns + hoa + pmiMonthly,
        totalPayment: totalMonthlyPayment,
        closingBalance: Math.max(0, balance)
      });

      if (balance <= 0) break;
    }

    // Annual aggregation
    var annualSummaries = [];
    var yIdx = 1;
    for (var i = 0; i < schedule.length; i += 12) {
      var chunk = schedule.slice(i, i + 12);
      var yrOpen = chunk[0].openingBalance;
      var yrClose = chunk[chunk.length - 1].closingBalance;
      var yrPay = 0, yrPrin = 0, yrInt = 0, yrEsc = 0;
      for (var c = 0; c < chunk.length; c++) {
        yrPay += chunk[c].totalPayment;
        yrPrin += chunk[c].principal;
        yrInt += chunk[c].interest;
        yrEsc += chunk[c].escrow;
      }
      annualSummaries.push({
        year: yIdx++,
        openingBalance: yrOpen,
        totalPayments: yrPay,
        principal: yrPrin,
        interest: yrInt,
        escrow: yrEsc,
        closingBalance: yrClose,
        months: chunk
      });
    }

    var totalInterest = 0;
    for (var s = 0; s < schedule.length; s++) {
      totalInterest += schedule[s].interest;
    }

    // Compare matrix across standard terms: 10, 15, 20, 30
    var compareTerms = [10, 15, 20, 30].map(function(yr) {
      var n = yr * 12;
      var pi = 0;
      if (annualRate <= 0) {
        pi = principal / n;
      } else {
        pi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      }
      var totInt = (pi * n) - principal;
      return {
        years: yr,
        monthlyPI: pi,
        totalInterest: totInt,
        totalCost: principal + totInt,
        payoffYear: startYear + yr,
        diffFromCurrent: pi - standardPI
      };
    });

    var finalDate = schedule.length > 0 ? schedule[schedule.length - 1].date : '—';
    var initialPmi = (ltv > 80 && pmiRate > 0) ? (principal * (pmiRate / 100) / 12) : 0;
    var totalInitialMonthly = standardPI + monthlyTax + monthlyIns + hoa + initialPmi;

    return {
      principal: principal,
      ltv: ltv,
      standardPI: standardPI,
      totalInitialMonthly: totalInitialMonthly,
      totalInterest: totalInterest,
      totalCost: principal + totalInterest + down,
      payoffDate: finalDate,
      pmiEndDate: (lastPmiMonth > 0 && lastPmiMonth < schedule.length) ? schedule[lastPmiMonth - 1].date : null,
      pmiEndMonth: lastPmiMonth,
      firstMonth: schedule[0] || null,
      year1: annualSummaries[0] || null,
      annualSummaries: annualSummaries,
      schedule: schedule,
      compareTerms: compareTerms
    };
  }

  function mountUI() {
    var toolZone = document.querySelector('.tool-zone > div');
    if (!toolZone || document.getElementById('ac-mort-enhanced-root')) return;

    var container = document.createElement('div');
    container.id = 'ac-mort-enhanced-root';
    container.className = 'ac-mortgage-engine';

    container.innerHTML = [
      '<div class="ac-chip-row" style="margin-bottom:16px;display:flex;gap:8px;">',
      '  <button type="button" class="ac-chip is-active" id="btn-mort-mode-beginner">' + T.modeBeginner + '</button>',
      '  <button type="button" class="ac-chip" id="btn-mort-mode-advanced">' + T.modeAdvanced + '</button>',
      '  <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">',
      '    <label for="ac-mort-currency-select" style="font-size:12px;font-weight:600;color:var(--color-text-3);">' + T.currency + ':</label>',
      '    <select id="ac-mort-currency-select" style="padding:4px 8px;border-radius:6px;border:1px solid var(--color-border);font-size:13px;background:var(--color-surface);">',
             Object.keys(CURRENCIES).map(function(c) {
               return '<option value="' + c + '" ' + (c === defaultCurr ? 'selected' : '') + '>' + CURRENCIES[c].name + '</option>';
             }).join(''),
      '    </select>',
      '  </div>',
      '</div>',

      // Core Home Purchase Inputs
      '<div class="ac-card" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="mort-price">' + T.homePrice + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="mort-price" placeholder="400000" min="1" step="5000" value="400000" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">',
      '        <label style="font-size:13px;font-weight:600;" for="mort-down">' + T.downPayment + '</label>',
      '        <span id="ac-down-pct-badge" style="font-size:12px;font-weight:700;color:var(--color-primary);">20.0%</span>',
      '      </div>',
      '      <div style="display:grid;grid-template-columns:1fr 105px;gap:8px;">',
      '        <input type="number" id="mort-down" placeholder="80000" min="0" step="1000" value="80000" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '        <div style="position:relative;display:flex;align-items:center;">',
      '          <input type="number" id="mort-down-pct" placeholder="20.0" min="0" max="100" step="0.5" value="20.0" style="width:100%;padding:10px 24px 10px 10px;border:1px solid var(--color-border);border-radius:6px;font-size:14px;background:var(--color-bg);text-align:right;">',
      '          <span style="position:absolute;right:8px;font-size:13px;color:var(--color-text-3);pointer-events:none;">%</span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="mort-rate">' + T.interestRate + '</label>',
      '      <input type="number" id="mort-rate" placeholder="6.5" min="0" step="0.05" value="6.5" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="mort-term">' + T.loanTerm + '</label>',
      '      <select id="mort-term" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:14px;background:var(--color-bg);">',
      '        <option value="10">' + T.term10 + '</option>',
      '        <option value="15">' + T.term15 + '</option>',
      '        <option value="20">' + T.term20 + '</option>',
      '        <option value="30" selected>' + T.term30 + '</option>',
      '      </select>',
      '    </div>',
      '  </div>',
      '</div>',

      // Advanced Escrow & Affordability Panel
      '<div id="ac-mort-advanced-panel" style="display:none;background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--color-text);">' + T.taxesSection + '</h3>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-tax">' + T.propertyTax + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="mort-tax" value="4800" min="0" step="100" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-ins">' + T.homeInsurance + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="mort-ins" value="1200" min="0" step="50" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-hoa">' + T.hoaFee + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="mort-hoa" value="0" min="0" step="25" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-pmi">' + T.pmiRate + '</label>',
      '      <input type="number" id="mort-pmi" value="0.75" min="0" max="10" step="0.05" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-extra">' + T.extraMonthly + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="mort-extra" value="0" min="0" step="50" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '  </div>',

      '  <!-- Affordability & DTI Guidance -->',
      '  <div style="border-top:1px solid var(--color-border);padding-top:14px;margin-top:14px;">',
      '    <h3 style="font-size:14px;font-weight:700;margin-bottom:6px;color:var(--color-text);">' + T.affordabilityTitle + '</h3>',
      '    <p style="font-size:12px;color:var(--color-text-3);margin-bottom:10px;">' + T.affordNotice + '</p>',
      '    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:12px;">',
      '      <div>',
      '        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-income">' + T.grossIncome + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '        <input type="number" id="mort-income" value="9000" min="0" step="250" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '      </div>',
      '      <div>',
      '        <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="mort-debts">' + T.monthlyDebts + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '        <input type="number" id="mort-debts" value="600" min="0" step="50" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '      </div>',
      '      <div style="background:var(--color-bg);padding:10px;border-radius:6px;">',
      '        <div style="font-size:12px;font-weight:600;color:var(--color-text);">' + T.dtiFrontEnd + ': <strong id="ac-dti-front">—</strong></div>',
      '        <div style="font-size:12px;font-weight:600;color:var(--color-text);margin-top:4px;">' + T.dtiBackEnd + ': <strong id="ac-dti-back">—</strong></div>',
      '        <div id="ac-dti-badge" style="font-size:11px;font-weight:600;color:#059669;margin-top:4px;">' + T.dtiStatusGood + '</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',

      // Action bar
      '<div class="ac-action-bar" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;">',
      '  <button type="button" class="btn btn-primary" id="btn-calc-mort">' + T.calculateBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-reset-mort">' + T.resetBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-mort-download-csv" style="display:none;">' + T.downloadCsvBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-mort-print-summary" style="display:none;">' + T.printBtn + '</button>',
      '</div>',

      // Result Section
      '<div id="mort-result" style="display:none;">',
      '  <!-- Primary Stat Cards -->',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px;">',
      '    <div class="stat-card"><div class="stat-val" id="mort-monthly">—</div><div class="stat-lbl">' + T.monthlyPayment + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="mort-piti-val">—</div><div class="stat-lbl">' + T.monthlyPiti + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="mort-interest-total">—</div><div class="stat-lbl">' + T.totalInterest + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="mort-total">—</div><div class="stat-lbl">' + T.totalLoanCost + '</div></div>',
      '  </div>',

      '  <!-- LTV & Loan Metrics Badge Bar -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:12px 16px;margin-bottom:16px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;">',
      '    <div><span>' + T.loanAmount + ':</span> <strong id="mort-principal">—</strong></div>',
      '    <div><span>' + T.ltvRatio + ':</span> <strong id="ac-mort-ltv-val">—</strong> <span id="ac-mort-ltv-status" style="font-size:11px;padding:2px 6px;border-radius:4px;background:#ECFDF5;color:#059669;margin-left:4px;">' + T.ltvPrime + '</span></div>',
      '    <div><span>' + T.payoffDate + ':</span> <strong id="mort-payoff">—</strong></div>',
      '    <div id="ac-mort-pmi-milestone-wrap" style="display:none;width:100%;padding-top:8px;border-top:1px dashed var(--color-border);font-size:12px;color:var(--color-text-3);line-height:1.5;">',
      '      <span>' + T.pmiMilestoneLabel + ': </span><strong id="ac-mort-pmi-date" style="color:var(--color-primary);font-weight:700;">—</strong>',
      '      <span style="display:block;margin-top:2px;font-size:11px;font-style:italic;">' + T.pmiDisclaimer + '</span>',
      '    </div>',
      '  </div>',

      '  <!-- Visual Payment Composition Bar -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px;">',
      '      <span style="color:#10B981;">' + T.chartPrincipal + ': <strong id="ac-bar-mort-prin">—</strong></span>',
      '      <span style="color:#EF4444;">' + T.chartInterest + ': <strong id="ac-bar-mort-int">—</strong></span>',
      '      <span style="color:#F59E0B;">' + T.chartTaxes + ': <strong id="ac-bar-mort-tax">—</strong></span>',
      '    </div>',
      '    <div style="height:12px;border-radius:6px;overflow:hidden;background:#F59E0B;display:flex;">',
      '      <div id="mort-bar-principal" style="background:#10B981;height:100%;width:50%;"></div>',
      '      <div id="mort-bar-interest" style="background:#EF4444;height:100%;width:35%;"></div>',
      '      <div id="mort-bar-tax" style="background:#F59E0B;height:100%;width:15%;"></div>',
      '    </div>',
      '  </div>',

      '  <!-- Year 1 Milestone Breakdown -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--color-text);">' + T.year1Title + '</h4>',
      '    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;font-size:12px;">',
      '      <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Paid + '</span><strong id="ac-mort-y1-paid" style="font-size:13px;">—</strong></div>',
      '      <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Prin + '</span><strong id="ac-mort-y1-prin" style="font-size:13px;color:#10B981;">—</strong></div>',
      '      <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Int + '</span><strong id="ac-mort-y1-int" style="font-size:13px;color:#EF4444;">—</strong></div>',
      '      <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Bal + '</span><strong id="ac-mort-y1-bal" style="font-size:13px;">—</strong></div>',
      '    </div>',
      '  </div>',

      '  <!-- Term Comparison Table -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <h4 style="font-size:14px;font-weight:700;margin-bottom:10px;">' + T.compareTitle + '</h4>',
      '    <div style="overflow-x:auto;">',
      '      <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:right;">',
      '        <thead>',
      '          <tr style="border-bottom:2px solid var(--color-border);background:var(--color-bg);text-align:right;">',
      '            <th style="padding:8px;text-align:left;">' + T.colTerm + '</th>',
      '            <th style="padding:8px;">' + T.colMonthlyPI + '</th>',
      '            <th style="padding:8px;">' + T.colTotalInterest + '</th>',
      '            <th style="padding:8px;">' + T.colTotalCost + '</th>',
      '            <th style="padding:8px;">' + T.colPayoffYear + '</th>',
      '            <th style="padding:8px;">' + T.colDifference + '</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody id="ac-mort-compare-tbody"></tbody>',
      '      </table>',
      '    </div>',
      '  </div>',

      '  <!-- Annual Amortization Table with Drilldown Months -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">',
      '      <h4 style="font-size:14px;font-weight:700;margin:0;">' + T.scheduleTitle + '</h4>',
      '      <span style="font-size:12px;color:var(--color-text-3);">' + T.inspectYears + '</span>',
      '    </div>',
      '    <div style="overflow-x:auto;">',
      '      <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:right;">',
      '        <thead>',
      '          <tr style="border-bottom:2px solid var(--color-border);background:var(--color-bg);text-align:right;">',
      '            <th style="padding:8px;text-align:left;">' + T.colYear + '</th>',
      '            <th style="padding:8px;">' + T.colOpening + '</th>',
      '            <th style="padding:8px;">' + T.colPayments + '</th>',
      '            <th style="padding:8px;">' + T.colPrincipal + '</th>',
      '            <th style="padding:8px;">' + T.colInterest + '</th>',
      '            <th style="padding:8px;">' + T.colEscrow + '</th>',
      '            <th style="padding:8px;">' + T.colClosing + '</th>',
      '            <th style="padding:8px;text-align:center;">' + T.colAction + '</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody id="ac-mort-annual-tbody"></tbody>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    toolZone.innerHTML = '';
    toolZone.appendChild(container);

    bindEvents();
    executeMortgageCalculation();
  }

  var currentMortResult = null;

  function bindEvents() {
    document.getElementById('btn-mort-mode-beginner').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-mort-mode-advanced').classList.remove('is-active');
      document.getElementById('ac-mort-advanced-panel').style.display = 'none';
    });

    document.getElementById('btn-mort-mode-advanced').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-mort-mode-beginner').classList.remove('is-active');
      document.getElementById('ac-mort-advanced-panel').style.display = 'block';
    });

    document.getElementById('ac-mort-currency-select').addEventListener('change', function() {
      var selected = this.value;
      if (CURRENCIES[selected]) {
        activeCurrency = CURRENCIES[selected];
        document.querySelectorAll('.ac-curr-sym').forEach(function(el) {
          el.textContent = activeCurrency.symbol;
        });
        executeMortgageCalculation();
      }
    });

    // Sync down payment % and $
    document.getElementById('mort-price').addEventListener('input', function() {
      var price = parseFloat(this.value) || 0;
      var down = parseFloat(document.getElementById('mort-down').value) || 0;
      var pct = price > 0 ? (down / price * 100) : 0;
      var pctInput = document.getElementById('mort-down-pct');
      if (pctInput && document.activeElement !== pctInput) {
        pctInput.value = pct.toFixed(1);
      }
      document.getElementById('ac-down-pct-badge').textContent = pct.toFixed(1) + '%';
      executeMortgageCalculation();
    });

    document.getElementById('mort-down').addEventListener('input', function() {
      var price = parseFloat(document.getElementById('mort-price').value) || 0;
      var down = parseFloat(this.value) || 0;
      var pct = price > 0 ? (down / price * 100) : 0;
      var pctInput = document.getElementById('mort-down-pct');
      if (pctInput && document.activeElement !== pctInput) {
        pctInput.value = pct.toFixed(1);
      }
      document.getElementById('ac-down-pct-badge').textContent = pct.toFixed(1) + '%';
      executeMortgageCalculation();
    });

    var downPctEl = document.getElementById('mort-down-pct');
    if (downPctEl) {
      downPctEl.addEventListener('input', function() {
        var price = parseFloat(document.getElementById('mort-price').value) || 0;
        var pct = parseFloat(this.value) || 0;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;
        var down = Math.round(price * (pct / 100));
        var downEl = document.getElementById('mort-down');
        if (downEl && document.activeElement !== downEl) {
          downEl.value = down;
        }
        document.getElementById('ac-down-pct-badge').textContent = pct.toFixed(1) + '%';
        executeMortgageCalculation();
      });
    }

    ['mort-rate','mort-term','mort-tax','mort-ins','mort-hoa','mort-pmi','mort-extra','mort-income','mort-debts'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', executeMortgageCalculation);
        el.addEventListener('change', executeMortgageCalculation);
      }
    });

    document.getElementById('btn-calc-mort').addEventListener('click', executeMortgageCalculation);
    document.getElementById('btn-reset-mort').addEventListener('click', function() {
      document.getElementById('mort-price').value = '400000';
      document.getElementById('mort-down').value = '80000';
      var downPct = document.getElementById('mort-down-pct');
      if (downPct) downPct.value = '20.0';
      document.getElementById('mort-rate').value = '6.5';
      document.getElementById('mort-term').value = '30';
      document.getElementById('mort-tax').value = '4800';
      document.getElementById('mort-ins').value = '1200';
      document.getElementById('mort-hoa').value = '0';
      var pmiEl = document.getElementById('mort-pmi');
      if (pmiEl) pmiEl.value = '0.75';
      document.getElementById('mort-extra').value = '0';
      document.getElementById('ac-down-pct-badge').textContent = '20.0%';
      executeMortgageCalculation();
    });

    document.getElementById('btn-mort-download-csv').addEventListener('click', downloadMortCsv);
    document.getElementById('btn-mort-print-summary').addEventListener('click', function() {
      window.print();
    });
  }

  function executeMortgageCalculation() {
    var price = parseFloat(document.getElementById('mort-price').value);
    var down = parseFloat(document.getElementById('mort-down').value) || 0;
    var rate = parseFloat(document.getElementById('mort-rate').value);
    var years = parseInt(document.getElementById('mort-term').value, 10);

    if (isNaN(price) || price <= 0 || isNaN(rate) || rate < 0 || isNaN(years) || years <= 0) {
      document.getElementById('mort-result').style.display = 'none';
      return;
    }

    var tax = parseFloat(document.getElementById('mort-tax').value) || 0;
    var ins = parseFloat(document.getElementById('mort-ins').value) || 0;
    var hoa = parseFloat(document.getElementById('mort-hoa').value) || 0;
    var extra = parseFloat(document.getElementById('mort-extra').value) || 0;

    var pmiInput = document.getElementById('mort-pmi');
    var pmiRate = pmiInput ? (parseFloat(pmiInput.value) || 0) : 0.75;

    var res = calculateMortgageEngine({
      price: price,
      down: down,
      rate: rate,
      years: years,
      propertyTax: tax,
      insurance: ins,
      hoa: hoa,
      pmiRate: pmiRate,
      extraMonthly: extra
    });

    currentMortResult = res;

    // Display primary statistics
    document.getElementById('mort-monthly').textContent = formatMoney(res.standardPI);
    document.getElementById('mort-piti-val').textContent = formatMoney(res.totalInitialMonthly);
    document.getElementById('mort-principal').textContent = formatMoney(res.principal);
    document.getElementById('mort-interest-total').textContent = formatMoney(res.totalInterest);
    document.getElementById('mort-total').textContent = formatMoney(res.totalCost);
    document.getElementById('mort-payoff').textContent = res.payoffDate;

    // LTV badge and PMI termination milestone
    document.getElementById('ac-mort-ltv-val').textContent = formatPct(res.ltv);
    var pmiWrap = document.getElementById('ac-mort-pmi-milestone-wrap');
    var pmiDateEl = document.getElementById('ac-mort-pmi-date');
    if (pmiWrap && pmiDateEl) {
      if (res.pmiEndDate && res.ltv > 80 && pmiRate > 0) {
        pmiDateEl.textContent = res.pmiEndDate;
        pmiWrap.style.display = 'block';
      } else {
        pmiWrap.style.display = 'none';
      }
    }
    var statusBadge = document.getElementById('ac-mort-ltv-status');
    if (res.ltv > 80) {
      statusBadge.textContent = T.ltvHigh;
      statusBadge.style.background = '#FFFBEB';
      statusBadge.style.color = '#B45309';
    } else {
      statusBadge.textContent = T.ltvPrime;
      statusBadge.style.background = '#ECFDF5';
      statusBadge.style.color = '#059669';
    }

    // Payment composition bar
    var monthlyTax = tax / 12;
    var monthlyIns = ins / 12;
    var monthlyEscrow = monthlyTax + monthlyIns + hoa;
    var totalBarSum = res.standardPI + monthlyEscrow;
    var prinRatio = totalBarSum > 0 ? (res.firstMonth ? (res.firstMonth.principal / totalBarSum * 100) : 40) : 40;
    var intRatio = totalBarSum > 0 ? (res.firstMonth ? (res.firstMonth.interest / totalBarSum * 100) : 40) : 40;
    var taxRatio = Math.max(0, 100 - prinRatio - intRatio);

    document.getElementById('mort-bar-principal').style.width = prinRatio + '%';
    document.getElementById('mort-bar-interest').style.width = intRatio + '%';
    document.getElementById('mort-bar-tax').style.width = taxRatio + '%';

    document.getElementById('ac-bar-mort-prin').textContent = formatMoney(res.firstMonth ? res.firstMonth.principal : 0);
    document.getElementById('ac-bar-mort-int').textContent = formatMoney(res.firstMonth ? res.firstMonth.interest : 0);
    document.getElementById('ac-bar-mort-tax').textContent = formatMoney(monthlyEscrow);

    // Year 1 breakdown
    if (res.year1) {
      document.getElementById('ac-mort-y1-paid').textContent = formatMoney(res.year1.totalPayments);
      document.getElementById('ac-mort-y1-prin').textContent = formatMoney(res.year1.principal);
      document.getElementById('ac-mort-y1-int').textContent = formatMoney(res.year1.interest);
      document.getElementById('ac-mort-y1-bal').textContent = formatMoney(res.year1.closingBalance);
    }

    // Affordability / DTI calculation
    var income = parseFloat(document.getElementById('mort-income').value) || 0;
    var debts = parseFloat(document.getElementById('mort-debts').value) || 0;
    if (income > 0) {
      var frontDti = (res.totalInitialMonthly / income) * 100;
      var backDti = ((res.totalInitialMonthly + debts) / income) * 100;
      document.getElementById('ac-dti-front').textContent = formatPct(frontDti);
      document.getElementById('ac-dti-back').textContent = formatPct(backDti);
      var dtiBadge = document.getElementById('ac-dti-badge');
      if (frontDti <= 28 && backDti <= 36) {
        dtiBadge.textContent = T.dtiStatusGood;
        dtiBadge.style.color = '#059669';
      } else {
        dtiBadge.textContent = T.dtiStatusWarn;
        dtiBadge.style.color = '#D97706';
      }
    }

    // Render Term Comparison Matrix
    renderCompareTable(res.compareTerms, res.standardPI);

    // Render Annual Table
    renderAnnualMortgageTable(res.annualSummaries);

    document.getElementById('mort-result').style.display = 'block';
    document.getElementById('btn-mort-download-csv').style.display = 'inline-block';
    document.getElementById('btn-mort-print-summary').style.display = 'inline-block';
  }

  function renderCompareTable(terms, currentPI) {
    var tbody = document.getElementById('ac-mort-compare-tbody');
    tbody.innerHTML = '';
    terms.forEach(function(item) {
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border)';
      var diffStr = item.diffFromCurrent === 0 ? T.baseline : (item.diffFromCurrent > 0 ? '+' : '') + formatMoney(item.diffFromCurrent);
      tr.innerHTML = [
        '<td style="padding:8px;text-align:left;font-weight:600;">' + item.years + ' ' + (LANG === 'da' ? 'År' : (LANG === 'es' ? 'Años' : 'Years')) + '</td>',
        '<td style="padding:8px;font-weight:600;">' + formatMoney(item.monthlyPI) + '</td>',
        '<td style="padding:8px;color:#EF4444;">' + formatMoney(item.totalInterest) + '</td>',
        '<td style="padding:8px;">' + formatMoney(item.totalCost) + '</td>',
        '<td style="padding:8px;">' + item.payoffYear + '</td>',
        '<td style="padding:8px;font-weight:600;' + (item.diffFromCurrent < 0 ? 'color:#10B981;' : '') + '">' + diffStr + '</td>'
      ].join('');
      tbody.appendChild(tr);
    });
  }

  function renderAnnualMortgageTable(summaries) {
    var tbody = document.getElementById('ac-mort-annual-tbody');
    tbody.innerHTML = '';

    summaries.forEach(function(yearSummary) {
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border)';
      tr.style.cursor = 'pointer';

      tr.innerHTML = [
        '<td style="padding:10px 8px;text-align:left;font-weight:600;">' + T.colYear + ' ' + yearSummary.year + '</td>',
        '<td style="padding:10px 8px;">' + formatMoney(yearSummary.openingBalance) + '</td>',
        '<td style="padding:10px 8px;font-weight:600;">' + formatMoney(yearSummary.totalPayments) + '</td>',
        '<td style="padding:10px 8px;color:#10B981;">' + formatMoney(yearSummary.principal) + '</td>',
        '<td style="padding:10px 8px;color:#EF4444;">' + formatMoney(yearSummary.interest) + '</td>',
        '<td style="padding:10px 8px;">' + formatMoney(yearSummary.escrow) + '</td>',
        '<td style="padding:10px 8px;font-weight:600;">' + formatMoney(yearSummary.closingBalance) + '</td>',
        '<td style="padding:10px 8px;text-align:center;"><button type="button" class="ac-drill-btn" style="padding:3px 8px;border-radius:4px;border:1px solid var(--color-border);background:var(--color-bg);font-size:11px;cursor:pointer;">' + T.expandMonths + '</button></td>'
      ].join('');

      var subTr = document.createElement('tr');
      subTr.style.display = 'none';
      subTr.className = 'ac-month-drilldown-row';

      var subTd = document.createElement('td');
      subTd.colSpan = 8;
      subTd.style.padding = '8px 16px';
      subTd.style.background = 'var(--color-bg)';

      var monthHtml = [
        '<div style="max-height:260px;overflow-y:auto;border:1px solid var(--color-border);border-radius:6px;background:var(--color-surface);margin:4px 0;">',
        '  <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:right;">',
        '    <thead>',
        '      <tr style="border-bottom:1px solid var(--color-border);background:var(--color-surface-2);text-align:right;">',
        '        <th style="padding:6px;text-align:left;">' + T.colMonth + '</th>',
        '        <th style="padding:6px;text-align:left;">' + T.colDate + '</th>',
        '        <th style="padding:6px;">' + T.colOpening + '</th>',
        '        <th style="padding:6px;">' + T.monthlyPiti + '</th>',
        '        <th style="padding:6px;">' + T.colPrincipal + '</th>',
        '        <th style="padding:6px;">' + T.colInterest + '</th>',
        '        <th style="padding:6px;">' + T.colEscrow + '</th>',
        '        <th style="padding:6px;">' + T.colClosing + '</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
               yearSummary.months.map(function(m) {
                 return '<tr style="border-bottom:1px solid var(--color-border);">' +
                   '<td style="padding:5px 6px;text-align:left;font-weight:600;">' + m.month + '</td>' +
                   '<td style="padding:5px 6px;text-align:left;color:var(--color-text-3);">' + m.date + '</td>' +
                   '<td style="padding:5px 6px;">' + formatMoney(m.openingBalance) + '</td>' +
                   '<td style="padding:5px 6px;font-weight:600;">' + formatMoney(m.totalPayment) + '</td>' +
                   '<td style="padding:5px 6px;color:#10B981;">' + formatMoney(m.principal) + '</td>' +
                   '<td style="padding:5px 6px;color:#EF4444;">' + formatMoney(m.interest) + '</td>' +
                   '<td style="padding:5px 6px;">' + formatMoney(m.escrow) + '</td>' +
                   '<td style="padding:5px 6px;font-weight:600;">' + formatMoney(m.closingBalance) + '</td>' +
                 '</tr>';
               }).join(''),
        '    </tbody>',
        '  </table>',
        '</div>'
      ].join('');

      subTd.innerHTML = monthHtml;
      subTr.appendChild(subTd);

      var drillBtn = tr.querySelector('.ac-drill-btn');
      var toggle = function(e) {
        if (e) e.stopPropagation();
        var isOpen = subTr.style.display !== 'none';
        subTr.style.display = isOpen ? 'none' : 'table-row';
        drillBtn.textContent = isOpen ? T.expandMonths : T.collapseMonths;
      };

      drillBtn.addEventListener('click', toggle);
      tr.addEventListener('click', toggle);

      tbody.appendChild(tr);
      tbody.appendChild(subTr);
    });
  }

  function downloadMortCsv() {
    if (!currentMortResult) return;
    var rows = [
      ['Year', 'Month', 'Date', 'OpeningBalance', 'TotalPayment', 'Principal', 'Interest', 'TaxesAndEscrow', 'ClosingBalance']
    ];

    currentMortResult.annualSummaries.forEach(function(y) {
      y.months.forEach(function(m) {
        rows.push([
          y.year,
          m.month,
          m.date,
          m.openingBalance.toFixed(2),
          m.totalPayment.toFixed(2),
          m.principal.toFixed(2),
          m.interest.toFixed(2),
          m.escrow.toFixed(2),
          m.closingBalance.toFixed(2)
        ]);
      });
    });

    var csvContent = rows.map(function(r) { return r.join(','); }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_amortization_schedule.csv';
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
      calculateMortgageEngine: calculateMortgageEngine
    };
  }
  if (typeof window !== 'undefined') {
    window.calculateMortgageEngine = calculateMortgageEngine;
  }
})();
