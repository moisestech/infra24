import { cn } from '@/lib/utils'
import type { ImageAsset } from '@/lib/course/types'
import { initialsFromDisplayName } from '@/lib/course/person-initials'

type Size = 'sm' | 'md'

const sizeClass: Record<Size, string> = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
}

type Props = {
  name: string
  image?: ImageAsset
  size?: Size
  className?: string
}

/** Rounded avatar: profile photo when `image.src` is set, otherwise two-letter initials. */
export function LessonPersonAvatar({ name, image, size = 'md', className }: Props) {
  const initials = initialsFromDisplayName(name)
  const src = image?.src?.trim()

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-gradient-to-br from-muted to-neutral-200/80 font-semibold tracking-tight text-neutral-700 shadow-inner dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-200',
        sizeClass[size],
        className,
      )}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        <img src={src} alt={image?.alt ?? name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">{initials}</span>
      )}
    </div>
  )
}
