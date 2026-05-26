(function() {
  var FONTS = {
    block: {
      A:['  #  ','##  ##','######','##  ##','##  ##'],
      B:['##### ','##  ##','##### ','##  ##','##### '],
      C:[' ####','##   ','##   ','##   ',' ####'],
      D:['#### ','##  ##','##  ##','##  ##','#### '],
      E:['#####','##   ','#### ','##   ','#####'],
      F:['#####','##   ','#### ','##   ','##   '],
      G:[' ####','##   ','## ###','##  ##',' ####'],
      H:['##  ##','##  ##','######','##  ##','##  ##'],
      I:[' ### ',' ##  ',' ##  ',' ##  ',' ### '],
      J:['  ###','   ##','   ##','##  ##',' #### '],
      K:['##  ##','##  ##','##### ','##  ##','##  ##'],
      L:['##   ','##   ','##   ','##   ','#####'],
      M:['##   ##','### ###','## # ##','##   ##','##   ##'],
      N:['##   ##','###  ##','## # ##','##  ###','##   ##'],
      O:[' #### ','##  ##','##  ##','##  ##',' #### '],
      P:['##### ','##  ##','##### ','##   ','##   '],
      Q:[' #### ','##  ##','##  ##','## # ## ',' #### '],
      R:['##### ','##  ##','##### ','##  ##','##  ##'],
      S:[' #####','##   ',' #### ','   ##','#####'],
      T:['######','  ##  ','  ##  ','  ##  ','  ##  '],
      U:['##  ##','##  ##','##  ##','##  ##',' #### '],
      V:['##  ##','##  ##','##  ##',' ####  ','  ##  '],
      W:['##   ##','##   ##','## # ##','### ###','##   ##'],
      X:['##  ##',' ####  ','  ##  ',' ####  ','##  ##'],
      Y:['##  ##',' ####  ','  ##  ','  ##  ','  ##  '],
      Z:['######','   ## ','  ##  ',' ##   ','######'],
      ' ':['     ','     ','     ','     ','     '],
      '0':[' ### ','##  ##','## ###','### ##',' ### '],
      '1':['  ## ',' ### ','  ## ','  ## ',' #### '],
      '2':[' ### ','##  ##','   ## ','  ## ','######'],
      '3':['##### ','   ##','  ### ','   ##','#####'],
      '4':['   ## ','  ##  ',' ## ##','######','   ## '],
      '5':['######','## ','#####','   ##','#####'],
      '6':[' ### ','##   ','##### ','##  ##',' #### '],
      '7':['######','   ## ','  ##  ',' ##   ','##   '],
      '8':[' #### ','##  ##',' #### ','##  ##',' #### '],
      '9':[' #### ','##  ##',' #####','   ##',' ####']
    }
  };

  function toAscii(text, scale) {
    var rows = ['','','','',''];
    text.toUpperCase().split('').forEach(function(ch) {
      var glyph = FONTS.block[ch] || FONTS.block[' '];
      for (var r=0;r<5;r++) {
        var line = glyph[r] || '     ';
        if (scale > 1) {
          line = line.split('').map(function(c){ return c==='#' ? c.repeat(scale) : c.repeat(scale); }).join('');
        }
        rows[r] += line + ' ';
      }
    });
    return rows.join('\n');
  }

  function generate() {
    var text = document.getElementById('ascii-input').value.slice(0,20);
    var scale = parseInt(document.getElementById('ascii-scale').value)||1;
    var fill = document.getElementById('ascii-fill').value || '#';
    var ascii = toAscii(text, scale).replace(/#/g, fill);
    document.getElementById('ascii-output').value = ascii;
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ascii-input').addEventListener('input', generate);
    document.getElementById('ascii-scale').addEventListener('change', generate);
    document.getElementById('ascii-fill').addEventListener('input', generate);
    document.getElementById('btn-ascii-copy').addEventListener('click', function() {
      var v = document.getElementById('ascii-output').value;
      if (v) navigator.clipboard.writeText(v);
    });
    document.getElementById('btn-ascii-clear').addEventListener('click', function() {
      document.getElementById('ascii-input').value = '';
      document.getElementById('ascii-output').value = '';
    });
    generate();
  });
})();
