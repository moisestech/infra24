'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const QUESTIONS = [
  {
    id: 'core-expressive',
    prompt: 'Did AI generate core expressive elements (the main “look,” composition, or text people experience)?',
  },
  {
    id: 'technical-only',
    prompt: 'Did AI only assist with cleanup, captions, formatting, organization, or minor edits?',
  },
  {
    id: 'human-doc',
    prompt: 'Can you document meaningful human creative decisions (drafts, references, revisions)?',
  },
  {
    id: 'collaborator-ai',
    prompt: 'Did a collaborator, editor, or contractor use AI somewhere in the chain?',
  },
  {
    id: 'contract-disclosure',
    prompt: 'Does your agreement or publisher require AI disclosure?',
  },
] as const

export type AIUseSelfAuditOutcome =
  | 'Likely technical assistance'
  | 'Likely substantial AI contribution'
  | 'Needs documentation / review'

function computeOutcome(answers: Record<string, boolean | undefined>): AIUseSelfAuditOutcome {
  const core = answers['core-expressive']
  const technical = answers['technical-only']
  const humanDoc = answers['human-doc']
  const collaborator = answers['collaborator-ai']
  const contract = answers['contract-disclosure']

  const answeredCount = QUESTIONS.filter((q) => typeof answers[q.id] === 'boolean').length

  if (answeredCount < QUESTIONS.length) {
    return 'Needs documentation / review'
  }

  if (core === true) return 'Likely substantial AI contribution'
  if (technical === true && core === false && humanDoc === true) return 'Likely technical assistance'
  if (collaborator === true || contract === true) return 'Needs documentation / review'
  return 'Needs documentation / review'
}

type AIUseSelfAuditProps = {
  className?: string
}

export function AIUseSelfAudit({ className }: AIUseSelfAuditProps) {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({})

  const outcome = useMemo(() => computeOutcome(answers), [answers])

  return (
    <section className={cn('rounded-xl border border-border bg-card p-5 md:p-6', className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">AI use self-audit</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Quick self-check only. This does not determine legal authorship or protection—it helps you decide what to
        document or clarify next.
      </p>
      <div className="mt-4 space-y-4">
        {QUESTIONS.map((question) => (
          <div key={question.id} className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">{question.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={answers[question.id] === true ? 'default' : 'outline'}
                className={answers[question.id] === true ? 'bg-primary-700 hover:bg-primary-800' : ''}
                onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: true }))}
              >
                Yes
              </Button>
              <Button
                type="button"
                size="sm"
                variant={answers[question.id] === false ? 'default' : 'outline'}
                className={answers[question.id] === false ? 'bg-primary-700 hover:bg-primary-800' : ''}
                onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: false }))}
              >
                No
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-900">Indicative result</p>
        <p className="mt-2 text-sm font-medium text-foreground">{outcome}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Practical next steps may include: document and monitor, clarify in writing before proceeding, use platform
          tools, or consider attorney review when stakes are high.
        </p>
      </div>
    </section>
  )
}
