async (page) => {
  const urls = [
    { path: '/pdf-security/', selectors: ['#ps-file', '#ps-owner', '#ps-btn', '.seo-content'] },
    { path: '/jwt-decoder/', selectors: ['#jwt-input', '#btn-decode-jwt', '#jwt-result', '.seo-content'] },
    { path: '/csv-query/', selectors: ['#query-drop-zone', '#sql-query', '#results-table', '.seo-content'] },
    { path: '/pdf-compress/', selectors: ['#compress-drop-zone', '#compress-input', '#btn-compress', '.seo-content'] },
    { path: '/redact-pdf/', selectors: ['#rd-file', '#rd-page', '#rd-btn', '.seo-content'] },
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

      const data = await page.evaluate((selectors) => {
        const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent.trim() || '',
          metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          seoHeading: document.querySelector('.seo-content h2')?.textContent.trim() || '',
          jsonLdCount: ld.length,
          selectorsPresent: Object.fromEntries(selectors.map((selector) => [selector, !!document.querySelector(selector)])),
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      }, target.selectors);

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
