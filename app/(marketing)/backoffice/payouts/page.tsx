import type { Metadata } from 'next'
import { Wallet } from 'lucide-react'
import { StaffPage } from '@/components/dcc/backoffice/StaffSection'

export const metadata: Metadata = { title: 'Payouts' }
export const dynamic = 'force-dynamic'

export default function PayoutsPage() {
  return (
    <StaffPage
      title="Payouts"
      lede="Fabricator pay is a flat task by default, recorded when that table exists."
      icon={Wallet}
      token="rose"
      notices={[{ tone: 'pending', text: 'Payouts are not an Airtable table yet.' }]}
    />
  )
}
