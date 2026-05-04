'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { marketingHeroEngagement } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

const { newsletter } = marketingHeroEngagement;

type NewsletterPageFormProps = {
  initialEmail?: string;
  /** Merged onto the root form (e.g. `mt-0 max-w-none` when inside a card). */
  className?: string;
};

export function NewsletterPageForm({ initialEmail = '', className }: NewsletterPageFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const externalAction = newsletter.formAction?.trim() ?? '';

  const inputClass =
    'mt-2 w-full rounded-lg border border-neutral-200 bg-white/95 px-3 py-3 text-sm text-neutral-900 shadow-inner outline-none transition placeholder:text-neutral-400 focus:border-teal-500/60 focus:ring-2 focus:ring-[var(--cdc-teal)] focus:ring-offset-2 focus:ring-offset-white dark:border-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-teal-400/50 dark:focus:ring-offset-[rgb(10_14_26)]';

  const labelClass =
    'flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-100';

  const submitClass = 'newsletter-submit-btn';

  if (externalAction) {
    return (
      <form action={externalAction} method="post" className={cn('mt-8 max-w-md space-y-5', className)}>
        <div>
          <label htmlFor="newsletter-email-ext" className={labelClass}>
            <Mail className="h-4 w-4 shrink-0 text-[var(--cdc-teal)]" aria-hidden />
            Email
          </label>
          <input
            id="newsletter-email-ext"
            name="EMAIL"
            type="email"
            required
            autoComplete="email"
            defaultValue={initialEmail}
            placeholder={newsletter.placeholder}
            className={inputClass}
          />
        </div>
        <button type="submit" className={submitClass}>
          {newsletter.submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form
      className={cn('mt-8 max-w-md space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="newsletter-email" className={labelClass}>
          <Mail className="h-4 w-4 shrink-0 text-[var(--cdc-teal)]" aria-hidden />
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletter.placeholder}
          className={inputClass}
        />
      </div>
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Set{' '}
        <code className="rounded-md border border-neutral-200/80 bg-neutral-100/90 px-1.5 py-0.5 font-mono text-[11px] text-neutral-800 dark:border-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-200">
          NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION
        </code>{' '}
        to your list provider&apos;s form <code className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">action</code>{' '}
        URL (POST). Until then, submit only acknowledges interest on this page.
      </p>
      <button type="submit" className={submitClass}>
        {newsletter.submitLabel}
      </button>
      {submitted ? (
        <p
          className="rounded-lg border border-teal-500/25 bg-teal-50/90 px-3 py-2.5 text-sm font-medium text-teal-900 dark:border-teal-400/20 dark:bg-teal-950/40 dark:text-teal-100"
          role="status"
        >
          Thanks—we&apos;ll use this address once the list is connected{email ? ` (${email})` : ''}.
        </p>
      ) : null}
    </form>
  );
}
