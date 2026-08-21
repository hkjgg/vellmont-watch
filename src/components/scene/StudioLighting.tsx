import { ContactShadows, Environment, Lightformer } from '@react-three/drei'

interface StudioLightingProps {
  /** 'light' = bright neutral studio (Hero, Lineup); 'dark' = moodier
   *  warm/cool split (everything after the Dark Particle Fluid Transition). */
  mood?: 'light' | 'dark'
  contactShadow?: boolean
  /** Cheaper shadow map + no environment/contact-shadow, for contexts running
   *  several Canvas instances at once (the 4-Watch Lineup). */
  compact?: boolean
}

/** Shared key/rim/fill lighting + a procedurally-lit environment (no external
 *  HDRI fetch) reused across every Canvas in the experience, so the watch
 *  reads consistently from section to section even though each section owns
 *  its own render context. */
export default function StudioLighting({ mood = 'dark', contactShadow = true, compact = false }: StudioLightingProps) {
  const isLight = mood === 'light'

  return (
    <>
      <spotLight
        position={[3, 4, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={isLight ? 130 : 90}
        color={isLight ? '#ffffff' : '#fff4e0'}
        castShadow={!compact}
        shadow-mapSize={compact ? [512, 512] : [2048, 2048]}
        shadow-bias={-0.0002}
      />
      <spotLight position={[-4, 2, -5]} angle={0.5} penumbra={1} intensity={isLight ? 60 : 45} color={isLight ? '#eef2ff' : '#7fa8ff'} />
      <ambientLight intensity={isLight ? 0.4 : 0.12} />
      <hemisphereLight args={[isLight ? '#ffffff' : '#3a3f4a', isLight ? '#e4e4e4' : '#020202', isLight ? 0.6 : 0.3]} />

      {!compact && (
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer form="rect" intensity={isLight ? 5 : 3.5} position={[0, 5, -9]} scale={[10, 10, 1]} color="#ffffff" />
            <Lightformer form="circle" intensity={2.2} position={[-6, 2, 2]} scale={4} color={isLight ? '#ffffff' : '#dbe6ff'} />
            <Lightformer form="circle" intensity={2.2} position={[6, 2, 2]} scale={4} color={isLight ? '#ffffff' : '#ffe9d6'} />
            <Lightformer form="ring" intensity={3} position={[0, 4, 4]} scale={6} color="#ffffff" />
          </group>
        </Environment>
      )}

      {contactShadow && !compact && (
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={isLight ? 0.35 : 0.65}
          scale={8}
          blur={2.4}
          far={2}
          resolution={512}
        />
      )}
    </>
  )
}
