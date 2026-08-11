export type SafetyLevel = 'none' | 'note' | 'required'

export type PaceMode = 'follow' | 'self-paced'

export type SessionStatus = 'scheduled' | 'open' | 'live' | 'break' | 'complete'

export type TvScreen = 'module' | 'join' | 'break' | 'resources' | 'complete'

export type ReadinessResult = 'ready' | 'repair' | 'consultation'

export type ActivityKind =
  | 'choice'
  | 'order'
  | 'checklist'
  | 'classify'
  | 'readiness'

export type KnowledgeCheckOption = {
  id: string
  label: string
  correct?: boolean
  explanation: string
}

export type KnowledgeCheck = {
  prompt: string
  options: KnowledgeCheckOption[]
}

export type Activity = {
  kind: ActivityKind
  prompt: string
  items: string[]
  /** For order activities: correct order of item indices */
  correctOrder?: number[]
  /** For classify activities: label per item */
  labels?: string[]
}

export type BookletReference = {
  bookletId: string
  sectionTitle: string
  startPage?: number
  endPage?: number
  anchor?: string
  mappingPending?: boolean
}

export type BookletEdition = {
  id: string
  title: string
  /** Human-readable edition note (e.g. Jun10 Canva 44-page spread). */
  editionNote: string
  pageCount?: number
  /** Exact page mapping verified against PDF. */
  pagesVerified: boolean
}

/** Semantic color families — mapped to Tailwind bundles in workshop theme files. */
export type ModuleColorTokenId =
  | 'cyan'
  | 'sky'
  | 'amber'
  | 'blue'
  | 'teal'
  | 'indigo'
  | 'orange'
  | 'rose'
  | 'emerald'
  | 'slate'

export type ModuleIconKey =
  | 'circle-dot'
  | 'sparkles'
  | 'shield-check'
  | 'workflow'
  | 'scan-line'
  | 'sliders'
  | 'droplets'
  | 'search'
  | 'clipboard-check'

export type ModuleVisualIdentity = {
  phase: string
  iconKey: ModuleIconKey
  colorTokenId: ModuleColorTokenId
}

export type ModuleMediaPlaceholder = {
  assetId: string
  title: string
  shot: string
  altIntent: string
  aspect: string
  minSize: string
}

/** Resolved style classes for a color token (kept out of curriculum data). */
export type ModuleColorTokenClasses = {
  chip: string
  icon: string
  surface: string
  border: string
  gradient: string
  tvGlow: string
}

export type VenueAccentId = 'oolite-teal' | 'bakehouse-copper'

export type VenueAccentClasses = {
  label: string
  chip: string
  border: string
  gradient: string
  heading: string
}

export type WorkshopModule = {
  id: string
  slug: string
  order: number
  title: string
  estimatedMinutes: number
  promise: string
  keyIdeas: string[]
  watchNotice: string
  physicalSample: string
  activity: Activity
  knowledgeCheck?: KnowledgeCheck
  bookletRefs: BookletReference[]
  safetyLevel: SafetyLevel
  safetyNote?: string
  facilitatorNotes: string[]
  tvPrompt: string
  visual?: ModuleVisualIdentity
  primaryMedia?: ModuleMediaPlaceholder
  /** Additional shot-list asset IDs related to this module. */
  mediaIds?: string[]
}

export type WorkshopResource = {
  id: string
  title: string
  description: string
  href?: string
  status: 'ready' | 'placeholder'
}

export type Workshop = {
  slug: string
  title: string
  promise: string
  audience: string
  durationMinutes: number
  capacity: number
  safetyBoundary: string
  expectationStatement: string
  facilitators: string[]
  moduleIds: string[]
  resourceIds: string[]
  venueConfigIds: string[]
  bookletId?: string
  heroMedia?: ModuleMediaPlaceholder
}

export type VenueConfig = {
  id: string
  organization: string
  venueName: string
  roomName: string
  printerModel: string
  washCureModel: string
  validatedSlicer: string
  validatedProfileLabel: string
  resinLabel: string
  safetyContact: string
  appointmentUrl?: string
  namingNote?: string
  zoneNotes: string[]
  stopWorkConditions: string[]
  themeAccentId?: VenueAccentId
  brandMediaId?: string
}

export type WorkshopLiveSession = {
  id: string
  workshopSlug: string
  venueConfigId: string
  joinCode: string
  status: SessionStatus
  liveModuleId: string
  liveStep: number
  tvScreen: TvScreen
  timerEndsAt: string | null
  timerLabel: string | null
  startedAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}

export type ParticipantProgress = {
  sessionId: string
  anonymousParticipantId: string
  paceMode: PaceMode
  currentModuleId: string
  completedModuleIds: string[]
  safetyCheckCompleted: boolean
  readinessResult?: ReadinessResult
}
