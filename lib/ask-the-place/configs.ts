import type { GraphLink, GraphNode, OutputBundle, ProspectConfig } from './types'

const accent = {
  champagne: { ring: 'ring-amber-200/30', text: 'text-amber-100/90', bg: 'bg-amber-500/10' },
  gold: { ring: 'ring-yellow-200/25', text: 'text-yellow-100/85', bg: 'bg-yellow-500/10' },
  teal: { ring: 'ring-teal-300/30', text: 'text-teal-100/90', bg: 'bg-teal-500/10' },
  violet: { ring: 'ring-violet-300/30', text: 'text-violet-100/90', bg: 'bg-violet-500/10' },
} as const

export function prospectAccentClasses(token: ProspectConfig['accentToken']) {
  return accent[token] ?? accent.champagne
}

/** Default graph topology: center place + satellites (IDs stable per scenario highlighting). */
export function defaultGraphNodes(vertical: ProspectConfig['vertical']): GraphNode[] {
  const placeId = 'node-place'
  const base: GraphNode[] = [
    { id: placeId, label: 'Place', category: 'place', x: 50, y: 48 },
    { id: 'node-events', label: 'Events', category: 'events', x: 22, y: 22 },
    { id: 'node-spaces', label: 'Spaces', category: 'spaces', x: 78, y: 24 },
    { id: 'node-art', label: 'Art & Stories', category: 'art', x: 18, y: 72 },
    { id: 'node-partners', label: 'Local Partners', category: 'partners', x: 82, y: 70 },
    { id: 'node-people', label: 'People', category: 'people', x: 50, y: 12 },
    { id: 'node-amenities', label: 'Amenities', category: 'amenities', x: 12, y: 48 },
    { id: 'node-insights', label: 'Insights', category: 'insights', x: 88, y: 48 },
  ]
  if (vertical === 'club') {
    return base.map((n) =>
      n.id === 'node-people' ? { ...n, label: 'Members' } : n
    )
  }
  return base
}

export function defaultGraphLinks(): GraphLink[] {
  return [
    { id: 'l1', source: 'node-place', target: 'node-events' },
    { id: 'l2', source: 'node-place', target: 'node-spaces' },
    { id: 'l3', source: 'node-place', target: 'node-art' },
    { id: 'l4', source: 'node-place', target: 'node-partners' },
    { id: 'l5', source: 'node-place', target: 'node-people' },
    { id: 'l6', source: 'node-place', target: 'node-amenities' },
    { id: 'l7', source: 'node-place', target: 'node-insights' },
  ]
}

function bundle(partial: Omit<OutputBundle, 'scenarioId'> & { scenarioId: string }): OutputBundle {
  return partial
}

const HOTEL_PRIMARY =
  'What should a guest do tonight if they love contemporary art, architecture, and natural wine?'
const CLUB_PRIMARY =
  'Who should a new member meet this week if they care about AI, collecting, and Miami architecture?'
const RESIDENCE_PRIMARY = 'What is happening in the building this week?'

const hotelTonight: OutputBundle = bundle({
  scenarioId: 'hotel-tonight',
  answerSummary:
    'Connects lobby media, a nearby gallery opening, and a natural-wine dinner partner into one coherent evening.',
  highlightNodeIds: ['node-place', 'node-events', 'node-art', 'node-partners'],
  publicRecommendation:
    'Start with the lobby digital media installation, continue to a nearby gallery opening, then finish with a natural wine dinner at our partner restaurant.',
  staffBrief:
    'Guest prefers quiet cultural experiences, design, and dining. Recommend the 6:30 gallery route and hold the 8:15 dinner option. Note: VIP car available.',
  leadershipInsight:
    'This path ties owned programming to two local partners and opens an upsell through dining and concierge—strong for ADR and NPS storytelling.',
  signage: {
    screenTitle: 'Tonight at the property',
    headline: 'Art · Architecture · Wine',
    body: 'Lobby installation → Gallery walk → Partner dinner',
    cta: 'Scan for your itinerary',
  },
  itinerary: [
    { id: 'i1', time: '18:00', label: 'Lobby digital installation', detail: 'Main lobby' },
    { id: 'i2', time: '19:30', label: 'Gallery opening', detail: 'Partner venue — 6 min' },
    { id: 'i3', time: '20:15', label: 'Natural wine dinner', detail: 'Partner restaurant' },
  ],
  nextActions: [
    'Reserve partner table for 8:15',
    'Update lobby screen playlist',
    'Add guest preferences to CRM stub',
  ],
})

const hotelVip: OutputBundle = bundle({
  scenarioId: 'hotel-vip',
  answerSummary: 'VIP cultural route with wellness pause and private concierge touchpoints.',
  highlightNodeIds: ['node-place', 'node-amenities', 'node-events', 'node-spaces'],
  publicRecommendation:
    'A VIP itinerary: private wellness moment, curator-led art moment, and a reserved salon for drinks—paced for ease.',
  staffBrief:
    'Assign concierge shadow from 17:00. Confirm spa suite and salon keys. Prepare talking points on the new commission.',
  leadershipInsight:
    'VIP itineraries correlate with repeat stays when paired with partner venues—track conversion on partner codes.',
  signage: {
    screenTitle: 'VIP Cultural Route',
    headline: 'Wellness · Art · Salon',
    body: 'Tonight’s curated sequence for invited guests',
    cta: 'Concierge: tap for brief',
  },
  itinerary: [
    { id: 'i1', time: '17:00', label: 'Wellness suite', detail: 'Spa level' },
    { id: 'i2', time: '18:30', label: 'Curator moment', detail: 'Gallery corridor' },
    { id: 'i3', time: '20:00', label: 'Private salon', detail: 'Rooftop pavilion' },
  ],
  nextActions: ['Brief security for rooftop', 'Print partner thank-you cards'],
})

const clubMeet: OutputBundle = bundle({
  scenarioId: 'club-meet',
  answerSummary: 'Introductions aligned to AI, collecting, and Miami architecture interests.',
  highlightNodeIds: ['node-place', 'node-people', 'node-events', 'node-art'],
  publicRecommendation:
    'Attend the AI & Culture dinner and request introductions to two members active in collecting and design.',
  staffBrief:
    'Prepare intro notes; invite to Thursday salon. Flag member hosts who recently acquired architectural photography.',
  leadershipInsight:
    'New member engagement: connect interests to programming within the first 14 days—strong retention signal.',
  signage: {
    screenTitle: 'Member introductions',
    headline: 'This week: AI · Collecting · Architecture',
    body: 'Salon Thursday · Hosts on standby',
    cta: 'Scan to RSVP',
  },
  itinerary: [
    { id: 'i1', time: 'Wed', label: 'AI & Culture dinner', detail: 'Private dining' },
    { id: 'i2', time: 'Thu', label: 'Member salon', detail: 'Library' },
  ],
  nextActions: ['Send host bios to member services', 'Add to weekly digest'],
})

const residenceWeek: OutputBundle = bundle({
  scenarioId: 'residence-week',
  answerSummary: 'Building programming for the week—wellness, lobby art talk, rooftop social.',
  highlightNodeIds: ['node-place', 'node-events', 'node-spaces', 'node-amenities'],
  publicRecommendation:
    'Three resident experiences: wellness class, lobby artwork talk, and rooftop social—each under an hour.',
  staffBrief:
    'Update lobby signage by 10:00; send resident reminder push. Confirm AV for art talk.',
  leadershipInsight:
    'Engagement clusters around wellness and cultural programming—consider a seasonal series sponsor.',
  signage: {
    screenTitle: 'This week in the building',
    headline: 'Wellness · Art talk · Rooftop',
    body: 'Reserve spots in the resident app',
    cta: 'Scan for schedule',
  },
  itinerary: [
    { id: 'i1', time: 'Tue 07:30', label: 'Wellness class', detail: 'Studio B' },
    { id: 'i2', time: 'Thu 18:00', label: 'Lobby art talk', detail: 'Main lobby' },
    { id: 'i3', time: 'Fri 19:30', label: 'Rooftop social', detail: 'Pool deck' },
  ],
  nextActions: ['Order refreshments for Friday', 'Photography for social proof'],
})

export const PROSPECT_CONFIGS: Record<string, ProspectConfig> = {
  'hotel/faena': {
    prospectName: 'Faena Miami Beach',
    vertical: 'hotel',
    verticalLabel: 'Luxury Hotel',
    productName: 'Cultural Concierge',
    routeSlug: 'hotel/faena',
    tagline:
      'Turn art, dining, wellness, events, and local culture into a living guest experience.',
    primaryQuestion: HOTEL_PRIMARY,
    city: 'Miami Beach, FL',
    description:
      'Oceanfront luxury with strong programming in art, performance, and culinary partnerships.',
    accentToken: 'champagne',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Art', 'Events', 'Dining', 'Wellness', 'Spaces', 'Local Partners', 'Stories'],
    sampleQuestions: [
      { id: 'hotel-tonight', chip: 'Tonight for art & wine', label: HOTEL_PRIMARY },
      { id: 'hotel-vip', chip: 'VIP itinerary', label: 'Create a VIP itinerary for art, wellness, and food.' },
    ],
    outputs: {
      publicLabel: 'Guest Recommendation',
      staffLabel: 'Concierge Brief',
      leadershipLabel: 'Experience Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: {
      'hotel-tonight': hotelTonight,
      'hotel-vip': hotelVip,
    },
    dataCategories: [
      { id: 'events', label: 'Events', count: 24 },
      { id: 'spaces', label: 'Spaces', count: 18 },
      { id: 'partners', label: 'Partners', count: 32 },
      { id: 'stories', label: 'Stories', count: 41 },
    ],
  },
  'club/soho-house': {
    prospectName: 'Soho House (demo)',
    vertical: 'club',
    verticalLabel: 'Private Members Club',
    productName: 'Member Culture Graph',
    routeSlug: 'club/soho-house',
    tagline: 'Who to meet, what to attend, and how programming reinforces belonging.',
    primaryQuestion: CLUB_PRIMARY,
    city: 'Miami, FL',
    description: 'Programming-led member graph with salons, dinners, and studio visits.',
    accentToken: 'violet',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Members', 'Events', 'Spaces', 'Partners', 'Salons'],
    sampleQuestions: [
      { id: 'club-meet', chip: 'Introductions this week', label: CLUB_PRIMARY },
    ],
    outputs: {
      publicLabel: 'Member Recommendation',
      staffLabel: 'Membership Brief',
      leadershipLabel: 'Engagement Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: { 'club-meet': clubMeet },
    dataCategories: [
      { id: 'members', label: 'Members', count: 1200 },
      { id: 'events', label: 'Events', count: 56 },
      { id: 'spaces', label: 'Spaces', count: 22 },
    ],
  },
  'residence/related-group': {
    prospectName: 'Related Group (demo residence)',
    vertical: 'residence',
    verticalLabel: 'Branded Residence',
    productName: 'Living Building Agent',
    routeSlug: 'residence/related-group',
    tagline: 'What is happening in the building—and why it matters for residents and sales.',
    primaryQuestion: RESIDENCE_PRIMARY,
    city: 'Miami, FL',
    description: 'Residential tower with curated cultural amenities and partner programming.',
    accentToken: 'teal',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Residents', 'Amenities', 'Events', 'Art', 'Services'],
    sampleQuestions: [
      { id: 'residence-week', chip: 'This week in the building', label: RESIDENCE_PRIMARY },
    ],
    outputs: {
      publicLabel: 'Resident Experience',
      staffLabel: 'Building Ops Brief',
      leadershipLabel: 'Experience Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: { 'residence-week': residenceWeek },
    dataCategories: [
      { id: 'events', label: 'Events', count: 9 },
      { id: 'amenities', label: 'Amenities', count: 14 },
      { id: 'services', label: 'Services', count: 11 },
    ],
  },
  'district/miami-design-district': {
    prospectName: 'Miami Design District',
    vertical: 'district',
    verticalLabel: 'Cultural District',
    productName: 'District Intelligence Layer',
    routeSlug: 'district/miami-design-district',
    tagline: 'Wayfinding, placemaking, and visitor flow across retail, culture, and public art.',
    primaryQuestion: 'What should a visitor explore today?',
    city: 'Miami, FL',
    description: 'High-density cultural retail district with public art and flagship programming.',
    accentToken: 'gold',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Places', 'Dining', 'Culture', 'Shopping', 'Events'],
    sampleQuestions: [
      {
        id: 'district-explore',
        chip: 'Explore today',
        label: 'What should a visitor explore today?',
      },
    ],
    outputs: {
      publicLabel: 'Visitor Route',
      staffLabel: 'District Ops Brief',
      leadershipLabel: 'Placemaking Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: {
      'district-explore': bundle({
        scenarioId: 'district-explore',
        answerSummary: 'Public art → design shop → gallery → lunch partner.',
        highlightNodeIds: ['node-place', 'node-art', 'node-partners', 'node-events'],
        publicRecommendation:
          'A suggested route: public art installation, flagship design shop, gallery show, then lunch at a partner restaurant.',
        staffBrief: 'Promote cultural route on district screens; update map pins for the new mural.',
        leadershipInsight:
          'Cross-venue itineraries increase dwell time—measure partner attribution on weekend traffic.',
        signage: {
          screenTitle: 'Explore the District',
          headline: 'Art · Design · Taste',
          body: 'Today’s curated walk — 90 minutes',
          cta: 'Scan for map + offers',
        },
        itinerary: [
          { id: 'i1', time: '11:00', label: 'Public art walk', detail: 'Palm Court' },
          { id: 'i2', time: '12:00', label: 'Gallery + retail', detail: 'Flagship row' },
          { id: 'i3', time: '13:30', label: 'Partner lunch', detail: 'Courtyard' },
        ],
        nextActions: ['Sync partner offers to QR', 'Update district CMS stub'],
      }),
    },
    dataCategories: [
      { id: 'venues', label: 'Venues', count: 84 },
      { id: 'events', label: 'Events', count: 18 },
      { id: 'art', label: 'Public Art', count: 36 },
    ],
  },
  'institution/pamm': {
    prospectName: 'Pérez Art Museum Miami (demo)',
    vertical: 'institution',
    verticalLabel: 'Museum / Institution',
    productName: 'Living Institution',
    routeSlug: 'institution/pamm',
    tagline: 'Visitor discovery, program visibility, and institutional memory in one layer.',
    primaryQuestion: 'What should visitors see today?',
    city: 'Miami, FL',
    description: 'Waterfront museum with changing exhibitions, talks, and education programs.',
    accentToken: 'teal',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Exhibitions', 'Events', 'Education', 'Collection', 'Spaces'],
    sampleQuestions: [
      { id: 'institution-today', chip: 'Today for visitors', label: 'What should visitors see today?' },
    ],
    outputs: {
      publicLabel: 'Visitor Path',
      staffLabel: 'Front-of-house Brief',
      leadershipLabel: 'Program Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: {
      'institution-today': bundle({
        scenarioId: 'institution-today',
        answerSummary: 'Featured exhibition, artist talk, archive highlight.',
        highlightNodeIds: ['node-place', 'node-events', 'node-art', 'node-spaces'],
        publicRecommendation:
          'Start with the featured exhibition, catch the afternoon artist talk, then explore the archive highlight in the reading room.',
        staffBrief: 'Missing hero image for one talk—update signage by noon. Volunteer roster confirmed.',
        leadershipInsight:
          'Three programs ladder to local artists and education outcomes—strong grant narrative bundle.',
        signage: {
          screenTitle: 'Today at the museum',
          headline: 'Exhibition · Talk · Archive',
          body: 'Start on Level 2',
          cta: 'Scan for audio guide',
        },
        itinerary: [
          { id: 'i1', time: '10:00', label: 'Featured exhibition', detail: 'Level 2' },
          { id: 'i2', time: '14:00', label: 'Artist talk', detail: 'Auditorium' },
          { id: 'i3', time: '15:30', label: 'Archive highlight', detail: 'Reading room' },
        ],
        nextActions: ['Upload missing image', 'Export attendance stub'],
      }),
    },
    dataCategories: [
      { id: 'exhibitions', label: 'Exhibitions', count: 8 },
      { id: 'events', label: 'Events', count: 15 },
      { id: 'education', label: 'Education', count: 22 },
    ],
  },
  'collection/private-collection': {
    prospectName: 'Private Collection (demo)',
    vertical: 'collection',
    verticalLabel: 'Private Collection',
    productName: 'Collection Intelligence',
    routeSlug: 'collection/private-collection',
    tagline: 'Provenance-aware narratives for tours, catalogs, and research workflows.',
    primaryQuestion: 'What stories are hidden in this collection?',
    city: 'Confidential',
    description: 'High-touch private collection with research and loan workflows.',
    accentToken: 'champagne',
    modes: ['public', 'staff', 'leadership'],
    nodeTypes: ['Objects', 'Provenance', 'Loans', 'Research', 'Narratives'],
    sampleQuestions: [
      {
        id: 'collection-stories',
        chip: 'Hidden stories',
        label: 'What stories are hidden in this collection?',
      },
    ],
    outputs: {
      publicLabel: 'Collection Narrative',
      staffLabel: 'Research Brief',
      leadershipLabel: 'Strategic Insight',
    },
    pilotName: '6-Week Cultural Intelligence Concierge Pilot',
    scenarios: {
      'collection-stories': bundle({
        scenarioId: 'collection-stories',
        answerSummary: 'Three works linked through migration, material culture, and modern identity.',
        highlightNodeIds: ['node-place', 'node-art', 'node-insights', 'node-partners'],
        publicRecommendation:
          'Three works connect through migration, material culture, and modern identity—ideal for a private tour chapter.',
        staffBrief: 'Prepare research packet and provenance notes for the curator visit.',
        leadershipInsight:
          'Narrative cluster supports private tour, catalog chapter, and exhibition loan proposal.',
        signage: {
          screenTitle: 'Private tour — tonight',
          headline: 'Stories in the collection',
          body: 'Migration · Material culture · Identity',
          cta: 'Scan for curator notes (guest)',
        },
        itinerary: [
          { id: 'i1', time: '18:00', label: 'Salon viewing', detail: 'Gallery A' },
          { id: 'i2', time: '19:00', label: 'Research corner', detail: 'Library' },
        ],
        nextActions: ['Redact loan-sensitive fields', 'Schedule conservator review'],
      }),
    },
    dataCategories: [
      { id: 'objects', label: 'Objects', count: 240 },
      { id: 'loans', label: 'Loans', count: 12 },
      { id: 'research', label: 'Research', count: 38 },
    ],
  },
}

export const LANDING_VERTICALS: {
  slug: string
  title: string
  blurb: string
  accent: ProspectConfig['accentToken']
}[] = [
  {
    slug: 'hotel/faena',
    title: 'Ask the Hotel',
    blurb: 'Guest experience, concierge, lobby intelligence.',
    accent: 'champagne',
  },
  {
    slug: 'club/soho-house',
    title: 'Ask the Club',
    blurb: 'Member graph, introductions, programming.',
    accent: 'violet',
  },
  {
    slug: 'residence/related-group',
    title: 'Ask the Building',
    blurb: 'Resident rhythm, amenities, building memory.',
    accent: 'teal',
  },
  {
    slug: 'district/miami-design-district',
    title: 'Ask the District',
    blurb: 'Visitor routes, partners, placemaking.',
    accent: 'gold',
  },
  {
    slug: 'institution/pamm',
    title: 'Ask the Institution',
    blurb: 'Visitor paths, operations, reporting.',
    accent: 'teal',
  },
  {
    slug: 'collection/private-collection',
    title: 'Ask the Collection',
    blurb: 'Provenance, research, private narratives.',
    accent: 'champagne',
  },
]

export function getProspectConfig(vertical: string, prospect: string): ProspectConfig | null {
  const key = `${vertical}/${prospect}`
  return PROSPECT_CONFIGS[key] ?? null
}

export function getScenarioBundle(config: ProspectConfig, scenarioId: string) {
  return config.scenarios[scenarioId] ?? null
}
