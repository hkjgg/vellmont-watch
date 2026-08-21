# public/assets

Ambient video and macro photography for the "Inside the Atelier" section
(`src/components/MediaShowcase.tsx`). Every file here is a **placeholder** —
a dark diagonal-stripe pattern, deliberately obvious so nobody mistakes it
for finished art — sized and named to be swapped for real media by simply
overwriting the file. No code changes needed on swap; every path below is
already wired up in `MediaShowcase.tsx`.

If a file here goes missing or fails to load, the components fall back
further, to a CSS-only gradient (`AmbientVideo`) or a per-part material
gradient (`MacroCard`) — see `src/index.css` (`.ambient-fallback`,
`.macro-fallback--*`) — so the section never shows a broken image.

## `public/assets/macro/` — component close-ups (`MacroCard`)

Portrait, 4:5 aspect (currently 640×800 placeholders):

| File          | Part      |
| -------------- | --------- |
| `case.jpg`     | Case      |
| `dial.jpg`     | Dial      |
| `movement.jpg` | Movement  |
| `strap.jpg`    | Strap     |

Same case/dial/movement/strap vocabulary as the 3D exploded assembly (see
`src/components/scene/materials.ts`) — the watch itself is procedural
(`src/components/scene/MovementModel.tsx`), not a loaded model file, so
there's no `public/models/` directory to cross-reference anymore.

## `public/assets/ambient/` — cinematic video panels (`AmbientVideo`)

16:10 aspect (960×600 placeholders). Keep clips short and loop-friendly
(5–15s, first/last frame close enough to cut cleanly), muted (they autoplay
muted+looped) and modest in size (a few MB) since they load eagerly with the
section. An .mp4/H.264 is the safest baseline for autoplay across browsers.

| File                       | Used for              | Status                |
| --------------------------- | ---------------------- | --------------------- |
| `atelier.mp4`                | "The Workshop" panel   | placeholder present   |
| `atelier-poster.jpg`         | its poster frame       | placeholder present   |
| `on-the-wrist.mp4`           | "On the Wrist" panel   | placeholder present   |
| `on-the-wrist-poster.jpg`    | its poster frame       | placeholder present   |

The two `.mp4` placeholders are procedurally generated (ffmpeg `geq`, no
external footage) — an 8s, exact-loop diagonal-stripe pattern at 960×600,
~95KB each, matching the same "deliberately obvious" placeholder language as
the macro stills above. Drop real footage in at those two paths and the
panels switch from the CSS gradient fallback to actual video, no other
changes required.
