# watch.glb

Drop the production watch model here as `watch.glb`. It's loaded at runtime by
`src/components/scene/WatchModel.tsx` via `useGLTF('/models/watch.glb')`.

Until this file exists (or if it fails to load), the site falls back to a
procedural placeholder watch (`src/components/scene/ProceduralWatch.tsx`) so
the Hero/showcase still works end-to-end.

## Node naming contract

The scroll-driven rotate + exploded-view animation and the material switcher
(Silver / Matte Black / Rose Gold) target the **top-level children** of the
glTF scene by name (case-insensitive substring match, see
`src/components/scene/materials.ts` → `WATCH_PART_KEYWORDS`):

| Part       | Match keywords                          | Behavior                                  |
| ---------- | ---------------------------------------- | ------------------------------------------ |
| `case`     | case, bezel, crown, crystal, body        | Stays anchored; gets the metal finish swap |
| `dial`     | dial, face, hand                         | Explodes forward (+Z)                      |
| `movement` | movement, gear, rotor, mechanism         | Explodes backward (−Z)                     |
| `strap`    | strap, band, bracelet                    | Explodes vertically; include "top"/"bottom" in the node's own name to split the two halves apart |

Any top-level node that doesn't match a keyword is treated as part of the
`case` and stays put. Only materials found on `case`-tagged meshes are
swapped by the finish buttons — keep the case/bezel/crown on their own
material(s) so the swap doesn't also recolor the dial or strap.

Export as glTF Binary (.glb), Y-up, with the case centered near the origin
and its face roughly toward +Z, sized so the case radius is ~1 world unit
(matches the placeholder's scale and the camera framing in `WatchCanvas.tsx`).
