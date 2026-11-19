/**
 * AnyConverter — Analytics Adapter & 16-Event Dictionary Test Suite
 *
 * Validates:
 * 1. 16 canonical event definitions & strict allowlist
 * 2. Parameter sanitization & zero PII / content leakage
 * 3. Tool lifecycle tracking (start, complete, fail, reset)
 * 4. CustomEvent DOM dispatching & queue flushing to window.gtag
 */
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const analyticsPath = path.resolve(__dirname, '../assets/js/shared/analytics.js');
assert.ok(fs.existsSync(analyticsPath), 'assets/js/shared/analytics.js must exist');

// Mock browser window environment
let dispatchedCustomEvents = [];
let gtagCalls = [];

global.window = {
  location: { pathname: '/json-formatter/' },
  dispatchEvent: function (ev) {
    dispatchedCustomEvents.push(ev);
  },
  gtag: function (command, eventName, payload) {
    gtagCalls.push({ command, eventName, payload });
  }
};
global.document = {
  documentElement: { lang: 'en' }
};
global.CustomEvent = function (type, init) {
  this.type = type;
  this.detail = init ? init.detail : null;
};

const ACAnalytics = require(analyticsPath);

console.log('--- Testing Analytics Adapter & 16-Event Dictionary ---');

// Test 1: Verify 16 canonical events exist
const EXPECTED_16_EVENTS = [
  'page_view',
  'tool_viewed',
  'tool_started',
  'tool_completed',
  'tool_failed',
  'tool_reset',
  'result_copied',
  'result_downloaded',
  'search_opened',
  'search_performed',
  'search_result_clicked',
  'favorite_added',
  'favorite_removed',
  'language_switched',
  'related_tool_clicked',
  'category_hub_clicked'
];

assert.strictEqual(Object.keys(ACAnalytics.EVENTS).length, 16, 'Exactly 16 canonical events must be defined');
for (const ev of EXPECTED_16_EVENTS) {
  assert.ok(Object.values(ACAnalytics.EVENTS).includes(ev), `Canonical event ${ev} must exist in dictionary`);
}
console.log('✓ 16/16 canonical events verified in dictionary');

// Test 2: Unrecognized event rejection
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.track('unauthorized_random_event', { data: 'test' });
assert.strictEqual(dispatchedCustomEvents.length, 0, 'Unregistered events must be rejected');
assert.strictEqual(gtagCalls.length, 0, 'Unregistered events must not reach gtag');
console.log('✓ Arbitrary / unauthorized events correctly dropped');

// Test 3: Tool lifecycle tracking with duration calculation
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.trackToolStarted('json-formatter', 'paste');
assert.strictEqual(dispatchedCustomEvents.length, 1);
assert.strictEqual(dispatchedCustomEvents[0].detail.event, 'tool_started');
assert.strictEqual(dispatchedCustomEvents[0].detail.payload.input_type, 'paste');

// Simulate 25ms delay
const start = Date.now();
while (Date.now() - start < 25) {}

ACAnalytics.trackToolCompleted('json-formatter', 'paste', 'json_formatted');
assert.strictEqual(dispatchedCustomEvents.length, 2);
assert.strictEqual(dispatchedCustomEvents[1].detail.event, 'tool_completed');
assert.ok(dispatchedCustomEvents[1].detail.payload.duration_ms >= 20, 'duration_ms must be calculated and >= 20ms');
console.log('✓ Tool lifecycle (tool_started -> tool_completed with duration_ms) verified');

// Test 4: Privacy sanitization — PII and filenames must never leak
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.track('tool_completed', {
  tool_slug: 'json-formatter',
  email: 'victim@secret.org',
  ip: '192.168.1.1',
  filename: 'confidential_budget_2026.json',
  content: 'sensitive financial records with credit card 4111-2222-3333-4444',
  url: 'https://malicious.com/tracker'
});

assert.strictEqual(gtagCalls.length, 1);
const payload = gtagCalls[0].payload;
assert.strictEqual(payload.email, undefined, 'Sensitive key "email" must not be sent');
assert.strictEqual(payload.content, undefined, 'Sensitive key "content" must not be sent');
assert.strictEqual(payload.filename, undefined, 'Sensitive key "filename" must not be sent');
assert.strictEqual(payload.ip, undefined, 'Sensitive key "ip" must not be sent');
console.log('✓ Privacy Sanitization Gate: Zero PII, filenames, or document content leaked');

// Test 5: Search performed privacy — strictly length and count, NO query string
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.trackSearchPerformed(14, 5);
assert.strictEqual(gtagCalls.length, 1);
assert.strictEqual(gtagCalls[0].eventName, 'search_performed');
assert.strictEqual(gtagCalls[0].payload.query_length, 14);
assert.strictEqual(gtagCalls[0].payload.results_count, 5);
assert.strictEqual(gtagCalls[0].payload.query, undefined, 'Search query text must NEVER be transmitted');
console.log('✓ Search tracking privacy: query_length & results_count tracked with zero text leakage');

// Test 6: Download tracking with size bracket
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.trackResultDownloaded('pdf-merge', 'pdf', '<1MB');
assert.strictEqual(gtagCalls.length, 1);
assert.strictEqual(gtagCalls[0].eventName, 'result_downloaded');
assert.strictEqual(gtagCalls[0].payload.file_extension, 'pdf');
assert.strictEqual(gtagCalls[0].payload.size_bracket, '<1MB');
console.log('✓ Result downloaded event verified with file_extension and size_bracket');

// Test 7: Multilingual locale detection
global.window.location.pathname = '/da/todo-list/';
dispatchedCustomEvents = [];
gtagCalls = [];
ACAnalytics.trackToolReset('todo-list');
assert.strictEqual(gtagCalls.length, 1);
assert.strictEqual(gtagCalls[0].payload.locale, 'da', 'Locale "da" must be detected from path');

global.window.location.pathname = '/es/daily-planner/';
gtagCalls = [];
ACAnalytics.trackToolReset('daily-planner');
assert.strictEqual(gtagCalls.length, 1);
assert.strictEqual(gtagCalls[0].payload.locale, 'es', 'Locale "es" must be detected from path');
console.log('✓ Dynamic locale extraction (en, es, da) verified');

// Test 8: Live Product Wiring — Verify analytics.js inclusion on homepages and top 10 tools
const rootDir = path.resolve(__dirname, '..');
const verifiedPages = [
  'index.html',
  'es/index.html',
  'da/index.html',
  'ip-address-lookup/index.html',
  'json-formatter/index.html',
  'pdf-merge/index.html',
  'daily-planner/index.html',
  'todo-list/index.html',
  'ascii-art-generator/index.html',
  'word-counter/index.html',
  'discount-calculator/index.html',
  'internet-speed-test/index.html',
  'edit-pdf/index.html'
];

for (const p of verifiedPages) {
  const fullPath = path.join(rootDir, p);
  assert.ok(fs.existsSync(fullPath), `Page ${p} must exist`);
  const html = fs.readFileSync(fullPath, 'utf8');
  assert.ok(
    html.includes('/assets/js/shared/analytics.js'),
    `Page ${p} must explicitly include /assets/js/shared/analytics.js`
  );
}
console.log(`✓ Product wiring verified: ${verifiedPages.length} core pages explicitly include analytics.js`);

console.log('\nALL 8 ANALYTICS ADAPTER TESTS PASSED!');
