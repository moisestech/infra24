import Image from 'next/image'
import { SaturdayLabIcon } from '@/components/workshop/SaturdayLabIcon'
import { SATURDAY_LAB_HUB_PATH, SATURDAY_LAB_QR_IMAGE } from '@/lib/workshops/saturday-lab-public-assets'

type SaturdayLabQrBlockProps = {
  className?: string
  compact?: boolean
}

export function SaturdayLabQrBlock({ className = '', compact = false }: SaturdayLabQrBlockProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-center sm:flex-row sm:text-left ${className}`}
    >
      <Image
        src={SATURDAY_LAB_QR_IMAGE}
        alt="QR code linking to Saturday Lab hub"
        width={compact ? 96 : 128}
        height={compact ? 96 : 128}
        className="rounded-md border border-neutral-100"
        unoptimized
      />
      <div className="text-sm text-neutral-700">
        <p className="flex items-center justify-center gap-2 font-medium text-neutral-950 sm:justify-start">
          <SaturdayLabIcon icon="qr" label="Scan QR" size={18} />
          Scan for the full hub
        </p>
        <p className="mt-1">
          Packets, prompts, starter template download, and continue-after links.
        </p>
        <p className="mt-1 font-mono text-xs text-neutral-500">{SATURDAY_LAB_HUB_PATH}</p>
      </div>
    </div>
  )
}
