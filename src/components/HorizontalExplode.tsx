import { useCallback, useRef } from 'react'
import HorizontalExplodeCanvas from './scene/HorizontalExplodeCanvas'
import { useScrollWatch } from '../hooks/useScrollWatch'
import { MOVEMENT_PART_LABELS, type MaterialId, type MovementPart } from './scene/materials'

interface PartLabel {
  key: MovementPart
  index: string
  revealAt: number
  className: string
}

// revealAt tuned against MOVEMENT_EXPLODE_STAGGER + the smoothstep easing in
// useScrollWatch, so each label lands just as its part visibly starts moving —
// outside-in, matching the stack separating from mainplate outward.
const PART_LABELS: PartLabel[] = [
  { key: 'mainplate', index: '01', revealAt: 0.4, className: 'left-1/2 top-[16%] -translate-x-1/2' },
  { key: 'barrel', index: '02', revealAt: 0.44, className: 'left-[38%] bottom-[18%]' },
  { key: 'tourbillon', index: '03', revealAt: 0.46, className: 'right-[30%] bottom-[16%]' },
  { key: 'baseplate', index: '04', revealAt: 0.54, className: 'left-[18%] top-[20%]' },
  { key: 'weight', index: '05', revealAt: 0.62, className: 'left-[6%] bottom-[22%]' },
  { key: 'dial', index: '06', revealAt: 0.64, className: 'right-[8%] top-[22%]' },
]

interface HorizontalExplodeProps {
  activeMaterial: MaterialId
}

/**
 * Horizontal Exploded Assembly. Scroll rotates the watch to a side profile
 * (a quarter turn) while the case fades away and the six movement layers
 * fan out wide along X, each picking up an interactive label as it separates.
 */
export default function HorizontalExplode({ activeMaterial }: HorizontalExplodeProps) {
  const triggerRef = useRef<HTMLElement>(null)
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const headingRef = useRef<HTMLDivElement>(null)

  const onProgress = useCallback((progress: number) => {
    if (headingRef.current) {
      const fade = 1 - Math.min(1, Math.max(0, (progress - 0.02) / 0.16))
      headingRef.current.style.opacity = String(fade)
      headingRef.current.style.transform = `translateY(${(1 - fade) * -16}px)`
    }
    for (const part of PART_LABELS) {
      const el = labelRefs.current[part.key]
      if (!el) continue
      const isIn = progress >= part.revealAt
      el.style.opacity = isIn ? '1' : '0'
      el.style.transform = isIn ? 'translateY(0)' : 'translateY(10px)'
      el.style.filter = isIn ? 'blur(0px)' : 'blur(6px)'
    }
  }, [])

  const scrollState = useScrollWatch(triggerRef, {
    turns: 0.25,
    explodeStart: 0.34,
    caseOpacityRange: [0.02, 0.3],
    onProgress,
  })

  return (
    <section ref={triggerRef} id="movement" className="relative h-[420vh] bg-paper">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
        <div className="absolute inset-0">
          <HorizontalExplodeCanvas scrollState={scrollState} activeMaterial={activeMaterial} />
        </div>

        <div className="grain-overlay--light" />

        <div
          ref={headingRef}
          className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex flex-col items-center text-center transition-none"
        >
          <p className="kicker !text-ink-mist mb-4">The Movement</p>
          <h2 className="font-serif-display text-[clamp(28px,4.5vw,52px)] font-normal text-ink">
            Six layers, one heartbeat.
          </h2>
        </div>

        {PART_LABELS.map((part) => (
          <div
            key={part.key}
            ref={(el) => {
              labelRefs.current[part.key] = el
            }}
            className={`pointer-events-none absolute z-10 max-w-[210px] opacity-0 transition-[opacity,transform,filter] duration-700 ease-out ${part.className}`}
          >
            <p className="mb-1 font-mono text-[10px] tracking-[0.25em] text-ink-mist">{part.index}</p>
            <p className="font-serif-display text-xl italic text-ink">{MOVEMENT_PART_LABELS[part.key].title}</p>
            <span className="mt-2 block h-px w-10 bg-ink-hairline" />
            <p className="mt-2 text-[12px] leading-relaxed text-ink-mist">{MOVEMENT_PART_LABELS[part.key].copy}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
