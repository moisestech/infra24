import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/newsletter';

export const metadata: Metadata = cdcPageMetadata(path);

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Stay in the loop"
        description="Occasional updates on Miami pilots, public programs, and journal posts—no spam."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <p className="max-w-2xl text-sm text-neutral-600">
          Embed your mailing list provider here (Buttondown, Mailchimp, etc.).
        </p>
      </Section>
    </>
  );
}
