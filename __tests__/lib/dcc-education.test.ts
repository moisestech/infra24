import { DCC_WORKSHOPS_HERO_SYSTEM_LABELS } from '@/lib/marketing/dcc-workshops-landing-content'
import {
  AI_3D_PHYSICAL_OBJECT,
  CONCEPTUAL_EDUCATIONAL_CAPTION,
  DCC_EDUCATION_PHOTO_HOLDS,
  DCC_EDUCATION_PHOTO_STILLS,
  DCC_IN_DEVELOPMENT_HEADING,
  DCC_SESSIONS_HEADING,
  DCC_SESSIONS_LEAD,
  DCC_WORKSHOP_OFFERINGS,
  DCC_WORKSHOP_IN_DEVELOPMENT,
  THREE_D_PRINTING_FOR_ARTISTS,
  assertWorkshopOfferingSlugsValid,
  getWorkshopOfferingBySlug,
  listInDevelopmentWorkshopOfferings,
  listWorkshopOfferings,
  parseWorkshopInterestSource,
  workshopInterestHref,
} from '@/lib/dcc/education'

describe('dcc education offerings', () => {
  it('lists existing public workshop pages without inventing prices', () => {
    expect(assertWorkshopOfferingSlugsValid()).toEqual([])
    expect(listWorkshopOfferings().map((offering) => offering.slug)).toEqual([
      'saturday-lab',
      '3d-printing-for-artists',
      'ai-3d-physical-object',
      'vibe-coding-net-art',
    ])
    expect(listWorkshopOfferings().map((offering) => offering.slug)).not.toContain(
      'ip-age-of-ai'
    )
    expect(listWorkshopOfferings().map((offering) => offering.slug)).not.toContain(
      'resin-printing'
    )
    expect(getWorkshopOfferingBySlug('resin-printing')).toBeUndefined()
    const serialized = JSON.stringify(DCC_WORKSHOP_OFFERINGS)
    expect(serialized).not.toMatch(/\$\d/)
    expect(serialized).not.toMatch(/stripe/i)
  })

  it('wires conceptual educational stills on the two 3D offerings', () => {
    const printing = getWorkshopOfferingBySlug('3d-printing-for-artists')
    expect(printing?.enrollment).toBe('inquiry')
    expect(printing?.capacity).toBeUndefined()
    expect(printing?.durationMinutes).toBeUndefined()
    expect(printing?.href).toBe('/workshop/3d-printing-for-artists')
    expect(printing?.syllabusHref).toBe('/workshop/resin-printing')
    expect(printing?.image?.src).toBe(
      DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail']
    )
    expect(printing?.images.length).toBeGreaterThan(1)
    for (const image of printing?.images ?? []) {
      expect(image.caption).toBe(CONCEPTUAL_EDUCATIONAL_CAPTION)
    }

    const ai3d = getWorkshopOfferingBySlug('ai-3d-physical-object')
    expect(ai3d?.enrollment).toBe('inquiry')
    expect(ai3d?.href).toBe('/workshop/ai-3d-physical-object')
    expect(ai3d?.image?.src).toBe(DCC_EDUCATION_PHOTO_STILLS['ai-3d-model-review'])
    expect(ai3d?.images.some((image) => image.src === printing?.image?.src)).toBe(
      true
    )
    for (const image of ai3d?.images ?? []) {
      expect(image.caption).toBe(CONCEPTUAL_EDUCATIONAL_CAPTION)
    }

    const serialized = JSON.stringify(DCC_WORKSHOP_OFFERINGS)
    expect(serialized).not.toContain(DCC_EDUCATION_PHOTO_HOLDS['fabricate-hero-conceptual'])
    expect(serialized).not.toContain(DCC_EDUCATION_PHOTO_HOLDS['field-lab-joint-testing'])

    expect(getWorkshopOfferingBySlug('saturday-lab')?.image?.src).toContain(
      '01_start-here-two-paths'
    )
    expect(getWorkshopOfferingBySlug('vibe-coding-net-art')?.image?.src).toContain(
      'vibe-coding-with-net-art'
    )
    expect(getWorkshopOfferingBySlug('ip-age-of-ai')).toBeUndefined()
  })

  it('treats Saturday Lab as open lab without a fake headcount', () => {
    const lab = getWorkshopOfferingBySlug('saturday-lab')
    expect(lab?.enrollment).toBe('open-lab')
    expect(lab?.capacity).toBeUndefined()
  })

  it('leads the sessions band with mission language rather than a fake-storefront negation', () => {
    expect(DCC_SESSIONS_HEADING).toMatch(/Public syllabi/)
    expect(DCC_SESSIONS_HEADING).not.toMatch(/fake storefront/i)
    expect(DCC_SESSIONS_LEAD).not.toMatch(/fake storefront/i)
    expect(DCC_SESSIONS_LEAD).not.toMatch(/Seat checkout is not live/i)
    expect(DCC_IN_DEVELOPMENT_HEADING).toBe('In development at DCC')
  })

  it('lists in-development syllabi from the repo without live DCC hrefs or vibe duplicate', () => {
    expect(listInDevelopmentWorkshopOfferings().map((offering) => offering.slug)).toEqual([
      'own-your-digital-presence',
      'seo-workshop',
      'learn-ai-without-losing-yourself',
      'writing-about-digital-practice',
      'documentation-for-artists',
      'ai-for-artists-voice-workflow-authorship',
      'organizing-digital-studio',
      'ai-copyright-creative-risk',
    ])
    const serialized = JSON.stringify(DCC_WORKSHOP_IN_DEVELOPMENT)
    expect(serialized).not.toMatch(/\$\d/)
    expect(serialized).not.toMatch(/stripe/i)
    expect(serialized).not.toMatch(/\/o\/oolite/)
    expect(serialized).not.toMatch(/vibe-coding-and-net-art/)
    for (const offering of DCC_WORKSHOP_IN_DEVELOPMENT) {
      expect(offering.status).toBe('in-development')
      expect(offering.href).toBeUndefined()
      expect(offering.enrollment).toBe('interest')
    }
  })

  it('maps newsletter interest sources to live and in-development titles', () => {
    expect(workshopInterestHref('3d-printing-for-artists')).toBe(
      '/newsletter?source=workshop-3d-printing-for-artists'
    )
    expect(workshopInterestHref('ai-3d-physical-object')).toBe(
      '/newsletter?source=workshop-ai-3d-physical-object'
    )
    expect(parseWorkshopInterestSource('workshop-3d-printing-for-artists')?.title).toBe(
      '3D Printing for Artists'
    )
    expect(parseWorkshopInterestSource('workshop-ai-3d-physical-object')?.title).toBe(
      'AI → 3D Physical Object'
    )
    expect(parseWorkshopInterestSource('workshop-own-your-digital-presence')?.title).toBe(
      'Own Your Digital Presence'
    )
    expect(parseWorkshopInterestSource('workshop-resin-printing')).toBeUndefined()
    expect(parseWorkshopInterestSource('workshops')).toBeUndefined()
    expect(parseWorkshopInterestSource(undefined)).toBeUndefined()
  })
})

describe('dcc editorial workshop pages', () => {
  it('keeps HTML labels and conceptual captions, and reuses the PRINT still', () => {
    expect(THREE_D_PRINTING_FOR_ARTISTS.heroKicker).toBe('PRINT')
    expect(THREE_D_PRINTING_FOR_ARTISTS.hero.src).toBe(
      DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail']
    )
    expect(THREE_D_PRINTING_FOR_ARTISTS.hero.caption).toBe(
      CONCEPTUAL_EDUCATIONAL_CAPTION
    )
    expect(THREE_D_PRINTING_FOR_ARTISTS.furtherLinks.map((link) => link.href)).toContain(
      '/workshop/resin-printing'
    )

    const printSection = AI_3D_PHYSICAL_OBJECT.sections.find(
      (section) => section.kicker === 'PRINT'
    )
    expect(printSection?.image.src).toBe(
      DCC_EDUCATION_PHOTO_STILLS['3d-printing-machine-detail']
    )
    expect(AI_3D_PHYSICAL_OBJECT.hero.src).toBe(
      DCC_EDUCATION_PHOTO_STILLS['ai-3d-model-review']
    )
    expect(AI_3D_PHYSICAL_OBJECT.hero.caption).toBe(CONCEPTUAL_EDUCATIONAL_CAPTION)

    const serialized = JSON.stringify([
      THREE_D_PRINTING_FOR_ARTISTS,
      AI_3D_PHYSICAL_OBJECT,
    ])
    expect(serialized).not.toMatch(/\$\d/)
    expect(serialized).not.toMatch(/stripe/i)
  })
})

describe('dcc workshops hero system labels', () => {
  it('names the three public session kinds already in the lead', () => {
    expect(DCC_WORKSHOPS_HERO_SYSTEM_LABELS).toEqual(['Syllabus', 'Lab', 'Handbook'])
  })
})
