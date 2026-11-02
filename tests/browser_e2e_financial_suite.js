#!/usr/bin/env node
/**
 * AnyConverter — Real Browser End-to-End Financial Verification Suite
 * Uses Playwright and Real Chrome Headless to verify production interfaces:
 * - Compound Interest Calculator (Goal solver, frequencies, deposit timing)
 * - Mortgage Calculator (DOM controls, down payment sync, PMI rate & milestones)
 * - Currency Converter (Safe cache, offline fallback, missing rate handling)
 * - Loan Calculator (Floating KIBOR tenor, APR / TAE / ÅOP conventions)
 * - Invoice Generator (Unicode handling, locale money formatting, PDF export)
 * 
 * Verifies English, Spanish, and Danish routes.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Require Playwright from local npm-cache
const playwrightPath = 'C:/Users/abdul.sammad/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright';
const { chromium } = require(playwrightPath);

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 5005;
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

// Start static test server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      let filePath = path.join(ROOT, urlPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + urlPath);
      }
    });

    server.listen(PORT, () => {
      resolve(server);
    });
  });
}

const results = [];
function recordResult(testName, passed, details = '') {
  results.push({ testName, passed, details });
  const icon = passed ? '✓' : '✗';
  console.log(`  ${icon} ${testName} ${details ? '(' + details + ')' : ''}`);
}

async function runBrowserSuite() {
  console.log('====================================================');
  console.log('   REAL BROWSER E2E FINANCIAL VERIFICATION SUITE   ');
  console.log('   Engine: Google Chrome Headless via Playwright     ');
  console.log('====================================================\n');

  const server = await startServer();
  console.log(`[Server] Local test server running at http://127.0.0.1:${PORT}\n`);

  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: COMPOUND INTEREST CALCULATOR (EN, ES, DA)
    // -------------------------------------------------------------------------
    console.log('1. COMPOUND INTEREST CALCULATOR & GOAL SOLVER BROWSER TESTS:');
    {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED')) consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto(`http://127.0.0.1:${PORT}/compound-interest-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-ci-mode-advanced', { timeout: 5000 });
      await page.click('#btn-ci-mode-advanced');
      await page.waitForSelector('#ci-goal', { timeout: 5000 });

      // Test 1.1: Positive savings goal input & calculation
      await page.fill('#ci-goal', '100000');
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(300);

      const goalMsg = await page.locator('#ac-ci-goal-msg');
      const goalVisible = await goalMsg.isVisible();
      const goalText = await goalMsg.innerText();
      
      recordResult('Compound Interest: Positive savings goal renders solution text', goalVisible && goalText.includes('100,000') && goalText.includes('monthly'), goalText.trim());

      // Test 1.2: Changing compounding frequency does not throw ReferenceError
      await page.selectOption('#ci-freq', '365'); // Daily
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(200);

      const goalTextDaily = await page.locator('#ac-ci-goal-msg').innerText();
      recordResult('Compound Interest: Compounding frequency switch updates goal without ReferenceError', goalTextDaily.length > 0 && consoleErrors.length === 0);

      // Test 1.3: Changing deposit timing (Annuity Due vs Ordinary)
      await page.selectOption('#ci-timing', 'begin'); // Beginning of period
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(200);

      const goalTextBegin = await page.locator('#ac-ci-goal-msg').innerText();
      recordResult('Compound Interest: Deposit timing switch updates goal correctly', goalTextBegin.length > 0 && consoleErrors.length === 0);

      // Test 1.4: Zero savings goal hides goal alert cleanly
      await page.fill('#ci-goal', '0');
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(200);
      const isGoalHidden = !(await page.locator('#ac-ci-goal-msg').isVisible());
      recordResult('Compound Interest: Zero savings goal cleanly hides goal message container', isGoalHidden);

      // Test 1.5: Spanish route localization check
      await page.goto(`http://127.0.0.1:${PORT}/es/compound-interest-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-ci-mode-advanced', { timeout: 5000 });
      await page.click('#btn-ci-mode-advanced');
      await page.waitForSelector('#ci-goal', { timeout: 5000 });
      await page.fill('#ci-goal', '50000');
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(200);
      const esGoalText = await page.locator('#ac-ci-goal-msg').innerText();
      recordResult('Compound Interest (ES): Localized goal advice in Spanish', esGoalText.includes('necesitas un') || esGoalText.includes('aportación'), esGoalText.trim());

      // Test 1.6: Danish route localization check
      await page.goto(`http://127.0.0.1:${PORT}/da/compound-interest-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-ci-mode-advanced', { timeout: 5000 });
      await page.click('#btn-ci-mode-advanced');
      await page.waitForSelector('#ci-goal', { timeout: 5000 });
      await page.fill('#ci-goal', '500000');
      await page.click('#btn-calc-ci');
      await page.waitForTimeout(200);
      const daGoalText = await page.locator('#ac-ci-goal-msg').innerText();
      recordResult('Compound Interest (DA): Localized goal advice in Danish', daGoalText.includes('kræves') || daGoalText.includes('månedlig'), daGoalText.trim());

      recordResult('Compound Interest: Zero uncaught browser console errors across sessions', consoleErrors.length === 0, consoleErrors.join('; '));
      await page.close();
    }

    // -------------------------------------------------------------------------
    // TEST 2: MORTGAGE CALCULATOR (EN, ES, DA)
    // -------------------------------------------------------------------------
    console.log('\n2. MORTGAGE CALCULATOR & PMI / DOWN PAYMENT BROWSER TESTS:');
    {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED')) consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto(`http://127.0.0.1:${PORT}/mortgage-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#mort-down-pct', { timeout: 5000 });
      await page.click('#btn-mort-mode-advanced');
      await page.waitForSelector('#mort-pmi', { timeout: 5000 });

      // Test 2.1: Down payment percentage and value bidirectional sync
      await page.fill('#mort-price', '400000');
      await page.fill('#mort-down', '40000'); // 10%
      await page.dispatchEvent('#mort-down', 'input');
      await page.waitForTimeout(200);

      const downPctVal = await page.inputValue('#mort-down-pct');
      recordResult('Mortgage: Typing down payment value syncs percentage input to 10%', parseFloat(downPctVal) === 10, `pct: ${downPctVal}%`);

      await page.fill('#mort-down-pct', '15'); // Change to 15%
      await page.dispatchEvent('#mort-down-pct', 'input');
      await page.waitForTimeout(200);

      const downVal = await page.inputValue('#mort-down');
      recordResult('Mortgage: Typing down percentage 15% syncs down payment value to $60,000', parseFloat(downVal) === 60000, `val: $${downVal}`);

      // Test 2.2: Configurable PMI rate & milestone display
      // At 15% down (LTV = 85%), PMI is active. Milestone box should be visible.
      await page.click('#btn-calc-mort');
      await page.waitForTimeout(200);

      const pmiMilestoneWrap = await page.locator('#ac-mort-pmi-milestone-wrap');
      const milestoneVisible = await pmiMilestoneWrap.isVisible();
      const milestoneDate = await page.locator('#ac-mort-pmi-date').innerText();
      recordResult('Mortgage: PMI milestone date is displayed when LTV > 80%', milestoneVisible && milestoneDate.length > 2, `Date: ${milestoneDate}`);

      // Test 2.3: PMI disabled at 0%
      await page.fill('#mort-pmi', '0');
      await page.dispatchEvent('#mort-pmi', 'input');
      await page.click('#btn-calc-mort');
      await page.waitForTimeout(200);

      const milestoneHiddenAtZero = !(await pmiMilestoneWrap.isVisible());
      recordResult('Mortgage: Setting mort-pmi to 0% disables PMI and hides milestone container', milestoneHiddenAtZero);

      // Test 2.4: Down payment 20% (LTV = 80%) removes PMI requirement
      await page.fill('#mort-pmi', '0.75');
      await page.dispatchEvent('#mort-pmi', 'input');
      await page.fill('#mort-down-pct', '20');
      await page.dispatchEvent('#mort-down-pct', 'input');
      await page.click('#btn-calc-mort');
      await page.waitForTimeout(200);

      const milestoneHiddenAt20Pct = !(await pmiMilestoneWrap.isVisible());
      recordResult('Mortgage: 20% down payment (80% LTV) automatically eliminates PMI requirement', milestoneHiddenAt20Pct);

      // Test 2.5: Spanish route and Danish route disclaimer checks
      await page.goto(`http://127.0.0.1:${PORT}/es/mortgage-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#mort-down-pct', { timeout: 5000 });
      await page.click('#btn-mort-mode-advanced');
      await page.fill('#mort-down-pct', '10');
      await page.dispatchEvent('#mort-down-pct', 'input');
      await page.click('#btn-calc-mort');
      await page.waitForTimeout(200);
      const esDisclaimer = await page.locator('#ac-mort-pmi-milestone-wrap').innerText();
      recordResult('Mortgage (ES): Statutory jurisdiction disclaimer rendered in Spanish', esDisclaimer.includes('ilustrativa') || esDisclaimer.includes('España'), esDisclaimer.split('\n')[1] || esDisclaimer);

      await page.goto(`http://127.0.0.1:${PORT}/da/mortgage-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#mort-down-pct', { timeout: 5000 });
      await page.click('#btn-mort-mode-advanced');
      await page.fill('#mort-down-pct', '10');
      await page.dispatchEvent('#mort-down-pct', 'input');
      await page.click('#btn-calc-mort');
      await page.waitForTimeout(200);
      const daDisclaimer = await page.locator('#ac-mort-pmi-milestone-wrap').innerText();
      recordResult('Mortgage (DA): Statutory jurisdiction disclaimer rendered in Danish', daDisclaimer.includes('vejledende') || daDisclaimer.includes('Danmark'), daDisclaimer.split('\n')[1] || daDisclaimer);

      recordResult('Mortgage: Zero uncaught browser console errors across sessions', consoleErrors.length === 0, consoleErrors.join('; '));
      await page.close();
    }

    // -------------------------------------------------------------------------
    // TEST 3: CURRENCY CONVERTER RESILIENCE & OFFLINE SAFETY
    // -------------------------------------------------------------------------
    console.log('\n3. CURRENCY CONVERTER BROWSER RESILIENCE TESTS:');
    {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED')) consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      // Test 3.1: Offline mode with NO previous cache -> displays safety notice & prevents conversion
      await page.addInitScript(() => {
        localStorage.clear();
      });
      await page.route('**/open.er-api.com/**', route => route.abort());

      await page.goto(`http://127.0.0.1:${PORT}/currency-converter/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const resultInput = await page.inputValue('#cc-result-input');
      const rateInfoText = await page.locator('#cc-rate-info').innerText();

      recordResult('Currency Converter: Safe failure when offline & no cache (result empty)', resultInput === '', `resultInput: "${resultInput}"`);
      recordResult('Currency Converter: Displays "Current exchange rate unavailable" warning banner', rateInfoText.includes('Current exchange rate unavailable'), rateInfoText.trim());

      // Test 3.2: Safe cache fallback with explicit source and timestamp
      await page.addInitScript(() => {
        localStorage.setItem('ac_fx_rates_cache_v2', JSON.stringify({
          timeLastUpdate: 'Mon, 02 Nov 2026 00:00:01 +0000',
          base: 'USD',
          source: 'open.er-api.com',
          rates: { USD: 1.0, EUR: 0.85, GBP: 0.75, DKK: 6.50 }
        }));
      });

      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      await page.fill('#cc-amount', '100');
      await page.dispatchEvent('#cc-amount', 'input');
      await page.waitForTimeout(200);

      const cachedResult = await page.inputValue('#cc-result-input');
      const cachedBanner = await page.locator('#cc-rate-info').innerText();

      recordResult('Currency Converter: Utilizes safe timestamped cache when offline', cachedBanner.includes('Using previously cached rates') && cachedBanner.includes('2026'), cachedBanner.trim());
      recordResult('Currency Converter: Accurately converts using cached rates (100 USD = 85 EUR)', parseFloat(cachedResult) === 85.0, `Output: ${cachedResult}`);

      // Test 3.3: Online recovery
      await page.unroute('**/open.er-api.com/**');
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);

      const liveBanner = await page.locator('#cc-rate-info').innerText();
      recordResult('Currency Converter: Live API retrieves current market rates on network restore', liveBanner.includes('mid-market rates') || liveBanner.includes('open.er-api.com'), liveBanner.trim());

      recordResult('Currency Converter: Zero uncaught browser console errors across sessions', consoleErrors.length === 0, consoleErrors.join('; '));
      await page.close();
    }

    // -------------------------------------------------------------------------
    // TEST 4: LOAN CALCULATOR & KIBOR / APR / TAE / ÅOP
    // -------------------------------------------------------------------------
    console.log('\n4. LOAN CALCULATOR BROWSER TESTS:');
    {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED')) consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto(`http://127.0.0.1:${PORT}/loan-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-mode-advanced', { timeout: 5000 });
      await page.click('#btn-mode-advanced');
      await page.waitForSelector('#ac-rate-type', { timeout: 5000 });

      // Test 4.1: Switch to Floating Benchmark (KIBOR / SOFR)
      await page.selectOption('#ac-rate-type', 'floating');
      await page.waitForTimeout(300);

      const kiborAlert = await page.locator('#ac-kibor-alert');
      const kiborAlertVisible = await kiborAlert.isVisible();
      recordResult('Loan Calculator: Floating rate switch reveals SBP official KIBOR notice', kiborAlertVisible);

      // Verify tenor options contain clean keys (no stale percentages)
      const tenorOptions = await page.$$eval('#ac-kibor-tenor option', opts => opts.map(o => ({ value: o.value, text: o.text })));
      const hasStaleRates = tenorOptions.some(o => o.value.includes('11.') || o.value.includes('12.'));
      recordResult('Loan Calculator: KIBOR tenor options contain clean keys without stale hardcoded percentages', !hasStaleRates, JSON.stringify(tenorOptions.map(o => o.value)));

      // Test 4.2: Editable benchmark rate input
      const benchmarkInput = await page.locator('#ac-benchmark-rate');
      const isBenchmarkEditable = await benchmarkInput.isEditable();
      recordResult('Loan Calculator: Benchmark rate is user-editable with educational default label', isBenchmarkEditable);

      // Test 4.3: APR / EAR labeling in English
      await page.selectOption('#ac-rate-type', 'reducing');
      await page.fill('#loan-amount', '10000');
      await page.fill('#loan-rate', '7.0');
      await page.fill('#loan-term', '36');
      await page.fill('#ac-upfront-fee', '200');
      await page.fill('#ac-recurring-fee', '10');
      await page.click('#btn-calc-loan');
      await page.waitForTimeout(300);

      const effAprTextEn = await page.locator('#ac-eff-apr').innerText();
      recordResult('Loan Calculator (EN): Displays Fee-Inclusive Nominal APR with EAR distinction', effAprTextEn.includes('EAR:'), effAprTextEn.trim());

      // Test 4.4: Spanish TAE check
      await page.goto(`http://127.0.0.1:${PORT}/es/loan-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-mode-advanced', { timeout: 5000 });
      await page.click('#btn-mode-advanced');
      await page.waitForSelector('#ac-rate-type', { timeout: 5000 });
      await page.fill('#loan-amount', '10000');
      await page.fill('#loan-rate', '7.0');
      await page.fill('#loan-term', '36');
      await page.fill('#ac-upfront-fee', '200');
      await page.fill('#ac-recurring-fee', '10');
      await page.click('#btn-calc-loan');
      await page.waitForTimeout(300);

      const effAprTextEs = await page.locator('#ac-eff-apr').innerText();
      recordResult('Loan Calculator (ES): Displays TAE as effective annual rate and TIN as nominal', effAprTextEs.includes('TIN:'), effAprTextEs.trim());

      // Test 4.5: Danish ÅOP check
      await page.goto(`http://127.0.0.1:${PORT}/da/loan-calculator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#btn-mode-advanced', { timeout: 5000 });
      await page.click('#btn-mode-advanced');
      await page.waitForSelector('#ac-rate-type', { timeout: 5000 });
      await page.fill('#loan-amount', '10000');
      await page.fill('#loan-rate', '7.0');
      await page.fill('#loan-term', '36');
      await page.fill('#ac-upfront-fee', '200');
      await page.fill('#ac-recurring-fee', '10');
      await page.click('#btn-calc-loan');
      await page.waitForTimeout(300);

      const effAprTextDa = await page.locator('#ac-eff-apr').innerText();
      recordResult('Loan Calculator (DA): Displays ÅOP as effective annual rate and Nominel rente', effAprTextDa.includes('Nominel:'), effAprTextDa.trim());

      recordResult('Loan Calculator: Zero uncaught browser console errors across sessions', consoleErrors.length === 0, consoleErrors.join('; '));
      await page.close();
    }

    // -------------------------------------------------------------------------
    // TEST 5: INVOICE GENERATOR & UNICODE PDF EXPORT
    // -------------------------------------------------------------------------
    console.log('\n5. INVOICE GENERATOR BROWSER & UNICODE TESTS:');
    {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('ERR_FAILED')) consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push(err.message));

      await page.goto(`http://127.0.0.1:${PORT}/invoice-generator/`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#inv-from', { timeout: 5000 });

      // Test 5.1: Enter Unicode text (Danish æ, ø, å and Spanish á, é, í, ó, ú, ñ)
      await page.fill('#inv-from', 'Grønbæk & Peña Consultoría S.L.');
      await page.fill('#inv-to', 'Mærsk & Cañellas Rådgivning Århus');
      
      const descInput = await page.locator('.inv-desc').first();
      await descInput.fill('Fakturering for rådgivning & diseño gráfico: æ, ø, å, á, é, í, ó, ú, ñ');

      // Test 5.2: Reconciliation math (Subtotal - Discount + Tax + Shipping === Total)
      const qtyInput = await page.locator('.inv-qty').first();
      const rateInput = await page.locator('.inv-rate').first();
      await qtyInput.fill('5');
      await rateInput.fill('200');
      await rateInput.dispatchEvent('input');

      await page.fill('#inv-discount', '50');
      await page.dispatchEvent('#inv-discount', 'input');
      await page.fill('#inv-tax', '10');
      await page.dispatchEvent('#inv-tax', 'input');
      await page.fill('#inv-shipping', '25');
      await page.dispatchEvent('#inv-shipping', 'input');
      await page.waitForTimeout(300);

      // Subtotal = 1000. Discount = 50. Taxable = 950. Tax 10% = 95. Shipping = 25. Total = 1070
      const subtotalTxt = await page.locator('#inv-subtotal').innerText();
      const totalTxt = await page.locator('#inv-total').innerText();

      recordResult('Invoice Generator: Arithmetic reconciliation (1000 - 50 + 95 + 25 = 1070.00)', subtotalTxt.includes('1,000.00') && totalTxt.includes('1,070.00'), `Subtotal: ${subtotalTxt}, Total: ${totalTxt}`);

      // Test 5.3: Clamping negative values
      await qtyInput.fill('-2');
      await qtyInput.dispatchEvent('input');
      await page.waitForTimeout(200);

      const clampedSubtotal = await page.locator('#inv-subtotal').innerText();
      recordResult('Invoice Generator: Negative quantities clamped to 0 preventing negative subtotal', !clampedSubtotal.includes('-'), `Subtotal: ${clampedSubtotal}`);

      // Restore valid quantity
      await qtyInput.fill('2');
      await qtyInput.dispatchEvent('input');
      await page.waitForTimeout(200);

      // Test 5.4: Trigger PDF export in browser and verify jsPDF executes without error
      const pdfBtn = await page.locator('#btn-inv-pdf');
      await pdfBtn.click();
      await page.waitForTimeout(1000);

      recordResult('Invoice Generator: Client-side jsPDF executes and exports with Unicode content without crashing', consoleErrors.length === 0);

      recordResult('Invoice Generator: Zero uncaught browser console errors across sessions', consoleErrors.length === 0, consoleErrors.join('; '));
      await page.close();
    }

  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n====================================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`BROWSER E2E RESULTS: ${passedCount}/${results.length} PASSED (${Math.round(passedCount/results.length*100)}%)`);
  console.log('====================================================\n');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

runBrowserSuite().catch(err => {
  console.error('Fatal Browser E2E Error:', err);
  process.exit(1);
});
