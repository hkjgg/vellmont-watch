import type Lenis from 'lenis'

/**
 * The page owns exactly one Lenis instance (created in App.tsx). Anything
 * that needs to scroll programmatically — like the Lineup's "return to main
 * stage" — must go through it rather than native window.scrollTo, which
 * would desync from Lenis's own internal scroll position and fight it.
 */
export const lenisRef: { current: Lenis | null } = { current: null }
