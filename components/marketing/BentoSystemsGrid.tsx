'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  bentoLayouts,
  bentoPhotoSrc,
  type BentoVisualKind,
} from '@/lib/marketing/homepage-visuals';

type Capability = {
  title: string;
  description: string;
  href: string;
};

const placements = [
  'lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1',
  'lg:col-span-1 lg:row-span-1 lg:col-start-3 lg:row-start-1',
  'lg:col-span-1 lg:row-span-1 lg:col-start-4 lg:row-start-1',
  'lg:col-span-1 lg:row-span-1 lg:col-start-3 lg:row-start-2',
  'lg:col-span-1 lg:row-span-1 lg:col-start-4 lg:row-start-2',
  'lg:col-span-4 lg:row-span-1 lg:col-start-1 lg:row-start-3',
] as const;

function VisualBlock({
  visual,
  capabilityIndex,
}: {
  visual: BentoVisualKind;
  capabilityIndex: number;
}) {
  const photo = bentoPhotoSrc[capabilityIndex];

  if (visual === 'photo' && photo) {
    return (
      <div className="relative h-24 w-full overflow-hidden rounded-md sm:h-28">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
    );
  }

  if (visual === 'ui') {
    return (
      <div className="overflow-hidden rounded-md border border-neutral-200/80 bg-gradient-to-b from-neutral-100 to-neutral-50">
        <div className="flex h-6 items-center gap-1 border-b border-neutral-200/80 bg-neutral-100/90 px-2">
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-[80%] rounded bg-neutral-200" />
          <div className="h-2 w-[60%] rounded bg-neutral-200/80" />
          <div className="h-8 rounded border border-dashed border-neutral-200 bg-white/80" />
        </div>
      </div>
    );
  }

  if (visual === 'diagram') {
    return (
      <div className="flex items-center justify-center rounded-md border border-neutral-200 bg-white p-3">
        <svg viewBox="0 0 120 56" className="h-14 w-full text-neutral-400" aria-hidden>
          <path
            d="M8 40 L40 16 L72 36 L108 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <circle cx="8" cy="40" r="4" className="fill-neutral-300" />
          <circle cx="40" cy="16" r="4" className="fill-neutral-300" />
          <circle cx="72" cy="36" r="4" className="fill-neutral-300" />
          <circle cx="108" cy="12" r="4" className="fill-neutral-800" />
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        Signals
      </p>
      <p className="mt-1 font-mono text-lg font-medium tabular-nums text-neutral-900">↑ 24%</p>
      <p className="text-[11px] text-neutral-500">Update cadence vs. baseline</p>
    </div>
  );
}

export function BentoSystemsGrid({
  capabilities,
  className,
}: {
  capabilities: readonly Capability[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 lg:gap-4',
        className
      )}
    >
      {bentoLayouts.map((cell, i) => {
        const cap = capabilities[cell.capabilityIndex];
        if (!cap) return null;
        return (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-24px' }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
            className={cn(placements[i], 'min-h-0')}
          >
            <Link
              href={cap.href}
              className="group flex h-full min-h-[140px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors hover:border-neutral-300 hover:shadow-md sm:min-h-[160px]"
            >
              <div className="relative flex-1 p-4 pb-2">
                <VisualBlock visual={cell.visual} capabilityIndex={cell.capabilityIndex} />
              </div>
              <div className="border-t border-neutral-100 p-4 pt-3">
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700">
                  {cap.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                  {cap.description}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
