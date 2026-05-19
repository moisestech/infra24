import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { WorkshopModule } from '@/data/ipAgeOfAiWorkshop'
import {
  buildIpAgeOfAiYoutubeWatchUrl,
  parseWallTimeToSeconds,
} from '@/lib/workshops/ip-age-of-ai-video'

type ModuleCardGridProps = {
  modules: WorkshopModule[]
  basePath: string
}

export function ModuleCardGrid({ modules, basePath }: ModuleCardGridProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">Modules</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const watchHref = buildIpAgeOfAiYoutubeWatchUrl(parseWallTimeToSeconds(module.video.startTime))
          return (
            <article key={module.id} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-800">
                Module {module.moduleNumber}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{module.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{module.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{module.summary}</p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Recording segment {module.video.startTime}–{module.video.endTime} · Runtime{' '}
                {module.video.duration || 'TBD'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span>Progress: Not started</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`${basePath}/${module.id}`}
                  className="inline-flex text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
                >
                  Open lesson
                </Link>
                <a
                  href={watchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  YouTube
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
