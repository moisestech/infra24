import { cn } from '@/lib/utils'

type SohoComingSoonStickerProps = {
  label?: string
  className?: string
  /** Slightly larger for wide panels */
  size?: 'sm' | 'md'
}

export function SohoComingSoonSticker({
  label = 'Coming soon',
  className,
  size = 'md',
}: SohoComingSoonStickerProps) {
  return (
    <span
      className={cn(
        'soho-funnel-coming-soon-sticker pointer-events-none select-none',
        size === 'sm' && 'soho-funnel-coming-soon-sticker--sm',
        className
      )}
      aria-hidden
    >
      <span className="soho-funnel-coming-soon-sticker__shine" aria-hidden />
      {label}
    </span>
  )
}
