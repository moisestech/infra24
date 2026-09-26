import { Briefcase } from 'lucide-react'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

export function PortalUnlinked({ jobCode }: { jobCode?: string }) {
  const color = getFabricationColor('slate')
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className={cn('inline-flex h-14 w-14 items-center justify-center rounded-2xl', color.icon)}>
        <Briefcase aria-hidden className="h-7 w-7" />
      </span>
      <p className="cdc-font-mono-accent mt-6 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        DCC fabrication
      </p>
      <h1 className="cdc-font-display mt-2 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
        {jobCode ? 'Project not linked' : 'Fabricator portal'}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        This account is not linked to a Person. People do not store a Clerk user id yet
        {jobCode ? `, so ${jobCode} cannot be opened from this sign-in` : ''}.
      </p>
    </div>
  )
}
