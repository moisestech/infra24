import {
  DIGITAL_LAB_QGIV_HUB_URL,
  DIGITAL_LAB_QGIV_OFFERINGS,
  findDigitalLabQgivOfferingByQuery,
  getDigitalLabQgivOffering,
  getDigitalLabQgivOfferingsByKind,
  resolveDigitalLabQgivUrlForWorkshopSlug,
} from '@/lib/orgs/oolite/digital-lab-qgiv-offerings'

describe('digital-lab-qgiv-offerings', () => {
  it('lists twelve bookable offerings', () => {
    expect(DIGITAL_LAB_QGIV_OFFERINGS).toHaveLength(12)
  })

  it('resolves vibe coding workshop slug to may26 event', () => {
    expect(resolveDigitalLabQgivUrlForWorkshopSlug('vibe-coding-and-net-art')).toBe(
      'https://secure.qgiv.com/for/digitallab/event/may26/'
    )
  })

  it('falls back to hub for unknown workshop slugs', () => {
    expect(resolveDigitalLabQgivUrlForWorkshopSlug('unknown-workshop')).toBe(
      DIGITAL_LAB_QGIV_HUB_URL
    )
  })

  it('groups offerings by kind', () => {
    expect(getDigitalLabQgivOfferingsByKind('workshop')).toHaveLength(2)
    expect(getDigitalLabQgivOfferingsByKind('consulting')).toHaveLength(8)
    expect(getDigitalLabQgivOfferingsByKind('visit')).toHaveLength(2)
  })

  it('finds offerings by loose query', () => {
    expect(findDigitalLabQgivOfferingByQuery('seo audit')?.key).toBe(
      'seo-audit-consulting'
    )
    expect(getDigitalLabQgivOffering('360-capture')?.title).toBe('360 Capture')
  })
})
