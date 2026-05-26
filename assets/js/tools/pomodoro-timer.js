(function() {
  var MODES = {work:{label:'Work',duration:25*60}, short:{label:'Short Break',duration:5*60}, long:{label:'Long Break',duration:15*60}};
  var mode = 'work';
  var remaining = MODES[mode].duration;
  var running = false;
  var timer = null;
  var sessions = 0;

  function fmt(s) {
    var m = Math.floor(s/60), sec = s%60;
    return (m<10?'0':'')+m+':'+(sec<10?'0':'')+sec;
  }

  function render() {
    document.getElementById('pom-display').textContent = fmt(remaining);
    document.getElementById('pom-mode-label').textContent = MODES[mode].label;
    document.getElementById('pom-sessions').textContent = sessions;
    var pct = remaining / MODES[mode].duration * 100;
    document.getElementById('pom-ring').style.strokeDashoffset = (283 * (1 - pct/100)).toFixed(1);
    document.getElementById('btn-pom-start').textContent = running ? 'Pause' : 'Start';
  }

  function tick() {
    if (remaining > 0) {
      remaining--;
      render();
    } else {
      clearInterval(timer);
      running = false;
      if (mode === 'work') sessions++;
      render();
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('AnyConverter Pomodoro', {body: MODES[mode].label + ' session complete!'});
      }
    }
  }

  function startStop() {
    if (running) {
      clearInterval(timer);
      running = false;
    } else {
      running = true;
      timer = setInterval(tick, 1000);
    }
    render();
  }

  function reset() {
    clearInterval(timer);
    running = false;
    remaining = MODES[mode].duration;
    render();
  }

  function setMode(m) {
    clearInterval(timer);
    running = false;
    mode = m;
    remaining = MODES[mode].duration;
    ['work','short','long'].forEach(function(k) {
      var btn = document.getElementById('pom-mode-'+k);
      if (btn) btn.className = k===m ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-pom-start').addEventListener('click', startStop);
    document.getElementById('btn-pom-reset').addEventListener('click', reset);
    document.getElementById('pom-mode-work').addEventListener('click', function() { setMode('work'); });
    document.getElementById('pom-mode-short').addEventListener('click', function() { setMode('short'); });
    document.getElementById('pom-mode-long').addEventListener('click', function() { setMode('long'); });
    document.getElementById('btn-pom-notify').addEventListener('click', function() {
      if (typeof Notification !== 'undefined') Notification.requestPermission();
    });
    setMode('work');
  });
})();
