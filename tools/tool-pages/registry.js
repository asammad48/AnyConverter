/*
 * Registry for the generated tool pages and topical hubs.
 * One entry per tool: slugs per language, hub, scripts and related tools.
 * Page copy lives in ./content/<id>.js (localized, written per page).
 */
'use strict';

const SITE = 'https://anyconverter.io';
const LANGS = ['en', 'es', 'da'];

/* Topical hubs. `slugs` are the folder names under / , /es/ and /da/. */
const HUBS = {
  calc: { slugs: { en: 'calculators', es: 'calculadoras', da: 'beregnere' } },
  astro: { slugs: { en: 'numerology-astrology', es: 'numerologia-astrologia', da: 'numerologi-astrologi' } },
  fun: { slugs: { en: 'fun-relationships', es: 'diversion-compatibilidad', da: 'sjov-relationer' } },
  date: { slugs: { en: 'date-time', es: 'fecha-hora', da: 'dato-tid' } }
};

/*
 * Generated tools. `existing: true` marks pages that already existed before
 * this system: they keep their indexed URLs and are not regenerated, but they
 * take part in hubs, related links, the slug map and the sitemap.
 */
const TOOLS = [
  /* ---- Calculators ---- */
  { id: 'discount-stacking-calculator', hub: 'calc', existing: true,
    slugs: { en: 'discount-stacking-calculator', es: 'discount-stacking-calculator', da: 'discount-stacking-calculator' },
    related: ['reverse-percentage-calculator', 'price-increase-calculator', 'unit-price-calculator', 'margin-vs-markup-calculator'] },
  { id: 'reverse-percentage-calculator', hub: 'calc', existing: true,
    slugs: { en: 'reverse-percentage-calculator', es: 'reverse-percentage-calculator', da: 'reverse-percentage-calculator' },
    related: ['percentage-difference-calculator', 'price-increase-calculator', 'discount-stacking-calculator'] },
  { id: 'rise-over-run-calculator', hub: 'calc', script: 'rise-over-run.js', appCat: 'EducationalApplication',
    slugs: { en: 'rise-over-run-calculator', es: 'calculadora-pendiente-elevacion-recorrido', da: 'haeldningsberegner-stigning-afstand' },
    related: ['slope-grade-angle-calculator', 'percentage-difference-calculator'] },
  { id: 'pay-rise-calculator', hub: 'calc', script: 'pay-rise.js', appCat: 'FinanceApplication',
    slugs: { en: 'pay-rise-calculator', es: 'calculadora-aumento-salarial', da: 'loenstigningsberegner' },
    related: ['price-increase-calculator', 'reverse-percentage-calculator', 'percentage-difference-calculator'] },
  { id: 'price-increase-calculator', hub: 'calc', script: 'price-increase.js', appCat: 'FinanceApplication',
    slugs: { en: 'price-increase-calculator', es: 'calculadora-aumento-precio', da: 'prisforhoejelsesberegner' },
    related: ['pay-rise-calculator', 'reverse-percentage-calculator', 'unit-price-calculator', 'margin-vs-markup-calculator'] },
  { id: 'margin-vs-markup-calculator', hub: 'calc', script: 'margin-markup.js', appCat: 'FinanceApplication',
    slugs: { en: 'margin-vs-markup-calculator', es: 'calculadora-margen-recargo', da: 'margin-avanceberegner' },
    related: ['unit-price-calculator', 'price-increase-calculator', 'percentage-difference-calculator'] },
  { id: 'unit-price-calculator', hub: 'calc', script: 'unit-price.js', appCat: 'FinanceApplication',
    slugs: { en: 'unit-price-calculator', es: 'calculadora-precio-unitario', da: 'enhedsprisberegner' },
    related: ['discount-stacking-calculator', 'margin-vs-markup-calculator', 'price-increase-calculator'] },
  { id: 'percentage-difference-calculator', hub: 'calc', script: 'percentage-difference.js', appCat: 'EducationalApplication',
    slugs: { en: 'percentage-difference-calculator', es: 'calculadora-diferencia-porcentual', da: 'procentforskelberegner' },
    related: ['reverse-percentage-calculator', 'price-increase-calculator', 'slope-grade-angle-calculator'] },
  { id: 'slope-grade-angle-calculator', hub: 'calc', script: 'slope-grade-angle.js', appCat: 'EducationalApplication',
    slugs: { en: 'slope-grade-angle-calculator', es: 'calculadora-pendiente-porcentaje-angulo', da: 'haeldning-stigningsprocent-vinkel-beregner' },
    related: ['rise-over-run-calculator', 'percentage-difference-calculator'] },

  /* ---- Numerology & Astrology ---- */
  { id: 'name-numerology-calculator', hub: 'astro', script: 'name-numerology.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'name-numerology-calculator', es: 'calculadora-numerologia-nombre', da: 'navnenumerologi-beregner' },
    related: ['numerology-calculator', 'lo-shu-grid-calculator', 'love-calculator', 'tarot-birth-card-calculator'] },
  { id: 'numerology-calculator', hub: 'astro', script: 'numerology.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'numerology-calculator', es: 'calculadora-numerologia', da: 'numerologi-beregner' },
    related: ['name-numerology-calculator', 'lo-shu-grid-calculator', 'tarot-birth-card-calculator', 'moon-sign-calculator'] },
  { id: 'moon-sign-calculator', hub: 'astro', script: 'moon-sign.js', deps: ['../vendor/astronomy.browser.min.js', 'astro-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'moon-sign-calculator', es: 'calculadora-signo-lunar', da: 'maanetegnsberegner' },
    related: ['rising-sign-calculator', 'numerology-calculator', 'tarot-birth-card-calculator', 'birthday-countdown-calculator'] },
  { id: 'rising-sign-calculator', hub: 'astro', script: 'rising-sign.js', deps: ['../vendor/astronomy.browser.min.js', 'astro-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'rising-sign-calculator', es: 'calculadora-ascendente', da: 'ascendantberegner' },
    related: ['moon-sign-calculator', 'numerology-calculator', 'lo-shu-grid-calculator'] },
  { id: 'lo-shu-grid-calculator', hub: 'astro', script: 'lo-shu-grid.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'lo-shu-grid-calculator', es: 'calculadora-cuadricula-lo-shu', da: 'lo-shu-gitterberegner' },
    related: ['numerology-calculator', 'name-numerology-calculator', 'tarot-birth-card-calculator'] },
  { id: 'tarot-birth-card-calculator', hub: 'astro', script: 'tarot-birth-card.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'tarot-birth-card-calculator', es: 'calculadora-cartas-nacimiento-tarot', da: 'tarot-foedselskortberegner' },
    related: ['numerology-calculator', 'name-numerology-calculator', 'lo-shu-grid-calculator', 'moon-sign-calculator'] },

  /* ---- Fun & Relationships ---- */
  { id: 'love-calculator', hub: 'fun', script: 'love-calculator.js', deps: ['numerology-core.js'], appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'love-calculator', es: 'calculadora-del-amor', da: 'kaerlighedsberegner' },
    related: ['flames-calculator', 'name-numerology-calculator', 'magic-8-ball'] },
  { id: 'flames-calculator', hub: 'fun', script: 'flames-calculator.js', deps: ['numerology-core.js'], appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'flames-calculator', es: 'calculadora-flames', da: 'flames-beregner' },
    related: ['love-calculator', 'magic-8-ball', 'name-numerology-calculator'] },
  { id: 'magic-8-ball', hub: 'fun', script: 'magic-8-ball.js', appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'magic-8-ball', es: 'bola-8-magica', da: 'magic-8-ball' },
    related: ['love-calculator', 'flames-calculator'] },

  /* ---- Date & Time ---- */
  { id: 'birthday-countdown-calculator', hub: 'date', script: 'birthday-countdown.js', deps: ['numerology-core.js'], appCat: 'UtilitiesApplication',
    slugs: { en: 'birthday-countdown-calculator', es: 'cuenta-regresiva-cumpleanos', da: 'foedselsdagsnedtaelling' },
    related: ['moon-sign-calculator', 'tarot-birth-card-calculator', '~age-calculator', '~countdown-timer'] }
];

/*
 * Existing (hand-built) tools referenced from hubs and related blocks.
 * They live at the same English slug under /es/ and /da/ unless `enOnly`.
 * Names/blurbs are read from the localized homepages at build time.
 */
const LEGACY = {
  'age-calculator': {}, 'countdown-timer': {}, 'stopwatch': {}, 'timestamp-converter': {},
  'sleep-calculator': {}, 'pomodoro-timer': {}, 'world-clock': { enOnly: true },
  'discount-calculator': {}, 'percentage-calculator': {}, 'gst-vat-calculator': {}, 'tip-calculator': {},
  'loan-calculator': {}, 'mortgage-calculator': {}, 'compound-interest-calculator': {}, 'currency-converter': {},
  'bmi-calculator': {}, 'calorie-calculator': {}, 'aspect-ratio-calculator': {},
  'coin-flip': {}, 'dice-roller': {}, 'spin-the-wheel': {}, 'decision-maker': {}
};

module.exports = { SITE, LANGS, HUBS, TOOLS, LEGACY };
