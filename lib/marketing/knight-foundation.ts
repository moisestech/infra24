/**
 * Knight Foundation–aligned public pilot page for Miami.
 * Positive framing: civic infrastructure, not competitor comparison.
 */

export const knightFoundationGrantPage = {
  hero: {
    headline: 'A Miami pilot for public cultural communication infrastructure',
    subhead:
      'Infra24 is proposing a public-facing pilot that helps cultural organizations, artists, and communities access clearer, updateable information across physical and digital space through smart signs, smart maps, and multilingual public interfaces.',
    primaryCta: { href: '#proposal', label: 'Explore the pilot' },
    secondaryCta: { href: '#outcomes', label: 'View the public outcomes' },
  },
  problem: {
    id: 'problem' as const,
    headline: 'Miami’s cultural life is active. Its public information is often fragmented.',
    paragraphs: [
      'Miami has no shortage of cultural activity, but public access to that activity is often inconsistent. Important information lives across flyers, websites, social posts, front desks, staff memory, and outdated signage. Smaller organizations, artist-serving spaces, and multilingual communities are especially affected when public-facing information is hard to find, hard to update, or uneven across digital and physical space.',
      'This is not only a communications issue. It is a public access issue.',
    ],
  },
  proposal: {
    id: 'proposal' as const,
    headline: 'What Infra24 is proposing',
    paragraphs: [
      'Infra24 proposes a Miami pilot that deploys updateable public-facing communication infrastructure across participating cultural organizations. The pilot uses visible, practical systems such as smart signs, smart maps, QR-linked interfaces, and multilingual information touchpoints to make programming, navigation, opportunities, and institutional information easier for the public to access in real time.',
      'Rather than building one-off campaigns or custom software for a single client, the goal is to test a repeatable model that can be adapted across multiple organizations and neighborhoods.',
    ],
  },
  visibleEntryPoints: {
    id: 'visible' as const,
    headline: 'Visible public entry points',
    cards: [
      {
        title: 'Smart signs',
        body:
          'Updateable screens or sign systems in lobbies, hallways, windows, and public-facing spaces that display current programs, events, artist opportunities, and real-time information.',
      },
      {
        title: 'Smart maps',
        body:
          'Physical–digital wayfinding systems that help residents and visitors locate cultural spaces, nearby programs, and neighborhood resources.',
      },
      {
        title: 'Multilingual public interfaces',
        body:
          'Bilingual or multilingual information systems that improve usability and access across Miami’s diverse communities.',
      },
      {
        title: 'QR-linked public layers',
        body:
          'Simple mobile-accessible interfaces that connect physical sites to current schedules, forms, artist info, and neighborhood pathways.',
      },
    ],
  },
  differentiation: {
    id: 'difference' as const,
    headline: 'Why this is not a display catalog or marketing campaign',
    paragraphs: [
      'Infra24 is not proposing to sell generic signage products. The focus is not hardware breadth, ad campaigns, or one-off installations. Infra24 builds public communication systems that are designed around institutional reality: what needs to be visible, who updates it, how it stays current, how the public encounters it, and how results can be measured over time.',
      'The work is not just about placing a screen in a room. It is about making cultural information more usable, more visible, and easier to maintain across organizations that often operate with limited staff capacity and fragmented communications tools.',
    ],
  },
  whoBenefits: {
    id: 'who' as const,
    headline: 'Who this serves',
    columns: [
      {
        title: 'Artists',
        body:
          'More visible opportunities, clearer public presence, and better pathways into programs and institutional support.',
      },
      {
        title: 'Cultural organizations',
        body:
          'Easier updates, stronger public communication, clearer visitor information, and systems that can actually be maintained.',
      },
      {
        title: 'Communities',
        body:
          'Better access to events, navigation, public resources, and culturally relevant information across physical and digital space.',
      },
    ],
  },
  outcomes: {
    id: 'outcomes' as const,
    headline: 'Expected public outcomes',
    bullets: [
      'More visible access points to cultural programming in Miami',
      'Easier navigation of participating cultural spaces',
      'More current and trustworthy public information',
      'Stronger multilingual access where needed',
      'Increased visibility for artist opportunities and public programs',
      'A repeatable infrastructure model for use across multiple organizations',
      'Practical documentation and methods that other organizations can reuse',
    ],
  },
  whyMiami: {
    id: 'miami' as const,
    headline: 'Why Miami is the right pilot city',
    paragraphs: [
      'Miami is an ideal place to pilot this model because it is culturally active, multilingual, decentralized, and unevenly connected across institutions and neighborhoods. Many organizations serve real public need but do so with fragmented communication systems, limited staff capacity, and inconsistent public-facing infrastructure. A city like Miami does not only benefit from more programming. It benefits from clearer pathways into the programming that already exists.',
    ],
  },
  repeatability: {
    id: 'repeatability' as const,
    headline: 'Designed to repeat, not remain one-off',
    paragraphs: [
      'The pilot is designed as a repeatable deployment model. That means documenting not only the interfaces and public-facing devices, but also the update workflows, governance, measurement approach, and implementation logic that allow the system to work across multiple organizations. The goal is to produce a model that can be adapted for other sites, neighborhoods, and partner institutions over time.',
    ],
  },
  about: {
    id: 'about' as const,
    headline: 'About Infra24',
    paragraphs: [
      'Infra24 is a digital culture infrastructure studio that helps nonprofits, cultural institutions, and artist-serving organizations build updateable public communication systems across physical and online space. Its work focuses on visibility, access, wayfinding, public engagement, and repeatable operational systems that can be measured, maintained, and expanded over time.',
    ],
  },
  closing: {
    id: 'cta' as const,
    headline: 'Infra24 is building a civic model for clearer cultural access in Miami.',
    primaryCta: { href: '/contact?interest=knight-pilot', label: 'Discuss a pilot partner site' },
    secondaryCta: { href: '/contact?interest=knight-brief', label: 'Request the project brief' },
    tertiaryCta: { href: '/contact', label: 'Contact Infra24' },
  },
} as const;
