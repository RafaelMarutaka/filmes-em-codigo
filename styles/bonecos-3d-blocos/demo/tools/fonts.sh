#!/bin/sh
# Baixa a Poppins (OFL) do npm (@fontsource) para demo/fonts, se faltar.
set -e; D="$(cd "$(dirname "$0")/.." && pwd)/fonts"; [ -f "$D/poppins-latin-800-normal.woff2" ] && exit 0
T=$(mktemp -d); (cd "$T" && npm init -y >/dev/null && npm i -s @fontsource/poppins@5 >/dev/null)
cp $T/node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2 $T/node_modules/@fontsource/poppins/files/poppins-latin-800-normal.woff2 "$D/"; rm -rf "$T"
