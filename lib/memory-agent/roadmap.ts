/** Single source for in-app + docs roadmap copy (Phase 1 scaffold → production). */
export type RoadmapPhaseStatus = 'done' | 'current' | 'planned'

export type MemoryAgentRoadmapPhase = {
  id: string
  title: string
  status: RoadmapPhaseStatus
  detail: string
}

export const MEMORY_AGENT_ROADMAP_PHASES: MemoryAgentRoadmapPhase[] = [
  {
    id: 'scaffold',
    title: 'Scaffold & UI',
    status: 'done',
    detail:
      'Route `/o/[slug]/memory-agent`, status/ask/voice APIs, chat UI, org hub + nav links, Oolite uses existing Airtable alumni env.',
  },
  {
    id: 'airtable',
    title: 'Airtable as source of truth',
    status: 'done',
    detail:
      'Per-org `AIRTABLE_{ORG}_ALUMNI_*` (Oolite legacy `AIRTABLE_ALUMNI_*` supported). Same rows as `/o/[slug]/alumni`.',
  },
  {
    id: 'governance',
    title: 'Governance fields',
    status: 'done',
    detail:
      'Optional Airtable columns (public bio, visibility, approved-for-public-AI, do-not-use-in-AI) filter retrieval; status panel shows mapped fields.',
  },
  {
    id: 'voice',
    title: 'Voice output',
    status: 'current',
    detail:
      'ElevenLabs TTS (`ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` or per-org override), auto-speak answers, mic transcribe via OpenAI Whisper.',
  },
  {
    id: 'scale',
    title: 'Scale & ops',
    status: 'planned',
    detail: 'Cached sync to Supabase, pgvector, auth, admin review dashboard, usage analytics.',
  },
]
