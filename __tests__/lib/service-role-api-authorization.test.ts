/** @jest-environment node */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GET as listBookings, PATCH as updateBooking, DELETE as deleteBooking } from '@/app/api/admin/bookings/route'
import { GET as getDonations, POST as postDonation } from '@/app/api/donations/route'
import { GET as getTips, POST as postTip } from '@/app/api/tips/route'
import { createClient } from '@supabase/supabase-js'
import { GET as listLegacyBookings } from '@/app/api/bookings/route'
import { POST as createResource } from '@/app/api/organizations/[orgId]/resources/route'
import { GET as listFullResources, POST as createFullResource } from '@/app/api/organizations/by-id/resources/route'
import { GET as listSubmissions } from '@/app/api/organizations/by-id/submissions/route'
import { GET as listForms, POST as createForm } from '@/app/api/organizations/by-id/submission-forms/route'
import { GET as listArtists, POST as createArtist } from '@/app/api/organizations/by-id/artists/route'
import { GET as listUsers } from '@/app/api/organizations/by-id/users/route'
import { GET as listAnnouncements } from '@/app/api/organizations/by-id/announcements/route'
import { GET as listAnalytics } from '@/app/api/organizations/by-id/analytics/route'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/security/require-organization-staff', () => ({ requireOrganizationStaff: jest.fn() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn(() => ({ from: jest.fn() })) }))
jest.mock('@/lib/supabase', () => ({ getSupabaseAdmin: jest.fn(), supabaseClient: {from:jest.fn()}, createClient:jest.fn() }))
jest.mock('@/lib/email/email-service', () => ({sendBookingConfirmationEmail:jest.fn(),sendHostNotificationEmail:jest.fn()}))

const clerk = auth as unknown as jest.Mock
const authorized = requireOrganizationStaff as jest.Mock
const clients = (createClient as jest.Mock).mock.results.map(result => result.value)
const insert = jest.fn()
const single = jest.fn()
const select = jest.fn()
const from = jest.fn()
const orgId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'

beforeEach(() => {
  jest.clearAllMocks()
  clerk.mockResolvedValue({ userId: null })
  authorized.mockResolvedValue({ ok: false, error: 'Sign in required', status: 401 })
  single.mockResolvedValue({ data: { id:'created', status:'pending' }, error:null })
  select.mockReturnValue({ single })
  insert.mockReturnValue({ select })
  from.mockReturnValue({ insert })
  for (const db of clients) {
    db.from.mockReset()
    db.from.mockImplementation((...args: unknown[]) => from(...args))
  }
})

describe('service-role endpoint boundary', () => {
  it('blocks anonymous booking list/update/delete before touching the database', async () => {
    const list = await listBookings(new NextRequest('https://example.test/api/admin/bookings?organization_id=' + orgId))
    expect(list.status).toBe(401)
    const patch = await updateBooking(new NextRequest('https://example.test/api/admin/bookings', {
      method:'PATCH', body:JSON.stringify({ id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', status:'cancelled' }),
    }))
    expect(patch.status).toBe(401)
    const del = await deleteBooking(new NextRequest('https://example.test/api/admin/bookings?id=bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'))
    expect(del.status).toBe(401)
    expect(from).not.toHaveBeenCalled()
  })

  it('rejects anonymous donation/tip GET even when org is explicitly supplied', async () => {
    const donations = await getDonations(new NextRequest('https://example.test/api/donations?org_id=' + orgId))
    const tips = await getTips(new NextRequest('https://example.test/api/tips?org_id=' + orgId))
    expect(donations.status).toBe(401)
    expect(tips.status).toBe(401)
    expect(from).not.toHaveBeenCalled()
  })

  it('never accepts caller-supplied paid status on a donation intent', async () => {
    const response = await postDonation(new NextRequest('https://example.test/api/donations', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({org_id:orgId,amount:10,status:'paid'}),
    }))
    expect(response.status).toBe(201)
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({status:'pending'}))
  })

  it('never accepts caller-supplied paid status on a tip intent', async () => {
    const response = await postTip(new NextRequest('https://example.test/api/tips', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({org_id:orgId,artist_profile_id:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',amount:10,status:'paid'}),
    }))
    expect(response.status).toBe(201)
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({status:'pending'}))
  })
})

describe('legacy tenant boundaries', () => {
  it.each([401,403])('denies unapproved staff access (%i) before tenant data is read or written', async status => {
    authorized.mockResolvedValue({ok:false,status,error:'denied'})
    clerk.mockResolvedValue({userId:'user_test'})
    const req = new NextRequest('https://example.test/api/bookings?org_id='+orgId)
    const write = () => new NextRequest('https://example.test/api/resources?org_id='+orgId,{method:'POST',body:JSON.stringify({title:'Synthetic',type:'space',org_id:'other'})})
    const params = {params:Promise.resolve({orgId})}
    const responses = await Promise.all([
      listLegacyBookings(req), createResource(write(),params),
      listFullResources(req),createFullResource(write()),
      listSubmissions(req),listForms(req),createForm(write()),listArtists(req),createArtist(write()),listUsers(req),listAnnouncements(req),listAnalytics(req),
    ])
    expect(responses.map(r=>r.status)).toEqual(Array(12).fill(status))
    expect(from).not.toHaveBeenCalled()
  })
})

describe('static by-id tenant selector',()=>{
  it('passes URL tenant selector, never a body organization override, to staff authorization',async()=>{
    const request=new NextRequest('https://example.test/api/organizations/by-id/artists?org_id='+orgId,{method:'POST',body:JSON.stringify({name:'Synthetic',organization_id:'different-tenant'})})
    expect((await createArtist(request)).status).toBe(401)
    expect(authorized).toHaveBeenCalledWith(orgId)
    expect(from).not.toHaveBeenCalled()
  })
  it('does not obtain a tenant from missing dynamic params',async()=>{
    authorized.mockResolvedValue({ok:false,status:400,error:'A valid organization ID is required'})
    const request=new NextRequest('https://example.test/api/organizations/by-id/submission-forms')
    expect((await listForms(request)).status).toBe(400)
    expect(authorized).toHaveBeenCalledWith(null)
    expect(from).not.toHaveBeenCalled()
  })
})
