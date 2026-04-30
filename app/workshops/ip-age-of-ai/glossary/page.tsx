import Link from 'next/link'
import { GlossaryPreview } from '@/components/workshops/GlossaryPreview'
import { ipAgeOfAiGlossary } from '@/data/ipAgeOfAiWorkshop'

export default function IpAgeOfAiGlossaryPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 md:px-8 md:py-12">
      <p className="text-sm">
        <Link href="/workshops/ip-age-of-ai" className="font-medium text-cyan-800 underline-offset-4 hover:underline">
          ← Back to workshop landing
        </Link>
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Glossary</h1>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-700">
        Plain-language definitions for legal and policy terms used throughout the workshop. These definitions
        are educational and practical, not legal advice.
      </p>
      <GlossaryPreview terms={ipAgeOfAiGlossary} />
    </main>
  )
}
