import Image from 'next/image'
import { SATURDAY_LAB_ICONS, type SaturdayLabIconKey } from '@/lib/workshops/saturday-lab-media'

type Props = {
  icon: SaturdayLabIconKey
  size?: number
  className?: string
  label: string
}

/** Cloudinary icon from `SATURDAY_LAB_ICONS` in saturday-lab-media.ts */
export function SaturdayLabIcon({ icon, size = 20, className = '', label }: Props) {
  return (
    <Image
      src={SATURDAY_LAB_ICONS[icon]}
      alt={label}
      width={size}
      height={size}
      className={className}
    />
  )
}
