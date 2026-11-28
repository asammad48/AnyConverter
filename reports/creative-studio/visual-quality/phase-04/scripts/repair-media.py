"""Inspect the production browser's group and sequential-action downloads."""
import array
import json
import math
import os
from pathlib import Path
import re

os.environ.setdefault('PHASE04_EVIDENCE', str(Path(__file__).resolve().parent.parent / 'revised'))
from media import OUT, ffmpeg, run, sheet


def inspect(name, count):
    entries = json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format',
                             '-of', 'json', name).stdout)
    assert int(entries['streams'][0]['nb_read_frames']) == count
    assert entries['streams'][0]['codec_name'] == 'vp8'
    assert entries['streams'][1]['codec_name'] == 'opus'
    timestamps = json.loads(run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_packets',
                             '-show_entries', 'packet=pts_time', '-of', 'json', name).stdout)['packets']
    pts = [float(p['pts_time']) for p in timestamps]
    assert len(pts) == count and all(a < b for a, b in zip(pts, pts[1:]))
    return {'video': entries['streams'][0], 'audio': entries['streams'][1], 'firstPTS': pts[0],
            'lastPTS': pts[-1], 'maximumTimestampError': max(abs(t - i / 30) for i, t in enumerate(pts))}


def compare(video, frame, preview, decoded):
    ffmpeg('-y', '-loglevel', 'error', '-i', video, '-vf',
           f'select=eq(n\\,{frame}),scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24',
           '-frames:v', '1', '-update', '1', decoded)
    result = ffmpeg('-i', preview, '-i', decoded, '-lavfi',
                    '[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]ssim', '-f', 'null', '-')
    return {'frame': frame, 'ssim': float(re.search(r'All:([.\d]+)', result.stderr.decode())[1]),
            'preview': preview, 'decoded': decoded}


group = 'field-station-group.webm'
character = 'sequential-actions-chromium.webm'
result = {group: inspect(group, 270)}
for engine in ('chromium', 'firefox', 'webkit'):
    name = f'sequential-actions-{engine}.webm'
    if (OUT / name).exists():
        result[name] = inspect(name, 411)
fallback = 'sequential-actions-firefox-realtime.webm'
if (OUT / fallback).exists():
    result[fallback] = json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_entries',
        'stream=codec_name,codec_type,nb_read_frames:format=duration', '-of', 'json', fallback).stdout)
result['groupParity'] = [compare(group, frame, f'group-final-{frame}.png', f'group-decoded-{frame}.png')
                         for frame in (0, 30, 60)]
actions = ['idle', 'talk', 'recoil', 'shocked', 'point', 'exit']
result['sequenceParity'] = [compare(character, frame, f'sequence-{frame}.png', f'sequence-decoded-{frame}.png')
                            for frame in (0, 36, 72, 108, 144, 180, 198, 215)]
for frame in (84, 126, 162, 224, 257):
    ffmpeg('-y', '-loglevel', 'error', '-i', character, '-vf',
           f'select=eq(n\\,{frame}),scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24',
           '-frames:v', '1', '-update', '1', f'sequence-decoded-{frame}.png')
sheet([(f'sequence-decoded-{frame}.png', f'{frame}: {action}')
       for frame, action in zip((0, 36, 84, 126, 162, 198), actions)] +
      [('sequence-decoded-215.png', '215: exit complete'),
       ('sequence-decoded-224.png', '224: blink, shot 2'), ('sequence-decoded-257.png', '257: excited, shot 2')],
      'SEQUENTIAL_ACTIONS_CONTACT_SHEET.png', 4)
sheet([(f'group-decoded-{i}.png', f'Nested group | frame {i}') for i in (0, 30, 60)],
      'SHARED_GROUP_CONTACT_SHEET.png', 3)
baseline = '../evidence/showreel.webm'
cuts = [(45, 45, 'Five file entries'), (300, 309, 'Envelope and clue'), (480, 498, 'Doorway jump')]
cells = []
for before, after, label in cuts:
    name = f'published-{before}.png'
    ffmpeg('-y', '-loglevel', 'error', '-i', baseline, '-vf',
           f'select=eq(n\\,{before}),scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24',
           '-frames:v', '1', '-update', '1', name)
    if after == 309:
        compare('showreel.webm', after, 'pose-309.png', 'decoded-309.png')
    cells += [(name, 'Published | ' + label), (f'decoded-{after}.png', 'Revised | ' + label)]
sheet(cells, 'AUDIT_BEFORE_AFTER.png', 2)

pcm = array.array('h', ffmpeg('-i', 'showreel.webm', '-map', '0:a:0', '-ac', '1', '-f', 's16le', '-').stdout)
def rms(at):
    batch = pcm[round(at * 48000):round((at + .1) * 48000)]
    return round(20 * math.log10(math.sqrt(sum((sample / 32768) ** 2 for sample in batch) / len(batch))), 2)

result['doorwayAudio'] = {'cutFrame': 498, 'timeSeconds': 16.6,
                          'rmsWindowsDbfs': {str(at): rms(at) for at in (16.5, 16.6, 16.7, 16.8)}}
assert result['doorwayAudio']['rmsWindowsDbfs']['16.6'] > result['doorwayAudio']['rmsWindowsDbfs']['16.5'] + 3
(OUT / 'repair-media.json').write_text(json.dumps(result, indent=2) + '\n')
