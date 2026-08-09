import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CeoScorecard } from '@/components/dcc/ceo/CeoScorecard'
import { hasScaleUpAccess } from '@/lib/dcc/scale-up-auth'

export const metadata: Metadata = {
  title: 'CEO dashboard',
  robots: { index: false, follow: false },
}

export const revalidate = 300

export default async function CeoDashboardPage() {
  const scaleUpOk = await hasScaleUpAccess()
  const flag = process.env.DCC_CEO_DASHBOARD_ENABLED === 'true'
  // Allow via scale-up cookie OR explicit staff flag
  if (!scaleUpOk && !flag && process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <CeoScorecard />
      <p className="mt-10 font-mono text-xs text-neutral-500">
        Founder Dependency Ratio needs an hours log (Question 6) — stubbed until ops hours land in
        DCC OS.
      </p>
    </div>
  )
}
