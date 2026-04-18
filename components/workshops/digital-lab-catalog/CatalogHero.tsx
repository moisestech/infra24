'use client'

import { Button } from '@/components/ui/button'
import { digitalLabCatalogCopy } from '@/lib/orgs/oolite/digital-lab-catalog-copy'
import { digitalLabBookWorkshopMailto } from '@/lib/orgs/oolite/digital-lab-catalog-copy'
import { cn } from '@/lib/utils'

type CatalogHeroProps = {
  className?: string
}

export function CatalogHero({ className }: CatalogHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-background to-background px-6 py-12 sm:px-10 sm:py-16',
        className
      )}
    >
      <div className="relative z-[1] max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary">
          {digitalLabCatalogCopy.heroEyebrow}
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {digitalLabCatalogCopy.heroHeadline}
        </h1>
        <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {digitalLabCatalogCopy.heroParagraph}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#digital-lab-catalog">{digitalLabCatalogCopy.heroPrimaryCta}</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={digitalLabBookWorkshopMailto}>
              {digitalLabCatalogCopy.heroSecondaryCta}
            </a>
          </Button>
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          {digitalLabCatalogCopy.heroSupportingLine}
        </p>
      </div>
    </section>
  )
}
