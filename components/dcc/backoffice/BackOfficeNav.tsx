'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BadgeDollarSign,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Cpu,
  GraduationCap,
  Layers,
  Sun,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { getFabricationColor, type FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import { cn } from '@/lib/utils'

const LINKS: {
  href: string
  label: string
  token: FabricationColorTokenId
  Icon: LucideIcon
  exact?: boolean
}[] = [
  { href: '/backoffice', label: 'Today', token: 'cyan', Icon: Sun, exact: true },
  { href: '/backoffice/people', label: 'People', token: 'indigo', Icon: Users },
  { href: '/backoffice/fabricators', label: 'Fabricators', token: 'teal', Icon: UserRound },
  { href: '/backoffice/classes', label: 'Classes', token: 'violet', Icon: GraduationCap },
  { href: '/backoffice/calendar', label: 'Calendar', token: 'sky', Icon: CalendarDays },
  { href: '/backoffice/enrollments', label: 'Enrollments', token: 'amber', Icon: ClipboardList },
  { href: '/backoffice/jobs', label: 'Jobs', token: 'cyan', Icon: Briefcase },
  { href: '/backoffice/queue', label: 'Queue', token: 'orange', Icon: Layers },
  { href: '/backoffice/machines', label: 'Machines', token: 'emerald', Icon: Cpu },
  { href: '/backoffice/payments', label: 'Payments', token: 'violet', Icon: BadgeDollarSign },
  { href: '/backoffice/payouts', label: 'Payouts', token: 'rose', Icon: Wallet },
]

export function BackOfficeNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Back office">
      {LINKS.map((link) => {
        const current = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`)
        const color = getFabricationColor(link.token)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium',
              current
                ? cn(color.border, color.surface, color.heading)
                : 'border-[var(--cdc-border)] text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-900'
            )}
          >
            <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-full', color.icon)}>
              <link.Icon aria-hidden className="h-4 w-4" />
            </span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
