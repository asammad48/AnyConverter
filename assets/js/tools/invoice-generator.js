(function() {
  function addRow() {
    var tbody = document.getElementById('inv-items');
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><input type="text" class="inv-desc" placeholder="Item description" style="width:100%;padding:6px 8px;border:1px solid #E4E4EF;border-radius:4px;font-size:13px"></td><td><input type="number" class="inv-qty" value="1" min="0" style="width:60px;padding:6px 8px;border:1px solid #E4E4EF;border-radius:4px;font-size:13px"></td><td><input type="number" class="inv-rate" value="0" min="0" step="0.01" style="width:80px;padding:6px 8px;border:1px solid #E4E4EF;border-radius:4px;font-size:13px"></td><td class="inv-amount" style="padding:6px 8px;font-size:13px;text-align:right">0.00</td><td><button type="button" class="btn btn-secondary btn-sm inv-remove" style="padding:4px 8px">×</button></td>';
    tbody.appendChild(tr);
    bindRow(tr);
    recalc();
  }

  function bindRow(tr) {
    tr.querySelector('.inv-qty').addEventListener('input', recalc);
    tr.querySelector('.inv-rate').addEventListener('input', recalc);
    tr.querySelector('.inv-remove').addEventListener('click', function() { tr.remove(); recalc(); });
  }

  function recalc() {
    var subtotal = 0;
    document.querySelectorAll('#inv-items tr').forEach(function(tr) {
      var qty = parseFloat(tr.querySelector('.inv-qty').value)||0;
      var rate = parseFloat(tr.querySelector('.inv-rate').value)||0;
      var amt = qty * rate;
      tr.querySelector('.inv-amount').textContent = amt.toFixed(2);
      subtotal += amt;
    });
    var taxPct = parseFloat(document.getElementById('inv-tax').value)||0;
    var tax = subtotal * taxPct / 100;
    var total = subtotal + tax;
    document.getElementById('inv-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('inv-tax-amt').textContent = tax.toFixed(2);
    document.getElementById('inv-total').textContent = total.toFixed(2);
  }

  function generatePDF() {
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
      alert('PDF library not loaded. Please wait a moment and try again.');
      return;
    }
    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || jsPDF;
    var doc = new JsPDF();
    var from = document.getElementById('inv-from').value || 'Your Business';
    var to = document.getElementById('inv-to').value || 'Client Name';
    var num = document.getElementById('inv-number').value || 'INV-001';
    var date = document.getElementById('inv-date').value || new Date().toISOString().slice(0,10);
    var currency = document.getElementById('inv-currency').value || '$';
    doc.setFontSize(22); doc.setFont('helvetica','bold');
    doc.text('INVOICE', 20, 25);
    doc.setFontSize(10); doc.setFont('helvetica','normal');
    doc.text('Invoice #: ' + num, 20, 35);
    doc.text('Date: ' + date, 20, 42);
    doc.text('From: ' + from, 20, 55);
    doc.text('Bill To: ' + to, 20, 62);
    var y = 80;
    doc.setFont('helvetica','bold');
    doc.text('Description', 20, y); doc.text('Qty', 120, y); doc.text('Rate', 145, y); doc.text('Amount', 170, y);
    doc.line(20, y+3, 190, y+3);
    y += 10; doc.setFont('helvetica','normal');
    document.querySelectorAll('#inv-items tr').forEach(function(tr) {
      var desc = tr.querySelector('.inv-desc').value || '';
      var qty = tr.querySelector('.inv-qty').value;
      var rate = parseFloat(tr.querySelector('.inv-rate').value||0).toFixed(2);
      var amt = tr.querySelector('.inv-amount').textContent;
      doc.text(desc, 20, y); doc.text(qty, 120, y); doc.text(currency+rate, 145, y); doc.text(currency+amt, 170, y);
      y += 8;
    });
    doc.line(20, y, 190, y); y += 8;
    var sub = document.getElementById('inv-subtotal').textContent;
    var taxAmt = document.getElementById('inv-tax-amt').textContent;
    var tot = document.getElementById('inv-total').textContent;
    doc.text('Subtotal: ' + currency + sub, 140, y); y+=8;
    doc.text('Tax: ' + currency + taxAmt, 140, y); y+=8;
    doc.setFont('helvetica','bold');
    doc.text('Total: ' + currency + tot, 140, y);
    var notes = document.getElementById('inv-notes').value;
    if (notes) { y+=16; doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('Notes: ' + notes, 20, y, {maxWidth:170}); }
    doc.save('invoice-' + num + '.pdf');
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('inv-date').value = new Date().toISOString().slice(0,10);
    document.getElementById('inv-tax').addEventListener('input', recalc);
    document.getElementById('btn-inv-add-row').addEventListener('click', addRow);
    document.getElementById('btn-inv-pdf').addEventListener('click', generatePDF);
    document.querySelectorAll('#inv-items tr').forEach(bindRow);
    recalc();
  });
})();
