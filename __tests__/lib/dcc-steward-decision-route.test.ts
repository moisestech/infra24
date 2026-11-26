/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/dcc/steward/decision/route'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { decideStewardPublication } from '@/lib/dcc/membership/steward-publication'
import { MemberAccessError } from '@/lib/dcc/membership/profile-store'

jest.mock('server-only',()=>({}))
jest.mock('@/lib/dcc/membership/steward-access',()=>({requireDccSteward:jest.fn()}))
jest.mock('@/lib/dcc/membership/steward-publication',()=>({decideStewardPublication:jest.fn()}))
const requireStaff=requireDccSteward as jest.Mock
const decide=decideStewardPublication as jest.Mock
const savedFlag=process.env.DCC_STEWARD_PUBLICATION_ENABLED
const requestId='f4e3d2c1-1234-4567-8abc-123456789123'
const body={requestId,revision:2,action:'approve',slug:'artist-example'}
function req(payload:unknown,origin:string|null='https://dcc.miami') {
  return new NextRequest('https://dcc.miami/api/dcc/steward/decision',{
    method:'POST',
    headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},
    body:JSON.stringify(payload),
  })
}
beforeEach(()=>{
  jest.clearAllMocks()
  process.env.DCC_STEWARD_PUBLICATION_ENABLED='true'
  requireStaff.mockResolvedValue('user_staff_subject')
  decide.mockResolvedValue({state:'approved',public:true,slug:'artist-example'})
})
afterAll(()=>{
  if(savedFlag===undefined)delete process.env.DCC_STEWARD_PUBLICATION_ENABLED
  else process.env.DCC_STEWARD_PUBLICATION_ENABLED=savedFlag
})
describe('DCC human publication decision HTTP boundary',()=>{
  it('blocks caller without staff identity before any external write',async()=>{
    requireStaff.mockImplementation(async()=>{throw new MemberAccessError(403,'staff_access_required')})
    const response=await POST(req(body))
    expect(response.status).toBe(403)
    expect(decide).not.toHaveBeenCalled()
  })
  it('blocks public publication when owner rollout is disabled',async()=>{
    process.env.DCC_STEWARD_PUBLICATION_ENABLED='false'
    const response=await POST(req(body))
    expect(response.status).toBe(503)
    expect(decide).not.toHaveBeenCalled()
  })
  it('denies cross-site and missing-origin submissions',async()=>{
    for(const origin of ['https://evil.example',null]){
      const response=await POST(req(body,origin))
      expect(response.status).toBe(403)
    }
    expect(decide).not.toHaveBeenCalled()
  })
  it('blocks injected CRM IDs, invalid slug and forged approval claims',async()=>{
    for(const payload of [
      {...body,requestId:'recAirtableRecord'},
      {...body,slug:'//evil.test'},
      {...body,reviewer:'user_admin'},
      {...body,consent:true},
      {...body,revision:-1},
    ]){
      const response=await POST(req(payload))
      expect(response.status).toBe(400)
    }
    expect(decide).not.toHaveBeenCalled()
  })
  it('allows staff-reviewed, version-locked approval with no-store',async()=>{
    const response=await POST(req(body))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(decide).toHaveBeenCalledWith(body,'user_staff_subject')
  })
})
