import type { Metadata } from 'next';
import { PageHero } from '@/components/marketing/cdc';
import { EraPill } from '@/components/era/EraPill';
import { JournalFrontDoor } from '@/components/dcc/culture/JournalFrontDoor';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import { JOURNAL_HERO_DESCRIPTION } from '@/lib/dcc/culture';

const path = '/journal';

export const metadata: Metadata = cdcPageMetadata(path);

export default function JournalIndexPage() {
  return (
    <>
      <div className="border-b border-neutral-200 bg-white pt-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EraPill />
        </div>
      </div>
      <PageHero
        eyebrow="Journal"
        title="Journal"
        description={JOURNAL_HERO_DESCRIPTION}
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <JournalFrontDoor />
    </>
  );
}
