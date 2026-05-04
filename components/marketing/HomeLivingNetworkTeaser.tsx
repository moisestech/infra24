'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const MeshField = dynamic(
  () => import('@/components/era/effects/MeshField').then((m) => m.MeshField),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 animate-pulse bg-neutral-900/80"
        aria-hidden
      />
    ),
  }
);

/**
 * Homepage replacement for the full CRM graph: mesh preview + copy + deep link
 * to `/network/living` where Cytoscape runs at full size.
 */
export function HomeLivingNetworkTeaser() {
  return (
    <section
      id="cultural-network"
      className="scroll-mt-14 border-b border-[var(--cdc-border)] bg-neutral-950 py-12 text-neutral-100 dark:border-neutral-800 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cdc-teal)]">
              Miami digital culture field
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Explore the living network
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              DCC maps the people, spaces, programs, and opportunities shaping Miami&apos;s digital culture field. The
              living network helps artists, organizers, institutions, and partners see how support, collaboration, and
              public programs connect over time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/network/living"
                className="inline-flex rounded-full bg-[var(--cdc-teal)] px-4 py-2 text-sm font-semibold text-neutral-950 hover:opacity-90"
              >
                Open the network map
              </Link>
              <Link
                href="/network"
                className="inline-flex rounded-full border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
              >
                How the network works
              </Link>
            </div>
          </div>

          <div
            className={cn(
              'relative min-h-[min(280px,42vh)] w-full overflow-hidden rounded-2xl border border-neutral-800',
              'bg-gradient-to-b from-neutral-900/80 to-neutral-950 shadow-[0_0_40px_-12px_rgba(45,212,191,0.25)]'
            )}
            aria-hidden
          >
            <MeshField className="opacity-95" />
          </div>
        </div>
      </div>
    </section>
  );
}
