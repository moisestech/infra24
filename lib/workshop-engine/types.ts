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
