type RecommendationCardProps = {
  title: string
  subtitle: string
  why: string
}

export function RecommendationCard({ title, subtitle, why }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/90">Recommended</p>
      <h3 className="mt-1 text-base font-medium text-white">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-zinc-400">
        <span className="font-medium text-zinc-300">Why: </span>
        {why}
      </p>
    </div>
  )
}
