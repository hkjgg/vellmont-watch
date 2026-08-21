import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useWatchRig, type WatchRigEntry } from '../../hooks/useWatchRig'
import { useCaseMaterial } from '../../hooks/useCaseMaterial'
import { MATERIAL_PRESETS, type MaterialId } from './materials'
import type { ScrollState } from '../../hooks/useWatchRig'
import { type RefObject } from 'react'

interface ProceduralWatchProps {
  scrollState: RefObject<ScrollState>
  activeMaterial: MaterialId
}

const HOUR_MARKERS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2)

/**
 * Stylized placeholder watch, hand-built from primitives so the showcase works
 * before a real public/models/watch.glb is dropped in. Uses the same part
 * naming contract (case / dial / strap / movement) as the real asset — see
 * public/models/README.md — so swapping in the real model is a drop-in change.
 */
export default function ProceduralWatch({ scrollState, activeMaterial }: ProceduralWatchProps) {
  const rootRef = useRef<THREE.Group>(null)
  const caseRef = useRef<THREE.Group>(null)
  const dialRef = useRef<THREE.Group>(null)
  const movementRef = useRef<THREE.Group>(null)
  const strapTopRef = useRef<THREE.Group>(null)
  const strapBottomRef = useRef<THREE.Group>(null)

  const caseMaterial = useMemo(() => {
    const preset = MATERIAL_PRESETS[activeMaterial]
    return new THREE.MeshPhysicalMaterial({
      color: preset.color,
      metalness: preset.metalness,
      roughness: preset.roughness,
      clearcoat: preset.clearcoat,
      clearcoatRoughness: preset.clearcoatRoughness,
      envMapIntensity: 1.3,
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
      }),
    [],
  )

  const dialMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#1c1c1c', metalness: 0.4, roughness: 0.45, clearcoat: 0.3 }),
    [],
  )

  const handMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e8e2d6', metalness: 0.6, roughness: 0.3 }),
    [],
  )

  const movementMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b8874a', metalness: 0.9, roughness: 0.35 }),
    [],
  )

  const strapMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#14100d', metalness: 0.05, roughness: 0.85 }),
    [],
  )

  const caseMaterialsRef = useRef([caseMaterial])
  useCaseMaterial(caseMaterialsRef, activeMaterial)

  const entries = useMemo<WatchRigEntry[]>(
    () => [
      { ref: caseRef, part: 'case' },
      { ref: dialRef, part: 'dial' },
      { ref: movementRef, part: 'movement' },
      { ref: strapTopRef, part: 'strap', nameHint: 'strap-top' },
      { ref: strapBottomRef, part: 'strap', nameHint: 'strap-bottom' },
    ],
    [],
  )

  useWatchRig(rootRef, entries, scrollState, 1)

  return (
    <group ref={rootRef} dispose={null}>
      {/* CASE — body, bezel, crown, lugs, crystal */}
      <group ref={caseRef} name="Case">
        <mesh castShadow receiveShadow material={caseMaterial}>
          <cylinderGeometry args={[1.05, 1.05, 0.34, 64]} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.17]} material={caseMaterial}>
          <torusGeometry args={[1.0, 0.055, 24, 64]} />
        </mesh>
        {/* crown */}
        <mesh castShadow position={[1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={caseMaterial}>
          <cylinderGeometry args={[0.09, 0.09, 0.2, 24]} />
        </mesh>
        {/* lugs (top/bottom strap anchors) */}
        <mesh castShadow position={[0, 1.05, 0]} material={caseMaterial}>
          <boxGeometry args={[0.5, 0.16, 0.14]} />
        </mesh>
        <mesh castShadow position={[0, -1.05, 0]} material={caseMaterial}>
          <boxGeometry args={[0.5, 0.16, 0.14]} />
        </mesh>
        {/* crystal — sphereGeometry's cap parameterizes around +Y by default, so
            rotate it onto +Z to bulge toward the camera, over the dial. */}
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
          <sphereGeometry args={[1.0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        </mesh>
      </group>

      {/* DIAL — face, hour markers, hands */}
      <group ref={dialRef} name="Dial" position={[0, 0, 0.1]}>
        <mesh receiveShadow material={dialMaterial}>
          <cylinderGeometry args={[0.92, 0.92, 0.03, 64]} />
        </mesh>
        {HOUR_MARKERS.map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.75, Math.cos(angle) * 0.75, 0.02]}
            rotation={[0, 0, -angle]}
            material={handMaterial}
          >
            <boxGeometry args={[0.035, i % 3 === 0 ? 0.14 : 0.08, 0.02]} />
          </mesh>
        ))}
        <mesh position={[0, 0.18, 0.035]} rotation={[0, 0, -0.5]} material={handMaterial}>
          <boxGeometry args={[0.035, 0.55, 0.015]} />
        </mesh>
        <mesh position={[0.14, -0.1, 0.045]} rotation={[0, 0, 2.1]} material={handMaterial}>
          <boxGeometry args={[0.03, 0.38, 0.015]} />
        </mesh>
        <mesh position={[0, 0, 0.05]} material={handMaterial}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        </mesh>
      </group>

      {/* MOVEMENT — mechanism plate behind the dial */}
      <group ref={movementRef} name="Movement" position={[0, 0, -0.05]}>
        <mesh castShadow receiveShadow material={movementMaterial}>
          <cylinderGeometry args={[0.85, 0.85, 0.1, 48]} />
        </mesh>
        <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]} material={movementMaterial}>
          <torusGeometry args={[0.55, 0.04, 16, 48]} />
        </mesh>
        {[0.3, -0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.25, 0.08]} material={movementMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
          </mesh>
        ))}
      </group>

      {/* STRAP — top and bottom lug bands, explode in opposite directions */}
      <group ref={strapTopRef} name="Strap Top" position={[0, 1.1, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.35, 0]} material={strapMaterial}>
          <boxGeometry args={[0.46, 0.7, 0.12]} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.0, 0]} material={strapMaterial}>
          <boxGeometry args={[0.42, 0.65, 0.11]} />
        </mesh>
      </group>
      <group ref={strapBottomRef} name="Strap Bottom" position={[0, -1.1, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.35, 0]} material={strapMaterial}>
          <boxGeometry args={[0.46, 0.7, 0.12]} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -1.0, 0]} material={strapMaterial}>
          <boxGeometry args={[0.42, 0.65, 0.11]} />
        </mesh>
      </group>
    </group>
  )
}
