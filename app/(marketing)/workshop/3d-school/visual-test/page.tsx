import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CurriculumVisualQAGrid } from '@/components/dcc/education/3d-curriculum/CurriculumVisualQAGrid'
import { ThreeDSchoolChrome } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolChrome'

export const metadata: Metadata = {
  title: '3D School visual QA',
  description: 'Development-only review grid for 3D School hero assets.',
  robots: { index: false, follow: false },
}

export default function ThreeDSchoolVisualTestPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  return (
    <ThreeDSchoolChrome>
      <CurriculumVisualQAGrid />
    </ThreeDSchoolChrome>
  )
}
