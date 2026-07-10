import {
  EDGE_ZONES_SECTION_PATHS,
  edgeZonesSectionHref,
  isEdgeZonesSectionPath,
} from '@/lib/marketing/edgezones-sections'
import { edgeZonesNavAnchors, edgeZonesPortal } from '@/lib/marketing/edgezones-content'

describe('edgezones-sections', () => {
  it('includes pdf and core PDF sub-paths', () => {
    expect(EDGE_ZONES_SECTION_PATHS).toContain('pdf')
    expect(EDGE_ZONES_SECTION_PATHS).toContain('artists')
    expect(EDGE_ZONES_SECTION_PATHS).toContain('support')
    expect(EDGE_ZONES_SECTION_PATHS).not.toContain('exhibition')
    expect(EDGE_ZONES_SECTION_PATHS).not.toContain('vision')
  })

  it('builds hash hrefs for sections', () => {
    expect(edgeZonesSectionHref('pdf')).toBe('/edgezones#pdf')
    expect(edgeZonesSectionHref('artists')).toBe('/edgezones#artists')
  })

  it('rejects unknown section paths', () => {
    expect(isEdgeZonesSectionPath('foo')).toBe(false)
    expect(isEdgeZonesSectionPath('pdf')).toBe(true)
  })
})

describe('edgeZonesPortal proposal copy', () => {
  it('includes concept themes and nav anchors', () => {
    expect(edgeZonesPortal.concept.themes).toHaveLength(6)
    expect(edgeZonesNavAnchors.map((a) => a.id)).toEqual([
      'overview',
      'roles',
      'concept',
      'artists',
      'support',
      'programs',
      'archive',
      'pdf',
      'join',
    ])
  })
})
