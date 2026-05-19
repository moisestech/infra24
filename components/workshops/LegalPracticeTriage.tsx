import { cn } from '@/lib/utils'

export type LegalPracticeTriageProps = {
  lawSays: string[]
  unsettled: string[]
  artistPractice: string[]
  className?: string
}

export function LegalPracticeTriage({ lawSays, unsettled, artistPractice, className }: LegalPracticeTriageProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-sm md:p-6',
        className
      )}
      aria-labelledby="legal-practice-triage-heading"
    >
      <h2 id="legal-practice-triage-heading" className="text-xl font-semibold tracking-tight text-foreground">
        Law, uncertainty, and your practice
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This workshop separates three layers: what the law may say, what remains unsettled, and what artists can
        do in practice. This is educational context only—not legal advice.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">What the law may say</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-foreground/90">
            {lawSays.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100">
            What remains unsettled
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-foreground/90 dark:text-amber-50/90">
            {unsettled.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-4 dark:border-primary/35 dark:bg-primary/10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">What artists can do</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-foreground/90">
            {artistPractice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
