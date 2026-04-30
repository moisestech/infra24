/**
 * Sticky jump rail for `/knight` and `/knight/budget`:
 * - Pins below the marketing header using a fixed `top` offset.
 * - Highlights the active section with IntersectionObserver (scroll-spy).
 */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { knightPacketNavItems } from '@/lib/marketing/knight-nav';
import { cn } from '@/lib/utils';

export type KnightPacketNavItem = { href: string; label: string };

const STICKY_NAV_TOP_PX = 88;
const SUBNAV_HEIGHT_EST_PX = 48;
const SCROLL_SPY_TOP_PX = STICKY_NAV_TOP_PX + SUBNAV_HEIGHT_EST_PX;

const IO_THRESHOLDS = [
  0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8,
  0.85, 0.9, 0.95, 1,
] as const;

type KnightPacketNavProps = {
  className?: string;
  /** Custom anchors (e.g. budget page). Defaults to `/knight` packet rail. */
  items?: readonly KnightPacketNavItem[];
};

function sectionIdFromHref(href: string) {
  return href.replace(/^#/, '');
}

export function KnightPacketNav({ className, items: itemsProp }: KnightPacketNavProps) {
  const items = itemsProp ?? knightPacketNavItems;
  const sectionIds = useMemo(() => items.map((item) => sectionIdFromHref(item.href)), [items]);

  const [activeId, setActiveId] = useState<string>(() => sectionIds[0] ?? '');
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setActiveId(sectionIds[0] ?? '');
  }, [sectionIds]);

  const pickActiveFromRatios = useCallback(() => {
    let bestId = sectionIds[0] ?? '';
    let bestR = -1;
    for (const id of sectionIds) {
      const r = ratiosRef.current[id] ?? 0;
      if (r > bestR) {
        bestR = r;
        bestId = id;
      }
    }
    if (bestR > 0.001) {
      setActiveId(bestId);
    }
  }, [sectionIds]);

  useEffect(() => {
    sectionIds.forEach((id) => {
      ratiosRef.current[id] = 0;
    });

    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio;
        }
        pickActiveFromRatios();
      },
      {
        root: null,
        rootMargin: `-${SCROLL_SPY_TOP_PX}px 0px -38% 0px`,
        threshold: [...IO_THRESHOLDS],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, pickActiveFromRatios]);

  useEffect(() => {
    const lastId = sectionIds[sectionIds.length - 1];
    if (!lastId) return;

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom) setActiveId(lastId);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds]);

  return (
    <nav
      aria-label="On this page"
      style={{ top: STICKY_NAV_TOP_PX }}
      className={cn(
        'sticky z-40 border-b border-neutral-200/90 bg-[#fafafa]/92 py-2 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/92 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.65)]',
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-0.5 pt-0.5 sm:px-6 lg:px-8">
        <span className="mr-1 hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 sm:inline">
          Jump to
        </span>
        {items.map((item) => {
          const id = sectionIdFromHref(item.href);
          const isActive = activeId === id;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'border-teal-400/50 bg-teal-50 text-teal-900 shadow-sm dark:border-teal-500/35 dark:bg-teal-950/50 dark:text-teal-100'
                  : 'border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
              )}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
