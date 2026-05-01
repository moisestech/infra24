'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const SCRIPT = [
  '$ knight-cli session open --packet infra24',
  '→ resolving knight.packet … OK',
  '→ TLS 1.3 · session pinned',
  'authenticated · visitor · read-only',
  'connected · idle',
] as const;

type Props = { reduceMotion: boolean };

/**
 * Decorative CLI-style typing in the packet banner. Single timeout chain (no rAF),
 * loops slowly after completion. `prefers-reduced-motion`: full text, static cursor.
 */
export function KnightBannerTerminal({ reduceMotion }: Props) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    if (reduceMotion) {
      clearTimers();
      setCompletedLines([...SCRIPT]);
      setDraft('');
      return clearTimers;
    }

    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(id);
    };

    const startCycle = () => {
      lineIdx = 0;
      charIdx = 0;
      setCompletedLines([]);
      setDraft('');

      const tick = () => {
        if (cancelled) return;

        if (lineIdx >= SCRIPT.length) {
          schedule(startCycle, 14_000);
          return;
        }

        const full = SCRIPT[lineIdx];
        if (charIdx < full.length) {
          const ch = full[charIdx];
          charIdx += 1;
          setDraft(full.slice(0, charIdx));
          const delay = ch === ' ' ? 16 : /[.…→]/.test(ch) ? 55 : 24;
          schedule(tick, delay);
          return;
        }

        setCompletedLines((prev) => [...prev, full]);
        setDraft('');
        lineIdx += 1;
        charIdx = 0;
        schedule(tick, lineIdx >= SCRIPT.length ? 0 : 420);
      };

      schedule(tick, 520);
    };

    clearTimers();
    startCycle();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [reduceMotion]);

  const tailLine =
    draft || (completedLines.length ? completedLines[completedLines.length - 1] : '');
  const displayComplete =
    draft !== ''
      ? completedLines
      : completedLines.length > 0
        ? completedLines.slice(0, -1)
        : [];
  const showTail = draft !== '' || completedLines.length > 0;

  return (
    <div
      className={cn(
        'knight-banner-terminal pointer-events-none absolute bottom-3 left-3 z-[7] max-w-[min(92vw,22rem)] rounded-md border px-3 py-2 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4 sm:max-w-[24rem] sm:px-3.5 sm:py-2.5'
      )}
      aria-hidden
    >
      <div className="knight-banner-terminal__chrome mb-1 font-mono text-[9px] uppercase tracking-[0.14em] opacity-70">
        knight.packet · session
      </div>
      <div className="knight-banner-terminal__body font-mono text-[10px] leading-snug sm:text-[11px]">
        {displayComplete.map((line, i) => (
          <div key={`${i}-${line.slice(0, 12)}`} className="whitespace-pre-wrap break-all">
            {line}
          </div>
        ))}
        {showTail && (
          <div className="whitespace-pre-wrap break-all">
            <span>{tailLine}</span>
            <span
              className={cn(
                'knight-banner-terminal__cursor ml-px inline-block translate-y-px font-semibold',
                reduceMotion && 'knight-banner-terminal__cursor--static'
              )}
              aria-hidden
            >
              ▍
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
