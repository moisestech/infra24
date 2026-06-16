import {
  buildOpenCallEventCards,
  findOpenCallOfferingByQuery,
  getGranteeAdminOfferings,
  getPublicOpenCallOfferings,
  matchOpenCallsQuestion,
  OPEN_CALLS_SHOWCASE,
  resolveOpenCallsSpokenAnswer,
} from '@/lib/oolite/open-calls-showcase'
import type { MemoryAgentAskResult } from '@/types/memory-agent'

function buildFocusedDisplayAnswer(question: string): string {
  const offering = findOpenCallOfferingByQuery(question)
  if (offering) {
    const prefix = offering.publicOpenCall
      ? `Apply for ${offering.title} (${OPEN_CALLS_SHOWCASE.title}).\n\n`
      : `Grantee resource: ${offering.title}.\n\n`
    return `${prefix}${offering.description}\n\nApply: ${offering.applyUrl}\n\n${OPEN_CALLS_SHOWCASE.displayAnswer}`
  }

  if (/grant\s+report|grant\s+agreement|grantee|awardee/i.test(question)) {
    const admin = getGranteeAdminOfferings()
    const lines = admin.map((o) => `• ${o.shortLabel} — ${o.applyUrl}`).join('\n')
    return `Grantee resources\n\n${lines}\n\n${OPEN_CALLS_SHOWCASE.displayAnswer}`
  }

  return OPEN_CALLS_SHOWCASE.displayAnswer
}

export function applyOpenCallsResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  if (args.orgSlug.trim().toLowerCase() !== 'oolite') return args.result

  const match = matchOpenCallsQuestion(args.question)
  if (!match) return args.result

  const publicEvents = buildOpenCallEventCards(getPublicOpenCallOfferings())
  const hubCard = {
    id: `showcase_${OPEN_CALLS_SHOWCASE.key}`,
    name: OPEN_CALLS_SHOWCASE.title,
    program: 'Open Calls',
    reason: '2027 Ellies awards and residency applications.',
    confidence: 'high' as const,
    photoUrl: OPEN_CALLS_SHOWCASE.heroImageUrl,
    website: OPEN_CALLS_SHOWCASE.hubUrl,
    bioSnippet:
      'Applications for 2027 Ellies awards, Studio Residency, and Home + Away Residency — apply via Submittable.',
  }

  return {
    ...args.result,
    answer: buildFocusedDisplayAnswer(args.question),
    spokenAnswer: resolveOpenCallsSpokenAnswer(args.question),
    artists: [hubCard],
    events: publicEvents,
    followUps: OPEN_CALLS_SHOWCASE.followUps,
    dataGaps: [],
  }
}
