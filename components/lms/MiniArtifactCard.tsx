import type { LmsArtifactBrief } from '@/types/lms'
import { cn } from '@/lib/utils'

type MiniArtifactCardProps = {
  artifact: LmsArtifactBrief
  id?: string
  className?: string
  /** When true, hide the bullet list of prompts (e.g. if prompts are shown elsewhere). */
  omitPromptList?: boolean
}

export function MiniArtifactCard({ artifact, id, className, omitPromptList }: MiniArtifactCardProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Mini artifact — {artifact.title}</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{artifact.description}</p>

      {!omitPromptList ? (
        <div className="mt-5">
          <p className="text-sm font-medium text-foreground">Choose one prompt</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {artifact.prompts.map((prompt) => (
              <li key={prompt} className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border bg-background/60 p-4">
          <h3 className="font-medium text-foreground">Easy</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {artifact.modes.easy.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-border bg-background/60 p-4">
          <h3 className="font-medium text-foreground">Medium</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {artifact.modes.medium.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-border bg-background/60 p-4">
          <h3 className="font-medium text-foreground">Advanced</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {artifact.modes.advanced.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
