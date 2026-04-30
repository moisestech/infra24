import Link from 'next/link'
import { Button } from '@/components/ui/button'

type WorkshopHeroProps = {
  title: string
  label: string
  description: string
  startHref: string
  toolkitHref: string
  glossaryHref: string
}

export function WorkshopHero({
  title,
  label,
  description,
  startHref,
  toolkitHref,
  glossaryHref,
}: WorkshopHeroProps) {
  return (
    <section className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 via-background to-primary-50/40 p-8 md:p-12">
      <p className="text-sm font-medium uppercase tracking-wide text-primary-900">{label}</p>
      <h1 className="mt-4 max-w-4xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="bg-primary-700 text-primary-50 hover:bg-primary-800">
          <Link href={startHref}>Start Workshop</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary-300 text-primary-900 hover:bg-primary-50">
          <Link href={toolkitHref}>View Toolkit</Link>
        </Button>
        <Button asChild variant="outline" className="border-primary-300 text-primary-900 hover:bg-primary-50">
          <Link href={glossaryHref}>Browse Glossary</Link>
        </Button>
      </div>
    </section>
  )
}
