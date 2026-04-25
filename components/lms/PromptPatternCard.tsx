import { cn } from '@/lib/utils'

type PromptPattern = {
  label: string
  example: string
}

type PromptPatternCardProps = {
  patterns: PromptPattern[]
  className?: string
}

export function PromptPatternCard({ patterns, className }: PromptPatternCardProps) {
  return (
    <section
      id="onboarding-prompts"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Prompting for creative coding</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Weak prompts create vague output. Stronger prompts add constraints, mood, and deliverable shape.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {patterns.map((pattern) => (
          <article key={pattern.label} className="rounded-2xl border border-border bg-background/60 p-5">
            <h3 className="text-lg font-medium text-foreground">{pattern.label}</h3>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 font-mono text-xs leading-relaxed text-foreground md:text-sm">
              {pattern.example}
            </pre>
          </article>
        ))}
      </div>
    </section>
  )
}
