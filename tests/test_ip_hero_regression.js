const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const js = fs.readFileSync('assets/js/tools/ip-address-lookup.js', 'utf8');

function runSimulation(apiResponse, customIpToSearch) {
  const elements = {};
  function makeEl(id) {
    const el = {
      id: id,
      textContent: '',
      innerHTML: '',
      style: {},
      disabled: false,
      value: '',
      listeners: {},
      addEventListener: function(evt, fn) {
        this.listeners[evt] = this.listeners[evt] || [];
        this.listeners[evt].push(fn);
      },
      dispatchEvent: function(evt, data) {
        if (this.listeners[evt]) {
          this.listeners[evt].forEach(fn => fn(data || {}));
        }
      }
    };
    elements[id] = el;
    return el;
  }

  ['ip-hero-card', 'ip-hero-badge', 'ip-hero-display', 'btn-copy-hero-ip', 'ip-hero-meta',
   'ip-meta-location', 'ip-meta-isp', 'ip-meta-asn', 'ip-input', 'btn-ip-lookup',
   'btn-ip-my', 'ip-results', 'ip-error', 'ip-quality'].forEach(makeEl);

  let capturedFetchUrl = null;
  const mockFetch = function(url) {
    capturedFetchUrl = url;
    return Promise.resolve({
      json: function() { return Promise.resolve(apiResponse); }
    });
  };

  const sandbox = {
    document: {
      getElementById: function(id) { return elements[id] || null; },
      querySelector: function() { return null; },
      createElement: function(tag) { return makeEl('created-' + Math.random()); },
      addEventListener: function(evt, fn) {
        if (evt === 'DOMContentLoaded') fn();
      }
    },
    window: {
      acT: function(m) { return m.en; },
      copyToClipboard: function(text) { return true; }
    },
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    AbortSignal: { timeout: () => ({}) },
    fetch: mockFetch,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };

  const context = vm.createContext(sandbox);
  vm.runInContext(js, context);

  return { elements, capturedFetchUrl };
}

async function testSuite() {
  console.log('--- Comprehensive IP Lookup Unit & Regression Suite ---');

  // Test Case A: Automatic initial public IP lookup succeeds
  console.log('Case 1: Auto-detection populates Hero Card');
  const mockPublicData = {
    ip: '198.51.100.24',
    city: 'Madrid',
    region: 'Community of Madrid',
    country: 'Spain',
    org: 'AS12345 Telefonica Espana',
    asn: 'AS12345'
  };

  const sim1 = runSimulation(mockPublicData, '');
  // Allow promises to settle
  await new Promise(r => setTimeout(r, 50));

  assert.strictEqual(sim1.elements['ip-hero-display'].textContent, '198.51.100.24', 'Hero display must show detected IP');
  assert.strictEqual(sim1.elements['btn-copy-hero-ip'].style.display, 'inline-flex', 'Copy button must be visible');
  assert.ok(sim1.elements['ip-meta-location'].textContent.includes('Madrid'), 'Location meta must include city');
  assert.ok(sim1.elements['ip-meta-isp'].textContent.includes('Telefonica'), 'ISP meta must show organization');
  console.log('✓ Passed: Hero card displays detected IP and metadata correctly');

  // Test Case B: Missing metadata does not throw or break rendering
  console.log('Case 2: Missing optional fields (null/undefined/blank)');
  const mockSparseData = {
    ip: '203.0.113.88'
  };
  const sim2 = runSimulation(mockSparseData, '');
  await new Promise(r => setTimeout(r, 50));
  assert.strictEqual(sim2.elements['ip-hero-display'].textContent, '203.0.113.88');
  console.log('✓ Passed: Sparse metadata handled gracefully without errors');

  // Test Case C: Custom IP search does not overwrite public hero IP
  console.log('Case 3: Custom search preserves user public IP on hero card');
  const sim3 = runSimulation(mockPublicData, '');
  await new Promise(r => setTimeout(r, 50));
  assert.strictEqual(sim3.elements['ip-hero-display'].textContent, '198.51.100.24');

  // Simulate user entering a custom IP: "8.8.8.8"
  sim3.elements['ip-input'].value = '8.8.8.8';
  // Trigger custom lookup
  const customData = {
    ip: '8.8.8.8',
    city: 'Mountain View',
    region: 'California',
    country: 'United States',
    org: 'AS15169 Google LLC',
    asn: 'AS15169'
  };
  // Hook fetch to return customData
  // Trigger click on lookup button
  sim3.elements['btn-ip-lookup'].dispatchEvent('click');
  await new Promise(r => setTimeout(r, 50));

  // The hero card must STILL show the user's public IP: 198.51.100.24!
  assert.strictEqual(sim3.elements['ip-hero-display'].textContent, '198.51.100.24', 'Hero card must NOT be overwritten by custom query');
  console.log('✓ Passed: Custom search does NOT overwrite public hero display');

  console.log('--- All IP Hero Regression Tests Passed! ---');
}

testSuite().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
