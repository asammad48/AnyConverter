(function () {
  'use strict';

  const membersEl = document.getElementById('tp-members');
  const teamsEl   = document.getElementById('tp-teams');
  const pickBtn   = document.getElementById('tp-pick');
  const resultEl  = document.getElementById('tp-result');
  const shuffleEl = document.getElementById('tp-shuffle');

  const TEAM_COLORS = [
    '#DDD8FE', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#DBEAFE',
    '#FFE4E6', '#ECFDF5', '#FEF9C3'
  ];
  const TEAM_TEXT = [
    '#4F46E5', '#059669', '#D97706', '#DB2777', '#2563EB',
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

  function pick() {
    const members = getMembers();
    const numTeams = Math.min(Math.max(parseInt(teamsEl.value) || 2, 2), members.length || 2);

    if (members.length < 2) {
      resultEl.innerHTML = '<p style="color:#DC2626;font-size:13px">Please enter at least 2 members.</p>';
      return;
    }
    if (numTeams > members.length) {
      resultEl.innerHTML = `<p style="color:#DC2626;font-size:13px">Not enough members for ${numTeams} teams.</p>`;
      return;
    }

    const doShuffle = shuffleEl.checked;
    const ordered = doShuffle ? shuffle(members) : [...members];
    const teams = Array.from({ length: numTeams }, () => []);

    ordered.forEach((m, i) => teams[i % numTeams].push(m));

    resultEl.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:4px">` +
      teams.map((team, i) => {
        const bg = TEAM_COLORS[i % TEAM_COLORS.length];
        const fg = TEAM_TEXT[i % TEAM_TEXT.length];
        return `<div style="background:${bg};border-radius:10px;padding:14px;">
          <div style="font-weight:700;font-size:13px;color:${fg};margin-bottom:8px">Team ${i + 1} (${team.length})</div>
          ${team.map(m => `<div style="font-size:13px;padding:3px 0;color:#374151">• ${escHtml(m)}</div>`).join('')}
        </div>`;
      }).join('') + '</div>';
  }

  pickBtn.addEventListener('click', pick);
})();
