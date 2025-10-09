import { NextRequest } from 'next/server'
import { GET } from '@/app/api/availability/route'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: {
        id: 'test-resource-id',
        name: 'Remote Studio Visit',
        metadata: {
          availability_rules: {
            timezone: 'America/New_York',
            slot_minutes: 30,
            buffer_before: 10,
            buffer_after: 10,
            max_per_day_per_host: 4,
            windows: [
              {
                by: 'host',
                host: 'mo@oolite.org',
                days: ['Tue', 'Wed', 'Thu'],
                start: '12:00',
                end: '16:00'
              }
            ]
          }
        }
      },
      error: null
    })
  }))
}

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase)
}))

describe('/api/availability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return available slots for a resource', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/availability?resource_id=test-resource-id&start_date=2025-01-15&end_date=2025-01-15'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('resource_id', 'test-resource-id')
    expect(data).toHaveProperty('timezone', 'America/New_York')
    expect(data).toHaveProperty('slots')
    expect(Array.isArray(data.slots)).toBe(true)
  })

  it('should return 400 for missing resource_id', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/availability?start_date=2025-01-15&end_date=2025-01-15'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return 400 for missing date parameters', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/availability?resource_id=test-resource-id'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('should return 404 for non-existent resource', async () => {
    mockSupabase.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: 'Resource not found' }
    })

    const request = new NextRequest(
      'http://localhost:3000/api/availability?resource_id=non-existent&start_date=2025-01-15&end_date=2025-01-15'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data).toHaveProperty('error')
  })
})





