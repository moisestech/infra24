import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export type WorkshopHeroProps = {
  title: string
  subtitle: string
  description: string
  ctas: { label: string; href: string }[]
}

export function WorkshopHero({ title, subtitle, description, ctas }: WorkshopHeroProps) {
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-12">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
          <Sparkles className="h-4 w-4" aria-hidden />
          Workshop
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 md:text-2xl">{subtitle}</p>
        <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-700 dark:text-neutral-300 md:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {ctas.map((cta) => (
            <Link
              key={`${cta.label}-${cta.href}`}
              href={cta.href}
              className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
