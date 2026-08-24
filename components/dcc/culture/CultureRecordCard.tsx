import Link from 'next/link'
import { CultureMediaFrame } from '@/components/dcc/culture/CultureMediaFrame'
import { cn } from '@/lib/utils'

export type CultureRecordCardProps = {
  href: string
  title: string
  eyebrow?: string
  meta?: string
  description?: string
  image?: string
  imageAlt?: string
  fallbackLabel?: string
  className?: string
}

export function CultureRecordCard({
  href,
  title,
  eyebrow,
  meta,
  description,
  image,
  imageAlt,
  fallbackLabel,
  className,
}: CultureRecordCardProps) {
  return (
    <li className={cn('min-w-0', className)}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
      >
        <CultureMediaFrame
          src={image}
          alt={imageAlt ?? title}
          fallbackLabel={fallbackLabel}
        />
        <div className="flex flex-1 flex-col gap-2 p-5">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200">
            {title}
          </h3>
          {meta ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{meta}</p>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  )
}
