import type { OutputBundle } from '@/lib/ask-the-place/types'

type ItineraryCardProps = {
  bundle: OutputBundle | null
}

export function ItineraryCard({ bundle }: ItineraryCardProps) {
  const rows = bundle?.itinerary ?? []
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-200/90">Itinerary</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">Select a scenario to build a route.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-teal-200/90">{r.time}</p>
              <p className="text-sm text-white">{r.label}</p>
              {r.detail ? <p className="text-xs text-zinc-500">{r.detail}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
