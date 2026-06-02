/** Copy + structure for DCC Miami × Edge Zones partnership portal (/edgezones). */

export type EdgeZonesModuleStatus = 'live' | 'coming-soon'

export type EdgeZonesSupportModule = {
  id: string
  title: string
  description: string
  href: string
  status: EdgeZonesModuleStatus
}

export const edgeZonesPortal = {
  slug: 'edgezones',
  path: '/edgezones',
  eyebrow: 'Partnership · Miami',
  title: 'DCC Miami × Edge Zones',
  subtitle: 'A Partnership Framework for Digital Art in Miami',
  mission: `Digital Culture Center Miami supports the exhibition through digital publishing, artist visibility, public programs, documentation, and infrastructure around the show — connecting Edge Zones as physical host space, Jordan Horton’s curatorial vision, and DCC as the digital platform and support layer.`,
  roles: [
    {
      name: 'Edge Zones',
      role: 'Physical host space',
      description: 'Gallery, programming, and on-site experience.',
    },
    {
      name: 'Jordan Horton',
      role: 'Curatorial vision',
      description: 'Artistic direction and exhibition framing.',
    },
    {
      name: 'DCC Miami',
      role: 'Digital platform & support layer',
      description:
        'Digital publishing, artist visibility, public programs, documentation, and infrastructure around the show.',
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
      intro:
        'Seven modules around the exhibition — each with a live pathway on this portal or a clear Coming Soon state until content is ready.',
      modules: [
        {
          id: 'exhibition-webpage',
          title: 'Exhibition Webpage',
          description: 'Partnership portal and exhibition landing — the public face of the show online.',
          href: '#top',
          status: 'live',
        },
        {
          id: 'artist-index',
          title: 'Artist Index',
          description: 'Network index of participating artists and host space — discoverable before, during, and after the show.',
          href: '#artists',
          status: 'live',
        },
        {
          id: 'virtual-studio-visits',
          title: 'Virtual Studio Visits',
          description: 'Remote studio pathways connecting audiences to artists in the exhibition network.',
          href: '#studio-visits',
          status: 'coming-soon',
        },
        {
          id: 'documentation-archive',
          title: 'Documentation Archive',
          description: 'Installation photos, video, press, interviews, and post-show summaries.',
          href: '#archive',
          status: 'coming-soon',
        },
        {
          id: 'audience-signup',
          title: 'Audience Signup Pathway',
          description: 'Quick intake for artists, audiences, and collaborators to join Miami’s digital culture map.',
          href: '#join',
          status: 'live',
        },
        {
          id: 'public-programs',
          title: 'Public Programs',
          description: 'Talks, workshops, studio visits, and opening events — RSVP and updates in one place.',
          href: '#programs',
          status: 'coming-soon',
        },
        {
          id: 'digital-publishing',
          title: 'Digital Publishing',
          description: 'Essays, interviews, and institutional memory published through DCC’s digital layer.',
          href: '#publishing',
          status: 'coming-soon',
        },
      ] satisfies EdgeZonesSupportModule[],
    },
    vision: {
      id: 'vision',
      title: 'Larger vision',
      intro:
        'This partnership is a repeatable model for connecting physical cultural space with a living digital culture platform in Miami.',
      pillars: [
        {
          title: 'Curator-led exhibition',
          description: 'Artistic direction anchored in Jordan Horton’s curatorial frame.',
        },
        {
          title: 'Physical host space',
          description: 'Edge Zones as gallery, programming hub, and on-site experience.',
        },
        {
          title: 'Digital culture platform',
          description: 'DCC as the public infrastructure layer — discoverable, documented, and durable.',
        },
        {
          title: 'Public programming',
          description: 'Talks, workshops, and events that create repeatable audience pathways.',
        },
        {
          title: 'Artist network',
          description: 'Participating artists as connected nodes in Miami’s digital culture map.',
        },
        {
          title: 'Long-term archive',
          description: 'Documentation and publishing that outlasts the exhibition run.',
        },
      ],
    },
    studioVisits: {
      id: 'studio-visits',
      title: 'Virtual studio visits',
      intro: 'Remote studio pathways for artists in the Edge Zones network will be published here.',
      status: 'Coming soon',
    },
    publishing: {
      id: 'publishing',
      title: 'Digital publishing',
      intro: 'Essays, interviews, and partnership documentation published through DCC will appear here.',
      status: 'Coming soon',
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
      signupHref:
        '/network/signup?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
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

/** Proposal-phase attribution defaults (PDF QR + join funnel). */
export const edgeZonesProposalAttribution = {
  signupSource: 'edgezones',
  utmSource: 'edgezones',
  utmMedium: 'proposal',
  utmCampaign: 'dcc_edgezones_launch',
  utmContent: 'partnership_pdf',
  qrCodeId: 'dcc_edgezones_main',
} as const
