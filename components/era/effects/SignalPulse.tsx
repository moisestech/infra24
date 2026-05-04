'use client';

import { useEffect, useRef } from 'react';
import { eraAccent } from '@/lib/era/tokens';
import { cn } from '@/lib/utils';
import { EffectFallback } from '@/components/era/effects/EffectFallback';

/**
 * Clinics channel — a signal pulse waveform.
 *
 * Implementation note: CSS Houdini Paint API is the long-term target (it
 * lets us paint pulses straight into a `background-image: paint(...)`),
 * but worklet support is still Chromium-only (no Safari/Firefox), so the
 * primary renderer is Canvas2D with `prefers-reduced-motion` honored. A
 * future enhancement can register a paint worklet here and swap when
 * `CSS.paintWorklet` is detected without changing this file's API.
 */
export function SignalPulse({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const accent = eraAccent.clinics;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let start = performance.now();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawWave(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const cy = height / 2;
      const t = time / 1000;
      const drawPass = (alpha: number, amplitude: number, freq: number, offset: number) => {
        ctx!.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const phase = (x / width) * Math.PI * 2 * freq + t * 1.6 + offset;
          // Localized "pulse" envelope so the wave breathes rather than scrolls.
          const env = Math.exp(-Math.pow((x / width - (0.4 + Math.sin(t * 0.6) * 0.2)) * 4.2, 2));
          const y = cy + Math.sin(phase) * amplitude * (0.45 + env * 0.85);
          if (x === 0) {
            ctx!.moveTo(x, y);
          } else {
            ctx!.lineTo(x, y);
          }
        }
        ctx!.strokeStyle = accent;
        ctx!.globalAlpha = alpha;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      };

      drawPass(0.85, height * 0.18, 2.4, 0);
      drawPass(0.45, height * 0.12, 3.6, 0.6);
      drawPass(0.25, height * 0.22, 1.8, 1.2);

      // Soft pulse dot riding the dominant wave.
      const px = (Math.sin(t * 0.6) * 0.4 + 0.5) * width;
      const py = cy + Math.sin((px / width) * Math.PI * 2 * 2.4 + t * 1.6) * height * 0.18;
      const grd = ctx!.createRadialGradient(px, py, 0, px, py, 18);
      grd.addColorStop(0, `${accent}cc`);
      grd.addColorStop(1, `${accent}00`);
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(px, py, 18, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      drawWave(now - start);
      raf = window.requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(loop);
    } else {
      drawWave(0);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  if (typeof window === 'undefined') {
    return <EffectFallback accentKey="clinics" shape="pulse" className={className} />;
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
