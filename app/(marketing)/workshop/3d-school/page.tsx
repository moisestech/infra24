import type { Metadata } from 'next'
import { ThreeDSchoolChrome } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolChrome'
import { ThreeDSchoolHub } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolHub'
import { THREE_D_SCHOOL_LEAD } from '@/lib/dcc/education/3d-curriculum'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'DCC 3D School',
  description: THREE_D_SCHOOL_LEAD,
  alternates: { canonical: '/workshop/3d-school' },
  openGraph: {
    title: `DCC 3D School | ${dccSiteMeta.organizationName}`,
    description: THREE_D_SCHOOL_LEAD,
    url: '/workshop/3d-school',
  },
}

export default function ThreeDSchoolPage() {
  return (
    <ThreeDSchoolChrome current="overview">
      <ThreeDSchoolHub />
    </ThreeDSchoolChrome>
  )
}
