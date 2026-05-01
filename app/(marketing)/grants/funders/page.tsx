import type { Metadata } from 'next';
import Image from 'next/image';
import { SupportLayout, Section, CtaBlock } from '@/components/marketing/cdc';
import { KnightPacketStoryPhotos } from '@/components/marketing/knight/KnightPacketStoryPhotos';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  knightPacketMiamiDronePhoto,
  knightPacketPammPublicEventPhotos,
  knightPacketStoryPhotos,
} from '@/lib/marketing/knight-packet';

const path = '/grants/funders';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportFundersPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout path={path} title={def.title} description={def.description}>
      <Section className="border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Program context</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Field documentation and place-based visuals alongside the grants narrative — Miami programs, convenings, and
            how public work shows up on the ground and online.
          </p>
          <figure className="mt-8 overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 shadow-md ring-1 ring-black/[0.04] dark:border-neutral-700 dark:bg-neutral-900 dark:ring-white/[0.06]">
            <div className="relative aspect-[21/10] w-full sm:aspect-[21/9]">
              <Image
                src={knightPacketMiamiDronePhoto.src}
                alt={knightPacketMiamiDronePhoto.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1152px) 100vw, 1152px"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-teal-900/15 via-transparent to-violet-900/10 dark:from-teal-950/35 dark:to-violet-950/25" />
            </div>
            <figcaption className="border-t border-neutral-200/80 bg-white/95 px-4 py-3 text-xs leading-snug text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950/95 dark:text-neutral-400">
              {knightPacketMiamiDronePhoto.caption}
            </figcaption>
          </figure>
          <div className="mt-12">
            <KnightPacketStoryPhotos
              embedded
              horizontalItems={knightPacketPammPublicEventPhotos}
              items={knightPacketStoryPhotos}
            />
          </div>
        </div>
      </Section>
      <Section className="bg-[#fafafa] dark:bg-neutral-900/35">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Why now</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Artists and cultural organizations are expected to operate in digital public space, but
          lack maintainable systems, shared methods, and civic-visible interfaces. Miami is a strong
          place to prove a repeatable model.
        </p>
      </Section>
      <Section className="bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Why Miami</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Place-based cultural life here intersects tourism, neighborhood identity, multilingual
          publics, and a dense field of small organizations that need legible infrastructure.
        </p>
      </Section>
      <Section className="bg-[#fafafa] dark:bg-neutral-900/35">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Pilot model</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Scoped deployments (interfaces, workshops, documentation) with agreed indicators—not a
          vague “platform” promise. Infra24 provides implementation discipline and reuse patterns.
        </p>
      </Section>
      <Section className="bg-white dark:bg-neutral-950">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Fiscal sponsorship</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          DCC Miami does not currently have a fiscal sponsor. If you represent a 501(c)(3) that sponsors
          arts or civic initiatives, we would like to explore whether your umbrella can help
          foundations and donors support this work with clean grant and gift mechanics—while DCC Miami
          stays focused on pilots, documentation, and public outcomes.
        </p>
      </Section>
      <Section className="bg-[#fafafa] pb-16 dark:bg-neutral-900/35">
        <CtaBlock
          headline="Materials & next steps"
          body="Request the one-pager, deck, and pilot summary as they are finalized."
          primaryLabel="Funder contact"
          primaryHref="/contact/funders"
          secondaryLabel="Materials hub"
          secondaryHref="/grants/materials"
        />
      </Section>
    </SupportLayout>
  );
}
