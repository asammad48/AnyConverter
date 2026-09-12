async (page) => {
  const urls = [
    { path: '/ocr-pdf/', selectors: ['#ocr-file', '#ocr-lang', '#ocr-output', '.seo-content'] },
    { path: '/csv-to-sql/', selectors: ['#csv-input', '#csv-file-input', '#btn-generate-sql', '.seo-content'] },
    { path: '/regex-tester/', selectors: ['#regex-pattern', '#log-textarea', '#match-view', '.seo-content'] },
    { path: '/json-formatter/', selectors: ['#json-input', '#json-output', '#btn-format', '.seo-content'] },
    { path: '/organize-pdf/', selectors: ['#op-file', '#op-order', '#op-btn', '.seo-content'] },
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
