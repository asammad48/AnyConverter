#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Multilingual Localization (Danish & Spanish) Quality Suite ---');

function walk(dir) {
  let res = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'scratch'].includes(item.name)) continue;
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(walk(p));
    } else if (item.name.endsWith('.html')) {
      res.push(p);
    }
  }
  return res;
}

// 1. Verify Danish specific corrections
const daMortgage = fs.readFileSync('da/mortgage-calculator/index.html', 'utf8');
assert(daMortgage.includes('boliglånsbetalinger'), 'da/mortgage-calculator must contain correct Danish "boliglånsbetalinger"');
assert(!daMortgage.includes('boliglansbetalinger'), 'da/mortgage-calculator must not contain misspelled "boliglansbetalinger"');
assert(daMortgage.includes('beregner. Med klare trin'), 'da/mortgage-calculator must contain sentence-terminating period before "Med klare trin"');

const daSpeed = fs.readFileSync('da/internet-speed-test/index.html', 'utf8');
assert(daSpeed.includes('Kør en internethastighedstest'), 'da/internet-speed-test must contain proper Danish imperative "Kør"');
assert(!daSpeed.includes('Koer en internethastighedstest'), 'da/internet-speed-test must not contain Anglicized "Koer"');
assert(daSpeed.includes('forbindelseskvalitet. Med klare trin'), 'da/internet-speed-test must contain period before "Med klare trin"');

// 2. Verify Spanish specific corrections
const esWordCounter = fs.readFileSync('es/word-counter/index.html', 'utf8');
assert(esWordCounter.includes('resultados rápidos'), 'es/word-counter must contain accented "resultados rápidos"');
assert(!esWordCounter.includes('resultados rapidos'), 'es/word-counter must not contain unaccented "resultados rapidos"');

// 3. Verify About pages navigation and CTA localization (no English fragments)
const esAbout = fs.readFileSync('es/about/index.html', 'utf8');
assert(!esAbout.includes('>Home<'), 'es/about must not contain English "Home" breadcrumb');
assert(!esAbout.includes('Client-Side'), 'es/about must not contain English "Client-Side" eyebrow');
assert(!esAbout.includes('View Tools'), 'es/about must not contain English "View Tools" CTA');
assert(esAbout.includes('>Inicio<'), 'es/about must contain Spanish "Inicio" breadcrumb');
assert(esAbout.includes('Ver Herramientas'), 'es/about must contain Spanish "Ver Herramientas" CTA');

const daAbout = fs.readFileSync('da/about/index.html', 'utf8');
assert(!daAbout.includes('>Home<'), 'da/about must not contain English "Home" breadcrumb');
assert(!daAbout.includes('View Tools'), 'da/about must not contain English "View Tools" CTA');
assert(daAbout.includes('>Hjem<'), 'da/about must contain Danish "Hjem" breadcrumb');
assert(daAbout.includes('Se Værktøjer'), 'da/about must contain Danish "Se Værktøjer" CTA');
console.log('✓ About pages (ES, DA) verified free of English UI fragments and breadcrumbs');

// 4. Verify Blood Type Compatibility translation
const esBlood = fs.readFileSync('es/blood-type-compatibility/index.html', 'utf8');
assert(!esBlood.includes('Usa blood type compatibility'), 'es/blood-type-compatibility must not contain English slug in meta description');
assert(!esBlood.includes('Blood type compatibility: usos'), 'es/blood-type-compatibility must not contain English slug in heading');
assert(esBlood.includes('Compatibilidad de grupos sanguíneos: usos prácticos'), 'es/blood-type-compatibility must have Spanish heading');

const daBlood = fs.readFileSync('da/blood-type-compatibility/index.html', 'utf8');
assert(!daBlood.includes('Blood type compatibility: praktisk'), 'da/blood-type-compatibility must not contain English slug in heading');
assert(daBlood.includes('Blodtypekompatibilitet: praktisk brug'), 'da/blood-type-compatibility must have Danish heading');
console.log('✓ Blood Type Compatibility pages (ES, DA) verified with localized titles and meta');

// 5. Sitewide Danish scans (diacritics, sentence boundaries, ASCII fallback detection)
const daFiles = walk('da');
let daSentenceBoundaryErrors = 0;
let daDiacriticErrors = 0;
const daStrippedRegex = /(\bnar\b|\bdaekker\b|\bvaelge\b|\bvaelg\b|\bmaneder\b|\bnaeste\b|\btraeffe\b|\bvaerktoj\b|\bfaerdige\b|\blaeg\b gst|\bplanlaeg\b dagen|\bskaermoplosninger\b|\bviewport-storrelse\b|\bHold siden aben\b|\bboliglansbetalinger\b|\bmodetimer\b|\btilfoj\b|\bpamindelser\b|Text repeater online: praktisk|World Clock: practical uses)/i;

for (const file of daFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const strippedMatch = content.match(daStrippedRegex);
  if (strippedMatch) {
    console.error(`Found stripped Danish diacritic or leaked string in ${file}: "${strippedMatch[0]}"`);
    daDiacriticErrors++;
  }
  // Check unpunctuated "Med klare trin"
  const badMatches = [...content.matchAll(/([a-zæøå0-9]+)\s+Med klare trin/gi)];
  for (const m of badMatches) {
    if (m[1].toLowerCase() !== 'og' && m[1].toLowerCase() !== 'med') {
      console.error(`Missing sentence boundary in ${file}: "${m[0]}"`);
      daSentenceBoundaryErrors++;
    }
  }
}
assert.strictEqual(daDiacriticErrors, 0, `Zero stripped Danish diacritics or leaked strings allowed across ${daFiles.length} Danish pages`);
assert.strictEqual(daSentenceBoundaryErrors, 0, 'Zero missing sentence boundaries before "Med klare trin" allowed across Danish pages');
console.log(`✓ Danish localization verified across all ${daFiles.length} pages: correct diacritics and sentence boundaries`);

// 6. Sitewide Spanish scans (diacritics, accent marks, ASCII fallback detection)
const esFiles = walk('es');
let esDiacriticErrors = 0;
const esStrippedRegex = /(resultados rapidos|usos practicos|pasos practicos|limites practicos|controles practicos|sin limites en el navegador|detalles utiles|la pagina tambien|detras del resultado|formula, supuestos|misma decision|despues de|el dia con linea|linea de tiempo|codigos QR|guia de idioma|ajusta posicion|colores solidos|pixeles muertos|tamano de viewport|guardado automatico|categoria de peso|text diff checker gratis|habit tracker online gratis|screen resolution checker gratis)/i;

for (const file of esFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const strippedMatch = content.match(esStrippedRegex);
  if (strippedMatch) {
    console.error(`Found unaccented Spanish word or untranslated fragment in ${file}: "${strippedMatch[0]}"`);
    esDiacriticErrors++;
  }
}
assert.strictEqual(esDiacriticErrors, 0, `Zero unaccented Spanish diacritics or leaked fragments allowed across ${esFiles.length} Spanish pages`);
console.log(`✓ Spanish localization verified across all ${esFiles.length} pages: proper diacritics and accent marks`);

console.log('\nALL MULTILINGUAL LOCALIZATION TESTS PASSED!');
