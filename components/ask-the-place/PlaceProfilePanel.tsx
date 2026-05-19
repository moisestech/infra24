import type { ProspectConfig } from '@/lib/ask-the-place/types'
import { prospectAccentClasses } from '@/lib/ask-the-place/configs'

type PlaceProfilePanelProps = {
  config: ProspectConfig
}

export function PlaceProfilePanel({ config }: PlaceProfilePanelProps) {
  const a = prospectAccentClasses(config.accentToken)
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0B1118] p-4 shadow-xl ring-1 ${a.ring}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Place profile</p>
      <h2 className="mt-2 text-xl font-medium tracking-tight text-white md:text-2xl">
        {config.prospectName}
      </h2>
      <p className={`mt-1 text-sm ${a.text}`}>{config.productName}</p>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{config.tagline}</p>
      <p className="mt-4 text-xs text-zinc-500">{config.city}</p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{config.description}</p>
    </div>
  )
}
