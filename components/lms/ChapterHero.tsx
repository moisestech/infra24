import { cn } from '@/lib/utils'

type ChapterHeroProps = {
  title: string
  subtitle: string
  description: string
  eyebrow?: string
  className?: string
}

export function ChapterHero({
  title,
  subtitle,
  description,
  eyebrow = 'Onboarding',
  className,
}: ChapterHeroProps) {
  return (
    <section
      id="onboarding-hero"
      className={cn(
        'rounded-3xl border border-border bg-card/50 p-8 shadow-sm md:p-10',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/90">{description}</p>
    </section>
  )
}
