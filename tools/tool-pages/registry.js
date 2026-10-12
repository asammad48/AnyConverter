/*
 * Registry for the generated tool pages and topical hubs.
 * One entry per tool: slugs per language, hub, scripts and related tools.
 * Page copy lives in ./content/<id>.js (localized, written per page).
 */
'use strict';

const SITE = 'https://anyconverter.io';
const LANGS = ['en', 'es', 'da'];

/* Topical hubs. `slugs` are the folder names under / , /es/ and /da/ (English slugs in every language, like the rest of the site). */
const HUBS = {
  calc: { slugs: { en: 'calculators', es: 'calculators', da: 'calculators' } },
  astro: { slugs: { en: 'numerology-astrology', es: 'numerology-astrology', da: 'numerology-astrology' } },
  fun: { slugs: { en: 'fun-relationships', es: 'fun-relationships', da: 'fun-relationships' } },
  date: { slugs: { en: 'date-time', es: 'date-time', da: 'date-time' } }
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
    slugs: { en: 'rise-over-run-calculator', es: 'rise-over-run-calculator', da: 'rise-over-run-calculator' },
    related: ['slope-grade-angle-calculator', 'percentage-difference-calculator'] },
  { id: 'pay-rise-calculator', hub: 'calc', script: 'pay-rise.js', appCat: 'FinanceApplication',
    slugs: { en: 'pay-rise-calculator', es: 'pay-rise-calculator', da: 'pay-rise-calculator' },
    related: ['price-increase-calculator', 'reverse-percentage-calculator', 'percentage-difference-calculator'] },
  { id: 'price-increase-calculator', hub: 'calc', script: 'price-increase.js', appCat: 'FinanceApplication',
    slugs: { en: 'price-increase-calculator', es: 'price-increase-calculator', da: 'price-increase-calculator' },
    related: ['pay-rise-calculator', 'reverse-percentage-calculator', 'unit-price-calculator', 'margin-vs-markup-calculator'] },
  { id: 'margin-vs-markup-calculator', hub: 'calc', script: 'margin-markup.js', appCat: 'FinanceApplication',
    slugs: { en: 'margin-vs-markup-calculator', es: 'margin-vs-markup-calculator', da: 'margin-vs-markup-calculator' },
    related: ['unit-price-calculator', 'price-increase-calculator', 'percentage-difference-calculator'] },
  { id: 'unit-price-calculator', hub: 'calc', script: 'unit-price.js', appCat: 'FinanceApplication',
    slugs: { en: 'unit-price-calculator', es: 'unit-price-calculator', da: 'unit-price-calculator' },
    related: ['discount-stacking-calculator', 'margin-vs-markup-calculator', 'price-increase-calculator'] },
  { id: 'percentage-difference-calculator', hub: 'calc', script: 'percentage-difference.js', appCat: 'EducationalApplication',
    slugs: { en: 'percentage-difference-calculator', es: 'percentage-difference-calculator', da: 'percentage-difference-calculator' },
    related: ['reverse-percentage-calculator', 'price-increase-calculator', 'slope-grade-angle-calculator'] },
  { id: 'slope-grade-angle-calculator', hub: 'calc', script: 'slope-grade-angle.js', appCat: 'EducationalApplication',
    slugs: { en: 'slope-grade-angle-calculator', es: 'slope-grade-angle-calculator', da: 'slope-grade-angle-calculator' },
    related: ['rise-over-run-calculator', 'percentage-difference-calculator'] },

  /* ---- Numerology & Astrology ---- */
  { id: 'name-numerology-calculator', hub: 'astro', script: 'name-numerology.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'name-numerology-calculator', es: 'name-numerology-calculator', da: 'name-numerology-calculator' },
    related: ['numerology-calculator', 'lo-shu-grid-calculator', 'love-calculator', 'tarot-birth-card-calculator'] },
  { id: 'numerology-calculator', hub: 'astro', script: 'numerology.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'numerology-calculator', es: 'numerology-calculator', da: 'numerology-calculator' },
    related: ['name-numerology-calculator', 'lo-shu-grid-calculator', 'tarot-birth-card-calculator', 'moon-sign-calculator'] },
  { id: 'moon-sign-calculator', hub: 'astro', script: 'moon-sign.js', deps: ['../vendor/astronomy.browser.min.js', 'astro-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'moon-sign-calculator', es: 'moon-sign-calculator', da: 'moon-sign-calculator' },
    related: ['rising-sign-calculator', 'numerology-calculator', 'tarot-birth-card-calculator', 'birthday-countdown-calculator'] },
  { id: 'rising-sign-calculator', hub: 'astro', script: 'rising-sign.js', deps: ['../vendor/astronomy.browser.min.js', 'astro-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'rising-sign-calculator', es: 'rising-sign-calculator', da: 'rising-sign-calculator' },
    related: ['moon-sign-calculator', 'numerology-calculator', 'lo-shu-grid-calculator'] },
  { id: 'lo-shu-grid-calculator', hub: 'astro', script: 'lo-shu-grid.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'lo-shu-grid-calculator', es: 'lo-shu-grid-calculator', da: 'lo-shu-grid-calculator' },
    related: ['numerology-calculator', 'name-numerology-calculator', 'tarot-birth-card-calculator'] },
  { id: 'tarot-birth-card-calculator', hub: 'astro', script: 'tarot-birth-card.js', deps: ['numerology-core.js'], appCat: 'LifestyleApplication', fun: true,
    slugs: { en: 'tarot-birth-card-calculator', es: 'tarot-birth-card-calculator', da: 'tarot-birth-card-calculator' },
    related: ['numerology-calculator', 'name-numerology-calculator', 'lo-shu-grid-calculator', 'moon-sign-calculator'] },

  /* ---- Fun & Relationships ---- */
  { id: 'love-calculator', hub: 'fun', script: 'love-calculator.js', deps: ['numerology-core.js'], appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'love-calculator', es: 'love-calculator', da: 'love-calculator' },
    related: ['flames-calculator', 'name-numerology-calculator', 'magic-8-ball'] },
  { id: 'flames-calculator', hub: 'fun', script: 'flames-calculator.js', deps: ['numerology-core.js'], appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'flames-calculator', es: 'flames-calculator', da: 'flames-calculator' },
    related: ['love-calculator', 'magic-8-ball', 'name-numerology-calculator'] },
  { id: 'magic-8-ball', hub: 'fun', script: 'magic-8-ball.js', appCat: 'EntertainmentApplication', fun: true,
    slugs: { en: 'magic-8-ball', es: 'magic-8-ball', da: 'magic-8-ball' },
    related: ['love-calculator', 'flames-calculator'] },

  /* ---- Date & Time ---- */
  { id: 'birthday-countdown-calculator', hub: 'date', script: 'birthday-countdown.js', deps: ['numerology-core.js'], appCat: 'UtilitiesApplication',
    slugs: { en: 'birthday-countdown-calculator', es: 'birthday-countdown-calculator', da: 'birthday-countdown-calculator' },
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
