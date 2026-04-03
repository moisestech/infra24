import { CheckCircle2 } from 'lucide-react'

export function WorkshopOutcomeStrip({ outcomes }: { outcomes: string[] }) {
  if (!outcomes.length) return null
  return (
    <section className="rounded-xl border bg-card p-6 md:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Outcomes
      </h2>
      <ul className="mt-4 space-y-3">
        {outcomes.map((o, i) => (
          <li key={i} className="flex gap-3 text-base leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
