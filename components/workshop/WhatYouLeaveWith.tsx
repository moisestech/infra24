export type WhatYouLeaveWithProps = {
  items: string[]
}

export function WhatYouLeaveWith({ items }: WhatYouLeaveWithProps) {
  return (
    <section
      className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:p-8"
      id="what-you-leave-with"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          What you leave with
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
          A real browser-based practice
        </h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item}
            className="rounded-3xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-950/30"
          >
            <p className="leading-7 text-neutral-700 dark:text-neutral-300">{item}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
