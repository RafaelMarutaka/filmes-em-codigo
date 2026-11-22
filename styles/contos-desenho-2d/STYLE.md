# Contos em Desenho 2D — Style Prompt

> Vertical (9:16) narrated tales in a flat 2D cartoon: thick dark outlines, flat colours, one wide-eyed round-headed character, a simple night or day setting, and big outlined captions with one key word in yellow. Built for "neste mundo…" stories, curiosities and short fables.
> References (grammar only): Instagram story-cartoon reels with one simple character and big captions. Copy no channel's characters or stories.

## 1. Essence, and what it is not

One premise, told in 15–40 s: a strange rule of the world ("Neste mundo, quem… vira…"), shown on one character, with an escalation and a final beat. The drawing is simple enough to read instantly on a phone: a round head with huge eyes, a pill body, flat backgrounds. The visual payoff is a transformation that grows step by step with the narration.

Not a detailed illustration (that is Livro Infantil de Giz de Cera), not retro 50s limited animation (Desenho Retrô Anos 50), not stick figures.

## 2. Materials & rendering

- Canvas 2D, vector paths only. Every shape filled flat and stroked with a dark ink outline (#1d1d2b, ≈ 7 px at 1080 wide), round joins.
- Backgrounds in 3–4 planes: sky gradient (or flat), hills, trees as overlapping circles, ground. Light sources (lamps, moon) get a soft radial glow, the only gradient besides the sky.
- Character: round head (skin tone), big white eyes with dark pupils and a white highlight, simple mouth, a solid shirt colour that pops against the background.

## 3. Colour logic

Night: deep blue-violet sky, teal-green foliage, warm lamp yellow. Day: soft blue sky, fresh greens. The character's shirt is the warmest colour on screen (orange, red). Caption key word in yellow (#ffd23f).

## 4. Type & subtitles

Big rounded heavy type (Baloo 2, 800, ≈ 92 px), white with a thick dark outline, centred low (≈ 86% height), 1–3 words per group, pop-in with overshoot. One word per sentence in **yellow** (the twist word). Language is the film's (default Portuguese).

## 5. Motion quality

Gentle and bouncy: idle bob, blinks, a pupil glance up when something happens above the head, transformations growing in steps with `back` easing on each narration beat. A gesture per beat (scratching the head, shrugging).

## 6. Camera grammar

Mostly one wide-to-medium shot that slowly pushes in and tilts up as the transformation grows. Cut only for a change of place or time. End on a dimmed frame with the title card.

## 7. Sound palette

A pop per caption group, a whoosh on each growth step, a small tick/click on the twist, a low thump on the end card; narration in a warm storyteller voice when there is one.

## 8. Native moves

"Neste mundo…" opener on the wide shot; the step-by-step transformation; the surprised face (eyes widen, O-mouth) on the twist number; the end card over the dimmed last frame.

## 9. Pitfalls of the medium

Characters floating above furniture: check feet and seats. Captions over the character's face: keep them in the lowest band. Too many colours: three main hues plus the character's shirt.

## 10. Engine

Canvas 2D only, no libraries. Font: Baloo 2 (OFL, via `demo/tools/fonts.sh`). Render 1080×1920, 30 fps.

## 11. Variation space

Setting (park, bedroom, street, school, day or night), character look (hair, glasses, shirt), the transformation (plant, statue, glow, size, colour), caption colour of the key word.
