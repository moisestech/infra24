import type { LmsCanonArtist } from '@/types/lms'
import { cn } from '@/lib/utils'

type CanonSamplerProps = {
  artists: LmsCanonArtist[]
  id?: string
  className?: string
  heading?: string
  intro?: string
}

export function CanonSampler({ artists, id, className, heading, intro }: CanonSamplerProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{heading ?? 'A short canon sampler'}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {intro ?? 'Sampler only—follow one link, skim one work, return when you are ready to build.'}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {artists.map((artist) => (
          <article key={artist.name} className="rounded-2xl border border-border bg-background/60 p-5">
            <h3 className="text-lg font-medium text-foreground">
              {artist.href ? (
                <a
                  href={artist.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {artist.name}
                </a>
              ) : (
                artist.name
              )}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{artist.focus}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
