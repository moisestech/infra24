import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { ProofStrip } from '@/components/marketing/ProofStrip';
import { SectionWithRightImageFade } from '@/components/marketing/SectionWithRightImageFade';
import {
  caseStudyPreviews,
  dccWhatWeAreIntro,
  dccWhyMiami,
} from '@/lib/marketing/content';
import {
  dccParticipantValue,
  dccPilotIntro,
  dccProofSectionIntro,
} from '@/lib/marketing/dcc-pilot-home-content';
import {
  homeVisualProofEcho,
  homeVisualWhatDccIs,
  homeVisualWhyMiami,
} from '@/lib/marketing/home-visual-assets';

const HomeWebcoreVisualGrid = dynamic(
  () =>
    import('@/components/marketing/HomeWebcoreVisualGrid').then((m) => m.HomeWebcoreVisualGrid),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-[200px] animate-pulse rounded-xl bg-neutral-100/90 dark:bg-neutral-800/90" aria-hidden />
    ),
  }
);

/**
 * Pilot narrative blocks moved off the homepage into the Knight packet:
 * why the pilot exists, participant outcomes, what DCC is, why Miami, and project patterns.
 */
export function KnightPilotDepthSections() {
  return (
    <div id="pilot-depth" className="scroll-mt-28">
      <SectionWithRightImageFade
        id="why-this-pilot"
        className="scroll-mt-14 border-t border-neutral-200 bg-white py-16 sm:py-20 lg:py-24 dark:border-neutral-800 dark:bg-neutral-900"
        image={dccPilotIntro.backgroundImage}
      >
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {dccPilotIntro.title}
        </h2>
        {dccPilotIntro.paragraphs.map((para, i) => (
          <p
            key={i}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {para}
          </p>
        ))}
      </SectionWithRightImageFade>

      <SectionWithRightImageFade
        id="what-participants-leave-with"
        className="scroll-mt-14 bg-[#fafafa] py-16 sm:py-20 lg:py-24 dark:bg-neutral-950"
        image={dccParticipantValue.backgroundImage}
      >
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {dccParticipantValue.title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dccParticipantValue.intro}
        </p>
        <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {dccParticipantValue.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionWithRightImageFade>

      <MarketingSection id="what-dcc-is-knight" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          What DCC is
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dccWhatWeAreIntro}
        </p>
        <div className="mt-10 max-w-6xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhatDccIs]} />
        </div>
        <p className="mt-8">
          <Link
            href="/about"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            About Digital Culture Center Miami →
          </Link>
        </p>
      </MarketingSection>

      <MarketingSection id="why-miami-knight" className="scroll-mt-14 bg-[#fafafa] dark:bg-neutral-950">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {dccWhyMiami.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {dccWhyMiami.body}
            </p>
            <p className="mt-6">
              <Link
                href="/why-miami"
                className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
              >
                Why Miami (full page) →
              </Link>
            </p>
          </div>
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualWhyMiami]} />
        </div>
      </MarketingSection>

      <MarketingSection id="proof-patterns" className="scroll-mt-14 bg-white dark:bg-neutral-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {dccProofSectionIntro.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              {dccProofSectionIntro.subcopy}
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            View all projects
          </Link>
        </div>
        <div className="mt-8 w-full max-w-6xl">
          <HomeWebcoreVisualGrid lightbox mode="row" items={[...homeVisualProofEcho]} />
        </div>
        <div className="mt-10">
          <ProofStrip items={caseStudyPreviews} />
        </div>
      </MarketingSection>
    </div>
  );
}
