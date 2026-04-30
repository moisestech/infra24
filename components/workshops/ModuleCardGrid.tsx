import Link from 'next/link'
import type { WorkshopModule } from '@/data/ipAgeOfAiWorkshop'

type ModuleCardGridProps = {
  modules: WorkshopModule[]
  basePath: string
}

export function ModuleCardGrid({ modules, basePath }: ModuleCardGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Modules</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.id} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-800">
              Module {module.moduleNumber}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-foreground">{module.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{module.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{module.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Estimated video: {module.video.duration || 'TBD'}</span>
              <span>Progress: Not started</span>
            </div>
            <Link
              href={`${basePath}/${module.id}`}
              className="mt-4 inline-flex text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
            >
              Open lesson
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
