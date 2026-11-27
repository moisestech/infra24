/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/artists/[id]/bookings/route'
import { GET as debug } from '@/app/api/test-supabase/route'
import { requireOrganizationStaff } from '@/lib/security/require-organization-staff'

jest.mock('@/lib/security/require-organization-staff', () => ({
  requireOrganizationStaff: jest.fn(),
}))
const authorize = requireOrganizationStaff as jest.Mock
const org = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
const artist = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'
const context = { params: Promise.resolve({ id: artist }) }
const request = () => new NextRequest('https://example.test/api/artists/' + artist + '/bookings?org_id=' + org)
const from = jest.fn()
const select = jest.fn()
const eq = jest.fn()
const maybeSingle = jest.fn()
const order = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  authorize.mockResolvedValue({ ok: true, db: { from }, orgId: org, userId: 'user_staff' })
  from.mockReturnValue({ select })
  select.mockReturnValue({ eq })
  eq.mockReturnValue({ eq, maybeSingle, order })
  maybeSingle.mockResolvedValue({ data: { id: artist }, error: null })
  order.mockResolvedValue({ data: [], error: null })
})

it.each([401, 403, 503])('rejects unauthorized or unavailable staff access (%i) before booking lookup', async status => {
  authorize.mockResolvedValue({ ok: false, status, error: 'Denied' })
  const response = await GET(request(), context)
  expect(response.status).toBe(status)
  expect(response.headers.get('Cache-Control')).toBe('private, no-store')
  expect(authorize).toHaveBeenCalledWith(org)
  expect(from).not.toHaveBeenCalled()
})

it('requires an explicit tenant selector', async () => {
  authorize.mockResolvedValue({ ok: false, status: 400, error: 'Missing tenant' })
  expect((await GET(new NextRequest('https://example.test/api/artists/' + artist + '/bookings'), context)).status).toBe(400)
  expect(authorize).toHaveBeenCalledWith(null)
  expect(from).not.toHaveBeenCalled()
})

it('does not read bookings when artist does not belong to the authorized tenant', async () => {
  maybeSingle.mockResolvedValue({ data: null, error: null })
  expect((await GET(request(), context)).status).toBe(404)
  expect(eq).toHaveBeenCalledWith('organization_id', org)
  expect(from).not.toHaveBeenCalledWith('bookings')
})

it('reads only tenant-scoped historical bookings and allowlists response fields', async () => {
  order.mockResolvedValue({ data: [{
    id: 'synthetic', title: 'Visit', start_time: 'start', end_time: 'end',
    status: 'pending', created_at: 'created', metadata: { private: true }, user_id: 'private',
  }], error: null })
  const response = await GET(request(), context)
  expect(response.status).toBe(200)
  expect(response.headers.get('Cache-Control')).toBe('private, no-store')
  expect(eq).toHaveBeenCalledWith('org_id', org)
  expect(eq).toHaveBeenCalledWith('resource_id', artist)
  expect(eq).toHaveBeenCalledWith('metadata->>booking_type', 'artist_booking')
  expect(select).toHaveBeenCalledWith('id,title,start_time,end_time,status,created_at')
  expect(await response.json()).toEqual({ bookings: [{
    id: 'synthetic', title: 'Visit', start_time: 'start', end_time: 'end',
    status: 'pending', created_at: 'created',
  }] })
})

it.each(['pending', 'confirmed', 'completed'])('retires incompatible writes regardless of caller status (%s)', async status => {
  const response = await POST(new NextRequest(request().url, {
    method: 'POST', body: JSON.stringify({ status, organizationId: org, bookerEmail: 'synthetic@example.test' }),
  }), context)
  expect(response.status).toBe(410)
  expect(response.headers.get('Cache-Control')).toBe('private, no-store')
  expect(authorize).not.toHaveBeenCalled()
  expect(from).not.toHaveBeenCalled()
})

it('retired debug endpoint returns no configuration or tenant data', async () => {
  const response = await debug()
  expect(response.status).toBe(404)
  expect(response.headers.get('Cache-Control')).toBe('private, no-store')
  expect(await response.json()).toEqual({ error: 'Not found' })
})
