import type { MemoryAgentArtistCard } from '@/types/memory-agent'

type LogMemoryAgentAnswerArgs = {
  question: string
  answer: string
  artists?: MemoryAgentArtistCard[]
  dataGaps?: string[]
  followUps?: string[]
}

/** Browser console diagnostics for answer delivery (images, ids, gaps). */
export function logMemoryAgentAnswerDelivery({
  question,
  answer,
  artists = [],
  dataGaps = [],
  followUps = [],
}: LogMemoryAgentAnswerArgs) {
  if (typeof window === 'undefined') return

  const dev =
    process.env.NODE_ENV === 'development' ||
    new URLSearchParams(window.location.search).get('dev') === '1'

  if (!dev) return

  const artistRows = artists.map((a) => ({
    id: a.id,
    name: a.name,
    photoUrl: a.photoUrl ?? '',
    hasPhoto: Boolean(a.photoUrl?.trim()),
    galleryCount: a.galleryImageUrls?.length ?? 0,
    medium: a.medium ?? a.discipline ?? '',
    website: a.website ?? '',
  }))

  console.groupCollapsed('[Memory Agent] answer delivered')
  console.log('question', question)
  console.log('answer', answer)
  if (artistRows.length) {
    console.table(artistRows)
    const missing = artistRows.filter((a) => !a.hasPhoto)
    if (missing.length) {
      console.warn(
        '[Memory Agent] artists missing photoUrl — usually no Featured Image URL on Airtable row and no artist_profiles name match:',
        missing.map((a) => a.name)
      )
    }
  }
  if (dataGaps.length) console.log('dataGaps', dataGaps)
  if (followUps.length) console.log('followUps', followUps)
  console.log('payload', { question, answer, artists, dataGaps, followUps })
  console.groupEnd()
}
