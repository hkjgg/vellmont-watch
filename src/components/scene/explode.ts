import * as THREE from 'three'
import { EXPLODE_OFFSETS, WATCH_PART_KEYWORDS, type WatchPart } from './materials'

export function resolvePartFromName(name: string): WatchPart | null {
  const lower = name.toLowerCase()
  for (const part of Object.keys(WATCH_PART_KEYWORDS) as WatchPart[]) {
    if (WATCH_PART_KEYWORDS[part].some((keyword) => lower.includes(keyword))) {
      return part
    }
  }
  return null
}

/**
 * Direction a named node should fly apart along, in local model space.
 * The strap keyword matches both the top and bottom lug bands; a "top"/"bottom"
 * hint in the node's own name flips the sign so the two halves separate rather
 * than stacking on top of one another.
 */
export function resolveExplodeOffset(name: string, part: WatchPart): THREE.Vector3 {
  const base = EXPLODE_OFFSETS[part]
  const offset = new THREE.Vector3(base[0], base[1], base[2])

  if (part === 'strap') {
    const lower = name.toLowerCase()
    if (lower.includes('bottom') || lower.includes('6')) {
      offset.y *= -1
    }
  }

  return offset
}
