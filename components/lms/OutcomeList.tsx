import { cn } from '@/lib/utils'

type OutcomeListProps = {
  outcomes: string[]
  className?: string
  sectionId?: string
}

export function OutcomeList({ outcomes, className, sectionId = 'onboarding-outcomes' }: OutcomeListProps) {
  return (
    <section
      id={sectionId}
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">What you&apos;ll learn</h2>
      <ul className="mt-4 space-y-3 text-muted-foreground">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex gap-3 leading-relaxed">
            <span className="mt-0.5 shrink-0 text-foreground">•</span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
