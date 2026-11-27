"""Build contact sheets from the actual emitted WebM and MP4 frames."""
import io
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

root = Path(__file__).resolve().parents[1]
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17)

def decoded(movie, second):
    png = subprocess.run([
        "ffmpeg", "-v", "error", "-ss", str(second), "-i", str(movie),
        "-vf", ("scale=in_range=full:out_range=full:in_color_matrix=bt709,format=rgb24"
                 if movie.suffix == ".webm" else "format=rgb24"),
        "-frames:v", "1", "-threads", "1", "-f", "image2pipe", "-c:v", "png", "-"
    ], capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGB")

def sheet(name, rows, width=400, height=225):
    pad = 12
    preview = Image.new("RGB", (len(rows[0]) * (width + pad) + pad, len(rows) * (height + 44) + pad), "#141927")
    draw = ImageDraw.Draw(preview)
    for row, cells in enumerate(rows):
        for col, (label, photo) in enumerate(cells):
            x, y = pad + col * (width + pad), pad + row * (height + 44)
            thumb = ImageOps.contain(photo, (width, height))
            preview.paste(thumb, (x + (width - thumb.width) // 2, y + (height - thumb.height) // 2))
            draw.text((x, y + height + 8), label, fill="#eef2f8", font=font)
    preview.save(root / name)

subjects = [
    ("Dialogue", "dialogue-wide", 1.6, 1.6),
    ("Suspense", "silhouette-wide", 5.7, 7.1),
    ("Product", "product-wide", 6.1, 8.0),
]
sheet("BEFORE_AFTER_CONTACT.png", [
    [(f"{label} · {state}", decoded(root / state / (name + ".webm"), before if state == "before" else after))
     for label, name, before, after in subjects]
    for state in ["before", "after"]
])
sheet("REPAIRED_STORYBOARD.png", [
    [(f"{label} · {second:.1f} s", decoded(root / "after" / (name + ".webm"), second)) for second in times]
    for (label, name, _, _), times in zip(subjects, [[1.4, 4.1, 6.8, 10], [1.4, 4.1, 7.1, 10], [1.5, 4.9, 8, 14.6]])
])
base = root.parent / "evidence/image-compressor-reel/AnyConverter-Image-Compressor-Reel.mp4"
repaired = root / "after/AnyConverter-Image-Compressor-Reel-Repaired.mp4"
sheet("REEL_SAVINGS_COMPARISON.png", [[("Original signed number", decoded(base, 12)), ("Repaired savings wording", decoded(repaired, 12))]], 340, 560)
