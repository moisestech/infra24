import Link from 'next/link'
import { SATURDAY_LAB_HUB_PATH } from '@/lib/workshops/saturday-lab-public-assets'

/** Public CTA — Saturday Lab is at `/workshop/saturday-lab`, not `/o/oolite/workshops`. */
export function SaturdayLabPublicBanner() {
  return (
    <div className="mb-12 rounded-xl border border-cyan-200 bg-white/90 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Open now — no sign-in</p>
      <h2 className="mt-1 text-2xl font-semibold text-gray-900">Saturday Lab</h2>
      <p className="mt-2 max-w-2xl text-gray-600">
        Artist website + vibe coding self-serve lab. Scan the QR in the room or open the hub on your
        phone — cheat sheets, packets, prompts, and starter template.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={SATURDAY_LAB_HUB_PATH}
          className="inline-flex items-center rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
        >
          Open Saturday Lab hub
        </Link>
        <Link
          href={`${SATURDAY_LAB_HUB_PATH}/print`}
          className="inline-flex items-center rounded-md border border-cyan-300 px-4 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-50"
        >
          Print cheat sheets
        </Link>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Public URL: <code className="text-gray-700">{SATURDAY_LAB_HUB_PATH}</code> (not under{' '}
        <code className="text-gray-700">/o/oolite/workshops</code>, which requires sign-in)
      </p>
    </div>
  )
}
