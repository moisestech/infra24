'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { marketingHeroEngagement } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

const { artistIndex, newsletter } = marketingHeroEngagement;

export function HeroAboveFoldEngagement({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const externalAction = newsletter.formAction?.trim() ?? '';

  const onSubmit = useCallback(
    (e: FormEvent) => {
      if (externalAction) return;
      e.preventDefault();
      const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : '';
      router.push(`/newsletter${q}`);
    },
    [email, externalAction]
  );

  return (
    <div
      className={cn(
        'mt-6 flex flex-col gap-3 rounded-xl border border-[var(--cdc-border)] bg-white/60 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-4',
        className
      )}
    >
      <Link
        href={artistIndex.href}
        className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-lg border border-teal-600/25 bg-teal-50/90 px-4 text-center text-sm font-semibold text-teal-950 no-underline transition-colors hover:bg-teal-100/90 sm:min-w-[12rem] sm:justify-center"
      >
        {artistIndex.label}
      </Link>

      <form
        action={externalAction || undefined}
        method={externalAction ? 'post' : undefined}
        onSubmit={onSubmit}
        className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[16rem] sm:flex-row sm:items-center sm:gap-2"
      >
        <label htmlFor="hero-newsletter-email" className="sr-only">
          Email for newsletter
        </label>
        <input
          id="hero-newsletter-email"
          name={externalAction ? 'EMAIL' : 'email'}
          type="email"
          autoComplete="email"
          placeholder={newsletter.placeholder}
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="min-h-[2.75rem] w-full flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-inner outline-none ring-[var(--cdc-teal)] placeholder:text-neutral-400 focus:border-teal-500/40 focus:ring-2"
        />
        <button
          type="submit"
          className="min-h-[2.75rem] shrink-0 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          {newsletter.submitLabel}
        </button>
      </form>
    </div>
  );
}
