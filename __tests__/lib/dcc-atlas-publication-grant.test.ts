/** @jest-environment node */
import { readPublicAtlas } from '@/lib/dcc/community/airtable-atlas'
import { createClient } from '@supabase/supabase-js'
jest.mock('server-only',()=>({}))
jest.mock('@supabase/supabase-js',()=>({createClient:jest.fn()}))
const db=createClient as jest.Mock
const bindingId='a1b2c3d4-1234-4567-8abc-123456789123'
const recordId='rec12345678901234'
const snapshot={slug:'consenting-member',display_name:'Approved artist',summary:'Approved biography',practices:['Creative Coding'],interests:['making'],public_links:[]}
const mutated={'DCC Website Member Binding ID':bindingId,'Atlas Publication State':'Approved','Atlas Public Consent':true,'Atlas Identity Verified':true,'Public Profile?':true,'Profile Slug':'changed-slug','Display Name':'Unreviewed CRM name','Short Bio':'Unreviewed CRM biography','Public Skills':['Unreviewed skill'],'Atlas Interests':['learning'],'Atlas Public Links':'[]'}
const savedFetch=global.fetch
const vars=['DCC_STEWARD_PUBLICATION_ENABLED','DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED','AIRTABLE_DCC_ATLAS_API_KEY','AIRTABLE_DCC_ATLAS_BASE_ID','AIRTABLE_DCC_ATLAS_PEOPLE_TABLE','NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'] as const
const saved=Object.fromEntries(vars.map(k=>[k,process.env[k]]))
const fetcher=jest.fn()
const rpc=jest.fn()
function setRows(rows:unknown[],bound=true) {
  rpc.mockResolvedValue({data:rows,error:null})
  db.mockReturnValue({rpc,from:()=>({select:()=>({in:()=>Promise.resolve({data:bound?[{airtable_person_id:recordId}]:[],error:null})})})})
}
beforeEach(()=>{
  jest.clearAllMocks()
  process.env.DCC_STEWARD_PUBLICATION_ENABLED='true'
  process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='true'
  process.env.AIRTABLE_DCC_ATLAS_API_KEY='test-key'
  process.env.AIRTABLE_DCC_ATLAS_BASE_ID='test-base'
  process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE='test-people'
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://project.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-server-key'
  fetcher.mockResolvedValue(new Response(JSON.stringify({records:[{id:recordId,fields:mutated}]})))
  global.fetch=fetcher
  setRows([snapshot])
})
afterAll(()=>{
  global.fetch=savedFetch
  for(const k of vars) {if(saved[k]===undefined) delete process.env[k]; else process.env[k]=saved[k]}
})
describe('immutable approved website Passport snapshots',()=>{
  it('reads exact reviewed content rather than mutable CRM fields',async()=>{
    const profiles=await readPublicAtlas()
    expect(profiles).toEqual([{slug:'consenting-member',name:'Approved artist',summary:'Approved biography',practice:['Creative Coding'],interests:['making'],links:[]}])
    expect(JSON.stringify(profiles)).not.toMatch(/Unreviewed|changed-slug|rec12345678901234|a1b2c3d4/)
    expect(rpc).toHaveBeenCalledWith('dcc_list_approved_passports')
  })
  it('preserves the approved version even when the replacement hides CRM approval',async()=>{
    fetcher.mockResolvedValueOnce(new Response(JSON.stringify({records:[]})))
    expect(await readPublicAtlas()).toHaveLength(1)
  })
  it('preserves SQL publication during a legacy Airtable outage',async()=>{
    fetcher.mockRejectedValueOnce(new Error('provider unavailable'))
    expect((await readPublicAtlas()).map(profile=>profile.slug)).toEqual([snapshot.slug])
  })
  it('never exposes a bound CRM record after withdrawal, even if its marker is removed',async()=>{
    setRows([])
    fetcher.mockResolvedValueOnce(new Response(JSON.stringify({records:[{id:recordId,fields:{...mutated,'DCC Website Member Binding ID':undefined}}]})))
    expect(await readPublicAtlas()).toEqual([])
  })
  it('does not fall back to provider approval flags without a snapshot',async()=>{
    setRows([])
    expect(await readPublicAtlas()).toEqual([])
  })
  it('does not show snapshots when the independent visibility switch is disabled',async()=>{
    process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED='false'
    expect(await readPublicAtlas()).toEqual([])
    expect(rpc).not.toHaveBeenCalled()
  })
  it('does not let a legacy provider duplicate hide or replace an approved slug',async()=>{
    fetcher.mockResolvedValueOnce(new Response(JSON.stringify({records:[{id:'recLegacy',fields:{...mutated,'DCC Website Member Binding ID':undefined,'Profile Slug':snapshot.slug}}]})))
    setRows([snapshot],false)
    expect((await readPublicAtlas()).map(p=>p.name)).toEqual(['Approved artist'])
  })
  it('holds unmarked legacy profiles when canonical membership cannot be checked', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED = 'false'
    fetcher.mockResolvedValueOnce(new Response(JSON.stringify({
      records: [{ id: recordId, fields: { ...mutated, 'DCC Website Member Binding ID': undefined } }],
    })))
    await expect(readPublicAtlas()).rejects.toThrow('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
  })
  it('fails closed on private database outage',async()=>{
    rpc.mockResolvedValueOnce({data:null,error:{message:'private database unavailable'}})
    await expect(readPublicAtlas()).rejects.toThrow('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
  })
})
