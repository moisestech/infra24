import {
  EDGE_ZONES_SECTION_PATHS,
  edgeZonesSectionHref,
  isEdgeZonesSectionPath,
} from '@/lib/marketing/edgezones-sections'
import {
  getEdgeZonesNavAnchors,
  getEdgeZonesPortal,
  parseEdgeZonesLocale,
} from '@/lib/marketing/edgezones-content'

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

describe('edgeZones locale', () => {
  it('parses es and falls back invalid to en', () => {
    expect(parseEdgeZonesLocale('es')).toBe('es')
    expect(parseEdgeZonesLocale('en')).toBe('en')
    expect(parseEdgeZonesLocale('fr')).toBe('en')
    expect(parseEdgeZonesLocale(null)).toBe('en')
  })

  it('includes concept themes and English nav anchors', () => {
    const portal = getEdgeZonesPortal('en')
    expect(portal.concept.themes).toHaveLength(6)
    expect(getEdgeZonesNavAnchors('en').map((a) => a.id)).toEqual([
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

  it('provides Spanish nav labels', () => {
    const anchors = getEdgeZonesNavAnchors('es')
    expect(anchors.map((a) => a.id)).toEqual(getEdgeZonesNavAnchors('en').map((a) => a.id))
    expect(anchors.find((a) => a.id === 'roles')?.label).toBe('Roles')
    expect(anchors.find((a) => a.id === 'join')?.label).toBe('Unirse')
  })
})
