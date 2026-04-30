'use client'

import { useMemo, useState } from 'react'
import type { ScenarioItem } from '@/data/ipAgeOfAiWorkshop'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ScenarioLabProps = {
  scenarios: ScenarioItem[]
  mode: 'preview' | 'full'
  className?: string
}

export function ScenarioLab({ scenarios, mode, className }: ScenarioLabProps) {
  const list = useMemo(() => (mode === 'preview' ? scenarios.slice(0, 3) : scenarios), [mode, scenarios])
  const [activeId, setActiveId] = useState(list[0]?.id ?? '')

  const active = list.find((s) => s.id === activeId) ?? list[0]

  return (
    <section className={cn('rounded-xl border border-border bg-card p-5 md:p-6', className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Scenario lab</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a situation to see practical framing only. Outcomes depend on facts, platform rules, and
        jurisdiction—consider attorney review when stakes are high.
      </p>
      {mode === 'preview' ? (
        <p className="mt-2 text-xs text-muted-foreground">Preview: three scenarios. Open module 8 for the full set.</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {list.map((scenario) => (
          <Button
            key={scenario.id}
            type="button"
            size="sm"
            variant={scenario.id === active?.id ? 'default' : 'outline'}
            className={scenario.id === active?.id ? 'bg-primary-700 hover:bg-primary-800' : ''}
            onClick={() => setActiveId(scenario.id)}
          >
            {scenario.scenario}
          </Button>
        ))}
      </div>

      {active ? (
        <div className="mt-6 space-y-4 rounded-lg border border-border bg-muted/20 p-4 text-sm">
          <div>
            <h3 className="font-semibold text-foreground">What rights may be involved</h3>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              {active.rightsInvolved.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Evidence to collect</h3>
            <ul className="mt-2 list-disc pl-5 text-muted-foreground">
              {active.evidenceToCollect.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">A practical first step</h3>
            <p className="mt-2 text-muted-foreground">{active.firstStep}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">When to escalate</h3>
            <p className="mt-2 text-muted-foreground">{active.whenToEscalate}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Related template</h3>
            <p className="mt-2 text-muted-foreground">{active.relatedTemplate}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
