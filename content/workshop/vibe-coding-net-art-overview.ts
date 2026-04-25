import { VCN_COURSE_INDEX } from '@/lib/course/vibe-net-art/course-index'
import { VCN_MODULES } from '@/lib/course/vibe-net-art/modules'
import { VCN_SPINE_ARTISTS } from '@/lib/course/vibe-net-art/canonical-spine'
import { VCN_TOOL_STACK } from '@/lib/course/vibe-net-art/tool-stack'

export type WorkshopHeroCta = {
  label: string
  /** `#anchor`, `glossary`, or absolute URL */
  href: string
}

export type WhyWorkshopItem = {
  title: string
  body: string
  icon: string
}

export type OverviewModule = {
  key: string
  title: string
  chapterRange: string
  description: string
  accent: 'blue' | 'violet' | 'rose' | 'emerald'
  icon: string
}

export type OverviewChapterRow = {
  number: number
  slug: string
  title: string
  summary: string
  module: string
  estimatedTime: string
  difficulty: string
}

export type OverviewTool = {
  name: string
  category: string
  description: string
  website?: string
}

const ACCENT_BY_MODULE: Record<string, OverviewModule['accent']> = {
  orientation: 'blue',
  'browser-language': 'violet',
  'cultural-social-web': 'rose',
  'public-work-advanced': 'emerald',
}

const ICON_BY_MODULE: Record<string, string> = {
  orientation: 'Sparkles',
  'browser-language': 'Monitor',
  'cultural-social-web': 'Layers3',
  'public-work-advanced': 'Globe',
}

/** Module cards: copy from `VCN_MODULES` + handbook-facing accent + icon labels. */
export const vibeCodingNetArtModules: OverviewModule[] = VCN_MODULES.map((m) => ({
  key: m.key,
  title: m.title,
  chapterRange: m.chapterRange.replace(/^Chapters\s+/i, '').replace(/^Chapter\s+/i, ''),
  description: m.description,
  accent: ACCENT_BY_MODULE[m.key] ?? 'blue',
  icon: ICON_BY_MODULE[m.key] ?? 'Sparkles',
}))

/** Chapter rows: single source of truth from `VCN_COURSE_INDEX` (slugs match live routes). */
export const vibeCodingNetArtCourseSequence: OverviewChapterRow[] = VCN_COURSE_INDEX.filter(
  (r): r is (typeof r) & { chapterSlug: string } => Boolean(r.chapterSlug),
).map((r) => ({
  number: r.number,
  slug: r.chapterSlug,
  title: r.title,
  summary: r.summary,
  module: r.module,
  estimatedTime: r.estimatedTimeLabel ?? '',
  difficulty: r.difficultyLabel ?? '',
}))

const EXTRA_TOOLS: OverviewTool[] = [
  {
    name: 'Claude Code',
    category: 'ai-assisted',
    description: 'Agent-style coding support for explanation, editing, and structured prompting.',
    website: 'https://code.claude.com/docs/en/vs-code',
  },
  {
    name: 'Codex',
    category: 'ai-assisted',
    description: 'AI-assisted coding workflow for generation, revision, and technical support.',
    website: 'https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/',
  },
  {
    name: 'Processing',
    category: 'advanced',
    description:
      'A visual programming environment and lineage for art, animation, and generative systems.',
    website: 'https://processing.org/tutorials/overview/',
  },
]

/** Tool stack: course defaults plus handbook extras (deduped by name). */
export const vibeCodingNetArtToolStack: OverviewTool[] = (() => {
  const fromCourse: OverviewTool[] = VCN_TOOL_STACK.map((t) => ({
    name: t.name,
    category: t.category,
    description: t.description,
    website: t.href,
  }))
  const byName = new Map<string, OverviewTool>()
  for (const t of [...fromCourse, ...EXTRA_TOOLS]) {
    if (!byName.has(t.name)) byName.set(t.name, t)
  }
  return [...byName.values()]
})()

/** Public handbook overview — copy + structure; dynamic URLs are composed on the page from `basePath`. */
export const vibeCodingNetArtOverview = {
  title: 'Vibecoding & Net Art',
  subtitle: 'Learn the canon by making through it',
  description:
    'A browser-based introduction to net art history, creative web practice, and vibecoding workflows. This course teaches major net artists, works, exhibitions, and concepts while helping learners build their own browser-based artworks through CodePen, GitHub, Cursor, and related tools.',
  heroCtas: [
    { label: 'Explore chapters', href: '#course-sequence' },
    { label: 'Open glossary', href: 'glossary' },
  ] satisfies WorkshopHeroCta[],
  whyThisWorkshop: [
    {
      title: 'Net art history through making',
      body: 'Learn canonical and contemporary internet art by building browser-based studies instead of only reading about them.',
      icon: 'Palette',
    },
    {
      title: 'Vibecoding as creative method',
      body: 'Use prompts, code, visual intuition, and AI-assisted tools to make web-native artworks while learning the field.',
      icon: 'Code2',
    },
    {
      title: 'Institutional and browser-native',
      body: 'The course connects artists, artworks, exhibitions, books, institutions, and live browser experiments so learners understand both history and practice.',
      icon: 'Building2',
    },
  ] satisfies WhyWorkshopItem[],
  modules: vibeCodingNetArtModules,
  courseSequence: vibeCodingNetArtCourseSequence,
  canonicalSpine: {
    artists: [...VCN_SPINE_ARTISTS],
    institutions: [
      'Rhizome',
      'Whitney Artport / Whitney Museum',
      'Tate',
      'Whitechapel Gallery',
      'ZKM',
      'New Museum',
    ],
    curators: ['Christiane Paul', 'Lauren Cornell', 'Michael Connor', 'Tina Rivers Ryan'],
    books: [
      'Internet Art — Rachel Greene',
      'Digital Art — Christiane Paul',
      'The Art Happens Here: Net Art Anthology',
    ],
  },
  toolStack: vibeCodingNetArtToolStack,
  learningOutcomes: [
    'Understand key net art concepts, works, artists, and institutions',
    'Learn how browsers, links, interfaces, systems, and platforms become artistic material',
    'Practice vibecoding across CodePen, GitHub, Cursor, and publishing workflows',
    'Build multiple browser-based studies and one final net artwork',
    'Develop a working vocabulary for net art, browsers, coding, and liveness',
  ],
  whatYouLeaveWith: [
    'A vocabulary for net art and browser-based practice',
    'Multiple mini browser studies and experiments',
    'A better grasp of major net artists, exhibitions, and institutions',
    'A workflow for building in CodePen and GitHub + Cursor',
    'One final published or presentation-ready net artwork',
  ],
  finalProjectPreview: {
    title: 'Final project',
    description:
      'By the end of the course, learners build, publish, and frame their own browser-based net artwork with a concept, title, references, and short statement.',
    chapterSegment: 'chapters/final-project-build-publish-and-frame-your-net-artwork',
  },
  glossary: {
    title: 'Master glossary',
    description:
      'A shared reference for art terms, browser terms, coding terms, and platform language used throughout the course.',
    segment: 'glossary',
  },
}
