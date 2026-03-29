import type { Metadata } from 'next';
import { MarketingSection } from '@/components/marketing/MarketingSection';
import { CtaBand } from '@/components/marketing/CtaBand';

export const metadata: Metadata = {
  title: 'Pilots',
  description:
    'Contained pilots for smart signs, maps, event interfaces, portals, and update workflows—prove value before a full build.',
};

const examples = [
  'Smart sign pilot: one screen or zone tied to an authoritative update path',
  'Public wayfinding / map pilot: places and programs visitors actually need',
  'Event and program information pilot: one schedule feeding web and on-site views',
  'Artist or resident portal pilot: requirements and resources in one accountable place',
  'Update workflow pilot: handoffs between programming, communications, and operations',
];

export default function PilotsPage() {
  return (
    <>
      <MarketingSection className="border-b border-neutral-200 bg-white pb-12 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Pilots
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
          A pilot is a contained experiment: enough real usage to prove value, small enough to ship
          without reorganizing your entire operation. We use pilots when stakeholders need
          alignment, when uncertainty is high, or when multiple teams touch the same public
          information.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa]">
        <h2 className="text-xl font-semibold text-neutral-900">Examples</h2>
        <ul className="mt-4 space-y-3">
          {examples.map((ex) => (
            <li key={ex} className="text-sm leading-relaxed text-neutral-700">
              — {ex}
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection className="bg-white">
        <h2 className="text-xl font-semibold text-neutral-900">How a pilot is scoped</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          We agree on audience, surfaces, success signals, and what “done” means for a bounded
          period. If the pilot wins, we extend or harden. If not, you stop with a clear lesson—not a
          sunk multi-year program.
        </p>
      </MarketingSection>

      <MarketingSection className="bg-[#fafafa] pb-20">
        <CtaBand
          headline="Explore a pilot"
          body="Many teams start with an audit so the pilot is pointed at the right problem."
          primaryLabel="Book a pilot conversation"
          primaryHref="/contact?interest=pilot"
          secondaryLabel="Start with the audit"
          secondaryHref="/audit"
        />
      </MarketingSection>
    </>
  );
}
