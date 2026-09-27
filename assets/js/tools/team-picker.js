(function () {
  'use strict';

  const membersEl = document.getElementById('tp-members');
  const teamsEl   = document.getElementById('tp-teams');
  const pickBtn   = document.getElementById('tp-pick');
  const resultEl  = document.getElementById('tp-result');
  const shuffleEl = document.getElementById('tp-shuffle');
  const STORE_KEY = 'ac:team-picker:roster';

  const TEAM_COLORS = [
    '#F3E7E4', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#DBEAFE',
    '#FFE4E6', '#ECFDF5', '#FEF9C3'
  ];
  const TEAM_TEXT = [
    'var(--color-primary,#B04A45)', '#059669', '#D97706', '#DB2777', '#2563EB',
    '#DC2626', '#047857', '#B45309'
  ];

  function getMembers() {
    return membersEl.value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  function toast(msg) {
    if (window.showToast) window.showToast(msg, 'success');
  }

  function emptyState() {
    resultEl.innerHTML = '<div class="ac-empty"><strong>' +
      t({ en: 'No teams yet', es: 'Aún no hay equipos', da: 'Ingen hold endnu' }) + '</strong><span>' +
      t({
        en: 'Enter names on the left, choose how many teams, then pick.',
        es: 'Escribe los nombres a la izquierda, elige cuántos equipos y pulsa el botón.',
        da: 'Skriv navnene til venstre, vælg antal hold, og træk holdene.'
      }) + '</span></div>';
    setActionsEnabled(false);
  }

  function setActionsEnabled(on) {
    const bar = document.getElementById('tp-actions');
    if (bar) bar.hidden = !on;
  }

  function pick() {
    const members = getMembers();
    const numTeams = Math.min(Math.max(parseInt(teamsEl.value) || 2, 2), members.length || 2);

    if (members.length < 2) {
      resultEl.innerHTML = '<div class="ac-empty"><strong>' +
        t({ en: 'Add at least 2 names', es: 'Añade al menos 2 nombres', da: 'Tilføj mindst 2 navne' }) +
        '</strong></div>';
      setActionsEnabled(false);
      return;
    }
    if (numTeams > members.length) {
      resultEl.innerHTML = '<div class="ac-empty"><strong>' +
        t({
          en: 'Not enough names for ' + numTeams + ' teams',
          es: 'No hay suficientes nombres para ' + numTeams + ' equipos',
          da: 'Ikke nok navne til ' + numTeams + ' hold'
        }) + '</strong></div>';
      setActionsEnabled(false);
      return;
    }

    const doShuffle = shuffleEl.checked;
    const ordered = doShuffle ? shuffle(members) : [...members];
    const teams = Array.from({ length: numTeams }, () => []);
    ordered.forEach((m, i) => teams[i % numTeams].push(m));

    const teamWord = t({ en: 'Team', es: 'Equipo', da: 'Hold' });
    resultEl.innerHTML = '<div class="team-grid">' +
      teams.map((team, i) =>
        '<div class="team-card"><h3>' + teamWord + ' ' + (i + 1) + ' (' + team.length + ')</h3><ol>' +
        team.map(m => '<li>' + escHtml(m) + '</li>').join('') +
        '</ol></div>'
      ).join('') + '</div>';

    resultEl._teamsText = teams
      .map((team, i) => teamWord + ' ' + (i + 1) + ':\n' + team.map(m => '- ' + m).join('\n'))
      .join('\n\n');
    setActionsEnabled(true);
  }

  function ensureActions() {
    if (document.getElementById('tp-actions')) return;
    const bar = document.createElement('div');
    bar.className = 'ac-action-bar';
    bar.id = 'tp-actions';
    bar.hidden = true;
    bar.innerHTML =
      '<button class="btn btn-secondary" id="tp-copy" type="button">' +
      t({ en: 'Copy teams', es: 'Copiar equipos', da: 'Kopier hold' }) + '</button>' +
      '<button class="btn btn-secondary" id="tp-save" type="button">' +
      t({ en: 'Save roster', es: 'Guardar lista', da: 'Gem liste' }) + '</button>';
    resultEl.parentElement.appendChild(bar);
    document.getElementById('tp-copy').addEventListener('click', function() {
      if (!resultEl._teamsText) return;
      navigator.clipboard.writeText(resultEl._teamsText).then(function() {
        toast(t({ en: 'Copied', es: 'Copiado', da: 'Kopieret' }));
      }, function() {});
    });
    document.getElementById('tp-save').addEventListener('click', function() {
      localStorage.setItem(STORE_KEY, membersEl.value);
      toast(t({ en: 'Roster saved', es: 'Lista guardada', da: 'Liste gemt' }));
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && !membersEl.value.trim()) membersEl.value = saved;
    ensureActions();
    emptyState();
  });

  pickBtn.addEventListener('click', pick);
})();
