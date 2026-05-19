import Image from 'next/image'
import { Palette } from 'lucide-react'

import { initialsFromArtistName } from '@/components/memory-agent/MemoryAgentArtistAvatar'
import { artistPlaceholderPalette } from '@/lib/institutional-artist/avatar-placeholder'
import { cn } from '@/lib/utils'

type InstitutionalArtistAvatarProps = {
  name: string
  photoUrl?: string
  size?: 'sm' | 'md' | 'lg'
  /** Memory Agent themed surfaces use org primary tokens */
  variant?: 'catalogue' | 'memory-agent'
  className?: string
}

function PlaceholderAvatar({
  name,
  size,
  variant,
  className,
}: {
  name: string
  size: 'sm' | 'md' | 'lg'
  variant: 'catalogue' | 'memory-agent'
  className?: string
}) {
  const dim =
    size === 'sm' ? 'h-10 w-10 text-xs' : size === 'lg' ? 'h-20 w-20 text-lg' : 'h-14 w-14 text-sm'
  const icon = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
  const initials = initialsFromArtistName(name)
  const palette = artistPlaceholderPalette(name)

  if (variant === 'memory-agent') {
    return (
      <div
        aria-hidden
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden rounded-md font-semibold tracking-tight ring-1',
          'ring-[color:color-mix(in_srgb,var(--ma-primary)_35%,var(--ma-border))]',
          dim,
          className
        )}
        style={{
          background: `linear-gradient(145deg, color-mix(in srgb, var(--ma-primary) 72%, ${palette.from}) 0%, color-mix(in srgb, var(--ma-secondary, var(--ma-primary)) 55%, ${palette.to}) 100%)`,
        }}
      >
        <Palette
          className={cn('pointer-events-none absolute text-white/25', icon)}
          strokeWidth={1.5}
        />
        <span className="relative z-[1] text-white drop-shadow-sm">{initials}</span>
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-md font-semibold tracking-tight shadow-inner ring-1 ring-black/10',
        dim,
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <Palette className={cn('pointer-events-none absolute text-white/30', icon)} strokeWidth={1.5} />
      <span className="relative z-[1] text-white drop-shadow-sm">{initials}</span>
    </div>
  )
}

export function InstitutionalArtistAvatar({
  name,
  photoUrl,
  size = 'md',
  variant = 'catalogue',
  className,
}: InstitutionalArtistAvatarProps) {
  const dim =
    size === 'sm' ? 'h-10 w-10 text-xs' : size === 'lg' ? 'h-20 w-20 text-lg' : 'h-14 w-14 text-sm'
  const px = size === 'sm' ? 40 : size === 'lg' ? 80 : 56

  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={px}
        height={px}
        className={cn('shrink-0 rounded-md object-cover ring-1 ring-border', dim, className)}
        unoptimized
      />
    )
  }

  return (
    <PlaceholderAvatar name={name} size={size} variant={variant} className={className} />
  )
}
