// Synthesized micro-interaction sounds — no audio files, generated on the fly
// with the Web Audio API. Reserved for deliberate clicks (material switch,
// waitlist submit), never hover — a magnetic cursor triggers "hover" on
// nearly everything, so sound there would be constant and quickly grating.

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  // Browsers suspend contexts created/idle outside a user gesture; every call
  // here originates from a click handler, so resuming is always permitted.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/** A soft, short mechanical tick — evokes a watch crown or bezel click. */
export function playTick() {
  const audioCtx = getContext()
  if (!audioCtx) return

  const now = audioCtx.currentTime
  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.05, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
  gain.connect(audioCtx.destination)

  const osc = audioCtx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1400, now)
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.07)
  osc.connect(gain)
  osc.start(now)
  osc.stop(now + 0.1)
}

/** A slightly warmer, two-tone confirmation chime for a completed action. */
export function playConfirm() {
  const audioCtx = getContext()
  if (!audioCtx) return

  const now = audioCtx.currentTime
  ;[880, 1320].forEach((freq, i) => {
    const start = now + i * 0.07
    const gain = audioCtx!.createGain()
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.045, start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
    gain.connect(audioCtx!.destination)

    const osc = audioCtx!.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, start)
    osc.connect(gain)
    osc.start(start)
    osc.stop(start + 0.24)
  })
}
