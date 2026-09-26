import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { BackOfficeNav } from '@/components/dcc/backoffice/BackOfficeNav'
import { ScaleUpUnlockForm } from '@/components/dcc/scale-up/ScaleUpUnlockForm'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { hasScaleUpAccess, isScaleUpPasswordConfigured } from '@/lib/dcc/scale-up-auth'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function BackOfficeLayout({ children }: { children: ReactNode }) {
  const unlocked = await hasScaleUpAccess()
  if (!unlocked) {
    const gate = getFabricationColor('slate')
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
        <span className={cn('inline-flex h-12 w-12 items-center justify-center rounded-2xl', gate.icon)}>
          <Lock aria-hidden className="h-6 w-6" />
        </span>
        <p className="cdc-font-mono-accent mt-5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          DCC fabrication
        </p>
        <h1 className="cdc-font-display mt-2 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          Back office
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          Staff password. Same gate as Scale Up.
          {!isScaleUpPasswordConfigured()
            ? ' Set DCC_SCALE_UP_PASSWORD before this is used in production.'
            : null}
        </p>
        <div className="mt-8">
          <ScaleUpUnlockForm />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <BackOfficeNav />
      {children}
    </div>
  )
}
