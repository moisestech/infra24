/** Copy + structure for DCC Miami × Edge Zones partnership portal (/edgezones). */

export const edgeZonesPortal = {
  slug: 'edgezones',
  path: '/edgezones',
  eyebrow: 'Partnership · Miami',
  title: 'DCC Miami × Edge Zones',
  subtitle: 'A Partnership Framework for Digital Art in Miami',
  mission: `Digital Culture Center Miami and Edge Zones are building a shared public layer for digital art in Miami — connecting physical exhibition space, curatorial vision, and open digital infrastructure so artists, audiences, and partners can find each other before, during, and after the show.`,
  roles: [
    {
      name: 'Edge Zones',
      role: 'Physical host space',
      description: 'Gallery, programming, and on-site experience.',
    },
    {
      name: 'Jordan Horton',
      role: 'Curator',
      description: 'Artistic direction and exhibition framing.',
    },
    {
      name: 'DCC Miami',
      role: 'Digital platform',
      description: 'Documentation, public-facing infrastructure, network index, and audience pathways.',
    },
  ],
  primaryCtas: [
    { label: 'Explore artists', href: '#artists' },
    { label: 'View programs', href: '#programs' },
    { label: 'Join the map', href: '#join' },
  ],
  sections: {
    support: {
      id: 'support',
      title: 'What DCC adds',
      intro: 'DCC is not just promotion — it is the digital layer that makes the partnership legible, searchable, and durable.',
      items: [
        'Exhibition webpage and partnership portal',
        'Artist index and network documentation',
        'Virtual studio visits and public program pathways',
        'Documentation archive (photos, video, press, texts)',
        'Audience signup and DCC Index intake',
        'Digital publishing and institutional memory',
      ],
    },
    vision: {
      id: 'vision',
      title: 'Larger vision',
      intro: 'This partnership is a pilot for how Miami can connect physical cultural space with a living digital culture map.',
      bullets: [
        'Artists become discoverable nodes, not one-off listings',
        'Programs create repeatable public pathways',
        'Documentation becomes archive, not disposable social content',
        'Partners, funders, and educators share one credible portal',
      ],
    },
    programs: {
      id: 'programs',
      title: 'Public programs',
      intro: 'Program details will be posted here as they are confirmed. Structure is live now so RSVP and updates have a home.',
      buckets: ['Upcoming programs', 'Artist talks', 'Workshops', 'Studio visits', 'Opening / closing events'],
      status: 'Schedule coming soon — check back or join below for updates.',
    },
    archive: {
      id: 'archive',
      title: 'Archive & documentation',
      intro: 'Installation photos, videos, press, interviews, PDFs, and post-show summaries will live here as the exhibition progresses.',
      status: 'Coming soon',
    },
    join: {
      id: 'join',
      title: 'Join & connect',
      intro: 'Artists, curators, students, educators, collectors, and collaborators — add yourself to Miami’s digital culture map or stay in the loop on Edge Zones programming.',
      signupHref: '/network/signup?source=edgezones',
      signupLabel: "Join Miami's Digital Culture Map",
      suggestHref: '/network/signup?pathway=research&source=edgezones',
      suggestLabel: 'Suggest someone for the Research View',
    },
  },
} as const

export const edgeZonesNavAnchors = [
  { id: 'artists', label: 'Artists' },
  { id: 'support', label: 'Support' },
  { id: 'vision', label: 'Vision' },
  { id: 'programs', label: 'Programs' },
  { id: 'archive', label: 'Archive' },
  { id: 'join', label: 'Join' },
] as const
