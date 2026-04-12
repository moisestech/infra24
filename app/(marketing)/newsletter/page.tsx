import type { Metadata } from 'next';
import { PageHero, Section } from '@/components/marketing/cdc';
import { NewsletterPageForm } from '@/components/marketing/NewsletterPageForm';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';

const path = '/newsletter';

export const metadata: Metadata = cdcPageMetadata(path);

type Props = {
  searchParams: { email?: string };
};

export default function NewsletterPage({ searchParams }: Props) {
  const initialEmail = typeof searchParams.email === 'string' ? searchParams.email : '';

  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title="Stay in the loop"
        description="Occasional updates on Miami pilots, public programs, and journal posts—no spam."
        breadcrumbs={getCdcBreadcrumbs(path)}
      />
      <Section className="bg-[#fafafa] pb-16">
        <NewsletterPageForm initialEmail={initialEmail} />
      </Section>
    </>
  );
}
