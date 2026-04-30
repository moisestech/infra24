'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { id: 'sell-physical', label: 'Selling physical artwork' },
  { id: 'commission', label: 'Commissioning work' },
  { id: 'license', label: 'Licensing image/audio/video' },
  { id: 'collab', label: 'Collaborating with another artist' },
  { id: 'ai-tools', label: 'Using AI tools' },
  { id: 'documentation', label: 'Allowing documentation or recording' },
  { id: 'voice-likeness', label: 'Protecting voice/likeness' },
  { id: 'no-training', label: 'Restricting AI training on your work' },
  { id: 'governing-law', label: 'Choosing governing law' },
  { id: 'mediation', label: 'Using mediation/arbitration' },
] as const

const SUGGESTED_CLAUSES = [
  'Rights retention and scope of sale (object vs. rights)',
  'AI disclosure and permitted/forbidden uses',
  'No unauthorized derivatives or training where applicable',
  'Licensing scope: territory, duration, media',
  'Governing law and dispute resolution path',
  'Mediation or arbitration before litigation (if appropriate)',
  'Voice/likeness consent and commercial use limits',
]

type ContractClauseSelectorProps = {
  className?: string
}

export function ContractClauseSelector({ className }: ContractClauseSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const summary = useMemo(() => {
    if (selected.size === 0) {
      return 'Select the situations that match your project to surface clauses worth reviewing with counsel or a clinic.'
    }
    return 'Suggested clauses to review (non-exhaustive):'
  }, [selected.size])

  return (
    <section className={cn('rounded-xl border border-border bg-card p-5 md:p-6', className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Contract clause selector</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick what applies. This highlights common review areas—it does not draft a contract or predict enforceability.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant={selected.has(option.id) ? 'default' : 'outline'}
            className={selected.has(option.id) ? 'bg-primary-700 hover:bg-primary-800' : ''}
            onClick={() => toggle(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-sm font-medium text-foreground">{summary}</p>
        {selected.size > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {SUGGESTED_CLAUSES.map((clause) => (
              <li key={clause}>{clause}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
