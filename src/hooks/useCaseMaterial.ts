import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import { MATERIAL_PRESETS, type MaterialId } from '../components/scene/materials'

/**
 * Smoothly tweens every registered case/bracelet material (Silver Steel,
 * Deep Black, Pure Gold, Rose Gold) toward the active preset whenever it
 * changes.
 */
export function useCaseMaterial(
  materialsRef: RefObject<THREE.MeshStandardMaterial[]>,
  activeMaterial: MaterialId,
) {
  useEffect(() => {
    const preset = MATERIAL_PRESETS[activeMaterial]
    const targetColor = new THREE.Color(preset.color)
    const tweens = materialsRef.current.map((material) => {
      const isPhysical = material instanceof THREE.MeshPhysicalMaterial
      return gsap.to(material, {
        metalness: preset.metalness,
        roughness: preset.roughness,
        ...(isPhysical ? { clearcoat: preset.clearcoat, clearcoatRoughness: preset.clearcoatRoughness } : {}),
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => material.color.lerp(targetColor, 0.08),
      })
    })
    return () => {
      tweens.forEach((tween) => tween.kill())
    }
  }, [activeMaterial, materialsRef])
}
