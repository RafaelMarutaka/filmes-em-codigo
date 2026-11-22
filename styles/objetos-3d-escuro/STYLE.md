# Objetos 3D no Escuro — Style Prompt

> Vertical (9:16) explainer reels built from one matte 3D object per idea, lit by a single spotlight in a black studio, with a two-line headline on top whose key phrase sits inside a glowing blue selection box, and one-word subtitles at the bottom.
> References (grammar only): "AI tool" reels on Instagram that show soft, toy-like hardware in the dark (projectors, phones, mics, joysticks) under a bold headline. Copy no creator's objects, logos or wording.

## 1. Essence, and what it is not

Each beat of the story is **one object** that stands for the idea (a script = a stack of cards, a voice = a studio mic, editing = a film projector, sales = a cash drawer, a funnel = a funnel). The object rises into a pool of light, turns slowly, does **one** small mechanical thing (cards fan out, reels spin, a lens lights up), then lifts away for the next one. The headline says the idea in 4–7 words; the object makes it tangible.

Not glossy product advertising (that is Produto em Vidro 3D), not a dark keynote slide (no charts, no UI panels), not a busy 3D scene: one object, one light, one sentence.

## 2. Materials & rendering

- Three.js, `MeshStandardMaterial` only. Bodies in **matte dark grey** (≈ #2a2a2e, roughness 0.6), details in near-black, small **brushed steel** parts (metalness 0.9, roughness 0.3), paper in warm off-white. Every object gets **one orange accent part** (#ff6a3d, a little emissive): a badge, a button, the first line on a card.
- Objects are built from primitives (boxes, cylinders, tori, capsules) with clear, chunky proportions, slightly toy-like. Fictional objects only, no real product silhouettes or logos.
- Studio: black background, black matte floor that fades into fog (no visible horizon), a weak RoomEnvironment (intensity ≈ 0.2) so metal has something to reflect.
- Light: one warm **spotlight from above** with soft shadows (the pool of light is the set), a cool blue rim from back-left, a faint warm rim from back-right. ACES tone mapping. A soft radial vignette in 2D on top.
- Emissive moments are small and earned: a lens that lights, a grille that pulses while "talking", a screen that wakes.

## 3. Colour logic

Black, charcoal, steel, off-white paper; **orange** = the object's accent; **blue (#6f9bff)** belongs to the text layer only (the selection box and its glow). Never more than these two accents.

## 4. Type & subtitles

- Headline, top third, centred: line 1 in a heavy grotesque (Inter 800, ≈ 92 px at 1080 wide), white; line 2 is the **key phrase** in an italic display serif (Instrument Serif italic, ≈ 104 px) inside a thin blue rectangle with a soft blue glow, a faint blue fill and four white corner handles, like a selected text box in a design tool. The box draws left→right, then the phrase fades in.
- One-word subtitles near the bottom (Inter 700, white, dark shadow), popping in with a small overshoot, synced to the voice. They never sit on the object.
- Language is the film's (default Portuguese).

## 5. Motion quality

Slow and weighted. Objects enter from below with ease-out (≈ 1 s), drift-rotate a few degrees per second, leave upward with ease-in-out. Mechanical moves are precise and readable (a reel turns at a steady speed, cards fan with smoothstep). No bouncing camera, no shake.

## 6. Camera grammar

A long-lens (≈ 30° FOV) camera slightly above the object, slowly pushing in and arcing a few degrees across each beat; the object sits in the middle third, under the headline. One beat = one object = 5–8 s. Transitions are the object lifting away while the next one rises, never a hard cut to a different set.

## 7. Sound palette

Soft whoosh on each object change, a tick when the headline box completes, small pops on subtitle words, object foley (paper riffle, motor whirr, a click), a low warm pad underneath. Voice-over carries the film when there is one.

## 8. Native moves

The rise into the light; the selection box drawing around the key phrase; the one mechanical action per object; the closing card with just the headline (e.g. the product or brand name) on black.

## 9. Pitfalls of the medium

Headline and object overlap → pull the camera back and aim higher; the object must start below the box. A visible floor edge → fog and a large floor. Too many accent colours → back to orange + blue. Software WebGL is slow: keep geometry light and shadows at 1024.

## 10. Engine

Three.js (r16x) + a 2D canvas overlay for type. Fonts: Inter and Instrument Serif (OFL, via `demo/tools/fonts.sh`). Render 1080×1920, 30 fps.

## 11. Variation space

Object set and number of beats; accent colour (keep one); light temperature; serif for the key phrase; headline position (top or centre on the end card); light background variant only if the whole film is light.
