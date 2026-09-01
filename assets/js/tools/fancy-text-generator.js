(function() {
  var STYLES = [
    {name:'Bold',map:function(c){var code=c.charCodeAt(0);if(code>=65&&code<=90)return String.fromCodePoint(code+119743);if(code>=97&&code<=122)return String.fromCodePoint(code+119737);if(code>=48&&code<=57)return String.fromCodePoint(code+120764);return c;}},
    {name:'Italic',map:function(c){var code=c.charCodeAt(0);if(code>=65&&code<=90)return String.fromCodePoint(code+119795);if(code>=97&&code<=122)return String.fromCodePoint(code===97?119834:code+119789);return c;}},
    {name:'Bold Italic',map:function(c){var code=c.charCodeAt(0);if(code>=65&&code<=90)return String.fromCodePoint(code+119847);if(code>=97&&code<=122)return String.fromCodePoint(code+119841);return c;}},
    {name:'Script',map:function(c){var m={A:'\u{1D49C}',B:'ℬ',C:'\u{1D49E}',D:'\u{1D49F}',E:'ℰ',F:'ℱ',G:'\u{1D4A2}',H:'ℋ',I:'ℐ',J:'\u{1D4A5}',K:'\u{1D4A6}',L:'ℒ',M:'ℳ',N:'\u{1D4A9}',O:'\u{1D4AA}',P:'\u{1D4AB}',Q:'\u{1D4AC}',R:'ℛ',S:'\u{1D4AE}',T:'\u{1D4AF}',U:'\u{1D4B0}',V:'\u{1D4B1}',W:'\u{1D4B2}',X:'\u{1D4B3}',Y:'\u{1D4B4}',Z:'\u{1D4B5}',a:'\u{1D4B6}',b:'\u{1D4B7}',c:'\u{1D4B8}',d:'\u{1D4B9}',e:'ℯ',f:'\u{1D4BB}',g:'ℊ',h:'\u{1D4BD}',i:'\u{1D4BE}',j:'\u{1D4BF}',k:'\u{1D4C0}',l:'\u{1D4C1}',m:'\u{1D4C2}',n:'\u{1D4C3}',o:'ℴ',p:'\u{1D4C5}',q:'\u{1D4C6}',r:'\u{1D4C7}',s:'\u{1D4C8}',t:'\u{1D4C9}',u:'\u{1D4CA}',v:'\u{1D4CB}',w:'\u{1D4CC}',x:'\u{1D4CD}',y:'\u{1D4CE}',z:'\u{1D4CF}'};return m[c]||c;}},
    {name:'Double Struck',map:function(c){var code=c.charCodeAt(0);if(code>=65&&code<=90)return String.fromCodePoint(code+120055);if(code>=97&&code<=122)return String.fromCodePoint(code+120049);if(code>=48&&code<=57)return String.fromCodePoint(code+120744);return c;}},
    {name:'Monospace',map:function(c){var code=c.charCodeAt(0);if(code>=65&&code<=90)return String.fromCodePoint(code+120367);if(code>=97&&code<=122)return String.fromCodePoint(code+120361);if(code>=48&&code<=57)return String.fromCodePoint(code+120774);return c;}},
    {name:'Circled',map:function(c){var m={A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ',a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ','0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'};return m[c]||c;}},
    {name:'Strikethrough',map:function(c){return c+'̶';}},
    {name:'Underline',map:function(c){return c+'̲';}},
    {name:'Upside Down',map:function(c){var m={a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',A:'∀',B:'ᗺ',C:'Ɔ',D:'ᗡ',E:'Ǝ',F:'Ⅎ',G:'פ',H:'H',I:'I',J:'ɾ',K:'ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Q',R:'ᴚ',S:'S',T:'⊥',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z',' ':' '};return m[c]||c;}},
    {name:'Small Caps',map:function(c){var m={a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'};return m[c.toLowerCase()]||c;}}
  ];

  function applyStyle(text, style) {
    return text.split('').map(style.map).join('');
  }

  function generate() {
    var text = document.getElementById('fancy-input').value;
    var container = document.getElementById('fancy-output');
    container.innerHTML = '';
    if (!text) return;
    STYLES.forEach(function(style) {
      var fancy = applyStyle(text, style);
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--color-surface,#fff);border:1px solid var(--color-border,#DDD8D0);border-radius:8px';
      var label = document.createElement('span');
      label.style.cssText = 'font-size:11px;color:var(--color-text-3,#7C7169);min-width:80px;flex-shrink:0';
      label.textContent = style.name;
      var text_el = document.createElement('span');
      text_el.style.cssText = 'flex:1;font-size:18px;word-break:break-all';
      text_el.textContent = fancy;
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.textContent = 'Copy';
      btn.addEventListener('click', (function(f) { return function() { navigator.clipboard.writeText(f); }; })(fancy));
      row.appendChild(label); row.appendChild(text_el); row.appendChild(btn);
      container.appendChild(row);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fancy-input').addEventListener('input', generate);
    document.getElementById('btn-copy-all-fancy').addEventListener('click', function() {
      var rows = document.querySelectorAll('#fancy-output span:nth-child(2)');
      var all = Array.from(rows).map(function(s) { return s.textContent; }).join('\n');
      if (all) navigator.clipboard.writeText(all);
    });
    document.getElementById('btn-clear-fancy').addEventListener('click', function() {
      document.getElementById('fancy-input').value = '';
      document.getElementById('fancy-output').innerHTML = '';
    });
    generate();
  });
})();
