import { motion } from 'framer-motion'

const WORD = 'VELLMONT'

const letterVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)', letterSpacing: '0.6em' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    letterSpacing: '0.06em',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Hero() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-obsidian">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 45%, rgba(60,60,64,0.35) 0%, rgba(3,3,3,0) 70%), radial-gradient(120% 90% at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 60%)',
        }}
      />
      <div className="vignette-overlay" />
      <div className="grain-overlay" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <motion.p
          className="kicker"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          Independent Swiss Atelier
        </motion.p>

        <motion.h1
          aria-label={WORD}
          className="flex font-serif-display text-[clamp(48px,10vw,140px)] font-normal leading-none text-bone"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.07, delayChildren: 0.05 }}
        >
          {WORD.split('').map((char, i) => (
            <motion.span key={i} variants={letterVariants} className="inline-block will-change-transform">
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="font-serif-display text-[clamp(16px,2vw,22px)] italic text-mist"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.95 }}
        >
          The Obscura
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span className="scroll-cue-line h-8 w-px bg-gradient-to-b from-mist to-transparent" />
        <em className="text-[10px] font-normal not-italic tracking-[0.3em] text-mist uppercase">Scroll</em>
      </motion.div>
    </section>
  )
}
