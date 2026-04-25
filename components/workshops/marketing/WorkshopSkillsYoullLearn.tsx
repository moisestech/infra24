import { Check } from 'lucide-react'

const DEFAULT_VISIBLE = 8

export function WorkshopSkillsYoullLearn({
  skills,
  visibleCount = DEFAULT_VISIBLE,
}: {
  skills: string[]
  /** Max chips before "+N more" (default 8). */
  visibleCount?: number
}) {
  if (!skills.length) return null

  const cap = Math.max(1, visibleCount)
  const shown = skills.slice(0, cap)
  const more = skills.length - shown.length

  return (
    <section
      className="rounded-xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
      aria-labelledby="workshop-skills-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
        <h2
          id="workshop-skills-heading"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Skills you&apos;ll learn
        </h2>
        <p className="text-sm font-medium tabular-nums text-muted-foreground">
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
        </p>
      </div>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {shown.map((skill, i) => (
          <li
            key={i}
            className="flex gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm leading-snug text-foreground"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
      {more > 0 ? (
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          +{more} more {more === 1 ? 'skill' : 'skills'}
        </p>
      ) : null}
    </section>
  )
}
