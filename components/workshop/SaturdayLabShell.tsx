import Link from 'next/link'
import { SaturdayLabPrintButton } from '@/components/workshop/SaturdayLabPrintButton'
import { SATURDAY_LAB_NAV } from '@/lib/workshops/saturday-lab-content'
import { cn } from '@/lib/utils'

type SaturdayLabShellProps = {
  children: React.ReactNode
  currentPath: string
  showPrint?: boolean
}

export function SaturdayLabShell({
  children,
  currentPath,
  showPrint = true,
}: SaturdayLabShellProps) {
  return (
    <div className="saturday-lab min-h-screen bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Saturday Lab
            </p>
            <p className="text-sm text-neutral-700">Artist Websites + Vibe Coding</p>
          </div>
          {showPrint ? <SaturdayLabPrintButton /> : null}
        </div>
        <nav
          className="mx-auto flex max-w-3xl flex-wrap gap-x-4 gap-y-2 px-4 pb-3 md:px-6"
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
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">{children}</main>
    </div>
  )
}

export function SaturdayLabMarkdown({ html }: { html: string }) {
  return (
    <article
      className="manuscript-prose saturday-lab-prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
