import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'

const CLOUDINARY = 'https://res.cloudinary.com/dkod1at3i/image/upload'

/** Public capital campaign page on oolitearts.org */
export const OOLITE_CAPITAL_CAMPAIGN_URL = 'https://oolitearts.org/our-new-home/' as const

export const OOLITE_CAPITAL_DEVELOPMENT_CONTACT = {
  name: 'Megan Braasch',
  title: 'Chief Development Officer',
  email: 'mbraasch@oolitearts.org',
} as const

export type CapitalCampaignTopicKey =
  | 'overview'
  | 'architects'
  | 'campus_features'
  | 'timeline'
  | 'public_access'
  | 'education'
  | 'partnerships_history'

export type CapitalCampaignTopic = {
  key: CapitalCampaignTopicKey
  spokenAnswer: string
  matchAliases: string[]
}

export type CapitalCampaignShowcase = {
  key: string
  title: string
  location: string
  spokenAnswer: string
  displayAnswer: string
  followUps: string[]
  galleryImages: MemoryAgentGalleryImage[]
  campaignUrl: string
  topics: CapitalCampaignTopic[]
}

const GALLERY: MemoryAgentGalleryImage[] = [
  {
    url: `${CLOUDINARY}/v1781623326/oolite-arts-new-campus-Copy-of-20211022_AMICON_OA_V1_5400px_-1500x1125_zsjt6v.jpg`,
    title: 'Little River campus',
    subtitle: 'Architectural rendering · Barozzi Veiga',
  },
  {
    url: `${CLOUDINARY}/v1781623326/oolite-arts-new-campus-20220315_AMICON_OA_V4_5400px_02-1500x957_urvqlc.jpg`,
    title: 'Campus aerial view',
    subtitle: 'Oolite Arts · Little River, Miami',
  },
  {
    url: `${CLOUDINARY}/v1781623326/oolite-arts-new-campus-Copy-of-210226_p18-rendering-705x670_m0lfpd.jpg`,
    title: 'Village of artists',
    subtitle: 'Solar chimneys and wind catchers',
  },
]

const DISPLAY_ANSWER = `Our New Home — Capital Project · Little River, Miami

Project overview & cultural impact
• A 26,850-square-foot campus in Little River on 1.3 acres, designed by internationally acclaimed Barcelona firm Barozzi Veiga — a landmark moment for Miami's growing cultural scene.
• Conceived as a "village" of artists: a cluster of buildings unified by towers that double as solar chimneys and wind catchers.
• Designed to be LEED certified, with native landscaping and energy-saving systems built to serve generations of Miamians.

The project
• Updated drawings have been submitted to the City of Miami. Permitting is underway, with groundbreaking expected later this year.
• Requests for Proposals (RFPs) have been sent to five contractors; bids are expected before the end of July.
• Two exhibition spaces — one dedicated gallery and one flexible space for installations, exhibitions, events, and more.
• 24 artist studios of varying sizes — from screen-based digital work to large, light-filled studios for painting and sculpture.
• Fabrication space continues Oolite Arts' tradition of free access to high-quality, rarely available equipment.
• Dedicated classroom space for education programming.
• Administrative offices with flexible open space and private rooms.
• Accessible rooftop for events.

Public access & community
• The campus marries private and public — reflective artist studios alongside bright, welcoming spaces for community gathering and learning.
• Public-facing amenities include exhibition areas, a courtyard, a rooftop reception area, classrooms, and fabrication space.
• Sited for accessibility from multiple points in the city and close to other arts organizations where many artists live and work.

Educational role
• Classrooms designed to host 400+ art classes each year for adults and youth.
• Fabrication space for hands-on experimentation and flexible space for lectures, film programs, and public conversations.
• Continues and expands Oolite Arts' role as a hub for skill-building, residencies, and cross-disciplinary learning.

Partnerships
• Design architect: Barozzi Veiga (Barcelona) — principals Fabrizio Barozzi and Alberto Veiga. Cultural portfolio includes the Art Institute of Chicago master plan and building expansion, Szczecin Philharmonic Hall, MCBA Fine Arts Museum in Lausanne, and more. Currently John C. Portman Design Critics in Architecture at the Harvard Graduate School of Design.
• Barozzi Veiga's Art Institute of Chicago commission marks a landmark in contemporary cultural architecture.
• Local architect of record: Charles Benson.

History & process
• Began with a foundational programmatic document by architect Rene Gonzalez, incorporating input from Oolite Arts leadership.
• Reed Kroloff, Dean of Architecture at the Illinois Institute of Technology, prepared a program summary guiding RFIs to a global architect pool — leading to Barozzi Veiga with Charles Benson.
• Design fueled by dialogue between Barozzi Veiga and Oolite Arts through staff and the Facilities Committee, with Board approval at each phase.
• At 95% completion, an extensive value-engineering process with contractor, engineer, architect, and peer reviews aligned construction with budget.
• Community input through early artist and staff dialogue, consultant Clayton Campbell's interviews with staff, artists, and board members, and interior layout adjustments in early 2025 from staff and artist feedback.

Learn more & support: ${OOLITE_CAPITAL_CAMPAIGN_URL}
Philanthropic investment: ${OOLITE_CAPITAL_DEVELOPMENT_CONTACT.name}, ${OOLITE_CAPITAL_DEVELOPMENT_CONTACT.title} · ${OOLITE_CAPITAL_DEVELOPMENT_CONTACT.email}`

export const CAPITAL_CAMPAIGN_SHOWCASE: CapitalCampaignShowcase = {
  key: 'capital_campaign_little_river',
  title: 'Our New Home — Little River Campus',
  location: 'Little River, Miami',
  spokenAnswer:
    'Oolite Arts is building a 26,850-square-foot campus in Little River, designed by Barozzi Veiga as a village of artists with LEED-targeted sustainability, 24 studios, fabrication space, classrooms for 400+ annual classes, and public exhibition areas. Permitting is underway with groundbreaking expected later this year.',
  displayAnswer: DISPLAY_ANSWER,
  followUps: [
    'Who designed the new Oolite Arts campus?',
    'What will the Little River campus include?',
    'What is the timeline for the capital project?',
    'How will the public access the new campus?',
    'What is Oolite\'s educational role at the new campus?',
  ],
  galleryImages: GALLERY,
  campaignUrl: OOLITE_CAPITAL_CAMPAIGN_URL,
  topics: [
    {
      key: 'overview',
      spokenAnswer:
        'Our New Home is Oolite Arts\' capital project in Little River: a 26,850-square-foot, 1.3-acre campus designed as an artist village by Barozzi Veiga, targeting LEED certification with native landscaping and energy-saving systems.',
      matchAliases: [
        'capital campaign',
        'capital project',
        'new home',
        'new campus',
        'little river campus',
        'little river',
        'our new home',
        'building miami',
        'world-class campus',
      ],
    },
    {
      key: 'architects',
      spokenAnswer:
        'Barozzi Veiga of Barcelona designed the campus — principals Fabrizio Barozzi and Alberto Veiga, known for the Art Institute of Chicago expansion, Szczecin Philharmonic Hall, and MCBA Lausanne. Charles Benson is architect of record in Miami. The process began with Rene Gonzalez\'s programmatic document and Reed Kroloff\'s RFIs.',
      matchAliases: [
        'barozzi',
        'veiga',
        'who designed',
        'architect',
        'architecture firm',
        'charles benson',
        'rene gonzalez',
        'reed kroloff',
      ],
    },
    {
      key: 'campus_features',
      spokenAnswer:
        'The campus includes 24 artist studios, two exhibition spaces, fabrication space with free equipment access, classrooms, admin offices, and an accessible event rooftop — unified by towers serving as solar chimneys and wind catchers.',
      matchAliases: [
        'what will the campus include',
        'what is included',
        'studios',
        'fabrication',
        'exhibition space',
        'rooftop',
        'leed',
        'solar chimney',
        'wind catcher',
        'village of artists',
      ],
    },
    {
      key: 'timeline',
      spokenAnswer:
        'Updated drawings are submitted to the City of Miami and permitting is underway. RFPs went to five contractors with bids expected before end of July. Groundbreaking is expected later this year.',
      matchAliases: [
        'timeline',
        'permitting',
        'groundbreaking',
        'construction',
        'rfp',
        'contractor',
        'when will it open',
        'status of the project',
      ],
    },
    {
      key: 'public_access',
      spokenAnswer:
        'The campus balances private studios with public-facing exhibition areas, a courtyard, rooftop reception, classrooms, and fabrication space — accessible from multiple points in the city near other arts organizations.',
      matchAliases: [
        'public access',
        'community',
        'public-facing',
        'courtyard',
        'who can visit',
        'open to the public',
      ],
    },
    {
      key: 'education',
      spokenAnswer:
        'Classrooms are designed for 400+ art classes per year for adults and youth, plus fabrication for hands-on learning and flexible space for lectures, film programs, and public conversations.',
      matchAliases: [
        'educational role',
        'education',
        'art classes',
        '400 classes',
        'youth classes',
        'lectures',
        'film programs',
      ],
    },
    {
      key: 'partnerships_history',
      spokenAnswer:
        'The design evolved through Facilities Committee dialogue, Board approvals, value engineering at 95% design, and community input including Clayton Campbell\'s interviews and 2025 interior layout refinements from staff and artists.',
      matchAliases: [
        'partnerships',
        'history',
        'process',
        'value engineering',
        'clayton campbell',
        'facilities committee',
        'board approval',
        'community input',
      ],
    },
  ],
}

const CAPITAL_QUESTION_RE =
  /\b(capital\s+(?:campaign|project)|new\s+(?:home|campus)|little\s+river(?:\s+campus)?|our\s+new\s+home|barozzi\s+veiga|groundbreaking|26[,.]?850\s*(?:sq(?:uare)?)?\s*feet?)\b/i

export function isCapitalCampaignQuestion(question: string): boolean {
  return CAPITAL_QUESTION_RE.test(question.trim())
}

export function matchCapitalCampaignTopic(
  question: string
): CapitalCampaignTopic | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  for (const topic of CAPITAL_CAMPAIGN_SHOWCASE.topics) {
    if (topic.matchAliases.some((alias) => key.includes(alias) || alias.includes(key))) {
      return topic
    }
  }
  return undefined
}

export function matchCapitalCampaignQuestion(
  question: string
): { showcase: CapitalCampaignShowcase; topic?: CapitalCampaignTopic } | undefined {
  const key = normalizeSuggestedQuestionKey(question)

  const exactChips = [
    'tell me about oolite\'s new campus in little river',
    'tell me about the capital campaign',
    'who designed the new oolite arts campus',
    'what will the little river campus include',
    'what is the timeline for the capital project',
    'how will the public access the new campus',
    'what is oolite\'s educational role at the new campus',
  ]
  if (exactChips.includes(key)) {
    return { showcase: CAPITAL_CAMPAIGN_SHOWCASE, topic: matchCapitalCampaignTopic(question) }
  }

  if (
    key.includes('capital campaign') ||
    key.includes('capital project') ||
    key.includes('new campus') ||
    key.includes('new home') ||
    key.includes('little river')
  ) {
    return { showcase: CAPITAL_CAMPAIGN_SHOWCASE, topic: matchCapitalCampaignTopic(question) }
  }

  const topic = matchCapitalCampaignTopic(question)
  if (topic) {
    return { showcase: CAPITAL_CAMPAIGN_SHOWCASE, topic }
  }

  if (isCapitalCampaignQuestion(question)) {
    return { showcase: CAPITAL_CAMPAIGN_SHOWCASE }
  }

  return undefined
}

export function resolveCapitalCampaignSpokenAnswer(
  question: string
): string {
  const match = matchCapitalCampaignQuestion(question)
  if (!match) return CAPITAL_CAMPAIGN_SHOWCASE.spokenAnswer
  return match.topic?.spokenAnswer ?? match.showcase.spokenAnswer
}

export const CAPITAL_CAMPAIGN_SUGGESTED_QUESTIONS = [
  "Tell me about Oolite's new campus in Little River.",
  'Who designed the new Oolite Arts campus?',
  'What will the Little River campus include?',
  'What is the timeline for the capital project?',
] as const
