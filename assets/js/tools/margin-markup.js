/* AnyConverter — Margin vs Markup Calculator. Margin = profit ÷ price; markup = profit ÷ cost. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var mode = K.seg('mm-mode', run);
  var last = '';

  function run() {
    var m = mode.value, cost = K.val('mm-cost'), price = NaN, work = [];
    K.show('mm-price-f', m === 'cp'); K.show('mm-tm-f', m === 'margin'); K.show('mm-tk-f', m === 'markup');
    K.show('mm-need-t', m !== 'cp');
    var impossible = false;
    if (m === 'cp') price = K.val('mm-price');
    else if (m === 'margin') {
      var tm = K.val('mm-tm');
      if (tm >= 100) impossible = true;
      else if (isFinite(tm)) { price = cost / (1 - tm / 100); work.push([T.need, K.money(cost) + ' ÷ (1 − ' + K.fmt(tm / 100, 6) + ') = ' + K.money(price)]); }
    } else {
      var tk = K.val('mm-tk');
      if (isFinite(tk) && tk > -100) { price = cost * (1 + tk / 100); work.push([T.need, K.money(cost) + ' × (1 + ' + K.fmt(tk / 100, 6) + ') = ' + K.money(price)]); }
    }
    var ok = cost > 0 && price > 0 && !impossible;
    K.show('mm-imp', impossible); K.show('mm-empty', !ok && !impossible); K.show('mm-out', ok);
    if (!ok) return;
    var profit = price - cost, margin = profit / price * 100, markup = profit / cost * 100;
    K.show('mm-loss', profit < 0);
    K.text('mm-need', K.money(price)); K.text('mm-profit', K.money(profit));
    K.text('mm-margin', K.pct(margin)); K.text('mm-markup', K.pct(markup)); K.text('mm-mult', '×' + K.fmt(price / cost, 4));
    work.push([T.profit, K.money(price) + ' − ' + K.money(cost) + ' = ' + K.money(profit)],
      [T.margin, K.money(profit) + ' ÷ ' + K.money(price) + ' × 100 = ' + K.pct(margin, 4)],
      [T.markup, K.money(profit) + ' ÷ ' + K.money(cost) + ' × 100 = ' + K.pct(markup, 4)]);
    K.work('mm-work', work);
    last = (m !== 'cp' ? T.need + ': ' + K.money(price) + '\n' : '') + T.profit + ': ' + K.money(profit) + '\n' + T.margin + ': ' + K.pct(margin) + '\n' + T.markup + ': ' + K.pct(markup);
  }

  K.bind('calc-root', run);
  K.$('mm-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
