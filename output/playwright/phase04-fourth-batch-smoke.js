async (page) => {
  const urls = [
    { path: '/hash-generator/', selectors: ['#hash-text-input', '#hash-md5', '#tog-uppercase', '.seo-content'] },
    { path: '/base64-encoder/', selectors: ['#text-input', '#text-output', '#btn-encode', '.seo-content'] },
    { path: '/url-encoder/', selectors: ['#url-input', '#url-output', '#btn-convert', '.seo-content'] },
    { path: '/cron-expression-parser/', selectors: ['#cron-input', '#cron-description', '#cron-part-min', '.seo-content'] },
  ];
  const viewports = [
    { label: 'desktop', width: 1366, height: 900 },
    { label: 'mobile', width: 360, height: 740 },
  ];
  const results = [];

  for (const target of urls) {
    for (const viewport of viewports) {
      const messages = [];
      const pageErrors = [];
      const onConsole = (msg) => {
        if (['error', 'warning'].includes(msg.type())) {
          messages.push({ type: msg.type(), text: msg.text() });
        }
      };
      const onPageError = (err) => pageErrors.push(err.message);

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`http://localhost:5000${target.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);

      const data = await page.evaluate((selectors) => ({
        title: document.title,
        h1: document.querySelector('h1')?.textContent.trim() || '',
        metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        seoHeading: document.querySelector('.seo-content h2')?.textContent.trim() || '',
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        selectorsPresent: Object.fromEntries(selectors.map((selector) => [selector, !!document.querySelector(selector)])),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }), target.selectors);

      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      results.push({
        url: target.path,
        viewport: viewport.label,
        ...data,
        consoleMessages: messages,
        pageErrors,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  return results;
}
