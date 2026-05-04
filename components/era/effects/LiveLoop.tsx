'use client';

import { useEffect, useRef } from 'react';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

/**
 * Open Lab channel — generative loop sketch evoking "what's on the studio
 * monitor right now". Soft Lissajous bands stacked over each other; the
 * value is that no two viewings are identical. p5 can replace this if we
 * want to host external sketches; native canvas keeps the bundle thin.
 */
export function LiveLoop({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const accent = eraAccent.openLab;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    const start = performance.now();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      const t = time / 1000;
      // Trail effect: light overdraw with low alpha for "screen burn" feel.
      ctx!.fillStyle = 'rgba(10,10,10,0.08)';
      ctx!.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radiusBase = Math.min(width, height) * 0.32;

      const passes = 5;
      for (let p = 0; p < passes; p += 1) {
        const k = p / (passes - 1);
        const a = 1.5 + Math.sin(t * 0.4 + p) * 0.6;
        const b = 2.5 + Math.cos(t * 0.3 + p * 0.7) * 0.6;
        ctx!.beginPath();
        const samples = 220;
        for (let i = 0; i <= samples; i += 1) {
          const u = (i / samples) * Math.PI * 2;
          const r = radiusBase * (0.6 + 0.4 * Math.sin(t * 0.5 + p));
          const x = cx + r * Math.sin(a * u + t * 0.6 + p);
          const y = cy + r * Math.sin(b * u + t * 0.4 + p * 0.4);
          if (i === 0) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }
        ctx!.strokeStyle = accent;
        ctx!.globalAlpha = 0.18 + k * 0.5;
        ctx!.lineWidth = 0.9 + k * 1.2;
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      draw(now - start);
      raf = window.requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    // Prime the trail buffer with one solid clear so the first frames don't ghost.
    ctx!.fillStyle = 'rgba(10,10,10,1)';
    ctx!.fillRect(0, 0, width, height);
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(loop);
    } else {
      draw(0);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="openLab" shape="loop" className={className} />;
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] bg-neutral-950',
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
