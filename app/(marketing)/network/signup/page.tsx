import type { Metadata } from 'next'
import { DccSignupForm } from '@/components/dcc/signup/DccSignupForm'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { parsePathwayParam } from '@/lib/dcc/signup/pathways'

const path = '/network/signup'

export const metadata: Metadata = cdcPageMetadata(path)

type Props = {
  searchParams?: { source?: string; pathway?: string }
}

export default function NetworkSignupPage({ searchParams }: Props) {
  const source = searchParams?.source
  const pathway = parsePathwayParam(searchParams?.pathway)

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] px-4 py-8 dark:bg-neutral-950 sm:px-6 sm:py-12">
      <DccSignupForm pathway={pathway} source={source} />
    </div>
  )
}
