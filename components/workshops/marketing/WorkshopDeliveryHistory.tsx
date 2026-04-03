import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export function WorkshopDeliveryHistory({
  deliveryHistory,
}: {
  deliveryHistory: WorkshopMarketingMetadata['deliveryHistory']
}) {
  if (!deliveryHistory) return null
  const { firstOfferedYear, runsCount, venues } = deliveryHistory
  if (
    firstOfferedYear == null &&
    runsCount == null &&
    (!venues || venues.length === 0)
  )
    return null

  return (
    <section className="rounded-xl border bg-muted/40 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Program history
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        {firstOfferedYear != null && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Offered since</dt>
            <dd className="font-medium">{firstOfferedYear}</dd>
          </div>
        )}
        {runsCount != null && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Runs</dt>
            <dd className="font-medium">{runsCount}</dd>
          </div>
        )}
        {venues && venues.length > 0 && (
          <div>
            <dt className="text-muted-foreground">Partner / venue context</dt>
            <dd className="mt-1 font-medium">{venues.join(' · ')}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
