import Link from 'next/link'

import { cn } from '@/lib/utils'

import { SohoHouseIcon } from './SohoHouseIcon'
import { SohoHouseWordmark } from './SohoHouseWordmark'

export type SohoHouseLogoVariant = 'icon' | 'horizontal' | 'stacked'

export type SohoHouseLogoSize = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<
  SohoHouseLogoSize,
  { icon: number; gap: string; wordmarkClass?: string }
> = {
  sm: { icon: 22, gap: 'gap-2.5', wordmarkClass: 'text-[0.55rem]' },
  md: { icon: 28, gap: 'gap-3', wordmarkClass: 'text-[0.62rem] sm:text-[0.68rem]' },
  lg: { icon: 36, gap: 'gap-3.5', wordmarkClass: 'text-[0.72rem] sm:text-[0.8rem]' },
}

export type SohoHouseLogoProps = {
  variant?: SohoHouseLogoVariant
  size?: SohoHouseLogoSize
  className?: string
  color?: string
  href?: string
  /** Accessible label when the logo is a link */
  label?: string
}

export function SohoHouseLogo({
  variant = 'horizontal',
  size = 'md',
  className,
  color = 'currentColor',
  href,
  label = 'Soho House',
}: SohoHouseLogoProps) {
  const sizing = SIZE_MAP[size]

  const content =
    variant === 'icon' ? (
      <SohoHouseIcon size={sizing.icon} color={color} title={label} />
    ) : variant === 'stacked' ? (
      <span className={cn('inline-flex flex-col items-center', sizing.gap, className)}>
        <SohoHouseIcon size={sizing.icon} color={color} />
        <SohoHouseWordmark color={color} className={sizing.wordmarkClass} />
      </span>
    ) : (
      <span className={cn('inline-flex items-center', sizing.gap, className)}>
        <SohoHouseIcon size={sizing.icon} color={color} />
        <SohoHouseWordmark color={color} className={sizing.wordmarkClass} />
      </span>
    )

  if (!href) return content

  return (
    <Link
      href={href}
      className="inline-flex transition-opacity hover:opacity-85"
      aria-label={label}
    >
      {content}
    </Link>
  )
}
