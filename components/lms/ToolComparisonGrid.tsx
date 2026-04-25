import type { ToolCard } from '@/types/course'
import { cn } from '@/lib/utils'

type ToolComparisonGridProps = {
  tools: ToolCard[]
  className?: string
}

export function ToolComparisonGrid({ tools, className }: ToolComparisonGridProps) {
  return (
    <section
      id="onboarding-tools"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Pick your workspace</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <article key={tool.name} className="rounded-2xl border border-border bg-background/60 p-5">
            <h3 className="text-xl font-medium text-foreground">{tool.name}</h3>
            <p className="mt-2 text-sm italic text-muted-foreground">{tool.feeling}</p>
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best for</p>
              <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                {tool.bestFor.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Use when</p>
              <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                {tool.useWhen.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
