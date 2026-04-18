'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type CatalogEmptyStateProps = {
  heading: string
  body: string
  ctaLabel: string
  onClear: () => void
}

export function CatalogEmptyState({
  heading,
  body,
  ctaLabel,
  onClear,
}: CatalogEmptyStateProps) {
  return (
    <Card className="border-dashed border-border bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{heading}</h3>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">{body}</p>
        <Button type="button" onClick={onClear}>
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
