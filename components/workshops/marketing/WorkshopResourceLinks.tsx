import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { ExternalLink } from 'lucide-react'

export function WorkshopResourceLinks({
  links,
}: {
  links: NonNullable<WorkshopMarketingMetadata['resourceLinks']>
}) {
  if (!links?.length) return null
  return (
    <section className="rounded-xl border bg-muted/40 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Resources & previews
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary underline-offset-4 hover:underline"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              {l.label}
              {l.type ? (
                <span className="text-xs text-muted-foreground">({l.type})</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
