import { getCdcPageByPath } from '@/lib/cdc/routes'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { marketingNavSheetGroups, navItems } from '@/lib/marketing/content'
import { artistInfrastructurePage } from '@/lib/marketing/institutions/artistInfrastructure'
import { institutionsHub } from '@/lib/marketing/institutions/hub'
import {
  INSTITUTIONAL_CALENDLY_URL,
  INSTITUTIONAL_COLLABORATION_AVAILABILITY,
  INSTITUTIONAL_EMAIL,
  INSTITUTIONAL_FAMILY_NAV,
  INSTITUTIONAL_SERVICES_AVAILABILITY,
} from '@/lib/marketing/institutions/shared'

function serializeOfferingContent() {
  return JSON.stringify({
    institutions: institutionsHub,
    artistInfrastructure: artistInfrastructurePage,
  })
}

describe('DCC institutional offering pages', () => {
  it('registers both routes for sitemap and breadcrumbs', () => {
    expect(getCdcPageByPath('/institutions')?.title).toBe('Digital Systems for Arts Institutions')
    expect(getCdcPageByPath('/artist-infrastructure')?.title).toBe(
      'Creative Infrastructure for Artists'
    )
    expect(getCdcPageByPath('/workshops')?.title).toBe('Workshops')
  })

  it('uses absolute metadata titles with DCC Miami', () => {
    const institutions = cdcPageMetadata('/institutions', {
      absoluteTitle: institutionsHub.meta.title,
    })
    const teaching = cdcPageMetadata('/artist-infrastructure', {
      absoluteTitle: artistInfrastructurePage.meta.title,
    })
    expect(institutions.title).toEqual({
      absolute: 'Digital Systems for Arts Institutions — DCC Miami',
    })
    expect(teaching.title).toEqual({
      absolute: 'Creative Infrastructure for Artists — DCC Miami',
    })
  })

  it('wires both pages into navItems and the For institutions sheet group', () => {
    expect(navItems.map((item) => item.href)).toEqual(
      expect.arrayContaining(['/institutions', '/artist-infrastructure'])
    )
    const group = marketingNavSheetGroups.find((g) => g.title === 'For institutions')
    expect(group?.hrefs).toEqual(['/institutions', '/artist-infrastructure'])
  })

  it('keeps the five-door family strip', () => {
    expect(INSTITUTIONAL_FAMILY_NAV.map((item) => item.href)).toEqual([
      '/artist-infrastructure',
      '/institutions',
      '/workshops',
      '/infra24',
      '/partners',
    ])
  })

  it('uses DCC contact channels and splits availability lines', () => {
    expect(INSTITUTIONAL_EMAIL).toBe('contact@dcc.miami')
    expect(INSTITUTIONAL_CALENDLY_URL).toContain('calendly.com/dccmiami')
    expect(institutionsHub.hero.availability).toBe(INSTITUTIONAL_SERVICES_AVAILABILITY)
    expect(artistInfrastructurePage.hero.availability).toBe(
      INSTITUTIONAL_COLLABORATION_AVAILABILITY
    )
    expect(institutionsHub.hero.availability).toMatch(/project-based/)
    expect(artistInfrastructurePage.hero.availability).toMatch(/fall 2026/)
  })

  it('does not pitch personal channels, DCC-as-client, or public seat pricing', () => {
    const blob = serializeOfferingContent()
    expect(blob).not.toMatch(/m@moises\.tech/)
    expect(blob).not.toMatch(/calendly\.com\/moisestech/)
    expect(blob).not.toMatch(/\$45/)
    expect(blob).not.toMatch(/\$360/)
    expect(institutionsHub.organizations.map((org) => org.id)).not.toContain('dcc')
    expect(institutionsHub.organizations.some((org) => /DCC Miami/.test(org.name))).toBe(false)
  })

  it('keeps flagship case studies outbound to moises.tech', () => {
    expect(institutionsHub.flagship.map((study) => study.href)).toEqual([
      'https://moises.tech/oolite-arts',
      'https://moises.tech/ica-miami',
      'https://moises.tech/bakehouse',
    ])
    expect(artistInfrastructurePage.ooliteProof.href).toBe('https://moises.tech/oolite-arts')
    expect(artistInfrastructurePage.ooliteProof.credit).toMatch(/Fabiola Larios/)
    expect(artistInfrastructurePage.positioning.cards[0]?.href).toBe('https://moises.tech')
  })
})
