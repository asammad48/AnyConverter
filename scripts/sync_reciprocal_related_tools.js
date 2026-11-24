const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'scratch/homepage_cards_catalog.json'), 'utf8'));

const slugs = Object.keys(mapping);
console.log(`Starting synchronization for ${slugs.length} tools across EN, ES, DA (384 pages total)...`);

let updatedCount = 0;
let failedCount = 0;

for (const slug of slugs) {
  const targets = mapping[slug];

  for (const lang of ['en', 'es', 'da']) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const filePath = path.join(ROOT, prefix, slug, 'index.html');

    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      failedCount++;
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const isCRLF = content.includes('\r\n');
    const nl = isCRLF ? '\r\n' : '\n';

    const heading = lang === 'en' ? 'Related Tools' : (lang === 'es' ? 'Herramientas Relacionadas' : 'Relaterede Værktøjer');
    const cta = lang === 'en' ? 'Try it →' : (lang === 'es' ? 'Probar →' : 'Prøv det →');

    let cardsHtml = '';
    for (const tSlug of targets) {
      const tInfo = catalog[tSlug][lang];
      const tUrl = tInfo.href;
      const tImg = tInfo.img;
      const tTitle = tInfo.title;
      const tDesc = tInfo.desc;
      const altText = `${tTitle} icon`;

      cardsHtml += `        <a href="${tUrl}" class="tool-card"><img src="${tImg}" alt="${altText}" class="tool-card-icon" width="40" height="40" loading="lazy"><h3>${tTitle}</h3><p>${tDesc}</p><span class="tool-card-link">${cta}</span></a>${nl}`;
    }

    const newSection = `<section class="related-tools">${nl}      <h2>${heading}</h2>${nl}      <div class="tool-grid">${nl}${cardsHtml}      </div>${nl}    </section>`;

    const sectionRegex = /<section class=["']related-tools["'][\s\S]*?<\/section>/i;
    if (!sectionRegex.test(content)) {
      console.error(`Could not find <section class="related-tools"> in ${filePath}`);
      failedCount++;
      continue;
    }

    content = content.replace(sectionRegex, newSection);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log(`\nSynchronization finished.`);
console.log(`Successfully updated: ${updatedCount} pages`);
console.log(`Failed: ${failedCount} pages`);
