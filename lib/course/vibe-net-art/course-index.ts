import type { VcnCourseIndexRow } from './types'

/**
 * Public course sequence (pedagogical numbering). Maps to on-disk chapter `slug`s
 * where present; handbook-only rows omit `chapterSlug`.
 */
export const VCN_COURSE_INDEX: VcnCourseIndexRow[] = [
  {
    number: 0,
    title: 'Getting Started with Vibecoding',
    summary:
      'Where this course sits in the tool landscape, HTML/CSS/JS as materials, and a light GitHub + CodePen setup without overwhelm.',
    module: 'orientation',
    chapterSlug: 'getting-started-with-vibecoding',
    estimatedTimeLabel: '45–90 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 1,
    title: 'What Is Net Art?',
    summary: 'Definitions, institutions, and how browser logic becomes artistic material.',
    module: 'orientation',
    chapterSlug: 'what-is-net-art',
    estimatedTimeLabel: '~50 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 2,
    title: 'The Browser as Medium',
    summary:
      'Viewport, framing, and scroll as compositional material—Tate’s “on and for the internet,” Rhizome frames, and Rozendaal’s page-as-form.',
    module: 'browser-language',
    chapterSlug: 'the-browser-is-a-medium',
    estimatedTimeLabel: '40–70 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 3,
    title: 'Hypertext and Nonlinear Narrative',
    summary: 'Links, fragments, suspense, and branching structure as composition.',
    module: 'browser-language',
    chapterSlug: 'hypertext-and-nonlinear-narrative',
    estimatedTimeLabel: '~50 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 4,
    title: 'Interface, Glitch, and Disruption',
    summary:
      'Anti-interface and glitch as authored strategies—resistance, illegibility, and friction that stay intentional rather than random.',
    module: 'browser-language',
    chapterSlug: 'anti-interface-jodi',
    estimatedTimeLabel: '40–75 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 5,
    title: 'Interaction, Motion, and Responsive Behavior',
    summary: 'State, timing, hover, motion, and responsive behavior as meaning.',
    module: 'browser-language',
    chapterSlug: 'interaction-motion-and-responsive-behavior',
    estimatedTimeLabel: '~55 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 6,
    title: 'Remix, Appropriation, and Internet Vernacular',
    summary: 'Screenshots, defaults, feeds, and platform-native aesthetics as collage material.',
    module: 'cultural-social-web',
    chapterSlug: 'remix-appropriation-and-internet-vernacular',
    estimatedTimeLabel: '50–80 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 7,
    title: 'Identity, Presence, and Networked Selves',
    summary: 'Avatars, traces, surveillance, and networked selfhood in art.',
    module: 'cultural-social-web',
    chapterSlug: 'identity-presence-and-networked-selves',
    estimatedTimeLabel: '~55 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 8,
    title: 'Systems, Circulation, and Infrastructure',
    summary:
      'Rhizome’s “on the network” frame—Heath Bunting’s routed messages, Shu Lea Cheang’s portal-like narratives, and infrastructure as artistic material.',
    module: 'cultural-social-web',
    chapterSlug: 'systems-circulation-and-infrastructure',
    estimatedTimeLabel: '45–80 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 9,
    title: 'Publishing, Liveness, and the Artwork as Website',
    summary: 'URLs, hosting, versioning, archives, and what “live” means for net art.',
    module: 'public-work-advanced',
    chapterSlug: 'publishing-liveness-and-the-artwork-as-website',
    estimatedTimeLabel: '45–80 min',
    difficultyLabel: 'Beginner',
  },
  {
    number: 10,
    title: 'Advanced Vibecoding Pathways',
    summary:
      'CSS browser space, p5.js / Processing generative systems, and three.js spatial scenes—choose one pathway and prototype.',
    module: 'public-work-advanced',
    chapterSlug: 'advanced-vibecoding-pathways',
    estimatedTimeLabel: '60–120 min',
    difficultyLabel: 'Intermediate',
  },
  {
    number: 11,
    title: 'Final Project — Build, Publish, and Frame Your Net Artwork',
    summary: 'Ship a coherent browser work with statement, publish path, and documentation.',
    module: 'public-work-advanced',
    chapterSlug: 'final-project-build-publish-and-frame-your-net-artwork',
    estimatedTimeLabel: '60–120 min',
    difficultyLabel: 'Beginner',
  },
]
