import { useEffect, useRef } from 'react'

/**
 * Nudges a plain (non-Framer-Motion) element toward the pointer while
 * hovered, on top of the cursor's own magnetic snap — the classic "button
 * leans into your cursor" pull. Framer Motion components already own their
 * `transform`, so this is only for plain elements (see MagneticCursor.tsx
 * for the site-wide cursor effect that covers everything else).
 */
/**
 * `extraTransition` preserves whatever CSS-transition the element already
 * declares via classes (e.g. Tailwind's `transition-colors`) — setting
 * `style.transition` inline replaces the shorthand entirely, so without this
 * the element's own hover transition would silently stop working.
 */
export function useMagneticHover<T extends HTMLElement>(strength = 0.35, extraTransition = '') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      el!.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`
    }
    function handleLeave() {
      el!.style.transform = ''
    }

    el.style.transition = ['transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)', extraTransition].filter(Boolean).join(', ')
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength, extraTransition])

  return ref
}
