import type { Chapter } from '@/lib/course/types'

const PLACEHOLDER_STILL =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop'

/** Chapter 3 — hypertext as narrative structure; Olia Lialina / MBFBFTW + Rhizome + Tate spines. */
export function hypertextAndNonlinearNarrativeAsChapter(): Chapter {
  return {
    number: 3,
    design: { moduleAccent: 'violet', lessonSkin: 'hypertext' },
    slug: 'hypertext-and-nonlinear-narrative',
    title: 'Hypertext and Nonlinear Narrative',
    subtitle:
      'Links, fragments, and browser structure as artistic tools for nonlinear storytelling.',
    module: 'browser-language',
    estimatedTime: '45–70 min',
    difficulty: 'Beginner',
    thesis:
      'The link is not just navigation. It is a narrative cut, a structural decision, and an emotional device.',
    makingPreview: [
      '2–3 linked HTML pages',
      'Sparse text fragments',
      'One emotional shift',
      'One meaningful hyperlink',
    ],
    primaryAnchorCallout:
      'This work is foundational because the browser frame itself becomes part of the storytelling.',
    summary:
      'This chapter teaches that links create meaning, fragments can hold emotion, page divisions can feel cinematic, browser structure can become narrative form, and a small multi-page artwork can already be net art. Rhizome’s Net Art Anthology presents *My Boyfriend Came Back from the War* as a foundational 1996 work built with frames, text, and images; Michael Connor’s Rhizome essay gives a clear interpretive lens; Tate’s internet-art framing supports browser-native work made for and through the internet—not only uploaded to it.',
    sections: [
      {
        id: 'why-hypertext',
        label: 'Concept',
        title: 'Why hypertext matters',
        body:
          'Hypertext changes the shape of narrative by making movement part of meaning. A link can interrupt, delay, reveal, split, or redirect a viewer’s experience.',
        icon: 'lucide:Link2',
      },
      {
        id: 'link-as-cut',
        label: 'Concept',
        title: 'The link as a cut',
        body:
          'A hyperlink can behave like a cinematic cut, a jump in thought, a fork in a path, or an emotional pivot. Clicking is not only movement—it is structure.',
        icon: 'lucide:MousePointerClick',
      },
      {
        id: 'fragmentation',
        label: 'Concept',
        title: 'Fragmentation creates feeling',
        body:
          'Small pieces of text, sparse images, and divided frames can generate ambiguity, tension, intimacy, and silence. Fragmentation is not a lack of information—it is a formal strategy.',
        icon: 'lucide:LayoutGrid',
      },
      {
        id: 'pages-as-scenes',
        label: 'Concept',
        title: 'Pages as scenes',
        body:
          'In hypertext-based net art, each page or frame can feel like a room, a shot, a memory fragment, or a threshold rather than a complete explanation.',
        icon: 'lucide:Film',
      },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18d5?w=1800&q=80&auto=format&fit=crop',
      alt: 'Muted abstract grid suggesting links and windows — chapter banner placeholder.',
      caption: 'Swap for a Rhizome anthology capture, frame still, or your own slide export.',
    },
    anchorWorks: [
      {
        title: 'My Boyfriend Came Back from the War',
        artist: 'Olia Lialina',
        year: '1996',
        description:
          'Rhizome’s Net Art Anthology presents this work as foundational: clicking splits the frame into smaller frames, producing nonlinear narrative through browser structure. Pair the live anthology page with Michael Connor’s essay for interpretive language.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: PLACEHOLDER_STILL,
          alt: 'Placeholder still for My Boyfriend Came Back from the War — replace with anthology or documentation capture.',
          caption: 'Placeholder — replace with rights-cleared frame still.',
        },
        links: [
          {
            label: 'Anthology (work page)',
            href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
          },
          {
            label: 'Rhizome editorial (essay)',
            href: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/',
          },
          {
            label: 'ArtBase record',
            href: 'https://artbase.rhizome.org/wiki/Item%3AQ3933',
          },
        ],
      },
      {
        title: 'Remake / remix lineage',
        artist: 'Multiple artists / platforms',
        year: '1996–present',
        description:
          'The work’s many remakes show that hypertext is a transferable structure—frame logic and emotional fragmentation reinterpreted across later web platforms.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop',
          alt: 'Placeholder suggesting circulation and reinterpretation — replace with remake documentation.',
        },
        links: [
          {
            label: 'Anthology page (context)',
            href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
          },
        ],
      },
    ],
    artists: [
      {
        name: 'Olia Lialina',
        description:
          'Foundational net artist: browser-native narrative, hypertext structure, and early web aesthetics. Keep *My Boyfriend Came Back from the War* open in one tab while you read.',
        website: 'https://art.teleportacia.org/',
        image: {
          src: PLACEHOLDER_STILL,
          alt: 'Portrait or representative image placeholder for Olia Lialina.',
        },
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description:
          'Curated online presentations of historically significant born-digital art—primary spine for this chapter.',
        website: 'https://anthology.rhizome.org/',
        image: {
          src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop',
          alt: 'Placeholder suggesting networked archives — replace with anthology UI capture.',
        },
      },
    ],
    curatorLenses: [
      {
        name: 'Michael Connor',
        description:
          'Rhizome’s interpretive essay on *My Boyfriend Came Back from the War* is a clear reading of how browser frames, fragmentation, and clicking become emotional narrative form.',
        website: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Foundational survey of early networked and browser-native practice.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
    ],
    tools: [
      {
        name: 'CodePen — About',
        category: 'quick-start',
        description: 'Prototype scene tone, typography, and sparse text before you split into multiple files.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub — About repositories',
        category: 'structured',
        description: 'Organize multiple HTML pages and prepare for publishing from official docs.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor — Quickstart',
        category: 'ai-assisted',
        description: 'Use Cursor to explain multi-page linking, scaffold files, and refine emotional contrast between scenes.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'Net Art Anthology — MBFBFTW',
        category: 'quick-start',
        description: 'Primary encounter with the work in the anthology.',
        website: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
      },
      {
        name: 'Tate — Internet art (art term)',
        category: 'quick-start',
        description: 'Institutional glossary spine for browser-native and networked practice.',
        website: 'https://www.tate.org.uk/art/art-terms/i/internet-art',
      },
    ],
    glossaryTerms: [
      { slug: 'hypertext', term: 'Hypertext' },
      { slug: 'fragment', term: 'Fragment' },
      { slug: 'viewport', term: 'Viewport' },
      { slug: 'link-as-structure', term: 'Link as structure' },
      { slug: 'nonlinear-narrative', term: 'Nonlinear narrative' },
    ],
    imageAssets: [
      {
        src: PLACEHOLDER_STILL,
        alt: 'Chapter still placeholder — hypertext / frames mood.',
        caption: 'Hero still — replace with anthology or documentation capture.',
      },
      {
        src: 'https://images.unsplash.com/photo-1517694712202-3dd5178143fa?w=1200&q=80&auto=format&fit=crop',
        alt: 'Second placeholder for remakes / circulation.',
        caption: 'Secondary still for remake lineage section.',
      },
    ],
    artifact: {
      title: 'Hypertext fragment',
      description:
        'Make a short nonlinear browser piece with at least two linked pages. Your goal is to make the link matter—not to build a large site.',
      easy: ['Two linked pages with a simple mood shift.'],
      medium: ['Three pages with intentional pacing, visual differences, and one meaningful branch.'],
      advanced: [
        'Multiple pages with image/text contrast and structural choices that shape emotional rhythm; document one path a viewer might miss.',
      ],
      submission: [
        'CodePen prototype URL or screenshot',
        'GitHub repo link or project folder',
        'Short note explaining what the link does emotionally',
      ],
    },
    reflection: [
      'What did the link do in your piece besides move the viewer?',
      'Did your work feel more like a story, a poem, or a sequence of scenes?',
      'What part of nonlinear structure felt most interesting?',
      'How does hypertext change what it means to read an artwork?',
    ],
    resources: [
      {
        type: 'artist',
        title: 'Olia Lialina official website',
        href: 'https://art.teleportacia.org/',
        description: 'Artist website and broader context for her practice.',
        publisher: 'Artist website',
        region: 'online',
        icon: 'Palette',
      },
      {
        type: 'work',
        title: 'My Boyfriend Came Back from the War',
        href: 'https://anthology.rhizome.org/my-boyfriend-came-back-from-the-war',
        description: 'Primary anchor work for this chapter.',
        publisher: 'Rhizome Net Art Anthology',
        year: '1996 / anthology presentation',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'article',
        title: 'Michael Connor essay on the work',
        href: 'https://rhizome.org/editorial/2016/nov/10/my-boyfriend-came-back-from-the-war/',
        description: 'Main interpretive essay for the chapter.',
        publisher: 'Rhizome',
        year: '2016',
        region: 'online',
        icon: 'BookOpenText',
      },
      {
        type: 'publication',
        title: 'Tech Art: Her Boyfriend Came Back from the War 20 Years Ago',
        href: 'https://www.wired.com/beyond-the-beyond/2016/01/tech-art-her-boyfriend-came-back-from-the-war-20-years-ago/',
        description:
          'Broader publication context on the historical importance of the work around its twentieth anniversary.',
        publisher: 'Wired',
        year: '2016',
        region: 'international',
        icon: 'Newspaper',
      },
      {
        type: 'organization',
        title: 'Rhizome',
        href: 'https://rhizome.org/',
        description: 'Central organization for born-digital art, preservation, and criticism.',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Fast path for prototyping the first hypertext scene.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'Cursor Quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted path for multi-page structure and revision.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    previousChapterSlug: 'the-browser-is-a-medium',
    /** Benchmark preview handoff: Chapter 3 → 6 (full sequence still available from handbook / reader). */
    nextChapterSlug: 'remix-appropriation-and-internet-vernacular',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-hypertext-bw',
      frameSplitSteps: [
        {
          label: 'One viewport',
          fragments: ['A single surface — the whole browser reads as one room.'],
        },
        {
          label: 'Two panels',
          fragments: ['A vertical split turns the window into a dialogue.', 'Click continues the cut.'],
        },
        {
          label: 'Four panels',
          fragments: ['Subdivision increases pressure.', 'Reading becomes scanning, comparing, waiting.'],
        },
        {
          label: 'Nested fracture',
          fragments: [
            'Nested frames echo *My Boyfriend Came Back from the War*.',
            'Structure is the feeling — the viewport is the narrative.',
          ],
        },
      ],
      vibecoding: {
        buildMove:
          'Create a multi-page HTML structure where links change mood or meaning — not only destination.',
        promptMove:
          'Ask your agent for 2–3 linked pages with different emotional tone, fragmentary text, sparse black-and-white styling, one meaningful link per page, and a short explanation of the file structure.',
        codepenPath: [
          'CodePen is single-page by nature: prototype the narrative language and visual tone of page 1 first.',
          'Draft typography, spacing, and the phrase that will become your real link to page 2.',
          'Treat the pen as a moodboard for index.html before you split into multiple files.',
        ],
        githubCursorPath: [
          'Create index.html, page-2.html, optional page-3.html, and shared style.css in a small folder or repo.',
          'Ask Cursor how multi-page linking works, then ask for a branching path or emotional shift between scenes.',
          'Refactor repeated styles into style.css once the scenes feel distinct.',
        ],
        templateLabel: 'Hypertext starter pack (folder: chapter-3-hypertext/)',
        output: 'A short nonlinear narrative with at least two linked pages.',
      },
      prompting: {
        goal: 'a beginner-friendly hypertext artwork',
        weakPrompt: '“Make a net art page.”',
        betterPrompt:
          '“Create a beginner-friendly multi-page browser artwork inspired by early net art. Use black-and-white styling, sparse text, and at least two linked pages. Each page should feel like a fragmented emotional scene. Keep the code simple and explain the file structure.”',
        reviewChecklist: [
          'Do the linked pages feel emotionally distinct?',
          'Does the click change meaning — not only location?',
          'Is the file structure understandable to a peer?',
          'Is the text too explanatory?',
          'Does the browser form (frames, spacing, silence) matter to the piece?',
        ],
      },
      branchPath: {
        root: { id: 'p1', label: 'Page 1', mood: 'threshold' },
        branches: [
          { edgeLabel: 'Link A', target: { id: 'p2', label: 'Page 2', mood: 'memory' } },
          { edgeLabel: 'Link B', target: { id: 'p3', label: 'Page 3', mood: 'silence' } },
        ],
      },
    },
  }
}
