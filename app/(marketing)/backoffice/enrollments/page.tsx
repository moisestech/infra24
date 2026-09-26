import type { Metadata } from 'next'
import { ClipboardList } from 'lucide-react'
import { StaffPage } from '@/components/dcc/backoffice/StaffSection'

export const metadata: Metadata = { title: 'Enrollments' }
export const dynamic = 'force-dynamic'

export default function EnrollmentsPage() {
  return (
    <StaffPage
      title="Enrollments"
      lede="Class registration stays separate from fabrication jobs."
      icon={ClipboardList}
      token="amber"
      notices={[{ tone: 'pending', text: 'Enrollments are not an Airtable table yet.' }]}
    />
  )
}
