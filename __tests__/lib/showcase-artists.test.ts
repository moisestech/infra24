import { mergePublicDirectoryOnlyProfiles } from '@/lib/oolite/enrich-alumni-public-directory'
import {
  buildShowcaseDisplayAnswer,
  matchShowcaseArtistQuestion,
  RICARDO_E_ZULUETA_SHOWCASE,
  SHAYLA_MARSHALL_SHOWCASE,
} from '@/lib/oolite/showcase-artists'
import type { OolitePublicDirectoryProfile } from '@/lib/oolite/public-directory-profiles'
import { applyShowcaseArtistResponse } from '@/lib/memory-agent/apply-showcase-artist-response'

const shaylaProfile: OolitePublicDirectoryProfile = {
  recordId: 'reccaY67D6OUMHxQ6',
  displayName: 'Shayla Marshall',
  nameKey: 'shayla marshall',
  shortAiSummary:
    'Shayla Marshall is a mixed-media artist whose work uses world-building and storytelling to imagine new histories and futures rooted in Black identity, place, and Miami’s cultural landscape.',
  publicBio: 'Shayla Marshall (b. 1999, Miami, FL) is a contemporary mixed-media artist.',
  featuredImageUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452178/Shayla-Marshall-potrait_tb87ju.jpg',
  portraitVerticalUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452178/Shayla-Marshall-potrait_tb87ju.jpg',
  portraitLandscapeUrl:
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452174/shayla-marshall-Da_Crib_Installation_Shayla_Marshall-1-1030x687_rno1ak.jpg',
  additionalImageUrls: [
    'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452177/shayla-marshall-The_First_Lady_Hair_Scuplture_Shayla_Marshall-773x1030_kgsoeb.webp',
  ],
  topics: ['world-building', 'storytelling'],
  themes: ['Blackness', 'identity'],
  primaryMedium: 'Mixed Media',
  additionalMediums: ['Installation'],
  studioNumber: '209',
  residencyCategory: '2026 Studio Resident',
  residencyProgram: 'Studio Residency',
  publiclyApproved: true,
  doNotUseInAi: false,
}

describe('matchShowcaseArtistQuestion', () => {
  it('matches Shayla Marshall lookup questions', () => {
    expect(matchShowcaseArtistQuestion('Tell me about Shayla Marshall.')).toEqual(
      SHAYLA_MARSHALL_SHOWCASE
    )
  })

  it('matches Ricardo E. Zulueta with or without middle initial', () => {
    expect(matchShowcaseArtistQuestion('Tell me about Ricardo E. Zulueta.')).toEqual(
      RICARDO_E_ZULUETA_SHOWCASE
    )
    expect(matchShowcaseArtistQuestion('Tell me about Ricardo Zulueta.')).toEqual(
      RICARDO_E_ZULUETA_SHOWCASE
    )
  })
})

describe('mergePublicDirectoryOnlyProfiles', () => {
  it('adds public-directory-only artists to the alumni pool', () => {
    const merged = mergePublicDirectoryOnlyProfiles([], [shaylaProfile], 'public')
    expect(merged).toHaveLength(1)
    expect(merged[0]?.name).toBe('Shayla Marshall')
    expect(merged[0]?.studioNumber).toBe('209')
  })
})

describe('applyShowcaseArtistResponse', () => {
  it('returns portrait, gallery captions, TTS, and follow-ups for Shayla', () => {
    const result = applyShowcaseArtistResponse({
      orgSlug: 'oolite',
      question: 'Tell me about Shayla Marshall.',
      result: {
        answer: 'placeholder',
        artists: [],
        followUps: [],
        dataGaps: [],
      },
      contextRows: [],
      publicProfiles: [shaylaProfile],
    })

    expect(result.spokenAnswer).toContain('Studio 209')
    expect(result.artists[0]?.photoUrl).toContain('Shayla-Marshall-potrait')
    expect(result.artists[0]?.galleryImages?.length).toBeGreaterThan(0)
    expect(result.artists[0]?.galleryImages?.[0]?.title).toBe('Da Crib')
    expect(result.followUps).toContain('Show me Shayla Marshall’s artwork')
    expect(result.answer).toContain('contemporary mixed-media artist')
    expect(result.answer).toContain('Studio 209')
  })

  it('uses full public bio without duplicate summary layers when bio is present', () => {
    const ricardoProfile: OolitePublicDirectoryProfile = {
      recordId: 'recF9rzblLM0MprGk',
      displayName: 'Ricardo E. Zulueta',
      nameKey: 'ricardo e zulueta',
      shortAiSummary: 'Short summary that should not appear when public bio exists.',
      publicBio:
        'Ricardo E. Zulueta is an interdisciplinary artist and scholar born in Havana, Cuba and based in Miami.',
      topics: ['Photography'],
      themes: ['Identity'],
      additionalImageUrls: [],
      additionalMediums: [],
      publiclyApproved: true,
      doNotUseInAi: false,
      residencyCategory: '2026 Studio Resident',
      studioNumber: '109',
    }
    const answer = buildShowcaseDisplayAnswer(ricardoProfile, RICARDO_E_ZULUETA_SHOWCASE)
    expect(answer).toContain('born in Havana, Cuba')
    expect(answer).toContain('Studio 109')
    expect(answer).not.toContain('Short summary')
    expect(answer).not.toContain('Topics & themes')
    expect(answer).not.toContain('especially relevant for demos')
  })
})
