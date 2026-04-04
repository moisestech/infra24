'use client';

import { useReducedMotion } from 'framer-motion';
import { Marquee } from '@/components/magicui/marquee';
import { WebcoreIcon, type WebcoreIconName } from '@/components/marketing/webcore-lucide';
import { cn } from '@/lib/utils';

type MarqueeEntry = { label: string; icon: WebcoreIconName };

type HomeDigitalMarqueeBandProps = {
  items: readonly MarqueeEntry[];
  className?: string;
};

function MarqueeItem({ label, icon }: MarqueeEntry) {
  return (
    <span className="mx-6 inline-flex items-center gap-2 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
      <WebcoreIcon
        name={icon}
        className="h-3.5 w-3.5 shrink-0 text-[var(--cdc-teal)] opacity-90"
      />
      {label}
    </span>
  );
}

export function HomeDigitalMarqueeBand({ items, className }: HomeDigitalMarqueeBandProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={cn(
          'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-[var(--cdc-border)] bg-white/75 px-4 py-3 backdrop-blur-sm',
          className
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-2 gap-y-2">
          {items.map((entry) => (
            <MarqueeItem key={entry.label} {...entry} />
          ))}
        </div>
      </div>
    );
  }

  const nodes = items.map((entry) => <MarqueeItem key={entry.label} {...entry} />);

  return (
    <div
      className={cn(
        'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-[var(--cdc-border)] bg-white/75 py-2.5 backdrop-blur-sm',
        className
      )}
    >
      <Marquee pauseOnHover className="[--duration:48s] [--gap:0.5rem]">
        {nodes}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:56s] [--gap:0.5rem]">
        {nodes}
      </Marquee>
    </div>
  );
}
