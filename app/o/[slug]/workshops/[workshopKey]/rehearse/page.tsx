import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LEARN_AI_WORKSHOP_SLUG } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'
import { learnAiCueBeats, learnAiCueSegmentOrder } from '@/lib/workshops/learn-ai-without-losing-yourself/cue-sheet'
import { learnAiRehearseGuide } from '@/lib/workshops/learn-ai-without-losing-yourself/rehearse-guide'
import { loadLearnAiPrintableRehearsalHtml } from '@/lib/workshops/learn-ai-without-losing-yourself/load-printable-rehearsal'
import LearnAiRehearseClient from '@/components/workshops/learn-ai/LearnAiRehearseClient'

export const metadata: Metadata = {
  title: 'Rehearse — Learn AI Without Losing Yourself',
  robots: { index: false, follow: true },
}

export default async function LearnAiRehearsePage({
  params,
}: {
  params: { slug: string; workshopKey: string }
}) {
  if (params.workshopKey !== LEARN_AI_WORKSHOP_SLUG) {
    notFound()
  }

  const scriptHtml = await loadLearnAiPrintableRehearsalHtml()

  return (
    <LearnAiRehearseClient
      orgSlug={params.slug}
      scriptHtml={scriptHtml}
      beats={learnAiCueBeats}
      segmentOrder={learnAiCueSegmentOrder}
      guide={learnAiRehearseGuide}
    />
  )
}
