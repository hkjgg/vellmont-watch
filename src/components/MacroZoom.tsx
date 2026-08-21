import { useCallback, useRef } from 'react'
import MacroZoomCanvas, { MACRO_STAGES } from './scene/MacroZoomCanvas'
import { useScrollWatch } from '../hooks/useScrollWatch'
import type { MaterialId } from './scene/materials'

interface MacroZoomProps {
  activeMaterial: MaterialId
}

/**
 * Cinematic Macro Zoom Sequence. The camera moves smoothly through three
 * close-ups as the user scrolls — dial, case profile, bracelet — each with
 * its own synced typography reveal.
 */
export default function MacroZoom({ activeMaterial }: MacroZoomProps) {
  const triggerRef = useRef<HTMLElement>(null)
  const progressRef = useRef({ value: 0 })
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])

  const onProgress = useCallback((progress: number) => {
    progressRef.current.value = progress

    const segCount = MACRO_STAGES.length
    const activeIndex = Math.min(segCount - 1, Math.floor(progress * segCount))

    labelRefs.current.forEach((el, i) => {
      if (!el) return
      // A stage's text is visible while the camera is settled on it (the
      // middle ~60% of its segment), fading out as the camera moves on.
      const segStart = i / segCount
      const segEnd = (i + 1) / segCount
      const segLocal = (progress - segStart) / (segEnd - segStart)
      const isIn = i === activeIndex && segLocal > 0.12 && segLocal < 0.92
      el.style.opacity = isIn ? '1' : '0'
      el.style.transform = isIn ? 'translateY(0)' : 'translateY(14px)'
      el.style.filter = isIn ? 'blur(0px)' : 'blur(8px)'
    })
  }, [])

  useScrollWatch(triggerRef, { turns: 0, onProgress })

  return (
    <section ref={triggerRef} className="relative h-[360vh] bg-obsidian">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian">
        <div className="absolute inset-0">
          <MacroZoomCanvas activeMaterial={activeMaterial} progressRef={progressRef} />
        </div>

        <div className="vignette-overlay" />
        <div className="grain-overlay" />

        {MACRO_STAGES.map((stage, i) => (
          <div
            key={stage.label}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="pointer-events-none absolute inset-x-0 bottom-[14%] z-10 flex flex-col items-center px-6 text-center opacity-0 transition-[opacity,transform,filter] duration-700 ease-out"
          >
            <p className="kicker mb-4">{stage.label}</p>
            <p className="max-w-[46ch] font-serif-display text-[clamp(22px,3vw,34px)] italic text-bone">
              {stage.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
