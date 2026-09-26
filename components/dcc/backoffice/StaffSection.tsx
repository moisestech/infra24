import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { getFabricationColor, type FabricationColorTokenId } from '@/lib/dcc/fabrication/theme'
import type { StaffNotice } from '@/lib/dcc/backoffice/table-read'
import type { StaffKind, StaffRow } from '@/lib/dcc/backoffice/crm-reads'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<StaffKind, { token: FabricationColorTokenId; Icon: LucideIcon; label: string }> = {
  client: { token: 'cyan', Icon: Briefcase, label: 'Client' },
  fabricator: { token: 'teal', Icon: UserRound, label: 'Fabricator' },
  network: { token: 'indigo', Icon: Users, label: 'Network' },
}

function RowBody({ row }: { row: StaffRow }) {
  const kind = row.kind ? KIND_ICON[row.kind] : null
  const color = kind ? getFabricationColor(kind.token) : null
  return (
    <div className="flex items-start gap-3">
      {kind && color ? (
        <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', color.icon)} title={kind.label}>
          <kind.Icon aria-hidden className="h-5 w-5" />
        </span>
      ) : null}
      <div>
        <p className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{row.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{row.detail}</p>
      </div>
    </div>
  )
}

const NOTICE_TOKEN: Record<StaffNotice['tone'], { token: FabricationColorTokenId; Icon: LucideIcon }> = {
  ready: { token: 'emerald', Icon: CheckCircle2 },
  failure: { token: 'rose', Icon: AlertTriangle },
  pending: { token: 'amber', Icon: AlertTriangle },
  finance: { token: 'violet', Icon: AlertTriangle },
}

export function StaffNotices({ notices }: { notices: StaffNotice[] }) {
  if (notices.length === 0) return null
  return (
    <div className="mt-6 space-y-3">
      {notices.map((notice) => {
        const spec = NOTICE_TOKEN[notice.tone]
        const color = getFabricationColor(spec.token)
        const Icon = spec.Icon
        return (
          <div
            key={notice.text}
            className={cn('flex items-start gap-3 rounded-2xl border p-4', color.border, color.surface)}
            role="status"
          >
            <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', color.icon)}>
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <p className={cn('pt-2 text-sm font-medium leading-relaxed', color.heading)}>{notice.text}</p>
          </div>
        )
      })}
    </div>
  )
}

export function StaffPage({
  title,
  lede,
  icon: Icon,
  token,
  notices = [],
  children,
}: {
  title: string
  lede: string
  icon: LucideIcon
  token: FabricationColorTokenId
  notices?: StaffNotice[]
  children?: ReactNode
}) {
  const color = getFabricationColor(token)
  return (
    <section className="mt-8">
      <div className="flex items-start gap-4">
        <span className={cn('inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', color.icon)}>
          <Icon aria-hidden className="h-7 w-7" />
        </span>
        <div>
          <h1 className="cdc-font-display text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">{lede}</p>
        </div>
      </div>
      <StaffNotices notices={notices} />
      {children}
    </section>
  )
}

export function StaffRecords({
  rows,
  empty,
  withheld = false,
}: {
  rows: StaffRow[]
  empty: string
  withheld?: boolean
}) {
  if (withheld) return null
  if (rows.length === 0) {
    return (
      <p className="mt-6 rounded-2xl border border-[var(--cdc-border)] px-4 py-6 text-sm text-neutral-600 dark:text-neutral-300">
        {empty}
      </p>
    )
  }
  return (
    <ul className="mt-6 space-y-3">
      {rows.map((row) => (
        <li key={row.id}>
          {row.href ? (
            <Link
              href={row.href}
              className="block rounded-2xl border border-[var(--cdc-border)] px-4 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <RowBody row={row} />
            </Link>
          ) : (
            <div className="rounded-2xl border border-[var(--cdc-border)] px-4 py-4">
              <RowBody row={row} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
