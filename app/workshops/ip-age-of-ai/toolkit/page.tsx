import Link from 'next/link'
import { DownloadableToolkitPage } from '@/components/workshops/DownloadableToolkitPage'
import { ipAgeOfAiToolkitAssets } from '@/data/ipAgeOfAiWorkshop'

export default function IpAgeOfAiToolkitPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <p className="text-sm">
        <Link href="/workshops/ip-age-of-ai" className="font-medium text-cyan-800 underline-offset-4 hover:underline">
          ← Back to workshop landing
        </Link>
      </p>
      <DownloadableToolkitPage assets={ipAgeOfAiToolkitAssets} />
    </main>
  )
}
