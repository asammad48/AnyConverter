(function() {
  'use strict';

  function val(id) { return document.getElementById(id).value; }
  function num(id) { return parseFloat(val(id)); }

  function buildBoxShadow() {
    var hOff = num('cs-h-offset');
    var vOff = num('cs-v-offset');
    var blur = num('cs-blur');
    var spread = num('cs-spread');
    var color = val('cs-color');
    var opacity = parseFloat(val('cs-opacity'));
    var inset = document.getElementById('cs-inset').checked;
    var hex = color.replace('#','');
    var r = parseInt(hex.substring(0,2),16);
    var g = parseInt(hex.substring(2,4),16);
    var b = parseInt(hex.substring(4,6),16);
    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    var shadow = (inset ? 'inset ' : '') + hOff + 'px ' + vOff + 'px ' + blur + 'px ' + spread + 'px ' + rgba;
    document.getElementById('cs-preview-box').style.boxShadow = shadow;
    var css = 'box-shadow: ' + shadow + ';';
    document.getElementById('cs-code-box').textContent = css;
  }

  function buildTextShadow() {
    var hOff = num('cs-t-h-offset');
    var vOff = num('cs-t-v-offset');
    var blur = num('cs-t-blur');
    var color = val('cs-t-color');
    var opacity = parseFloat(val('cs-t-opacity'));
    var hex = color.replace('#','');
    var r = parseInt(hex.substring(0,2),16);
    var g = parseInt(hex.substring(2,4),16);
    var b = parseInt(hex.substring(4,6),16);
    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    var shadow = hOff + 'px ' + vOff + 'px ' + blur + 'px ' + rgba;
    document.getElementById('cs-preview-text').style.textShadow = shadow;
    var css = 'text-shadow: ' + shadow + ';';
    document.getElementById('cs-code-text').textContent = css;
  }

  function copyCode(elId, btnId) {
    var text = document.getElementById(elId).textContent;
    navigator.clipboard ? navigator.clipboard.writeText(text) : (function(){ var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); })();
    var btn = document.getElementById(btnId);
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy CSS'; }, 2000);
  }

  function bindRange(id, displayId, suffix) {
    var el = document.getElementById(id);
    var disp = document.getElementById(displayId);
    el.addEventListener('input', function() {
      disp.textContent = el.value + (suffix||'');
      buildBoxShadow(); buildTextShadow();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    buildBoxShadow();
    buildTextShadow();

    ['cs-h-offset','cs-v-offset','cs-blur','cs-spread','cs-color','cs-opacity','cs-inset'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', buildBoxShadow);
    });
    ['cs-t-h-offset','cs-t-v-offset','cs-t-blur','cs-t-color','cs-t-opacity'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', buildTextShadow);
    });
    bindRange('cs-h-offset','cs-h-offset-val','px');
    bindRange('cs-v-offset','cs-v-offset-val','px');
    bindRange('cs-blur','cs-blur-val','px');
    bindRange('cs-spread','cs-spread-val','px');
    bindRange('cs-opacity','cs-opacity-val','');
    bindRange('cs-t-h-offset','cs-t-h-val','px');
    bindRange('cs-t-v-offset','cs-t-v-val','px');
    bindRange('cs-t-blur','cs-t-blur-val','px');
    bindRange('cs-t-opacity','cs-t-opacity-val','');

    document.getElementById('cs-copy-box').addEventListener('click', function() { copyCode('cs-code-box','cs-copy-box'); });
    document.getElementById('cs-copy-text').addEventListener('click', function() { copyCode('cs-code-text','cs-copy-text'); });
  });
})();
