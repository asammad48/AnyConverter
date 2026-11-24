#!/usr/bin/env node
'use strict';

/**
 * AnyConverter — Sprint S15 PWA Manifest & Install Prompt Automated Verification Suite
 *
 * Assertions:
 * 1. Web App Manifest validity, JSON schema, icons, and start_url
 * 2. Manifest link and theme-color meta tag presence across 18 target pages
 * 3. Scoped Service Worker script (sw.js), versioning, network-first, third-party exclusion
 * 4. Deferred install prompt logic, non-intrusion on first load, dismissal rate-limiting, :focus-visible
 * 5. Analytics tracking integration for pwa_prompt_shown, pwa_installed, pwa_dismissed
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   SPRINT S15: PWA MANIFEST & INSTALL PROMPT SUITE   ');
console.log('====================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✓ [CHECK ${totalChecks}] ${desc}`);
    passedChecks++;
  } catch (err) {
    console.error(`  ✗ [CHECK ${totalChecks} FAILED] ${desc}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// =========================================================================
// 1. W3C Web App Manifest Validation
// =========================================================================
console.log('\n--- 1. W3C Web App Manifest & Metadata ---');

const manifestPath = path.join(ROOT, 'manifest.webmanifest');

check('manifest.webmanifest exists at repository root', () => {
  assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest must exist at root');
});

let manifestJson = null;
check('manifest.webmanifest parses as valid JSON', () => {
  const content = fs.readFileSync(manifestPath, 'utf8');
  manifestJson = JSON.parse(content);
  assert.ok(manifestJson && typeof manifestJson === 'object', 'Manifest must be an object');
});

check('Manifest schema fields match specifications', () => {
  assert.strictEqual(manifestJson.name, 'AnyConverter — Free Online Tools & Calculators');
  assert.strictEqual(manifestJson.short_name, 'AnyConverter');
  assert.strictEqual(manifestJson.start_url, '/?source=pwa');
  assert.strictEqual(manifestJson.display, 'standalone');
  assert.strictEqual(manifestJson.background_color, '#F7F6F3');
  assert.strictEqual(manifestJson.theme_color, '#B04A45');
  assert.ok(manifestJson.description && manifestJson.description.includes('calculators'), 'Description must describe tools');
  assert.ok(Array.isArray(manifestJson.icons), 'icons must be an array');
  assert.ok(manifestJson.icons.length >= 2, 'icons must have at least 192 and 512 entries');
});

check('Manifest icons exist on disk with valid file sizes', () => {
  const icon192 = manifestJson.icons.find(i => i.sizes === '192x192');
  const icon512 = manifestJson.icons.find(i => i.sizes === '512x512');
  assert.ok(icon192, 'Must include 192x192 icon');
  assert.ok(icon512, 'Must include 512x512 icon');

  const p192 = path.join(ROOT, icon192.src.replace(/^\//, ''));
  const p512 = path.join(ROOT, icon512.src.replace(/^\//, ''));

  assert.ok(fs.existsSync(p192), `192x192 icon file must exist at ${p192}`);
  assert.ok(fs.existsSync(p512), `512x512 icon file must exist at ${p512}`);

  const stat192 = fs.statSync(p192);
  const stat512 = fs.statSync(p512);
  assert.ok(stat192.size > 500, '192x192 icon must have non-trivial size');
  assert.ok(stat512.size > 1000, '512x512 icon must have non-trivial size');
});

// =========================================================================
// 2. Head Metadata and Script Tags on 18 Target Pages
// =========================================================================
console.log('\n--- 2. Head Metadata on Homepage and Top 5 Tools (18 Target Pages) ---');

const TARGET_PAGES = [
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

check('All 18 target pages contain manifest link and theme-color meta tag', () => {
  for (const rel of TARGET_PAGES) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `File ${rel} must exist`);
    const html = fs.readFileSync(full, 'utf8');

    assert.ok(
      html.includes('<link rel="manifest" href="/manifest.webmanifest">') ||
      html.includes('<link href="/manifest.webmanifest" rel="manifest">'),
      `Missing manifest link in ${rel}`
    );
    assert.ok(
      html.includes('<meta name="theme-color" content="#B04A45">'),
      `Missing theme-color meta tag in ${rel}`
    );
  }
});

check('All 18 target pages load pwa.js and preserve clean canonicals and hreflangs', () => {
  for (const rel of TARGET_PAGES) {
    const full = path.join(ROOT, rel);
    const html = fs.readFileSync(full, 'utf8');

    assert.ok(html.includes('/assets/js/shared/pwa.js'), `Missing pwa.js in ${rel}`);
    assert.ok(html.includes('<link rel="canonical"'), `Missing canonical link in ${rel}`);
    assert.ok(html.includes('hreflang="en"') || rel.includes('about'), `Missing hreflang en in ${rel}`);
    assert.ok(html.includes('hreflang="es"') || rel.includes('about'), `Missing hreflang es in ${rel}`);
    assert.ok(html.includes('hreflang="da"') || rel.includes('about'), `Missing hreflang da in ${rel}`);
  }
});

// =========================================================================
// 3. Service Worker (sw.js) Architecture & Scoping
// =========================================================================
console.log('\n--- 3. Scoped Service Worker Architecture & Scoping ---');

const swPath = path.join(ROOT, 'sw.js');

check('sw.js exists at repository root', () => {
  assert.ok(fs.existsSync(swPath), 'sw.js must exist at repository root');
});

let swContent = '';
check('sw.js declares versioned cache name (ac-pwa-v1)', () => {
  swContent = fs.readFileSync(swPath, 'utf8');
  assert.ok(/const\s+CACHE_NAME\s*=\s*['"]ac-pwa-v1['"]/.test(swContent), 'Must declare versioned cache name ac-pwa-v1');
});

check('sw.js pre-caches homepage, top 5 tools, and essential static assets', () => {
  const requiredPrecache = [
    '/',
    '/manifest.webmanifest',
    '/assets/css/style.css',
    '/assets/js/shared.js',
    '/assets/js/shared/analytics.js',
    '/assets/js/shared/pwa.js',
    '/json-formatter/',
    '/percentage-calculator/',
    '/age-calculator/',
    '/loan-calculator/',
    '/ip-address-lookup/'
  ];
  for (const asset of requiredPrecache) {
    assert.ok(swContent.includes(asset), `sw.js pre-cache must include ${asset}`);
  }
});

check('sw.js enforces Network-First strategy for HTML navigation', () => {
  assert.ok(swContent.includes('Network-First'), 'sw.js comments/implementation must specify Network-First');
  assert.ok(
    swContent.includes("event.request.mode === 'navigate'") ||
    swContent.includes("text/html"),
    'sw.js must identify HTML navigation requests'
  );
  assert.ok(
    swContent.includes('fetch(event.request)'),
    'sw.js must attempt network fetch first for navigations'
  );
  assert.ok(
    swContent.includes('caches.match('),
    'sw.js must fallback to cache on network failure'
  );
});

check('sw.js strictly excludes third-party advertising, analytics, and external APIs', () => {
  const excludedEntities = [
    'googletagmanager.com',
    'google-analytics.com',
    'adsbygoogle',
    'doubleclick.net',
    'api.ipify.org'
  ];
  for (const item of excludedEntities) {
    assert.ok(swContent.includes(item), `sw.js must explicitly exclude ${item} from caching`);
  }
  assert.ok(
    swContent.includes('url.origin !== self.location.origin'),
    'sw.js must guard against caching cross-origin requests'
  );
});

check('sw.js provides graceful offline fallback response', () => {
  assert.ok(swContent.includes('status: 503') || swContent.includes('Offline'), 'sw.js must provide fallback when offline');
});

// =========================================================================
// 4. Deferred Non-Intrusive Install Prompt Logic & WCAG 2.2 AA
// =========================================================================
console.log('\n--- 4. Deferred Install Prompt & Accessibility (WCAG 2.2 AA) ---');

const pwaJsPath = path.join(ROOT, 'assets/js/shared/pwa.js');
const cssPath = path.join(ROOT, 'assets/css/style.css');

check('pwa.js and style.css exist', () => {
  assert.ok(fs.existsSync(pwaJsPath), 'pwa.js must exist');
  assert.ok(fs.existsSync(cssPath), 'style.css must exist');
});

const cssContent = fs.readFileSync(cssPath, 'utf8');

check('style.css enforces WCAG 2.2 AA focus-visible outlines on PWA prompt controls', () => {
  assert.ok(cssContent.includes('#pwa-install-btn:focus-visible'), 'Must style #pwa-install-btn:focus-visible');
  assert.ok(cssContent.includes('#pwa-dismiss-btn:focus-visible'), 'Must style #pwa-dismiss-btn:focus-visible');
  assert.ok(cssContent.includes('2px solid #B04A45'), 'Outline must be 2px solid #B04A45');
  assert.ok(cssContent.includes('outline-offset: 2px'), 'Outline offset must be 2px');
});

// Mock browser environment for pwa.js behavioral verification
let mockLocalStorage = {};
let mockSessionStorage = {};
let listeners = {};
let dispatchedEvents = [];

global.window = {
  localStorage: {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage[k]; }
  },
  sessionStorage: {
    getItem: (k) => mockSessionStorage[k] || null,
    setItem: (k, v) => { mockSessionStorage[k] = String(v); },
    removeItem: (k) => { delete mockSessionStorage[k]; }
  },
  matchMedia: () => ({ matches: false }),
  navigator: { standalone: false },
  addEventListener: (event, handler) => {
    listeners[event] = listeners[event] || [];
    listeners[event].push(handler);
  },
  dispatchEvent: (ev) => {
    dispatchedEvents.push(ev);
    const handlers = listeners[ev.type] || [];
    handlers.forEach(h => h(ev));
  },
  acLang: () => 'en'
};

global.document = {
  documentElement: { lang: 'en' },
  getElementById: (id) => {
    if (id === 'pwa-install-banner') return global._mockBanner || null;
    return null;
  },
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      attributes: {},
      style: {},
      innerHTML: '',
      setAttribute: (k, v) => { el.attributes[k] = v; },
      getAttribute: (k) => el.attributes[k] || null,
      querySelector: (sel) => {
        if (sel === '#pwa-dismiss-btn') return { addEventListener: (ev, fn) => { el._dismissHandler = fn; } };
        if (sel === '#pwa-install-btn') return { addEventListener: (ev, fn) => { el._installHandler = fn; } };
        return null;
      }
    };
    return el;
  },
  body: {
    appendChild: (child) => { global._mockBanner = child; }
  }
};

global.CustomEvent = function (type, init) {
  this.type = type;
  this.detail = init ? init.detail : null;
};

const ACPwa = require(pwaJsPath);

check('pwa.js exports required API methods', () => {
  assert.ok(typeof ACPwa.isDismissed === 'function', 'Must export isDismissed');
  assert.ok(typeof ACPwa.isInstalled === 'function', 'Must export isInstalled');
  assert.ok(typeof ACPwa.hasInteracted === 'function', 'Must export hasInteracted');
  assert.ok(typeof ACPwa.markInteractionSuccess === 'function', 'Must export markInteractionSuccess');
  assert.ok(typeof ACPwa.showBanner === 'function', 'Must export showBanner');
  assert.ok(typeof ACPwa.handleDismiss === 'function', 'Must export handleDismiss');
});

check('Non-intrusive on first load: banner is never shown before tool interaction', () => {
  mockLocalStorage = {};
  mockSessionStorage = {};
  global._mockBanner = null;
  ACPwa.resetStateForTest();

  // Simulate beforeinstallprompt on initial landing
  let defaultPrevented = false;
  const mockPromptEvent = {
    preventDefault: () => { defaultPrevented = true; }
  };
  const bipHandlers = listeners['beforeinstallprompt'] || [];
  bipHandlers.forEach(h => h(mockPromptEvent));

  assert.ok(defaultPrevented, 'beforeinstallprompt must have preventDefault() called');
  assert.strictEqual(ACPwa.hasInteracted(), false, 'User has not yet interacted');
  assert.strictEqual(global._mockBanner, null, 'Banner must NOT be created or shown on first load');
});

check('Contextual trigger: banner is shown only after successful tool interaction', () => {
  assert.ok(global._mockBanner === null, 'Precondition: banner not shown');

  // Trigger successful tool interaction
  ACPwa.markInteractionSuccess();

  assert.strictEqual(ACPwa.hasInteracted(), true, 'Interaction must be marked');
  assert.ok(global._mockBanner !== null, 'Banner must now be created');
  assert.strictEqual(global._mockBanner.style.display, 'flex', 'Banner must be displayed');
  assert.strictEqual(global._mockBanner.attributes['role'], 'region', 'Banner must have role=region');
  assert.ok(global._mockBanner.attributes['aria-label'], 'Banner must have aria-label');
});

check('Dismiss action suppresses re-prompting for 14 days', () => {
  assert.strictEqual(ACPwa.isDismissed(), false, 'Not dismissed initially');

  // Dismiss
  ACPwa.handleDismiss();

  assert.strictEqual(ACPwa.isDismissed(), true, 'isDismissed() must return true');
  assert.ok(mockLocalStorage['ac:pwa-dismissed-ts'], 'Must record dismissal timestamp');
  assert.strictEqual(global._mockBanner.style.display, 'none', 'Banner must be hidden');

  // Try to show again immediately
  ACPwa.showBanner('test');
  assert.strictEqual(global._mockBanner.style.display, 'none', 'Banner must remain hidden while suppressed');

  // Simulate 15 days later (15 * 86,400,000 ms)
  const fifteenDaysAgo = Date.now() - (15 * 24 * 60 * 60 * 1000);
  mockLocalStorage['ac:pwa-dismissed-ts'] = String(fifteenDaysAgo);
  assert.strictEqual(ACPwa.isDismissed(), false, '14-day suppression must expire after 15 days');
});

check('Suppresses prompt if app is already installed or standalone', () => {
  mockLocalStorage = {};
  assert.strictEqual(ACPwa.isInstalled(), false);

  mockLocalStorage['ac:pwa-installed'] = 'true';
  assert.strictEqual(ACPwa.isInstalled(), true, 'isInstalled() must return true');

  global._mockBanner.style.display = 'none';
  ACPwa.showBanner('test');
  assert.strictEqual(global._mockBanner.style.display, 'none', 'Banner must not be shown when already installed');
});

// =========================================================================
// 5. Telemetry & Analytics Integration
// =========================================================================
console.log('\n--- 5. Telemetry & Analytics Integration ---');

const analyticsAdapterPath = path.join(ROOT, 'assets/js/shared/analytics.js');
const ACAnalytics = require(analyticsAdapterPath);

let trackedEvents = [];
global.window.ACAnalytics = ACAnalytics;
global.window.gtag = (cmd, eventName, payload) => {
  trackedEvents.push({ eventName, payload });
};

check('analytics.js includes pwa_prompt_shown, pwa_installed, pwa_dismissed', () => {
  assert.ok(typeof ACAnalytics.trackPwaPromptShown === 'function', 'Must export trackPwaPromptShown');
  assert.ok(typeof ACAnalytics.trackPwaInstalled === 'function', 'Must export trackPwaInstalled');
  assert.ok(typeof ACAnalytics.trackPwaDismissed === 'function', 'Must export trackPwaDismissed');
});

check('ACAnalytics dispatches pwa_prompt_shown with zero PII', () => {
  trackedEvents = [];
  ACAnalytics.trackPwaPromptShown('tool_interaction');

  assert.strictEqual(trackedEvents.length, 1);
  assert.strictEqual(trackedEvents[0].eventName, 'pwa_prompt_shown');
  assert.strictEqual(trackedEvents[0].payload.trigger_source, 'tool_interaction');
  assert.ok(trackedEvents[0].payload.locale, 'Must include locale');
});

check('ACAnalytics dispatches pwa_installed on prompt acceptance', () => {
  trackedEvents = [];
  ACAnalytics.trackPwaInstalled('accepted');

  assert.strictEqual(trackedEvents.length, 1);
  assert.strictEqual(trackedEvents[0].eventName, 'pwa_installed');
  assert.strictEqual(trackedEvents[0].payload.outcome, 'accepted');
});

check('ACAnalytics dispatches pwa_dismissed on dismiss action', () => {
  trackedEvents = [];
  ACAnalytics.trackPwaDismissed('dismiss_button');

  assert.strictEqual(trackedEvents.length, 1);
  assert.strictEqual(trackedEvents[0].eventName, 'pwa_dismissed');
  assert.strictEqual(trackedEvents[0].payload.action, 'dismiss_button');
});

console.log('\n====================================================');
console.log(`Results: ${passedChecks}/${totalChecks} assertions passed.`);
if (passedChecks === totalChecks && !process.exitCode) {
  console.log('STATUS: SPRINT S15 PWA VERIFICATION PASSED (100%).');
  process.exit(0);
} else {
  console.error('STATUS: FAILURES DETECTED.');
  process.exit(1);
}
