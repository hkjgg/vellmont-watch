"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function SpinningTorus() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <torusKnotGeometry args={[1, 0.32, 200, 32]} />
      <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} />
      <SpinningTorus />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}
