import { NextResponse } from 'next/server'

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
  return NextResponse.json({
    organizationSlug: slug,
    dataConfigured: isMemoryAgentDataConfigured(slug),
    programmingMemoryConfigured: isProgrammingMemoryConfigured(slug),
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
      suggestedQuestions: branding.suggestedQuestions,
    },
  })
}
