const fs = require('fs');
const path = require('path');
const { generateSectionHtml, countWords } = require('./build_s22_content');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  'json-formatter', 'json-compare', 'csv-to-sql', 'regex-tester', 'jwt-decoder',
  'base64-encoder', 'url-encoder', 'hash-generator', 'cron-expression-parser', 'xml-formatter'
];

const LOCALES = [
  { prefix: '', lang: 'en' },
  { prefix: 'es/', lang: 'es' },
  { prefix: 'da/', lang: 'da' }
];

console.log('Synchronizing S22 AI-Citeable "How It Works" sections across 30 URLs...\n');

let updatedCount = 0;

for (const tool of TOOLS) {
  for (const loc of LOCALES) {
    const filePath = path.join(ROOT, loc.prefix, tool, 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');
    const newSection = generateSectionHtml(tool, loc.lang);

    if (html.includes('class="how-it-works"')) {
      // Replace existing section
      html = html.replace(/<section class="how-it-works" id="how-it-works">[\s\S]*?<\/section>/, newSection);
      console.log(`[UPDATED] ${loc.prefix}${tool}/index.html (re-injected)`);
    } else {
      // Find </section> of how-to-use
      const howToUseIdx = html.indexOf('class="how-to-use"');
      if (howToUseIdx === -1) {
        throw new Error(`how-to-use not found in ${filePath}`);
      }
      const endOfHowToUse = html.indexOf('</section>', howToUseIdx);
      if (endOfHowToUse === -1) {
        throw new Error(`</section> not found after how-to-use in ${filePath}`);
      }

      const insertionPoint = endOfHowToUse + '</section>'.length;
      html = html.slice(0, insertionPoint) + '\n\n' + newSection + html.slice(insertionPoint);
      console.log(`[INSERTED] ${loc.prefix}${tool}/index.html`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    updatedCount++;
  }
}

console.log(`\nSuccessfully synchronized ${updatedCount}/30 files.`);
