import type { Chapter, TemplateLink } from '@/lib/course/types'

const IMG_M =
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format&fit=crop'
const IMG_A =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80&auto=format&fit=crop'
const IMG_GRID =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop'
const BANNER =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  {
    label: 'GitHub Pages — About',
    href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
    kind: 'download',
  },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 11 — capstone: synthesize the course into one framed, publishable browser artwork. */
export function finalProjectBuildPublishAsChapter(): Chapter {
  return {
    number: 11,
    design: { moduleAccent: 'emerald', lessonSkin: 'final-capstone' },
    slug: 'final-project-build-publish-and-frame-your-net-artwork',
    title: 'Final Project — Build, Publish, and Frame Your Net Artwork',
    subtitle: 'Capstone concept, scope, build path, publishing, and artistic framing',
    module: 'public-work-advanced',
    estimatedTime: '60–120 min',
    difficulty: 'Intermediate',
    thesis:
      'A final net artwork is not just a finished webpage. It is a concept, a structure, a public form, and a framed artistic statement.',
    makingPreview: [
      'One final browser artwork',
      'One chosen pathway',
      'One title and short statement',
      'Live or presentation-ready output',
    ],
    primaryAnchorCallout:
      'Olia Lialina’s *My Boyfriend Came Back from the War* shows how a compact hypertext can carry enormous historical weight; Rozendaal’s *Almost There* shows how browser-native interaction and public site context can be the whole artwork—both are models of scope, not scale.',
    summary:
      'This chapter helps you synthesize net art history, browser form, interaction, remix, identity, systems, publishing, and optional advanced pathways into one intentional piece: clear concept, realistic scope, shareable URL or presentation kit, and a short statement that names what the work does in a browser-based art context.',
    sections: [
      {
        id: 'scope-matters',
        label: 'Concept',
        title: 'A finished small work is stronger than an unfinished huge one',
        body:
          'Scope the final project so it can actually ship. A small, coherent browser artwork that viewers can read in one sitting beats an overextended idea that never becomes legible or live.',
        icon: 'lucide:Target',
      },
      {
        id: 'concept-and-form',
        label: 'Concept',
        title: 'Your concept should shape the form',
        body:
          'The strongest capstones do not “pick a style” first. They connect the idea to browser structure, interaction, pacing, imagery, and how the work is published or presented.',
        icon: 'lucide:Palette',
      },
      {
        id: 'pathway-choice',
        label: 'Concept',
        title: 'Choose the right pathway for the idea',
        body:
          'Not every final piece needs p5.js or three.js. Some works are strongest as HTML/CSS compositions; others need generative logic or a spatial scene. Match the stack to the idea—not the resume.',
        icon: 'lucide:Compass',
      },
      {
        id: 'framing-is-part-of-the-artwork',
        label: 'Concept',
        title: 'Framing is part of the artwork',
        body:
          'Title, URL, short statement, and how you introduce the work in critique or online matter. Framing helps viewers understand what the piece is doing—and why it belongs in net art discourse.',
        icon: 'lucide:BookOpenText',
      },
    ],
    chapterBanner: {
      src: BANNER,
      alt: 'Calm collaborative desk suggesting completion and handoff — chapter banner placeholder.',
      caption: 'Replace with documentation of your own cohort’s final presentations when available.',
    },
    anchorWorks: [
      {
        title: 'My Boyfriend Came Back from the War',
        artist: 'Olia Lialina',
        year: '1996',
        description:
          'A landmark hypertext: formally small in the browser, yet historically central—proof that final works succeed through concept and structure, not file size.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: IMG_M,
          alt: 'Placeholder mood for My Boyfriend Came Back from the War — replace with rights-cleared capture.',
          caption: 'Rhizome Anthology — replace with cleared still.',
          credit: 'Rhizome',
        },
        links: [
          {
            label: 'View work (Rhizome)',
            href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
          },
        ],
      },
      {
        title: 'Almost There',
        artist: 'Rafaël Rozendaal',
        year: '2015',
        description:
          'Whitney-commissioned browser work where interaction and public site context are the composition—a model for polish, restraint, and publishable presence.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: IMG_A,
          alt: 'Placeholder mood for Almost There — replace with Whitney documentation capture.',
          caption: 'Whitney / artport — replace with cleared still.',
          credit: 'Whitney Museum of American Art',
        },
        links: [{ label: 'Whitney exhibition page', href: 'https://whitney.org/exhibitions/rafael-rozendaal' }],
      },
    ],
    artists: [
      {
        name: 'Olia Lialina',
        description:
          'Canonical hypertext and browser-native narrative—useful when your final piece is structurally spare but conceptually dense.',
        website: 'https://art.teleportacia.org/',
        tags: ['browser-native', 'hypertext', 'canonical reference'],
      },
      {
        name: 'Rafaël Rozendaal',
        description:
          'Single-purpose sites and interaction as pictorial encounter—useful when your final work is the live URL itself.',
        website: 'https://newrafael.com/',
        tags: ['site as artwork', 'publishing', 'browser composition'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description:
          'Reference for what a complete browser-native artwork can look like in historical context.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'Whitney artport',
        description:
          'Commissioned internet art and public-facing browser works—useful when thinking about institutional framing.',
        website: 'https://whitney.org/artport',
      },
    ],
    curatorLenses: [
      {
        name: 'Course synthesis lens',
        description:
          'The final project should connect at least one formal strategy (e.g. link logic, interaction, remix) and one conceptual concern (e.g. identity, systems, liveness) from earlier chapters.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'Publishing and framing lens',
        description:
          'Title, URL, and short statement should help a viewer understand how the work relates to browser-based art—not only what software you used.',
        quote:
          'Treat documentation and statement as part of the artwork’s public skin, not an afterthought.',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Reflect on where your project sits in the history of internet art.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Connect browser-native practice to wider digital art discourse.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Use when the piece is small, single-page, and still in rapid iteration.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub Pages',
        category: 'structured',
        description: 'Use when the work is ready to live at a public URL from a repository.',
        website: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Structure files, refine copy, simplify code, and polish presentation.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'p5.js',
        category: 'advanced',
        description: 'Optional when the concept depends on generative or interaction-driven sketch logic.',
        website: 'https://p5js.org/',
      },
      {
        name: 'three.js',
        category: 'advanced',
        description: 'Optional when the concept needs a spatial scene, camera, or navigable world.',
        website: 'https://threejs.org/manual/',
      },
    ],
    glossaryTerms: [
      { slug: 'artifact', term: 'Artifact' },
      { slug: 'publishing', term: 'Publishing' },
      { slug: 'liveness', term: 'Liveness' },
      { slug: 'repository', term: 'Repository' },
      { slug: 'versioning', term: 'Versioning' },
    ],
    imageAssets: [
      {
        src: IMG_M,
        alt: 'Chapter media placeholder — hypertext / narrative mood.',
        caption: 'Replace with MBCBFTW documentation when cleared.',
      },
      {
        src: IMG_A,
        alt: 'Chapter media placeholder — interaction / commission mood.',
        caption: 'Replace with Almost There documentation when cleared.',
      },
      {
        src: IMG_GRID,
        alt: 'Chapter media placeholder — planning / deliverables mood.',
        caption: 'Optional moodboard for scope and submission planning.',
      },
    ],
    dossierLayout: 'phase',
    resources: [
      {
        type: 'work',
        title: 'My Boyfriend Came Back from the War',
        href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
        description: 'Compact browser-native structure as historically significant artwork.',
        publisher: 'Rhizome Net Art Anthology',
        year: '1996',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'Rafaël Rozendaal: Almost There',
        href: 'https://whitney.org/exhibitions/rafael-rozendaal',
        description: 'Browser-native composition, interaction, and public framing.',
        publisher: 'Whitney Museum of American Art',
        year: '2015',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'institution',
        title: 'Rhizome Net Art Anthology',
        href: 'https://anthology.rhizome.org/',
        description: 'Benchmark anthology for internet art on the open web.',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        href: 'https://whitney.org/artport',
        description: 'Online commissions and public-facing browser works.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'article',
        title: 'MDN — HTML reference',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference',
        description: 'Light refresher lookup while finishing markup—keeps the capstone from becoming a tutorial chapter.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — light refreshers',
      },
      {
        type: 'article',
        title: 'MDN — HTML: HyperText Markup Language',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description: 'Overview of HTML as structure when you need a quick orientation during polish.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — light refreshers',
      },
      {
        type: 'tool',
        title: 'GitHub Pages',
        href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
        description: 'Publish static sites from a GitHub repository.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'Globe',
      },
      {
        type: 'tool',
        title: 'Cursor quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted refinement for the final stretch.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'Final net artwork',
      description:
        'Ship one coherent browser-based artwork that synthesizes the course—with title, concept, pathway, and public or presentation-ready form.',
      easy: [
        'Complete a small single-page work with a title, concept, and short statement (2–3 sentences).',
      ],
      medium: [
        'Publish or package the work with a live URL or presentation-ready screenshots, plus a README or note on how to open it.',
      ],
      advanced: [
        'Use an advanced pathway (e.g. p5.js, three.js) only if it is essential to the idea—keep concept and framing coherent.',
      ],
      submission: [
        'Public URL or presentation-ready screenshots',
        'Repo link or project folder',
        'Title',
        '2–3 sentence statement',
        'One sentence naming the chapter(s) that most influenced the work',
      ],
    },
    reflection: [
      'What chapter influenced your final project most strongly?',
      'Did your final work feel coherent at the level of concept, form, and presentation?',
      'What became clearer once you had to frame the work publicly?',
      'What would you keep developing after the course ends?',
    ],
    previousChapterSlug: 'advanced-vibecoding-pathways',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-final-capstone',
      vibecoding: {
        buildMove:
          'Choose one clear concept, one pathway, and one finishable browser-based form for your final project.',
        promptMove:
          'Ask the model to help narrow scope, tighten file structure, and refine title and statement—never to invent the whole artwork for you.',
        codepenPath: [
          'Use CodePen for a small single-page concept study.',
          'Prototype visual and interaction logic before committing to a larger structure.',
          'Export or move to a repo only when pacing and concept feel coherent.',
        ],
        githubCursorPath: [
          'Use GitHub + Cursor when the project needs multiple files, assets, or deployment.',
          'Ask Cursor to simplify structure and polish copy for the README and statement.',
          'Aim for a live public URL when the work is conceptually and visually ready.',
        ],
        templateLabel: 'Starter links',
        templateLinks: starterLinks,
        output:
          'A final browser-based artwork with a title, concept, chosen pathway, and live or presentation-ready form.',
      },
      prompting: {
        goal: 'Finish a coherent final browser-based artwork.',
        weakPrompt: '“Help me make my final project.”',
        betterPrompt:
          '“Help me scope a small but coherent browser-based final artwork. I want one clear concept, one chosen pathway, a manageable file structure, and a short statement that explains the work. Help me refine—not overcomplicate.”',
        reviewChecklist: [
          'Is the project scope realistic?',
          'Does the chosen pathway fit the concept?',
          'Can I explain the work in 2–3 sentences?',
          'Is the piece live or presentation-ready?',
          'Do the title and framing strengthen the work?',
        ],
      },
      projectPlanCanvas: {
        title: 'Project plan canvas',
        description:
          'Answer these four prompts before you overbuild—use them in critique or with a peer to pressure-test scope.',
        sections: [
          { label: 'Concept', prompt: 'What is the core idea or question the work explores?' },
          {
            label: 'Pathway',
            prompt: 'What tool path fits best: HTML/CSS, p5.js, three.js, or another route you can sustain?',
          },
          {
            label: 'Reference',
            prompt: 'Which chapter, work, or artist most strongly informs this piece—and how does that show up in the build?',
          },
          { label: 'Output', prompt: 'Will the final work be live on the web, presentation-ready, or both—and by when?' },
        ],
      },
      submissionChecklist: {
        title: 'Submission checklist',
        description:
          'Run this list before you call the project done—each box is part of public readiness.',
        items: [
          'Artwork is finished or presentation-ready',
          'Title is clear',
          'Short statement is written (2–3 sentences)',
          'Chosen pathway is legible in the work',
          'Files or URL are organized and shareable',
          'At least one course connection is visible in statement or README',
        ],
      },
      critiqueRubricCards: {
        title: 'Critique rubric cards',
        description:
          'Use in self-critique or with a partner before submission—four lenses, quick answers.',
        cards: [
          {
            title: 'Concept',
            question: 'Is the idea clear and strong enough to guide every formal choice?',
          },
          {
            title: 'Form',
            question: 'Do browser structure, interaction, or medium choices support the concept—not decorate it?',
          },
          {
            title: 'Clarity',
            question: 'Can the work be understood without you standing beside the screen?',
          },
          {
            title: 'Public readiness',
            question: 'Is the piece framed well enough to share as art—title, URL or files, statement?',
          },
        ],
      },
    },
  }
}
