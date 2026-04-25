import type { Chapter, TemplateLink } from '@/lib/course/types'

const BANNER =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777125564/dccmiami/workshops/vibe-coding-net-art/simple-net-art-diagram-rhizome_zdvktb.jpg'
const OLIA_FRAME =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777125599/dccmiami/workshops/vibe-coding-net-art/olia-lialina-my-boyfriend-came-back-from-war-rhizome_l05f0q.jpg'
const MBFBFTW_NETSCAPE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777125356/dccmiami/workshops/vibe-coding-net-art/mbcbftw-netscape-3_olia-lialina_dvhbug.png'
const PETRA_MOMA =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777125598/dccmiami/workshops/vibe-coding-net-art/petra-cortright-moma_lvnrrn.jpg'
const OLIA_PFP =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777127227/dccmiami/workshops/vibe-coding-net-art/Olia_Lialina_at_the_GeoCities_Research_Institute_Library_at_Merz_Akademie_Stuttgart_pfp_xmn1yl.jpg'
const RHIZOME_ANTHOLOGY_LOGO =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777127371/dccmiami/workshops/vibe-coding-net-art/rhizome-net-art-anthology_ap6nto.png'
const TATE_LOGO =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777127470/dccmiami/workshops/vibe-coding-net-art/tate-logo-white-bg_rqvdww.webp'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 1 — front door: trust, definition, first build; museum-forward with one guided studio strip + comparison. */
export function whatIsNetArtAsChapter(): Chapter {
  return {
    number: 1,
    design: { moduleAccent: 'blue', lessonSkin: 'canon-entry' },
    slug: 'what-is-net-art',
    title: 'What Is Net Art?',
    subtitle: 'Net art as web-native, browser-based, and networked artistic practice',
    module: 'orientation',
    estimatedTime: '35–55 min',
    difficulty: 'Beginner',
    thesis:
      'Net art is not just art online. It is art made for, through, or with the internet and its structures.',
    makingPreview: [
      'One-page browser definition study',
      'One clear net art claim',
      'One strong browser decision',
      'A first publishable sketch',
    ],
    primaryAnchorCallout:
      'Rhizome’s Net Art Anthology presents this work as a foundational browser-native narrative—frames, sparse text, and the link as structure.',
    summary:
      'This chapter introduces the field through key works and institutions, then moves straight into a small browser study so you learn net art as both history and practice.',
    sections: [
      {
        id: 'not-just-uploaded',
        label: 'Concept',
        title: 'Net art is not simply art uploaded online',
        body:
          'A painting on a museum website is not automatically net art. Net art usually depends on the browser, network, links, structure, timing, or interaction as part of the work itself.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'made-for-the-web',
        label: 'Concept',
        title: 'Made for the web',
        body:
          'Net art is often built for web-based environments. The page, browser, network, or URL is not only where the work appears—it is part of how the work means.',
        icon: 'lucide:Globe',
      },
      {
        id: 'field-and-canon',
        label: 'Concept',
        title: 'A field with artists, institutions, and history',
        body:
          'Net art has a canon, museums, curators, preservation debates, and decades of experimentation. Tate describes internet art as made on and for the internet—not merely uploaded to it.',
        icon: 'lucide:Building2',
      },
      {
        id: 'making-through-history',
        label: 'Concept',
        title: 'This course teaches through making',
        body:
          'You will learn ideas by building small browser studies. Making is part of understanding—not an extra after reading.',
        icon: 'lucide:Code2',
      },
    ],
    chapterBanner: {
      src: BANNER,
      alt: 'Diagram-style visual introducing net art through browser, network, and link structure.',
      caption: 'Net Art Anthology context diagram.',
    },
    anchorWorks: [
      {
        title: 'My Boyfriend Came Back from the War',
        artist: 'Olia Lialina',
        year: '1996',
        description:
          'Rhizome’s Net Art Anthology presents this work as foundational: browser frames and sparse text produce a nonlinear narrative through web structure.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: OLIA_FRAME,
          alt: 'Still from My Boyfriend Came Back from the War showing frame-based browser composition.',
          caption: 'Rhizome anthology still.',
        },
        links: [
          { label: 'Anthology (work page)', href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war' },
          { label: 'Rhizome', href: 'https://rhizome.org/' },
        ],
      },
      {
        title: 'VVEBCAM',
        artist: 'Petra Cortright',
        year: '2007',
        description:
          'Anthology presentation of a YouTube-era webcam piece: clip-art and platform-native graphics turn self-presentation into artistic material.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: PETRA_MOMA,
          alt: 'Reference image for Petra Cortright with webcam-era internet vernacular aesthetics.',
        },
        links: [{ label: 'Anthology (work page)', href: 'https://anthology.rhizome.org/vvebcam' }],
      },
    ],
    artists: [
      {
        name: 'Olia Lialina',
        description: 'Foundational net artist: browser narrative, frames, and early web aesthetics.',
        website: 'https://art.teleportacia.org/',
        image: {
          src: OLIA_PFP,
          alt: 'Portrait photo of Olia Lialina used for chapter artist spotlight.',
        },
        tags: ['hypertext', 'browser narrative', 'net art canon'],
      },
      {
        name: 'Petra Cortright',
        description: 'Webcam aesthetics, platform-native self-presentation, and internet vernacular as material.',
        website: 'https://www.petrapaulacortright.com/',
        image: {
          src: PETRA_MOMA,
          alt: 'Petra Cortright reference image from museum context.',
        },
        tags: ['platform-native', 'vernacular', 'digital self-image'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description: 'Curated presentation and preservation context for historically significant internet artworks.',
        website: 'https://anthology.rhizome.org/',
        image: {
          src: RHIZOME_ANTHOLOGY_LOGO,
          alt: 'Rhizome Net Art Anthology logo.',
        },
      },
      {
        name: 'Whitney artport',
        description:
          'The Whitney’s portal to internet art and online commissions of net art and new media—including timed browser works on whitney.org.',
        website: 'https://whitney.org/artport',
      },
      {
        name: 'Tate — internet art',
        description: 'Institutional framing: internet art is made on and for the internet, not only shown there.',
        website: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
        image: {
          src: TATE_LOGO,
          alt: 'Tate logo on white background.',
        },
      },
    ],
    curatorLenses: [
      {
        name: 'Tate — definition of internet art',
        description:
          'A short, institutionally legible definition: internet art is made on and for the internet—form and encounter are web-native.',
        website: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
      },
      {
        name: 'Whitney artport',
        description:
          'Museum commissioning and presentation of browser-native work—public URL and live site as part of the artwork’s form.',
        website: 'https://whitney.org/artport',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Introductory survey of the field’s first wave.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Curatorial and historical context for digital and internet-based art in museums.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'Net Art Anthology',
        category: 'quick-start',
        description: 'Primary entry point for canonical web-native works and contextual framing.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Fast path for a one-page definition study in the browser.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Versioned project folder when you want the study to grow toward publishing.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Scaffold and revise HTML/CSS with plain-language help.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'net-art', term: 'Net art' },
      { slug: 'browser-as-medium', term: 'Browser as medium' },
      { slug: 'page-as-space', term: 'Page as space' },
      { slug: 'publishing', term: 'Publishing' },
      { slug: 'vibecoding', term: 'Vibecoding' },
    ],
    imageAssets: [
      {
        src: OLIA_FRAME,
        alt: 'My Boyfriend Came Back from the War anthology still.',
        caption: 'Rhizome anthology reference.',
      },
      {
        src: PETRA_MOMA,
        alt: 'Petra Cortright museum-context reference image.',
        caption: 'Platform-native portrait context.',
      },
    ],
    dossierLayout: 'phase',
    resources: [
      {
        type: 'institution',
        title: 'Rhizome Net Art Anthology',
        description: 'Historically significant internet artworks with documentation and context.',
        href: 'https://anthology.rhizome.org/',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        description: 'Portal to internet art and online commissions at the Whitney.',
        href: 'https://whitney.org/artport',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'work',
        title: 'My Boyfriend Came Back from the War',
        description: 'Foundational browser-native narrative (anthology page).',
        href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
        publisher: 'Rhizome',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'VVEBCAM',
        description: 'Platform-native webcam work (anthology page).',
        href: 'https://anthology.rhizome.org/vvebcam',
        publisher: 'Rhizome',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'article',
        title: 'Tate — Internet art',
        description: 'Definition and context: art made on and for the internet.',
        href: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
        publisher: 'Tate',
        region: 'international',
        icon: 'Newspaper',
      },
      {
        type: 'article',
        title: 'MDN — HTML: HyperText Markup Language',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description:
          'Light refresher: HTML as the browser’s structural layer—enough context without turning this chapter into a tutorial.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Browser materials (light touch)',
      },
      {
        type: 'article',
        title: 'MDN — Basic HTML syntax',
        href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax',
        description: 'Elements, tags, and document structure when you’re wiring a definition or study page.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'Code2',
        dossierGroup: 'Browser materials (light touch)',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Quick browser sketches.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'GitHub Pages — About',
        href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
        description: 'When you are ready to move from study to a public URL.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'Code2',
      },
    ],
    artifact: {
      title: 'Definition as webpage',
      description:
        'Make a one-page browser study that states what net art is for you right now—form should support the claim.',
      easy: ['One HTML page with a title, one short statement, and one clear layout or color choice.'],
      medium: ['Use HTML + CSS so the page structure reinforces your definition (columns, contrast, or spacing).'],
      advanced: [
        'Add one interaction (hover, link, or simple state change) that makes the definition feel enacted, not only written.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link or folder',
        'One sentence: how your page defines net art',
      ],
    },
    reflection: [
      'What makes net art different from art simply shown online?',
      'Which anchor work made the field feel most real to you?',
      'What browser-based choice in your study felt most meaningful?',
      'Did making a page help you understand the definition better?',
    ],
    previousChapterSlug: 'getting-started-with-vibecoding',
    nextChapterSlug: 'the-browser-is-a-medium',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-canon-entry',
      canonIntroStrip: {
        title: 'Canon intro strip',
        description:
          'Four quick anchors—artist, work, institution, and the question this course keeps returning to as you build.',
        items: [
          { label: 'Artist', value: 'Olia Lialina', note: 'Central to browser-native narrative and early web form.' },
          {
            label: 'Work',
            value: 'My Boyfriend Came Back from the War',
            note: 'A canonical early net artwork in the Rhizome anthology.',
          },
          { label: 'Institution', value: 'Rhizome', note: 'Born-digital art, anthology, preservation, criticism.' },
          {
            label: 'Question',
            value: 'What makes a browser work art?',
            note: 'You answer by making small studies, not only by reading.',
          },
        ],
      },
      netArtVsArtOnline: {
        title: 'Net art vs art online',
        description:
          'Tate’s line is useful here: internet art is made on and for the internet. This card separates that from work that is only documented or displayed online.',
        left: {
          title: 'Net art',
          points: [
            'Built for or through the browser',
            'Depends on web structure, timing, or interaction',
            'The internet is part of the work’s form',
          ],
        },
        right: {
          title: 'Art online',
          points: [
            'Documented or displayed on the web',
            'The site may host images or information only',
            'The browser is not necessarily part of the artwork itself',
          ],
        },
      },
      vibecoding: {
        buildMove: 'Make a one-page browser study that expresses your current definition of net art.',
        promptMove:
          'Ask the model to help you structure a minimal page: one headline, one short argument, and one visual or layout decision that makes the browser part of the meaning.',
        codepenPath: [
          'Start with one page only.',
          'Use one sentence, one title, and one strong browser decision.',
          'Keep the page minimal—clarity over polish.',
        ],
        githubCursorPath: [
          'Create a folder with index.html and style.css.',
          'Ask Cursor to explain the file structure and suggest one revision to strengthen the claim.',
          'Use the repo path when you want the study to grow toward later chapters.',
        ],
        templateLabel: 'Starter links',
        templateLinks: starterLinks,
        output: 'A one-page browser-based definition study that argues what net art is.',
      },
      prompting: {
        goal: 'shape a first browser-based definition study',
        weakPrompt: '“Make a net art website.”',
        betterPrompt:
          '“I need a beginner-friendly one-page browser study that explains what makes net art different from art simply shown online. Keep it minimal: one headline, one short text block, and one layout or color choice that supports the idea. List the HTML structure you recommend.”',
        reviewChecklist: [
          'Does the page express one clear claim?',
          'Does the browser or layout feel part of the argument?',
          'Is it small enough to finish today?',
          'Does it read as a study, not a generic landing page?',
        ],
      },
    },
  }
}
