import type { Chapter } from '@/lib/course/types'

/** Disk supplement — deep read on glitch as expressive language after Ch. 4 (anti-interface); bridges toward browser-behavior (Napier). */
export function glitchAsLanguageJodiAsChapter(): Chapter {
  return {
    number: 4,
    chapterSequenceLabel: 'Glitch focus',
    slug: 'glitch-as-language-jodi',
    title: 'Glitch as language',
    subtitle:
      'JODI as the primary anchor: error, noise, and awkward layout as strategy—not accident—plus a short bridge to Mark Napier for “what the browser does” as material.',
    module: 'browser-language',
    estimatedTime: '35–45 min',
    difficulty: 'Intermediate',
    thesis:
      'Glitch becomes legible as art when viewers sense intentional relation between signal and noise: repetition, truncation, and broken layout are vocabulary, not only malfunction.',
    summary:
      'This chapter tightens the move from anti-interface (Ch. 4) into glitch-as-language—how distortion carries mood, critique, humor, or overload—and ends with a concrete build: a one-viewport “glitch field” using HTML and CSS, with Mark Napier as the next hinge for behavioral browser material.',
    sections: [
      {
        id: 'glitch-not-mistake',
        label: 'Concept',
        title: 'Glitch is not a mistake; it is a strategy',
        icon: 'concept',
        body:
          'A glitch can read as joke, threat, decay, or critique depending on rhythm and context. Net art often treats distortion like typography: you set a beat (repeat an element, misalign a block, flood a line with symbols), then break it once so the break carries meaning.',
      },
      {
        id: 'jodi-anchor',
        label: 'Artist',
        title: 'JODI — error as aesthetic, conceptual, and political',
        icon: 'artist',
        body:
          'JODI (Joan Heemskerk and Dirk Paesmans) helped establish that a webpage could feel hostile, absurd, or unstable on purpose while still being “just” HTML. Their work is a touchstone for reading wrongness as composition—and for asking who the interface is usually built to comfort.',
      },
      {
        id: 'language-of-noise',
        label: 'Language',
        title: 'Noise, overload, and almost-readable text',
        icon: 'palette',
        body:
          'Think in verbs: stutter, stack, clip, flood, mirror. Glitch-as-language often plays at the edge of legibility—enough pattern to infer rules, enough rupture to feel the system underneath. Humor and menace both live in how far you push that edge.',
      },
      {
        id: 'css-glitch-field',
        label: 'Build',
        title: 'Distort with text, spacing, symbols, and layout',
        icon: 'build',
        body:
          'Starter action: in one viewport, build a “glitch field” with no external assets—repeated characters, negative margins, overlapping blocks, `transform`, `letter-spacing`, `overflow`, and deliberately wrong hierarchy. Caption it with a single-word mood. Stretch: animate one layer so instability becomes time-based.',
      },
      {
        id: 'napier-bridge',
        label: 'Bridge',
        title: 'Mark Napier — from static distortion to browser behavior',
        icon: 'code',
        body:
          'Where JODI often stages confusion in the surface and structure, Napier-era projects foreground what the browser is willing to do (load, shred, remix). The next chapter on disk continues that arc; keep notes on one browser behavior you might later simulate with scroll, overflow, or stacking.',
      },
      {
        id: 'meaning-not-decoration',
        label: 'Critique',
        title: 'When does distortion become meaningful?',
        icon: 'ethics',
        body:
          'Random noise exhausts attention; shaped noise directs it. Name what you are refusing (clarity? sincerity? corporate calm?) and what you still protect (a readable title, keyboard focus, alt text, or a calm note below the storm). Resistance reads stronger when viewers can tell it is governed.',
      },
    ],
    anchorWorks: [
      {
        title: 'JODI — Whitney documentation spine',
        artist: 'Joan Heemskerk & Dirk Paesmans (JODI)',
        year: '1990s–present',
        description:
          'Artist dossier, exhibition framing, and installation views—useful images and museum language for anti-interface and early web disruption.',
        institution: 'Whitney Museum of American Art',
        links: [
          { label: 'Whitney — Artist (JODI)', href: 'https://whitney.org/artists/15261' },
          { label: 'Whitney — Exhibition: JODI', href: 'https://whitney.org/exhibitions/jodi' },
          { label: 'Whitney — Exhibition art', href: 'https://whitney.org/exhibitions/jodi/art' },
        ],
      },
      {
        title: 'JODI — Automatic Rain (Net Art Anthology)',
        artist: 'JODI',
        year: '1995',
        description:
          'Rhizome’s anthology essay on an early browser work—useful for language about timing, default tags like blink, and how net pieces change as the network speeds up.',
        institution: 'Rhizome',
        links: [{ label: 'Rhizome — Anthology: Automatic Rain', href: 'https://anthology.rhizome.org/automatic-rain' }],
      },
      {
        title: 'Mark Napier — Potatoland / software projects',
        artist: 'Mark Napier',
        year: '1990s–2000s',
        description:
          'Potatoland hosts Shredder, Riot, and related experiments that treat browsing and rendering as plastic—natural follow-up once glitch moves from layout into behavior.',
        institution: 'Potatoland',
        links: [
          { label: 'Potatoland', href: 'https://www.potatoland.org/' },
          { label: 'Mark Napier — studio site', href: 'https://www.marknapier.com/' },
          {
            label: 'Whitney Artport — Biennial 2002: Riot',
            href: 'https://artport.whitney.org/v2/exhibitions/biennial2002/napier.shtml',
          },
        ],
      },
    ],
    artists: [
      {
        name: 'JODI',
        description:
          'Duo practice whose sites and gestures turned crashes, wrong turns, and aggressive HTML into a recognizable net-art vocabulary—central for reading glitch as language.',
        website: 'https://www.jodi.org/',
      },
      {
        name: 'Mark Napier',
        description:
          'Projects such as Shredder and Riot treat the browser as an engine that can be bent, scraped, or collaged—useful when glitch graduates from layout tricks into software behavior.',
        website: 'https://www.marknapier.com/',
      },
    ],
    institutions: [
      {
        name: 'Whitney Museum of American Art',
        description:
          'Primary dossier and exhibition documentation for JODI—strong image and chronology spine for teaching anti-interface and glitch aesthetics.',
        website: 'https://whitney.org/',
      },
      {
        name: 'Rhizome',
        description:
          'Net Art Anthology and essays that preserve and contextualize browser-native work—supporting references for instability, preservation, and online presentation.',
        website: 'https://rhizome.org/',
      },
    ],
    curatorLenses: [],
    books: [],
    tools: [
      {
        name: 'Whitney — JODI (artist)',
        category: 'quick-start',
        description: 'Biography, chronology, and collection-facing context.',
        website: 'https://whitney.org/artists/15261',
      },
      {
        name: 'Rhizome — Anthology: Automatic Rain (JODI)',
        category: 'quick-start',
        description: 'Anthology entry: early web timing, blink, and changing network context.',
        website: 'https://anthology.rhizome.org/automatic-rain',
      },
      {
        name: 'JODI — Primary site',
        category: 'quick-start',
        description: 'Live and historic gestures at the source.',
        website: 'https://www.jodi.org/',
      },
      {
        name: 'Mark Napier — studio',
        category: 'quick-start',
        description: 'Overview of software- and browser-forward projects.',
        website: 'https://www.marknapier.com/',
      },
      {
        name: 'Potatoland',
        category: 'structured',
        description: 'Home for Shredder, Riot, and related experiments.',
        website: 'https://www.potatoland.org/',
      },
    ],
    glossaryTerms: [
      { slug: 'glitch', term: 'Glitch' },
      { slug: 'anti-interface', term: 'Anti-interface' },
      { slug: 'net-art', term: 'Net art' },
      { slug: 'interface', term: 'Interface' },
    ],
    imageAssets: [],
    artifact: {
      title: 'Glitch field experiment',
      description:
        'One HTML page that reads as unstable or overloaded on purpose: a glitch field built from text, spacing, repeated symbols, and awkward layout—no bitmap images required.',
      easy: [
        'Pick one mood word (e.g. “tender,” “angry,” “bureaucratic”). Use only text, `<br>`, and inline spacing tricks to make the page feel wrong in a way that matches the word.',
      ],
      medium: [
        'Add CSS: overlap blocks, clip overflow, skew or repeat a short phrase, and break heading hierarchy so nothing “wins” visually—yet a viewer can still find the mood word somewhere.',
      ],
      advanced: [
        'Animate one layer (opacity, transform, or filter) on a slow loop so the glitch has time-based rhythm; keep one static anchor (title or footnote) so the chaos feels governed.',
      ],
      submission: [
        'Submit `08-glitch-text.html` (or a URL) plus three bullets: what rule you established, what you broke, and what you kept readable on purpose.',
      ],
    },
    reflection: [
      'When does distortion become meaningful instead of merely noisy?',
      'Which JODI tactic did you borrow (overload, misdirection, stutter, illegibility) and how did it change the page’s tone?',
      'What single browser default did your glitch “argue with” (alignment, scroll, focus ring, system font)?',
      'Where would Mark Napier’s “what the browser does” angle push your next iteration?',
    ],
    previousChapterSlug: 'anti-interface-jodi',
    nextChapterSlug: 'browser-behavior-as-art-mark-napier',
  }
}
