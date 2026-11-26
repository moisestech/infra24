/** @jest-environment node */
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/bookings/route'

// Explicit route-boundary mocks; no real Supabase or outbound email.
const mockResource = jest.fn()
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
        single: table === 'resources' ? mockResource : mockBooking,
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
    mockResource.mockReset().mockResolvedValue({data:{id:'test-resource-id',title:'Test Resource',metadata:{}},error:null})
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

















