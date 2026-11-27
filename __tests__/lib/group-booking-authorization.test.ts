/** @jest-environment node */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GroupBookingService } from '@/lib/group-booking/service'
import { POST as register } from '@/app/api/group-bookings/[id]/participants/route'
import { POST as promote } from '@/app/api/group-bookings/[id]/waitlist/route'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/supabase', () => ({ getSupabaseAdmin: jest.fn() }))
jest.mock('@/lib/security/require-organization-staff', () => ({ requireOrganizationStaff: jest.fn() }))
jest.mock('@/lib/group-booking/service', () => ({
  GroupBookingService: { addParticipant: jest.fn(), promoteWaitlistParticipant: jest.fn() }
}))

const bookingId = '22222222-2222-4222-8222-222222222222'
const orgId = '11111111-1111-4111-8111-111111111111'
const waitlistId = '33333333-3333-4333-8333-333333333333'
const params = Promise.resolve({id: bookingId})
const post = (body: object) => new NextRequest('http://localhost/api/test', {method:'POST',body:JSON.stringify(body)})
const participant = {participantName:'Test Member',participantEmail:'member@example.test'}

beforeEach(() => {
  jest.resetAllMocks()
  ;(auth as unknown as jest.Mock).mockResolvedValue({userId:'signed-in-member'})
})

test.each(['private','invite_only','public'])('self-registration fails closed for %s group when not confirmed',async group_booking_type => {
  const q={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:{group_booking_type,status:'pending',start_time:'2099-01-01T00:00:00Z'},error:null})}
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from:jest.fn().mockReturnValue(q)})
  expect((await register(post(participant),{params})).status).toBe(403)
  expect(GroupBookingService.addParticipant).not.toHaveBeenCalled()
})

test.each(['private','invite_only'])('self-registration rejects %s confirmed bookings',async group_booking_type => {
  const q={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:{group_booking_type,status:'confirmed',start_time:'2099-01-01T00:00:00Z'},error:null})}
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from:jest.fn().mockReturnValue(q)})
  expect((await register(post(participant),{params})).status).toBe(403)
  expect(GroupBookingService.addParticipant).not.toHaveBeenCalled()
})

test('self-registration fails closed on database verification error',async () => {
  const q={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:null,error:{message:'database unavailable'}})}
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from:jest.fn().mockReturnValue(q)})
  expect((await register(post(participant),{params})).status).toBe(503)
  expect(GroupBookingService.addParticipant).not.toHaveBeenCalled()
})

test('staff cannot promote a waitlist entry from a different group booking',async () => {
  const booking={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:{id:bookingId,org_id:orgId},error:null})}
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from:jest.fn().mockReturnValue(booking)})
  const entry={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:null,error:null})}
  ;(requireOrganizationStaff as jest.Mock).mockResolvedValue({ok:true,orgId,userId:'staff',db:{from:jest.fn().mockReturnValue(entry)}})
  expect((await promote(post({waitlistId}),{params})).status).toBe(404)
  expect(entry.eq).toHaveBeenCalledWith('booking_id',bookingId)
  expect(entry.eq).toHaveBeenCalledWith('status','waiting')
  expect(GroupBookingService.promoteWaitlistParticipant).not.toHaveBeenCalled()
})

test('non-staff cannot inspect waitlist entries or promote a participant',async () => {
  const booking={select:jest.fn().mockReturnThis(),eq:jest.fn().mockReturnThis(),maybeSingle:jest.fn().mockResolvedValue({data:{id:bookingId,org_id:orgId},error:null})}
  ;(getSupabaseAdmin as jest.Mock).mockReturnValue({from:jest.fn().mockReturnValue(booking)})
  ;(requireOrganizationStaff as jest.Mock).mockResolvedValue({ok:false,status:403,error:'Organization staff access required'})
  expect((await promote(post({waitlistId}),{params})).status).toBe(403)
  expect(GroupBookingService.promoteWaitlistParticipant).not.toHaveBeenCalled()
})
