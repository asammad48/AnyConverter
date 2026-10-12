/* AnyConverter — dc runtime: renders the tool-page design templates (sc-if / sc-for / {{ path }})
   with plain DOM, no framework. The same renderer runs in Node at build time to pre-render static HTML,
   and in the browser to make the page interactive (re-render to string + morph the live DOM). */
(function (root) {
  'use strict';

  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };
  var EVENTS = { onclick: 'click', oninput: 'input', onchange: 'change', ondragover: 'dragover', ondragleave: 'dragleave', ondrop: 'drop', ondragstart: 'dragstart', ondragend: 'dragend', onkeydown: 'keydown' };
  var HOLE = /\{\{\s*([\w.]+)\s*\}\}/g;
  var WHOLE = /^\{\{\s*([\w.]+)\s*\}\}$/;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* ---------- parse template HTML into a small AST ---------- */
  function parse(html) {
    var re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s=>\/"]+(?:\s*=\s*"[^"]*")?)*)\s*(\/?)>|[^<]+|</g;
    var rootNode = { kids: [] }, stack = [rootNode], m;
    while ((m = re.exec(html))) {
      var top = stack[stack.length - 1];
      if (m[0].slice(0, 4) === '<!--') continue;
      if (m[1]) { // closing tag
        var name = m[1].toLowerCase();
        for (var i = stack.length - 1; i > 0; i--) { if (stack[i].tag === name) { stack.length = i; break; } }
        continue;
      }
      if (m[2]) {
        var tag = m[2].toLowerCase(), attrs = [], am, are = /([^\s=]+)(?:\s*=\s*"([^"]*)")?/g;
        while ((am = are.exec(m[3] || ''))) attrs.push([am[1], am[2] == null ? null : am[2]]);
        var node;
        if (tag === 'sc-if') node = { t: 'if', expr: hole(attr(attrs, 'value')), kids: [] };
        else if (tag === 'sc-for') node = { t: 'for', list: hole(attr(attrs, 'list')), as: attr(attrs, 'as'), kids: [] };
        else node = { t: 'el', tag: tag, attrs: attrs, kids: [] };
        node.tag = tag;
        top.kids.push(node);
        if (!VOID[tag] && !m[4]) stack.push(node);
        continue;
      }
      top.kids.push({ t: 'text', v: m[0] });
    }
    return rootNode.kids;
  }
  function attr(attrs, n) { for (var i = 0; i < attrs.length; i++) if (attrs[i][0].toLowerCase() === n) return attrs[i][1]; return null; }
  function hole(v) { var m = WHOLE.exec(String(v || '').trim()); return m ? m[1] : null; }

  /* ---------- render AST to an HTML string ---------- */
  function lookup(scopes, path) {
    var parts = path.split('.'), v, i;
    for (i = scopes.length - 1; i >= 0; i--) { if (scopes[i] && parts[0] in scopes[i]) { v = scopes[i][parts[0]]; break; } }
    for (i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function interp(str, scopes) {
    return str.replace(HOLE, function (m, p) { var v = lookup(scopes, p); return v == null ? '' : esc(v); });
  }
  function renderNodes(nodes, scopes, ctx) {
    var out = '';
    for (var i = 0; i < nodes.length; i++) out += renderNode(nodes[i], scopes, ctx);
    return out;
  }
  function renderNode(n, scopes, ctx) {
    if (n.t === 'text') return interp(n.v, scopes);
    if (n.t === 'if') return lookup(scopes, n.expr) ? renderNodes(n.kids, scopes, ctx) : '';
    if (n.t === 'for') {
      var list = lookup(scopes, n.list) || [], out = '';
      for (var k = 0; k < list.length; k++) { var sc = {}; sc[n.as] = list[k]; out += renderNodes(n.kids, scopes.concat([sc]), ctx); }
      return out;
    }
    var s = '<' + n.tag, selVal = null;
    for (var j = 0; j < n.attrs.length; j++) {
      var name = n.attrs[j][0], raw = n.attrs[j][1], lname = name.toLowerCase();
      if (raw == null) { s += ' ' + name; continue; }
      var hp = hole(raw);
      if (EVENTS[lname]) {
        var fn = hp ? lookup(scopes, hp) : null;
        if (typeof fn === 'function') { ctx.handlers.push(fn); s += ' data-dc-' + EVENTS[lname] + '="' + (ctx.handlers.length - 1) + '"'; }
        continue;
      }
      if (hp) {
        var v = lookup(scopes, hp);
        if (n.tag === 'select' && lname === 'value') { selVal = v == null ? '' : String(v); s += ' data-dc-value="' + esc(selVal) + '"'; continue; }
        if (v === true) { s += ' ' + name; continue; }
        if (v === false || v == null) continue;
        s += ' ' + name + '="' + esc(v) + '"';
        continue;
      }
      s += ' ' + name + '="' + (raw.indexOf('{{') > -1 ? interp(raw, scopes) : raw) + '"';
    }
    s += '>';
    if (VOID[n.tag]) return s;
    if (selVal != null) ctx.sel.push(selVal);
    var inner = renderNodes(n.kids, scopes, ctx);
    if (selVal != null) ctx.sel.pop();
    if (n.tag === 'option' && ctx.sel.length) {
      var ov = attr(n.attrs, 'value'); ov = hole(ov) ? lookup(scopes, hole(ov)) : ov;
      if (String(ov) === ctx.sel[ctx.sel.length - 1]) s = s.slice(0, -1) + ' selected>';
    }
    return s + inner + '</' + n.tag + '>';
  }
  function renderToString(ast, vals) {
    var ctx = { handlers: [], sel: [] };
    return { html: renderNodes(ast, [vals], ctx), handlers: ctx.handlers };
  }

  /* ---------- browser: morph the live DOM to the freshly rendered HTML ---------- */
  function morphChildren(a, b) {
    var bk = b.childNodes, i;
    for (i = 0; i < bk.length; i++) {
      var an = a.childNodes[i], bn = bk[i];
      if (!an) { a.appendChild(bn.cloneNode(true)); continue; }
      if (an.nodeType !== bn.nodeType || (an.nodeType === 1 && an.tagName !== bn.tagName)) { a.replaceChild(bn.cloneNode(true), an); continue; }
      if (an.nodeType === 3) { if (an.data !== bn.data) an.data = bn.data; continue; }
      if (an.nodeType === 1) morphEl(an, bn);
    }
    while (a.childNodes.length > bk.length) a.removeChild(a.lastChild);
  }
  function morphEl(a, b) {
    var keepOpen = a.tagName === 'DETAILS';
    for (var i = 0; i < b.attributes.length; i++) {
      var at = b.attributes[i];
      if (keepOpen && at.name === 'open') continue;
      if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    }
    for (var j = a.attributes.length - 1; j >= 0; j--) {
      var n = a.attributes[j].name;
      if (keepOpen && n === 'open') continue;
      if (!b.hasAttribute(n)) a.removeAttribute(n);
    }
    if (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') {
      if (a.type === 'checkbox' || a.type === 'radio') a.checked = b.hasAttribute('checked');
      else if (a.type !== 'file') { var v = b.getAttribute('value') || ''; if (a.value !== v) a.value = v; }
    }
    morphChildren(a, b);
    if (a.tagName === 'SELECT' && a.hasAttribute('data-dc-value') && a.value !== a.getAttribute('data-dc-value')) a.value = a.getAttribute('data-dc-value');
  }

  /* Base class the design scripts extend (React-like state API). */
  function DCLogic() { this.state = {}; this.props = {}; }
  DCLogic.prototype.setState = function (u) {
    var next = typeof u === 'function' ? u(this.state) : u;
    if (!next) return;
    this.state = Object.assign({}, this.state, next);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__schedule) this.__schedule(); };

  /* Layout values that differ between desktop and mobile are expressed as CSS variables so the
     pre-rendered HTML is already correct on phones before any JavaScript runs. */
  var LAYOUT = ['padX', 'h1Size', 'heroPad', 'gridCols', 'stepCols', 'featCols', 'relCols'];
  function layoutVars(vals) { var o = Object.assign({}, vals); LAYOUT.forEach(function (k) { if (k in o) o[k] = 'var(--dc-' + k + ')'; }); return o; }

  function mount(el, ast, Comp) {
    var c = new Comp(), handlers = [], pending = false;
    if (!c.state || !Object.keys(c.state).length) c.state = c.state || {};
    function render() {
      pending = false;
      var r = renderToString(ast, layoutVars(c.renderVals()));
      handlers = r.handlers;
      var t = document.createElement('template');
      t.innerHTML = r.html;
      morphChildren(el, t.content);
    }
    c.__schedule = function () { if (!pending) { pending = true; (window.requestAnimationFrame || setTimeout)(render); } };
    Object.keys(EVENTS).forEach(function (k) {
      var type = EVENTS[k];
      el.addEventListener(type, function (e) {
        var n = e.target;
        while (n && n !== el.parentNode) {
          if (n.nodeType === 1 && n.hasAttribute('data-dc-' + type)) {
            var fn = handlers[+n.getAttribute('data-dc-' + type)];
            if (fn) fn(e);
            return;
          }
          n = n.parentNode;
        }
      });
    });
    render();
    if (c.componentDidMount) c.componentDidMount();
    return c;
  }

  var api = { parse: parse, renderToString: renderToString, layoutVars: layoutVars, LAYOUT: LAYOUT, DCLogic: DCLogic, mount: mount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.DCRuntime = api;
    root.DCLogic = DCLogic;
    var boot = function () {
      var el = document.getElementById('dc-root'), tpl = document.getElementById('dc-template');
      if (!el || !tpl || typeof root.DCTool !== 'function') return;
      var Comp = root.DCTool(el.getAttribute('data-lang') || 'en', DCLogic);
      mount(el, parse(tpl.textContent), Comp);
    };
    /* Deferred tool scripts run after this file, so wait for DOMContentLoaded (fires after all of them). */
    if (document.readyState === 'complete') boot(); else document.addEventListener('DOMContentLoaded', boot);
  }
})(typeof window !== 'undefined' ? window : this);
