import {
  AlertTriangle,
  BadgeDollarSign,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Users,
  Printer,
  Sun,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  getFabricationColor,
  type FabricationColorTokenId,
} from '@/lib/dcc/fabrication/theme'
import type { StaffNotice } from '@/lib/dcc/backoffice/table-read'
import type {
  BackOfficeAttention,
  BackOfficeCount,
  BackOfficeHomeModel,
  BackOfficeTone,
} from '@/lib/dcc/fabrication-os/backoffice-home'
import { StaffNotices } from '@/components/dcc/backoffice/StaffSection'

const TONE_TOKEN: Record<
  BackOfficeTone,
  { token: FabricationColorTokenId; Icon: LucideIcon }
> = {
  pending: { token: 'amber', Icon: Clock },
  production: { token: 'orange', Icon: Printer },
  failure: { token: 'rose', Icon: AlertTriangle },
  ready: { token: 'emerald', Icon: CheckCircle2 },
  finance: { token: 'violet', Icon: BadgeDollarSign },
}

const CAPACITY_TOKEN: Record<
  string,
  { token: FabricationColorTokenId; Icon: LucideIcon }
> = {
  'Active jobs': { token: 'cyan', Icon: Briefcase },
  'Open production': { token: 'orange', Icon: Layers },
  'Available machines': { token: 'emerald', Icon: Cpu },
  'Machines down': { token: 'rose', Icon: Wrench },
  'Available operators': { token: 'teal', Icon: Users },
}

function IconTile({
  Icon,
  token,
  size,
}: {
  Icon: LucideIcon
  token: FabricationColorTokenId
  size: 'section' | 'row'
}) {
  const color = getFabricationColor(token)
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-2xl',
        color.icon,
        size === 'section' ? 'h-12 w-12' : 'h-10 w-10'
      )}
    >
      <Icon aria-hidden className={size === 'section' ? 'h-6 w-6' : 'h-5 w-5'} />
    </span>
  )
}

function AttentionList({
  items,
  empty,
  emptyIcon: EmptyIcon,
  emptyToken,
}: {
  items: readonly BackOfficeAttention[]
  empty: string
  emptyIcon: LucideIcon
  emptyToken: FabricationColorTokenId
}) {
  if (items.length === 0) {
    const color = getFabricationColor(emptyToken)
    return (
      <div className={cn('mt-4 flex items-center gap-4 rounded-2xl border p-4', color.border, color.surface)}>
        <IconTile Icon={EmptyIcon} token={emptyToken} size="section" />
        <p className={cn('text-base', color.heading)}>{empty}</p>
      </div>
    )
  }

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((item) => {
        const tone = TONE_TOKEN[item.tone]
        const color = getFabricationColor(tone.token)
        return (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4 hover:brightness-95',
                  color.border,
                  color.surface
                )}
              >
                <AttentionBody item={item} tone={tone} color={color} />
              </Link>
            ) : (
              <div className={cn('flex items-start gap-3 rounded-2xl border p-4', color.border, color.surface)}>
                <AttentionBody item={item} tone={tone} color={color} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const CAPACITY_HREF: Record<string, string> = {
  'Active jobs': '/backoffice/jobs',
  'Open production': '/backoffice/queue',
  'Available machines': '/backoffice/machines',
  'Available operators': '/backoffice/fabricators',
}

function AttentionBody({
  item,
  tone,
  color,
}: {
  item: BackOfficeAttention
  tone: { token: FabricationColorTokenId; Icon: LucideIcon }
  color: ReturnType<typeof getFabricationColor>
}) {
  return (
    <>
      <IconTile Icon={tone.Icon} token={tone.token} size="row" />
      <div className="min-w-0">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em]',
            color.chip
          )}
        >
          {item.label}
        </span>
        <p className="mt-1.5 text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          {item.title}
        </p>
        <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300">{item.detail}</p>
      </div>
    </>
  )
}

function CapacityCard({ row }: { row: BackOfficeCount }) {
  const spec = CAPACITY_TOKEN[row.label] ?? { token: 'slate' as const, Icon: Briefcase }
  const color = getFabricationColor(spec.token)
  const href = CAPACITY_HREF[row.label]
  const body = (
    <>
      <IconTile Icon={spec.Icon} token={spec.token} size="section" />
      <p className="mt-4 text-5xl font-semibold tabular-nums tracking-tight text-neutral-950 dark:text-neutral-50">
        {row.value}
      </p>
      <p className={cn('mt-2 text-base font-semibold', color.heading)}>{row.label}</p>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{row.note}</p>
    </>
  )
  return (
    <li className={cn('rounded-2xl border p-5', color.border, color.surface)}>
      {href ? (
        <Link href={href} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  )
}

export function BackOfficeHome({
  model,
  notices,
}: {
  model: BackOfficeHomeModel
  notices: StaffNotice[]
}) {
  const paidColor = getFabricationColor('violet')

  return (
    <div className="mt-8">
      <header>
        <p className="cdc-font-mono-accent text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          DCC fabrication
        </p>
        <h1 className="cdc-font-display mt-2 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          Back office
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          What needs attention today. Jobs and machines come from the CRM. Available operators
          come from the operator catalog.
        </p>
      </header>

      <StaffNotices notices={notices} />

      {model.legacyPaidCount > 0 ? (
        <div
          className={cn(
            'mt-3 flex items-start gap-3 rounded-2xl border p-4',
            paidColor.border,
            paidColor.surface
          )}
        >
          <IconTile Icon={BadgeDollarSign} token="violet" size="row" />
          <p className={cn('pt-1.5 text-sm font-medium', paidColor.heading)}>
            {model.legacyPaidCount} job{model.legacyPaidCount === 1 ? '' : 's'} still use legacy
            Stage Paid. That word is not the operating stage.
          </p>
        </div>
      ) : null}

      <section className="mt-10" aria-labelledby="capacity-heading">
        <div className="flex items-center gap-3">
          <IconTile Icon={Layers} token="orange" size="section" />
          <h2
            id="capacity-heading"
            className="cdc-font-display text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            Operating capacity
          </h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {model.capacity.map((row) => (
            <CapacityCard key={row.label} row={row} />
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="today-heading">
        <div className="flex items-center gap-3">
          <IconTile Icon={Sun} token="cyan" size="section" />
          <h2
            id="today-heading"
            className="cdc-font-display text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            Today
          </h2>
        </div>
        <AttentionList
          items={model.today}
          empty={
            model.jobsStatus === 'records' && model.machinesStatus === 'records'
              ? 'Nothing in the current records needs attention.'
              : 'Attention from unread tables is withheld.'
          }
          emptyIcon={Sun}
          emptyToken="cyan"
        />
      </section>

      <section className="mt-10" aria-labelledby="week-heading">
        <div className="flex items-center gap-3">
          <IconTile Icon={CalendarDays} token="indigo" size="section" />
          <h2
            id="week-heading"
            className="cdc-font-display text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            This week
          </h2>
        </div>
        <AttentionList
          items={model.thisWeek}
          empty={
            model.jobsStatus === 'records'
              ? 'No deadlines in the next seven days.'
              : 'Deadlines are withheld until Jobs can be read.'
          }
          emptyIcon={CalendarDays}
          emptyToken="indigo"
        />
      </section>
    </div>
  )
}
