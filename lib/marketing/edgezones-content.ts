/** Copy + structure for DCC Miami × Edge Zones proposal portal (/edgezones). */

import { TOUCHING_GRASS_EXHIBITION } from '@/lib/marketing/edgezones-exhibition'
import { EDGE_ZONES_GALLERY_WEBSITE } from '@/lib/marketing/edgezones-network-index'
import type { EdgeZonesIconAccent, EdgeZonesSupportIconKey } from '@/lib/marketing/edgezones-icons'

export type EdgeZonesModuleStatus = 'live' | 'in-development' | 'materials-needed' | 'coming-soon'

export type EdgeZonesSupportModule = {
  id: string
  number: string
  title: string
  description: string
  materialsNote?: string
  href?: string
  status: EdgeZonesModuleStatus
  icon: EdgeZonesSupportIconKey
  accent: EdgeZonesIconAccent
}

export const EDGE_ZONES_CREDIT_LINE =
  'Presented at Edge Zones, curated by Jordan Horton, with digital platform and public programming support from DCC Miami.'

export const edgeZonesPortal = {
  slug: 'edgezones',
  path: '/edgezones',
  creditLine: EDGE_ZONES_CREDIT_LINE,
  shortDescription:
    'A partnership framework for digital art in Miami, connecting a curator-led exhibition with artist visibility, public programming, digital documentation, and a long-term online archive.',
  hero: {
    eyebrow: 'DCC Miami × Edge Zones',
    title: 'Touching Grass',
    subtitle: 'Digital Culture, Physical Reality',
    intro: `Touching Grass is an exhibition concept exploring the relationship between digital culture and embodied, ecological, and material reality.

The exhibition brings together artists whose practices examine how digital technologies shape attention, labor, memory, ecology, and social life — and how those systems loop back into our bodies, relationships, and environments.`,
    statusChips: ['Host Space', 'Curator', 'Digital Platform'] as const,
  },
  primaryCtas: [
    { label: 'View Artist Index', href: '#artists' },
    { label: 'See What DCC Adds', href: '#support' },
    { label: 'Download Partnership PDF', href: '#pdf' },
    { label: 'Join Updates', href: '#join' },
  ],
  rolesMatrix: {
    title: 'How the partnership works',
    intro:
      'This proposal is structured around three distinct roles: Edge Zones as the physical host space, Jordan Horton as invited curator, and DCC Miami as the digital platform and public programming support layer.',
    disclaimer:
      'DCC Miami does not add financial, staffing, installation, storage, or production responsibilities to Edge Zones. DCC contributes in-kind digital and public-facing support around the exhibition.',
    edgeZones: {
      title: 'Edge Zones',
      subtitle: 'Physical host space',
      intro:
        'Edge Zones provides the exhibition space, standard exhibition hosting, and opening and closing receptions.',
      items: [
        'Physical host space',
        'Opening reception',
        'Closing reception',
        'Standard exhibition hosting',
        'Existing Edge Zones website and social media visibility',
        '$500 curatorial fee under Edge Zones’ standard invited-curator structure',
      ],
      accent: 'coral' as const,
      href: EDGE_ZONES_GALLERY_WEBSITE,
      hrefLabel: 'edgezones.org',
    },
    jordanHorton: {
      title: 'Jordan Horton',
      subtitle: 'Curatorial vision',
      intro:
        'Jordan Horton leads the curatorial framework for the exhibition, including artist selection, exhibition development, and coordination of the materials needed to mount and present the show.',
      items: [
        'Artist selection',
        'Curatorial framework',
        'Artist communication',
        'Wall text and artist bios',
        'Checklist coordination',
        'Installation and de-installation coordination',
        'Gathering artist materials in ready-to-post format',
      ],
      accent: 'indigo' as const,
    },
    dccMiami: {
      title: 'DCC Miami',
      subtitle: 'Digital platform and public programming support',
      intro:
        'DCC Miami extends the life and impact of the exhibition before, during, and after it opens through online infrastructure, artist visibility, documentation, publishing, and one public program or activation.',
      items: [
        'Exhibition webpage',
        'Artist index',
        'Audience signup pathway',
        'Digital documentation/archive structure',
        'Digital publishing support',
        'Promotion through DCC channels and network',
        'One public program, workshop, conversation, or activation connected to the exhibition',
      ],
      accent: 'teal' as const,
    },
  },
  concept: {
    title: 'Touching Grass',
    subtitle: 'Digital culture, physical reality',
    paragraphs: [
      'Touching Grass invites viewers to step out of the screen and into physical space, toward slowness, care, texture, and lived experience.',
      'The exhibition asks how digital systems shape perception and behavior, and how art can reconnect those systems to the body, the land, and the shared conditions of social life.',
    ],
    themes: [
      { label: 'Attention', description: 'How we focus, scroll, fragment, and disperse our time.' },
      { label: 'Extraction', description: 'The data, resources, and hidden labor behind digital systems.' },
      { label: 'Ecology', description: 'The environmental footprints of networks, devices, and platforms.' },
      { label: 'Care', description: 'Bodies, relationships, and systems of support.' },
      { label: 'Reconnection', description: 'Returning to place, presence, and shared reality.' },
      { label: 'Embodied Reality', description: 'The physical world as the ground where digital culture becomes lived experience.' },
    ],
    diagram: ['Digital Culture', 'Physical Space', 'Embodied Reality'],
  },
  artists: {
    title: 'Participating artists',
    intro:
      'The artist index connects the exhibition’s host space, curator, and participating artists through public-facing profiles, links, bios, images, and future online materials.',
  },
  sections: {
    support: {
      id: 'support',
      title: 'What DCC adds',
      intro:
        'DCC provides the digital infrastructure that extends the exhibition before, during, and after it opens.',
      modules: [
        {
          id: 'exhibition-webpage',
          number: '01',
          title: 'Exhibition Webpage',
          description:
            'A dedicated home for the exhibition with curatorial text, artist list, dates, location, programs, links, and updates.',
          href: '#overview',
          status: 'live',
          icon: 'globe',
          accent: 'teal',
        },
        {
          id: 'artist-index',
          number: '02',
          title: 'Artist Index',
          description: 'Profiles for participating artists with bios, images, statements, links, and work samples.',
          materialsNote: 'artist portraits, bios, statements, websites, Instagram links, artwork images',
          href: '#artists',
          status: 'in-development',
          icon: 'users',
          accent: 'indigo',
        },
        {
          id: 'virtual-studio-visits',
          number: '03',
          title: 'Virtual Studio Visits',
          description:
            'A framework to support curatorial research, artist conversations, notes, and technical information.',
          href: undefined,
          status: 'in-development',
          icon: 'video',
          accent: 'magenta',
        },
        {
          id: 'documentation-archive',
          number: '04',
          title: 'Documentation Archive',
          description:
            'A structure for photos, video, audio, writing, installation documentation, and process materials to be preserved and shared.',
          href: '#archive',
          status: 'coming-soon',
          icon: 'archive',
          accent: 'coral',
        },
        {
          id: 'audience-signup',
          number: '05',
          title: 'Audience Signup Pathway',
          description: 'QR codes, RSVP links, newsletter signup, artist intake forms, and workshop interest collection.',
          href: '#join',
          status: 'live',
          icon: 'mail',
          accent: 'teal',
        },
        {
          id: 'public-programs',
          number: '06',
          title: 'Public Programs',
          description:
            'Talks, artist conversations, workshops, screenings, and community events connected to digital art and culture.',
          href: '#programs',
          status: 'in-development',
          icon: 'calendar',
          accent: 'indigo',
        },
        {
          id: 'digital-publishing',
          number: '07',
          title: 'Digital Publishing',
          description: 'Articles, interviews, and exhibition writing that contextualize the work and extend its reach online.',
          href: undefined,
          status: 'coming-soon',
          icon: 'bookOpen',
          accent: 'magenta',
        },
      ] satisfies EdgeZonesSupportModule[],
    },
    publicProgram: {
      id: 'programs',
      title: 'DCC-Supported Public Program',
      intro:
        'DCC will support one public program connected to the exhibition during the run of the show. The final format will be confirmed with Edge Zones, Jordan Horton, and the participating artists.',
      formats: [
        'Artist talk',
        'Digital culture conversation',
        'Workshop',
        'Public activation',
        'Studio visit screening',
        'Exhibition walkthrough',
        'Documentation or publishing event',
      ],
      dateLabel: 'Date TBD',
      formatLabel: 'Format TBD with Edge Zones, Jordan Horton, and participating artists',
      ctaHref: '#join',
      ctaLabel: 'Join updates',
    },
    archive: {
      id: 'archive',
      title: 'Long-term archive',
      intro:
        'DCC will support an online documentation structure for the exhibition so that the project can continue to live beyond the opening.',
      deliverables: [
        'Installation photos',
        'Artist links',
        'Artist bios and statements',
        'Checklist of works',
        'Curatorial text',
        'Program documentation',
        'Video or audio documentation if available',
        'Digital publishing materials',
        'Future exhibition updates',
      ],
      status: 'Coming soon',
    },
    pdf: {
      id: 'pdf',
      title: 'Partnership PDF',
      description:
        'Download the current DCC Miami x Edge Zones proposal packet. This PDF outlines the partnership framework, exhibition concept, DCC support model, larger vision, artist cluster, and network index.',
      note: 'This proposal packet may be updated as roles, deliverables, dates, and artist materials are confirmed.',
    },
    join: {
      id: 'join',
      title: 'Join the DCC x Edge Zones updates list',
      intro:
        'Receive updates about Touching Grass, the artist index, public program, documentation archive, and future DCC Miami programming.',
      formIntro:
        'Share your contact information to receive updates and future opportunities connected to DCC Miami, Edge Zones, and Miami’s digital art ecosystem.',
      signupHref:
        '/network/signup?source=edgezones&utm_source=edgezones&utm_medium=proposal&utm_campaign=dcc_edgezones_launch&utm_content=partnership_pdf&qr=dcc_edgezones_main',
      signupLabel: 'Join updates',
      suggestHref: '/network/signup?pathway=research&source=edgezones',
      suggestLabel: 'Suggest someone for the Research View',
    },
  },
  footer: {
    blurb:
      'DCC Miami is a new digital culture platform supporting digital art in Miami through artist visibility, public programming, digital publishing, documentation, workshops, and online infrastructure.',
    credit: 'Presented at Edge Zones. Curated by Jordan Horton. Digital platform and public programming support by DCC Miami.',
  },
  exhibition: {
    workingTitle: TOUCHING_GRASS_EXHIBITION.workingTitle,
    curator: TOUCHING_GRASS_EXHIBITION.curator,
    location: TOUCHING_GRASS_EXHIBITION.location,
    dates: TOUCHING_GRASS_EXHIBITION.dates,
    artistNames: TOUCHING_GRASS_EXHIBITION.artistNames,
  },
} as const

export const edgeZonesNavAnchors = [
  { id: 'overview', label: 'Overview' },
  { id: 'roles', label: 'Roles' },
  { id: 'concept', label: 'Concept' },
  { id: 'artists', label: 'Artists' },
  { id: 'support', label: 'DCC Support' },
  { id: 'programs', label: 'Programs' },
  { id: 'archive', label: 'Archive' },
  { id: 'pdf', label: 'PDF' },
  { id: 'join', label: 'Join' },
] as const

export function edgeZonesModuleStatusLabel(status: EdgeZonesModuleStatus): string {
  switch (status) {
    case 'live':
      return 'LIVE'
    case 'in-development':
      return 'IN DEVELOPMENT'
    case 'materials-needed':
      return 'MATERIALS NEEDED'
    case 'coming-soon':
      return 'COMING SOON'
  }
}

export function edgeZonesModuleStatusClass(status: EdgeZonesModuleStatus): string {
  switch (status) {
    case 'live':
      return 'ez-status-live'
    case 'in-development':
      return 'ez-status-dev'
    case 'materials-needed':
      return 'ez-status-materials'
    case 'coming-soon':
      return 'ez-status-soon'
  }
}

/** Proposal-phase attribution defaults (PDF QR + join funnel). */
export const edgeZonesProposalAttribution = {
  signupSource: 'edgezones',
  utmSource: 'edgezones',
  utmMedium: 'proposal',
  utmCampaign: 'dcc_edgezones_launch',
  utmContent: 'partnership_pdf',
  qrCodeId: 'dcc_edgezones_main',
} as const
