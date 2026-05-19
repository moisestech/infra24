import type { PilotScope } from '@/lib/ask-the-place/types'

type PilotScopePanelProps = {
  scope: PilotScope
  pilotName: string
}

export function PilotScopePanel({ scope, pilotName }: PilotScopePanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1118] p-4 md:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{pilotName}</p>
      <h3 className="mt-2 text-lg font-medium text-white">{scope.title}</h3>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-400">
        {scope.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-zinc-500">{scope.timeline}</p>
    </div>
  )
}
