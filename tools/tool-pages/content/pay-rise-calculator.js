'use strict';

const seo = {
  en: {
    name: 'Pay Rise Calculator', card: 'New salary after a raise, and the raise after inflation.',
    desc: 'Free pay rise calculator: see your new salary after a % or fixed raise, the raise in percent, monthly and hourly pay, and your real pay rise after inflation.',
    h1: 'Pay Rise Calculator',
    lede: 'Enter your current pay and the raise as a percentage, an amount or a new salary. See the new pay per year, month, week and hour, and whether the raise beats inflation.',
    howH: 'How to work out a pay rise',
    how: [['Enter your current pay', 'Choose whether it is yearly, monthly, weekly or hourly, and your usual hours per week.'],
      ['Describe the raise', 'As a percentage, a fixed amount, or the new salary you have been offered.'],
      ['Compare with inflation', 'Add the inflation rate to see your real pay rise in purchasing power.']],
    featH: 'More than a percentage',
    feats: [['Three ways to enter a raise', 'Percentage, amount per period, or the new salary – the calculator works out the rest.'],
      ['Every pay period', 'Yearly, monthly, weekly and hourly pay before and after, using your own hours.'],
      ['Real raise after inflation', 'Uses (1 + raise) ÷ (1 + inflation) − 1, not a simple subtraction.'],
      ['Gross pay, clearly labelled', 'Tax and pension depend on your country, so results are before deductions.']],
    sections: [
      { h: 'How a pay rise is calculated', p: [
        'New salary = current salary × (1 + raise ÷ 100). A 4% raise on 42,000 a year gives 42,000 × 1.04 = 43,680, which is 1,680 more per year or 140 more per month. If you are offered a new salary instead, the raise is (new − old) ÷ old × 100: going from 42,000 to 45,000 is a 7.14% raise.',
        'To convert between pay periods the calculator uses 12 months and 52 weeks per year, and your hours per week for hourly pay. A full-time 37-hour week is 1,924 hours a year.'] },
      { h: 'Is your raise above inflation?', p: [
        'A raise only increases your purchasing power if it is larger than inflation. The real raise is (1 + raise) ÷ (1 + inflation) − 1. With a 4% raise and 3% inflation, your real raise is 1.04 ÷ 1.03 − 1 = 0.97%, slightly less than the 1 percentage point you get by subtracting. With 5% inflation, the same raise is a 0.95% real pay cut.',
        'Use the [[percentage-difference-calculator|percentage difference calculator]] to compare two job offers, or the [[price-increase-calculator|price increase calculator]] for prices that rose by a percentage.'] }
    ],
    faq: [['How do I calculate a percentage pay rise?', 'Multiply your current salary by 1 plus the raise as a decimal. A 3.5% raise on 30,000 is 30,000 × 1.035 = 31,050.'],
      ['How do I work out what percentage my raise is?', 'Subtract the old salary from the new salary, divide by the old salary and multiply by 100.'],
      ['Is this before or after tax?', 'Before tax. Income tax, social contributions and pension depend on where you live, so the calculator works with gross pay.'],
      ['How is the hourly rate calculated?', 'Yearly pay ÷ (hours per week × 52). Change the hours to match your contract.'],
      ['What is a real pay rise?', 'Your raise adjusted for inflation: (1 + raise) ÷ (1 + inflation) − 1. It shows whether you can buy more with your new pay.'],
      ['Should I compare raises in percent or in money?', 'Both are useful. Percentages compare fairly across salaries; the amount per month is what you will actually notice.']]
  },
  es: {
    name: 'Calculadora de Aumento Salarial', card: 'Sueldo nuevo tras un aumento y el aumento real con inflación.',
    desc: 'Calculadora de aumento salarial gratis: tu nuevo sueldo tras un aumento en % o importe fijo, el % de subida, el sueldo mensual y por hora y el aumento real.',
    h1: 'Calculadora de Aumento Salarial',
    lede: 'Introduce tu sueldo actual y el aumento como porcentaje, como importe o como nuevo salario. Verás el nuevo sueldo al año, al mes, a la semana y por hora, y si el aumento supera la inflación.',
    howH: 'Cómo calcular un aumento de sueldo',
    how: [['Introduce tu sueldo actual', 'Indica si es anual, mensual, semanal o por hora, y tus horas habituales por semana.'],
      ['Describe el aumento', 'Como porcentaje, como importe fijo o como el nuevo salario que te ofrecen.'],
      ['Compáralo con la inflación', 'Añade la inflación para ver tu aumento real en poder adquisitivo.']],
    featH: 'Más que un porcentaje',
    feats: [['Tres formas de indicar el aumento', 'Porcentaje, importe por periodo o el nuevo salario: la calculadora hace el resto.'],
      ['Todos los periodos', 'Sueldo anual, mensual, semanal y por hora antes y después, con tus propias horas.'],
      ['Aumento real con inflación', 'Usa (1 + aumento) ÷ (1 + inflación) − 1, no una resta simple.'],
      ['Sueldo bruto, bien indicado', 'Los impuestos y la cotización dependen del país, así que el resultado es antes de retenciones.']],
    sections: [
      { h: 'Cómo se calcula un aumento de sueldo', p: [
        'Sueldo nuevo = sueldo actual × (1 + aumento ÷ 100). Un aumento del 4 % sobre 24.000 al año da 24.000 × 1,04 = 24.960, es decir, 960 más al año u 80 más al mes (en 12 pagas). Si te ofrecen un salario nuevo, el aumento es (nuevo − antiguo) ÷ antiguo × 100: pasar de 24.000 a 26.000 es un aumento del 8,33 %.',
        'Para convertir entre periodos, la calculadora usa 12 meses y 52 semanas al año, y tus horas semanales para el sueldo por hora. Si cobras en 14 pagas, piensa en el salario anual: el porcentaje de aumento es el mismo.'] },
      { h: '¿Tu aumento supera la inflación?', p: [
        'Un aumento solo mejora tu poder adquisitivo si es mayor que la inflación. El aumento real es (1 + aumento) ÷ (1 + inflación) − 1. Con un aumento del 4 % y una inflación del 3 %, el aumento real es 1,04 ÷ 1,03 − 1 = 0,97 %, algo menos que el punto que sale al restar. Con una inflación del 5 %, el mismo aumento es una pérdida real del 0,95 %.',
        'Usa la [[percentage-difference-calculator|calculadora de diferencia porcentual]] para comparar dos ofertas de trabajo, o la [[price-increase-calculator|calculadora de aumento de precio]] para precios que han subido un porcentaje.'] }
    ],
    faq: [['¿Cómo calculo un aumento de sueldo en porcentaje?', 'Multiplica tu sueldo actual por 1 más el aumento en decimal. Un aumento del 3,5 % sobre 30.000 es 30.000 × 1,035 = 31.050.'],
      ['¿Cómo sé qué porcentaje es mi aumento?', 'Resta el sueldo antiguo al nuevo, divide entre el sueldo antiguo y multiplica por 100.'],
      ['¿Es bruto o neto?', 'Bruto. El IRPF y las cotizaciones dependen de tu situación, así que la calculadora trabaja con el sueldo bruto.'],
      ['¿Cómo se calcula el precio por hora?', 'Sueldo anual ÷ (horas semanales × 52). Ajusta las horas a tu contrato.'],
      ['¿Qué es el aumento real?', 'Tu aumento ajustado por la inflación: (1 + aumento) ÷ (1 + inflación) − 1. Indica si puedes comprar más con tu nuevo sueldo.'],
      ['¿Y si cobro en 14 pagas?', 'Introduce el salario anual. El porcentaje de aumento es el mismo; solo cambia cuánto se cobra en cada paga.']]
  },
  da: {
    name: 'Lønstigningsberegner', card: 'Ny løn efter en lønstigning, og stigningen efter inflation.',
    desc: 'Gratis lønstigningsberegner: se din nye løn efter en stigning i procent eller kroner, løn pr. måned og time samt din reelle lønstigning efter inflation.',
    h1: 'Lønstigningsberegner',
    lede: 'Indtast din nuværende løn og lønstigningen som procent, som beløb eller som ny løn. Se den nye løn pr. år, måned, uge og time, og om stigningen er større end inflationen.',
    howH: 'Sådan beregner du en lønstigning',
    how: [['Indtast din nuværende løn', 'Vælg, om den er pr. år, måned, uge eller time, og angiv dine normale timer pr. uge.'],
      ['Beskriv lønstigningen', 'Som procent, som fast beløb eller som den nye løn, du har fået tilbudt.'],
      ['Sammenlign med inflationen', 'Tilføj inflationen for at se din reelle lønstigning i købekraft.']],
    featH: 'Mere end en procent',
    feats: [['Tre måder at angive stigningen', 'Procent, beløb pr. periode eller den nye løn – beregneren klarer resten.'],
      ['Alle lønperioder', 'Årsløn, månedsløn, ugeløn og timeløn før og efter med dine egne timer.'],
      ['Reel stigning efter inflation', 'Bruger (1 + stigning) ÷ (1 + inflation) − 1 og ikke en simpel subtraktion.'],
      ['Bruttoløn, tydeligt angivet', 'Skat, AM-bidrag og pension afhænger af din situation, så resultatet er før fradrag.']],
    sections: [
      { h: 'Sådan beregnes en lønstigning', p: [
        'Ny løn = nuværende løn × (1 + stigning ÷ 100). En stigning på 4 % på en månedsløn på 38.000 kr. giver 38.000 × 1,04 = 39.520 kr., altså 1.520 kr. mere om måneden og 18.240 kr. mere om året. Får du tilbudt en ny løn, er stigningen (ny − gammel) ÷ gammel × 100: fra 38.000 til 40.000 kr. er en stigning på 5,26 %.',
        'Til omregning mellem perioder bruger beregneren 12 måneder og 52 uger om året, og dine timer pr. uge til timelønnen. En fuldtidsstilling på 37 timer svarer til 1.924 timer om året.'] },
      { h: 'Er din lønstigning større end inflationen?', p: [
        'En lønstigning øger kun din købekraft, hvis den er større end inflationen. Den reelle stigning er (1 + stigning) ÷ (1 + inflation) − 1. Med 4 % i lønstigning og 3 % inflation er den reelle stigning 1,04 ÷ 1,03 − 1 = 0,97 %, lidt mindre end det ene procentpoint, du får ved at trække fra. Med 5 % inflation er samme stigning en reel lønnedgang på 0,95 %.',
        'Brug [[percentage-difference-calculator|procentforskelberegneren]] til at sammenligne to jobtilbud, eller [[price-increase-calculator|prisforhøjelsesberegneren]] til priser, der er steget med en procent.'] }
    ],
    faq: [['Hvordan beregner jeg en lønstigning i procent?', 'Gang din nuværende løn med 1 plus stigningen som decimaltal. 3,5 % på 30.000 kr. er 30.000 × 1,035 = 31.050 kr.'],
      ['Hvordan finder jeg ud af, hvor mange procent min lønstigning er?', 'Træk den gamle løn fra den nye, dividér med den gamle løn, og gang med 100.'],
      ['Er det før eller efter skat?', 'Før skat. Skat, AM-bidrag og pension afhænger af din situation, så beregneren bruger bruttolønnen.'],
      ['Hvordan beregnes timelønnen?', 'Årsløn ÷ (timer pr. uge × 52). Ret timetallet, så det passer til din kontrakt.'],
      ['Hvad er en reel lønstigning?', 'Din lønstigning korrigeret for inflation: (1 + stigning) ÷ (1 + inflation) − 1. Den viser, om du kan købe mere for din nye løn.'],
      ['Skal jeg sammenligne lønstigninger i procent eller kroner?', 'Begge dele giver mening. Procent sammenligner retfærdigt på tværs af lønninger; beløbet pr. måned er det, du mærker.']]
  }
};

const i18n = {
  en: { cur: 'Current pay', per: 'Pay period', pers: ['per year', 'per month', 'per week', 'per hour'], hours: 'Hours per week', how: 'Raise entered as', hows: ['Percentage', 'Amount', 'New pay'],
    pct: 'Raise (%)', amt: 'Raise amount (same period)', nw: 'New pay (same period)', infl: 'Inflation (%) — optional', newPay: 'New pay', raisePct: 'Raise', raiseAmt: 'Raise amount', real: 'Real raise after inflation',
    realCut: 'Real pay cut of {p} after inflation', table: ['', 'Before', 'After', 'Difference'], rows: ['Year', 'Month', 'Week', 'Hour'], empty: 'Enter your current pay and a valid raise.', gross: 'Gross pay, before tax and deductions.', work: 'Show the working', copy: 'Copy result' },
  es: { cur: 'Sueldo actual', per: 'Periodo', pers: ['al año', 'al mes', 'a la semana', 'por hora'], hours: 'Horas por semana', how: 'Indicar el aumento como', hows: ['Porcentaje', 'Importe', 'Sueldo nuevo'],
    pct: 'Aumento (%)', amt: 'Importe del aumento (mismo periodo)', nw: 'Sueldo nuevo (mismo periodo)', infl: 'Inflación (%) — opcional', newPay: 'Sueldo nuevo', raisePct: 'Aumento', raiseAmt: 'Importe del aumento', real: 'Aumento real con inflación',
    realCut: 'Pérdida real del {p} con la inflación', table: ['', 'Antes', 'Después', 'Diferencia'], rows: ['Año', 'Mes', 'Semana', 'Hora'], empty: 'Introduce tu sueldo actual y un aumento válido.', gross: 'Sueldo bruto, antes de impuestos y retenciones.', work: 'Ver el cálculo', copy: 'Copiar resultado' },
  da: { cur: 'Nuværende løn', per: 'Lønperiode', pers: ['pr. år', 'pr. måned', 'pr. uge', 'pr. time'], hours: 'Timer pr. uge', how: 'Lønstigning angivet som', hows: ['Procent', 'Beløb', 'Ny løn'],
    pct: 'Lønstigning (%)', amt: 'Stigning i kroner (samme periode)', nw: 'Ny løn (samme periode)', infl: 'Inflation (%) — valgfri', newPay: 'Ny løn', raisePct: 'Lønstigning', raiseAmt: 'Stigning i beløb', real: 'Reel lønstigning efter inflation',
    realCut: 'Reel lønnedgang på {p} efter inflation', table: ['', 'Før', 'Efter', 'Forskel'], rows: ['År', 'Måned', 'Uge', 'Time'], empty: 'Indtast din nuværende løn og en gyldig lønstigning.', gross: 'Bruttoløn før skat og fradrag.', work: 'Vis udregningen', copy: 'Kopiér resultat' }
};

const DEF = { en: ['42000', 'year'], es: ['24000', 'year'], da: ['38000', 'month'] };

function tool(t, lang) {
  const [amount, period] = DEF[lang];
  const opt = (v, i) => `<option value="${v}"${v === period ? ' selected' : ''}>${t.pers[i]}</option>`;
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="pr-cur">${t.cur}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="pr-cur" value="${amount}"></div>
  <div class="calc-field"><label for="pr-per">${t.per}</label><select class="calc-input calc-input--lg" id="pr-per">${['year', 'month', 'week', 'hour'].map(opt).join('')}</select></div>
  <div class="calc-field"><label for="pr-hours">${t.hours}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="pr-hours" value="${lang === 'en' ? '40' : '37'}"></div>
</div>
<div class="calc-field"><span class="calc-label" id="pr-how-l">${t.how}</span><div class="calc-seg" id="pr-how" role="group" aria-labelledby="pr-how-l"><button type="button" data-value="pct" aria-pressed="true">${t.hows[0]}</button><button type="button" data-value="amt" aria-pressed="false">${t.hows[1]}</button><button type="button" data-value="new" aria-pressed="false">${t.hows[2]}</button></div></div>
<div class="calc-grid">
  <div class="calc-field" id="pr-f-pct"><label for="pr-pct">${t.pct}</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="pr-pct" value="4"></div>
  <div class="calc-field" id="pr-f-amt" hidden><label for="pr-amt">${t.amt}</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="pr-amt" value=""></div>
  <div class="calc-field" id="pr-f-new" hidden><label for="pr-new">${t.nw}</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="pr-new" value=""></div>
  <div class="calc-field"><label for="pr-infl">${t.infl}</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="pr-infl" value=""></div>
</div>
<p class="calc-hint" id="pr-empty" hidden>${t.empty}</p>
<div class="calc-out" id="pr-out" aria-live="polite">
  <div class="calc-result"><span class="calc-kicker" id="pr-k">${t.newPay}</span><span class="calc-big" id="pr-big"></span><span class="calc-sub" id="pr-sub"></span></div>
  <div class="calc-tiles" id="pr-tiles"></div>
  <div class="calc-table-wrap"><table class="calc-table"><thead><tr>${t.table.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody id="pr-table"></tbody></table></div>
  <p class="calc-hint">${t.gross}</p>
  <details class="calc-work"><summary>${t.work}</summary><dl id="pr-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="pr-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
