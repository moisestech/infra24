type KeyLessonPointsProps = {
  points: string[]
}

export function KeyLessonPoints({ points }: KeyLessonPointsProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Key lesson points</h2>
      <ul className="mt-4 space-y-2">
        {points.map((point) => (
          <li
            key={point}
            className="flex gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground dark:bg-muted/25"
          >
            <span className="mt-[2px] shrink-0 text-primary">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
