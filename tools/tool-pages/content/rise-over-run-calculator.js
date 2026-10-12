'use strict';

const seo = {
  en: {
    name: 'Rise Over Run Calculator', card: 'Slope from rise and run, or from two points.',
    desc: 'Free rise over run calculator: get the slope m = rise ÷ run as a fraction, decimal, percent grade and angle, from rise and run or two points, with a diagram.',
    h1: 'Rise Over Run Calculator',
    lede: 'Enter the rise and the run, or two points on a line, to get the slope as a simplified fraction, a decimal, a percent grade and an angle. A diagram shows exactly what you measured.',
    howH: 'How to calculate slope from rise over run',
    how: [['Enter rise and run', 'Rise is the vertical change, run the horizontal change. Use the same unit for both.'],
      ['Or use two points', 'Switch to two points to enter (x₁, y₁) and (x₂, y₂); rise = y₂ − y₁ and run = x₂ − x₁.'],
      ['Read the slope', 'You get m as a fraction and decimal, the grade in percent, the angle and the line length.']],
    featH: 'Slope, explained step by step',
    feats: [['Two ways to enter', 'Rise and run, or two coordinate points with the line equation y = mx + b.'],
      ['Simplified fraction', '6 over 8 is shown as 3/4, so the slope stays exact.'],
      ['Grade, angle and length', 'Percent grade, angle in degrees and the hypotenuse from Pythagoras.'],
      ['Live diagram', 'A right triangle drawn to scale, with rise and run labelled.']],
    sections: [
      { h: 'The rise over run formula', p: [
        'Slope m = rise ÷ run. A ramp that climbs 3 units over a horizontal distance of 12 has a slope of 3/12 = 1/4 = 0.25. As a grade that is 25%, and the angle is arctan(0.25) = 14.04°. The sloped length is √(3² + 12²) = 12.37.',
        'With two points, rise = y₂ − y₁ and run = x₂ − x₁. For (1, 2) and (5, 8): rise 6, run 4, so m = 6/4 = 3/2 = 1.5, and the line is y = 1.5x + 0.5. A negative slope goes down from left to right; a run of 0 gives a vertical line with an undefined slope.'] },
      { h: 'Rise over run vs grade and angle', p: [
        'Rise over run is the slope itself; percent grade is the same number × 100, and the angle is its arctangent. They are not proportional: a 100% grade is a 45° angle, not 90°. To convert between ratio, grade, angle and roof pitch without drawing a triangle, use the [[slope-grade-angle-calculator|slope, grade and angle calculator]].'] }
    ],
    faq: [['What is rise over run?', 'It is the slope of a line: the vertical change (rise) divided by the horizontal change (run).'],
      ['How do I find the slope from two points?', 'Subtract the y-values and the x-values: m = (y₂ − y₁) ÷ (x₂ − x₁).'],
      ['What if the run is zero?', 'The line is vertical and the slope is undefined. The calculator tells you instead of dividing by zero.'],
      ['How do I turn slope into a percentage?', 'Multiply the slope by 100. A slope of 0.08 is an 8% grade.'],
      ['How do I turn slope into an angle?', 'Take the arctangent: angle = arctan(rise ÷ run). A slope of 1 is 45°.'],
      ['Can the slope be negative?', 'Yes. A negative slope means the line goes down as you move to the right.']]
  },
  es: {
    name: 'Calculadora de Pendiente — Elevación y Recorrido', card: 'Pendiente a partir de elevación y recorrido, o de dos puntos.',
    desc: 'Calculadora de pendiente gratis: obtén m = elevación ÷ recorrido como fracción, decimal, porcentaje y ángulo, a partir de elevación y recorrido o de dos puntos.',
    title: 'Calculadora de Pendiente: Elevación y Recorrido | AnyConverter',
    h1: 'Calculadora de Pendiente — Elevación y Recorrido',
    lede: 'Introduce la elevación y el recorrido, o dos puntos de una recta, para obtener la pendiente como fracción simplificada, decimal, porcentaje y ángulo. Un diagrama muestra exactamente lo que has medido.',
    howH: 'Cómo calcular la pendiente con elevación y recorrido',
    how: [['Introduce elevación y recorrido', 'La elevación es el cambio vertical y el recorrido el horizontal. Usa la misma unidad en ambos.'],
      ['O usa dos puntos', 'Cambia a dos puntos para introducir (x₁, y₁) y (x₂, y₂); elevación = y₂ − y₁ y recorrido = x₂ − x₁.'],
      ['Lee la pendiente', 'Obtienes m como fracción y decimal, la pendiente en porcentaje, el ángulo y la longitud.']],
    featH: 'La pendiente, paso a paso',
    feats: [['Dos formas de introducir datos', 'Elevación y recorrido, o dos puntos con la ecuación de la recta y = mx + b.'],
      ['Fracción simplificada', '6 entre 8 aparece como 3/4, así la pendiente es exacta.'],
      ['Porcentaje, ángulo y longitud', 'Pendiente en %, ángulo en grados e hipotenusa por Pitágoras.'],
      ['Diagrama en vivo', 'Un triángulo rectángulo a escala con la elevación y el recorrido marcados.']],
    sections: [
      { h: 'La fórmula elevación sobre recorrido', p: [
        'Pendiente m = elevación ÷ recorrido. Una rampa que sube 3 unidades en una distancia horizontal de 12 tiene una pendiente de 3/12 = 1/4 = 0,25. En porcentaje es un 25 %, y el ángulo es arctan(0,25) = 14,04°. La longitud inclinada es √(3² + 12²) = 12,37.',
        'Con dos puntos, elevación = y₂ − y₁ y recorrido = x₂ − x₁. Para (1, 2) y (5, 8): elevación 6, recorrido 4, así que m = 6/4 = 3/2 = 1,5, y la recta es y = 1,5x + 0,5. Una pendiente negativa baja de izquierda a derecha; un recorrido de 0 es una recta vertical con pendiente indefinida.'] },
      { h: 'Elevación sobre recorrido frente a porcentaje y ángulo', p: [
        'Elevación sobre recorrido es la pendiente en sí; el porcentaje es ese número × 100 y el ángulo es su arcotangente. No son proporcionales: una pendiente del 100 % es un ángulo de 45°, no de 90°. Para convertir entre proporción, porcentaje, ángulo y pendiente de tejado sin dibujar un triángulo, usa la [[slope-grade-angle-calculator|calculadora de pendiente, porcentaje y ángulo]].'] }
    ],
    faq: [['¿Qué es elevación sobre recorrido?', 'Es la pendiente de una recta: el cambio vertical (elevación) dividido entre el cambio horizontal (recorrido).'],
      ['¿Cómo calculo la pendiente con dos puntos?', 'Resta los valores de y y los de x: m = (y₂ − y₁) ÷ (x₂ − x₁).'],
      ['¿Y si el recorrido es cero?', 'La recta es vertical y la pendiente no está definida. La calculadora te lo indica en lugar de dividir entre cero.'],
      ['¿Cómo paso la pendiente a porcentaje?', 'Multiplica la pendiente por 100. Una pendiente de 0,08 es un 8 %.'],
      ['¿Cómo paso la pendiente a ángulo?', 'Calcula la arcotangente: ángulo = arctan(elevación ÷ recorrido). Una pendiente de 1 son 45°.'],
      ['¿Puede la pendiente ser negativa?', 'Sí. Una pendiente negativa significa que la recta baja al avanzar hacia la derecha.']]
  },
  da: {
    name: 'Hældningsberegner — Stigning og afstand', card: 'Hældning ud fra stigning og vandret afstand, eller to punkter.',
    desc: 'Gratis hældningsberegner: find hældningen m = stigning ÷ vandret afstand som brøk, decimaltal, procent og vinkel, ud fra stigning og afstand eller to punkter.',
    h1: 'Hældningsberegner — Stigning og afstand',
    lede: 'Indtast stigningen og den vandrette afstand, eller to punkter på en linje, og få hældningen som forkortet brøk, decimaltal, procent og vinkel. En tegning viser præcis, hvad du har målt.',
    howH: 'Sådan beregner du hældning ud fra stigning og afstand',
    how: [['Indtast stigning og afstand', 'Stigningen er den lodrette ændring, afstanden den vandrette. Brug samme enhed til begge.'],
      ['Eller brug to punkter', 'Skift til to punkter og indtast (x₁, y₁) og (x₂, y₂); stigning = y₂ − y₁ og afstand = x₂ − x₁.'],
      ['Aflæs hældningen', 'Du får m som brøk og decimaltal, hældningen i procent, vinklen og længden.']],
    featH: 'Hældning forklaret trin for trin',
    feats: [['To måder at indtaste', 'Stigning og afstand, eller to punkter med linjens ligning y = ax + b.'],
      ['Forkortet brøk', '6 over 8 vises som 3/4, så hældningen er eksakt.'],
      ['Procent, vinkel og længde', 'Hældning i procent, vinkel i grader og hypotenusen efter Pythagoras.'],
      ['Tegning, der følger med', 'En retvinklet trekant i skala med stigning og afstand markeret.']],
    sections: [
      { h: 'Formlen: stigning over afstand', p: [
        'Hældning m = stigning ÷ vandret afstand. En rampe, der stiger 3 enheder over en vandret afstand på 12, har hældningen 3/12 = 1/4 = 0,25. I procent er det 25 %, og vinklen er arctan(0,25) = 14,04°. Den skrå længde er √(3² + 12²) = 12,37.',
        'Med to punkter er stigningen y₂ − y₁ og afstanden x₂ − x₁. For (1, 2) og (5, 8): stigning 6, afstand 4, så m = 6/4 = 3/2 = 1,5, og linjen er y = 1,5x + 0,5. En negativ hældning går nedad fra venstre mod højre; en afstand på 0 er en lodret linje uden defineret hældning.'] },
      { h: 'Stigning over afstand, procent og vinkel', p: [
        'Stigning over afstand er selve hældningen; hældningsprocenten er samme tal × 100, og vinklen er dens arctangens. De er ikke proportionale: 100 % hældning er en vinkel på 45° og ikke 90°. Vil du omregne mellem forhold, procent, promille, vinkel og taghældning uden at tegne en trekant, så brug [[slope-grade-angle-calculator|beregneren for hældning, stigningsprocent og vinkel]].'] }
    ],
    faq: [['Hvad betyder stigning over afstand?', 'Det er en linjes hældning: den lodrette ændring (stigning) divideret med den vandrette ændring (afstand).'],
      ['Hvordan finder jeg hældningen ud fra to punkter?', 'Træk y-værdierne og x-værdierne fra hinanden: m = (y₂ − y₁) ÷ (x₂ − x₁).'],
      ['Hvad hvis afstanden er nul?', 'Linjen er lodret, og hældningen er ikke defineret. Beregneren fortæller det i stedet for at dividere med nul.'],
      ['Hvordan omregner jeg hældning til procent?', 'Gang hældningen med 100. En hældning på 0,08 er 8 %.'],
      ['Hvordan omregner jeg hældning til en vinkel?', 'Tag arctangens: vinkel = arctan(stigning ÷ afstand). En hældning på 1 er 45°.'],
      ['Kan hældningen være negativ?', 'Ja. En negativ hældning betyder, at linjen går nedad, når man bevæger sig mod højre.']]
  }
};

const i18n = {
  en: { riseS: 'rise', runS: 'run', mode: 'Input', modes: ['Rise and run', 'Two points'], rise: 'Rise (vertical)', run: 'Run (horizontal)', slope: 'Slope (m)', frac: 'Fraction', dec: 'Decimal', grade: 'Grade', angle: 'Angle', len: 'Line length', eq: 'Line equation', ratio: 'Ratio',
    vertical: 'The run is 0, so the line is vertical and the slope is undefined.', flat: 'Rise is 0: the line is horizontal (slope 0).', empty: 'Enter numbers for every field.', diagram: 'Right triangle with rise {r} and run {u}', work: 'Show the working', copy: 'Copy result' },
  es: { riseS: 'elevación', runS: 'recorrido', mode: 'Datos', modes: ['Elevación y recorrido', 'Dos puntos'], rise: 'Elevación (vertical)', run: 'Recorrido (horizontal)', slope: 'Pendiente (m)', frac: 'Fracción', dec: 'Decimal', grade: 'Porcentaje', angle: 'Ángulo', len: 'Longitud', eq: 'Ecuación de la recta', ratio: 'Proporción',
    vertical: 'El recorrido es 0: la recta es vertical y la pendiente no está definida.', flat: 'La elevación es 0: la recta es horizontal (pendiente 0).', empty: 'Introduce números en todos los campos.', diagram: 'Triángulo rectángulo con elevación {r} y recorrido {u}', work: 'Ver el cálculo', copy: 'Copiar resultado' },
  da: { riseS: 'stigning', runS: 'afstand', mode: 'Indtastning', modes: ['Stigning og afstand', 'To punkter'], rise: 'Stigning (lodret)', run: 'Vandret afstand', slope: 'Hældning (m)', frac: 'Brøk', dec: 'Decimaltal', grade: 'Procent', angle: 'Vinkel', len: 'Længde', eq: 'Linjens ligning', ratio: 'Forhold',
    vertical: 'Afstanden er 0: linjen er lodret, og hældningen er ikke defineret.', flat: 'Stigningen er 0: linjen er vandret (hældning 0).', empty: 'Indtast tal i alle felter.', diagram: 'Retvinklet trekant med stigning {r} og afstand {u}', work: 'Vis udregningen', copy: 'Kopiér resultat' }
};

function num(id, label, value) {
  return `<div class="calc-field"><label for="${id}">${label}</label><input class="calc-input calc-input--lg" type="text" inputmode="decimal" autocomplete="off" id="${id}" value="${value}"></div>`;
}

function tool(t) {
  return `
<div class="calc-field"><span class="calc-label" id="ro-mode-l">${t.mode}</span><div class="calc-seg" id="ro-mode" role="group" aria-labelledby="ro-mode-l"><button type="button" data-value="rr" aria-pressed="true">${t.modes[0]}</button><button type="button" data-value="pts" aria-pressed="false">${t.modes[1]}</button></div></div>
<div class="calc-grid" id="ro-f-rr">${num('ro-rise', t.rise, '3')}${num('ro-run', t.run, '12')}</div>
<div class="calc-grid" id="ro-f-pts" hidden>${num('ro-x1', 'x₁', '1')}${num('ro-y1', 'y₁', '2')}${num('ro-x2', 'x₂', '5')}${num('ro-y2', 'y₂', '8')}</div>
<p class="calc-hint" id="ro-empty" hidden>${t.empty}</p>
<div class="calc-warn" id="ro-vert" hidden>${t.vertical}</div>
<div class="calc-out" id="ro-out" aria-live="polite">
  <div class="calc-result"><span class="calc-kicker">${t.slope}</span><span class="calc-big" id="ro-m"></span><span class="calc-sub" id="ro-msub"></span></div>
  <div class="calc-tiles" id="ro-tiles"></div>
  <svg class="calc-svg" id="ro-svg" viewBox="0 0 420 240" role="img"></svg>
  <details class="calc-work"><summary>${t.work}</summary><dl id="ro-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="ro-copy">${t.copy}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
