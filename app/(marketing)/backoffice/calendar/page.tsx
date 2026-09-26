import type { Metadata } from 'next'
import { CalendarDays } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentBooking, readBookings } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead, type StaffNotice } from '@/lib/dcc/backoffice/table-read'

export const metadata: Metadata = { title: 'Calendar' }
export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const read = await readBookings()
  const notice = noticeFromRead(read)
  const notices: StaffNotice[] =
    read.status === 'missing'
      ? notice
        ? [notice]
        : []
      : [
          {
            tone: 'pending',
            text: 'These rows are machine holds from Bookings, not class sessions.',
          },
          ...(notice ? [notice] : []),
        ]
  return (
    <StaffPage
      title="Calendar"
      lede="Machine time already stored on Bookings."
      icon={CalendarDays}
      token="sky"
      notices={notices}
    >
      <StaffRecords
        rows={read.status === 'records' ? read.records.map(presentBooking) : []}
        empty="No machine holds."
        withheld={read.status !== 'records'}
      />
    </StaffPage>
  )
}
