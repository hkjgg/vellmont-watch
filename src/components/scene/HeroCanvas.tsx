import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import MovementModel from './MovementModel'
import StudioLighting from './StudioLighting'
import IdleRotate from './IdleRotate'
import type { ScrollState } from '../../hooks/useWatchRig'
import type { MaterialId } from './materials'

interface HeroCanvasProps {
  activeMaterial: MaterialId
}

export default function HeroCanvas({ activeMaterial }: HeroCanvasProps) {
  const scrollState = useRef<ScrollState>({ rotation: 0, explode: 0, caseOpacity: 1 })

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0.35, 6.2], fov: 30 }}
      gl={{ antialias: true, toneMappingExposure: 1.15 }}
    >
      <Suspense fallback={null}>
        <StudioLighting mood="light" />
        <MovementModel scrollState={scrollState} activeMaterial={activeMaterial} />
        <IdleRotate stateRef={scrollState} speed={0.12} />
      </Suspense>
    </Canvas>
  )
}
