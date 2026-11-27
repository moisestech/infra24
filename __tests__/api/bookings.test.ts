/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/bookings/route'
import { sendBookingConfirmationEmail } from '@/lib/email/email-service'

// Explicit route-boundary mocks; no real Supabase or outbound email.
const mockResource = jest.fn()
const mockOrganization = jest.fn()
const mockConflict = jest.fn()
const mockBooking = jest.fn()
const mockInsert = jest.fn()
jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: () => ({
    from: (table: string) => {
      const query = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: mockInsert,
        single: table === 'resources' ? mockResource : table === 'organizations' ? mockOrganization : mockBooking,
        or: mockConflict,
      }
      mockInsert.mockImplementation(() => Object.assign(Promise.resolve({error:null}), {
        select: () => query,
      }))
      return query
    },
  }),
}))
jest.mock('@/lib/email/email-service', () => ({
  sendBookingConfirmationEmail: jest.fn().mockResolvedValue({success:true}),
  sendHostNotificationEmail: jest.fn().mockResolvedValue({success:true}),
}))

describe('/api/bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResource.mockReset().mockResolvedValue({data:{id:'test-resource-id',title:'Test Resource',metadata:{default_hosts:['host@example.com']}},error:null})
    mockOrganization.mockReset().mockResolvedValue({data:{name:'Synthetic organization'},error:null})
    mockConflict.mockReset().mockResolvedValue({data:[],error:null})
    mockBooking.mockReset().mockResolvedValue({data:{id:'test-booking-id'},error:null})
  })

  it('should create a booking successfully', async () => {
    const bookingData = {
      org_id: 'test-org-id',
      resource_id: 'test-resource-id',
      start_time: '2025-01-15T12:00:00Z',
      end_time: '2025-01-15T12:30:00Z',
      artist_name: 'Test Artist',
      artist_email: 'test@example.com',
      goal_text: 'Test consultation'
    }

    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toHaveProperty('booking_id')
    expect(data).toHaveProperty('confirmation_url')
    expect(data).toHaveProperty('reschedule_url')
    expect(data).toHaveProperty('cancel_url')
    const receipt=new URL(data.confirmation_url), mutation=new URL(data.cancel_url)
    const mail=(sendBookingConfirmationEmail as jest.Mock).mock.calls[0][0]
    const calendar=new URL(mail.icsUrl)
    expect(calendar.pathname).toBe(receipt.pathname)
    expect(calendar.search).toBe('')
    expect(calendar.hash).toMatch(/^#calendar=[a-f0-9]{64}$/)
    expect(calendar.hash.slice(10)).not.toBe(mutation.searchParams.get('token'))
    expect(calendar.hash.slice(10)).not.toBe(receipt.hash.slice(9))
    expect(mail.calendarUrls.google).toBe(mail.icsUrl)
    expect(mail.calendarUrls.outlook).toBe(mail.icsUrl)
  })

  it('should return 400 for missing required fields', async () => {
    const incompleteData = {
      org_id: 'test-org-id',
      resource_id: 'test-resource-id'
      // Missing required fields
    }

    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify(incompleteData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return 404 for non-existent resource', async () => {
    mockResource.mockResolvedValueOnce({
      data: null,
      error: { message: 'Resource not found' }
    })

    const bookingData = {
      org_id: 'test-org-id',
      resource_id: 'non-existent-resource',
      start_time: '2025-01-15T12:00:00Z',
      end_time: '2025-01-15T12:30:00Z',
      artist_name: 'Test Artist',
      artist_email: 'test@example.com',
      goal_text: 'Test consultation'
    }

    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data).toHaveProperty('error')
  })

  it('should return 409 for unavailable slot', async () => {
    mockConflict.mockResolvedValueOnce({data:[{id:'existing-booking'}],error:null})

    const bookingData = {
      org_id: 'test-org-id',
      resource_id: 'test-resource-id',
      start_time: '2025-01-15T12:00:00Z',
      end_time: '2025-01-15T12:30:00Z',
      artist_name: 'Test Artist',
      artist_email: 'test@example.com',
      goal_text: 'Test consultation'
    }

    const request = new NextRequest('http://localhost:3000/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe('Time slot is already booked')
    expect(mockInsert).not.toHaveBeenCalled()
  })
})


















 test('missing tenant host fails closed before insertion',async()=>{
  mockResource.mockResolvedValueOnce({data:{id:'resource',title:'Resource',metadata:{}},error:null})
  const response=await POST(new NextRequest('http://localhost/api/bookings',{method:'POST',body:JSON.stringify({org_id:'org',resource_id:'resource',start_time:'2099-01-01T10:00:00Z',end_time:'2099-01-01T11:00:00Z',artist_name:'Test',artist_email:'guest@example.com'})}))
  expect(response.status).toBe(503)
  expect(mockInsert).not.toHaveBeenCalled()
 })
 test('availability database error prevents insertion',async()=>{
  mockConflict.mockResolvedValueOnce({data:null,error:{message:'synthetic'}})
  const response=await POST(new NextRequest('http://localhost/api/bookings',{method:'POST',body:JSON.stringify({org_id:'org',resource_id:'resource',start_time:'2099-01-01T10:00:00Z',end_time:'2099-01-01T11:00:00Z',artist_name:'Test',artist_email:'guest@example.com'})}))
  expect(response.status).toBe(409)
  expect(mockInsert).not.toHaveBeenCalled()
 })

test('missing hosted bookability column prevents booking insertion',async()=>{
 mockResource.mockResolvedValue({data:null,error:{code:'42703'}});mockInsert.mockClear()
 const res=await POST(new NextRequest('http://localhost/api/bookings',{method:'POST',body:JSON.stringify({org_id:'org',resource_id:'resource',start_time:'2099-01-01T10:00:00Z',end_time:'2099-01-01T11:00:00Z',artist_name:'Test',artist_email:'guest@example.com'})}))
 expect(res.status).toBe(503);expect(mockInsert).not.toHaveBeenCalled()
})
