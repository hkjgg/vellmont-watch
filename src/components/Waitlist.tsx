import { motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Waitlist() {
  const [note, setNote] = useState('By invitation. Production limited to one hundred pieces.')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNote('Request received. We will be in touch.')
    e.currentTarget.reset()
  }

  return (
    <section id="waitlist" className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-obsidian px-6 py-24 text-center">
      <motion.p className="kicker" custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.6 }} variants={fadeUp}>
        Private Waitlist
      </motion.p>
      <motion.h2
        className="font-serif-display text-[clamp(32px,5vw,56px)] font-normal text-bone"
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        Request access.
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="flex w-[min(420px,88vw)] items-center gap-0 border-b border-mist pb-2.5"
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          aria-label="Email address"
          className="flex-1 bg-transparent px-1 py-1.5 text-[15px] text-bone outline-none placeholder:text-graphite"
        />
        <button
          type="submit"
          className="whitespace-nowrap px-1 py-1.5 text-[11px] tracking-[0.25em] text-mist uppercase transition-colors duration-300 hover:text-bone"
        >
          Request
        </button>
      </motion.form>

      <motion.p
        className="mt-1 text-xs text-graphite"
        custom={3}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        {note}
      </motion.p>

      <footer className="absolute inset-x-0 bottom-7 flex justify-between px-5 text-[10px] tracking-[0.25em] text-graphite uppercase sm:px-10">
        <span>Vellmont</span>
        <span>Geneva</span>
      </footer>
    </section>
  )
}
