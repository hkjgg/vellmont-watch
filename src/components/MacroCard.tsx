import { motion } from 'framer-motion'
import { useState } from 'react'

interface MacroCardProps {
  index: string
  title: string
  copy: string
  /** CSS class supplying the fallback material treatment, e.g. "macro-fallback--dial". */
  fallbackClass: string
  /** Path under public/, e.g. "/assets/macro/dial.jpg". See public/assets/README.md. */
  src?: string
}

export default function MacroCard({ index, title, copy, fallbackClass, src }: MacroCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && loaded && !failed

  return (
    <motion.div
      className="glass-card group relative flex flex-col overflow-hidden rounded-sm"
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* The fallback is always mounted as the base layer — visible
            immediately, while the real asset is still loading, and
            permanently if it fails — so there's never a blank gap or
            broken-image flash. The image crossfades in on top once it has
            actually finished loading. Both layers share the same hover-zoom
            treatment so it's seamless regardless of which is showing. */}
        <div
          className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 ${fallbackClass}`}
        />
        {src && !failed && (
          <img
            src={src}
            alt={title}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-110 ${
              showImage ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
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
