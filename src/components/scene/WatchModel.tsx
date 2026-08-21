import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useWatchRig, type ScrollState, type WatchRigEntry } from '../../hooks/useWatchRig'
import { useCaseMaterial } from '../../hooks/useCaseMaterial'
import { resolvePartFromName } from './explode'
import type { MaterialId, WatchPart } from './materials'

export const WATCH_GLB_URL = '/models/watch.glb'

interface WatchModelProps {
  scrollState: RefObject<ScrollState>
  activeMaterial: MaterialId
}

/** Case radius (world units) the procedural placeholder and the camera framing in
 *  WatchCanvas.tsx are tuned around — real assets are auto-scaled to match. */
const TARGET_CASE_RADIUS = 1.05

/**
 * Loads the real public/models/watch.glb. Top-level children of the scene are
 * matched to a semantic part (case/dial/strap/movement) by name — see
 * public/models/README.md for the naming contract. Anything unmatched is
 * treated as part of the case and stays anchored (no explode offset).
 *
 * Suspends while loading and throws on a missing/broken file; the caller is
 * expected to wrap this in <Suspense> + an error boundary that falls back to
 * <ProceduralWatch />.
 */
export default function WatchModel({ scrollState, activeMaterial }: WatchModelProps) {
  const gltf = useGLTF(WATCH_GLB_URL)
  const rootRef = useRef<THREE.Group>(null)
  const caseMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([])

  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  const { partGroups, explodeDistance } = useMemo(() => {
    const groups: { object: THREE.Object3D; part: WatchPart }[] = []
    const caseMaterials = new Set<THREE.MeshStandardMaterial>()
    const boundsByPart: Record<WatchPart, THREE.Box3> = {
      case: new THREE.Box3(),
      dial: new THREE.Box3(),
      strap: new THREE.Box3(),
      movement: new THREE.Box3(),
    }
    const sceneBounds = new THREE.Box3()

    for (const child of [...scene.children]) {
      const part: WatchPart = resolvePartFromName(child.name) ?? 'case'
      groups.push({ object: child, part })

      const childBounds = new THREE.Box3().setFromObject(child)
      boundsByPart[part].union(childBounds)
      sceneBounds.union(childBounds)

      if (part === 'case') {
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true
            node.receiveShadow = true
            const material = node.material
            if (material instanceof THREE.MeshStandardMaterial) {
              caseMaterials.add(material)
            }
          }
        })
      } else {
        child.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true
            node.receiveShadow = true
          }
        })
      }
    }

    caseMaterialsRef.current = Array.from(caseMaterials)

    // Real-world exports rarely arrive centered at the origin with a case
    // radius of ~1 (e.g. a full wrist-loop strap can dwarf and offset the
    // bounding box) — so re-center and re-scale the whole scene around a
    // tightly-localized anchor. Centering uses the dial (the watch face
    // itself, dead center by construction) when one was matched, else the
    // case, else the whole scene — a case's bounds can be skewed off-center
    // by unrelated hardware sharing its fallback bucket (e.g. a strap clasp),
    // so dial is preferred when available. Sizing instead takes whichever of
    // dial/case is visually larger, since a chunky bezel can extend well past
    // the dial and would otherwise get cropped by the camera. Explode offsets
    // stay defined in "procedural watch" units (see materials.ts); scaling
    // them by 1/normalizeScale keeps the on-screen explode distance
    // consistent regardless of the source asset's scale.
    const centerBounds = !boundsByPart.dial.isEmpty()
      ? boundsByPart.dial
      : !boundsByPart.case.isEmpty()
        ? boundsByPart.case
        : sceneBounds

    const radiusOf = (box: THREE.Box3) => {
      if (box.isEmpty()) return 0
      const size = box.getSize(new THREE.Vector3())
      return Math.max(size.x, size.y) / 2
    }
    // Deliberately excludes the whole-scene fallback from this max: a
    // wrist-loop strap's bounding box is often taller than the case (it has
    // to reach all the way around an implicit wrist), which would shrink the
    // case far more than intended. Only fall back to it when there's no
    // dial/case radius to use at all.
    const dialOrCaseRadius = Math.max(radiusOf(boundsByPart.dial), radiusOf(boundsByPart.case))
    const sizingRadius = dialOrCaseRadius > 0 ? dialOrCaseRadius : radiusOf(sceneBounds)

    let normalizeScale = 1
    if (!centerBounds.isEmpty()) {
      const center = centerBounds.getCenter(new THREE.Vector3())
      const anchorRadius = sizingRadius
      if (anchorRadius > 0) {
        normalizeScale = TARGET_CASE_RADIUS / anchorRadius
        scene.position.set(-center.x * normalizeScale, -center.y * normalizeScale, -center.z * normalizeScale)
        scene.scale.setScalar(normalizeScale)
      }
    }

    return { partGroups: groups, explodeDistance: 1 / normalizeScale }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  useCaseMaterial(caseMaterialsRef, activeMaterial)

  const entries = useMemo<WatchRigEntry[]>(
    () =>
      partGroups.map(({ object, part }) => ({
        ref: { current: object },
        part,
        nameHint: object.name,
      })),
    [partGroups],
  )

  useWatchRig(rootRef, entries, scrollState, explodeDistance)

  return (
    <group ref={rootRef} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
