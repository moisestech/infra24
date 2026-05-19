import { createClient } from '@supabase/supabase-js'

export async function logMemoryAgentQuestion(entry: {
  organizationSlug: string
  mode: string
  questionLength: number
  matchedArtistCount: number
  dataGaps: string[]
  error?: string | null
}): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) return

  try {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    await supabase.from('memory_agent_question_logs').insert({
      organization_slug: entry.organizationSlug,
      mode: entry.mode,
      question_length: entry.questionLength,
      matched_artist_count: entry.matchedArtistCount,
      data_gaps: entry.dataGaps.length ? entry.dataGaps : null,
      error: entry.error ?? null,
    })
  } catch (e) {
    console.warn('memory_agent_question_logs insert failed', e)
  }
}
