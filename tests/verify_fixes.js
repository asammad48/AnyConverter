const path = require('path');
const { chromium } = require(path.join('C:/Users/abdul.sammad/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules', '@playwright/test'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  console.log('--- TEST 1: JSON Formatter Editor Heights ---');
  for (const w of [1920, 1440, 1366, 1280, 1152, 1024, 768]) {
    const page = await browser.newPage({ viewport: { width: w, height: 768 } });
    await page.goto('http://localhost:5000/json-formatter/');
    await page.waitForTimeout(300);
    const heights = await page.evaluate(() => {
      const inp = document.getElementById('json-input');
      const out = document.getElementById('json-output');
      return {
        inp: inp ? inp.offsetHeight : null,
        out: out ? out.offsetHeight : null
      };
    });
    console.log('Width ' + w + ':', heights);
    await page.close();
  }

  console.log('\n--- TEST 2: Numerology Alignment ---');
  for (const w of [1920, 1366, 1152, 1024, 768]) {
    const page = await browser.newPage({ viewport: { width: w, height: 768 } });
    await page.goto('http://localhost:5000/numerology-calculator/');
    await page.waitForTimeout(300);
    const alignment = await page.evaluate(() => {
      const dob = document.getElementById('nu-dob');
      const name = document.getElementById('nu-name');
      const r1 = dob ? dob.getBoundingClientRect() : null;
      const r2 = name ? name.getBoundingClientRect() : null;
      return {
        dobY: r1 ? Math.round(r1.top) : null,
        nameY: r2 ? Math.round(r2.top) : null,
        diffY: (r1 && r2) ? Math.round(Math.abs(r1.top - r2.top)) : null
      };
    });
    console.log('Width ' + w + ':', alignment);
    await page.close();
  }

  console.log('\n--- TEST 3: Calorie Calculator Gender Checkbox/Radio Alignment ---');
  for (const w of [1920, 1366, 1152, 1024, 768]) {
    const page = await browser.newPage({ viewport: { width: w, height: 768 } });
    await page.goto('http://localhost:5000/calorie-calculator/');
    await page.waitForTimeout(300);
    const cal = await page.evaluate(() => {
      const age = document.getElementById('cal-age');
      const gLabel = document.querySelector('.cal-gender-label');
      const rAge = age ? age.getBoundingClientRect() : null;
      const rGen = gLabel ? gLabel.getBoundingClientRect() : null;
      return {
        ageH: rAge ? Math.round(rAge.height) : null,
        genH: rGen ? Math.round(rGen.height) : null,
        ageY: rAge ? Math.round(rAge.top) : null,
        genY: rGen ? Math.round(rGen.top) : null,
        diffY: (rAge && rGen) ? Math.round(Math.abs(rAge.top - rGen.top)) : null
      };
    });
    console.log('Width ' + w + ':', cal);
    await page.close();
  }

  console.log('\n--- TEST 4: PDF Tools Theme & White Left Area ---');
  for (const tool of ['pdf-merge', 'pdf-compress', 'pdf-split']) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto('http://localhost:5000/' + tool + '/');
    await page.waitForTimeout(300);
    const pdfStyles = await page.evaluate(() => {
      const sec = document.querySelector('.dc-root section[aria-label]');
      const hero = document.querySelector('.dc-root > div:first-child');
      const btn = document.querySelector('.dc-root label, .dc-root button');
      return {
        heroBg: hero ? getComputedStyle(hero).backgroundColor : null,
        secBg: sec ? getComputedStyle(sec).backgroundColor : null,
        secBorder: sec ? getComputedStyle(sec).borderColor : null,
        btnBg: btn ? getComputedStyle(btn).backgroundColor : null
      };
    });
    console.log(tool + ':', pdfStyles);
    await page.close();
  }

  console.log('\n--- TEST 5: Button & Header Alignment across tools ---');
  for (const tool of ['json-compare', 'xml-formatter', 'regex-tester', 'invoice-generator']) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto('http://localhost:5000/' + tool + '/');
    await page.waitForTimeout(300);
    const btns = await page.evaluate(() => {
      const up = document.querySelector('label.ac-btn');
      const clr = document.querySelector('.ac-panel-actions button.ac-btn');
      const rUp = up ? up.getBoundingClientRect() : null;
      const rClr = clr ? clr.getBoundingClientRect() : null;
      const flags = document.querySelectorAll('.flag-btn');
      return {
        upHeight: rUp ? Math.round(rUp.height) : null,
        clrHeight: rClr ? Math.round(rClr.height) : null,
        upTop: rUp ? Math.round(rUp.top) : null,
        clrTop: rClr ? Math.round(rClr.top) : null,
        diffTop: (rUp && rClr) ? Math.round(Math.abs(rUp.top - rClr.top)) : null,
        flagCount: flags.length,
        flagH: flags[0] ? Math.round(flags[0].getBoundingClientRect().height) : null,
        flagW: flags[0] ? Math.round(flags[0].getBoundingClientRect().width) : null
      };
    });
    console.log(tool + ':', btns);
    await page.close();
  }

  console.log('\n--- TEST 6: Horizontal Overflow Check Across Viewports ---');
  for (const tool of ['json-formatter', 'json-compare', 'xml-formatter', 'regex-tester', 'invoice-generator', 'numerology-calculator', 'calorie-calculator', 'pdf-merge', 'pdf-compress', 'pdf-split']) {
    for (const w of [1920, 1366, 1152, 1024, 768, 390]) {
      const page = await browser.newPage({ viewport: { width: w, height: 768 } });
      await page.goto('http://localhost:5000/' + tool + '/');
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(() => {
        return {
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });
      if (overflow.hasHScroll) {
        console.error(`OVERFLOW on ${tool} at ${w}px: scrollW=${overflow.scrollW}, clientW=${overflow.clientW}`);
      }
      await page.close();
    }
  }
  console.log('All 10 tools checked across 6 viewports (60 viewport tests) for horizontal overflow.');

  await browser.close();
  console.log('\nALL VERIFICATION TESTS COMPLETED.');
})();
