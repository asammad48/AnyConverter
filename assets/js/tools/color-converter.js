/* Color Converter */
document.addEventListener('DOMContentLoaded', function () {
  const picker = document.getElementById('color-picker');
  const swatch = document.getElementById('color-swatch');
  const hexInput = document.getElementById('color-hex');
  const rgbInput = document.getElementById('color-rgb');
  const hslInput = document.getElementById('color-hsl');
  const cmykInput = document.getElementById('color-cmyk');
  const hsbInput = document.getElementById('color-hsb');
  const palette = document.getElementById('color-palette');
  let updating = false;

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function(c){return c+c;}).join('');
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    if (isNaN(n)) return null;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r,g,b].map(function(v){return Math.round(v).toString(16).padStart(2,'0');}).join('');
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
    }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
  }

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      function hue2rgb(p, q, t) { if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; }
      const q = l < 0.5 ? l*(1+s) : l+s-l*s;
      const p = 2*l-q;
      r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
    }
    return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
  }

  function rgbToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r,g,b);
    if (k === 1) return { c:0, m:0, y:0, k:100 };
    return {
      c: Math.round((1-r-k)/(1-k)*100),
      m: Math.round((1-g-k)/(1-k)*100),
      y: Math.round((1-b-k)/(1-k)*100),
      k: Math.round(k*100)
    };
  }

  function rgbToHsb(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
    let h = 0, s = max === 0 ? 0 : d/max;
    if (d !== 0) {
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
    }
    return { h: Math.round(h*360), s: Math.round(s*100), b: Math.round(max*100) };
  }

  function updateColorStats(hsl, hsb) {
    const h = document.getElementById('stat-hue');
    const s = document.getElementById('stat-sat');
    const l = document.getElementById('stat-light');
    const b = document.getElementById('stat-bright');
    if (h) h.textContent = hsl.h + '°';
    if (s) s.textContent = hsl.s + '%';
    if (l) l.textContent = hsl.l + '%';
    if (b) b.textContent = hsb.b + '%';
  }

  function updateFromHex(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);

    const uc = document.getElementById('tog-uc-hex');
    const hexVal = uc && !uc.classList.contains('off') ? hex.toUpperCase() : hex.toLowerCase();

    rgbInput.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    hslInput.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    cmykInput.value = 'cmyk(' + cmyk.c + '%, ' + cmyk.m + '%, ' + cmyk.y + '%, ' + cmyk.k + '%)';
    hsbInput.value = 'hsb(' + hsb.h + ', ' + hsb.s + '%, ' + hsb.b + '%)';
    hexInput.value = hexVal;

    swatch.style.background = hex;
    picker.value = hex.length === 7 ? hex : (hex.length === 4 ? '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3] : hex);
    buildPalette(hsl.h, hsl.s);
    updateColorStats(hsl, hsb);
  }

  function buildPalette(h, s) {
    palette.innerHTML = '';
    const lightnesses = [95,88,80,70,60,50,40,30,20,12,6];
    lightnesses.forEach(function(l, i) {
      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const sw = document.createElement('div');
      sw.className = 'palette-swatch' + (i === 5 ? ' base' : '');
      sw.style.background = hex;
      sw.title = hex;
      sw.addEventListener('click', function () {
        if (!updating) {
          updating = true;
          updateFromHex(hex);
          updating = false;
        }
      });
      palette.appendChild(sw);
    });
  }

  picker.addEventListener('input', function () {
    if (!updating) { updating = true; updateFromHex(this.value); updating = false; }
  });

  hexInput.addEventListener('input', function () {
    if (updating) return;
    let val = this.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
      updating = true;
      updateFromHex(val);
      updating = false;
    }
  });

  function parseRgb(val) {
    const m = val.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    return m ? { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) } : null;
  }

  function parseHsl(val) {
    const m = val.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
    return m ? { h: parseInt(m[1]), s: parseInt(m[2]), l: parseInt(m[3]) } : null;
  }

  rgbInput.addEventListener('change', function () {
    if (updating) return;
    const rgb = parseRgb(this.value);
    if (rgb) { updating = true; updateFromHex(rgbToHex(rgb.r, rgb.g, rgb.b)); updating = false; }
  });

  hslInput.addEventListener('change', function () {
    if (updating) return;
    const hsl = parseHsl(this.value);
    if (hsl) { const rgb = hslToRgb(hsl.h, hsl.s, hsl.l); updating = true; updateFromHex(rgbToHex(rgb.r, rgb.g, rgb.b)); updating = false; }
  });

  // Sidebar toggles
  const togUcHex = document.getElementById('tog-uc-hex');
  if (togUcHex) {
    togUcHex.addEventListener('click', function() {
      togUcHex.classList.toggle('off');
      togUcHex.setAttribute('aria-checked', !togUcHex.classList.contains('off'));
      if (!updating) { updating = true; updateFromHex(hexInput.value); updating = false; }
    });
  }

  // Copy buttons
  document.querySelectorAll('[data-copy-color]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const val = document.getElementById(btn.dataset.copyColor).value;
      if (val) window.copyToClipboard(val);
    });
  });

  // Init
  updateFromHex('#5B5BD6');
});
