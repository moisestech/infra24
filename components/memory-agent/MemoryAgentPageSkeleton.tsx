import { ma } from '@/lib/memory-agent/ui-tokens'

/**
 * SSR-safe shell — no UnifiedNavigation / Clerk (avoids nav hydration mismatch).
 */
export function MemoryAgentPageSkeleton({
  orgName,
}: {
  slug: string
  orgName: string
}) {
  return (
    <div className={ma.themeRoot}>
      <header
        className="h-14 border-b border-[var(--ma-border)] bg-[var(--ma-surface)]"
        aria-hidden
      />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-8 md:pt-10">
        <p className={ma.subheading}>Ask your alumni archive</p>
        <h1 className={ma.heading}>{orgName} Memory Agent</h1>
        <div className="mt-6 h-[7.5rem] animate-pulse rounded-xl border border-[var(--ma-border)] bg-[var(--ma-surface-muted)]" />
        <div className="mt-4 h-36 max-w-sm animate-pulse rounded-full bg-[var(--ma-surface-muted)]" />
        <div className="mt-6 h-40 animate-pulse rounded-lg border border-[var(--ma-border)] bg-[var(--ma-surface)]" />
      </main>
    </div>
  )
}
