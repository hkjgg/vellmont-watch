import { motion } from 'framer-motion'
import { MATERIAL_ORDER, MATERIAL_PRESETS, type MaterialId } from './scene/materials'

interface MaterialSwitcherProps {
  active: MaterialId
  onChange: (id: MaterialId) => void
  className?: string
}

export default function MaterialSwitcher({ active, onChange, className = '' }: MaterialSwitcherProps) {
  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {MATERIAL_ORDER.map((id) => {
        const preset = MATERIAL_PRESETS[id]
        const isActive = id === active
        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onChange(id)}
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
            />
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
