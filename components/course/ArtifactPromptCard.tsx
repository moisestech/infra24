import type { ArtifactPrompt } from '@/lib/course/types'

type Props = {
  artifact: ArtifactPrompt
}

function PromptList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/40">
      <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">{title}</h3>
      <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" aria-hidden />
            <span className="leading-7">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export function ArtifactPromptCard({ artifact }: Props) {
  return (
    <section
      id="artifact"
      className="scroll-mt-28 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Try it</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          {artifact.title}
        </h2>
        <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{artifact.description}</p>
      </div>
      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <PromptList title="Easy" items={artifact.easy} />
        <PromptList title="Medium" items={artifact.medium} />
        <PromptList title="Advanced" items={artifact.advanced} />
      </div>
      {artifact.submission?.length ? (
        <article className="mt-6 rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/40">
          <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">Submission</h3>
          <ul className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
            {artifact.submission.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" aria-hidden />
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
    </section>
  )
}
