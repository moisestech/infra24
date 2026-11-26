/** @jest-environment node */
import { GET } from '@/app/api/dcc/steward/identity-queue/route'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError } from '@/lib/dcc/membership/profile-store'
import { createClient } from '@supabase/supabase-js'

jest.mock('@/lib/dcc/membership/steward-access', () => ({ requireDccSteward: jest.fn() }))
jest.mock('@/lib/dcc/membership/profile-store', () => ({
  MemberAccessError: class extends Error {
    constructor(public status: number, public code: string) { super(code) }
  },
  PRIVATE_HEADERS: { 'Cache-Control': 'private, no-store, max-age=0' },
}))
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }))
const staff = requireDccSteward as jest.Mock
const client = createClient as jest.Mock
const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY
beforeEach(() => {
  jest.resetAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only'
  staff.mockReturnValue('user_test_steward')
})
afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
  else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
  if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY
  else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey
})
describe('founder identity review queue', () => {
  it.each([401,403])('rejects access with %i before database initialization', async status => {
    staff.mockImplementation(() => { throw new MemberAccessError(status,'not_authorized') })
    const response = await GET()
    expect(response.status).toBe(status)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(client).not.toHaveBeenCalled()
  })
  it('returns only safe review fields even if provider returns extra properties', async () => {
    const holds = { select:jest.fn().mockReturnThis(), eq:jest.fn().mockReturnThis(),
      order:jest.fn().mockReturnThis(),limit:jest.fn().mockResolvedValue({data:[{
        id:'test-binding',state:'review_required',verified_at:'2026-11-25',
        updated_at:'2026-11-25',clerk_user_id:'private-subject',email:'private@example.test',
      }],error:null}) }
    const jobs = {select:jest.fn().mockReturnThis(),in:jest.fn().mockResolvedValue({data:[{
      binding_id:'test-binding',status:'review_required',audit_reason:'legacy_people_email_collision',
      private_note:'private',airtable_person_id:'recPrivate',
    }],error:null})}
    client.mockReturnValue({from:jest.fn().mockImplementation((table:string) =>
      table==='dcc_platform_member_bindings'?holds:jobs)})
    const response = await GET()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({requests:[{requestId:'test-binding',state:'review_required',
      verified:true,updatedAt:'2026-11-25',reason:'legacy_people_email_collision',jobStatus:'review_required'}]})
  })
})
