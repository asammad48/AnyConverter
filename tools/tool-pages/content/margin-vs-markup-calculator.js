'use strict';

const seo = {
  en: {
    name: 'Margin vs Markup Calculator', card: 'Margin and markup from cost and price, or the price you need.',
    desc: 'Free margin vs markup calculator: get gross margin, markup and profit from cost and price, or the selling price needed for a target margin or markup.',
    h1: 'Margin vs Markup Calculator',
    lede: 'Enter a cost and a selling price to get the profit, gross margin and markup together, or start from the margin or markup you want and get the selling price you need.',
    howH: 'How to use the margin and markup calculator',
    how: [['Choose a direction', 'From cost and price, from a target margin, or from a target markup.'],
      ['Enter the numbers', 'Use prices excluding VAT or sales tax for correct business margins.'],
      ['Read both percentages', 'Margin and markup are always shown side by side, with the conversion between them.']],
    featH: 'Margin and markup without the mix-up',
    feats: [['Both directions', 'Cost + price → margin and markup, or target margin/markup → selling price.'],
      ['Side-by-side results', 'Profit, margin %, markup % and the price multiplier in one view.'],
      ['Conversion table', 'Common margins and the markup you need to reach them.'],
      ['Impossible targets flagged', 'A margin of 100% or more cannot be reached and is explained instead of returning nonsense.']],
    sections: [
      { h: 'Margin vs markup: the difference', p: [
        'Both start from the same profit (price − cost), but divide by different numbers. <strong>Gross margin</strong> divides the profit by the selling price; <strong>markup</strong> divides it by the cost. A product that costs 60 and sells for 100 has a profit of 40, a margin of 40% and a markup of 66.7%.',
        'Because the selling price is always larger than the cost (when you make a profit), margin is always lower than markup. Confusing the two is a classic pricing mistake: adding a 30% markup gives only a 23.1% margin.'],
        table: { head: ['Target margin', 'Markup needed', 'Price for cost 100'],
          rows: [['10%', '11.1%', '111.11'], ['20%', '25%', '125.00'], ['25%', '33.3%', '133.33'], ['30%', '42.9%', '142.86'], ['40%', '66.7%', '166.67'], ['50%', '100%', '200.00']] } },
      { h: 'Formulas', ul: ['Profit = price − cost', 'Margin % = profit ÷ price × 100', 'Markup % = profit ÷ cost × 100',
        'Price from margin = cost ÷ (1 − margin ÷ 100)', 'Price from markup = cost × (1 + markup ÷ 100)',
        'Markup = margin ÷ (1 − margin); margin = markup ÷ (1 + markup) (as decimals)'],
        after: ['Work with prices excluding VAT or sales tax, because the tax is not part of your margin. To see how a supplier’s price rise affects you, use the [[price-increase-calculator|price increase calculator]]; to compare pack sizes, use the [[unit-price-calculator|unit price calculator]].'] }
    ],
    faq: [['What is the difference between margin and markup?', 'Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost.'],
      ['Is a 50% markup the same as a 50% margin?', 'No. A 50% markup on a cost of 100 gives a price of 150 and a 33.3% margin. A 50% margin needs a price of 200, which is a 100% markup.'],
      ['How do I calculate the selling price from a margin?', 'Divide the cost by (1 − margin). For a 30% margin on a cost of 70: 70 ÷ 0.70 = 100.'],
      ['Can margin be more than 100%?', 'No. Margin is capped below 100% because profit can never exceed the selling price. Markup has no upper limit.'],
      ['Should I include VAT?', 'No. Use prices excluding VAT or sales tax, otherwise the tax inflates your margin.'],
      ['What is a good margin?', 'It depends on the industry, overheads and volume. Retail food often runs on low margins, software and services on high ones.']]
  },
  es: {
    name: 'Calculadora de Margen y Recargo', card: 'Margen y recargo desde coste y precio, o el precio necesario.',
    desc: 'Calculadora de margen y recargo gratis: obtén margen bruto, recargo (markup) y beneficio con coste y precio, o el precio necesario para un margen objetivo.',
    h1: 'Calculadora de Margen y Recargo',
    lede: 'Introduce un coste y un precio de venta para ver el beneficio, el margen bruto y el recargo a la vez, o parte del margen o recargo que quieres y obtén el precio de venta necesario.',
    howH: 'Cómo usar la calculadora de margen y recargo',
    how: [['Elige el sentido', 'Desde coste y precio, desde un margen objetivo o desde un recargo objetivo.'],
      ['Introduce los números', 'Usa precios sin IVA para obtener márgenes comerciales correctos.'],
      ['Lee ambos porcentajes', 'Margen y recargo aparecen siempre juntos, con la conversión entre ellos.']],
    featH: 'Margen y recargo sin confusiones',
    feats: [['En ambos sentidos', 'Coste + precio → margen y recargo, o margen/recargo objetivo → precio de venta.'],
      ['Resultados en paralelo', 'Beneficio, % de margen, % de recargo y multiplicador del precio a la vez.'],
      ['Tabla de conversión', 'Márgenes habituales y el recargo necesario para alcanzarlos.'],
      ['Objetivos imposibles avisados', 'Un margen del 100 % o más no se puede alcanzar y se explica en lugar de dar un resultado absurdo.']],
    sections: [
      { h: 'Margen frente a recargo: la diferencia', p: [
        'Ambos parten del mismo beneficio (precio − coste), pero lo dividen entre cosas distintas. El <strong>margen bruto</strong> divide el beneficio entre el precio de venta; el <strong>recargo</strong> (markup) lo divide entre el coste. Un producto que cuesta 60 y se vende a 100 deja 40 de beneficio, un margen del 40 % y un recargo del 66,7 %.',
        'Como el precio de venta siempre es mayor que el coste (si hay beneficio), el margen siempre es menor que el recargo. Confundirlos es un error clásico al fijar precios: aplicar un recargo del 30 % da solo un margen del 23,1 %.'],
        table: { head: ['Margen objetivo', 'Recargo necesario', 'Precio para coste 100'],
          rows: [['10 %', '11,1 %', '111,11'], ['20 %', '25 %', '125,00'], ['25 %', '33,3 %', '133,33'], ['30 %', '42,9 %', '142,86'], ['40 %', '66,7 %', '166,67'], ['50 %', '100 %', '200,00']] } },
      { h: 'Fórmulas', ul: ['Beneficio = precio − coste', 'Margen % = beneficio ÷ precio × 100', 'Recargo % = beneficio ÷ coste × 100',
        'Precio desde el margen = coste ÷ (1 − margen ÷ 100)', 'Precio desde el recargo = coste × (1 + recargo ÷ 100)',
        'Recargo = margen ÷ (1 − margen); margen = recargo ÷ (1 + recargo) (en decimales)'],
        after: ['Trabaja con precios sin IVA, porque el impuesto no forma parte de tu margen. Para ver cómo te afecta una subida del proveedor, usa la [[price-increase-calculator|calculadora de aumento de precio]]; para comparar formatos, la [[unit-price-calculator|calculadora de precio unitario]].'] }
    ],
    faq: [['¿Qué diferencia hay entre margen y recargo?', 'El margen es el beneficio como porcentaje del precio de venta. El recargo (markup) es el beneficio como porcentaje del coste.'],
      ['¿Un recargo del 50 % es un margen del 50 %?', 'No. Un recargo del 50 % sobre un coste de 100 da un precio de 150 y un margen del 33,3 %. Un margen del 50 % exige un precio de 200, es decir, un recargo del 100 %.'],
      ['¿Cómo calculo el precio de venta a partir del margen?', 'Divide el coste entre (1 − margen). Para un margen del 30 % sobre un coste de 70: 70 ÷ 0,70 = 100.'],
      ['¿Puede el margen superar el 100 %?', 'No. El margen siempre es inferior al 100 % porque el beneficio no puede superar el precio de venta. El recargo no tiene límite.'],
      ['¿Debo incluir el IVA?', 'No. Usa precios sin IVA; si no, el impuesto infla tu margen.'],
      ['¿Qué margen es bueno?', 'Depende del sector, los gastos fijos y el volumen. La alimentación suele tener márgenes bajos; el software y los servicios, altos.']]
  },
  da: {
    name: 'Margin- og avanceberegner', card: 'Margin og avance ud fra kostpris og pris – eller prisen du skal tage.',
    desc: 'Gratis margin- og avanceberegner: find dækningsgrad, avance og fortjeneste ud fra kostpris og salgspris, eller salgsprisen, der giver den ønskede margin.',
    h1: 'Margin- og avanceberegner',
    lede: 'Indtast kostpris og salgspris for at få fortjeneste, margin (dækningsgrad) og avance på én gang, eller start med den margin eller avance, du ønsker, og få den salgspris, du skal tage.',
    howH: 'Sådan bruger du margin- og avanceberegneren',
    how: [['Vælg retning', 'Ud fra kostpris og salgspris, ud fra en ønsket margin eller ud fra en ønsket avance.'],
      ['Indtast tallene', 'Brug priser ekskl. moms for at få korrekte forretningsmarginer.'],
      ['Aflæs begge procenter', 'Margin og avance vises altid side om side med omregningen mellem dem.']],
    featH: 'Margin og avance uden forveksling',
    feats: [['Begge retninger', 'Kostpris + salgspris → margin og avance, eller ønsket margin/avance → salgspris.'],
      ['Resultater side om side', 'Fortjeneste, margin %, avance % og prisfaktor i ét overblik.'],
      ['Omregningstabel', 'Typiske marginer og den avance, der skal til for at nå dem.'],
      ['Umulige mål markeres', 'En margin på 100 % eller mere kan ikke nås og forklares i stedet for at give et meningsløst tal.']],
    sections: [
      { h: 'Margin og avance: forskellen', p: [
        'Begge tager udgangspunkt i samme fortjeneste (salgspris − kostpris), men dividerer med noget forskelligt. <strong>Margin</strong> (dækningsgrad) dividerer fortjenesten med salgsprisen; <strong>avance</strong> dividerer den med kostprisen. En vare, der koster 60 kr. og sælges for 100 kr., giver 40 kr. i fortjeneste, en margin på 40 % og en avance på 66,7 %.',
        'Fordi salgsprisen altid er større end kostprisen (når der er fortjeneste), er marginen altid lavere end avancen. At forveksle dem er en klassisk fejl ved prissætning: lægger du 30 % avance på, får du kun 23,1 % i margin.'],
        table: { head: ['Ønsket margin', 'Nødvendig avance', 'Pris ved kostpris 100'],
          rows: [['10 %', '11,1 %', '111,11'], ['20 %', '25 %', '125,00'], ['25 %', '33,3 %', '133,33'], ['30 %', '42,9 %', '142,86'], ['40 %', '66,7 %', '166,67'], ['50 %', '100 %', '200,00']] } },
      { h: 'Formler', ul: ['Fortjeneste = salgspris − kostpris', 'Margin % = fortjeneste ÷ salgspris × 100', 'Avance % = fortjeneste ÷ kostpris × 100',
        'Pris ud fra margin = kostpris ÷ (1 − margin ÷ 100)', 'Pris ud fra avance = kostpris × (1 + avance ÷ 100)',
        'Avance = margin ÷ (1 − margin); margin = avance ÷ (1 + avance) (som decimaltal)'],
        after: ['Regn med priser ekskl. moms, da momsen ikke er en del af din margin. Vil du se, hvad en prisstigning fra leverandøren betyder, så brug [[price-increase-calculator|prisforhøjelsesberegneren]]; til at sammenligne pakkestørrelser bruger du [[unit-price-calculator|enhedsprisberegneren]].'] }
    ],
    faq: [['Hvad er forskellen på margin og avance?', 'Margin er fortjenesten i procent af salgsprisen. Avance er fortjenesten i procent af kostprisen.'],
      ['Er 50 % avance det samme som 50 % margin?', 'Nej. 50 % avance på en kostpris på 100 giver en pris på 150 og en margin på 33,3 %. En margin på 50 % kræver en pris på 200, altså 100 % avance.'],
      ['Hvordan beregner jeg salgsprisen ud fra en margin?', 'Dividér kostprisen med (1 − margin). Ved 30 % margin og en kostpris på 70: 70 ÷ 0,70 = 100.'],
      ['Kan margin være over 100 %?', 'Nej. Marginen er altid under 100 %, fordi fortjenesten aldrig kan være større end salgsprisen. Avancen har ingen øvre grænse.'],
      ['Skal moms med?', 'Nej. Brug priser ekskl. moms, ellers puster momsen marginen op.'],
      ['Hvad er en god margin?', 'Det afhænger af branche, faste omkostninger og volumen. Dagligvarer har ofte lave marginer, software og services høje.']]
  }
};

const i18n = {
  en: { mode: 'Start from', modes: ['Cost and price', 'Target margin', 'Target markup'], cost: 'Cost', price: 'Selling price', tm: 'Target margin (%)', tk: 'Target markup (%)', profit: 'Profit', margin: 'Gross margin', markup: 'Markup', need: 'Selling price needed', mult: 'Price multiplier',
    loss: 'The price is below cost: this is a loss.', imp: 'A margin of 100% or more is impossible: profit can never exceed the selling price.', empty: 'Enter a positive cost and valid numbers.', work: 'Show the working', copy: 'Copy result' },
  es: { mode: 'Partir de', modes: ['Coste y precio', 'Margen objetivo', 'Recargo objetivo'], cost: 'Coste', price: 'Precio de venta', tm: 'Margen objetivo (%)', tk: 'Recargo objetivo (%)', profit: 'Beneficio', margin: 'Margen bruto', markup: 'Recargo (markup)', need: 'Precio de venta necesario', mult: 'Multiplicador del precio',
    loss: 'El precio está por debajo del coste: hay pérdidas.', imp: 'Un margen del 100 % o más es imposible: el beneficio nunca puede superar el precio de venta.', empty: 'Introduce un coste positivo y números válidos.', work: 'Ver el cálculo', copy: 'Copiar resultado' },
  da: { mode: 'Start med', modes: ['Kostpris og salgspris', 'Ønsket margin', 'Ønsket avance'], cost: 'Kostpris', price: 'Salgspris', tm: 'Ønsket margin (%)', tk: 'Ønsket avance (%)', profit: 'Fortjeneste', margin: 'Margin (dækningsgrad)', markup: 'Avance', need: 'Nødvendig salgspris', mult: 'Prisfaktor',
    loss: 'Prisen er under kostprisen: det giver underskud.', imp: 'En margin på 100 % eller mere er umulig: fortjenesten kan aldrig være større end salgsprisen.', empty: 'Indtast en positiv kostpris og gyldige tal.', work: 'Vis udregningen', copy: 'Kopiér resultat' }
};

function field(id, label, value) {
  return `<div class="calc-field" id="${id}-f"><label for="${id}">${label}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="${id}" value="${value}"></div>`;
}

function tool(t) {
  return `
<div class="calc-field"><span class="calc-label" id="mm-mode-l">${t.mode}</span><div class="calc-seg" id="mm-mode" role="group" aria-labelledby="mm-mode-l"><button type="button" data-value="cp" aria-pressed="true">${t.modes[0]}</button><button type="button" data-value="margin" aria-pressed="false">${t.modes[1]}</button><button type="button" data-value="markup" aria-pressed="false">${t.modes[2]}</button></div></div>
<div class="calc-grid">${field('mm-cost', t.cost, '60')}${field('mm-price', t.price, '100')}${field('mm-tm', t.tm, '30')}${field('mm-tk', t.tk, '50')}</div>
<p class="calc-hint" id="mm-empty" hidden>${t.empty}</p>
<div class="calc-err" id="mm-imp" hidden>${t.imp}</div>
<div class="calc-out" id="mm-out" aria-live="polite">
  <div class="calc-warn" id="mm-loss" hidden>${t.loss}</div>
  <div class="calc-tiles">
    <div class="calc-tile" id="mm-need-t"><span class="calc-tile-lbl">${t.need}</span><span class="calc-tile-val" id="mm-need"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.profit}</span><span class="calc-tile-val" id="mm-profit"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.margin}</span><span class="calc-tile-val" id="mm-margin"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.markup}</span><span class="calc-tile-val" id="mm-markup"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.mult}</span><span class="calc-tile-val" id="mm-mult"></span></div>
  </div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="mm-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="mm-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
