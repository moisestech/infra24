'use client';

import { useState } from 'react';
import { Terminal } from 'lucide-react';

import { cn } from '@/lib/utils';

export type HomeFaqWebcoreItem = {
  question: string;
  answer: string;
  readout: string;
  hints: readonly string[];
};

type HomeFaqWebcoreListProps = {
  items: readonly HomeFaqWebcoreItem[];
  className?: string;
};

export function HomeFaqWebcoreList({ items, className }: HomeFaqWebcoreListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className={cn('space-y-8', className)}>
      {items.map((item, index) => {
        const panelId = `faq-readout-${index}`;
        const triggerId = `faq-readout-tr-${index}`;
        const open = openIndex === index;

        return (
          <div key={item.question}>
            <dt className="flex gap-2.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="select-none font-mono text-[var(--cdc-teal)]" aria-hidden>
                {'>'}
              </span>
              <span>{item.question}</span>
            </dt>
            <dd className="mt-2 border-l border-[var(--cdc-border)] pl-4 sm:ml-1 sm:pl-5">
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{item.answer}</p>
              <button
                type="button"
                id={triggerId}
                className="mt-3 flex w-full max-w-xl items-center justify-center gap-2 border border-dashed border-[var(--cdc-border)] bg-neutral-950/[0.02] px-3 py-2 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)] transition-colors hover:bg-neutral-950/[0.05] dark:bg-white/[0.04] dark:hover:bg-white/[0.07] sm:max-w-2xl"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex((i) => (i === index ? null : index))}
              >
                <Terminal className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                <span>{open ? 'hide technical.readout' : 'technical.readout'}</span>
              </button>
              {open && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="mt-2 max-w-2xl border border-[var(--cdc-border)] bg-[#0f172a]/[0.03] px-4 py-3 dark:bg-neutral-950/80"
                >
                  <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.readout}
                  </p>
                  <ul className="mt-2 space-y-1 font-mono text-[9px] leading-snug text-neutral-500 dark:text-neutral-500">
                    {item.hints.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
