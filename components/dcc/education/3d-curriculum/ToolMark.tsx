import { cn } from '@/lib/utils'
import { toolLogosForSoftware } from '@/lib/dcc/education/3d-curriculum'

export function ToolMark({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white',
        className
      )}
    >
      <img src={src} alt="" className="h-full w-full object-contain p-1" />
    </span>
  )
}

export function ToolMarks({
  software,
  className,
  markClassName,
}: {
  software: readonly string[]
  className?: string
  markClassName?: string
}) {
  const logos = toolLogosForSoftware(software)
  if (logos.length === 0) return null
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {logos.map((logo) => (
        <ToolMark key={logo.src} src={logo.src} className={markClassName} />
      ))}
    </span>
  )
}
