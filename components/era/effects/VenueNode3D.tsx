'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

function VenueNodeMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.04;
      haloRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* The "venue" — a low-poly node placeholder for the GLTF model. */}
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color={eraAccent.irlEvents}
          emissive={eraAccent.irlEvents}
          emissiveIntensity={0.6}
          flatShading
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
      {/* Wireframe overlay so the form reads structurally even without GLTF detail. */}
      <mesh>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Halo plane suggesting "venue presence". */}
      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
        <ringGeometry args={[1.4, 1.7, 64]} />
        <meshBasicMaterial color={eraAccent.irlEvents} transparent opacity={0.35} />
      </mesh>
      {/* Three small orbiting markers — represent attendees converging. */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 2.4,
            Math.sin((i / 3) * Math.PI * 2 + 0.4) * 0.6,
            Math.sin((i / 3) * Math.PI * 2) * 2.4,
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * IRL Events channel — a rotating "venue node" 3D model. Currently a
 * low-poly icosahedron stand-in; swap to GLTF once a real venue model
 * is exported (we already pull `@react-three/drei` for `useGLTF`).
 */
export function VenueNode3D({ className }: { className?: string }) {
  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="irlEvents" shape="rings" className={className} />;
  }
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className
      )}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [2.6, 1.4, 4.4], fov: 42 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 2]} intensity={0.9} color={eraAccent.irlEvents} />
        <directionalLight position={[-2, -1, -3]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <VenueNodeMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
