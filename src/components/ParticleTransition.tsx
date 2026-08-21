import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import ParticleTransitionCanvas from './scene/ParticleTransitionCanvas'
import { useScrollWatch } from '../hooks/useScrollWatch'
import type { MaterialId } from './scene/materials'

interface ParticleTransitionProps {
  activeMaterial: MaterialId
}

/**
 * Dark Particle Fluid Transition — "MECHANICAL HEART". The pivot from the
 * light Hero/Movement sections into the dark second half of the experience.
 * Swirl intensity ramps in, holds, then ramps back out across the pinned
 * section; the watch itself just idles, fully assembled.
 */
export default function ParticleTransition({ activeMaterial }: ParticleTransitionProps) {
  const triggerRef = useRef<HTMLElement>(null)
  const intensityRef = useRef({ value: 0 })
  const headingRef = useRef<HTMLDivElement>(null)

  const onProgress = useCallback((progress: number) => {
    let intensity: number
    if (progress < 0.3) intensity = progress / 0.3
    else if (progress < 0.7) intensity = 1
    else intensity = Math.max(0, 1 - (progress - 0.7) / 0.3)
    intensityRef.current.value = intensity

    if (headingRef.current) {
      headingRef.current.style.opacity = String(intensity)
      headingRef.current.style.transform = `translateY(${(1 - intensity) * 14}px)`
    }
  }, [])

  const scrollState = useScrollWatch(triggerRef, { turns: 0, onProgress })
  // This section doesn't use the shared rotation/explode rig for the watch
  // itself (it idles independently — see ParticleTransitionCanvas), only the
  // scroll progress for the particle intensity ramp above.
  void scrollState

  return (
    <section ref={triggerRef} className="relative h-[220vh] bg-obsidian">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <ParticleTransitionCanvas activeMaterial={activeMaterial} intensityRef={intensityRef} />
        </div>

        <div className="vignette-overlay" />
        <div className="grain-overlay" />

        <motion.div
          ref={headingRef}
          className="pointer-events-none absolute inset-x-0 top-[14%] z-10 flex flex-col items-center text-center transition-none"
        >
          <p className="kicker mb-4">Mechanical Heart</p>
          <h2 className="font-serif-display text-[clamp(30px,5vw,64px)] font-normal text-bone">
            Every current, felt.
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
