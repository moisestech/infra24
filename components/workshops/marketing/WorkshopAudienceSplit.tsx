export function WorkshopAudienceSplit({
  whoFor,
  whoNotFor,
}: {
  whoFor: string[]
  whoNotFor: string[]
}) {
  if (!whoFor.length && !whoNotFor.length) return null
  return (
    <section className="grid gap-8 md:grid-cols-2">
      {whoFor.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Who it&apos;s for
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
            {whoFor.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      {whoNotFor.length > 0 && (
        <div className="rounded-xl border border-dashed bg-muted/30 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Not the right fit if
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
            {whoNotFor.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
