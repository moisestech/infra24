import type { Chapter } from '@/lib/course/types'

/** Disk prelude before pedagogical Chapter 0 — vocabulary, rhythm, and spine links. */
export function netArtPrimerAsChapter(): Chapter {
  return {
    number: 0,
    chapterSequenceLabel: 'Primer',
    slug: 'net-art-primer',
    title: 'Net art: primer & vocabulary',
    subtitle: 'Read once before tools and Chapter 1; skim vocabulary whenever a term feels fuzzy.',
    module: 'orientation',
    estimatedTime: '~25 min',
    difficulty: 'Beginner',
    thesis:
      'Net art treats the networked browser—links, loading, defaults, errors, and platforms—as part of the medium, not a neutral frame around “real” art elsewhere.',
    summary:
      'This workshop is practice-first: short loops, one visible deliverable per segment, and shared vocabulary so later chapters stay legible. Use external spines when you want context; use this page when you want rhythm.',
    sections: [
      {
        id: 'definition',
        label: 'Concept',
        title: 'What “net art” means here',
        body:
          'Net art (often used like internet art) is art that only fully makes sense because it is online—browser logic, hyperlinks, social circulation, and failure states can be expressive material. Museums and critics leaned on the term from the mid-to-late 1990s as work assumed a live, public web; exact first use is debated. For us, the shift matters more than the etymology.',
      },
      {
        id: 'vocabulary',
        label: 'Words',
        title: 'Key vocabulary we reuse on purpose',
        body:
          'Browser as medium — layout, timing, and UI are expressive. Vernacular web — early personal-web habits (GIFs, tiled backgrounds, “under construction”). Hypertext — the reader’s path is the story. Interface — where attention meets software. Glitch — visible breaks as language. Single-serving site — one tight idea, often one screen. Documentation — screenshots, clips, or notes so others (and future you) can read the work.',
      },
      {
        id: 'loops',
        label: 'Rhythm',
        title: 'How you will learn here',
        body:
          'Short loops: (1) Constrain — one screen, one interaction, or HTML-only. (2) Build — ugly-on-purpose first. (3) Document — one paragraph plus one image or clip of what changed. (4) Repeat — next chapter, next constraint. Use the reader before class to preview, during class as a checklist, after class to capture what you shipped.',
      },
      {
        id: 'assignments',
        label: 'Contract',
        title: 'The ~25-minute assignment pattern',
        body:
          'Most chapters assume ~25 minutes of focused making. Aim for one small artifact you can point to: a single file or page, a visible change you can describe in two sentences, and proof (screenshot, clip, or link). If you only have 10 minutes, shrink the prompt; if you have 45, add documentation—but keep one clear deliverable.',
      },
    ],
    anchorWorks: [
      {
        title: 'Art term — Net art',
        artist: 'Tate',
        description: 'Short institutional definition useful as a shared spine.',
        institution: 'Tate',
        links: [{ label: 'Tate glossary', href: 'https://www.tate.org.uk/art/art-terms/n/net-art' }],
      },
    ],
    artists: [
      {
        name: 'Olia Lialina',
        description: 'Vernacular web, browsers as cultural space; see Art Teleportacia.',
        website: 'http://art.teleportacia.org/',
      },
      {
        name: 'JODI',
        description: 'Anti-interfaces and deliberate friction in the browser.',
        website: 'https://en.wikipedia.org/wiki/Jodi_(artist_collective)',
      },
      {
        name: 'Rafaël Rozendaal',
        description: 'Single-serving sites and minimal interaction as composition.',
        website: 'https://www.newrafael.com/',
      },
      {
        name: 'Heath Bunting',
        description: 'Early net projects; networked systems as art.',
        website: 'https://en.wikipedia.org/wiki/Heath_Bunting',
      },
      {
        name: 'Shu Lea Cheang',
        description: 'Networked bodies, identity, and surveillance.',
        website: 'https://en.wikipedia.org/wiki/Shu_Lea_Cheang',
      },
      {
        name: 'Cory Arcangel',
        description: 'Appropriation and digital craft with a conceptual edge.',
        website: 'https://www.coryarcangel.com/',
      },
      {
        name: 'Petra Cortright',
        description: 'Platform aesthetics and self-image online.',
        website: 'https://en.wikipedia.org/wiki/Petra_Cortright',
      },
    ],
    institutions: [],
    curatorLenses: [],
    books: [],
    tools: [
      {
        name: 'Tate — Net art (art term)',
        category: 'quick-start',
        description: 'Institutional glossary entry—good shared language.',
        website: 'https://www.tate.org.uk/art/art-terms/n/net-art',
      },
      {
        name: 'Wikipedia — Internet art',
        category: 'quick-start',
        description: 'Broader survey and timeline (community-edited; orientation, not sole authority).',
        website: 'https://en.wikipedia.org/wiki/Internet_art',
      },
    ],
    glossaryTerms: [
      { slug: 'net-art', term: 'Net art' },
      { slug: 'browser-as-medium', term: 'Browser as medium' },
      { slug: 'hypertext', term: 'Hypertext' },
      { slug: 'glitch', term: 'Glitch' },
      { slug: 'documentation', term: 'Documentation' },
    ],
    imageAssets: [],
    artifact: {
      title: 'Orientation pass',
      description: 'Prove you opened the spine links and named one artist you want to follow.',
      easy: ['Read Tate net art term + one Wikipedia paragraph; write two sentences on what surprised you.'],
      medium: [
        'Above + open one artist site from the list; screenshot one screen and caption it in one sentence.',
      ],
      advanced: [
        'Above + propose one constraint you will use in Chapter 0 (tools) that matches your nervous system (browser-only vs files vs AI-assisted).',
      ],
      submission: ['Notes file or message to instructor: link + 3 bullets.'],
    },
    reflection: [
      'Which vocabulary word will you watch for in the next chapter?',
      'Which artist link felt most unfamiliar—and what would you need to understand them better?',
      'What is one constraint you are willing to try in your first 25-minute loop?',
    ],
    nextChapterSlug: 'getting-started-with-vibecoding',
  }
}
