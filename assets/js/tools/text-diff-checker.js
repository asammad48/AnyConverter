(function() {
  function diffLines(a, b) {
    var aLines = a.split('\n');
    var bLines = b.split('\n');
    var m = aLines.length, n = bLines.length;
    var dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
    for (var i = 1; i <= m; i++) for (var j = 1; j <= n; j++) {
      if (aLines[i-1] === bLines[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
    var result = [];
    var i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && aLines[i-1] === bLines[j-1]) { result.unshift({type:'=',text:aLines[i-1]}); i--; j--; }
      else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { result.unshift({type:'+',text:bLines[j-1]}); j--; }
      else { result.unshift({type:'-',text:aLines[i-1]}); i--; }
    }
    return result;
  }

  function runDiff() {
    var orig = document.getElementById('diff-orig').value;
    var newT = document.getElementById('diff-new').value;
    var diff = diffLines(orig, newT);
    var added = 0, removed = 0, unchanged = 0;
    var html = diff.map(function(line) {
      var esc = line.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      if (line.type === '+') { added++; return '<div style="background:#1a3a1a;color:#4ade80;padding:2px 8px">+ ' + esc + '</div>'; }
      if (line.type === '-') { removed++; return '<div style="background:#3a1a1a;color:#f87171;padding:2px 8px">- ' + esc + '</div>'; }
      unchanged++;
      return '<div style="color:#94a3b8;padding:2px 8px">  ' + esc + '</div>';
    }).join('');
    document.getElementById('diff-added').textContent = added;
    document.getElementById('diff-removed').textContent = removed;
    document.getElementById('diff-unchanged').textContent = unchanged;
    document.getElementById('diff-stats').style.display = 'flex';
    document.getElementById('diff-output').innerHTML = html || '<div style="color:#94a3b8;padding:2px 8px">No differences found.</div>';
    document.getElementById('diff-output').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-diff').addEventListener('click', runDiff);
    document.getElementById('btn-diff-clear').addEventListener('click', function() {
      document.getElementById('diff-orig').value = '';
      document.getElementById('diff-new').value = '';
      document.getElementById('diff-stats').style.display = 'none';
      document.getElementById('diff-output').style.display = 'none';
    });
  });
})();
