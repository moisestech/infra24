import type { GlossaryTerm } from '@/types/course'
import { cn } from '@/lib/utils'

type GlossaryGridProps = {
  terms: GlossaryTerm[]
  className?: string
}

export function GlossaryGrid({ terms, className }: GlossaryGridProps) {
  return (
    <section
      id="onboarding-glossary"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">The words you need</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map((term) => (
          <article key={term.term} className="rounded-2xl border border-border bg-background/60 p-4">
            <h3 className="text-lg font-medium text-foreground">{term.term}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{term.definition}</p>
            {term.analogy ? (
              <p className="mt-3 text-xs italic text-muted-foreground/90">{term.analogy}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
