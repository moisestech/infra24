import Image from 'next/image'
import { SATURDAY_LAB_BANNERS, type SaturdayLabBannerKey } from '@/lib/workshops/saturday-lab-media'
import { cn } from '@/lib/utils'

type Props = {
  banner: SaturdayLabBannerKey
  alt: string
  priority?: boolean
  className?: string
}

/** Section banner from `SATURDAY_LAB_BANNERS` in saturday-lab-media.ts */
export function SaturdayLabBanner({ banner, alt, priority = false, className }: Props) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-neutral-200 bg-white', className)}>
      <Image
        src={SATURDAY_LAB_BANNERS[banner]}
        alt={alt}
        width={1200}
        height={400}
        priority={priority}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    </div>
  )
}
