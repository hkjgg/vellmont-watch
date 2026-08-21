import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Tracks whether an element is on-screen via IntersectionObserver. Starts
 * `true` so nothing is paused before the observer's first (async) callback
 * fires — the point is skipping work while off-screen, not the reverse.
 */
export function useInViewport<T extends HTMLElement>(rootMargin = '0px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
