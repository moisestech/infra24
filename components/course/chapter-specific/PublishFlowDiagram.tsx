import type { ChapterLessonSkin } from '@/lib/course/types'
import type { PublishFlowStep } from '@/lib/course/types'
import { cn } from '@/lib/utils'

export type PublishFlowDiagramProps = {
  title: string
  description: string
  steps: PublishFlowStep[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function PublishFlowDiagram({
  title,
  description,
  steps,
  sectionId = 'publish-flow-diagram',
  presentation,
}: PublishFlowDiagramProps) {
  const publishing = presentation === 'publishing'

  if (publishing) {
    return (
      <section
        id={sectionId}
        className="scroll-mt-28 rounded-[2rem] border border-[#1F8A70]/20 bg-white p-6 shadow-sm md:p-8 dark:border-[#7CE3C6]/20 dark:bg-neutral-950"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#1F8A70] dark:text-[#7CE3C6]">Workflow diagram</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#071A16] dark:text-[#F7FFFC] md:text-3xl">{title}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.label} className="relative">
              <article className="h-full rounded-3xl border border-[#00A67E]/20 bg-gradient-to-b from-[#C6F7E9]/60 to-[#F7FFFC] p-5 dark:border-[#1F8A70]/40 dark:from-[#071A16] dark:to-neutral-900/90">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#1F8A70] dark:text-[#7CE3C6]">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-50">{step.label}</h3>
                {step.detail ? (
                  <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{step.detail}</p>
                ) : null}
              </article>
              {index < steps.length - 1 ? (
                <div
                  className="pointer-events-none absolute right-[-14px] top-1/2 z-10 hidden h-px w-7 -translate-y-1/2 bg-[#7CE3C6]/80 md:block dark:bg-[#1F8A70]/80"
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#F7FFFC] to-white p-6 shadow-sm dark:border-neutral-800 dark:from-[#071A16]/80 dark:to-neutral-950"
    >
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Workflow</p>
      <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={cn(
              'rounded-2xl border border-[#1F8A70]/30 bg-white/90 p-4 dark:border-[#7CE3C6]/25 dark:bg-neutral-950/80',
            )}
          >
            <div className="flex items-center gap-2 text-[#00A67E]">
              <span className="text-xs font-bold uppercase tracking-wide">Step {i + 1}</span>
            </div>
            <p className="mt-2 font-semibold text-neutral-900 dark:text-neutral-50">{step.label}</p>
            {step.detail ? (
              <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{step.detail}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
