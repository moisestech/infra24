'use client';

import { useState } from 'react';
import { marketingHeroEngagement } from '@/lib/marketing/content';

const { newsletter } = marketingHeroEngagement;

export function NewsletterPageForm({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(false);
  const externalAction = newsletter.formAction?.trim() ?? '';

  if (externalAction) {
    return (
      <form action={externalAction} method="post" className="mt-8 max-w-md space-y-4">
        <div>
          <label htmlFor="newsletter-email-ext" className="text-sm font-medium text-neutral-800">
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
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-inner outline-none focus:border-teal-500/40 focus:ring-2 focus:ring-[var(--cdc-teal)]"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {newsletter.submitLabel}
        </button>
      </form>
    );
  }

  return (
    <form
      className="mt-8 max-w-md space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="newsletter-email" className="text-sm font-medium text-neutral-800">
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
          className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-inner outline-none focus:border-teal-500/40 focus:ring-2 focus:ring-[var(--cdc-teal)]"
        />
      </div>
      <p className="text-xs text-neutral-500">
        Set{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px]">
          NEXT_PUBLIC_MARKETING_NEWSLETTER_FORM_ACTION
        </code>{' '}
        to your list provider&apos;s form <code className="font-mono text-[11px]">action</code> URL
        (POST). Until then, submit only acknowledges interest on this page.
      </p>
      <button
        type="submit"
        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        {newsletter.submitLabel}
      </button>
      {submitted ? (
        <p className="text-sm font-medium text-teal-800" role="status">
          Thanks—we&apos;ll use this address once the list is connected{email ? ` (${email})` : ''}.
        </p>
      ) : null}
    </form>
  );
}
