import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'

interface Stream {
  radius: number
  tiltX: number
  tiltZ: number
  speed: number
  phase: number
  wobbleFreq: number
  wobbleAmp: number
}

const STREAM_COUNT = 9
const PARTICLES_PER_STREAM = 220
const TOTAL = STREAM_COUNT * PARTICLES_PER_STREAM

interface ParticleFieldProps {
  /** 0→1 swirl visibility, read every frame (not a React prop) so fading it
   *  in/out with scroll never costs a re-render. */
  intensityRef: RefObject<{ value: number }>
}

/**
 * Fluid wave-line particles swirling around the movement — a handful of
 * tilted, wobbling rings rather than a flat disc, so it reads as flowing
 * streams rather than a static halo. Positions are recomputed on the CPU
 * each frame (simple trig, no shader) since a couple thousand points is
 * cheap enough at this scale.
 */
export default function ParticleField({ intensityRef }: ParticleFieldProps) {
  const streams = useMemo<Stream[]>(
    () =>
      Array.from({ length: STREAM_COUNT }, () => ({
        radius: 1.5 + Math.random() * 1.1,
        tiltX: Math.random() * Math.PI,
        tiltZ: Math.random() * Math.PI,
        speed: 0.5 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        wobbleFreq: 3 + Math.floor(Math.random() * 4),
        wobbleAmp: 0.08 + Math.random() * 0.14,
      })),
    [],
  )

  const positions = useMemo(() => new Float32Array(TOTAL * 3), [])
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#dfe6ff',
        size: 0.022,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  )

  const pointsRef = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    let idx = 0
    for (let s = 0; s < STREAM_COUNT; s++) {
      const stream = streams[s]
      const cosTiltX = Math.cos(stream.tiltX)
      const sinTiltX = Math.sin(stream.tiltX)
      const cosTiltZ = Math.cos(stream.tiltZ)
      const sinTiltZ = Math.sin(stream.tiltZ)

      for (let p = 0; p < PARTICLES_PER_STREAM; p++) {
        const tp = (p / PARTICLES_PER_STREAM + t * stream.speed * 0.04) % 1
        const angle = tp * Math.PI * 2 + stream.phase
        const wobble = Math.sin(angle * stream.wobbleFreq + t * 0.6) * stream.wobbleAmp
        const r = stream.radius + wobble

        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        const z = Math.sin(angle * 2 + t * 0.4) * 0.3

        const y2 = y * cosTiltX - z * sinTiltX
        const z2 = y * sinTiltX + z * cosTiltX
        const x3 = x * cosTiltZ - y2 * sinTiltZ
        const y3 = x * sinTiltZ + y2 * cosTiltZ

        positions[idx * 3] = x3
        positions[idx * 3 + 1] = y3
        positions[idx * 3 + 2] = z2
        idx++
      }
    }
    geometry.attributes.position.needsUpdate = true
    material.opacity = intensityRef.current.value * 0.75
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
