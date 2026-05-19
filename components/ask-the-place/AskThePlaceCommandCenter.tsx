'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { AtpMode, OutputBundle } from '@/lib/ask-the-place/types'
import {
  defaultGraphLinks,
  defaultGraphNodes,
  getProspectConfig,
} from '@/lib/ask-the-place/configs'
import { DEFAULT_PILOT_SCOPE } from '@/lib/ask-the-place/pilot-scope'
import { resolveScenarioId } from '@/lib/ask-the-place/scenarioEngine'
import { AskThePlaceShell } from './AskThePlaceShell'
import { TopNav } from './TopNav'
import { ModeSwitcher } from './ModeSwitcher'
import { PlaceProfilePanel } from './PlaceProfilePanel'
import { DataCategoryList } from './DataCategoryList'
import { SuggestedQuestions } from './SuggestedQuestions'
import { IntelligenceCanvas } from './IntelligenceCanvas'
import { AskInterface } from './AskInterface'
import { OutputPanel } from './OutputPanel'
import { SignagePreview } from './SignagePreview'
import { QRHandoff } from './QRHandoff'
import { PilotScopePanel } from './PilotScopePanel'
import { NextActionsPanel } from './NextActionsPanel'
import { MobileShell, type MobileTab } from './MobileShell'
import { MobileAskHero } from './MobileAskHero'
import { RecommendationCard } from './RecommendationCard'
import { ItineraryCard } from './ItineraryCard'
import { MapView } from './MapView'
import { ProspectSelector } from './ProspectSelector'

type AskThePlaceCommandCenterProps = {
  vertical: string
  prospect: string
}

export function AskThePlaceCommandCenter({ vertical, prospect }: AskThePlaceCommandCenterProps) {
  const config = getProspectConfig(vertical, prospect)
  const [mode, setMode] = useState<AtpMode>('public')
  const firstId = config?.sampleQuestions[0]?.id ?? null
  const [scenarioId, setScenarioId] = useState<string | null>(firstId)
  const [mobileTab, setMobileTab] = useState<MobileTab>('ask')

  const bundle: OutputBundle | null = useMemo(() => {
    if (!config || !scenarioId) return null
    return config.scenarios[scenarioId] ?? null
  }, [config, scenarioId])

  const graphNodes = useMemo(
    () => (config ? defaultGraphNodes(config.vertical) : []),
    [config]
  )
  const graphLinks = useMemo(() => defaultGraphLinks(), [])

  const highlightIds = useMemo(() => {
    const s = new Set<string>(['node-place'])
    bundle?.highlightNodeIds.forEach((id) => s.add(id))
    return s
  }, [bundle])

  const applyQuestion = (text: string) => {
    if (!config) return
    const m = resolveScenarioId(config, text)
    if (m) setScenarioId(m)
    else if (config.sampleQuestions[0]) setScenarioId(config.sampleQuestions[0].id)
  }

  if (!config) {
    return (
      <AskThePlaceShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl text-white">Demo not found</h1>
          <p className="mt-2 text-sm text-zinc-500">Unknown vertical or prospect slug.</p>
          <Link href="/ask-the-place" className="mt-6 inline-block text-teal-400 hover:underline">
            Back to Ask the Place
          </Link>
        </div>
      </AskThePlaceShell>
    )
  }

  const publicBody =
    bundle?.publicRecommendation ??
    'Select a suggested question or type your own to populate guest-facing output.'
  const staffBody =
    bundle?.staffBrief ?? 'Staff briefs appear with operational context and missing-data flags.'
  const leadershipBody =
    bundle?.leadershipInsight ?? 'Leadership insights connect engagement, partners, and revenue paths.'

  return (
    <AskThePlaceShell>
      <TopNav config={config} mode={mode} />

      {/* Desktop command center */}
      <div className="mx-auto hidden max-w-[1600px] gap-4 px-4 py-6 md:grid md:grid-cols-12 md:px-6">
        <aside className="col-span-12 space-y-4 lg:col-span-3">
          <PlaceProfilePanel config={config} />
          <ModeSwitcher value={mode} onChange={setMode} />
          <DataCategoryList categories={config.dataCategories} />
          <SuggestedQuestions
            questions={config.sampleQuestions}
            activeId={scenarioId}
            onSelect={(id) => setScenarioId(id)}
          />
          <div className="rounded-2xl border border-white/10 bg-[#0B1118] p-3 text-[10px] text-zinc-500">
            <p className="font-semibold uppercase tracking-wide text-zinc-400">Sources</p>
            <p className="mt-2">Mock dataset · Config: {config.routeSlug}</p>
          </div>
          <ProspectSelector currentSlug={config.routeSlug} />
        </aside>

        <section className="col-span-12 space-y-4 lg:col-span-6">
          <IntelligenceCanvas
            config={config}
            graphNodes={graphNodes}
            graphLinks={graphLinks}
            highlightIds={highlightIds}
            bundle={bundle}
          />
          <div className="-mt-2 lg:-mt-6 lg:translate-y-2">
            <AskInterface placeholder={config.primaryQuestion} onSubmitText={applyQuestion} />
          </div>
        </section>

        <aside className="col-span-12 space-y-4 lg:col-span-3">
          <OutputPanel
            config={config}
            publicBody={publicBody}
            staffBody={staffBody}
            leadershipBody={leadershipBody}
          />
          <SignagePreview bundle={bundle} />
          <QRHandoff ready={Boolean(bundle)} />
        </aside>

        <footer className="col-span-12 grid gap-4 lg:grid-cols-2">
          <PilotScopePanel scope={DEFAULT_PILOT_SCOPE} pilotName={config.pilotName} />
          <NextActionsPanel actions={bundle?.nextActions ?? []} />
        </footer>
      </div>

      {/* Mobile concierge */}
      <MobileShell tab={mobileTab} onTab={setMobileTab}>
        {mobileTab === 'ask' ? (
          <div className="space-y-4 px-3 pt-4">
            <MobileAskHero config={config} />
            <SuggestedQuestions
              questions={config.sampleQuestions}
              activeId={scenarioId}
              onSelect={(id) => setScenarioId(id)}
            />
            <AskInterface placeholder={config.primaryQuestion} onSubmitText={applyQuestion} />
          </div>
        ) : null}
        {mobileTab === 'recommend' ? (
          <div className="space-y-3 px-3 pt-4">
            <RecommendationCard
              title={bundle?.answerSummary ?? 'Cultural picks'}
              subtitle={config.prospectName}
              why={bundle?.publicRecommendation ?? config.tagline}
            />
            <OutputPanel
              config={config}
              publicBody={publicBody}
              staffBody={staffBody}
              leadershipBody={leadershipBody}
            />
          </div>
        ) : null}
        {mobileTab === 'itinerary' ? (
          <div className="px-3 pt-4">
            <ItineraryCard bundle={bundle} />
          </div>
        ) : null}
        {mobileTab === 'map' ? (
          <div className="px-3 pt-4">
            <MapView config={config} />
          </div>
        ) : null}
        {mobileTab === 'saved' ? (
          <div className="px-3 pt-8 text-center text-sm text-zinc-500">
            Saved plans will sync to accounts after pilot auth.
          </div>
        ) : null}
      </MobileShell>

      <div className="mx-auto max-w-[1600px] px-4 py-6 text-center md:px-6">
        <Link href="/ask-the-place" className="text-xs text-zinc-500 hover:text-teal-300">
          ← All verticals
        </Link>
        <span className="mx-2 text-zinc-700">·</span>
        <Link href="/ask-the-place/architecture" className="text-xs text-zinc-500 hover:text-teal-300">
          Architecture
        </Link>
      </div>
    </AskThePlaceShell>
  )
}
