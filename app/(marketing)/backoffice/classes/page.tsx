import type { Metadata } from 'next'
import { GraduationCap } from 'lucide-react'
import { StaffPage } from '@/components/dcc/backoffice/StaffSection'

export const metadata: Metadata = { title: 'Classes' }
export const dynamic = 'force-dynamic'

export default function ClassesPage() {
  return (
    <StaffPage
      title="Classes"
      lede="Education is separate from machine authorization."
      icon={GraduationCap}
      token="violet"
      notices={[
        {
          tone: 'pending',
          text: 'Class sessions are not an Airtable table yet. Curriculum stays in git.',
        },
      ]}
    />
  )
}
