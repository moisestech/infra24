'use client'

import { useState, type FormEvent } from 'react'

type State = 'idle' | 'sending' | 'success' | 'email-fallback' | 'error'
type Props = { source?: string }

const fieldClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-3 text-sm text-neutral-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-100'

export function CharacterLabInterestForm({ source = 'direct' }: Props) {
  const [status, setStatus] = useState<State>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [mailHref, setMailHref] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const fd = new FormData(event.currentTarget)
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      practice: String(fd.get('practice') ?? ''),
      format: String(fd.get('format') ?? ''),
      motivation: String(fd.get('motivation') ?? ''),
      consent: fd.get('consent') === 'on',
      source,
      website: String(fd.get('website') ?? ''),
    }
    const body = [
      'DCC Character Lab — expression of interest',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Practice: ${payload.practice}`,
      `Preferred format: ${payload.format}`,
      `What I would like to make: ${payload.motivation}`,
      `How I heard: ${payload.source}`,
      'I agree that DCC may contact me about Character Lab.',
    ].join('\n')
    setMailHref(
      `mailto:m@moises.tech?subject=${encodeURIComponent('DCC Character Lab — interest')}&body=${encodeURIComponent(body)}`
    )

    try {
      const response = await fetch('/api/dcc/character-lab-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const json = (await response.json()) as { error?: string; fallback?: boolean }
        if (json.fallback) {
          setStatus('email-fallback')
          return
        }
        throw new Error(json.error || 'Could not save your interest.')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Could not save your interest.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl border border-teal-300 bg-teal-50 p-6 text-teal-950 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-100">
        <h3 className="text-xl font-semibold">Interest received.</h3>
        <p className="mt-2 text-sm leading-relaxed">Thanks for being part of the conversation. We will contact you if the proposed pilot takes shape. No dates, admission, or seat have been promised.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="character-name" className={labelClass}>Name <span aria-hidden="true">*</span></label>
          <input id="character-name" name="name" autoComplete="name" required minLength={2} maxLength={120} className={fieldClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="character-email" className={labelClass}>Email <span aria-hidden="true">*</span></label>
          <input id="character-email" name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="character-practice" className={labelClass}>Your practice (optional)</label>
          <select id="character-practice" name="practice" className={fieldClass} defaultValue="">
            <option value="">Select a description</option>
            <option>Artist / performer</option>
            <option>Filmmaker / animator</option>
            <option>3D / game / VR creator</option>
            <option>Educator / curator</option>
            <option>Curious beginner</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="character-format" className={labelClass}>Format you would consider</label>
          <select id="character-format" name="format" className={fieldClass} defaultValue="">
            <option value="">No preference yet</option>
            <option>Online preparation + in-person lab</option>
            <option>Online-only participation</option>
            <option>In-person creative lab</option>
            <option>Interested as an organization / partner</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="character-motivation" className={labelClass}>What would you want to make or explore? (optional)</label>
        <textarea id="character-motivation" name="motivation" rows={3} maxLength={800} className={fieldClass} placeholder="A virtual self-portrait, a character, a performance, a short film..." />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="character-website">Leave this blank</label>
        <input id="character-website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>
      <label className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
        <input type="checkbox" name="consent" required className="mt-1 accent-teal-700" />
        <span>I agree DCC Miami may contact me about Character Lab. This is not a workshop booking, newsletter subscription, or consent to publish my profile or artwork.</span>
      </label>
      {status === 'email-fallback' ? (
        <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          Online storage is unavailable right now. Nothing was saved. <a className="font-semibold underline" href={mailHref}>Open your email app and send this inquiry</a> to reach DCC instead.
        </div>
      ) : null}
      {status === 'error' ? (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-950 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100">
          {errorMessage} <a className="font-semibold underline" href={mailHref}>Send the inquiry by email instead.</a>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-teal-400 dark:text-neutral-950"
      >
        {status === 'sending' ? 'Sending…' : 'Express interest'}
      </button>
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Only an expression of interest. No payment, place, instructor agreement, venue, or date is confirmed.
      </p>
    </form>
  )
}
