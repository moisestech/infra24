import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PublisherJourneyDemo = dynamic(
  () => import('@/features/playwire-demo/PublisherJourneyDemo').then((m) => m.PublisherJourneyDemo),
  { ssr: false },
);

export const metadata: Metadata = {
  title: 'Playwire RAMP — publisher journey (concept demo)',
  description:
    'Private concept demo: publisher personas, PARMM-lite assessment, mock RAMP dashboard, and FAQ — for Playwire return conversations.',
  robots: { index: false, follow: false },
};

export default function PlaywireApplicationDemoPage() {
  return (
    <div className="bg-white text-neutral-900">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-wide text-[#e85d4c]">Private · Infra24</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Playwire RAMP — publisher journey demo
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
            Concept walkthrough for return conversations — not affiliated with Playwire. Role-fit dossier and résumé
            live on{' '}
            <Link
              href="https://moises.tech/opportunities/playwire"
              className="font-medium text-neutral-900 underline-offset-4 hover:underline"
            >
              moises.tech/opportunities/playwire
            </Link>
            .
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <PublisherJourneyDemo />
      </div>
    </div>
  );
}
