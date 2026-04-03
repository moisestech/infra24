export function WorkshopFAQ({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
      <dl className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <dt className="font-medium text-foreground">{item.q}</dt>
            <dd className="mt-2 text-muted-foreground leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
