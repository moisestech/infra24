import Link from 'next/link'
import {
  BadgeDollarSign,
  Calculator,
  ClipboardList,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Layers,
  Route,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getFabricationColor,
  type FabricationColorTokenId,
} from '@/lib/dcc/fabrication/theme'

export type FabricateNavId =
  | 'home'
  | 'services'
  | 'pricing'
  | 'finishes'
  | 'field-lab'
  | 'estimate'
  | 'projects'
  | 'start'
  | 'quote'
  | 'workshops'

const NAV: {
  id: FabricateNavId
  href: string
  label: string
  short: string
  Icon: LucideIcon
  colorTokenId: FabricationColorTokenId
}[] = [
  {
    id: 'home',
    href: '/fabricate',
    label: 'Overview',
    short: 'Home',
    Icon: Sparkles,
    colorTokenId: 'cyan',
  },
  {
    id: 'services',
    href: '/fabricate/services',
    label: 'Services',
    short: 'Services',
    Icon: Route,
    colorTokenId: 'indigo',
  },
  {
    id: 'pricing',
    href: '/fabricate/pricing',
    label: 'Pricing',
    short: 'Rates',
    Icon: BadgeDollarSign,
    colorTokenId: 'teal',
  },
  {
    id: 'finishes',
    href: '/fabricate/finishes',
    label: 'Finishes',
    short: 'Finish',
    Icon: Layers,
    colorTokenId: 'violet',
  },
  {
    id: 'field-lab',
    href: '/fabricate/field-lab',
    label: 'Field Lab',
    short: 'Lab',
    Icon: FlaskConical,
    colorTokenId: 'amber',
  },
  {
    id: 'estimate',
    href: '/fabricate/estimate',
    label: 'Estimate',
    short: 'Est.',
    Icon: Calculator,
    colorTokenId: 'indigo',
  },
  {
    id: 'projects',
    href: '/fabricate/projects',
    label: 'Projects',
    short: 'Tests',
    Icon: FolderKanban,
    colorTokenId: 'slate',
  },
  {
    id: 'start',
    href: '/fabricate/start',
    label: 'Start a project',
    short: 'Start',
    Icon: ClipboardList,
    colorTokenId: 'sky',
  },
  {
    id: 'workshops',
    href: '/workshops',
    label: 'Workshops',
    short: 'Learn',
    Icon: GraduationCap,
    colorTokenId: 'teal',
  },
]

export function FabricateChrome({
  children,
  current,
}: {
  children: React.ReactNode
  current: FabricateNavId
}) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:max-w-6xl lg:px-8 xl:max-w-7xl xl:py-12 2xl:max-w-[90rem]">
      <nav
        className="sticky top-0 z-30 -mx-4 mb-8 border-b border-[var(--cdc-border)] bg-[var(--cdc-bg,white)]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-neutral-950/90 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        aria-label="Fabrication"
      >
        <div className="flex gap-1.5 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:gap-2 md:overflow-visible">
          {NAV.map((link) => {
            const Icon = link.Icon
            const active =
              current === link.id || (link.id === 'start' && current === 'quote')
            const color = getFabricationColor(link.colorTokenId)
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition md:px-4',
                  active
                    ? cn(color.border, color.surface, color.heading)
                    : 'border-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-full',
                    active ? color.icon : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                  )}
                >
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                </span>
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

export function FabricateCtaRow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center',
        className
      )}
    >
      <Link
        href="/fabricate/start"
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Start a project
      </Link>
      <Link
        href="/fabricate/services"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Explore services
      </Link>
      <Link
        href="/fabricate/estimate"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Plan an estimate
      </Link>
      <Link
        href="/fabricate/pricing"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Compare rates
      </Link>
      <Link
        href="/fabricate/finishes"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        See finish levels
      </Link>
      <Link
        href="/workshops"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Learn in a workshop
      </Link>
    </div>
  )
}
