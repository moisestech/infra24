'use client'

import { useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { estimateFabricationRange } from '@/lib/dcc/make-estimator'

const PROCESSES = ['FDM', 'Large FDM', 'Resin', 'Scan', 'File prep', 'Consult'] as const

export function MakeRequestForm() {
  const search = useSearchParams()
  const machineId = search.get('machine') ?? undefined

  const [description, setDescription] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [process, setProcess] =
    useState<(typeof PROCESSES)[number]>('FDM')
  const [finish, setFinish] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isAssociate, setIsAssociate] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consentUpdates, setConsentUpdates] = useState(false)
  const [volumeBracket, setVolumeBracket] = useState<'small' | 'medium' | 'large'>(
    'medium'
  )
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ jobId: string; estimate: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const preview = useMemo(
    () =>
      estimateFabricationRange({
        process,
        volumeBracket,
        tier: isAssociate ? 'Associate' : 'Public',
      }),
    [process, volumeBracket, isAssociate]
  )

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/dcc/make', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          dimensions: dimensions || undefined,
          process,
          finish: finish || undefined,
          deadline: deadline || undefined,
          isAssociate,
          email,
          name,
          consentUpdates,
          machineId,
          volumeBracket,
          landingPage: typeof window !== 'undefined' ? window.location.pathname : '/make',
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
        jobId?: string
        estimate?: { label: string }
      } | null
      if (!res.ok) {
        setError(data?.error ?? 'Submit failed')
        return
      }
      setDone({
        jobId: data?.jobId ?? '',
        estimate: data?.estimate?.label ?? preview.label,
      })
    })
  }

  if (done) {
    return (
      <div className="border border-[var(--cdc-border)] bg-emerald-50 p-6 dark:bg-emerald-950/30">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Request received
        </h2>
        <p className="mt-2 font-mono text-sm text-neutral-700 dark:text-neutral-300">
          Job {done.jobId}
        </p>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{done.estimate}</p>
        <p className="mt-4 text-sm text-neutral-600">
          We&apos;ll follow up after technical review. Submitting a job is not marketing consent.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block text-sm">
        <span className="font-medium">Describe the project</span>
        <textarea
          required
          minLength={10}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 dark:bg-neutral-950"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">Dimensions (approx L×W×H)</span>
        <input
          value={dimensions}
          onChange={(e) => setDimensions(e.target.value)}
          className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 font-mono text-sm dark:bg-neutral-950"
        />
      </label>

      <fieldset className="text-sm">
        <legend className="font-medium">Process</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROCESSES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProcess(p)}
              className={`px-3 py-1.5 font-mono text-xs ${
                process === p
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border border-[var(--cdc-border)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="text-sm">
        <legend className="font-medium">Volume bracket</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['small', 'medium', 'large'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVolumeBracket(v)}
              className={`px-3 py-1.5 font-mono text-xs capitalize ${
                volumeBracket === v
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border border-[var(--cdc-border)]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium">Desired finish</span>
        <input
          value={finish}
          onChange={(e) => setFinish(e.target.value)}
          className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 dark:bg-neutral-950"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">Deadline</span>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 font-mono text-sm dark:bg-neutral-950"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isAssociate}
          onChange={(e) => setIsAssociate(e.target.checked)}
        />
        Bakehouse Associate
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 dark:bg-neutral-950"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-[var(--cdc-border)] bg-white px-3 py-2 dark:bg-neutral-950"
          />
        </label>
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={consentUpdates}
          onChange={(e) => setConsentUpdates(e.target.checked)}
        />
        <span>
          Consent to updates (optional). Submitting a fabrication request is not marketing consent.
        </span>
      </label>

      {machineId ? (
        <p className="font-mono text-xs text-neutral-500">Machine pre-selected: {machineId}</p>
      ) : null}

      <div className="border border-[var(--cdc-border)] bg-neutral-50 p-4 dark:bg-neutral-900/50">
        <p className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{preview.label}</p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  )
}
