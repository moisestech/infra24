import Link from 'next/link'
import { SaturdayLabPrintButton } from '@/components/workshop/SaturdayLabPrintButton'
import { SATURDAY_LAB_NAV } from '@/lib/workshops/saturday-lab-content'
import { cn } from '@/lib/utils'

type SaturdayLabShellProps = {
  children: React.ReactNode
  currentPath: string
  showPrint?: boolean
}

const shellWidth = 'mx-auto w-full max-w-3xl 2xl:max-w-7xl'
const shellPad = 'px-4 md:px-6 2xl:px-10'

export function SaturdayLabShell({
  children,
  currentPath,
  showPrint = true,
}: SaturdayLabShellProps) {
  return (
    <div className="saturday-lab min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white print:hidden">
        <div className={cn(shellWidth, shellPad, 'flex flex-wrap items-center justify-between gap-3 py-4 2xl:py-6')}>
          <div>
            <p className="sl-nav-brand-title text-xs font-medium uppercase tracking-wide text-neutral-500">
              Saturday Lab
            </p>
            <p className="sl-nav-brand-sub text-sm text-neutral-700">Artist Websites + Vibe Coding</p>
          </div>
          {showPrint ? <SaturdayLabPrintButton /> : null}
        </div>
        <nav
          className={cn(shellWidth, shellPad, 'flex flex-wrap gap-x-4 gap-y-3 pb-4 2xl:gap-x-8 2xl:gap-y-4 2xl:pb-6')}
          aria-label="Saturday Lab sections"
        >
          {SATURDAY_LAB_NAV.map((item) => {
            const active = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'sl-nav-link text-sm font-medium underline-offset-4 hover:underline',
                  active ? 'text-neutral-950 underline' : 'text-neutral-600'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className={cn(shellWidth, shellPad, 'py-8 md:py-10 2xl:py-12')}>{children}</main>
    </div>
  )
}

export function SaturdayLabMarkdown({ html }: { html: string }) {
  return (
    <article
      className="manuscript-prose saturday-lab-prose max-w-none 2xl:prose-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
