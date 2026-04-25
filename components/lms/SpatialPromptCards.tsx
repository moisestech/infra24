import { cn } from '@/lib/utils'

type SpatialPromptCardsProps = {
  prompts: string[]
  id?: string
  className?: string
}

export function SpatialPromptCards({ prompts, id, className }: SpatialPromptCardsProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Choose a browser study direction</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <article key={prompt} className="rounded-2xl border border-border bg-background/60 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{prompt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
