import { motion } from 'framer-motion'
import { useState } from 'react'
import { MATERIAL_ORDER, MATERIAL_PRESETS, type MaterialId } from './scene/materials'
import { playTick } from '../lib/sound'

interface MaterialSwitcherProps {
  active: MaterialId
  onChange: (id: MaterialId) => void
  className?: string
}

export default function MaterialSwitcher({ active, onChange, className = '' }: MaterialSwitcherProps) {
  // Keyed by a fresh timestamp on every click (even reselecting the same
  // swatch) so the ripple element remounts and replays its animation
  // instead of only firing the first time a swatch becomes active.
  const [pulse, setPulse] = useState<{ id: MaterialId; key: number } | null>(null)

  function handleSelect(id: MaterialId) {
    if (id !== active) playTick()
    setPulse({ id, key: Date.now() })
    onChange(id)
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {MATERIAL_ORDER.map((id) => {
        const preset = MATERIAL_PRESETS[id]
        const isActive = id === active
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            className="group flex flex-col items-center gap-2.5 outline-none"
            whileTap={{ scale: 0.92 }}
            aria-pressed={isActive}
          >
            <motion.span
              className="relative flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10"
              style={{ backgroundColor: preset.swatch }}
              animate={{
                scale: isActive ? 1.08 : 1,
                boxShadow: isActive
                  ? `0 0 0 2px rgba(242,242,240,0.9), 0 0 22px ${preset.swatch}66`
                  : '0 0 0 1px rgba(242,242,240,0.18)',
              }}
              whileHover={{ scale: isActive ? 1.08 : 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {pulse?.id === id && (
                <motion.span
                  key={pulse.key}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${preset.swatch}` }}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                />
              )}
            </motion.span>
            <span
              className={`kicker !text-[10px] transition-colors duration-300 ${
                isActive ? 'text-bone' : 'text-mist group-hover:text-bone/70'
              }`}
            >
              {preset.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
