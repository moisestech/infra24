'use client'

import { useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FABRICATION_FINISH_LEVELS,
  FABRICATION_RATE_CARDS,
  FABRICATION_SERVICE_LANES,
  FABRICATION_WORKSHOP_BOUNDARY,
  buildPlanningEstimateNote,
  estimateQuote,
  rushPercentageForQueue,
  type FabricationRateTierId,
  type FinishLevelId,
  type QueueTierId,
  type ServiceLaneId,
} from '@/lib/dcc/fabrication'
import { ARTIST_PRODUCTION_DISCOVERY } from '@/lib/marketing/artist-production-narrative'

const PROCESSES = ['FDM', 'Large FDM', 'Resin', 'Scan', 'File prep', 'Consult'] as const

export function FabricateQuoteForm() {
  const search = useSearchParams()
  const machineId = search.get('machine') ?? undefined
  const laneParam = search.get('lane') as ServiceLaneId | null
  const finishParam = search.get('finish') as FinishLevelId | null
  const tierParam = search.get('tier') as FabricationRateTierId | null
  const hoursParam = search.get('hours')
  const gramsParam = search.get('grams')
  const laborParam = search.get('labor')
  const queueParam = search.get('queue') as QueueTierId | null

  const planningNote = (() => {
    const knownTier = FABRICATION_RATE_CARDS.some((c) => c.id === tierParam)
    if (!knownTier || !tierParam || hoursParam == null || gramsParam == null) {
      return null
    }
    const printHours = Number(hoursParam)
    const materialGrams = Number(gramsParam)
    const laborHours = laborParam != null ? Number(laborParam) : 0
    if (Number.isNaN(printHours) || Number.isNaN(materialGrams)) return null
    const queue: QueueTierId =
      queueParam === 'access' ||
      queueParam === 'standard' ||
      queueParam === 'priority' ||
      queueParam === 'rush'
        ? queueParam
        : 'standard'
    const breakdown = estimateQuote({
      tier: tierParam,
      printHours,
      materialGrams,
      laborHours: Number.isNaN(laborHours) ? 0 : laborHours,
      rushPercentage: rushPercentageForQueue(queue),
    })
    return buildPlanningEstimateNote({
      tier: tierParam,
      printHours,
      materialGrams,
      laborHours: Number.isNaN(laborHours) ? 0 : laborHours,
      queue,
      total: breakdown.total,
    })
  })()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [serviceLane, setServiceLane] = useState<ServiceLaneId>(
    laneParam && FABRICATION_SERVICE_LANES.some((l) => l.id === laneParam)
      ? laneParam
      : 'print-my-file'
  )
  const [process, setProcess] =
    useState<(typeof PROCESSES)[number]>('FDM')
  const [finishLevel, setFinishLevel] = useState<FinishLevelId>(
    finishParam && FABRICATION_FINISH_LEVELS.some((f) => f.id === finishParam)
      ? finishParam
      : 'raw'
  )
  const [fileLink, setFileLink] = useState('')
  const [description, setDescription] = useState(planningNote ?? '')
  const [dimensions, setDimensions] = useState('')
  const [deadline, setDeadline] = useState('')
  const [blocking, setBlocking] = useState('')
  const [successLooksLike, setSuccessLooksLike] = useState('')
  const [isAccessMember, setIsAccessMember] = useState(
    tierParam === 'artist_access'
  )
  const [consentUpdates, setConsentUpdates] = useState(false)
  const [volumeBracket, setVolumeBracket] = useState<'small' | 'medium' | 'large'>(
    'medium'
  )
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ jobId: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const finishLabel = useMemo(
    () => FABRICATION_FINISH_LEVELS.find((f) => f.id === finishLevel)?.label ?? finishLevel,
    [finishLevel]
  )
  const laneLabel = useMemo(
    () => FABRICATION_SERVICE_LANES.find((l) => l.id === serviceLane)?.label ?? serviceLane,
    [serviceLane]
  )

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const composed = [
        `[Lane: ${laneLabel}]`,
        `[Finish: ${finishLabel}]`,
        fileLink ? `[File: ${fileLink}]` : null,
        description,
        blocking ? `[Blocking: ${blocking}]` : null,
        successLooksLike ? `[Success: ${successLooksLike}]` : null,
      ]
        .filter(Boolean)
        .join('\n')

      const res = await fetch('/api/dcc/make', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: composed,
          dimensions: dimensions || undefined,
          process,
          finish: finishLabel,
          deadline: deadline || undefined,
          isAssociate: isAccessMember,
          email,
          name,
          consentUpdates,
          machineId,
          volumeBracket,
          landingPage:
            typeof window !== 'undefined' ? window.location.pathname : '/fabricate/quote',
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
        jobId?: string
      } | null
      if (!res.ok) {
        setError(data?.error ?? 'Submit failed')
        return
      }
      setDone({ jobId: data?.jobId ?? '' })
    })
  }

  if (done) {
    return (
      <div className="border border-[var(--cdc-border)] bg-emerald-50 p-6 dark:bg-emerald-950/30">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Quote request received
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Staff will review your file and send a transparent estimate. You cannot set your own
          price.
        </p>
        {done.jobId ? (
          <p className="mt-3 font-mono text-xs text-neutral-500">Ref: {done.jobId}</p>
        ) : null}
      </div>
    )
  }

  const field =
    'mt-1 w-full rounded-lg border border-[var(--cdc-border)] bg-white px-3 py-2.5 text-sm dark:bg-neutral-950'

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
        {FABRICATION_WORKSHOP_BOUNDARY}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Name</span>
          <input
            required
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Email</span>
          <input
            required
            type="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">Service lane</span>
        <select
          className={field}
          value={serviceLane}
          onChange={(e) => setServiceLane(e.target.value as ServiceLaneId)}
        >
          {FABRICATION_SERVICE_LANES.map((lane) => (
            <option key={lane.id} value={lane.id}>
              {lane.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Process</span>
          <select
            className={field}
            value={process}
            onChange={(e) => setProcess(e.target.value as (typeof PROCESSES)[number])}
          >
            {PROCESSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Finish level</span>
          <select
            className={field}
            value={finishLevel}
            onChange={(e) => setFinishLevel(e.target.value as FinishLevelId)}
          >
            {FABRICATION_FINISH_LEVELS.map((f) => (
              <option key={f.id} value={f.id}>
                L{f.level} — {f.label}
                {!f.inHouse ? ' (custom quote)' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          File link (Drive, Dropbox, etc.)
        </span>
        <input
          className={field}
          placeholder="https://"
          value={fileLink}
          onChange={(e) => setFileLink(e.target.value)}
        />
        <span className="mt-1 block text-xs text-neutral-500">
          {serviceLane === 'print-my-file'
            ? 'Paste a share link for your STL / 3MF / OBJ. There is no file uploader yet.'
            : 'Optional. A sketch photo or file link helps — not required to start.'}
        </span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {ARTIST_PRODUCTION_DISCOVERY.making.label}
        </span>
        <textarea
          required
          minLength={10}
          rows={4}
          className={field}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={ARTIST_PRODUCTION_DISCOVERY.making.hint}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {ARTIST_PRODUCTION_DISCOVERY.blocking.label}{' '}
          <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <textarea
          rows={2}
          className={field}
          value={blocking}
          onChange={(e) => setBlocking(e.target.value)}
          placeholder={ARTIST_PRODUCTION_DISCOVERY.blocking.hint}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          {ARTIST_PRODUCTION_DISCOVERY.success.label}{' '}
          <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <textarea
          rows={2}
          className={field}
          value={successLooksLike}
          onChange={(e) => setSuccessLooksLike(e.target.value)}
          placeholder={ARTIST_PRODUCTION_DISCOVERY.success.hint}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Dimensions (optional)
          </span>
          <input
            className={field}
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Deadline (optional)
          </span>
          <input
            className={field}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder={ARTIST_PRODUCTION_DISCOVERY.deadline.hint}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">Volume bracket</span>
        <select
          className={field}
          value={volumeBracket}
          onChange={(e) =>
            setVolumeBracket(e.target.value as 'small' | 'medium' | 'large')
          }
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          className="mt-1"
          checked={isAccessMember}
          onChange={(e) => setIsAccessMember(e.target.checked)}
        />
        <span>
          I qualify for Artist Access (workshop alumni, Bakehouse associate, certified operator, or
          partner-community artist).
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          className="mt-1"
          checked={consentUpdates}
          onChange={(e) => setConsentUpdates(e.target.checked)}
        />
        <span>Send me updates about this quote and DCC fabrication.</span>
      </label>

      {error ? <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? 'Submitting…' : 'Submit quote request'}
      </button>
    </form>
  )
}
