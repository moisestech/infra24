import type { DccEditorialSource } from '@/lib/dcc/culture/types'

type EditorialSourcesProps = {
  sources: DccEditorialSource[]
}

export function EditorialSources({ sources }: EditorialSourcesProps) {
  if (sources.length === 0) return null

  return (
    <section className="editorial-sources" aria-labelledby="editorial-sources-heading">
      <h2 id="editorial-sources-heading" className="editorial-sources__heading">
        Sources
      </h2>
      <ol className="editorial-sources__list">
        {sources.map((source, index) => (
          <li key={source.id} id={`source-${source.id}`} className="editorial-sources__item">
            <span className="editorial-sources__n">{index + 1}.</span>
            <div>
              {source.href ? (
                <a href={source.href} rel="noreferrer">
                  {source.title}
                </a>
              ) : (
                <span>{source.title}</span>
              )}
              {source.author ? <span> {source.author}.</span> : null}
              {source.publisher ? <span> {source.publisher}.</span> : null}
              {source.published ? <span> {source.published}.</span> : null}
              {source.accessed ? <span> Accessed {source.accessed}.</span> : null}
              {source.note ? <span> {source.note}</span> : null}
              {source.needsResearch ? (
                <p className="editorial-sources__research">
                  Research needed — this entry marks a claim still awaiting a verified citation.
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

type CiteProps = {
  id: string
  n: number
  title: string
}

export function EditorialCite({ id, n, title }: CiteProps) {
  return (
    <a
      href={`#source-${id}`}
      className="editorial-cite"
      aria-label={`Source ${n}: ${title}`}
    >
      <sup>{n}</sup>
    </a>
  )
}
