import { AnimatePresence, motion } from 'framer-motion'
import HeroCanvas from './scene/HeroCanvas'
import SwapTrigger from './SwapTrigger'
import { MATERIAL_PRESETS, type MaterialId } from './scene/materials'

interface HeroProps {
  activeMaterial: MaterialId
  onMaterialChange: (id: MaterialId) => void
}

const WORD = 'VELLMONT'

const letterVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)', letterSpacing: '0.6em' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    letterSpacing: '0.06em',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/**
 * Hero & Dynamic Material Swap. A deliberate light-theme open — the one
 * bright section in the experience — before the Dark Particle Fluid
 * Transition pivots everything after it to the dark palette. The watch
 * sits centered over huge low-contrast background type; SWAP (click or
 * drag) cycles the case/bracelet finish live.
 */
export default function Hero({ activeMaterial, onMaterialChange }: HeroProps) {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-paper">
      {/* Large bold background typography */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className="select-none leading-none font-sans font-extrabold text-ink uppercase"
          style={{ fontSize: 'clamp(160px, 26vw, 520px)', letterSpacing: '-0.03em', opacity: 0.045 }}
        >
          Obscura
        </span>
      </div>

      <div className="grain-overlay--light" />

      <div className="absolute inset-0">
        <HeroCanvas activeMaterial={activeMaterial} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 pb-72 text-center sm:pb-80">
        <motion.p
          className="kicker !text-ink-mist"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          Independent Swiss Atelier
        </motion.p>

        <motion.h1
          aria-label={WORD}
          className="flex font-serif-display text-[clamp(40px,8vw,120px)] font-normal leading-none text-ink"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.07, delayChildren: 0.05 }}
        >
          {WORD.split('').map((char, i) => (
            <motion.span key={i} variants={letterVariants} className="inline-block will-change-transform">
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* SWAP trigger + live finish label, floating below the watch */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-6 sm:bottom-14">
        <div className="pointer-events-none h-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeMaterial}
              className="font-serif-display text-2xl italic text-ink"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {MATERIAL_PRESETS[activeMaterial].label}
            </motion.p>
          </AnimatePresence>
        </div>
        <SwapTrigger active={activeMaterial} onChange={onMaterialChange} className="pointer-events-auto" />
      </div>
    </section>
  )
}
