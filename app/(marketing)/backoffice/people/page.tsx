import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentPerson, readPeople } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead } from '@/lib/dcc/backoffice/table-read'

export const metadata: Metadata = { title: 'People' }
export const dynamic = 'force-dynamic'

export default async function PeoplePage() {
  const read = await readPeople()
  const notice = noticeFromRead(read)
  return (
    <StaffPage
      title="People"
      lede="DCC CRM people, linked to Life OS when a Life OS Person ID is stored. Verification notes stay off this list. The public cultural map is /network."
      icon={Users}
      token="indigo"
      notices={notice ? [notice] : []}
    >
      <StaffRecords
        rows={read.status === 'records' ? read.records.map(presentPerson) : []}
        empty="No people in this table."
        withheld={read.status !== 'records'}
      />
    </StaffPage>
  )
}
