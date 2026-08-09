import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { requireDccOsConnection, type DccOsConnection } from '@/lib/dcc/os-config'
import { DCC_BOOKING_FIELDS as F } from '@/lib/dcc/os-field-map'

/** Phase 2 scheduling — read helpers only for now. */
export type DccBooking = {
  id: string
  name: string
  start?: string
  end?: string
  status?: string
}

function mapBooking(rec: AirtableRecord): DccBooking {
  return {
    id: rec.id,
    name:
      typeof rec.fields[F.name] === 'string'
        ? (rec.fields[F.name] as string)
        : '(booking)',
    start:
      typeof rec.fields[F.start] === 'string'
        ? (rec.fields[F.start] as string)
        : undefined,
    end:
      typeof rec.fields[F.end] === 'string'
        ? (rec.fields[F.end] as string)
        : undefined,
    status:
      typeof rec.fields[F.status] === 'string'
        ? (rec.fields[F.status] as string)
        : undefined,
  }
}

export async function listBookings(conn?: DccOsConnection): Promise<DccBooking[]> {
  const c = conn ?? requireDccOsConnection()
  const rows = await fetchAllRecords(c.baseId, c.tables.bookings, c.apiKey)
  return rows.map(mapBooking)
}
