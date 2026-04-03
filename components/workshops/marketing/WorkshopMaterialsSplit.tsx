import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export function WorkshopMaterialsSplit({
  required,
  provided,
  legacyMaterials,
}: {
  required: string[]
  provided: string[]
  /** DB `materials` when marketing arrays empty */
  legacyMaterials?: string[] | null
}) {
  const req = required.length ? required : []
  const prov = provided.length ? provided : []
  const legacy = !req.length && !prov.length ? legacyMaterials ?? [] : []

  if (!req.length && !prov.length && !legacy.length) return null

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {(req.length > 0 || legacy.length > 0) && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Bring / required
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {(req.length ? req : legacy).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {prov.length > 0 && (
        <div className="rounded-xl border bg-primary/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Provided
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {prov.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
