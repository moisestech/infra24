import type { Metadata } from 'next'
import { BadgeDollarSign } from 'lucide-react'
import { StaffPage, StaffRecords } from '@/components/dcc/backoffice/StaffSection'
import { presentTransaction, readTransactions } from '@/lib/dcc/backoffice/crm-reads'
import { noticeFromRead, type StaffNotice } from '@/lib/dcc/backoffice/table-read'

export const metadata: Metadata = { title: 'Payments' }
export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const read = await readTransactions()
  const notice = noticeFromRead(read)
  const notices: StaffNotice[] = [
    {
      tone: 'finance',
      text: 'These rows are the legacy CEO scorecard from Transactions, not Payment References. QuickBooks remains the accounting record.',
    },
  ]
  if (notice) notices.push(notice)
  return (
    <StaffPage
      title="Payments"
      lede="Amounts already stored on Transactions. This page does not write accounting."
      icon={BadgeDollarSign}
      token="violet"
      notices={notices}
    >
      <StaffRecords
        rows={read.status === 'records' ? read.records.map(presentTransaction) : []}
        empty="No legacy transactions."
        withheld={read.status !== 'records'}
      />
    </StaffPage>
  )
}
