import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { resolveExplodeOffset, resolveRotateOffset, resolveStaggeredProgress } from '../components/scene/explode'
import type { MovementPart } from '../components/scene/materials'

export interface ScrollState {
  /** Target rotation, radians. */
  rotation: number
  /** Target explode amount, 0 (assembled) → 1 (fully disassembled). */
  explode: number
  /** Target case/crystal/bracelet opacity, 1 (assembled watch) → 0 (bare
   *  movement, for the Horizontal Exploded Assembly). Sections that never
   *  hide the case just leave this at 1. */
  caseOpacity: number
}

export interface WatchRigEntry {
  ref: RefObject<THREE.Object3D | null>
  part: MovementPart
}

interface Baseline {
  position: THREE.Vector3
  rotation: THREE.Euler
}

/**
 * Drives the shared "rotate on scroll, explode into parts on scroll" behaviour
 * for the movement model. Each part's progress through the explode is
 * staggered (see MOVEMENT_EXPLODE_STAGGER) so the stack separates outside-in
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

      const progress = resolveStaggeredProgress(explodeDamped.current, entry.part)

      const dir = resolveExplodeOffset(entry.part)
      obj.position.set(
        base.position.x + dir.x * explodeDistance * progress,
        base.position.y + dir.y * explodeDistance * progress,
        base.position.z + dir.z * explodeDistance * progress,
      )

      const tumble = resolveRotateOffset(entry.part)
      obj.rotation.set(
        base.rotation.x + tumble.x * progress,
        base.rotation.y + tumble.y * progress,
        base.rotation.z + tumble.z * progress,
      )
    }
  })
}
