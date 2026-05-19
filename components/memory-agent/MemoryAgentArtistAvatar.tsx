import Image from 'next/image'

import { cn } from '@/lib/utils'

/** First initial of first token + first initial of last token (e.g. "Jane Doe" → JD). */
export function initialsFromArtistName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const one = parts[0]
    return (one.length >= 2 ? one.slice(0, 2) : one).toUpperCase()
  }
  const first = parts[0][0] ?? ''
  const last = parts[parts.length - 1][0] ?? ''
  return `${first}${last}`.toUpperCase()
}

type MemoryAgentArtistAvatarProps = {
  name: string
  photoUrl?: string
  className?: string
  size?: 'sm' | 'md'
}

export function MemoryAgentArtistAvatar({
  name,
  photoUrl,
  className,
  size = 'md',
}: MemoryAgentArtistAvatarProps) {
  const dim = size === 'sm' ? 'h-10 w-10 text-xs' : 'h-14 w-14 text-sm'
  const px = size === 'sm' ? 40 : 56

  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={px}
        height={px}
        className={cn('shrink-0 rounded-md object-cover', dim, className)}
        unoptimized
      />
    )
  }

  const initials = initialsFromArtistName(name)

  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md font-semibold tracking-tight',
        'bg-[color:color-mix(in_srgb,var(--ma-primary)_18%,var(--ma-surface-muted))]',
        'text-[color:var(--ma-primary)] ring-1 ring-[color:color-mix(in_srgb,var(--ma-primary)_28%,var(--ma-border))]',
        dim,
        className
      )}
    >
      {initials}
    </div>
  )
}
