type WorkshopOverviewProps = {
  about: string
  audience: string
  outcomes: string[]
  disclaimer: string
}

export function WorkshopOverview({ about, audience, outcomes, disclaimer }: WorkshopOverviewProps) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <article className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold text-slate-900">About this workshop</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{about}</p>
      </article>

      <article className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold text-slate-900">Who it is for</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{audience}</p>
      </article>

      <article className="rounded-xl border bg-card p-6 md:col-span-2">
        <h2 className="text-xl font-semibold text-slate-900">What you will leave with</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <li key={outcome} className="rounded-lg bg-cyan-50 p-3">
              {outcome}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Educational disclaimer:</strong> {disclaimer}
        </p>
      </article>
    </section>
  )
}
