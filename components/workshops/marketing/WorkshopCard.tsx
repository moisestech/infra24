import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Package, Sparkles } from 'lucide-react'
import type { WorkshopRow } from './types'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { getWorkshopPublicPath } from '@/lib/workshops/workshop-routing'
import { workshopTrackLabel } from '@/lib/workshops/track-labels'
import { WorkshopMediaPlaceholder } from './WorkshopMediaPlaceholder'
import { workshopCategoryLabel } from './workshop-category-labels'
import { cn } from '@/lib/utils'

function formatDuration(minutes?: number | null) {
  if (minutes == null || minutes <= 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  return `${m}m`
}

export function WorkshopCard({
  workshop,
  orgSlug,
}: {
  workshop: WorkshopRow
  orgSlug: string
}) {
  const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
    id: workshop.id,
    title: workshop.title,
  })
  const href = getWorkshopPublicPath(orgSlug, workshop)
  const blurb = m.shortDescription ?? workshop.description ?? ''
  const outcomePreview =
    workshop.outcomes && workshop.outcomes[0] ? workshop.outcomes[0] : null
  const trackLabel = workshopTrackLabel(m.track)
  const categoryLabel = workshopCategoryLabel(workshop.category)

  return (
    <Link href={href} className="group block h-full">
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden border-border/80 bg-card/80 transition-all duration-300',
          'hover:border-border hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20'
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {workshop.image_url ? (
            <>
              <img
                src={workshop.image_url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            <WorkshopMediaPlaceholder
              title={workshop.title}
              subtitle={trackLabel ?? categoryLabel ?? 'Workshop'}
              aspectClassName="aspect-[4/3] rounded-none"
              imagePrompt={m.placeholderImagePrompt}
            />
          )}
          {workshop.featured && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-2.5 py-0.5 text-xs font-medium text-amber-950 shadow-sm">
              Featured
            </span>
          )}
        </div>
        <CardHeader className="space-y-3 pb-2 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {trackLabel ? (
              <Badge
                variant="outline"
                className="border-primary/35 text-[10px] font-medium uppercase tracking-wide text-primary"
              >
                {trackLabel}
              </Badge>
            ) : null}
            {categoryLabel ? (
              <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
                {categoryLabel}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold leading-snug tracking-tight line-clamp-2">
              {workshop.title}
            </CardTitle>
            {workshop.level ? (
              <Badge variant="outline" className="shrink-0 text-[10px] font-medium capitalize">
                {workshop.level}
              </Badge>
            ) : null}
          </div>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {outcomePreview ?? blurb}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto space-y-3 border-t border-border/50 pt-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
              {formatDuration(workshop.duration_minutes)}
            </span>
            {m.materialsProvided && m.materialsProvided.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-primary">
                <Package className="h-3.5 w-3.5 shrink-0" />
                Materials included
              </span>
            )}
            {workshop.level === 'beginner' && (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-70" />
                Beginner-friendly
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
