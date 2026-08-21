import { motion } from 'framer-motion'
import AmbientVideo from './AmbientVideo'
import MacroCard from './MacroCard'

const MACRO_PARTS = [
  {
    index: '01',
    title: 'Case',
    copy: 'Cold-forged 316L steel, brushed and polished by hand across eleven separate passes.',
    fallbackClass: 'macro-fallback--case',
    src: '/media/macro-case.jpg',
  },
  {
    index: '02',
    title: 'Dial',
    copy: 'Sunburst finish, applied indices set individually beneath the crystal.',
    fallbackClass: 'macro-fallback--dial',
    src: '/media/macro-dial.jpg',
  },
  {
    index: '03',
    title: 'Movement',
    copy: 'In-house automatic calibre, 187 components, decorated and regulated to chronometer tolerance.',
    fallbackClass: 'macro-fallback--movement',
    src: '/media/macro-movement.jpg',
  },
  {
    index: '04',
    title: 'Strap',
    copy: 'Vegetable-tanned leather, hand-stitched with a tapered profile at the lugs.',
    fallbackClass: 'macro-fallback--strap',
    src: '/media/macro-strap.jpg',
  },
]

export default function MediaShowcase() {
  return (
    <section id="atelier" className="relative bg-obsidian py-28 sm:py-36">
      <div className="grain-overlay" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10">
        <motion.div
          className="mb-14 max-w-2xl sm:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="kicker mb-4">Inside the Atelier</p>
          <h2 className="font-serif-display text-[clamp(30px,4vw,46px)] font-normal text-bone">
            Built by hand, finished by light.
          </h2>
        </motion.div>

        <div className="mb-16 grid grid-cols-1 gap-5 sm:mb-24 md:grid-cols-2">
          <AmbientVideo
            src="/media/atelier.mp4"
            poster="/media/atelier-poster.jpg"
            kicker="The Workshop"
            title="Where the Obscura is made"
            copy="Every case leaves the bench under the same loupe it was born under."
          />
          <AmbientVideo
            src="/media/on-the-wrist.mp4"
            poster="/media/on-the-wrist-poster.jpg"
            kicker="On the Wrist"
            title="A quiet second hand"
            copy="187 components moving in silence, felt more than heard."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {MACRO_PARTS.map((part) => (
            <MacroCard key={part.index} {...part} />
          ))}
        </div>
      </div>
    </section>
  )
}
