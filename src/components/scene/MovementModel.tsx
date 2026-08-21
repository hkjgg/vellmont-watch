import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useWatchRig, type ScrollState, type WatchRigEntry } from '../../hooks/useWatchRig'
import { useCaseMaterial } from '../../hooks/useCaseMaterial'
import { MATERIAL_PRESETS, type MaterialId } from './materials'
import { type RefObject } from 'react'

interface MovementModelProps {
  /** rotation/explode drive the rig as before; caseOpacity (1 = full case,
   *  crystal, and bracelet visible; 0 = bare movement) drives whether the
   *  case is shown — read every frame like the rest, not a React prop, so
   *  animating it doesn't cost a re-render. */
  scrollState: RefObject<ScrollState>
  activeMaterial: MaterialId
  /** Independent of the scroll-driven explode rig — the tourbillon cage and
   *  winding weight are always turning, "MECHANICAL HEART" living even when
   *  the watch is fully assembled. */
  animated?: boolean
}

const HOUR_MARKERS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2)
const JEWEL_POSITIONS: [number, number][] = [
  [0.32, 0.55],
  [-0.5, 0.28],
  [0.48, -0.32],
  [-0.25, -0.55],
  [0.05, 0.68],
]

export default function MovementModel({ scrollState, activeMaterial, animated = true }: MovementModelProps) {
  const rootRef = useRef<THREE.Group>(null)
  const caseRef = useRef<THREE.Group>(null)
  const dialRef = useRef<THREE.Group>(null)
  const tourbillonRef = useRef<THREE.Group>(null)
  const tourbillonCageRef = useRef<THREE.Group>(null)
  const mainplateRef = useRef<THREE.Group>(null)
  const barrelRef = useRef<THREE.Group>(null)
  const baseplateRef = useRef<THREE.Group>(null)
  const weightRef = useRef<THREE.Group>(null)

  const caseMaterial = useMemo(() => {
    const preset = MATERIAL_PRESETS[activeMaterial]
    return new THREE.MeshPhysicalMaterial({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      clearcoat: preset.clearcoat,
      clearcoatRoughness: preset.clearcoatRoughness,
      envMapIntensity: 1.3,
      transparent: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0,
        roughness: 0.02,
        transmission: 1,
        thickness: 0.15,
        ior: 1.5,
        clearcoat: 1,
        envMapIntensity: 1.5,
        transparent: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const dialMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#0a0e14', metalness: 0.4, roughness: 0.4, clearcoat: 0.3 }),
    [],
  )
  const handMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e8e2d6', metalness: 0.6, roughness: 0.3 }),
    [],
  )
  const mainplateMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#5a5650', metalness: 0.9, roughness: 0.35 }),
    [],
  )
  const barrelMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8a6a35', metalness: 0.85, roughness: 0.3 }),
    [],
  )
  const baseplateMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#46443f', metalness: 0.85, roughness: 0.4 }),
    [],
  )
  const weightMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#38383b', metalness: 1, roughness: 0.28 }),
    [],
  )
  const tourbillonMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#16223f', metalness: 1, roughness: 0.18 }),
    [],
  )
  const jewelMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b31f39', metalness: 0.2, roughness: 0.1 }),
    [],
  )

  const caseMaterialsRef = useRef([caseMaterial])
  useCaseMaterial(caseMaterialsRef, activeMaterial)

  const entries = useMemo<WatchRigEntry[]>(
    () => [
      { ref: dialRef, part: 'dial' },
      { ref: tourbillonRef, part: 'tourbillon' },
      { ref: mainplateRef, part: 'mainplate' },
      { ref: barrelRef, part: 'barrel' },
      { ref: baseplateRef, part: 'baseplate' },
      { ref: weightRef, part: 'weight' },
    ],
    [],
  )

  useWatchRig(rootRef, entries, scrollState, 1)

  const caseOpacityDamped = useRef(1)
  useFrame((_, delta) => {
    if (animated) {
      if (tourbillonCageRef.current) tourbillonCageRef.current.rotation.z += delta * 1.4
      if (weightRef.current) weightRef.current.rotation.z += delta * 0.35
    }

    caseOpacityDamped.current = THREE.MathUtils.damp(
      caseOpacityDamped.current,
      scrollState.current.caseOpacity,
      6,
      delta,
    )
    caseMaterial.opacity = caseOpacityDamped.current
    glassMaterial.opacity = caseOpacityDamped.current
    if (caseRef.current) caseRef.current.visible = caseOpacityDamped.current > 0.01
  })

  return (
    <group ref={rootRef} dispose={null}>
      {/* CASE — body, bezel, crown, crystal, bracelet. Fades out to reveal the
          bare movement for the Horizontal Exploded Assembly. */}
      <group ref={caseRef} name="Case">
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} material={caseMaterial}>
          <cylinderGeometry args={[1.05, 1.05, 0.3, 64]} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]} material={caseMaterial}>
          <torusGeometry args={[1.0, 0.05, 24, 64]} />
        </mesh>
        <mesh castShadow position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={caseMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.18, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
          <sphereGeometry args={[1.0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        </mesh>
        {/* integrated bracelet — links in the swappable case finish, not leather.
            Kept short (a couple of links per side) rather than a full unfolded
            band, so it stays a proportionate accent instead of doubling the
            model's framed height. */}
        {[1, -1].map((side) => (
          <group key={side} position={[0, side * 1.05, 0]}>
            {[0, 1].map((i) => (
              <mesh key={i} castShadow position={[0, side * (0.26 + i * 0.28), 0]} material={caseMaterial}>
                <boxGeometry args={[0.42, 0.24, 0.13]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* DIAL */}
      <group ref={dialRef} name="Dial" position={[0, 0, 0.08]}>
        <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} material={dialMaterial}>
          <cylinderGeometry args={[0.92, 0.92, 0.03, 64]} />
        </mesh>
        {HOUR_MARKERS.map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.75, Math.cos(angle) * 0.75, 0.02]}
            rotation={[0, 0, -angle]}
            material={handMaterial}
          >
            <boxGeometry args={[0.03, i % 3 === 0 ? 0.13 : 0.07, 0.02]} />
          </mesh>
        ))}
        <mesh position={[0, 0.18, 0.035]} rotation={[0, 0, -0.5]} material={handMaterial}>
          <boxGeometry args={[0.03, 0.5, 0.015]} />
        </mesh>
        <mesh position={[0.13, -0.1, 0.045]} rotation={[0, 0, 2.1]} material={handMaterial}>
          <boxGeometry args={[0.026, 0.35, 0.015]} />
        </mesh>
        <mesh position={[0, 0, 0.05]} material={handMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        </mesh>
      </group>

      {/* TOURBILLON — a small rotating cage, visible through an aperture near
          6 o'clock, always turning independent of the explode state. */}
      <group ref={tourbillonRef} name="Tourbillon" position={[0, -0.55, 0.12]}>
        <group ref={tourbillonCageRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={tourbillonMaterial}>
            <torusGeometry args={[0.19, 0.014, 12, 32]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={tourbillonMaterial}>
            <boxGeometry args={[0.012, 0.4, 0.012]} />
          </mesh>
          <mesh material={tourbillonMaterial}>
            <boxGeometry args={[0.4, 0.012, 0.012]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={tourbillonMaterial}>
            <torusGeometry args={[0.1, 0.01, 8, 24]} />
          </mesh>
          <mesh material={handMaterial}>
            <sphereGeometry args={[0.02, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* MAINPLATE — the structural anchor, with a scatter of jewel bearings */}
      <group ref={mainplateRef} name="Mainplate" position={[0, 0, -0.02]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} material={mainplateMaterial}>
          <cylinderGeometry args={[0.85, 0.85, 0.06, 48]} />
        </mesh>
        {JEWEL_POSITIONS.map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.04]} material={jewelMaterial}>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
          </mesh>
        ))}
      </group>

      {/* BARREL — the mainspring housing, offset like a real movement layout */}
      <group ref={barrelRef} name="Barrel" position={[0.3, 0.25, 0.02]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} material={barrelMaterial}>
          <cylinderGeometry args={[0.24, 0.24, 0.1, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} material={barrelMaterial}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
        </mesh>
      </group>

      {/* BASEPLATE — the rear structural plate */}
      <group ref={baseplateRef} name="Baseplate" position={[0, 0, -0.08]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} material={baseplateMaterial}>
          <cylinderGeometry args={[0.9, 0.9, 0.05, 48]} />
        </mesh>
      </group>

      {/* WEIGHT — the oscillating winding rotor, a partial disc like a real
          automatic rotor, slowly turning at the back of the movement. */}
      <group ref={weightRef} name="Weight" position={[0, 0, -0.14]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]} material={weightMaterial}>
          <cylinderGeometry args={[0.82, 0.82, 0.045, 48, 1, false, 0, Math.PI * 1.35]} />
        </mesh>
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={weightMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
        </mesh>
      </group>
    </group>
  )
}
