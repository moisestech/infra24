import type { Metadata } from 'next';
import Link from 'next/link';
import {
  SupportLayout,
  Section,
  PacketDownloadList,
  CtaBlock,
} from '@/components/marketing/cdc';
import { KnightPacketBanner } from '@/components/marketing/knight/KnightPacketBanner';
import { KnightSplitImageSection } from '@/components/marketing/knight/KnightSplitImageSection';
import { getCdcPageByPath } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  funderMaterialDownloadRows,
  knightFoundationLogoSrc,
  knightPacketPlaceholderImageAlts,
  knightPacketPlaceholderImages,
} from '@/lib/marketing/knight-packet';

const path = '/grants/materials';

export const metadata: Metadata = cdcPageMetadata(path);

export default function SupportMaterialsPage() {
  const def = getCdcPageByPath(path)!;

  return (
    <SupportLayout
      path={path}
      title={def.title}
      description={def.description}
      topSlot={<KnightPacketBanner />}
      heroEyebrow="Grants · Materials"
      heroTitleTone="knight"
      heroFoundationLogoSrc={knightFoundationLogoSrc}
      heroClassName="border-b border-neutral-200 dark:border-neutral-800"
    >
      <KnightSplitImageSection
        imageSide="trailing"
        sectionClassName="scroll-mt-28 border-y border-neutral-200/80 bg-gradient-to-b from-violet-50/40 via-white to-teal-50/30 dark:border-neutral-800 dark:from-violet-950/25 dark:via-neutral-950 dark:to-teal-950/20"
        imageSrc={knightPacketPlaceholderImages.identity}
        imageAlt={knightPacketPlaceholderImageAlts.identity}
        caption="DCC in context — visibility for grant review alongside the Knight pilot packet."
      >
        <div className="rounded-2xl border border-violet-200/60 bg-white/90 p-1 shadow-sm ring-1 ring-violet-100/80 dark:border-violet-800/50 dark:bg-neutral-900/90 dark:ring-violet-900/40">
          <div className="rounded-xl bg-gradient-to-r from-violet-600 via-teal-600 to-cyan-500 px-4 py-3 dark:from-violet-700 dark:via-teal-700 dark:to-cyan-700">
            <h2 className="text-base font-semibold tracking-tight text-white">Funder download list</h2>
            <p className="mt-1 max-w-xl text-sm text-white/90">
              Files are linked here as they are finalized. The same list appears on the pilot hub{' '}
              <Link
                href="/knight"
                className="font-medium text-white underline underline-offset-2 hover:text-white/95"
              >
                dcc.miami/knight
              </Link>{' '}
              with narrative, budget, and context links.
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <PacketDownloadList
              rows={funderMaterialDownloadRows}
              intro="For urgent grant deadlines, use the funder contact and we can send materials directly."
              layout="cards"
            />
          </div>
        </div>
      </KnightSplitImageSection>

      <div className="border-b border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="max-w-md text-xs leading-snug text-neutral-600 dark:text-neutral-400">
            Knight Cities Challenge — packet hub, budget model, and evidence on one route.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/knight"
              className="text-xs font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-teal-200"
            >
              Knight pilot packet →
            </Link>
            <Link
              href="/knight/budget"
              className="text-xs font-semibold text-neutral-900 underline-offset-4 hover:underline dark:text-teal-200"
            >
              Budget detail →
            </Link>
          </div>
        </div>
      </div>

      <Section
        id="contact-materials"
        backdropClassName="bg-[radial-gradient(ellipse_85%_55%_at_100%_0%,rgba(139,92,246,0.12),transparent_58%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_100%_0%,rgba(167,139,250,0.14),transparent_58%)]"
        className="border-b border-neutral-200/80 bg-[#fafafa] pb-16 dark:border-neutral-800 dark:bg-neutral-900/35"
      >
        <CtaBlock
          headline="Request materials by email"
          body="If something is not linked yet or you need a tailored packet for a deadline, reach through the funder contact—we respond as quickly as we can."
          primaryLabel="Open funder contact"
          primaryHref="/contact/funders"
          secondaryLabel="Knight pilot packet hub"
          secondaryHref="/knight"
          className="border-violet-200/70 bg-white/90 shadow-sm dark:border-violet-900/40 dark:bg-neutral-950/80"
        />
      </Section>
    </SupportLayout>
  );
}
