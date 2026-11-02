'use strict';

const seo = {
  en: {
    name: 'Price Increase Calculator', card: 'New price after a % rise, or the % between two prices.',
    desc: 'Free price increase calculator: add a percentage to a price, find the % increase between an old and new price, or spot shrinkflation with the unit price change.',
    h1: 'Price Increase Calculator',
    lede: 'Work out a new price after a percentage increase, the percentage a price has gone up, or the real increase when a pack gets smaller. Every answer shows the increase amount and the formula used.',
    howH: 'How to calculate a price increase',
    how: [['Choose what you know', 'Old price and % increase, old and new price, or two package sizes for a hidden price rise.'],
      ['Enter the numbers', 'Use any currency. Decimals with a comma or a point both work.'],
      ['Read the result', 'You get the new price or the percentage, the increase amount and the multiplier to apply.']],
    featH: 'Built for real price changes',
    feats: [['Three modes', 'Add a % increase, find the % between two prices, or compare unit prices after a size change.'],
      ['Shrinkflation check', 'See the real price-per-unit increase when the pack shrinks but the price stays the same.'],
      ['Multiplier shown', 'For example ×1.08 for an 8% rise, so you can apply it in a spreadsheet.'],
      ['Several increases in a row', 'Add a second increase and see the combined effect, which is more than the sum.']],
    sections: [
      { h: 'Price increase formulas', p: [
        'New price = old price × (1 + increase ÷ 100). An 8% increase on 250 is 250 × 1.08 = 270. To find the percentage between two prices: increase % = (new − old) ÷ old × 100. A price that goes from 4.50 to 4.95 has risen by 0.45 ÷ 4.50 = 10%.',
        'Two increases in a row multiply: 5% followed by 10% is 1.05 × 1.10 = 1.155, a 15.5% total rise, not 15%. The same logic, in reverse, is why stacked discounts are less than their sum – see the [[discount-stacking-calculator|discount stacking calculator]].'] },
      { h: 'Shrinkflation: when the price stays but the pack shrinks', p: [
        'If a 500 g pack becomes 450 g at the same price, the price per gram has gone up by 500 ÷ 450 − 1 = 11.1%, even though the shelf price did not change. The shrinkflation mode compares the price per unit before and after, so you see the real increase. To compare different products, use the [[unit-price-calculator|unit price calculator]].'] },
      { h: 'Going the other way', p: [
        'If you only know the price after the increase and want the original, do not subtract the percentage: 270 − 8% is 248.40, not 250. Divide by the multiplier instead, or use the [[reverse-percentage-calculator|reverse percentage calculator]]. For salaries, the [[pay-rise-calculator|pay rise calculator]] also shows the effect of inflation.'] }
    ],
    faq: [['How do I add a percentage increase to a price?', 'Multiply the price by 1 plus the percentage as a decimal. For a 12% increase: price × 1.12.'],
      ['How do I calculate the percentage increase between two prices?', 'Subtract the old price from the new price, divide by the old price and multiply by 100.'],
      ['Is a 10% increase followed by a 10% decrease back to the start?', 'No. 100 × 1.10 × 0.90 = 99, so you end 1% lower than you started.'],
      ['What is shrinkflation?', 'A hidden price rise: the package gets smaller while the price stays the same or rises less than the size fell. Compare the price per unit to see it.'],
      ['How do I remove a price increase?', 'Divide the new price by (1 + increase ÷ 100). Subtracting the percentage from the new price gives the wrong answer.'],
      ['Does it include VAT?', 'The calculator works on whatever price you enter. If both prices include VAT at the same rate, the percentage increase is the same with or without VAT.']]
  },
  es: {
    name: 'Calculadora de Aumento de Precio', card: 'Precio nuevo tras una subida o el % entre dos precios.',
    desc: 'Calculadora de aumento de precio gratis: suma un porcentaje a un precio, calcula el % de subida entre dos precios o detecta la reduflación por unidad.',
    h1: 'Calculadora de Aumento de Precio',
    lede: 'Calcula el precio nuevo tras una subida porcentual, cuánto ha subido un precio en porcentaje o la subida real cuando un envase se hace más pequeño. Cada resultado muestra el importe del aumento y la fórmula usada.',
    howH: 'Cómo calcular un aumento de precio',
    how: [['Elige lo que sabes', 'Precio antiguo y % de subida, precio antiguo y nuevo, o dos tamaños de envase para una subida encubierta.'],
      ['Introduce los números', 'Sirve cualquier moneda. Los decimales con coma o con punto funcionan.'],
      ['Lee el resultado', 'Obtienes el precio nuevo o el porcentaje, el importe del aumento y el multiplicador que hay que aplicar.']],
    featH: 'Pensada para subidas de precio reales',
    feats: [['Tres modos', 'Sumar un % de subida, calcular el % entre dos precios o comparar el precio por unidad tras un cambio de tamaño.'],
      ['Detector de reduflación', 'Ve la subida real del precio por unidad cuando el envase encoge pero el precio no cambia.'],
      ['Multiplicador a la vista', 'Por ejemplo ×1,08 para una subida del 8 %, para aplicarlo en una hoja de cálculo.'],
      ['Varias subidas seguidas', 'Añade una segunda subida y ve el efecto combinado, que es mayor que la suma.']],
    sections: [
      { h: 'Fórmulas del aumento de precio', p: [
        'Precio nuevo = precio antiguo × (1 + subida ÷ 100). Una subida del 8 % sobre 250 es 250 × 1,08 = 270. Para saber el porcentaje entre dos precios: % de subida = (nuevo − antiguo) ÷ antiguo × 100. Un precio que pasa de 4,50 a 4,95 ha subido 0,45 ÷ 4,50 = 10 %.',
        'Dos subidas seguidas se multiplican: un 5 % y luego un 10 % es 1,05 × 1,10 = 1,155, un 15,5 % en total, no un 15 %. Por la misma lógica, al revés, los descuentos acumulados son menores que su suma: mira la [[discount-stacking-calculator|calculadora de descuentos acumulados]].'] },
      { h: 'Reduflación: el precio no cambia, el envase sí', p: [
        'Si un paquete de 500 g pasa a 450 g al mismo precio, el precio por gramo ha subido 500 ÷ 450 − 1 = 11,1 %, aunque el precio en la estantería sea el mismo. El modo reduflación compara el precio por unidad antes y después para mostrarte la subida real. Para comparar productos distintos, usa la [[unit-price-calculator|calculadora de precio unitario]].'] },
      { h: 'El cálculo al revés', p: [
        'Si solo conoces el precio después de la subida y quieres el original, no restes el porcentaje: 270 − 8 % es 248,40, no 250. Divide entre el multiplicador o usa la [[reverse-percentage-calculator|calculadora de porcentaje inverso]]. Para sueldos, la [[pay-rise-calculator|calculadora de aumento salarial]] también muestra el efecto de la inflación.'] }
    ],
    faq: [['¿Cómo sumo un porcentaje de aumento a un precio?', 'Multiplica el precio por 1 más el porcentaje en decimal. Para una subida del 12 %: precio × 1,12.'],
      ['¿Cómo calculo el porcentaje de aumento entre dos precios?', 'Resta el precio antiguo al nuevo, divide entre el precio antiguo y multiplica por 100.'],
      ['¿Una subida del 10 % y luego una bajada del 10 % deja el precio igual?', 'No. 100 × 1,10 × 0,90 = 99, así que acabas un 1 % por debajo del inicio.'],
      ['¿Qué es la reduflación?', 'Una subida encubierta: el envase se reduce mientras el precio se mantiene o sube menos de lo que bajó el tamaño. Compara el precio por unidad para verla.'],
      ['¿Cómo quito un aumento de precio?', 'Divide el precio nuevo entre (1 + subida ÷ 100). Restar el porcentaje al precio nuevo da un resultado incorrecto.'],
      ['¿Incluye el IVA?', 'La calculadora trabaja con el precio que introduzcas. Si ambos precios incluyen el mismo tipo de IVA, el porcentaje de subida es el mismo con o sin IVA.']]
  },
  da: {
    name: 'Prisforhøjelsesberegner', card: 'Ny pris efter en stigning, eller % mellem to priser.',
    desc: 'Gratis prisforhøjelsesberegner: læg en procent til en pris, find stigningen i procent mellem gammel og ny pris, eller afslør skjulte prisstigninger.',
    h1: 'Prisforhøjelsesberegner',
    lede: 'Beregn den nye pris efter en procentvis stigning, hvor mange procent en pris er steget, eller den reelle stigning, når en pakke bliver mindre. Hvert svar viser stigningen i kroner og den formel, der er brugt.',
    howH: 'Sådan beregner du en prisstigning',
    how: [['Vælg, hvad du kender', 'Gammel pris og % stigning, gammel og ny pris, eller to pakkestørrelser for en skjult prisstigning.'],
      ['Indtast tallene', 'Alle valutaer virker. Decimaler med komma eller punktum fungerer begge.'],
      ['Aflæs resultatet', 'Du får den nye pris eller procenten, stigningen i beløb og den faktor, der skal ganges med.']],
    featH: 'Lavet til rigtige prisændringer',
    feats: [['Tre tilstande', 'Læg en % stigning til, find % mellem to priser, eller sammenlign enhedsprisen efter en størrelsesændring.'],
      ['Tjek for skjult prisstigning', 'Se den reelle stigning pr. enhed, når pakken bliver mindre, men prisen er den samme.'],
      ['Faktoren vises', 'F.eks. ×1,08 for en stigning på 8 %, så du kan bruge den i et regneark.'],
      ['Flere stigninger i træk', 'Tilføj en ekstra stigning, og se den samlede effekt, som er større end summen.']],
    sections: [
      { h: 'Formler for prisstigning', p: [
        'Ny pris = gammel pris × (1 + stigning ÷ 100). En stigning på 8 % på 250 kr. er 250 × 1,08 = 270 kr. Procenten mellem to priser: stigning i % = (ny − gammel) ÷ gammel × 100. En pris, der går fra 4,50 til 4,95 kr., er steget 0,45 ÷ 4,50 = 10 %.',
        'To stigninger i træk ganges: 5 % efterfulgt af 10 % giver 1,05 × 1,10 = 1,155, altså 15,5 % i alt og ikke 15 %. Samme logik, bare omvendt, er grunden til, at flere rabatter oven i hinanden giver mindre end summen – se [[discount-stacking-calculator|rabatberegneren med flere rabatter]].'] },
      { h: 'Skjult prisstigning: prisen er den samme, pakken mindre', p: [
        'Hvis en pakke på 500 g bliver til 450 g til samme pris, er prisen pr. gram steget 500 ÷ 450 − 1 = 11,1 %, selvom hyldeprisen ikke er ændret. Tilstanden for pakkestørrelse sammenligner prisen pr. enhed før og efter, så du ser den reelle stigning. Til at sammenligne forskellige varer bruger du [[unit-price-calculator|enhedsprisberegneren]].'] },
      { h: 'Den anden vej', p: [
        'Kender du kun prisen efter stigningen og vil finde den oprindelige, må du ikke trække procenten fra: 270 − 8 % er 248,40 og ikke 250. Dividér med faktoren i stedet, eller brug [[reverse-percentage-calculator|den omvendte procentberegner]]. Til løn viser [[pay-rise-calculator|lønstigningsberegneren]] også effekten af inflation.'] }
    ],
    faq: [['Hvordan lægger jeg en procentvis stigning til en pris?', 'Gang prisen med 1 plus procenten som decimaltal. Ved 12 % stigning: pris × 1,12.'],
      ['Hvordan beregner jeg stigningen i procent mellem to priser?', 'Træk den gamle pris fra den nye, dividér med den gamle pris, og gang med 100.'],
      ['Er 10 % op og derefter 10 % ned tilbage ved start?', 'Nej. 100 × 1,10 × 0,90 = 99, så du ender 1 % under udgangspunktet.'],
      ['Hvad er en skjult prisstigning (shrinkflation)?', 'Pakken bliver mindre, mens prisen er den samme eller stiger mindre, end størrelsen faldt. Sammenlign prisen pr. enhed for at se det.'],
      ['Hvordan fjerner jeg en prisstigning igen?', 'Dividér den nye pris med (1 + stigning ÷ 100). At trække procenten fra den nye pris giver et forkert resultat.'],
      ['Er moms med?', 'Beregneren bruger den pris, du indtaster. Indeholder begge priser moms med samme sats, er den procentvise stigning den samme med eller uden moms.']]
  }
};

const i18n = {
  en: { mode: 'What do you want to work out?', modes: ['New price from %', '% between two prices', 'Shrinkflation (size change)'], old: 'Original price', pct: 'Increase (%)', pct2: 'Second increase (%) — optional', nw: 'New price',
    size1: 'Old size (g, ml, pieces…)', size2: 'New size', price1: 'Old price', price2: 'New price', newPrice: 'New price', incPct: 'Price increase', incAmt: 'Increase amount', mult: 'Multiplier', total: 'Combined increase',
    unit1: 'Old price per 100 units', unit2: 'New price per 100 units', unitInc: 'Real increase per unit', shelf: 'Shelf price change', decrease: 'This is a decrease of {p}.', empty: 'Enter valid positive numbers.', work: 'Show the working', copy: 'Copy result' },
  es: { mode: '¿Qué quieres calcular?', modes: ['Precio nuevo con %', '% entre dos precios', 'Reduflación (cambio de tamaño)'], old: 'Precio original', pct: 'Subida (%)', pct2: 'Segunda subida (%) — opcional', nw: 'Precio nuevo',
    size1: 'Tamaño antiguo (g, ml, unidades…)', size2: 'Tamaño nuevo', price1: 'Precio antiguo', price2: 'Precio nuevo', newPrice: 'Precio nuevo', incPct: 'Subida de precio', incAmt: 'Importe de la subida', mult: 'Multiplicador', total: 'Subida combinada',
    unit1: 'Precio por 100 unidades antes', unit2: 'Precio por 100 unidades ahora', unitInc: 'Subida real por unidad', shelf: 'Cambio del precio de estantería', decrease: 'Es una bajada del {p}.', empty: 'Introduce números positivos válidos.', work: 'Ver el cálculo', copy: 'Copiar resultado' },
  da: { mode: 'Hvad vil du beregne?', modes: ['Ny pris ud fra %', '% mellem to priser', 'Skjult prisstigning (størrelse)'], old: 'Oprindelig pris', pct: 'Stigning (%)', pct2: 'Ekstra stigning (%) — valgfri', nw: 'Ny pris',
    size1: 'Gammel størrelse (g, ml, stk…)', size2: 'Ny størrelse', price1: 'Gammel pris', price2: 'Ny pris', newPrice: 'Ny pris', incPct: 'Prisstigning', incAmt: 'Stigning i beløb', mult: 'Faktor', total: 'Samlet stigning',
    unit1: 'Gammel pris pr. 100 enheder', unit2: 'Ny pris pr. 100 enheder', unitInc: 'Reel stigning pr. enhed', shelf: 'Ændring i hyldepris', decrease: 'Det er et fald på {p}.', empty: 'Indtast gyldige positive tal.', work: 'Vis udregningen', copy: 'Kopiér resultat' }
};

function field(id, label, value) {
  return `<div class="calc-field"><label for="${id}">${label}</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="${id}" value="${value}"></div>`;
}

function tool(t) {
  return `
<div class="calc-field"><span class="calc-label" id="pi-mode-l">${t.mode}</span><div class="calc-seg" id="pi-mode" role="group" aria-labelledby="pi-mode-l"><button type="button" data-value="pct" aria-pressed="true">${t.modes[0]}</button><button type="button" data-value="two" aria-pressed="false">${t.modes[1]}</button><button type="button" data-value="size" aria-pressed="false">${t.modes[2]}</button></div></div>
<div class="calc-grid" id="pi-f-pct">${field('pi-old', t.old, '250')}${field('pi-pct', t.pct, '8')}${field('pi-pct2', t.pct2, '')}</div>
<div class="calc-grid" id="pi-f-two" hidden>${field('pi-a', t.price1, '4.50')}${field('pi-b', t.price2, '4.95')}</div>
<div class="calc-grid" id="pi-f-size" hidden>${field('pi-p1', t.price1, '3.00')}${field('pi-s1', t.size1, '500')}${field('pi-p2', t.price2, '3.00')}${field('pi-s2', t.size2, '450')}</div>
<p class="calc-hint" id="pi-empty" hidden>${t.empty}</p>
<div class="calc-out" id="pi-out" aria-live="polite">
  <div class="calc-result"><span class="calc-kicker" id="pi-k"></span><span class="calc-big" id="pi-big"></span><span class="calc-sub" id="pi-sub"></span></div>
  <div class="calc-tiles" id="pi-tiles"></div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="pi-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="pi-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
