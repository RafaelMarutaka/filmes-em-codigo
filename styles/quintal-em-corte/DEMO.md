# Quintal em Corte 3D — Demo: "Como um buraco no quintal vira piscina"

One example among many. Don't reuse its story, arc, shots, props or timings.

**Length** 47 s, 1080×1920, 24 fps. Portuguese narration (ElevenLabs, voice "Caio - Confiável e Explicativa", model eleven_v4), one caption word at a time.

## Story (10 lines, one step each)

| # | Line | In the cut |
|---|---|---|
| 1 | Esse é um quintal comum. Embaixo da grama, só terra. | wide 3/4, whole block, strata visible |
| 2 | Pra ter uma piscina aqui, primeiro cava um buraco de um metro e meio. | soil lowers, clods fly to a growing pile |
| 3 | Só que terra solta desmorona. Aí entra uma gaiola de ferro nas paredes. | red pulse on walls, chunks fall; rebar grows floor → rim |
| 4 | Por cima dela, concreto jateado. Pronto, o buraco não fecha mais. | concrete wipes up, grey spray particles |
| 5 | Mas concreto é poroso, e a água ia sumir pela terra. | low angle: ghost water, red pulse under the floor, drips sinking |
| 6 | Então passa uma manta impermeável e cobre tudo com pastilha. | dark membrane wipe, then tile wipe |
| 7 | Água parada fica verde em poucos dias. | water fills and turns green |
| 8 | Por isso um ralo no fundo puxa a água até um filtro de areia, e ela volta limpa pela parede. | pipes draw on the cut face, filter pops, arrows run, water clears |
| 9 | Folha que cai na água fica presa no skimmer antes de afundar. | skimmer opens in the cut on the side wall; leaves fall, a surface current carries them into its mouth, they stay in the basket |
| 10 | Enche, liga a bomba, e o buraco do quintal virou piscina. | water to the rim, float drops in, pull back and rise |

## Build notes

- `demo/voice/voz.mp3` is the raw take (ElevenLabs, not in git; `words.json` and `timing.json` are); `voice/build_voice.py` cuts it at the silences between lines, adds 0.5–0.75 s gaps and writes `voice/voz_montada.wav` + `timing.json` (line starts, word times from ElevenLabs Scribe).
- `main.js` reads `timing.json`; every step is keyed to `L[i]` (line start) plus offsets, so a new narration re-times the film.
- `mix.py` synthesizes foley from `events.json`; no music.
- Rebuild: `sh styles/quintal-em-corte/demo/build.sh` from the library root.
- Files: `demo/main.js` draws everything (materials ≈ lines 30–75, block 80–130, build parts 130–230, choreography `place()`, camera `KEYS`, captions `word()`).
