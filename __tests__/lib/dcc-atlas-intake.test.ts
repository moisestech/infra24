/** @jest-environment node */
import { approvedAirtableProfile, approvedLinks, atlasIntakeSchema, ATLAS_DISCLOSURE_VERSION, ATLAS_PUBLIC_CONSENT } from '../../lib/dcc/community/intake'
jest.mock('server-only', () => ({}))
import { readPublicAtlas, stageAtlasSubmission } from '../../lib/dcc/community/airtable-atlas'

const submission = { submissionKey: '0df4bbe3-547e-4826-b041-62ff2402a571', name: 'Test Artist', email: 'private@example.test', summary: 'I make experimental objects.', practice: 'Sculpture', interests: ['making'], links: [{ label: 'Portfolio', url: 'https://example.test' }], publicConsent: true, disclosureVersion: ATLAS_DISCLOSURE_VERSION, company: '' }
const fields = { 'Atlas Publication State': 'Approved', 'Atlas Public Consent': true, 'Atlas Identity Verified': true, 'Public Profile?': true, 'Profile Slug': 'test-artist', 'Display Name': 'Test Artist', 'Short Bio': 'I make experimental objects.', 'Public Skills': ['Sculpture'], 'Atlas Interests': ['making', 'inferred-tag'], 'Atlas Public Links': JSON.stringify(submission.links), Email: 'private@example.test', Phone: 'secret', Notes: 'internal', Name: 'private alias' }
const originalFetch = global.fetch
beforeEach(() => {
  process.env.AIRTABLE_DCC_ATLAS_API_KEY = 'test-token'
  process.env.AIRTABLE_DCC_ATLAS_BASE_ID = 'test-base'
  process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE = 'test-people'
  process.env.AIRTABLE_DCC_ATLAS_INTAKE_TABLE = 'test-intake'
  process.env.DCC_ATLAS_INTAKE_ENABLED = 'true'
})
afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks() })

describe('Public profile requests and publication', () => {
  it('validates required consent, bounded content, links and honeypot', () => {
    expect(atlasIntakeSchema.safeParse(submission).success).toBe(true)
    for (const changes of [{ publicConsent: false }, { company: 'bot' }, { links: [{ label: 'Bad', url: 'javascript:alert(1)' }] }, { name: 'A'.repeat(81) }, { email: 'not-email' }, { interests: ['not-in-poll'] }, { admin: true }]) {
      expect(atlasIntakeSchema.safeParse({ ...submission, ...changes }).success).toBe(false)
    }
  })
  it.each(['Atlas Public Consent', 'Atlas Identity Verified', 'Public Profile?'])('requires affirmative %s', (key) => {
    expect(approvedAirtableProfile({ ...fields, [key]: false })).toBeNull()
    expect(approvedAirtableProfile({ ...fields, [key]: undefined })).toBeNull()
  })
  it('strips private fields, rejects unpublished/withdrawn profiles and unsafe links', () => {
    const profile = approvedAirtableProfile(fields)!
    expect(profile.interests).toEqual(['making'])
    expect(JSON.stringify(profile)).not.toMatch(/private|secret|internal|test-token/)
    expect(approvedAirtableProfile({ ...fields, 'Atlas Publication State': 'Withdrawn' })).toBeNull()
    expect(approvedLinks('[{"label":"x","url":"https://user:pass@example.test"}]')).toEqual([])
    expect(approvedLinks('not-json')).toEqual([])
  })
  it('reads paginated public fields and rechecks approval even after provider filtering', async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify({ records: [{ id: 'secret-record', fields }], offset: 'page2' })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ records: [{ id: 'private', fields: { ...fields, 'Atlas Public Consent': false } }] })))
    global.fetch = fetcher
    const profiles = await readPublicAtlas()
    expect(profiles).toHaveLength(1)
    const firstUrl = new URL(String(fetcher.mock.calls[0][0]))
    expect(firstUrl.searchParams.getAll('fields[]')).not.toContain('Email')
    expect(fetcher.mock.calls[1][0].searchParams.get('offset')).toBe('page2')
    expect(JSON.stringify(profiles)).not.toContain('secret-record')
  })
  it('holds duplicate public slugs out of the map', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({ records: [{ id: 'a', fields }, { id: 'b', fields: { ...fields, 'Display Name': 'Someone else' } }] })))
    expect(await readPublicAtlas()).toEqual([])
  })
  it('keeps submissions staged and records the exact disclosure', async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify({ records: [] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ records: [{ id: 'internal-submission' }] })))
    global.fetch = fetcher
    await stageAtlasSubmission(atlasIntakeSchema.parse(submission))
    const payload = JSON.parse(fetcher.mock.calls[1][1].body)
    expect(payload.records[0].fields['Review State']).toBe('Pending')
    expect(payload.records[0].fields['Consent Text']).toBe(ATLAS_PUBLIC_CONSENT)
    expect(payload.records[0].fields['Verification Email']).toBe('private@example.test')
    expect(payload.records[0].fields['Atlas Publication State']).toBeUndefined()
  })
  it('does not create a second pending request when a retry key already exists', async () => {
    const fetcher = jest.fn().mockResolvedValue(new Response(JSON.stringify({ records: [{ id: 'existing' }] })))
    global.fetch = fetcher
    await stageAtlasSubmission(atlasIntakeSchema.parse(submission))
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
  it('fails honestly on provider capacity errors and stays closed when disabled', async () => {
    const fetcher = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify({ records: [] })))
      .mockResolvedValueOnce(new Response('private-provider-error', { status: 422 }))
    global.fetch = fetcher
    await expect(stageAtlasSubmission(atlasIntakeSchema.parse(submission))).rejects.toThrow('ATLAS_PROVIDER_UNAVAILABLE')
    process.env.DCC_ATLAS_INTAKE_ENABLED = 'false'
    await expect(stageAtlasSubmission(atlasIntakeSchema.parse(submission))).rejects.toThrow('ATLAS_NOT_CONFIGURED')
  })
})
