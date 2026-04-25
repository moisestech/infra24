import type { Chapter, TemplateLink } from '@/lib/course/types'

const P1 =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 5 — interaction, motion, timed change; Whitney *Almost There*, Sunrise/Sunset, ecoarttech commission. */
export function interactionMotionAndResponsiveBehaviorAsChapter(): Chapter {
  return {
    number: 5,
    design: { moduleAccent: 'violet', lessonSkin: 'interaction-motion' },
    slug: 'interaction-motion-and-responsive-behavior',
    title: 'Interaction, Motion, and Responsive Behavior',
    subtitle: 'Hover, click, delay, animation, and state change as artistic meaning',
    module: 'browser-language',
    estimatedTime: '40–75 min',
    difficulty: 'Beginner',
    thesis: 'Interaction and motion are not decoration. They can be the meaning of the work.',
    makingPreview: [
      'One interactive browser page',
      'One clear state change',
      'Hover, click, or timed behavior',
      'A readable emotional effect',
    ],
    primaryAnchorCallout:
      'Whitney’s *Almost There* uses cursor movement to cast spinning light and shadow across whitney.org—legibility, visibility, and the live site become the artwork.',
    summary:
      'This chapter treats hover, click, delay, and animation as compositional tools: movement steers attention and mood, pages can hold multiple states, and timed commissions such as Sunrise/Sunset frame the browser as a short public event.',
    sections: [
      {
        id: 'interaction-is-meaning',
        label: 'Concept',
        title: 'Interaction can be the point',
        body:
          'A hover, click, drag, or timed response is not always an enhancement on top of content. In browser-based art, interaction can be how the work unfolds.',
        icon: 'lucide:MousePointerClick',
      },
      {
        id: 'motion-changes-reading',
        label: 'Concept',
        title: 'Motion changes how we read',
        body:
          'Movement steers attention, pacing, emotion, and legibility. A small timing shift can make the same surface feel playful, anxious, meditative, or unstable.',
        icon: 'lucide:Sparkles',
      },
      {
        id: 'responsive-state',
        label: 'Concept',
        title: 'A page can have states',
        body:
          'Browser art can move between visible conditions based on input or time—the work is a set of transitions, not a single fixed poster.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'event-structure',
        label: 'Concept',
        title: 'The browser can become an event',
        body:
          'When change depends on hover, delay, or the cursor path, the encounter becomes event-based—closer to performance than to a static wall label.',
        icon: 'lucide:Timer',
      },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1800&q=80&auto=format&fit=crop',
      alt: 'Abstract violet light trails suggesting motion and interface — chapter banner placeholder.',
      caption: 'Replace with Almost There or Sunrise/Sunset documentation when rights-cleared.',
    },
    anchorWorks: [
      {
        title: 'Almost There',
        artist: 'Rafaël Rozendaal',
        year: '2015',
        description:
          'A Whitney-commissioned internet artwork: cursor movement casts spinning shadows or light over the Whitney site, suspending it between legibility and illegibility, visibility and invisibility.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: P1,
          alt: 'Placeholder still for Almost There — replace with Whitney documentation capture.',
          caption: 'Placeholder — replace with rights-cleared capture.',
          credit: 'Whitney Museum of American Art',
        },
        links: [
          { label: 'Whitney exhibition page', href: 'https://whitney.org/exhibitions/rafael-rozendaal' },
          { label: 'Whitney collection record', href: 'https://whitney.org/collection/works/47389' },
        ],
      },
      {
        title: 'Untitled Landscape #5',
        artist: 'ecoarttech',
        year: '2009',
        description:
          'A Whitney Sunrise/Sunset commission: fluctuating orbs of light disrupt the museum’s information environment; their size and speed vary with site visitation—network-responsive, timed browser behavior.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: P2,
          alt: 'Placeholder for ecoarttech Sunrise/Sunset commission — replace with documentation capture.',
          caption: 'Sunrise/Sunset series (placeholder).',
          credit: 'Whitney Museum of American Art',
        },
        links: [
          { label: 'Whitney project page', href: 'https://whitney.org/exhibitions/ecoarttech' },
          { label: 'Sunrise version (media)', href: 'https://whitney.org/media/127' },
        ],
      },
    ],
    artists: [
      {
        name: 'Rafaël Rozendaal',
        description:
          'Browser windows as pictorial and interactive space—works often read as short, luminous events on the open web.',
        website: 'https://newrafael.com/',
        tags: ['browser composition', 'interaction', 'internet as canvas'],
      },
      {
        name: 'ecoarttech',
        description:
          'Collaborative practice linking landscape, technology, and participatory digital systems—timed commissions that respond to live traffic.',
        website: 'https://www.ecoarttech.net/',
        tags: ['networked environment', 'timed behavior', 'interactive systems'],
      },
    ],
    institutions: [
      {
        name: 'Whitney artport',
        description:
          'The Whitney’s portal to internet art and online commissions of net art and new media—including timed works on whitney.org.',
        website: 'https://whitney.org/artport',
      },
      {
        name: 'Sunrise/Sunset',
        description:
          'A Whitney series of internet art commissions for whitney.org, each unfolding over roughly ten to thirty seconds; organized by Christiane Paul, Curator of Digital Art.',
        website: 'https://whitney.org/artport/sunrise-sunset',
      },
    ],
    curatorLenses: [
      {
        name: 'Christiane Paul / Sunrise–Sunset',
        description:
          'Curatorial frame for timed, browser-native commissions as a museum format—site, clock, and public URL as part of the work.',
        website: 'https://whitney.org/artport/sunrise-sunset',
        quote:
          'The Sunrise/Sunset series was organized by Christiane Paul, Curator of Digital Art at the Whitney Museum of American Art.',
      },
      {
        name: 'Whitney — Almost There',
        description:
          'Exhibition context for cursor-driven visibility, obscuring/revealing, and the live Whitney domain as artistic material.',
        website: 'https://whitney.org/exhibitions/rafael-rozendaal',
      },
    ],
    books: [
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Interactivity, institutions, and browser-native formats in museum context.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Historical grounding for web-based form and interaction.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Prototype hover, click, delay, and state-change behavior in one page.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Versioned files when the study grows beyond a single pen.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Explain transitions, simplify JS, and keep interaction code readable.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'MDN — CSS transitions',
        category: 'quick-start',
        description: 'State change over time (hover, focus, class toggles).',
        website: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using',
      },
      {
        name: 'MDN — CSS animations',
        category: 'quick-start',
        description: 'Keyframes and duration for motion as a designed event.',
        website: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations',
      },
      {
        name: 'p5.js',
        category: 'advanced',
        description: 'Optional path from CSS interaction toward richer creative coding motion.',
        website: 'https://p5js.org/',
      },
    ],
    glossaryTerms: [
      { slug: 'interaction', term: 'Interaction' },
      { slug: 'motion', term: 'Motion' },
      { slug: 'responsive-behavior', term: 'Responsive behavior' },
      { slug: 'hover', term: 'Hover' },
      { slug: 'liveness', term: 'Liveness' },
    ],
    imageAssets: [
      {
        src: P1,
        alt: 'Chapter still placeholder — interaction / interface mood.',
        caption: 'Replace with Almost There or Sunrise/Sunset capture.',
      },
    ],
    dossierLayout: 'phase',
    resources: [
      {
        type: 'work',
        title: 'Rafaël Rozendaal: Almost There',
        href: 'https://whitney.org/exhibitions/rafael-rozendaal',
        description: 'Primary anchor: cursor, visibility, and the live Whitney site as form.',
        publisher: 'Whitney Museum of American Art',
        year: '2015',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'Whitney collection — Almost There',
        href: 'https://whitney.org/collection/works/47389',
        description: 'Collection record and series context.',
        publisher: 'Whitney Museum of American Art',
        year: '2015',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'ecoarttech: Untitled Landscape #5',
        href: 'https://whitney.org/exhibitions/ecoarttech',
        description: 'Sunrise/Sunset commission; visitation-responsive orbs of light.',
        publisher: 'Whitney Museum of American Art',
        year: '2009',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        href: 'https://whitney.org/artport',
        description: 'Portal to internet art and online commissions.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'exhibition',
        title: 'Sunrise/Sunset',
        href: 'https://whitney.org/artport/sunrise-sunset',
        description: 'Timed browser commissions on whitney.org (10–30 second unfoldings).',
        publisher: 'Whitney Museum of American Art',
        year: '2009–2024',
        region: 'international',
        icon: 'Presentation',
      },
      {
        type: 'artist',
        title: 'Rafaël Rozendaal — Whitney artist',
        href: 'https://whitney.org/artists/17027',
        description: 'Institutional biography and work list.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Palette',
      },
      {
        type: 'article',
        title: 'MDN — Using CSS transitions',
        href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions/Using',
        description: 'How transition properties shape timed change in the browser—primary for motion as interface.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Interaction & motion (MDN)',
      },
      {
        type: 'article',
        title: 'MDN — Introduction to events',
        href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events',
        description: 'How clicks, hovers, and other events drive behavior in web pages.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'Code2',
        dossierGroup: 'Interaction & motion (MDN)',
      },
      {
        type: 'article',
        title: 'MDN — Document Object Model (DOM)',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
        description: 'How the browser represents the page as objects scripts and CSS can target.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Interaction & motion (MDN)',
      },
      {
        type: 'article',
        title: 'W3Schools — HTML Tutorial',
        href: 'https://www.w3schools.com/html/',
        description: 'Optional quick HTML lookup when you’re wiring markup before styling or scripting.',
        publisher: 'W3Schools',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Quick lookup (W3Schools)',
      },
      {
        type: 'tool',
        title: 'p5.js',
        href: 'https://p5js.org/',
        description: 'Optional deeper motion and interaction coding.',
        publisher: 'p5.js',
        region: 'online',
        icon: 'Code2',
      },
    ],
    artifact: {
      title: 'Interactive state study',
      description:
        'A one-page browser artwork where a hover, click, or timed change alters how the page reads—behavior carries the idea.',
      easy: ['One hover or click that clearly changes text, visibility, or mood.'],
      medium: ['HTML + CSS + optional JS: two meaningful states on the same page.'],
      advanced: [
        'Layer timing or sequence so interaction steers legibility, emotion, or structure in a deliberate way.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo or folder',
        'One sentence: what the interaction does to the work',
      ],
    },
    reflection: [
      'What changed when the page moved or responded?',
      'Did the interaction feel meaningful or merely decorative?',
      'What kind of motion best matched your concept?',
      'How does a responsive page change the experience of reading or looking?',
    ],
    previousChapterSlug: 'anti-interface-jodi',
    nextChapterSlug: 'remix-appropriation-and-internet-vernacular',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-interaction-motion',
      hoverStateDemo: {
        title: 'Hover state demo',
        description:
          'Two panels: a resting state and a hover-activated shift—mirroring how Almost There rewards movement before the page “settles.”',
        states: [
          { label: 'Default', body: 'The surface reads stable and at rest; attention can scan without demand.' },
          {
            label: 'Hover',
            body: 'The same surface shifts mood or visibility only when the viewer moves into it—interaction as content.',
          },
        ],
      },
      motionRhythmPreview: {
        title: 'Motion rhythm preview',
        description:
          'Sunrise/Sunset commissions unfold in short timed windows on whitney.org—rhythm changes how urgency, atmosphere, and trust read online.',
        rhythms: [
          { label: 'Instant', body: 'Feels abrupt, responsive, and direct—good for shocks or punchlines.' },
          { label: 'Slow', body: 'Feels gradual and atmospheric—closer to breath, drift, or ceremony.' },
          { label: 'Delayed', body: 'Builds suspense or doubt before the change lands.' },
          { label: 'Looped', body: 'Reads as environment or weather rather than a one-off gesture.' },
        ],
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser artwork where hover, click, delay, or a short timed change carries meaning.',
        promptMove:
          'Ask the model for a minimal page with one clear interaction and one named emotional effect (e.g. uneasy, playful, tender). Keep the DOM small and explain how the state change works.',
        codepenPath: [
          'Start with one page and one event only.',
          'Use hover, click, or a short delay to create a state change.',
          'Keep the interaction conceptually legible—not only flashy.',
        ],
        githubCursorPath: [
          'Add index.html, style.css, and optional script.js.',
          'Ask Cursor to simplify the interaction and name each state in comments.',
          'Tune timing until the motion matches the feeling you named.',
        ],
        templateLabel: 'Starter links',
        templateLinks: starterLinks,
        output: 'A one-page browser artwork where interaction or motion meaningfully changes the viewer’s experience.',
      },
      prompting: {
        goal: 'shape a small interactive browser artwork',
        weakPrompt: '“Make an interactive website with animation.”',
        betterPrompt:
          '“I need a beginner-friendly one-page browser artwork with one meaningful interaction. Use hover, click, or a short delay to change visibility, mood, or legibility. Keep the code simple and list the two states the viewer can compare.”',
        reviewChecklist: [
          'Does the interaction matter conceptually?',
          'Is there one main behavior to focus on?',
          'Does motion change how the page feels or reads?',
          'Is the behavior easy to test in a few seconds?',
        ],
      },
    },
  }
}
