import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/workshop/resin-printing', label: 'Overview' },
  { href: '/workshop/resin-printing/modules/welcome', label: 'Modules' },
  { href: '/workshop/resin-printing/resources', label: 'Resources' },
  { href: '/workshop/resin-printing/booklet', label: 'Booklet' },
  { href: '/workshop/resin-printing/venue/oolite', label: 'Venues' },
] as const

const shellWidth = 'mx-auto w-full max-w-3xl 2xl:max-w-6xl'
const shellPad = 'px-4 md:px-6'

export function WorkshopEngineShell({
  children,
  currentPath,
  brandTitle = 'Resin Printing',
  brandSub = 'Infra24 workshop engine',
}: {
  children: React.ReactNode
  currentPath: string
  brandTitle?: string
  brandSub?: string
}) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className={cn(shellWidth, shellPad, 'flex flex-wrap items-end justify-between gap-3 py-4')}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{brandTitle}</p>
            <p className="text-sm text-neutral-700">{brandSub}</p>
          </div>
          <p className="max-w-xs text-right text-xs text-neutral-500">
            Not operator certification — supervised appointment prep.
          </p>
        </div>
        <nav
          className={cn(shellWidth, shellPad, 'flex flex-wrap gap-x-4 gap-y-2 pb-4')}
          aria-label="Workshop sections"
        >
          {NAV.map((item) => {
            const active =
              currentPath === item.href ||
              (item.label === 'Modules' && currentPath.includes('/modules/')) ||
              (item.label === 'Venues' && currentPath.includes('/venue/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium underline-offset-4 hover:underline',
                  active ? 'text-neutral-950 underline' : 'text-neutral-600'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className={cn(shellWidth, shellPad, 'py-8 md:py-10')}>{children}</main>
    </div>
  )
}
