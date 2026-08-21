import { useMagneticHover } from '../hooks/useMagneticHover'

export default function Nav() {
  const magneticRef = useMagneticHover<HTMLAnchorElement>(0.4, 'opacity 0.3s ease')

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-7 mix-blend-difference sm:px-10 sm:py-8">
      <span className="font-serif-display text-sm tracking-[0.32em] text-bone">VELLMONT</span>
      <a
        ref={magneticRef}
        href="#waitlist"
        className="pointer-events-auto inline-block border-b border-mist pb-0.5 text-[11px] tracking-[0.18em] text-bone uppercase transition-opacity duration-300 hover:opacity-60"
      >
        Waitlist
      </a>
    </header>
  )
}
