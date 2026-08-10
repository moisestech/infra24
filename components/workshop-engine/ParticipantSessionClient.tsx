'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  LivePositionBanner,
  PaceSelector,
} from '@/components/workshop-engine/ParticipantControls'
import {
  BookletReference,
  LearningPromise,
  ModuleHeader,
  SafetyBanner,
} from '@/components/workshop-engine/ModuleChrome'
import { ModuleActivity } from '@/components/workshop-engine/ModuleActivity'
import { KnowledgeCheck } from '@/components/workshop-engine/ParticipantControls'
import { SafetyGate } from '@/components/workshop-engine/SafetyAndTimer'
import { useLiveSessionPolling } from '@/components/workshop-engine/TvPresentationClient'
import {
  RESIN_PRINTING_MODULES,
  getResinModuleById,
  getResinModuleNav,
} from '@/lib/workshop-engine/resin-printing'
import type { PaceMode, WorkshopLiveSession, WorkshopModule } from '@/lib/workshop-engine/types'

const PACE_KEY = 'infra24-resin-pace'
const SAFETY_KEY = 'infra24-resin-safety-gate'

export function ParticipantSessionClient({
  code,
  initialSession,
}: {
  code: string
  initialSession: WorkshopLiveSession
}) {
  const { session } = useLiveSessionPolling(code, initialSession)
  const [pace, setPace] = useState<PaceMode>('follow')
  const [selfSlug, setSelfSlug] = useState(RESIN_PRINTING_MODULES[0].slug)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(PACE_KEY) as PaceMode | null
    if (stored === 'follow' || stored === 'self-paced') setPace(stored)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(PACE_KEY, pace)
  }, [pace, ready])

  const liveModule = getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0]
  const viewingSlug = pace === 'follow' ? liveModule.slug : selfSlug
  const module = useMemo(
    () => RESIN_PRINTING_MODULES.find((m) => m.slug === viewingSlug) ?? liveModule,
    [viewingSlug, liveModule]
  )

  // Safety-critical live module interrupts Follow class.
  useEffect(() => {
    if (pace !== 'follow') return
    if (liveModule.safetyLevel === 'required') {
      setSelfSlug(liveModule.slug)
    }
  }, [pace, liveModule])

  const nav = getResinModuleNav(module.slug)

  function rejoin() {
    setPace('follow')
    setSelfSlug(liveModule.slug)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Session {session.joinCode}
        </p>
        <PaceSelector value={pace} onChange={setPace} />
        {pace === 'self-paced' ? (
          <LivePositionBanner moduleTitle={liveModule.title} onRejoin={rejoin} />
        ) : (
          <LivePositionBanner moduleTitle={liveModule.title} />
        )}
      </div>

      <ModuleView
        module={module}
        liveLabel={pace === 'follow' ? 'Following live' : 'My pace'}
        showSafetyGate={module.safetyLevel === 'required'}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
        {pace === 'self-paced' && nav.prev ? (
          <button
            type="button"
            className="underline"
            onClick={() => setSelfSlug(nav.prev!.slug)}
          >
            ← {nav.prev.title}
          </button>
        ) : (
          <span />
        )}
        {pace === 'self-paced' && nav.next ? (
          <button
            type="button"
            className="underline"
            onClick={() => setSelfSlug(nav.next!.slug)}
          >
            {nav.next.title} →
          </button>
        ) : null}
      </div>

      <p className="text-xs text-neutral-500">
        <Link className="underline" href="/workshop/resin-printing">
          Workshop overview
        </Link>
        {' · '}
        Independent navigation never authorizes equipment operation.
      </p>
    </div>
  )
}

export function ModuleView({
  module,
  liveLabel,
  showSafetyGate,
  showFacilitatorNotes = false,
}: {
  module: WorkshopModule
  liveLabel?: string
  showSafetyGate?: boolean
  showFacilitatorNotes?: boolean
}) {
  return (
    <article className="space-y-6">
      <ModuleHeader
        order={module.order}
        title={module.title}
        estimatedMinutes={module.estimatedMinutes}
        liveLabel={liveLabel}
        safetyLevel={module.safetyLevel}
      />
      <LearningPromise>{module.promise}</LearningPromise>

      {module.safetyNote ? (
        <SafetyBanner note={module.safetyNote} required={module.safetyLevel === 'required'} />
      ) : null}

      {showSafetyGate ? (
        <SafetyGate
          note={
            module.safetyNote ??
            'Complete the safety check before continuing. Equipment stays instructor-led.'
          }
          checklist={
            module.activity.kind === 'checklist'
              ? module.activity.items
              : [
                  'I will not operate resin equipment independently tonight.',
                  'I know clean zone vs controlled zone.',
                  'I understand uncured resin requires PPE.',
                ]
          }
          storageKey={`${SAFETY_KEY}-${module.id}`}
        />
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Watch / notice
        </h2>
        <p className="text-neutral-800">{module.watchNotice}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Key ideas
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-neutral-800">
          {module.keyIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>

      <ModuleActivity activity={module.activity} />

      <section className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
        <span className="font-medium text-neutral-950">Physical evidence: </span>
        {module.physicalSample}
      </section>

      {module.bookletRefs.map((ref) => (
        <BookletReference
          key={`${ref.bookletId}-${ref.sectionTitle}`}
          sectionTitle={ref.sectionTitle}
          startPage={ref.startPage}
          endPage={ref.endPage}
          mappingPending={ref.mappingPending}
        />
      ))}

      {module.knowledgeCheck ? (
        <KnowledgeCheck
          prompt={module.knowledgeCheck.prompt}
          options={module.knowledgeCheck.options}
        />
      ) : null}

      {showFacilitatorNotes ? (
        <aside className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <p className="font-medium">Facilitator cues</p>
          <ul className="mt-2 list-disc pl-5">
            {module.facilitatorNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  )
}
