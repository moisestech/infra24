'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { OfferLink } from './OfferLink';
import { cn } from '@/lib/utils';

export type CurriculumModule = {
  id: string;
  title: string;
  promise: string;
  audience: string;
  formats: readonly string[];
  artifact: string;
  takeHome: string;
  equipment: string;
  options: readonly string[];
  href: string;
  image?: { src: string; alt: string };
};

export function CurriculumModuleCard({
  module,
  defaultOpen = false,
}: {
  module: CurriculumModule;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const rows = [
    { label: 'Audience', value: module.audience },
    { label: 'Formats', value: module.formats.join(' · ') },
    { label: 'What they make', value: module.artifact },
    { label: 'Take home', value: module.takeHome },
    { label: 'Equipment', value: module.equipment },
    { label: 'Options', value: module.options.join(' · ') },
  ];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {module.image ? (
        <OfferLink
          href={module.href}
          className="relative block aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-800"
          aria-label={`Open ${module.title}`}
        >
          <Image
            src={module.image.src}
            alt={module.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </OfferLink>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-3 p-5 text-left sm:p-6"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="min-w-0 flex-1">
          <p className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Module
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
            {module.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{module.promise}</p>
          <p className="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {open ? 'Hide details' : 'Expand · audience, formats, take-homes'}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'mt-1 h-5 w-5 shrink-0 text-neutral-400 transition',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div id={panelId} className="border-t border-neutral-100 px-5 pb-5 dark:border-neutral-800 sm:px-6 sm:pb-6">
          <dl className="space-y-3 pt-4">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="cdc-font-mono-accent text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{row.value}</dd>
              </div>
            ))}
          </dl>
          <OfferLink
            href={module.href}
            className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Open {module.title}
          </OfferLink>
        </div>
      ) : null}
    </article>
  );
}
