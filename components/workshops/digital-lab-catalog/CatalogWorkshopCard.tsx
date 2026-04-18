'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import type { CatalogWorkshopView } from '@/lib/workshops/digital-lab-catalog'
import { digitalLabCatalogCopy } from '@/lib/orgs/oolite/digital-lab-catalog-copy'
import {
  filterOptionLabel,
  secondaryBadgeForView,
} from '@/lib/workshops/digital-lab-catalog-constants'
import { WorkshopMediaPlaceholder } from '@/components/workshops/marketing/WorkshopMediaPlaceholder'
import { cn } from '@/lib/utils'

type CatalogWorkshopCardProps = {
  view: CatalogWorkshopView
}

export function CatalogWorkshopCard({ view }: CatalogWorkshopCardProps) {
  const m = view.marketing
  const blurb = m.shortDescription ?? view.row.description ?? ''
  const secondary = secondaryBadgeForView(
    view.packetStatus,
    view.resourcesAvailability
  )
  const levelLabel = filterOptionLabel('level', view.marketingLevel)
  const durationLabel = filterOptionLabel('duration', view.durationBucket)
  const statusLabel = filterOptionLabel('status', view.releaseStatus)

  const cta =
    view.releaseStatus === 'website_ready'
      ? { label: digitalLabCatalogCopy.ctaExplore, href: view.href, disabled: false }
      : view.releaseStatus === 'in_development'
        ? {
            label: digitalLabCatalogCopy.ctaPreview,
            href: view.href,
            disabled: false,
          }
        : {
            label: digitalLabCatalogCopy.ctaComingSoon,
            href: '#',
            disabled: true,
          }

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        {view.row.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={view.row.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <WorkshopMediaPlaceholder
            title={view.title}
            subtitle={view.trackLabel}
            aspectClassName="aspect-[4/3] rounded-none"
            imagePrompt={m.placeholderImagePrompt}
          />
        )}
      </div>
      <CardHeader className="space-y-2 pb-2">
        <div className="flex flex-wrap items-start gap-2">
          <Badge
            variant={
              view.releaseStatus === 'website_ready'
                ? 'default'
                : view.releaseStatus === 'in_development'
                  ? 'secondary'
                  : 'outline'
            }
            className={cn(
              view.releaseStatus === 'website_ready' && 'bg-primary text-primary-foreground'
            )}
          >
            {statusLabel}
          </Badge>
          {secondary ? (
            <Badge variant={secondary.variant}>{secondary.label}</Badge>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          <Link href={view.href} className="hover:text-primary hover:underline">
            {view.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{blurb}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="outline" className="font-normal">
            {view.trackLabel}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {levelLabel}
          </Badge>
          <Badge variant="outline" className="font-normal">
            {durationLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="mt-auto border-t border-border/60 pt-4">
        {cta.disabled ? (
          <Button type="button" variant="secondary" disabled className="w-full">
            {cta.label}
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
