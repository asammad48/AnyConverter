/**
 * AnyConverter — Invoice Generator Engine
 * Supports: Dynamic line items, Payment terms & due dates, Discounts & Shipping,
 * Reconciled multi-currency totals, Print output and client-side jsPDF export.
 * Fully localized for EN, ES, DA.
 */
(function() {
  'use strict';

  var LANG = (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang ? document.documentElement.lang : 'en').split('-')[0].toLowerCase();
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  function formatLocaleMoney(num, forcedLang) {
    var l = forcedLang || LANG;
    var locale = (l === 'da') ? 'da-DK' : ((l === 'es') ? 'es-ES' : 'en-US');
    return Number(num).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function sanitizePdfText(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFC')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/\u00A0/g, ' ')
      .replace(/[^\x00-\x7F\u00A0-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u20AC]/g, '?');
  }

  var I18N = {
    en: {
      itemDescPlaceholder: 'Item description',
      discountLabel: 'Discount (Fixed)',
      shippingLabel: 'Shipping & Handling',
      paymentTermsLabel: 'Payment Terms',
      dueDateLabel: 'Due Date',
      termsReceipt: 'Due on Receipt',
      termsNet15: 'Net 15 Days',
      termsNet30: 'Net 30 Days',
      termsNet60: 'Net 60 Days',
      subtotal: 'Subtotal:',
      discount: 'Discount:',
      tax: 'Tax:',
      shipping: 'Shipping:',
      total: 'Total Due:',
      invoiceTitle: 'INVOICE',
      invoiceNumber: 'Invoice #:',
      issueDate: 'Issue Date:',
      dueDate: 'Due Date:',
      terms: 'Terms:',
      from: 'From:',
      billTo: 'Bill To:',
      desc: 'Description',
      qty: 'Qty',
      rate: 'Rate',
      amount: 'Amount',
      notes: 'Notes:'
    },
    es: {
      itemDescPlaceholder: 'Descripción del artículo',
      discountLabel: 'Descuento (Fijo)',
      shippingLabel: 'Envío y manipulación',
      paymentTermsLabel: 'Condiciones de pago',
      dueDateLabel: 'Fecha de vencimiento',
      termsReceipt: 'Pago al recibir',
      termsNet15: 'Neto a 15 días',
      termsNet30: 'Neto a 30 días',
      termsNet60: 'Neto a 60 días',
      subtotal: 'Subtotal:',
      discount: 'Descuento:',
      tax: 'Impuesto:',
      shipping: 'Envío:',
      total: 'Total a pagar:',
      invoiceTitle: 'FACTURA',
      invoiceNumber: 'Factura nº:',
      issueDate: 'Fecha emisión:',
      dueDate: 'Vencimiento:',
      terms: 'Condiciones:',
      from: 'De:',
      billTo: 'Para:',
      desc: 'Descripción',
      qty: 'Cant.',
      rate: 'Precio',
      amount: 'Importe',
      notes: 'Notas:'
    },
    da: {
      itemDescPlaceholder: 'Beskrivelse af vare',
      discountLabel: 'Rabat (Fast)',
      shippingLabel: 'Forsendelse og levering',
      paymentTermsLabel: 'Betalingsbetingelser',
      dueDateLabel: 'Forfaldsdato',
      termsReceipt: 'Ved modtagelse',
      termsNet15: 'Netto 15 dage',
      termsNet30: 'Netto 30 dage',
      termsNet60: 'Netto 60 dage',
      subtotal: 'Subtotal:',
      discount: 'Rabat:',
      tax: 'Moms:',
      shipping: 'Forsendelse:',
      total: 'Total til betaling:',
      invoiceTitle: 'FAKTURA',
      invoiceNumber: 'Fakturanr:',
      issueDate: 'Fakturadato:',
      dueDate: 'Forfaldsdato:',
      terms: 'Betingelser:',
      from: 'Fra:',
      billTo: 'Kunde:',
      desc: 'Beskrivelse',
      qty: 'Antal',
      rate: 'Pris',
      amount: 'Beløb',
      notes: 'Noter:'
    }
  };

  var T = I18N[LANG];

  function getCurrencySymbol() {
    var el = document.getElementById('inv-currency');
    return el && el.value ? el.value.trim() : '$';
  }

  function addRow() {
    var tbody = document.getElementById('inv-items');
    if (!tbody) return;
    var tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--color-border,#DDD8D0)';
    tr.innerHTML = [
      '<td><input type="text" class="inv-desc" placeholder="' + T.itemDescPlaceholder + '" style="width:100%;padding:6px 8px;border:1px solid var(--color-border,#DDD8D0);border-radius:4px;font-size:13px"></td>',
      '<td><input type="number" class="inv-qty" value="1" min="0" step="1" style="width:60px;padding:6px 8px;border:1px solid var(--color-border,#DDD8D0);border-radius:4px;font-size:13px"></td>',
      '<td><input type="number" class="inv-rate" value="0" min="0" step="0.01" style="width:80px;padding:6px 8px;border:1px solid var(--color-border,#DDD8D0);border-radius:4px;font-size:13px"></td>',
      '<td class="inv-amount" style="padding:6px 8px;font-size:13px;text-align:right">0.00</td>',
      '<td><button type="button" class="btn btn-secondary btn-sm inv-remove" aria-label="Remove item" style="padding:4px 8px">&#215;</button></td>'
    ].join('');
    tbody.appendChild(tr);
    bindRow(tr);
    recalc();
  }

  function bindRow(tr) {
    var qtyInput = tr.querySelector('.inv-qty');
    var rateInput = tr.querySelector('.inv-rate');
    var removeBtn = tr.querySelector('.inv-remove');

    if (qtyInput) qtyInput.addEventListener('input', recalc);
    if (rateInput) rateInput.addEventListener('input', recalc);
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        var tbody = document.getElementById('inv-items');
        if (tbody && tbody.querySelectorAll('tr').length > 1) {
          tr.remove();
        } else {
          // Reset row if it's the last one
          if (qtyInput) qtyInput.value = 1;
          if (rateInput) rateInput.value = 0;
          var descInput = tr.querySelector('.inv-desc');
          if (descInput) descInput.value = '';
        }
        recalc();
      });
    }
  }

  function recalc() {
    var subtotal = 0;
    var rows = document.querySelectorAll('#inv-items tr');
    rows.forEach(function(tr) {
      var qtyEl = tr.querySelector('.inv-qty');
      var rateEl = tr.querySelector('.inv-rate');
      var amtEl = tr.querySelector('.inv-amount');
      var qty = qtyEl ? Math.max(0, parseFloat(qtyEl.value) || 0) : 0;
      var rate = rateEl ? Math.max(0, parseFloat(rateEl.value) || 0) : 0;
      var amt = Math.round(qty * rate * 100) / 100;
      if (amtEl) amtEl.textContent = formatLocaleMoney(amt);
      subtotal += amt;
    });

    subtotal = Math.round(subtotal * 100) / 100;

    var discountInput = document.getElementById('inv-discount');
    var discount = discountInput ? Math.max(0, parseFloat(discountInput.value) || 0) : 0;
    discount = Math.min(subtotal, Math.max(0, Math.round(discount * 100) / 100));

    var discountedSubtotal = Math.max(0, subtotal - discount);

    var taxInput = document.getElementById('inv-tax');
    var taxPct = taxInput ? Math.max(0, parseFloat(taxInput.value) || 0) : 0;
    var tax = Math.round(discountedSubtotal * (taxPct / 100) * 100) / 100;

    var shippingInput = document.getElementById('inv-shipping');
    var shipping = shippingInput ? Math.max(0, parseFloat(shippingInput.value) || 0) : 0;
    shipping = Math.max(0, Math.round(shipping * 100) / 100);

    var total = Math.round((discountedSubtotal + tax + shipping) * 100) / 100;

    var subtotalEl = document.getElementById('inv-subtotal');
    if (subtotalEl) subtotalEl.textContent = formatLocaleMoney(subtotal);

    var discRow = document.getElementById('inv-discount-row');
    var discAmtEl = document.getElementById('inv-discount-amt');
    if (discRow && discAmtEl) {
      if (discount > 0) {
        discRow.style.display = 'flex';
        discAmtEl.textContent = '-' + formatLocaleMoney(discount);
      } else {
        discRow.style.display = 'none';
      }
    }

    var taxAmtEl = document.getElementById('inv-tax-amt');
    if (taxAmtEl) taxAmtEl.textContent = formatLocaleMoney(tax);

    var shipRow = document.getElementById('inv-shipping-row');
    var shipAmtEl = document.getElementById('inv-shipping-amt');
    if (shipRow && shipAmtEl) {
      if (shipping > 0) {
        shipRow.style.display = 'flex';
        shipAmtEl.textContent = formatLocaleMoney(shipping);
      } else {
        shipRow.style.display = 'none';
      }
    }

    var totalEl = document.getElementById('inv-total');
    if (totalEl) totalEl.textContent = formatLocaleMoney(total);

    return {
      subtotal: subtotal,
      discount: discount,
      taxableSubtotal: discountedSubtotal,
      taxPct: taxPct,
      tax: tax,
      shipping: shipping,
      total: total
    };
  }

  function addAdvancedInvoiceFields() {
    var taxInput = document.getElementById('inv-tax');
    if (!taxInput || document.getElementById('inv-discount')) return;

    var wrap = taxInput.parentElement;
    var container = wrap.parentElement;

    var extraRow = document.createElement('div');
    extraRow.id = 'inv-extra-fields-row';
    extraRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:12px 0;padding-top:12px;border-top:1px dashed var(--color-border,#DDD8D0);';
    extraRow.innerHTML = [
      '<div>',
      '  <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="inv-discount">' + T.discountLabel + '</label>',
      '  <input type="number" id="inv-discount" value="0" min="0" step="5" style="width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px;">',
      '</div>',
      '<div>',
      '  <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="inv-shipping">' + T.shippingLabel + '</label>',
      '  <input type="number" id="inv-shipping" value="0" min="0" step="5" style="width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px;">',
      '</div>',
      '<div>',
      '  <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="inv-terms">' + T.paymentTermsLabel + '</label>',
      '  <select id="inv-terms" style="width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px;">',
      '    <option value="receipt">' + T.termsReceipt + '</option>',
      '    <option value="net15">' + T.termsNet15 + '</option>',
      '    <option value="net30" selected>' + T.termsNet30 + '</option>',
      '    <option value="net60">' + T.termsNet60 + '</option>',
      '  </select>',
      '</div>',
      '<div>',
      '  <label style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;" for="inv-due-date">' + T.dueDateLabel + '</label>',
      '  <input type="date" id="inv-due-date" style="width:100%;padding:8px 10px;border:1px solid var(--color-border,#DDD8D0);border-radius:6px;font-size:13px;">',
      '</div>'
    ].join('\n');

    if (container && container.parentElement && typeof container.parentElement.insertBefore === 'function') {
      container.parentElement.insertBefore(extraRow, container.nextSibling);
    } else if (container) {
      container.appendChild(extraRow);
    }

    // Default due date = 30 days from now
    var d = new Date();
    d.setDate(d.getDate() + 30);
    var dueInput = document.getElementById('inv-due-date');
    if (dueInput) dueInput.value = d.toISOString().slice(0, 10);

    var termsSelect = document.getElementById('inv-terms');
    if (termsSelect) {
      termsSelect.addEventListener('change', function() {
        var days = 30;
        if (this.value === 'receipt') days = 0;
        else if (this.value === 'net15') days = 15;
        else if (this.value === 'net30') days = 30;
        else if (this.value === 'net60') days = 60;
        var newDue = new Date();
        newDue.setDate(newDue.getDate() + days);
        if (dueInput) dueInput.value = newDue.toISOString().slice(0, 10);
      });
    }

    ['inv-discount', 'inv-shipping'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', recalc);
    });
  }

  function generatePDF() {
    var totals = recalc();
    var from = (document.getElementById('inv-from') && document.getElementById('inv-from').value) || 'Your Business';
    var to = (document.getElementById('inv-to') && document.getElementById('inv-to').value) || 'Client Name';
    var num = (document.getElementById('inv-number') && document.getElementById('inv-number').value) || 'INV-001';
    var date = (document.getElementById('inv-date') && document.getElementById('inv-date').value) || new Date().toISOString().slice(0,10);
    var dueDate = (document.getElementById('inv-due-date') && document.getElementById('inv-due-date').value) || date;
    var termsEl = document.getElementById('inv-terms');
    var termsText = termsEl ? termsEl.options[termsEl.selectedIndex].text : T.termsNet30;
    var notes = (document.getElementById('inv-notes') && document.getElementById('inv-notes').value) || '';
    var currency = getCurrencySymbol();

    // Check jsPDF availability
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      window.print();
      return;
    }

    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || jsPDF;
    var doc = new JsPDF();

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(sanitizePdfText(T.invoiceTitle), 20, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizePdfText(T.invoiceNumber + ' ' + num), 20, 32);
    doc.text(sanitizePdfText(T.issueDate + ' ' + date), 20, 38);
    doc.text(sanitizePdfText(T.dueDate + ' ' + dueDate + ' (' + termsText + ')'), 20, 44);

    doc.setFont('helvetica', 'bold');
    doc.text(sanitizePdfText(T.from), 20, 54);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizePdfText(from.slice(0, 50)), 20, 60);

    doc.setFont('helvetica', 'bold');
    doc.text(sanitizePdfText(T.billTo), 110, 54);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizePdfText(to.slice(0, 50)), 110, 60);

    // Items table header
    var y = 74;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y - 4, 170, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(sanitizePdfText(T.desc), 22, y);
    doc.text(sanitizePdfText(T.qty), 120, y);
    doc.text(sanitizePdfText(T.rate), 142, y);
    doc.text(sanitizePdfText(T.amount), 188, y, { align: 'right' });
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    var rows = document.querySelectorAll('#inv-items tr');
    rows.forEach(function(tr) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      var descEl = tr.querySelector('.inv-desc');
      var qtyEl = tr.querySelector('.inv-qty');
      var rateEl = tr.querySelector('.inv-rate');
      var amtEl = tr.querySelector('.inv-amount');

      var desc = descEl ? descEl.value : '';
      var qty = qtyEl ? Math.max(0, parseFloat(qtyEl.value) || 0) : 0;
      var rate = rateEl ? Math.max(0, parseFloat(rateEl.value) || 0) : 0;
      var amt = Math.round(qty * rate * 100) / 100;

      doc.text(sanitizePdfText(desc.slice(0, 55)), 22, y);
      doc.text(String(qty), 120, y);
      doc.text(formatLocaleMoney(rate), 142, y);
      doc.text(sanitizePdfText(currency) + ' ' + formatLocaleMoney(amt), 188, y, { align: 'right' });
      y += 6;
    });

    doc.line(20, y, 190, y);
    y += 6;

    // Fully Reconciled Totals Block
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizePdfText(T.subtotal), 120, y);
    doc.text(sanitizePdfText(currency) + ' ' + formatLocaleMoney(totals.subtotal), 188, y, { align: 'right' });
    y += 5;

    if (totals.discount > 0) {
      doc.text(sanitizePdfText(T.discount), 120, y);
      doc.text('-' + sanitizePdfText(currency) + ' ' + formatLocaleMoney(totals.discount), 188, y, { align: 'right' });
      y += 5;
    }

    var taxLabel = T.tax.replace(/:$/, '') + ' (' + totals.taxPct + '%):';
    doc.text(sanitizePdfText(taxLabel), 120, y);
    doc.text(sanitizePdfText(currency) + ' ' + formatLocaleMoney(totals.tax), 188, y, { align: 'right' });
    y += 5;

    if (totals.shipping > 0) {
      doc.text(sanitizePdfText(T.shipping), 120, y);
      doc.text(sanitizePdfText(currency) + ' ' + formatLocaleMoney(totals.shipping), 188, y, { align: 'right' });
      y += 5;
    }

    doc.line(120, y, 190, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(sanitizePdfText(T.total), 120, y);
    doc.text(sanitizePdfText(currency) + ' ' + formatLocaleMoney(totals.total), 188, y, { align: 'right' });

    if (notes) {
      y += 14;
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(sanitizePdfText(T.notes), 20, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      var splitNotes = doc.splitTextToSize(sanitizePdfText(notes), 160);
      doc.text(splitNotes, 20, y + 5);
    }

    doc.save((sanitizePdfText(num) || 'invoice') + '.pdf');
  }

  function init() {
    addAdvancedInvoiceFields();

    // Bind Add Row button (support both btn-inv-add-row and inv-add-row)
    var addBtn = document.getElementById('btn-inv-add-row') || document.getElementById('inv-add-row');
    if (addBtn) {
      addBtn.addEventListener('click', addRow);
    }

    // Bind existing rows
    var existingRows = document.querySelectorAll('#inv-items tr');
    existingRows.forEach(function(tr) {
      bindRow(tr);
    });

    // Inputs listener
    ['inv-tax', 'inv-currency'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', recalc);
    });

    // Bind PDF download button (support both btn-inv-pdf and btn-download-pdf)
    var pdfBtn = document.getElementById('btn-inv-pdf') || document.getElementById('btn-download-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', generatePDF);
    }

    // Bind Print button (support both btn-inv-print and btn-print-inv)
    var printBtn = document.getElementById('btn-inv-print') || document.getElementById('btn-print-inv');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        window.print();
      });
    }

    recalc();
  }

  // Export engine for test harnesses
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      recalc: recalc,
      addRow: addRow,
      formatLocaleMoney: formatLocaleMoney,
      sanitizePdfText: sanitizePdfText
    };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
