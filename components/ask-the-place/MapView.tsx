import type { ProspectConfig } from '@/lib/ask-the-place/types'

type MapViewProps = {
  config: ProspectConfig
}

export function MapView({ config }: MapViewProps) {
  const stops = [
    { id: '1', label: 'Property core', cat: 'Spaces' },
    { id: '2', label: 'Partner corridor', cat: 'Partners' },
    { id: '3', label: 'Evening anchor', cat: 'Events' },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stops.map((s, i) => (
        <div
          key={s.id}
          className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/90">{s.cat}</p>
          <p className="mt-2 text-sm font-medium text-white">{s.label}</p>
          <p className="mt-2 text-xs text-zinc-500">Stop {i + 1} · {config.city}</p>
        </div>
      ))}
      <div className="sm:col-span-3 rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-zinc-500">
        Stylized spatial layout — swap for Mapbox / Google when data is live.
      </div>
    </div>
  )
}
