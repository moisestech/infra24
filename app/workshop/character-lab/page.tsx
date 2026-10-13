import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/marketing/SiteHeader'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { CharacterLabInterestForm } from '@/components/dcc/education/CharacterLabInterestForm'
import '@/app/(marketing)/cdc-marketing-theme.css'

export const metadata: Metadata = {
  title: 'Character Lab — Virtual Self-Portraits & Filmmaking | DCC Miami',
  description:
    'An emerging hybrid creative lab exploring virtual self-portraits, avatar performance, and collective filmmaking. Express interest in helping shape DCC Miami’s first cohort.',
  alternates: { canonical: '/workshop/character-lab' },
  openGraph: {
    title: 'Character Lab | DCC Miami',
    description: 'Create a virtual self-portrait. Perform inside a digital world. Make a film together. Course concept in development.',
    url: '/workshop/character-lab',
  },
  // Keep private to preview reviewers while the proposed instructor and host are unconfirmed.
  robots: { index: false, follow: false },
}

const pathway = [
  {
    index: '01',
    stage: 'PREPARE',
    title: 'Learn the tools before the lab',
    body: 'A self-paced setup guide introduces the creative brief, software, accounts, and a ready-to-use project. The full learning kit is still being developed.',
    detail: 'Online · self-paced · proposed',
  },
  {
    index: '02',
    stage: 'CONNECT',
    title: 'Meet online and test the workflow',
    body: 'A guided technical orientation is being explored so the physical session can focus on making work instead of installing software.',
    detail: 'Live online · proposed',
  },
  {
    index: '03',
    stage: 'PERFORM',
    title: 'Build a character and stage a scene',
    body: 'An invited group experiments with avatar identity, movement, performance, camera framing, and recording. A headset would not be required for the proposed desktop workflow.',
    detail: 'Small in-person lab · venue unconfirmed',
  },
  {
    index: '04',
    stage: 'SHARE',
    title: 'Turn the session into a moving-image work',
    body: 'Individual virtual self-portraits could become part of a collectively authored short film, with credits and publication only after participants agree.',
    detail: 'Review and documentation · proposed',
  },
] as const

const outcomes = [
  { kicker: 'ONE', title: 'Your virtual self-portrait', body: 'Explore an avatar, character, or alternative digital identity through a short performance.' },
  { kicker: 'TOGETHER', title: 'A collective short film', body: 'Experiment with group direction and recorded scenes that could become a shared moving-image work.' },
  { kicker: 'AFTERWARD', title: 'A reusable creative workflow', body: 'Take away preparation materials and the tools to continue creating beyond the lab.' },
] as const

type Props = { searchParams?: { via?: string; utm_source?: string } }

export default function CharacterLabConceptPage({ searchParams }: Props) {
  const source = (searchParams?.via || searchParams?.utm_source || 'character-lab-direct').slice(0, 120)

  return (
    <div className="cdc-marketing min-h-screen bg-[#fafafa] text-neutral-950 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--cdc-border)] bg-neutral-950 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={{
            backgroundImage: 'linear-gradient(rgba(20,184,166,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.12) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }} />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16 lg:px-8">
            <div className="max-w-3xl">
              <Link href="/workshops" className="text-xs font-medium uppercase tracking-[0.18em] text-teal-300 underline-offset-4 hover:underline">← DCC Miami workshops</Link>
              <p className="mt-8 sm:mt-12 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-300">DCC Miami · Course concept in development</p>
              <h1 className="mt-4 text-[clamp(2.6rem,10.5vw,7.5rem)] font-black leading-[0.91] tracking-[-0.065em]">CHARACTER<br />LAB<span className="text-teal-300">.</span></h1>
              <p className="mt-7 max-w-xl text-xl font-medium leading-snug text-neutral-100 sm:text-2xl">Virtual self-portraits, performance, and collective filmmaking.</p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300">Who do you become when your body becomes an avatar? An emerging creative-learning experience where artists explore virtual identities, perform inside digital worlds, and imagine a film they can make together.</p>
              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a href="#interest" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-teal-300 sm:w-auto px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-teal-200">Help shape the first cohort ↗</a>
                <a href="#pathway" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/30 sm:w-auto px-6 py-3 text-sm font-semibold text-white transition hover:border-teal-300">Explore the concept</a>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-neutral-400">Not an open registration. Instructor participation, host venue, cohort size, dates, price, and full syllabus are still under discussion.</p>
            </div>
            <figure className="group relative min-w-0 overflow-hidden rounded-2xl border border-teal-300/25 bg-neutral-900 shadow-2xl">
              <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1791916137/blue-jazz-avatar.jpg" width={1920} height={1080} alt="Glowing blue, humanlike VR character in a theatrical virtual environment, artwork shared by Alec Jerome Kreisberg" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[57%_50%] transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 pt-20 sm:p-6 sm:pt-24">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200">Avatar / Camera / Performance</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-200">Workshop imagery supplied by Alec Jerome Kreisberg · not documentation of a DCC cohort</p>
                </div>
              </div>
            </figure>
          </div>
        </section>

        <section className="border-b border-[var(--cdc-border)]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-3 lg:gap-8 lg:px-8">
            {outcomes.map((item) => (
              <article key={item.kicker} className="border-t-2 border-teal-500 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.19em] text-teal-700 dark:text-teal-300">{item.kicker}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pathway" className="scroll-mt-20 border-b border-[var(--cdc-border)]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">Learning pathway · proposed</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Prepare online. Create together. Keep making afterward.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">Rather than losing the studio session to software installations, we are exploring a lightweight learning pathway that helps each participant arrive ready to create. The final format will be co-developed with the instructor and shaped by early interest.</p>
            <div className="mt-10 grid min-w-0 gap-4 md:grid-cols-2">
              {pathway.map((step) => (
                <article key={step.index} className="min-w-0 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 sm:p-6 dark:bg-neutral-900/60">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{step.index} / {step.stage}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{step.detail}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--cdc-border)] bg-neutral-100 dark:bg-neutral-900/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">What we are exploring</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">A creative prompt first. Software second.</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              <p>Use a virtual character to express a version of yourself, a fictional persona, or an alternate identity. Explore movement, staging, camera language, and the feeling of performing inside a world that is not physical.</p>
              <p>Blender, Unity, VRChat, and OBS are being considered as tools in the workflow, not a guarantee that every participant must master all four. Prepared assets and desktop-mode alternatives would help artists at different technical levels participate.</p>
              <p className="text-sm font-medium">DCC is developing this concept in conversation with Miami artist and creative technologist Alec Jerome. His role and the final course structure remain subject to agreement.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--cdc-border)] bg-neutral-950 text-white" aria-labelledby="character-work-heading">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">World-building / Source material</p>
                <h2 id="character-work-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">From an avatar to a scene.</h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-neutral-300">These images from Alec&apos;s earlier workshop materials help visualize the possibilities. They are not results from a DCC class.</p>
            </div>
            <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
              <figure className="min-w-0 overflow-hidden rounded-xl border border-white/15 bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1791916079/mirror-shot-dudu.jpg" alt="VRChat digital character framed in a mirror-style cinematic scene" width={1920} height={1080} loading="lazy" className="aspect-[16/10] w-full object-cover sm:aspect-[16/11]" />
                <figcaption className="px-4 py-3 text-xs text-neutral-300">Mirror Shot Dudu · Virtual performance still · Supplied by Alec Jerome Kreisberg</figcaption>
              </figure>
              <figure className="min-w-0 overflow-hidden rounded-xl border border-white/15 bg-neutral-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1791916083/jazz-vrchat.jpg" alt="VRChat performance scene with digital character in an immersive virtual setting" width={1920} height={1080} loading="lazy" className="aspect-[16/10] w-full object-cover sm:aspect-[16/11]" />
                <figcaption className="px-4 py-3 text-xs text-neutral-300">Jazz VRC · Virtual filmmaking still · Supplied by Alec Jerome Kreisberg</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="collaborator" className="border-b border-[var(--cdc-border)]">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-8 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-12 lg:px-8">
            <figure className="min-w-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://res.cloudinary.com/dck5rzi4h/image/upload/v1791916073/alec-vr-headset-portrait.jpg" alt="Alec Jerome Kreisberg wearing a virtual reality headset during an art presentation" width={1600} height={1067} loading="lazy" className="aspect-[4/3] w-full object-cover object-center sm:aspect-[5/4]" />
              <figcaption className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">Alec wearing a VR headset · Photo supplied for earlier workshop promotion</figcaption>
            </figure>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">Creative conversation / Proposed instructor</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Meet Alec Jerome Kreisberg.</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">A Miami-based multidisciplinary artist and 3D animator working across virtual production, character design, real-time environments, filmmaking, and live performance. His original VRChat character-to-camera workshop provides a starting point for this proposed DCC course.</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">DCC is exploring how Alec&apos;s expertise could support an artist-led lab that combines virtual self-portraiture with a collectively authored film. This page describes a proposal, not a confirmed teaching engagement.</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <a href="https://www.twine.net/alecjerome" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 underline-offset-4 hover:border-teal-600 hover:underline dark:border-neutral-700">Alec&apos;s portfolio ↗</a>
                <a href="https://www.miamidesigndistrict.com/blog/entries/curious-conversations-alec-kreisberg/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 underline-offset-4 hover:border-teal-600 hover:underline dark:border-neutral-700">Artist interview ↗</a>
              </div>
            </div>
          </div>
        </section>

        <section id="interest" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.83fr_1.17fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">The first cohort · interest only</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Would you like to make something with us?</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600 dark:text-neutral-400">We are speaking with artists, filmmakers, animators, students and curious beginners to understand what would make this experience worthwhile. Tell us what interests you; there is no obligation to attend.</p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">We hope to start with a small invitation-based cohort, then use what we learn to develop public learning materials and future programs.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              <CharacterLabInterestForm source={source} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
