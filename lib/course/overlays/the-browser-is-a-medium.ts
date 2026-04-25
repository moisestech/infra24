import type { Chapter, TemplateLink } from '@/lib/course/types'

const P1 =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1517694712202-3dd5178143fa?w=1200&q=80&auto=format&fit=crop'
const P3 =
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop'
const RAFAEL_ALMOST_THERE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777125902/dccmiami/workshops/vibe-coding-net-art/almost-there-rafel-rozenthal-2015_slobsc.jpg'
const RAFAEL_PFP =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777127697/dccmiami/workshops/vibe-coding-net-art/Rafael-Rozendaal_pfp_idh71i.jpg'
const WHITNEY_ARTPORT_IMAGE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777128008/dccmiami/workshops/vibe-coding-net-art/whitney-art-port_jsbsyv.png'
const TATE_INTERNET_IMAGE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777128101/dccmiami/workshops/vibe-coding-net-art/tate-internet-art_bhplg0.jpg'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 2 — browser as compositional medium between definition (Ch 1) and hypertext (Ch 3). */
export function theBrowserIsAMediumAsChapter(): Chapter {
  return {
    number: 2,
    design: { moduleAccent: 'violet', lessonSkin: 'browser-as-medium' },
    slug: 'the-browser-is-a-medium',
    title: 'The Browser as Medium',
    subtitle: 'Viewport, layout, scroll, windows, and browser behavior as artistic material',
    module: 'browser-language',
    estimatedTime: '40–70 min',
    difficulty: 'Beginner',
    thesis:
      'The browser is not just where a work appears. It can be the medium, the space, the frame, and part of the meaning.',
    summary:
      'This chapter introduces the browser as a compositional environment, showing how viewport, layout, framing, and browser behavior can operate as artistic material.',
    makingPreview: [
      'one-page browser composition',
      'viewport-aware layout',
      'framing or scroll logic',
      'a browser-native visual field',
    ],
    primaryAnchorCallout:
      'Rhizome’s presentation of *My Boyfriend Came Back from the War* shows how frames and divisions are not packaging—they are part of the work’s structure and feeling.',
    sections: [
      {
        id: 'browser-not-container',
        label: 'Concept',
        title: 'The browser is not a neutral container',
        body:
          'A browser page is not only a place to display content. It has edges, a viewport, a loading logic, a reading rhythm, and a visible frame. Those conditions shape how the work is experienced.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'viewport-composition',
        label: 'Concept',
        title: 'The viewport is a compositional field',
        body:
          'The visible browser window can be treated like a scene, a room, a stage, or a canvas. Scale, cropping, spacing, and placement all affect meaning.',
        icon: 'lucide:MousePointerSquareDashed',
      },
      {
        id: 'page-as-space',
        label: 'Concept',
        title: 'A webpage can behave like space',
        body:
          'Pages can be divided, layered, stretched, or sequenced. That means a webpage can feel architectural or cinematic rather than only informational.',
        icon: 'lucide:Columns',
      },
      {
        id: 'scroll-window-frame',
        label: 'Concept',
        title: 'Scroll, windows, and framing matter',
        body:
          'A page changes depending on whether it fills the browser, asks you to scroll, breaks into frames, or acts like a self-contained screen. These are formal decisions, not just technical defaults.',
        icon: 'lucide:MoveVertical',
      },
    ],
    chapterBanner: {
      src: RAFAEL_ALMOST_THERE,
      alt: 'Browser-based composition reference for Almost There (2015).',
      caption: 'Rafaël Rozendaal — Almost There (2015) reference.',
    },
    anchorWorks: [
      {
        title: 'My Boyfriend Came Back from the War',
        artist: 'Olia Lialina',
        year: '1996',
        description:
          'A foundational net artwork where browser frames and subdivision are part of the work’s emotional and narrative structure.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: P1,
          alt: 'Placeholder still for My Boyfriend Came Back from the War — replace with anthology capture.',
          caption: 'Placeholder — replace with rights-cleared frame still.',
        },
        links: [
          { label: 'View work', href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war' },
          { label: 'Read Rhizome essay', href: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/' },
        ],
      },
      {
        title: 'Almost There',
        artist: 'Rafaël Rozendaal',
        year: '2015',
        description:
          'A Whitney-commissioned browser work where the page, visibility, and cursor-based interaction become compositional material.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: RAFAEL_ALMOST_THERE,
          alt: 'Reference still for Almost There showing browser-native composition and cursor behavior.',
        },
        links: [
          { label: 'Whitney exhibition page', href: 'https://whitney.org/exhibitions/rafael-rozendaal' },
          { label: 'Whitney collection record', href: 'https://whitney.org/collection/works/47389' },
        ],
      },
    ],
    artists: [
      {
        name: 'Olia Lialina',
        description:
          'A foundational net artist whose work demonstrates how browser frames, text, and images can become the medium of the piece.',
        website: 'https://art.teleportacia.org/',
        tags: ['browser frames', 'hypertext', 'net art canon'],
      },
      {
        name: 'Rafaël Rozendaal',
        description:
          'A major browser-based artist whose works treat the website itself as pictorial and experiential form.',
        website: 'https://newrafael.com/',
        image: {
          src: RAFAEL_PFP,
          alt: 'Portrait image of Rafaël Rozendaal used for chapter artist spotlight.',
        },
        tags: ['browser composition', 'site as artwork', 'internet as canvas'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description: 'A major institutional frame for historically significant browser-native internet art.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'Whitney artport',
        description: 'The Whitney Museum’s portal to internet art and browser-native online commissions.',
        website: 'https://whitney.org/artport',
        image: {
          src: WHITNEY_ARTPORT_IMAGE,
          alt: 'Whitney artport website visual reference.',
        },
      },
      {
        name: 'Tate — Internet art',
        description: 'A concise institutional definition of internet art as art made on and for the internet.',
        website: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
        image: {
          src: TATE_INTERNET_IMAGE,
          alt: 'Tate internet art reference image.',
        },
      },
    ],
    curatorLenses: [
      {
        name: 'Michael Connor on My Boyfriend Came Back from the War',
        description:
          'Useful for understanding how frames, subdivisions, and browser-native structure contribute to narrative and feeling.',
        website: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/',
      },
      {
        name: 'Whitney framing of Rafaël Rozendaal',
        description: 'Useful for understanding the website itself as a visual and experiential medium, not just a delivery surface.',
        website: 'https://whitney.org/artists/17027',
        quote: 'uses the Internet as his canvas',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Useful for grounding browser-native art historically.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Useful for connecting browser-based form to broader digital art discourse.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description:
          'Use CodePen to build a one-page browser composition focused on spacing, framing, and viewport behavior.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Use a repo if the study benefits from cleaner structure or is growing toward a more complete browser piece.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Use Cursor to scaffold the page structure and explain layout, spacing, and viewport choices.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'browser-as-medium', term: 'Browser as medium' },
      { slug: 'viewport', term: 'Viewport' },
      { slug: 'page-as-space', term: 'Page as space' },
      { slug: 'scroll', term: 'Scroll' },
      { slug: 'url', term: 'URL' },
    ],
    imageAssets: [
      {
        src: P1,
        alt: 'Chapter 2 anchor image for My Boyfriend Came Back from the War',
        caption: 'Placeholder — replace with rights-cleared capture.',
      },
      {
        src: RAFAEL_ALMOST_THERE,
        alt: 'Chapter 2 reference image for Almost There (2015).',
        caption: 'Whitney / artport context reference.',
      },
      {
        src: P3,
        alt: 'Whitney artport reference mood image',
        caption: 'Placeholder mood still for institutional framing.',
      },
    ],
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-browser-as-medium',
      browserFrameAnatomy: {
        layers: [
          {
            label: 'Browser frame',
            note: 'The visible boundary and chrome of the browser matter.',
          },
          {
            label: 'Viewport',
            note: 'The visible window functions like a compositional field.',
          },
          {
            label: 'Page space',
            note: 'The full page may exceed what is visible at first glance.',
          },
          {
            label: 'Scroll / movement',
            note: 'How the viewer moves through the page changes the work.',
          },
        ],
      },
      pageAsSpaceDemo: {
        variants: [
          {
            label: 'Poster-like',
            body: 'Centered, fixed, immediate, and self-contained.',
          },
          {
            label: 'Room-like',
            body: 'Layered, spaced out, and navigated as a field.',
          },
          {
            label: 'Sequence-like',
            body: 'Unfolds through movement, framing, or scroll rhythm.',
          },
        ],
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser composition where framing, layout, spacing, or scroll carries meaning.',
        promptMove:
          'Ask the model to help make the page feel like a scene, room, stage, or browser-native composition rather than a generic website.',
        codepenPath: [
          'Start with one page only.',
          'Use spacing, blocks, and viewport-conscious composition.',
          'Treat the page as a visual field, not just a content container.',
        ],
        githubCursorPath: [
          'Create a simple repo with index.html and style.css.',
          'Ask Cursor to explain how layout and viewport decisions change the feel of the page.',
          'Refine browser-space choices instead of adding too much content.',
        ],
        templateLinks: starterLinks,
        output: 'A one-page browser composition that treats the browser window as part of the artwork.',
      },
      prompting: {
        goal: 'Build a browser-native composition rather than a generic webpage.',
        weakPrompt: 'Make a cool webpage layout.',
        betterPrompt:
          'Create a beginner-friendly one-page browser artwork that uses the viewport, spacing, and composition as part of the meaning. Make it feel like a scene, room, or browser-native visual field instead of a normal website. Keep the structure simple and explain the layout decisions.',
        reviewChecklist: [
          'Does the page feel composed rather than merely arranged?',
          'Does the viewport matter to the experience?',
          'Would the page lose something if it were just a screenshot in another format?',
          'Is the browser part of the meaning?',
        ],
      },
    },
    dossierLayout: 'phase',
    resources: [
      {
        type: 'work',
        title: 'My Boyfriend Came Back from the War',
        href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
        description: 'Canonical example of browser subdivision and frame logic as artistic form.',
        publisher: 'Rhizome Net Art Anthology',
        year: '1996',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'Rafaël Rozendaal: Almost There',
        href: 'https://whitney.org/exhibitions/rafael-rozendaal',
        description: 'Browser composition and visibility as artistic material.',
        publisher: 'Whitney Museum of American Art',
        year: '2015',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        href: 'https://whitney.org/artport',
        description: 'Whitney’s portal to internet art and browser-native commissions.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'artist',
        title: 'Whitney artist page for Rafaël Rozendaal',
        href: 'https://whitney.org/artists/17027',
        description: 'Institutional context for browser-based art as pictorial and experiential form.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Palette',
      },
      {
        type: 'article',
        title: 'Michael Connor essay on the work',
        href: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/',
        description: 'Interpretive essay focused on browser-native form and narrative structure.',
        publisher: 'Rhizome',
        year: '2016',
        region: 'online',
        icon: 'BookOpenText',
      },
      {
        type: 'article',
        title: 'Tate — Internet Art',
        href: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
        description: 'Concise institutional framing of internet art as art made on and for the internet.',
        publisher: 'Tate',
        region: 'international',
        icon: 'BookOpenText',
      },
      {
        type: 'article',
        title: 'MDN — HTML: HyperText Markup Language',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description: 'Primary overview of HTML as structure—the layer layout, viewport, and scroll sit on top of.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Browser materials (MDN primary)',
      },
      {
        type: 'article',
        title: 'MDN — HTML guides',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Guides',
        description: 'Topic-based HTML guides when composition needs more than one-off tags.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Browser materials (MDN primary)',
      },
      {
        type: 'article',
        title: 'MDN — HTML reference',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference',
        description: 'Fast element and attribute lookup while shaping page structure.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Browser materials (MDN primary)',
      },
      {
        type: 'article',
        title: 'W3Schools — HTML Tutorial',
        href: 'https://www.w3schools.com/html/',
        description: 'Optional quick examples and syntax checks alongside MDN.',
        publisher: 'W3Schools',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Quick lookup (W3Schools)',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Fast path for building browser-space studies.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'Cursor Quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted path for layout and structure refinement.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'Browser Composition Study',
      description:
        'Make a one-page browser artwork where spacing, framing, layout, or scroll affects meaning.',
      easy: ['Create a one-page study with a strong browser-aware layout and minimal content.'],
      medium: ['Use HTML + CSS to make the page feel like a room, poster, or spatial composition.'],
      advanced: [
        'Build a browser composition where framing, page size, or movement through the page becomes central to the work.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link or project folder',
        'One sentence explaining what makes the browser part of the work',
      ],
    },
    reflection: [
      'Did your page feel like a document, a room, a poster, or a sequence?',
      'What part of the browser mattered most to the composition?',
      'How did spacing or framing change the meaning of the page?',
      'What would be lost if the work were moved out of the browser?',
    ],
    previousChapterSlug: 'what-is-net-art',
    nextChapterSlug: 'hypertext-and-nonlinear-narrative',
  }
}
