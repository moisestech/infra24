import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export function WorkshopInstructors({
  instructors,
  fallbackName,
}: {
  instructors: WorkshopMarketingMetadata['instructors']
  fallbackName?: string | null
}) {
  const list =
    instructors && instructors.length > 0
      ? instructors
      : fallbackName
        ? [{ name: fallbackName }]
        : []

  if (!list.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Instructor(s)</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((person, i) => (
          <div key={i} className="flex gap-4 rounded-xl border bg-card p-4">
            {person.imageUrl && (
              <img
                src={person.imageUrl}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />
            )}
            <div>
              <div className="font-medium">{person.name}</div>
              {person.title && (
                <div className="text-sm text-muted-foreground">{person.title}</div>
              )}
              {person.bio && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {person.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
