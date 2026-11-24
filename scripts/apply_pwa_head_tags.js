const fs = require('fs');
const path = require('path');

const targetFiles = [
  'index.html',
  'es/index.html',
  'da/index.html',
  'json-formatter/index.html',
  'es/json-formatter/index.html',
  'da/json-formatter/index.html',
  'percentage-calculator/index.html',
  'es/percentage-calculator/index.html',
  'da/percentage-calculator/index.html',
  'age-calculator/index.html',
  'es/age-calculator/index.html',
  'da/age-calculator/index.html',
  'loan-calculator/index.html',
  'es/loan-calculator/index.html',
  'da/loan-calculator/index.html',
  'ip-address-lookup/index.html',
  'es/ip-address-lookup/index.html',
  'da/ip-address-lookup/index.html'
];

targetFiles.forEach((relPath) => {
  const fullPath = path.resolve(relPath);
  let html = fs.readFileSync(fullPath, 'utf8');

  // 1. Add manifest and theme-color if missing
  if (!html.includes('manifest.webmanifest')) {
    const iconMatch = html.match(/(<link\s+rel=["']icon["'][^>]*>)/i);
    if (iconMatch) {
      const replacement = `${iconMatch[1]}\n  <meta name="theme-color" content="#B04A45">\n  <link rel="manifest" href="/manifest.webmanifest">`;
      html = html.replace(iconMatch[1], replacement);
    } else {
      console.warn(`[WARN] No favicon found in ${relPath}`);
    }
  }

  // 2. Ensure analytics.js is present
  if (!html.includes('/assets/js/shared/analytics.js')) {
    html = html.replace(
      /(<script\s+src=["'][^"']*\/assets\/js\/shared\.js[^"']*["'][^>]*><\/script>)/i,
      `<script src="/assets/js/shared/analytics.js" defer></script>\n  $1`
    );
  }

  // 3. Ensure pwa.js is present
  if (!html.includes('/assets/js/shared/pwa.js')) {
    html = html.replace(
      /(<script\s+src=["'][^"']*\/assets\/js\/shared\.js[^"']*["'][^>]*><\/script>)/i,
      `$1\n  <script src="/assets/js/shared/pwa.js" defer></script>`
    );
  }

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`[UPDATED] ${relPath}`);
});
console.log('All 18 target pages successfully updated with PWA metadata and script tags.');
