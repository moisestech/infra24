type NextActionsPanelProps = {
  actions: string[]
}

export function NextActionsPanel({ actions }: NextActionsPanelProps) {
  if (!actions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#05070A]/50 p-4 text-sm text-zinc-600">
        Next actions appear when a scenario is active.
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-[#05070A] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Next actions</p>
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-zinc-300">
        {actions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>
    </div>
  )
}
