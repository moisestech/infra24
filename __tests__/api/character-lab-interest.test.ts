/**
 * Unit coverage for Character Lab's lead-delivery decision boundary.
 * Mocks providers so tests cannot mockSend mail or write to the real CRM.
 */
import { POST } from '@/app/api/dcc/character-lab-interest/route'
import { createAirtableRecords, fetchAllRecords } from '@/lib/airtable/client'

const mockSend = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: (...args: unknown[]) => mockSend(...args) },
  })),
}))
jest.mock('next/server', () => ({
  NextResponse: {
    json: (payload: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => payload,
    }),
  },
}))
jest.mock('@/lib/airtable/client', () => ({
  createAirtableRecords: jest.fn(),
  fetchAllRecords: jest.fn(),
  patchAirtableRecord: jest.fn(),
}))

const input = {
  name: 'Course Test Person',
  email: 'course-test@example.test',
  practice: 'Artist',
  format: 'Online preparation + in-person lab',
  motivation: 'A virtual self portrait',
  source: 'character-lab-qa',
  consent: true,
}

function request(body: Record<string, unknown>) {
  return { json: async () => body } as unknown as Request
}

async function result(body: Record<string, unknown>) {
  const response = await POST(request(body))
  return { status: response.status, body: await response.json() }
}

describe('Character Lab inquiry delivery', () => {
  const oldKey = process.env.AIRTABLE_DCC_CRM_API_KEY
  const oldBase = process.env.AIRTABLE_DCC_CRM_BASE_ID
  const oldResend = process.env.RESEND_API_KEY

  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.AIRTABLE_DCC_CRM_API_KEY
    delete process.env.AIRTABLE_DCC_CRM_BASE_ID
    delete process.env.RESEND_API_KEY
  })

  afterAll(() => {
    if (oldKey === undefined) delete process.env.AIRTABLE_DCC_CRM_API_KEY
    else process.env.AIRTABLE_DCC_CRM_API_KEY = oldKey
    if (oldBase === undefined) delete process.env.AIRTABLE_DCC_CRM_BASE_ID
    else process.env.AIRTABLE_DCC_CRM_BASE_ID = oldBase
    if (oldResend === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = oldResend
  })

  it('does not accept missing permission', async () => {
    const r = await result({ ...input, consent: false })
    expect(r.status).toBe(400)
    expect(mockSend).not.toHaveBeenCalled()
    expect(createAirtableRecords).not.toHaveBeenCalled()
  })

  it('does not pretend email was accepted when the provider fails', async () => {
    process.env.RESEND_API_KEY = 're_test_placeholder'
    mockSend.mockResolvedValue({ data: null, error: { message: 'sender not verified' } })
    const r = await result(input)
    expect(r.status).toBe(503)
    expect(r.body).toMatchObject({ fallback: true })
    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  it('delivers to the DCC inbox only when Resend acknowledges it', async () => {
    process.env.RESEND_API_KEY = 're_test_placeholder'
    mockSend.mockResolvedValue({ data: { id: 'test_msg_123' }, error: null })
    const r = await result(input)
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ ok: true, delivery: 'email' })
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['m@moises.tech'],
        text: expect.stringContaining('Course Test Person'),
      })
    )
  })

  it('writes private CRM signal when configured instead of sending email', async () => {
    process.env.RESEND_API_KEY = 're_test_placeholder'
    process.env.AIRTABLE_DCC_CRM_API_KEY = 'pat_test_placeholder'
    process.env.AIRTABLE_DCC_CRM_BASE_ID = 'appWj8TFiOqUyQUfM'
    ;(fetchAllRecords as jest.Mock).mockResolvedValue([])
    ;(createAirtableRecords as jest.Mock).mockResolvedValue([{ id: 'rec_qa' }])
    const r = await result(input)
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ ok: true, delivery: 'airtable' })
    expect(createAirtableRecords).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({ fields: expect.objectContaining({ Visibility: 'Private' }) }),
      ])
    )
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('fails closed when neither an email provider nor CRM is configured', async () => {
    const r = await result(input)
    expect(r.status).toBe(503)
    expect(r.body).toMatchObject({ fallback: true })
  })
})
