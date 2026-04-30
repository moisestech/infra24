import { cn } from '@/lib/utils'

const STEPS = [
  { step: 1, title: 'Document', detail: 'Save screenshots, URLs, dates, and platform names before contacting anyone.' },
  { step: 2, title: 'Assess harm', detail: 'Separate nuisance use from reputational or commercial harm that may need escalation.' },
  { step: 3, title: 'Platform report', detail: 'Use in-app reporting when terms of service or community guidelines may apply.' },
  { step: 4, title: 'DMCA takedown', detail: 'Consider a takedown request when copyright ownership and infringement are clear enough to describe.' },
  { step: 5, title: 'Demand letter / cease and desist', detail: 'A written notice may help create a record; tone and demands should match the situation.' },
  { step: 6, title: 'Attorney review', detail: 'Consider attorney review when money, contracts, or repeated misuse is involved.' },
  { step: 7, title: 'Community response', detail: 'Coordinated, factual community reporting can complement formal steps—not replace them.' },
  { step: 8, title: 'Arbitration / litigation', detail: 'Higher cost paths; often depend on contracts, registration, and enforceable claims.' },
] as const

type RiskResponseLadderProps = {
  className?: string
}

export function RiskResponseLadder({ className }: RiskResponseLadderProps) {
  return (
    <section className={cn(className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Risk response ladder</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A calm order of operations—not a guarantee that every step applies. Skip or reorder based on harm,
        evidence, and capacity.
      </p>
      <ol className="relative mt-6 border-l border-primary-200 pl-6">
        {STEPS.map((item) => (
          <li key={item.step} className="mb-6 last:mb-0">
            <span className="absolute -left-[11px] mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-xs font-semibold text-primary-900">
              {item.step}
            </span>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
