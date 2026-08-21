import * as THREE from 'three'
import { MOVEMENT_EXPLODE_STAGGER, MOVEMENT_EXPLODE_X, MOVEMENT_ROTATE_Y, type MovementPart } from './materials'

/** Direction + distance a movement part fans out to along X at full explode. */
export function resolveExplodeOffset(part: MovementPart): THREE.Vector3 {
  return new THREE.Vector3(MOVEMENT_EXPLODE_X[part], 0, 0)
}

/** Tumble (radians) a movement part picks up as it separates. */
export function resolveRotateOffset(part: MovementPart): THREE.Vector3 {
  return new THREE.Vector3(0, MOVEMENT_ROTATE_Y[part], 0)
}

/**
 * Remaps the shared 0→1 explode driver into a part-local 0→1 progress, offset
 * by that part's stagger so the stack separates outside-in but every part
 * still finishes exactly at explode=1.
 */
export function resolveStaggeredProgress(explode: number, part: MovementPart): number {
  const start = MOVEMENT_EXPLODE_STAGGER[part]
  if (start <= 0) return explode
  return THREE.MathUtils.clamp((explode - start) / (1 - start), 0, 1)
}
