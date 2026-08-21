import { motion } from 'framer-motion'
import { useState } from 'react'

interface MacroCardProps {
  index: string
  title: string
  copy: string
  /** CSS class supplying the fallback material treatment, e.g. "macro-fallback--dial". */
  fallbackClass: string
  /** Path under public/, e.g. "/media/macro-dial.jpg". See public/media/README.md. */
  src?: string
}

export default function MacroCard({ index, title, copy, fallbackClass, src }: MacroCardProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <motion.div
      className="glass-card group relative flex flex-col overflow-hidden rounded-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {showImage ? (
          <img
            src={src}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 ${fallbackClass}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-transparent" />
        <div className="grain-overlay" />
      </div>

      <div className="p-5">
        <p className="mb-1.5 font-mono text-[10px] tracking-[0.25em] text-graphite">{index}</p>
        <p className="font-serif-display text-lg italic text-bone">{title}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{copy}</p>
      </div>
    </motion.div>
  )
}
