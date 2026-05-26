(function() {
  function randInt(min, max) {
    var range = max - min + 1;
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return min + (arr[0] % range);
  }

  function generate() {
    var min = parseInt(document.getElementById('rng-min').value, 10);
    var max = parseInt(document.getElementById('rng-max').value, 10);
    var count = Math.min(100, Math.max(1, parseInt(document.getElementById('rng-count').value, 10) || 1));
    var unique = document.getElementById('rng-unique').checked;
    if (isNaN(min) || isNaN(max) || min > max) return;
    if (unique && count > (max - min + 1)) { count = max - min + 1; }
    var nums = [];
    var seen = {};
    var attempts = 0;
    while (nums.length < count && attempts < 10000) {
      var n = randInt(min, max);
      if (!unique || !seen[n]) { nums.push(n); seen[n] = true; }
      attempts++;
    }
    var list = document.getElementById('rng-list');
    var bigNum = document.getElementById('rng-big-number');
    list.innerHTML = '';
    if (count === 1) {
      bigNum.textContent = nums[0];
      bigNum.style.display = 'block';
      list.style.display = 'none';
    } else {
      bigNum.style.display = 'none';
      list.style.display = 'flex';
      nums.forEach(function(n) {
        var span = document.createElement('span');
        span.style.cssText = 'padding:6px 12px;background:#fff;border:1px solid #E4E4EF;border-radius:6px;font-family:monospace;font-weight:600;font-size:14px';
        span.textContent = n;
        list.appendChild(span);
      });
    }
    document.getElementById('rng-output').style.display = 'block';
    document.getElementById('rng-output')._nums = nums;
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-generate-rng').addEventListener('click', generate);
    document.getElementById('btn-copy-rng').addEventListener('click', function() {
      var nums = document.getElementById('rng-output')._nums;
      if (nums && nums.length) navigator.clipboard.writeText(nums.join(', '));
    });
    document.getElementById('btn-clear-rng').addEventListener('click', function() {
      document.getElementById('rng-output').style.display = 'none';
    });
  });
})();
