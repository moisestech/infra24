import Link from 'next/link'
import { AskThePlaceShell } from '@/components/ask-the-place/AskThePlaceShell'
import { VerticalSelector } from '@/components/ask-the-place/VerticalSelector'
import { Button } from '@/components/ui/button'

export default function AskThePlaceLandingPage() {
  return (
    <AskThePlaceShell>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-teal-400/90">
          Infra24 · Cultural Intelligence
        </p>
        <h1 className="mt-4 text-center text-4xl font-light tracking-tight text-white md:text-5xl">
          Ask the Place
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-zinc-400">
          Cultural Intelligence Concierge for hotels, clubs, residences, districts, institutions, and
          collections.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-zinc-500">
          One engine. Multiple vertical skins. Desktop proves intelligence; mobile proves experience;
          signage proves physical impact.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 text-white hover:from-teal-500 hover:to-teal-400">
            <Link href="/ask-the-place/hotel/faena">Launch hotel demo</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-amber-200/30 bg-transparent text-amber-100 hover:bg-amber-500/10"
          >
            <Link href="/ask-the-place/pilot">Phase 3 pilot</Link>
          </Button>
        </div>

        <h2 className="mt-20 text-center text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Choose a vertical
        </h2>
        <div className="mt-8">
          <VerticalSelector />
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4 text-xs text-zinc-600">
          <Link href="/ask-the-place/architecture" className="hover:text-teal-400">
            Architecture
          </Link>
          <span aria-hidden>·</span>
          <Link href="/" className="hover:text-teal-400">
            Infra24 home
          </Link>
        </div>
      </div>
    </AskThePlaceShell>
  )
}
