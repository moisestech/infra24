import { loadCeoScorecard } from '@/lib/dcc/ceo-scorecard'

function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export async function CeoScorecard({ embed = false }: { embed?: boolean }) {
  const data = await loadCeoScorecard()

  return (
    <div
      className={
        embed
          ? 'border border-[var(--cdc-border)] bg-neutral-50 p-5 dark:bg-neutral-900/60'
          : 'space-y-8'
      }
    >
      {!embed ? (
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
            CEO view
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Scorecard
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Pipeline is weighted potential — never present it as income. Recognized revenue comes
            from Transactions.
          </p>
        </header>
      ) : (
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
          CEO scorecard (live)
        </h3>
      )}

      {data.error ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">{data.error}</p>
      ) : null}

      {!data.configured ? (
        <p className="text-sm text-neutral-600">{data.artistsServedHint}</p>
      ) : (
        <>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="font-mono text-xs uppercase text-neutral-500">Cash available</dt>
              <dd className="mt-1 font-mono text-xl text-neutral-900 dark:text-neutral-100">
                {money(data.cashAvailable)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-neutral-500">Monthly revenue</dt>
              <dd className="mt-1 font-mono text-xl text-neutral-900 dark:text-neutral-100">
                {money(data.monthlyRevenue)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-neutral-500">MoM growth</dt>
              <dd className="mt-1 font-mono text-xl text-neutral-900 dark:text-neutral-100">
                {data.revenueGrowthPct == null
                  ? '—'
                  : `${data.revenueGrowthPct.toFixed(0)}%`}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-neutral-500">Impact multiplier</dt>
              <dd className="mt-1 font-mono text-xl text-neutral-900 dark:text-neutral-100">
                {data.impactMultiplier == null
                  ? '—'
                  : `${data.impactMultiplier.toFixed(1)}×`}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Pipeline by stage
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              Counts + quoted value (potential) — not recognized revenue.
            </p>
            <ul className="mt-3 space-y-1 font-mono text-xs text-neutral-700 dark:text-neutral-300">
              {data.pipelineByStage
                .filter((s) => s.count > 0)
                .map((s) => (
                  <li key={s.stage} className="flex justify-between gap-4">
                    <span>{s.stage}</span>
                    <span>
                      {s.count} · {money(s.value)}
                    </span>
                  </li>
                ))}
              {data.pipelineByStage.every((s) => s.count === 0) ? (
                <li className="text-neutral-500">No jobs yet</li>
              ) : null}
            </ul>
          </div>

          {data.mbos.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                MBO progress
              </h4>
              <ul className="mt-3 space-y-3">
                {data.mbos.map((m) => (
                  <li key={m.name}>
                    <div className="flex justify-between text-xs">
                      <span>{m.name}</span>
                      <span className="font-mono">
                        {m.progress}/{m.target}
                      </span>
                    </div>
                    <div className="mt-1 h-2 bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-2 bg-[var(--cdc-teal)]"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
