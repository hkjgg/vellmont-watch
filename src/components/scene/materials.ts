export type MaterialId = 'silverSteel' | 'deepBlack' | 'pureGold' | 'roseGold'

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

/** Case + bracelet finish — the one thing SWAP cycles. Everything inside the
 *  movement (dial, tourbillon, mainplate, barrel, baseplate, weight) keeps
 *  its own fixed mechanical materials regardless of the exterior finish. */
export const MATERIAL_PRESETS: Record<MaterialId, MaterialPreset> = {
  silverSteel: {
    id: 'silverSteel',
    label: 'Silver Steel',
    swatch: '#c8ccd2',
    color: '#d3d6db',
    metalness: 1,
    roughness: 0.18,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  },
  deepBlack: {
    id: 'deepBlack',
    label: 'Deep Black',
    swatch: '#1c1c1e',
    color: '#232326',
    metalness: 0.85,
    roughness: 0.5,
    clearcoat: 0.15,
    clearcoatRoughness: 0.35,
  },
  pureGold: {
    id: 'pureGold',
    label: 'Pure Gold',
    swatch: '#cda43d',
    color: '#dbb54c',
    metalness: 1,
    roughness: 0.16,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
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

export const MATERIAL_ORDER: MaterialId[] = ['silverSteel', 'deepBlack', 'pureGold', 'roseGold']

/**
 * The six movement components the Horizontal Exploded Assembly separates,
 * matching a real automatic-tourbillon layer stack: dial (front) → tourbillon
 * (the visible complication) → mainplate (structural anchor the movement is
 * built around) → barrel (mainspring) → baseplate (rear structural plate) →
 * weight (the oscillating winding rotor, at the very back).
 */
export type MovementPart = 'dial' | 'tourbillon' | 'mainplate' | 'barrel' | 'baseplate' | 'weight'

export const MOVEMENT_PART_ORDER: MovementPart[] = [
  'weight',
  'baseplate',
  'barrel',
  'mainplate',
  'tourbillon',
  'dial',
]

export const MOVEMENT_PART_LABELS: Record<MovementPart, { title: string; copy: string }> = {
  dial: { title: 'Dial', copy: 'The face — sunburst finish, applied indices set by hand.' },
  tourbillon: { title: 'Tourbillon', copy: 'A rotating cage that cancels gravity’s pull on the escapement.' },
  mainplate: { title: 'Mainplate', copy: 'The structural anchor every other layer is built around.' },
  barrel: { title: 'Barrel', copy: 'Houses the mainspring — the movement’s stored energy.' },
  baseplate: { title: 'Baseplate', copy: 'The rear structural plate, closing the movement from behind.' },
  weight: { title: 'Weight', copy: 'The oscillating rotor that winds the mainspring as you move.' },
}

/** X-axis position (world units) each part fans out to at full explode.
 *  Mainplate is the anchor (0) — everything else spreads from it, matching
 *  MOVEMENT_PART_ORDER's left-to-right reading. */
export const MOVEMENT_EXPLODE_X: Record<MovementPart, number> = {
  weight: -2.0,
  baseplate: -1.2,
  barrel: -0.4,
  mainplate: 0,
  tourbillon: 0.8,
  dial: 1.6,
}

/** Small tumble (radians, Y-axis) each part picks up as it separates, so the
 *  fan reads as parts peeling apart rather than sliding on rails. */
export const MOVEMENT_ROTATE_Y: Record<MovementPart, number> = {
  weight: -0.22,
  baseplate: -0.12,
  barrel: 0.08,
  mainplate: 0,
  tourbillon: 0.14,
  dial: 0.24,
}

/** Where in the shared 0→1 explode progress each part starts moving — the
 *  stack separates from the outside in, mainplate (the anchor) never moving. */
export const MOVEMENT_EXPLODE_STAGGER: Record<MovementPart, number> = {
  mainplate: 0,
  barrel: 0.08,
  tourbillon: 0.08,
  baseplate: 0.22,
  weight: 0.36,
  dial: 0.36,
}
