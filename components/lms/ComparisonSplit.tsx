import { cn } from '@/lib/utils'

type ComparisonSplitProps = {
  leftTitle: string
  leftItems: string[]
  rightTitle: string
  rightItems: string[]
  id?: string
  className?: string
}

export function ComparisonSplit({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
  id,
  className,
}: ComparisonSplitProps) {
  return (
    <section id={id} className={cn('grid gap-4 md:grid-cols-2', className)}>
      <article className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{leftTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {leftItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{rightTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {rightItems.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
