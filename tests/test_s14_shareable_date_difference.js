/**
 * Sprint S14 Automated Verification Suite:
 * Shareable Calculator State: Date Difference / Age Calculator (/age-calculator/) across EN, ES, DA
 *
 * Verifies:
 * 1. Share button existence (#btn-share-age, #btn-share-result) & accessible feedback (#age-share-feedback) across EN, ES, DA
 * 2. WCAG 2.2 AA :focus-visible styling (2px solid #B04A45, 2px offset) & ARIA attributes
 * 3. Compact & versioned parameter schema (v=1&from=YYYY-MM-DD&to=YYYY-MM-DD)
 * 4. Locale-aware formatting across English, Spanish, and Danish (separators, units, next birthday milestone)
 * 5. State hydration and automatic calculation on page load with valid parameters across all 3 locales
 * 6. Fail-safe fallback and error recovery on malformed query strings (?v=999, invalid dates, inverted dates)
 * 7. SEO invariants: clean canonical tags preserved on EN, ES, DA; dynamic noindex on parameterized URLs
 * 8. Non-empty clipboard text generation on explicit click (no auto-share / no silent address bar mutation)
 * 9. Telemetry integration via window.ACAnalytics (share_link_generated)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('----------------------------------------------------');
console.log(' RUNNING SPRINT S14 SHAREABLE DATE DIFFERENCE SUITE ');
console.log('----------------------------------------------------');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

const rootDir = path.join(__dirname, '..');

// ============================================================================
// 1. Static HTML & Multilingual Schema Inspection (EN, ES, DA)
// ============================================================================
const enHtmlPath = path.join(rootDir, 'age-calculator', 'index.html');
const esHtmlPath = path.join(rootDir, 'es', 'age-calculator', 'index.html');
const daHtmlPath = path.join(rootDir, 'da', 'age-calculator', 'index.html');

const enHtml = fs.readFileSync(enHtmlPath, 'utf8');
const esHtml = fs.readFileSync(esHtmlPath, 'utf8');
const daHtml = fs.readFileSync(daHtmlPath, 'utf8');

it('HTML (EN): Contains explicit #btn-share-age, #btn-share-result, and live region', () => {
  assert(enHtml.includes('id="btn-share-age"'), 'Missing #btn-share-age in age-calculator/index.html');
  assert(enHtml.includes('aria-label="Share calculation link"'), 'Missing aria-label on EN #btn-share-age');
  assert(enHtml.includes('Share calculation'), 'Missing "Share calculation" text in EN');
  assert(enHtml.includes('id="btn-share-result"'), 'Missing #btn-share-result in EN');
  assert(enHtml.includes('id="age-share-feedback"'), 'Missing #age-share-feedback live region in EN');
  assert(enHtml.includes('role="status"'), 'Missing role="status" in EN live region');
  assert(enHtml.includes('aria-live="polite"'), 'Missing aria-live="polite" in EN live region');
});

it('HTML (ES): Contains explicit localized #btn-share-age, #btn-share-result, and Spanish feedback', () => {
  assert(esHtml.includes('id="btn-share-age"'), 'Missing #btn-share-age in es/age-calculator/index.html');
  assert(esHtml.includes('aria-label="Compartir enlace de cálculo"'), 'Missing aria-label on ES #btn-share-age');
  assert(esHtml.includes('Compartir cálculo'), 'Missing "Compartir cálculo" text in ES');
  assert(esHtml.includes('id="btn-share-result"'), 'Missing #btn-share-result in ES');
  assert(esHtml.includes('id="age-share-feedback"'), 'Missing #age-share-feedback live region in ES');
  assert(esHtml.includes('¡Enlace copiado al portapapeles!'), 'Missing Spanish feedback copy in ES');
});

it('HTML (DA): Contains explicit localized #btn-share-age, #btn-share-result, and Danish feedback', () => {
  assert(daHtml.includes('id="btn-share-age"'), 'Missing #btn-share-age in da/age-calculator/index.html');
  assert(daHtml.includes('aria-label="Del beregningslink"'), 'Missing aria-label on DA #btn-share-age');
  assert(daHtml.includes('Del beregning'), 'Missing "Del beregning" text in DA');
  assert(daHtml.includes('id="btn-share-result"'), 'Missing #btn-share-result in DA');
  assert(daHtml.includes('id="age-share-feedback"'), 'Missing #age-share-feedback live region in DA');
  assert(daHtml.includes('Link kopieret til udklipsholder!'), 'Missing Danish feedback copy in DA');
});

it('HTML: Clean canonical tags preserved across all 3 locales without query parameters', () => {
  assert(enHtml.includes('<link rel="canonical" href="https://anyconverter.io/age-calculator/">'));
  assert(esHtml.includes('<link rel="canonical" href="https://anyconverter.io/es/age-calculator/">'));
  assert(daHtml.includes('<link rel="canonical" href="https://anyconverter.io/da/age-calculator/">'));
});

// ============================================================================
// 2. CSS & WCAG 2.2 AA Focus-Visible Inspection
// ============================================================================
const cssPath = path.join(rootDir, 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

it('CSS: #btn-share-age:focus-visible has 2px solid #B04A45 outline and 2px offset', () => {
  assert(cssContent.includes('#btn-share-age:focus-visible'), 'Missing #btn-share-age:focus-visible rule in style.css');
  const match = cssContent.match(/#btn-share-age:focus-visible[^\{]*\{([^}]+)\}/);
  assert(match, 'Failed to match #btn-share-age:focus-visible block');
  assert(match[1].includes('2px solid #B04A45'), 'Missing 2px solid #B04A45 outline');
  assert(match[1].includes('outline-offset: 2px'), 'Missing outline-offset: 2px');
});

// ============================================================================
// 3. Behavioral Simulation: Encoding & Locale-Aware URL Generation
// ============================================================================
function createDomEnvironment(queryString, pathname, lang) {
  const elements = {};

  function makeEl(id, tagName, initialAttrs) {
    const el = {
      id: id,
      tagName: tagName || 'div',
      className: '',
      style: { display: '' },
      value: '',
      textContent: '',
      attributes: Object.assign({}, initialAttrs || {}),
      children: [],
      addEventListener: function(event, handler) {
        if (!this._listeners) this._listeners = {};
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(handler);
      },
      click: function() {
        if (this._listeners && this._listeners['click']) {
          this._listeners['click'].forEach(h => h.call(this, { type: 'click', target: this }));
        }
      },
      setAttribute: function(name, val) { this.attributes[name] = String(val); },
      getAttribute: function(name) { return this.attributes[name] || null; },
      querySelector: function(sel) {
        if (sel === 'span' && this.children.length > 0) return this.children[0];
        return null;
      }
    };
    elements[id] = el;
    return el;
  }

  makeEl('birth-date', 'input');
  makeEl('target-date', 'input');
  makeEl('btn-calc-age', 'button');
  makeEl('btn-reset-age', 'button');

  const shareBtn = makeEl('btn-share-age', 'button');
  const spanChild = { textContent: 'Share calculation' };
  shareBtn.children.push(spanChild);

  makeEl('btn-share-result', 'button');
  makeEl('age-share-feedback', 'span');
  makeEl('age-years', 'div');
  makeEl('age-months', 'div');
  makeEl('age-days', 'div');
  makeEl('age-total-days', 'div');
  makeEl('age-next-bday', 'div');
  makeEl('age-result', 'div');

  const metaRobots = {
    name: 'robots',
    attributes: { content: 'index, follow' },
    setAttribute: function(k, v) { this.attributes[k] = v; },
    getAttribute: function(k) { return this.attributes[k]; }
  };

  const canonicalLink = {
    rel: 'canonical',
    attributes: { href: 'https://anyconverter.io' + (pathname || '/age-calculator/') },
    getAttribute: function(k) { return this.attributes[k]; }
  };

  const trackedEvents = [];

  const mockWindow = {
    location: {
      origin: 'https://anyconverter.io',
      pathname: pathname || '/age-calculator/',
      search: queryString || '',
      href: 'https://anyconverter.io' + (pathname || '/age-calculator/') + (queryString || '')
    },
    navigator: {
      clipboard: {
        writeText: function(text) {
          mockWindow._lastCopiedShareUrl = text;
          return Promise.resolve();
        }
      }
    },
    ACAnalytics: {
      trackShareLinkGenerated: function(toolSlug, mode, status) {
        trackedEvents.push({ toolSlug, mode: String(mode), status });
      },
      track: function(name, payload) {
        trackedEvents.push({ name, payload });
      }
    },
    _lastCopiedShareUrl: null
  };

  const mockDoc = {
    documentElement: { lang: lang || 'en' },
    getElementById: function(id) { return elements[id] || null; },
    querySelector: function(sel) {
      if (sel === 'meta[name="robots"]') return metaRobots;
      if (sel === 'link[rel="canonical"]') return canonicalLink;
      return null;
    },
    createElement: function(tag) { return makeEl('tmp_' + Math.random(), tag); },
    head: { appendChild: function() {} },
    body: { appendChild: function() {}, removeChild: function() {} },
    readyState: 'complete'
  };

  return { mockWindow, mockDoc, elements, metaRobots, canonicalLink, trackedEvents };
}

const ageModule = require(path.join(rootDir, 'assets', 'js', 'tools', 'age-calculator.js'));

it('Encoding (EN): Generates compact, versioned URL with from & to dates', () => {
  const env = createDomEnvironment('', '/age-calculator/', 'en');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  global.navigator = env.mockWindow.navigator;

  env.elements['birth-date'].value = '1995-05-12';
  env.elements['target-date'].value = '2026-11-20';

  const shareUrl = ageModule.generateShareUrl();
  assert(shareUrl.startsWith('https://anyconverter.io/age-calculator/?'), 'Invalid EN base URL');
  assert(shareUrl.includes('v=1'), 'Missing v=1');
  assert(shareUrl.includes('from=1995-05-12'), 'Missing from=1995-05-12');
  assert(shareUrl.includes('to=2026-11-20'), 'Missing to=2026-11-20');
});

it('Encoding (ES): Generates Spanish locale URL with /es/ prefix', () => {
  const env = createDomEnvironment('', '/es/age-calculator/', 'es');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  env.elements['birth-date'].value = '1988-10-30';
  env.elements['target-date'].value = '2026-11-20';

  const shareUrl = ageModule.generateShareUrl();
  assert(shareUrl.startsWith('https://anyconverter.io/es/age-calculator/?'), 'Invalid ES base URL');
  assert(shareUrl.includes('from=1988-10-30'));
});

it('Encoding (DA): Generates Danish locale URL with /da/ prefix', () => {
  const env = createDomEnvironment('', '/da/age-calculator/', 'da');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  env.elements['birth-date'].value = '2002-03-25';
  env.elements['target-date'].value = '2026-11-20';

  const shareUrl = ageModule.generateShareUrl();
  assert(shareUrl.startsWith('https://anyconverter.io/da/age-calculator/?'), 'Invalid DA base URL');
  assert(shareUrl.includes('from=2002-03-25'));
});

// ============================================================================
// 4. State Hydration & Calculation across EN, ES, DA
// ============================================================================
it('Hydration (EN): Auto-populates dates and executes calculation with English formatting', () => {
  const env = createDomEnvironment('?v=1&from=1990-06-15&to=2026-11-20', '/age-calculator/', 'en');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  ageModule.hydrateFromUrl();

  assert.strictEqual(env.elements['birth-date'].value, '1990-06-15');
  assert.strictEqual(env.elements['target-date'].value, '2026-11-20');
  assert.strictEqual(env.elements['age-years'].textContent, 36);
  assert.strictEqual(env.elements['age-months'].textContent, 5);
  assert.strictEqual(env.elements['age-days'].textContent, 5);
  assert.strictEqual(env.elements['age-result'].style.display, 'block');
  assert(env.elements['age-total-days'].textContent.includes('13'), 'Total days calculated');
});

it('Hydration (ES): Formats results with Spanish locale conventions', () => {
  const env = createDomEnvironment('?v=1&from=1990-06-15&to=2026-11-20', '/es/age-calculator/', 'es');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  ageModule.hydrateFromUrl();

  assert.strictEqual(env.elements['age-years'].textContent, 36);
  assert.strictEqual(env.elements['age-result'].style.display, 'block');
  assert(env.elements['age-next-bday'].textContent.includes('días') || env.elements['age-next-bday'].textContent.includes('día') || env.elements['age-next-bday'].textContent.includes('¡Hoy!'));
});

it('Hydration (DA): Formats results with Danish locale conventions', () => {
  const env = createDomEnvironment('?v=1&from=1990-06-15&to=2026-11-20', '/da/age-calculator/', 'da');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  ageModule.hydrateFromUrl();

  assert.strictEqual(env.elements['age-years'].textContent, 36);
  assert.strictEqual(env.elements['age-result'].style.display, 'block');
  assert(env.elements['age-next-bday'].textContent.includes('dage') || env.elements['age-next-bday'].textContent.includes('dag') || env.elements['age-next-bday'].textContent.includes('I dag!'));
});

// ============================================================================
// 5. Fail-Safe Fallback & Error Recovery
// ============================================================================
it('Fail-safe: Resets gracefully on unsupported version ?v=999 without throwing', () => {
  const env = createDomEnvironment('?v=999&from=1990-06-15&to=2026-11-20', '/age-calculator/', 'en');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    ageModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['age-result'].style.display, 'none');
  assert.strictEqual(env.elements['birth-date'].value, '');
});

it('Fail-safe: Resets gracefully on malformed / unparseable dates (?from=not-a-date)', () => {
  const env = createDomEnvironment('?v=1&from=invalid-date&to=2026-11-20', '/age-calculator/', 'en');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    ageModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['age-result'].style.display, 'none');
});

it('Fail-safe: Resets gracefully on inverted chronological dates (from > to)', () => {
  const env = createDomEnvironment('?v=1&from=2030-01-01&to=2020-01-01', '/age-calculator/', 'en');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    ageModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['age-result'].style.display, 'none');
});

// ============================================================================
// 6. SEO Invariants: Canonical Link Integrity & Dynamic noindex
// ============================================================================
it('SEO: Canonical link remains strictly clean across all locales', () => {
  ['/age-calculator/', '/es/age-calculator/', '/da/age-calculator/'].forEach(p => {
    const env = createDomEnvironment('?v=1&from=1990-06-15&to=2026-11-20', p);
    global.window = env.mockWindow;
    global.document = env.mockDoc;

    ageModule.hydrateFromUrl();
    assert.strictEqual(
      env.canonicalLink.getAttribute('href'),
      'https://anyconverter.io' + p,
      `Canonical link for ${p} must remain clean without query params`
    );
  });
});

it('SEO: Dynamically sets meta[name="robots"] to "noindex, follow" on parameterized URLs', () => {
  const env = createDomEnvironment('?v=1&from=1990-06-15&to=2026-11-20', '/age-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  ageModule.hydrateFromUrl();
  assert.strictEqual(
    env.metaRobots.getAttribute('content'),
    'noindex, follow',
    'Parameterized date calculation must have noindex, follow'
  );
});

// ============================================================================
// 7. Explicit Share Trigger, Clipboard Text & Telemetry
// ============================================================================
it('Share Action: Explicit click copies URL and emits telemetry across locales', () => {
  [
    { path: '/age-calculator/', lang: 'en', expectedText: 'Link copied to clipboard!' },
    { path: '/es/age-calculator/', lang: 'es', expectedText: '¡Enlace copiado al portapapeles!' },
    { path: '/da/age-calculator/', lang: 'da', expectedText: 'Link kopieret til udklipsholder!' }
  ].forEach(({ path, lang, expectedText }) => {
    const env = createDomEnvironment('', path, lang);
    global.window = env.mockWindow;
    global.document = env.mockDoc;
    global.navigator = env.mockWindow.navigator;

    env.elements['birth-date'].value = '1992-04-18';
    env.elements['target-date'].value = '2026-11-20';

    ageModule.triggerShare();

    assert(env.mockWindow._lastCopiedShareUrl, `Clipboard must receive non-empty URL in ${lang}`);
    assert(
      env.mockWindow._lastCopiedShareUrl.includes(path + '?v=1&from=1992-04-18&to=2026-11-20'),
      `Unexpected copied URL in ${lang}: ${env.mockWindow._lastCopiedShareUrl}`
    );
    assert.strictEqual(env.elements['age-share-feedback'].textContent, expectedText);
    assert.strictEqual(env.elements['age-share-feedback'].style.display, 'inline-flex');

    const shareEvent = env.trackedEvents.find(e => e.toolSlug === 'age-calculator');
    assert(shareEvent, `Missing telemetry event for ${lang}`);
    assert.strictEqual(shareEvent.mode, lang);
    assert.strictEqual(shareEvent.status, 'success');
  });
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
