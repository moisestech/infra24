'use client';

import { useState } from 'react';
import { publisherFaqs } from '@/lib/playwire/publisherFaqs';
import { pw } from './playwireTheme';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function PublisherFaqPanel() {
  const [openId, setOpenId] = useState<string | null>(publisherFaqs[0]?.id ?? null);

  return (
    <div className="space-y-2" data-theme="playwire">
      {publisherFaqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className={pw.card}>
            <button
              type="button"
              className={cn(
                'flex w-full items-start justify-between gap-3 p-4 text-left',
                pw.navy,
              )}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold leading-snug">{faq.question}</span>
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 transition-transform', pw.navyMuted, isOpen && 'rotate-180')}
                aria-hidden
              />
            </button>
            {isOpen ? (
              <p className={cn('border-t border-[#1a2b4a]/8 px-4 pb-4 pt-2 text-sm leading-relaxed dark:border-[#2d4a7c]/25', pw.navyMuted)}>
                {faq.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
