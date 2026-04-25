import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import { resolveWorkshopHeroBannerImageUrl } from '@/lib/workshops/workshop-visual-image'
import { workshopTrackLabel } from '@/lib/workshops/track-labels'
import type { WorkshopRow } from './types'
import { Clock, Users } from 'lucide-react'
import { WorkshopMediaPlaceholder } from './WorkshopMediaPlaceholder'
import { workshopCategoryLabel } from './workshop-category-labels'
import { cn } from '@/lib/utils'
import {
  formatWorkshopDurationHeading,
  formatWorkshopLevelHeading,
  formatWorkshopUpdatedHeading,
} from '@/lib/workshops/workshop-hero-summary'
import type { WorkshopHeroEnrollCta } from '@/lib/workshops/workshop-enroll-cta'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'

const formatLabels: Record<WorkshopMarketingMetadata['format'], string> = {
  in_person: 'In person',
  online: 'Online',
  hybrid: 'Hybrid',
  async_resources: 'Resources / async',
}

function formatDurationMeta(minutes?: number | null) {
  if (minutes == null || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  return `${m}m`
}

export type WorkshopHeroEnrollSurface = 'tenant' | 'shadcn'

export function WorkshopHero({
  workshop,
  marketing,
  levelLabel,
  enrollCta,
  enrollSurface = 'shadcn',
}: {
  workshop: WorkshopRow
  marketing: WorkshopMarketingMetadata
  levelLabel: string
  enrollCta?: WorkshopHeroEnrollCta | null
  /** `tenant` uses `--tenant-primary` from org `TenantLayout` (e.g. Oolite). */
  enrollSurface?: WorkshopHeroEnrollSurface
}) {
  const durationMeta = formatDurationMeta(workshop.duration_minutes)
  const durationHeading = formatWorkshopDurationHeading(workshop.duration_minutes)
  const diskSlug = canonicalWorkshopMarketingSlug(marketing.slug)
  const heroHeading =
    marketing.heroTitle ??
    (diskSlug === 'vibe-coding-and-net-art' ? 'Vibe Coding & Net Art' : null) ??
    workshop.title
  const subtitle = marketing.subtitle ?? workshop.description ?? ''
  const trackLabel = workshopTrackLabel(marketing.track)
  const categoryLabel = workshopCategoryLabel(workshop.category)
  const heroImageUrl = resolveWorkshopHeroBannerImageUrl(workshop, marketing)

  const updatedLine = formatWorkshopUpdatedHeading(marketing, workshop)
  const levelHeading = formatWorkshopLevelHeading(levelLabel)
  const hasMetaText = Boolean(updatedLine || levelHeading || durationHeading)
  const showSummaryStrip = Boolean(hasMetaText || enrollCta)

  const enrollLabel = enrollCta?.label ?? 'Enroll Now'
  const enrollClassName = cn(
    'h-auto min-h-[48px] w-full min-w-0 rounded-xl px-6 py-3.5 text-base font-semibold shadow-md',
    'transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--tenant-primary,hsl(var(--ring)))]',
    'sm:w-auto sm:min-w-[220px]'
  )

  const enrollTenantTone =
    enrollSurface === 'tenant'
      ? cn(
          '!border-0 !bg-[var(--tenant-primary)] !text-white shadow-md',
          'hover:!bg-[var(--tenant-primary)] hover:!text-white hover:!brightness-110 hover:!shadow-lg',
          'active:!brightness-95 dark:!shadow-black/25'
        )
      : null

  return (
    <header className="space-y-8">
      {heroImageUrl ? (
        <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
          <img
            src={heroImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <WorkshopMediaPlaceholder
          title={heroHeading}
          subtitle={trackLabel ?? categoryLabel ?? 'Workshop'}
          aspectClassName="aspect-[21/9] max-h-[420px] min-h-[200px] rounded-xl ring-1 ring-border/40"
          imagePrompt={marketing.placeholderImagePrompt}
        />
      )}

      {showSummaryStrip ? (
        <div
          className={cn(
            'flex flex-col gap-4 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-card to-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 sm:p-5',
            hasMetaText ? 'sm:justify-between' : 'sm:justify-end'
          )}
        >
          {hasMetaText ? (
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {updatedLine ? (
                  <span className="font-medium text-foreground">{updatedLine}</span>
                ) : null}
                {updatedLine && (levelHeading || durationHeading) ? (
                  <span className="mx-1.5 text-muted-foreground/70" aria-hidden>
                    ·
                  </span>
                ) : null}
                {levelHeading ? (
                  <span className="font-medium text-foreground">{levelHeading}</span>
                ) : null}
                {durationHeading ? (
                  <>
                    {levelHeading ? (
                      <span className="mx-1.5 text-muted-foreground/70" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span className="font-medium text-foreground">{durationHeading}</span>
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
          {enrollCta ? (
            enrollCta.external ? (
              <Button
                asChild
                size="lg"
                variant={enrollSurface === 'tenant' ? 'ghost' : 'default'}
                disabled={enrollCta.disabled}
                className={cn(enrollClassName, 'shrink-0', enrollTenantTone)}
              >
                <a href={enrollCta.href} target="_blank" rel="noopener noreferrer">
                  {enrollLabel}
                </a>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                variant={enrollSurface === 'tenant' ? 'ghost' : 'default'}
                disabled={enrollCta.disabled}
                className={cn(enrollClassName, 'shrink-0', enrollTenantTone)}
              >
                <Link href={enrollCta.href}>{enrollLabel}</Link>
              </Button>
            )
          ) : null}
        </div>
      ) : null}

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
          {heroHeading}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
      <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-muted-foreground">
        {!durationHeading && durationMeta && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            <dt className="sr-only">Duration</dt>
            <dd>{durationMeta}</dd>
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
