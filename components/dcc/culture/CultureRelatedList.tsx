import Link from 'next/link'

export type CultureRelatedItem = {
  href?: string
  title: string
  meta?: string
}

type CultureRelatedListProps = {
  heading: string
  items: CultureRelatedItem[]
}

export function CultureRelatedList({ heading, items }: CultureRelatedListProps) {
  if (items.length === 0) return null

  return (
    <section className="border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        {heading}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={`${item.title}-${item.href ?? item.meta ?? ''}`}>
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                {item.title}
              </Link>
            ) : (
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {item.title}
              </p>
            )}
            {item.meta ? (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{item.meta}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
