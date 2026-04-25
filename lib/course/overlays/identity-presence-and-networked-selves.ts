import type { Chapter, TemplateLink } from '@/lib/course/types'

const P_V =
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&auto=format&fit=crop'
const P_R =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80&auto=format&fit=crop'
const P_A =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80&auto=format&fit=crop'
const BANNER =
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1800&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 7 — identity, presence, traces, avatars; Rhizome VVEBCAM, Whitney Riccardo Uncut, LaTurbo Avedon. */
export function identityPresenceAndNetworkedSelvesAsChapter(): Chapter {
  return {
    number: 7,
    design: { moduleAccent: 'rose', lessonSkin: 'identity-networked' },
    slug: 'identity-presence-and-networked-selves',
    title: 'Identity, Presence, and Networked Selves',
    subtitle:
      'Webcam selfhood, digital traces, avatars, surveillance, and online portraiture',
    module: 'cultural-social-web',
    estimatedTime: '45–80 min',
    difficulty: 'Beginner',
    thesis:
      'Online identity is not only represented through images and profiles. It is produced through platforms, traces, archives, avatars, and repeated acts of self-presentation.',
    makingPreview: [
      'One-page browser portrait',
      'Digital traces or fragments',
      'Captions, screenshots, or avatar cues',
      'A layered sense of presence',
    ],
    primaryAnchorCallout:
      'Rhizome’s anthology framing of *VVEBCAM* treats Petra Cortright’s webcam video as a portrait of the artist as a user inside YouTube’s early social dynamics—platform defaults and comment culture are part of the work.',
    summary:
      'This chapter connects net art history to contemporary selfhood: identity online is fragmented, staged, stored, and circulated. We look at webcam portraiture, phone-archive slideshows, private/public blur, and avatar-native practice as equally serious artistic subjects.',
    sections: [
      {
        id: 'self-is-performed',
        label: 'Concept',
        title: 'The self online is performed',
        body:
          'Online identity is often produced through repeated acts of staging, posting, framing, tagging, and platform participation. The self is not simply shown; it is enacted.',
        icon: 'lucide:Fingerprint',
      },
      {
        id: 'trace-and-archive',
        label: 'Concept',
        title: 'Traces and archives become portraits',
        body:
          'A digital life can be rendered through screenshots, comments, metadata, camera rolls, captions, and other residues. These traces can function like contemporary portraiture.',
        icon: 'lucide:Image',
      },
      {
        id: 'private-public-blur',
        label: 'Concept',
        title: 'Private and public constantly blur',
        body:
          'Phone archives, webcam videos, and social platforms complicate where intimacy ends and performance begins. Browser-based art can use that blur as both form and subject.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'avatar-selfhood',
        label: 'Concept',
        title: 'The avatar is not less real',
        body:
          'An avatar can be a stable artistic identity, a social body, or a conceptual self. Virtual presence can be as authored and as legible as physical portraiture.',
        icon: 'lucide:UserRound',
      },
    ],
    chapterBanner: {
      src: BANNER,
      alt: 'Soft abstract light suggesting a screen-facing portrait — chapter banner placeholder.',
      caption: 'Replace with rights-cleared stills from VVEBCAM or Riccardo Uncut documentation when available.',
    },
    anchorWorks: [
      {
        title: 'VVEBCAM',
        artist: 'Petra Cortright',
        year: '2007',
        description:
          'A YouTube webcam work in which clip-art graphics float around the artist’s face—platform-native self-imaging, default consumer graphics, and comment culture folded into the artwork’s social form.',
        institution: 'Rhizome — Net Art Anthology',
        image: {
          src: P_V,
          alt: 'Placeholder still for VVEBCAM — replace with Rhizome documentation capture.',
          caption: 'Placeholder — replace with rights-cleared capture.',
          credit: 'Rhizome',
        },
        links: [{ label: 'View work (Rhizome)', href: 'https://anthology.rhizome.org/vvebcam' }],
      },
      {
        title: 'Riccardo Uncut',
        artist: 'Eva and Franco Mattes',
        year: '2018',
        description:
          'A customized chronological slideshow built from a purchased phone archive of roughly three thousand personal images (2004–2017), asking how digital memory, self-representation, privacy, and authenticity are constructed through the camera roll.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: P_R,
          alt: 'Placeholder for Riccardo Uncut — replace with Whitney documentation capture.',
          caption: 'Placeholder — Whitney artport commission context.',
          credit: 'Whitney Museum of American Art',
        },
        links: [{ label: 'Whitney project page', href: 'https://whitney.org/exhibitions/riccardo-uncut' }],
      },
    ],
    artists: [
      {
        name: 'Petra Cortright',
        description:
          'Known for webcam aesthetics, online self-performance, and internet vernacular as artistic material.',
        website: 'https://www.petrapaulacortright.com/',
        instagram: 'https://www.instagram.com/petracortright/',
        tags: ['webcam aesthetics', 'platform-native selfhood', 'internet vernacular'],
      },
      {
        name: 'Eva and Franco Mattes',
        description:
          'Known for work on privacy, exhibitionism, digital memory, online traces, and the staging of selfhood through networked culture.',
        website: 'https://0100101110101101.org/',
        instagram: 'https://www.instagram.com/evafrancomattes/',
        tags: ['digital traces', 'privacy', 'networked identity'],
      },
      {
        name: 'LaTurbo Avedon',
        description:
          'An avatar-based artist whose practice treats virtual presence and online identity as a sustained artistic and social reality.',
        website: 'https://www.laturboavedon.com/',
        tags: ['avatar identity', 'virtual selfhood', 'metaverse art'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description:
          'A key institutional frame for historically significant, platform-native internet artworks such as VVEBCAM.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'Whitney artport',
        description:
          'The Whitney Museum’s portal to internet art and online projects, including Riccardo Uncut.',
        website: 'https://whitney.org/artport',
      },
    ],
    curatorLenses: [
      {
        name: 'Whitney — Riccardo Uncut',
        description:
          'Framing for how phone archives, “private” photos, and platform-era selfhood enter public exhibition as art.',
        website: 'https://whitney.org/exhibitions/riccardo-uncut',
        quote:
          'How do we construct our digital memory? Is there still such a thing as a private photo? — questions cited in Whitney’s presentation of the project.',
      },
      {
        name: 'Rhizome — VVEBCAM',
        description:
          'Anthology context for webcam selfhood, early YouTube social dynamics, and default graphics as compositional material.',
        website: 'https://anthology.rhizome.org/vvebcam',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Historical grounding for networked identity and self-presentation in internet art.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Broader museum and curatorial context for digital identity and online presence.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Build a one-page identity study from fragments, captions, screenshots, or layered text.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Use a repository when you need an assets folder for screenshots, fragments, or traces.',
        website:
          'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Structure fragment-based portrait pages, organize assets, and refine layout choices.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'networked-self', term: 'Networked self' },
      { slug: 'digital-trace', term: 'Digital trace' },
      { slug: 'avatar', term: 'Avatar' },
      { slug: 'presence', term: 'Presence' },
      { slug: 'platform-aesthetics', term: 'Platform aesthetics' },
    ],
    imageAssets: [
      {
        src: P_V,
        alt: 'Chapter still placeholder — webcam / portrait mood.',
        caption: 'Replace with VVEBCAM documentation when rights-cleared.',
      },
      {
        src: P_R,
        alt: 'Chapter still placeholder — archive / camera-roll mood.',
        caption: 'Replace with Riccardo Uncut documentation when rights-cleared.',
      },
      {
        src: P_A,
        alt: 'Chapter still placeholder — abstract avatar / presence mood.',
        caption: 'LaTurbo Avedon — replace with exhibition or site documentation when cleared.',
      },
    ],
    resources: [
      {
        type: 'work',
        title: 'VVEBCAM',
        href: 'https://anthology.rhizome.org/vvebcam',
        description: 'Primary anchor: webcam selfhood and platform-native identity performance.',
        publisher: 'Rhizome Net Art Anthology',
        year: '2007',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'Eva and Franco Mattes: Riccardo Uncut',
        href: 'https://whitney.org/exhibitions/riccardo-uncut',
        description: 'Phone archive as slideshow portrait—memory, privacy, authenticity.',
        publisher: 'Whitney Museum of American Art',
        year: '2018',
        region: 'international',
        icon: 'Image',
      },
      {
        type: 'artist',
        title: 'LaTurbo Avedon — official site',
        href: 'https://www.laturboavedon.com/',
        description: 'Contemporary reference for avatar-based artistic identity and exhibitions.',
        publisher: 'Artist website',
        region: 'online',
        icon: 'Palette',
      },
      {
        type: 'institution',
        title: 'Rhizome Net Art Anthology',
        href: 'https://anthology.rhizome.org/',
        description: 'Preservation and interpretation of significant internet artworks.',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        href: 'https://whitney.org/artport',
        description: 'Whitney’s portal to internet art and online commissions.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'publication',
        title: 'LaTurbo Avedon Is Way Ahead of the Metaverse',
        href: 'https://www.wired.com/story/laturbo-avedon-digital-art/',
        description: 'Profile of LaTurbo Avedon’s virtual-world practice and digital identity.',
        publisher: 'Wired',
        year: '2021',
        region: 'international',
        icon: 'Newspaper',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Fast path for one-page identity studies built from fragments and layout.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'Cursor quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted structuring for fragment-based portrait pages.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'Networked self study',
      description:
        'A one-page browser artwork that treats identity as fragmented, archived, staged, or avatar-based—not a full autobiography.',
      easy: [
        'One title, one short statement, and a few trace-like fragments or media placeholders that suggest a digital self.',
      ],
      medium: [
        'HTML + CSS: a browser portrait from captions, screenshot placeholders, layered text, or archive-like structure.',
      ],
      advanced: [
        'A richer study where the page behaves like an online self, avatar space, or digital memory archive.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link or project folder',
        'One sentence: what kind of self or presence the page stages',
      ],
    },
    reflection: [
      'Did your page feel more like a portrait, an archive, or a performance of self?',
      'What kinds of traces carried the most meaning?',
      'How did the page suggest presence without fully explaining identity?',
      'What did the browser allow you to do that a static image would not?',
    ],
    previousChapterSlug: 'remix-appropriation-and-internet-vernacular',
    nextChapterSlug: 'systems-circulation-and-infrastructure',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-identity-networked',
      traceVsPortraitDemo: {
        title: 'Trace vs portrait demo',
        description:
          'Compare raw digital residue with composed, portrait-like arrangement—useful when thinking about Riccardo Uncut’s archive or Cortright’s staged webcam surface.',
        left: {
          label: 'Trace',
          points: [
            'Raw screenshot or grab',
            'Caption fragment or chat residue',
            'Metadata or UI chrome',
            'Partial archive or folder logic',
          ],
        },
        right: {
          label: 'Portrait',
          points: [
            'Composed arrangement of those fragments',
            'Staged selfhood and pacing',
            'Networked memory as a felt sequence',
            'Presence built from what was saved, not only what was posed',
          ],
        },
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser portrait built from traces, fragments, captions, screenshots, or avatar logic.',
        promptMove:
          'Ask the model for a page that treats identity as layered, partial, and networked rather than fully explained. Name two “modes” the viewer can move between (e.g. public / withheld, online / recalled).',
        codepenPath: [
          'Start with one page and one identity premise.',
          'Use text fragments, captions, and placeholder media blocks.',
          'Keep the page emotionally readable and not overbuilt.',
        ],
        githubCursorPath: [
          'Create index.html, style.css, and an optional assets folder.',
          'Use screenshots, found fragments, or self-authored traces as material.',
          'Ask Cursor to structure the page like a portrait, archive, or self-fragment.',
        ],
        templateLabel: 'Starter links',
        templateLinks: starterLinks,
        output: 'A browser-based identity study that uses traces, fragments, or avatar logic as artistic form.',
      },
      prompting: {
        goal: 'Build a one-page browser portrait of a networked self.',
        weakPrompt: '“Make a website about online identity.”',
        betterPrompt:
          '“Create a beginner-friendly one-page browser artwork about networked identity. Use fragments—captions, screenshot placeholders, layered text, or avatar-like cues—rather than a full biography. Keep the structure simple and explain how the page functions like a portrait.”',
        reviewChecklist: [
          'Does the page feel like a portrait, archive, or self-fragment?',
          'Are the traces or fragments doing conceptual work?',
          'Is identity shown as layered rather than fully explained?',
          'Does the browser structure help express presence or selfhood?',
        ],
      },
      avatarPresenceCard: {
        title: 'Avatar presence card',
        description:
          'LaTurbo Avedon’s site models a mature avatar-native practice: virtual presence as authored public life, not a disposable skin.',
        points: [
          'An avatar can be a stable artistic identity over years of exhibitions and writing.',
          'Virtual presence can be socially and aesthetically legible without “proving” a physical body.',
          'Selfhood online can be authored through lore, staging, and community as much as through photographs.',
          'Avatar identity can be portraiture, performance, and networked presence at once.',
        ],
      },
    },
  }
}
