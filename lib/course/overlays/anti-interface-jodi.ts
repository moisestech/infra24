import type { Chapter, TemplateLink } from '@/lib/course/types'

const P1 =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 4 — interface, glitch, disruption; JODI and institutional framing (Whitney + Rhizome). */
export function antiInterfaceJodiAsChapter(): Chapter {
  return {
    number: 4,
    design: { moduleAccent: 'violet', lessonSkin: 'interface-glitch' },
    slug: 'anti-interface-jodi',
    title: 'Interface, Glitch, and Disruption',
    subtitle: 'Anti-interface, designed resistance, and glitch as artistic language',
    module: 'browser-language',
    estimatedTime: '40–75 min',
    difficulty: 'Beginner',
    thesis:
      'A broken or resistant interface can be an artistic strategy when instability, confusion, or friction are part of the meaning.',
    summary:
      'This chapter introduces anti-interface and glitch as formal strategies, showing how browser-based works can use breakdown, interference, and resistance to shape attention and meaning—without collapsing into random noise.',
    makingPreview: [
      'one anti-interface study',
      'controlled disruption',
      'legibility vs instability',
      'a meaningful browser glitch',
    ],
    primaryAnchorCallout:
      'JODI’s practice shows that what looks like failure or overload can be authored browser behavior—Whitney’s dossier and exhibition pages are the clearest museum spine for that argument.',
    sections: [
      {
        id: 'interface-is-not-neutral',
        label: 'Concept',
        title: 'Interfaces are not neutral',
        body:
          'An interface is never just a transparent layer. It organizes access, action, clarity, and control. Artists can expose or disturb those assumptions.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'glitch-as-strategy',
        label: 'Concept',
        title: 'Glitch can be a strategy, not just an accident',
        body:
          'A glitch-like effect becomes artistic when it is used to shape feeling, critique smooth systems, or make instability visible as part of the work.',
        icon: 'lucide:ScanLine',
      },
      {
        id: 'legibility-spectrum',
        label: 'Concept',
        title: 'Legibility exists on a spectrum',
        body:
          'A work does not need to become unreadable to feel unstable. Small shifts in noise, overlap, delay, or broken hierarchy can change how a viewer reads the page.',
        icon: 'lucide:BookOpenText',
      },
      {
        id: 'designed-friction',
        label: 'Concept',
        title: 'Friction can be meaningful',
        body:
          'When a page resists easy navigation or smooth interaction, the viewer becomes more aware of the interface itself. That awareness can be the point.',
        icon: 'lucide:MousePointer2',
      },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1800&q=80&auto=format&fit=crop',
      alt: 'Dark abstract signal noise — chapter banner placeholder.',
      caption: 'Swap for Whitney installation stills or documentation capture when rights-cleared.',
    },
    anchorWorks: [
      {
        title: 'Untitled Game / jodi.org lineage',
        artist: 'JODI',
        year: '1990s–2000s',
        description:
          'JODI’s work is central to understanding anti-interface and browser disruption—HTML, windows, and visual breakdown used to unsettle expectations of usability.',
        institution: 'Whitney Museum / broader internet art discourse',
        image: {
          src: P1,
          alt: 'Placeholder mood image for JODI-related browser disruption — replace with documentation still.',
          caption: 'Placeholder — replace with rights-cleared capture.',
        },
        links: [
          { label: 'Whitney — JODI (artist)', href: 'https://whitney.org/artists/15261' },
          { label: 'Whitney — Exhibition: JODI', href: 'https://whitney.org/exhibitions/jodi' },
        ],
      },
      {
        title: 'Early web art — breakdown aesthetics',
        artist: 'JODI / internet art canon',
        year: '1990s',
        description:
          'Early web art often turned browser instability, visual noise, and code-level interference into formal language—noise as syntax, not only as error.',
        institution: 'Rhizome / Whitney context',
        image: {
          src: P2,
          alt: 'Placeholder mood image for glitch and anti-interface aesthetics.',
        },
        links: [{ label: 'Whitney — Exhibition: JODI', href: 'https://whitney.org/exhibitions/jodi' }],
      },
    ],
    artists: [
      {
        name: 'JODI',
        description:
          'Foundational duo (Joan Heemskerk & Dirk Paesmans) in internet art: destabilizing browser expectations through code, noise, visual breakdown, and anti-interface strategies.',
        website: 'https://jodi.org/',
        tags: ['anti-interface', 'glitch', 'browser disruption'],
      },
    ],
    institutions: [
      {
        name: 'Whitney Museum of American Art',
        description:
          'Institutional frame for JODI and browser-based disruption within internet and digital art history—artist dossier, exhibition narrative, and installation documentation.',
        website: 'https://whitney.org/',
      },
      {
        name: 'Rhizome',
        description: 'Internet art history, preservation, and discourse around born-digital practices.',
        website: 'https://rhizome.org/',
      },
    ],
    curatorLenses: [
      {
        name: 'Whitney framing of JODI',
        description:
          'Useful for understanding JODI’s place in the institutional history of internet and browser-based art.',
        website: 'https://whitney.org/exhibitions/jodi',
      },
      {
        name: 'Anti-interface as artistic critique',
        description:
          'A lens for reading unstable or resistant browser behavior as conceptual structure rather than error alone.',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Grounds anti-interface and glitch within broader internet art history.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Connects glitch and browser disruption to wider digital art discourse.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Use CodePen to build a one-page anti-interface study with controlled disruption.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Use a repo if the work needs multiple files or preserved states of the disruption.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Use Cursor to structure controlled disorder, tune readability, and keep disruption intentional.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'interface', term: 'Interface' },
      { slug: 'anti-interface', term: 'Anti-interface' },
      { slug: 'glitch', term: 'Glitch' },
      { slug: 'legibility', term: 'Legibility' },
      { slug: 'responsive-behavior', term: 'Responsive behavior' },
    ],
    imageAssets: [
      { src: P1, alt: 'Chapter 4 mood image — JODI / disruption placeholder.', caption: 'Placeholder — replace when cleared.' },
      { src: P2, alt: 'Chapter 4 mood image — glitch browser placeholder.', caption: 'Placeholder — replace when cleared.' },
    ],
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-interface-glitch',
      interfaceBreakDemo: {
        left: {
          label: 'Smooth',
          points: [
            'clear hierarchy',
            'stable navigation',
            'readable content',
            'predictable behavior',
          ],
        },
        right: {
          label: 'Broken / resistant',
          points: [
            'overlap or interference',
            'unstable reading order',
            'partial visibility',
            'designed friction',
          ],
        },
      },
      legibilityShiftCard: {
        stages: [
          { label: 'Readable', body: 'Clear spacing and hierarchy.' },
          { label: 'Tense', body: 'Small disruptions create friction.' },
          { label: 'Unstable', body: 'The interface becomes visibly unreliable.' },
        ],
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser study where disruption, interference, or resistance affects meaning.',
        promptMove:
          'Ask the model to generate controlled instability rather than random chaos, keeping one clear conceptual effect.',
        codepenPath: [
          'Start with one page and one type of disruption only.',
          'Use overlap, noise, broken hierarchy, or unstable visibility.',
          'Keep enough structure so the page still feels intentionally authored.',
        ],
        githubCursorPath: [
          'Create a simple repo with index.html, style.css, and optional script.js.',
          'Ask Cursor to tune the balance between clarity and disorder.',
          'Use multiple saved states if you want to compare more and less disrupted versions.',
        ],
        templateLinks: starterLinks,
        output:
          'A browser-based anti-interface study where resistance or glitch is deliberate and meaningful.',
      },
      prompting: {
        goal: 'Build a page with designed disruption.',
        weakPrompt: 'Make a glitchy experimental website.',
        betterPrompt:
          'Create a beginner-friendly one-page browser artwork that uses controlled disruption. Use overlap, unstable hierarchy, or partial illegibility to create tension, but keep the page intentionally authored and conceptually readable. Explain how the disorder is being structured.',
        reviewChecklist: [
          'Is the disruption intentional rather than random?',
          'Can I still tell what the work is trying to do?',
          'Does the glitch or friction change meaning?',
          'Is the balance between readability and instability tuned well?',
        ],
      },
    },
    resources: [
      {
        type: 'artist',
        title: 'JODI — official site',
        href: 'https://jodi.org/',
        description: 'Primary artist site for browser disruption and anti-interface practice.',
        publisher: 'Artist website',
        region: 'online',
        icon: 'Palette',
      },
      {
        type: 'institution',
        title: 'Whitney — JODI (artist)',
        href: 'https://whitney.org/artists/15261',
        description: 'Biography, chronology, and collection-facing context.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'exhibition',
        title: 'Whitney exhibition: JODI',
        href: 'https://whitney.org/exhibitions/jodi',
        description: 'Curatorial framing for browser disruption and anti-interface strategies.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Presentation',
      },
      {
        type: 'institution',
        title: 'Rhizome',
        href: 'https://rhizome.org/',
        description: 'Broader context for internet art discourse and preservation.',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Fast path for controlled glitch or anti-interface studies.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'Cursor Quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted path for tuning clarity versus disruption.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'Anti-interface study',
      description:
        'Make a one-page browser artwork where disruption, friction, or glitch changes how the work is read.',
      easy: [
        'Create a one-page study with one controlled disruption—overlap, broken hierarchy, or unstable visibility.',
      ],
      medium: [
        'Use HTML + CSS + optional JS so the page can move between readable and resistant states.',
      ],
      advanced: [
        'Build a browser work where interface instability is tightly connected to a concept or critique.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link or project folder',
        'One sentence explaining what the disruption is doing conceptually',
      ],
    },
    reflection: [
      'Did the page feel broken, resistant, or critically unstable?',
      'How much legibility did the work need to keep?',
      'What did friction make the viewer notice?',
      'When does a glitch become expressive rather than random?',
    ],
    previousChapterSlug: 'hypertext-and-nonlinear-narrative',
    nextChapterSlug: 'interaction-motion-and-responsive-behavior',
  }
}
