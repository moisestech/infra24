import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WorkshopRow } from './types'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { getWorkshopPublicPath } from '@/lib/workshops/workshop-routing'

export function WorkshopRelated({
  currentId,
  related,
  orgSlug,
}: {
  currentId: string
  related: WorkshopRow[]
  orgSlug: string
}) {
  const others = related.filter((w) => w.id !== currentId).slice(0, 3)
  if (!others.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Related workshops</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {others.map((w) => {
          const m = mergeWorkshopMetadata(w.metadata ?? undefined, {
            id: w.id,
            title: w.title,
          })
          const href = getWorkshopPublicPath(orgSlug, w)
          return (
            <Link key={w.id} href={href} className="group block">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                {w.image_url && (
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-t-xl">
                    <img
                      src={w.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug line-clamp-2">
                    {w.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.shortDescription && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {m.shortDescription}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {w.level && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {w.level}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
