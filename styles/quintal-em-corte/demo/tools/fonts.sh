#!/bin/sh
# Baixa a Montserrat (OFL) do npm (@fontsource) para demo/fonts, se faltar.
set -e; D="$(cd "$(dirname "$0")/.." && pwd)/fonts"; [ -f "$D/montserrat-latin-900-normal.woff2" ] && exit 0
mkdir -p "$D"; T=$(mktemp -d); (cd "$T" && npm init -y >/dev/null && npm i -s @fontsource/montserrat@5 >/dev/null)
F=$T/node_modules/@fontsource/montserrat/files; cp $F/montserrat-latin-900-normal.woff2 $F/montserrat-latin-800-normal.woff2 $F/montserrat-latin-ext-900-normal.woff2 "$D/"; rm -rf "$T"
