/** @jest-environment node */
import { GET } from '@/app/api/dcc/steward/identity-queue/route'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError } from '@/lib/dcc/membership/profile-store'
import { createClient } from '@supabase/supabase-js'

jest.mock('server-only',()=>({}))
jest.mock('@clerk/nextjs/server',()=>({clerkClient:{}}))
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
const originalEnv = process.env
const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY
beforeEach(() => {
  jest.resetAllMocks()
  process.env={...originalEnv,DCC_MEMBER_EVENT_CAPTURE_ENABLED:'true',DCC_CLERK_INSTANCE_ID:'test-instance',
    DCC_MEMBER_CUTOVER_ISO:'2026-11-01T00:00:00Z'}
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only'
  staff.mockResolvedValue('user_test_steward')
})
afterEach(() => {
  process.env=originalEnv
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
    const rpc=jest.fn().mockResolvedValue({data:[{
      binding_id:'test-binding',verified:true,updated_at:'2026-11-25',audit_reason:'legacy_people_email_collision',
      job_status:'review_required',stage:'held',version:0,expires_at:null,
      email:'private@example.test',clerk_user_id:'private-subject',person_id:'private-person',challenge_digest:'private',
    }],error:null})
    client.mockReturnValue({rpc})
    const response=await GET()
    expect(response.status).toBe(200)
    expect(rpc).toHaveBeenCalledWith('dcc_founder_identity_queue',{p_instance:'test-instance'})
    expect(await response.json()).toEqual({requests:[{requestId:'test-binding',verified:true,updatedAt:'2026-11-25',
      reason:'legacy_people_email_collision',jobStatus:'review_required',stage:'held',version:0,expiresAt:null}]})
  })
})
