(function() {
  'use strict';

  // Unicode combining overline (vinculum) — placed after a letter it renders as a bar on top
  var B = '̅';

  // Extended MAP supports 1 – 3,999,999 via vinculum notation
  var MAP = [
    [1000000, 'M'+B],
    [900000,  'C'+B+'M'+B],
    [500000,  'D'+B],
    [400000,  'C'+B+'D'+B],
    [100000,  'C'+B],
    [90000,   'X'+B+'C'+B],
    [50000,   'L'+B],
    [40000,   'X'+B+'L'+B],
    [10000,   'X'+B],
    [9000,    'M'+'X'+B],
    [5000,    'V'+B],
    [4000,    'M'+'V'+B],
    [1000,    'M'],
    [900,     'CM'],
    [500,     'D'],
    [400,     'CD'],
    [100,     'C'],
    [90,      'XC'],
    [50,      'L'],
    [40,      'XL'],
    [10,      'X'],
    [9,       'IX'],
    [5,       'V'],
    [4,       'IV'],
    [1,       'I']
  ];

  var MAX = 3999999;

  function toRoman(n) {
    if (n < 1 || n > MAX) return 'Out of range (1–3,999,999)';
    var result = '';
    MAP.forEach(function(pair) {
      while (n >= pair[0]) { result += pair[1]; n -= pair[0]; }
    });
    return result;
  }

  // Vinculum value map for parsing
  var VALS = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
  };
  VALS['I'+B] = 1000;
  VALS['V'+B] = 5000;
  VALS['X'+B] = 10000;
  VALS['L'+B] = 50000;
  VALS['C'+B] = 100000;
  VALS['D'+B] = 500000;
  VALS['M'+B] = 1000000;

  function fromRoman(s) {
    s = s.trim();
    if (!s) return '';
    var up = s.toUpperCase();

    // Tokenise: barred letter (letter + U+0305) counts as one token
    var tokens = [];
    var i = 0;
    while (i < up.length) {
      if (i + 1 < up.length && up.charCodeAt(i + 1) === 0x0305) {
        tokens.push(up[i] + B);
        i += 2;
      } else {
        tokens.push(up[i]);
        i++;
      }
    }

    var result = 0;
    for (var j = 0; j < tokens.length; j++) {
      var cur = VALS[tokens[j]];
      var nxt = VALS[tokens[j + 1]];
      if (cur === undefined) return 'Invalid Roman numeral';
      result += (nxt !== undefined && nxt > cur) ? -cur : cur;
    }
    return result;
  }

  function convertToRoman() {
    var val = parseInt(document.getElementById('rn-number').value, 10);
    if (isNaN(val)) { document.getElementById('rn-roman-out').textContent = '—'; return; }
    document.getElementById('rn-roman-out').textContent = toRoman(val);
  }

  function convertFromRoman() {
    var val = document.getElementById('rn-roman-in').value;
    if (!val.trim()) { document.getElementById('rn-number-out').textContent = '—'; return; }
    document.getElementById('rn-number-out').textContent = fromRoman(val);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Update label/input range dynamically
    var numInput = document.getElementById('rn-number');
    var numLabel = document.getElementById('rn-number-label');
    if (numInput) { numInput.max = MAX; }
    if (numLabel) { numLabel.textContent = 'Enter Number (1–3,999,999)'; }

    document.getElementById('rn-to-roman-btn').addEventListener('click', convertToRoman);
    document.getElementById('rn-from-roman-btn').addEventListener('click', convertFromRoman);
    document.getElementById('rn-number').addEventListener('keydown', function(e) { if (e.key === 'Enter') convertToRoman(); });
    document.getElementById('rn-roman-in').addEventListener('keydown', function(e) { if (e.key === 'Enter') convertFromRoman(); });
  });
})();
