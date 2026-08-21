import * as THREE from 'three'
import { EXPLODE_OFFSETS, EXPLODE_STAGGER, ROTATE_OFFSETS, WATCH_PART_KEYWORDS, type WatchPart } from './materials'

export function resolvePartFromName(name: string): WatchPart | null {
  const lower = name.toLowerCase()
  for (const part of Object.keys(WATCH_PART_KEYWORDS) as WatchPart[]) {
    if (WATCH_PART_KEYWORDS[part].some((keyword) => lower.includes(keyword))) {
      return part
    }
  }
  return null
}

/** The strap keyword matches both lug bands; a "top"/"bottom" hint in the node's
 *  own name flips their sign so the two halves hinge apart instead of moving
 *  in parallel (or stacking on one another, for a symmetric offset like [0,0,0]). */
function strapSign(name: string): 1 | -1 {
  const lower = name.toLowerCase()
  return lower.includes('bottom') || lower.includes('6') ? -1 : 1
}

/** Direction a named node should fly apart along, in local model space. */
export function resolveExplodeOffset(name: string, part: WatchPart): THREE.Vector3 {
  const base = EXPLODE_OFFSETS[part]
  const offset = new THREE.Vector3(base[0], base[1], base[2])
  if (part === 'strap') offset.y *= strapSign(name)
  return offset
}

/** Tumble (radians) a named node picks up as it explodes, in local model space. */
export function resolveRotateOffset(name: string, part: WatchPart): THREE.Vector3 {
  const base = ROTATE_OFFSETS[part]
  const offset = new THREE.Vector3(base[0], base[1], base[2])
  if (part === 'strap') offset.x *= strapSign(name)
  return offset
}

/**
 * Remaps the shared 0→1 explode driver into a part-local 0→1 progress, offset
 * by that part's stagger so parts start moving at different points in the
 * scroll but all still finish exactly at explode=1.
 */
export function resolveStaggeredProgress(explode: number, part: WatchPart): number {
  const start = EXPLODE_STAGGER[part]
  if (start <= 0) return explode
  return THREE.MathUtils.clamp((explode - start) / (1 - start), 0, 1)
}
