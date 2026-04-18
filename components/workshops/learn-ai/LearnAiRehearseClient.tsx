'use client'

import { useMemo, useState } from 'react'
import './learn-ai-rehearse-print.css'
import { useTenant } from '@/components/tenant/TenantProvider'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
} from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LearnAiWorkshopNav } from './LearnAiWorkshopNav'
import { LEARN_AI_WORKSHOP_SLUG } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import type {
  LearnAiCueBeat,
  LearnAiCueSegmentOrderModel,
} from '@/lib/workshops/learn-ai-without-losing-yourself/cue-sheet'
import type { LearnAiRehearseGuideModel } from '@/lib/workshops/learn-ai-without-losing-yourself/rehearse-guide'

export default function LearnAiRehearseClient({
  orgSlug,
  scriptHtml,
  beats,
  segmentOrder,
  guide,
}: {
  orgSlug: string
  scriptHtml: string
  beats: LearnAiCueBeat[]
  segmentOrder: LearnAiCueSegmentOrderModel
  guide: LearnAiRehearseGuideModel
}) {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant()
  const [beatIndex, setBeatIndex] = useState(0)
  const [tab, setTab] = useState<'map' | 'beat' | 'guide' | 'script'>('map')

  const beat = beats[beatIndex]

  const getNavigationConfig = () => {
    if (tenantId === 'oolite') return ooliteConfig
    if (tenantId === 'bakehouse') return bakehouseConfig
    if (tenantId === 'madarts') return madartsConfig
    return ooliteConfig
  }

  const beatsBySegment = useMemo(() => {
    const m = new Map<string, LearnAiCueBeat[]>()
    for (const b of beats) {
      const arr = m.get(b.segment) ?? []
      arr.push(b)
      m.set(b.segment, arr)
    }
    return m
  }, [beats])

  const handlePrint = () => {
    setTab('script')
    requestAnimationFrame(() => {
      window.print()
    })
  }

  if (tenantLoading) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </TenantLayout>
    )
  }

  if (tenantError) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center text-destructive">
          {tenantError}
        </div>
      </TenantLayout>
    )
  }

  return (
    <TenantLayout>
      <div className="learn-ai-rehearse-print-root min-h-screen bg-background">
        <div className="learn-ai-rehearse-print-hide">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="learn-ai-rehearse-print-hide mb-6 flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/o/${orgSlug}/workshops/${encodeURIComponent(LEARN_AI_WORKSHOP_SLUG)}`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print script
            </Button>
          </div>
          <div className="learn-ai-rehearse-print-hide">
            <LearnAiWorkshopNav orgSlug={orgSlug} className="mb-10" />
          </div>

          <h1 className="learn-ai-rehearse-print-hide mb-2 text-3xl font-semibold tracking-tight">
            Rehearse
          </h1>
          <p className="learn-ai-rehearse-print-hide mb-8 text-sm text-muted-foreground">
            Presenter cue sheet, facilitator guide, and printable long-form script.
          </p>

          <div className="learn-ai-rehearse-print-hide w-full">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as typeof tab)}
              className="w-full"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:max-w-xl sm:grid-cols-4">
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="beat">Beat</TabsTrigger>
                <TabsTrigger value="guide">Guide</TabsTrigger>
                <TabsTrigger value="script">Script</TabsTrigger>
              </TabsList>
              <TabsContent value="map" className="mt-6 space-y-6">
                <p className="text-sm text-muted-foreground">
                  Segment order and beat counts. Full beats in the Beat tab.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {segmentOrder.map((s) => (
                    <Card key={s.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{s.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {(beatsBySegment.get(s.id) ?? []).length} beat(s)
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="beat" className="mt-6 space-y-4">
                {beat ? (
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{beat.segment}</Badge>
                        <span className="text-sm text-muted-foreground">{beat.timeRange}</span>
                      </div>
                      <CardTitle className="text-lg">{beat.slideLabel}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-foreground">Screen</div>
                        <p className="text-muted-foreground">{beat.screenAction}</p>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Script</div>
                        <p className="whitespace-pre-wrap leading-relaxed">{beat.script}</p>
                      </div>
                      {beat.altJoke ? (
                        <div>
                          <div className="font-medium text-foreground">Alt joke</div>
                          <p className="text-muted-foreground">{beat.altJoke}</p>
                        </div>
                      ) : null}
                      <div>
                        <div className="font-medium text-foreground">Teaching goal</div>
                        <p className="text-muted-foreground">{beat.teachingGoal}</p>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Takeaway</div>
                        <p className="text-muted-foreground">{beat.criticalTakeaway}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={beatIndex <= 0}
                    onClick={() => setBeatIndex((i) => Math.max(0, i - 1))}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {beatIndex + 1} / {beats.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={beatIndex >= beats.length - 1}
                    onClick={() => setBeatIndex((i) => Math.min(beats.length - 1, i + 1))}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="guide" className="mt-6 space-y-8">
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold">You are</h2>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {guide.coreTone.youAre.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold">You are not</h2>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {guide.coreTone.youAreNot.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="mb-2 text-lg font-semibold">Running order</h2>
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-2 font-medium">Time</th>
                          <th className="p-2 font-medium">Title</th>
                          <th className="p-2 font-medium">Segment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guide.runningOrder.map((row) => (
                          <tr key={row.time} className="border-t border-border">
                            <td className="p-2 text-muted-foreground">{row.time}</td>
                            <td className="p-2">{row.title}</td>
                            <td className="p-2 capitalize text-muted-foreground">{row.segment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="space-y-2">
                  <h2 className="text-lg font-semibold">Stage tips</h2>
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    {guide.stageTips.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ol>
                </section>
                <p className="text-sm text-muted-foreground">{guide.nextStepBlurb}</p>
              </TabsContent>
              <TabsContent value="script" className="mt-6">
                <p className="text-sm text-muted-foreground">
                  The script renders below this tab. Use <strong>Print script</strong> to switch here
                  and open the print dialog with chrome hidden.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <article
            className={cn(
              'learn-ai-rehearse-script-print prose prose-neutral mt-8 max-w-none dark:prose-invert',
              tab === 'script' ? 'block' : 'hidden',
              'print:block'
            )}
            dangerouslySetInnerHTML={{ __html: scriptHtml }}
          />
        </div>
      </div>
    </TenantLayout>
  )
}
