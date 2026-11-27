"""Compare caption recognition after first reducing the decoded frames to phone size."""
import json
import re

from PIL import Image

from media import ROOT, decode, run, sheet


def normalized(value):
    return re.findall(r"\w+", value.casefold())


def main():
    expected = [('panel', 65, 'First rule: no more meetings.'),
                ('outline', 185, 'Monday looked clear. Then the invites arrived.'),
                ('shadow', 305, 'That makes no sense.')]
    comparisons, evidence = {}, []
    for treatment, frame, copy in expected:
        comparisons[treatment] = {}
        for version, source in [('published', ROOT.parent / 'evidence'), ('revised', ROOT)]:
            decoded = ROOT / f'phone-{version}-{treatment}-source.png'
            decode(source / 'fun.webm', frame, decoded)
            image = Image.open(decoded).resize((375, 667), Image.Resampling.LANCZOS)
            converted = ROOT / f'phone-{version}-{treatment}.png'
            image.save(converted)
            # Crop the caption from the already-resampled raster. Upsampling here
            # supplies Tesseract's preferred input resolution without adding detail.
            crop = image.crop((28, 397, 322, 543)).convert('L')
            crop = crop.resize((882, 438), Image.Resampling.LANCZOS)
            test = ROOT / 'ocr-input.png'
            crop.save(test)
            output = run('tesseract', str(test), 'stdout', '--psm', '11').stdout.strip()
            found, wanted = normalized(output), normalized(copy)
            comparisons[treatment][version] = {'expected': copy, 'recognized': output,
                'recognizedExpectedWords': sum(word in found for word in wanted), 'expectedWords': len(wanted)}
            evidence.append((converted, f'{version.upper()} {treatment}  375 px'))
            decoded.unlink()
            test.unlink()
    sheet(evidence, ROOT / 'PHONE_CAPTIONS.png', 2, (390, 700))
    (ROOT / 'phone-legibility.json').write_text(json.dumps(comparisons, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
