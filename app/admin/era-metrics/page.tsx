import type { Metadata } from 'next';
import { EraMetricsAdminClient } from '@/components/era/admin/EraMetricsAdminClient';
import rawMetrics from '@/data/era-metrics.json';

export const metadata: Metadata = {
  title: 'Era metrics editor',
  description: 'Update Born-Digital Era channel metrics without a deploy.',
  robots: { index: false, follow: false },
};

/**
 * Clerk-gated admin page for editing `data/era-metrics.json`.
 * Auth is enforced at the middleware layer (not in the marketing public list).
 */
export default function EraMetricsAdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-400">
          DCC.miami · Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Born-Digital Era · metrics editor
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Edit the seven channel ladders. In development this writes
          <code className="mx-1 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">
            data/era-metrics.json
          </code>
          directly. In production, copy the generated JSON and commit it — the file is the
          source of truth for the homepage band, <code className="font-mono text-xs">/era</code>, and every
          per-channel page.
        </p>
      </div>

      <EraMetricsAdminClient initial={rawMetrics as never} />
    </div>
  );
}
