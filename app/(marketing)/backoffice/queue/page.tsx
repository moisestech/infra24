import type { Metadata } from 'next'
import { Layers } from 'lucide-react'
import { StaffPage } from '@/components/dcc/backoffice/StaffSection'

export const metadata: Metadata = { title: 'Queue' }
export const dynamic = 'force-dynamic'

export default function QueuePage() {
  return (
    <StaffPage
      title="Queue"
      lede="A fabrication run is not the same record as a job."
      icon={Layers}
      token="orange"
      notices={[
        {
          tone: 'pending',
          text: 'Fabrication runs are not an Airtable table yet. Open jobs stay on the Jobs page.',
        },
      ]}
    />
  )
}
