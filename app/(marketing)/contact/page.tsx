import type { Metadata } from 'next';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import {
  ContactForm,
  type MarketingContactInterest,
} from '@/components/marketing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach Infra24 for an audit conversation, pilot discussion, or general consultation. Who should reach out and what happens next.',
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function interestFromSearchParams(
  raw: string | string[] | undefined
): MarketingContactInterest {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (
    v === 'audit' ||
    v === 'pilot' ||
    v === 'consultation' ||
    v === 'knight-pilot' ||
    v === 'knight-brief'
  ) {
    return v;
  }
  return 'consultation';
}

export default function MarketingContactPage({ searchParams }: PageProps) {
  const interest = interestFromSearchParams(searchParams.interest);

  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Talk with us
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Leadership and senior staff responsible for public information, visitor experience,
          programs, communications, operations, or digital—especially when work spans those groups.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Good fit</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>— Fragmented updates across web, screens, and maps</li>
              <li>— Need for clearer handoffs between teams</li>
              <li>— Appetite for an audit-led path or a scoped pilot</li>
            </ul>
            <h2 className="mt-8 text-lg font-semibold text-neutral-900">After you inquire</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              We reply with a short note, propose a conversation, and—if useful—recommend starting
              with the audit or a scoped pilot. There is no pressure for a full build on the first
              call.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900">Send a message</h2>
            <p className="mt-2 text-xs text-neutral-500">
              If email delivery is not configured, your client may open a draft to our team instead.
            </p>
            <div className="mt-6">
              <ContactForm defaultInterest={interest} />
            </div>
          </div>
        </div>
      </MarketingSection>
    </>
  );
}
