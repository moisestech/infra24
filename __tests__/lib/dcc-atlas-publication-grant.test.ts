/** @jest-environment node */
import { readPublicAtlas } from '@/lib/dcc/community/airtable-atlas'
import { createClient } from '@supabase/supabase-js'
jest.mock('server-only',()=>({}))
jest.mock('@supabase/supabase-js',()=>({createClient:jest.fn()}))

const db=createClient as jest.Mock
const bindingId='a1b2c3d4-1234-4567-8abc-123456789123'
const recordId='rec12345678901234'
const approved={
  'DCC Website Member Binding ID':bindingId,
  'Atlas Publication State':'Approved','Atlas Public Consent':true,
  'Atlas Identity Verified':true,'Public Profile?':true,
  'Profile Slug':'consenting-member','Display Name':'Consenting Member',
  'Short Bio':'Fabrication and community learning',
  'Public Skills':['Creative Coding'],'Atlas Interests':['making'],
  'Atlas Public Links':'[]',
}
const savedFetch=global.fetch
const savedFlag=process.env.DCC_STEWARD_PUBLICATION_ENABLED
const savedVisibility=process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED
const fetcher=jest.fn()
beforeEach(()=>{
  jest.clearAllMocks()
  process.env.AIRTABLE_DCC_ATLAS_API_KEY='test-key'
  process.env.AIRTABLE_DCC_ATLAS_BASE_ID='test-base'
  process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE='test-people'
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://project.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-server-key'
  process.env.DCC_STEWARD_PUBLICATION_ENABLED='true'
  process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='true'
  fetcher.mockResolvedValue(new Response(JSON.stringify({
    records:[{id:recordId,fields:approved}],
  })))
  global.fetch=fetcher
})
afterAll(()=>{
  global.fetch=savedFetch
  if(savedFlag===undefined)delete process.env.DCC_STEWARD_PUBLICATION_ENABLED
  else process.env.DCC_STEWARD_PUBLICATION_ENABLED=savedFlag
  if(savedVisibility===undefined)delete process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED
  else process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED=savedVisibility
})
function setDb(state:'approved'|'withdrawn'|'missing') {
  db.mockReturnValue({from:(table:string)=>{
    if(table==='dcc_platform_member_bindings')return {
      select:()=>({in:()=>Promise.resolve({
        data:[{id:bindingId,state:'active',airtable_person_id:recordId}],error:null,
      })}),
    }
    if(table==='dcc_member_publication_grants')return {
      select:()=>({in:()=>({eq:()=>Promise.resolve({
        data:state==='missing'?[]:[{
          binding_id:bindingId,state,slug:'consenting-member',airtable_person_id:recordId,
        }],error:null,
      })})}),
    }
    throw new Error('unexpected private table')
  }})
}
describe('website member Atlas projection requires a current private publication grant',()=>{
  it('shows a DCC website profile only when Airtable and DB agree on approved identity',async()=>{
    setDb('approved')
    const profiles=await readPublicAtlas()
    expect(profiles).toHaveLength(1)
    expect(profiles[0].slug).toBe('consenting-member')
    expect(JSON.stringify(profiles)).not.toContain(bindingId)
    expect(JSON.stringify(profiles)).not.toContain(recordId)
  })
  it('does not publicly show approved website members before the independent visibility switch',async()=>{
    setDb('approved')
    process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='false'
    expect(await readPublicAtlas()).toEqual([])
  })
  it.each(['withdrawn','missing'] as const)('hides website profile after %s grant',async state=>{
    setDb(state)
    expect(await readPublicAtlas()).toEqual([])
  })
  it('fails closed if the private publication gate cannot be checked',async()=>{
    db.mockReturnValue({from:()=>({select:()=>({in:()=>Promise.resolve({
      data:null,error:{message:'private database unavailable'},
    })})})})
    await expect(readPublicAtlas()).rejects.toThrow('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
  })
})
