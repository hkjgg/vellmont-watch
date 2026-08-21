# public/models

`watch.glb` — a sample chronograph watch model, used as placeholder/reference
geometry only. It is **not currently loaded anywhere** in this app: the 3D
scene (`src/components/scene/MovementModel.tsx`) builds its own six-part
watch procedurally out of primitive Three.js geometry rather than loading a
GLTF/GLB file, so this asset sits unused unless a `useGLTF`/`GLTFLoader`
path is added back to reference it.

Source: Khronos Group's [glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)
repository — "Chronograph Watch Mudmaster." Original asset by
graphiccompressor (Sketchfab: https://skfb.ly/oAsPA), © 2025 Darmstadt
Graphics Group GmbH, licensed
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/), adapted by Eric
Chadwick. The attribution string above is also embedded in the file's own
`asset.copyright` field.
