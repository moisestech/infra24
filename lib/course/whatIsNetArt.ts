import type { LmsCanonArtist } from '@/types/lms'

export type WhatIsNetArtChapter = {
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  artOnline: string[]
  netArt: string[]
  principles: string[]
  canon: LmsCanonArtist[]
  artifact: {
    title: string
    description: string
    prompts: string[]
    modes: {
      easy: string[]
      medium: string[]
      advanced: string[]
    }
  }
  reflection: string[]
  keyIdeas: { title: string; body: string }[]
}

export const whatIsNetArtChapter: WhatIsNetArtChapter = {
  title: 'What Is Net Art?',
  subtitle: 'A beginner-friendly introduction to browser-based, networked, and web-native artistic practice',
  description:
    'Learn what makes net art distinct, how the internet can function as medium, and how browser structure, interface, interaction, and networks can become artistic material.',
  outcomes: [
    'Understand a working definition of net art',
    'Distinguish between art online and art made through internet logic',
    'Recognize the browser, link, interface, and network as artistic materials',
    'Identify foundational artists and tendencies',
    'Make a first conceptual web gesture',
  ],
  artOnline: [
    'documentation uploaded to a website',
    'images posted on social media',
    'portfolio pages',
    'video embeds',
    'PDFs or promotional pages',
  ],
  netArt: [
    'the artwork depends on the browser',
    'links are part of the structure',
    'interaction changes meaning',
    'the webpage is part of the composition',
    'networked or participatory logic is built into the work',
    'the internet is how the work works',
  ],
  principles: [
    'the browser as medium',
    'the page as space',
    'the link as structure',
    'interaction as meaning',
    'glitch as language',
    'remix as method',
    'networked identity and presence',
    'systems as subject',
    'liveness and time',
    'publishing as part of the artwork',
  ],
  canon: [
    { name: 'Olia Lialina', focus: 'browser narrative, frames, and hypertext structure', href: 'https://en.wikipedia.org/wiki/Olia_Lialina' },
    { name: 'JODI', focus: 'anti-interface, glitch, and disruption', href: 'https://en.wikipedia.org/wiki/Jodi_(artist_collective)' },
    { name: 'Rafaël Rozendaal', focus: 'focused browser-based visual works and websites as art objects', href: 'https://www.newrafael.com/' },
    { name: 'Mark Napier', focus: 'software behavior and browser experimentation', href: 'https://en.wikipedia.org/wiki/Mark_Napier_(artist)' },
    { name: 'Heath Bunting', focus: 'systems, networks, and infrastructure', href: 'https://en.wikipedia.org/wiki/Heath_Bunting' },
    { name: 'Shu Lea Cheang', focus: 'identity, surveillance, and networked life', href: 'https://en.wikipedia.org/wiki/Shu_Lea_Cheang' },
    { name: 'Eva and Franco Mattes', focus: 'internet culture, performance, and online traces', href: 'https://en.wikipedia.org/wiki/Eva_and_Franco_Mattes' },
    { name: 'Cory Arcangel', focus: 'remix, software culture, and appropriation', href: 'https://www.coryarcangel.com/' },
    { name: 'Petra Cortright', focus: 'platform aesthetics and digital self-image', href: 'https://en.wikipedia.org/wiki/Petra_Cortright' },
  ],
  artifact: {
    title: 'Web Gesture',
    description:
      'Make a one-page experiment that demonstrates one core net art idea. It does not need to be polished. It needs to make one concept visible.',
    prompts: [
      'a page where one click changes the tone',
      'a page with one meaningful link',
      'a page that feels like an interface, not a poster',
      'a page that feels intentionally broken',
      'a page that stages a digital self',
    ],
    modes: {
      easy: ['Create a rough browser page that demonstrates one idea.'],
      medium: ['Create a page with HTML + CSS that makes the idea feel intentional.'],
      advanced: ['Create a page with one interaction or behavioral change that reinforces the concept.'],
    },
  },
  reflection: [
    'What feels most different about net art compared to other art forms?',
    'Which part of the web feels most interesting to you as a material?',
    'Which artist tendency are you most curious about so far?',
    'What kind of web-native artwork do you want to make?',
  ],
  keyIdeas: [
    {
      title: 'Key idea 1 — The browser as medium',
      body: 'A browser is not only a window—it is a frame, stage, surface, rule set, and behavior system. Layout, scroll, load, hover, and click can all be expressive.',
    },
    {
      title: 'Key idea 2 — The link as structure',
      body: 'Links can redirect attention, fragment narrative, create suspense, or hide layers until the viewer chooses. Hypertext is central to much net art.',
    },
    {
      title: 'Key idea 3 — The interface as aesthetic',
      body: 'Buttons, dialogs, loading bars, and cursors are not neutral—they carry mood. Interface can be meaning, not only function.',
    },
    {
      title: 'Key idea 4 — Network, presence, and participation',
      body: 'Who is connected, who contributes, who is watched, who leaves traces—presence, identity, and data can be part of the work.',
    },
  ],
}
