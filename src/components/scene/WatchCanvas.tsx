import { Suspense, useEffect, type RefObject } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import WatchModel from './WatchModel'
import ProceduralWatch from './ProceduralWatch'
import ModelErrorBoundary from './ModelErrorBoundary'
import type { ScrollState } from '../../hooks/useWatchRig'
import type { MaterialId } from './materials'

interface WatchCanvasProps {
  scrollState: RefObject<ScrollState>
  activeMaterial: MaterialId
}

/** Points the static camera at the watch — the position has a slight y offset for a
 *  more dynamic angle, so without this it drifts off-center toward the bottom. */
function CameraRig() {
  const camera = useThree((state) => state.camera)
  useEffect(() => {
    camera.lookAt(0, 0, 0)
  }, [camera])
  return null
}

export default function WatchCanvas({ scrollState, activeMaterial }: WatchCanvasProps) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 5.4], fov: 28 }}
      gl={{ antialias: true, toneMappingExposure: 1.05 }}
    >
      <CameraRig />
      {/* Key light — warm, from front-high, casts the primary soft shadow */}
      <spotLight
        position={[3, 4, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={90}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      {/* Rim light — cool, from behind, separates the case from the void */}
      <spotLight position={[-4, 2, -5]} angle={0.5} penumbra={1} intensity={45} color="#7fa8ff" />
      {/* Soft fill so the shadow side never crushes fully to black */}
      <ambientLight intensity={0.12} />
      <hemisphereLight args={['#3a3f4a', '#020202', 0.3]} />

      <Suspense fallback={null}>
        <ModelErrorBoundary fallback={<ProceduralWatch scrollState={scrollState} activeMaterial={activeMaterial} />}>
          <WatchModel scrollState={scrollState} activeMaterial={activeMaterial} />
        </ModelErrorBoundary>

        {/* Procedural studio environment — realistic metallic reflections with no external HDRI fetch */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer form="rect" intensity={3.5} position={[0, 5, -9]} scale={[10, 10, 1]} color="#ffffff" />
            <Lightformer form="circle" intensity={2.2} position={[-6, 2, 2]} scale={4} color="#dbe6ff" />
            <Lightformer form="circle" intensity={2.2} position={[6, 2, 2]} scale={4} color="#ffe9d6" />
            <Lightformer form="ring" intensity={3} position={[0, 4, 4]} scale={6} color="#ffffff" />
          </group>
        </Environment>

        <ContactShadows position={[0, -1.35, 0]} opacity={0.65} scale={8} blur={2.4} far={2} resolution={512} />
      </Suspense>
    </Canvas>
  )
}
