'use strict';

const seo = {
  en: {
    name: 'Slope, Grade & Angle Calculator', card: 'Convert slope ratio, decimal, % grade, ‰ and degrees.',
    desc: 'Free slope, grade and angle calculator: convert between slope ratio 1:n, decimal slope, percent grade, per mille, roof pitch and angle in degrees.',
    h1: 'Slope, Grade & Angle Calculator',
    lede: 'Convert any way of writing a slope into all the others: ratio 1:n, decimal slope, percent grade, per mille, roof pitch in twelfths and angle in degrees. Ideal for ramps, roads, roofs, drains and gardens.',
    howH: 'How to convert slope, grade and angle',
    how: [['Choose what you have', 'Percent grade, degrees, a 1:n ratio, a decimal slope, per mille or a roof pitch.'],
      ['Type the value', 'Every other format updates instantly, along with the rise per metre or per 100 units.'],
      ['Check the reference table', 'Common slopes such as 1:12 ramps and 2% drains are listed for comparison.']],
    featH: 'Every slope format in one place',
    feats: [['Six formats', 'Ratio 1:n, decimal, percent, per mille, roof pitch x/12 and degrees.'],
      ['Rise per distance', 'See how much it rises over 1 m, 10 m and 100 m (or ft).'],
      ['Steepness warnings', 'Flags slopes steeper than 45° (100% grade) and vertical inputs.'],
      ['Reference slopes', 'Wheelchair ramps, roads, roofs and drainage in one table.']],
    sections: [
      { h: 'Grade, slope and angle are not the same number', p: [
        'Decimal slope = rise ÷ run. Percent grade = slope × 100. Per mille (‰) = slope × 1000. Angle = arctan(slope). A ratio of 1:12 means 1 unit up for 12 across: slope 0.0833, grade 8.33%, angle 4.76°.',
        'Percent and degrees are often confused, but they are not proportional. A 100% grade is 45°, and a vertical wall would be an infinite grade, not 100%. For small slopes they diverge slowly (10% ≈ 5.71°), which is why the mistake goes unnoticed on roads but matters for ramps and roofs.'],
        table: { head: ['Example', 'Ratio', 'Grade', 'Angle'],
          rows: [['Drainage pipe', '1:50', '2%', '1.15°'], ['Wheelchair ramp (max., common rule)', '1:12', '8.33%', '4.76°'], ['Steep road', '1:8', '12.5%', '7.13°'], ['Roof pitch 6/12', '1:2', '50%', '26.57°'], ['45° slope', '1:1', '100%', '45°']] },
        after: ['Local building codes vary, so always check the rules that apply to your project.'] },
      { h: 'From measurements instead?', p: [
        'If you measured a rise and a run, or have two points, the [[rise-over-run-calculator|rise over run calculator]] works out the slope and draws the triangle. To compare two slopes as a percentage, use the [[percentage-difference-calculator|percentage difference calculator]].'] }
    ],
    faq: [['How do I convert percent grade to degrees?', 'Divide the percentage by 100 and take the arctangent: angle = arctan(grade ÷ 100). 10% is 5.71°.'],
      ['How do I convert degrees to percent?', 'Take the tangent of the angle and multiply by 100: grade = tan(angle) × 100. 30° is 57.7%.'],
      ['What does a slope of 1:20 mean?', 'One unit of rise for every 20 units of horizontal distance: 5% grade or 2.86°.'],
      ['Is a 100% grade vertical?', 'No. 100% means the rise equals the run, which is 45°. A vertical line has an undefined grade.'],
      ['What is roof pitch 4/12?', 'A rise of 4 for a run of 12: slope 0.333, grade 33.3% and angle 18.43°.'],
      ['What is per mille (‰)?', 'Rise per 1,000 units of run. It is common for drains and railways: 5‰ is a 0.5% grade.']]
  },
  es: {
    name: 'Calculadora de Pendiente, Porcentaje y Ángulo', card: 'Convierte proporción, decimal, %, ‰ y grados de pendiente.',
    desc: 'Calculadora de pendiente, porcentaje y ángulo gratis: convierte entre proporción 1:n, pendiente decimal, porcentaje, por mil, tejado y grados.',
    title: 'Calculadora de Pendiente, Porcentaje y Ángulo | AnyConverter',
    h1: 'Calculadora de Pendiente, Porcentaje y Ángulo',
    lede: 'Convierte cualquier forma de expresar una pendiente en todas las demás: proporción 1:n, pendiente decimal, porcentaje, por mil, pendiente de tejado en doceavos y ángulo en grados. Ideal para rampas, carreteras, tejados, desagües y jardines.',
    howH: 'Cómo convertir pendiente, porcentaje y ángulo',
    how: [['Elige lo que tienes', 'Porcentaje, grados, una proporción 1:n, una pendiente decimal, por mil o una pendiente de tejado.'],
      ['Escribe el valor', 'Todos los demás formatos se actualizan al momento, junto con la subida por metro o cada 100 unidades.'],
      ['Consulta la tabla', 'Pendientes habituales, como rampas 1:12 o desagües al 2 %, para comparar.']],
    featH: 'Todos los formatos de pendiente en un sitio',
    feats: [['Seis formatos', 'Proporción 1:n, decimal, porcentaje, por mil, pendiente de tejado x/12 y grados.'],
      ['Subida por distancia', 'Cuánto sube en 1 m, 10 m y 100 m.'],
      ['Avisos de pendiente', 'Señala pendientes de más de 45° (100 %) y valores verticales.'],
      ['Pendientes de referencia', 'Rampas, carreteras, tejados y desagües en una tabla.']],
    sections: [
      { h: 'Porcentaje, pendiente y ángulo no son el mismo número', p: [
        'Pendiente decimal = elevación ÷ recorrido. Porcentaje = pendiente × 100. Por mil (‰) = pendiente × 1000. Ángulo = arctan(pendiente). Una proporción 1:12 significa 1 unidad de subida por 12 en horizontal: pendiente 0,0833, 8,33 % y 4,76°.',
        'Porcentaje y grados se confunden a menudo, pero no son proporcionales. Una pendiente del 100 % son 45°, y una pared vertical tendría una pendiente infinita, no del 100 %. En pendientes pequeñas se separan poco (10 % ≈ 5,71°), por eso el error pasa desapercibido en carreteras, pero importa en rampas y tejados.'],
        table: { head: ['Ejemplo', 'Proporción', 'Porcentaje', 'Ángulo'],
          rows: [['Tubería de desagüe', '1:50', '2 %', '1,15°'], ['Rampa accesible (máx., regla habitual)', '1:12', '8,33 %', '4,76°'], ['Carretera empinada', '1:8', '12,5 %', '7,13°'], ['Tejado 6/12', '1:2', '50 %', '26,57°'], ['Pendiente de 45°', '1:1', '100 %', '45°']] },
        after: ['La normativa varía según el país y el municipio, así que revisa siempre la que aplica a tu proyecto.'] },
      { h: '¿Tienes medidas en lugar de un valor?', p: [
        'Si has medido una elevación y un recorrido, o tienes dos puntos, la [[rise-over-run-calculator|calculadora de pendiente con elevación y recorrido]] calcula la pendiente y dibuja el triángulo. Para comparar dos pendientes en porcentaje, usa la [[percentage-difference-calculator|calculadora de diferencia porcentual]].'] }
    ],
    faq: [['¿Cómo paso de porcentaje a grados?', 'Divide el porcentaje entre 100 y calcula la arcotangente: ángulo = arctan(porcentaje ÷ 100). Un 10 % son 5,71°.'],
      ['¿Cómo paso de grados a porcentaje?', 'Calcula la tangente del ángulo y multiplica por 100: porcentaje = tan(ángulo) × 100. 30° son un 57,7 %.'],
      ['¿Qué significa una pendiente 1:20?', 'Una unidad de subida por cada 20 de distancia horizontal: un 5 % o 2,86°.'],
      ['¿Una pendiente del 100 % es vertical?', 'No. El 100 % significa que la subida es igual al recorrido, es decir, 45°. Una línea vertical no tiene porcentaje definido.'],
      ['¿Qué es una pendiente de tejado 4/12?', 'Una subida de 4 por cada 12 en horizontal: pendiente 0,333, un 33,3 % y 18,43°.'],
      ['¿Qué es el por mil (‰)?', 'La subida por cada 1000 unidades de recorrido. Se usa en desagües y ferrocarriles: 5 ‰ es un 0,5 %.']]
  },
  da: {
    name: 'Hældning, stigningsprocent og vinkel-beregner', card: 'Omregn hældningsforhold, decimal, %, ‰ og grader.',
    desc: 'Gratis beregner for hældning, stigningsprocent og vinkel: omregn mellem forhold 1:n, decimaltal, procent, promille, taghældning og vinkel i grader.',
    title: 'Hældning, Stigningsprocent og Vinkel Beregner | AnyConverter',
    h1: 'Hældning, stigningsprocent og vinkel-beregner',
    lede: 'Omregn en hældning fra én skrivemåde til alle de andre: forhold 1:n, decimaltal, procent, promille, taghældning i tolvtedele og vinkel i grader. Perfekt til ramper, veje, tage, kloak og haver.',
    howH: 'Sådan omregner du hældning, procent og vinkel',
    how: [['Vælg, hvad du har', 'Stigningsprocent, grader, et forhold 1:n, en decimalhældning, promille eller en taghældning.'],
      ['Skriv værdien', 'Alle andre formater opdateres med det samme, sammen med stigningen pr. meter eller pr. 100 enheder.'],
      ['Se referencetabellen', 'Almindelige hældninger som ramper på 1:12 og kloak med 2 % står i tabellen til sammenligning.']],
    featH: 'Alle hældningsformater ét sted',
    feats: [['Seks formater', 'Forhold 1:n, decimaltal, procent, promille, taghældning x/12 og grader.'],
      ['Stigning pr. afstand', 'Se hvor meget den stiger over 1 m, 10 m og 100 m.'],
      ['Advarsel ved stejle hældninger', 'Markerer hældninger over 45° (100 %) og lodrette værdier.'],
      ['Referencehældninger', 'Ramper, veje, tage og afløb i én tabel.']],
    sections: [
      { h: 'Procent, hældning og vinkel er ikke det samme tal', p: [
        'Decimalhældning = stigning ÷ vandret afstand. Stigningsprocent = hældning × 100. Promille (‰) = hældning × 1000. Vinkel = arctan(hældning). Et forhold på 1:12 betyder 1 enhed op for hver 12 vandret: hældning 0,0833, 8,33 % og 4,76°.',
        'Procent og grader forveksles ofte, men de er ikke proportionale. 100 % hældning er 45°, og en lodret væg ville have uendelig hældning og ikke 100 %. Ved små hældninger skilles de langsomt (10 % ≈ 5,71°), så fejlen opdages sjældent på veje, men den betyder noget for ramper og tage.'],
        table: { head: ['Eksempel', 'Forhold', 'Procent', 'Vinkel'],
          rows: [['Afløbsrør', '1:50', '2 %', '1,15°'], ['Kørestolsrampe (maks., typisk regel)', '1:12', '8,33 %', '4,76°'], ['Stejl vej', '1:8', '12,5 %', '7,13°'], ['Taghældning 6/12', '1:2', '50 %', '26,57°'], ['45° hældning', '1:1', '100 %', '45°']] },
        after: ['Bygningsreglementet og lokale krav varierer, så tjek altid de regler, der gælder for dit projekt.'] },
      { h: 'Har du målinger i stedet?', p: [
        'Har du målt en stigning og en vandret afstand, eller har du to punkter, beregner [[rise-over-run-calculator|hældningsberegneren for stigning og afstand]] hældningen og tegner trekanten. Vil du sammenligne to hældninger i procent, så brug [[percentage-difference-calculator|procentforskelberegneren]].'] }
    ],
    faq: [['Hvordan omregner jeg procent til grader?', 'Dividér procenten med 100, og tag arctangens: vinkel = arctan(procent ÷ 100). 10 % er 5,71°.'],
      ['Hvordan omregner jeg grader til procent?', 'Tag tangens af vinklen, og gang med 100: procent = tan(vinkel) × 100. 30° er 57,7 %.'],
      ['Hvad betyder en hældning på 1:20?', 'Én enheds stigning for hver 20 enheder vandret: 5 % eller 2,86°.'],
      ['Er 100 % hældning lodret?', 'Nej. 100 % betyder, at stigningen er lig med den vandrette afstand, altså 45°. En lodret linje har ingen defineret procent.'],
      ['Hvad er en taghældning på 4/12?', 'En stigning på 4 for hver 12 vandret: hældning 0,333, 33,3 % og 18,43°.'],
      ['Hvad er promille (‰)?', 'Stigningen pr. 1.000 enheder vandret afstand. Bruges ofte til afløb og jernbaner: 5 ‰ er 0,5 %.']]
  }
};

const i18n = {
  en: { have: 'I have', kinds: { pct: 'Percent grade (%)', deg: 'Angle (°)', ratio: 'Ratio 1:n', dec: 'Decimal slope', pm: 'Per mille (‰)', pitch: 'Roof pitch (x/12)' }, value: 'Value', nHint: 'For 1:n enter n',
    out: { pct: 'Grade', deg: 'Angle', ratio: 'Ratio', dec: 'Decimal slope', pm: 'Per mille', pitch: 'Roof pitch' }, rise: 'Rise over {d}', steep: 'Steeper than 45°: the rise is greater than the run.', vertical: 'A 90° slope is vertical: grade and ratio are undefined.', bad: 'Enter a valid positive value.', copy: 'Copy all formats', unit: 'm' },
  es: { have: 'Tengo', kinds: { pct: 'Porcentaje (%)', deg: 'Ángulo (°)', ratio: 'Proporción 1:n', dec: 'Pendiente decimal', pm: 'Por mil (‰)', pitch: 'Pendiente de tejado (x/12)' }, value: 'Valor', nHint: 'Para 1:n introduce n',
    out: { pct: 'Porcentaje', deg: 'Ángulo', ratio: 'Proporción', dec: 'Pendiente decimal', pm: 'Por mil', pitch: 'Tejado' }, rise: 'Subida en {d}', steep: 'Más de 45°: la subida es mayor que el recorrido.', vertical: 'Una pendiente de 90° es vertical: el porcentaje y la proporción no están definidos.', bad: 'Introduce un valor positivo válido.', copy: 'Copiar todos los formatos', unit: 'm' },
  da: { have: 'Jeg har', kinds: { pct: 'Stigningsprocent (%)', deg: 'Vinkel (°)', ratio: 'Forhold 1:n', dec: 'Decimalhældning', pm: 'Promille (‰)', pitch: 'Taghældning (x/12)' }, value: 'Værdi', nHint: 'Ved 1:n indtaster du n',
    out: { pct: 'Procent', deg: 'Vinkel', ratio: 'Forhold', dec: 'Decimalhældning', pm: 'Promille', pitch: 'Taghældning' }, rise: 'Stigning over {d}', steep: 'Stejlere end 45°: stigningen er større end den vandrette afstand.', vertical: 'En hældning på 90° er lodret: procent og forhold er ikke defineret.', bad: 'Indtast en gyldig positiv værdi.', copy: 'Kopiér alle formater', unit: 'm' }
};

function tool(t) {
  const k = t.kinds;
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="sg-kind">${t.have}</label><select class="calc-input calc-input--lg" id="sg-kind">${Object.keys(k).map((x) => `<option value="${x}">${k[x]}</option>`).join('')}</select></div>
  <div class="calc-field"><label for="sg-val">${t.value}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="sg-val" value="8.33"><span class="calc-hint" id="sg-nhint" hidden>${t.nHint}</span></div>
</div>
<div class="calc-err" id="sg-bad" role="alert" hidden>${t.bad}</div>
<div class="calc-warn" id="sg-vert" hidden>${t.vertical}</div>
<div class="calc-out" id="sg-out" aria-live="polite">
  <div class="calc-warn" id="sg-steep" hidden>${t.steep}</div>
  <div class="calc-tiles" id="sg-tiles"></div>
  <div class="calc-tiles" id="sg-rise"></div>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="sg-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
