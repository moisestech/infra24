import Link from 'next/link'
import { SaturdayLabBanner } from '@/components/workshop/SaturdayLabBanner'
import { SATURDAY_LAB_STARTER_ZIP } from '@/lib/workshops/saturday-lab-public-assets'

export function SaturdayLabStarterDownload() {
  return (
    <section className="space-y-3">
      <SaturdayLabBanner
        banner="starterTemplate"
        alt="Download the Saturday Lab HTML and CSS starter template"
      />
      <Link
        href={SATURDAY_LAB_STARTER_ZIP}
        className="inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        download
      >
        Download starter template (zip)
      </Link>
    </section>
  )
}
