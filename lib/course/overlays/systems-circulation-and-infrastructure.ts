import type { Chapter, TemplateLink } from '@/lib/course/types'

const P1 =
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop'
const P2 =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop'
const P3 =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 8 — systems, circulation, infrastructure; Rhizome anthology + Bunting + Cheang. */
export function systemsCirculationAndInfrastructureAsChapter(): Chapter {
  return {
    number: 8,
    design: { moduleAccent: 'rose', lessonSkin: 'systems-circulation' },
    slug: 'systems-circulation-and-infrastructure',
    title: 'Systems, Circulation, and Infrastructure',
    subtitle: 'Routes, exchange, permissions, and hidden structures as artistic material',
    module: 'cultural-social-web',
    estimatedTime: '45–80 min',
    difficulty: 'Beginner',
    thesis:
      'A networked artwork can be about routes, permissions, exchanges, and hidden structures, not only about what appears on the screen.',
    summary:
      'This chapter introduces systems thinking in net art through messaging networks, portals, distributed interfaces, and infrastructural logic—using Rhizome’s Net Art Anthology framing of work that acts on the network or is acted on by it.',
    makingPreview: [
      'one browser system map',
      'visible routes or channels',
      'portal or protocol logic',
      'a hidden structure made legible',
    ],
    primaryAnchorCallout:
      'Rhizome’s anthology pages for *Communication Creates Conflict* and *Brandon* show how circulation, commissioning, and multi-channel routing become the artwork—not just the pixels.',
    sections: [
      {
        id: 'systems-as-subject',
        label: 'Concept',
        title: 'Systems can be the subject of the work',
        body:
          'A browser work does not need to focus only on image, text, or interaction. It can foreground rules, channels, permissions, exchanges, and the social or technical logic that moves things through a network.',
        icon: 'lucide:Network',
      },
      {
        id: 'circulation-matters',
        label: 'Concept',
        title: 'Circulation changes meaning',
        body:
          'A message routed through fax, postcard, or public display is not the same as a message kept inside one screen. Where something travels changes what it becomes.',
        icon: 'lucide:Workflow',
      },
      {
        id: 'infrastructure-visible',
        label: 'Concept',
        title: 'Infrastructure does not need to stay hidden',
        body:
          'Artists can reveal the channels, servers, institutions, and social frameworks that shape how information moves and who can access it.',
        icon: 'lucide:Server',
      },
      {
        id: 'portal-logic',
        label: 'Concept',
        title: 'A site can behave like a portal or protocol',
        body:
          'Some browser works are not only pages to look at. They operate like entry points, distributed narratives, or systems that connect multiple spaces and actors.',
        icon: 'lucide:Globe',
      },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&q=80&auto=format&fit=crop',
      alt: 'Abstract network diagram aesthetic — chapter banner placeholder.',
      caption: 'Replace with anthology or documentation stills when rights-cleared.',
    },
    anchorWorks: [
      {
        title: 'Communication Creates Conflict',
        artist: 'Heath Bunting',
        year: '1995',
        description:
          'An online platform through which users could send messages via postcard, fax, or a sign held in a Tokyo subway station—routing the internet across public and private channels.',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: P1,
          alt: 'Placeholder mood image for Communication Creates Conflict — replace with anthology capture.',
          caption: 'Placeholder — replace when cleared.',
        },
        links: [
          { label: 'View anthology page', href: 'https://anthology.rhizome.org/communication-creates-conflict' },
          { label: 'Rhizome ArtBase record', href: 'https://artbase.rhizome.org/wiki/Q15235' },
        ],
      },
      {
        title: 'Brandon',
        artist: 'Shu Lea Cheang',
        year: '1998–1999',
        description:
          'A year-long web narrative and performance exploring what Cheang called the “digi gender social body,” connecting public space and cyberspace through a collaborative online project (Rhizome anthology; Guggenheim commission context).',
        institution: 'Rhizome Net Art Anthology',
        image: {
          src: P2,
          alt: 'Placeholder mood image for Brandon — replace with anthology capture.',
        },
        links: [
          { label: 'View anthology page', href: 'https://anthology.rhizome.org/brandon' },
          { label: 'Original project context', href: 'https://brandon.guggenheim.org/shuleaWORKS/brandon.html' },
        ],
      },
    ],
    artists: [
      {
        name: 'Heath Bunting',
        description:
          'British artist known for repurposing communications channels and developing open, democratic communication systems across the internet and public space.',
        website: 'https://www.irational.org/',
        tags: ['communication systems', 'public space', 'network intervention'],
      },
      {
        name: 'Shu Lea Cheang',
        description:
          'Pioneering figure in internet-based art whose work often links interface, social systems, techno-bodies, and institutional power.',
        website: 'https://mauvaiscontact.info/',
        tags: ['networked installation', 'systems', 'techno-body politics'],
      },
    ],
    institutions: [
      {
        name: 'Rhizome — Net Art Anthology',
        description:
          'Major framework that presents net art as work that acts on the network or is acted on by it—central vocabulary for this chapter.',
        website: 'https://anthology.rhizome.org/',
      },
      {
        name: 'Whitney artport',
        description:
          'Museum portal to internet art and online commissions—useful for gate pages, archives, and distributed web commissions.',
        website: 'https://whitney.org/artport',
      },
      {
        name: 'Whitney artport — About',
        description:
          'Historical description of artport’s structure: archives, commissions, exhibitions, resources, and collection areas.',
        website: 'https://artport.whitney.org/v2/about.shtml',
      },
    ],
    curatorLenses: [
      {
        name: 'Rhizome’s Net Art Anthology definition',
        description:
          'Rhizome defines net art as art that acts on the network or is acted on by it—this chapter’s bridge from browser surface to infrastructural logic.',
        website: 'https://anthology.rhizome.org/',
        quote:
          "Rhizome has defined 'net art' as 'art that acts on the network, or is acted on by it.'",
      },
      {
        name: 'Anthology: Communication Creates Conflict',
        description:
          'How a browser work can route messages through urban space and communication infrastructures rather than staying inside one screen.',
        website: 'https://anthology.rhizome.org/communication-creates-conflict',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Places systems-oriented and networked works within broader internet art history.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Connects infrastructural and system-based practice to digital art discourse.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description: 'Prototype a small system map, portal, or routing interface in one page.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description: 'Use a repository when the work needs multiple pages, linked states, or clearer portal logic.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Organize system maps, flow logic, or multi-page structure while keeping the concept readable.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
    ],
    glossaryTerms: [
      { slug: 'system', term: 'System' },
      { slug: 'systems-as-subject', term: 'Systems as subject' },
      { slug: 'infrastructure', term: 'Infrastructure' },
      { slug: 'networked-self', term: 'Networked self' },
      { slug: 'url', term: 'URL' },
    ],
    imageAssets: [
      {
        src: P1,
        alt: 'Chapter 8 mood image — Communication Creates Conflict placeholder.',
        caption: 'Placeholder — replace when cleared.',
      },
      {
        src: P2,
        alt: 'Chapter 8 mood image — Brandon placeholder.',
        caption: 'Placeholder — replace when cleared.',
      },
      {
        src: P3,
        alt: 'Whitney artport / network diagram mood placeholder.',
        caption: 'Placeholder — replace when cleared.',
      },
    ],
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-systems-circulation',
      systemMapPreview: {
        nodes: [
          { label: 'User' },
          { label: 'Browser' },
          { label: 'Channel' },
          { label: 'Public space' },
        ],
        links: [
          { from: 'User', to: 'Browser' },
          { from: 'Browser', to: 'Channel' },
          { from: 'Channel', to: 'Public space' },
        ],
      },
      flowAndFrictionCard: {
        left: {
          label: 'Flow',
          points: ['clear route', 'stable access', 'direct delivery'],
        },
        right: {
          label: 'Friction',
          points: ['detour', 'permission barrier', 'unexpected relay'],
        },
      },
      vibecoding: {
        buildMove:
          'Create a one-page browser work that maps a system, route, portal, or hidden infrastructure rather than only showing a single static scene.',
        promptMove:
          'Ask the model to help structure a page around flows, nodes, permissions, or routes so the system itself becomes the artwork’s logic.',
        codepenPath: [
          'Start with one page and one clear system idea.',
          'Use nodes, links, arrows, zones, or route-like sections.',
          'Keep the map or protocol readable enough to teach the concept.',
        ],
        githubCursorPath: [
          'Create a simple repo when the system needs multiple linked pages or clearer structure.',
          'Ask Cursor to help organize the work like a portal, protocol, or system map.',
          'Let the file structure reflect the project’s logic when it helps.',
        ],
        templateLinks: starterLinks,
        output: 'A browser-based system study that makes routes, permissions, or infrastructure visible.',
      },
      prompting: {
        goal: 'Build a browser work that makes a system visible.',
        weakPrompt: 'Make a website about networks and infrastructure.',
        betterPrompt:
          'Create a beginner-friendly browser artwork that visualizes a system, route, or hidden infrastructure. Use nodes, links, labels, or zones to show how something moves through a network. Keep the structure simple and explain how the page makes the system legible.',
        reviewChecklist: [
          'Is the system clear enough to understand?',
          'Does circulation or routing affect meaning?',
          'Is the page showing relations rather than only content blocks?',
          'Does the structure feel like a portal, map, or protocol?',
        ],
      },
    },
    resources: [
      {
        type: 'work',
        title: 'Communication Creates Conflict',
        href: 'https://anthology.rhizome.org/communication-creates-conflict',
        description: 'Anchor work for routing messages across networks and public space.',
        publisher: 'Rhizome Net Art Anthology',
        year: '1995',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'work',
        title: 'Brandon',
        href: 'https://anthology.rhizome.org/brandon',
        description: 'Portal logic, distributed narrative, and cyberspace/public space connections.',
        publisher: 'Rhizome Net Art Anthology',
        year: '1998–1999',
        region: 'online',
        icon: 'Image',
      },
      {
        type: 'institution',
        title: 'Rhizome Net Art Anthology',
        href: 'https://anthology.rhizome.org/',
        description: 'Definition and collection context for net art on and of the network.',
        publisher: 'Rhizome',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'institution',
        title: 'Whitney artport',
        href: 'https://whitney.org/artport',
        description: 'Museum portal to internet art and online commissions.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Building2',
      },
      {
        type: 'article',
        title: 'Whitney artport — About',
        href: 'https://artport.whitney.org/v2/about.shtml',
        description: 'How artport is structured as archives, commissions, exhibitions, resources, and collection.',
        publisher: 'Whitney Museum of American Art',
        region: 'online',
        icon: 'BookOpenText',
      },
      {
        type: 'artist',
        title: 'Shu Lea Cheang — Whitney artist page',
        href: 'https://whitney.org/artists/8980',
        description: 'Institutional context for interactive, internet-based, and politically charged systems work.',
        publisher: 'Whitney Museum of American Art',
        region: 'international',
        icon: 'Palette',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Fast path for portal and system-map studies.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'tool',
        title: 'Cursor Quickstart',
        href: 'https://docs.cursor.com/en/get-started/quickstart',
        description: 'AI-assisted path for organizing routes, pages, and system logic.',
        publisher: 'Cursor',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'System study',
      description:
        'Make a browser-based artwork that visualizes or stages a system, route, permission structure, or hidden infrastructure.',
      easy: ['Create a one-page system map with nodes, labels, and one visible route.'],
      medium: ['Use HTML + CSS to build a portal-like page that shows flow, access, or blocked circulation.'],
      advanced: [
        'Build a browser work where routing, permissions, or multiple channels become the central artistic structure.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link or project folder',
        'One sentence explaining what system the work makes visible',
      ],
    },
    reflection: [
      'What system did your page make visible?',
      'Did the work feel more like a map, portal, protocol, or route?',
      'How did circulation change the meaning of the piece?',
      'What part of the infrastructure was previously hidden?',
    ],
    previousChapterSlug: 'identity-presence-and-networked-selves',
    nextChapterSlug: 'publishing-liveness-and-the-artwork-as-website',
  }
}
