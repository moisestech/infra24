import { cn } from '@/lib/utils'

export type SohoHouseIconProps = {
  /** Pixel width/height of the square icon */
  size?: number
  className?: string
  /** Stroke/fill color — defaults to currentColor */
  color?: string
  title?: string
}

/**
 * Soho House 3×3 grid mark — vector recreation of the official icon geometry.
 */
export function SohoHouseIcon({
  size = 28,
  className,
  color = 'currentColor',
  title,
}: SohoHouseIconProps) {
  const stroke = Math.max(0.75, size * 0.042)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect
        x={1}
        y={1}
        width={22}
        height={22}
        stroke={color}
        strokeWidth={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={1}
        y1={8.333}
        x2={23}
        y2={8.333}
        stroke={color}
        strokeWidth={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={1}
        y1={15.667}
        x2={23}
        y2={15.667}
        stroke={color}
        strokeWidth={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={8.333}
        y1={1}
        x2={8.333}
        y2={23}
        stroke={color}
        strokeWidth={stroke}
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={15.667}
        y1={1}
        x2={15.667}
        y2={23}
        stroke={color}
        strokeWidth={stroke}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
