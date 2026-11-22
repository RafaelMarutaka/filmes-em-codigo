# Bonecos 3D de Blocos — Style Prompt

> Vertical (9:16) comic skits with chunky, block-built 3D characters in a dim violet room: oversized box heads, blocky hair, flat-panel eyes, captions one bold yellow word at a time in a dark pill, and a small episode label on top.
> References (grammar only): short "office/tech humour" reels made with low-detail 3D characters. Never use any company's mascot (no orange crab-like mascot, no brand characters): every character is original.

## 1. Essence, and what it is not

Two or three characters, one room, one short exchange with a punchline. The comedy comes from timing and reactions (a blink, eyebrows jumping, a little hop), not from detailed acting. Characters are built from boxes: a head bigger than the body, hair made of 5–8 blocks, eyes as white panels with black square pupils, a mouth that is one dark bar which stretches when talking.

Not voxel/Minecraft (no grid of cubes), not plastic bricks (that is Blocos de Montar), not realistic 3D animation.

## 2. Materials & rendering

- Three.js `MeshStandardMaterial`, roughness ≈ 0.8, no textures. Flat saturated colours.
- Room: violet-blue walls and floor (#232659 / #262a63), a few props built from primitives (a shelf with simple shapes, a framed picture, a desk, a laptop with a glowing cyan screen).
- Light: blue-violet hemisphere ambient, a warm key from front-right with soft shadows, a pink rim from back-left. Fog in the room colour so the back fades. ACES tone mapping, subtle 2D vignette.

## 3. Colour logic

Room in cool violets; characters in warm skin, dark clothes, one bright prop or sidekick colour (teal, orange, yellow). Captions: **yellow (#ffd23f) on near-black pill**. The episode label is white on a translucent dark pill.

## 4. Type & subtitles

Poppins 800 for captions, one word at a time (or two short ones), centred at ≈ 80% height, pill with rounded corners, pop-in with overshoot. Label on top in Poppins 600 caps, e.g. "EPISÓDIO 01 · TÍTULO". Language is the film's (default Portuguese).

## 5. Motion quality

Snappy but simple. Mouth bar scales while the character speaks; blinks every few seconds; reactions are short and big (brows up, a hop with squash, head tilt). Idle sway of a few degrees so nobody is frozen.

## 6. Camera grammar

Cut between a wide shot (everyone in frame, room visible) and medium close-ups on whoever speaks (over-the-shoulder is welcome). Each shot drifts in slightly. Cut on the line change, with a soft click. 2–4 s per shot.

## 7. Sound palette

Ticks/pops per caption word in two pitches (one per character), a click on cuts, a whoosh or pop on reactions, a low thump on the end card. Voice-over or character voices when the film has them.

## 8. Native moves

The silent "…" reaction close-up; the sidekick's antenna/glow lighting up; brows jumping on the punchline; the end card over the wide shot.

## 9. Pitfalls of the medium

In 9:16 the wide shot must pull far back and characters must stand close together, or someone is cut off. Close-ups too tight turn heads into walls: keep the whole head and shoulders. Captions must sit below the faces.

## 10. Engine

Three.js + 2D canvas overlay. Font: Poppins (OFL, via `demo/tools/fonts.sh`). Render 1080×1920, 30 fps.

## 11. Variation space

Room (office, bedroom, shop, classroom), character designs (hair, glasses, clothes, sidekick shape), caption colour (keep one), label text, number of characters (up to three).
