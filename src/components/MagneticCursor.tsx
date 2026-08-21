import { useEffect, useRef } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea'

/**
 * Site-wide smooth-follow cursor: a ring lags the pointer with a lerp instead
 * of tracking it 1:1, and snaps/scales onto whatever interactive element the
 * pointer is over — the "magnetic" feel — without needing every button to
 * opt in individually. Disabled entirely on touch devices and when the user
 * has requested reduced motion, where it would be meaningless or unwelcome.
 */
export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reducedMotion) return

    document.documentElement.classList.add('cursor-active')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { ...pos }
    let isActive = false
    let raf = 0

    function handleMove(e: MouseEvent) {
      const magneticEl = (e.target as HTMLElement | null)?.closest<HTMLElement>(INTERACTIVE_SELECTOR)
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect()
        target.x = rect.left + rect.width / 2
        target.y = rect.top + rect.height / 2
        isActive = true
      } else {
        target.x = e.clientX
        target.y = e.clientY
        isActive = false
      }
      cursorRef.current?.classList.toggle('magnetic-cursor--active', isActive)
    }

    function tick() {
      // Snappier pull toward a magnetic target, gentler drift otherwise.
      const ease = isActive ? 0.28 : 0.16
      pos.x += (target.x - pos.x) * ease
      pos.y += (target.y - pos.y) * ease
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-active')
    }
  }, [])

  return (
    <div ref={cursorRef} className="magnetic-cursor" aria-hidden="true">
      <div className="magnetic-cursor__ring" />
      <div className="magnetic-cursor__dot" />
    </div>
  )
}
