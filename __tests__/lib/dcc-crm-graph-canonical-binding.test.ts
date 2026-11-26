/** @jest-environment node */
import { createClient } from '@supabase/supabase-js'
import { excludeWebsiteBoundPeople } from '@/lib/airtable/crm-graph-service'
import type { AirtableRecord } from '@/lib/airtable/client'

jest.mock('@supabase/supabase-js',()=>({createClient:jest.fn()}))
const create=createClient as jest.Mock
const lookup=jest.fn()
const variables=['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'] as const
const saved=Object.fromEntries(variables.map(k=>[k,process.env[k]]))
const rows:AirtableRecord[]=[
  {id:'recBound',fields:{Name:'Hidden bound member'}},
  {id:'recMarked',fields:{Name:'Marked member','DCC Website Member Binding ID':'binding-id'}},
  {id:'recLegacy',fields:{Name:'Consented legacy person'}},
]
beforeEach(()=>{
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://project.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-server-key'
  create.mockReturnValue({from:()=>({select:()=>({in:lookup})})})
  lookup.mockResolvedValue({data:[{airtable_person_id:'recBound'}],error:null})
})
afterAll(()=>{for(const k of variables) {if(saved[k]===undefined) delete process.env[k]; else process.env[k]=saved[k]}})
describe('legacy CRM graph canonical website membership exclusion',()=>{
  it('excludes bound identities even if the CRM marker is removed',async()=>{
    expect(await excludeWebsiteBoundPeople(rows)).toEqual([rows[2]])
    expect(lookup).toHaveBeenCalledWith('airtable_person_id',['recBound','recLegacy'])
  })
  it('fails closed on canonical identity lookup failure',async()=>{
    lookup.mockResolvedValueOnce({data:null,error:{message:'unavailable'}})
    expect(await excludeWebsiteBoundPeople(rows)).toEqual([])
  })
  it('fails closed when server credentials are missing',async()=>{
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    expect(await excludeWebsiteBoundPeople(rows)).toEqual([])
    expect(create).not.toHaveBeenCalled()
  })
  it('never returns a partial result after a later chunk fails',async()=>{
    const many=Array.from({length:41},(_,i)=>({id:'rec'+i,fields:{}}))
    lookup.mockResolvedValueOnce({data:[],error:null}).mockResolvedValueOnce({data:null,error:{message:'unavailable'}})
    expect(await excludeWebsiteBoundPeople(many)).toEqual([])
    expect(lookup).toHaveBeenCalledTimes(2)
  })
})
