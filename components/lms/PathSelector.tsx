'use client'

import { useEffect, useState } from 'react'
import type { ChapterData, LearningPath } from '@/types/course'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'lms_getting_started_path'

type PathSelectorProps = {
  paths: ChapterData['paths']
  className?: string
}

export function PathSelector({ paths, className }: PathSelectorProps) {
  const [selected, setSelected] = useState<LearningPath | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'easy' || raw === 'structured' || raw === 'ai-assisted') setSelected(raw)
    } catch {
      /* ignore */
    }
  }, [])

  const select = (id: LearningPath) => {
    setSelected(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="onboarding-paths"
      className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Choose your starting lane</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        There is no single correct path—pick what lowers friction for you this week. Your choice is saved only in this
        browser.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {paths.map((path) => {
          const active = selected === path.id
          return (
            <article
              key={path.id}
              className={cn(
                'flex flex-col rounded-2xl border p-5 transition-colors',
                active ? 'border-primary bg-primary/5' : 'border-border bg-background/60'
              )}
            >
              <h3 className="text-xl font-medium text-foreground">{path.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{path.stack}</p>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Best for</p>
                <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                  {path.bestFor.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">You&apos;ll do</p>
                <ul className="mt-2 space-y-2 text-sm text-foreground/90">
                  {path.steps.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Button
                type="button"
                variant={active ? 'default' : 'outline'}
                className="mt-5 w-full"
                onClick={() => select(path.id)}
              >
                {active ? 'Selected' : `Select ${path.title}`}
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
