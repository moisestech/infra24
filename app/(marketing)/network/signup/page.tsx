import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DccSignupAttributionCapture } from '@/components/dcc/signup/DccSignupAttributionCapture'
import { DccSignupForm } from '@/components/dcc/signup/DccSignupForm'
import { cdcPageMetadata } from '@/lib/cdc/metadata'
import { parseSignupFormMode } from '@/lib/dcc/signup/form-mode'
import { parsePathwayParam } from '@/lib/dcc/signup/pathways'

const path = '/network/signup'

export const metadata: Metadata = cdcPageMetadata(path)

type Props = {
  searchParams?: Promise<{ source?: string; pathway?: string; form?: string; utm_campaign?: string }>
}

export default async function NetworkSignupPage({ searchParams: pendingSearchParams }: Props) {
  const searchParams = await pendingSearchParams
  const source = searchParams?.source
  const pathway = parsePathwayParam(searchParams?.pathway)
  const formMode = parseSignupFormMode(searchParams?.form)
  if (process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED === 'true' &&
      process.env.DCC_MEMBER_RECONCILIATION_ENABLED === 'true' &&
      process.env.DCC_MEMBER_PROFILE_ENABLED === 'true' && pathway === 'join_dcc_index') {
    const query = new URLSearchParams({ entry: 'network-signup' })
    if (searchParams?.utm_campaign && /^[a-zA-Z0-9_-]{1,64}$/.test(searchParams.utm_campaign)) {
      query.set('campaign', searchParams.utm_campaign)
    }
    redirect('/sign-up?redirect_url=' + encodeURIComponent('/network/your-dcc?' + query.toString()))
  }

  return (
    <div className="min-h-[100dvh] bg-[#fafafa] px-4 py-8 dark:bg-neutral-950 sm:px-6 sm:py-12">
      <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-neutral-300 bg-white p-4 text-sm leading-relaxed text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200" role="status">
        This is a DCC interest/contact form. It does not verify a website account
        or add a person to the public sculpture.{' '}
        <Link href="/sign-up" className="font-semibold underline underline-offset-2">
          Create a Smart Sign account
        </Link>
        {' '}or{' '}
        <Link href="/network/community" className="font-semibold underline underline-offset-2">
          explore the community
        </Link>. Verified DCC membership enrollment is being prepared.
      </div>
      <Suspense fallback={null}>
        <DccSignupAttributionCapture />
      </Suspense>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />}>
        <DccSignupForm pathway={pathway} source={source} formMode={formMode} />
      </Suspense>
    </div>
  )
}
