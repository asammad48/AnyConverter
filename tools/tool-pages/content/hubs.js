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

/* Extra guidance + FAQ so the smaller hubs are useful pages, not just lists of links. */
const H = module.exports.hubs;
const add = (key, lang, section, faq) => { H[key][lang].sections.splice(1, 0, section); H[key][lang].faq = faq; };

add('astro', 'en', { h: 'Where to start', p: [
  'If you only know your birth date, start with the [[numerology-calculator|numerology calculator]]: it gives your Life Path, Birthday and Personal Year numbers in one go, and you can add your name later. Curious about the letters in your name on their own? The [[name-numerology-calculator|name numerology calculator]] shows every letter’s value so you can compare a nickname or a married name.',
  'For something more visual, the [[lo-shu-grid-calculator|Lo Shu Grid]] lays your birth date out on a 3×3 square, and the [[tarot-birth-card-calculator|Tarot birth card calculator]] turns the same date into one, two or three Major Arcana cards. If you know your birth time, finish with your [[moon-sign-calculator|Moon sign]] and [[rising-sign-calculator|rising sign]] to complete your Big Three.'] },
  [['Do I need my birth time?', 'Only for the Moon sign and rising sign. All numerology tools and the Tarot birth card work from the date (and optionally your name).'],
   ['Why do different websites give different numbers?', 'They use different letter tables, reduction rules or zodiac systems. Each of our pages says exactly which method it uses and shows the working, so you can compare.'],
   ['Is my information stored?', 'No. Everything is calculated in your browser, and names and birth details are never uploaded or sent to analytics.']]);
add('astro', 'es', { h: 'Por dónde empezar', p: [
  'Si solo sabes tu fecha de nacimiento, empieza por la [[numerology-calculator|calculadora de numerología]]: te da el camino de vida, el número de cumpleaños y el año personal de una vez, y puedes añadir tu nombre después. ¿Te interesan solo las letras de tu nombre? La [[name-numerology-calculator|calculadora de numerología del nombre]] muestra el valor de cada letra para que compares un apodo o el apellido de casada.',
  'Si prefieres algo más visual, la [[lo-shu-grid-calculator|cuadrícula Lo Shu]] coloca tu fecha en un cuadrado de 3×3, y la [[tarot-birth-card-calculator|calculadora de cartas de nacimiento del tarot]] convierte la misma fecha en una, dos o tres cartas de los Arcanos Mayores. Si sabes tu hora de nacimiento, termina con tu [[moon-sign-calculator|signo lunar]] y tu [[rising-sign-calculator|ascendente]] para completar tus tres grandes.'] },
  [['¿Necesito mi hora de nacimiento?', 'Solo para el signo lunar y el ascendente. Las herramientas de numerología y las cartas del tarot funcionan con la fecha (y, si quieres, con tu nombre).'],
   ['¿Por qué cada web da números distintos?', 'Usan tablas de letras, reglas de reducción o zodiacos diferentes. Cada una de nuestras páginas indica el método exacto y muestra el cálculo para que puedas comparar.'],
   ['¿Se guardan mis datos?', 'No. Todo se calcula en tu navegador y los nombres y datos de nacimiento nunca se suben ni se envían a analítica.']]);
add('astro', 'da', { h: 'Hvor skal du starte?', p: [
  'Kender du kun din fødselsdato, så start med [[numerology-calculator|numerologi-beregneren]]: den giver livstal, fødselsdagstal og personligt år på én gang, og du kan tilføje dit navn bagefter. Er du nysgerrig på bogstaverne i dit navn? [[name-numerology-calculator|Navnenumerologi-beregneren]] viser værdien af hvert bogstav, så du kan sammenligne med et kælenavn eller et gift navn.',
  'Vil du have noget mere visuelt, lægger [[lo-shu-grid-calculator|Lo Shu-gitteret]] din fødselsdato ud i et 3×3-kvadrat, og [[tarot-birth-card-calculator|tarot-fødselskortberegneren]] gør samme dato til ét, to eller tre kort fra de store arkana. Kender du dit fødselstidspunkt, så slut af med dit [[moon-sign-calculator|månetegn]] og din [[rising-sign-calculator|ascendant]] for at få dine tre store.'] },
  [['Skal jeg kende mit fødselstidspunkt?', 'Kun til månetegn og ascendant. Numerologiværktøjerne og tarot-fødselskortet bruger kun datoen (og eventuelt dit navn).'],
   ['Hvorfor giver forskellige sider forskellige tal?', 'De bruger forskellige bogstavtabeller, reduktionsregler eller dyrekredse. Hver af vores sider oplyser metoden og viser udregningen, så du kan sammenligne.'],
   ['Bliver mine oplysninger gemt?', 'Nej. Alt beregnes i din browser, og navne og fødselsdata uploades aldrig eller sendes til statistik.']]);

add('fun', 'en', { h: 'Made for sleepovers, classrooms and first dates', p: [
  'These games work best with other people around. Try FLAMES and the love calculator with the names of a few friends and see who gets “Marriage” or 99%, or pass a phone around and let everyone ask the Magic 8 Ball one question. Because the name games use simple letter-counting rules, they also make a fun, low-stakes way to practise counting and patterns with kids.',
  'Each game shows how it reached its answer, so nobody can claim the result was rigged – and the share links only contain initials, never full names.'] },
  [['Are the results real predictions?', 'No. The love calculator and FLAMES count letters, and the Magic 8 Ball picks an answer at random. They are games for fun.'],
   ['Will the same names always give the same result?', 'Yes. The love calculator and FLAMES are rule-based, so the same names give the same answer every time. The Magic 8 Ball is random on purpose.'],
   ['Is it safe to type real names?', 'Yes. Names are processed in your browser only and are never uploaded or stored.']]);
add('fun', 'es', { h: 'Perfectos para fiestas, clases y primeras citas', p: [
  'Estos juegos son más divertidos en compañía. Prueba FLAMES y la calculadora del amor con los nombres de tus amigos para ver a quién le sale “Matrimonio” o un 99 %, o pasad el móvil y que cada uno le haga una pregunta a la bola 8 mágica. Como los juegos de nombres usan reglas sencillas de contar letras, también son una forma divertida de practicar conteo y patrones con niños.',
  'Cada juego muestra cómo llegó a su respuesta, así que nadie puede decir que está amañado, y los enlaces para compartir solo llevan iniciales, nunca nombres completos.'] },
  [['¿Los resultados son predicciones reales?', 'No. La calculadora del amor y FLAMES cuentan letras, y la bola 8 mágica elige una respuesta al azar. Son juegos para divertirse.'],
   ['¿Los mismos nombres dan siempre el mismo resultado?', 'Sí. La calculadora del amor y FLAMES siguen reglas fijas, así que los mismos nombres dan siempre lo mismo. La bola 8 mágica es aleatoria a propósito.'],
   ['¿Es seguro escribir nombres reales?', 'Sí. Los nombres se procesan solo en tu navegador y nunca se suben ni se guardan.']]);
add('fun', 'da', { h: 'Perfekt til fester, klasseværelset og første dates', p: [
  'Legene er sjovest sammen med andre. Prøv FLAMES og kærlighedsberegneren med jeres venners navne og se, hvem der får “Ægteskab” eller 99 %, eller send telefonen rundt, så alle kan stille Magic 8 Ball ét spørgsmål. Fordi navnelegene bruger enkle regler for at tælle bogstaver, er de også en sjov måde at øve tælling og mønstre på med børn.',
  'Hver leg viser, hvordan den nåede frem til svaret, så ingen kan påstå, at det er snyd – og delingslinks indeholder kun forbogstaver, aldrig fulde navne.'] },
  [['Er resultaterne rigtige forudsigelser?', 'Nej. Kærlighedsberegneren og FLAMES tæller bogstaver, og Magic 8 Ball vælger et tilfældigt svar. Det er lege for sjov.'],
   ['Giver de samme navne altid det samme resultat?', 'Ja. Kærlighedsberegneren og FLAMES følger faste regler, så de samme navne giver altid samme svar. Magic 8 Ball er tilfældig med vilje.'],
   ['Er det sikkert at skrive rigtige navne?', 'Ja. Navnene behandles kun i din browser og bliver aldrig uploadet eller gemt.']]);

add('date', 'en', { h: 'Which date tool do you need?', p: [
  'Counting down to a special day? The [[birthday-countdown-calculator|birthday countdown]] shows the days, hours and minutes left, which weekday it falls on and how old you will be – and can add a yearly reminder to your calendar. For a precise age in years, months and days, use the [[age-calculator|age calculator]]; to time a cake in the oven or a presentation, the [[countdown-timer|countdown timer]] and [[stopwatch|stopwatch]] are quicker.',
  'Developers and anyone reading log files will find the [[timestamp-converter|Unix timestamp converter]] handy, and the [[sleep-calculator|sleep calculator]] helps plan a bedtime around 90-minute sleep cycles.'] },
  [['Do these tools use my time zone?', 'Yes. They use your device’s clock and time zone, so “today” and “midnight” mean the same thing as on your phone or computer.'],
   ['How are 29 February birthdays handled?', 'The birthday countdown lets you choose whether non-leap years celebrate on 28 February or 1 March, and the calendar reminder follows the same rule.'],
   ['Is anything saved?', 'Only if you choose to save a birthday, and then only in your own browser. Nothing is sent to a server.']]);
add('date', 'es', { h: '¿Qué herramienta de fechas necesitas?', p: [
  '¿Cuentas los días para una fecha especial? La [[birthday-countdown-calculator|cuenta regresiva para tu cumpleaños]] muestra los días, horas y minutos que faltan, qué día de la semana cae y cuántos años cumples, y puede añadir un recordatorio anual a tu calendario. Para una edad exacta en años, meses y días, usa la [[age-calculator|calculadora de edad]]; para cronometrar un bizcocho o una presentación, el [[countdown-timer|temporizador]] y el [[stopwatch|cronómetro]] son más rápidos.',
  'Si trabajas con registros o programación, el [[timestamp-converter|conversor de timestamp Unix]] te será útil, y la [[sleep-calculator|calculadora de sueño]] te ayuda a planificar la hora de acostarte según ciclos de 90 minutos.'] },
  [['¿Usan mi zona horaria?', 'Sí. Usan el reloj y la zona horaria de tu dispositivo, así que “hoy” y “medianoche” significan lo mismo que en tu móvil u ordenador.'],
   ['¿Qué pasa con los cumpleaños del 29 de febrero?', 'La cuenta regresiva te deja elegir si en los años no bisiestos se celebra el 28 de febrero o el 1 de marzo, y el recordatorio del calendario sigue la misma regla.'],
   ['¿Se guarda algo?', 'Solo si decides guardar un cumpleaños, y solo en tu propio navegador. No se envía nada a ningún servidor.']]);
add('date', 'da', { h: 'Hvilket datoværktøj skal du bruge?', p: [
  'Tæller du ned til en særlig dag? [[birthday-countdown-calculator|Fødselsdagsnedtællingen]] viser dage, timer og minutter, der er tilbage, hvilken ugedag dagen falder på, og hvor gammel du bliver – og kan lægge en årlig påmindelse i din kalender. Til en præcis alder i år, måneder og dage bruger du [[age-calculator|aldersberegneren]]; skal du tage tid på en kage i ovnen eller et oplæg, er [[countdown-timer|nedtælleren]] og [[stopwatch|stopuret]] hurtigere.',
  'Arbejder du med logfiler eller programmering, er [[timestamp-converter|Unix timestamp-konverteren]] praktisk, og [[sleep-calculator|søvnberegneren]] hjælper dig med at planlægge sengetid efter søvncyklusser på 90 minutter.'] },
  [['Bruger værktøjerne min tidszone?', 'Ja. De bruger din enheds ur og tidszone, så “i dag” og “midnat” betyder det samme som på din telefon eller computer.'],
   ['Hvordan håndteres fødselsdage den 29. februar?', 'Fødselsdagsnedtællingen lader dig vælge, om ikke-skudår fejres den 28. februar eller 1. marts, og kalenderpåmindelsen følger samme regel.'],
   ['Bliver noget gemt?', 'Kun hvis du selv gemmer en fødselsdag, og kun i din egen browser. Intet sendes til en server.']]);
