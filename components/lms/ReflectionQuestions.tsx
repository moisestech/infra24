'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_STORAGE_PREFIX = 'lms_getting_started_reflect_'

type ReflectionQuestionsProps = {
  questions: string[]
  className?: string
  /** localStorage key prefix so different chapters do not overwrite each other */
  storagePrefix?: string
}

export function ReflectionQuestions({
  questions,
  className,
  storagePrefix = DEFAULT_STORAGE_PREFIX,
}: ReflectionQuestionsProps) {
  const prefix = storagePrefix
  const [values, setValues] = useState<Record<number, string>>({})

  useEffect(() => {
    const next: Record<number, string> = {}
    questions.forEach((_, i) => {
      try {
        next[i] = localStorage.getItem(prefix + i) ?? ''
      } catch {
        next[i] = ''
      }
    })
    setValues(next)
  }, [questions, prefix])

  const persist = (index: number, text: string) => {
    try {
      localStorage.setItem(prefix + index, text)
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="onboarding-reflection"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Reflection</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Notes stay in this browser only—they are not sent to a server.
      </p>
      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question}>
            <label className="block text-sm font-medium text-foreground">{question}</label>
            <textarea
              className="mt-2 min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              value={values[index] ?? ''}
              onChange={(e) => {
                const text = e.target.value
                setValues((prev) => ({ ...prev, [index]: text }))
              }}
              onBlur={(e) => persist(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <blockquote className="mt-8 border-l-4 border-primary pl-4 text-muted-foreground">
        <p className="text-sm leading-relaxed">
          You are now ready to continue in the workshop reader—net art primer, then technical chapters—or jump straight
          into the next hands-on chapter if your instructor says so.
        </p>
      </blockquote>
    </section>
  )
}
