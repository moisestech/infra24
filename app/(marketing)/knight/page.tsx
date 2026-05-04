import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero, Section, PacketDownloadList, CtaBlock } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  funderMaterialDownloadRows,
  knightFoundationLogoSrc,
  knightPacketContextLinks,
  knightPacketPammPublicEventPhotos,
  knightPacketStoryPhotos,
} from '@/lib/marketing/knight-packet';
import { KnightBudgetPromoStrip } from '@/components/marketing/knight/KnightBudgetPromoStrip';
import { KnightPacketBanner } from '@/components/marketing/knight/KnightPacketBanner';
import { KnightPacketVolumeMark } from '@/components/marketing/knight/KnightPacketVolumeMark';
import { KnightDccLinksPreview } from '@/components/marketing/knight/KnightDccLinksPreview';
import { KnightNarrativeMapSection } from '@/components/marketing/knight/KnightNarrativeMapSection';
import { KnightNarrativeStoryCallout } from '@/components/marketing/knight/KnightNarrativeStoryCallout';
import { KnightPartnerStrip } from '@/components/marketing/knight/KnightPartnerStrip';
import { KnightPacketFilesTerminalFrame } from '@/components/marketing/knight/KnightPacketFilesTerminalFrame';
import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav';
import { KnightPilotDepthSections } from '@/components/marketing/knight/KnightPilotDepthSections';
import { KnightFounders360Carousel } from '@/components/marketing/knight/KnightFounders360Carousel';
import { KnightPeopleCredentials } from '@/components/marketing/knight/KnightPeopleCredentials';
import { knightFounderMomentoEmbeds, knightPersonCredentials } from '@/lib/marketing/knight-people';

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
          trailing={<KnightPacketVolumeMark />}
          className="border-b border-neutral-200 dark:border-neutral-800"
        />
      </section>

      <KnightPacketNav />

      <KnightBudgetPromoStrip />

      <KnightPartnerStrip />

      <KnightNarrativeMapSection>
        <KnightNarrativeStoryCallout />
      </KnightNarrativeMapSection>

      <KnightPilotDepthSections />

      <KnightDccLinksPreview
        items={knightPacketContextLinks}
        fieldPhotosHorizontal={knightPacketPammPublicEventPhotos}
        fieldPhotos={knightPacketStoryPhotos}
      />

      <KnightPeopleCredentials people={knightPersonCredentials} />

      <KnightFounders360Carousel items={knightFounderMomentoEmbeds} />

      <section
        id="files"
        className="scroll-mt-28 border-y border-neutral-200/80 bg-gradient-to-b from-teal-50/32 via-[var(--cdc-surface)] to-violet-50/28 dark:border-neutral-800 dark:from-teal-950/18 dark:via-[var(--cdc-surface)] dark:to-violet-950/16"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <KnightPacketFilesTerminalFrame title="Materials we’re placing in front of reviewers">
            <PacketDownloadList
              rows={funderMaterialDownloadRows.filter((r) => r.group !== 'people')}
              layout="cards"
              terminalChrome
            />
          </KnightPacketFilesTerminalFrame>
        </div>
      </section>

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
