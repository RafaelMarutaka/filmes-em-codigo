#!/bin/sh
# Baixa as fontes (OFL) do npm (@fontsource) para demo/fonts, se faltarem.
set -e; D="$(cd "$(dirname "$0")/.." && pwd)/fonts"; [ -f "$D/inter-latin-800-normal.woff2" ] && exit 0
T=$(mktemp -d); (cd "$T" && npm init -y >/dev/null && npm i -s @fontsource/inter@5 @fontsource/instrument-serif@5 >/dev/null)
F=$T/node_modules/@fontsource; cp $F/inter/files/inter-latin-500-normal.woff2 $F/inter/files/inter-latin-700-normal.woff2 $F/inter/files/inter-latin-800-normal.woff2 $F/instrument-serif/files/instrument-serif-latin-400-italic.woff2 "$D/"; rm -rf "$T"
