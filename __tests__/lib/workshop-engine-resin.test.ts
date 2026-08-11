import {
  RESIN_ASSET_PATHS,
  RESIN_BANNER_SIZE,
  RESIN_BOOKLET_EDITION,
  RESIN_HERO_MEDIA,
  RESIN_MODULE_BANNERS,
  RESIN_MODULE_MEDIA_IDS,
  RESIN_MODULE_PRIMARY_MEDIA,
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
  TEACHING_SECTION_ROLES,
  getResinModuleBySlug,
  getResinVenue,
  guidePagePreviewHref,
  isMissingLogicalPage,
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
    expect(RESIN_PRINTING_MODULES.map((m) => m.order)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ])
    for (const m of RESIN_PRINTING_MODULES) {
      expect(m.visual?.phase).toBeTruthy()
      expect(m.primaryMedia?.assetId).toBeTruthy()
      expect(RESIN_MODULE_PRIMARY_MEDIA[m.id]?.assetId).toBe(
        m.primaryMedia?.assetId
      )
    }
    expect(RESIN_PRINTING_WORKSHOP.heroMedia?.assetId).toBe(RESIN_HERO_MEDIA.assetId)
  })

  it('attaches illustrative 21:9 banners to every module', () => {
    expect(Object.keys(RESIN_MODULE_BANNERS)).toHaveLength(9)
    expect(RESIN_BANNER_SIZE).toEqual({ width: 1915, height: 821 })
    for (const m of RESIN_PRINTING_MODULES) {
      const banner = m.banner
      expect(banner).toBeTruthy()
      expect(banner?.kind).toBe('illustration')
      expect(banner?.width).toBe(1915)
      expect(banner?.height).toBe(821)
      expect(banner?.src).toMatch(/^\/workshops\/resin-printing\/banners\/.+\.webp$/)
      expect(banner?.masterSrc).toMatch(/^\/workshops\/resin-printing\/banners\/png\/.+\.png$/)
      expect(banner?.alt.length).toBeGreaterThan(20)
      expect(banner?.objectPosition).toBe('center right')
      expect(RESIN_MODULE_BANNERS[m.id]?.src).toBe(banner?.src)
    }
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
    expect(getColorTokenClasses(DEFAULT_MODULE_VISUAL.colorTokenId).border).toContain(
      'slate'
    )
    expect(RESIN_MODULE_MEDIA_IDS['slicer-lab']?.length).toBeGreaterThan(3)
  })
})

describe('resin booklet V02 mapping', () => {
  it('describes the Aug 10 print-spread edition accurately', () => {
    expect(RESIN_BOOKLET_EDITION.pdfSheetCount).toBe(21)
    expect(RESIN_BOOKLET_EDITION.logicalPageCount).toBe(44)
    expect(RESIN_BOOKLET_EDITION.missingLogicalPages).toEqual([10, 35])
    expect(RESIN_BOOKLET_EDITION.format).toBe('printer-spreads')
    expect(RESIN_BOOKLET_EDITION.pagesVerified).toBe(true)
    expect(RESIN_BOOKLET_EDITION.downloadHref).toContain(
      'Oolite-Arts-Resin-Printing-Guide.pdf'
    )
  })

  it('never generates links or previews for missing pages 10 and 35', () => {
    expect(isMissingLogicalPage(10)).toBe(true)
    expect(isMissingLogicalPage(35)).toBe(true)
    expect(guidePagePreviewHref(10)).toBeUndefined()
    expect(guidePagePreviewHref(35)).toBeUndefined()
    expect(guidePagePreviewHref(5)).toBe(
      '/workshops/resin-printing/guide-pages/page-05.jpg'
    )

    for (const m of RESIN_PRINTING_MODULES) {
      for (const ref of m.bookletRefs) {
        expect(ref.startPage).not.toBe(10)
        expect(ref.endPage).not.toBe(10)
        expect(ref.startPage).not.toBe(35)
        expect(ref.endPage).not.toBe(35)
        if (ref.pagePreviewHref) {
          expect(ref.pagePreviewHref.includes('page-10')).toBe(false)
          expect(ref.pagePreviewHref.includes('page-35')).toBe(false)
        }
      }
    }
  })

  it('marks Failure Clinic references as related only', () => {
    const failure = getResinModuleBySlug('failure-clinic')
    expect(failure).toBeTruthy()
    expect(failure!.bookletRefs.length).toBeGreaterThan(0)
    for (const ref of failure!.bookletRefs) {
      expect(ref.status).toBe('related')
    }
  })

  it('has exact primary booklet pages for every module', () => {
    const expected: Record<string, number[]> = {
      welcome: [2, 43, 44],
      'why-resin': [3, 13, 17, 19, 30],
      'safety-zones': [29, 32, 36, 37],
      'complete-workflow': [3, 9, 33, 39],
      'file-readiness': [13, 42],
      'slicer-lab': [4, 11, 20, 12],
      'print-wash-cure': [33, 36, 29],
      'failure-clinic': [14, 21, 24, 27, 34, 37],
      'project-readiness': [38, 13, 17, 19],
    }

    for (const [slug, starts] of Object.entries(expected)) {
      const workshopModule = getResinModuleBySlug(slug)
      expect(workshopModule).toBeTruthy()
      const actualStarts = workshopModule!.bookletRefs.map((r) => r.startPage)
      expect(actualStarts).toEqual(starts)
      expect(workshopModule!.bookletRefs.every((r) => r.status)).toBe(true)
    }
  })

  it('includes a discussion prompt on every module', () => {
    for (const m of RESIN_PRINTING_MODULES) {
      expect(m.discussionPrompt?.length).toBeGreaterThan(20)
    }
  })

  it('includes tips, checkpoints, and tutorial video slots on every module', () => {
    for (const m of RESIN_PRINTING_MODULES) {
      expect(m.tips?.length).toBeGreaterThan(0)
      expect(m.knowledgeCheck?.prompt).toBeTruthy()
      expect(m.knowledgeCheck?.options.some((o) => o.correct)).toBe(true)
      expect(m.tutorialVideo?.assetId).toBeTruthy()
      expect(m.tutorialVideo?.title).toBeTruthy()
    }
  })

  it('keeps teaching section roles paired with icons and labels', () => {
    const roles = Object.values(TEACHING_SECTION_ROLES)
    expect(roles.length).toBeGreaterThanOrEqual(10)
    for (const role of roles) {
      expect(role.label).toBeTruthy()
      expect(role.Icon).toBeTruthy()
      expect(role.iconWrap).toMatch(/bg-/)
      expect(role.border).toMatch(/border-/)
    }
  })

  it('resolves hero and diagram asset paths in media metadata', () => {
    expect(RESIN_HERO_MEDIA.src).toBe(RESIN_ASSET_PATHS.hero)
    expect(RESIN_MODULE_PRIMARY_MEDIA['safety-zones']?.src).toBe(
      RESIN_ASSET_PATHS.zonesDiagram
    )
    expect(RESIN_MODULE_PRIMARY_MEDIA['complete-workflow']?.src).toBe(
      RESIN_ASSET_PATHS.workflowDiagram
    )
  })
})
