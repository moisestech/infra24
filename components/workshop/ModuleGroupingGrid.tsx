import { Globe, Layers3, Monitor, Sparkles, type LucideIcon } from 'lucide-react'

export type ModuleCard = {
  key: string
  title: string
  chapterRange: string
  description: string
  accent: string
  icon: string
}

export type ModuleGroupingGridProps = {
  modules: ModuleCard[]
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Monitor,
  Layers3,
  Globe,
}

const accentMap: Record<string, string> = {
  blue: 'border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40',
  violet: 'border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40',
  rose: 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40',
  emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40',
}

export function ModuleGroupingGrid({ modules }: ModuleGroupingGridProps) {
  return (
    <section
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
      id="modules"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Module grouping
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          A structured path from setup to final artwork
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = iconMap[module.icon] ?? Sparkles
          const accentClass = accentMap[module.accent] ?? 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950/50'
          return (
            <article key={module.key} className={`rounded-3xl border p-5 ${accentClass}`}>
              <Icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" aria-hidden />
              <p className="mt-4 text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Chapters {module.chapterRange}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-neutral-950 dark:text-neutral-50">{module.title}</h3>
              <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{module.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
