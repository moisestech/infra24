import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export function WorkshopTestimonials({
  testimonials,
}: {
  testimonials: WorkshopMarketingMetadata['testimonials']
}) {
  if (!testimonials?.length) return null
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">What participants say</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="rounded-xl border bg-card p-6 text-base leading-relaxed"
          >
            <p className="text-foreground">&ldquo;{t.quote}&rdquo;</p>
            {(t.attribution || t.role) && (
              <footer className="mt-4 text-sm text-muted-foreground">
                {t.attribution}
                {t.attribution && t.role ? ' · ' : ''}
                {t.role}
              </footer>
            )}
          </blockquote>
        ))}
      </div>
    </section>
  )
}
