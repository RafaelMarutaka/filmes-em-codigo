#!/bin/sh
# Baixa a Baloo 2 (OFL) do npm (@fontsource) para demo/fonts, se faltar.
set -e; D="$(cd "$(dirname "$0")/.." && pwd)/fonts"; [ -f "$D/baloo-2-latin-800-normal.woff2" ] && exit 0
T=$(mktemp -d); (cd "$T" && npm init -y >/dev/null && npm i -s @fontsource/baloo-2@5 >/dev/null)
cp $T/node_modules/@fontsource/baloo-2/files/baloo-2-latin-600-normal.woff2 $T/node_modules/@fontsource/baloo-2/files/baloo-2-latin-800-normal.woff2 "$D/"; rm -rf "$T"
