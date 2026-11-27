/** @jest-environment node */
import { NextRequest } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { conflictDetectionService } from '@/lib/conflict-detection'
import { POST } from '@/app/api/organizations/[orgId]/bookings/route'
jest.mock('@clerk/nextjs/server',()=>({auth:jest.fn(),currentUser:jest.fn()}))
jest.mock('@/lib/supabase/server',()=>({createClient:jest.fn()}))
jest.mock('@/lib/security/require-organization-staff',()=>({requireOrganizationStaff:jest.fn()}))
jest.mock('@/lib/conflict-detection',()=>({conflictDetectionService:{checkBookingConflicts:jest.fn(),logConflict:jest.fn()}}))
const orgId='11111111-1111-4111-8111-111111111111'
const resourceId='22222222-2222-4222-8222-222222222222'
const body={resource_id:resourceId,title:'Synthetic booking',start_time:'2099-01-01T10:00:00Z',end_time:'2099-01-01T11:00:00Z',user_name:'Synthetic guest',user_email:'guest@example.com'}
const request=(patch:object={})=>new NextRequest('http://localhost/api/test',{method:'POST',body:JSON.stringify({...body,...patch})})
const params=Promise.resolve({orgId})
const resource={select:jest.fn(),eq:jest.fn(),single:jest.fn()}
const insert=jest.fn()
beforeEach(()=>{
  jest.resetAllMocks()
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:null})
  resource.select.mockReturnValue(resource)
  resource.eq.mockReturnValue(resource)
  resource.single.mockResolvedValue({data:{type:'space',title:'Test resource',capacity:2,price:0,currency:'USD'},error:null})
  insert.mockReturnValue({select:()=>({single:async()=>({data:{id:'synthetic'},error:null})})})
  ;(createClient as jest.Mock).mockReturnValue({from:(table:string)=>table==='resources'?resource:{insert}})
  ;(conflictDetectionService.checkBookingConflicts as jest.Mock).mockResolvedValue([])
})
test('guest insertion matches hosted columns and rejects client metadata',async()=>{
  const res=await POST(request({metadata:{host:'other@example.com',reschedule_token:'injected'}}),{params})
  expect(res.status).toBe(201)
  expect(resource.eq).toHaveBeenCalledWith('org_id',orgId)
  expect(resource.eq).toHaveBeenCalledWith('is_bookable',true)
  const row=insert.mock.calls[0][0]
  expect(row).toMatchObject({org_id:orgId,user_id:body.user_email,resource_type:'space',created_by:'guest',updated_by:'guest',status:'pending',metadata:{artist_email:body.user_email}})
  expect(row).not.toHaveProperty('user_email')
  expect(row).not.toHaveProperty('created_by_clerk_id')
  expect(row.metadata).not.toHaveProperty('host')
  expect(row.metadata).not.toHaveProperty('reschedule_token')
  expect(res.headers.get('cache-control')).toBe('private, no-store')
})
test('cross-tenant or unavailable resource cannot insert',async()=>{
  resource.single.mockResolvedValue({data:null,error:null})
  expect((await POST(request(),{params})).status).toBe(404)
  expect(insert).not.toHaveBeenCalled()
})
test('signed-in caller cannot substitute an unverified email',async()=>{
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:'user_test'})
  ;(currentUser as jest.Mock).mockResolvedValue({primaryEmailAddressId:'email1',emailAddresses:[{id:'email1',emailAddress:'unverified@example.com',verification:{status:'unverified'}}]})
  expect((await POST(request(),{params})).status).toBe(400)
  expect(insert).not.toHaveBeenCalled()
})
test('verified Clerk identity overrides submitted email',async()=>{
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:'user_test'})
  ;(currentUser as jest.Mock).mockResolvedValue({primaryEmailAddressId:'email1',emailAddresses:[{id:'email1',emailAddress:'verified@example.com',verification:{status:'verified'}}]})
  expect((await POST(request(),{params})).status).toBe(201)
  expect(insert.mock.calls[0][0]).toMatchObject({user_id:'user_test',metadata:{artist_email:'verified@example.com'}})
})
test.each([{capacity:3},{end_time:'invalid'},{user_email:'invalid'}])('invalid input cannot insert',async patch=>{
  expect((await POST(request(patch),{params})).status).toBe(400)
  expect(insert).not.toHaveBeenCalled()
})
test('availability failure prevents insertion',async()=>{
  ;(conflictDetectionService.checkBookingConflicts as jest.Mock).mockRejectedValue(new Error('synthetic'))
  expect((await POST(request(),{params})).status).toBe(500)
  expect(insert).not.toHaveBeenCalled()
})
