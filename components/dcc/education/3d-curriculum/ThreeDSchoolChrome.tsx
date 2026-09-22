import Link from 'next/link'
import { Box, GitBranch, Map, Route, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THREE_D_SCHOOL_PATH } from '@/lib/dcc/education/3d-curriculum'
import { getFabricationColor } from '@/lib/dcc/fabrication/theme'

export type ThreeDSchoolNavId = 'overview' | 'map' | 'intent' | 'path'

const NAV: {
  id: ThreeDSchoolNavId
  href: string
  label: string
  short: string
  Icon: LucideIcon
}[] = [
  {
    id: 'overview',
    href: THREE_D_SCHOOL_PATH,
    label: 'Overview',
    short: 'Home',
    Icon: Box,
  },
  {
    id: 'map',
    href: `${THREE_D_SCHOOL_PATH}#curriculum-map`,
    label: 'Curriculum map',
    short: 'Map',
    Icon: Map,
  },
  {
    id: 'intent',
    href: `${THREE_D_SCHOOL_PATH}#intent`,
    label: 'What to make',
    short: 'Make',
    Icon: Route,
  },
  {
    id: 'path',
    href: `${THREE_D_SCHOOL_PATH}#path`,
    label: 'Learning path',
    short: 'Path',
    Icon: GitBranch,
  },
]

export function ThreeDSchoolChrome({
  current,
  children,
}: {
  current?: ThreeDSchoolNavId
  children: React.ReactNode
}) {
  const color = getFabricationColor('teal')

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8 2xl:max-w-[90rem]">
      <nav
        aria-label="DCC 3D School"
        className="mb-8 overflow-x-auto rounded-2xl border border-[var(--cdc-border)] bg-white/80 p-1.5 dark:bg-neutral-950/80"
      >
        <div className="flex min-w-max gap-1">
          {NAV.map((link) => {
            const Icon = link.Icon
            const active = current === link.id
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? cn(color.chip, 'border')
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
                <span className="sm:hidden">{link.short}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      {children}
    </div>
  )
}
