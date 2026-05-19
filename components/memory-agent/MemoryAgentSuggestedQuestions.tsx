'use client'

import { Sparkles } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ma } from '@/lib/memory-agent/ui-tokens'
import { cn } from '@/lib/utils'

type MemoryAgentSuggestedQuestionsProps = {
  questions: string[]
  onSelect: (question: string) => void
}

export function MemoryAgentSuggestedQuestions({
  questions,
  onSelect,
}: MemoryAgentSuggestedQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <Accordion type="single" collapsible className="mt-6 w-full">
      <AccordionItem value="try-asking" className="border-0">
        <AccordionTrigger
          className={cn(
            'ma-try-asking-trigger group/trigger rounded-xl border-2 border-[var(--ma-border-strong)]',
            'bg-[color-mix(in_srgb,var(--ma-primary)_6%,var(--ma-surface))]',
            'px-4 py-3 text-left font-semibold text-[var(--ma-text)]',
            'transition-[transform,box-shadow,border-color,background-color] duration-300',
            'hover:no-underline',
            'hover:border-[color:color-mix(in_srgb,var(--ma-primary)_55%,var(--ma-border))]',
            'hover:bg-[color-mix(in_srgb,var(--ma-primary)_12%,var(--ma-surface))]',
            'data-[state=open]:border-[var(--ma-border-strong)]',
            'data-[state=open]:bg-[var(--ma-surface-muted)]',
            'data-[state=open]:shadow-none',
            '[&[data-state=closed]]:hover:scale-[1.008]',
            '[&>svg]:text-[color:var(--ma-primary)]'
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                'bg-[color-mix(in_srgb,var(--ma-primary)_16%,var(--ma-surface))]',
                'transition-transform duration-300',
                'group-hover/trigger:scale-110',
                'group-data-[state=closed]/trigger:group-hover/trigger:animate-[ma-sparkle-pulse_1.8s_ease-in-out_infinite]',
                'group-data-[state=open]/trigger:scale-100 group-data-[state=open]/trigger:animate-none'
              )}
            >
              <Sparkles className="h-4 w-4 text-[color:var(--ma-primary)]" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ma-text-muted)]">
                Try asking
              </span>
              <span className="truncate text-sm font-medium text-[var(--ma-text)] group-data-[state=open]/trigger:hidden">
                Tap to see example questions
              </span>
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-1 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {questions.map((q) => (
              <button
                key={q}
                type="button"
                className={cn(
                  ma.chip,
                  'w-full text-left transition-transform hover:scale-[1.01] sm:w-auto sm:max-w-full'
                )}
                onClick={() => onSelect(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
