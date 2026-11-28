"""Inspect actual browser downloads. Run after browser.js."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
from zipfile import ZipFile
import json
import re
import subprocess

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / 'evidence'
SAMPLES = [0, 7, 15, 30, 45, 90, 134, 135, 173, 258, 300, 374, 375, 479, 480, 599]
FILMS = ['showreel', 'showreel-repeat-reduced-preview', 'reopened-edited']


def run(*args):
    return subprocess.run(args, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=OUT)


def ffmpeg(*args):
    return run('ffmpeg', '-hide_banner', '-nostdin', '-threads', '2', '-filter_threads', '2',
               '-filter_complex_threads', '2', *map(str, args))


def film(name):
    filename = name + '.webm'
    meta = json.loads(run(
        'ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', filename
    ).stdout)
    packets = json.loads(run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_packets', '-show_entries',
                             'packet=pts_time,duration_time', '-of', 'json', filename).stdout)['packets']
    times = [float(packet['pts_time']) for packet in packets]
    assert len(times) == 600, len(times)
    assert all(a < b for a, b in zip(times, times[1:]))
    errors = [abs(t - i / 30) for i, t in enumerate(times)]
    assert max(errors) < .001, max(errors)
    meta['encodedTimestamps'] = {'first': times[0], 'last': times[-1], 'count': len(times),
                                 'maximumErrorSeconds': max(errors), 'monotonic': True, 'seconds': times}
    decoded = ffmpeg('-i', filename, '-map', '0:v:0', '-f', 'framemd5', '-').stdout
    video_hashes = [line.rsplit(',', 1)[1].strip() for line in decoded.decode().splitlines() if not line.startswith('#')]
    assert len(video_hashes) == 600
    meta['decodedFrameMD5'] = video_hashes
    meta['decodedFrameSequenceSHA256'] = sha256(''.join(video_hashes).encode()).hexdigest()
    pcm = ffmpeg('-i', filename, '-map', '0:a:0', '-f', 's16le', '-').stdout
    meta['decodedAudioSHA256'] = sha256(pcm).hexdigest()
    meta['decodedAudioSamplesPerChannel'] = len(pcm) // 4
    volume = ffmpeg('-i', filename, '-vn', '-af', 'volumedetect', '-f', 'null', '-').stderr.decode()
    meta['audioLevels'] = dict(re.findall(r'(mean_volume|max_volume):\s*([-\d.]+ dB)', volume))
    return name, meta


def compare(frame, path, stream):
    video = path.name
    assert (stream['color_space'], stream['color_range']) == ('bt709', 'pc')
    decoded = OUT / f'decoded-{frame}.png'
    ffmpeg('-y', '-loglevel', 'error', '-i', video, '-vf', f'select=eq(n\\,{frame}),scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24',
           '-frames:v', '1', '-update', '1', decoded.name)
    response = ffmpeg('-i', f'preview-{frame}.png', '-i', decoded.name,
                      '-lavfi', '[0:v]format=gbrp[a];[1:v]format=gbrp[b];[a][b]ssim', '-f', 'null', '-')
    total = float(re.search(r'All:([.\d]+)', response.stderr.decode())[1])
    return {'frame': frame, 'timeSeconds': frame / 30, 'ssim': total, 'preview': f'preview-{frame}.png',
            'decoded': decoded.name}


def sheet(cells, name, columns, size=(360, 203)):
    width, height = size
    stride = height + 29
    canvas = Image.new('RGB', (columns * (width + 10) + 10, ((len(cells) + columns - 1) // columns) * stride + 12),
                       '#131b29')
    ink = ImageDraw.Draw(canvas)
    for i, (filename, label) in enumerate(cells):
        tile = Image.open(OUT / filename).convert('RGB')
        tile.thumbnail(size, Image.Resampling.LANCZOS)
        x = 10 + i % columns * (width + 10)
        y = 10 + (i // columns) * stride
        canvas.paste(tile, (x + (width - tile.width) // 2, y))
        ink.text((x + 2, y + height + 5), label, fill='#eae0ce')
    canvas.save(OUT / name, optimize=True)


def main():
    with ThreadPoolExecutor(max_workers=3) as pool:
        meta = dict(pool.map(film, FILMS))
        parity = list(pool.map(lambda frame: compare(frame, OUT / 'showreel.webm', meta[FILMS[0]]['streams'][0]), SAMPLES))
    same = meta[FILMS[0]]['decodedFrameMD5'] == meta[FILMS[1]]['decodedFrameMD5']
    assert same, 'Repeat export decoded pixels differ'
    assert meta[FILMS[0]]['decodedAudioSHA256'] == meta[FILMS[1]]['decodedAudioSHA256']
    changed = [i for i, (a, b) in enumerate(zip(meta[FILMS[0]]['decodedFrameMD5'], meta[FILMS[2]]['decodedFrameMD5'])) if a != b]
    assert changed, 'Reopened edit produced identical pixels'
    (OUT / 'media-metadata.json').write_text(json.dumps(meta, indent=2) + '\n')
    (OUT / 'parity.json').write_text(json.dumps({'samples': parity, 'colorConversion': 'BT.709 full-range YUV to RGB24', 'repeatAll600DecodedFramesIdentical': same,
                                                'reopenedEditChangedDecodedFrames': changed}, indent=2) + '\n')
    with ZipFile(OUT / 'showreel.acstudio') as archive:
        project = json.loads(archive.read('project.json'))
        manifest = json.loads(archive.read('manifest.json'))
        result = {
            'assets': manifest['assets'],
            'entries': archive.namelist(),
            'audio': project['audioClips'],
            'shots': [{k: s[k] for k in ('id', 'startFrame', 'durationFrames', 'subhead', 'customData')}
                      for s in project['shots']]
        }
        assert any(asset['mimeType'] == 'image/png' for asset in result['assets']), result['assets']
        (OUT / 'archive-metadata.json').write_text(json.dumps(result, indent=2) + '\n')
    sheet([('before-phase01.png', 'Phase 01 hook | frame 15'), ('preview-15.png', 'Redesigned hook | frame 15'),
           ('preview-45.png', 'Redesigned hook | frame 45')], 'BEFORE_AFTER.png', 3)
    sheet([(f'decoded-{i}.png', f'{i / 30:04.1f}s | {label}') for i, label in [
        (45, 'Five formats, one inbox'), (173, 'The envelope enters'), (300, 'Pico recognizes the handwriting'),
        (375, 'The hall light'), (479, 'One frame before the cut'), (480, 'Doorway jump cut'),
        (599, 'The final hold')]], 'SHOT_STORYBOARD.png', 3)
    sheet([(f'pose-{i}.png', f'Frame {i}') for i in range(169, 181)], 'BLINK_POSE_STRIP.png', 4, (256, 144))
    sheet([(f'pose-{i}.png', f'Frame {i}') for i in range(292, 310)], 'REACTION_POSE_STRIP.png', 6, (256, 144))
    sheet([('after-phase04.png', 'Saved easing'), ('reopened-frame35.png', 'Fresh session, before edit'),
           ('edited-frame35.png', 'Fresh session, after easing edit')], 'REOPEN_EDIT.png', 3)
    sheet([(f'format-{locale}-{fmt}.png', f'{locale.upper()} | {fmt}') for locale in ('en', 'es', 'da')
           for fmt in ('1280x720', '1080x1920', '1080x1080')], 'LOCALES_AND_FORMATS.png', 3, (312, 310))
    print('Parity', min(sample['ssim'] for sample in parity), max(sample['ssim'] for sample in parity))
    print('Repeat matched all decoded frames; reopened edit changed', len(changed), 'frames.')


if __name__ == '__main__':
    main()
