'use client'
import { useState, type FormEvent } from 'react'
export default function RsvpForm() {
  const [status, setStatus] = useState<'going' | 'maybe'>('going')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setMessage('')
    const form = new FormData(e.currentTarget)
    try {
      const response = await fetch('/api/events/fiu-ratcliffe/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), email: form.get('email'), website: form.get('website'), status }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Please try again')
      setDone(true); setMessage(result.message)
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Please try again') }
    finally { setLoading(false) }
  }
  if (done) return <div role="status" className="rounded-2xl border border-teal-300 bg-teal-50 p-5 text-teal-950"><h3 className="text-lg font-semibold">Check your inbox</h3><p className="mt-2 text-sm">{message}</p></div>
  return <form onSubmit={submit} className="space-y-4" aria-label="Event RSVP">
    <fieldset><legend className="mb-2 text-sm font-semibold">Will you join us?</legend><div className="grid grid-cols-2 gap-2">{(['going','maybe'] as const).map(choice => <button type="button" key={choice} aria-pressed={status === choice} onClick={() => setStatus(choice)} className={'min-h-12 rounded-xl border px-3 font-semibold ' + (status === choice ? 'border-teal-700 bg-teal-700 text-white' : 'border-neutral-300')}>{choice === 'going' ? '✓ Going' : '◌ Maybe'}</button>)}</div></fieldset>
    <label className="block text-sm font-medium">Your name<input name="name" required minLength={2} maxLength={120} autoComplete="name" className="mt-1 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-neutral-900" /></label>
    <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className="mt-1 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-neutral-900" /></label>
    <input name="website" type="text" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden="true" />
    <button disabled={loading} className="min-h-12 w-full rounded-full bg-teal-700 px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Submitting…' : 'RSVP · Free'}</button>
    <p className="text-xs text-neutral-600 dark:text-neutral-400">We’ll email a confirmation link. RSVP does not subscribe you to the DCC network.</p>
    {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
  </form>
}
