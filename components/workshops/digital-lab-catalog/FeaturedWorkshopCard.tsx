'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { CatalogWorkshopView } from '@/lib/workshops/digital-lab-catalog'
import { digitalLabCatalogCopy } from '@/lib/orgs/oolite/digital-lab-catalog-copy'
import { filterOptionLabel } from '@/lib/workshops/digital-lab-catalog-constants'
import { WorkshopMediaPlaceholder } from '@/components/workshops/marketing/WorkshopMediaPlaceholder'
import { cn } from '@/lib/utils'

type FeaturedWorkshopCardProps = {
  featured: CatalogWorkshopView | null
  className?: string
}

export function FeaturedWorkshopCard({
  featured,
  className,
}: FeaturedWorkshopCardProps) {
  if (!featured) return null

  const m = featured.marketing
  const levelLabel = filterOptionLabel('level', featured.marketingLevel)
  const durationLabel = filterOptionLabel('duration', featured.durationBucket)

  return (
    <Card
      className={cn(
        'overflow-hidden border-primary/25 bg-card/95 shadow-lg backdrop-blur-sm',
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full bg-muted">
        {featured.row.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featured.row.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <WorkshopMediaPlaceholder
            title={featured.title}
            subtitle={featured.trackLabel}
            aspectClassName="aspect-[16/10] rounded-none"
            imagePrompt={m.placeholderImagePrompt}
          />
        )}
      </div>
      <CardHeader className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {digitalLabCatalogCopy.featuredLabel}
        </p>
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          {digitalLabCatalogCopy.featuredTitle}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {digitalLabCatalogCopy.featuredDescription}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">{featured.trackLabel}</Badge>
          <Badge variant="outline">{levelLabel}</Badge>
          <Badge variant="outline">{durationLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild className="w-full sm:w-auto">
          <Link href={featured.href}>{digitalLabCatalogCopy.featuredCta}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
