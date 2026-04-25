import type { Chapter } from '@/lib/course/types'

const P =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop'
const P3 =
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18d5?w=800&q=80&auto=format&fit=crop'
const P4 =
  'https://images.unsplash.com/photo-1517694712202-3dd5178143fa?w=800&q=80&auto=format&fit=crop'
const P5 =
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&auto=format&fit=crop'
const P6 =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop'
const CH6_BANNER =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777129378/dccmiami/workshops/vibe-coding-net-art/photoshop-gradient-demonstrations-cory-arcangel-whitney-museum_pgtvww.webp'
const NASTY_NETS_IMAGE =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777129454/dccmiami/workshops/vibe-coding-net-art/nasty-nets-rhizome-net-art-anthology_bkiowi.jpg'

/** Chapter 6 — remix / vernacular / platform aesthetics; Rhizome anthology + Whitney + collective feeds. */
export function remixAppropriationAsChapter(): Chapter {
  return {
    number: 6,
    design: { moduleAccent: 'rose', lessonSkin: 'remix-collage' },
    slug: 'remix-appropriation-and-internet-vernacular',
    title: 'Remix, Appropriation, and Internet Vernacular',
    subtitle: 'Screenshots, found media, software defaults, and platform aesthetics as artistic material',
    module: 'cultural-social-web',
    estimatedTime: '50–80 min',
    difficulty: 'Beginner',
    thesis:
      'Remix is not just reuse. It is a way of thinking through internet culture by rearranging its fragments.',
    makingPreview: [
      'One-page browser collage',
      'Screenshots or found fragments',
      'Default gradient or platform aesthetic',
      'Clear remix mood',
    ],
    summary:
      'This chapter teaches that screenshots, defaults, clip art, and feeds already carry cultural meaning; that internet vernacular is valid artistic material; that appropriation becomes interesting when context changes; that software defaults can be aesthetic and conceptual substance; and that a browser page can operate like a collage, archive, portrait, or critique.',
    sections: [
      {
        id: 'vernacular',
        label: 'Concept',
        title: 'Internet vernacular is not the opposite of art',
        body:
          'Amateur, awkward, template-based, low-resolution, or platform-native aesthetics can be artistically powerful precisely because they are recognizable and socially loaded.',
        icon: 'lucide:Sticker',
      },
      {
        id: 'found-media',
        label: 'Concept',
        title: 'Found media already carries meaning',
        body:
          'Screenshots, gradients, clip art, captions, and interface leftovers already come with emotional and cultural baggage. Remix works by shifting how that baggage is read.',
        icon: 'lucide:Image',
      },
      {
        id: 'appropriation',
        label: 'Concept',
        title: 'Appropriation changes context',
        body:
          'A reused fragment becomes artistically active when its setting, sequence, scale, or tone changes. The point is not only to copy but to reframe.',
        icon: 'lucide:Layers3',
      },
      {
        id: 'software-defaults',
        label: 'Concept',
        title: 'Software defaults are cultural materials',
        body:
          'Built-in gradients, stock effects, default transitions, and generic templates all carry the taste of software culture and can become the subject of the work.',
        icon: 'lucide:ScanSearch',
      },
    ],
    chapterBanner: {
      src: CH6_BANNER,
      alt: 'Photoshop Gradient Demonstrations reference image from Whitney context.',
      caption: 'Cory Arcangel gradient demonstrations reference.',
    },
    anchorWorks: [
      {
        title: 'VVEBCAM',
        artist: 'Petra Cortright',
        year: '2007',
        description:
          'Rhizome’s Net Art Anthology presents this work as a YouTube-era webcam piece: clip-art graphics float around the artist’s face, turning platform-native self-presentation into the artwork.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: P3,
          alt: 'Placeholder still suggesting webcam-era layered graphics — replace with anthology capture.',
          caption: 'Placeholder — replace with rights-cleared VVEBCAM documentation.',
          credit: 'Source page: Rhizome Net Art Anthology',
        },
        links: [{ label: 'View on Rhizome Anthology', href: 'https://anthology.rhizome.org/vvebcam' }],
      },
      {
        title: 'Photoshop Gradient Demonstrations',
        artist: 'Cory Arcangel',
        year: '2008–',
        description:
          'A series that names default Photoshop gradients as artworks—software demonstration culture and “professional” tool presets reframed as artistic substance. Pair with Whitney’s Arcangel exhibition framing.',
        institution: 'Whitney Museum of American Art',
        image: {
          src: P,
          alt: 'Placeholder suggesting software gradients — replace with Whitney or work documentation.',
          caption: 'Placeholder — replace with rights-cleared gradient / exhibition still.',
          credit: 'Source page: Whitney Museum',
        },
        links: [{ label: 'Whitney exhibition page', href: 'https://whitney.org/exhibitions/cory-arcangel' }],
      },
      {
        title: 'Nasty Nets',
        artist: 'Collaborative surf club',
        year: '2006–2012',
        description:
          'Rhizome describes this collaborative blog as a space for sharing found online artifacts alongside original collages—vernacular browsing turned into collective composition.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: NASTY_NETS_IMAGE,
          alt: 'Nasty Nets reference image from Rhizome Net Art Anthology context.',
          caption: 'Collaborative artifact-sharing as artistic method.',
          credit: 'Source page: Rhizome Net Art Anthology',
        },
        links: [{ label: 'Anthology entry', href: 'https://anthology.rhizome.org/nasty-nets' }],
      },
    ],
    artists: [
      {
        name: 'Petra Cortright',
        description:
          'Known for webcam aesthetics, platform-native self-performance, and internet vernaculars that keep the language of online video and self-imaging intact.',
        website: 'https://www.petrapaulacortright.com/',
        instagram: 'https://www.instagram.com/petracortright/',
        image: {
          src: P3,
          alt: 'Petra Cortright avatar using VVEBCAM reference still.',
        },
        tags: ['webcam aesthetics', 'YouTube vernacular', 'internet selfhood'],
      },
      {
        name: 'Cory Arcangel',
        description:
          'Known for internet interventions, software culture, modified systems, and treating default tools and amateur/professional technologies as artistic material.',
        website: 'https://coryarcangel.com/',
        instagram: 'https://www.instagram.com/coryarcangel/',
        image: {
          src: P5,
          alt: 'Placeholder portrait tile for Cory Arcangel.',
        },
        tags: ['software culture', 'defaults', 'internet interventions'],
      },
      {
        name: 'Eva and Franco Mattes',
        description:
          'Artists working with online traces, internet residue, appropriation, and the reframing of digital life as public artwork.',
        website: 'https://0100101110101101.org/',
        instagram: 'https://www.instagram.com/evafrancomattes/',
        image: {
          src: P6,
          alt: 'Placeholder portrait tile for Eva and Franco Mattes.',
        },
        tags: ['internet traces', 'appropriation', 'digital residue'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description:
          'A key institutional frame for historicizing browser-native and platform-native internet artworks such as VVEBCAM and Nasty Nets.',
        website: 'https://anthology.rhizome.org/',
        image: {
          src: P2,
          alt: 'Placeholder suggesting networked archives — replace with anthology UI capture.',
        },
      },
      {
        name: 'Whitney Museum of American Art',
        description:
          'A major anchor for internet and software-based practices—including Arcangel exhibitions and Artport commissions that mix professional and amateur technological vernaculars.',
        website: 'https://whitney.org/',
        image: {
          src: P,
          alt: 'Placeholder suggesting museum digital context — replace with Whitney capture.',
        },
      },
    ],
    curatorLenses: [
      {
        name: 'Whitney exhibition framing (Cory Arcangel)',
        description:
          'Useful for understanding how software defaults, internet interventions, and mixed technological vernaculars can be framed institutionally as art.',
        website: 'https://whitney.org/exhibitions/cory-arcangel',
      },
      {
        name: 'Rhizome’s VVEBCAM presentation',
        description:
          'Useful for reading webcam aesthetics and platform-native self-presentation as historical net art material rather than disposable online ephemera.',
        website: 'https://anthology.rhizome.org/vvebcam',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Foundational overview of internet art and its conceptual and historical development.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: "The Art Happens Here: Net Art's Archival Poetics",
        author: 'New Museum',
        description:
          'Exhibition and publication context for thinking about internet art through archives, institutions, and changing platform contexts.',
        link: 'https://www.newmuseum.org/exhibitions/view/the-art-happens-here-net-art-anthology',
      },
    ],
    tools: [
      {
        name: 'CodePen — About',
        category: 'quick-start',
        description:
          'Prototype a single-page remix collage: layered blocks, placeholder screenshots, gradients, and caption strips before you move assets into a repo.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub — About repositories',
        category: 'structured',
        description:
          'Use a repository when the project needs an assets folder for screenshots, found images, and multiple references.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor — Quickstart',
        category: 'ai-assisted',
        description:
          'Use Cursor to structure layered collage layouts, refactor repeated CSS, and explain how found assets are organized in the project.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'remix', term: 'Remix' },
      { slug: 'appropriation', term: 'Appropriation' },
      { slug: 'internet-vernacular', term: 'Internet vernacular' },
      { slug: 'platform-aesthetics', term: 'Platform aesthetics' },
      { slug: 'software-default', term: 'Software default' },
    ],
    imageAssets: [
      {
        src: P3,
        alt: 'Chapter still placeholder — webcam / layered UI mood.',
        caption: 'Hero still — replace with anthology or documentation capture.',
        credit: 'Source page: Rhizome Net Art Anthology',
      },
      {
        src: P,
        alt: 'Second placeholder — gradients / software defaults mood.',
        caption: 'Secondary still for software-default aesthetics.',
        credit: 'Whitney Museum / work documentation (replace)',
      },
      {
        src: P2,
        alt: 'Placeholder suggesting collaborative feeds and found artifacts.',
        caption: 'Tertiary still — Nasty Nets / surf-club collage culture (replace).',
        credit: 'Source page: Rhizome Net Art Anthology',
      },
    ],
    artifact: {
      title: 'Vernacular remix study',
      description:
        'Make a one-page browser experiment using found or platform-native material. Your goal is to make reuse culturally legible—not to polish the internet away.',
      easy: ['Create a simple collage page using found text, one image, and one strong style choice.'],
      medium: [
        'Use HTML + CSS to build a remix page with at least three found elements and a clear mood or conceptual frame.',
      ],
      advanced: [
        'Create a browser-based vernacular composition where screenshots, platform aesthetics, or reused media are structured intentionally to produce critique, portraiture, or atmosphere.',
      ],
      submission: [
        'CodePen remix prototype URL or screenshot',
        'GitHub repo link or project folder',
        'Short note explaining what the reused material meant culturally',
      ],
    },
    reflection: [
      'What kind of material did you reuse: screenshot, text fragment, stock effect, meme logic, or platform aesthetic?',
      'Did your piece feel more like collage, critique, portrait, or archive?',
      'What cultural baggage came with the material you used?',
      'How did remix change the meaning of the original material?',
    ],
    /** Benchmark preview: Chapter 3 → 6 */
    previousChapterSlug: 'hypertext-and-nonlinear-narrative',
    /** Benchmark preview handoff: Chapter 6 → 9 */
    nextChapterSlug: 'publishing-liveness-and-the-artwork-as-website',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-remix-collage',
      vernacularMoodBoard: {
        tiles: [
          { title: 'Webcam / face box', src: P4, caption: 'Framing and lighting idioms from desktop video culture.' },
          { title: 'Clip-art overlay', src: P6, caption: 'Decorative kitsch that reads instantly as “internet.”' },
          {
            title: 'Stock gradient',
            src: P,
            caption: 'Default-looking color ramps as shared taste—not neutral design.',
          },
          { title: 'Compressed image', src: P3, caption: 'Artifacts of compression as social signifiers.' },
          { title: 'Repost / screenshot', src: P2, caption: 'Circulation aesthetics: borders, crops, UI chrome.' },
          { title: 'Caption block', src: P5, caption: 'Feed language, punchlines, and comment residue.' },
        ],
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser collage using found digital fragments and platform-native materials (screenshots, gradients, captions, UI scraps).',
        promptMove:
          'Ask the model to generate a layout using screenshots, captions, gradients, and layered composition while keeping the structure readable.',
        codepenPath: [
          'Prototype a single-page remix in HTML/CSS: placeholder image boxes, caption strips, stacked blocks.',
          'Use a bold default-style gradient as a live background to foreground “software taste.”',
          'Stage “internet residue” quickly—treat CodePen as a collage lab, not the final archive.',
        ],
        githubCursorPath: [
          'Create chapter-6-remix/ with index.html, style.css, assets/ for screenshots and found images.',
          'Ask Cursor to explain how grid or absolute positioning organizes layers, then refactor repeated CSS.',
          'Ask for caption rhythm and headline scale without “cleaning away” vernacular awkwardness.',
        ],
        templateLabel: 'Vernacular remix starter pack',
        output: 'A browser-based remix or collage page where reused material matters.',
      },
      prompting: {
        goal: 'a remix-based browser artwork',
        weakPrompt: '“Make a cool collage website.”',
        betterPrompt:
          '“Create a beginner-friendly browser-based remix page using screenshots, a default gradient, short caption fragments, and one bold headline. The page should feel like internet residue turned into art. Keep the structure simple and explain how the layers work.”',
        reviewChecklist: [
          'What was found versus made from scratch?',
          'Does the reused material still feel generic, or has it been reframed?',
          'Is the page too random, or does it have a clear mood?',
          'Does the composition say something about internet culture?',
          'Are the layers visually intentional?',
        ],
      },
      remixStack: {
        layers: [
          { kind: 'gradient', label: 'Default-feel gradient field' },
          { kind: 'image', label: 'Screenshot layer', src: P2 },
          { kind: 'caption', label: '“everyone is acting normal today”' },
          { kind: 'ui', label: 'Subscribe · Like · Share' },
          { kind: 'text', label: 'REMIX' },
        ],
      },
    },
  }
}
