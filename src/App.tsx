import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import Statement from './components/Statement'
import Waitlist from './components/Waitlist'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    // Keep ScrollTrigger's scroll position in sync with Lenis's smoothed scroll,
    // and drive Lenis from GSAP's ticker so both share one rAF loop.
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="relative bg-obsidian">
      <Nav />
      <main>
        <Hero />
        <ProductShowcase />
        <Statement />
        <Waitlist />
      </main>
    </div>
  )
}
