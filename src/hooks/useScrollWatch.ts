import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import type { ScrollState } from './useWatchRig'

interface UseScrollWatchOptions {
  /** Total watch spin across the pinned section, in full turns. */
  turns?: number
  /** Progress (0-1) at which the exploded view starts. */
  explodeStart?: number
  onProgress?: (progress: number) => void
}

/**
 * Ties GSAP ScrollTrigger to the pinned product-showcase section (pinned via
 * plain CSS `position: sticky`, matching the rest of the site) and exposes a
 * ref-driven { rotation, explode } target the R3F scene reads every frame —
 * mutating a ref instead of React state keeps scroll updates off the render path.
 */
export function useScrollWatch(triggerRef: RefObject<HTMLElement | null>, options: UseScrollWatchOptions = {}) {
  const { turns = 1.25, explodeStart = 0.32, onProgress } = options
  const scrollState = useRef<ScrollState>({ rotation: 0, explode: 0 })

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        scrollState.current.rotation = self.progress * Math.PI * 2 * turns
        const linear = Math.min(1, Math.max(0, (self.progress - explodeStart) / (1 - explodeStart)))
        // Smoothstep, not linear: the teardown eases into and out of motion
        // instead of moving at a constant rate tied directly to scroll speed.
        scrollState.current.explode = linear * linear * (3 - 2 * linear)
        onProgress?.(self.progress)
      },
    })

    return () => trigger.kill()
  }, [triggerRef, turns, explodeStart, onProgress])

  return scrollState
}
