import { Badge } from '@/components/ui/badge'
import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { workshopTrackLabel } from '@/lib/workshops/track-labels'
import type { WorkshopRow } from './types'
import { Clock, Users } from 'lucide-react'
import { WorkshopMediaPlaceholder } from './WorkshopMediaPlaceholder'
import { workshopCategoryLabel } from './workshop-category-labels'

const formatLabels: Record<WorkshopMarketingMetadata['format'], string> = {
  in_person: 'In person',
  online: 'Online',
  hybrid: 'Hybrid',
  async_resources: 'Resources / async',
}

function formatDuration(minutes?: number | null) {
  if (minutes == null || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  return `${m}m`
}

export function WorkshopHero({
  workshop,
  marketing,
  levelLabel,
}: {
  workshop: WorkshopRow
  marketing: WorkshopMarketingMetadata
  levelLabel: string
}) {
  const duration = formatDuration(workshop.duration_minutes)
  const subtitle = marketing.subtitle ?? workshop.description ?? ''
  const trackLabel = workshopTrackLabel(marketing.track)
  const categoryLabel = workshopCategoryLabel(workshop.category)

  return (
    <header className="space-y-8">
      {workshop.image_url ? (
        <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
          <img
            src={workshop.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <WorkshopMediaPlaceholder
          title={workshop.title}
          subtitle={trackLabel ?? categoryLabel ?? 'Workshop'}
          aspectClassName="aspect-[21/9] max-h-[420px] min-h-[200px] rounded-xl ring-1 ring-border/40"
          imagePrompt={marketing.placeholderImagePrompt}
        />
      )}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="font-normal">
          {levelLabel}
        </Badge>
        <Badge variant="outline" className="font-normal">
          {formatLabels[marketing.format]}
        </Badge>
        {categoryLabel ? (
          <Badge variant="outline" className="font-normal">
            {categoryLabel}
          </Badge>
        ) : null}
        {trackLabel && (
          <Badge variant="outline" className="border-primary/40 font-normal text-primary">
            {trackLabel}
          </Badge>
        )}
        {workshop.featured && (
          <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
            Featured
          </Badge>
        )}
      </div>
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          {workshop.title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
      <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-muted-foreground">
        {duration && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <dt className="sr-only">Duration</dt>
            <dd>{duration}</dd>
          </div>
        )}
        {workshop.max_participants != null && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0" />
            <dt className="sr-only">Capacity</dt>
            <dd>Up to {workshop.max_participants} participants</dd>
          </div>
        )}
      </dl>
    </header>
  )
}
