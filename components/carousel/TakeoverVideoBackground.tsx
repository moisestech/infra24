'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TakeoverVideoBackgroundProps {
  src: string;
  label: string;
  isActive?: boolean;
  paused?: boolean;
  poster?: string;
}

/** Full-bleed muted loop for smart-sign takeover slides (same cover behavior as hero images). */
export function TakeoverVideoBackground({
  src,
  label,
  isActive = true,
  paused = false,
  poster,
}: TakeoverVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const shouldPlay = isActive && !paused;
    if (shouldPlay) {
      void el.play().catch(() => {});
      return;
    }
    el.pause();
  }, [isActive, paused, src]);

  return (
    <video
      ref={videoRef}
      key={src}
      className={cn(
        'pointer-events-none absolute inset-0 z-0',
        'h-full w-full min-h-full min-w-full max-h-none max-w-none',
        'object-cover object-center'
      )}
      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      loop
      preload="auto"
      aria-label={label}
    />
  );
}
