import Lenis from 'lenis'
import './style.css'

// ---------------------------------------------------------------------------
// Media sources (hosted on Higgsfield's CDN — generated via Higgsfield MCP)
// ---------------------------------------------------------------------------

const MEDIA = {
  heroOrbit: 'https://d8j0ntlcm91z4.cloudfront.net/user_3I8xLI41TmR24o2JYfrtTHuiu3g/hf_20260820_211352_d76303dd-eabf-4071-b2f4-d75b4524d443.mp4',
  macro: 'https://d8j0ntlcm91z4.cloudfront.net/user_3I8xLI41TmR24o2JYfrtTHuiu3g/hf_20260820_211352_7b76733d-99a0-4672-ae25-e120c037d637.mp4',
  exploded: 'https://d8j0ntlcm91z4.cloudfront.net/user_3I8xLI41TmR24o2JYfrtTHuiu3g/hf_20260820_211352_60059206-825b-43db-aa56-71d1778744cc.mp4',
}

// ---------------------------------------------------------------------------
// Smooth scroll (Lenis)
// ---------------------------------------------------------------------------

const lenis = new Lenis({
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.4,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ---------------------------------------------------------------------------
// Scroll-scrubbed video → canvas
// ---------------------------------------------------------------------------

interface Scrubber {
  wrap: HTMLElement
  inner: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  video: HTMLVideoElement
  fit: 'cover' | 'contain'
  progress: number
  targetTime: number
  ready: boolean
}

const scrubbers: Scrubber[] = []

function createScrubber(wrapId: string, canvasId: string, src: string, fit: 'cover' | 'contain'): void {
  const wrap = document.getElementById(wrapId)
  const inner = wrap?.querySelector<HTMLElement>('.pin-inner')
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null
  if (!wrap || !inner || !canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const video = document.createElement('video')
  video.src = src
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.style.display = 'none'

  const scrubber: Scrubber = { wrap, inner, canvas, ctx, video, fit, progress: 0, targetTime: 0, ready: false }

  video.addEventListener('loadeddata', () => {
    scrubber.ready = true
    drawFrame(scrubber)
  })

  document.body.appendChild(video)
  scrubbers.push(scrubber)
}

function resizeCanvas(s: Scrubber) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = s.wrap.getBoundingClientRect()
  const w = Math.max(1, Math.round(window.innerWidth * dpr))
  const h = Math.max(1, Math.round(window.innerHeight * dpr))
  if (s.canvas.width !== w || s.canvas.height !== h) {
    s.canvas.width = w
    s.canvas.height = h
  }
  void rect
}

function drawFrame(s: Scrubber) {
  if (!s.ready) return
  const cw = s.canvas.width
  const ch = s.canvas.height
  const vw = s.video.videoWidth
  const vh = s.video.videoHeight
  if (!vw || !vh) return

  const canvasRatio = cw / ch
  const videoRatio = vw / vh
  let dw: number, dh: number, dx: number, dy: number

  const useCover = s.fit === 'cover'
  const shouldStretchToFill = useCover ? canvasRatio > videoRatio : canvasRatio < videoRatio

  if (shouldStretchToFill) {
    dw = cw
    dh = cw / videoRatio
  } else {
    dh = ch
    dw = ch * videoRatio
  }
  dx = (cw - dw) / 2
  dy = (ch - dh) / 2

  // Only decodable frames get painted. A momentarily-not-ready video (e.g.
  // mid-seek) leaves the previous frame on screen instead of flashing black —
  // clearing unconditionally here is what made scrubbing look like it was
  // "breaking" whenever a seek outran decode.
  if (s.video.readyState < 2) return
  try {
    s.ctx.clearRect(0, 0, cw, ch)
    s.ctx.drawImage(s.video, dx, dy, dw, dh)
  } catch {
    // frame not decodable yet — leave previous frame in place
  }
}

function updateScrubber(s: Scrubber) {
  const rect = s.wrap.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  let progress = total > 0 ? (-rect.top) / total : 0
  progress = Math.min(1, Math.max(0, progress))
  s.progress = progress

  const isActive = rect.top < window.innerHeight && rect.bottom > 0
  s.inner.classList.toggle('is-active', isActive)

  if (s.ready && s.video.duration && !s.video.seeking) {
    const t = progress * (s.video.duration - 0.05)
    if (Math.abs(t - s.targetTime) > 0.01) {
      s.targetTime = t
      try {
        s.video.currentTime = t
      } catch {
        // ignore seek errors while metadata is still settling
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Hero wordmark — letter-by-letter tracking reveal
// ---------------------------------------------------------------------------

function buildWordmark() {
  const el = document.getElementById('wordmark')
  if (!el) return
  const word = 'VELLMONT'
  el.innerHTML = ''
  word.split('').forEach((ch) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = ch
    el.appendChild(span)
  })
  return Array.from(el.querySelectorAll<HTMLElement>('.char'))
}

function revealWordmark() {
  const el = document.getElementById('wordmark')
  el?.classList.add('in-view')
}

// ---------------------------------------------------------------------------
// Generic reveal-on-scroll (IntersectionObserver) for non-pinned sections
// ---------------------------------------------------------------------------

function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>('.reveal-up')
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
        }
      })
    },
    { threshold: 0.4 },
  )
  els.forEach((el) => io.observe(el))
}

// ---------------------------------------------------------------------------
// Progress-driven line reveals inside pinned sections
// ---------------------------------------------------------------------------

function updateProgressLines(container: HTMLElement, progress: number) {
  const lines = container.querySelectorAll<HTMLElement>('[data-progress-in]')
  lines.forEach((line) => {
    const inAt = parseFloat(line.dataset.progressIn || '0')
    const outAt = line.dataset.progressOut ? parseFloat(line.dataset.progressOut) : 1
    const isIn = progress >= inAt && progress <= outAt
    line.classList.toggle('is-in', isIn)
  })
}

// ---------------------------------------------------------------------------
// Waitlist form
// ---------------------------------------------------------------------------

function setupWaitlistForm() {
  const form = document.getElementById('waitlist-form') as HTMLFormElement | null
  const note = document.getElementById('waitlist-note')
  if (!form || !note) return
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    note.textContent = 'Request received. We will be in touch.'
    form.reset()
  })
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function applyPinHeights() {
  document.querySelectorAll<HTMLElement>('.pin-wrap[data-pin-height]').forEach((el) => {
    const vh = parseFloat(el.dataset.pinHeight || '200')
    el.style.height = `${vh}vh`
  })
}

function init() {
  applyPinHeights()
  createScrubber('hero', 'hero-canvas', MEDIA.heroOrbit, 'cover')
  createScrubber('macro', 'macro-canvas', MEDIA.macro, 'contain')
  createScrubber('exploded', 'exploded-canvas', MEDIA.exploded, 'contain')

  buildWordmark()
  const heroWrap = document.getElementById('hero')
  const heroCopy = document.querySelector<HTMLElement>('.hero-copy')
  const macroCopy = document.querySelector<HTMLElement>('#macro .detail-copy')
  const specsCopy = document.querySelector<HTMLElement>('#exploded .specs')

  setupReveals()
  setupWaitlistForm()

  // Entrance: letters track in shortly after load, independent of scroll.
  requestAnimationFrame(() => requestAnimationFrame(revealWordmark))

  function onResize() {
    scrubbers.forEach(resizeCanvas)
    scrubbers.forEach(drawFrame)
  }
  window.addEventListener('resize', onResize)
  onResize()

  function tick() {
    scrubbers.forEach((s) => {
      updateScrubber(s)
      drawFrame(s)
    })

    if (heroWrap && heroCopy) {
      const rect = heroWrap.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      // Text recedes across the first half of the hero pin, handing focus to the rotating case.
      const fade = 1 - Math.min(1, Math.max(0, (progress - 0.12) / 0.38))
      heroCopy.style.opacity = String(fade)
      heroCopy.style.transform = `translateY(${(1 - fade) * -30}px) scale(${1 - (1 - fade) * 0.05})`
    }

    if (macroCopy) {
      const s = scrubbers.find((x) => x.wrap.id === 'macro')
      if (s) updateProgressLines(macroCopy, s.progress)
    }
    if (specsCopy) {
      const s = scrubbers.find((x) => x.wrap.id === 'exploded')
      if (s) {
        const rows = specsCopy.querySelectorAll<HTMLElement>('.spec-row')
        rows.forEach((row) => {
          const inAt = parseFloat(row.dataset.progressIn || '0')
          row.classList.toggle('is-in', s.progress >= inAt)
        })
      }
    }

    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
