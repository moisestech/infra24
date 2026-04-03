import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export function WorkshopAgenda({
  agenda,
  modulesPreview,
}: {
  agenda: NonNullable<WorkshopMarketingMetadata['agenda']>
  modulesPreview?: WorkshopMarketingMetadata['modulesPreview']
}) {
  if (!agenda?.length && !modulesPreview?.length) return null
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Agenda & module preview</h2>
      {agenda && agenda.length > 0 && (
        <ol className="space-y-4 border-l-2 border-primary/30 pl-6">
          {agenda.map((item, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[1.4rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                {i + 1}
              </span>
              <div className="font-medium">{item.title}</div>
              {item.durationMinutes != null && (
                <div className="text-sm text-muted-foreground">
                  ~{item.durationMinutes} min
                </div>
              )}
              {item.summary && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
      {modulesPreview && modulesPreview.length > 0 && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Future LMS modules
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {modulesPreview.map((m, i) => (
              <li key={i}>
                {m.title}
                {m.lessonCount != null ? ` · ${m.lessonCount} lessons` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
