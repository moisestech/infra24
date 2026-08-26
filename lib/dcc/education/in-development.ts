import type { DccWorkshopOffering, DccWorkshopOfferingImage } from '@/lib/dcc/education/types'
import { SATURDAY_LAB_ICONS } from '@/lib/workshops/saturday-lab-media'

const CURRICULUM_CAPTION = 'Curriculum still — DCC page in development'

function still(
  src: string,
  alt: string,
  caption: string = CURRICULUM_CAPTION
): DccWorkshopOfferingImage {
  return { src, alt, caption }
}

function withCover(
  offering: Omit<DccWorkshopOffering, 'image'>
): DccWorkshopOffering {
  return {
    ...offering,
    image: offering.images[0],
  }
}

/**
 * Curriculum that already exists in this repo, shown as DCC interest / in development.
 * Not live DCC syllabi. Do not link to tenant catalog or checkout.
 * Skip vibe-coding-and-net-art (already a live DCC handbook). Skip consulting.
 */
export const DCC_WORKSHOP_IN_DEVELOPMENT: DccWorkshopOffering[] = [
  withCover({
    id: 'own-your-digital-presence',
    slug: 'own-your-digital-presence',
    title: 'Own Your Digital Presence',
    shortDescription:
      'Structure your site, social, and email list so your practice is findable — without surrendering your voice to platforms.',
    format: 'in-person',
    status: 'in-development',
    trackGroup: 'presence',
    enrollment: 'interest',
    durationMinutes: 150,
    hue: 168,
    hueAccent: 220,
    icon: {
      src: SATURDAY_LAB_ICONS.homepage,
      alt: 'Homepage icon for digital presence.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525117/dccmiami/workshops/social-profiles-links-hubs-public-presence_zevdko.png',
        'Curriculum still for Own Your Digital Presence — site, social, and public hubs.'
      ),
    ],
  }),
  withCover({
    id: 'seo-workshop',
    slug: 'seo-workshop',
    title: 'SEO for Artists in the Age of AI Search',
    shortDescription:
      'Foundational SEO when summaries and chat-style answers change how people discover culture — language, structure, and credibility without gimmicks.',
    format: 'self-paced',
    status: 'in-development',
    trackGroup: 'presence',
    enrollment: 'interest',
    durationMinutes: 120,
    hue: 175,
    hueAccent: 210,
    icon: {
      src: SATURDAY_LAB_ICONS.sitemap,
      alt: 'Sitemap icon for artist SEO.',
    },
    images: [],
  }),
  withCover({
    id: 'learn-ai-without-losing-yourself',
    slug: 'learn-ai-without-losing-yourself',
    title: 'Learn AI Without Losing Yourself',
    shortDescription:
      'Pressure, prompt, problem, and practice: a single session that keeps authorship visible and workflows sustainable.',
    format: 'hybrid',
    status: 'in-development',
    trackGroup: 'ai-literacy',
    enrollment: 'interest',
    durationMinutes: 180,
    hue: 195,
    hueAccent: 280,
    icon: {
      src: SATURDAY_LAB_ICONS.ai,
      alt: 'AI assistant icon for artist-centered literacy.',
    },
    images: [
      still(
        'https://res.cloudinary.com/du1ysiumj/image/upload/v1774826962/learn-ai-without-loosing-yourself-bg-no-text_pz3qno.png',
        'Curriculum still for Learn AI Without Losing Yourself.'
      ),
    ],
  }),
  withCover({
    id: 'writing-about-digital-practice',
    slug: 'writing-about-digital-practice',
    title: 'Writing About Your Digital Practice',
    shortDescription:
      'Turn process, tools, and URLs into clear language for statements, panels, and funders — without sounding like a press release.',
    format: 'in-person',
    status: 'in-development',
    trackGroup: 'practice-language',
    enrollment: 'interest',
    durationMinutes: 120,
    hue: 28,
    hueAccent: 200,
    icon: {
      src: SATURDAY_LAB_ICONS.about,
      alt: 'About / writing icon for digital practice language.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525120/dccmiami/workshops/writing-video-for-artists_pkxgsl.png',
        'Curriculum still for Writing About Your Digital Practice.'
      ),
    ],
  }),
  withCover({
    id: 'documentation-for-artists',
    slug: 'documentation-for-artists',
    title: 'Documentation for Artists',
    shortDescription:
      'Capture installation, performance, and time-based work so archives, press, and future-you can understand what happened.',
    format: 'in-person',
    status: 'in-development',
    trackGroup: 'archives',
    enrollment: 'interest',
    durationMinutes: 150,
    hue: 145,
    hueAccent: 250,
    icon: {
      src: SATURDAY_LAB_ICONS.files,
      alt: 'Files icon for artist documentation.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525110/dccmiami/workshops/documentation-for-artitsts_akddqm.png',
        'Curriculum still for Documentation for Artists.'
      ),
    ],
  }),
  withCover({
    id: 'ai-for-artists-voice-workflow-authorship',
    slug: 'ai-for-artists-voice-workflow-authorship',
    title: 'AI for Artists: Voice, Workflow, and Authorship',
    shortDescription:
      'Practical frameworks for voice, disclosure, and workflow when AI is in the room.',
    format: 'hybrid',
    status: 'in-development',
    trackGroup: 'ai-literacy',
    enrollment: 'interest',
    durationMinutes: 150,
    hue: 205,
    hueAccent: 290,
    icon: {
      src: SATURDAY_LAB_ICONS.prompt,
      alt: 'Prompt icon for AI studio workflow.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525106/dccmiami/workshops/ai-for-artists_dnwikc.png',
        'Curriculum still for AI for Artists: Voice, Workflow, and Authorship.'
      ),
    ],
  }),
  withCover({
    id: 'organizing-digital-studio',
    slug: 'organizing-digital-studio',
    title: 'Organizing Your Digital Studio',
    shortDescription:
      'Folders, backups, passwords, and project handoffs — so your digital studio stays legible to you and collaborators.',
    format: 'in-person',
    status: 'in-development',
    trackGroup: 'archives',
    enrollment: 'interest',
    durationMinutes: 120,
    hue: 152,
    hueAccent: 240,
    icon: {
      src: SATURDAY_LAB_ICONS.files,
      alt: 'Folder icon for digital studio systems.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525113/dccmiami/workshops/organizing-your-digital-studio_fverto.png',
        'Curriculum still for Organizing Your Digital Studio.'
      ),
    ],
  }),
  withCover({
    id: 'ai-copyright-creative-risk',
    slug: 'ai-copyright-creative-risk',
    title: 'AI, Copyright, and Creative Risk',
    shortDescription:
      'A practical overview of how copyright, contracts, and platform terms intersect with AI-assisted art — what to watch for, not legal advice.',
    format: 'hybrid',
    status: 'in-development',
    trackGroup: 'ai-literacy',
    enrollment: 'interest',
    durationMinutes: 120,
    hue: 220,
    hueAccent: 300,
    icon: {
      src: SATURDAY_LAB_ICONS.cv,
      alt: 'Document icon for copyright and creative risk.',
    },
    images: [
      still(
        'https://res.cloudinary.com/dck5rzi4h/image/upload/q_auto/f_auto/v1776525104/dccmiami/workshops/ai-copyright-and-creative-risk_kwjci9.png',
        'Curriculum still for AI, Copyright, and Creative Risk.'
      ),
    ],
  }),
]
