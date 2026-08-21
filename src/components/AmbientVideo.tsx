import { useState } from 'react'

interface AmbientVideoProps {
  /** Path under public/, e.g. "/media/atelier.mp4". See public/media/README.md. */
  src?: string
  poster?: string
  kicker: string
  title: string
  copy: string
  className?: string
}

/**
 * Full-bleed looping ambient video panel. Falls back to a CSS gradient wash
 * (.ambient-fallback) when no source is given, or if the clip fails to load —
 * the section stays visually complete before real footage is dropped in.
 */
export default function AmbientVideo({ src, poster, kicker, title, copy, className = '' }: AmbientVideoProps) {
  const [failed, setFailed] = useState(false)
  const showVideo = Boolean(src) && !failed

  return (
    <div className={`group relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[16/10] ${className}`}>
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="ambient-fallback absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
      )}

      <div className="vignette-overlay" />
      <div className="grain-overlay" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
        <p className="kicker mb-2">{kicker}</p>
        <p className="font-serif-display text-2xl italic text-bone">{title}</p>
        <p className="mt-2 max-w-[36ch] text-sm text-mist">{copy}</p>
      </div>
    </div>
  )
}
