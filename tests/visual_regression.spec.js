const { test, expect } = require('@playwright/test');

/**
 * AnyConverter — Visual Regression Protection Suite
 * Genuine screenshot comparisons using expect(page).toHaveScreenshot()
 * across reviewed reference baselines for:
 * 1. JSON Formatter
 * 2. JSON Compare
 * 3. CSV to SQL
 * 4. Mortgage Calculator
 * 5. Loan Calculator
 * 6. Pay Raise Calculator
 * 7. Percentage Difference Calculator
 *
 * Tested across laptop (1366x768), desktop (1920x1080), and mobile (390x844).
 */

async function stabilizePage(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const style = document.createElement('style');
    style.id = 'visual-qa-stabilizer';
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      .adsbygoogle, .ad-slot, ins.adsbygoogle {
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
}

test.describe('Visual Regression Suite — Meaningful Tool States', () => {

  test('JSON Formatter — Formatted State with Toolbar', async ({ page }) => {
    await page.goto('/json-formatter/');
    await page.fill('#json-input', JSON.stringify({
      name: 'AnyConverter',
      category: 'Developer Utilities',
      stats: { users: 10000, tools: 147, active: true },
      tags: ['json', 'sql', 'calculator', 'offline']
    }, null, 2));
    await page.click('#btn-format-top');
    await page.waitForSelector('#json-output .j-line', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('json-formatter-formatted.png');
  });

  test('JSON Compare — Side-by-Side Diff State', async ({ page }) => {
    await page.goto('/json-compare/');
    await page.fill('#jc-a', JSON.stringify({
      service: 'AnyConverter API',
      version: '1.0.0',
      enabled: true,
      endpoints: ['/format', '/compare']
    }, null, 2));
    await page.fill('#jc-b', JSON.stringify({
      service: 'AnyConverter API',
      version: '2.0.0',
      enabled: true,
      endpoints: ['/format', '/compare', '/convert'],
      license: 'MIT'
    }, null, 2));
    await page.click('#btn-compare-jc');
    await page.waitForSelector('#jc-result:not([style*="display: none"])', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('json-compare-diff.png');
  });

  test('CSV to SQL — Preview & Generated SQL State', async ({ page }) => {
    await page.goto('/csv-to-sql/');
    await page.fill('#csv-input', 'id,name,role,department,salary\n101,John Doe,Developer,Engineering,95000\n102,Jane Smith,Designer,Design,90000\n103,Alex Brown,Analyst,Data,85000');
    await page.click('#btn-parse-csv');
    await page.waitForSelector('#csv-preview-table table', { timeout: 5000 });
    await page.click('#btn-generate-sql');
    await page.waitForSelector('#sql-output-section:not([style*="display: none"])', { timeout: 5000 });
    await page.waitForSelector('#sql-output-code', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('csv-to-sql-generated.png');
  });

  test('Mortgage Calculator — Form Alignment & Calculation State', async ({ page }) => {
    await page.goto('/mortgage-calculator/');
    await page.fill('#mort-price', '450000');
    await page.fill('#mort-down', '90000');
    await page.fill('#mort-rate', '6.25');
    await page.selectOption('#mort-term', '30');
    await page.click('#btn-calc-mort');
    await page.waitForSelector('#mort-result:not([style*="display: none"])', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('mortgage-calculator-results.png');
  });

  test('Loan Calculator — Segmented Baseline & EMI State', async ({ page }) => {
    await page.goto('/loan-calculator/');
    await page.fill('#loan-amount', '35000');
    await page.fill('#loan-rate', '7.25');
    await page.fill('#loan-term', '5');
    await page.click('#btn-calc-loan');
    await page.waitForSelector('#loan-result:not([style*="display: none"])', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('loan-calculator-results.png');
  });

  test('Pay Raise Calculator — 44px Controls & Raise Breakdown State', async ({ page }) => {
    await page.goto('/pay-rise-calculator/');
    await page.fill('#pr-cur', '75000');
    await page.selectOption('#pr-per', 'year');
    await page.fill('#pr-pct', '7.5');
    await page.evaluate(() => {
      document.getElementById('pr-cur').dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('pr-pct').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForSelector('#pr-out:not([hidden])', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('pay-raise-calculator-results.png');
  });

  test('Percentage Difference Calculator — Guide Note & Difference State', async ({ page }) => {
    await page.goto('/percentage-difference-calculator/');
    await page.fill('#pd-a', '125');
    await page.fill('#pd-b', '175');
    await page.evaluate(() => {
      document.getElementById('pd-a').dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('pd-b').dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForSelector('#pd-out:not([hidden])', { timeout: 5000 });
    await stabilizePage(page);
    await expect(page).toHaveScreenshot('percentage-difference-results.png');
  });

});
