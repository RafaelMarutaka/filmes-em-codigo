# Quintal em Corte 3D (剖面后院3D) — Style Prompt

Techniques from Objetos 3D no Escuro (objetos-3d-escuro), with growth and arrival moves borrowed from Ilha Low-poly Isométrica (lowpoly-island).
Default size: 1080×1920.

> Vertical (9:16) "how is it built" Shorts: a block of backyard cut open like a cake, a house on top, and an everyday structure built inside the cut one problem at a time, under a calm, fast narrator and one caption word at a time.
> References (grammar only): faceless "how the everyday things around you really work" Shorts with semi-real 3D cutaway yards. Copy no channel's names, houses, topics in sequence, captions or wording.

## 1. Essence, and what it is not

One **rectangular block of ground** floats in a daylight sky: grass on top, a house and a tree at the back, and the front face sliced clean so the **soil strata** show like layers of a cake. The film builds one everyday thing **inside that cut** (a pool, a septic tank, a road, a well, a basement, a foundation), and every step answers a problem the narrator names first: *problem → the fix appears in the cut*. The cut face is the stage: pipes, walls, water and layers are always readable from the front.

Not a low-poly isometric toy world (perspective camera, smooth semi-real materials, no faceted pastel look); not a dark studio object reel (bright daylight, a whole place, not one object); not a photoreal render or an architectural walkthrough (simple primitives, no textures from photos, no people modelled in detail).

## 2. Materials & rendering

- three.js, `MeshStandardMaterial` everywhere, **no image textures**: colour comes from small shaders that read world position (`onBeforeCompile`, `customProgramCacheKey` per material kind, or every material compiles to the first one's shader).
- **Soil**: world-Y strata with wavy borders from fbm noise: dark topsoil (0 to −0.55 m), red-brown clay (to −1.65), tan sand (to −2.6), grey rock below; fine speckle and a few pale stones. The block's top under the grass is dark soil.
- **Grass**: a thin slab, green top with noise, roots fading into soil on its sides; a few hundred instanced blades (thin cones), never inside the build area or the house.
- **Built parts** each have their own material logic: concrete (grey fbm), membrane (near-black), tiles (16 cm grid with white grout, per-tile blue jitter), pipes (off-white PVC with ball joints), metal (rusty rebar), water (transparent blue box + a rippling surface plane with `depthWrite: false`).
- Layers appear by a **world-Y wipe** (`discard` above a uniform), so a coat rises from the floor to the rim.
- House: white box walls, dark-grey extruded gable roof, framed windows, wooden door and step. One tree of smooth icosahedra. Optional props per topic: fence, car, shed.
- Light: hemisphere (sky blue / warm ground) + one warm sun with soft shadows (1024 map) + a weak cool fill from the front-right. ACES tone mapping, exposure ≈ 1.05. Sky is a vertical gradient (deep blue → pale → near white). A faint vignette on top.
- Software WebGL renders it at ≈ 0.6 s per 1080×1920 frame: keep geometry light, no post stack.

## 3. Colour logic

Natural and sunny: green grass, three to four earth tones in the strata, white house, grey concrete. **Blue means water** and nothing else (pastilha, water, filter tank). **Red means "problem"**: a translucent red pulse over the failing part (walls about to collapse, soil soaking up water) and nowhere else. **Green water** means dirty. Pipes and fittings are white. Caption accent is **yellow**.

## 4. Type & subtitles

- **One caption word at a time**, centred at ≈ 73 % of the height: Montserrat 900, uppercase, white with a thick black outline (16 px at 1080 wide), ≈ 124 px (104 px for words over 9 letters). Each word pops in with a small overshoot, timed to the word's start in the narration and held until the next word.
- Key nouns of the build (the materials, the numbers, the thing being built) in **yellow** (#ffd23f).
- No headline, no title card, no logo unless the user asks. Language is the film's (default Portuguese).

## 5. Motion quality

Smooth on ones (24 fps). Everything arrives with purpose: soil **lowers** as it is dug (with clods arcing to a pile that grows on the grass); walls **crumble** as small falling chunks; bars **grow** along their length in order from the floor up; coats **wipe** upward; pipes **extend** segment by segment along their route; tanks **pop** with a slight overshoot; water **fills** with ease-in-out and its surface ripples. Each step starts on the narrator's key word for it.

## 6. Camera grammar

Perspective camera, FOV ≈ 38°, always outside the block, keyframed by target, azimuth, elevation and distance, eased between keys:

| Move | Use |
|---|---|
| Wide 3/4 from the front-left, block whole | open and close; the "before" and "after" |
| Push-in to the cut, slightly above | the step being built |
| Low angle at the cut face | what happens underground (leaks, pipes, roots) |
| Arc to the side | a part that sits beside the build (filter, pump, tank) |
| High close look into the build | a small detail (a skimmer, a drain, a valve) |
| Pull-back and rise | the finished thing in its yard |

No cuts: one continuous camera through the whole film. No shake, no whip-pans.

## 7. Sound palette

Narration carries the film: calm, fast, plain (≈ 160–180 words per minute), one short sentence per step. Under it, **synthesized foley that follows the material**: shovel crunch and pebble ticks for digging, a low rumble with pebbles for collapse, metal clinks for rebar, a hiss for sprayed concrete, plinks for leaking water, a swish for a membrane, quick ceramic clacks for tiles, plastic knocks for pipes, a pour for filling, a low motor hum for a pump, a splash. A quiet yard bed: soft wind and an occasional bird. **No music** by default. Effects sit ≈ 17 dB under the voice (keep them in the background); master at −14 LUFS.

## 8. Native moves

- **The cake cut**: the build is always halved by the front face, so walls, pipes and water show in section.
- **Problem → fix**: the narrator names a failure, the red pulse shows it in the cut, the next line's fix covers it.
- **The pile**: soil that leaves the hole grows a mound on the grass, and leaves when the next stage starts.
- **The route**: a pipe or cable draws itself through the soil of the cut face, and arrows run along it once it works.
- **The reveal**: the last line pulls back and rises over the finished thing in use (water rippling, a float bobbing, a car parked, lights on).

## 9. Pitfalls of the medium

- All procedural materials share one `onBeforeCompile` source → three.js caches one program → set `customProgramCacheKey` per kind.
- A dug volume scaled from the wrong end collapses to zero at the start → scale the remaining soil from the floor up to the current dig level.
- Water box and its surface fight with the tiles behind → `depthWrite: false`, higher `renderOrder`.
- Pipes inside a soil box are invisible → route them **on the cut plane** (centre at the face), half-buried.
- Rebar left visible after the concrete has risen past it → hide it once the coat reaches the rim.
- Captions over a busy cut need the thick outline; never thin it.
- 9:16 at FOV 38° needs ≈ 28 units of distance for a 10-unit-wide block in a wide shot.

## 10. Engine

In `demo/` (three.js r170 + a 2D canvas for captions): `main.js` (procedural materials, block and strata, build parts, choreography keyed to the narration's line starts, camera keys, one-word captions, sound events), `index.html` (fonts, import map), `voice/build_voice.py` (cuts the narration into lines, adds breathing gaps, writes `timing.json` with line starts and word times), `mix.py` (foley from `events.json`, yard bed, voice on top), `build.sh` (one command). Techniques from `../objetos-3d-escuro/demo/` (9:16 three.js page, word captions) and the arrival curves of `../lowpoly-island/`.

## 11. Variation space

You decide the thing being built and its steps, the yard (house style, trees, fence, a car), the block's size, the soil strata (sandy coast, red clay, rocky hill), the season and sun angle, the camera keys and the ending. Structures beyond the pool: a septic tank (problem: smell, overflow → chambers, vent, drain field); a strip of dirt that becomes a road (mud → gravel base → compaction → asphalt → drainage); a well (dry hole → casing → pump → pressure tank); a basement (water table → drain tile → sump pump). Openings: the finished thing first, then rewind to bare grass; or bare grass with the narrator's question. Endings: the reveal in use; or a fast replay of every layer stacking in the cut.

---

How our demo was made (story, shots, sound, build): [DEMO.md](DEMO.md).
