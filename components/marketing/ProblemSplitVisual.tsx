'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Mail,
  Calendar,
  Monitor,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fragmented = [
  { icon: FileText, label: 'PDFs & files' },
  { icon: Mail, label: 'Inbox' },
  { icon: Calendar, label: 'Calendars' },
  { icon: Monitor, label: 'Screens' },
  { icon: MessageSquare, label: 'Chat' },
];

export function ProblemSplitVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10',
        className
      )}
    >
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
        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fragmented.map((item, i) => {
            const Icon = item.icon;
            const rot = [-2, 1.5, -1.2, 2, -1.5][i] ?? 0;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i, duration: 0.35 }}
                style={{ transform: `rotate(${rot}deg)` }}
                className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
              >
                <Icon className="h-5 w-5 text-neutral-500" strokeWidth={1.5} />
                <p className="mt-2 text-[11px] font-medium leading-tight text-neutral-700">
                  {item.label}
                </p>
              </motion.div>
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
          {['Public signage', 'Wayfinding & maps', 'Portal & access', 'Reporting'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
              className="relative mb-4 flex items-center gap-3 last:mb-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                <Layers className="h-4 w-4 text-neutral-600" />
              </div>
              <div className="flex-1 rounded-lg border border-neutral-100 bg-neutral-50/90 px-3 py-2.5">
                <p className="text-sm font-medium text-neutral-900">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
