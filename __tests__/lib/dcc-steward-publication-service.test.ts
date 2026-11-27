/** @jest-environment node */
import { createClient } from '@supabase/supabase-js'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'
import { decideStewardPublication } from '@/lib/dcc/membership/steward-publication'
jest.mock('server-only',()=>({}))
jest.mock('@supabase/supabase-js',()=>({createClient:jest.fn()}))
jest.mock('@/lib/airtable/client',()=>({
  fetchAllRecords:jest.fn(),patchAirtableRecord:jest.fn(),
}))

const connect=createClient as jest.Mock
const fetchPeople=fetchAllRecords as jest.Mock
const patchPerson=patchAirtableRecord as jest.Mock
const bindingId='a1b2c3d4-1234-4567-8abc-123456789123'
const personId='rec12345678901234'
const token='b42c3d41-2345-4567-89ab-234567890123'
const reviewer='user_staff_member_1'
const request={
  requestId:bindingId,revision:3,action:'approve' as const,slug:'example-artist',
}
const profile={
  display_name:'Example Artist',
  summary:'Digital fabrication and participatory installation art.',
  practices:['Creative Coding'],
  interests:['making','interactive'],
  public_links:[{label:'Website',url:'https://example.org/'}],
  revision:3,
  binding_id:bindingId,
  public_request_state:'pending_review',
  request_disclosure_version:'dcc-public-profile-request-v1-2026-11-22',
  public_requested_at:'2026-11-25T12:00:00Z',
}
const member={id:bindingId,state:'active',verified_at:'2026-11-24T14:00:00Z',airtable_person_id:personId}
let draft:typeof profile, binding:typeof member
const rpc=jest.fn()
function dbFrom(table:string) {
  const row=table==='dcc_member_profile_drafts'?draft:
    table==='dcc_platform_member_bindings'?binding:undefined
  if(!row)throw Error('unexpected table')
  return {select:()=>({eq:()=>({maybeSingle:async()=>({data:row,error:null})})})}
}
const variables=['DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED','DCC_STEWARD_PUBLICATION_ENABLED','NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','AIRTABLE_DCC_ATLAS_BASE_ID','AIRTABLE_DCC_ATLAS_PEOPLE_TABLE','AIRTABLE_DCC_ATLAS_API_KEY'] as const
const saved=Object.fromEntries(variables.map(k=>[k,process.env[k]]))
beforeEach(()=>{
  jest.clearAllMocks()
  draft={...profile}
  binding={...member}
  process.env.DCC_STEWARD_PUBLICATION_ENABLED='true'
  process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='true'
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://project.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY='server-test-key'
  process.env.AIRTABLE_DCC_ATLAS_BASE_ID='test-base'
  process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE='test-people'
  process.env.AIRTABLE_DCC_ATLAS_API_KEY='test-pat'
  connect.mockReturnValue({from:dbFrom,rpc})
  rpc.mockImplementation(async(name:string)=>({
    data:name==='dcc_claim_steward_publication'?token:
      name==='dcc_finalize_steward_publication'?'approved':'returned',
    error:null,
  }))
  fetchPeople.mockResolvedValueOnce([{
    id:personId,fields:{'DCC Website Member Binding ID':bindingId},
  }]).mockResolvedValueOnce([])
  patchPerson.mockImplementation(async(_base:string,_table:string,_key:string,_id:string,fields:Record<string,unknown>)=>({
    id:personId,fields:{...fields,'DCC Website Member Binding ID':bindingId},
  }))
})
afterAll(()=>{for(const key of variables){
  const value=saved[key]
  if(value===undefined)delete process.env[key]
  else process.env[key]=value
}})

describe('DCC BDD — actual steward to Airtable publication orchestration',()=>{
  it('approves only after ID verification, slug lookup, provider echo, and final SQL grant',async()=>{
    const result=await decideStewardPublication(request,reviewer)
    expect(result).toEqual({
      state:'approved',public:true,slug:'example-artist',
      url:'/network/community/example-artist',
    })
    expect(fetchPeople).toHaveBeenCalledTimes(2)
    expect(patchPerson).toHaveBeenCalledTimes(1)
    expect(patchPerson.mock.calls[0][4]).toMatchObject({
      'Atlas Publication State':'Approved',
      'Public Profile?':true,
      'Atlas Public Consent':true,
      'Profile Slug':'example-artist',
    })
    expect(rpc).toHaveBeenCalledWith('dcc_claim_steward_publication',expect.objectContaining({
      p_revision:3,p_binding:bindingId,p_reviewer:reviewer,
    }))
    expect(rpc).toHaveBeenCalledWith('dcc_finalize_steward_publication',expect.objectContaining({
      p_binding:bindingId,p_token:token,p_success:true,
    }))
  })

  it('cannot approve a stale Passport revision or withdrawn membership',async()=>{
    draft={...profile,revision:4}
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:409,code:'review_request_changed'})
    expect(patchPerson).not.toHaveBeenCalled()
    expect(rpc).not.toHaveBeenCalled()
  })

  it('cannot approve a People record whose canonical binding differs',async()=>{
    fetchPeople.mockReset().mockResolvedValueOnce([{
      id:personId,fields:{'DCC Website Member Binding ID':'another-member'},
    }])
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:409,code:'identity_link_requires_review'})
    expect(patchPerson).not.toHaveBeenCalled()
  })

  it('holds an already-used public slug',async()=>{
    fetchPeople.mockReset().mockResolvedValueOnce([{
      id:personId,fields:{'DCC Website Member Binding ID':bindingId},
    }]).mockResolvedValueOnce([{id:'rec99999999999999',fields:{'Profile Slug':'example-artist'}}])
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:409,code:'public_slug_already_used'})
    expect(patchPerson).not.toHaveBeenCalled()
  })

  it.each([
    ['Public Skills',['Unreviewed Skill']],
    ['Atlas Interests',['learning']],
    ['Atlas Public Links','[{"label":"Unreviewed","url":"https://example.net/"}]'],
  ])('does not approve a provider echo that changes %s',async(field,unexpected)=>{
    patchPerson.mockImplementationOnce(async(_base:string,_table:string,_key:string,_id:string,fields:Record<string,unknown>)=>({
      id:personId,fields:{...fields,'DCC Website Member Binding ID':bindingId,[field as string]:unexpected},
    }))
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:503,code:'publication_provider_uncertain'})
    expect(rpc).toHaveBeenCalledWith('dcc_finalize_steward_publication',expect.objectContaining({p_success:false}))
    expect(rpc).not.toHaveBeenCalledWith('dcc_finalize_steward_publication',expect.objectContaining({p_success:true}))
  })

  it('holds provider failures as uncertain and never declares approval',async()=>{
    patchPerson.mockRejectedValueOnce(new Error('unknown provider outcome'))
    rpc.mockImplementation(async(name:string)=>({
      data:name==='dcc_claim_steward_publication'?token:'uncertain',error:null,
    }))
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:503,code:'publication_provider_uncertain'})
    expect(rpc).toHaveBeenCalledWith('dcc_finalize_steward_publication',
      expect.objectContaining({p_success:false}))
  })

  it('rolls back provider flags on stale finalization while the database grant stays closed',async()=>{
    rpc.mockImplementation(async(name:string)=>({
      data:name==='dcc_claim_steward_publication'?token:'uncertain',error:null,
    }))
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:409,code:'publication_review_stale_or_uncertain'})
    expect(patchPerson).toHaveBeenCalledTimes(2)
    expect(patchPerson.mock.calls[1][4]).toMatchObject({
      'Atlas Public Consent':false,
      'Public Profile?':false,
      'Atlas Publication State':'Hidden',
    })
  })

  it('stages an approved grant without claiming public visibility while the public switch is off',async()=>{
    process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='false'
    const result=await decideStewardPublication(request,reviewer)
    expect(result).toEqual({state:'approved',public:false,slug:'example-artist'})
  })

  it('is disabled without an explicit independent publication flag',async()=>{
    process.env.DCC_STEWARD_PUBLICATION_ENABLED='false'
    await expect(decideStewardPublication(request,reviewer))
      .rejects.toMatchObject({status:503,code:'publication_not_enabled'})
    expect(patchPerson).not.toHaveBeenCalled()
  })

  it('can reject a request without ever writing to Airtable',async()=>{
    rpc.mockImplementation(async()=>({data:'rejected',error:null}))
    const result=await decideStewardPublication({
      requestId:bindingId,revision:3,action:'reject',
    },reviewer)
    expect(result).toMatchObject({state:'rejected',public:false})
    expect(fetchPeople).not.toHaveBeenCalled()
    expect(patchPerson).not.toHaveBeenCalled()
    expect(rpc).toHaveBeenCalledWith('dcc_return_steward_publication',
      expect.objectContaining({p_action:'rejected'}))
  })
})
