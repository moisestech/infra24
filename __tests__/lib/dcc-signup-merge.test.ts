import { mergeSignupIntoExistingPerson } from '@/lib/dcc/signup/merge-person-fields'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'

const F = DEFAULT_DCC_PEOPLE_FIELD_MAP

describe('mergeSignupIntoExistingPerson', () => {
  it('merges interest tags and appends agent note', () => {
    const existing = {
      id: 'rec1',
      fields: {
        [F.name]: 'Existing Name',
        [F.interestTags]: ['Workshops'],
        [F.practiceTags]: ['Video'],
        [F.agentNotes]: 'Prior note',
        [F.utmSource]: 'old',
      },
    }

    const merged = mergeSignupIntoExistingPerson(
      existing,
      {
        [F.name]: 'New Name',
        [F.interestTags]: ['Join the DCC Index'],
        [F.practiceTags]: ['Digital Culture'],
        [F.utmSource]: 'tv',
        [F.signupSource]: 'TV QR',
      },
      { signupSource: 'dcc-tv', signupSourceLabel: 'TV QR', utmCampaign: 'dcc_tv_launch' }
    )

    expect(merged[F.name]).toBeUndefined()
    expect(merged[F.interestTags]).toEqual(['Workshops', 'Join the DCC Index'])
    expect(merged[F.practiceTags]).toEqual(['Video', 'Digital Culture'])
    expect(merged[F.utmSource]).toBe('tv')
    expect(merged[F.signupSource]).toBe('TV QR')
    expect(String(merged[F.agentNotes])).toContain('Signup resubmit')
    expect(String(merged[F.agentNotes])).toContain('TV QR')
  })
})
