import { NextResponse } from 'next/server'

import { fetchOoliteAppSuggestedQuestions } from '@/lib/oolite/airtable-question-catalog'
import { mergeDccMemoryAgentSuggestedQuestions } from '@/lib/dcc/dcc-institutional-memory-chips'
import { mergeOoliteMemoryAgentSuggestedQuestions } from '@/lib/oolite/oolite-institutional-memory-chips'
import { getAirtableProgrammingStatusSummary } from '@/lib/memory-agent/airtable-programming'
import { isAirtableProgrammingConfigured } from '@/lib/airtable/programming-config'
import {
  getMemoryAgentStatusExtras,
  isElevenLabsConfigured,
  isMemoryAgentDataConfigured,
  isOpenAIConfigured,
  isProgrammingMemoryConfigured,
} from '@/lib/memory-agent/config'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const branding = getMemoryAgentBranding(slug)
  const extras = getMemoryAgentStatusExtras(slug)

  let suggestedQuestions = branding.suggestedQuestions
  if (slug.trim().toLowerCase() === 'oolite') {
    const catalog = await fetchOoliteAppSuggestedQuestions()
    if (catalog.ok && catalog.questions.length > 0) {
      suggestedQuestions = catalog.questions
    }
    suggestedQuestions = mergeOoliteMemoryAgentSuggestedQuestions(suggestedQuestions)
  }

  if (slug.trim().toLowerCase() === 'dcc') {
    suggestedQuestions = mergeDccMemoryAgentSuggestedQuestions(suggestedQuestions)
  }

  const airtableProgrammingConfigured = isAirtableProgrammingConfigured(slug)
  let airtableProgrammingRecords: number | undefined
  if (airtableProgrammingConfigured) {
    const programmingStatus = await getAirtableProgrammingStatusSummary(slug)
    airtableProgrammingRecords = programmingStatus.records
  }

  return NextResponse.json({
    organizationSlug: slug,
    dataConfigured: isMemoryAgentDataConfigured(slug),
    programmingMemoryConfigured: isProgrammingMemoryConfigured(slug),
    airtableProgrammingConfigured,
    airtableProgrammingRecords,
    openaiConfigured: isOpenAIConfigured(),
    elevenLabsConfigured: isElevenLabsConfigured(slug),
    elevenLabsApiKeyConfigured: extras.elevenLabsApiKeyConfigured,
    elevenLabsVoiceIdConfigured: extras.elevenLabsVoiceIdConfigured,
    questionLoggingConfigured: extras.questionLoggingConfigured,
    governance: extras.governance,
    branding: {
      productTitle: branding.productTitle,
      agentName: branding.agentName,
      agentDisplayName: branding.agentDisplayName,
      personality: branding.personality,
      tagline: branding.tagline,
      suggestedQuestions,
    },
  })
}
