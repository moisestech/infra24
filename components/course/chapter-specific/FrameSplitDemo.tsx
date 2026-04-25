import type { LessonFrameSplitStep } from '@/lib/course/types'

export type FrameSplitDemoProps = {
  title: string
  description: string
  steps: LessonFrameSplitStep[]
  sectionId?: string
}

/** Static explainer: viewport subdivisions as narrative structure (Chapter 3 signature). */
export function FrameSplitDemo({ title, description, steps, sectionId = 'frame-split-demo' }: FrameSplitDemoProps) {
  return (
    <section
      id={sectionId}
      className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 p-6 text-white shadow-sm md:p-8 dark:border-neutral-700"
    >
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/50">Chapter-specific demo</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl leading-7 text-white/75">{description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <article key={step.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-white/50">{step.label}</h3>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/30" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-white/10" aria-hidden />
              </div>
              <div
                className={`grid gap-2 ${step.fragments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
              >
                {step.fragments.map((fragment) => (
                  <div
                    key={fragment}
                    className="min-h-[72px] rounded-xl border border-white/10 bg-white/5 p-2 text-xs leading-relaxed text-white/70"
                  >
                    {fragment}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
