'use client';

import { useState } from 'react';

export const marketingContactInterestOptions = [
  { value: 'audit', label: 'Communication Infrastructure Audit' },
  { value: 'consultation', label: 'General consultation' },
  { value: 'pilot', label: 'Pilot discussion' },
  { value: 'knight-pilot', label: 'Miami pilot — partner site discussion' },
  { value: 'knight-brief', label: 'Miami pilot — request project brief' },
] as const;

export type MarketingContactInterest =
  (typeof marketingContactInterestOptions)[number]['value'];

type ContactFormProps = {
  defaultInterest?: MarketingContactInterest;
};

export function ContactForm({ defaultInterest = 'consultation' }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [interest, setInterest] = useState<string>(defaultInterest);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      organization: String(fd.get('organization') || ''),
      message: String(fd.get('message') || ''),
      interest,
    };

    try {
      const res = await fetch('/api/marketing/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      if (data.fallback && typeof window !== 'undefined') {
        const subject = encodeURIComponent(`Infra24 inquiry: ${interest}`);
        const body = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nOrganization: ${payload.organization}\nInterest: ${interest}\n\n${payload.message}`
        );
        const to = 'm@moises.tech';
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      }
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-neutral-800">
          I am interested in
        </label>
        <select
          id="interest"
          name="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
        >
          {marketingContactInterestOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-800">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-800">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-neutral-800">
          Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-800">
          What should we know?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Context, timelines, surfaces you care about (web, lobby screens, maps, etc.)"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? 'Sending…' : 'Submit inquiry'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-green-800" role="status">
          Thank you. If email did not open automatically, we will follow up from your message.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong. Please email directly or try again.
        </p>
      )}
    </form>
  );
}
