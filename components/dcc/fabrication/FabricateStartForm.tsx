'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FABRICATION_RATE_CARDS,
  buildPlanningEstimateNote,
  estimateQuote,
  projectStageFromLaneParam,
  rushPercentageForQueue,
  suggestStudioService,
  type FabricationRateTierId,
  type ObjectIntent,
  type ProjectStageId,
  type QueueTierId,
} from '@/lib/dcc/fabrication'
import { OBJECT_INTENTS } from '@/lib/dcc/fabrication/start-schema'
import { PROJECT_STAGES } from '@/lib/dcc/fabrication/studio-services'

const OBJECT_INTENT_LABELS: Record<ObjectIntent, string> = {
  prototype: 'Prototype',
  final_object: 'Final object',
  unsure: 'Unsure',
}

export function FabricateStartForm() {
  const search = useSearchParams()
  const laneStage = projectStageFromLaneParam(search.get('lane'))
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
  const [organization, setOrganization] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [projectStage, setProjectStage] = useState<ProjectStageId>(
    laneStage ?? 'unsure'
  )
  const [prototypeLearning, setPrototypeLearning] = useState('')
  const [description, setDescription] = useState(planningNote ?? '')
  const [dimensions, setDimensions] = useState('')
  const [quantity, setQuantity] = useState('')
  const [intendedUse, setIntendedUse] = useState('')
  const [materialPreference, setMaterialPreference] = useState('')
  const [deadline, setDeadline] = useState('')
  const [objectIntent, setObjectIntent] = useState<ObjectIntent>('prototype')
  const [fileLink, setFileLink] = useState('')
  const [referenceLinks, setReferenceLinks] = useState('')
  const [isAssociate, setIsAssociate] = useState(tierParam === 'artist_access')
  const [consentUpdates, setConsentUpdates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ jobId: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const suggested = suggestStudioService(projectStage)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/dcc/fabricate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          organization: organization || undefined,
          projectTitle,
          projectStage,
          suggestedServiceId: suggested?.id,
          description,
          prototypeLearning,
          dimensions: dimensions || undefined,
          quantity: quantity || undefined,
          intendedUse: intendedUse || undefined,
          materialPreference: materialPreference || undefined,
          deadline: deadline || undefined,
          objectIntent,
          fileLink: fileLink || undefined,
          referenceLinks: referenceLinks || undefined,
          isAssociate,
          consentUpdates,
          planningEstimateNote: planningNote || undefined,
          landingPage:
            typeof window !== 'undefined' ? window.location.pathname : '/fabricate/start',
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
        jobId?: string | null
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
          Inquiry received
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Staff will review your project and follow up. A service is not assigned until
          human review.
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
      {planningNote ? (
        <p className="rounded-xl border border-[var(--cdc-border)] bg-neutral-50 px-4 py-3 font-mono text-xs text-neutral-600 dark:bg-neutral-900/40 dark:text-neutral-300">
          {planningNote}
        </p>
      ) : null}

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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Organization <span className="font-normal text-neutral-500">(optional)</span>
          </span>
          <input
            className={field}
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Project title
          </span>
          <input
            required
            className={field}
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          What do you currently have?
        </legend>
        {PROJECT_STAGES.map((stage) => (
          <label
            key={stage.id}
            className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <input
              type="radio"
              name="projectStage"
              className="mt-1"
              checked={projectStage === stage.id}
              onChange={() => setProjectStage(stage.id)}
            />
            <span>{stage.label}</span>
          </label>
        ))}
        <p className="rounded-lg border border-[var(--cdc-border)] bg-neutral-50 px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-900/40 dark:text-neutral-400">
          Suggested service:{' '}
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {suggested?.label ?? 'None — human review'}
          </span>
          . Not assigned until staff review.
        </p>
      </fieldset>

      <label className="block rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950/40">
        <span className="font-medium text-amber-950 dark:text-amber-100">
          What do you need to learn from this prototype?
        </span>
        <textarea
          required
          minLength={4}
          rows={3}
          className={field}
          value={prototypeLearning}
          onChange={(e) => setPrototypeLearning(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Description
        </span>
        <textarea
          required
          minLength={10}
          rows={4}
          className={field}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Dimensions <span className="font-normal text-neutral-500">(optional)</span>
          </span>
          <input
            className={field}
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Quantity <span className="font-normal text-neutral-500">(optional)</span>
          </span>
          <input
            className={field}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Intended use <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <input
          className={field}
          value={intendedUse}
          onChange={(e) => setIntendedUse(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Material preference{' '}
          <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <input
          className={field}
          value={materialPreference}
          onChange={(e) => setMaterialPreference(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Deadline <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <input
          className={field}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Object intent
        </legend>
        {OBJECT_INTENTS.map((intent) => (
          <label
            key={intent}
            className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <input
              type="radio"
              name="objectIntent"
              className="mt-1"
              checked={objectIntent === intent}
              onChange={() => setObjectIntent(intent)}
            />
            <span>{OBJECT_INTENT_LABELS[intent]}</span>
          </label>
        ))}
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          File link <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <input
          className={field}
          placeholder="https://"
          value={fileLink}
          onChange={(e) => setFileLink(e.target.value)}
        />
        <span className="mt-1 block text-xs text-neutral-500">
          Paste a share link. There is no file uploader yet.
        </span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">
          Reference links <span className="font-normal text-neutral-500">(optional)</span>
        </span>
        <textarea
          rows={2}
          className={field}
          placeholder="https://"
          value={referenceLinks}
          onChange={(e) => setReferenceLinks(e.target.value)}
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          className="mt-1"
          checked={isAssociate}
          onChange={(e) => setIsAssociate(e.target.checked)}
        />
        <span>
          I qualify for Artist Access (workshop alumni, Bakehouse associate, certified
          operator, or partner-community artist).
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          className="mt-1"
          checked={consentUpdates}
          onChange={(e) => setConsentUpdates(e.target.checked)}
        />
        <span>Send me updates about this inquiry and DCC fabrication.</span>
      </label>

      {error ? <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? 'Submitting…' : 'Submit inquiry'}
      </button>
    </form>
  )
}
