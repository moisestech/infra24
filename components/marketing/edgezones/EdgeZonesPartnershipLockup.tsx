import Image from 'next/image'
import { DCC_MIAMI_LOGO_URL_LIGHT } from '@/lib/marketing/cdc-brand'
import { EDGE_ZONES_GALLERY_MARK_URL } from '@/lib/marketing/edgezones-network-index'

/** Hero lockup — DCC × Edge Zones logos, legible on light and dark backgrounds. */
export function EdgeZonesPartnershipLockup() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-4 rounded-2xl border border-[var(--cdc-border)] bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 sm:gap-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl bg-white p-3 dark:bg-neutral-950">
        <Image
          src={EDGE_ZONES_GALLERY_MARK_URL}
          alt=""
          width={120}
          height={120}
          className="h-16 w-auto max-w-full object-contain sm:h-20"
        />
      </div>
      <span className="shrink-0 text-lg font-light text-neutral-400 dark:text-neutral-500">×</span>
      <div className="flex min-w-0 flex-1 items-center justify-center rounded-xl bg-white p-3 dark:bg-neutral-950">
        <Image
          src={DCC_MIAMI_LOGO_URL_LIGHT}
          alt=""
          width={160}
          height={48}
          className="h-8 w-auto max-w-full object-contain sm:h-10"
        />
      </div>
    </div>
  )
}
