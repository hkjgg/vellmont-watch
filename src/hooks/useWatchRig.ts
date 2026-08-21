import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { resolveExplodeOffset } from '../components/scene/explode'
import type { WatchPart } from '../components/scene/materials'

export interface ScrollState {
  /** Target rotation, radians. */
  rotation: number
  /** Target explode amount, 0 (assembled) → 1 (fully disassembled). */
  explode: number
}

export interface WatchRigEntry {
  ref: RefObject<THREE.Object3D | null>
  part: WatchPart
  /** Used only to disambiguate opposing offsets, e.g. the two strap halves. */
  nameHint?: string
}

/**
 * Drives the shared "rotate on scroll, explode into parts on scroll" behaviour
 * for both the procedural placeholder watch and any real loaded watch.glb —
 * both feed this the same shape of data (a root group + a list of named parts).
 */
export function useWatchRig(
  rootRef: RefObject<THREE.Group | null>,
  entries: WatchRigEntry[],
  scrollState: RefObject<ScrollState>,
  explodeDistance = 1,
) {
  const baseline = useRef(new WeakMap<THREE.Object3D, THREE.Vector3>())
  const rotationDamped = useRef(0)
  const explodeDamped = useRef(0)

  useFrame((_, delta) => {
    const target = scrollState.current
    rotationDamped.current = THREE.MathUtils.damp(rotationDamped.current, target.rotation, 4, delta)
    explodeDamped.current = THREE.MathUtils.damp(explodeDamped.current, target.explode, 6, delta)

    if (rootRef.current) {
      rootRef.current.rotation.y = rotationDamped.current
    }

    for (const entry of entries) {
      const obj = entry.ref.current
      if (!obj) continue

      let base = baseline.current.get(obj)
      if (!base) {
        base = obj.position.clone()
        baseline.current.set(obj, base)
      }

      const dir = resolveExplodeOffset(entry.nameHint ?? obj.name, entry.part)
      obj.position.set(
        base.x + dir.x * explodeDistance * explodeDamped.current,
        base.y + dir.y * explodeDistance * explodeDamped.current,
        base.z + dir.z * explodeDistance * explodeDamped.current,
      )
    }
  })
}
