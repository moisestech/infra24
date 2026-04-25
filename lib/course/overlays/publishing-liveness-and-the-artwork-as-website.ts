import type { Chapter } from '@/lib/course/types'

const P =
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop'
const P3 =
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80&auto=format&fit=crop'

/** Chapter 9 — publishing, liveness, URLs; Whitney / Rozendaal / artport + GitHub Pages spine. */
export function publishingLivenessAndTheArtworkAsWebsiteAsChapter(): Chapter {
  return {
    number: 9,
    design: { moduleAccent: 'emerald', lessonSkin: 'publishing' },
    slug: 'publishing-liveness-and-the-artwork-as-website',
    title: 'Publishing, Liveness, and the Artwork as Website',
    subtitle: 'URLs, hosting, timing, live states, and version history as artistic material',
    module: 'public-work-advanced',
    estimatedTime: '45–80 min',
    difficulty: 'Beginner',
    thesis:
      'A net artwork is not only something you make. It is also something you publish, host, name, visit, maintain, and experience live.',
    makingPreview: [
      'One live browser page',
      'Meaningful title and URL logic',
      'Repo-to-site publishing flow',
      'A public-facing artwork state',
    ],
    summary:
      'This chapter teaches that a live site is different from a screenshot; that a URL can be part of the artwork; that hosting and versioning matter conceptually; that GitHub Pages is a strong beginner publishing path; and that a browser work changes once it becomes public and live.',
    sections: [
      {
        id: 'website-not-file',
        label: 'Concept',
        title: 'A website is not just a file',
        body:
          'A local HTML file and a live website are related, but they are not the same artistic condition. Once a work is online, it has a URL, a host, a public state, and a place inside the web.',
        icon: 'lucide:Globe',
      },
      {
        id: 'live-vs-documented',
        label: 'Concept',
        title: 'Live behavior is different from documentation',
        body:
          'A screenshot or video can show evidence of a work, but it does not fully replace a live browser encounter with timing, loading, interaction, and public accessibility.',
        icon: 'lucide:Monitor',
      },
      {
        id: 'url-matters',
        label: 'Concept',
        title: 'The URL can be part of the artwork',
        body:
          'A title matters. A domain matters. A path matters. In many web-native artworks, the site itself is the work, and the address helps frame how it is remembered and circulated.',
        icon: 'lucide:Link2',
      },
      {
        id: 'versioning',
        label: 'Concept',
        title: 'Versioning is part of digital form',
        body:
          'A net artwork can have drafts, revisions, commits, branches, and restagings. Digital works often exist across visible states rather than one fixed final object.',
        icon: 'lucide:GitBranch',
      },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&q=80&auto=format&fit=crop',
      alt: 'Calm abstract green gradient suggesting a live public interface — chapter banner placeholder.',
      caption: 'Replace with Almost There / artport captures or your own documentation stills.',
    },
    anchorWorks: [
      {
        title: 'Almost There',
        artist: 'Rafaël Rozendaal',
        year: '2015',
        description:
          'A Whitney-commissioned internet artwork in which black-and-white circular forms eclipse the museum website and respond to cursor movement—browser context and timed change as part of the piece.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: P3,
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
        title: 'Sunrise/Sunset',
        artist: 'Whitney artport commissions',
        year: '2009–2024',
        description:
          'A long-running series of internet artworks commissioned for whitney.org—each unfolding over a short timed window, tying browser experience to time of day and institutional framing.',
        institution: 'Whitney Museum of American Art / artport',
        image: {
          src: P,
          alt: 'Placeholder suggesting timed web commission — replace with Sunrise/Sunset reference.',
          caption: 'Whitney artport Sunrise/Sunset series (placeholder).',
          credit: 'Whitney Museum of American Art',
        },
        links: [
          { label: 'Whitney artport', href: 'https://whitney.org/artport' },
          { label: 'Whitney media (context)', href: 'https://whitney.org/media/1647' },
          { label: 'Whitney related media', href: 'https://whitney.org/media/1648' },
        ],
      },
    ],
    artists: [
      {
        name: 'Rafaël Rozendaal',
        description:
          'Dutch-Brazilian artist whose browser-based works and commissions treat the site itself as artwork; Whitney materials describe him as an artist who “uses the Internet as his canvas.”',
        website: 'https://newrafael.com/',
        image: {
          src: P2,
          alt: 'Placeholder portrait tile for Rafaël Rozendaal.',
        },
        tags: ['site as artwork', 'browser composition', 'internet as canvas'],
      },
    ],
    institutions: [
      {
        name: 'Whitney Museum of American Art / artport',
        description:
          'The Whitney’s portal to internet art—an online gallery for net art and new media commissions (artport launched in 2001), including timed browser works on whitney.org.',
        website: 'https://whitney.org/artport',
        image: {
          src: P,
          alt: 'Placeholder suggesting institutional web context — replace with artport capture.',
        },
      },
      {
        name: 'GitHub Pages',
        description:
          'Official static hosting from a repository—ideal for teaching how HTML, CSS, and JavaScript become a public site.',
        website: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
        image: {
          src: P2,
          alt: 'Placeholder suggesting docs / deployment — replace with GitHub Pages screenshot.',
        },
      },
    ],
    curatorLenses: [
      {
        name: 'Christiane Paul',
        description:
          'Curator of Digital Art at the Whitney; Sunrise/Sunset and related commissions frame browser-native, timed internet art inside the museum’s live site.',
        website: 'https://whitney.org/exhibitions/rafael-rozendaal',
      },
      {
        name: 'Tate — keeping web-based art online',
        description:
          'Research framing on why keeping a work online and functional is part of meaning and preservation for web-based art.',
        website:
          'https://www.tate.org.uk/research/reshaping-the-collectible/net-art-uncomfortable-proximity-keeping-web-based-art-online',
      },
    ],
    books: [
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Curatorial and historical context for digital and internet-based art in institutions.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Survey grounding for internet art before publishing and liveness questions.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
    ],
    resources: [
      {
        type: 'institution',
        title: 'Whitney artport',
        description:
          'The Whitney’s portal to internet art—an online gallery space for net art and new media commissions, including Sunrise/Sunset (2009–2024) organized by Christiane Paul.',
        href: 'https://whitney.org/artport',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'article',
        title: 'Sunrise/Sunset — internet art on whitney.org',
        description:
          'Commissioned browser works unfolding over short timed windows on the museum’s live site—public URL and institutional frame as part of the work.',
        href: 'https://whitney.org/artport',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Newspaper',
      },
      {
        type: 'tool',
        title: 'GitHub Pages — documentation hub',
        description: 'Static site hosting: publish HTML, CSS, and JavaScript from a repository.',
        href: 'https://docs.github.com/en/pages',
        publisher: 'GitHub',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'What is GitHub Pages?',
        description: 'Overview of how Pages turns a repository into a live website.',
        href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'BookOpenText',
      },
      {
        type: 'tool',
        title: 'Configuring a publishing source for GitHub Pages',
        description: 'Choose the branch, folder, or Actions workflow that feeds your live site.',
        href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'Code2',
      },
    ],
    tools: [
      {
        name: 'GitHub Pages — About',
        category: 'structured',
        description:
          'Publish HTML, CSS, and JavaScript from a repository to a live site; pair with publishing source docs when teaching deployment.',
        website: 'https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages',
      },
      {
        name: 'GitHub — About repositories',
        category: 'structured',
        description: 'Version history, branches, and the folder that becomes your Pages site.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'GitHub Pages — Publishing source',
        category: 'structured',
        description: 'Configure which branch or folder feeds the live Pages build.',
        website:
          'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site',
      },
      {
        name: 'Cursor — Quickstart',
        category: 'ai-assisted',
        description: 'Refine public-facing structure, headings, and deployment-ready markup before you ship.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'CodePen — About',
        category: 'quick-start',
        description: 'Stage layout and pacing before moving files into a publish-ready repo.',
        website: 'https://codepen.io/about',
      },
    ],
    glossaryTerms: [
      { slug: 'publishing', term: 'Publishing' },
      { slug: 'liveness', term: 'Liveness' },
      { slug: 'versioning', term: 'Versioning' },
      { slug: 'url', term: 'URL' },
      { slug: 'hosting', term: 'Hosting' },
    ],
    imageAssets: [
      {
        src: P3,
        alt: 'Chapter still placeholder — live site / interface mood.',
        caption: 'Hero still — replace with Almost There or artport capture.',
        credit: 'Whitney Museum of American Art',
      },
      {
        src: P2,
        alt: 'Second placeholder — deployment / docs mood.',
        caption: 'Secondary still for GitHub Pages workflow.',
        credit: 'GitHub Docs',
      },
    ],
    artifact: {
      title: 'Live site study',
      description:
        'Make a one-page browser work and treat publishing as part of the piece—not an afterthought.',
      easy: ['Create a small page with a title, clear filename, and one public-facing framing sentence.'],
      medium: ['Publish a simple HTML/CSS work using GitHub Pages or equivalent static hosting.'],
      advanced: ['Publish a work where timing, revision, or live state is intentionally part of the concept.'],
      submission: [
        'Public URL or GitHub Pages link',
        'Repo link or project folder',
        'Short statement explaining what publishing added to the work',
      ],
    },
    reflection: [
      'What changed when you imagined the page as a live site instead of a class exercise?',
      'Did publishing feel like documentation, performance, or completion?',
      'What part of liveness mattered most: URL, timing, public access, or version history?',
      'How does a live website change what counts as an artwork?',
    ],
    /** Pedagogical handoff: Chapter 8 (systems) → publishing / liveness. */
    previousChapterSlug: 'systems-circulation-and-infrastructure',
    nextChapterSlug: null,
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-publishing-live',
      localVsLivePreview: {
        title: 'Local vs documented vs live',
        description:
          'Three conditions for the same markup: private file, captured evidence, and a public URL visitors can load—each shifts what the work is.',
        states: [
          {
            label: 'local',
            body: 'A local file is useful for building and testing, but it is not yet public or framed as a live artwork.',
          },
          {
            label: 'documented',
            body: 'Documentation records the work, but it does not fully replace a live browser encounter.',
          },
          {
            label: 'live',
            body: 'A live site has a URL, a host, a public state, and a place inside the web.',
          },
        ],
      },
      vibecoding: {
        buildMove: 'Take a browser work from local or prototype state into a live public URL.',
        promptMove:
          'Ask the model to help make the page publication-ready: clearer structure, meaningful title hierarchy, minimal friction for GitHub Pages, and plain-language deployment steps.',
        codepenPath: [
          'Prototype layout and pacing in CodePen.',
          'Lock the public-facing title and framing sentence.',
          'Treat CodePen as staging—plan what moves into index.html for the repo.',
        ],
        githubCursorPath: [
          'Create chapter-9-live-site/ with index.html, style.css, README.md.',
          'Ask Cursor to simplify structure for static hosting and check title hierarchy.',
          'Configure GitHub Pages publishing source and verify the live URL.',
        ],
        templateLabel: 'Live site starter (folder: chapter-9-live-site/)',
        output: 'A live or publish-ready browser artwork with a meaningful title, URL logic, and public-facing structure.',
      },
      prompting: {
        goal: 'prepare a browser-based artwork for public publishing',
        weakPrompt: '“Help me publish my website.”',
        betterPrompt:
          '“I have a small browser-based artwork and I want to publish it as a clean public-facing site. Help me simplify the file structure, improve the title hierarchy, keep the styling minimal, and explain the steps needed to publish it with GitHub Pages.”',
        reviewChecklist: [
          'Is the site title clear and meaningful?',
          'Does the page feel like an artwork, not just a file preview?',
          'What changes once the page is live at a public URL?',
          'Is the structure simple enough to publish and maintain?',
          'Does the work rely on liveness, timing, or public access?',
        ],
      },
      publishFlowDiagram: {
        title: 'Publish flow',
        description:
          'From files in a repository to a configured publishing source and a live GitHub Pages URL—publishing as a legible workflow (see GitHub Docs on Pages and publishing sources).',
        steps: [
          { label: 'Repository', detail: 'Store the project files and version history.' },
          { label: 'Publishing source', detail: 'Choose the branch or source used for GitHub Pages.' },
          { label: 'GitHub Pages', detail: 'Publish the static site from the repository.' },
          { label: 'Live URL', detail: 'The artwork now exists as a public-facing browser experience.' },
        ],
      },
    },
  }
}
