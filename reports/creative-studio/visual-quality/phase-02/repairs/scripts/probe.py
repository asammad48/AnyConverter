"""Inspect encoded duration, audio signal and every presentation timestamp."""
import json
import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]

def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True)

result = {}
for movie in sorted((root / "after").glob("*.webm")) + [
    root / "before" / "silhouette-wide.webm",
    root / "after" / "AnyConverter-Image-Compressor-Reel-Repaired.mp4",
]:
    data = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(movie)).stdout)
    timestamps = json.loads(run("ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_frames", "-show_entries", "frame=best_effort_timestamp_time", "-of", "json", str(movie)).stdout)
    video, audio = data["streams"][:2]
    times = [float(frame["best_effort_timestamp_time"]) for frame in timestamps["frames"]]
    assert times[0] == 0 and all(abs(pts - i / 30) <= .0011 for i, pts in enumerate(times))
    duration = len(times) / 30
    assert abs(float(data["format"]["duration"]) - duration) < .03
    volume = run("ffmpeg", "-hide_banner", "-ss", str(duration - 1.5), "-t", "1", "-i", str(movie), "-vn", "-af", "volumedetect", "-f", "null", "-").stderr
    mean = float(re.search(r"mean_volume: (-?[\d.]+)", volume).group(1))
    assert mean > -75
    result[str(movie.relative_to(root))] = {
        "size": [video["width"], video["height"]], "video": video["codec_name"], "audio": audio["codec_name"],
        "audioRate": audio["sample_rate"], "fps": video["avg_frame_rate"], "frames": len(times), "duration": duration,
        "firstPts": times[0], "lastPts": times[-1], "tailMeanDb": mean
    }
(root / "after" / "media-technical-results.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
