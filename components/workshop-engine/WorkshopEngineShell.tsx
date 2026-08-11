import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Beaker, BookOpen, Building2, Grid2X2, Library } from 'lucide-react'
import { weShell, weType } from '@/components/workshop-engine/responsive'

const NAV = [
  { href: '/workshop/resin-printing', label: 'Overview', Icon: Grid2X2 },
  {
    href: '/workshop/resin-printing/modules/welcome',
    label: 'Modules',
    Icon: Library,
  },
  {
    href: '/workshop/resin-printing/resources',
    label: 'Resources',
    Icon: BookOpen,
  },
  {
    href: '/workshop/resin-printing/booklet',
    label: 'Booklet',
    Icon: BookOpen,
  },
  {
    href: '/workshop/resin-printing/venue/oolite',
    label: 'Venues',
    Icon: Building2,
  },
] as const

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
    <div className="min-h-screen bg-[#f5f7f5] text-slate-950">
      <div
        className="h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-orange-400"
        aria-hidden
      />
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div
          className={cn(
            weShell.width,
            weShell.pad,
            'flex flex-wrap items-center justify-between gap-3 py-3 md:gap-4 md:py-4 2xl:py-5'
          )}
        >
          <div className="flex items-center gap-2.5 md:gap-3 2xl:gap-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white md:h-10 md:w-10 2xl:h-12 2xl:w-12">
              <Beaker
                aria-hidden="true"
                className="h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6"
              />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700 md:text-xs 2xl:text-sm">
                {brandTitle}
              </p>
              <p className="text-xs text-slate-600 md:text-sm 2xl:text-base">
                {brandSub}
              </p>
            </div>
          </div>
          <p className="max-w-xs text-left text-[11px] leading-relaxed text-slate-500 md:max-w-sm md:text-right md:text-xs 2xl:max-w-md 2xl:text-sm">
            Not operator certification — supervised appointment prep.
          </p>
        </div>
        <nav
          className={cn(
            weShell.width,
            weShell.pad,
            '-mx-1 flex gap-1 overflow-x-auto pb-3 md:flex-wrap md:gap-x-2 md:gap-y-2 md:overflow-visible md:pb-4 2xl:gap-3'
          )}
          aria-label="Workshop sections"
        >
          {NAV.map((item) => {
            const Icon = item.Icon
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
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition md:gap-2 md:px-3 md:py-1.5 md:text-sm 2xl:px-4 2xl:py-2 2xl:text-base',
                  active
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                )}
              >
                <Icon
                  aria-hidden="true"
                  className="h-3.5 w-3.5 md:h-4 md:w-4 2xl:h-4.5 2xl:w-4.5"
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className={cn(weShell.width, weShell.pad, weShell.mainPy)}>
        {children}
      </main>
    </div>
  )
}

export { weType }
