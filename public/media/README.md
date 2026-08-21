# public/media

Ambient video and macro photography for the "Inside the Atelier" section
(`src/components/MediaShowcase.tsx`). Nothing needs to exist here — every
component falls back to a CSS-only placeholder (a moody gradient wash for
video, a per-part material gradient for macro shots) when its file is
missing or fails to load, same pattern as `public/models/watch.glb`. Drop a
file in at the path below and it lights up automatically, no code changes.

## Ambient video (`AmbientVideo`)

| Path                             | Used for                    |
| --------------------------------- | ---------------------------- |
| `/media/atelier.mp4`              | "The Workshop" panel         |
| `/media/atelier-poster.jpg`       | poster frame while it loads  |
| `/media/on-the-wrist.mp4`         | "On the Wrist" panel         |
| `/media/on-the-wrist-poster.jpg`  | poster frame while it loads  |

Keep clips short and loop-friendly (5–15s, first/last frame close enough to
cut cleanly), muted (they autoplay muted+looped), and roughly 16:10 —
`object-cover` crops anything else. An .mp4/H.264 is the safest baseline for
autoplay across browsers; keep individual files modest (a few MB) since
they load eagerly with the section.

## Macro photography (`MacroCard`, in `MediaShowcase.tsx`'s `MACRO_PARTS`)

| Path                        | Part      |
| ---------------------------- | --------- |
| `/media/macro-case.jpg`      | Case      |
| `/media/macro-dial.jpg`      | Dial      |
| `/media/macro-movement.jpg`  | Movement  |
| `/media/macro-strap.jpg`     | Strap     |

Portrait-ish (the cards render at 4:5) close-up shots, one per component —
matches the same case/dial/movement/strap vocabulary as the 3D exploded
view (see `public/models/README.md`).
