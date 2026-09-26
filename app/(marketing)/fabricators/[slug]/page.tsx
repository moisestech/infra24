import type { Metadata } from 'next'
import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { publicOperatorName } from '@/lib/dcc/fabrication/operators'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

type FabricatorProfilePageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: FabricatorProfilePageProps): Promise<Metadata> {
  const name = publicOperatorName(params.slug)
  return {
    title: name ?? 'Fabricator profile',
    description: name
      ? `${name} fabricates with DCC.`
      : 'This fabricator profile is not published.',
  }
}

export default function FabricatorProfilePage({ params }: FabricatorProfilePageProps) {
  const name = publicOperatorName(params.slug)
  const color = getFabricationColor(name ? 'teal' : 'slate')
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className={cn('inline-flex h-14 w-14 items-center justify-center rounded-2xl', color.icon)}>
        <UserRound aria-hidden className="h-7 w-7" />
      </span>
      <p className="cdc-font-mono-accent mt-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        DCC fabrication
      </p>
      <h1 className="cdc-font-display mt-2 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
        {name ?? 'Profile not published'}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        {name
          ? 'This profile is a name only. Rates, contact details, and machine access are not public.'
          : 'This address does not have a public fabricator profile.'}
      </p>
      <p className="mt-6">
        <Link href="/fabricators" className="text-sm font-medium text-neutral-700 underline dark:text-neutral-200">
          All fabricators
        </Link>
      </p>
    </div>
  )
}
