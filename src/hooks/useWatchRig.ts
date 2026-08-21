import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { resolveExplodeOffset, resolveRotateOffset, resolveStaggeredProgress } from '../components/scene/explode'
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

interface Baseline {
  position: THREE.Vector3
  rotation: THREE.Euler
}

/**
 * Drives the shared "rotate on scroll, explode into parts on scroll" behaviour
 * for both the procedural placeholder watch and any real loaded watch.glb —
 * both feed this the same shape of data (a root group + a list of named parts).
 *
 * Each part's progress through the explode is staggered (see EXPLODE_STAGGER)
 * so the teardown reads as a sequence — dial first, movement, then strap —
 * rather than every part launching at once, and each part picks up a small
 * tumble as it moves so it reads as peeling apart rather than sliding on rails.
 */
export function useWatchRig(
  rootRef: RefObject<THREE.Group | null>,
  entries: WatchRigEntry[],
  scrollState: RefObject<ScrollState>,
  explodeDistance = 1,
) {
  const baseline = useRef(new WeakMap<THREE.Object3D, Baseline>())
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
        base = { position: obj.position.clone(), rotation: obj.rotation.clone() }
        baseline.current.set(obj, base)
      }

      const name = entry.nameHint ?? obj.name
      const progress = resolveStaggeredProgress(explodeDamped.current, entry.part)

      const dir = resolveExplodeOffset(name, entry.part)
      obj.position.set(
        base.position.x + dir.x * explodeDistance * progress,
        base.position.y + dir.y * explodeDistance * progress,
        base.position.z + dir.z * explodeDistance * progress,
      )

      const tumble = resolveRotateOffset(name, entry.part)
      obj.rotation.set(
        base.rotation.x + tumble.x * progress,
        base.rotation.y + tumble.y * progress,
        base.rotation.z + tumble.z * progress,
      )
    }
  })
}
