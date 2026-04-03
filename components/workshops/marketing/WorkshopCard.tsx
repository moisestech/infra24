import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Package, Sparkles } from 'lucide-react'
import type { WorkshopRow } from './types'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { getWorkshopPublicPath } from '@/lib/workshops/workshop-routing'

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

  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow group-hover:shadow-lg">
        {workshop.image_url && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={workshop.image_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {workshop.featured && (
              <span className="absolute right-3 top-3 rounded-full bg-amber-500/95 px-2 py-0.5 text-xs font-medium text-amber-950">
                Featured
              </span>
            )}
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug line-clamp-2">
              {workshop.title}
            </CardTitle>
            {workshop.level && (
              <Badge variant="secondary" className="shrink-0 uppercase text-[10px]">
                {workshop.level}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-3 text-base">
            {outcomePreview ?? blurb}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto space-y-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(workshop.duration_minutes)}
            </span>
            {m.materialsProvided && m.materialsProvided.length > 0 && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Package className="h-3.5 w-3.5" />
                Materials included
              </span>
            )}
            {workshop.level === 'beginner' && (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Beginner-friendly
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
