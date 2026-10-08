'use strict';

const seo = {
  en: {
    name: 'Unit Price Calculator', card: 'Compare pack sizes and find the cheapest per kg, litre or item.',
    desc: 'Free unit price calculator: compare products and pack sizes by price per kg, per 100 g, per litre or per item, and see which is cheapest and by how much.',
    h1: 'Unit Price Calculator',
    lede: 'Compare products and package sizes by what they really cost per kilogram, litre or item. Add as many options as you like, including multipacks, and see the cheapest one and how much more the others cost.',
    howH: 'How to compare unit prices',
    how: [['Add each product', 'Enter the price, the size and the unit printed on the pack. Use the pack count for multipacks such as 6 × 330 ml.'],
      ['Mix units freely', 'Grams with kilograms or ounces, millilitres with litres – everything is converted before comparing.'],
      ['Read the ranking', 'The cheapest option is highlighted, and every other one shows how much more it costs per unit.']],
    featH: 'Smarter than the shelf label',
    feats: [['Unlimited products', 'Compare two options or ten, including different brands and pack sizes.'],
      ['Multipacks handled', 'Enter 6 × 330 ml as count 6 and size 330 ml.'],
      ['Metric and US units', 'g, kg, oz, lb, ml, cl, l, fl oz and items, converted for you.'],
      ['Percent more than cheapest', 'See exactly what a “family size” or a small pack really costs you.']],
    sections: [
      { h: 'How unit price is calculated', p: [
        'Unit price = price ÷ (pack count × size), converted to a common unit. A 750 g box at 3.60 costs 3.60 ÷ 0.75 = 4.80 per kg; a 500 g box at 2.65 costs 5.30 per kg. The bigger box is 9.4% cheaper per kilogram, even though it costs more at the till.',
        'Bigger is not always cheaper. Promotions on small packs, multibuy offers and “shrinkflation” on large packs can all flip the result, which is why comparing the price per unit is the only reliable test. If a pack got smaller at the same price, the [[price-increase-calculator|price increase calculator]] shows the hidden increase.'] },
      { h: 'Units the calculator understands', p: [
        'Weights are converted to grams (1 oz = 28.3495 g, 1 lb = 453.592 g) and volumes to millilitres (1 US fl oz = 29.5735 ml, 1 cl = 10 ml). Items are compared per piece. Weight and volume cannot be compared with each other without knowing the density, so mixed groups are ranked separately.',
        'Stacking several discounts on one product? Work out the final price with the [[discount-stacking-calculator|discount stacking calculator]], then compare it here.'] }
    ],
    faq: [['What is a unit price?', 'The price per standard amount, such as per kilogram, per litre or per item. It lets you compare products of different sizes fairly.'],
      ['How do I calculate price per kg?', 'Divide the price by the weight in kilograms. 2.40 for 400 g is 2.40 ÷ 0.4 = 6.00 per kg.'],
      ['How do I enter a multipack?', 'Set the pack count to the number of items and the size to one item. 4 × 125 g yoghurts: count 4, size 125, unit g.'],
      ['Can I compare grams with millilitres?', 'Not directly, because that would need the product’s density. The calculator ranks weight and volume products separately.'],
      ['Is the bigger pack always cheaper?', 'No. Offers on smaller packs and price rises on larger ones mean you should always check the unit price.'],
      ['Does it work with any currency?', 'Yes. Enter prices in any currency; just use the same one for every product.']]
  },
  es: {
    name: 'Calculadora de Precio Unitario', card: 'Compara formatos y encuentra el más barato por kg, litro o unidad.',
    desc: 'Calculadora de precio unitario gratis: compara productos y formatos por precio por kilo, por 100 g, por litro o por unidad y descubre cuál es el más barato.',
    h1: 'Calculadora de Precio Unitario',
    lede: 'Compara productos y formatos por lo que cuestan de verdad por kilo, litro o unidad. Añade todas las opciones que quieras, incluidos los packs, y ve cuál es la más barata y cuánto más cuestan las demás.',
    howH: 'Cómo comparar precios unitarios',
    how: [['Añade cada producto', 'Introduce el precio, el tamaño y la unidad del envase. Usa el número de unidades para packs como 6 × 330 ml.'],
      ['Mezcla unidades sin problema', 'Gramos con kilos u onzas, mililitros con litros: todo se convierte antes de comparar.'],
      ['Mira la clasificación', 'La opción más barata se resalta y las demás muestran cuánto más cuestan por unidad.']],
    featH: 'Más fiable que la etiqueta del lineal',
    feats: [['Productos ilimitados', 'Compara dos opciones o diez, de marcas y tamaños distintos.'],
      ['Packs incluidos', 'Introduce 6 × 330 ml como 6 unidades de 330 ml.'],
      ['Unidades métricas y de EE. UU.', 'g, kg, oz, lb, ml, cl, l, fl oz y unidades, convertidas automáticamente.'],
      ['% más caro que el más barato', 'Ve lo que te cuesta realmente un “formato familiar” o un envase pequeño.']],
    sections: [
      { h: 'Cómo se calcula el precio unitario', p: [
        'Precio unitario = precio ÷ (unidades × tamaño), convertido a una unidad común. Una caja de 750 g a 3,60 cuesta 3,60 ÷ 0,75 = 4,80 el kilo; una de 500 g a 2,65 cuesta 5,30 el kilo. La caja grande es un 9,4 % más barata por kilo, aunque en caja pagues más.',
        'Más grande no siempre es más barato. Las ofertas en envases pequeños, las promociones de varias unidades y la reduflación en los formatos grandes pueden darle la vuelta al resultado; por eso comparar el precio por unidad es la única prueba fiable. Si un envase ha encogido al mismo precio, la [[price-increase-calculator|calculadora de aumento de precio]] muestra la subida encubierta.'] },
      { h: 'Unidades que entiende la calculadora', p: [
        'Los pesos se convierten a gramos (1 oz = 28,3495 g, 1 lb = 453,592 g) y los volúmenes a mililitros (1 fl oz EE. UU. = 29,5735 ml, 1 cl = 10 ml). Las unidades se comparan por pieza. Peso y volumen no se pueden comparar entre sí sin conocer la densidad, así que se clasifican por separado.',
        '¿Varios descuentos sobre un mismo producto? Calcula el precio final con la [[discount-stacking-calculator|calculadora de descuentos acumulados]] y compáralo aquí.'] }
    ],
    faq: [['¿Qué es el precio unitario?', 'El precio por una cantidad estándar, como el kilo, el litro o la unidad. Permite comparar productos de distinto tamaño de forma justa.'],
      ['¿Cómo calculo el precio por kilo?', 'Divide el precio entre el peso en kilos. 2,40 por 400 g es 2,40 ÷ 0,4 = 6,00 el kilo.'],
      ['¿Cómo introduzco un pack?', 'Pon en unidades el número de envases y en tamaño el de uno solo. 4 yogures de 125 g: unidades 4, tamaño 125, unidad g.'],
      ['¿Puedo comparar gramos con mililitros?', 'No directamente, porque haría falta la densidad del producto. La calculadora clasifica peso y volumen por separado.'],
      ['¿El envase grande siempre es más barato?', 'No. Las ofertas en formatos pequeños y las subidas en los grandes hacen que siempre convenga mirar el precio unitario.'],
      ['¿Funciona con cualquier moneda?', 'Sí. Usa la moneda que quieras, pero la misma para todos los productos.']]
  },
  da: {
    name: 'Enhedsprisberegner', card: 'Sammenlign pakkestørrelser og find den billigste pr. kg, liter eller stk.',
    desc: 'Gratis enhedsprisberegner: sammenlign varer og pakkestørrelser på pris pr. kg, pr. 100 g, pr. liter eller pr. stk., og se hvilken der er billigst.',
    h1: 'Enhedsprisberegner',
    lede: 'Sammenlign varer og pakkestørrelser på det, de reelt koster pr. kilo, liter eller stk. Tilføj så mange muligheder, du vil, også multipakker, og se den billigste, og hvor meget dyrere de andre er.',
    howH: 'Sådan sammenligner du enhedspriser',
    how: [['Tilføj hver vare', 'Indtast pris, størrelse og enhed fra pakken. Brug antal til multipakker som 6 × 33 cl.'],
      ['Bland enheder frit', 'Gram med kilo eller ounce, milliliter med liter – alt omregnes, før der sammenlignes.'],
      ['Se placeringen', 'Den billigste markeres, og alle andre viser, hvor meget mere de koster pr. enhed.']],
    featH: 'Klogere end hyldeforkanten',
    feats: [['Ubegrænset antal varer', 'Sammenlign to muligheder eller ti, på tværs af mærker og størrelser.'],
      ['Multipakker håndteres', 'Indtast 6 × 33 cl som antal 6 og størrelse 33 cl.'],
      ['Metriske og amerikanske enheder', 'g, kg, oz, lb, ml, cl, l, fl oz og stk., omregnet for dig.'],
      ['Procent dyrere end den billigste', 'Se, hvad en “familiepakke” eller en lille pakke reelt koster dig.']],
    sections: [
      { h: 'Sådan beregnes enhedsprisen', p: [
        'Enhedspris = pris ÷ (antal × størrelse), omregnet til en fælles enhed. En pakke på 750 g til 36 kr. koster 36 ÷ 0,75 = 48 kr. pr. kg; en pakke på 500 g til 26,50 kr. koster 53 kr. pr. kg. Den store pakke er 9,4 % billigere pr. kilo, selvom du betaler mere ved kassen.',
        'Større er ikke altid billigere. Tilbud på små pakker, mængderabat og skjulte prisstigninger på store pakker kan vende resultatet, og derfor er prisen pr. enhed den eneste pålidelige sammenligning. Er en pakke blevet mindre til samme pris, viser [[price-increase-calculator|prisforhøjelsesberegneren]] den skjulte stigning.'] },
      { h: 'Enheder, beregneren forstår', p: [
        'Vægt omregnes til gram (1 oz = 28,3495 g, 1 lb = 453,592 g) og volumen til milliliter (1 amerikansk fl oz = 29,5735 ml, 1 cl = 10 ml). Stk. sammenlignes pr. styk. Vægt og volumen kan ikke sammenlignes uden at kende varens massefylde, så de rangeres hver for sig.',
        'Flere rabatter på samme vare? Beregn slutprisen med [[discount-stacking-calculator|rabatberegneren med flere rabatter]], og sammenlign den her.'] }
    ],
    faq: [['Hvad er en enhedspris?', 'Prisen pr. standardmængde, f.eks. pr. kilo, pr. liter eller pr. stk. Den gør det muligt at sammenligne varer i forskellige størrelser retfærdigt.'],
      ['Hvordan beregner jeg kiloprisen?', 'Dividér prisen med vægten i kilo. 24 kr. for 400 g er 24 ÷ 0,4 = 60 kr. pr. kg.'],
      ['Hvordan indtaster jeg en multipakke?', 'Sæt antal til antallet af enheder og størrelse til én enhed. 4 yoghurter à 125 g: antal 4, størrelse 125, enhed g.'],
      ['Kan jeg sammenligne gram med milliliter?', 'Ikke direkte, for det kræver varens massefylde. Beregneren rangerer vægt- og volumenvarer hver for sig.'],
      ['Er den store pakke altid billigst?', 'Nej. Tilbud på små pakker og prisstigninger på store gør, at du altid bør tjekke enhedsprisen.'],
      ['Virker det med alle valutaer?', 'Ja. Brug den valuta, du vil, bare den samme for alle varer.']]
  }
};

const i18n = {
  en: { name: 'Product', namePh: 'Option {n}', price: 'Price', count: 'Pack count', size: 'Size', unit: 'Unit', add: '+ Add product', rm: 'Remove', units: { g: 'g', kg: 'kg', oz: 'oz', lb: 'lb', ml: 'ml', cl: 'cl', l: 'l', floz: 'fl oz', pc: 'items' },
    perKg: 'per kg', per100g: 'per 100 g', perL: 'per litre', per100ml: 'per 100 ml', perPc: 'per item', cheapest: 'Cheapest', more: '{p} more than cheapest', group: { mass: 'By weight', vol: 'By volume', count: 'By item' },
    mixed: 'Weight, volume and item products are ranked separately.', empty: 'Enter a price and size for at least one product.', copy: 'Copy comparison' },
  es: { name: 'Producto', namePh: 'Opción {n}', price: 'Precio', count: 'Unidades', size: 'Tamaño', unit: 'Unidad', add: '+ Añadir producto', rm: 'Quitar', units: { g: 'g', kg: 'kg', oz: 'oz', lb: 'lb', ml: 'ml', cl: 'cl', l: 'l', floz: 'fl oz', pc: 'uds.' },
    perKg: 'el kilo', per100g: 'por 100 g', perL: 'el litro', per100ml: 'por 100 ml', perPc: 'por unidad', cheapest: 'Más barato', more: '{p} más caro que el más barato', group: { mass: 'Por peso', vol: 'Por volumen', count: 'Por unidad' },
    mixed: 'Los productos por peso, volumen y unidad se clasifican por separado.', empty: 'Introduce precio y tamaño de al menos un producto.', copy: 'Copiar comparación' },
  da: { name: 'Vare', namePh: 'Mulighed {n}', price: 'Pris', count: 'Antal', size: 'Størrelse', unit: 'Enhed', add: '+ Tilføj vare', rm: 'Fjern', units: { g: 'g', kg: 'kg', oz: 'oz', lb: 'lb', ml: 'ml', cl: 'cl', l: 'l', floz: 'fl oz', pc: 'stk.' },
    perKg: 'pr. kg', per100g: 'pr. 100 g', perL: 'pr. liter', per100ml: 'pr. 100 ml', perPc: 'pr. stk.', cheapest: 'Billigst', more: '{p} dyrere end den billigste', group: { mass: 'Efter vægt', vol: 'Efter volumen', count: 'Efter stk.' },
    mixed: 'Varer efter vægt, volumen og stk. rangeres hver for sig.', empty: 'Indtast pris og størrelse for mindst én vare.', copy: 'Kopiér sammenligning' }
};

function tool(t) {
  return `
<div class="calc-rows" id="up-rows"></div>
<div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="up-add">${t.add}</button></div>
<p class="calc-hint" id="up-empty" hidden>${t.empty}</p>
<div class="calc-out" id="up-out" aria-live="polite">
  <p class="calc-hint" id="up-mixed" hidden>${t.mixed}</p>
  <div id="up-results" class="calc-out"></div>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="up-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
