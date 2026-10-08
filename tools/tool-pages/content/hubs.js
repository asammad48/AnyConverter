/* Localized copy for the topical hub pages + card overrides for existing tools. */
'use strict';

const CALC_ITEMS = {
  shop: ['discount-calculator', 'discount-stacking-calculator', 'percentage-calculator', 'reverse-percentage-calculator',
    'percentage-difference-calculator', 'price-increase-calculator', 'unit-price-calculator', 'margin-vs-markup-calculator',
    'gst-vat-calculator', 'tip-calculator'],
  money: ['pay-rise-calculator', 'loan-calculator', 'mortgage-calculator', 'compound-interest-calculator', 'currency-converter'],
  math: ['rise-over-run-calculator', 'slope-grade-angle-calculator', 'aspect-ratio-calculator'],
  life: ['age-calculator', 'bmi-calculator', 'calorie-calculator', 'sleep-calculator']
};
const ASTRO_ITEMS = ['numerology-calculator', 'name-numerology-calculator', 'lo-shu-grid-calculator', 'tarot-birth-card-calculator'];
const SKY_ITEMS = ['moon-sign-calculator', 'rising-sign-calculator'];
const FUN_ITEMS = ['love-calculator', 'flames-calculator', 'magic-8-ball'];
const FUN_MORE = ['coin-flip', 'dice-roller', 'spin-the-wheel', 'decision-maker'];
const DATE_ITEMS = ['birthday-countdown-calculator', 'age-calculator', 'countdown-timer', 'world-clock', 'timestamp-converter', 'stopwatch', 'sleep-calculator', 'pomodoro-timer'];

module.exports = {
  existingCards: {
    'discount-stacking-calculator': {
      en: { name: 'Discount Stacking Calculator', card: 'Stack coupons and successive % discounts and see the real total.' },
      es: { name: 'Calculadora de Descuentos Acumulados', card: 'Acumula cupones y descuentos sucesivos y mira el total real.' },
      da: { name: 'Rabatberegner med flere rabatter', card: 'Læg rabatter og kuponer oven i hinanden, og se den reelle pris.' }
    },
    'reverse-percentage-calculator': {
      en: { name: 'Reverse Percentage Calculator', card: 'Find the original value before a % increase, discount or VAT.' },
      es: { name: 'Calculadora de Porcentaje Inverso', card: 'Calcula el valor original antes de una subida, descuento o IVA.' },
      da: { name: 'Omvendt procentberegner', card: 'Find den oprindelige værdi før en stigning, rabat eller moms.' }
    }
  },

  hubs: {
    calc: {
      en: {
        name: 'Calculators', crumb: 'Calculators',
        title: 'Free Online Calculators — Percent, Price & Slope | AnyConverter',
        desc: 'Free online calculators for percentages, discounts, price increases, pay rises, margins, unit prices, slope and grade, loans and everyday maths. No sign-up.',
        h1: 'Free Online Calculators',
        intro: 'Quick, private calculators for the numbers you actually meet: shop prices and discounts, pay rises, margins, slopes and ratios, loans and everyday planning. Every calculator shows its working so you can check the result.',
        groups: [
          { h: 'Percentages, prices & shopping', items: CALC_ITEMS.shop },
          { h: 'Pay, loans & money', items: CALC_ITEMS.money },
          { h: 'Slope, ratios & geometry', items: CALC_ITEMS.math },
          { h: 'Health & daily life', items: CALC_ITEMS.life }
        ],
        sections: [
          { h: 'Which percentage calculator do I need?', p: [
            'Percent questions look alike but use different formulas. Use the [[percentage-difference-calculator|percentage difference calculator]] to compare two values with no “before” and “after”, the [[price-increase-calculator|price increase calculator]] when a price went up, and the [[reverse-percentage-calculator|reverse percentage calculator]] when you know the final amount and need the original.',
            'For several discounts in a row, the [[discount-stacking-calculator|discount stacking calculator]] shows why 20% plus 10% off is 28%, not 30%. For business pricing, the [[margin-vs-markup-calculator|margin vs markup calculator]] keeps the two percentages apart.'] },
          { h: 'Built to be checked', p: [
            'Each calculator runs in your browser, explains the formula on the page and shows a worked example, so the result is never a black box. Nothing you type is uploaded.'] }
        ]
      },
      es: {
        name: 'Calculadoras', crumb: 'Calculadoras',
        title: 'Calculadoras Online Gratis — Porcentajes y Precios | AnyConverter',
        desc: 'Calculadoras online gratis de porcentajes, descuentos, subidas de precio, aumento salarial, márgenes, precio unitario, pendiente, préstamos y más. Sin registro.',
        h1: 'Calculadoras Online Gratis',
        intro: 'Calculadoras rápidas y privadas para los números del día a día: precios y descuentos, aumentos de sueldo, márgenes, pendientes, préstamos y planificación. Todas muestran el cálculo para que puedas comprobarlo.',
        groups: [
          { h: 'Porcentajes, precios y compras', items: CALC_ITEMS.shop },
          { h: 'Sueldo, préstamos y dinero', items: CALC_ITEMS.money },
          { h: 'Pendiente, proporciones y geometría', items: CALC_ITEMS.math },
          { h: 'Salud y vida diaria', items: CALC_ITEMS.life }
        ],
        sections: [
          { h: '¿Qué calculadora de porcentajes necesito?', p: [
            'Las preguntas con porcentajes se parecen, pero usan fórmulas distintas. Usa la [[percentage-difference-calculator|calculadora de diferencia porcentual]] para comparar dos valores sin un “antes” y un “después”, la [[price-increase-calculator|calculadora de aumento de precio]] cuando algo ha subido y la [[reverse-percentage-calculator|calculadora de porcentaje inverso]] cuando conoces el importe final y buscas el original.',
            'Para varios descuentos seguidos, la [[discount-stacking-calculator|calculadora de descuentos acumulados]] muestra por qué un 20 % más un 10 % es un 28 % y no un 30 %. Para fijar precios, la [[margin-vs-markup-calculator|calculadora de margen y recargo]] separa ambos porcentajes.'] },
          { h: 'Resultados que puedes comprobar', p: [
            'Cada calculadora funciona en tu navegador, explica la fórmula y muestra un ejemplo resuelto, así que el resultado nunca es una caja negra. No se sube nada de lo que escribes.'] }
        ]
      },
      da: {
        name: 'Beregnere', crumb: 'Beregnere',
        title: 'Gratis Online Beregnere — Procent, Pris og Hældning | AnyConverter',
        desc: 'Gratis online beregnere til procent, rabatter, prisstigninger, lønstigning, avance, enhedspris, hældning, lån og hverdagens regnestykker. Ingen tilmelding.',
        h1: 'Gratis Online Beregnere',
        intro: 'Hurtige og private beregnere til de tal, du møder i hverdagen: priser og rabatter, lønstigninger, avance, hældninger, lån og planlægning. Alle viser udregningen, så du kan tjekke resultatet.',
        groups: [
          { h: 'Procent, priser og indkøb', items: CALC_ITEMS.shop },
          { h: 'Løn, lån og penge', items: CALC_ITEMS.money },
          { h: 'Hældning, forhold og geometri', items: CALC_ITEMS.math },
          { h: 'Sundhed og hverdag', items: CALC_ITEMS.life }
        ],
        sections: [
          { h: 'Hvilken procentberegner skal jeg bruge?', p: [
            'Procentspørgsmål ligner hinanden, men bruger forskellige formler. Brug [[percentage-difference-calculator|procentforskelberegneren]] til at sammenligne to tal uden et “før” og “efter”, [[price-increase-calculator|prisforhøjelsesberegneren]] når en pris er steget, og [[reverse-percentage-calculator|den omvendte procentberegner]] når du kender slutbeløbet og vil finde det oprindelige.',
            'Ved flere rabatter i træk viser [[discount-stacking-calculator|rabatberegneren med flere rabatter]], hvorfor 20 % plus 10 % giver 28 % og ikke 30 %. Til prissætning holder [[margin-vs-markup-calculator|margin- og avanceberegneren]] de to procenter adskilt.'] },
          { h: 'Lavet til at blive tjekket', p: [
            'Alle beregnere kører i din browser, forklarer formlen på siden og viser et regneeksempel, så resultatet aldrig er en sort boks. Intet af det, du skriver, uploades.'] }
        ]
      }
    },

    astro: {
      en: {
        name: 'Numerology & Astrology', crumb: 'Numerology & Astrology',
        title: 'Numerology & Astrology Calculators | AnyConverter',
        desc: 'Free numerology and astrology calculators: Life Path, name numbers, Lo Shu Grid, Tarot birth cards, plus Moon and rising signs from a real ephemeris.',
        h1: 'Numerology & Astrology Calculators',
        intro: 'Calculate your numerology numbers, Lo Shu Grid and Tarot birth cards from your birth date and name, and find your Moon and rising signs from your exact birth data. Every tool explains the method it uses.',
        note: 'Numerology and astrology are symbolic traditions, not sciences. Use the results for reflection and fun.',
        groups: [
          { h: 'Numerology & Tarot', p: 'Number-based systems that only need your birth date or your name.', items: ASTRO_ITEMS },
          { h: 'Moon & rising sign', p: 'These need your birth time and place, because they depend on where the Moon and the horizon actually were.', items: SKY_ITEMS }
        ],
        sections: [
          { h: 'Transparent methods, no guesswork', p: [
            'Numerology results differ between websites because they use different letter tables and reduction rules. Our calculators name the system they use (Pythagorean or Chaldean, Mary K. Greer for Tarot birth cards), show each step, and let you switch options where traditions disagree.',
            'The [[moon-sign-calculator|Moon sign]] and [[rising-sign-calculator|rising sign]] calculators do not use fixed date tables. They convert your local time to Universal Time with the historical time-zone rules for your birthplace and compute real positions with the Astronomy Engine ephemeris.'] },
          { h: 'Your data stays private', p: [
            'Names and birth details are processed in your browser only. They are never uploaded or sent to analytics.'] }
        ]
      },
      es: {
        name: 'Numerología y Astrología', crumb: 'Numerología y Astrología',
        title: 'Calculadoras de Numerología y Astrología | AnyConverter',
        desc: 'Calculadoras de numerología y astrología gratis: camino de vida, números del nombre, cuadrícula Lo Shu, tarot, signo lunar y ascendente con efemérides.',
        h1: 'Calculadoras de Numerología y Astrología',
        intro: 'Calcula tus números de numerología, tu cuadrícula Lo Shu y tus cartas de nacimiento del tarot con tu fecha y tu nombre, y descubre tu signo lunar y tu ascendente con tus datos exactos de nacimiento. Cada herramienta explica su método.',
        note: 'La numerología y la astrología son tradiciones simbólicas, no ciencias. Usa los resultados para reflexionar y divertirte.',
        groups: [
          { h: 'Numerología y tarot', p: 'Sistemas basados en números que solo necesitan tu fecha de nacimiento o tu nombre.', items: ASTRO_ITEMS },
          { h: 'Signo lunar y ascendente', p: 'Necesitan tu hora y lugar de nacimiento, porque dependen de dónde estaban realmente la Luna y el horizonte.', items: SKY_ITEMS }
        ],
        sections: [
          { h: 'Métodos transparentes, sin adivinanzas', p: [
            'Los resultados de numerología cambian de una web a otra porque usan tablas de letras y reglas de reducción distintas. Nuestras calculadoras indican el sistema (pitagórico o caldeo, Mary K. Greer para las cartas del tarot), muestran cada paso y te dejan cambiar las opciones donde las tradiciones no coinciden.',
            'Las calculadoras de [[moon-sign-calculator|signo lunar]] y de [[rising-sign-calculator|ascendente]] no usan tablas fijas de fechas. Convierten tu hora local a tiempo universal con las reglas horarias históricas de tu lugar de nacimiento y calculan posiciones reales con las efemérides Astronomy Engine.'] },
          { h: 'Tus datos son privados', p: [
            'Los nombres y datos de nacimiento se procesan solo en tu navegador. Nunca se suben ni se envían a analítica.'] }
        ]
      },
      da: {
        name: 'Numerologi & Astrologi', crumb: 'Numerologi & Astrologi',
        title: 'Numerologi- og Astrologiberegnere | AnyConverter',
        desc: 'Gratis numerologi- og astrologiberegnere: livstal, navnetal, Lo Shu-gitter, tarot-fødselskort samt månetegn og ascendant med rigtige efemerider.',
        h1: 'Numerologi- og astrologiberegnere',
        intro: 'Beregn dine numerologiske tal, dit Lo Shu-gitter og dine tarot-fødselskort ud fra fødselsdato og navn, og find dit månetegn og din ascendant ud fra dine præcise fødselsdata. Hvert værktøj forklarer sin metode.',
        note: 'Numerologi og astrologi er symbolske traditioner, ikke videnskab. Brug resultaterne til eftertanke og underholdning.',
        groups: [
          { h: 'Numerologi og tarot', p: 'Talbaserede systemer, der kun kræver din fødselsdato eller dit navn.', items: ASTRO_ITEMS },
          { h: 'Månetegn og ascendant', p: 'De kræver fødselstidspunkt og fødested, fordi de afhænger af, hvor Månen og horisonten faktisk var.', items: SKY_ITEMS }
        ],
        sections: [
          { h: 'Gennemsigtige metoder uden gætværk', p: [
            'Numerologiske resultater varierer mellem hjemmesider, fordi de bruger forskellige bogstavtabeller og reduktionsregler. Vores beregnere oplyser systemet (pythagoræisk eller kaldæisk, Mary K. Greer for tarot-fødselskort), viser hvert trin og lader dig skifte indstilling, hvor traditionerne er uenige.',
            '[[moon-sign-calculator|Månetegnsberegneren]] og [[rising-sign-calculator|ascendantberegneren]] bruger ikke faste datotabeller. De omregner din lokale tid til universaltid med de historiske tidszoneregler for dit fødested og beregner rigtige positioner med Astronomy Engine-efemeriden.'] },
          { h: 'Dine data forbliver private', p: [
            'Navne og fødselsdata behandles kun i din browser. De uploades aldrig og sendes ikke til statistik.'] }
        ]
      }
    },

    fun: {
      en: {
        name: 'Fun & Relationships', crumb: 'Fun & Relationships',
        title: 'Fun & Relationship Games Online — Love, FLAMES | AnyConverter',
        desc: 'Fun relationship games and party tools: love calculator by names, the classic FLAMES game and a Magic 8 Ball, plus coin flips and dice. Free and private.',
        h1: 'Fun & Relationship Games',
        intro: 'Light-hearted name games and party tools for friends, couples and classrooms. Type two names for a love score or a FLAMES result, or ask the Magic 8 Ball a yes-or-no question.',
        note: 'These are games for entertainment. They do not measure real compatibility or predict anything.',
        groups: [
          { h: 'Name & relationship games', items: FUN_ITEMS },
          { h: 'More quick games', items: FUN_MORE }
        ],
        sections: [
          { h: 'How the name games work', p: [
            'The [[love-calculator|love calculator]] counts the letters of L, O, V, E and S in both names and adds neighbouring digits until two remain, so the same names always give the same score. [[flames-calculator|FLAMES]] cancels the letters two names share and counts round the word FLAMES with the letters that are left. Both pages show every step.',
            'Names are processed in your browser and are never uploaded or sent to analytics.'] }
        ]
      },
      es: {
        name: 'Diversión y Compatibilidad', crumb: 'Diversión y Compatibilidad',
        title: 'Juegos de Amor y Diversión Online — FLAMES | AnyConverter',
        desc: 'Juegos de compatibilidad y diversión: calculadora del amor por nombres, el clásico FLAMES y la bola 8 mágica, además de monedas y dados. Gratis y privado.',
        h1: 'Diversión y Compatibilidad',
        intro: 'Juegos de nombres y herramientas para pasar un buen rato con amigos, en pareja o en clase. Escribe dos nombres para ver vuestro porcentaje de amor o el resultado de FLAMES, o haz una pregunta de sí o no a la bola 8 mágica.',
        note: 'Son juegos de entretenimiento. No miden la compatibilidad real ni predicen nada.',
        groups: [
          { h: 'Juegos de nombres y pareja', items: FUN_ITEMS },
          { h: 'Más juegos rápidos', items: FUN_MORE }
        ],
        sections: [
          { h: 'Cómo funcionan los juegos de nombres', p: [
            'La [[love-calculator|calculadora del amor]] cuenta las letras L, O, V, E y S de ambos nombres y suma cifras vecinas hasta que quedan dos, así que los mismos nombres siempre dan el mismo resultado. [[flames-calculator|FLAMES]] tacha las letras que comparten los dos nombres y cuenta sobre la palabra FLAMES con las que quedan. Ambas páginas muestran cada paso.',
            'Los nombres se procesan en tu navegador y nunca se suben ni se envían a analítica.'] }
        ]
      },
      da: {
        name: 'Sjov & Relationer', crumb: 'Sjov & Relationer',
        title: 'Sjove Kærlighedslege Online — FLAMES og mere | AnyConverter',
        desc: 'Sjove lege om kærlighed og venskab: kærlighedsberegner med navne, den klassiske FLAMES-leg og Magic 8 Ball samt plat eller krone og terninger. Gratis og privat.',
        h1: 'Sjov & Relationer',
        intro: 'Hyggelige navnelege og festværktøjer til venner, kærester og klassen. Skriv to navne og få en kærlighedsprocent eller et FLAMES-resultat, eller stil Magic 8 Ball et ja/nej-spørgsmål.',
        note: 'Det er lege til underholdning. De måler ikke rigtig kompatibilitet og forudsiger intet.',
        groups: [
          { h: 'Navne- og kærlighedslege', items: FUN_ITEMS },
          { h: 'Flere hurtige lege', items: FUN_MORE }
        ],
        sections: [
          { h: 'Sådan virker navnelegene', p: [
            '[[love-calculator|Kærlighedsberegneren]] tæller bogstaverne L, O, V, E og S i begge navne og lægger nabotal sammen, indtil der er to cifre tilbage, så de samme navne altid giver samme procent. [[flames-calculator|FLAMES]] streger de fælles bogstaver ud og tæller rundt i ordet FLAMES med de bogstaver, der er tilbage. Begge sider viser hvert trin.',
            'Navnene behandles i din browser og uploades aldrig eller sendes til statistik.'] }
        ]
      }
    },

    date: {
      en: {
        name: 'Date & Time', crumb: 'Date & Time',
        title: 'Date & Time Tools — Countdowns, Age & Clocks | AnyConverter',
        desc: 'Free date and time tools: birthday countdown, age calculator, countdown timer, world clock, Unix timestamp converter, stopwatch and sleep calculator.',
        h1: 'Date & Time Tools',
        intro: 'Count down to a birthday, work out an exact age, convert timestamps and time zones, or time a task. All date and time tools run in your browser using your device clock and time zone.',
        groups: [{ h: 'Dates, countdowns & clocks', items: DATE_ITEMS }],
        sections: [
          { h: 'Calendar maths without surprises', p: [
            'Dates are trickier than they look: months have different lengths, 29 February only exists in leap years and clocks change for daylight saving time. The [[birthday-countdown-calculator|birthday countdown]] and [[age-calculator|age calculator]] count in calendar days in your own time zone and handle leap-day birthdays explicitly.'] }
        ]
      },
      es: {
        name: 'Fecha y Hora', crumb: 'Fecha y Hora',
        title: 'Herramientas de Fecha y Hora — Cuentas Atrás | AnyConverter',
        desc: 'Herramientas de fecha y hora gratis: cuenta regresiva de cumpleaños, calculadora de edad, temporizador, conversor de timestamp Unix, cronómetro y más.',
        h1: 'Herramientas de Fecha y Hora',
        intro: 'Cuenta los días que faltan para un cumpleaños, calcula una edad exacta, convierte marcas de tiempo o cronometra una tarea. Todas funcionan en tu navegador con el reloj y la zona horaria de tu dispositivo.',
        groups: [{ h: 'Fechas, cuentas atrás y relojes', items: DATE_ITEMS }],
        sections: [
          { h: 'Cálculos de calendario sin sorpresas', p: [
            'Las fechas son más complicadas de lo que parecen: los meses tienen distinta duración, el 29 de febrero solo existe en años bisiestos y los relojes cambian con el horario de verano. La [[birthday-countdown-calculator|cuenta regresiva de cumpleaños]] y la [[age-calculator|calculadora de edad]] cuentan días naturales en tu zona horaria y tratan de forma explícita los cumpleaños del 29 de febrero.'] }
        ]
      },
      da: {
        name: 'Dato & Tid', crumb: 'Dato & Tid',
        title: 'Dato- og Tidsværktøjer — Nedtælling og Alder | AnyConverter',
        desc: 'Gratis dato- og tidsværktøjer: fødselsdagsnedtælling, aldersberegner, nedtæller, Unix timestamp-konverter, stopur og søvnberegner. Kører i browseren uden login.',
        h1: 'Dato- og tidsværktøjer',
        intro: 'Tæl ned til en fødselsdag, find en præcis alder, omregn tidsstempler eller tag tid på en opgave. Alle værktøjer kører i din browser med enhedens ur og tidszone.',
        groups: [{ h: 'Datoer, nedtællinger og ure', items: DATE_ITEMS }],
        sections: [
          { h: 'Kalenderregning uden overraskelser', p: [
            'Datoer er sværere, end de ser ud: månederne er forskellige lange, 29. februar findes kun i skudår, og uret skifter ved sommertid. [[birthday-countdown-calculator|Fødselsdagsnedtællingen]] og [[age-calculator|aldersberegneren]] tæller kalenderdage i din egen tidszone og håndterer fødselsdage den 29. februar eksplicit.'] }
        ]
      }
    }
  }
};
