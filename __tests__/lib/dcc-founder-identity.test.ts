/** @jest-environment node */
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'
import { decideFounderIdentity, founderDecision, ownerProof } from '@/lib/dcc/membership/identity-review'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { POST } from '@/app/api/dcc/steward/identity-decision/route'
import { auth } from '@clerk/nextjs/server'
jest.mock('server-only',()=>({}))
jest.mock('@clerk/nextjs/server',()=>({auth:jest.fn(),clerkClient:jest.fn()}))
jest.mock('@supabase/supabase-js',()=>({createClient:jest.fn()}))
jest.mock('@/lib/airtable/client',()=>({fetchAllRecords:jest.fn(),patchAirtableRecord:jest.fn()}))
const id='419780ec-ba1b-4980-87c0-899e475998a3'
const person='rec12345678901234'
const subject='user_member_ci'
const founder='user_founder_ci'
const primary={id:subject,primaryEmailAddressId:'email_ci',emailAddresses:[
  {id:'email_ci',emailAddress:'ci@example.test',verification:{status:'verified'}}]}
const stamp=createHash('sha256').update([subject,'email_ci','ci@example.test'].join('\0')).digest('hex')
const getUser=jest.fn()
const rpc=jest.fn()
const fetchRows=fetchAllRecords as jest.Mock
const patch=patchAirtableRecord as jest.Mock
let stage:string, bound:string|undefined
const original=process.env
beforeEach(()=>{
  jest.resetAllMocks()
  process.env={...original,DCC_MEMBER_EVENT_CAPTURE_ENABLED:'true',DCC_MEMBER_CUTOVER_ISO:'2026-11-01T00:00:00Z',
    DCC_CLERK_INSTANCE_ID:'synthetic',DCC_STEWARD_REVIEW_ENABLED:'true',DCC_STEWARD_IDENTITY_RESOLUTION_ENABLED:'true',
    DCC_STEWARD_CLERK_USER_IDS:founder,AIRTABLE_DCC_ATLAS_BASE_ID:'base',AIRTABLE_DCC_ATLAS_PEOPLE_TABLE:'people',
    AIRTABLE_DCC_ATLAS_API_KEY:'test-only',SUPABASE_SERVICE_ROLE_KEY:'test-only',NEXT_PUBLIC_SUPABASE_URL:'https://example.test'}
  stage='proven';bound=undefined
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:founder})
  ;(clerkClient as jest.Mock).mockResolvedValue({users:{getUser}})
  getUser.mockResolvedValue(primary)
  ;(createClient as jest.Mock).mockReturnValue({rpc,from:(table:string)=>{
    const query={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:async()=>({
      data:table==='dcc_identity_reviews'?{person_id:person,version:2,stage,primary_stamp:stamp}:
        {id,clerk_user_id:subject,state:'review_required'},error:null})}
    return query
  }})
  rpc.mockImplementation(async(_name,args)=>({data:args.p_version+1,error:null}))
  fetchRows.mockImplementation(async(_b,_t,_k,opts)=>{
    const row={id:person,fields:{'DCC Website Member Binding ID':bound,'Atlas Identity Verified':Boolean(bound),Email:'ci@example.test'}}
    return opts.filterFormula.startsWith('RECORD_ID')?[row]:bound===id?[row]:[]
  })
  patch.mockImplementation(async()=>{bound=id;return {id:person,fields:{}}})
})
afterEach(()=>{process.env=original})
const decision=(action:'approve'|'recover')=>decideFounderIdentity({requestId:id,version:2,action},founder)
it('takes reviewer identity only from the exact server-side subject allowlist',async()=>{
  await expect(requireDccSteward()).resolves.toBe(founder)
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:'user_other',email:founder,publicMetadata:{role:'founder'}})
  await expect(requireDccSteward()).rejects.toThrow('staff_access_required')
})
it('denies cross-origin requests before provider access',async()=>{
  const result=await POST(new Request('https://preview.example.test/api/dcc/steward/identity-decision',{
    method:'POST',headers:{Origin:'https://other.example.test'},body:'{}'}))
  expect(result.status).toBe(403);expect(result.headers.get('cache-control')).toContain('no-store')
  expect(createClient).not.toHaveBeenCalled()
})
it('creates a one-time proof without binding by email or storing its plaintext',async()=>{
  const result=await decideFounderIdentity({requestId:id,version:0,action:'challenge',method:'in_person',personId:person},founder)
  expect(result.code).toMatch(/^[A-Za-z0-9_-]{32}$/)
  expect(JSON.stringify(rpc.mock.calls)).not.toContain(result.code!)
  expect(patch).not.toHaveBeenCalled()
  expect(ownerProof.safeParse({code:result.code,bindingId:id}).success).toBe(false)
  expect(founderDecision.safeParse({requestId:id,version:0,action:'approve',reviewer:founder}).success).toBe(false)
})
it('denies a mismatched verified primary or a person already linked elsewhere',async()=>{
  bound='other-binding'
  await expect(decision('approve')).rejects.toMatchObject({status:409})
  expect(patch).not.toHaveBeenCalled()
  ;getUser.mockResolvedValue({...primary,primaryEmailAddressId:'changed'})
  await expect(decision('approve')).rejects.toMatchObject({status:409})
  expect(rpc).not.toHaveBeenCalled()
})
it('binds privately only after independent provider readback, without writing publication fields',async()=>{
  await expect(decision('approve')).resolves.toEqual({state:'resolved'})
  expect(patch.mock.calls[0][4]).toEqual({'DCC Website Member Binding ID':id,'Atlas Identity Verified':true})
  expect(rpc.mock.calls.map(c=>c[1].p_action)).toEqual(['approve','confirm'])
  expect(getUser).toHaveBeenCalledTimes(2)
})
it('recovers a lost write response by reading both directions without a second patch',async()=>{
  patch.mockImplementationOnce(async()=>{bound=id;throw Error('response lost')})
  await expect(decision('approve')).rejects.toMatchObject({status:503})
  expect(rpc.mock.calls.map(c=>c[1].p_action)).toEqual(['approve','uncertain'])
  stage='uncertain'
  await expect(decision('recover')).resolves.toEqual({state:'resolved'})
  expect(patch).toHaveBeenCalledTimes(1)
})
it('leaves an unconfirmed provider outcome held and never recreates or repeats the write',async()=>{
  stage='confirming'
  await expect(decision('recover')).rejects.toMatchObject({status:409})
  expect(patch).not.toHaveBeenCalled();expect(rpc).not.toHaveBeenCalled()
})
it('refuses proof that an earlier Clerk primary address supplied',async()=>{
  ;getUser.mockResolvedValue({...primary,emailAddresses:[{
    ...primary.emailAddresses[0],emailAddress:'changed@example.test'}]})
  await expect(decision('approve')).rejects.toMatchObject({status:409})
  expect(patch).not.toHaveBeenCalled()
})
