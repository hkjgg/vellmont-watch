import { useCallback, useRef, useState } from 'react'
import WatchCanvas from './scene/WatchCanvas'
import MaterialSwitcher from './MaterialSwitcher'
import { useScrollWatch } from '../hooks/useScrollWatch'
import type { MaterialId } from './scene/materials'

interface PartLabel {
  key: string
  title: string
  index: string
  revealAt: number
  className: string
}

// revealAt is tuned against EXPLODE_STAGGER + the smoothstep easing in
// useScrollWatch, so each label lands just as its part visibly starts moving —
// case first (the anchor), then dial, movement, strap, matching the teardown order.
const PART_LABELS: PartLabel[] = [
  { key: 'case', title: 'Case', index: '01', revealAt: 0.06, className: 'left-[8%] top-[46%]' },
  { key: 'dial', title: 'Dial', index: '02', revealAt: 0.46, className: 'right-[10%] top-[30%]' },
  { key: 'movement', title: 'Movement', index: '03', revealAt: 0.54, className: 'right-[8%] bottom-[26%]' },
  { key: 'strap', title: 'Strap', index: '04', revealAt: 0.64, className: 'left-[9%] bottom-[20%]' },
]

export default function ProductShowcase() {
  const triggerRef = useRef<HTMLElement>(null)
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const headingRef = useRef<HTMLDivElement>(null)
  const [activeMaterial, setActiveMaterial] = useState<MaterialId>('silver')

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
    }
  }, [])

  const scrollState = useScrollWatch(triggerRef, { turns: 1, explodeStart: 0.34, onProgress })

  return (
    <section ref={triggerRef} id="anatomy" className="relative h-[420vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <WatchCanvas scrollState={scrollState} activeMaterial={activeMaterial} />
        </div>

        <div className="vignette-overlay" />
        <div className="grain-overlay" />

        <div
          ref={headingRef}
          className="pointer-events-none absolute inset-x-0 top-[10%] z-10 flex flex-col items-center text-center transition-none"
        >
          <p className="kicker mb-4">Anatomy of a Timepiece</p>
          <h2 className="font-serif-display text-[clamp(28px,4.5vw,52px)] font-normal text-bone">
            187 components. One purpose.
          </h2>
        </div>

        {PART_LABELS.map((part) => (
          <div
            key={part.key}
            ref={(el) => {
              labelRefs.current[part.key] = el
            }}
            className={`pointer-events-none absolute z-10 max-w-[220px] opacity-0 transition-[opacity,transform] duration-700 ease-out ${part.className}`}
          >
            <p className="mb-1 font-mono text-[10px] tracking-[0.25em] text-graphite">{part.index}</p>
            <p className="font-serif-display text-xl italic text-bone/90">{part.title}</p>
            <span className="mt-2 block h-px w-10 bg-hairline" />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-5 sm:bottom-14">
          <p className="kicker">Choose a Finish</p>
          <MaterialSwitcher active={activeMaterial} onChange={setActiveMaterial} />
        </div>
      </div>
    </section>
  )
}
