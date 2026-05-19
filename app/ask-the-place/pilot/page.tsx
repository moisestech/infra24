import Link from 'next/link'
import { AskThePlaceShell } from '@/components/ask-the-place/AskThePlaceShell'
import { DEFAULT_PILOT_SCOPE } from '@/lib/ask-the-place/pilot-scope'

export default function AskThePlacePilotPage() {
  const s = DEFAULT_PILOT_SCOPE
  return (
    <AskThePlaceShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Link href="/ask-the-place" className="text-xs text-zinc-500 hover:text-teal-400">
          ← Ask the Place
        </Link>
        <h1 className="mt-6 text-3xl font-light text-white md:text-4xl">Phase 3 pilot</h1>
        <p className="mt-4 text-zinc-400">
          Real client pilot mode: data readiness, delivered interfaces, approvals, and instrumentation —
          scaffolded here for sales and delivery alignment.
        </p>
        <section className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-[#0B1118] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-300/90">Delivered in this build</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
            {s.delivered.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        <section className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[#0B1118] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-200/90">Data needed</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-zinc-400">
            {s.dataNeeded.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
        <p className="mt-8 text-sm text-zinc-500">{s.timeline}</p>
        <div className="mt-10">
          <Link
            href="/ask-the-place/hotel/faena"
            className="inline-flex rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2 text-sm font-medium text-teal-100 hover:bg-teal-500/20"
          >
            Open command center demo
          </Link>
        </div>
      </div>
    </AskThePlaceShell>
  )
}
