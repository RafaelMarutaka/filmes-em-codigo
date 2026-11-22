#!/bin/sh
# Refaz o demo do estilo num comando: sh styles/objetos-3d-escuro/demo/build.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd); SLUG=$(basename "$(dirname "$HERE")")
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}; cd "$LIB"
sh "$HERE/tools/fonts.sh"
PY=.venv/bin/python
node core/render/events.mjs "$HERE" --size 1080x1920
$PY "$HERE/sound.py" "$HERE"
node core/render/video.mjs "$HERE" --size 1080x1920 --fps 30 --workers 4 --out "$HERE/out/video.mp4"
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -i "$HERE/mix.wav" -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "styles/$SLUG/$SLUG.mp4"
node core/render/still.mjs "$HERE" ${STILL:-3} --size 1080x1920 --prefix styleframe_ --out "$HERE/stills"
mv "$HERE/stills/styleframe_${STILL:-3}.jpg" "$HERE/stills/styleframe.jpg"; cp "$HERE/stills/styleframe.jpg" "styles/$SLUG/poster.jpg"
echo "pronto: styles/$SLUG/$SLUG.mp4"
