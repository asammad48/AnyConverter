"""Replace the misleading metric card in the locally composited baseline reel."""
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

phase = Path(__file__).resolve().parents[2]
source = phase / "evidence" / "image-compressor-reel"
out = phase / "repairs" / "after"
measurement = json.loads((source / "measurements.json").read_text())
savings = 100 * (1 - measurement["compressedBytes"] / measurement["originalBytes"])
with Image.open(source / "compressed.webp") as photo:
    card = ImageOps.fit(photo.convert("RGB"), (800, 570), centering=(.5, .47))
draw = ImageDraw.Draw(card)
draw.rounded_rectangle((42, 383, 758, 541), radius=22, fill="#f7f5f0")
bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
draw.text((70, 408), f"{savings:.1f}% smaller", font=ImageFont.truetype(bold, 46), fill="#17372f")
draw.text((70, 476), f'{measurement["original"]} to {measurement["compressed"]} · WebP at 80%', font=ImageFont.truetype(bold, 25), fill="#30403d")
card.save(out / "reel-positive-savings-card.png")
subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-filter_complex_threads", "1",
    "-i", str(source / "AnyConverter-Image-Compressor-Reel.mp4"),
    "-i", str(out / "reel-positive-savings-card.png"),
    "-filter_complex", "[0:v][1:v]overlay=104:628:enable='gte(t,10.4)*lt(t,14.6)'",
    "-c:v", "libx264", "-crf", "18", "-threads", "4",
    "-c:a", "copy", "-movflags", "+faststart", str(out / "AnyConverter-Image-Compressor-Reel-Repaired.mp4")
], check=True)
