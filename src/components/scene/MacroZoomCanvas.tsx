import { Suspense, useRef, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import MovementModel from './MovementModel'
import StudioLighting from './StudioLighting'
import type { ScrollState } from '../../hooks/useWatchRig'
import type { MaterialId } from './materials'

export interface MacroStage {
  label: string
  copy: string
  position: THREE.Vector3
  lookAt: THREE.Vector3
  fov: number
}

export const MACRO_STAGES: MacroStage[] = [
  {
    label: 'Elegant Contours',
    copy: 'Every curve considered, dial to bezel.',
    position: new THREE.Vector3(0.15, 0.35, 1.7),
    lookAt: new THREE.Vector3(0, 0.05, 0.1),
    fov: 22,
  },
  {
    label: 'Slim Profile',
    copy: 'A case thin enough to disappear on the wrist.',
    position: new THREE.Vector3(2.1, 0.05, 0.2),
    lookAt: new THREE.Vector3(0, 0, 0),
    fov: 20,
  },
  {
    label: 'Bracelet',
    copy: 'Links finished to match the case, link for link.',
    position: new THREE.Vector3(0.1, 1.5, 1.4),
    lookAt: new THREE.Vector3(0, 1.05, 0),
    fov: 24,
  },
]

interface MacroZoomCanvasProps {
  activeMaterial: MaterialId
  progressRef: RefObject<{ value: number }>
}

/** Choreographs the camera smoothly through MACRO_STAGES based on a 0→1
 *  scroll-progress ref — dial → case profile → bracelet — rather than
 *  moving the watch itself. */
function CameraRig({ progressRef }: { progressRef: RefObject<{ value: number }> }) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const posDamped = useRef(MACRO_STAGES[0].position.clone())
  const lookDamped = useRef(MACRO_STAGES[0].lookAt.clone())
  const fovDamped = useRef(MACRO_STAGES[0].fov)

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current.value, 0, 1)
    const segCount = MACRO_STAGES.length
    const scaled = p * (segCount - 1)
    const idx = Math.min(segCount - 2, Math.floor(scaled))
    const localT = scaled - idx
    const eased = localT * localT * (3 - 2 * localT)

    const a = MACRO_STAGES[idx]
    const b = MACRO_STAGES[idx + 1]
    const targetPos = new THREE.Vector3().lerpVectors(a.position, b.position, eased)
    const targetLook = new THREE.Vector3().lerpVectors(a.lookAt, b.lookAt, eased)
    const targetFov = THREE.MathUtils.lerp(a.fov, b.fov, eased)

    const alpha = 1 - Math.exp(-5 * delta)
    posDamped.current.lerp(targetPos, alpha)
    lookDamped.current.lerp(targetLook, alpha)
    fovDamped.current = THREE.MathUtils.lerp(fovDamped.current, targetFov, alpha)

    camera.position.copy(posDamped.current)
    camera.lookAt(lookDamped.current)
    camera.fov = fovDamped.current
    camera.updateProjectionMatrix()
  })

  return null
}

export default function MacroZoomCanvas({ activeMaterial, progressRef }: MacroZoomCanvasProps) {
  const scrollState = useRef<ScrollState>({ rotation: 0.6, explode: 0, caseOpacity: 1 })

  return (
    <Canvas shadows="soft" dpr={[1, 2]} gl={{ antialias: true, toneMappingExposure: 1.05 }}>
      <CameraRig progressRef={progressRef} />
      <Suspense fallback={null}>
        <StudioLighting mood="dark" />
        <MovementModel scrollState={scrollState} activeMaterial={activeMaterial} />
      </Suspense>
    </Canvas>
  )
}
