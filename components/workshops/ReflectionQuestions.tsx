'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ReflectionQuestionsProps = {
  moduleId: string
  questions: string[]
  className?: string
}

const storageKey = (moduleId: string) => `oolite-ip-age-of-ai-reflection:${moduleId}`

export function ReflectionQuestions({ moduleId, questions, className }: ReflectionQuestionsProps) {
  const [notes, setNotes] = useState<string[]>(() => questions.map(() => ''))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(moduleId))
      if (!raw) return
      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed) && parsed.length === questions.length) {
        setNotes(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
  }, [moduleId, questions.length])

  const persist = useCallback(
    (next: string[]) => {
      setNotes(next)
      try {
        localStorage.setItem(storageKey(moduleId), JSON.stringify(next))
      } catch {
        // quota or privacy mode
      }
    },
    [moduleId]
  )

  return (
    <section className={cn('rounded-xl border border-border bg-card p-5 md:p-6', className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Reflection questions</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Notes save locally in this browser only. Clearing site data will remove them.
      </p>
      <div className="mt-4 space-y-4">
        {questions.map((question, index) => (
          <div key={question} className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">{question}</p>
            <label className="mt-2 block text-xs text-muted-foreground" htmlFor={`reflection-${moduleId}-${index}`}>
              Your notes (optional)
            </label>
            <textarea
              id={`reflection-${moduleId}-${index}`}
              value={notes[index] ?? ''}
              onChange={(event) => {
                const next = [...notes]
                next[index] = event.target.value
                persist(next)
              }}
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
