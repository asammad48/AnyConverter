const fs = require('fs');

const homepageCatalog = {};

['en', 'es', 'da'].forEach(lang => {
  const file = lang === 'en' ? 'index.html' : lang + '/index.html';
  const html = fs.readFileSync(file, 'utf8');
  const cardRegex = /<a\s+[^>]*href=["'](\/(?:(?:es|da)\/)?[^"']+\/)["'][^>]*class=["']tool-card["']>([\s\S]*?)<\/a>/gi;
  
  let match;
  let count = 0;
  while ((match = cardRegex.exec(html)) !== null) {
    count++;
    const href = match[1];
    const inner = match[2];
    const slug = href.replace(/^\/(?:es|da)\//, '').replace(/^\/|\/$/g, '');
    
    // Extract img src and alt
    const imgMatch = inner.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i);
    const h3Match = inner.match(/<h3>([\s\S]*?)<\/h3>/i);
    const pMatch = inner.match(/<p>([\s\S]*?)<\/p>/i);
    
    homepageCatalog[slug] = homepageCatalog[slug] || {};
    homepageCatalog[slug][lang] = {
      href,
      img: imgMatch ? imgMatch[1] : '',
      alt: imgMatch ? imgMatch[2] : '',
      title: h3Match ? h3Match[1] : '',
      desc: pMatch ? pMatch[1] : ''
    };
  }
  console.log(`[${lang}] Parsed ${count} tool cards from ${file}`);
});

const missing = [];
const mapping = JSON.parse(fs.readFileSync('RELATED_TOOLS_COMPLETE_MAPPING.json', 'utf8'));
Object.keys(mapping).forEach(slug => {
  ['en', 'es', 'da'].forEach(lang => {
    if (!homepageCatalog[slug] || !homepageCatalog[slug][lang] || !homepageCatalog[slug][lang].desc) {
      missing.push(`${slug} (${lang})`);
    }
  });
});

console.log('Missing tools in homepage catalog:', missing.length, missing);
fs.writeFileSync('scratch/homepage_cards_catalog.json', JSON.stringify(homepageCatalog, null, 2), 'utf8');
