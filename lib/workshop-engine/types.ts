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

export type BookletReferenceStatus = 'verified' | 'related' | 'missing'

export type BookletReference = {
  bookletId: string
  sectionTitle: string
  startPage?: number
  endPage?: number
  /** @deprecated Prefer status */
  mappingPending?: boolean
  status?: BookletReferenceStatus
  pagePreviewHref?: string
  note?: string
  anchor?: string
}

export type BookletEdition = {
  id: string
  title: string
  /** Human-readable edition note. */
  editionNote: string
  /** @deprecated Prefer logicalPageCount */
  pageCount?: number
  logicalPageCount: number
  pdfSheetCount: number
  missingLogicalPages: number[]
  format: 'reading-order' | 'printer-spreads'
  /** Exact page mapping verified against the guide inventory. */
  pagesVerified: boolean
  previewBaseHref?: string
  downloadHref?: string
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
  /** Public path when a real or illustrative asset is available. */
  src?: string
  /** Caption / status for illustrative vs documentary assets. */
  caption?: string
  kind?: 'illustrative' | 'illustration' | 'diagram' | 'photo' | 'placeholder'
}

/** Ultra-wide module banner for HTML title overlays (not documentary evidence). */
export type ModuleBanner = {
  src: string
  /** Optional PNG master path. */
  masterSrc?: string
  width: number
  height: number
  alt: string
  objectPosition?: string
  kind: 'illustration'
  /** Accent label for art direction notes (not shown as image text). */
  accent?: string
}

/** Resolved style classes for a color token (kept out of curriculum data). */
export type ModuleColorTokenClasses = {
  chip: string
  icon: string
  surface: string
  border: string
  gradient: string
  /** Left-to-right wash for HTML title overlays on banners. */
  bannerWash: string
  tvGlow: string
}

/** Placeholder for a short tutorial / demo loop (not live equipment footage). */
export type ModuleTutorialVideo = {
  assetId: string
  title: string
  shot: string
  aspect?: string
  /** Public path or embed URL when available. */
  src?: string
  caption?: string
}

/** Evidence strength for workshop media (conceptual ≠ documentary proof). */
export type WorkshopMediaEvidenceLevel =
  | 'atmospheric'
  | 'conceptual'
  | 'documentary'
  | 'validated'

export type WorkshopMediaKind =
  | 'illustration'
  | 'photo'
  | 'screenshot'
  | 'diagram'
  | 'booklet-page'

export type WorkshopMediaRole =
  | 'banner'
  | 'lesson'
  | 'comparison'
  | 'evidence'
  | 'reference'

/**
 * Generic workshop media metadata. Curriculum owns paths/alt/role;
 * components stay engine-generic.
 */
export type WorkshopMedia = {
  id: string
  src: string
  width: number
  height: number
  alt: string
  kind: WorkshopMediaKind
  evidenceLevel: WorkshopMediaEvidenceLevel
  role: WorkshopMediaRole
  caption?: string
  objectPosition?: string
  /** Short HTML prompt shown beside/below the image. */
  prompt?: string
  /** Lucide icon key for section chrome (resolved in UI). */
  iconKey?:
    | 'rotate-3d'
    | 'network'
    | 'circle-dashed'
    | 'layers-3'
    | 'ruler'
    | 'list-checks'
    | 'sparkles'
    | 'search-check'
    | 'workflow'
    | 'image'
    | 'box'
    | 'printer'
    | 'droplets'
    | 'shield'
    | 'file-stack'
    | 'octagon-alert'
    | 'scale'
    | 'hammer'
  /** Enable zoom/fullscreen for comparison detail. */
  zoomable?: boolean
  /** Draft teaching board vs verified documentary assets. */
  productionStatus?:
    | 'draft-teaching-board'
    | 'verified-screenshot'
    | 'verified-photo'
  /** Longer accessible description (HTML may summarize). */
  longDescription?: string
  /** Percent-based callout regions on the board (0–100). */
  regions?: TechniqueBoardRegion[]
  /** Future verified screenshot/photo when ready. */
  verifiedSrc?: string
  /** Local do / avoid activity. */
  doAvoid?: TechniqueBoardDoAvoid
  /** Mobile guided panel crops — prefer these over shrinking the whole board. */
  panelCrops?: TechniqueBoardPanelCrop[]
}

export type TechniqueBoardRegion = {
  id: string
  label: string
  /** Percent of image width (0–100). */
  x: number
  y: number
  w: number
  h: number
  note: string
}

export type TechniqueBoardDoAvoid = {
  do: string[]
  avoid: string[]
}

export type TechniqueBoardPanelCrop = {
  id: string
  label: string
  objectPosition: string
  prompt: string
}

export type TechniqueBoardLayout =
  | 'primary'
  | 'tabs'
  | 'guided-sequence'
  | 'pair'
  | 'prep-next'

/** Interactive technique board block for a module (supporting teaching layer). */
export type ModuleTechniqueBoards = {
  title: string
  intro?: string
  layout: TechniqueBoardLayout
  /** Board panels — one for primary; multiple for tabs/sequence/pair. */
  boards: WorkshopMedia[]
  /** Pair layout labels (length 2). */
  pairLabels?: [string, string]
  /** Safety / readiness reminder shown under the board. */
  safetyNote?: string
}

/** Conceptual teaching stills attached to a module (supporting layer). */
export type ModuleInstructionalConcepts = {
  /** Single concept or lead image. */
  items: WorkshopMedia[]
  /** Optional heading for the concept block. */
  title?: string
  /** Optional intro under the heading. */
  intro?: string
  /** Layout hint: single stack vs slicer four-step lab. */
  layout?: 'single' | 'slicer-sequence' | 'expandable'
  /** HTML-only list rendered with the concepts (never baked into images). */
  htmlPoints?: string[]
}

export type VenueAccentId = 'oolite-teal' | 'bakehouse-copper'

export type VenueAccentClasses = {
  label: string
  chip: string
  border: string
  gradient: string
  heading: string
}

export type ModuleVocabTerm = {
  term: string
  definition: string
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
  /** Optional in-room discussion prompt (curriculum metadata). */
  discussionPrompt?: string
  /** Short participant tips (displayed with tip icon + amber pairing). */
  tips?: string[]
  /** Key vocabulary for the module (term + short definition). */
  vocab?: ModuleVocabTerm[]
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
  /** Ultra-wide illustrative banner for module identity (HTML overlays). */
  banner?: ModuleBanner
  /** Additional shot-list asset IDs related to this module. */
  mediaIds?: string[]
  /** Optional tutorial / demo video slot (placeholder until asset lands). */
  tutorialVideo?: ModuleTutorialVideo
  /** Interactive technique boards (200-series teaching boards). */
  techniqueBoards?: ModuleTechniqueBoards
  /** Conceptual teaching illustrations (supporting layer; not banners). */
  instructionalConcepts?: ModuleInstructionalConcepts
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
