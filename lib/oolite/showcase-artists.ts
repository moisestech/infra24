import { normalizeSuggestedQuestionKey } from '@/lib/memory-agent/normalize-suggested-question-key'
import type { MemoryAgentGalleryImage } from '@/types/memory-agent'
import { OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS } from '@/lib/oolite/airtable-recognitions-config'
import type { OolitePublicDirectoryProfile } from '@/lib/oolite/public-directory-profiles'

export type ShowcaseArtistConfig = {
  key: string
  displayName: string
  /** Alternate normalized names for question matching (e.g. without middle initial). */
  matchAliases?: string[]
  publicDirectoryRecordId: string
  spokenAnswer: string
  followUps: string[]
  galleryCaptions: MemoryAgentGalleryImage[]
  worldBuildingNote?: string
}

export const SHAYLA_MARSHALL_SHOWCASE: ShowcaseArtistConfig = {
  key: 'shayla_marshall',
  displayName: 'Shayla Marshall',
  publicDirectoryRecordId: OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS.shaylaMarshall,
  spokenAnswer:
    'Shayla Marshall is a Miami-born mixed-media artist based between Miami and London. Her work uses world-building and storytelling to imagine Black histories and futures that have not already been written for her. She is a 2026 Oolite Arts Studio Resident in Studio 209.',
  followUps: [
    'Show me Shayla Marshall’s artwork',
    'Where is Shayla Marshall’s studio?',
    'What themes appear in Shayla Marshall’s work?',
    'Show me artists working with world-building',
    'Show me similar Oolite artists',
  ],
  worldBuildingNote:
    'Her practice is especially relevant for leadership demos of world-building and storytelling: she builds immersive visual worlds where Black identity, place, and future imaginaries are central.',
  galleryCaptions: [
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452174/shayla-marshall-Da_Crib_Installation_Shayla_Marshall-1-1030x687_rno1ak.jpg',
      title: 'Da Crib',
      subtitle: 'Installation',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452177/shayla-marshall-The_First_Lady_Hair_Scuplture_Shayla_Marshall-773x1030_kgsoeb.webp',
      title: 'The First Lady',
      subtitle: 'Hair sculpture',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452176/shayla-marshall-Chess_Not_Checkers_120x60_PaintibgResin_Shayla_Marshall-773x1030_byhhpn.jpg',
      title: 'Chess Not Checkers',
      subtitle: 'Painting and resin',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-The_Queen_Moves_Freely_60x60_Painting_Resin_Shayla_Marshall-773x1030_p05twm.jpg',
      title: 'The Queen Moves Freely',
      subtitle: 'Painting and resin',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452175/shayla-marshall-Portrait_of_a_Noblewoman_4x5_Tintype_Shayla_Marshall-782x1030_citef1.jpg',
      title: 'Portrait of a Noblewoman',
      subtitle: 'Tintype',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Trina_Hair_Sculpture_Shayla_Marshall-878x1030_hq7xwa.jpg',
      title: 'Trina',
      subtitle: 'Hair sculpture',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452173/shayla-marshall-Soulaani_Hair_Scuplture_Shayla_Marshall-1030x687_senmyt.jpg',
      title: 'Soulaani',
      subtitle: 'Hair sculpture',
    },
  ],
}

export const MARK_DELMONT_SHOWCASE: ShowcaseArtistConfig = {
  key: 'mark_delmont',
  displayName: 'Mark Delmont',
  matchAliases: ['mark delmont'],
  publicDirectoryRecordId: OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS.markDelmont,
  spokenAnswer:
    'Mark Delmont is a multidisciplinary artist from Carol City in Miami Gardens. His work blends Jamaican and Haitian roots into dramatic portraiture and mixed-media pieces rooted in neighborhood memory. He is an Oolite Arts studio alumnus in Studio 204.',
  followUps: [
    'Show me Mark Delmont’s artwork',
    'Where is Mark Delmont’s studio?',
    'Tell me about Shayla Marshall.',
    'Tell me about Ricardo E. Zulueta.',
    'Show me similar Oolite artists',
  ],
  galleryCaptions: [],
}

export const LEO_CASTANEDA_SHOWCASE: ShowcaseArtistConfig = {
  key: 'leo_castaneda',
  displayName: 'Leo Castaneda',
  matchAliases: ['leo castaneda'],
  publicDirectoryRecordId: OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS.leoCastaneda,
  spokenAnswer:
    'Leo Castaneda is an artist working at the intersection of virtual reality, gaming, performance, and interactive sculpture. His work deconstructs the mythologies and power structures embedded in video games. He was an Oolite Arts studio resident in 2018 and 2019.',
  followUps: [
    'Show me Leo Castaneda’s artwork',
    'What exhibitions featured Leo Castaneda at Oolite?',
    'Who are Oolite artists working with digital media, software, film, or interactive installation?',
    'Tell me about Ricardo E. Zulueta.',
    'Show me similar Oolite artists',
  ],
  galleryCaptions: [
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-Painting_in_First_room_3-1030x686_c999fb.jpg',
      title: 'Painting in First Room',
      subtitle: 'Installation view',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-High_Resolution_Screenshot_number_143_ac-1030x736_nkq5ty.jpg',
      title: 'High Resolution Screenshot 143',
      subtitle: 'Game environment',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-High_Resolution_Screenshot_number_167_ac-1030x736_uwqoos.jpg',
      title: 'High Resolution Screenshot 167',
      subtitle: 'Game environment',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/Leo_Castaneda-Game-Preview_06-1030x580_bqndej.jpg',
      title: 'Game Preview',
      subtitle: 'Levels & Bosses',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560943/leo-castaneda-LC_Video_in_Perfomance_at_Faena_image_02_JPG-1030x687_gnm5fc.jpg',
      title: 'Performance at Faena',
      subtitle: 'Live performance',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560942/leo-castaneda-first_room-1030x588_i9izcv.jpg',
      title: 'First Room',
      subtitle: 'Installation view',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1781560942/Leo_Castaneda_Level_One-Preview_Explosion_02-1030x579_kux3xv.jpg',
      title: 'Level One Preview',
      subtitle: 'Explosion sequence',
    },
  ],
}

export const RICARDO_E_ZULUETA_SHOWCASE: ShowcaseArtistConfig = {
  key: 'ricardo_e_zulueta',
  displayName: 'Ricardo E. Zulueta',
  matchAliases: ['ricardo zulueta', 'ricardo e zulueta'],
  publicDirectoryRecordId: OOLITE_SHOWCASE_PUBLIC_DIRECTORY_RECORD_IDS.ricardoEZulueta,
  spokenAnswer:
    'Ricardo E. Zulueta is an interdisciplinary artist and scholar born in Havana, Cuba and based in Miami. He holds a Ph.D. in Cinema and Media Studies and an MFA from the University of Miami. He is a 2026 Oolite Arts Studio Resident in Studio 109 and a recipient of Oolite Arts’ Ellies Creator Award.',
  followUps: [
    'Show me Ricardo E. Zulueta’s artwork',
    'Where is Ricardo E. Zulueta’s studio?',
    'Who are Oolite artists working with digital media, software, film, or interactive installation?',
    'Tell me about Shayla Marshall.',
    'Show me similar Oolite artists',
  ],
  galleryCaptions: [
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862292/ricardo-zulueta-8_Cyberscape_Diptych_No.3_2024__40_x_60_archival_pigment_print-705x513_nczdw7.jpg',
      title: 'Cyberscape Diptych No. 3',
      subtitle: 'Archival pigment print, 2024',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862291/ricardo-zulueta-7_Cyberscape_Diptych_No.1_2024__40_x_60_archival_pigment_print-705x514_slvdpm.jpg',
      title: 'Cyberscape Diptych No. 1',
      subtitle: 'Archival pigment print, 2024',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862289/ricardo-zulueta-6_Cyberscape_Diptych_No.2_2024__40_x_60_archival_pigment_print-705x513_sy9uuk.jpg',
      title: 'Cyberscape Diptych No. 2',
      subtitle: 'Archival pigment print, 2024',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862288/ricardo-zulueta-5_I_am_Not_Your_Robot_2024_dimensions_variable_installation_view_multi_channel_HD_video-705x474_ese1rg.jpg',
      title: 'I am Not Your Robot',
      subtitle: 'Multi-channel HD video installation, 2024',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862287/ricardo-zulueta-4_Networked_Gestures_v.2_2022_installation_view_at_David_Castillo_Gallery_dimensions_variable_acrylic_ink_software_on_canvas_and_video-705x470_ti2ozj.webp',
      title: 'Networked Gestures v.2',
      subtitle: 'Installation view, David Castillo Gallery, 2022',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862286/ricardo-zulueta-3_Networked_Gestures_v.1_2022_dimensions_variable_installation_view_multi_channel_HD_video-1-705x470_oeenj0.jpg',
      title: 'Networked Gestures v.1',
      subtitle: 'Multi-channel HD video, 2022',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862285/ricardo-zulueta-2_GRIDS_1_3_4_2022-23_dimensions_variable_installation_view_acrylic_paint_ink_software_on_canvas-705x532_uquqyj.webp',
      title: 'GRIDS 1, 3, 4',
      subtitle: 'Acrylic, ink, and software on canvas, 2022–23',
    },
    {
      url: 'https://res.cloudinary.com/dkod1at3i/image/upload/v1780862283/ricardo-zulueta-1_Speculative_Cyberscapes_v.1_2024_dimensions_variable_acrylic_paint_ink_on_canvas_printed_vinyl_and_video-705x529_x6lrgd.jpg',
      title: 'Speculative Cyberscapes v.1',
      subtitle: 'Mixed-media installation, 2024',
    },
  ],
}

export const OOLITE_SHOWCASE_ARTISTS: ShowcaseArtistConfig[] = [
  MARK_DELMONT_SHOWCASE,
  SHAYLA_MARSHALL_SHOWCASE,
  RICARDO_E_ZULUETA_SHOWCASE,
  LEO_CASTANEDA_SHOWCASE,
]

export function showcaseArtistSuggestedQuestions(): string[] {
  return OOLITE_SHOWCASE_ARTISTS.map((cfg) => `Tell me about ${cfg.displayName}.`)
}

export function matchShowcaseArtistQuestion(question: string): ShowcaseArtistConfig | undefined {
  const key = normalizeSuggestedQuestionKey(question)
  for (const cfg of OOLITE_SHOWCASE_ARTISTS) {
    const names = [
      normalizeSuggestedQuestionKey(cfg.displayName),
      ...(cfg.matchAliases ?? []).map((alias) => normalizeSuggestedQuestionKey(alias)),
    ]
    for (const nameKey of names) {
      if (key.includes(nameKey) || key === `tell me about ${nameKey}`) {
        return cfg
      }
    }
  }
  return undefined
}

export function buildShowcaseDisplayAnswer(
  profile: OolitePublicDirectoryProfile,
  showcase: ShowcaseArtistConfig
): string {
  const bio = profile.publicBio?.trim()
  if (bio) {
    const lines = [bio]
    const residency = profile.residencyCategory?.trim()
    const studio = profile.studioNumber?.trim()
    if (residency || studio) {
      const parts = [residency, studio ? `Studio ${studio}` : undefined].filter(Boolean)
      lines.push(parts.join(' · '))
    }
    return lines.join('\n\n')
  }

  const lines: string[] = []
  const summary = profile.shortAiSummary?.trim()
  if (summary) lines.push(summary)

  const residency = profile.residencyCategory?.trim()
  const studio = profile.studioNumber?.trim()
  if (residency || studio) {
    const parts = [residency, studio ? `Studio ${studio}` : undefined].filter(Boolean)
    lines.push(parts.join(' · '))
  }

  const topicLine = [...profile.topics, ...profile.themes]
    .filter(Boolean)
    .slice(0, 8)
    .join(', ')
  if (topicLine) lines.push(`Topics & themes: ${topicLine}.`)

  if (showcase.worldBuildingNote) {
    lines.push(showcase.worldBuildingNote)
  }

  return lines.join('\n\n')
}

export function galleryImagesForShowcase(
  profile: OolitePublicDirectoryProfile,
  showcase: ShowcaseArtistConfig
): MemoryAgentGalleryImage[] {
  if (showcase.galleryCaptions.length > 0) {
    return showcase.galleryCaptions
  }

  const out: MemoryAgentGalleryImage[] = []
  if (profile.portraitLandscapeUrl) {
    out.push({ url: profile.portraitLandscapeUrl, title: 'Studio', subtitle: 'Portrait' })
  }
  for (const url of profile.additionalImageUrls) {
    out.push({ url })
  }
  return out
}
