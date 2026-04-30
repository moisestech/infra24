import type { ResourceLink } from '@/data/ipAgeOfAiWorkshop'

type ResourceLinksProps = {
  links: ResourceLink[]
  title?: string
  intro?: string
}

export function ResourceLinks({
  links,
  title = 'Curated resources',
  intro = 'These links support follow-up reading. They do not replace advice from a qualified attorney.',
}: ResourceLinksProps) {
  const grouped = links.reduce<Record<ResourceLink['category'], ResourceLink[]>>(
    (acc, link) => {
      if (!acc[link.category]) acc[link.category] = []
      acc[link.category].push(link)
      return acc
    },
    {} as Record<ResourceLink['category'], ResourceLink[]>
  )

  const categories = Object.keys(grouped) as ResourceLink['category'][]

  return (
    <section className="rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
      <div className="mt-6 space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-800">{category}</h3>
            <ul className="mt-3 space-y-3">
              {grouped[category].map((resource) => (
                <li key={resource.title} className="rounded-lg border border-border bg-muted/20 p-4">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary-800 underline-offset-4 hover:underline"
                  >
                    {resource.title}
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
