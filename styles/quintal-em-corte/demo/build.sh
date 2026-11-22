#!/bin/sh
# Refaz o demo "Como um buraco no quintal vira piscina" num comando: sh styles/quintal-em-corte/demo/build.sh
# A narração (voice/voz.mp3, ElevenLabs) não vai pro git: coloque o mp3 em demo/voice/ antes. words.json e timing.json já estão aqui.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); SLUG=$(basename "$(dirname "$HERE")")
LIB=${LIB:-$(cd "$HERE/../../.." && pwd)}; cd "$LIB"
sh "$HERE/tools/fonts.sh"
PY=.venv/bin/python
$PY "$HERE/voice/build_voice.py" "$HERE"
node core/render/events.mjs "$HERE" --size 1080x1920
$PY "$HERE/mix.py" "$HERE" "$LIB"
node core/render/video.mjs "$HERE" --size 1080x1920 --fps 24 --workers ${WORKERS:-3} --out "$HERE/out/video.mp4"
ffmpeg -y -loglevel error -i "$HERE/out/video.mp4" -i "$HERE/out/mix.wav" -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "styles/$SLUG/$SLUG.mp4"
node core/render/still.mjs "$HERE" ${STILL:-34.2} --size 1080x1920 --prefix styleframe_ --out "$HERE/stills"
mv "$HERE/stills/styleframe_${STILL:-34.2}.jpg" "$HERE/stills/styleframe.jpg"
node core/render/still.mjs "$HERE" 30.5 --size 1080x1920 --prefix poster_ --out "$HERE/stills" && mv "$HERE/stills/poster_30.5.jpg" "styles/$SLUG/poster.jpg"
echo "pronto: styles/$SLUG/$SLUG.mp4"
