import Link from 'next/link'
import { cn } from '@/lib/utils'

export function FabricateChrome({
  children,
  current,
}: {
  children: React.ReactNode
  current: 'home' | 'pricing' | 'finishes' | 'quote'
}) {
  const links = [
    { id: 'home' as const, href: '/fabricate', label: 'Overview' },
    { id: 'pricing' as const, href: '/fabricate/pricing', label: 'Pricing' },
    { id: 'finishes' as const, href: '/fabricate/finishes', label: 'Finishes' },
    { id: 'quote' as const, href: '/fabricate/quote', label: 'Request quote' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <nav
        className="mb-8 flex flex-wrap gap-2 border-b border-[var(--cdc-border)] pb-4"
        aria-label="Fabrication"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition',
              current === link.id
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
            )}
            aria-current={current === link.id ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}

export function FabricateCtaRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link
        href="/fabricate/quote"
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Request a quote
      </Link>
      <Link
        href="/fabricate/pricing"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        Compare rates
      </Link>
      <Link
        href="/fabricate/finishes"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--cdc-border)] px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        See finish levels
      </Link>
    </div>
  )
}
