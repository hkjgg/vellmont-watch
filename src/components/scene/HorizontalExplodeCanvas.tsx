import { Suspense, useEffect, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import MovementModel from './MovementModel'
import StudioLighting from './StudioLighting'
import type { ScrollState } from '../../hooks/useWatchRig'
import type { MaterialId } from './materials'

interface HorizontalExplodeCanvasProps {
  scrollState: RefObject<ScrollState>
  activeMaterial: MaterialId
}

/** Pulls the camera back as the layer stack fans out wide, so the fully
 *  exploded assembly (~3.6 world units across) doesn't spill off-frame. */
function CameraRig({ scrollState }: { scrollState: RefObject<ScrollState> }) {
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((_, delta) => {
    const targetZ = THREE.MathUtils.lerp(5.6, 8.4, scrollState.current.explode)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 5, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HorizontalExplodeCanvas({ scrollState, activeMaterial }: HorizontalExplodeCanvasProps) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 5.6], fov: 32 }}
      gl={{ antialias: true, toneMappingExposure: 1.1 }}
    >
      <CameraRig scrollState={scrollState} />
      <Suspense fallback={null}>
        <StudioLighting mood="light" />
        <MovementModel scrollState={scrollState} activeMaterial={activeMaterial} />
      </Suspense>
    </Canvas>
  )
}
