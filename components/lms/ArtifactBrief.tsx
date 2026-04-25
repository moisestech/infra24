import { cn } from '@/lib/utils'

type ArtifactBriefProps = {
  className?: string
}

export function ArtifactBrief({ className }: ArtifactBriefProps) {
  return (
    <section
      id="onboarding-artifact"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Your first artifact</h2>
      <div className="mt-4 rounded-2xl border border-border bg-background/60 p-5">
        <h3 className="text-xl font-medium text-foreground">Hello Browser</h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Create a one-page browser work with a title, one sentence, one visual style choice, and one interaction or
          motion choice.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/90">
          <li>• poetic homepage</li>
          <li>• digital self-portrait</li>
          <li>• weird welcome page</li>
          <li>• browser poem</li>
          <li>• tiny net art poster</li>
        </ul>
      </div>
    </section>
  )
}
