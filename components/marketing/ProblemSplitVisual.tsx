'use client';

import { motion } from 'framer-motion';
import { Monitor, MessageSquare, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

type FragmentTile =
  | {
      kind: 'artifact';
      variant: 'pdf' | 'calendar' | 'inbox';
      title: string;
      subtitle: string;
    }
  | {
      kind: 'icon';
      icon: typeof Monitor;
      label: string;
    };

const fragmented: FragmentTile[] = [
  {
    kind: 'artifact',
    variant: 'pdf',
    title: 'visitor_guide_draft_v9.pdf',
    subtitle: 'Exported · not linked to live hours',
  },
  {
    kind: 'artifact',
    variant: 'calendar',
    title: 'events_calendar_staff.xlsx',
    subtitle: 'Row 14 · “TBD” still showing',
  },
  {
    kind: 'artifact',
    variant: 'inbox',
    title: 'Re: which lobby screen?',
    subtitle: 'Thread #4 · no owner',
  },
  { kind: 'icon', icon: Monitor, label: 'Screen playlist' },
  { kind: 'icon', icon: MessageSquare, label: 'Slack / chat' },
];

function ArtifactCard({
  variant,
  title,
  subtitle,
}: {
  variant: 'pdf' | 'calendar' | 'inbox';
  title: string;
  subtitle: string;
}) {
  const badge =
    variant === 'pdf'
      ? { text: 'PDF', className: 'bg-red-100 text-red-800' }
      : variant === 'calendar'
        ? { text: 'XLS', className: 'bg-emerald-100 text-emerald-800' }
        : { text: 'MSG', className: 'bg-amber-100 text-amber-900' };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-sm">
      <div className="flex items-start gap-2 border-b border-neutral-100 pb-2">
        <span
          className={cn(
            'shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide',
            badge.className
          )}
        >
          {badge.text}
        </span>
        <p className="min-w-0 break-all font-mono text-[10px] leading-tight text-neutral-800">
          {title}
        </p>
      </div>
      <p className="mt-2 font-mono text-[9px] leading-snug text-neutral-500">{subtitle}</p>
    </div>
  );
}

export function ProblemSplitVisual({ className }: { className?: string }) {
  return (
    <div className={cn('mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10', className)}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl border border-dashed border-neutral-300 bg-neutral-100/60 p-6 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Fragmented inputs
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          The same truth copied across channels—none of them authoritative.
        </p>
        <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fragmented.map((item, i) => {
            const rot = [-1.2, 1.4, -0.8, 1.8, -1.4][i] ?? 0;
            if (item.kind === 'artifact') {
              return (
                <div
                  key={item.title}
                  style={{ transform: `rotate(${rot}deg)` }}
                  className="sm:col-span-1"
                >
                  <ArtifactCard
                    variant={item.variant}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </div>
              );
            }
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{ transform: `rotate(${rot}deg)` }}
                className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm sm:col-span-1"
              >
                <Icon className="h-5 w-5 text-neutral-500" strokeWidth={1.5} />
                <p className="mt-2 text-[11px] font-medium leading-tight text-neutral-700">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.12)] sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-700">
          One public layer
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Signs, maps, portals, and workflows aligned to a single updateable structure.
        </p>

        <div className="relative mx-auto mt-10 max-w-sm">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200" />
          {['Public signage', 'Wayfinding & maps', 'Portal & access', 'Reporting'].map((label) => (
            <div key={label} className="relative mb-4 flex items-center gap-3 last:mb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                <Layers className="h-4 w-4 text-neutral-600" />
              </div>
              <div className="flex-1 rounded-lg border border-neutral-100 bg-neutral-50/90 px-3 py-2.5">
                <p className="text-sm font-medium text-neutral-900">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
