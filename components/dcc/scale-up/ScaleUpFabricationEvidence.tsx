import Link from 'next/link'
import {
  CAPABILITY_STAGE_META,
  FABRICATION_CAPITAL_GATES,
  FABRICATION_NINETY_DAY_MBO,
  FABRICATION_SCALEUP_THESIS,
  FABRICATION_WHAT_EXISTS,
  FABRICATION_WHAT_WE_TEST,
  getFabricationPublicMetrics,
  listPublicCapabilities,
  listPublicFieldTests,
} from '@/lib/dcc/fabrication'

export function ScaleUpFabricationEvidence() {
  const metrics = getFabricationPublicMetrics()
  const capabilities = listPublicCapabilities()
  const tests = listPublicFieldTests()

  return (
    <section className="mt-16" id="fabrication-evidence">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
        Fabrication evidence
      </h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Same records as{' '}
        <Link href="/fabricate/field-lab" className="text-[var(--cdc-teal)] hover:underline">
          /fabricate/field-lab
        </Link>
        . No duplicate numbers.
      </p>

      <div className="mt-10 space-y-12">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            01 — Thesis
          </h3>
          <p className="mt-3 text-xl leading-relaxed text-neutral-900 dark:text-neutral-100">
            {FABRICATION_SCALEUP_THESIS}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            02 — What exists
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {FABRICATION_WHAT_EXISTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-neutral-500">
            {metrics.rateCardLabels.join(' · ')} · {metrics.inHouseFinishLevels} in-house finish
            levels of {metrics.finishLevelCount}
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            03 — What we’re testing
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
            {FABRICATION_WHAT_WE_TEST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            04 — 90-day MBO
          </h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-neutral-500">Customers</dt>
              <dd className="font-mono text-lg">{FABRICATION_NINETY_DAY_MBO.customers}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-neutral-500">Institutional workshops</dt>
              <dd className="font-mono text-lg">
                {FABRICATION_NINETY_DAY_MBO.institutionalWorkshops}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-neutral-500">Machine hours</dt>
              <dd className="text-sm">{FABRICATION_NINETY_DAY_MBO.machineHours}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-neutral-500">Operators</dt>
              <dd className="font-mono text-lg">{FABRICATION_NINETY_DAY_MBO.operators}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-neutral-500">SOPs</dt>
              <dd className="font-mono text-lg">{FABRICATION_NINETY_DAY_MBO.sops}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-neutral-500">Repeat clients</dt>
              <dd className="font-mono text-lg">{FABRICATION_NINETY_DAY_MBO.repeatClients}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            05 — Field Lab
          </h3>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            {metrics.publicFieldTestCount} public tests · {metrics.publicCapabilityCount} public
            capabilities · {metrics.dccTestProjectCount} DCC test projects
          </p>
          <ul className="mt-4 space-y-2">
            {CAPABILITY_STAGE_META.map((stage) => {
              const count =
                metrics.stageCounts.find((s) => s.id === stage.id)?.count ?? 0
              return (
                <li
                  key={stage.id}
                  className="flex items-center justify-between border-b border-[var(--cdc-border)] py-2 text-sm"
                >
                  <span>
                    {stage.label}
                    <span className="ml-2 text-xs text-neutral-500">{stage.meaning}</span>
                  </span>
                  <span className="font-mono">{count}</span>
                </li>
              )
            })}
          </ul>
          <ul className="mt-4 space-y-2 text-sm">
            {capabilities.map((cap) => (
              <li key={cap.id}>
                <span className="font-medium">{cap.title}</span>
                <span className="text-neutral-500"> · {cap.stage}</span>
              </li>
            ))}
            {tests.map((test) => (
              <li key={test.id} className="text-neutral-600 dark:text-neutral-400">
                {test.id} {test.title} — {test.status}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
            06 — Capital gates
          </h3>
          {FABRICATION_CAPITAL_GATES.map((gate) => (
            <div key={gate.id} className="mt-3">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{gate.title}</p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{gate.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
