import type {
  BranchPathPreviewNode,
  ChapterComponentSpec,
  LessonBranchPathSpec,
  LessonEnrichment,
} from '@/lib/course/types'

const MOODBOARD_TITLE = 'Vernacular moodboard'
const MOODBOARD_DESC =
  'Recognizable platform scraps—webcam framing, stock gradients, clip-art, compressed images, feed captions—carry cultural weight before you “design” them.'

const FRAME_TITLE = 'Frame split demo'
const FRAME_DESC =
  'How a single viewport can subdivide into smaller fields of attention—browser frames as narrative structure (after Olia Lialina’s frame logic).'

const BRANCH_TITLE = 'Branch path preview'
const BRANCH_DESC = 'A minimal map of nonlinear hypertext: one threshold page splitting into two emotional continuations.'

const REMIX_TITLE = 'Remix stack'
const REMIX_DESC =
  'Layers of found material, captions, and UI residue stacked so juxtaposition—not polish—does the teaching.'

const LOCAL_VS_LIVE_TITLE = 'Local vs documented vs live'
const LOCAL_VS_LIVE_DESC =
  'The same HTML can exist as a private file, as evidence, or as a public encounter—each condition changes what the work is.'

const PUBLISH_FLOW_TITLE = 'Publish flow'
const PUBLISH_FLOW_DESC =
  'A minimal path from repository to configured publishing source to GitHub Pages and a shareable URL (see GitHub Docs on Pages and publishing sources).'

const CANON_INTRO_TITLE = 'Canon intro strip'
const CANON_INTRO_DESC =
  'A compact introduction to the field through artists, works, and institutions—like wall labels you can scan in one pass.'

const NET_ART_VS_TITLE = 'Net art vs art online'
const NET_ART_VS_DESC =
  'A simple comparison between browser-native internet art and work that is only documented or displayed on the web.'

const HOVER_STATE_TITLE = 'Hover state demo'
const HOVER_STATE_DESC =
  'A compact read of how one element can sit at rest, then shift mood or visibility when the viewer moves into it.'

const MOTION_RHYTHM_TITLE = 'Motion rhythm preview'
const MOTION_RHYTHM_DESC =
  'Timing changes feeling: instant, slow, delayed, and looped behaviors read differently in the browser.'

const TRACE_VS_TITLE = 'Trace vs portrait demo'
const TRACE_VS_DESC =
  'How screenshots, captions, archives, and digital residue can read as contemporary portraiture—not only as “raw data.”'

const AVATAR_PRESENCE_TITLE = 'Avatar presence card'
const AVATAR_PRESENCE_DESC =
  'An avatar can be a stable artistic self: authored, legible, and socially present—more than a decorative skin.'

const PATHWAY_CHOOSER_TITLE = 'Pathway chooser'
const PATHWAY_CHOOSER_DESC =
  'CSS browser space, p5.js / Processing generative sketches, and three.js 3D scenes are different artistic machines—pick one for your next proof-of-concept.'

const TOOL_COMPARISON_TITLE = 'Tool comparison grid'
const TOOL_COMPARISON_DESC =
  'A quick read of strengths, complexity, and what you are likely to ship from each pathway.'

const PROJECT_PLAN_TITLE = 'Project plan canvas'
const PROJECT_PLAN_DESC =
  'Lock concept, pathway, references, and output before the build expands—small and finishable beats vague and huge.'

const SUBMISSION_CHECKLIST_TITLE = 'Submission checklist'
const SUBMISSION_CHECKLIST_DESC =
  'A practical pass for title, statement, URL or files, and how the work points back to the course canon.'

const CRITIQUE_RUBRIC_TITLE = 'Critique rubric cards'
const CRITIQUE_RUBRIC_DESC =
  'Quick self-critique before you share: concept, form, clarity, and public readiness.'

const BROWSER_FRAME_ANATOMY_TITLE = 'Browser Frame Anatomy'
const BROWSER_FRAME_ANATOMY_DESC =
  'A compact read of browser edges, viewport, page space, and scroll as formal elements—not neutral defaults.'

const PAGE_AS_SPACE_TITLE = 'Page as Space Demo'
const PAGE_AS_SPACE_DESC =
  'The same ingredients can read as a poster, a navigable field, or a sequence depending on layout and framing.'

const INTERFACE_BREAK_TITLE = 'Interface Break Demo'
const INTERFACE_BREAK_DESC =
  'A side-by-side read: default clarity versus deliberate resistance—overlap, unstable order, and friction as authored choices.'

const LEGIBILITY_SHIFT_TITLE = 'Legibility Shift Card'
const LEGIBILITY_SHIFT_DESC =
  'How small formal moves shift the same content from calm reading to tense or unstable without tipping into random noise.'

const SYSTEM_MAP_PREVIEW_TITLE = 'System Map Preview'
const SYSTEM_MAP_PREVIEW_DESC =
  'Nodes and channels as a browser-native diagram: the page can read as a map, portal, or protocol—not only a single scene.'

const FLOW_FRICTION_TITLE = 'Flow and Friction Card'
const FLOW_FRICTION_DESC =
  'Smooth circulation versus detours and barriers—how routing and permissions change what a viewer experiences.'

const REPO_SETUP_TITLE = 'Repository setup checklist'
const REPO_SETUP_DESC =
  'A practical flow for GitHub, GitHub Desktop, cloning, committing, and pushing—plus optional mobile and terminal paths.'

const LEARNING_GUIDES_TITLE = 'Learn the browser materials'
const LEARNING_GUIDES_DESC =
  'Different guides are useful for different moments: deep learning, guided practice, quick lookup, and workflow context.'

/** Chapter 0: positioning + web stack render before anchor works (see `VcnVibeNetArtLesson` + dossier). */
export function studioSpecsBeforeAnchors(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  const out: ChapterComponentSpec[] = []
  const quadrant = enrichment.vibecodingQuadrant
  if (quadrant?.quadrants?.length) {
    out.push({
      kind: 'vibecoding-quadrant',
      title: quadrant.title || 'Where this course sits',
      description:
        quadrant.description ||
        'Compare no-code, AI app builders, browser-native vibecoding, and code-first workflows.',
      props: { quadrants: quadrant.quadrants },
    })
  }
  const guides = enrichment.learningGuidesStrip
  if (guides?.guides?.length) {
    out.push({
      kind: 'learning-guides-strip',
      title: guides.title || LEARNING_GUIDES_TITLE,
      description: guides.description || LEARNING_GUIDES_DESC,
      props: { guides: guides.guides },
    })
  }
  const stack = enrichment.webMaterialsStack
  if (stack?.layers?.length) {
    out.push({
      kind: 'web-materials-stack',
      title: stack.title || 'HTML, CSS, and JavaScript as ingredients',
      description:
        stack.description ||
        'Structure, form, and behavior—the materials the browser actually renders and executes.',
      props: { layers: stack.layers },
    })
  }
  return out
}

export function branchPathSpecToNodes(spec: LessonBranchPathSpec): BranchPathPreviewNode[] {
  const childIds = spec.branches.map((b) => b.target.id)
  const labelWithMood = (label: string, mood?: string) => (mood ? `${label} — ${mood}` : label)
  const root: BranchPathPreviewNode = {
    id: spec.root.id,
    label: labelWithMood(spec.root.label, spec.root.mood),
    to: childIds,
  }
  const children: BranchPathPreviewNode[] = spec.branches.map((b) => ({
    id: b.target.id,
    label: labelWithMood(b.target.label, b.target.mood),
  }))
  return [root, ...children]
}

function pageAsSpaceDemoSpec(enrichment: LessonEnrichment): ChapterComponentSpec | null {
  const p = enrichment.pageAsSpaceDemo
  if (!p?.variants?.length) return null
  return {
    kind: 'page-as-space-demo',
    title: p.title || PAGE_AS_SPACE_TITLE,
    description: p.description || PAGE_AS_SPACE_DESC,
    props: { variants: p.variants },
  }
}

/** Signature demos directly after anchor works (canon strip → local vs live → moodboard → frame split). */
export function studioSpecsAfterAnchors(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  const out: ChapterComponentSpec[] = []
  const plan = enrichment.projectPlanCanvas
  if (plan?.sections?.length) {
    out.push({
      kind: 'project-plan-canvas',
      title: plan.title || PROJECT_PLAN_TITLE,
      description: plan.description || PROJECT_PLAN_DESC,
      props: { sections: plan.sections },
    })
  }
  const pathway = enrichment.pathwayChooser
  if (pathway?.items?.length) {
    out.push({
      kind: 'pathway-chooser',
      title: pathway.title || PATHWAY_CHOOSER_TITLE,
      description: pathway.description || PATHWAY_CHOOSER_DESC,
      props: { items: pathway.items },
    })
  }
  const browserFrame = enrichment.browserFrameAnatomy
  if (browserFrame?.layers?.length) {
    out.push({
      kind: 'browser-frame-anatomy',
      title: browserFrame.title || BROWSER_FRAME_ANATOMY_TITLE,
      description: browserFrame.description || BROWSER_FRAME_ANATOMY_DESC,
      props: { layers: browserFrame.layers },
    })
  }
  const systemMap = enrichment.systemMapPreview
  if (systemMap?.nodes?.length) {
    out.push({
      kind: 'system-map-preview',
      title: systemMap.title || SYSTEM_MAP_PREVIEW_TITLE,
      description: systemMap.description || SYSTEM_MAP_PREVIEW_DESC,
      props: { nodes: systemMap.nodes, links: systemMap.links ?? [] },
    })
  }
  const ifaceBreak = enrichment.interfaceBreakDemo
  if (ifaceBreak?.left?.points?.length && ifaceBreak?.right?.points?.length) {
    out.push({
      kind: 'interface-break-demo',
      title: ifaceBreak.title || INTERFACE_BREAK_TITLE,
      description: ifaceBreak.description || INTERFACE_BREAK_DESC,
      props: { left: ifaceBreak.left, right: ifaceBreak.right },
    })
  }
  const trace = enrichment.traceVsPortraitDemo
  if (trace?.left?.points?.length && trace?.right?.points?.length) {
    out.push({
      kind: 'trace-vs-portrait-demo',
      title: trace.title || TRACE_VS_TITLE,
      description: trace.description || TRACE_VS_DESC,
      props: { left: trace.left, right: trace.right },
    })
  }
  if (enrichment.canonIntroStrip?.items?.length) {
    out.push({
      kind: 'canon-intro-strip',
      title: enrichment.canonIntroStrip.title || CANON_INTRO_TITLE,
      description: enrichment.canonIntroStrip.description || CANON_INTRO_DESC,
      props: { items: enrichment.canonIntroStrip.items },
    })
  }
  if (enrichment.localVsLivePreview?.states?.length) {
    out.push({
      kind: 'local-vs-live-preview',
      title: enrichment.localVsLivePreview.title || LOCAL_VS_LIVE_TITLE,
      description: enrichment.localVsLivePreview.description || LOCAL_VS_LIVE_DESC,
      props: { states: enrichment.localVsLivePreview.states },
    })
  }
  if (enrichment.vernacularMoodBoard?.tiles?.length) {
    out.push({
      kind: 'vernacular-moodboard',
      title: MOODBOARD_TITLE,
      description: MOODBOARD_DESC,
      props: { tiles: enrichment.vernacularMoodBoard.tiles },
    })
  }
  if (enrichment.hoverStateDemo?.states?.length) {
    out.push({
      kind: 'hover-state-demo',
      title: enrichment.hoverStateDemo.title || HOVER_STATE_TITLE,
      description: enrichment.hoverStateDemo.description || HOVER_STATE_DESC,
      props: { states: enrichment.hoverStateDemo.states },
    })
  }
  if (enrichment.frameSplitSteps?.length) {
    out.push({
      kind: 'frame-split-demo',
      title: FRAME_TITLE,
      description: FRAME_DESC,
      props: { steps: enrichment.frameSplitSteps },
    })
  }
  return out
}

/**
 * Demos after concept blocks, excluding `page-as-space-demo` (that block renders after the chapter
 * media strip on full lesson pages so it sits next to the artifact; dossier merges via
 * `studioSpecsAfterConcepts`).
 */
export function studioSpecsAfterConceptsCore(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  const out: ChapterComponentSpec[] = []
  const submission = enrichment.submissionChecklist
  if (submission?.items?.length) {
    out.push({
      kind: 'submission-checklist',
      title: submission.title || SUBMISSION_CHECKLIST_TITLE,
      description: submission.description || SUBMISSION_CHECKLIST_DESC,
      props: { items: submission.items },
    })
  }
  if (enrichment.netArtVsArtOnline?.left && enrichment.netArtVsArtOnline?.right) {
    out.push({
      kind: 'net-art-vs-art-online',
      title: enrichment.netArtVsArtOnline.title || NET_ART_VS_TITLE,
      description: enrichment.netArtVsArtOnline.description || NET_ART_VS_DESC,
      props: {
        left: enrichment.netArtVsArtOnline.left,
        right: enrichment.netArtVsArtOnline.right,
      },
    })
  }
  if (enrichment.motionRhythmPreview?.rhythms?.length) {
    out.push({
      kind: 'motion-rhythm-preview',
      title: enrichment.motionRhythmPreview.title || MOTION_RHYTHM_TITLE,
      description: enrichment.motionRhythmPreview.description || MOTION_RHYTHM_DESC,
      props: { rhythms: enrichment.motionRhythmPreview.rhythms },
    })
  }
  if (enrichment.branchPath?.branches?.length) {
    out.push({
      kind: 'branch-path-preview',
      title: BRANCH_TITLE,
      description: BRANCH_DESC,
      props: { nodes: branchPathSpecToNodes(enrichment.branchPath) },
    })
  }
  if (enrichment.remixStack?.layers?.length) {
    out.push({
      kind: 'remix-stack',
      title: REMIX_TITLE,
      description: REMIX_DESC,
      props: { layers: enrichment.remixStack.layers },
    })
  }
  if (enrichment.publishFlowDiagram?.steps?.length) {
    out.push({
      kind: 'publish-flow-diagram',
      title: enrichment.publishFlowDiagram.title || PUBLISH_FLOW_TITLE,
      description: enrichment.publishFlowDiagram.description || PUBLISH_FLOW_DESC,
      props: { steps: enrichment.publishFlowDiagram.steps },
    })
  }
  const toolGrid = enrichment.toolComparisonGrid
  if (toolGrid?.rows?.length) {
    out.push({
      kind: 'tool-comparison-grid',
      title: toolGrid.title || TOOL_COMPARISON_TITLE,
      description: toolGrid.description || TOOL_COMPARISON_DESC,
      props: { rows: toolGrid.rows },
    })
  }
  const avatar = enrichment.avatarPresenceCard
  if (avatar?.points?.length) {
    out.push({
      kind: 'avatar-presence-card',
      title: avatar.title || AVATAR_PRESENCE_TITLE,
      description: avatar.description || AVATAR_PRESENCE_DESC,
      props: { points: avatar.points },
    })
  }
  const legibility = enrichment.legibilityShiftCard
  if (legibility?.stages?.length) {
    out.push({
      kind: 'legibility-shift-card',
      title: legibility.title || LEGIBILITY_SHIFT_TITLE,
      description: legibility.description || LEGIBILITY_SHIFT_DESC,
      props: { stages: legibility.stages },
    })
  }
  const flowFriction = enrichment.flowAndFrictionCard
  if (flowFriction?.left?.points?.length && flowFriction?.right?.points?.length) {
    out.push({
      kind: 'flow-and-friction-card',
      title: flowFriction.title || FLOW_FRICTION_TITLE,
      description: flowFriction.description || FLOW_FRICTION_DESC,
      props: { left: flowFriction.left, right: flowFriction.right },
    })
  }
  const repoSetup = enrichment.repoSetupChecklist
  if (repoSetup?.items?.length) {
    out.push({
      kind: 'repo-setup-checklist',
      title: repoSetup.title || REPO_SETUP_TITLE,
      description: repoSetup.description || REPO_SETUP_DESC,
      props: { items: repoSetup.items },
    })
  }
  return out
}

/** Chapter 2: spatial comparison; use after `LessonImageAssetStrip` on overlay lesson pages. */
export function studioSpecsPageAsSpaceOnly(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  const spec = pageAsSpaceDemoSpec(enrichment)
  return spec ? [spec] : []
}

/** Signature demos after concept blocks (includes page-as-space when present). */
export function studioSpecsAfterConcepts(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  return [...studioSpecsAfterConceptsCore(enrichment), ...studioSpecsPageAsSpaceOnly(enrichment)]
}

/** Capstone: rubric after artifact prompt, before resource strip. */
export function studioSpecsAfterArtifact(enrichment: LessonEnrichment): ChapterComponentSpec[] {
  const out: ChapterComponentSpec[] = []
  const critique = enrichment.critiqueRubricCards
  if (critique?.cards?.length) {
    out.push({
      kind: 'critique-rubric-cards',
      title: critique.title || CRITIQUE_RUBRIC_TITLE,
      description: critique.description || CRITIQUE_RUBRIC_DESC,
      props: { cards: critique.cards },
    })
  }
  return out
}
