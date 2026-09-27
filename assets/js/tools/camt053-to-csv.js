(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';
  var LOCALE = { en: 'en-US', da: 'da-DK', es: 'es-ES' }[LANG];
  var CSV = { en: { delim: ',', decimal: '.', bom: false }, da: { delim: ';', decimal: ',', bom: true }, es: { delim: ';', decimal: ',', bom: true } }[LANG];

  var STR = {
    en: {
      detected: 'Detected: {type} · {stmts} statement(s) · {entries} entries',
      not_camt: 'This XML is not a CAMT statement (root: {root})',
      doctype_blocked: 'XML with a DOCTYPE is not allowed for safety',
      parse_error: 'Could not parse this file as XML: {msg}',
      opening: 'Opening balance', closing: 'Closing balance',
      reconciled: 'Reconciled', not_reconciled: 'Difference: {amount}',
      why_text: 'Common causes: pending entries included, missing pages or files, or the bank uses a different reversal convention.',
      n_transactions: '{count} transactions',
      pending_notice: '{count} entries have status pending',
      col_booking_date: 'Booking date', col_value_date: 'Value date', col_amount: 'Amount',
      col_direction: 'Direction', col_counterparty: 'Counterparty', col_counterparty_iban: 'Counterparty IBAN',
      col_text: 'Text', col_creditor_ref: 'Creditor reference', col_bank_ref: 'Bank reference',
      col_status: 'Status', col_reversal: 'Reversal', col_balance: 'Running balance', col_account: 'Account', col_currency: 'Currency',
      err_no_file: 'Drop or choose a CAMT.053, .052, or .054 XML file.'
    },
    da: {
      detected: 'Fundet: {type} · {stmts} kontoudtog · {entries} posteringer',
      not_camt: 'Denne XML er ikke et CAMT-kontoudtog (rod: {root})',
      doctype_blocked: 'XML med DOCTYPE er ikke tilladt af sikkerhedshensyn',
      parse_error: 'Kunne ikke læse filen som XML: {msg}',
      opening: 'Primosaldo', closing: 'Ultimosaldo',
      reconciled: 'Afstemt', not_reconciled: 'Forskel: {amount}',
      why_text: 'Typiske årsager: ventende posteringer er med, der mangler sider eller filer, eller banken bruger en anden konvention for tilbageførsler.',
      n_transactions: '{count} transaktioner',
      pending_notice: '{count} posteringer har status ventende',
      col_booking_date: 'Bogføringsdato', col_value_date: 'Valørdato', col_amount: 'Beløb',
      col_direction: 'Retning', col_counterparty: 'Modpart', col_counterparty_iban: 'Modparts IBAN',
      col_text: 'Tekst', col_creditor_ref: 'Kreditorreference', col_bank_ref: 'Bankreference',
      col_status: 'Status', col_reversal: 'Tilbageførsel', col_balance: 'Løbende saldo', col_account: 'Konto', col_currency: 'Valuta',
      err_no_file: 'Træk eller vælg en CAMT.053-, .052- eller .054-XML-fil.'
    },
    es: {
      detected: 'Detectado: {type} · {stmts} extracto(s) · {entries} apuntes',
      not_camt: 'Este XML no es un extracto CAMT (raíz: {root})',
      doctype_blocked: 'Por seguridad no se permite XML con DOCTYPE',
      parse_error: 'No se pudo leer el archivo como XML: {msg}',
      opening: 'Saldo inicial', closing: 'Saldo final',
      reconciled: 'Cuadrado', not_reconciled: 'Diferencia: {amount}',
      why_text: 'Causas habituales: se incluyen apuntes pendientes, faltan páginas o archivos, o el banco usa otra convención para las anulaciones.',
      n_transactions: '{count} transacciones',
      pending_notice: '{count} apuntes están pendientes',
      col_booking_date: 'Fecha contable', col_value_date: 'Fecha valor', col_amount: 'Importe',
      col_direction: 'Dirección', col_counterparty: 'Contraparte', col_counterparty_iban: 'IBAN contraparte',
      col_text: 'Concepto', col_creditor_ref: 'Referencia del acreedor', col_bank_ref: 'Referencia bancaria',
      col_status: 'Estado', col_reversal: 'Anulación', col_balance: 'Saldo acumulado', col_account: 'Cuenta', col_currency: 'Divisa',
      err_no_file: 'Arrastra o elige un archivo XML CAMT.053, .052 o .054.'
    }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function firstEl(parent, name) {
    if (!parent) return null;
    for (var i = 0; i < parent.children.length; i++) if (parent.children[i].localName === name) return parent.children[i];
    return null;
  }
  function allEls(parent, name) {
    if (!parent) return [];
    var out = [];
    for (var i = 0; i < parent.children.length; i++) if (parent.children[i].localName === name) out.push(parent.children[i]);
    return out;
  }
  function pathEl(el, p) {
    var parts = p.split('/'), cur = el;
    for (var i = 0; i < parts.length; i++) { if (!cur) return null; cur = firstEl(cur, parts[i]); }
    return cur;
  }
  function text(el, p) { var f = pathEl(el, p); return f ? (f.textContent || '').trim() : ''; }
  function textAny(el, paths) { for (var i = 0; i < paths.length; i++) { var v = text(el, paths[i]); if (v) return v; } return ''; }
  function queryAll(parent, p) {
    var parts = p.split('/'), level = [parent];
    for (var i = 0; i < parts.length; i++) {
      var next = [];
      level.forEach(function (el) { next = next.concat(allEls(el, parts[i])); });
      level = next;
    }
    return level;
  }

  function toCents(str) {
    if (!str) return 0;
    var n = parseFloat(str);
    if (isNaN(n)) return 0;
    return Math.round(n * 100);
  }
  function centsToStr(cents) {
    var sign = cents < 0 ? '-' : '';
    var abs = Math.abs(cents);
    var whole = Math.floor(abs / 100), frac = abs % 100;
    return sign + whole + '.' + (frac < 10 ? '0' + frac : frac);
  }

  function validateRF(ref) {
    if (!/^RF\d{2}[A-Z0-9]{1,21}$/.test(ref)) return false;
    var rearranged = ref.slice(4) + ref.slice(0, 4);
    var numeric = '';
    for (var i = 0; i < rearranged.length; i++) {
      var c = rearranged.charAt(i);
      numeric += /[0-9]/.test(c) ? c : (c.charCodeAt(0) - 55);
    }
    var remainder = 0;
    for (i = 0; i < numeric.length; i++) remainder = (remainder * 10 + parseInt(numeric.charAt(i), 10)) % 97;
    return remainder === 1;
  }

  var MSG_TYPES = { BkToCstmrStmt: { type: 'camt.053', tag: 'Stmt' }, BkToCstmrAcctRpt: { type: 'camt.052', tag: 'Rpt' }, BkToCstmrDbtCdtNtfctn: { type: 'camt.054', tag: 'Ntfctn' } };

  function parseCamt(xmlText) {
    if (/<!DOCTYPE/i.test(xmlText)) { var e1 = new Error(t('doctype_blocked')); e1.code = 'doctype'; throw e1; }
    var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) { var e2 = new Error(t('parse_error', { msg: 'invalid XML' })); throw e2; }
    var docEl = doc.documentElement;
    var root = docEl.children[0];
    if (!root) { var e3 = new Error(t('not_camt', { root: docEl.localName })); throw e3; }
    var info = MSG_TYPES[root.localName];
    if (!info) { var e4 = new Error(t('not_camt', { root: root.localName })); throw e4; }
    var stmts = allEls(root, info.tag);
    return stmts.map(function (stmt) { return extractStatement(stmt, info.type); });
  }

  function extractStatement(stmt, msgType) {
    var acctEl = firstEl(stmt, 'Acct');
    var account = {
      iban: text(acctEl, 'Id/IBAN'),
      other: text(acctEl, 'Id/Othr/Id'),
      ccy: text(acctEl, 'Ccy'),
      name: text(acctEl, 'Nm')
    };
    var balances = allEls(stmt, 'Bal').map(function (b) {
      var code = textAny(b, ['Tp/CdOrPrtry/Cd', 'Tp/CdOrPrtry/Prtry']);
      var amtEl = firstEl(b, 'Amt');
      var amount = amtEl ? (amtEl.textContent || '').trim() : '0';
      var cdi = text(b, 'CdtDbtInd');
      var sign = cdi === 'DBIT' ? -1 : 1;
      return { code: code, cents: sign * toCents(amount) };
    });
    var entries = allEls(stmt, 'Ntry').map(extractEntry);
    return { id: text(stmt, 'Id'), account: account, balances: balances, entries: entries, msgType: msgType };
  }

  function extractEntry(ntry) {
    var amtEl = firstEl(ntry, 'Amt');
    var amount = amtEl ? (amtEl.textContent || '').trim() : '0';
    var ccy = amtEl ? amtEl.getAttribute('Ccy') : '';
    var cdi = text(ntry, 'CdtDbtInd');
    var sign = cdi === 'DBIT' ? -1 : 1;
    var status = textAny(ntry, ['Sts/Cd', 'Sts']);
    var reversal = text(ntry, 'RvslInd').toLowerCase() === 'true';
    var bookingDate = textAny(ntry, ['BookgDt/Dt', 'BookgDt/DtTm']).slice(0, 10);
    var valueDate = textAny(ntry, ['ValDt/Dt', 'ValDt/DtTm']).slice(0, 10);
    var acctSvcrRef = text(ntry, 'AcctSvcrRef');
    var addtlInfo = text(ntry, 'AddtlNtryInf');

    var txList = queryAll(ntry, 'NtryDtls/TxDtls');
    var counterpartyName = '', counterpartyIban = '', remittance = addtlInfo, creditorRef = '', rfValid = null;
    if (txList.length === 1) {
      var tx = txList[0];
      var debtorName = textAny(tx, ['RltdPties/Dbtr/Pty/Nm', 'RltdPties/Dbtr/Nm']);
      var creditorName = textAny(tx, ['RltdPties/Cdtr/Pty/Nm', 'RltdPties/Cdtr/Nm']);
      var debtorIban = text(tx, 'RltdPties/DbtrAcct/Id/IBAN');
      var creditorIban = text(tx, 'RltdPties/CdtrAcct/Id/IBAN');
      counterpartyName = sign > 0 ? debtorName : creditorName;
      counterpartyIban = sign > 0 ? debtorIban : creditorIban;
      var rmtEl = firstEl(tx, 'RmtInf');
      var ustrd = allEls(rmtEl, 'Ustrd').map(function (u) { return (u.textContent || '').trim(); }).join(' ');
      remittance = ustrd || addtlInfo;
      creditorRef = text(tx, 'RmtInf/Strd/CdtrRefInf/Ref');
      if (creditorRef) rfValid = validateRF(creditorRef);
    } else if (txList.length > 1) {
      counterpartyName = t('n_transactions', { count: txList.length });
    }

    return {
      amountCents: sign * toCents(amount), ccy: ccy, sign: sign, status: status || 'BOOK',
      reversal: reversal, bookingDate: bookingDate, valueDate: valueDate, acctSvcrRef: acctSvcrRef,
      counterpartyName: counterpartyName, counterpartyIban: counterpartyIban,
      remittance: remittance, creditorRef: creditorRef, rfValid: rfValid, txCount: txList.length
    };
  }

  function fmtAmount(cents) {
    var s = centsToStr(cents);
    if (CSV.decimal === ',') s = s.replace('.', ',');
    return s;
  }
  function fmtAmountDisplay(cents) {
    return new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  }

  var lastStatements = null;

  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function show(id, on) { var el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }
  function showError(msg) {
    var el = document.getElementById('camt-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; } else el.style.display = 'none';
  }

  function render(statements) {
    lastStatements = statements;
    var totalEntries = statements.reduce(function (a, s) { return a + s.entries.length; }, 0);
    setText('camt-detected', t('detected', { type: statements[0] ? statements[0].msgType : '?', stmts: statements.length, entries: totalEntries }));

    var stmtWrap = document.getElementById('camt-statements');
    stmtWrap.innerHTML = '';
    statements.forEach(function (stmt, si) {
      var opening = stmt.balances.filter(function (b) { return b.code === 'OPBD' || b.code === 'PRCD'; })[0];
      var closing = stmt.balances.filter(function (b) { return b.code === 'CLBD'; })[0];
      var bookedNet = stmt.entries.filter(function (e) { return e.status === 'BOOK'; }).reduce(function (a, e) { return a + e.amountCents; }, 0);
      var card = document.createElement('div');
      card.className = 'stat-card';
      card.style.cssText = 'text-align:left;padding:14px;margin-bottom:10px';
      var acctLabel = stmt.account.iban || stmt.account.other || stmt.account.name || ('#' + (si + 1));
      var html = '<div style="font-weight:600">' + acctLabel + ' · ' + (stmt.account.ccy || '') + '</div>';
      html += '<div style="font-size:13px;color:var(--color-text-2);margin-top:4px">' + stmt.entries.length + ' ' + (LANG === 'da' ? 'posteringer' : LANG === 'es' ? 'apuntes' : 'entries') + '</div>';
      if (opening && closing) {
        var expected = opening.cents + bookedNet;
        var diff = expected - closing.cents;
        var recStr = Math.abs(diff) < 1 ?
          '<span style="color:var(--color-success)">✓ ' + t('reconciled') + '</span>' :
          '<span style="color:var(--color-error)">✗ ' + t('not_reconciled', { amount: fmtAmountDisplay(diff) }) + '</span>';
        html += '<div style="margin-top:8px;font-size:13px">' + t('opening') + ': ' + fmtAmountDisplay(opening.cents) + ' · ' + t('closing') + ': ' + fmtAmountDisplay(closing.cents) + '</div>';
        html += '<div style="margin-top:4px">' + recStr + '</div>';
        if (Math.abs(diff) >= 1) html += '<div style="font-size:12px;color:var(--color-text-3);margin-top:2px">' + t('why_text') + '</div>';
      }
      var pendingCount = stmt.entries.filter(function (e) { return e.status && e.status !== 'BOOK'; }).length;
      if (pendingCount) html += '<div class="status-bar info" style="margin-top:8px">' + t('pending_notice', { count: pendingCount }) + '</div>';
      card.innerHTML = html;
      stmtWrap.appendChild(card);
    });

    var tbody = document.getElementById('camt-preview-body');
    tbody.innerHTML = '';
    var running = {};
    statements.forEach(function (stmt) {
      var opening = stmt.balances.filter(function (b) { return b.code === 'OPBD' || b.code === 'PRCD'; })[0];
      var bal = opening ? opening.cents : 0;
      stmt.entries.forEach(function (e) {
        bal += e.amountCents;
        var tr = document.createElement('tr');
        var amtColor = e.amountCents < 0 ? 'var(--color-error)' : 'var(--color-success)';
        tr.innerHTML = '<td>' + e.bookingDate + '</td><td>' + escapeHtml(e.counterpartyName) + '</td><td>' + escapeHtml(e.remittance || '') + '</td>' +
          '<td style="color:' + amtColor + ';text-align:right">' + fmtAmountDisplay(e.amountCents) + '</td>' +
          '<td style="text-align:right">' + fmtAmountDisplay(bal) + '</td><td>' + (e.status === 'BOOK' ? '' : e.status) + '</td>';
        tbody.appendChild(tr);
      });
    });

    show('camt-result', true);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function buildCsv(statements) {
    var headers = [t('col_account'), t('col_currency'), t('col_booking_date'), t('col_value_date'), t('col_amount'), t('col_direction'), t('col_counterparty'), t('col_counterparty_iban'), t('col_text'), t('col_creditor_ref'), t('col_bank_ref'), t('col_status'), t('col_reversal'), t('col_balance')];
    function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }
    var lines = [headers.map(q).join(CSV.delim)];
    statements.forEach(function (stmt) {
      var opening = stmt.balances.filter(function (b) { return b.code === 'OPBD' || b.code === 'PRCD'; })[0];
      var bal = opening ? opening.cents : 0;
      var acctLabel = stmt.account.iban || stmt.account.other || stmt.account.name || '';
      stmt.entries.forEach(function (e) {
        bal += e.amountCents;
        lines.push([acctLabel, e.ccy, e.bookingDate, e.valueDate, fmtAmount(e.amountCents), e.sign > 0 ? 'CRDT' : 'DBIT',
          e.counterpartyName, e.counterpartyIban, e.remittance, e.creditorRef, e.acctSvcrRef, e.status, e.reversal ? 'Y' : '', fmtAmount(bal)
        ].map(q).join(CSV.delim));
      });
    });
    return (CSV.bom ? '﻿' : '') + lines.join('\r\n');
  }

  function downloadText(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function handleFiles(files) {
    if (!files || !files.length) return;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var statements = parseCamt(reader.result);
        showError(null);
        render(statements);
      } catch (e) {
        showError(e.message || String(e));
      }
    };
    reader.readAsText(file);
  }

  var SAMPLE_XML = '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.02"><BkToCstmrStmt><GrpHdr><MsgId>MSG001</MsgId><CreDtTm>2026-09-01T08:00:00</CreDtTm></GrpHdr><Stmt><Id>STMT001</Id><Acct><Id><IBAN>DK5000400440116243</IBAN></Id><Ccy>DKK</Ccy><Nm>Example ApS</Nm></Acct><Bal><Tp><CdOrPrtry><Cd>OPBD</Cd></CdOrPrtry></Tp><Amt Ccy="DKK">124500.00</Amt><CdtDbtInd>CRDT</CdtDbtInd><Dt><Dt>2026-09-01</Dt></Dt></Bal><Bal><Tp><CdOrPrtry><Cd>CLBD</Cd></CdOrPrtry></Tp><Amt Ccy="DKK">103550.00</Amt><CdtDbtInd>CRDT</CdtDbtInd><Dt><Dt>2026-09-30</Dt></Dt></Bal><Ntry><NtryRef>1</NtryRef><Amt Ccy="DKK">1250.00</Amt><CdtDbtInd>CRDT</CdtDbtInd><Sts>BOOK</Sts><BookgDt><Dt>2026-09-03</Dt></BookgDt><ValDt><Dt>2026-09-03</Dt></ValDt><AcctSvcrRef>REF1001</AcctSvcrRef><NtryDtls><TxDtls><RltdPties><Dbtr><Nm>Customer A/S</Nm></Dbtr><DbtrAcct><Id><IBAN>DK1020000123456789</IBAN></Id></DbtrAcct></RltdPties><RmtInf><Ustrd>Invoice 1042</Ustrd></RmtInf></TxDtls></NtryDtls></Ntry><Ntry><NtryRef>2</NtryRef><Amt Ccy="DKK">3800.00</Amt><CdtDbtInd>DBIT</CdtDbtInd><Sts>BOOK</Sts><BookgDt><Dt>2026-09-05</Dt></BookgDt><ValDt><Dt>2026-09-05</Dt></ValDt><AcctSvcrRef>REF1002</AcctSvcrRef><NtryDtls><TxDtls><RltdPties><Cdtr><Nm>Office Supplies Ltd</Nm></Cdtr><CdtrAcct><Id><IBAN>DK3030003344556677</IBAN></Id></CdtrAcct></RltdPties><RmtInf><Ustrd>Office chairs</Ustrd></RmtInf></TxDtls></NtryDtls></Ntry><Ntry><NtryRef>3</NtryRef><Amt Ccy="DKK">18400.00</Amt><CdtDbtInd>DBIT</CdtDbtInd><Sts>BOOK</Sts><BookgDt><Dt>2026-09-10</Dt></BookgDt><ValDt><Dt>2026-09-10</Dt></ValDt><AcctSvcrRef>REF1003</AcctSvcrRef><NtryDtls><TxDtls><RltdPties><Cdtr><Nm>Payroll batch</Nm></Cdtr></RltdPties></TxDtls><TxDtls><RltdPties><Cdtr><Nm>Payroll batch</Nm></Cdtr></RltdPties></TxDtls><TxDtls><RltdPties><Cdtr><Nm>Payroll batch</Nm></Cdtr></RltdPties></TxDtls></NtryDtls></Ntry><Ntry><NtryRef>4</NtryRef><Amt Ccy="DKK">243.75</Amt><CdtDbtInd>DBIT</CdtDbtInd><Sts>PDNG</Sts><BookgDt><Dt>2026-09-29</Dt></BookgDt><ValDt><Dt>2026-09-30</Dt></ValDt><AcctSvcrRef>REF1004</AcctSvcrRef></Ntry></Stmt></BkToCstmrStmt></Document>';

  document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('camt-file');
    if (fileInput) fileInput.addEventListener('change', function () { handleFiles(fileInput.files); });

    var dropZone = document.getElementById('camt-dropzone');
    if (dropZone) {
      ['dragover', 'dragenter'].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) { e.preventDefault(); dropZone.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(function (evt) {
        dropZone.addEventListener(evt, function (e) { e.preventDefault(); dropZone.classList.remove('dragover'); });
      });
      dropZone.addEventListener('drop', function (e) { handleFiles(e.dataTransfer.files); });
      dropZone.addEventListener('click', function () { if (fileInput) fileInput.click(); });
      dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (fileInput) fileInput.click(); } });
    }

    var sampleBtn = document.getElementById('camt-btn-sample');
    if (sampleBtn) sampleBtn.addEventListener('click', function () {
      try { render(parseCamt(SAMPLE_XML)); showError(null); } catch (e) { showError(e.message); }
    });

    var pasteArea = document.getElementById('camt-paste');
    var pasteBtn = document.getElementById('camt-btn-parse-paste');
    if (pasteBtn) pasteBtn.addEventListener('click', function () {
      var txt = pasteArea.value.trim();
      if (!txt) { showError(t('err_no_file')); return; }
      try { render(parseCamt(txt)); showError(null); } catch (e) { showError(e.message); }
    });

    var downloadBtn = document.getElementById('camt-btn-download');
    if (downloadBtn) downloadBtn.addEventListener('click', function () {
      if (!lastStatements) return;
      downloadText('camt053-export.csv', buildCsv(lastStatements), 'text/csv');
    });
  });
})();
