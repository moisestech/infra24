'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

const PARTICLE_COUNT = 720;

function envelopeTargets(count: number) {
  // Parametric envelope outline: rectangle with a triangular flap on top.
  const targets = new Float32Array(count * 3);
  const w = 4.4;
  const h = 2.6;
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    let x = 0;
    let y = 0;
    if (t < 0.4) {
      // Top flap (V shape).
      const k = t / 0.4;
      x = -w / 2 + k * w;
      y = h / 2 - Math.abs(k - 0.5) * h;
    } else if (t < 0.55) {
      // Right edge.
      const k = (t - 0.4) / 0.15;
      x = w / 2;
      y = h / 2 - k * h;
    } else if (t < 0.85) {
      // Bottom edge.
      const k = (t - 0.55) / 0.3;
      x = w / 2 - k * w;
      y = -h / 2;
    } else {
      // Left edge.
      const k = (t - 0.85) / 0.15;
      x = -w / 2;
      y = -h / 2 + k * h;
    }
    targets[i * 3] = x + (Math.random() - 0.5) * 0.08;
    targets[i * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
    targets[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }
  return targets;
}

function ParticleScene() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, targets, velocities } = useMemo(() => {
    const targets = envelopeTargets(PARTICLE_COUNT);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    // Start dispersed.
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;
    }
    return { positions, targets, velocities };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // Cycle: 0..3s coalesce, 3..4s hold, 4..6s disperse, repeat.
    const cycle = (t % 6.5) / 6.5;
    const coalesce = cycle < 0.55 ? cycle / 0.55 : 1 - Math.max(0, (cycle - 0.65) / 0.35);
    const easedTarget = THREE.MathUtils.smoothstep(coalesce, 0, 1);

    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const ix = i * 3;
      const tx = targets[ix];
      const ty = targets[ix + 1];
      const tz = targets[ix + 2];
      // Wind term so particles curl toward target.
      const dx = tx - arr[ix];
      const dy = ty - arr[ix + 1];
      const dz = tz - arr[ix + 2];
      const k = 0.05 + easedTarget * 0.15;
      velocities[ix] += dx * k * dt;
      velocities[ix + 1] += dy * k * dt;
      velocities[ix + 2] += dz * k * dt;
      // Damping.
      velocities[ix] *= 0.92;
      velocities[ix + 1] *= 0.92;
      velocities[ix + 2] *= 0.92;
      arr[ix] += velocities[ix];
      arr[ix + 1] += velocities[ix + 1];
      arr[ix + 2] += velocities[ix + 2];
    }
    attr.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={eraAccent.newsletter}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Newsletter channel — particles disperse and re-form as a paper envelope on
 * a slow loop. Reads as "the dispatch goes out, then regathers" — visual
 * shorthand for the weekly digest.
 */
export function ParticleDispatch({ className }: { className?: string }) {
  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="newsletter" shape="particles" className={className} />;
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
        camera={{ position: [0, 0, 7], fov: 48 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <ParticleScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
