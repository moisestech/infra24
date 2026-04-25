import { Building2, Code2, Palette, type LucideIcon } from 'lucide-react'

export type WhyWorkshopItem = {
  title: string
  body: string
  icon: string
}

export type WhyThisWorkshopProps = {
  items: WhyWorkshopItem[]
}

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Building2,
}

export function WhyThisWorkshop({ items }: WhyThisWorkshopProps) {
  return (
    <section
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
      id="why-this-workshop"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Why this workshop
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Learn net art as both history and practice
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon] ?? Palette
          return (
            <article
              key={item.title}
              className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/50"
            >
              <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-neutral-950 dark:text-neutral-50">{item.title}</h3>
              <p className="mt-3 leading-7 text-neutral-700 dark:text-neutral-300">{item.body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
