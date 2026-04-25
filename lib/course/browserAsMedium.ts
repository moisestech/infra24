import type { LmsArtifactBrief, LmsCanonArtist } from '@/types/lms'

export type BrowserAsMediumChapter = {
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  keyIdeas: { title: string; body: string }[]
  canon: LmsCanonArtist[]
  questions: string[]
  artifact: LmsArtifactBrief
  reflection: string[]
  references: { label: string; href: string }[]
}

export const browserAsMediumChapter: BrowserAsMediumChapter = {
  title: 'The Browser as Medium',
  subtitle:
    'Learn how framing, layout, scrolling, windows, and interaction turn the browser into artistic material',
  description:
    'This chapter introduces the browser as a medium with its own logic, constraints, and expressive possibilities—not a neutral container.',
  outcomes: [
    'Understand the browser as an artistic medium',
    'Recognize the viewport and layout as compositional tools',
    'Identify scrolling, framing, and browser behavior as expressive elements',
    'Connect these ideas to foundational net artists',
    'Make a first browser-medium study',
  ],
  keyIdeas: [
    {
      title: 'Key idea 1 — The viewport is a stage',
      body: 'The visible area of the page is always a crop or frame. Artists can use what appears first, what stays hidden, and what only emerges through scroll.',
    },
    {
      title: 'Key idea 2 — Layout is composition',
      body: 'Spacing, positioning, edges, flow, and relation to the window all shape mood and meaning—a page can feel calm, tense, crowded, intimate, or broken.',
    },
    {
      title: 'Key idea 3 — Scroll is movement',
      body: 'Scrolling can create pacing, reveal, suspense, drift, exhaustion, and vertical narrative. Ordinary scroll is powerful artistic material.',
    },
    {
      title: 'Key idea 4 — Frames and windows shape narrative',
      body: 'Page division and nested structures can become storytelling—especially in early browser-based works where frames split attention and emotion.',
    },
    {
      title: 'Key idea 5 — Browser behavior can be aesthetic',
      body: 'A page can follow expectations or resist them, creating clarity, tension, confusion, or critique. Disruption of “usable” web space is a longstanding net art strategy.',
    },
  ],
  canon: [
    {
      name: 'Olia Lialina',
      focus: 'frames, browser narrative, nonlinear page structure',
      href: 'https://en.wikipedia.org/wiki/Olia_Lialina',
    },
    {
      name: 'JODI',
      focus: 'anti-interface, HTML as visual material, disrupted browser expectations',
      href: 'https://www.whitney.org/collection/works/33115',
    },
    {
      name: 'Rafaël Rozendaal',
      focus: 'focused browser composition; the page as a complete visual experience',
      href: 'https://www.newrafael.com/',
    },
  ],
  questions: [
    'What does the viewer see first?',
    'What is hidden until they scroll?',
    'Does the page feel open or cramped?',
    'Does the layout guide the viewer or frustrate them?',
    'Is the page stable or unstable?',
    'Is there one window, multiple zones, or a fragmented structure?',
    'Does the piece reward attention?',
    'Does interaction change the mood?',
    'Does the browser frame feel visible or invisible?',
  ],
  artifact: {
    title: 'Browser Study',
    description:
      'Make a one-page experiment that treats the browser as part of the artwork. Your goal is not polish—it is to make the browser visible as a medium.',
    prompts: [
      'a page that uses large text and empty space to control attention',
      'a page that hides key content below the fold',
      'a page divided into visual zones',
      'a page that feels like an interface rather than a poster',
      'a page that intentionally disrupts the viewer’s expectations',
    ],
    modes: {
      easy: ['Create a simple page with one strong layout decision.'],
      medium: [
        'Use HTML + CSS to create a page with viewport-aware composition, spacing, and scroll behavior.',
      ],
      advanced: [
        'Add one interaction, reveal, or structural shift that changes how the browser frame is experienced.',
      ],
    },
  },
  reflection: [
    'What feels different when you think of the browser as a medium rather than a container?',
    'Which browser element feels most artistically interesting to you: the frame, the scroll, the layout, the window, or the interaction?',
    'Which artist from this chapter best demonstrates browser logic to you?',
    'How might your own work change if you treat the page itself as part of the artwork?',
  ],
  references: [
    { label: 'MDN — Viewport concepts', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts' },
    {
      label: 'Rhizome — On Olia Lialina’s My Boyfriend Came Back From the War',
      href: 'https://rhizome.org/editorial/2016/feb/29/olia-lialinas-my-boyfriend-came-back-from-the-war/',
    },
    { label: 'Whitney Museum — JODI', href: 'https://www.whitney.org/collection/works/33115' },
  ],
}
