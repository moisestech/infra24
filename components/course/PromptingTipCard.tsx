import { AlertTriangle, Bot, CheckCheck } from 'lucide-react'
import type { PromptingTip } from '@/lib/course/types'

export type PromptingTipCardProps = {
  tip: PromptingTip
  sectionId?: string
}

export function PromptingTipCard({ tip, sectionId = 'prompting-tip' }: PromptingTipCardProps) {
  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Prompting tip
        </p>
      </div>
      <div className="mt-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Goal</h2>
        <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{tip.goal}</p>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Weak prompt</h3>
          </div>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
            {tip.weakPrompt}
          </pre>
        </article>
        <article className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Better prompt</h3>
          </div>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
            {tip.betterPrompt}
          </pre>
        </article>
      </div>
      <article className="mt-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <CheckCheck className="h-4 w-4 text-neutral-700 dark:text-neutral-200" aria-hidden />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Review checklist</h3>
        </div>
        <ul className="mt-3 space-y-3 text-neutral-700 dark:text-neutral-300">
          {tip.reviewChecklist.map((item, i) => (
            <li key={`check-${i}`} className="flex gap-3">
              <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <span className="leading-7">{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
