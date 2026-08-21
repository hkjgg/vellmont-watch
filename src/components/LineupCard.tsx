import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import MovementModel from './scene/MovementModel'
import StudioLighting from './scene/StudioLighting'
import IdleRotate from './scene/IdleRotate'
import { MATERIAL_PRESETS, type MaterialId } from './scene/materials'
import type { ScrollState } from '../hooks/useWatchRig'

interface LineupCardProps {
  materialId: MaterialId
  isActive: boolean
  onSelect: (id: MaterialId) => void
}

/** One lightweight, self-contained Canvas in the 4-Watch Lineup grid — its
 *  own compact lighting rig (see StudioLighting's `compact` flag) since four
 *  of these render at once. */
export default function LineupCard({ materialId, isActive, onSelect }: LineupCardProps) {
  const preset = MATERIAL_PRESETS[materialId]
  const scrollState = useRef<ScrollState>({ rotation: 0.4, explode: 0, caseOpacity: 1 })

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(materialId)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      className={`group flex flex-col items-center gap-4 rounded-sm border p-4 transition-colors duration-300 ${
        isActive ? 'border-ink bg-paper-dim' : 'border-ink-hairline hover:border-ink/40'
      }`}
      aria-pressed={isActive}
    >
      <div className="h-52 w-full sm:h-60">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.35, 6.4], fov: 32 }} gl={{ antialias: true, toneMappingExposure: 1.1 }}>
          <Suspense fallback={null}>
            <StudioLighting mood="light" compact />
            <MovementModel scrollState={scrollState} activeMaterial={materialId} animated={false} />
            <IdleRotate stateRef={scrollState} speed={0.22} />
          </Suspense>
        </Canvas>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-serif-display text-lg italic text-ink">{preset.label}</p>
        <span className={`kicker !text-[10px] transition-opacity duration-300 ${isActive ? '!text-ink opacity-100' : 'opacity-0'}`}>
          Selected
        </span>
      </div>
    </motion.button>
  )
}
