/** @jest-environment node */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GET as ics } from '@/app/api/bookings/[id]/ics/route'
import { GET as urls } from '@/app/api/bookings/[id]/calendar-urls/route'
import { POST as cancel } from '@/app/api/bookings/[id]/cancel/route'
import { POST as reschedule } from '@/app/api/bookings/[id]/reschedule/route'
jest.mock('@clerk/nextjs/server',()=>({auth:jest.fn()}))
jest.mock('@/lib/supabase',()=>({getSupabaseAdmin:jest.fn()}))
jest.mock('@/lib/security/require-organization-staff',()=>({requireOrganizationStaff:jest.fn()}))
jest.mock('@/lib/email/email-service',()=>({sendBookingCancelledEmail:jest.fn(),sendBookingRescheduledEmail:jest.fn()}))
jest.mock('@/lib/google-meet',()=>({generateScheduledGoogleMeetLink:jest.fn()}))
const id='22222222-2222-4222-8222-222222222222'
const org='11111111-1111-4111-8111-111111111111'
const params=Promise.resolve({id})
const get=()=>new NextRequest('http://localhost/api/test')
const post=(body:object)=>new NextRequest('http://localhost/api/test',{method:'POST',body:JSON.stringify(body)})
beforeEach(()=>jest.resetAllMocks())
test.each([ics,urls])('calendar rejects signed-out request before database access',async handler=>{
  (auth as unknown as jest.Mock).mockResolvedValue({userId:null})
  expect((await handler(get(),{params})).status).toBe(401)
  expect(getSupabaseAdmin).not.toHaveBeenCalled()
})
test.each([ics,urls])('calendar rejects unrelated signed-in identity',async handler=>{
  (auth as unknown as jest.Mock).mockResolvedValue({userId:'other-user'})
  const q={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),single:jest.fn().mockResolvedValue({data:{id,org_id:org,user_id:'owner'},error:null})}
  const from=jest.fn().mockReturnValue(q)
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from})
  ;(requireOrganizationStaff as jest.Mock).mockResolvedValue({ok:false,status:403,error:'Forbidden'})
  expect((await handler(get(),{params})).status).toBe(403)
  expect(requireOrganizationStaff).toHaveBeenCalledWith(org)
  expect(from).toHaveBeenCalledTimes(1)
})
test.each([cancel,reschedule])('booking mutation rejects non-string token before database access',async handler=>{
  expect((await handler(post({token:123}),{params})).status).toBe(400)
  expect(getSupabaseAdmin).not.toHaveBeenCalled()
})
test.each([{start_time:'invalid',end_time:'2099-01-02T00:00:00Z'},{start_time:'2099-01-02T00:00:00Z',end_time:'2099-01-01T00:00:00Z'}])('reschedule rejects invalid time interval',async times=>{
  expect((await reschedule(post({token:'synthetic',...times}),{params})).status).toBe(400)
  expect(getSupabaseAdmin).not.toHaveBeenCalled()
})
