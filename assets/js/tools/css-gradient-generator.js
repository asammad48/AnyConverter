(function() {
  var gradType = 'linear';

  function getCSS() {
    var stops = Array.from(document.querySelectorAll('.grad-stop')).map(function(s) {
      return s.querySelector('.stop-color').value + ' ' + s.querySelector('.stop-pos').value + '%';
    });
    if (gradType === 'linear') {
      var angle = document.getElementById('grad-angle').value;
      return 'linear-gradient(' + angle + 'deg, ' + stops.join(', ') + ')';
    }
    return 'radial-gradient(circle, ' + stops.join(', ') + ')';
  }

  function update() {
    var css = getCSS();
    document.getElementById('gradient-preview').style.background = css;
    document.getElementById('grad-css-output').value = 'background: ' + css + ';';
  }

  function addStop() {
    var container = document.getElementById('grad-stops');
    var div = document.createElement('div');
    div.className = 'grad-stop';
    div.style.cssText = 'display:flex;align-items:center;gap:8px';
    div.innerHTML = '<input type="color" class="stop-color" value="#EC4899" style="width:40px;height:36px;border:none;border-radius:6px;cursor:pointer"><input type="range" class="stop-pos" min="0" max="100" value="50" style="flex:1;accent-color:#B04A45"><span class="stop-pos-val" style="width:36px;font-size:13px;text-align:right">50%</span><button class="btn btn-secondary btn-sm stop-remove" style="padding:4px 8px">×</button>';
    container.appendChild(div);
    bindStop(div);
    update();
  }

  function bindStop(div) {
    div.querySelector('.stop-color').addEventListener('input', update);
    div.querySelector('.stop-pos').addEventListener('input', function() {
      div.querySelector('.stop-pos-val').textContent = this.value + '%';
      update();
    });
    div.querySelector('.stop-remove').addEventListener('click', function() {
      if (document.querySelectorAll('.grad-stop').length > 2) { div.remove(); update(); }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.grad-stop').forEach(bindStop);
    document.getElementById('grad-type-linear').addEventListener('click', function() {
      gradType = 'linear';
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      document.getElementById('grad-type-radial').classList.remove('active');
      document.getElementById('grad-type-radial').setAttribute('aria-selected', 'false');
      document.getElementById('grad-angle-row').style.display = '';
      update();
    });
    document.getElementById('grad-type-radial').addEventListener('click', function() {
      gradType = 'radial';
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      document.getElementById('grad-type-linear').classList.remove('active');
      document.getElementById('grad-type-linear').setAttribute('aria-selected', 'false');
      document.getElementById('grad-angle-row').style.display = 'none';
      update();
    });
    document.getElementById('grad-angle').addEventListener('input', function() {
      document.getElementById('grad-angle-val').textContent = this.value;
      update();
    });
    document.getElementById('btn-add-stop').addEventListener('click', addStop);
    document.getElementById('btn-copy-grad').addEventListener('click', function() {
      navigator.clipboard.writeText(document.getElementById('grad-css-output').value);
    });
    update();
  });
})();
