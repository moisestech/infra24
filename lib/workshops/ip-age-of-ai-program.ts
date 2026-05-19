import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'

export const IP_AGE_OF_AI_WORKSHOP_SLUG = 'ip-age-of-ai'

export function isIpAgeOfAiWorkshopSlug(segment: string | undefined | null): boolean {
  if (!segment?.trim()) return false
  return canonicalWorkshopMarketingSlug(segment.trim()) === IP_AGE_OF_AI_WORKSHOP_SLUG
}

/** Knight Foundation logotype (stacked wordmark + icon). */
export const KNIGHT_FOUNDATION_LOGO_SRC =
  'https://res.cloudinary.com/dck5rzi4h/image/upload/v1777511397/dccmiami/logo/KF_Logotype_Icon-and-Stacked-Name_ctders.webp'

export type IpAgeOfAiParticipant = {
  id: string
  role: string
  order: number
  name: string
  /** One-line title under the name on instructor cards */
  tagline: string
  /** Professional headshot — add Cloudinary/public URLs when ready */
  headshotUrl?: string
  /** LinkedIn profile URL — omit until confirmed */
  linkedInUrl?: string
  bioParagraphs: string[]
}

export const ipAgeOfAiProgramTitle = 'Skills: Intellectual Property in the Age of AI'

export const ipAgeOfAiCollaboratorsLine =
  'Produced in collaboration with the FIU Ratcliffe Art + Design Incubator (RA+DI).'

export const ipAgeOfAiLeadParagraphs = [
  "Miami's creative economy continues to grow across design, fashion, digital fabrication, architecture, cultural production, and AI-assisted art. As this landscape expands, students require early exposure to intellectual property fundamentals.",
  'This talk will demystify copyright, trademark, licensing, contract negotiation, and the legal dimensions of creative practice. The event aligns with a shared mission to support entrepreneurial development and advance student-driven innovation. Legal literacy empowers young creators to safeguard their work, advocate for themselves, and navigate the complexities of creative economies with confidence.',
]

/** Intro line above instructor cards (Udacity-style program instructors). */
export const ipAgeOfAiProgramInstructorsIntro =
  'Unlike a typical lecture-only format, this program brings together practicing attorneys and a moderator who work at the intersection of law, creative practice, and institutional support—so you hear how concepts show up in real studios, contracts, and platforms.'

/** Curated skill tags for marketing / syllabus (educational framing, not legal advice). */
export const ipAgeOfAiSkillsYoullLearnTags: string[] = [
  'Copyright & fixation basics',
  'Human authorship & AI outputs',
  'Fair use — what courts debate',
  'Training data & unsettled law',
  'DMCA & platform takedowns',
  'Demand letters & escalation paths',
  'Contracts & AI clauses',
  'Rights of publicity & likeness',
  'Licensing vocabulary',
  'Derivative works & ownership',
  'Evidence & documentation habits',
  'Strategic “pick your battles” triage',
  'Community & PR alongside legal steps',
  'Registration & enforcement options',
  'International patchwork awareness',
  'Metadata & anti-scraping hygiene',
  'Negotiation with clients & collectors',
  'Arbitration vs litigation mindset',
  'Governing law & venue strategy',
  'Volunteer lawyers & clinics',
]

export const IP_AGE_OF_AI_HEADSHOTS = {
  somaraJacques:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1778264607/oolite-ip-and-ai-somara-jacque-esq-skills-may8th_ep1paw.webp',
  andrejMilic:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1778267042/oolite-ip-and-ai-andrej-milic-esq-skills-may8th_yjmwg0.webp',
  dimitrySaidChamy:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1778264606/oolite-ip-and-ai-dimitry-said-chamy-skills-may8th_an5h9f.webp',
} as const

export const ipAgeOfAiParticipants: IpAgeOfAiParticipant[] = [
  {
    id: 'somara-jacques',
    role: 'Speaker',
    order: 1,
    name: 'Somara Jacques, Esq.',
    tagline: 'Founder, Latte Legal PLLC · IP & creative business counsel',
    headshotUrl: IP_AGE_OF_AI_HEADSHOTS.somaraJacques,
    bioParagraphs: [
      'Somara Jacques, Esq., is an attorney deeply passionate about the intersection of law and creativity. The founder of Latte Legal PLLC assists creative entrepreneurs in protecting and enhancing their businesses through intellectual property protection and registration, including copyrights and trademarks.',
      'With a background in intellectual property law and a keen understanding of the challenges facing artists, writers, musicians, and other creatives, Somara Jacques is committed to providing comprehensive legal guidance tailored to their unique needs. While concentrating on the intersection of copyright, trademark, business, and technology law, Latte Legal also offers strategic counsel on issues such as licensing agreements, fair use, digital asset management, legal strategy to reduce liability, infringement disputes, contract drafting, negotiation, business compliance, dispute resolution, and AI integration.',
      'Believing that creatives should be knowledgeable about entertainment and business law, Somara Jacques also fosters a supportive community through The Latte Lawyer Education and Information Platform, extending beyond traditional legal services by offering educational resources, workshops, and talks to empower creatives with the necessary knowledge to navigate complex copyright, trademark, and legal compliance laws and protect their valuable creations.',
      'Whether dealing with seasoned professionals or those just starting their creative journey, Somara Jacques is there to help creatives understand their rights, safeguard their work, achieve their goals, and protect their interests in an ever-evolving digital landscape and ever-changing laws that businesses must follow.',
    ],
  },
  {
    id: 'andrej-milic',
    role: 'Speaker',
    order: 2,
    name: 'Andrej Milic, Esq.',
    tagline: 'Director of Development, FIU College of Law',
    headshotUrl: IP_AGE_OF_AI_HEADSHOTS.andrejMilic,
    bioParagraphs: [
      'Andrej Milic, Esq., guides artists and creatives with the necessary tools and knowledge to navigate the often complex world of contracts and emphasizes the importance of understanding the legalities involved in creative work, ensuring that individuals can safeguard their rights and interests proactively. By exploring various scenarios and providing real-life examples, Milic sheds light on common pitfalls that creatives may encounter, as well as strategies to mitigate potential risks. Useful for anyone looking to thrive in their creative endeavors while maintaining their legal protections.',
      'Born in Vienna, Austria, to Yugoslavian parents, Mr. Andrej Milic is the Director of Development at FIU College of Law. He obtained his Bachelor of Applied Science Degree from Miami Dade College, where he was a member of the Honors College. Milic then obtained his Master of Management Degree with a specialization in Justice Administration from St. Thomas University and his Juris Doctor of Law from the University of Florida. He earned his LL.M. in Intercultural Human Rights at St. Thomas University School of Law. Mr. Milic is a licensed attorney in Florida and is a participant in the Florida Bar Leadership Academy Class X. He has developed courses for aspiring attorneys and teaches at numerous universities.',
    ],
  },
  {
    id: 'dimitry-said-chamy',
    role: 'Moderator',
    order: 3,
    name: 'Dimitry Saïd Chamy',
    tagline: 'Co-founding faculty, FIU Ratcliffe Art + Design Incubator',
    headshotUrl: IP_AGE_OF_AI_HEADSHOTS.dimitrySaidChamy,
    bioParagraphs: [
      'Dimitry Saïd Chamy is a transdisciplinary artist, designer, and cultural producer. His work draws on a queer, mixed Haitian-Lebanese immigrant perspective to explore speculative futures, generative systems, and symbolic world-building through participatory storytelling across media, video, installation, and code. He is co-founding faculty and Research Associate at FIU’s Ratcliffe Art + Design Incubator.',
    ],
  },
]
