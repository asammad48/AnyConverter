"""Decode the Studio downloads and generate frame comparisons and contact sheets."""
import hashlib
import json
import re
import subprocess
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / 'evidence'


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True)


def decode(movie, index, output):
    run('ffmpeg', '-y', '-v', 'error', '-i', str(movie), '-an', '-vf',
        f'select=eq(n\\,{index}),scale=in_range=pc:in_color_matrix=bt709', '-frames:v', '1', '-threads', '1', str(output))


def sheet(items, output, columns=4, size=(300, 440)):
    width, height = size
    image = Image.new('RGB', (columns * width, ((len(items) + columns - 1) // columns) * height), '#131622')
    labels = ImageDraw.Draw(image)
    for index, (path, label) in enumerate(items):
        tile = Image.open(path).convert('RGB')
        tile.thumbnail((width - 16, height - 34))
        x = (index % columns) * width
        y = (index // columns) * height
        image.paste(tile, (x + (width - tile.width) // 2, y + 8))
        labels.text((x + 8, y + height - 22), label, fill='white')
    image.save(output)


def probe(movie):
    streams = json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_streams',
                             '-show_format', '-of', 'json', str(movie)).stdout)
    video, audio = [next(stream for stream in streams['streams'] if stream['codec_type'] == kind)
                    for kind in ('video', 'audio')]
    timing = json.loads(run('ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_frames',
                            '-show_entries', 'frame=best_effort_timestamp_time', '-of', 'json', str(movie)).stdout)
    times = [float(frame['best_effort_timestamp_time']) for frame in timing['frames']]
    drift = max(abs(timestamp - i / 30) for i, timestamp in enumerate(times))
    assert drift <= .0011, (movie, drift)
    expected = 480 if movie.stem.startswith(('fun', 'suspense')) else 450
    assert len(times) == expected == int(video['nb_read_frames']), (movie, len(times))
    assert video['color_range'] == 'pc' and video['color_space'] == 'bt709'
    assert audio['codec_name'] == 'opus'
    assert video['codec_name'] == 'vp8'
    levels = run('ffmpeg', '-hide_banner', '-i', str(movie), '-vn', '-af', 'volumedetect', '-f', 'null', '-').stderr
    return {
        'sha256': hashlib.sha256(movie.read_bytes()).hexdigest(),
        'width': video['width'], 'height': video['height'], 'fps': video['r_frame_rate'],
        'frames': len(times), 'durationSeconds': float(streams['format']['duration']),
        'videoCodec': video['codec_name'], 'audioCodec': audio['codec_name'],
        'colorRange': video['color_range'], 'colorSpace': video['color_space'],
        'audioSampleRate': int(audio['sample_rate']), 'channels': audio['channels'],
        'audioDecodedPackets': int(audio['nb_read_frames']),
        'firstVideoTimestamp': times[0], 'lastVideoTimestamp': times[-1],
        'maxFrameClockErrorMilliseconds': round(drift * 1000, 3),
        'audioLevels': dict(re.findall(r'(mean_volume|max_volume): ([\d.-]+ dB)', levels)),
    }


def main():
    media = {movie.name: probe(movie) for movie in sorted(ROOT.glob('*.webm'))}
    (ROOT / 'media-metadata.json').write_text(json.dumps(media, indent=2) + '\n')
    parity = {}
    groups = [
        (f'product-{aspect}', f'product-{aspect}', (0, 15, 30), f'parity-{aspect}')
        for aspect in ('wide', 'portrait', 'square')
    ] + [('fun-caption', 'fun', (8, 23, 38), 'parity-caption')]
    for preview_name, movie_name, indices, output_name in groups:
        items = []
        for index, percentage in zip(indices, (0, 50, 100)):
            preview = ROOT / f'preview-{preview_name}-{index}.png'
            export = ROOT / f'decoded-{preview_name}-{index}.png'
            decode(ROOT / f'{movie_name}.webm', index, export)
            compare = run('ffmpeg', '-hide_banner', '-i', str(preview), '-i', str(export),
                          '-filter_complex', '[0:v]format=yuv420p[p];[1:v]format=yuv420p[e];[p][e]ssim',
                          '-f', 'null', '-')
            score = float(re.search(r'All:(\d+\.\d+)', compare.stderr).group(1))
            parity[f'{preview_name}-{index}'] = {
                'frame': index, 'timeSeconds': index / 30, 'revealPercent': percentage, 'ssim': score
            }
            assert score >= .97, (movie_name, index, score)
            items.extend([(preview, f'PREVIEW  {percentage}%'), (export, f'DECODED  {percentage}%')])
        sheet(items, ROOT / f'{output_name}.png', 2, (375, 350))
    (ROOT / 'parity.json').write_text(json.dumps(parity, indent=2) + '\n')
    archives = {}
    for archive in sorted(ROOT.glob('*.acstudio')):
        with zipfile.ZipFile(archive) as bundle:
            project = json.loads(bundle.read('project.json'))
        archives[archive.name] = {
            'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
            'locale': project['locale'],
            'title': project['title'],
            'audioClips': project['audioClips'],
            'shots': [{key: shot[key] for key in ('startFrame', 'durationFrames', 'headline', 'subhead', 'customData')}
                      for shot in project['shots']],
        }
    (ROOT / 'archive-metadata.json').write_text(json.dumps(archives, indent=2, ensure_ascii=False) + '\n')
    by_story = []
    for name in ('fun', 'suspense'):
        for index in (65, 185, 305, 425):
            output = ROOT / f'{name}-{index}.png'
            decode(ROOT / f'{name}.webm', index, output)
            by_story.append((output, f'{name.upper()}  {index / 30:.2f} s'))
    sheet(by_story, ROOT / 'SHOT_STORYBOARD.png')
    decode(ROOT / 'fun-edited.webm', 65, ROOT / 'fun-edited-65.png')
    decode(ROOT / 'product-da-edited.webm', 65, ROOT / 'product-da-edited-65.png')
    sheet([(ROOT / 'fun-65.png', 'SAVED  2.17 s'), (ROOT / 'fun-edited-65.png', 'REOPENED AND EDITED  2.17 s')],
          ROOT / 'REOPEN_EDIT.png', 2)
    sheet([(ROOT / 'before-product.png', 'PHASE 02  1.00 s'),
           (ROOT / 'after-product.png', 'PHASE 03  1.00 s')], ROOT / 'BEFORE_AFTER.png', 2, (520, 324))
    print(f'{len(media)} browser videos fully decoded, {len(parity)} comparisons passed')


if __name__ == '__main__':
    main()
