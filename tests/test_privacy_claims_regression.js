#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing Privacy Statements & Disclosures Regression Suite ---');

function walkHtml(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', '.agents', '.claude', 'scratch'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkHtml(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

// 1. Check About Us pages across EN, ES, DA for unsupported absolute claims
const aboutFiles = [
  { path: 'about/index.html', lang: 'EN' },
  { path: 'es/about/index.html', lang: 'ES' },
  { path: 'da/about/index.html', lang: 'DA' }
];

const forbiddenPhrases = [
  /your files, text, and data never leave your device/i,
  /all data never leaves your device/i,
  /every tool is 100% offline/i,
  /no information is ever transmitted/i,
  /all tools guarantee complete privacy/i,
  /100%\s+procesadas en el navegador/i
];

for (const { path: filePath, lang } of aboutFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const regex of forbiddenPhrases) {
    assert(!regex.test(content), `About page [${lang}] should not contain absolute claim matching ${regex}`);
  }
  // Assert qualified disclosure exists
  assert(
    content.includes('processed locally') || content.includes('procesan localmente') || content.includes('behandles lokalt'),
    `About page [${lang}] should contain qualified local processing description`
  );
}
console.log('✓ About pages (EN, ES, DA) verified free of absolute privacy claims and contain qualified disclosures');

// 2. Check FAQ pages for qualified disclosures
const faqFiles = [
  { path: 'faq/index.html', lang: 'EN', match: 'locally in your browser' },
  { path: 'es/faq/index.html', lang: 'ES', match: 'localmente en tu navegador' },
  { path: 'da/faq/index.html', lang: 'DA', match: 'lokalt i din browser' }
];

for (const { path: filePath, lang, match } of faqFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes(match), `FAQ page [${lang}] should contain qualified local processing statement: "${match}"`);
}
console.log('✓ FAQ pages (EN, ES, DA) verified for accurate data safety responses');

// 3. Check Press pages for accurate technology/data policy
const pressFiles = [
  { path: 'press/index.html', lang: 'EN', match: '0 document uploads' },
  { path: 'es/press/index.html', lang: 'ES', match: '0 subidas de documentos' },
  { path: 'da/press/index.html', lang: 'DA', match: '0 dokumentuploads' }
];

for (const { path: filePath, lang, match } of pressFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes(match), `Press page [${lang}] should contain "${match}" instead of misleading "0 bytes uploaded"`);
}
console.log('✓ Press kit pages (EN, ES, DA) verified for factual data policy metrics');

// 4. Verify Internet Speed Test explicit upload traffic disclosure
const speedTestFiles = [
  { path: 'internet-speed-test/index.html', lang: 'EN', match: 'speed.cloudflare.com' },
  { path: 'es/internet-speed-test/index.html', lang: 'ES', match: 'speed.cloudflare.com' },
  { path: 'da/internet-speed-test/index.html', lang: 'DA', match: 'speed.cloudflare.com' }
];

for (const { path: filePath, lang, match } of speedTestFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes(match), `Speed test [${lang}] must reference speed.cloudflare.com`);
  assert(/upload|subida|båndbredde/i.test(content), `Speed test [${lang}] must disclose upload traffic`);
}
console.log('✓ Internet Speed Test pages (EN, ES, DA) explicitly disclose Cloudflare upload & download traffic');

// 5. Verify IP Address Lookup external query disclosure
const ipLookupFiles = [
  { path: 'ip-address-lookup/index.html', lang: 'EN' },
  { path: 'es/ip-address-lookup/index.html', lang: 'ES' },
  { path: 'da/ip-address-lookup/index.html', lang: 'DA' }
];

for (const { path: filePath, lang } of ipLookupFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('ip-privacy-note'), `IP lookup [${lang}] must include class="ip-privacy-note"`);
}
console.log('✓ IP Address Lookup pages (EN, ES, DA) include explicit external query disclosure note');

// 6. Verify Currency Converter external exchange rate disclosure
const currencyFiles = [
  { path: 'currency-converter/index.html', lang: 'EN' },
  { path: 'es/currency-converter/index.html', lang: 'ES' },
  { path: 'da/currency-converter/index.html', lang: 'DA' }
];

for (const { path: filePath, lang } of currencyFiles) {
  assert(fs.existsSync(filePath), `File exists: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('cc-privacy-note'), `Currency converter [${lang}] must include class="cc-privacy-note"`);
}
console.log('✓ Currency Converter pages (EN, ES, DA) include explicit live rate API disclosure note');

// 7. Broad Sitewide Scan: Zero absolute privacy overclaims across ALL HTML files
const allHtml = walkHtml('.');
const absolutePrivacyRegex = /(never leave|never leaves|forlader[^.\n]{0,80}aldrig|nunca sale[n]?\b|sendes aldrig)/i;
let absoluteClaimViolations = 0;

for (const htmlFile of allHtml) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const m = content.match(absolutePrivacyRegex);
  if (m) {
    console.error(`Absolute privacy claim violation in ${htmlFile}: "${m[0]}"`);
    absoluteClaimViolations++;
  }
}
assert.strictEqual(absoluteClaimViolations, 0, `Zero absolute privacy claims allowed across repository (found ${absoluteClaimViolations})`);
console.log(`✓ Sitewide sweep: ${allHtml.length} HTML files verified free of absolute privacy claims`);

console.log('\nALL PRIVACY STATEMENT REGRESSION TESTS PASSED!');
