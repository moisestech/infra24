import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  knightDriveFoundersCvsUrl,
  knightDriveRecommendationLetterUrl,
  knightFoundersHeroPhoto,
} from '@/lib/marketing/knight-people';

const path = '/knight/founders';

export const metadata: Metadata = cdcPageMetadata(path);

export default function KnightFoundersPage() {
  return (
    <>
      <PageHero
        eyebrow="Knight pilot packet"
        title="Founder bios"
        description="Portraits, recommendation letter, and CVs for the founding team behind DCC Miami and Infra24."
        breadcrumbs={getCdcBreadcrumbs(path)}
        className="border-b border-neutral-200 dark:border-neutral-800"
      />
      <Section className="bg-[#fafafa] dark:bg-neutral-900/35">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-neutral-200/90 shadow-md ring-1 ring-black/[0.04] dark:border-neutral-700 dark:ring-white/[0.06]">
          <div className="relative aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={knightFoundersHeroPhoto.src}
              alt={knightFoundersHeroPhoto.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </div>

        <div className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={knightDriveRecommendationLetterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            Recommendation letter (Rina Carvajal)
          </a>
          <a
            href={knightDriveFoundersCvsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            Founders’ CVs (Google Drive)
          </a>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
          Fabiola’s standalone CV file is still being finalized; the people row on the packet shows
          that link as soon when it is ready.
        </p>

        <ul className="mt-10 max-w-2xl list-disc space-y-2 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
          <li>Moises Sanabria — practice, infrastructure work, and Miami context.</li>
          <li>Fabiola Larios — practice, pedagogy, and public programs.</li>
          <li>Optional: advisors, fiscal sponsor context, or partner logos.</li>
        </ul>
        <p className="mt-10">
          <Link
            href="/knight"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            ← Back to Knight pilot packet
          </Link>
          {' · '}
          <Link
            href="/knight#people"
            className="text-sm font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            People and credentials
          </Link>
        </p>
      </Section>
    </>
  );
}
