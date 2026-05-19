/**
 * Shared Memory Agent types for UI, hooks, and API-aligned shapes.
 * Server modules may import from here to stay consistent with the client.
 */

export type MemoryAgentMode = 'public' | 'staff_operator'

/** For experiential voice UI (waveform, orb, pulse). */
export type AgentState =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'searching'
  | 'thinking'
  | 'speaking'
  | 'complete'
  | 'error'

/** Subset used for Memory Wave UI (maps chat/voice pipeline into visuals). */
export type MemoryAgentAudioState = AgentState

export type MemoryAgentEventCardRecordKind =
  | 'event'
  | 'exhibition'
  | 'workshop'
  | 'screening'
  | 'opportunity'
  | 'bookable_event'
  | 'editorial_story'
  | 'house_story'
  | 'member_route'
  | 'space'

export type MemoryAgentEventCardSource =
  | 'announcement'
  | 'workshop'
  | 'cms_story'
  | 'soho_record'

export type MemoryAgentDataGapAction =
  | 'edit_airtable_row'
  | 'create_announcement'
  | 'edit_announcement'
  | 'add_event_date'
  | 'add_rsvp_link'
  | 'mark_public_safe'
  | 'review_visibility'
  | 'review_event_state'

export type MemoryAgentDataGapType =
  | 'missing_person_data'
  | 'missing_programming_data'
  | 'missing_date'
  | 'missing_cta'
  | 'missing_visibility'
  | 'missing_public_approval'
  | 'empty_time_window'
  | 'ambiguous_event_type'

export type MemoryAgentDataGapSource =
  | 'airtable_alumni'
  | 'supabase_announcements'
  | 'supabase_workshops'
  | 'memory_agent'

/** Structured staff action derived from missing or weak source records. */
export type MemoryAgentDataGap = {
  id: string
  message: string
  gapType: MemoryAgentDataGapType
  source: MemoryAgentDataGapSource
  sourceRecordId?: string
  action?: MemoryAgentDataGapAction
  actionLabel?: string
  actionHref?: string
}

/** Programming / experience card (announcements, workshops, future Soho records). */
export type MemoryAgentEventCard = {
  id: string
  title: string
  recordKind: MemoryAgentEventCardRecordKind
  summary?: string
  startsAt?: string
  endsAt?: string
  location?: string
  ctaLabel?: string
  ctaUrl?: string
  imageUrl?: string
  tags?: string[]
  source: MemoryAgentEventCardSource
  sourceRecordId: string
  /** Staff-only edit route; omitted in public API responses. */
  editUrl?: string
  /** Org public detail page when available. */
  publicUrl?: string
  /** True when RSVP/register CTA is appropriate (workshop / bookable_event). */
  bookable: boolean
  /** Public action buttons allowed (governance + not canceled). */
  allowPublicActions: boolean
  publicSafe: boolean
}

export type MemoryAgentArtistCard = {
  id: string
  name: string
  discipline?: string
  programYear?: string
  reason: string
  confidence: 'high' | 'medium' | 'low'
  website?: string
  photoUrl?: string
  /** Enriched from Airtable row for unified catalogue cards */
  medium?: string
  program?: string
  year?: string
  cohort?: string
  location?: string
  topics?: string[]
  badges?: Array<'digital' | 'collection' | 'video'>
  bioSnippet?: string
  pronoun?: string
  ethnicity?: string
  nationality?: string
}

/** Audience-specific reframing of the same retrieval (Ask the Place layer). */
export type MemoryAgentPublicOutput = {
  title: string
  summary: string
  bullets: string[]
  suggestedAction?: string
}

export type MemoryAgentStaffOutput = {
  title: string
  summary: string
  bullets: string[]
  tasks?: string[]
  suggestedAction?: string
}

export type MemoryAgentLeadershipOutput = {
  title: string
  summary: string
  bullets: string[]
  risks?: string[]
  opportunities?: string[]
  suggestedAction?: string
}

export type MemoryAgentTripleOutputs = {
  public: MemoryAgentPublicOutput
  staff: MemoryAgentStaffOutput
  leadership: MemoryAgentLeadershipOutput
}

/**
 * Shipped to the browser after governance: in `public` mode, staff and leadership
 * slices are omitted server-side so internal briefs are not exposed.
 */
export type MemoryAgentClientOutputs = {
  public: MemoryAgentPublicOutput
  staff?: MemoryAgentStaffOutput
  leadership?: MemoryAgentLeadershipOutput
}

/** Lobby / kiosk copy derived from public-safe context only. */
export type MemoryAgentSignageAudience = 'public' | 'members' | 'residents' | 'guests' | 'staff'

export type MemoryAgentSignageDraft = {
  title: string
  subtitle?: string
  body: string
  cta: string
  qrLabel?: string
  audience?: MemoryAgentSignageAudience
  locationHint?: string
  expiresAt?: string
  /** Always public pipeline when present from the Memory Agent. */
  sourceOutput?: 'public'
}

export type MemoryAgentGeneratedAssetType =
  | 'public_output'
  | 'staff_brief'
  | 'leadership_insight'
  | 'signage_draft'
  | 'qr_handoff'

export type MemoryAgentGeneratedAssetStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived'

export type MemoryAgentGeneratedAssetVisibility = 'internal' | 'public'

export type MemoryAgentGeneratedAssetChannel =
  | 'web'
  | 'lobby_signage'
  | 'qr_handoff'
  | 'staff_brief'
  | 'leadership'
  | 'report'

export type MemoryAgentGeneratedAssetAudience =
  | 'public'
  | 'staff'
  | 'leadership'
  | 'guests'
  | 'members'
  | 'residents'

export type MemoryAgentGeneratedAsset = {
  id: string
  organizationSlug: string
  type: MemoryAgentGeneratedAssetType
  status: MemoryAgentGeneratedAssetStatus
  /** Server-backed: internal assets are never returned on public handoff. */
  visibility?: MemoryAgentGeneratedAssetVisibility
  channel?: MemoryAgentGeneratedAssetChannel
  title: string
  summary?: string
  body: string
  bullets?: string[]
  sourceQuestion: string
  sourceMessageId?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
  audience?: MemoryAgentGeneratedAssetAudience
  locationHint?: string
  expiresAt?: string
  tags?: string[]
  approvedAt?: string
  publishedAt?: string
  approvedBy?: string
  metadata?: Record<string, unknown>
}

/** Passed into output / signage components when saving an asset from a reply. */
export type MemoryAgentOutputSaveContext = {
  sourceQuestion: string
  sourceMessageId?: string
}

/**
 * Internal-demo-only payload: what was retrieved, what was sent to the model, and how the response was validated.
 * Never returned in public mode.
 */
export type MemoryAgentContextInspector = {
  mode: MemoryAgentMode
  organizationSlug: string
  question: string
  retrieval?: {
    totalCandidateCount?: number
    baseTotalCount?: number
    selectedCount: number
    selectedRecords: Array<{
      id: string
      title?: string
      name?: string
      score?: number
      source?: string
      reason?: string
    }>
    allowedArtistIds: string[]
  }
  contextPreview?: {
    text: string
    characterCount: number
  }
  validation?: {
    jsonParsed: boolean
    artistsFiltered: boolean
    outputsAccepted: boolean
    signageAccepted: boolean
    droppedFields?: string[]
    warnings?: string[]
  }
}

export type MemoryAgentAnswer = {
  answer: string
  artists: MemoryAgentArtistCard[]
  events?: MemoryAgentEventCard[]
  followUps: string[]
  dataGaps: string[]
  /** Source-aware staff actions; action links omitted in public mode. */
  structuredDataGaps?: MemoryAgentDataGap[]
  /** Optional audience outputs; UI hides when absent. */
  outputs?: MemoryAgentClientOutputs
  /** Signage + QR handoff draft; only when `outputs.public` exists and payload validates. */
  signageDraft?: MemoryAgentSignageDraft
  /** Internal demo only: retrieval + prompt + validation (never in public API). */
  contextInspector?: MemoryAgentContextInspector
}

export type MemoryAgentAskResult = MemoryAgentAnswer

export type MemoryAgentAskError =
  | { ok: false; code: 'not_configured' | 'airtable_error' | 'openai_missing' | 'openai_error'; message: string }

export type MemoryAgentGovernanceStatus = {
  fields: {
    doNotUseInAi: boolean
    approvedForPublicAi: boolean
    visibilityLevel: boolean
    publicBio: boolean
  }
  publicModeRule: string
}

/** GET /memory-agent/status JSON */
export type MemoryAgentStatusPayload = {
  organizationSlug: string
  dataConfigured: boolean
  openaiConfigured: boolean
  /** API key + voice id (per-org voice id counts). */
  elevenLabsConfigured: boolean
  elevenLabsApiKeyConfigured: boolean
  elevenLabsVoiceIdConfigured: boolean
  questionLoggingConfigured: boolean
  governance: MemoryAgentGovernanceStatus
  branding: {
    productTitle: string
    agentName: string
    agentDisplayName: string
    personality: string
    tagline: string
    suggestedQuestions: string[]
  }
}

export type MemoryAgentUserMessage = {
  id: string
  role: 'user'
  content: string
  createdAt: string
}

export type MemoryAgentAssistantMessage = {
  id: string
  role: 'assistant'
  content: string
  artists?: MemoryAgentArtistCard[]
  events?: MemoryAgentEventCard[]
  followUps?: string[]
  dataGaps?: string[]
  structuredDataGaps?: MemoryAgentDataGap[]
  outputs?: MemoryAgentClientOutputs
  signageDraft?: MemoryAgentSignageDraft
  contextInspector?: MemoryAgentContextInspector
  createdAt: string
}

export type MemoryAgentMessage = MemoryAgentUserMessage | MemoryAgentAssistantMessage

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createUserMessage(content: string): MemoryAgentUserMessage {
  return {
    id: newId(),
    role: 'user',
    content,
    createdAt: new Date().toISOString(),
  }
}

export function createAssistantMessage(partial: {
  content: string
  artists?: MemoryAgentArtistCard[]
  events?: MemoryAgentEventCard[]
  followUps?: string[]
  dataGaps?: string[]
  structuredDataGaps?: MemoryAgentDataGap[]
  outputs?: MemoryAgentClientOutputs
  signageDraft?: MemoryAgentSignageDraft
  contextInspector?: MemoryAgentContextInspector
}): MemoryAgentAssistantMessage {
  return {
    id: newId(),
    role: 'assistant',
    content: partial.content,
    artists: partial.artists,
    events: partial.events,
    followUps: partial.followUps,
    dataGaps: partial.dataGaps,
    structuredDataGaps: partial.structuredDataGaps,
    outputs: partial.outputs,
    signageDraft: partial.signageDraft,
    contextInspector: partial.contextInspector,
    createdAt: new Date().toISOString(),
  }
}
