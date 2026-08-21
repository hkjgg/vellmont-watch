import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { lenisRef } from './lib/lenisInstance'
import Nav from './components/Nav'
import Hero from './components/Hero'
import HorizontalExplode from './components/HorizontalExplode'
import ParticleTransition from './components/ParticleTransition'
import MacroZoom from './components/MacroZoom'
import Lineup from './components/Lineup'
import MediaShowcase from './components/MediaShowcase'
import Statement from './components/Statement'
import Waitlist from './components/Waitlist'
import MagneticCursor from './components/MagneticCursor'
import type { MaterialId } from './components/scene/materials'

export default function App() {
  // Shared across the whole re-architected experience: the finish chosen in
  // the Hero (via SWAP) or the Lineup persists through every section between
  // them, so the case/bracelet you picked is still what you see in the
  // Macro Zoom's "Slim Profile" and "Bracelet" close-ups.
  const [activeMaterial, setActiveMaterial] = useState<MaterialId>('silverSteel')

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

    // Keep ScrollTrigger's scroll position in sync with Lenis's smoothed scroll,
    // and drive Lenis from GSAP's ticker so both share one rAF loop.
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="relative bg-obsidian">
      <MagneticCursor />
      <Nav />
      <main>
        <Hero activeMaterial={activeMaterial} onMaterialChange={setActiveMaterial} />
        <HorizontalExplode activeMaterial={activeMaterial} />
        <ParticleTransition activeMaterial={activeMaterial} />
        <MacroZoom activeMaterial={activeMaterial} />
        <Lineup activeMaterial={activeMaterial} onSelect={setActiveMaterial} />
        <MediaShowcase />
        <Statement />
        <Waitlist />
      </main>
    </div>
  )
}
