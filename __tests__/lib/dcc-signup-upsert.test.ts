import { escapeAirtableString } from '@/lib/dcc/signup/upsert-person'

jest.mock('../../lib/airtable/client', () => ({
  fetchAllRecords: jest.fn(),
  patchAirtableRecord: jest.fn(),
  createAirtableRecords: jest.fn(),
}))

import {
  createAirtableRecords,
  fetchAllRecords,
  patchAirtableRecord,
} from '@/lib/airtable/client'
import { upsertPersonRecord } from '@/lib/dcc/signup/upsert-person'

const fetchAllRecordsMock = fetchAllRecords as jest.MockedFunction<typeof fetchAllRecords>
const patchAirtableRecordMock = patchAirtableRecord as jest.MockedFunction<typeof patchAirtableRecord>
const createAirtableRecordsMock = createAirtableRecords as jest.MockedFunction<typeof createAirtableRecords>

describe('upsertPersonRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('escapes single quotes in email filter', () => {
    expect(escapeAirtableString("o'brien@example.com")).toBe("o''brien@example.com")
  })

  it('patches when email already exists', async () => {
    fetchAllRecordsMock.mockResolvedValue([
      { id: 'recExisting', fields: { Email: 'alex@example.com' } },
    ])
    patchAirtableRecordMock.mockResolvedValue({
      id: 'recExisting',
      fields: { Email: 'alex@example.com', 'Full Name': 'Alex Rivera' },
    })

    const result = await upsertPersonRecord('base', 'people', 'key', 'alex@example.com', {
      'Full Name': 'Alex Rivera',
    })

    expect(result.updated).toBe(true)
    expect(result.recordId).toBe('recExisting')
    expect(patchAirtableRecordMock).toHaveBeenCalledWith(
      'base',
      'people',
      'key',
      'recExisting',
      expect.objectContaining({ 'Full Name': 'Alex Rivera' })
    )
    expect(createAirtableRecordsMock).not.toHaveBeenCalled()
  })

  it('creates when email is new', async () => {
    fetchAllRecordsMock.mockResolvedValue([])
    createAirtableRecordsMock.mockResolvedValue([
      { id: 'recNew', fields: { Email: 'new@example.com' } },
    ])

    const result = await upsertPersonRecord('base', 'people', 'key', 'new@example.com', {
      Email: 'new@example.com',
    })

    expect(result.updated).toBe(false)
    expect(result.recordId).toBe('recNew')
    expect(createAirtableRecordsMock).toHaveBeenCalled()
    expect(patchAirtableRecordMock).not.toHaveBeenCalled()
  })
})
