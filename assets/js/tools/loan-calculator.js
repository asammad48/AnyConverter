/**
 * AnyConverter — Advanced Loan & EMI Calculator Engine
 * Supports: Beginner & Advanced Modes, Reducing Balance & Flat Rate,
 * Pakistan KIBOR Floating Benchmark Repricing, Year 1 Summary,
 * Annual Amortization with Drilldown Months, Loan Comparison & CSV Export.
 * Fully localized for EN, ES, DA.
 */
(function() {
  'use strict';

  var LANG = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang ? document.documentElement.lang : 'en').split('-')[0].toLowerCase();
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  var I18N = {
    en: {
      modeBeginner: 'Beginner Mode',
      modeAdvanced: 'Advanced Options',
      currency: 'Currency',
      loanAmount: 'Loan Amount',
      interestRate: 'Annual Interest Rate (%)',
      loanTerm: 'Loan Term',
      termYears: 'Years',
      termMonths: 'Months',
      frequency: 'Payment Frequency',
      freqMonthly: 'Monthly (12/yr)',
      freqBiWeekly: 'Bi-Weekly (26/yr)',
      freqWeekly: 'Weekly (52/yr)',
      startDate: 'First Payment Date',
      rateType: 'Interest Calculation Method',
      rateReducing: 'Reducing Balance (Standard)',
      rateFlat: 'Flat Rate (Fixed on Principal)',
      rateFloating: 'Floating Benchmark (e.g. KIBOR / SOFR)',
      benchmark: 'Floating Benchmark',
      benchmarkRateLabel: 'Benchmark Base Rate (%)',
      benchmarkHypotheticalNote: 'Hypothetical educational baseline. Check official fixing for your tenor.',
      kiborNotice: 'Variable benchmarks (such as KIBOR Offer-side published by State Bank of Pakistan / FMAP, or SOFR/EURIBOR) fluctuate daily with financial markets. All benchmark defaults here are strictly hypothetical educational baselines. Verify the current fixing directly at the official source before making credit commitments.',
      kibor1M: '1-Month Tenor (Monthly Reset)',
      kibor3M: '3-Month Tenor (Quarterly Reset)',
      kibor6M: '6-Month Tenor (Semi-Annual Reset)',
      kibor12M: '12-Month Tenor (Annual Reset)',
      kiborCustom: 'Custom Benchmark Rate',
      bankSpread: 'Bank Margin / Spread (%)',
      repricingFreq: 'Repricing Reset Frequency',
      repricing1M: 'Every Month (1 Month)',
      repricing3M: 'Every 3 Months',
      repricing6M: 'Every 6 Months',
      repricing12M: 'Every 12 Months (Annual)',
      scenarioPath: 'Future Benchmark Path',
      pathUnchanged: 'Benchmark Unchanged',
      pathRises: 'Benchmark Rises (+1.50% in Yr 2, +2.50% in Yr 3)',
      pathFalls: 'Benchmark Falls (-1.50% in Yr 2, -2.50% in Yr 3)',
      feesSection: 'Fees & Insurance',
      upfrontFee: 'Upfront / Processing Fee',
      recurringFee: 'Recurring Monthly Fee',
      prepaymentsSection: 'Extra Prepayments',
      extraMonthly: 'Extra Payment per Month',
      lumpSum: 'One-Time Lump Sum Prepayment',
      lumpSumMonth: 'At Month Number',
      calculateBtn: 'Calculate Loan',
      resetBtn: 'Reset',
      downloadCsvBtn: 'Download CSV Schedule',
      printBtn: 'Print Summary',
      compareBtn: 'Compare Scenarios (Loan A vs B)',
      monthlyPayment: 'Monthly Installment',
      totalInterest: 'Total Interest',
      totalPayment: 'Total Repayment',
      payoffDate: 'Estimated Payoff Date',
      effectiveApr: 'Fee-Inclusive APR (Nominal)',
      nominalAprLabel: 'Nominal Annual APR (r × 12)',
      effectiveRateLabel: 'Effective Annual Rate (EAR)',
      flatRateWarning: 'Flat rate alert: An advertised {rate}% flat rate has an effective reducing APR of approximately {apr}%. Prepaying early does not reduce interest in a flat-rate contract unless explicitly permitted by the lender.',
      firstMonthTitle: 'First-Month Payment Breakdown',
      firstMonthPrin: 'Principal:',
      firstMonthInt: 'Interest:',
      year1Title: 'First-Year (12-Month) Milestone Summary',
      year1Paid: 'Total Paid in Year 1',
      year1Prin: 'Principal Retired in Year 1',
      year1Int: 'Interest Incurred in Year 1',
      year1Bal: 'Balance After Year 1',
      scheduleTitle: 'Annual Amortization Schedule',
      colYear: 'Year',
      colOpening: 'Opening Balance',
      colPayments: 'Total Payments',
      colPrincipal: 'Principal',
      colInterest: 'Interest',
      colFees: 'Fees',
      colClosing: 'Closing Balance',
      colAction: 'Drilldown',
      expandMonths: 'Expand Months ▾',
      collapseMonths: 'Hide Months ▴',
      colMonth: 'Month',
      colDate: 'Date',
      colRate: 'Rate',
      compTitle: 'Scenario Comparison: Loan A vs Loan B',
      compDiffMonth: 'Monthly Difference',
      compDiffInterest: 'Lifetime Interest Savings',
      compDiffTime: 'Time Saved',
      copied: 'Copied to clipboard',
      chartPrincipal: 'Principal Repaid',
      chartInterest: 'Interest Cost'
    },
    es: {
      modeBeginner: 'Modo Principiante',
      modeAdvanced: 'Opciones Avanzadas',
      currency: 'Moneda',
      loanAmount: 'Monto del préstamo',
      interestRate: 'Tasa de interés anual (%)',
      loanTerm: 'Plazo del préstamo',
      termYears: 'Años',
      termMonths: 'Meses',
      frequency: 'Frecuencia de pago',
      freqMonthly: 'Mensual (12/año)',
      freqBiWeekly: 'Quincenal (26/año)',
      freqWeekly: 'Semanal (52/año)',
      startDate: 'Fecha del primer pago',
      rateType: 'Método de cálculo de interés',
      rateReducing: 'Saldo decreciente (Estándar)',
      rateFlat: 'Tasa fija directa (Flat Rate)',
      rateFloating: 'Tasa variable / Flotante (Euribor / KIBOR)',
      benchmark: 'Tasa de referencia flotante',
      benchmarkRateLabel: 'Tipo de referencia base (%)',
      benchmarkHypotheticalNote: 'Valor hipotético orientativo. Consulte la cotización oficial para su plazo.',
      kiborNotice: 'Los índices de referencia variables (como KIBOR publicado por el Banco Estatal de Pakistán / FMAP, o el Euribor) fluctúan diariamente según los mercados financieros. Todos los valores predeterminados son modelos hipotéticos orientativos. Verifique la cotización oficial vigente para su plazo antes de formalizar operaciones de crédito.',
      kibor1M: 'Plazo 1 Mes (Revisión mensual)',
      kibor3M: 'Plazo 3 Meses (Revisión trimestral)',
      kibor6M: 'Plazo 6 Meses (Revisión semestral)',
      kibor12M: 'Plazo 12 Meses (Revisión anual)',
      kiborCustom: 'Tasa de referencia personalizada',
      bankSpread: 'Diferencial bancario / Margen (%)',
      repricingFreq: 'Frecuencia de revisión',
      repricing1M: 'Cada mes (1 Mes)',
      repricing3M: 'Cada 3 meses',
      repricing6M: 'Cada 6 meses',
      repricing12M: 'Cada 12 meses (Anual)',
      scenarioPath: 'Evolución futura de la tasa',
      pathUnchanged: 'Tasa sin cambios',
      pathRises: 'Sube (+1.50% año 2, +2.50% año 3)',
      pathFalls: 'Baja (-1.50% año 2, -2.50% año 3)',
      feesSection: 'Comisiones y Gastos',
      upfrontFee: 'Comisión de apertura',
      recurringFee: 'Comisión mensual recurrente',
      prepaymentsSection: 'Pagos anticipados / Amortización',
      extraMonthly: 'Pago extra mensual',
      lumpSum: 'Amortización única extraordinaria',
      lumpSumMonth: 'En el mes nº',
      calculateBtn: 'Calcular Préstamo',
      resetBtn: 'Restablecer',
      downloadCsvBtn: 'Descargar Tabla CSV',
      printBtn: 'Imprimir Resumen',
      compareBtn: 'Comparar Escenarios (A vs B)',
      monthlyPayment: 'Cuota mensual',
      totalInterest: 'Interés total',
      totalPayment: 'Pago total',
      payoffDate: 'Fecha estimada de finalización',
      effectiveApr: 'TAE estimada (Tasa Anual Equivalente)',
      nominalAprLabel: 'TIN nominal anual (r × 12)',
      effectiveRateLabel: 'TAE efectiva ((1 + r)^12 − 1)',
      flatRateWarning: 'Aviso: Una tasa fija directa del {rate}% equivale a una TAE decreciente estimada de aproximadamente {apr}%. La amortización anticipada no reduce intereses en contratos a tasa fija directa salvo estipulación contractual.',
      firstMonthTitle: 'Desglose del primer pago',
      firstMonthPrin: 'Capital:',
      firstMonthInt: 'Interés:',
      year1Title: 'Resumen del primer año (12 meses)',
      year1Paid: 'Total pagado en Año 1',
      year1Prin: 'Capital amortizado en Año 1',
      year1Int: 'Interés pagado en Año 1',
      year1Bal: 'Saldo restante tras Año 1',
      scheduleTitle: 'Cuadro de Amortización Anual',
      colYear: 'Año',
      colOpening: 'Saldo Inicial',
      colPayments: 'Pagos Totales',
      colPrincipal: 'Capital',
      colInterest: 'Intereses',
      colFees: 'Comisiones',
      colClosing: 'Saldo Final',
      colAction: 'Detalle',
      expandMonths: 'Ver meses ▾',
      collapseMonths: 'Ocultar meses ▴',
      colMonth: 'Mes',
      colDate: 'Fecha',
      colRate: 'Tasa',
      compTitle: 'Comparación: Préstamo A vs Préstamo B',
      compDiffMonth: 'Diferencia en cuota',
      compDiffInterest: 'Ahorro total en intereses',
      compDiffTime: 'Tiempo ahorrado',
      copied: 'Copiado al portapapeles',
      chartPrincipal: 'Capital amortizado',
      chartInterest: 'Costo por interés'
    },
    da: {
      modeBeginner: 'Begyndertilstand',
      modeAdvanced: 'Avancerede Valgmuligheder',
      currency: 'Valuta',
      loanAmount: 'Lånebeløb',
      interestRate: 'Årlig rentesats (%)',
      loanTerm: 'Løbetid',
      termYears: 'År',
      termMonths: 'Måneder',
      frequency: 'Betalingsfrekvens',
      freqMonthly: 'Månedlig (12/år)',
      freqBiWeekly: 'Hver 14. dag (26/år)',
      freqWeekly: 'Ugentlig (52/år)',
      startDate: 'Første betalingsdato',
      rateType: 'Rentemetode',
      rateReducing: 'Annuitetslån (Aftagende saldo)',
      rateFlat: 'Fast rente på oprindelig hovedstol',
      rateFloating: 'Variabel benchmarkrente (KIBOR / CIBOR)',
      benchmark: 'Variabel benchmark',
      benchmarkRateLabel: 'Referencesats grundrente (%)',
      benchmarkHypotheticalNote: 'Hypotetisk modelsats. Kontrollér den officielle fastsættelse for dit lån.',
      kiborNotice: 'Variable benchmarkrenter (såsom KIBOR fastsat af State Bank of Pakistan / FMAP, CIBOR eller EURIBOR) ændrer sig dagligt på de finansielle markeder. Alle standardværdier her er hypotetiske pædagogiske modeller. Kontrollér altid den gældende officielle fastsættelse før bindende låneaftaler.',
      kibor1M: '1 Måned (Månedlig regulering)',
      kibor3M: '3 Måneder (Kvartalsvis regulering)',
      kibor6M: '6 Måneder (Halvårlig regulering)',
      kibor12M: '12 Måneder (Årlig regulering)',
      kiborCustom: 'Brugerdefineret benchmark',
      bankSpread: 'Banktillæg / Margin (%)',
      repricingFreq: 'Rentejusteringsfrekvens',
      repricing1M: 'Hver måned (1 Måned)',
      repricing3M: 'Hver 3. måned',
      repricing6M: 'Hver 6. måned',
      repricing12M: 'Hvert år (12 måneder)',
      scenarioPath: 'Fremtidig renteudvikling',
      pathUnchanged: 'Uændret rente',
      pathRises: 'Renten stiger (+1.50% i år 2, +2.50% i år 3)',
      pathFalls: 'Renten falder (-1.50% i år 2, -2.50% i år 3)',
      feesSection: 'Gebyrer og omkostninger',
      upfrontFee: 'Stiftelsesgebyr',
      recurringFee: 'Månedligt administrationsgebyr',
      prepaymentsSection: 'Ekstra afdrag',
      extraMonthly: 'Ekstra månedligt afdrag',
      lumpSum: 'Ekstraordinært engangsafdrag',
      lumpSumMonth: 'I måned nr.',
      calculateBtn: 'Beregn Lån',
      resetBtn: 'Nulstil',
      downloadCsvBtn: 'Download CSV-afdragsplan',
      printBtn: 'Udskriv oversigt',
      compareBtn: 'Sammenlign Lån (A mod B)',
      monthlyPayment: 'Månedlig ydelse',
      totalInterest: 'Samlede renter',
      totalPayment: 'Samlet tilbagebetaling',
      payoffDate: 'Forventet slutdato',
      effectiveApr: 'ÅOP (Årlige Omkostninger i Procent)',
      nominalAprLabel: 'Nominel årlig rente (r × 12)',
      effectiveRateLabel: 'Effektiv årlig rente ((1 + r)^12 − 1)',
      flatRateWarning: 'Bemærk: En fast rente på {rate}% på oprindelig hovedstol svarer reelt til en årlig nominel rente (ÅOP) på cirka {apr}%. Ekstra afdrag reducerer normalt ikke samlede renteomkostninger ved fast rente på oprindelig hovedstol.',
      firstMonthTitle: 'Første måneds fordeling',
      firstMonthPrin: 'Afdrag:',
      firstMonthInt: 'Renter:',
      year1Title: 'Status efter 1. år (12 måneder)',
      year1Paid: 'Samlet betalt i år 1',
      year1Prin: 'Afdraget i år 1',
      year1Int: 'Renter betalt i år 1',
      year1Bal: 'Restgæld efter år 1',
      scheduleTitle: 'Årlig Afdragsplan',
      colYear: 'År',
      colOpening: 'Startsaldo',
      colPayments: 'Ydelser i alt',
      colPrincipal: 'Afdrag',
      colInterest: 'Renter',
      colFees: 'Gebyrer',
      colClosing: 'Slutsaldo',
      colAction: 'Detaljer',
      expandMonths: 'Vis måneder ▾',
      collapseMonths: 'Skjul måneder ▴',
      colMonth: 'Måned',
      colDate: 'Dato',
      colRate: 'Rente',
      compTitle: 'Sammenligning: Lån A mod Lån B',
      compDiffMonth: 'Forskel i månedlig ydelse',
      compDiffInterest: 'Besparelse på samlede renter',
      compDiffTime: 'Spart løbetid',
      copied: 'Kopieret til udklipsholder',
      chartPrincipal: 'Samlet afdrag',
      chartInterest: 'Renteomkostning'
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

  // Generate Month & Year label (e.g. "Nov 2026")
  function getPaymentDate(startYear, startMonth, monthOffset) {
    var d = new Date(startYear, startMonth - 1 + monthOffset, 1);
    var monthNames = {
      en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      es: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      da: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
    }[LANG];
    return monthNames[d.getMonth()] + ' ' + d.getFullYear();
  }

    // Cash-flow actuarial APR solver (Newton-Raphson) for fee-inclusive and flat-rate loans
  function solveFeeInclusiveAPR(principal, upfrontFee, cashFlows) {
    var netDisbursed = principal - upfrontFee;
    if (netDisbursed <= 0 || !cashFlows || cashFlows.length === 0) {
      return { nominalApr: 0, effectiveRate: 0, monthlyPeriodicRate: 0 };
    }

    var totalPaid = 0;
    for (var i = 0; i < cashFlows.length; i++) totalPaid += cashFlows[i];
    if (totalPaid <= netDisbursed) {
      return { nominalApr: 0, effectiveRate: 0, monthlyPeriodicRate: 0 };
    }

    var r = 0.05 / 12;
    for (var iter = 0; iter < 60; iter++) {
      var npv = -netDisbursed;
      var dNpv = 0;
      for (var t = 1; t <= cashFlows.length; t++) {
        var cf = cashFlows[t - 1];
        var discount = Math.pow(1 + r, t);
        npv += cf / discount;
        dNpv -= t * cf / (discount * (1 + r));
      }
      if (Math.abs(npv) < 1e-8) break;
      if (Math.abs(dNpv) < 1e-12) break;
      var nextR = r - npv / dNpv;
      if (nextR <= -0.99) nextR = r / 2;
      r = nextR;
    }
    var safeR = Math.max(0, r);
    var nominalApr = safeR * 12 * 100;
    var effectiveRate = (Math.pow(1 + safeR, 12) - 1) * 100;
    return {
      nominalApr: nominalApr,
      effectiveRate: effectiveRate,
      monthlyPeriodicRate: safeR
    };
  }

  // Core Math Calculation
  function calculateAmortizationEngine(params) {
    var principal = params.principal;
    var annualRate = params.rate;
    var termMonths = params.termMonths;
    var rateType = params.rateType || 'reducing';
    var flatRate = params.flatRate || annualRate;
    var upfrontFee = params.upfrontFee || 0;
    var recurringFee = params.recurringFee || 0;
    var extraMonthly = params.extraMonthly || 0;
    var lumpSum = params.lumpSum || 0;
    var lumpSumMonth = params.lumpSumMonth || 0;
    var startYear = params.startYear || new Date().getFullYear();
    var startMonth = params.startMonth || (new Date().getMonth() + 1);
    var floatingSchedule = params.floatingSchedule || null;

    var schedule = [];
    var balance = principal;
    var currentRate = annualRate;
    var remainingMonths = termMonths;

    var standardEmi = 0;
    if (rateType === 'flat') {
      var totalFlatInt = principal * (flatRate / 100) * (termMonths / 12);
      standardEmi = (principal + totalFlatInt) / termMonths;
    } else {
      if (currentRate <= 0) {
        standardEmi = principal / termMonths;
      } else {
        var r = currentRate / 100 / 12;
        standardEmi = principal * r * Math.pow(1 + r, termMonths) / (Math.pow(1 + r, termMonths) - 1);
      }
    }

    var monthIndex = 0;
    var maxCycles = termMonths * 2;

    while (balance > 0.005 && monthIndex < maxCycles) {
      monthIndex++;

      // Floating rate repricing check
      if (floatingSchedule && floatingSchedule[monthIndex] !== undefined) {
        currentRate = floatingSchedule[monthIndex];
        remainingMonths = Math.max(1, termMonths - monthIndex + 1);
        var rReset = currentRate / 100 / 12;
        if (rReset <= 0) {
          standardEmi = balance / remainingMonths;
        } else {
          standardEmi = balance * rReset * Math.pow(1 + rReset, remainingMonths) / (Math.pow(1 + rReset, remainingMonths) - 1);
        }
      }

      var opening = Math.round(balance * 100) / 100;
      var rPeriodic = currentRate / 100 / 12;
      var interest = (rateType === 'flat')
        ? Math.round(principal * (flatRate / 100) / 12 * 100) / 100
        : Math.round(opening * rPeriodic * 100) / 100;

      var standardPrincipal = Math.max(0, standardEmi - interest);
      var extra = extraMonthly;
      if (monthIndex === lumpSumMonth) {
        extra += lumpSum;
      }

      var totalPrincipalPayment = Math.round((standardPrincipal + extra) * 100) / 100;

      // Handle final balance cutoff or final period absorption
      if (monthIndex === termMonths || totalPrincipalPayment >= opening) {
        totalPrincipalPayment = opening;
        payment = Math.round((totalPrincipalPayment + interest) * 100) / 100;
        balance = 0;
      } else {
        balance = Math.round((opening - totalPrincipalPayment) * 100) / 100;
      }

      var payment = Math.round((totalPrincipalPayment + interest) * 100) / 100;

      schedule.push({
        month: monthIndex,
        date: getPaymentDate(startYear, startMonth, monthIndex - 1),
        rate: currentRate,
        openingBalance: opening,
        payment: payment,
        principal: totalPrincipalPayment,
        interest: interest,
        fees: recurringFee,
        closingBalance: balance
      });

      if (balance <= 0) break;
    }

    // Annual summary aggregation
    var annualSummaries = [];
    var yearIndex = 1;
    for (var i = 0; i < schedule.length; i += 12) {
      var chunk = schedule.slice(i, i + 12);
      var yrOpen = chunk[0].openingBalance;
      var yrClose = chunk[chunk.length - 1].closingBalance;
      var yrPay = 0, yrPrin = 0, yrInt = 0, yrFees = 0;
      for (var c = 0; c < chunk.length; c++) {
        yrPay += chunk[c].payment;
        yrPrin += chunk[c].principal;
        yrInt += chunk[c].interest;
        yrFees += chunk[c].fees;
      }
      annualSummaries.push({
        year: yearIndex++,
        openingBalance: yrOpen,
        totalPayments: yrPay,
        principal: yrPrin,
        interest: yrInt,
        fees: yrFees,
        closingBalance: yrClose,
        months: chunk
      });
    }

    var totalPaid = 0, totalPrincipal = 0, totalInterest = 0, totalFees = upfrontFee;
    for (var s = 0; s < schedule.length; s++) {
      totalPaid += schedule[s].payment;
      totalPrincipal += schedule[s].principal;
      totalInterest += schedule[s].interest;
      totalFees += schedule[s].fees;
    }

    var cashFlows = [];
    for (var s = 0; s < schedule.length; s++) {
      cashFlows.push(schedule[s].payment + schedule[s].fees);
    }

    var aprObj = solveFeeInclusiveAPR(principal, upfrontFee, cashFlows);
    var nominalApr = aprObj.nominalApr;
    var effectiveRate = aprObj.effectiveRate;
    if (!isFinite(nominalApr) || nominalApr <= 0) {
      if (rateType === 'flat') {
        nominalApr = ((2 * 12 * totalInterest) / (principal * (termMonths + 1)) * 100);
        var approxR = (nominalApr / 100) / 12;
        effectiveRate = (Math.pow(1 + approxR, 12) - 1) * 100;
      } else {
        nominalApr = annualRate;
        var rPeriodic = (annualRate / 100) / 12;
        effectiveRate = (Math.pow(1 + rPeriodic, 12) - 1) * 100;
      }
    }

    var finalDate = schedule.length > 0 ? schedule[schedule.length - 1].date : '—';
    var totalBorrowerOutlay = totalPaid + totalFees;

    return {
      params: params,
      schedule: schedule,
      annualSummaries: annualSummaries,
      initialEmi: schedule.length > 0 ? schedule[0].payment : 0,
      firstMonthPrincipal: schedule.length > 0 ? schedule[0].principal : 0,
      firstMonthInterest: schedule.length > 0 ? schedule[0].interest : 0,
      totalPayment: totalBorrowerOutlay,
      totalScheduledPrincipalInterest: totalPaid,
      totalPrincipal: totalPrincipal,
      totalInterest: totalInterest,
      totalFees: totalFees,
      effectiveApr: (LANG === 'es' || LANG === 'da') ? effectiveRate : nominalApr,
      nominalApr: nominalApr,
      effectiveRate: effectiveRate,
      payoffDate: finalDate,
      totalMonths: schedule.length,
      year1: annualSummaries[0] || null
    };
  }

  // Progressive DOM Enhancement
  function mountUI() {
    var toolZone = document.querySelector('.tool-zone > div');
    if (!toolZone || document.getElementById('ac-loan-enhanced-root')) return;

    var container = document.createElement('div');
    container.id = 'ac-loan-enhanced-root';
    container.className = 'ac-loan-engine';

    // Build enhanced UI layout
    container.innerHTML = [
      '<div class="ac-chip-row" style="margin-bottom:16px;display:flex;gap:8px;">',
      '  <button type="button" class="ac-chip is-active" id="btn-mode-beginner">' + T.modeBeginner + '</button>',
      '  <button type="button" class="ac-chip" id="btn-mode-advanced">' + T.modeAdvanced + '</button>',
      '  <div style="margin-left:auto;display:flex;align-items:center;gap:6px;">',
      '    <label for="ac-currency-select" style="font-size:12px;font-weight:600;color:var(--color-text-3);">' + T.currency + ':</label>',
      '    <select id="ac-currency-select" style="padding:4px 8px;border-radius:6px;border:1px solid var(--color-border);font-size:13px;background:var(--color-surface);">',
             Object.keys(CURRENCIES).map(function(c) {
               return '<option value="' + c + '" ' + (c === defaultCurr ? 'selected' : '') + '>' + CURRENCIES[c].name + '</option>';
             }).join(''),
      '    </select>',
      '  </div>',
      '</div>',

      // Basic parameters card
      '<div class="ac-card" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="loan-amount">' + T.loanAmount + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="loan-amount" placeholder="100000" min="1" step="1000" value="100000" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="loan-rate">' + T.interestRate + '</label>',
      '      <input type="number" id="loan-rate" placeholder="6.5" min="0" step="0.05" value="6.5" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">',
      '        <label style="font-size:13px;font-weight:600;" for="loan-term">' + T.loanTerm + '</label>',
      '        <div style="font-size:12px;">',
      '          <button type="button" id="term-unit-yrs" class="ac-subchip is-active" style="padding:2px 6px;border-radius:4px;border:1px solid var(--color-border);background:var(--color-primary-light);font-size:11px;font-weight:600;cursor:pointer;">' + T.termYears + '</button>',
      '          <button type="button" id="term-unit-mos" class="ac-subchip" style="padding:2px 6px;border-radius:4px;border:1px solid var(--color-border);background:var(--color-surface);font-size:11px;cursor:pointer;">' + T.termMonths + '</button>',
      '        </div>',
      '      </div>',
      '      <input type="number" id="loan-term" placeholder="5" min="1" step="1" value="5" style="width:100%;padding:10px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:15px;background:var(--color-bg);">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;" for="loan-start-date">' + T.startDate + '</label>',
      '      <input type="month" id="loan-start-date" value="' + new Date().toISOString().slice(0,7) + '" style="width:100%;padding:9px 12px;border:1px solid var(--color-border);border-radius:6px;font-size:14px;background:var(--color-bg);">',
      '    </div>',
      '  </div>',
      '</div>',

      // Advanced options container (toggled via Advanced tab)
      '<div id="ac-advanced-panel" style="display:none;background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;margin-bottom:16px;">',
      '  <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--color-text);">' + T.modeAdvanced + '</h3>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-rate-type">' + T.rateType + '</label>',
      '      <select id="ac-rate-type" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="reducing" selected>' + T.rateReducing + '</option>',
      '        <option value="flat">' + T.rateFlat + '</option>',
      '        <option value="floating">' + T.rateFloating + '</option>',
      '      </select>',
      '    </div>',
      '    <div id="ac-floating-tenor-wrap" style="display:none;">',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-kibor-tenor">' + T.benchmark + '</label>',
      '      <select id="ac-kibor-tenor" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="1m">' + T.kibor1M + '</option>',
      '        <option value="3m">' + T.kibor3M + '</option>',
      '        <option value="6m" selected>' + T.kibor6M + '</option>',
      '        <option value="12m">' + T.kibor12M + '</option>',
      '        <option value="custom">' + T.kiborCustom + '</option>',
      '      </select>',
      '    </div>',
      '    <div id="ac-benchmark-rate-wrap" style="display:none;">',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-benchmark-rate">' + T.benchmarkRateLabel + '</label>',
      '      <input type="number" id="ac-benchmark-rate" value="12.50" step="0.05" min="0" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '      <span style="font-size:11px;color:var(--color-text-3);display:block;margin-top:2px;">' + T.benchmarkHypotheticalNote + '</span>',
      '    </div>',
      '    <div id="ac-spread-wrap" style="display:none;">',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-spread-rate">' + T.bankSpread + '</label>',
      '      <input type="number" id="ac-spread-rate" value="2.0" step="0.25" min="0" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div id="ac-repricing-wrap" style="display:none;">',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-repricing-freq">' + T.repricingFreq + '</label>',
      '      <select id="ac-repricing-freq" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="1">' + T.repricing1M + '</option>',
      '        <option value="3">' + T.repricing3M + '</option>',
      '        <option value="6" selected>' + T.repricing6M + '</option>',
      '        <option value="12">' + T.repricing12M + '</option>',
      '      </select>',
      '    </div>',
      '    <div id="ac-scenario-wrap" style="display:none;">',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-scenario-path">' + T.scenarioPath + '</label>',
      '      <select id="ac-scenario-path" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '        <option value="unchanged" selected>' + T.pathUnchanged + '</option>',
      '        <option value="rises">' + T.pathRises + '</option>',
      '        <option value="falls">' + T.pathFalls + '</option>',
      '      </select>',
      '    </div>',
      '  </div>',
      '  <div id="ac-kibor-alert" style="display:none;background:var(--color-primary-light);border-left:3px solid var(--color-primary);padding:8px 12px;border-radius:4px;font-size:12px;color:var(--color-text);margin-bottom:14px;">',
      '    <strong>Notice:</strong> ' + T.kiborNotice + ' <a href="https://www.sbp.org.pk/ecodata/kibor_index.asp" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary);text-decoration:underline;margin-left:4px;">SBP Official KIBOR ↗</a>',
      '  </div>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;border-top:1px solid var(--color-border);padding-top:14px;margin-bottom:14px;">',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-upfront-fee">' + T.upfrontFee + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ac-upfront-fee" value="0" min="0" step="50" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-recurring-fee">' + T.recurringFee + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ac-recurring-fee" value="0" min="0" step="5" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-extra-monthly">' + T.extraMonthly + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ac-extra-monthly" value="0" min="0" step="25" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-lump-sum">' + T.lumpSum + ' (<span class="ac-curr-sym">' + activeCurrency.symbol + '</span>)</label>',
      '      <input type="number" id="ac-lump-sum" value="0" min="0" step="500" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '    <div>',
      '      <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="ac-lump-month">' + T.lumpSumMonth + '</label>',
      '      <input type="number" id="ac-lump-month" value="12" min="1" step="1" style="width:100%;padding:8px;border:1px solid var(--color-border);border-radius:6px;font-size:13px;">',
      '    </div>',
      '  </div>',
      '</div>',

      // Action bar
      '<div class="ac-action-bar" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;">',
      '  <button type="button" class="btn btn-primary" id="btn-calc-loan">' + T.calculateBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-reset-loan">' + T.resetBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-download-csv" style="display:none;">' + T.downloadCsvBtn + '</button>',
      '  <button type="button" class="btn btn-secondary" id="btn-print-summary" style="display:none;">' + T.printBtn + '</button>',
      '</div>',

      // Output display container
      '<div id="loan-result" style="display:none;">',
      '  <!-- Flat Rate Warning Alert -->',
      '  <div id="ac-flat-alert" style="display:none;background:#FFFBEB;border:1px solid #F59E0B;border-radius:6px;padding:12px;font-size:13px;color:#92400E;margin-bottom:16px;"></div>',

      '  <!-- Big Primary Stats -->',
      '  <div class="three-col-grid" style="margin-bottom:16px;">',
      '    <div class="stat-card"><div class="stat-val" id="emi-val">—</div><div class="stat-lbl">' + T.monthlyPayment + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="total-interest">—</div><div class="stat-lbl">' + T.totalInterest + '</div></div>',
      '    <div class="stat-card"><div class="stat-val" id="total-payment">—</div><div class="stat-lbl">' + T.totalPayment + '</div></div>',
      '  </div>',

      '  <!-- Visual Breakdown Bar -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:8px;">',
      '      <span>' + T.chartPrincipal + ': <strong id="ac-bar-prin-val">—</strong></span>',
      '      <span>' + T.chartInterest + ': <strong id="ac-bar-int-val">—</strong></span>',
      '    </div>',
      '    <div style="height:12px;border-radius:6px;overflow:hidden;background:#EF4444;display:flex;">',
      '      <div id="ac-bar-prin" style="background:#10B981;height:100%;width:70%;"></div>',
      '      <div id="ac-bar-int" style="background:#EF4444;height:100%;width:30%;"></div>',
      '    </div>',
      '    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-3);margin-top:6px;">',
      '      <span>' + T.effectiveApr + ': <strong id="ac-eff-apr">—</strong></span>',
      '      <span>' + T.payoffDate + ': <strong id="ac-payoff-date">—</strong></span>',
      '    </div>',
      '  </div>',

      '  <!-- First Month Breakdown & Year 1 Milestone Grid -->',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:16px;">',
      '    <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;">',
      '      <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--color-text);">' + T.firstMonthTitle + '</h4>',
      '      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--color-border);font-size:13px;">',
      '        <span>' + T.firstMonthPrin + '</span><strong id="ac-first-prin">—</strong>',
      '      </div>',
      '      <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--color-border);font-size:13px;">',
      '        <span>' + T.firstMonthInt + '</span><strong id="ac-first-int">—</strong>',
      '      </div>',
      '      <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;">',
      '        <span>' + T.colFees + ':</span><strong id="ac-first-fees">—</strong>',
      '      </div>',
      '    </div>',
      '    <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;">',
      '      <h4 style="font-size:13px;font-weight:700;margin-bottom:10px;color:var(--color-text);">' + T.year1Title + '</h4>',
      '      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">',
      '        <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Paid + '</span><strong id="ac-y1-paid" style="font-size:13px;">—</strong></div>',
      '        <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Prin + '</span><strong id="ac-y1-prin" style="font-size:13px;">—</strong></div>',
      '        <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Int + '</span><strong id="ac-y1-int" style="font-size:13px;">—</strong></div>',
      '        <div style="background:var(--color-bg);padding:8px;border-radius:6px;"><span style="color:var(--color-text-3);display:block;">' + T.year1Bal + '</span><strong id="ac-y1-bal" style="font-size:13px;">—</strong></div>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <!-- Annual Amortization Table with Drilldown Months -->',
      '  <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:14px;margin-bottom:16px;">',
      '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">',
      '      <h4 style="font-size:14px;font-weight:700;margin:0;">' + T.scheduleTitle + '</h4>',
      '      <span style="font-size:12px;color:var(--color-text-3);">Click any year to inspect months</span>',
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
      '            <th style="padding:8px;">' + T.colFees + '</th>',
      '            <th style="padding:8px;">' + T.colClosing + '</th>',
      '            <th style="padding:8px;text-align:center;">' + T.colAction + '</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody id="ac-annual-tbody"></tbody>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    // Replace original form container content cleanly
    toolZone.innerHTML = '';
    toolZone.appendChild(container);

    bindEvents();
    executeCalculation();
  }

  var currentResult = null;
  var isYearsUnit = true;

  function bindEvents() {
    // Mode toggles
    document.getElementById('btn-mode-beginner').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-mode-advanced').classList.remove('is-active');
      document.getElementById('ac-advanced-panel').style.display = 'none';
    });

    document.getElementById('btn-mode-advanced').addEventListener('click', function() {
      this.classList.add('is-active');
      document.getElementById('btn-mode-beginner').classList.remove('is-active');
      document.getElementById('ac-advanced-panel').style.display = 'block';
    });

    // Term unit toggles (Years vs Months)
    document.getElementById('term-unit-yrs').addEventListener('click', function() {
      if (isYearsUnit) return;
      isYearsUnit = true;
      this.classList.add('is-active');
      this.style.background = 'var(--color-primary-light)';
      this.style.fontWeight = '600';
      var mosBtn = document.getElementById('term-unit-mos');
      mosBtn.classList.remove('is-active');
      mosBtn.style.background = 'var(--color-surface)';
      mosBtn.style.fontWeight = 'normal';
      var val = parseFloat(document.getElementById('loan-term').value) || 60;
      document.getElementById('loan-term').value = Math.max(1, Math.round(val / 12));
      executeCalculation();
    });

    document.getElementById('term-unit-mos').addEventListener('click', function() {
      if (!isYearsUnit) return;
      isYearsUnit = false;
      this.classList.add('is-active');
      this.style.background = 'var(--color-primary-light)';
      this.style.fontWeight = '600';
      var yrsBtn = document.getElementById('term-unit-yrs');
      yrsBtn.classList.remove('is-active');
      yrsBtn.style.background = 'var(--color-surface)';
      yrsBtn.style.fontWeight = 'normal';
      var val = parseFloat(document.getElementById('loan-term').value) || 5;
      document.getElementById('loan-term').value = Math.round(val * 12);
      executeCalculation();
    });

    // Currency selector
    document.getElementById('ac-currency-select').addEventListener('change', function() {
      var selected = this.value;
      if (CURRENCIES[selected]) {
        activeCurrency = CURRENCIES[selected];
        document.querySelectorAll('.ac-curr-sym').forEach(function(el) {
          el.textContent = activeCurrency.symbol;
        });
        executeCalculation();
      }
    });

    // Rate Type toggles (Flat vs Floating vs Reducing)
    document.getElementById('ac-rate-type').addEventListener('change', function() {
      var isFloating = this.value === 'floating';
      document.getElementById('ac-floating-tenor-wrap').style.display = isFloating ? 'block' : 'none';
      document.getElementById('ac-benchmark-rate-wrap').style.display = isFloating ? 'block' : 'none';
      document.getElementById('ac-spread-wrap').style.display = isFloating ? 'block' : 'none';
      document.getElementById('ac-repricing-wrap').style.display = isFloating ? 'block' : 'none';
      document.getElementById('ac-scenario-wrap').style.display = isFloating ? 'block' : 'none';
      document.getElementById('ac-kibor-alert').style.display = isFloating ? 'block' : 'none';
      if (isFloating) {
        var benchVal = parseFloat(document.getElementById('ac-benchmark-rate').value) || 0;
        var spreadVal = parseFloat(document.getElementById('ac-spread-rate').value) || 0;
        document.getElementById('loan-rate').value = (benchVal + spreadVal).toFixed(2);
      }
      executeCalculation();
    });

    // Tenor selector synchronizes repricing schedule
    document.getElementById('ac-kibor-tenor').addEventListener('change', function() {
      var tenorKey = this.value;
      var repricingMap = { '1m': '1', '3m': '3', '6m': '6', '12m': '12' };
      if (repricingMap[tenorKey]) {
        var repricingEl = document.getElementById('ac-repricing-freq');
        if (repricingEl) repricingEl.value = repricingMap[tenorKey];
      }
      executeCalculation();
    });

    ['ac-benchmark-rate', 'ac-spread-rate'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function() {
          var benchVal = parseFloat(document.getElementById('ac-benchmark-rate').value) || 0;
          var spreadVal = parseFloat(document.getElementById('ac-spread-rate').value) || 0;
          document.getElementById('loan-rate').value = (benchVal + spreadVal).toFixed(2);
          executeCalculation();
        });
      }
    });

    // Inputs real-time listener
    ['loan-amount','loan-rate','loan-term','loan-start-date','ac-repricing-freq','ac-upfront-fee','ac-recurring-fee','ac-extra-monthly','ac-lump-sum','ac-lump-month','ac-scenario-path'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', executeCalculation);
        el.addEventListener('change', executeCalculation);
      }
    });

    // Buttons
    document.getElementById('btn-calc-loan').addEventListener('click', executeCalculation);
    document.getElementById('btn-reset-loan').addEventListener('click', function() {
      document.getElementById('loan-amount').value = '100000';
      document.getElementById('loan-rate').value = '6.5';
      document.getElementById('loan-term').value = isYearsUnit ? '5' : '60';
      document.getElementById('ac-rate-type').value = 'reducing';
      document.getElementById('ac-floating-tenor-wrap').style.display = 'none';
      document.getElementById('ac-benchmark-rate-wrap').style.display = 'none';
      document.getElementById('ac-spread-wrap').style.display = 'none';
      document.getElementById('ac-repricing-wrap').style.display = 'none';
      document.getElementById('ac-scenario-wrap').style.display = 'none';
      document.getElementById('ac-kibor-alert').style.display = 'none';
      document.getElementById('ac-benchmark-rate').value = '12.50';
      document.getElementById('ac-kibor-tenor').value = '6m';
      document.getElementById('ac-spread-rate').value = '2.0';
      document.getElementById('ac-repricing-freq').value = '6';
      document.getElementById('ac-upfront-fee').value = '0';
      document.getElementById('ac-recurring-fee').value = '0';
      document.getElementById('ac-extra-monthly').value = '0';
      document.getElementById('ac-lump-sum').value = '0';
      executeCalculation();
    });

    document.getElementById('btn-download-csv').addEventListener('click', downloadCsv);
    document.getElementById('btn-print-summary').addEventListener('click', function() {
      window.print();
    });
  }

  function executeCalculation() {
    var P = parseFloat(document.getElementById('loan-amount').value);
    var annualRate = parseFloat(document.getElementById('loan-rate').value);
    var termRaw = parseFloat(document.getElementById('loan-term').value);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(termRaw) || termRaw <= 0) {
      document.getElementById('loan-result').style.display = 'none';
      return;
    }

    var termMonths = isYearsUnit ? Math.round(termRaw * 12) : Math.round(termRaw);
    var rateType = document.getElementById('ac-rate-type').value;

    var startDateVal = document.getElementById('loan-start-date').value || new Date().toISOString().slice(0,7);
    var dateParts = startDateVal.split('-');
    var startYear = parseInt(dateParts[0], 10);
    var startMonth = parseInt(dateParts[1], 10);

    var upfrontFee = parseFloat(document.getElementById('ac-upfront-fee').value) || 0;
    var recurringFee = parseFloat(document.getElementById('ac-recurring-fee').value) || 0;
    var extraMonthly = parseFloat(document.getElementById('ac-extra-monthly').value) || 0;
    var lumpSum = parseFloat(document.getElementById('ac-lump-sum').value) || 0;
    var lumpSumMonth = parseInt(document.getElementById('ac-lump-month').value, 10) || 12;

    // Build floating schedule if floating mode active
    var floatingSchedule = null;
    if (rateType === 'floating') {
      floatingSchedule = {};
      var repricingFreq = parseInt(document.getElementById('ac-repricing-freq').value, 10) || 6;
      var pathMode = document.getElementById('ac-scenario-path').value;
      for (var m = 1; m <= termMonths; m++) {
        if ((m - 1) % repricingFreq === 0 && m > 1) {
          var yearIdx = Math.floor((m - 1) / 12) + 1;
          var shift = 0;
          if (pathMode === 'rises') {
            shift = (yearIdx === 2) ? 1.50 : (yearIdx >= 3 ? 2.50 : 0);
          } else if (pathMode === 'falls') {
            shift = (yearIdx === 2) ? -1.50 : (yearIdx >= 3 ? -2.50 : 0);
          }
          floatingSchedule[m] = Math.max(0.5, annualRate + shift);
        }
      }
    }

    var res = calculateAmortizationEngine({
      principal: P,
      rate: annualRate,
      termMonths: termMonths,
      rateType: rateType,
      flatRate: annualRate,
      upfrontFee: upfrontFee,
      recurringFee: recurringFee,
      extraMonthly: extraMonthly,
      lumpSum: lumpSum,
      lumpSumMonth: lumpSumMonth,
      startYear: startYear,
      startMonth: startMonth,
      floatingSchedule: floatingSchedule
    });

    currentResult = res;

    // Display primary statistics
    document.getElementById('emi-val').textContent = formatMoney(res.initialEmi);
    document.getElementById('total-interest').textContent = formatMoney(res.totalInterest);
    document.getElementById('total-payment').textContent = formatMoney(res.totalPayment);
    if (LANG === 'es') {
      document.getElementById('ac-eff-apr').textContent = formatPct(res.effectiveRate) + ' (TIN: ' + formatPct(res.nominalApr) + ')';
    } else if (LANG === 'da') {
      document.getElementById('ac-eff-apr').textContent = formatPct(res.effectiveRate) + ' (Nominel: ' + formatPct(res.nominalApr) + ')';
    } else {
      document.getElementById('ac-eff-apr').textContent = formatPct(res.nominalApr) + ' (EAR: ' + formatPct(res.effectiveRate) + ')';
    }
    document.getElementById('ac-payoff-date').textContent = res.payoffDate;

    // Flat rate warning check
    var flatAlert = document.getElementById('ac-flat-alert');
    if (rateType === 'flat') {
      flatAlert.textContent = T.flatRateWarning
        .replace('{rate}', annualRate.toFixed(2))
        .replace('{apr}', res.effectiveApr.toFixed(2));
      flatAlert.style.display = 'block';
    } else {
      flatAlert.style.display = 'none';
    }

    // Visual breakdown bar
    var totalCost = res.totalPrincipal + res.totalInterest;
    var prinPct = totalCost > 0 ? (res.totalPrincipal / totalCost * 100) : 100;
    var intPct = 100 - prinPct;
    document.getElementById('ac-bar-prin').style.width = prinPct + '%';
    document.getElementById('ac-bar-int').style.width = intPct + '%';
    document.getElementById('ac-bar-prin-val').textContent = formatMoney(res.totalPrincipal) + ' (' + prinPct.toFixed(1) + '%)';
    document.getElementById('ac-bar-int-val').textContent = formatMoney(res.totalInterest) + ' (' + intPct.toFixed(1) + '%)';

    // First Month Breakdown
    document.getElementById('ac-first-prin').textContent = formatMoney(res.firstMonthPrincipal);
    document.getElementById('ac-first-int').textContent = formatMoney(res.firstMonthInterest);
    document.getElementById('ac-first-fees').textContent = formatMoney(recurringFee);

    // Year 1 Milestone Breakdown
    if (res.year1) {
      document.getElementById('ac-y1-paid').textContent = formatMoney(res.year1.totalPayments);
      document.getElementById('ac-y1-prin').textContent = formatMoney(res.year1.principal);
      document.getElementById('ac-y1-int').textContent = formatMoney(res.year1.interest);
      document.getElementById('ac-y1-bal').textContent = formatMoney(res.year1.closingBalance);
    }

    // Render Annual Amortization Table
    renderAnnualTable(res.annualSummaries);

    document.getElementById('loan-result').style.display = 'block';
    document.getElementById('btn-download-csv').style.display = 'inline-block';
    document.getElementById('btn-print-summary').style.display = 'inline-block';
  }

  function renderAnnualTable(summaries) {
    var tbody = document.getElementById('ac-annual-tbody');
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
        '<td style="padding:10px 8px;">' + formatMoney(yearSummary.fees) + '</td>',
        '<td style="padding:10px 8px;font-weight:600;">' + formatMoney(yearSummary.closingBalance) + '</td>',
        '<td style="padding:10px 8px;text-align:center;"><button type="button" class="ac-drill-btn" style="padding:3px 8px;border-radius:4px;border:1px solid var(--color-border);background:var(--color-bg);font-size:11px;cursor:pointer;">' + T.expandMonths + '</button></td>'
      ].join('');

      // Sub-table row for expandable month-by-month figures
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
        '        <th style="padding:6px;">' + T.monthlyPayment + '</th>',
        '        <th style="padding:6px;">' + T.colPrincipal + '</th>',
        '        <th style="padding:6px;">' + T.colInterest + '</th>',
        '        <th style="padding:6px;">' + T.colClosing + '</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
               yearSummary.months.map(function(m) {
                 return '<tr style="border-bottom:1px solid var(--color-border);">' +
                   '<td style="padding:5px 6px;text-align:left;font-weight:600;">' + m.month + '</td>' +
                   '<td style="padding:5px 6px;text-align:left;color:var(--color-text-3);">' + m.date + '</td>' +
                   '<td style="padding:5px 6px;">' + formatMoney(m.openingBalance) + '</td>' +
                   '<td style="padding:5px 6px;font-weight:600;">' + formatMoney(m.payment) + '</td>' +
                   '<td style="padding:5px 6px;color:#10B981;">' + formatMoney(m.principal) + '</td>' +
                   '<td style="padding:5px 6px;color:#EF4444;">' + formatMoney(m.interest) + '</td>' +
                   '<td style="padding:5px 6px;font-weight:600;">' + formatMoney(m.closingBalance) + '</td>' +
                 '</tr>';
               }).join(''),
        '    </tbody>',
        '  </table>',
        '</div>'
      ].join('');

      subTd.innerHTML = monthHtml;
      subTr.appendChild(subTd);

      // Drilldown click behavior
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

  function downloadCsv() {
    if (!currentResult) return;
    var rows = [
      ['Year', 'Month', 'Date', 'OpeningBalance', 'Payment', 'Principal', 'Interest', 'Fees', 'ClosingBalance', 'AnnualRate']
    ];

    currentResult.annualSummaries.forEach(function(y) {
      y.months.forEach(function(m) {
        rows.push([
          y.year,
          m.month,
          m.date,
          m.openingBalance.toFixed(2),
          m.payment.toFixed(2),
          m.principal.toFixed(2),
          m.interest.toFixed(2),
          m.fees.toFixed(2),
          m.closingBalance.toFixed(2),
          m.rate.toFixed(2)
        ]);
      });
    });

    var csvContent = rows.map(function(r) { return r.join(','); }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'loan_amortization_schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Self initialize on DOM load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountUI);
    } else {
      mountUI();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateAmortizationEngine: calculateAmortizationEngine,
      solveFeeInclusiveAPR: solveFeeInclusiveAPR
    };
  }
  if (typeof window !== 'undefined') {
    window.calculateAmortizationEngine = calculateAmortizationEngine;
    window.solveFeeInclusiveAPR = solveFeeInclusiveAPR;
  }
})();
