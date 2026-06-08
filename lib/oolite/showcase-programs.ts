import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/suggested-question-handoff'
import type { MemoryAgentArtistCard, MemoryAgentGalleryImage } from '@/types/memory-agent'

const CLOUDINARY = 'https://res.cloudinary.com/dkod1at3i/image/upload'

export type ShowcaseProgramResident = {
  key: string
  name: string
  photoUrl: string
  school?: string
}

export type ShowcaseProgramConfig = {
  key: string
  title: string
  announcementTitle: string
  spokenAnswer: string
  displayAnswer: string
  followUps: string[]
  galleryImages: MemoryAgentGalleryImage[]
  residents: ShowcaseProgramResident[]
  mentor?: { name: string; photoUrl?: string }
  exhibitionDate?: string
  contactEmail?: string
}

export const YOUTH_ARTIST_RESIDENCY_SHOWCASE: ShowcaseProgramConfig = {
  key: 'youth_artist_residency',
  title: 'Youth Artist Residency',
  announcementTitle: 'Youth Artist Residency',
  spokenAnswer:
    'The Youth Artist Residency is Oolite Arts’ inaugural program for rising young artists, beginning January 2026. Five students—Ana Blanco, Noa Garcia, Melina Walsh, TJ Wright, and Emely Yanji—work with mentor Gonzalo Hernandez through a 22-week program including studio practice and a paid internship. The cohort exhibition opens July 1, 2026.',
  displayAnswer: `First-Ever Youth Artist Residents at Oolite Arts

Oolite Arts welcomes five rising young artists as the inaugural cohort of Youth Artist Residents, beginning in January 2026. Through an ongoing partnership with The Little Haiti Cultural Complex, participating students gain access to professional arts spaces and expanded opportunities to engage with contemporary artistic practice.

Under the mentorship of Gonzalo Hernandez, the Youth Artist Residents develop studio practice, gain hands-on experience, and build the creative foundation that will shape their future artistic careers. The cohort includes students from Miami Arts Charter School, Miami Senior High School, Design and Architecture Senior High, and Ransom Everglades School.

The Youth Artist Residency is a 22-week program: a 16-week studio residency from Jan. 13 to May 14, 2026, followed by a six-week paid internship. Participants receive hands-on studio experience, mentorship, and professional guidance not typically available in high school settings.

The program culminates in a public exhibition that coincides with a main gallery opening at Oolite Arts—the Youth Artist Residency Exhibition on July 1, 2026.

Skill-building focuses on technical, critical, and professional practices to prepare for higher education and future artist careers. Applications for the next cohort open in May 2026.

Contact: Catalina Aguayo · caguayo@oolitearts.org

In partnership with The Little Haiti Cultural Complex and the City of Miami Parks & Recreation.`,
  followUps: [
    'Who mentors the Youth Artist Residents?',
    'When is the Youth Artist Residency exhibition?',
    'Tell me about Gonzalo Hernandez.',
    'Who are the 2026 Studio Residents?',
  ],
  galleryImages: [
    {
      url: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
      title: '2026 Youth Artist Residents',
      subtitle: 'Ana Blanco, Noa Garcia, Melina Walsh, TJ Wright, and Emely Yanji',
    },
    {
      url: `${CLOUDINARY}/v1780503845/teen-residency-Copy-of-LED-Classes_LR_36-2-1030x554_hydi2a.jpg`,
      title: 'Studio classes',
      subtitle: 'Youth Artist Residency',
    },
    {
      url: `${CLOUDINARY}/v1780503845/teen-residency-DSC_1476-1030x687_bh4kem.jpg`,
      title: 'Welcome event',
      subtitle: '2026 cohort',
    },
    {
      url: `${CLOUDINARY}/v1780503843/teen-residency-DSC_1550-1030x687_hu3f4s.jpg`,
      title: 'In the studio',
      subtitle: 'Youth Artist Residency',
    },
    {
      url: `${CLOUDINARY}/v1780503845/teen-residency-LHCC-logo-2014-665x705_rsqtxv.webp`,
      title: 'Little Haiti Cultural Complex',
      subtitle: 'Program partner',
    },
    {
      url: `${CLOUDINARY}/v1780503845/teen-residency-Parks-Seal-2024-fill_keqdml.webp`,
      title: 'City of Miami Parks & Recreation',
      subtitle: 'Program partner',
    },
  ],
  residents: [
    {
      key: 'ana_blanco',
      name: 'Ana Blanco',
      photoUrl: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
    },
    {
      key: 'noa_garcia',
      name: 'Noa Garcia',
      photoUrl: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
    },
    {
      key: 'melina_walsh',
      name: 'Melina Walsh',
      photoUrl: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
    },
    {
      key: 'tj_wright',
      name: 'TJ Wright',
      photoUrl: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
    },
    {
      key: 'emely_yanji',
      name: 'Emely Yanji',
      photoUrl: `${CLOUDINARY}/v1780503845/teen-residency-Youth-Artist-Residency-Headshots-1_rwxgqc.jpg`,
    },
  ],
  mentor: {
    name: 'Gonzalo Hernandez',
    photoUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Gonzalo-Hernandez_qlql5o.jpg',
  },
  exhibitionDate: '2026-07-01',
  contactEmail: 'caguayo@oolitearts.org',
}

export const OOLITE_SHOWCASE_PROGRAMS: ShowcaseProgramConfig[] = [YOUTH_ARTIST_RESIDENCY_SHOWCASE]

const YOUTH_RESIDENCY_QUESTION_RE =
  /\b(youth\s+artist\s+residen(?:cy|ts?)|youth\s+residen(?:cy|ts?)|teen\s+residen(?:cy|ts?)|inaugural\s+youth)\b/i

export function isYouthResidencyQuestion(question: string): boolean {
  return YOUTH_RESIDENCY_QUESTION_RE.test(question.trim())
}

export function matchShowcaseProgramQuestion(question: string): ShowcaseProgramConfig | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  for (const cfg of OOLITE_SHOWCASE_PROGRAMS) {
    const titleKey = normalizeSuggestedQuestionKey(cfg.title)
    if (
      key.includes(titleKey) ||
      key === `tell me about the ${titleKey}` ||
      key === `tell me about ${titleKey}` ||
      key === `who are the ${titleKey} residents` ||
      key === `who are the 2026 ${titleKey} residents`
    ) {
      return cfg
    }
  }
  if (isYouthResidencyQuestion(question)) {
    return YOUTH_ARTIST_RESIDENCY_SHOWCASE
  }
  return undefined
}

export function buildShowcaseProgramArtistCards(
  program: ShowcaseProgramConfig
): MemoryAgentArtistCard[] {
  return program.residents.map((resident) => ({
    id: `showcase_${program.key}_${resident.key}`,
    name: resident.name,
    program: program.title,
    programYear: '2026',
    cohort: '2026',
    reason: `Inaugural cohort · ${program.title}.`,
    confidence: 'high' as const,
    photoUrl: resident.photoUrl,
    galleryImages: program.galleryImages.slice(0, 4),
    galleryImageUrls: program.galleryImages.slice(0, 4).map((g) => g.url),
    bioSnippet: resident.school
      ? `${program.title} · ${resident.school}`
      : `${program.title} · 2026 cohort`,
  }))
}
