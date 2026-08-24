import Image from 'next/image'
import { cultureMediaMotionEnabled } from '@/lib/dcc/culture'
import { cn } from '@/lib/utils'

type CultureMediaFrameProps = {
  src?: string
  alt: string
  className?: string
  aspectClassName?: string
  fallbackLabel?: string
  priority?: boolean
}

export function CultureMediaFrame({
  src,
  alt,
  className,
  aspectClassName = 'aspect-[4/3]',
  fallbackLabel = 'Documentation forthcoming',
  priority = false,
}: CultureMediaFrameProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-neutral-200/80 dark:bg-neutral-800',
        aspectClassName,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover',
            cultureMediaMotionEnabled(src) &&
              'transition duration-300 group-hover:scale-[1.03]'
          )}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center px-6 text-center"
          role="img"
          aria-label={alt || fallbackLabel}
        >
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            {fallbackLabel}
          </p>
        </div>
      )}
    </div>
  )
}
