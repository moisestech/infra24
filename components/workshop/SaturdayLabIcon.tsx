import type { CSSProperties } from 'react'
import Image from 'next/image'
import { SATURDAY_LAB_ICONS, type SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'
import { cn } from '@/lib/utils'

type Props = {
  icon: SaturdayLabIconKey
  /** Base size in px; triples on 2xl when `tripleOnWide` is true. */
  size?: number
  tripleOnWide?: boolean
  className?: string
  label: string
}

/** Cloudinary icon from `SATURDAY_LAB_ICONS` in saturday-lab-media.ts */
export function SaturdayLabIcon({
  icon,
  size = 20,
  tripleOnWide = false,
  className = '',
  label,
}: Props) {
  const maxPx = tripleOnWide ? size * 3 : size

  return (
    <span
      className={cn('inline-flex shrink-0', tripleOnWide && 'sl-icon-triple')}
      style={tripleOnWide ? ({ ['--sl-icon-base' as string]: `${size}px` } as CSSProperties) : undefined}
    >
      <Image
        src={SATURDAY_LAB_ICONS[icon]}
        alt={label}
        width={maxPx}
        height={maxPx}
        className={cn(className)}
        style={{ width: size, height: size }}
      />
    </span>
  )
}
