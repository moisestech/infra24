export type CanonicalSpineStripProps = {
  spine: {
    artists: readonly string[]
    institutions: readonly string[]
    curators: readonly string[]
    books: readonly string[]
  }
}

function SpineList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <article className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/30">
      <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 dark:border-neutral-600 dark:text-neutral-300"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  )
}

export function CanonicalSpineStrip({ spine }: CanonicalSpineStripProps) {
  return (
    <section
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
      id="canonical-spine"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          Canonical spine
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          Artists, institutions, curators, and books
        </h2>
      </div>
      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <SpineList title="Artists" items={spine.artists} />
        <SpineList title="Institutions" items={spine.institutions} />
        <SpineList title="Curators" items={spine.curators} />
        <SpineList title="Books" items={spine.books} />
      </div>
    </section>
  )
}
