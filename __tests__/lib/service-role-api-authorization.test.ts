/** @jest-environment node */
import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'
import { GET as listBookings, PATCH as updateBooking, DELETE as deleteBooking } from '@/app/api/admin/bookings/route'
import { GET as getDonations, POST as postDonation } from '@/app/api/donations/route'
import { GET as getTips, POST as postTip } from '@/app/api/tips/route'
import { createClient } from '@supabase/supabase-js'

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))
jest.mock('@/lib/security/require-organization-staff', () => ({ requireOrganizationStaff: jest.fn() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: jest.fn() }))
jest.mock('@/lib/supabase', () => ({ getSupabaseAdmin: jest.fn() }))

const clerk = auth as jest.Mock
const authorized = requireOrganizationStaff as jest.Mock
const connect = createClient as jest.Mock
const insert = jest.fn()
const single = jest.fn()
const select = jest.fn()
const from = jest.fn()
const fakeDb = { from }
const orgId = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'

beforeEach(() => {
  jest.clearAllMocks()
  clerk.mockReturnValue({ userId: null })
  authorized.mockResolvedValue({ ok: false, error: 'Sign in required', status: 401 })
  single.mockResolvedValue({ data: { id:'created', status:'pending' }, error:null })
  select.mockReturnValue({ single })
  insert.mockReturnValue({ select })
  from.mockReturnValue({ insert })
  connect.mockReturnValue(fakeDb)
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
