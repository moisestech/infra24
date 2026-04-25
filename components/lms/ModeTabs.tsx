import type { ChapterData, ModeConfig } from '@/types/course'
import { cn } from '@/lib/utils'

type ModeTabsProps = {
  modes: ChapterData['modes']
  className?: string
}

export function ModeTabs({ modes, className }: ModeTabsProps) {
  const entries = Object.entries(modes) as Array<[string, ModeConfig]>

  return (
    <section
      id="onboarding-modes"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Choose your mode</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {entries.map(([key, mode]) => (
          <article key={key} className="rounded-2xl border border-border bg-background/60 p-5">
            <h3 className="text-xl font-medium capitalize text-foreground">{mode.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{mode.tools.join(' + ')}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/90">
              {mode.steps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-foreground">{mode.outcome}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
