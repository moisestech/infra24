/** @jest-environment node */
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/availability/route'

// Mock the server dependency, not the client module's eager initialization.
const mockResource = jest.fn()
const mockBookings = jest.fn()
jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: () => ({
    from: () => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      limit: mockBookings,
      single: mockResource,
    }),
  }),
}))

describe('/api/availability', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockResource.mockReset().mockResolvedValue({data:{id:'test-resource-id',org_id:'11111111-1111-4111-8111-111111111111',availability_rules:{timezone:'America/New_York',slot_minutes:30,windows:[{by:'host',host:'host@example.test',days:['Wednesday','Tuesday'],start:'12:00',end:'16:00'}]}},error:null})
    mockBookings.mockReset().mockResolvedValue({data:[],error:null})
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
    expect(data.slots.length).toBeGreaterThan(0)
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
    mockResource.mockResolvedValueOnce({
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


















it('fails closed on an incomplete booking query', async () => {
  mockResource.mockResolvedValue({data:{id:'test-resource-id',org_id:'11111111-1111-4111-8111-111111111111',availability_rules:{slot_minutes:30,windows:[{by:'host',host:'host@example.test',days:['Wednesday'],start:'12:00',end:'16:00'}]}},error:null})
  mockBookings.mockClear().mockResolvedValue({data:null,error:{message:'unavailable'}})
  const response=await GET(new NextRequest('http://localhost/api/availability?resource_id=test-resource-id&start_date=2025-01-15&end_date=2025-01-15'))
  expect(response.status).toBe(503)
  expect(mockBookings).toHaveBeenCalledTimes(1)
})

it('reports missing bookability column as unavailable without fallback',async()=>{
 mockResource.mockResolvedValue({data:null,error:{code:'42703'}})
 mockBookings.mockClear()
 const res=await GET(new NextRequest('http://localhost/api/availability?resource_id=test-resource-id&start_date=2025-01-15&end_date=2025-01-15'))
 expect(res.status).toBe(503);expect(mockBookings).not.toHaveBeenCalled()
})
