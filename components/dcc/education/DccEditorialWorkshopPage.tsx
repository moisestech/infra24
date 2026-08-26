import Link from 'next/link'
import { SiteHeader } from '@/components/marketing/SiteHeader'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import type { EditorialWorkshopPageContent } from '@/lib/dcc/education/editorial-workshops'
import { cn } from '@/lib/utils'
import '@/app/(marketing)/cdc-marketing-theme.css'

function ConceptualChip() {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
      Conceptual educational image
    </p>
  )
}

function EditorialFigure({
  src,
  alt,
  caption,
  objectPosition = 'center center',
  priority = false,
  aspectClassName = 'aspect-[4/5] sm:aspect-[16/9]',
}: {
  src: string
  alt: string
  caption: string
  objectPosition?: string
  priority?: boolean
  aspectClassName?: string
}) {
  return (
    <figure className="min-w-0">
      <div className={cn('relative overflow-hidden bg-neutral-200 dark:bg-neutral-800', aspectClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          {...(priority ? { fetchPriority: 'high' as const } : {})}
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <ConceptualChip />
        <span className="sr-only">{caption}</span>
      </figcaption>
    </figure>
  )
}

export function DccEditorialWorkshopPage({
  page,
}: {
  page: EditorialWorkshopPageContent
}) {
  return (
    <div className="cdc-marketing min-h-screen bg-[#fafafa] text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--cdc-border)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
              <Link href="/workshops" className="underline-offset-4 hover:underline">
                DCC MIA sessions
              </Link>
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-lg">
              {page.lead}
            </p>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
              {page.heroKicker}
            </p>
            <EditorialFigure
              src={page.hero.src}
              alt={page.hero.alt}
              caption={page.hero.caption}
              objectPosition={page.hero.objectPosition}
              priority
              aspectClassName="aspect-[4/5] sm:aspect-[21/9]"
            />
          </div>
        </header>

        {page.sections.map((section) => (
          <section
            key={section.kicker}
            className="border-b border-[var(--cdc-border)]"
          >
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:px-8">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cdc-teal)]">
                  {section.kicker}
                </p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
                  {section.body}
                </p>
              </div>
              <EditorialFigure
                src={section.image.src}
                alt={section.image.alt}
                caption={section.image.caption}
                objectPosition={section.image.objectPosition}
              />
            </div>
          </section>
        ))}

        <section className="border-b border-[var(--cdc-border)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {page.furtherTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              {page.furtherBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
              {page.furtherLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
