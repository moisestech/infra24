import {
  mergeAttribution,
  parseAttributionFromSearchParams,
} from '@/lib/dcc/signup/attribution'
import { resolveSignupSourceLabel } from '@/lib/dcc/signup/signup-source-labels'
import { mapQuickSignupToAirtableFields } from '@/lib/dcc/signup/map-to-airtable'
import { getPathwayById } from '@/lib/dcc/signup/pathways'
import { dccSignupQuickSchema } from '@/lib/dcc/signup/schema-quick'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'

describe('dcc signup attribution', () => {
  it('parses qr_code_id alias', () => {
    const attr = parseAttributionFromSearchParams('?qr_code_id=dcc_tv_main')
    expect(attr.qrCodeId).toBe('dcc_tv_main')
  })

  it('maps source dcc-tv to Signup Source label TV QR', () => {
    expect(resolveSignupSourceLabel('dcc-tv')).toBe('TV QR')
  })

  it('parses UTM and qr from search params', () => {
    const attr = parseAttributionFromSearchParams(
      '?source=dcc-tv&utm_source=tv&utm_medium=qr&utm_campaign=dcc_tv_launch&qr=dcc_tv_main'
    )
    expect(attr.signupSource).toBe('dcc-tv')
    expect(attr.utmSource).toBe('tv')
    expect(attr.utmCampaign).toBe('dcc_tv_launch')
    expect(attr.qrCodeId).toBe('dcc_tv_main')
  })

  it('preserves first-touch landing page on merge', () => {
    const merged = mergeAttribution(
      { landingPage: '/edgezones', utmCampaign: 'first' },
      { landingPage: '/network/signup', utmCampaign: 'second' }
    )
    expect(merged.landingPage).toBe('/edgezones')
    expect(merged.utmCampaign).toBe('second')
  })

  it('maps quick signup with UTM fields', () => {
    const parsed = dccSignupQuickSchema.safeParse({
      formMode: 'quick',
      fullName: 'Jane Artist',
      email: 'jane@example.com',
      contactCategory: 'Artist',
      interestTags: ['Join the DCC Index'],
      consentAnswer: 'yes',
      utmSource: 'tv',
      utmMedium: 'qr',
      utmCampaign: 'dcc_tv_launch',
      source: 'dcc-tv',
    })
    expect(parsed.success).toBe(true)
    if (!parsed.success) return

    const fields = mapQuickSignupToAirtableFields(parsed.data, getPathwayById('join_dcc_index'))
    const F = DEFAULT_DCC_PEOPLE_FIELD_MAP
    expect(fields[F.utmSource]).toBe('tv')
    expect(fields[F.utmCampaign]).toBe('dcc_tv_launch')
    expect(fields[F.signupSource]).toBe('TV QR')
    expect(fields[F.source]).toBe('Online')
    expect(fields[F.consentToUpdates]).toBe(true)
  })
})
