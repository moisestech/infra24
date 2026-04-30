import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, PacketDownloadList, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  funderMaterialDownloadRows,
  knightFoundationLogoSrc,
  knightFullNarrativeLink,
  knightPacketContextLinks,
  knightPacketPlaceholderImageAlts,
  knightPacketPlaceholderImages,
} from '@/lib/marketing/knight-packet';
import { KnightPacketBanner } from '@/components/marketing/knight/KnightPacketBanner';
import { KnightDccLinksPreview } from '@/components/marketing/knight/KnightDccLinksPreview';
import { KnightNarrativeMapSection } from '@/components/marketing/knight/KnightNarrativeMapSection';
import { KnightPartnerStrip } from '@/components/marketing/knight/KnightPartnerStrip';
import { KnightSplitImageSection } from '@/components/marketing/knight/KnightSplitImageSection';
import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav';
import { KnightPeopleCredentials } from '@/components/marketing/knight/KnightPeopleCredentials';
import { knightPersonCredentials } from '@/lib/marketing/knight-people';

const path = '/knight';

export const metadata: Metadata = cdcPageMetadata(path);

export default function KnightPilotPacketPage() {
  return (
    <>
      <section id="knight-top" className="scroll-mt-28">
        <KnightPacketBanner />
        <PageHero
          eyebrow="Grants · Knight Foundation"
          title="Knight pilot packet"
          description="One place for reviewers: DCC identity, the full narrative, downloadable materials as they ship, evidence of work, and contact. For the long-form story, start with the Knight-aligned page below."
          breadcrumbs={getCdcBreadcrumbs(path)}
          titleTone="knight"
          surface="solid"
          foundationLogoSrc={knightFoundationLogoSrc}
          className="border-b border-neutral-200 dark:border-neutral-800"
        />
      </section>

      <KnightPacketNav />

      <div className="border-b border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Knight Cities Challenge — static budget ($400k pilot / $200k Knight ask)
          </p>
          <Link
            href="/knight/budget"
            className="inline-flex shrink-0 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:border-teal-400/40 dark:bg-teal-950/50 dark:text-teal-50 dark:hover:bg-teal-900/60"
          >
            Open budget detail
          </Link>
        </div>
      </div>

      <KnightPartnerStrip />

      <KnightNarrativeMapSection>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-400">
          Narrative · read on web
        </p>
        <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          Knight-aligned story
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          Full framing lives on one page—map context here, detail there.
        </p>
        <Link
          href={knightFullNarrativeLink.href}
          className="mt-8 inline-flex rounded-full border border-neutral-900/15 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:border-white/20 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          Open full narrative
        </Link>
      </KnightNarrativeMapSection>

      <KnightDccLinksPreview items={knightPacketContextLinks} />

      <KnightPeopleCredentials people={knightPersonCredentials} />

      <KnightSplitImageSection
        id="files"
        imageSide="trailing"
        sectionClassName="border-y border-neutral-200/80 bg-gradient-to-b from-violet-50/40 via-white to-teal-50/30 dark:border-neutral-800 dark:from-violet-950/25 dark:via-neutral-950 dark:to-teal-950/20"
        imageSrc={knightPacketPlaceholderImages.evidence}
        imageAlt={knightPacketPlaceholderImageAlts.evidence}
        caption="Moises Sanabria on the value of the image (ART/TEC) — research voice behind DCC and Infra24."
      >
        <div className="rounded-2xl border border-violet-200/60 bg-white/90 p-1 shadow-sm ring-1 ring-violet-100/80 dark:border-violet-800/50 dark:bg-neutral-900/90 dark:ring-violet-900/40">
          <div className="rounded-xl bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-500 px-4 py-3 dark:from-violet-700 dark:via-teal-700 dark:to-cyan-700">
            <h2 className="text-base font-semibold tracking-tight text-white">Packet files</h2>
            <p className="mt-1 max-w-xl text-sm text-white/90">
              Core packet, program, and brand files (people and CVs live in the People section above).
              Status updates here and on{' '}
              <Link
                href="/grants/materials"
                className="font-medium text-white underline underline-offset-2 hover:text-white/95"
              >
                /grants/materials
              </Link>{' '}
              as files go live.
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <PacketDownloadList
              rows={funderMaterialDownloadRows.filter((r) => r.group !== 'people')}
              layout="cards"
            />
          </div>
        </div>
      </KnightSplitImageSection>

      <Section id="contact" className="scroll-mt-28 bg-white pb-16 dark:bg-neutral-950">
        <CtaBlock
          headline="Contact"
          body="Pilot partner conversations, the project brief, or grantmaker follow-up—use the path that matches urgency."
          primaryLabel="Discuss a pilot partner site"
          primaryHref="/contact?interest=knight-pilot"
          secondaryLabel="Request the project brief"
          secondaryHref="/contact?interest=knight-brief"
          className="border-teal-200/60 bg-gradient-to-br from-teal-50/50 via-white to-orange-50/40 dark:border-teal-800/40 dark:from-teal-950/30 dark:via-neutral-900/80 dark:to-orange-950/25"
        />
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
          <Link
            href="/contact/funders"
            className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            Funder inbox
          </Link>
          {' · '}
          <Link
            href="/contact"
            className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            General contact
          </Link>
        </p>
      </Section>
    </>
  );
}
