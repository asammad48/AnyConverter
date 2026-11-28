(function (root) {
  'use strict';

  // Each cell uses the same perch coordinate. Crop width and head anchors can vary.
  const url = '/assets/creative-studio/motion/parrot-atlas.png';
  const hash = 'f75919eb13d67b66bd8e35941d4d1671d6916b0d36308d95a2679bfc96ddc5c9';
  const asset = {
    id: 'sha256:' + hash, mimeType: 'image/png', sizeBytes: 37131, source: 'native',
    originalFileName: 'parrot-atlas.png', storageRef: 'assets/' + hash + '.png'
  };
  const ids = ['calm', 'blink', 'talk', 'shock', 'excited', 'recoil', 'point', 'exit'];
  const poses = Object.fromEntries(ids.map((id, i) => [id, {
    crop: [256 * i, 0, id === 'shock' || id === 'excited' || id === 'point' ? 256 : 224, 240],
    pivot: [108, 217],
    neck: [118, 119],
    bodyBounds: [32, 100, i === 3 || i === 4 || i === 6 ? 224 : 162, 220],
    headBounds: [[80,30,195,133], [80,30,195,133], [80,30,197,138], [80,6,197,131],
      [80,13,197,138], [65,30,180,133], [80,30,195,133], [80,30,195,133]][i],
    eye: [id === 'recoil' ? 122 : 137, id === 'shock' ? 78 : 85],
    shoulder: [101, 142]
  }]));
  const actions = {
    idle: [[0, 'calm']], blink: [[0, 'calm'], [.35, 'blink'], [.7, 'calm']],
    talk: [[0, 'talk'], [.35, 'calm'], [.55, 'talk'], [.75, 'calm']],
    shocked: [[0, 'calm'], [.28, 'recoil'], [.44, 'shock']],
    excited: [[0, 'calm'], [.33, 'excited'], [.78, 'calm']],
    recoil: [[0, 'calm'], [.25, 'recoil'], [.5, 'shock'], [.94, 'calm']],
    point: [[0, 'calm'], [.35, 'point']], exit: [[0, 'recoil'], [.4, 'exit']]
  };

  function actionTracks(action, start, length) {
    if (!Object.hasOwn(actions, action)) return [];
    const key = (ratio, value, ease = 'bezier') => ({ frame: start + Math.round(ratio * length), value, ease });
    const moving = ['shocked', 'excited', 'recoil', 'exit'].includes(action);
    const tracks = [{ property: 'poseId', keys: actions[action].map(([t, id]) => key(t, id, 'hold')) }];
    if (moving) {
      tracks.push({ property: 'squash', keys: [key(0, 0), key(.27, .11), key(.46, -.11, 'spring'), key(.88, 0)] },
        { property: 'headTilt', keys: [key(0, 0), key(.27, -8), key(.46, 8), key(.88, 0)] });
    }
    if (action === 'exit') tracks.push({ property: 'x', keys: [key(0, 0), key(1, .32)] },
      { property: 'opacity', keys: [key(0, 1), key(.55, 1), key(1, 0)] });
    return tracks;
  }

  // Action intervals include their first frame and exclude their end.
  function editActions(sequence, clip, index = -1) {
    if (!clip || !Object.hasOwn(actions, clip.name) || !Number.isInteger(clip.start) || clip.start < 0 ||
        !Number.isInteger(clip.duration) || clip.duration < 1 || clip.duration > 3600) return null;
    const next = (sequence || []).filter((_, i) => i !== index);
    if (next.length >= 64 || next.some(other => clip.start < other.start + other.duration &&
      other.start < clip.start + clip.duration)) return null;
    return [...next, clip].sort((a, b) => a.start - b.start);
  }

  function sampleAction(sequence, frame, sample) {
    if (!Array.isArray(sequence)) return null;
    let active;
    for (const clip of sequence.slice(0, 64)) {
      if (!clip || !Object.hasOwn(actions, clip.name) || !Number.isInteger(clip.start) || clip.start < 0 ||
          !Number.isInteger(clip.duration) || clip.duration < 1 || clip.duration > 3600 || clip.start > frame) continue;
      if (!active || clip.start >= active.start) active = clip;
    }
    if (!active) return null;
    const tracks = actionTracks(active.name, active.start, Math.max(0, active.duration - 1));
    return { name: active.name, end: active.start + active.duration, values: Object.fromEntries(tracks.map(track =>
      [track.property, sample(track.keys, track.property, Math.min(frame, active.start + active.duration - 1))])) };
  }

  let atlas;
  let loading;
  function prepare(bytes) {
    if (!loading) {
      atlas = new Image();
      const local = bytes ? URL.createObjectURL(new Blob([bytes], { type: asset.mimeType })) : null;
      atlas.src = local || url;
      loading = atlas.decode().finally(() => { if (local) URL.revokeObjectURL(local); });
      loading.catch(() => { loading = null; });
    }
    return loading;
  }

  function geometry(box, state) {
    const pose = Object.hasOwn(poses, state?.poseId) ? poses[state.poseId] : poses.calm;
    const x = box.x + box.width * .47;
    const y = box.y + box.height * .86;
    const scale = Math.min(box.width / 310, box.height / 280);
    const squash = state?.squash || 0;
    const sx = (state?.poseId === 'exit' ? -1 : 1) * scale * (1 + squash);
    const sy = scale * (1 - squash);
    const tilt = (state?.headTilt || 0) * Math.PI / 180;
    const rect = ([x0, y0, x1, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    const head = rect(pose.headBounds).map(([px, py]) => {
      const dx = px - pose.neck[0];
      const dy = py - pose.neck[1];
      return [pose.neck[0] + dx * Math.cos(tilt) - dy * Math.sin(tilt),
        pose.neck[1] + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
    });
    const wing = state?.armPose === 'point' ? rect([96, 120, 195, 147]) : [];
    return { anchor: [x, y], points: [...rect(pose.bodyBounds), ...head, ...wing].map(([px, py]) =>
      [x + (px - pose.pivot[0]) * sx, y + (py - pose.pivot[1]) * sy]) };
  }

  function draw(ctx, box, state, fallback) {
    if (!atlas?.naturalWidth) return false;
    const id = Object.hasOwn(poses, state?.poseId) ? state.poseId : fallback;
    const { crop, pivot, neck, eye, shoulder } = poses[id] || poses.calm;
    const scale = Math.min(box.width / 310, box.height / 280);
    const x = box.x + box.width * .47;
    const y = box.y + box.height * .86;
    ctx.save();
    ctx.translate(x, y);
    const squash = state?.squash || 0;
    ctx.scale((id === 'exit' ? -1 : 1) * scale * (1 + squash), scale * (1 - squash));
    ctx.drawImage(atlas, ...crop, -pivot[0], -pivot[1], crop[2], crop[3]);
    ctx.save();
    ctx.translate(neck[0] - pivot[0], neck[1] - pivot[1]);
    ctx.rotate((state?.headTilt || 0) * Math.PI / 180);
    ctx.drawImage(atlas, crop[0], 240, crop[2], crop[3], -neck[0], -neck[1], crop[2], crop[3]);
    if (id !== 'blink') {
      ctx.fillStyle = '#14233a';
      ctx.beginPath();
      ctx.ellipse(eye[0] - neck[0] + 3 + 4 * (state?.eyeDirection || 0), eye[1] - neck[1], 5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (state?.armPose === 'point') {
      ctx.strokeStyle = '#6dc89a';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(shoulder[0] - pivot[0], shoulder[1] - pivot[1]);
      ctx.quadraticCurveTo(38, -63, 82, -92);
      ctx.stroke();
    }
    ctx.restore();
    return true;
  }

  async function archiveBytes() {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Parrot atlas is unavailable');
    return new Uint8Array(await response.arrayBuffer());
  }

  const api = { asset, poses, actions, actionTracks, editActions, sampleAction, geometry, prepare, archiveBytes, draw };
  root.StudioPuppet = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
