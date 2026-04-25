import type { Chapter, TemplateLink } from '@/lib/course/types'

const IMG_CSS =
  'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80&auto=format&fit=crop'
const IMG_P5 =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop'
const IMG_3 =
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop'
const BANNER =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1800&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  {
    label: 'MDN — Using CSS transforms',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
    kind: 'download',
  },
  { label: 'p5.js Web Editor', href: 'https://editor.p5js.org/', kind: 'codepen' },
  { label: 'three.js manual', href: 'https://threejs.org/manual/', kind: 'download' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 10 — CSS / p5.js / Processing / three.js as distinct advanced pathways (curated lab chooser). */
export function advancedVibecodingPathwaysAsChapter(): Chapter {
  return {
    number: 10,
    design: { moduleAccent: 'emerald', lessonSkin: 'advanced-pathways' },
    slug: 'advanced-vibecoding-pathways',
    title: 'Advanced Vibecoding Pathways',
    subtitle: 'CSS3 browser space, p5.js / Processing generative systems, and three.js spatial web',
    module: 'public-work-advanced',
    estimatedTime: '60–120 min',
    difficulty: 'Intermediate',
    thesis:
      'Advanced vibecoding is not one thing. It is a set of pathways for shaping browser space, generative systems, and interactive worlds.',
    makingPreview: [
      'One chosen pathway',
      'One small advanced prototype',
      'CSS3, p5.js, or three.js',
      'A clear next-level direction',
    ],
    primaryAnchorCallout:
      'Official docs and learning surfaces—MDN transforms, p5.js, Processing’s overview, and the three.js manual—are credible “works” for this chapter: they define what each pathway is good at before you commit build time.',
    summary:
      'This chapter frames advanced practice as a lab decision: CSS transforms and perspective for browser-native space, p5.js and Processing for generative and interactive sketches, and three.js for navigable 3D scenes. Choose one pathway and ship a small proof-of-concept.',
    sections: [
      {
        id: 'choose-a-path',
        label: 'Concept',
        title: 'Choosing a path is part of the practice',
        body:
          'Advanced browser-based art does not require one universal stack. Different tools lead to different formal and conceptual outcomes, and committing to a path is itself a creative decision.',
        icon: 'lucide:Compass',
      },
      {
        id: 'css-browser-space',
        label: 'Concept',
        title: 'CSS3 can become browser space',
        body:
          'With transforms, layering, perspective, and compositional motion, CSS can move beyond styling and become a medium for spatial or atmospheric browser experiences.',
        icon: 'lucide:Layers3',
      },
      {
        id: 'p5-processing',
        label: 'Concept',
        title: 'p5.js and Processing support generative thinking',
        body:
          'These tools make it easier to sketch systems, animation, and interaction through code—strong pathways when you want rules, emergence, and visual feedback loops.',
        icon: 'lucide:Sparkles',
      },
      {
        id: 'threejs-worlds',
        label: 'Concept',
        title: 'three.js opens a spatial web path',
        body:
          'three.js is the canonical browser 3D stack for scenes, cameras, meshes, and interaction—useful when the artwork should feel environmental, volumetric, or navigable.',
        icon: 'lucide:Box',
      },
    ],
    chapterBanner: {
      src: BANNER,
      alt: 'Abstract code and geometry suggesting multiple technical pathways — chapter banner placeholder.',
      caption: 'Replace with pathway-specific documentation stills when you curate chapter media.',
    },
    anchorWorks: [
      {
        title: 'CSS transforms as compositional browser behavior',
        artist: 'MDN reference / browser practice',
        year: 'current documentation',
        description:
          'MDN’s transforms guide frames translation, rotation, skewing, and scaling as browser-space operations—composition and motion in the DOM, not only decorative styling.',
        institution: 'MDN Web Docs',
        image: {
          src: IMG_CSS,
          alt: 'Placeholder visual for the CSS transforms pathway.',
          caption: 'Conceptual anchor — MDN transforms.',
        },
        links: [
          {
            label: 'MDN — Using CSS transforms',
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
          },
        ],
      },
      {
        title: 'p5.js as accessible creative coding',
        artist: 'p5.js community',
        year: 'current platform',
        description:
          'p5.js presents itself as a friendly tool for learning to code and making art in the browser—ideal for generative sketches, motion studies, and interaction-first prototypes.',
        institution: 'p5.js',
        image: {
          src: IMG_P5,
          alt: 'Placeholder visual for the p5.js pathway.',
          caption: 'Conceptual anchor — p5.js.',
        },
        links: [{ label: 'p5.js home', href: 'https://p5js.org/' }],
      },
      {
        title: 'three.js manual',
        artist: 'three.js ecosystem',
        year: 'current documentation',
        description:
          'The official manual is the clearest entry point for WebGL-based scenes in the browser: renderers, cameras, objects, lights, and interaction patterns.',
        institution: 'three.js',
        image: {
          src: IMG_3,
          alt: 'Placeholder visual for the three.js pathway.',
          caption: 'Conceptual anchor — three.js manual.',
        },
        links: [{ label: 'three.js manual', href: 'https://threejs.org/manual/' }],
      },
    ],
    artists: [
      {
        name: 'p5.js community / artist-educator ecosystem',
        description:
          'Tutorials, examples, and reference geared toward artists, designers, beginners, and educators building expressive browser sketches.',
        website: 'https://p5js.org/',
        tags: ['creative coding', 'generative systems', 'accessible learning'],
      },
      {
        name: 'Processing lineage',
        description:
          'A visually oriented programming environment for sketching animation and interaction—with emphasis on quick feedback while you iterate.',
        website: 'https://processing.org/tutorials/overview/',
        tags: ['visual programming', 'animation', 'interaction'],
      },
      {
        name: 'three.js ecosystem',
        description:
          'Documentation and examples for browser 3D: scenes, cameras, materials, and interactive spatial work.',
        website: 'https://threejs.org/manual/',
        tags: ['3D', 'spatial web', 'interactive scenes'],
      },
    ],
    institutions: [
      {
        name: 'MDN Web Docs',
        description:
          'Authoritative browser documentation—especially strong for CSS transforms, layout, and how CSS behaves in real engines.',
        website: 'https://developer.mozilla.org/',
      },
      {
        name: 'p5.js',
        description:
          'A JavaScript creative-coding library and learning hub oriented toward expressive, beginner-accessible art-making on the web.',
        website: 'https://p5js.org/',
      },
      {
        name: 'Processing',
        description:
          'The Processing project’s tutorials and environment for coding motion, interaction, and visual ideas with immediate feedback.',
        website: 'https://processing.org/tutorials/overview/',
      },
      {
        name: 'three.js',
        description:
          'The three.js project’s manual and examples for building interactive 3D experiences that run in the browser.',
        website: 'https://threejs.org/manual/',
      },
    ],
    curatorLenses: [
      {
        name: 'MDN transforms framing',
        description:
          'Use MDN when you want transforms read as spatial and temporal operations on elements—not only “effects.”',
        website: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
      },
      {
        name: 'Processing overview',
        description:
          'Processing’s own overview stresses a simple environment for learning, with animation and interaction that give instant feedback while you sketch in code.',
        website: 'https://processing.org/tutorials/overview/',
        quote:
          'Processing is a simple programming environment … with an emphasis on animation and providing users with instant feedback through interaction. — Processing tutorials overview',
      },
    ],
    books: [
      {
        title: 'Internet Art',
        author: 'Rachel Greene',
        description: 'Historical context for browser-based and networked art practices.',
        link: 'https://thamesandhudson.com/internet-art-9780500203763',
      },
      {
        title: 'Digital Art',
        author: 'Christiane Paul',
        description: 'Broader museum context when connecting technical pathways back to digital art histories.',
        link: 'https://thamesandhudson.com/digital-art-9780500203985',
      },
    ],
    tools: [
      {
        name: 'CSS transforms / MDN',
        category: 'advanced',
        description: 'Transforms, layering, and perspective for browser-space studies without leaving the DOM.',
        website: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
      },
      {
        name: 'p5.js',
        category: 'advanced',
        description: 'Generative sketches, motion systems, and interaction-driven visual studies in the browser.',
        website: 'https://p5js.org/',
      },
      {
        name: 'Processing',
        category: 'advanced',
        description: 'Lineage and environment for animation, interaction, and visually oriented code sketching.',
        website: 'https://processing.org/tutorials/overview/',
      },
      {
        name: 'three.js',
        category: 'advanced',
        description: '3D scene structure, cameras, meshes, and spatial interaction when the work needs a world.',
        website: 'https://threejs.org/manual/',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description: 'Scaffold and refactor advanced files while keeping each pathway legible in the repo.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'Claude Code',
        category: 'ai-assisted',
        description: 'Agent-style coding support inside VS Code for iterative builds and refactors.',
        website: 'https://code.claude.com/docs/en/vs-code',
      },
      {
        name: 'Codex',
        category: 'ai-assisted',
        description: 'Codex-style workflows for generation, explanation, and refinement alongside your plan.',
        website: 'https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/',
      },
    ],
    glossaryTerms: [
      { slug: 'vibecoding', term: 'Vibecoding' },
      { slug: 'context-window', term: 'Context window' },
      { slug: 'responsive-behavior', term: 'Responsive behavior' },
      { slug: 'artifact', term: 'Artifact' },
      { slug: 'deploy', term: 'Deploy' },
    ],
    imageAssets: [
      {
        src: IMG_CSS,
        alt: 'Chapter media placeholder — CSS / layout mood.',
        caption: 'CSS transforms pathway — replace with curated still when ready.',
      },
      {
        src: IMG_P5,
        alt: 'Chapter media placeholder — creative coding mood.',
        caption: 'p5.js pathway — replace with curated still when ready.',
      },
      {
        src: IMG_3,
        alt: 'Chapter media placeholder — 3D / spatial mood.',
        caption: 'three.js pathway — replace with curated still when ready.',
      },
    ],
    dossierLayout: 'phase',
    resources: [
      {
        type: 'article',
        title: 'MDN — HTML: HyperText Markup Language',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description: 'Primary structural reference alongside pathway-specific CSS and JS.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — HTML & CSS pathways',
      },
      {
        type: 'article',
        title: 'MDN — Using CSS transforms',
        href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using',
        description: 'Primary browser-space reference for CSS transforms.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'Layers3',
        dossierGroup: 'MDN — HTML & CSS pathways',
      },
      {
        type: 'article',
        title: 'The Odin Project — Foundations',
        href: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
        description: 'Workflow-oriented foundations when advanced work spans files, Git, and multi-page repos.',
        publisher: 'The Odin Project',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'Workflow foundations (Odin)',
      },
      {
        type: 'article',
        title: 'W3Schools — HTML Tutorial',
        href: 'https://www.w3schools.com/html/',
        description: 'Optional quick HTML syntax lookup while prototyping.',
        publisher: 'W3Schools',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Quick lookup (W3Schools)',
      },
      {
        type: 'article',
        title: 'Processing — tutorials overview',
        href: 'https://processing.org/tutorials/overview/',
        description: 'How Processing frames visually oriented coding with animation and interaction.',
        publisher: 'Processing Foundation',
        region: 'online',
        icon: 'Code2',
      },
      {
        type: 'organization',
        title: 'p5.js',
        href: 'https://p5js.org/',
        description: 'Friendly creative-coding library, tutorials, reference, and examples for browser art.',
        publisher: 'p5.js',
        region: 'online',
        icon: 'Sparkles',
      },
      {
        type: 'organization',
        title: 'three.js manual',
        href: 'https://threejs.org/manual/',
        description: 'Official manual entry point for browser-based 3D scenes and interaction.',
        publisher: 'three.js',
        region: 'online',
        icon: 'Box',
      },
      {
        type: 'tool',
        title: 'Claude Code in VS Code',
        href: 'https://code.claude.com/docs/en/vs-code',
        description: 'Official documentation for Claude Code in VS Code.',
        publisher: 'Claude Code Docs',
        region: 'online',
        icon: 'Bot',
      },
      {
        type: 'tool',
        title: 'Using Codex with your ChatGPT plan',
        href: 'https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/',
        description: 'OpenAI Help Center — Codex-supported workflows.',
        publisher: 'OpenAI',
        region: 'online',
        icon: 'Bot',
      },
    ],
    artifact: {
      title: 'Advanced pathway prototype',
      description:
        'Pick exactly one pathway and ship a small proof-of-concept that shows what that stack is good at—not a full production app.',
      easy: ['A CSS-only browser-space study using transforms, layers, or perspective.'],
      medium: ['A p5.js sketch with motion, generative rules, or clear interaction.'],
      advanced: ['A compact three.js scene or multi-file prototype with one sharp conceptual focus.'],
      submission: [
        'Prototype URL or screenshot',
        'Repo link or project folder',
        'One sentence: why this pathway fit the idea',
      ],
    },
    reflection: [
      'Which pathway did you choose and why?',
      'What formal possibilities did that path open up?',
      'What felt advanced but still manageable?',
      'What should stay small now, and what could grow later?',
    ],
    previousChapterSlug: 'publishing-liveness-and-the-artwork-as-website',
    nextChapterSlug: 'final-project-build-publish-and-frame-your-net-artwork',
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-advanced-pathways',
      pathwayChooser: {
        title: 'Pathway chooser',
        description:
          'Each column is a different artistic machine. Commit to one for this chapter’s prototype—mixing all three usually means finishing none.',
        items: [
          {
            title: 'CSS3 browser space',
            focus: 'Layout, transforms, perspective, and compositional motion in the DOM.',
            bestFor: ['Spatial DOM composition', 'Transforms and perspective', 'Browser-native motion without a canvas runtime'],
          },
          {
            title: 'p5.js / Processing',
            focus: 'Rule-based drawing, animation loops, and interaction logic in code.',
            bestFor: ['Animation systems', 'Interactive sketches', 'Generative form and emergence'],
          },
          {
            title: 'three.js',
            focus: 'Scenes, cameras, meshes, lights—spatial worlds in WebGL through a structured API.',
            bestFor: ['3D environments', 'Camera movement', 'Scene-based worldbuilding'],
          },
        ],
      },
      vibecoding: {
        buildMove:
          'Choose one advanced pathway and build a small proof-of-concept rather than trying to learn everything at once.',
        promptMove:
          'Ask the model to scaffold only one path—CSS browser-space, a p5.js sketch, or a minimal three.js scene—with explicit file list, dependencies, and a single “hero” behavior to implement first.',
        codepenPath: [
          'Use CodePen for CSS-only spatial studies or very small p5.js sketches.',
          'Keep the scope to one strong formal behavior you can demo in under a minute.',
          'Prototype before promoting the idea into a larger repo.',
        ],
        githubCursorPath: [
          'Move to a repo when you need multiple files, assets, or modules.',
          'Ask Cursor to explain the architecture of the chosen pathway in five bullets.',
          'Keep the proof-of-concept small enough to read in one sitting.',
        ],
        templateLabel: 'Official starters',
        templateLinks: starterLinks,
        output: 'A small pathway prototype that demonstrates one advanced direction clearly.',
      },
      prompting: {
        goal: 'Choose one advanced pathway and keep the prototype small.',
        weakPrompt: '“Help me build something advanced with coding.”',
        betterPrompt:
          '“Help me build a small advanced browser-art prototype using only one pathway: CSS3 browser space, p5.js generative sketching, or a three.js 3D scene. Keep the scope narrow, list files and dependencies, and optimize for a proof-of-concept—not a full project.”',
        reviewChecklist: [
          'Did I choose one path instead of three?',
          'Is the scope small enough to finish a prototype?',
          'Does the chosen tool match the concept?',
          'Can I explain what the pathway is good for in one sentence?',
        ],
      },
      toolComparisonGrid: {
        title: 'Tool comparison grid',
        description:
          'A shorthand for critique and planning: what each pathway optimizes for, how steep the ramp feels, and what you are likely to ship first.',
        rows: [
          {
            tool: 'CSS3',
            strength: 'DOM-based space and motion',
            complexity: 'Low to medium',
            output: 'Browser composition',
          },
          {
            tool: 'p5.js',
            strength: 'Generative and interactive drawing',
            complexity: 'Medium',
            output: 'Sketch or system',
          },
          {
            tool: 'three.js',
            strength: '3D scenes and spatial interaction',
            complexity: 'Medium to high',
            output: 'Browser world',
          },
        ],
      },
    },
  }
}
