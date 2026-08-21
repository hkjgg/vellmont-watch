# watch.glb

Loaded at runtime by `src/components/scene/WatchModel.tsx` via
`useGLTF('/models/watch.glb')`. If this file is missing or fails to load, the
site falls back to a procedural placeholder watch
(`src/components/scene/ProceduralWatch.tsx`) so the Hero/showcase still works
end-to-end.

## Current file — temporary placeholder, replace before shipping

The `watch.glb` currently checked in here is **not** the VELLMONT production
model. It's the Khronos Group's official "Chronograph Watch" glTF sample
asset, used only so the interactive scene has a real, high-quality watch to
preview immediately. It visibly carries Khronos/3D&nbsp;Commerce/DGG branding
on the case and dial — replace it with the real VELLMONT model before this
site ships.

- Source: [glTF-Sample-Assets/Models/ChronographWatch](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/ChronographWatch)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode) —
  © 2025 Darmstadt Graphics Group GmbH, model and textures by Eric Chadwick.
  Originated from "Chronograph Watch Mudmaster" (https://skfb.ly/oAsPA) by
  graphiccompressor, also CC BY 4.0. Includes non-copyrightable Khronos Group
  and 3D Commerce logos, and the copyrightable DGG logo (© 2020 Darmstadt
  Graphics Group GmbH) — see the source repo's `LICENSES/` folder.
- Keep this attribution wherever the asset ships until it's replaced.

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

It's fine if a real export doesn't hit all four categories (the current
placeholder has no `movement` mesh at all, so nothing explodes backward —
it just doesn't happen, no error). `WatchModel.tsx` also auto-recenters and
auto-scales whatever loads: it re-centers on the `dial`-tagged bounds (or
`case`, or the whole scene, in that order of preference) and rescales so
that anchor lands at the same radius the procedural placeholder and camera
framing are tuned around, so the export doesn't have to be pre-centered or
pre-scaled by hand — a full wrist-loop strap, an off-origin pivot, whatever.
Still, the closer the raw export is to Y-up, case near the origin, face
toward +Z, the better the auto-framing will land.
