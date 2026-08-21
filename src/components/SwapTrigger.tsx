import { motion } from 'framer-motion'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { MATERIAL_ORDER, type MaterialId } from './scene/materials'
import { playTick } from '../lib/sound'

interface SwapTriggerProps {
  active: MaterialId
  onChange: (id: MaterialId) => void
  className?: string
}

/** Pixels of horizontal drag per material step. */
const DRAG_STEP_PX = 90
/** Drag distance beyond which a pointer-up no longer counts as a click. */
const DRAG_THRESHOLD_PX = 6

/**
 * The floating circular "SWAP" cursor trigger: click to cycle to the next
 * finish, or press-and-drag horizontally to scrub through them (each
 * DRAG_STEP_PX of drag advances one step, live, with wraparound). A drag
 * gesture suppresses the trailing click so it doesn't double-cycle.
 */
export default function SwapTrigger({ active, onChange, className = '' }: SwapTriggerProps) {
  const dragStartX = useRef<number | null>(null)
  const dragStartIndex = useRef(0)
  const didDragRef = useRef(false)

  const activeIndex = MATERIAL_ORDER.indexOf(active)

  function selectIndex(index: number) {
    const wrapped = ((index % MATERIAL_ORDER.length) + MATERIAL_ORDER.length) % MATERIAL_ORDER.length
    const id = MATERIAL_ORDER[wrapped]
    if (id !== active) {
      onChange(id)
      playTick()
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    dragStartX.current = e.clientX
    dragStartIndex.current = activeIndex
    didDragRef.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (dragStartX.current === null) return
    const rawDelta = e.clientX - dragStartX.current
    if (Math.abs(rawDelta) > DRAG_THRESHOLD_PX) didDragRef.current = true
    const steps = Math.round(rawDelta / DRAG_STEP_PX)
    selectIndex(dragStartIndex.current + steps)
  }

  function handlePointerUp() {
    dragStartX.current = null
  }

  function handleClick() {
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    selectIndex(activeIndex + 1)
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.05 }}
      className={`group relative flex h-24 w-24 cursor-grab touch-none select-none items-center justify-center rounded-full border border-ink/25 bg-paper/70 backdrop-blur-sm active:cursor-grabbing sm:h-28 sm:w-28 ${className}`}
      style={{ touchAction: 'none' }}
      aria-label={`Swap finish, currently ${MATERIAL_ORDER[activeIndex]}`}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full border border-ink/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <span className="kicker !text-ink !text-[10px]">Swap</span>
    </motion.button>
  )
}
