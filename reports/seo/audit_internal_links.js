const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'reports', '.agents', 'coverage', '.ai-memory'].includes(file)) {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles('.');
const targets = [
  '/developer-tools/',
  '/productivity-tools/',
  '/pdf-tools/',
  '/calculators/',
  '/da/calculators/',
  '/es/calculators/',
  '/camt053-to-csv/',
  '/es/camt053-to-csv/',
  '/da/camt053-to-csv/',
  '/barcode-generator/',
  '/es/barcode-generator/',
  '/da/barcode-generator/',
  '/parquet-to-csv/',
  '/json-compare/',
  '/reverse-percentage-calculator/',
  '/ip-address-lookup/',
  '/da/loan-calculator/',
  '/da/mortgage-calculator/',
  '/sticky-notes/',
  '/es/sticky-notes/',
  '/da/todo-list/'
];

const linkDetails = {};
targets.forEach(t => linkDetails[t] = { count: 0, referringPages: [] });

htmlFiles.forEach(f => {
  const normFile = f.replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  targets.forEach(t => {
    if (content.includes(`href="${t}"`) || content.includes(`href='${t}'`)) {
      linkDetails[t].count++;
      linkDetails[t].referringPages.push(normFile);
    }
  });
});

console.log('Internal Link Counts for Target URLs:');
targets.forEach(t => {
  console.log(`${t}: ${linkDetails[t].count} incoming links`);
});

// Write INTERNAL_LINK_AUDIT.csv
const outDir = path.resolve('reports/seo-remediation-2026-11');
const csvHeaders = ['target_url', 'incoming_link_count', 'sample_referring_pages'];
const csvRows = [csvHeaders.join(',')];

targets.forEach(t => {
  const sample = linkDetails[t].referringPages.slice(0, 5).join('; ');
  csvRows.push([`"${t}"`, linkDetails[t].count, `"${sample}"`].join(','));
});

fs.writeFileSync(path.join(outDir, 'INTERNAL_LINK_AUDIT.csv'), csvRows.join('\n'), 'utf8');
console.log('✓ Wrote INTERNAL_LINK_AUDIT.csv');
