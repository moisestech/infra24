'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Progress from '@radix-ui/react-progress'
import { Palette, Hammer, Clapperboard, Code2, Gamepad2, Compass, ArrowUpRight } from 'lucide-react'
import { DCC_DISCOVERY_POLL, type DiscoveryPollChoiceId } from '@/lib/dcc/artwork/discovery-poll'

const ICONS = {
  art: Palette,
  fabrication: Hammer,
  film: Clapperboard,
  code: Code2,
  xr: Gamepad2,
  exploring: Compass,
} as const

type Props = {
  compact?: boolean
  title?: string
  selectedChoice?: DiscoveryPollChoiceId | null
  onSelectChoice?: (choice: DiscoveryPollChoiceId | null) => void
}

/** Shared poll totals; selections are aggregate and never attributed to people. */
export function PollPulse({ compact = false, title = 'What would you like to discover?', selectedChoice, onSelectChoice }: Props) {
  const [internalSelection, setInternalSelection] = useState<DiscoveryPollChoiceId | null>(null)
  const selected = selectedChoice === undefined ? internalSelection : selectedChoice
  function select(choice: DiscoveryPollChoiceId) {
    const next = selected === choice ? null : choice
    if (selectedChoice === undefined) setInternalSelection(next)
    onSelectChoice?.(next)
  }
  const max = Math.max(...DCC_DISCOVERY_POLL.choices.map((choice) => choice.count))
  const active = DCC_DISCOVERY_POLL.choices.find((choice) => choice.id === selected)

  return (
    <section id="community-interests" aria-labelledby="community-poll-title" className="min-w-0">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[color:var(--dn-subtle)]">Community interests</p>
          <h2 id="community-poll-title" className={compact ? 'mt-2 text-lg font-normal tracking-[-.035em] text-[color:var(--dn-ink)]' : 'mt-2 text-2xl font-normal tracking-[-.045em] text-[color:var(--dn-ink)] sm:text-3xl'}>
            {title}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <strong className={compact ? 'text-xl font-normal tabular-nums text-[color:var(--dn-ink)]' : 'text-3xl font-normal tabular-nums text-[color:var(--dn-ink)]'}>{DCC_DISCOVERY_POLL.totalSelections}</strong>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--dn-subtle)]">selections</p>
        </div>
      </div>

      <div className={compact ? 'mt-5 grid gap-2 sm:grid-cols-2' : 'mt-7 grid gap-2 sm:grid-cols-2 xl:grid-cols-3'}>
        {DCC_DISCOVERY_POLL.choices.map((choice) => {
          const Icon = ICONS[choice.id]
          const isActive = choice.id === selected
          const categoryColor = 'var(--dn-poll-' + choice.id + ')'
          return (
            <button
              key={choice.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => select(choice.id)}
              className={[
                'group flex min-w-0 items-center gap-3 rounded-xl border px-3.5 py-3.5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--dn-link)]',
                isActive ? 'border-[color:var(--dn-line-strong)] bg-[var(--dn-panel-soft)]' : 'border-[color:var(--dn-line)] bg-[var(--dn-panel)] hover:border-[color:var(--dn-line-strong)] hover:bg-[var(--dn-hover)]',
              ].join(' ')}
            >
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--dn-panel-soft)]" style={{ color: categoryColor }}>
                <Icon size={18} strokeWidth={1.65} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] leading-tight text-[color:var(--dn-muted)]">{choice.short}</span>
                <Progress.Root value={choice.count} max={max} aria-label={choice.label} className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-[var(--dn-progress-track)]">
                  <Progress.Indicator className="h-full rounded-full transition-transform duration-300 motion-reduce:transition-none" style={{ backgroundColor: categoryColor, width: String(choice.count / max * 100) + '%' }} />
                </Progress.Root>
              </span>
              <span className="shrink-0 font-mono text-base tabular-nums text-[color:var(--dn-muted)]">{choice.count}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs leading-relaxed text-[color:var(--dn-subtle)]">
        <p aria-live="polite">{active ? active.count + ' selections · ' + active.label + ' · public practice links are not poll votes' : 'Multiple selections allowed · practice links reflect public profiles, not votes'}</p>
        {compact ? <Link href="/network/artwork#community-interests" className="inline-flex items-center gap-1 text-[color:var(--dn-link)] hover:text-[color:var(--dn-ink)]">
          Open artwork <ArrowUpRight size={13} />
        </Link> : null}
      </div>
    </section>
  )
}
