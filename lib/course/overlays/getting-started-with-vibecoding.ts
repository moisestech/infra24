import type { Chapter, TemplateLink } from '@/lib/course/types'

const IMG_WEB =
  'https://images.unsplash.com/photo-1621839673705-6617adf9e463?w=1200&q=80&auto=format&fit=crop'
const IMG_REPO =
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80&auto=format&fit=crop'
const IMG_QUADRANT =
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop'
const IMG_DESKTOP =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop'
const IMG_CODEPEN =
  'https://images.unsplash.com/photo-1461746770565-95b04e1a2d5a?w=1200&q=80&auto=format&fit=crop'

const starterLinks: TemplateLink[] = [
  { label: 'Open a new CodePen', href: 'https://codepen.io/pen/', kind: 'codepen' },
  { label: 'Create a GitHub repository', href: 'https://github.com/new', kind: 'repo' },
  { label: 'Cursor quickstart', href: 'https://docs.cursor.com/en/get-started/quickstart', kind: 'cursor-prompt' },
]

/** Chapter 0 — tool landscape, browser materials, GitHub setup; pairs with disk markdown + official hubs. */
export function gettingStartedWithVibecodingAsChapter(): Chapter {
  return {
    number: 0,
    design: { moduleAccent: 'blue', lessonSkin: 'getting-started' },
    slug: 'getting-started-with-vibecoding',
    title: 'Getting Started with Vibecoding',
    subtitle: 'Tools, setup, GitHub, terminals, and the web materials you build with',
    module: 'orientation',
    estimatedTime: '45–90 min',
    difficulty: 'Beginner',
    thesis:
      'Vibecoding is not the absence of coding. It is a new relationship between conversation, abstraction, and the web’s core materials: HTML, CSS, and JavaScript.',
    summary:
      'This chapter situates vibecoding between no-code platforms, browser-based builders, and code-first workflows, then helps you set up a light toolchain for browser-native net art.',
    makingPreview: [
      'one CodePen account',
      'one GitHub repo',
      'one first clone + commit + push',
      'one tiny HTML/CSS/JS study',
    ],
    primaryAnchorCallout:
      'MDN and GitHub Docs are your ground truth for what the browser runs and how repositories hold files and history—treat them like wall labels next to the tools.',
    sections: [
      {
        id: 'where-vibecoding-sits',
        label: 'Context',
        title: 'Where vibecoding sits',
        body:
          'Vibecoding exists between strict no-code tools and traditional code-first development. In this course, vibecoding means using conversation, prompts, and AI assistance to shape browser-native materials directly rather than only filling forms inside a no-code platform.',
        icon: 'lucide:Sparkles',
      },
      {
        id: 'web-materials',
        label: 'Concept',
        title: 'HTML, CSS, and JavaScript are your artistic materials',
        body:
          'HTML gives structure, CSS gives visual form and spatial behavior, and JavaScript gives logic, events, and state. In this course, these are treated like materials you can compose with.',
        icon: 'lucide:Code2',
      },
      {
        id: 'abstraction',
        label: 'Concept',
        title: 'Code is already an abstraction',
        body:
          'Programming languages are already abstractions above machine code. Vibecoding adds conversation as another abstraction layer—but HTML, CSS, and JavaScript remain the materials the browser actually reads and performs. Most artists and developers do not write machine code directly; you still read, edit, and steer the web stack even when an assistant drafts for you.',
        icon: 'Binary',
      },
      {
        id: 'tooling',
        label: 'Setup',
        title: 'You do not need every tool on day one',
        body:
          'The goal is not to install everything or memorize every workflow. The goal is to become comfortable with one browser-first path and one file-based path you can repeat.',
        icon: 'lucide:Wrench',
      },
    ],
    anchorWorks: [
      {
        title: 'The web stack as medium',
        artist: 'Browser platform / course framing',
        year: 'ongoing',
        description:
          'This chapter treats HTML, CSS, and JavaScript as the working material of browser-native art rather than as invisible implementation details behind a single app template.',
        institution: 'MDN / web platform context',
        image: {
          src: IMG_WEB,
          alt: 'Abstract representation of code and layout on a screen — web stack as medium.',
        },
        links: [
          {
            label: 'MDN Learn Web Development',
            href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
          },
        ],
      },
      {
        title: 'Repository as project container',
        artist: 'GitHub workflow / course framing',
        year: 'ongoing',
        description:
          'A repository becomes the practical home for a browser artwork’s files, revisions, and collaboration history—whether you use GitHub Desktop, the CLI, or both.',
        institution: 'GitHub Docs',
        image: {
          src: IMG_REPO,
          alt: 'Laptop and version control metaphor — repository as project container.',
        },
        links: [
          {
            label: 'About repositories',
            href: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
          },
          {
            label: 'Quickstart for repositories',
            href: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories?tool=webui',
          },
        ],
      },
    ],
    artists: [
      {
        name: 'The learner as builder',
        description:
          'This chapter treats you as someone composing with web materials directly—HTML, CSS, and JavaScript—rather than only configuring a black-box platform.',
        tags: ['HTML', 'CSS', 'JavaScript', 'browser-native making'],
      },
    ],
    institutions: [
      {
        name: 'GitHub Docs',
        description:
          'Official documentation for repositories, cloning, GitHub Desktop, GitHub Mobile, and collaboration workflows.',
        website: 'https://docs.github.com/',
      },
      {
        name: 'MDN Web Docs',
        description:
          'Authoritative reference for HTML, CSS, JavaScript, and how browsers render and execute them.',
        website: 'https://developer.mozilla.org/',
      },
      {
        name: 'CodePen',
        description:
          'A browser-based playground for quickly prototyping HTML, CSS, and JavaScript in one visible workspace.',
        website: 'https://codepen.io/',
      },
    ],
    curatorLenses: [
      {
        name: 'Course framing lens',
        description:
          'This course positions vibecoding not as a magic replacement for code, but as a conversational abstraction layer on top of languages you can still see, edit, and own.',
      },
      {
        name: 'Tooling lens',
        description:
          'The most important beginner skill is not mastering every tool. It is understanding what each tool is good for and choosing the right level of control for the artwork you want to make.',
      },
    ],
    books: [
      {
        title: 'Learning Web Design',
        author: 'Jennifer Robbins',
        description: 'A foundational, approachable tour of the web stack and how pages are structured and styled.',
        link: 'https://www.oreilly.com/library/view/learning-web-design/9781491960202/',
      },
    ],
    tools: [
      {
        name: 'CodePen',
        category: 'quick-start',
        description:
          'Fast browser-based environment for HTML, CSS, and JavaScript experiments with minimal local setup.',
        website: 'https://codepen.io/about',
      },
      {
        name: 'GitHub',
        category: 'structured',
        description:
          'Where repositories live: files, revision history, collaboration, and publishing hooks.',
        website: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
      },
      {
        name: 'GitHub Desktop',
        category: 'structured',
        description:
          'A graphical Git client for cloning, committing, and pushing without living entirely in the terminal.',
        website: 'https://docs.github.com/en/desktop',
      },
      {
        name: 'GitHub Mobile',
        category: 'platform-tool',
        description:
          'iOS and Android app for notifications, browsing repos, and light review when you are away from your desk.',
        website: 'https://docs.github.com/github/getting-started-with-github/github-for-mobile',
      },
      {
        name: 'Cursor',
        category: 'ai-assisted',
        description:
          'An AI-first editor for file-based work, diffs, and codebase-aware prompting—keep human review in the loop.',
        website: 'https://docs.cursor.com/en/get-started/quickstart',
      },
      {
        name: 'Warp',
        category: 'platform-tool',
        description:
          'A modern terminal (macOS, Windows, Linux) with optional AI-assisted command workflows—use if you want a upgraded shell, not as a requirement.',
        website: 'https://docs.warp.dev/',
      },
      {
        name: 'Replit',
        category: 'platform-tool',
        description:
          'Browser-based coding with AI, runtimes, and publishing in one tab—useful contrast to hand-authored HTML/CSS/JS files.',
        website: 'https://docs.replit.com/getting-started',
      },
      {
        name: 'Airtable Cobuilder',
        category: 'platform-tool',
        description:
          'No-code app generation from natural language inside Airtable—strong when the platform should own structure and hosting.',
        website: 'https://www.airtable.com/newsroom/airtables-new-cobuilder-unlocks-instant-no-code-app-creation',
      },
      {
        name: 'Base44',
        category: 'platform-tool',
        description:
          'Prompt-based AI app builder with backend and hosting included—compare to composing raw web materials yourself.',
        website: 'https://base44.com/ai-app-builder',
      },
    ],
    glossaryTerms: [
      { slug: 'vibecoding', term: 'Vibecoding' },
      { slug: 'repository', term: 'Repository' },
      { slug: 'branch', term: 'Branch' },
      { slug: 'commit', term: 'Commit' },
      { slug: 'clone', term: 'Clone' },
      { slug: 'ide', term: 'IDE' },
      { slug: 'prompt', term: 'Prompt' },
      { slug: 'context-window', term: 'Context window' },
    ],
    chapterBanner: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1800&q=80&auto=format&fit=crop',
      alt: 'Desk with laptop — onboarding and setup chapter banner placeholder.',
      caption: 'Replace with your own workshop still or neutral slide export when ready.',
    },
    imageAssets: [
      {
        src: IMG_QUADRANT,
        alt: 'Developers collaborating — metaphor for choosing tools and lanes.',
        caption: 'Placeholder mood image for the tool landscape section.',
      },
      {
        src: IMG_DESKTOP,
        alt: 'Laptop showing an IDE — GitHub Desktop or editor workflow.',
        caption: 'Placeholder — swap for a cleared screenshot of your preferred Git client.',
      },
      {
        src: IMG_CODEPEN,
        alt: 'Code on screen — CodePen or live preview context.',
        caption: 'Placeholder — swap for a CodePen or devtools capture when rights allow.',
      },
    ],
    lessonEnrichment: {
      themeWrapperClass: 'lesson-theme-getting-started',
      vibecodingQuadrant: {
        title: 'Where this course sits',
        description:
          'A quick map: no-code lanes, AI app builders, this course’s browser-native vibecoding, and classic repo-first workflows—each optimizes for something different.',
        quadrants: [
          {
            title: 'No-code',
            subtitle: 'Airtable / Cobuilder',
            note: 'Strong for structured workflows and app-like operations when the platform should carry most of the architecture.',
          },
          {
            title: 'AI app builders',
            subtitle: 'Base44 / Replit',
            note: 'Strong for fast idea-to-app loops when hosting, backends, and runtimes are largely managed for you.',
          },
          {
            title: 'Browser-native vibecoding',
            subtitle: 'This course',
            note: 'Strong when HTML, CSS, and JavaScript are the artistic materials and the browser is the primary exhibition space.',
          },
          {
            title: 'Code-first',
            subtitle: 'Repo + editor + terminal',
            note: 'Strong for maximum control, long-term growth, and understanding every file in the stack.',
          },
        ],
      },
      learningGuidesStrip: {
        title: 'Learn the browser materials',
        description:
          'Different guides are useful for different moments: deep learning, guided practice, quick lookup, and workflow context.',
        guides: [
          {
            title: 'MDN',
            subtitle: 'Primary source',
            note: 'Best for trustworthy HTML, CSS, and JavaScript fundamentals plus long-term reference.',
          },
          {
            title: 'freeCodeCamp',
            subtitle: 'Guided practice',
            note: 'Best for beginner-friendly, hands-on repetition through structured exercises.',
          },
          {
            title: 'W3Schools',
            subtitle: 'Quick lookup',
            note: 'Best for fast examples and checking syntax when you need an answer quickly.',
          },
          {
            title: 'The Odin Project',
            subtitle: 'Workflow context',
            note: 'Best for stronger file-based learning, Git literacy, and development workflow habits.',
          },
        ],
      },
      webMaterialsStack: {
        title: 'HTML, CSS, JavaScript as ingredients',
        description:
          'These three layers are what browsers actually render and execute. Net art in this course usually begins by shaping them directly—not only by configuring a higher-level app shell.',
        layers: [
          {
            label: 'HTML',
            body: 'Structure: headings, paragraphs, sections, images, links—the skeleton readers and scripts both rely on.',
          },
          {
            label: 'CSS',
            body: 'Form: color, spacing, layout, typography, motion, composition—the mood and spatial logic of the page.',
          },
          {
            label: 'JavaScript',
            body: 'Behavior: clicks, state, events, timing, logic—how the page responds and changes over time.',
          },
        ],
      },
      repoSetupChecklist: {
        title: 'Repository setup checklist',
        description:
          'Follow official GitHub docs as you go. Check items off mentally or on paper—you do not have to finish every optional step today.',
        items: [
          'Create a GitHub account',
          'Create a new repository from the web UI',
          'Install GitHub Desktop (or configure Git in a terminal you already use)',
          'Clone the repository to your computer',
          'Open the folder in Cursor or another editor',
          'Make a small change (for example, edit README or add index.html)',
          'Write a clear commit message',
          'Push the commit to GitHub',
          'Install GitHub Mobile for notifications and light review (optional)',
          'Optionally try Warp or another modern terminal if you want AI-assisted shell workflows',
        ],
      },
      vibecoding: {
        buildMove:
          'Set up one browser-first path and one file-based path, then make a tiny HTML/CSS/JS study you can point to.',
        promptMove:
          'Ask the model to explain what each tool is for and scaffold a first tiny browser-native project without overcomplicating the setup.',
        codepenPath: [
          'Create a CodePen account.',
          'Open one pen with HTML, CSS, and JavaScript panes visible.',
          'Ship a tiny study so you can see the three materials working together.',
        ],
        githubCursorPath: [
          'Create a GitHub account and a first repository.',
          'Clone it locally using GitHub Desktop or a terminal clone command.',
          'Open the local folder in Cursor (or another editor), make a change, commit, and push.',
        ],
        templateLinks: starterLinks,
        output:
          'A working setup plus one tiny browser-native study built from HTML, CSS, and JavaScript.',
      },
      prompting: {
        goal: 'Get set up without getting overwhelmed.',
        weakPrompt: 'Help me set up all the coding tools.',
        betterPrompt:
          'Help me choose the lightest setup for this course. I want one browser-first path and one file-based path. Explain GitHub, repositories, cloning, committing, and pushing in simple terms, then scaffold a tiny HTML/CSS/JS project I can actually finish today.',
        reviewChecklist: [
          'Do I know what each tool is for?',
          'Can I describe the difference between CodePen and a repo-based workflow?',
          'Have I created a repo and made one commit?',
          'Have I made one small browser-native study rather than only setting up tools?',
        ],
      },
    },
    artifact: {
      title: 'Setup + first browser study',
      description:
        'Complete the minimum setup and make one tiny browser-native study using HTML, CSS, and JavaScript.',
      easy: ['CodePen or single file: title + one sentence + one style choice + link or screenshot.'],
      medium: [
        'GitHub repo: index.html (+ optional CSS/JS) + README with how to open locally + one commit message you stand behind.',
      ],
      advanced: [
        'Set up both a browser-first path and a file-based path; make a tiny study in each and write three sentences comparing how each lane felt.',
      ],
      submission: [
        'CodePen URL or screenshot',
        'GitHub repo link',
        'One sentence describing the difference between your browser-first path and your repo-based path',
      ],
    },
    reflection: [
      'Which setup path felt lightest and most understandable?',
      'What changed when you moved from a browser-only tool to a repository workflow?',
      'Did HTML, CSS, and JavaScript feel more like materials after making a tiny study?',
      'Where do you want more control, and where do you want more convenience next?',
    ],
    dossierLayout: 'phase',
    resources: [
      {
        type: 'article',
        title: 'MDN Learn Web Development',
        href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
        description: 'Mozilla’s structured hub for HTML, CSS, and JavaScript fundamentals.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — primary (structure & reference)',
      },
      {
        type: 'article',
        title: 'MDN — HTML: HyperText Markup Language',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description:
          'Primary overview of HTML as the web’s structural layer, with beginner tutorials, guides, and reference.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — primary (structure & reference)',
      },
      {
        type: 'article',
        title: 'MDN — Basic HTML syntax',
        href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax',
        description: 'Beginner-friendly guide to elements, tags, attributes, and basic document structure.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'Code2',
        dossierGroup: 'MDN — primary (structure & reference)',
      },
      {
        type: 'article',
        title: 'MDN — HTML guides',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Guides',
        description: 'Topic-based HTML guides for going deeper once the basics click.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — primary (structure & reference)',
      },
      {
        type: 'article',
        title: 'MDN — HTML reference',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference',
        description: 'Fast lookup reference for elements, attributes, and common HTML patterns.',
        publisher: 'MDN Web Docs',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'MDN — primary (structure & reference)',
      },
      {
        type: 'article',
        title: 'freeCodeCamp — Responsive Web Design',
        href: 'https://www.freecodecamp.org/learn/2022/responsive-web-design',
        description: 'Guided beginner practice for HTML and CSS through hands-on exercises.',
        publisher: 'freeCodeCamp',
        region: 'online',
        icon: 'Code2',
        dossierGroup: 'Guided practice (freeCodeCamp)',
      },
      {
        type: 'article',
        title: 'W3Schools — HTML Tutorial',
        href: 'https://www.w3schools.com/html/',
        description: 'Quick HTML tutorial and syntax lookup for fast examples.',
        publisher: 'W3Schools',
        region: 'online',
        icon: 'BookOpenText',
        dossierGroup: 'Quick lookup (W3Schools)',
      },
      {
        type: 'article',
        title: 'The Odin Project — Foundations',
        href: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
        description:
          'Workflow-oriented foundations path that helps connect HTML/CSS learning to files, Git, and development setup.',
        publisher: 'The Odin Project',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'Workflow & Git habits (Odin)',
      },
      {
        type: 'tool',
        title: 'About repositories',
        href: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories',
        description:
          'GitHub defines a repository as the basic place where your code, files, and revision history live.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'Creating a new repository',
        href: 'https://docs.github.com/articles/creating-a-new-repository',
        description: 'Official steps for creating a new repository from GitHub’s web UI.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'Cloning and forking repositories from GitHub Desktop',
        href: 'https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop',
        description: 'Clone a repository to your machine using GitHub Desktop.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'Committing and reviewing changes in GitHub Desktop',
        href: 'https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop',
        description: 'Write commits and review file changes before you push.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'GitBranch',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'GitHub Mobile',
        href: 'https://docs.github.com/github/getting-started-with-github/github-for-mobile',
        description: 'GitHub’s mobile apps for triage, notifications, and light review.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'Smartphone',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'GitHub Desktop',
        href: 'https://docs.github.com/en/desktop',
        description: 'GUI-based workflows for repositories, branches, and remotes.',
        publisher: 'GitHub Docs',
        region: 'online',
        icon: 'Laptop',
        dossierGroup: 'GitHub & repository workflow',
      },
      {
        type: 'tool',
        title: 'Warp getting started',
        href: 'https://docs.warp.dev/',
        description: 'Modern terminal and optional AI-assisted workflows across platforms.',
        publisher: 'Warp',
        region: 'online',
        icon: 'Terminal',
        dossierGroup: 'Optional terminal',
      },
      {
        type: 'tool',
        title: 'Replit getting started',
        href: 'https://docs.replit.com/getting-started',
        description: 'Browser-based building, AI features, and publishing in one environment.',
        publisher: 'Replit',
        region: 'online',
        icon: 'Globe',
        dossierGroup: 'Contrast: managed app builders',
      },
      {
        type: 'tool',
        title: 'Airtable Cobuilder',
        href: 'https://www.airtable.com/newsroom/airtables-new-cobuilder-unlocks-instant-no-code-app-creation',
        description: 'Airtable’s natural-language path to generated no-code apps.',
        publisher: 'Airtable',
        region: 'online',
        icon: 'LayoutGrid',
        dossierGroup: 'Contrast: managed app builders',
      },
      {
        type: 'tool',
        title: 'Base44 AI App Builder',
        href: 'https://base44.com/ai-app-builder',
        description: 'Prompt-based app creation with built-in backend and hosting.',
        publisher: 'Base44',
        region: 'online',
        icon: 'Bot',
        dossierGroup: 'Contrast: managed app builders',
      },
      {
        type: 'tool',
        title: 'CodePen',
        href: 'https://codepen.io/about',
        description: 'Browser-first path for HTML, CSS, and JavaScript sketches.',
        publisher: 'CodePen',
        region: 'online',
        icon: 'Code2',
        dossierGroup: 'Browser studio (CodePen)',
      },
    ],
    previousChapterSlug: null,
    nextChapterSlug: 'what-is-net-art',
  }
}
