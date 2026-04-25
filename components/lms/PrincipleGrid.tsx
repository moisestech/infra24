import { cn } from '@/lib/utils'

type PrincipleGridProps = {
  principles: string[]
  id?: string
  className?: string
}

export function PrincipleGrid({ principles, id, className }: PrincipleGridProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Net art principles in this course</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle} className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-sm font-medium leading-snug text-foreground">{principle}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
