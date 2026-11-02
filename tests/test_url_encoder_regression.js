const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const js = fs.readFileSync('assets/js/tools/url-encoder.js', 'utf8');

function testUrlEncoder() {
  console.log('--- Running URL Encoder Regression Suite ---');

  // Verify syntax
  assert.doesNotThrow(() => new Function(js), 'url-encoder.js must have valid syntax');
  console.log('✓ Syntax valid');

  // Extract resilientDecode from the script
  const match = js.match(/function resilientDecode\(str\) \{([\s\S]*?)\n  \}/);
  assert.ok(match, 'resilientDecode function must be present');
  const resilientDecode = new Function('str', match[1]);

  // Test Case 1: 100% discount for café: %C3%A9 -> 100% discount for café: é
  const t1 = "100% discount for café: %C3%A9";
  const exp1 = "100% discount for café: é";
  assert.strictEqual(resilientDecode(t1), exp1, 'Must decode multi-byte UTF-8 even when lone % is present');
  console.log('✓ Test 1 Passed: 100% discount for café: %C3%A9 -> 100% discount for café: é');

  // Test Case 2: Emoji multi-byte
  const t2 = "Hello 100% %F0%9F%9A%80 rocket";
  const exp2 = "Hello 100% 🚀 rocket";
  assert.strictEqual(resilientDecode(t2), exp2, 'Must decode 4-byte UTF-8 emoji');
  console.log('✓ Test 2 Passed: 4-byte UTF-8 emoji decoded correctly');

  // Test Case 3: Lone percent signs and trailing percent
  const t3 = "Value is 50% off %20 and ends with %";
  const exp3 = "Value is 50% off   and ends with %";
  assert.strictEqual(resilientDecode(t3), exp3, 'Must preserve lone and trailing % signs safely');
  console.log('✓ Test 3 Passed: Lone & trailing percent signs preserved');

  // Test Case 4: Invalid UTF-8 byte sequence fallback
  const t4 = "Bad byte %A9 here";
  const exp4 = "Bad byte %A9 here";
  assert.strictEqual(resilientDecode(t4), exp4, 'Must not crash on invalid UTF-8 byte; keep literal');
  console.log('✓ Test 4 Passed: Invalid UTF-8 byte gracefully kept as literal without crashing');

  // Test Case 5: Standard full URL
  const t5 = "https%3A%2F%2Fanyconverter.io%2Fsearch%3Fq%3D100%25%20free";
  const exp5 = "https://anyconverter.io/search?q=100% free";
  assert.strictEqual(resilientDecode(t5), exp5, 'Must decode standard encoded URLs');
  console.log('✓ Test 5 Passed: Standard URL decoding works cleanly');

  console.log('--- All URL Encoder Regression Tests Passed! ---');
}

testUrlEncoder();
