import type { OutputBundle } from '@/lib/ask-the-place/types'

type TimelineViewProps = {
  bundle: OutputBundle | null
}

export function TimelineView({ bundle }: TimelineViewProps) {
  const rows =
    bundle?.itinerary?.length ? bundle.itinerary : [
      { id: 'd', time: 'Today', label: 'Select a scenario to populate the timeline', detail: '' },
    ]
  return (
    <ol className="relative border-l border-white/10 pl-6">
      {rows.map((row, idx) => (
        <li key={row.id} className="mb-6 last:mb-0">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border border-teal-400/50 bg-[#05070A]" />
          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/80">{row.time}</p>
          <p className="mt-1 text-sm font-medium text-white">{row.label}</p>
          {row.detail ? <p className="mt-1 text-xs text-zinc-500">{row.detail}</p> : null}
          {idx === 0 && bundle ? (
            <p className="mt-2 text-xs text-zinc-600">Anchored to scenario: {bundle.scenarioId}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
