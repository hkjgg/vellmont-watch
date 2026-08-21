import { motion } from 'framer-motion'
import LineupCard from './LineupCard'
import { MATERIAL_ORDER, type MaterialId } from './scene/materials'
import { playConfirm } from '../lib/sound'
import { lenisRef } from '../lib/lenisInstance'

interface LineupProps {
  activeMaterial: MaterialId
  onSelect: (id: MaterialId) => void
}

/**
 * Interactive 4-Watch Lineup Showcase — "SELECT MODEL". Closes the
 * experience where the Hero opened it: light theme, same four finishes.
 * Clicking a model sets it as the active finish and smoothly returns to
 * the Hero, now showing that selection in full 3D.
 */
export default function Lineup({ activeMaterial, onSelect }: LineupProps) {
  function handleSelect(id: MaterialId) {
    onSelect(id)
    playConfirm()
    lenisRef.current?.scrollTo(0, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
  }

  return (
    <section className="relative bg-paper py-28 sm:py-36">
      <div className="grain-overlay--light" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10">
        <motion.div
          className="mb-14 max-w-2xl sm:mb-20"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="kicker !text-ink-mist mb-4">Select Model</p>
          <h2 className="font-serif-display text-[clamp(30px,4vw,46px)] font-normal text-ink">
            Four finishes. One obsession.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {MATERIAL_ORDER.map((id) => (
            <LineupCard key={id} materialId={id} isActive={id === activeMaterial} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}
