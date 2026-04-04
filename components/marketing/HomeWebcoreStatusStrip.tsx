'use client';

import { WebcoreIcon, type WebcoreIconName } from '@/components/marketing/webcore-lucide';
import { cn } from '@/lib/utils';

export type WebcoreStatusItem = {
  icon: WebcoreIconName;
  label: string;
};

type HomeWebcoreStatusStripProps = {
  items: readonly WebcoreStatusItem[];
  className?: string;
};

export function HomeWebcoreStatusStrip({ items, className }: HomeWebcoreStatusStripProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--cdc-border)]/80 bg-white/30 px-1 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500 backdrop-blur-[1px] sm:gap-x-6 sm:text-[11px]',
        className
      )}
      role="list"
    >
      {items.map((item, i) => (
        <span key={item.label} className="inline-flex items-center gap-2" role="listitem">
          {i > 0 && (
            <span className="hidden text-neutral-300 sm:inline" aria-hidden>
              {'//'}
            </span>
          )}
          <WebcoreIcon
            name={item.icon}
            className="h-3.5 w-3.5 shrink-0 text-[var(--cdc-teal)] sm:h-4 sm:w-4"
          />
          <span className="text-neutral-600">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
