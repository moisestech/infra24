import { cn } from '@/lib/utils'

export type SohoHouseWordmarkProps = {
  className?: string
  color?: string
}

export function SohoHouseWordmark({ className, color = 'currentColor' }: SohoHouseWordmarkProps) {
  return (
    <span className={cn('soho-house-wordmark whitespace-nowrap text-[0.62rem] leading-none sm:text-[0.68rem]', className)} style={{ color }} aria-hidden>
      SOHO HOUSE
    </span>
  )
}
