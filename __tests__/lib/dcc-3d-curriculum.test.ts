import {
  PRIMARY_HERO_ASSET_IDS,
  THREE_D_CURRICULUM_ASSET_IDS,
  THREE_D_CURRICULUM_ASSETS,
  THREE_D_CURRICULUM_INTENTS,
  THREE_D_CURRICULUM_WORKSHOPS,
  THREE_D_SCHOOL_PATH,
  THREE_D_SMARTSIGN_SCREENS,
  assertCurriculumValid,
  curriculumWorkshopPath,
  getCurriculumWorkshopBySlug,
  listCurriculumHeroAssets,
  listCurriculumWorkshopSlugs,
  listPilotWorkshops,
} from '@/lib/dcc/education/3d-curriculum'

const REQUIRED_ASSET_IDS = [
  '3D-HERO-001',
  '3D-MAP-001',
  '3D-PIPELINE-001',
  '3D-FOUNDATION-HERO-001',
  '3D-FOUNDATION-FORMATS-001',
  '3D-FOUNDATION-PRINTABILITY-001',
  '3D-BLENDER-HERO-001',
  '3D-BLENDER-STAGES-001',
  '3D-BLENDER-OBJECT-001',
  '3D-PLASTICITY-HERO-001',
  '3D-PLASTICITY-BOOLEAN-001',
  '3D-PLASTICITY-STUDIO-OBJECTS-001',
  '3D-PLASTICITY-BRIDGE-001',
  '3D-RHINO-HERO-001',
  '3D-RHINO-JEWELRY-001',
  '3D-FIX-HERO-001',
  '3D-FIX-DIAGNOSIS-001',
  '3D-GRASSHOPPER-HERO-001',
  '3D-PARAMETRIC-HERO-001',
  '3D-OPERATOR-PATH-001',
] as const

describe('dcc 3d curriculum', () => {
  it('keeps unique records without invented instructors, prices, or checkout', () => {
    expect(assertCurriculumValid()).toEqual([])
    expect(listCurriculumWorkshopSlugs()).toEqual([
      'from-file-to-physical-object',
      'blender-for-artists',
      'plasticity-for-artists',
      'rhino-for-artists',
      'fix-my-3d-file',
      'grasshopper-computational-objects',
      'parametric-cad-functional-objects',
    ])
    expect(listCurriculumWorkshopSlugs()).not.toContain('display')
    expect(listPilotWorkshops().map((workshop) => workshop.slug)).toEqual([
      'from-file-to-physical-object',
      'blender-for-artists',
      'plasticity-for-artists',
    ])

    const serialized = JSON.stringify(THREE_D_CURRICULUM_WORKSHOPS)
    expect(serialized).not.toMatch(/\$\d/)
    expect(serialized).not.toMatch(/stripe/i)
    expect(serialized).not.toMatch(/micah/i)
    expect(serialized).not.toMatch(/checkout/i)
    for (const workshop of THREE_D_CURRICULUM_WORKSHOPS) {
      expect(workshop.instructor).toBeUndefined()
      expect(curriculumWorkshopPath(workshop.slug)).toBe(
        `${THREE_D_SCHOOL_PATH}/${workshop.slug}`
      )
    }
  })

  it('wires Cloudinary heroes and keeps supporting assets as placeholders', () => {
    expect(THREE_D_CURRICULUM_ASSET_IDS).toEqual([...REQUIRED_ASSET_IDS])
    expect(listCurriculumHeroAssets()).toHaveLength(PRIMARY_HERO_ASSET_IDS.length)
    for (const id of PRIMARY_HERO_ASSET_IDS) {
      const asset = THREE_D_CURRICULUM_ASSETS[id]
      expect(asset.status).toBe('ready')
      expect(asset.src).toMatch(/^https:\/\/res\.cloudinary\.com\/dck5rzi4h\//)
      expect(asset.src).toMatch(/dccmiami\/workshops\//)
    }
    for (const id of REQUIRED_ASSET_IDS) {
      const asset = THREE_D_CURRICULUM_ASSETS[id]
      expect(asset.id).toBe(id)
      expect(asset.filename).toMatch(/\.webp$/)
      expect(asset.usedOn.length).toBeGreaterThan(0)
      if ((PRIMARY_HERO_ASSET_IDS as readonly string[]).includes(id)) continue
      expect(asset.status).toBe('placeholder')
      expect(asset.src).toBeUndefined()
    }
  })

  it('lets every intent and map tool resolve to a workshop', () => {
    for (const intent of THREE_D_CURRICULUM_INTENTS) {
      expect(
        THREE_D_CURRICULUM_WORKSHOPS.some(
          (workshop) => workshop.id === intent.recommendedWorkshopId
        )
      ).toBe(true)
    }
    expect(THREE_D_SMARTSIGN_SCREENS).toHaveLength(7)
    expect(getCurriculumWorkshopBySlug('blender-for-artists')?.subtitle).toBe(
      'Make a sculpture. Make it printable.'
    )
    expect(getCurriculumWorkshopBySlug('plasticity-for-artists')?.subtitle).toBe(
      'CAD Without the CAD Headache'
    )
  })
})
