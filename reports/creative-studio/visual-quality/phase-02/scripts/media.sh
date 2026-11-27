#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../evidence"
mkdir -p frames
color_filter=scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709,format=rgb24
movies=(dialogue-wide silhouette-wide product-wide portrait-export edited-reexport)
for movie in "${movies[@]}"; do
  ffprobe -v error -count_frames -show_entries stream=codec_name,width,height,avg_frame_rate,nb_read_frames,sample_rate,channels:format=duration -of json "$movie.webm" > "$movie.ffprobe.json"
  ffmpeg -hide_banner -i "$movie.webm" -vn -af volumedetect -f null - 2>&1 | sed -n '/mean_volume\|max_volume/p' > "$movie.volume.txt"
  for time in 0 1 3 5 7; do
    ffmpeg -v error -y -threads 2 -ss "$time" -i "$movie.webm" -vf "$color_filter" -frames:v 1 -threads 1 "frames/$movie-$time.png"
  done
done
ffmpeg -v error -y -ss 10.5 -i product-wide.webm -vf "$color_filter" -frames:v 1 -threads 1 frames/product-wide-10.5.png
ffmpeg -hide_banner -filter_complex_threads 1 -i portrait-preview-full.png -i frames/portrait-export-0.png \
  -lavfi '[0:v]format=yuv444p,split[p1][p2];[1:v]format=yuv444p,split[v1][v2];[p1][v1]ssim;[p2][v2]psnr' \
  -f null - 2>&1 | sed -n '/SSIM\|PSNR/p' > parity-metrics.txt
montage -font DejaVu-Sans -pointsize 16 -fill '#e9edf6' -background '#10131c' \
  -label 'Dialogue 1 s' frames/dialogue-wide-1.png -label 'Dialogue 3 s' frames/dialogue-wide-3.png -label 'Dialogue 5 s' frames/dialogue-wide-5.png -label 'Dialogue 7 s' frames/dialogue-wide-7.png \
  -label 'Suspense 1 s' frames/silhouette-wide-1.png -label 'Suspense 3 s' frames/silhouette-wide-3.png -label 'Suspense 5 s' frames/silhouette-wide-5.png -label 'Suspense 7 s' frames/silhouette-wide-7.png \
  -label 'Product 1 s' frames/product-wide-1.png -label 'Product 3 s' frames/product-wide-3.png -label 'Product 5 s' frames/product-wide-5.png -label 'Product 10.5 s' frames/product-wide-10.5.png \
  -tile 4x3 -geometry 420x236+8+8 ../SHOT_STORYBOARD.png
montage -font DejaVu-Sans -pointsize 16 -fill '#e9edf6' -background '#10131c' \
  -label 'Phase 01 original' legacy-baseline.png -label 'Phase 02, original layout' legacy-current.png \
  -label 'Constrained hero' hero.png -label 'Constrained comparison' comparison.png -label 'Constrained statistic' statistic.png \
  -label 'Product editor export' product-wide.png -tile 3x2 -geometry 420x236+8+8 BEFORE_AFTER.png
montage -font DejaVu-Sans -pointsize 18 -fill '#e9edf6' -background '#10131c' \
  -label 'Dialogue' dialogue-portrait.png -label 'Suspense' silhouette-portrait.png -label 'Product' product-portrait.png \
  -label 'English' expanded-en.png -label 'Español' expanded-es.png -label 'Dansk' expanded-da.png \
  -tile 6x1 -geometry 225x400+8+8 PORTRAIT_STORYBOARD.png
