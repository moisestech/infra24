import Link from 'next/link'
import type { AtpMode, ProspectConfig } from '@/lib/ask-the-place/types'
import { cn } from '@/lib/utils'

type TopNavProps = {
  config: ProspectConfig
  mode: AtpMode
  onPilotCta?: () => void
}

export function TopNav({ config, mode }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070A]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-300"
          >
            Infra24
          </Link>
          <span className="h-4 w-px bg-white/10" aria-hidden />
          <Link href="/ask-the-place" className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-white">
            Ask the Place
          </Link>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
            {config.verticalLabel}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs text-zinc-500 sm:inline">{config.prospectName}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              mode === 'public' && 'bg-teal-500/15 text-teal-200',
              mode === 'staff' && 'bg-amber-500/15 text-amber-100',
              mode === 'leadership' && 'bg-violet-500/15 text-violet-100'
            )}
          >
            {mode}
          </span>
          <Link
            href="/ask-the-place/pilot"
            className="rounded-full border border-amber-200/25 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/20"
          >
            Phase 3 Pilot
          </Link>
        </div>
      </div>
    </header>
  )
}
