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

  const partGroups = useMemo(() => {
    const groups: { object: THREE.Object3D; part: WatchPart }[] = []
    const caseMaterials = new Set<THREE.MeshStandardMaterial>()

    for (const child of [...scene.children]) {
      const part: WatchPart = resolvePartFromName(child.name) ?? 'case'
      groups.push({ object: child, part })

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
    return groups
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

  useWatchRig(rootRef, entries, scrollState, 1)

  return (
    <group ref={rootRef} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
