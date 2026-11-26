/**
 * Targeted Multilingual UI & Parity Verification for AnyConverter Creative Studio
 * Verifies EN, ES, and DA studio interfaces for matching DOM selectors, motif options,
 * brand mode options, script includes, and canonical/hreflang tags.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = process.cwd();

const LOCALES = [
  { code: 'en', path: path.join(ROOT, 'creative-studio/index.html'), url: 'https://anyconverter.io/creative-studio/' },
  { code: 'es', path: path.join(ROOT, 'es/creative-studio/index.html'), url: 'https://anyconverter.io/es/creative-studio/' },
  { code: 'da', path: path.join(ROOT, 'da/creative-studio/index.html'), url: 'https://anyconverter.io/da/creative-studio/' }
];

const REQUIRED_SELECTORS = [
  'id="cs-project-title"',
  'id="cs-mode-select"',
  'id="cs-direction-select"',
  'id="cs-render-mode-select"',
  'id="cs-shot-select"',
  'id="cs-shot-headline"',
  'id="cs-shot-subhead"',
  'id="cs-shot-motif-select"',
  'id="cs-brand-mode"',
  'id="cs-shot-suitability-alert"',
  'id="cs-shot-accent"',
  'id="cs-shot-duration"',
  'id="cs-canvas"',
  'id="cs-timeline-scrubber"',
  'id="cs-btn-play-pause"',
  'id="cs-btn-save-project"',
  'id="cs-btn-open-project"',
  'id="cs-btn-export-draft"',
  'id="cs-btn-export-video"'
];

const LOCALIZED_STRINGS = {
  en: ['Export Draft', 'Export Video', 'Properties Inspector', 'Cinematic Shot Editor'],
  es: ['Exportar Borrador', 'Exportar Video', 'Inspector de Propiedades', 'Editor de Tomas Cinemáticas'],
  da: ['Eksporter Kladde', 'Eksporter Video', 'Egenskaber', 'Filmisk Scene Editor']
};

const REQUIRED_MOTIF_VALUES = [
  'default',
  'data-chaos',
  'latency-bottleneck',
  'wasm-pipeline',
  'metric-counter',
  'branded-payoff',
  'security-lock',
  'encrypted-vault',
  'shield-protection',
  'unbranded-conclusion',
  'placeholder'
];

const REQUIRED_SCRIPTS = [
  '/assets/js/creative-studio/visual/reference-shot.js',
  '/assets/js/creative-studio/visual/creative-director.js',
  '/assets/js/creative-studio/render-adapter.js',
  '/assets/js/creative-studio/studio-app.js'
];

function runMultilingualCreativeStudioChecks() {
  console.log('=============================================================');
  console.log('=== MULTILINGUAL CREATIVE STUDIO UI & SEO VERIFICATION   ===');
  console.log('=============================================================\n');

  let passed = 0;

  for (const loc of LOCALES) {
    console.log(`Checking Locale [${loc.code.toUpperCase()}]: ${path.relative(ROOT, loc.path)}...`);
    assert(fs.existsSync(loc.path), `Missing file for locale ${loc.code}: ${loc.path}`);
    const html = fs.readFileSync(loc.path, 'utf8');

    // 1. Verify Canonical & Hreflang Tags
    assert(html.includes(`rel="canonical" href="${loc.url}"`), `[${loc.code}] Missing or invalid canonical tag`);
    assert(html.includes('hreflang="en" href="https://anyconverter.io/creative-studio/"'), `[${loc.code}] Missing hreflang en`);
    assert(html.includes('hreflang="es" href="https://anyconverter.io/es/creative-studio/"'), `[${loc.code}] Missing hreflang es`);
    assert(html.includes('hreflang="da" href="https://anyconverter.io/da/creative-studio/"'), `[${loc.code}] Missing hreflang da`);
    assert(html.includes('hreflang="x-default" href="https://anyconverter.io/creative-studio/"'), `[${loc.code}] Missing hreflang x-default`);
    console.log(`  ✓ Canonical and hreflang alternate tags verified for ${loc.code.toUpperCase()}`);

    // 2. Verify Essential Interactive UI Selectors
    for (const sel of REQUIRED_SELECTORS) {
      assert(html.includes(sel), `[${loc.code}] Missing required DOM selector: ${sel}`);
    }
    console.log(`  ✓ All ${REQUIRED_SELECTORS.length} core UI element IDs verified`);

    // 3. Verify All 10 Procedural Visual Motif Options
    for (const val of REQUIRED_MOTIF_VALUES) {
      assert(html.includes(`value="${val}"`), `[${loc.code}] Missing visual motif option value: ${val}`);
    }
    console.log(`  ✓ All ${REQUIRED_MOTIF_VALUES.length} visual motif values present in select`);

    // 4. Verify Brand Conclusion Mode Options
    assert(html.includes('value="branded"'), `[${loc.code}] Missing brand mode value="branded"`);
    assert(html.includes('value="unbranded"'), `[${loc.code}] Missing brand mode value="unbranded"`);
    console.log(`  ✓ Brand conclusion options (branded/unbranded) verified`);

    // 5. Verify Script Includes
    for (const scr of REQUIRED_SCRIPTS) {
      assert(html.includes(scr), `[${loc.code}] Missing required script tag: ${scr}`);
    }
    console.log(`  ✓ All required engine and art-direction script includes verified`);

    // 6. Verify Localized UI Labels
    const expectedStrings = LOCALIZED_STRINGS[loc.code] || [];
    for (const str of expectedStrings) {
      assert(html.includes(str), `[${loc.code}] Missing localized text string: "${str}"`);
    }
    console.log(`  ✓ All localized text strings verified for ${loc.code.toUpperCase()}`);

    passed++;
  }

  console.log('\n=============================================================');
  console.log(`=== Result: ${passed}/${LOCALES.length} Locales Passed All Parity & SEO Gates ===`);
  console.log('=============================================================\n');
}

if (require.main === module) {
  try {
    runMultilingualCreativeStudioChecks();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
}

module.exports = { runMultilingualCreativeStudioChecks };
