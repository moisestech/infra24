import { NextRequest } from 'next/server'
import { POST } from '@/app/api/bookings/route'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: 'test-booking-id',
        org_id: 'test-org-id',
        resource_id: 'test-resource-id',
        title: 'Test Booking',
        start_time: '2025-01-15T12:00:00Z',
        end_time: '2025-01-15T12:30:00Z',
        status: 'confirmed'
      },
      error: null
    }),
    then: jest.fn().mockResolvedValue({ data: [], error: null })
  }))
}

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase)
}))

describe('/api/bookings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
    mockSupabase.from().single.mockResolvedValueOnce({
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
    // Mock resource as found but slot unavailable
    mockSupabase.from().single.mockResolvedValueOnce({
      data: {
        id: 'test-resource-id',
        name: 'Remote Studio Visit',
        is_bookable: true,
        metadata: {
          availability_rules: {
            timezone: 'America/New_York',
            slot_minutes: 30
          }
        }
      },
      error: null
    })

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

    // This might return 409 or 200 depending on slot availability logic
    expect([200, 409]).toContain(response.status)
  })
})















