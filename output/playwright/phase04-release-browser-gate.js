async (page, deps = {}) => {
  const fs = deps.fs;
  const PDFLib = deps.PDFLib;
  const priority = [
    { path: '/', selectors: ['#site-header', '#main-content', '.tool-card'] },
    { path: '/pdf-merge/', selectors: ['#pdf-input', '#btn-merge', '.seo-content'], workflow: 'pdfMerge' },
    { path: '/pdf-compress/', selectors: ['#compress-input', '#btn-compress', '.seo-content'], workflow: 'pdfCompress' },
    { path: '/image-converter/', selectors: ['#image-input', '#btn-convert', '.seo-content'], workflow: 'imageConvert' },
    { path: '/json-formatter/', selectors: ['#json-input', '#json-output', '#btn-format', '.seo-content'], workflow: 'jsonFormat' },
    { path: '/word-counter/', selectors: ['#wc-input', '#wc-words', '.seo-content'], workflow: 'wordCount' },
    { path: '/typing-speed-test/', selectors: ['#btn-start-test', '#tst-input', '#tst-text-display', '.seo-content'], workflow: 'typingStart' },
  ];
  const viewports = [
    { label: 'desktop', width: 1366, height: 900 },
    { label: 'mobile', width: 390, height: 844 },
  ];
  const results = [];
  const pdfMarker = 'AnyConverter phase04 browser-gate marker';

  function assertDeps(names) {
    for (const name of names) {
      if (!deps[name]) throw new Error(`Missing browser gate dependency: ${name}`);
    }
  }

  async function makePdfBuffer(label) {
    assertDeps(['PDFLib']);
    const doc = await PDFLib.PDFDocument.create();
    const pageOne = doc.addPage([240, 180]);
    pageOne.drawText(`${pdfMarker}: ${label}`, { x: 24, y: 120, size: 12 });
    doc.setTitle(`Phase 04 ${label}`);
    return Buffer.from(await doc.save());
  }

  async function setFiles(inputSelector, files) {
    await page.setInputFiles(inputSelector, files);
  }

  async function readDownload(download) {
    assertDeps(['fs']);
    const filePath = await download.path();
    if (!filePath) throw new Error('Download did not resolve to a local file path');
    return fs.readFileSync(filePath);
  }

  async function validatePdfDownload(download, expectedPageCount) {
    assertDeps(['PDFLib']);
    const bytes = await readDownload(download);
    const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    const pageCount = doc.getPageCount();
    if (pageCount !== expectedPageCount) {
      throw new Error(`Expected downloaded PDF to have ${expectedPageCount} page(s), found ${pageCount}`);
    }
    return { bytes: bytes.length, pageCount };
  }

  async function runWorkflow(target, networkUploads) {
    if (target.workflow === 'jsonFormat') {
      const expected = { phase: 4, gate: true, nested: { value: 'verified' } };
      await page.fill('#json-input', JSON.stringify(expected));
      await page.click('#btn-minify');
      await page.waitForFunction(() => (
        document.querySelector('#output-status-ok')?.textContent.includes('Minified') &&
        document.querySelector('#json-output')?.textContent.trim().startsWith('{')
      ));
      const output = await page.locator('#json-output').textContent();
      const actual = JSON.parse(output);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error('Formatted JSON output did not preserve the input object');
      }
      return 'formatted and semantically verified JSON';
    }

    if (target.workflow === 'wordCount') {
      await page.fill('#wc-input', 'Gate counts five words now.');
      await page.waitForFunction(() => document.querySelector('#wc-words')?.textContent.trim() === '5');
      return 'counted exact word fixture';
    }

    if (target.workflow === 'typingStart') {
      await page.click('#btn-start-test');
      await page.waitForSelector('#tst-game', { state: 'visible' });
      const sample = (await page.locator('#tst-text-display').innerText()).trim();
      if (!sample) throw new Error('Typing test did not render sample text');
      await page.fill('#tst-input', sample.slice(0, 8));
      const typed = await page.locator('#tst-input').inputValue();
      if (typed.length < 4) throw new Error('Typing input did not accept keystrokes');
      return 'started typing test and accepted input';
    }

    if (target.workflow === 'imageConvert') {
      await page.evaluate(async () => {
        const blob = await new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          canvas.width = 12;
          canvas.height = 12;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#2f6fed';
          ctx.fillRect(0, 0, 12, 12);
          canvas.toBlob(resolve, 'image/png');
        });
        const dt = new DataTransfer();
        dt.items.add(new File([blob], 'phase04.png', { type: 'image/png' }));
        const input = document.querySelector('#image-input');
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForSelector('#settings-panel', { state: 'visible' });
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        page.click('#btn-convert'),
      ]);
      const output = await readDownload(download);
      const isPng = output.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
      if (!isPng) throw new Error('Image converter download was not a PNG file');
      return `converted image download (${output.length} bytes)`;
    }

    if (target.workflow === 'pdfMerge') {
      const first = await makePdfBuffer('merge-one');
      const second = await makePdfBuffer('merge-two');
      await setFiles('#pdf-input', [
        { name: 'one.pdf', mimeType: 'application/pdf', buffer: first },
        { name: 'two.pdf', mimeType: 'application/pdf', buffer: second },
      ]);
      await page.waitForSelector('#merge-options', { state: 'visible' });
      await page.click('#btn-merge');
      await page.waitForSelector('#merge-result', { state: 'visible', timeout: 15000 });
      const downloadSelector = await page.locator('#btn-download-merged, #btn-download-merge').first();
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        downloadSelector.click(),
      ]);
      const validation = await validatePdfDownload(download, 2);
      return `merged valid PDF (${validation.pageCount} pages, ${validation.bytes} bytes)`;
    }

    if (target.workflow === 'pdfCompress') {
      const input = await makePdfBuffer('compress');
      await setFiles('#compress-input', [{ name: 'compress.pdf', mimeType: 'application/pdf', buffer: input }]);
      await page.waitForSelector('#compress-settings', { state: 'visible' });
      await page.click('#btn-compress');
      await page.waitForSelector('#compress-result', { state: 'visible', timeout: 15000 });
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        page.click('#btn-download-compressed'),
      ]);
      const validation = await validatePdfDownload(download, 1);
      return `compressed to valid PDF (${validation.pageCount} page, ${validation.bytes} bytes)`;
    }

    if (networkUploads.length) {
      throw new Error(`Unexpected upload request(s): ${networkUploads.map((item) => item.url).join(', ')}`);
    }
    return 'structure only';
  }

  for (const target of priority) {
    for (const viewport of viewports) {
      const consoleMessages = [];
      const pageErrors = [];
      const thirdPartyRequests = new Set();
      const networkUploads = [];
      const validationErrors = [];

      const onConsole = (msg) => {
        if (['error', 'warning'].includes(msg.type())) consoleMessages.push({ type: msg.type(), text: msg.text() });
      };
      const onPageError = (err) => pageErrors.push(err.message);
      const onRequest = (request) => {
        const url = request.url();
        if (/^https?:\/\//.test(url) && !url.startsWith('http://localhost:5000/') && !url.startsWith('http://127.0.0.1:5000/')) {
          thirdPartyRequests.add(new URL(url).hostname);
        }
        if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
          const postData = request.postData() || '';
          networkUploads.push({ method: request.method(), url, bytes: Buffer.byteLength(postData) });
        }
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      page.on('request', onRequest);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`http://localhost:5000${target.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#main-content', { timeout: 10000 });

      let workflowResult = '';
      let workflowError = '';
      try {
        workflowResult = await runWorkflow(target, networkUploads);
      } catch (error) {
        workflowError = error.message;
        validationErrors.push(error.message);
      }

      const data = await page.evaluate((selectors) => {
        const missing = selectors.filter((selector) => !document.querySelector(selector));
        const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')];
        const invalidJsonLd = jsonLd.filter((node) => {
          try {
            JSON.parse(node.textContent);
            return false;
          } catch {
            return true;
          }
        }).length;
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent.trim() || '',
          metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          missingSelectors: missing,
          invalidJsonLd,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      }, target.selectors);

      if (data.missingSelectors.length) validationErrors.push(`Missing selectors: ${data.missingSelectors.join(', ')}`);
      if (data.invalidJsonLd) validationErrors.push(`Invalid JSON-LD blocks: ${data.invalidJsonLd}`);
      if (data.horizontalOverflow) validationErrors.push('Horizontal overflow detected');
      if (pageErrors.length) validationErrors.push(`Page errors: ${pageErrors.join(' | ')}`);
      const consoleErrors = consoleMessages.filter((item) => item.type === 'error');
      if (consoleErrors.length) validationErrors.push(`Console errors: ${consoleErrors.map((item) => item.text).join(' | ')}`);
      if (networkUploads.length) validationErrors.push(`Unexpected non-GET network request(s): ${networkUploads.map((item) => `${item.method} ${item.url}`).join(', ')}`);

      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      page.off('request', onRequest);
      results.push({
        url: target.path,
        viewport: viewport.label,
        workflowResult,
        workflowError,
        thirdPartyHosts: [...thirdPartyRequests].sort(),
        networkUploads,
        consoleMessages,
        pageErrors,
        validationErrors,
        ...data,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  return results;
}
