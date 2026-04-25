import { getSectionIcon } from '@/lib/course/section-icons'

type Props = {
  id: string
  label: string
  title: string
  body: string
  icon?: string
}

export function ConceptBlock({ id, label, title, body, icon }: Props) {
  const Icon = getSectionIcon(icon)

  return (
    <article
      id={id}
      className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/80">
          <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
        </div>
        <div className="min-w-0">
          {label ? (
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
          ) : null}
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300 md:text-base">{body}</p>
        </div>
      </div>
    </article>
  )
}
