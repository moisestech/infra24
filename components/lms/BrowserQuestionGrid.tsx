import { cn } from '@/lib/utils'

type BrowserQuestionGridProps = {
  questions: string[]
  id?: string
  className?: string
}

export function BrowserQuestionGrid({ questions, id, className }: BrowserQuestionGridProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Browser-medium questions</h2>
      <p className="mt-2 text-sm text-muted-foreground">Use these while sketching or critiquing a page-in-progress.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {questions.map((question) => (
          <article key={question} className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-sm leading-relaxed text-foreground/90">{question}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
