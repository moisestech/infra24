'use client';

import { useEffect, useRef } from 'react';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

type KnowledgeLatticeProps = {
  /** Optional density seed — the lattice grows as the value grows. Defaults to a baseline. */
  density?: number;
  className?: string;
};

/**
 * Workshops channel — a generative lattice that "grows" with each render. Cells
 * light up in a quasi-random walk so the same canvas never looks static. Uses
 * native Canvas2D (no p5 runtime cost); p5 can replace this later if we need
 * its API surface.
 */
export function KnowledgeLattice({ density = 0.45, className }: KnowledgeLatticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const cellSize = 14;
    let cells: { row: number; col: number; lit: number }[] = [];
    let raf = 0;
    let last = performance.now();

    const accent = eraAccent.workshops;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      cells = [];
      const rows = Math.ceil(height / cellSize);
      const cols = Math.ceil(width / cellSize);
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if (Math.random() < density) {
            cells.push({ row: r, col: c, lit: Math.random() });
          }
        }
      }
    }

    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, width, height);

      // Sparse vertical scaffolding lines so the lattice reads as a grid.
      ctx!.strokeStyle = `${accent}22`;
      ctx!.lineWidth = 1;
      const cols = Math.ceil(width / cellSize);
      for (let c = 0; c <= cols; c += 4) {
        ctx!.beginPath();
        ctx!.moveTo(c * cellSize + 0.5, 0);
        ctx!.lineTo(c * cellSize + 0.5, height);
        ctx!.stroke();
      }

      // Animated cells.
      ctx!.fillStyle = accent;
      for (const cell of cells) {
        if (!reduceMotion) {
          cell.lit = Math.max(0, Math.min(1, cell.lit + (Math.random() - 0.55) * dt * 0.9));
        }
        const alpha = 0.18 + cell.lit * 0.62;
        ctx!.globalAlpha = alpha;
        const x = cell.col * cellSize + 2;
        const y = cell.row * cellSize + 2;
        const size = cellSize - 4;
        ctx!.fillRect(x, y, size * (0.5 + cell.lit * 0.5), size * 0.5);
      }
      ctx!.globalAlpha = 1;

      raf = window.requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(draw);
    } else {
      // Single static frame for reduced motion.
      draw(performance.now());
    }

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="workshops" shape="lattice" className={className} />;
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]',
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
