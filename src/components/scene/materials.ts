export type MaterialId = 'silver' | 'matteBlack' | 'roseGold'

export interface MaterialPreset {
  id: MaterialId
  label: string
  swatch: string
  color: string
  metalness: number
  roughness: number
  clearcoat: number
  clearcoatRoughness: number
}

export const MATERIAL_PRESETS: Record<MaterialId, MaterialPreset> = {
  silver: {
    id: 'silver',
    label: 'Silver',
    swatch: '#c8ccd2',
    color: '#d3d6db',
    metalness: 1,
    roughness: 0.18,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  },
  matteBlack: {
    id: 'matteBlack',
    label: 'Matte Black',
    swatch: '#1c1c1e',
    color: '#26262a',
    metalness: 0.85,
    roughness: 0.55,
    clearcoat: 0.1,
    clearcoatRoughness: 0.4,
  },
  roseGold: {
    id: 'roseGold',
    label: 'Rose Gold',
    swatch: '#b8815f',
    color: '#c8896a',
    metalness: 1,
    roughness: 0.22,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
}

export const MATERIAL_ORDER: MaterialId[] = ['silver', 'matteBlack', 'roseGold']

/**
 * Named parts a watch.glb should expose (case-insensitive substring match against
 * node names) so the exploded scroll view and material switcher can target them.
 * The procedural fallback watch uses these exact names.
 */
export type WatchPart = 'case' | 'dial' | 'strap' | 'movement'

export const WATCH_PART_KEYWORDS: Record<WatchPart, string[]> = {
  case: ['case', 'bezel', 'crown', 'crystal', 'body'],
  dial: ['dial', 'face', 'hand'],
  strap: ['strap', 'band', 'bracelet'],
  movement: ['movement', 'gear', 'rotor', 'mechanism'],
}

/** Outward explode direction (local space, unit-ish) and distance per part. */
export const EXPLODE_OFFSETS: Record<WatchPart, [number, number, number]> = {
  case: [0, 0, 0],
  dial: [0, 0, 0.55],
  strap: [0, 0.6, 0],
  movement: [0, 0, -0.65],
}
