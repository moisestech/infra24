/** Shared course content model for workshop handbook + lesson shells. */

export type ModuleKey =
  | 'orientation'
  | 'browser-language'
  | 'cultural-social-web'
  | 'public-work-advanced'

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type GlossaryTermType =
  | 'art-term'
  | 'browser-term'
  | 'coding-term'
  | 'platform-tool'
  | 'course-term'

/** Subtle CSS-layer background motif for glossary cards (no Paint API). */
export type GlossaryPattern =
  | 'grid'
  | 'dots'
  | 'diagonal'
  | 'radial'
  | 'scanlines'
  | 'none'

export type ResourceType =
  | 'artist'
  | 'work'
  | 'institution'
  | 'curator'
  | 'book'
  | 'tool'
  | 'website'
  | 'article'
  | 'interview'
  | 'organization'
  | 'exhibition'
  | 'publication'

/** When `chapter.dossierLayout` is `phase`, rows bucket into these bands (order: canon → docs → tools). */
export type ResourcePhase = 'canon' | 'docs' | 'tools'

export type ChapterDossierLayout = 'type' | 'phase'

export type ResourceLink = {
  type: ResourceType
  title: string
  description?: string
  href: string
  publisher?: string
  year?: string
  region?: 'national' | 'international' | 'online'
  /** Lucide icon name, e.g. `Palette` — see `lib/course/resource-icons`. */
  icon?: string
  /**
   * Optional cluster label inside the chapter dossier (`ResourceStrip`).
   * Rows with the same label are grouped under one subheading; rows without it render after labeled bands.
   */
  dossierGroup?: string
  /**
   * When the chapter uses `dossierLayout: "phase"`, overrides the default phase inferred from `type`.
   * Use for edge cases (e.g. an `article` that should sit in the canon band).
   */
  resourcePhase?: ResourcePhase
}

/** Optional per-chapter visual accent for hero shell and patterns. */
export type ChapterDesignAccent =
  | 'blue'
  | 'violet'
  | 'rose'
  | 'emerald'
  | 'gray'
  | 'pink'
  | 'yellow'
  | 'teal'
  | 'red'

/**
 * Bespoke chapter shells: spacing, chips, and chapter-specific component styling.
 * `canon-entry` = museum-forward front door (Chapter 1).
 */
export type ChapterLessonSkin =
  | 'hypertext'
  | 'remix-collage'
  | 'publishing'
  | 'canon-entry'
  /** Chapter 5 — interaction, motion, timed change; more luminous / alive than canon entry. */
  | 'interaction-motion'
  /** Chapter 7 — identity, traces, avatars; intimate rose palette, calmer than remix collage. */
  | 'identity-networked'
  /** Chapter 10 — advanced pathways lab; emerald, modular chooser + comparison grid. */
  | 'advanced-pathways'
  /** Chapter 11 — capstone; focused emerald completion + planning surfaces. */
  | 'final-capstone'
  /** Chapter 2 — browser as compositional medium; violet, spatial, formally restrained. */
  | 'browser-as-medium'
  /** Chapter 4 — anti-interface / glitch; charged violet, friction-forward. */
  | 'interface-glitch'
  /** Chapter 8 — systems, circulation, infrastructure; diagrammatic rose / fuchsia. */
  | 'systems-circulation'
  /** Chapter 0 — onboarding, tool landscape, browser materials; clear blue / slate. */
  | 'getting-started'

export type ChapterDesign = {
  moduleAccent: ChapterDesignAccent
  lessonSkin?: ChapterLessonSkin
}


export type ImageAsset = {
  src: string
  alt: string
  caption?: string
  credit?: string
  rightsNote?: string
}

export type ExternalLink = {
  label: string
  href: string
}

export type Artist = {
  name: string
  description: string
  website?: string
  instagram?: string
  image?: ImageAsset
  tags?: string[]
}

export type Work = {
  title: string
  artist: string
  year?: string
  description: string
  image?: ImageAsset
  institution?: string
  links?: ExternalLink[]
}

export type Institution = {
  name: string
  description: string
  website?: string
  image?: ImageAsset
}

export type CuratorLens = {
  name: string
  description: string
  website?: string
  instagram?: string
  image?: ImageAsset
  quote?: string
}

export type Book = {
  title: string
  author: string
  description?: string
  cover?: ImageAsset
  link?: string
}

export type Tool = {
  name: string
  category: 'quick-start' | 'structured' | 'ai-assisted' | 'advanced' | 'platform-tool'
  description: string
  website?: string
}

export type ArtifactPrompt = {
  title: string
  description: string
  easy: string[]
  medium: string[]
  advanced: string[]
  submission?: string[]
}

export type GlossaryReference = {
  slug: string
  term: string
}

/** Optional starter links surfaced on the vibecoding card (CodePen, repo, etc.). */
export type TemplateLinkKind = 'codepen' | 'repo' | 'cursor-prompt' | 'download'

export type TemplateLink = {
  label: string
  href: string
  kind: TemplateLinkKind
}

/** Build + prompt workflow block used by `VibecodingInThisChapterCard`. */
export type VibecodingChapterBridge = {
  buildMove: string
  promptMove: string
  codepenPath: string[]
  githubCursorPath: string[]
  templateLinks: TemplateLink[]
  output: string
}

/** Weak / better prompt + checklist for `PromptingTipCard`. */
export type PromptingTip = {
  goal: string
  weakPrompt: string
  betterPrompt: string
  reviewChecklist: string[]
}

export type ChapterComponentKind =
  | 'frame-split-demo'
  | 'branch-path-preview'
  | 'remix-stack'
  | 'vernacular-moodboard'
  | 'local-vs-live-preview'
  | 'publish-flow-diagram'
  | 'canon-intro-strip'
  | 'net-art-vs-art-online'
  | 'hover-state-demo'
  | 'motion-rhythm-preview'
  | 'trace-vs-portrait-demo'
  | 'avatar-presence-card'
  | 'pathway-chooser'
  | 'tool-comparison-grid'
  | 'project-plan-canvas'
  | 'submission-checklist'
  | 'critique-rubric-cards'
  | 'browser-frame-anatomy'
  | 'page-as-space-demo'
  | 'interface-break-demo'
  | 'legibility-shift-card'
  | 'system-map-preview'
  | 'flow-and-friction-card'
  | 'vibecoding-quadrant'
  | 'web-materials-stack'
  | 'repo-setup-checklist'
  | 'learning-guides-strip'

export type ChapterComponentSpec = {
  kind: ChapterComponentKind
  title: string
  description: string
  props: Record<string, unknown>
}

export type ChapterSection = {
  id: string
  label: string
  title: string
  body: string
  icon?: string
}

/** Optional “studio” layer: frame demos, vibecoding workflow, prompting, branch diagrams — data-driven per chapter. */
export type LessonFrameSplitStep = {
  label: string
  fragments: string[]
}

export type LessonBranchPathTarget = {
  id: string
  label: string
  /** Small mood / role label under the node (e.g. memory, silence). */
  mood?: string
}

export type LessonBranchPathSpec = {
  root: LessonBranchPathTarget
  branches: { edgeLabel: string; target: LessonBranchPathTarget }[]
}

/** Node graph for `BranchPathPreview` (root first, optional `to` = child ids). */
export type BranchPathPreviewNode = {
  id: string
  label: string
  to?: string[]
}

export type VernacularMoodBoardTile = {
  title: string
  src: string
  caption?: string
}

export type RemixStackLayerKind = 'image' | 'caption' | 'gradient' | 'ui' | 'text'

export type RemixStackLayer = {
  kind: RemixStackLayerKind
  label: string
  src?: string
}

export type LocalVsLiveState = {
  label: 'local' | 'documented' | 'live'
  body: string
}

export type PublishFlowStep = {
  label: string
  detail?: string
}

export type CanonIntroStripItem = {
  label: string
  value: string
  note?: string
}

export type NetArtVsArtOnlineSide = {
  title: string
  points: string[]
}

export type HoverStateDemoState = {
  label: string
  body: string
}

export type MotionRhythmItem = {
  label: string
  body: string
}

export type TraceVsPortraitSide = {
  label: string
  points: string[]
}

export type PathwayChooserItem = {
  title: string
  focus: string
  bestFor: string[]
}

export type ToolComparisonRow = {
  tool: string
  strength: string
  complexity: string
  output: string
}

export type ProjectPlanCanvasSection = {
  label: string
  prompt: string
}

export type CritiqueRubricItem = {
  title: string
  question: string
}

export type BrowserFrameAnatomyLayer = {
  label: string
  note: string
}

export type PageAsSpaceVariant = {
  label: string
  body: string
}

export type InterfaceBreakDemoSide = {
  label: string
  points: string[]
}

export type LegibilityShiftStage = {
  label: string
  body: string
}

export type SystemMapNodeSpec = {
  label: string
}

export type SystemMapLinkSpec = {
  from: string
  to: string
}

export type VibecodingQuadrantItemSpec = {
  title: string
  subtitle: string
  note: string
}

export type WebMaterialsLayerSpec = {
  label: string
  body: string
}

export type LearningGuideStripItemSpec = {
  title: string
  subtitle: string
  note: string
}

export type LessonEnrichment = {
  /**
   * Optional wrapper class on the lesson column (e.g. `lesson-theme-hypertext-bw` in globals).
   * Scoped palette only; does not replace site theme.
   */
  themeWrapperClass?: string
  frameSplitSteps?: LessonFrameSplitStep[]
  vibecoding?: {
    buildMove: string
    promptMove: string
    codepenPath: string[]
    githubCursorPath: string[]
    templateLabel?: string
    templateLinks?: (ExternalLink | TemplateLink)[]
    output: string
  }
  prompting?: PromptingTip
  branchPath?: LessonBranchPathSpec
  /** Bento-style vernacular reference grid (Chapter 6 pattern). */
  vernacularMoodBoard?: {
    tiles: VernacularMoodBoardTile[]
  }
  /** Layered collage explainer: how fragments stack into composition. */
  remixStack?: {
    layers: RemixStackLayer[]
  }
  /** Chapter 9: local file vs documentation vs live URL (publishing / liveness). */
  localVsLivePreview?: {
    title?: string
    description?: string
    states: LocalVsLiveState[]
  }
  /** Chapter 9: repo → Pages → live URL. */
  publishFlowDiagram?: {
    title?: string
    description?: string
    steps: PublishFlowStep[]
  }
  /** Chapter 1: compact canon / institution strip after anchor works. */
  canonIntroStrip?: {
    title?: string
    description?: string
    items: CanonIntroStripItem[]
  }
  /** Chapter 1: net art vs art online comparison (after concepts). */
  netArtVsArtOnline?: {
    title?: string
    description?: string
    left: NetArtVsArtOnlineSide
    right: NetArtVsArtOnlineSide
  }
  /** Chapter 5: default vs hover (or paired states) as readable interaction preview. */
  hoverStateDemo?: {
    title?: string
    description?: string
    states: HoverStateDemoState[]
  }
  /** Chapter 5: timing / rhythm as mood (after concepts). */
  motionRhythmPreview?: {
    title?: string
    description?: string
    rhythms: MotionRhythmItem[]
  }
  /** Chapter 7: traces vs composed portraiture (after anchor works). */
  traceVsPortraitDemo?: {
    title?: string
    description?: string
    left: TraceVsPortraitSide
    right: TraceVsPortraitSide
  }
  /** Chapter 7: avatar as authored presence (after concept blocks). */
  avatarPresenceCard?: {
    title?: string
    description?: string
    points: string[]
  }
  /** Chapter 10: three-way pathway chooser after anchor works. */
  pathwayChooser?: {
    title?: string
    description?: string
    items: PathwayChooserItem[]
  }
  /** Chapter 10: comparison grid after concept blocks. */
  toolComparisonGrid?: {
    title?: string
    description?: string
    rows: ToolComparisonRow[]
  }
  /** Chapter 11: planning grid after anchor works. */
  projectPlanCanvas?: {
    title?: string
    description?: string
    sections: ProjectPlanCanvasSection[]
  }
  /** Chapter 11: readiness checklist immediately after concept blocks. */
  submissionChecklist?: {
    title?: string
    description?: string
    items: string[]
  }
  /** Chapter 11: critique rubric after artifact prompt, before resource strip. */
  critiqueRubricCards?: {
    title?: string
    description?: string
    cards: CritiqueRubricItem[]
  }
  /** Chapter 2: browser chrome / viewport / scroll as formal layers (after anchor works). */
  browserFrameAnatomy?: {
    title?: string
    description?: string
    layers: BrowserFrameAnatomyLayer[]
  }
  /** Chapter 2: poster vs room vs sequence (after concepts; lesson page renders after media strip). */
  pageAsSpaceDemo?: {
    title?: string
    description?: string
    variants: PageAsSpaceVariant[]
  }
  /** Chapter 4: smooth vs resistant interface (after anchor works). */
  interfaceBreakDemo?: {
    title?: string
    description?: string
    left: InterfaceBreakDemoSide
    right: InterfaceBreakDemoSide
  }
  /** Chapter 4: readable → tense → unstable (end of post-concept demos). */
  legibilityShiftCard?: {
    title?: string
    description?: string
    stages: LegibilityShiftStage[]
  }
  /** Chapter 8: nodes + routes as diagram (after anchor works). */
  systemMapPreview?: {
    title?: string
    description?: string
    nodes: SystemMapNodeSpec[]
    links?: SystemMapLinkSpec[]
  }
  /** Chapter 8: smooth flow vs friction (after concept blocks). */
  flowAndFrictionCard?: {
    title?: string
    description?: string
    left: InterfaceBreakDemoSide
    right: InterfaceBreakDemoSide
  }
  /** Chapter 0: no-code vs app builders vs this course vs code-first (before anchor works). */
  vibecodingQuadrant?: {
    title?: string
    description?: string
    quadrants: VibecodingQuadrantItemSpec[]
  }
  /** Chapter 0: MDN vs practice vs lookup vs workflow guides (between quadrant and materials stack). */
  learningGuidesStrip?: {
    title?: string
    description?: string
    guides: LearningGuideStripItemSpec[]
  }
  /** Chapter 0: HTML / CSS / JS as ingredients (before anchor works). */
  webMaterialsStack?: {
    title?: string
    description?: string
    layers: WebMaterialsLayerSpec[]
  }
  /** Chapter 0: GitHub + Desktop + clone + commit flow (after concept blocks). */
  repoSetupChecklist?: {
    title?: string
    description?: string
    items: string[]
  }
}

export type Chapter = {
  number: number
  /** When set, shown in the lesson header badge instead of `Chapter {number}` (e.g. "Primer"). */
  chapterSequenceLabel?: string
  /** Bespoke hero / border accent for benchmark chapters (optional). */
  design?: ChapterDesign
  slug: string
  title: string
  subtitle: string
  module: ModuleKey
  estimatedTime: string
  difficulty: Difficulty
  thesis: string
  /** Short pill list: what the learner produces this session (dossier + reader). */
  makingPreview?: string[]
  /** One line under the first anchor work card (e.g. why the first work matters). */
  primaryAnchorCallout?: string
  summary: string
  sections: ChapterSection[]
  anchorWorks: Work[]
  artists: Artist[]
  institutions: Institution[]
  curatorLenses: CuratorLens[]
  books: Book[]
  tools: Tool[]
  glossaryTerms: GlossaryReference[]
  imageAssets: ImageAsset[]
  /** Optional hero banner above the lesson grid; falls back to a neutral landscape placeholder. */
  chapterBanner?: ImageAsset
  /** Studio cards, demos, and diagrams beyond the core Chapter fields (Chapter 3 benchmark pattern). */
  lessonEnrichment?: LessonEnrichment
  artifact: ArtifactPrompt
  reflection: string[]
  /** Optional grouped deep links (exhibition pages, docs); when set, ResourceStrip can render this block. */
  resources?: ResourceLink[]
  /**
   * `phase` = dossier runs canon → readings → tools using array order within each phase (see `ResourceStrip`).
   * Default / omit = group by resource `type` first (legacy).
   */
  dossierLayout?: ChapterDossierLayout
  /** Next handoff slug; `null` means no overlay next (benchmark / end of chain). Omit to follow disk order in the reader. */
  nextChapterSlug?: string | null
  /** Omit to use disk order for the reader rail; `null` means no previous link in overlay-driven nav. */
  previousChapterSlug?: string | null
}

export type GlossaryTerm = {
  slug: string
  term: string
  type: GlossaryTermType
  shortDefinition: string
  longDefinition?: string
  related?: string[]
  usedInChapters?: number[]
  /** e.g. pointer to MDN / GitHub docs for technical entries */
  sourceNote?: string
  /** Optional Lucide-style key into `glossaryTermIcons` (term slug still wins if both set). */
  icon?: string
  pattern?: GlossaryPattern
}
