'use strict';

const seo = {
  en: {
    name: 'Percentage Difference Calculator', card: 'Compare two values without a “before” and “after”.',
    desc: 'Free percentage difference calculator: compare two values with the symmetric formula and see percent change and percentage points side by side, with steps.',
    h1: 'Percentage Difference Calculator',
    lede: 'Compare two numbers with the percentage difference formula, which treats both values equally. The calculator also shows the percent change in each direction, so you can see which answer your question really needs.',
    howH: 'How to use the percentage difference calculator',
    how: [['Enter value A and value B', 'The order does not matter for the percentage difference, so you can type the two values either way round.'],
      ['Read the percentage difference', 'It is the gap between the values divided by their average, shown with every step.'],
      ['Check the other answers', 'If one value is clearly the “old” one, use the percent change line instead. Percentage points are shown when both values are percentages.']],
    featH: 'Three formulas, clearly separated',
    feats: [['Symmetric percentage difference', '|A − B| ÷ ((A + B) ÷ 2) × 100, the same whichever value comes first.'],
      ['Percent change both ways', 'A → B and B → A, so you can see why they differ.'],
      ['Percentage points', 'For values that are already percentages, such as interest rates or survey results.'],
      ['Worked steps', 'Difference, average and ratio are listed so you can check the maths.']],
    sections: [
      { h: 'Percentage difference vs percent change vs percent increase', p: [
        'These three are often mixed up, and they give different numbers. <strong>Percentage difference</strong> compares two values that have equal standing, such as two shops’ prices or two lab measurements. It divides the absolute difference by the <em>average</em> of the two values, so swapping A and B gives the same answer.',
        '<strong>Percent change</strong> has a direction: it divides the change by the <em>starting</em> value. Going from 80 to 100 is a 25% increase, but going from 100 to 80 is a 20% decrease. A <strong>percent increase or decrease</strong> is simply a percent change described by its sign.'],
        table: { head: ['Comparison of 80 and 100', 'Formula', 'Result'],
          rows: [['Percentage difference', '|80 − 100| ÷ 90 × 100', '22.22%'], ['Percent change 80 → 100', '(100 − 80) ÷ 80 × 100', '+25%'], ['Percent change 100 → 80', '(80 − 100) ÷ 100 × 100', '−20%']] } },
      { h: 'When to use which', p: [
        'Use the percentage difference when neither number is a baseline: comparing two quotes, two runners’ times or two measurements of the same thing. Use percent change when there is a before and after, like last year’s and this year’s price. For prices that went up, the [[price-increase-calculator|price increase calculator]] adds the new price and amount; if you know only the final value, use the [[reverse-percentage-calculator|reverse percentage calculator]].',
        'Percentage points are the plain difference between two percentages. An interest rate that moves from 3% to 4% rises by 1 percentage point, which is a 33.3% relative increase.'] }
    ],
    faq: [['What is the percentage difference formula?', 'Percentage difference = |A − B| ÷ ((A + B) ÷ 2) × 100. The difference is divided by the average of the two values.'],
      ['Is percentage difference the same as percent change?', 'No. Percent change divides by the starting value and has a direction (increase or decrease). Percentage difference divides by the average and has no direction.'],
      ['Why does 80 → 100 give 25% but 100 → 80 give 20%?', 'Because each percent change uses a different starting value. The percentage difference between 80 and 100 is 22.22% either way.'],
      ['Can the percentage difference be more than 100%?', 'Yes. It can reach up to 200% when one value is close to zero, which is a sign that percent change from a clear baseline may suit better.'],
      ['What about negative numbers?', 'The formula breaks down when the average is zero or the values have opposite signs. The calculator warns you in those cases.'],
      ['What are percentage points?', 'The arithmetic difference between two percentages. From 40% to 45% is 5 percentage points, or a 12.5% relative increase.']]
  },
  es: {
    name: 'Calculadora de Diferencia Porcentual', card: 'Compara dos valores sin un “antes” y un “después”.',
    desc: 'Calculadora de diferencia porcentual gratis: compara dos valores con la fórmula simétrica y ve también la variación porcentual y los puntos porcentuales.',
    h1: 'Calculadora de Diferencia Porcentual',
    lede: 'Compara dos números con la fórmula de diferencia porcentual, que trata ambos valores por igual. También verás la variación porcentual en cada sentido, para saber qué respuesta necesita realmente tu pregunta.',
    howH: 'Cómo usar la calculadora de diferencia porcentual',
    how: [['Introduce el valor A y el valor B', 'El orden no importa para la diferencia porcentual: puedes escribirlos en cualquier sentido.'],
      ['Lee la diferencia porcentual', 'Es la diferencia entre los valores dividida entre su media, con todos los pasos.'],
      ['Revisa las otras respuestas', 'Si uno de los valores es claramente el “antiguo”, usa la variación porcentual. Los puntos porcentuales aparecen cuando ambos valores son porcentajes.']],
    featH: 'Tres fórmulas, bien separadas',
    feats: [['Diferencia porcentual simétrica', '|A − B| ÷ ((A + B) ÷ 2) × 100, igual sea cual sea el orden.'],
      ['Variación en ambos sentidos', 'A → B y B → A, para ver por qué no coinciden.'],
      ['Puntos porcentuales', 'Para valores que ya son porcentajes, como tipos de interés o encuestas.'],
      ['Pasos del cálculo', 'Diferencia, media y cociente a la vista para comprobarlo.']],
    sections: [
      { h: 'Diferencia porcentual, variación porcentual y aumento porcentual', p: [
        'Estos tres conceptos se confunden a menudo y dan resultados distintos. La <strong>diferencia porcentual</strong> compara dos valores del mismo rango, como el precio en dos tiendas o dos mediciones de laboratorio. Divide la diferencia absoluta entre la <em>media</em> de ambos valores, así que intercambiar A y B da lo mismo.',
        'La <strong>variación porcentual</strong> tiene sentido: divide el cambio entre el valor <em>inicial</em>. Pasar de 80 a 100 es una subida del 25 %, pero pasar de 100 a 80 es una bajada del 20 %. Un <strong>aumento o descenso porcentual</strong> es simplemente una variación con su signo.'],
        table: { head: ['Comparación de 80 y 100', 'Fórmula', 'Resultado'],
          rows: [['Diferencia porcentual', '|80 − 100| ÷ 90 × 100', '22,22 %'], ['Variación 80 → 100', '(100 − 80) ÷ 80 × 100', '+25 %'], ['Variación 100 → 80', '(80 − 100) ÷ 100 × 100', '−20 %']] } },
      { h: 'Cuándo usar cada una', p: [
        'Usa la diferencia porcentual cuando ningún número es la referencia: dos presupuestos, los tiempos de dos corredores o dos mediciones de lo mismo. Usa la variación porcentual cuando hay un antes y un después, como el precio del año pasado y el de este año. Para precios que han subido, la [[price-increase-calculator|calculadora de aumento de precio]] añade el precio nuevo y el importe; si solo conoces el valor final, usa la [[reverse-percentage-calculator|calculadora de porcentaje inverso]].',
        'Los puntos porcentuales son la resta simple entre dos porcentajes. Un tipo de interés que pasa del 3 % al 4 % sube 1 punto porcentual, que es un aumento relativo del 33,3 %.'] }
    ],
    faq: [['¿Cuál es la fórmula de la diferencia porcentual?', 'Diferencia porcentual = |A − B| ÷ ((A + B) ÷ 2) × 100. La diferencia se divide entre la media de los dos valores.'],
      ['¿Es lo mismo diferencia porcentual que variación porcentual?', 'No. La variación divide entre el valor inicial y tiene sentido (subida o bajada). La diferencia porcentual divide entre la media y no tiene sentido.'],
      ['¿Por qué 80 → 100 da 25 % y 100 → 80 da 20 %?', 'Porque cada variación usa un valor inicial distinto. La diferencia porcentual entre 80 y 100 es 22,22 % en ambos casos.'],
      ['¿Puede la diferencia porcentual superar el 100 %?', 'Sí. Puede llegar al 200 % cuando un valor es casi cero; en ese caso suele convenir más la variación desde una referencia clara.'],
      ['¿Y con números negativos?', 'La fórmula deja de tener sentido cuando la media es cero o los valores tienen signos opuestos. La calculadora te avisa en esos casos.'],
      ['¿Qué son los puntos porcentuales?', 'La resta aritmética entre dos porcentajes. Del 40 % al 45 % hay 5 puntos porcentuales, es decir, un aumento relativo del 12,5 %.']]
  },
  da: {
    name: 'Procentforskelberegner', card: 'Sammenlign to tal uden et “før” og “efter”.',
    desc: 'Gratis procentforskelberegner: sammenlign to værdier med den symmetriske formel, og se også procentvis ændring og procentpoint side om side – med udregning.',
    h1: 'Procentforskelberegner',
    lede: 'Sammenlign to tal med formlen for procentforskel, som behandler begge værdier ens. Beregneren viser også den procentvise ændring i hver retning, så du kan se, hvilket svar dit spørgsmål faktisk kræver.',
    howH: 'Sådan bruger du procentforskelberegneren',
    how: [['Indtast værdi A og værdi B', 'Rækkefølgen betyder ikke noget for procentforskellen, så du kan skrive tallene i vilkårlig orden.'],
      ['Aflæs procentforskellen', 'Det er forskellen mellem værdierne divideret med deres gennemsnit, vist med alle trin.'],
      ['Tjek de andre svar', 'Er den ene værdi tydeligt den “gamle”, så brug den procentvise ændring i stedet. Procentpoint vises, når begge tal er procenter.']],
    featH: 'Tre formler, holdt tydeligt adskilt',
    feats: [['Symmetrisk procentforskel', '|A − B| ÷ ((A + B) ÷ 2) × 100, det samme uanset rækkefølge.'],
      ['Procentvis ændring begge veje', 'A → B og B → A, så du kan se, hvorfor de er forskellige.'],
      ['Procentpoint', 'Til værdier, der allerede er procenter, f.eks. renter eller meningsmålinger.'],
      ['Udregningen vises', 'Forskel, gennemsnit og forhold står listet, så du kan tjekke regnestykket.']],
    sections: [
      { h: 'Procentforskel, procentvis ændring og procentvis stigning', p: [
        'De tre begreber blandes ofte sammen, og de giver forskellige tal. <strong>Procentforskel</strong> sammenligner to ligeværdige tal, f.eks. prisen i to butikker eller to målinger. Den absolutte forskel divideres med <em>gennemsnittet</em> af de to værdier, så det giver det samme at bytte om på A og B.',
        '<strong>Procentvis ændring</strong> har en retning: ændringen divideres med <em>startværdien</em>. Fra 80 til 100 er en stigning på 25 %, men fra 100 til 80 er et fald på 20 %. En <strong>procentvis stigning eller et fald</strong> er blot en ændring beskrevet med fortegn.'],
        table: { head: ['Sammenligning af 80 og 100', 'Formel', 'Resultat'],
          rows: [['Procentforskel', '|80 − 100| ÷ 90 × 100', '22,22 %'], ['Ændring 80 → 100', '(100 − 80) ÷ 80 × 100', '+25 %'], ['Ændring 100 → 80', '(80 − 100) ÷ 100 × 100', '−20 %']] } },
      { h: 'Hvornår bruger man hvad?', p: [
        'Brug procentforskel, når ingen af tallene er udgangspunktet: to tilbud, to løberes tider eller to målinger af det samme. Brug procentvis ændring, når der er et før og efter, som sidste års og dette års pris. Til priser, der er steget, giver [[price-increase-calculator|prisforhøjelsesberegneren]] også den nye pris og beløbet; kender du kun slutværdien, så brug [[reverse-percentage-calculator|den omvendte procentberegner]].',
        'Procentpoint er den simple forskel mellem to procenter. En rente, der går fra 3 % til 4 %, stiger 1 procentpoint, hvilket er en relativ stigning på 33,3 %.'] }
    ],
    faq: [['Hvad er formlen for procentforskel?', 'Procentforskel = |A − B| ÷ ((A + B) ÷ 2) × 100. Forskellen divideres med gennemsnittet af de to værdier.'],
      ['Er procentforskel det samme som procentvis ændring?', 'Nej. Procentvis ændring dividerer med startværdien og har en retning (stigning eller fald). Procentforskel dividerer med gennemsnittet og har ingen retning.'],
      ['Hvorfor giver 80 → 100 25 %, men 100 → 80 20 %?', 'Fordi hver ændring bruger en anden startværdi. Procentforskellen mellem 80 og 100 er 22,22 % begge veje.'],
      ['Kan procentforskellen være over 100 %?', 'Ja. Den kan nå op til 200 %, når den ene værdi er tæt på nul – så passer en procentvis ændring fra et klart udgangspunkt ofte bedre.'],
      ['Hvad med negative tal?', 'Formlen giver ikke mening, når gennemsnittet er nul, eller tallene har modsat fortegn. Beregneren advarer dig i de tilfælde.'],
      ['Hvad er procentpoint?', 'Den aritmetiske forskel mellem to procenter. Fra 40 % til 45 % er 5 procentpoint, eller en relativ stigning på 12,5 %.']]
  }
};

const i18n = {
  en: { ppU: 'pp', a: 'Value A', b: 'Value B', pctIn: 'Both values are percentages', diff: 'Percentage difference', chAB: 'Percent change A → B', chBA: 'Percent change B → A', pp: 'Percentage points', abs: 'Absolute difference',
    inc: 'increase', dec: 'decrease', same: 'no change', work: 'Show the working', wk: { d: '|A − B|', avg: 'Average (A + B) ÷ 2', r: 'Difference ÷ average', ab: '(B − A) ÷ A', ba: '(A − B) ÷ B' },
    zeroAvg: 'The average of the two values is zero, so a percentage difference is undefined.', mixed: 'The values have opposite signs. A percentage difference is not meaningful here.', empty: 'Enter two numbers.', copy: 'Copy result' },
  es: { ppU: 'p. p.', a: 'Valor A', b: 'Valor B', pctIn: 'Ambos valores son porcentajes', diff: 'Diferencia porcentual', chAB: 'Variación A → B', chBA: 'Variación B → A', pp: 'Puntos porcentuales', abs: 'Diferencia absoluta',
    inc: 'subida', dec: 'bajada', same: 'sin cambio', work: 'Ver el cálculo', wk: { d: '|A − B|', avg: 'Media (A + B) ÷ 2', r: 'Diferencia ÷ media', ab: '(B − A) ÷ A', ba: '(A − B) ÷ B' },
    zeroAvg: 'La media de los dos valores es cero, así que la diferencia porcentual no está definida.', mixed: 'Los valores tienen signos opuestos. La diferencia porcentual no tiene sentido aquí.', empty: 'Introduce dos números.', copy: 'Copiar resultado' },
  da: { ppU: 'procentpoint', a: 'Værdi A', b: 'Værdi B', pctIn: 'Begge værdier er procenter', diff: 'Procentforskel', chAB: 'Procentvis ændring A → B', chBA: 'Procentvis ændring B → A', pp: 'Procentpoint', abs: 'Absolut forskel',
    inc: 'stigning', dec: 'fald', same: 'ingen ændring', work: 'Vis udregningen', wk: { d: '|A − B|', avg: 'Gennemsnit (A + B) ÷ 2', r: 'Forskel ÷ gennemsnit', ab: '(B − A) ÷ A', ba: '(A − B) ÷ B' },
    zeroAvg: 'Gennemsnittet af de to værdier er nul, så procentforskellen er ikke defineret.', mixed: 'Værdierne har modsat fortegn. Procentforskel giver ikke mening her.', empty: 'Indtast to tal.', copy: 'Kopiér resultat' }
};

function tool(t) {
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="pd-a">${t.a}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="pd-a" value="80"></div>
  <div class="calc-field"><label for="pd-b">${t.b}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="pd-b" value="100"></div>
</div>
<label class="calc-check"><input type="checkbox" id="pd-pct"> ${t.pctIn}</label>
<p class="calc-hint" id="pd-empty" hidden>${t.empty}</p>
<div class="calc-warn" id="pd-warn" hidden></div>
<div class="calc-out" id="pd-out" aria-live="polite">
  <div class="calc-result"><span class="calc-kicker">${t.diff}</span><span class="calc-big" id="pd-diff"></span><span class="calc-sub" id="pd-abs"></span></div>
  <div class="calc-tiles">
    <div class="calc-tile"><span class="calc-tile-lbl">${t.chAB}</span><span class="calc-tile-val" id="pd-ab"></span><span class="calc-tile-sub" id="pd-ab-s"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.chBA}</span><span class="calc-tile-val" id="pd-ba"></span><span class="calc-tile-sub" id="pd-ba-s"></span></div>
    <div class="calc-tile" id="pd-pp-tile" hidden><span class="calc-tile-lbl">${t.pp}</span><span class="calc-tile-val" id="pd-pp"></span></div>
  </div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="pd-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="pd-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
