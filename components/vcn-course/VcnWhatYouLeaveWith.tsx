import { Check } from 'lucide-react'

const items = [
  'Multiple small browser artifacts with documented decisions',
  'Vocabulary for links, layout, motion, publishing, and liveness',
  'One presentation-ready or publishable net artwork',
  'A short artist statement and influence map',
  'A repeatable vibecoding loop you can reuse on future projects',
]

export function VcnWhatYouLeaveWith() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">What you leave with</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Outcomes designed for portfolios, grants, and classroom critique — not only “finished code.”
        </p>
      </div>
      <ul className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-sm text-neutral-800 dark:text-neutral-100">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              <Check className="h-3.5 w-3.5" aria-hidden />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </section>
  )
}
