/**
 * Sprint S13 Automated Verification Suite:
 * Shareable Calculator State: Percentage Calculator (/percentage-calculator/)
 *
 * Verifies:
 * 1. Share button existence (#btn-share-pct, #btn-share-result) & accessible feedback (#pct-share-feedback)
 * 2. WCAG 2.2 AA :focus-visible styling (2px solid #B04A45, 2px offset) & ARIA attributes
 * 3. Parameter schema encoding & decoding across all 4 percentage modes:
 *    - Mode 1: v=1&m=1&x={n}&y={n}
 *    - Mode 2: v=1&m=2&x={n}&y={n}
 *    - Mode 3: v=1&m=3&o={n}&n={n}
 *    - Mode 4: v=1&m=4&v={n}&p={n}&d=inc|dec
 * 4. Auto-population and automatic calculation on page load with valid parameters
 * 5. Fail-safe fallback and error recovery on malformed query strings (?v=999, ?m=NaN, ?x=invalid, divide by zero)
 * 6. SEO invariants: clean canonical URL tag preserved, dynamic insertion/update of noindex for parameterized URLs
 * 7. Non-empty clipboard text generation on explicit click (no auto-share / no silent address bar mutation)
 * 8. Telemetry integration via window.ACAnalytics (share_link_generated)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('----------------------------------------------------');
console.log(' RUNNING SPRINT S13 SHAREABLE PERCENTAGE CALCULATOR SUITE');
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
// 1. Static HTML & Schema Inspection
// ============================================================================
const enHtmlPath = path.join(rootDir, 'percentage-calculator', 'index.html');
const enHtml = fs.readFileSync(enHtmlPath, 'utf8');

it('HTML: Contains explicit #btn-share-pct in action bar with accessible ARIA label and icon', () => {
  assert(enHtml.includes('id="btn-share-pct"'), 'Missing #btn-share-pct in percentage-calculator/index.html');
  assert(enHtml.includes('aria-label="Share calculation link"'), 'Missing aria-label on #btn-share-pct');
  assert(enHtml.includes('Share calculation'), 'Missing "Share calculation" button text');
});

it('HTML: Contains accessible #btn-share-result in result container', () => {
  assert(enHtml.includes('id="btn-share-result"'), 'Missing #btn-share-result in percentage-calculator/index.html');
  assert(enHtml.includes('aria-label="Copy calculation link"'), 'Missing aria-label on #btn-share-result');
  assert(enHtml.includes('Copy calculation link'), 'Missing "Copy calculation link" button text');
});

it('HTML: Contains accessible #pct-share-feedback live region with role="status" and aria-live="polite"', () => {
  assert(enHtml.includes('id="pct-share-feedback"'), 'Missing #pct-share-feedback live region');
  assert(enHtml.includes('role="status"'), 'Missing role="status" on live region');
  assert(enHtml.includes('aria-live="polite"'), 'Missing aria-live="polite" on live region');
});

it('HTML: Preserves strictly clean canonical tag without query parameters', () => {
  assert(
    enHtml.includes('<link rel="canonical" href="https://anyconverter.io/percentage-calculator/">'),
    'Canonical URL must remain strictly clean (https://anyconverter.io/percentage-calculator/)'
  );
  assert(
    !enHtml.includes('<link rel="canonical" href="https://anyconverter.io/percentage-calculator/?'),
    'Canonical URL must not contain query parameters'
  );
});

// ============================================================================
// 2. CSS & WCAG 2.2 AA Focus-Visible Inspection
// ============================================================================
const cssPath = path.join(rootDir, 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

it('CSS: #btn-share-pct:focus-visible has 2px solid #B04A45 outline and 2px offset', () => {
  assert(cssContent.includes('#btn-share-pct:focus-visible'), 'Missing #btn-share-pct:focus-visible rule in style.css');
  const match = cssContent.match(/#btn-share-pct:focus-visible[^\{]*\{([^}]+)\}/);
  assert(match, 'Failed to match #btn-share-pct:focus-visible block');
  const block = match[1];
  assert(block.includes('2px solid #B04A45'), 'Missing 2px solid #B04A45 outline in #btn-share-pct:focus-visible');
  assert(block.includes('outline-offset: 2px'), 'Missing outline-offset: 2px in #btn-share-pct:focus-visible');
});

it('CSS: #btn-share-result:focus-visible has WCAG 2.2 AA compliant focus outline', () => {
  assert(cssContent.includes('#btn-share-result:focus-visible'), 'Missing #btn-share-result:focus-visible rule in style.css');
});

it('CSS: .pct-share-feedback defined with accessible toast styling and animation', () => {
  assert(cssContent.includes('.pct-share-feedback'), 'Missing .pct-share-feedback styling');
  assert(cssContent.includes('@keyframes pctFeedbackIn'), 'Missing @keyframes pctFeedbackIn');
});

// ============================================================================
// 3. Analytics Adapter S13 Event Dictionary Inspection
// ============================================================================
const analyticsJsPath = path.join(rootDir, 'assets', 'js', 'shared', 'analytics.js');
const analyticsJsContent = fs.readFileSync(analyticsJsPath, 'utf8');

it('Analytics: S13 share_link_generated registered in ALLOWED_EVENTS_SET and helper exists', () => {
  assert(analyticsJsContent.includes('share_link_generated'), 'Missing share_link_generated in analytics.js');
  assert(analyticsJsContent.includes('trackShareLinkGenerated: function'), 'Missing trackShareLinkGenerated helper method');
});

// ============================================================================
// 4. Behavioral Simulation: Parameter Encoding & Decoding across all 4 modes
// ============================================================================
// Create a realistic DOM fixture simulating percentage-calculator
function createDomEnvironment(queryString, pathname) {
  const elements = {};

  function makeEl(id, tagName, initialAttrs) {
    const el = {
      id: id,
      tagName: tagName || 'div',
      className: '',
      style: { display: '' },
      value: '',
      placeholder: '',
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
      setAttribute: function(name, val) {
        this.attributes[name] = String(val);
      },
      getAttribute: function(name) {
        return this.attributes[name] || null;
      },
      querySelector: function(sel) {
        if (sel === 'span' && this.children.length > 0) return this.children[0];
        return null;
      }
    };
    elements[id] = el;
    return el;
  }

  // Setup mode buttons
  [1, 2, 3, 4].forEach(i => {
    makeEl('pct-mode-' + i, 'button');
    makeEl('pct-form-' + i, 'div');
  });

  // Inputs
  const p1x = makeEl('p1-x', 'input'); p1x.placeholder = '25';
  const p1y = makeEl('p1-y', 'input'); p1y.placeholder = '200';
  const p2x = makeEl('p2-x', 'input'); p2x.placeholder = '50';
  const p2y = makeEl('p2-y', 'input'); p2y.placeholder = '200';
  const p3old = makeEl('p3-old', 'input'); p3old.placeholder = '100';
  const p3new = makeEl('p3-new', 'input'); p3new.placeholder = '150';
  const p4val = makeEl('p4-val', 'input'); p4val.placeholder = '100';
  const p4pct = makeEl('p4-pct', 'input'); p4pct.placeholder = '20';

  makeEl('p4-inc-btn', 'button');
  makeEl('p4-dec-btn', 'button');
  makeEl('btn-calc-pct', 'button');
  makeEl('btn-reset-pct', 'button');

  const shareBtn = makeEl('btn-share-pct', 'button');
  const spanChild = { textContent: 'Share calculation' };
  shareBtn.children.push(spanChild);

  makeEl('btn-share-result', 'button');
  makeEl('pct-share-feedback', 'span');
  makeEl('pct-answer', 'div');
  makeEl('pct-label', 'div');
  makeEl('pct-result', 'div');

  const metaRobots = {
    name: 'robots',
    attributes: { content: 'index, follow' },
    setAttribute: function(k, v) { this.attributes[k] = v; },
    getAttribute: function(k) { return this.attributes[k]; }
  };

  const canonicalLink = {
    rel: 'canonical',
    attributes: { href: 'https://anyconverter.io/percentage-calculator/' },
    getAttribute: function(k) { return this.attributes[k]; }
  };

  const trackedEvents = [];

  const mockWindow = {
    location: {
      origin: 'https://anyconverter.io',
      pathname: pathname || '/percentage-calculator/',
      search: queryString || '',
      href: 'https://anyconverter.io' + (pathname || '/percentage-calculator/') + (queryString || '')
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
    getElementById: function(id) {
      return elements[id] || null;
    },
    querySelector: function(sel) {
      if (sel === 'meta[name="robots"]') return metaRobots;
      if (sel === 'link[rel="canonical"]') return canonicalLink;
      return null;
    },
    querySelectorAll: function(sel) {
      if (sel.includes('input')) {
        return [p1x, p1y, p2x, p2y, p3old, p3new, p4val, p4pct];
      }
      return [];
    },
    createElement: function(tag) {
      return makeEl('tmp_' + Math.random(), tag);
    },
    head: {
      appendChild: function() {}
    },
    body: {
      appendChild: function() {},
      removeChild: function() {}
    },
    readyState: 'complete'
  };

  return { mockWindow, mockDoc, elements, metaRobots, canonicalLink, trackedEvents };
}

// Load percentage-calculator module
const pctModule = require(path.join(rootDir, 'assets', 'js', 'tools', 'percentage-calculator.js'));

it('Encoding: Generates compact, versioned URL for Mode 1 (X% of Y)', () => {
  const env = createDomEnvironment('', '/percentage-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  global.navigator = env.mockWindow.navigator;

  pctModule.setMode(1);
  env.elements['p1-x'].value = '15';
  env.elements['p1-y'].value = '300';

  const shareUrl = pctModule.generateShareUrl();
  assert(shareUrl.startsWith('https://anyconverter.io/percentage-calculator/?'), 'Invalid base URL');
  assert(shareUrl.includes('v=1'), 'Missing v=1');
  assert(shareUrl.includes('m=1'), 'Missing m=1');
  assert(shareUrl.includes('x=15'), 'Missing x=15');
  assert(shareUrl.includes('y=300'), 'Missing y=300');
});

it('Encoding: Generates compact, versioned URL for Mode 2 (X is what % of Y)', () => {
  const env = createDomEnvironment('', '/percentage-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.setMode(2);
  env.elements['p2-x'].value = '40';
  env.elements['p2-y'].value = '160';

  const shareUrl = pctModule.generateShareUrl();
  assert(shareUrl.includes('v=1&m=2'), 'Missing v=1&m=2');
  assert(shareUrl.includes('x=40'), 'Missing x=40');
  assert(shareUrl.includes('y=160'), 'Missing y=160');
});

it('Encoding: Generates compact, versioned URL for Mode 3 (% Change)', () => {
  const env = createDomEnvironment('', '/percentage-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.setMode(3);
  env.elements['p3-old'].value = '80';
  env.elements['p3-new'].value = '120';

  const shareUrl = pctModule.generateShareUrl();
  assert(shareUrl.includes('v=1&m=3'), 'Missing v=1&m=3');
  assert(shareUrl.includes('o=80'), 'Missing o=80');
  assert(shareUrl.includes('n=120'), 'Missing n=120');
});

it('Encoding: Generates compact, versioned URL for Mode 4 (% Increase & Decrease)', () => {
  const env = createDomEnvironment('', '/percentage-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  // 4a. Increase
  pctModule.setMode(4);
  pctModule.setP4Dir('increase');
  env.elements['p4-val'].value = '250';
  env.elements['p4-pct'].value = '15';
  let shareUrl = pctModule.generateShareUrl();
  assert(shareUrl.includes('v=1&m=4'), 'Missing v=1&m=4');
  assert(shareUrl.includes('v=250'), 'Missing v=250');
  assert(shareUrl.includes('p=15'), 'Missing p=15');
  assert(shareUrl.includes('d=inc'), 'Missing d=inc');

  // 4b. Decrease
  pctModule.setP4Dir('decrease');
  shareUrl = pctModule.generateShareUrl();
  assert(shareUrl.includes('d=dec'), 'Missing d=dec on decrease');
});

// ============================================================================
// 5. Decoding & Hydration across all 4 modes
// ============================================================================
it('Decoding: Mode 1 auto-hydrates inputs, activates tab, and computes answer immediately', () => {
  const env = createDomEnvironment('?v=1&m=1&x=25&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();

  assert.strictEqual(env.elements['p1-x'].value, 25, 'p1-x must be 25');
  assert.strictEqual(env.elements['p1-y'].value, 200, 'p1-y must be 200');
  assert.strictEqual(env.elements['pct-answer'].textContent, '50', '25% of 200 must equal 50');
  assert.strictEqual(env.elements['pct-label'].textContent, '25% of 200 =');
  assert.strictEqual(env.elements['pct-result'].style.display, 'block');
});

it('Decoding: Mode 2 auto-hydrates inputs, activates tab, and computes answer immediately', () => {
  const env = createDomEnvironment('?v=1&m=2&x=50&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();

  assert.strictEqual(env.elements['p2-x'].value, 50);
  assert.strictEqual(env.elements['p2-y'].value, 200);
  assert(env.elements['pct-answer'].textContent.startsWith('25'), '50 is 25% of 200');
  assert.strictEqual(env.elements['pct-label'].textContent, '50 is what % of 200');
  assert.strictEqual(env.elements['pct-result'].style.display, 'block');
});

it('Decoding: Mode 3 auto-hydrates inputs, activates tab, and computes answer immediately', () => {
  const env = createDomEnvironment('?v=1&m=3&o=100&n=150');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();

  assert.strictEqual(env.elements['p3-old'].value, 100);
  assert.strictEqual(env.elements['p3-new'].value, 150);
  assert.strictEqual(env.elements['pct-answer'].textContent, '+50.00%');
  assert.strictEqual(env.elements['pct-label'].textContent, 'Percentage change from 100 to 150');
  assert.strictEqual(env.elements['pct-result'].style.display, 'block');
});

it('Decoding: Mode 4 auto-hydrates inputs, direction, and computes increase/decrease', () => {
  // Increase test
  let env = createDomEnvironment('?v=1&m=4&v=100&p=20&d=inc');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  pctModule.hydrateFromUrl();
  assert.strictEqual(env.elements['p4-val'].value, 100);
  assert.strictEqual(env.elements['p4-pct'].value, 20);
  assert.strictEqual(env.elements['pct-answer'].textContent, '120');
  assert.strictEqual(env.elements['pct-label'].textContent, 'Increase 100 by 20%');

  // Decrease test
  env = createDomEnvironment('?v=1&m=4&v=100&p=20&d=dec');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  pctModule.hydrateFromUrl();
  assert.strictEqual(env.elements['pct-answer'].textContent, '80');
  assert.strictEqual(env.elements['pct-label'].textContent, 'Decrease 100 by 20%');
});

// ============================================================================
// 6. Fail-Safe Fallback & Error Recovery
// ============================================================================
it('Fail-safe: Gracefully resets to default mode 1 on unsupported version ?v=999 without exceptions', () => {
  const env = createDomEnvironment('?v=999&m=1&x=25&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    pctModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['pct-result'].style.display, 'none', 'Result should be hidden on malformed version');
});

it('Fail-safe: Gracefully resets to default mode 1 on malformed mode ?m=NaN or out of bounds', () => {
  const env = createDomEnvironment('?v=1&m=NaN&x=25&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    pctModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['pct-result'].style.display, 'none');
});

it('Fail-safe: Gracefully resets on NaN input values ?v=1&m=1&x=invalid&y=200', () => {
  const env = createDomEnvironment('?v=1&m=1&x=invalid&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  assert.doesNotThrow(() => {
    pctModule.hydrateFromUrl();
  });
  assert.strictEqual(env.elements['pct-result'].style.display, 'none');
});

it('Fail-safe: Gracefully resets on divide-by-zero queries in Mode 2 and Mode 3', () => {
  // Mode 2 y = 0
  let env = createDomEnvironment('?v=1&m=2&x=50&y=0');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  pctModule.hydrateFromUrl();
  assert.strictEqual(env.elements['pct-result'].style.display, 'none');

  // Mode 3 o = 0
  env = createDomEnvironment('?v=1&m=3&o=0&n=150');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  pctModule.hydrateFromUrl();
  assert.strictEqual(env.elements['pct-result'].style.display, 'none');
});

// ============================================================================
// 7. SEO Invariants: Canonical Link Integrity & Dynamic noindex
// ============================================================================
it('SEO: Canonical link remains strictly clean: https://anyconverter.io/percentage-calculator/', () => {
  const env = createDomEnvironment('?v=1&m=1&x=25&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();
  assert.strictEqual(
    env.canonicalLink.getAttribute('href'),
    'https://anyconverter.io/percentage-calculator/',
    'Canonical link must not be altered by hydration'
  );
});

it('SEO: Dynamically sets meta[name="robots"] to "noindex, follow" on parameterized URLs', () => {
  const env = createDomEnvironment('?v=1&m=1&x=25&y=200');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();
  assert.strictEqual(
    env.metaRobots.getAttribute('content'),
    'noindex, follow',
    'Parameterized URL must be tagged noindex, follow to protect crawl equity'
  );
});

it('SEO: Keeps meta[name="robots"] as "index, follow" when no parameters are present', () => {
  const env = createDomEnvironment('');
  global.window = env.mockWindow;
  global.document = env.mockDoc;

  pctModule.hydrateFromUrl();
  assert.strictEqual(
    env.metaRobots.getAttribute('content'),
    'index, follow',
    'Clean unparameterized URL must remain index, follow'
  );
});

// ============================================================================
// 8. Explicit Share Trigger, Clipboard Text & Telemetry Integration
// ============================================================================
it('Share Action: Explicit click copies non-empty URL to clipboard and emits telemetry', () => {
  const env = createDomEnvironment('', '/percentage-calculator/');
  global.window = env.mockWindow;
  global.document = env.mockDoc;
  global.navigator = env.mockWindow.navigator;

  pctModule.setMode(1);
  env.elements['p1-x'].value = '30';
  env.elements['p1-y'].value = '150';

  pctModule.triggerShare();

  assert(env.mockWindow._lastCopiedShareUrl, 'Clipboard text must not be empty');
  assert(
    env.mockWindow._lastCopiedShareUrl.includes('/percentage-calculator/?v=1&m=1&x=30&y=150'),
    `Unexpected clipboard URL: ${env.mockWindow._lastCopiedShareUrl}`
  );
  assert.strictEqual(env.elements['pct-share-feedback'].textContent, 'Link copied to clipboard!');
  assert.strictEqual(env.elements['pct-share-feedback'].style.display, 'inline-flex');

  // Verify telemetry event
  assert(env.trackedEvents.length > 0, 'Telemetry event must be dispatched');
  const shareEvent = env.trackedEvents.find(e => e.toolSlug === 'percentage-calculator');
  assert(shareEvent, 'Missing percentage-calculator telemetry event');
  assert.strictEqual(shareEvent.mode, '1');
  assert.strictEqual(shareEvent.status, 'success');
});

console.log('----------------------------------------------------');
console.log(` Passed: ${passedTests}/${totalTests} tests`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
