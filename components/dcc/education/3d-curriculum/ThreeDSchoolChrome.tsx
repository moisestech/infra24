import { ThreeDSchoolNav } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolNav'
import type { ThreeDSchoolSectionId } from '@/lib/dcc/education/3d-curriculum'

export function ThreeDSchoolChrome({
  current,
  organizedOpen = true,
  children,
}: {
  current?: ThreeDSchoolSectionId
  /** Workshop pages start collapsed so the page you opened is the first thing you see. */
  organizedOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8 2xl:max-w-[90rem]">
      <ThreeDSchoolNav current={current} organizedOpen={organizedOpen} />
      {children}
    </div>
  )
}
