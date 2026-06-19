import {
  buildShowcaseProgramArtistCards,
  matchShowcaseProgramQuestion,
} from '@/lib/oolite/showcase-programs'
import type { MemoryAgentAskResult } from '@/types/memory-agent'

export function applyShowcaseProgramResponse(args: {
  orgSlug: string
  question: string
  result: MemoryAgentAskResult
}): MemoryAgentAskResult {
  if (args.orgSlug.trim().toLowerCase() !== 'oolite') return args.result

  const program = matchShowcaseProgramQuestion(args.question)
  if (!program) return args.result

  const artists = buildShowcaseProgramArtistCards(program)

  return {
    ...args.result,
    answer: program.displayAnswer,
    spokenAnswer: program.spokenAnswer,
    artists: artists.slice(0, 6),
    followUps: program.followUps,
    dataGaps: [],
  }
}
