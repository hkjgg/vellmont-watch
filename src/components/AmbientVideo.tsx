import { useState } from 'react'

interface AmbientVideoProps {
  /** Path under public/, e.g. "/assets/ambient/atelier.mp4". See public/assets/README.md. */
  src?: string
  poster?: string
  kicker: string
  title: string
  copy: string
  className?: string
}

/**
 * Full-bleed looping ambient video panel. The gradient wash (.ambient-fallback)
 * is always the base layer — showing immediately, through the load, and
 * permanently on failure — with the clip crossfading in on top once it
 * actually has a frame ready, so there's never a black flash while it loads.
 */
export default function AmbientVideo({ src, poster, kicker, title, copy, className = '' }: AmbientVideoProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const showVideo = Boolean(src) && loaded && !failed

  return (
    <div className={`group relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[16/10] ${className}`}>
      <div className="ambient-fallback absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
      {src && !failed && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1.4s] ease-out group-hover:scale-105 ${
            showVideo ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
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
