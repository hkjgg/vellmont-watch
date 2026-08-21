import { useFrame } from '@react-three/fiber'
import type { RefObject } from 'react'
import type { ScrollState } from '../../hooks/useWatchRig'

/** Slow continuous turntable rotation for sections with no scroll-driven
 *  camera/rotation of their own (Hero, Lineup) — mutates the same
 *  {rotation, explode} shape MovementModel already reads, just time-driven
 *  instead of scroll-driven. Must render inside <Canvas>. */
export default function IdleRotate({ stateRef, speed = 0.15 }: { stateRef: RefObject<ScrollState>; speed?: number }) {
  useFrame((_, delta) => {
    stateRef.current.rotation += delta * speed
  })
  return null
}
