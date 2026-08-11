import {
  RESIN_HERO_MEDIA,
  RESIN_MODULE_MEDIA_IDS,
  RESIN_MODULE_PRIMARY_MEDIA,
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
  getResinModuleBySlug,
  getResinVenue,
} from '@/lib/workshop-engine'
import {
  DEFAULT_MODULE_VISUAL,
  getColorTokenClasses,
  getVenueAccent,
} from '@/lib/workshop-engine/resin-printing/theme'

describe('resin workshop curriculum', () => {
  it('has nine ordered modules with visual + primary media', () => {
    expect(RESIN_PRINTING_MODULES).toHaveLength(9)
    expect(RESIN_PRINTING_WORKSHOP.moduleIds).toHaveLength(9)
    expect(RESIN_PRINTING_MODULES.map((m) => m.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    for (const m of RESIN_PRINTING_MODULES) {
      expect(m.visual?.phase).toBeTruthy()
      expect(m.primaryMedia?.assetId).toBeTruthy()
      expect(RESIN_MODULE_PRIMARY_MEDIA[m.id]?.assetId).toBe(m.primaryMedia?.assetId)
    }
    expect(RESIN_PRINTING_WORKSHOP.heroMedia?.assetId).toBe(RESIN_HERO_MEDIA.assetId)
  })

  it('keeps safety boundary language off certification', () => {
    expect(RESIN_PRINTING_WORKSHOP.safetyBoundary.toLowerCase()).toContain(
      'do not independently operate'
    )
    expect(RESIN_PRINTING_WORKSHOP.expectationStatement.toLowerCase()).toContain(
      'not be certified'
    )
  })

  it('resolves modules, venues, and theme accents', () => {
    expect(getResinModuleBySlug('safety-zones')?.safetyLevel).toBe('required')
    expect(getResinVenue('oolite')?.printerModel).toContain('Photon')
    expect(getResinVenue('bakehouse')?.namingNote).toBeTruthy()
    expect(getVenueAccent('oolite-teal')?.label).toMatch(/teal/i)
    expect(getVenueAccent('bakehouse-copper')?.label).toMatch(/copper/i)
    expect(getColorTokenClasses(DEFAULT_MODULE_VISUAL.colorTokenId).border).toContain('slate')
    expect(RESIN_MODULE_MEDIA_IDS['slicer-lab']?.length).toBeGreaterThan(3)
  })
})
