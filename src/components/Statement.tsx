import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function Statement() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-obsidian px-6 py-24 text-center">
      <motion.p
        className="kicker"
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        Limited Edition
      </motion.p>
      <motion.h2
        className="font-serif-display text-[clamp(42px,8vw,108px)] font-normal text-bone"
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        The Obscura
      </motion.h2>
      <motion.p
        className="text-[13px] tracking-[0.2em] text-mist uppercase"
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUp}
      >
        One of one hundred.
      </motion.p>
    </section>
  )
}
