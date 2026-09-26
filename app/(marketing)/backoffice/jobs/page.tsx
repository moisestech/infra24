import type { Metadata } from 'next'
import { Briefcase } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentJob, readJobs } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead } from '@/lib/dcc/backoffice/table-read'

export const metadata: Metadata = { title: 'Jobs' }
export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const read = await readJobs()
  const notice = noticeFromRead(read)
  return (
    <StaffPage
      title="Jobs"
      lede="Legacy Stage is mapped onto the operating stage. Paid stays a payment fact."
      icon={Briefcase}
      token="cyan"
      notices={notice ? [notice] : []}
    >
      <StaffRecords
        rows={read.status === 'records' ? read.records.map(presentJob) : []}
        empty="No jobs in this table."
        withheld={read.status !== 'records'}
      />
    </StaffPage>
  )
}
