import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { DccSignupForm } from '@/components/dcc/signup/DccSignupForm'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { parseSignupFormMode } from '@/lib/dcc/signup/form-mode'
import { parsePathwayParam } from '@/lib/dcc/signup/pathways'

const path = '/network/signup'

export const metadata: Metadata = cdcPageMetadata(path)

type Props = {
  searchParams?: { source?: string; pathway?: string; form?: string }
}

export default function NetworkSignupPage({ searchParams }: Props) {
  const source = searchParams?.source
  const pathway = parsePathwayParam(searchParams?.pathway)
  const formMode = parseSignupFormMode(searchParams?.form)

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] px-4 py-8 dark:bg-neutral-950 sm:px-6 sm:py-12">
      <Suspense fallback={null}>
        <DccSignupAttributionCapture />
      </Suspense>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />}>
        <DccSignupForm pathway={pathway} source={source} formMode={formMode} />
      </Suspense>
    </div>
  )
}
