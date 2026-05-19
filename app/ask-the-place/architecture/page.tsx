import Link from 'next/link'
import { AskThePlaceShell } from '@/components/ask-the-place/AskThePlaceShell'
import { PROSPECT_CONFIGS } from '@/lib/ask-the-place/configs'

export default function AskThePlaceArchitecturePage() {
  const routes = Object.keys(PROSPECT_CONFIGS)
  return (
    <AskThePlaceShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <Link href="/ask-the-place" className="text-xs text-zinc-500 hover:text-teal-400">
          ← Ask the Place
        </Link>
        <h1 className="mt-6 text-3xl font-light text-white md:text-4xl">Architecture</h1>
        <p className="mt-4 text-zinc-400">
          Infra24 remains the platform layer. Ask the Place is a product shell: config-driven verticals,
          mock graph/map/timeline, scenario engine (deterministic), and triple-output cards — ready to swap
          for Supabase, Airtable, CMS, signage APIs, and RAG.
        </p>
        <div className="mt-10 space-y-3 rounded-2xl border border-white/10 bg-[#0B1118] p-6 text-sm text-zinc-400">
          <p className="font-semibold text-zinc-200">Stack</p>
          <p>Next.js App Router · Tailwind · shadcn/ui cards · Client scenario resolution</p>
          <p className="pt-4 font-semibold text-zinc-200">Demo routes</p>
          <ul className="list-inside list-disc space-y-1">
            {routes.map((r) => (
              <li key={r}>
                <Link className="text-teal-400 hover:underline" href={`/ask-the-place/${r}`}>
                  /ask-the-place/{r}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-zinc-500">
          <p className="font-medium text-zinc-300">Extension points</p>
          <ul className="mt-3 list-inside list-disc space-y-1">
            <li>Replace `resolveScenarioId` + static bundles with OpenAI + retrieval</li>
            <li>Graph: react-force-graph or vis-network when data volume grows</li>
            <li>Map: Mapbox / Google when geo data is licensed</li>
            <li>Auth: reuse Clerk org roles for Public / Staff / Leadership</li>
          </ul>
        </div>
      </div>
    </AskThePlaceShell>
  )
}
