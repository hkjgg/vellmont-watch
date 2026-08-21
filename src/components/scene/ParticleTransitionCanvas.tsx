import { Suspense, useRef, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import MovementModel from './MovementModel'
import StudioLighting from './StudioLighting'
import IdleRotate from './IdleRotate'
import ParticleField from './ParticleField'
import type { ScrollState } from '../../hooks/useWatchRig'
import type { MaterialId } from './materials'

interface ParticleTransitionCanvasProps {
  activeMaterial: MaterialId
  intensityRef: RefObject<{ value: number }>
}

export default function ParticleTransitionCanvas({ activeMaterial, intensityRef }: ParticleTransitionCanvasProps) {
  const scrollState = useRef<ScrollState>({ rotation: 0, explode: 0, caseOpacity: 1 })

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 6.4], fov: 30 }}
      gl={{ antialias: true, toneMappingExposure: 1.05 }}
    >
      <Suspense fallback={null}>
        <StudioLighting mood="dark" />
        <MovementModel scrollState={scrollState} activeMaterial={activeMaterial} />
        <IdleRotate stateRef={scrollState} speed={0.1} />
        <ParticleField intensityRef={intensityRef} />
      </Suspense>
    </Canvas>
  )
}
