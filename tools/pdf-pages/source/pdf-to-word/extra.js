  /* ---- Real conversion (the design only simulates it): pdf.js reads the text layer, optional OCR
     (Tesseract.js) handles scanned pages, and the .docx package is written with JSZip. ---- */
  var X = {
    en: { meta: function (p, h, t) { return p + (p === 1 ? ' page' : ' pages') + ' · ' + h + (h === 1 ? ' heading' : ' headings') + (t ? ' · ' + t + (t === 1 ? ' table' : ' tables') : ''); }, pw: 'This PDF is password-protected. Enter the password to open it:', pwBad: 'Wrong password. Try again:', ocrLoad: 'Loading text recognition…', locked: 'This PDF is password-protected. Unlock it first, then try again.', broken: 'This PDF could not be opened. It may be damaged.', tooBig: 'This PDF is larger than 50 MB.', tooMany: 'This PDF has more than 100 pages. Choose a page range of up to 100 pages.', noText: 'No selectable text was found. Turn on text recognition for scanned pages and convert again.', fail: 'Something went wrong while converting this PDF.', ocrFail: 'Text recognition could not be loaded. Check your connection and try again.', cancelled: 'Cancelled.' },
    es: { meta: function (p, h, t) { return p + (p === 1 ? ' página' : ' páginas') + ' · ' + h + (h === 1 ? ' título' : ' títulos') + (t ? ' · ' + t + (t === 1 ? ' tabla' : ' tablas') : ''); }, pw: 'Este PDF está protegido con contraseña. Escribe la contraseña para abrirlo:', pwBad: 'Contraseña incorrecta. Inténtalo de nuevo:', ocrLoad: 'Cargando el reconocimiento de texto…', locked: 'Este PDF está protegido con contraseña. Desbloquéalo primero y vuelve a intentarlo.', broken: 'No se pudo abrir este PDF. Puede estar dañado.', tooBig: 'Este PDF supera los 50 MB.', tooMany: 'Este PDF tiene más de 100 páginas. Elige un rango de hasta 100 páginas.', noText: 'No se encontró texto seleccionable. Activa el reconocimiento de texto para páginas escaneadas y vuelve a convertir.', fail: 'Algo salió mal al convertir este PDF.', ocrFail: 'No se pudo cargar el reconocimiento de texto. Revisa tu conexión y vuelve a intentarlo.', cancelled: 'Cancelado.' },
    da: { meta: function (p, h, t) { return p + (p === 1 ? ' side' : ' sider') + ' · ' + h + (h === 1 ? ' overskrift' : ' overskrifter') + (t ? ' · ' + t + (t === 1 ? ' tabel' : ' tabeller') : ''); }, pw: 'Denne PDF er beskyttet med adgangskode. Skriv adgangskoden for at åbne den:', pwBad: 'Forkert adgangskode. Prøv igen:', ocrLoad: 'Indlæser tekstgenkendelse…', locked: 'Denne PDF er beskyttet med adgangskode. Lås den op først, og prøv igen.', broken: 'Denne PDF kunne ikke åbnes. Den er måske beskadiget.', tooBig: 'Denne PDF er større end 50 MB.', tooMany: 'Denne PDF har mere end 100 sider. Vælg et sideinterval på højst 100 sider.', noText: 'Der blev ikke fundet markerbar tekst. Slå tekstgenkendelse til for scannede sider, og konvertér igen.', fail: 'Noget gik galt under konverteringen af denne PDF.', ocrFail: 'Tekstgenkendelse kunne ikke indlæses. Tjek din forbindelse, og prøv igen.', cancelled: 'Annulleret.' }
  }[String(DCI.LOC).slice(0, 2)] || null;
  if (!X) X = { meta: L.meta };
  var SAMPLE = {
    en: { title: 'Annual Report 2025', sub: 'A short sample document', h: ['Summary', 'Results by quarter', 'What comes next'], p: ['This sample PDF was created in your browser so you can see how the converter works. Headings, paragraphs and lists come out as real Word text that you can edit.', 'Revenue grew in every quarter of the year. Most of the growth came from new customers in the second half, while costs stayed close to the plan.', 'Next year the team will focus on faster delivery, better support and two new products. Each goal has a clear owner and a date.'], tb: ['Quarter', 'Revenue', 'Growth'], li: ['Revenue up 18% on last year', 'Two new offices opened', 'Customer satisfaction at 92%'] },
    es: { title: 'Informe anual 2025', sub: 'Un documento de muestra breve', h: ['Resumen', 'Resultados por trimestre', 'Próximos pasos'], p: ['Este PDF de muestra se ha creado en tu navegador para que veas cómo funciona el conversor. Los títulos, párrafos y listas salen como texto real de Word que puedes editar.', 'Los ingresos crecieron en todos los trimestres del año. La mayor parte del crecimiento llegó de clientes nuevos en el segundo semestre, y los costes se mantuvieron cerca del plan.', 'El próximo año el equipo se centrará en entregas más rápidas, mejor soporte y dos productos nuevos. Cada objetivo tiene un responsable y una fecha.'], tb: ['Trimestre', 'Ingresos', 'Crecimiento'], li: ['Ingresos un 18 % por encima del año pasado', 'Dos oficinas nuevas', 'Satisfacción de clientes del 92 %'] },
    da: { title: 'Årsrapport 2025', sub: 'Et kort eksempeldokument', h: ['Resumé', 'Resultater pr. kvartal', 'Det næste skridt'], p: ['Denne eksempel-PDF er lavet i din browser, så du kan se, hvordan konverteren virker. Overskrifter, afsnit og lister bliver til rigtig Word-tekst, som du kan redigere.', 'Omsætningen voksede i alle årets kvartaler. Det meste af væksten kom fra nye kunder i andet halvår, mens omkostningerne holdt sig tæt på planen.', 'Næste år fokuserer teamet på hurtigere levering, bedre support og to nye produkter. Hvert mål har en ansvarlig og en dato.'], tb: ['Kvartal', 'Omsætning', 'Vækst'], li: ['Omsætning 18 % over sidste år', 'To nye kontorer åbnet', 'Kundetilfredshed på 92 %'] }
  }[String(DCI.LOC).slice(0, 2)];
  var OCR_LANG = ['eng', 'spa', 'dan', 'deu', 'fra'];
  var MAX_BYTES = 50 * 1024 * 1024, MAX_PAGES = 100;

  function waitLibs() {
    return new Promise(function (res) {
      var ok = function () { return window.pdfjsLib && window.JSZip && window.PDFLib; };
      var go = function () { if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'; res(); };
      if (ok()) return go();
      var t = setInterval(function () { if (ok()) { clearInterval(t); go(); } }, 80);
    });
  }
  var tessP = null;
  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (tessP) return tessP;
    tessP = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/tesseract.js@4.1.2/dist/tesseract.min.js';
      s.onload = function () { window.Tesseract ? res(window.Tesseract) : rej(new Error('ocr')); };
      s.onerror = function () { tessP = null; rej(new Error('ocr')); };
      document.head.appendChild(s);
    });
    return tessP;
  }

  /* ---------- text layout analysis ---------- */
  var BAD_XML = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;
  function xml(s) { return String(s).replace(BAD_XML, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function familyOf(name, generic) {
    var n = String(name || '') + ' ' + String(generic || '');
    if (/courier|mono/i.test(n)) return 'Courier New';
    if (/times|serif|georgia|garamond|minion|cambria/i.test(n) && !/sans/i.test(n)) return 'Times New Roman';
    return 'Arial';
  }

  /* Group pdf.js text items into lines with position, size and style. */
  async function pageLines(page) {
    var vp = page.getViewport({ scale: 1 });
    var tc = await page.getTextContent();
    try { await page.getOperatorList(); } catch (e) { /* fonts stay unknown: plain text */ }
    var items = [];
    tc.items.forEach(function (it) {
      if (!it.str || !it.str.trim() && !it.hasEOL) return;
      if (!it.str.trim()) return;
      var tx = window.pdfjsLib.Util.transform(vp.transform, it.transform);
      var size = Math.hypot(tx[2], tx[3]) || 10;
      var font = null;
      try { font = page.commonObjs.has(it.fontName) ? page.commonObjs.get(it.fontName) : null; } catch (e) { font = null; }
      var fname = font && (font.name || font.loadedName) || '';
      var st = tc.styles[it.fontName] || {};
      items.push({ s: it.str, x: tx[4], y: tx[5], size: size, w: it.width * (vp.scale || 1),
        bold: !!(font && (font.bold || /bold|black|heavy|semibold/i.test(fname))), italic: !!(font && (font.italic || /italic|oblique/i.test(fname))),
        fam: familyOf(fname, st.fontFamily) });
    });
    items.sort(function (a, b) { return Math.abs(a.y - b.y) < Math.min(a.size, b.size) * 0.45 ? a.x - b.x : a.y - b.y; });
    var lines = [];
    items.forEach(function (it) {
      var ln = lines[lines.length - 1];
      if (ln && Math.abs(ln.y - it.y) < Math.min(ln.size, it.size) * 0.45) {
        var last = ln.runs[ln.runs.length - 1];
        var gap = it.x - (last.x + last.w);
        var cell = ln.cells[ln.cells.length - 1];
        if (gap > it.size * 1.5) ln.cells.push({ x: it.x, end: it.x + it.w, runs: [{ s: it.s, bold: it.bold, italic: it.italic, fam: it.fam, size: it.size }] });
        else { cell.runs.push({ s: (gap > it.size * 0.18 ? ' ' : '') + it.s, bold: it.bold, italic: it.italic, fam: it.fam, size: it.size }); cell.end = it.x + it.w; }
        var sp = gap > it.size * 0.18 && !/\s$/.test(last.s) && !/^\s/.test(it.s) ? ' ' : '';
        if (last.bold === it.bold && last.italic === it.italic && Math.abs(last.size - it.size) < 0.6) { last.s += sp + it.s; last.w = it.x + it.w - last.x; }
        else { if (sp) last.s += sp; ln.runs.push({ s: it.s, x: it.x, w: it.w, size: it.size, bold: it.bold, italic: it.italic, fam: it.fam }); }
        ln.size = Math.max(ln.size, it.size); ln.right = Math.max(ln.right, it.x + it.w);
      } else {
        lines.push({ y: it.y, x: it.x, size: it.size, right: it.x + it.w, cells: [{ x: it.x, end: it.x + it.w, runs: [{ s: it.s, bold: it.bold, italic: it.italic, fam: it.fam, size: it.size }] }], runs: [{ s: it.s, x: it.x, w: it.w, size: it.size, bold: it.bold, italic: it.italic, fam: it.fam }] });
      }
    });
    lines.forEach(function (l) { l.text = l.runs.map(function (r) { return r.s; }).join('').replace(/\s+/g, ' ').trim(); l.bold = l.runs.every(function (r) { return r.bold; }); l.cells.forEach(function (c) { c.text = c.runs.map(function (r) { return r.s; }).join('').replace(/\s+/g, ' ').trim(); }); });
    return { lines: lines.filter(function (l) { return l.text; }), w: vp.width, h: vp.height };
  }

  /* OCR a page: render at 2x and read lines back (positions in PDF points). */
  async function ocrLines(page, lang, worker) {
    var vp = page.getViewport({ scale: 2 });
    var c = document.createElement('canvas');
    c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    var r = await worker.recognize(c);
    var out = [];
    (r.data.lines || []).forEach(function (l) {
      var t = String(l.text || '').replace(/\s+/g, ' ').trim();
      if (!t || l.confidence < 30) return;
      var b = l.bbox, size = Math.max(6, (b.y1 - b.y0) / 2 * 0.8);
      out.push({ y: b.y1 / 2, x: b.x0 / 2, size: size, right: b.x1 / 2, text: t, bold: false, cells: [{ x: b.x0 / 2, text: t, runs: [] }], runs: [{ s: t, x: b.x0 / 2, w: (b.x1 - b.x0) / 2, size: size, bold: false, italic: false, fam: 'Arial' }] });
    });
    c.width = c.height = 0;
    return { lines: out, w: vp.width / 2, h: vp.height / 2 };
  }

  function bodySize(pages) {
    var count = {};
    pages.forEach(function (p) { p.lines.forEach(function (l) { var k = Math.round(l.size * 2) / 2; count[k] = (count[k] || 0) + l.text.length; }); });
    var best = 11, n = -1;
    Object.keys(count).forEach(function (k) { if (count[k] > n) { n = count[k]; best = +k; } });
    return best;
  }
  var BULLET = /^([•·▪◦●○■□➢►\-–*]|\(?\d{1,3}[.)]|\(?[a-z][.)])\s+/i;

  /* ---------- WordprocessingML ---------- */
  function runXml(r, size) {
    var pr = '<w:rFonts w:ascii="' + r.fam + '" w:hAnsi="' + r.fam + '" w:cs="' + r.fam + '"/>' + (r.bold ? '<w:b/>' : '') + (r.italic ? '<w:i/>' : '') + (size ? '<w:sz w:val="' + Math.max(8, Math.round(size * 2)) + '"/><w:szCs w:val="' + Math.max(8, Math.round(size * 2)) + '"/>' : '');
    return '<w:r><w:rPr>' + pr + '</w:rPr><w:t xml:space="preserve">' + xml(r.s) + '</w:t></w:r>';
  }
  /* Rows of 2+ cells whose columns line up across 2+ consecutive lines become a table. */
  function tableRuns(lines) {
    var marks = [], i = 0;
    var fits = function (a, b) { if (a.cells.length !== b.cells.length || a.cells.length < 2) return false; var tol = Math.max(a.size, b.size) * 2; return a.cells.every(function (c, k) { var d = b.cells[k]; return Math.abs(c.x - d.x) < tol || Math.abs(c.end - d.end) < tol || Math.abs((c.x + c.end) / 2 - (d.x + d.end) / 2) < tol; }); };
    while (i < lines.length) {
      var j = i;
      while (j + 1 < lines.length && fits(lines[i], lines[j + 1]) && lines[j + 1].y - lines[j].y < Math.max(lines[j].size, lines[j + 1].size) * 2.6) j++;
      if (j > i) { marks.push([i, j]); i = j + 1; } else i++;
    }
    return marks;
  }
  function cellRuns(c) { var rs = c.runs.length ? c.runs : [{ s: c.text, bold: false, italic: false, fam: 'Arial' }]; return rs.map(function (r, i) { return { s: i === 0 ? r.s.replace(/^\s+/, '') : r.s, bold: r.bold, italic: r.italic, fam: r.fam }; }); }
  function flowDoc(pages) {
    var body = bodySize(pages), out = [], heads = 0, tables = 0;
    pages.forEach(function (pg, pi) {
      var para = null, prev = null;
      var flush = function () { if (para) out.push(para); para = null; };
      var tbl = {};
      tableRuns(pg.lines).forEach(function (m) { tbl[m[0]] = m[1]; });
      var skipTo = -1;
      pg.lines.forEach(function (l, li) {
        if (li <= skipTo) return;
        if (tbl[li] != null) {
          flush(); tables++;
          out.push({ table: pg.lines.slice(li, tbl[li] + 1).map(function (row) { return row.cells.map(cellRuns); }) });
          skipTo = tbl[li]; prev = pg.lines[tbl[li]];
          return;
        }
        if (/^\d{1,4}$/.test(l.text) && (l.y > pg.h * 0.9 || l.y < pg.h * 0.08)) return; // page numbers
        var lvl = 0;
        if (l.size >= body * 1.6) lvl = 1; else if (l.size >= body * 1.2) lvl = 2; else if (l.bold && l.text.length < 90 && !/[.,;:]$/.test(l.text)) lvl = 3;
        var gap = prev ? l.y - prev.y : 0;
        var bullet = BULLET.test(l.text);
        var newPara = !para || lvl || para.lvl || bullet || gap > Math.max(prev.size, l.size) * 1.75 || gap < 0 || Math.abs(l.size - prev.size) > 1 || (l.x - prev.x > body * 1.5 && /[.!?:]$/.test(prev.text));
        if (newPara) {
          flush();
          para = { lvl: lvl, list: bullet, runs: [] };
          if (lvl) heads++;
        } else {
          var lr = para.runs[para.runs.length - 1];
          if (/[A-Za-zÀ-ÿ]-$/.test(lr.s) && /^[a-zà-ÿ]/.test(l.text)) lr.s = lr.s.slice(0, -1);
          else lr.s += ' ';
        }
        l.runs.forEach(function (r, i) {
          var s = i === 0 ? r.s.replace(/^\s+/, '') : r.s;
          var lr2 = para.runs[para.runs.length - 1];
          if (lr2 && lr2.bold === r.bold && lr2.italic === r.italic && lr2.fam === r.fam) lr2.s += s;
          else para.runs.push({ s: s, bold: r.bold, italic: r.italic, fam: r.fam, size: r.size });
        });
        prev = l;
      });
      flush();
      if (pi < pages.length - 1 && pg.lines.length) out.push({ br: true });
    });
    var xmlBody = out.map(function (p) {
      if (p.br) return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      if (p.table) {
        var cols = p.table[0].length, cw = Math.floor(9000 / cols), bd = '<w:top w:val="single" w:sz="4" w:color="BFB5AA"/><w:left w:val="single" w:sz="4" w:color="BFB5AA"/><w:bottom w:val="single" w:sz="4" w:color="BFB5AA"/><w:right w:val="single" w:sz="4" w:color="BFB5AA"/><w:insideH w:val="single" w:sz="4" w:color="BFB5AA"/><w:insideV w:val="single" w:sz="4" w:color="BFB5AA"/>';
        return '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>' + bd + '</w:tblBorders><w:tblCellMar><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + new Array(cols + 1).join('<w:gridCol w:w="' + cw + '"/>') + '</w:tblGrid>' +
          p.table.map(function (row) { return '<w:tr>' + row.map(function (cell) { return '<w:tc><w:tcPr><w:tcW w:w="' + cw + '" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr>' + cell.map(function (r) { return runXml(r, 0); }).join('') + '</w:p></w:tc>'; }).join('') + '</w:tr>'; }).join('') + '</w:tbl><w:p/>';
      }
      var style = p.lvl ? '<w:pStyle w:val="Heading' + p.lvl + '"/>' : '';
      var rs = p.runs.map(function (r) { var x = Object.assign({}, r); if (p.lvl) x.bold = false; return runXml(x, p.lvl ? 0 : (Math.abs(r.size - body) > 1 ? r.size : 0)); }).join('');
      return '<w:p><w:pPr>' + style + (p.list ? '<w:ind w:left="360" w:hanging="360"/>' : '') + '</w:pPr>' + rs + '</w:p>';
    }).join('');
    var last = pages[pages.length - 1] || { w: 595, h: 842 };
    return { body: xmlBody + sect(last.w, last.h, 1134), heads: heads, tables: tables, size: body };
  }
  function sect(w, h, m) {
    var tw = Math.round(w * 20), th = Math.round(h * 20);
    return '<w:sectPr><w:pgSz w:w="' + tw + '" w:h="' + th + '"' + (tw > th ? ' w:orient="landscape"' : '') + '/><w:pgMar w:top="' + m + '" w:right="' + m + '" w:bottom="' + m + '" w:left="' + m + '" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>';
  }
  function exactDoc(pages) {
    var body = bodySize(pages), heads = 0, parts = [];
    pages.forEach(function (pg, pi) {
      pg.lines.forEach(function (l) {
        if (l.size >= body * 1.2) heads++;
        var top = Math.max(0, l.y - l.size * 0.92);
        var w = Math.max(l.right - l.x, l.size) * 1.12 + l.size;
        parts.push('<w:p><w:pPr><w:framePr w:w="' + Math.round(w * 20) + '" w:hRule="auto" w:wrap="around" w:hAnchor="page" w:vAnchor="page" w:x="' + Math.round(l.x * 20) + '" w:y="' + Math.round(top * 20) + '"/><w:spacing w:before="0" w:after="0" w:line="' + Math.round(l.size * 1.15 * 20) + '" w:lineRule="exact"/></w:pPr>' +
          l.runs.map(function (r, i) { return runXml({ s: i === 0 ? r.s.replace(/^\s+/, '') : r.s, bold: r.bold, italic: r.italic, fam: r.fam }, r.size); }).join('') + '</w:p>');
      });
      var s = sect(pg.w, pg.h, 0);
      if (pi < pages.length - 1) parts.push('<w:p><w:pPr>' + s + '</w:pPr></w:p>');
      else parts.push(s);
    });
    return { body: parts.join(''), heads: heads, size: body };
  }
  async function docx(doc, title) {
    var z = new window.JSZip();
    var W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
    var H = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    z.file('[Content_Types].xml', H + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
    z.file('_rels/.rels', H + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
    z.file('word/_rels/document.xml.rels', H + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    var sz = Math.max(16, Math.min(28, Math.round(doc.size * 2)));
    var hd = function (n, s) { return '<w:style w:type="paragraph" w:styleId="Heading' + n + '"><w:name w:val="heading ' + n + '"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="' + (n === 1 ? 360 : 240) + '" w:after="120"/><w:outlineLvl w:val="' + (n - 1) + '"/></w:pPr><w:rPr><w:b/><w:sz w:val="' + s + '"/><w:szCs w:val="' + s + '"/></w:rPr></w:style>'; };
    z.file('word/styles.xml', H + '<w:styles ' + W + '><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="' + sz + '"/><w:szCs w:val="' + sz + '"/><w:lang w:val="' + DCI.LOC + '"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' + hd(1, sz + 16) + hd(2, sz + 8) + hd(3, sz + 2) + '</w:styles>');
    var now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    z.file('docProps/core.xml', H + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + xml(title) + '</dc:title><dc:creator>AnyConverter</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + now + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + now + '</dcterms:modified></cp:coreProperties>');
    z.file('word/document.xml', H + '<w:document ' + W + '><w:body>' + doc.body + '</w:body></w:document>');
    return z.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  }

  /* ---------- wire into the design's component ---------- */
  var P = Component.prototype;
  P.readFile = function (file) {
    var self = this;
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { var ext = (file.name.split('.').pop() || '').toLowerCase(); this.setState({ err: L.bad(ext) }); return; }
    if (file.size > MAX_BYTES) { this.setState({ err: X.tooBig }); return; }
    this.setState({ err: '', stage: 'reading', result: null });
    waitLibs().then(function () { return file.arrayBuffer(); }).then(function (buf) { return self.openBytes(new Uint8Array(buf), file.name, file.size); });
  };
  P.openBytes = async function (bytes, name, size) {
    var pdf;
    var task = window.pdfjsLib.getDocument({ data: bytes.slice() });
    task.onPassword = function (update, reason) {
      var pw = window.prompt(reason === window.pdfjsLib.PasswordResponses.INCORRECT_PASSWORD ? X.pwBad : X.pw);
      if (pw == null) { task.__pw = true; task.destroy(); } else update(pw);
    };
    try { pdf = await task.promise; }
    catch (e) { this.setState({ stage: 'empty', err: task.__pw || (e && e.name === 'PasswordException') ? X.locked : X.broken }); return; }
    if (this._pdf) { try { this._pdf.destroy(); } catch (e) { /* already closed */ } }
    this._pdf = pdf;
    this.setState({ doc: { name: name, pages: pdf.numPages, size: size }, stage: 'config', rng: pdf.numPages > MAX_PAGES ? '1-' + MAX_PAGES : '' });
    this.track('file_uploaded', { pages: pdf.numPages });
  };
  P.loadSample = async function () {
    this.setState({ err: '', stage: 'reading', result: null });
    await waitLibs();
    var Pd = window.PDFLib, d = await Pd.PDFDocument.create();
    var fb = await d.embedFont(Pd.StandardFonts.HelveticaBold), fr = await d.embedFont(Pd.StandardFonts.Helvetica);
    var S = SAMPLE || { title: 'Annual Report', sub: '', h: ['', '', ''], p: ['', '', ''], li: [] };
    var wrap = function (t, f, s, w) { var out = [], cur = ''; t.split(' ').forEach(function (word) { var n = cur ? cur + ' ' + word : word; if (f.widthOfTextAtSize(n, s) > w && cur) { out.push(cur); cur = word; } else cur = n; }); if (cur) out.push(cur); return out; };
    var ink = Pd.rgb(0.12, 0.1, 0.09), acc = Pd.rgb(0.71, 0.25, 0.17);
    for (var pn = 0; pn < 2; pn++) {
      var pg = d.addPage([595, 842]), y = 770;
      if (pn === 0) { pg.drawText(S.title, { x: 64, y: y, size: 26, font: fb, color: acc }); y -= 26; pg.drawText(S.sub, { x: 64, y: y, size: 12, font: fr, color: ink }); y -= 40; }
      (pn === 0 ? [0, 1] : [2]).forEach(function (k) {
        pg.drawText(S.h[k], { x: 64, y: y, size: 16, font: fb, color: ink }); y -= 26;
        wrap(S.p[k], fr, 11, 467).forEach(function (ln) { pg.drawText(ln, { x: 64, y: y, size: 11, font: fr, color: ink }); y -= 16; });
        y -= 14;
        if (k === 1 && S.tb) {
          [S.tb, ['Q1', '€ 1.20 M', '+12%'], ['Q2', '€ 1.32 M', '+10%'], ['Q3', '€ 1.51 M', '+14%'], ['Q4', '€ 1.74 M', '+15%']].forEach(function (row, ri) {
            row.forEach(function (c, ci) { pg.drawText(c, { x: 64 + ci * 150, y: y, size: 11, font: ri ? fr : fb, color: ink }); });
            y -= 18;
          });
          y -= 14;
        }
        if (k === 0) { S.li.forEach(function (li) { pg.drawText('•  ' + li, { x: 76, y: y, size: 11, font: fr, color: ink }); y -= 16; }); y -= 14; }
      });
      pg.drawText(String(pn + 1), { x: 292, y: 40, size: 9, font: fr, color: ink });
    }
    var bytes = await d.save();
    await this.openBytes(bytes, (S.title || 'sample').toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-') + '.pdf', bytes.length);
  };
  P.cancel = function () { this._cx = true; this.setState({ stage: 'config', prog: 0 }); this.toast(X.cancelled || ''); };
  P.reset = function () { this._cx = true; if (this._pdf) { try { this._pdf.destroy(); } catch (e) { /* ignore */ } } this._pdf = null; this._blob = null; this.setState({ doc: null, stage: 'empty', prog: 0, err: '', result: null, rng: '' }); };
  P.convert = async function () {
    var s = this.state, d = s.doc, pdf = this._pdf;
    if (!d || !pdf) return;
    var pr = this.parseRange(s.rng, d.pages);
    var list = pr.ok && pr.list ? pr.list : Array.from({ length: d.pages }, function (_, i) { return i + 1; });
    if (list.length > MAX_PAGES) { this.setState({ err: X.tooMany }); return; }
    this._cx = false;
    this.setState({ stage: 'working', prog: 0, cur: 0, total: list.length, err: '', ocrLoading: false });
    this.track('tool_calculate', { mode: s.mode, ocr: s.ocr });
    var worker = null, pages = [];
    try {
      for (var i = 0; i < list.length; i++) {
        if (this._cx) return;
        this.setState({ cur: i + 1, prog: i / list.length });
        var page = await pdf.getPage(list[i]);
        var pl = await pageLines(page);
        var chars = pl.lines.reduce(function (a, l) { return a + l.text.length; }, 0);
        if (s.ocr && chars < 20) {
          if (!worker) {
            this.setState({ ocrLoading: true });
            var T5 = await loadTesseract();
            var code = s.ol === 5 ? 'eng+' + ({ es: 'spa', da: 'dan' }[String(DCI.LOC).slice(0, 2)] || 'deu') : OCR_LANG[s.ol] || 'eng';
            worker = await T5.createWorker();
            await worker.loadLanguage(code);
            await worker.initialize(code);
            this.setState({ ocrLoading: false });
            if (this._cx) { await worker.terminate(); return; }
          }
          pl = await ocrLines(page, code, worker);
        }
        pages.push(pl);
        page.cleanup();
      }
      if (worker) { await worker.terminate(); worker = null; }
      if (this._cx) return;
      if (!pages.some(function (p) { return p.lines.length; })) { this.setState({ stage: 'config', prog: 0, err: X.noText }); return; }
      var built = s.mode === 'exact' ? exactDoc(pages) : flowDoc(pages);
      var name = d.name.replace(/\.pdf$/i, '') + '.docx';
      this._blob = await docx(built, d.name.replace(/\.pdf$/i, ''));
      if (this._cx) return;
      this.setState({ stage: 'done', prog: 1, result: { name: name, meta: X.meta(list.length, built.heads, built.tables || 0) + ' · ' + this.kb(this._blob.size) } });
      this.track('file_ready');
    } catch (e) {
      if (worker) { try { await worker.terminate(); } catch (e2) { /* ignore */ } }
      this.setState({ stage: 'config', prog: 0, ocrLoading: false, err: e && e.message === 'ocr' ? X.ocrFail : X.fail });
    }
  };
  var baseVals = P.vals;
  P.vals = function () {
    var v = baseVals.apply(this, arguments), s = this.state, self = this;
    v.onSample = function () { self.loadSample(); };
    v.onRun = function () { self.convert(); };
    v.onDownload = function () { if (self._blob && s.result) self.download(s.result.name, self._blob); };
    v.workLabel = s.ocrLoading ? (X.ocrLoad || '') : L.work(Math.max(1, s.cur || 1), s.total || 1);
    return v;
  };
