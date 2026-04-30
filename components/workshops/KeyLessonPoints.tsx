type KeyLessonPointsProps = {
  points: string[]
}

export function KeyLessonPoints({ points }: KeyLessonPointsProps) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-xl font-semibold text-slate-900">Key lesson points</h2>
      <ul className="mt-4 space-y-2">
        {points.map((point) => (
          <li key={point} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <span className="mt-[2px] text-cyan-700">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
