'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

import type { CardGridItem } from '@/components/marketing/cdc/CardGrid';
import { homePathwayTechnical } from '@/lib/marketing/home-pathway-technical';
import { cn } from '@/lib/utils';

function slugFromHref(href: string) {
  return href.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'path';
}

type HomePathwayWebcoreGridProps = {
  items: CardGridItem[];
  className?: string;
  columnsClassName?: string;
};

export function HomePathwayWebcoreGrid({
  items,
  className,
  columnsClassName,
}: HomePathwayWebcoreGridProps) {
  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        columnsClassName,
        className
      )}
    >
      {items.map((item) => (
        <li key={item.href}>
          <PathwayCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function PathwayCard({ item }: { item: CardGridItem }) {
  const reactId = useId();
  const base = slugFromHref(item.href);
  const panelId = `path-tech-${base}-${reactId}`;
  const triggerId = `path-tech-tr-${base}-${reactId}`;
  const [open, setOpen] = useState(false);

  const tech =
    homePathwayTechnical[item.href as keyof typeof homePathwayTechnical] ?? null;

  return (
    <div
      className={cn(
        'cdc-webcore-path-card flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm',
        open && 'ring-1 ring-[var(--cdc-teal)]/25'
      )}
    >
      <Link
        href={item.href}
        className="group/link flex flex-1 flex-col p-5 pb-3 transition-colors hover:bg-white/95"
      >
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-neutral-900">{item.title}</span>
          <ArrowRight
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 transition-colors duration-200 group-hover/link:text-[var(--cdc-teal)]"
            aria-hidden
          />
        </span>
        <p className="cdc-webcore-path-desc mt-2 text-sm leading-relaxed text-neutral-600 transition-[color,transform] duration-200 group-hover/link:text-neutral-800 group-hover/link:[text-shadow:0_0_0.6px_rgba(15,23,42,0.12)] sm:group-hover/link:translate-x-px">
          {item.description}
        </p>
      </Link>

      {tech && (
        <>
          <button
            type="button"
            id={triggerId}
            className="flex w-full items-center justify-center gap-2 border-t border-dashed border-[var(--cdc-border)] bg-neutral-950/[0.02] px-3 py-2.5 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)] transition-colors hover:bg-neutral-950/[0.05]"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((o) => !o)}
          >
            <Terminal className="h-3.5 w-3.5 opacity-80" aria-hidden />
            <span>{open ? 'hide technical.readout' : 'technical.readout'}</span>
          </button>
          {open && (
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="border-t border-[var(--cdc-border)] bg-[#0f172a]/[0.03] px-4 py-3"
            >
              <p className="text-[11px] leading-relaxed text-neutral-600">{tech.layer}</p>
              <ul className="mt-2 space-y-1 font-mono text-[9px] leading-snug text-neutral-500">
                {tech.hints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
